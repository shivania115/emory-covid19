import {
  Container,
  Grid,
  Rail,
  Ref,
  Sticky,
  Divider,
  Radio,
  Segment,
  Accordion,
  Icon,
  Header,
  Table,
  Menu,
  Tab,
  Progress,
  GridColumn,
} from "semantic-ui-react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Slider from "@mui/material/Slider";
import styled from "styled-components";
import DragScaleBar from "./DragScaleBar";
import React, {
  useEffect,
  useState,
  Component,
  createRef,
  useRef,
  useContext,
  useMemo,
} from "react";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSetState } from "react-use";
import ReactTooltip from "react-tooltip";
import { useCookie } from "react-use";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "75%",
  bgcolor: "background.paper",
  boxShadow: 24,
  overflowY: "scroll",
  p: 4,
};
const Fraction = ({ numerator, denominator }) => {
  const fractionStyle = {
    fontSize: "13px",
    color: "#333",
    position: "relative",
  };

  const lineStyle = {
    borderTop: "1px solid #333",
    width: "100%",
    position: "absolute",
    top: "50%",
    left: 0,
  };

  const numeratorStyle = {
    display: "block",
    width: "100%",
    textAlign: "center",
  };

  const denominatorStyle = {
    display: "block",
    width: "100%",
    textAlign: "center",
  };

  return (
    <div style={fractionStyle}>
      <span style={numeratorStyle}>{numerator}</span>
      <span style={lineStyle}></span>
      <span style={denominatorStyle}>{denominator}</span>
    </div>
  );
};

function DraggableBar(props) {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const [symptoms, setSymptoms] = useState(50);
  const [symptomsCOVID, setSymptomsCOVID] = useState(50);
  const [currentStep, setCurrentStep] = useState(1);
  const [symptomsVac, setSymptomsVac] = useState(50);
  const [hospilizationNoVac, sethospilizationNoVac] = useState(50);
  const [hospilizationVac, sethospilizationVac] = useState(50);
  const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);

  //ln 106 - 121 dummy cookie
  useEffect(() => {
    // Initialize dummy cookie
    const dummyBelief = {
      dummyKey: "dummyValue",
    };
    parseCookie(dummyBelief);
  }, []);

  function parseCookie(belief) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let cookie = cookies ? JSON.parse(cookies) : {}; // Add a check for existing cookies
    cookie = { ...cookie, ...belief };
    setCookie(cookie, { path: "/", expires: tomorrow });
  }
  // function parseCookie(belief) {
  //   var tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);

  //   let cookie = JSON.parse(cookies);
  //   cookie = { ...cookie, ...belief };
  //   setCookie(cookie, { path: "/", expires: tomorrow });
  // }

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  //edit the handle submit functino to add the info in cookie
  function handleSubmit() {
    const belief = {
      step3_elicit_symptomsVac: symptomsVac,
      step3_elicit_symptomsCOVID: symptomsCOVID,
      step3_elicit_hospilizationNoVac: hospilizationNoVac,
      step3_elicit_hospilizationVac: hospilizationVac,
    };

    props.sethospilizationNoVac(hospilizationNoVac);
    props.sethospilizationVac(hospilizationVac);
    props.setSymptomsCOVID(symptomsCOVID);
    props.setSymptomsVac(symptomsVac);
    // parseCookie(belief);
    setOpen(false);
  }
  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <Grid.Row>
            <ReactTooltip
              className="extraClass"
              sticky={true}
              place="right"
              effect="solid"
              delayHide={1000}
            />
            <Grid.Column width={6}>
              How many unvaccinated individuals out of 10,000 diagnosed with
              COVID-19 do you think require ICU-level care?
              <sup style={{ verticalAlign: "super", color: "#e02c2c" }}>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  data-tip="The bar goes from 0/10,000 to 100/10,00 because the maximum incidence rate observed is 100/10,000."
                />
              </sup>
              {/* <Header as="h4">
              <Header.Content style={{ color: "#e02c2c" }}>
               asdf
                
              </Header.Content>
            </Header> */}
            </Grid.Column>
            <Grid.Column width={8}>
              <DragScaleBar
                handleValue={(num) => setSymptomsCOVID(num)}
                active={false}
                initValue={symptomsCOVID}
                width={500}
                fillColor="#dc2c2c"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <span style={{ color: "#333" }}>
                  <Fraction numerator={0} denominator="10,000" />
                </span>
                <span style={{ color: "#333" }}>
                  <Fraction numerator={100} denominator="10,000" />
                </span>
              </div>
              <p style={{ textAlign: "center", paddingTop: 20 }}>
                Your Belief: {symptomsCOVID.toFixed(0)} individuals in 10,000
              </p>
            </Grid.Column>
          </Grid.Row>
        );
      case 2:
        return (
          <Grid.Row>
            <ReactTooltip
              className="extraClass"
              sticky={true}
              place="right"
              effect="solid"
              delayHide={1000}
            />
            <Grid.Column width={6}>
              How many fully vaccinated (with booster) individuals out of 10,000
              diagnosed with COVID-19 do you think require ICU-level care?
              <sup style={{ verticalAlign: "super", color: "#e02c2c" }}>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  data-tip="The bar goes from 0/10,000 to 100/10,00 because the maximum incidence rate observed is 100/10,000."
                />
              </sup>
            </Grid.Column>
            <Grid.Column width={8}>
              <DragScaleBar
                handleValue={(num) => setSymptomsVac(num)}
                initValue={symptomsVac}
                active={false}
                width={500}
                fillColor="#2285d0"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <span style={{ color: "#333" }}>
                  <Fraction numerator={0} denominator="10,000" />
                </span>
                <span style={{ color: "#333" }}>
                  <Fraction numerator={100} denominator="10,000" />
                </span>
              </div>
              <p style={{ textAlign: "center", paddingTop: 20 }}>
                Your Belief: {symptomsVac.toFixed(0)} individuals in 10,000
              </p>
            </Grid.Column>
          </Grid.Row>
        );
      case 3:
        return (
          <Grid.Row>
            <ReactTooltip
              className="extraClass"
              sticky={true}
              place="right"
              effect="solid"
              delayHide={1000}
            />
            <Grid.Column width={6}>
              How many unvaccinated individuals out of 10,000 diagnosed with
              COVID-19 do you think require hospitalization?
              <sup style={{ verticalAlign: "super", color: "#e02c2c" }}>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  data-tip="The bar goes from 0/10,000 to 100/10,00 because the maximum incidence rate observed is 100/10,000."
                />
              </sup>
            </Grid.Column>
            <Grid.Column width={8}>
              <DragScaleBar
                handleValue={(num) => sethospilizationNoVac(num)}
                initValue={hospilizationNoVac}
                active={false}
                width={500}
                fillColor="#dc2c2c"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <span style={{ color: "#333" }}>
                  <Fraction numerator={0} denominator="10,000" />
                </span>
                <span style={{ color: "#333" }}>
                  <Fraction numerator={100} denominator="10,000" />
                </span>
              </div>
              <p style={{ textAlign: "center", paddingTop: 20 }}>
                Your Belief: {hospilizationNoVac.toFixed(0)} individuals in
                10,000
              </p>
            </Grid.Column>
          </Grid.Row>
        );
      case 4:
        return (
          <Grid.Row>
            <ReactTooltip
              className="extraClass"
              sticky={true}
              place="right"
              effect="solid"
              delayHide={1000}
            />
            <Grid.Column width={6}>
              How many fully vaccinated (with booster) individuals out of 10,000
              diagnosed with COVID-19 do you think require hospitalization?
              <sup style={{ verticalAlign: "super", color: "#e02c2c" }}>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  data-tip="The bar goes from 0/10,000 to 100/10,00 because the maximum incidence rate observed is 100/10,000."
                />
              </sup>
            </Grid.Column>
            <Grid.Column width={8}>
              <DragScaleBar
                handleValue={(num) => sethospilizationVac(num)}
                initValue={hospilizationVac}
                active={false}
                width={500}
                fillColor="#2285d0"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <span style={{ color: "#333" }}>
                  <Fraction numerator={0} denominator="10,000" />
                </span>
                <span style={{ color: "#333" }}>
                  <Fraction numerator={100} denominator="10,000" />
                </span>
              </div>
              <p style={{ textAlign: "center", paddingTop: 20 }}>
                Your Belief: {hospilizationVac.toFixed(0)} individuals in 10,000
              </p>
            </Grid.Column>
          </Grid.Row>
        );
      default:
        return null;
    }
  };
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Header
          as="h1"
          style={{
            paddingTop: 20,
            fontWeight: 700,
            fontSize: "24pt",
            paddingBottom: 30,
          }}
        >
          <Header.Content>
            Let's start by understanding your thoughts!
            <Header.Subheader
              style={{
                paddingLeft: "0rem",
                paddingBottom: "0rem",
                lineHeight: "20pt",
                fontWeight: 400,
                fontSize: "10pt",
              }}
            >
              Drag the slider to indicate your belief
            </Header.Subheader>
          </Header.Content>
        </Header>
        {/* <StyledProgressBar progress='percent' percent={symptoms}></StyledProgressBar> */}
        <Grid style={{ paddingLeft: "2%", fontWeight: 600 }}>
          {renderQuestion()}
          <Grid.Row>
            <Grid.Column width={6}>
              {currentStep > 1 && (
                <Button
                  variant="contained"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
            </Grid.Column>
            <Grid.Column width={8}>
              {currentStep < 4 ? (
                <Button
                  variant="contained"
                  style={{ float: "right" }}
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  style={{ float: "right" }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Box>
    </Modal>
  );
}
export default DraggableBar;
