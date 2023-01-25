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
import { useCookie } from "react-use";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function DraggableBar(props) {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const [symptoms, setSymptoms] = useState(50);
  const [symptomsCOVID, setSymptomsCOVID] = useState(50);
  const [symptomsVac, setSymptomsVac] = useState(50);
  const [hospilizationNoVac, sethospilizationNoVac] = useState(50);
  const [hospilizationVac, sethospilizationVac] = useState(50);
  const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);
  function parseCookie(belief) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let cookie = JSON.parse(cookies);
    cookie["step3"] = belief;
    setCookie(cookie, { path: "/", expires: tomorrow });
  }

  //edit the handle submit functino to add the info in cookie
  function handleSubmit() {
    const belief = {
      symptomsVac: symptomsVac,
      symptomsCOVID: symptomsCOVID,
      hospilizationNoVac: hospilizationNoVac,
      hospilizationVac: hospilizationVac,
    };
    props.sethospilizationNoVac(hospilizationNoVac);
    props.sethospilizationVac(hospilizationVac);
    props.setSymptomsCOVID(symptomsCOVID);
    props.setSymptomsVac(symptomsVac);
    parseCookie(belief);
    setOpen(false);
  }
  console.log(symptoms);
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
            paddingTop: 30,
            fontWeight: 700,
            fontSize: "24pt",
            paddingBottom: 30,
          }}
        >
          <Header.Content>
            Tell us about your belief!
            {/* <Header.Subheader
                style={{
                  paddingTop: "1.5rem",
                  paddingLeft: "0rem",
                  paddingBottom: "0rem",
                  lineHeight: "20pt",
                  fontWeight: 400,
                  fontSize: "12pt",
                  color: "black",
                }}
              >
                This is a resource guide to answer common questions about the
                COVID-19 vaccines. This guide is based on the best available
                information as of {Date().slice(4, 10)}, 2021. Before taking the
                vaccine, please consult your healthcare provider. If you have
                any questions or concerns beyond those addressed here, we
                recommend the following resources for additional information:
            
              </Header.Subheader> */}
          </Header.Content>
        </Header>
        {/* <StyledProgressBar progress='percent' percent={symptoms}></StyledProgressBar> */}
        <Grid style={{ paddingLeft: "2%", fontWeight: 600 }}>
        <Grid.Row>
            <Grid.Column width={6}>
              What do you think is the percent of symptoms after a month for
              COVID-19?
            </Grid.Column>
            <Grid.Column width={8}>
              <DragScaleBar
                handleValue={(num) => setSymptomsCOVID(num)}
                initValue={50}
                width={500}
                fillColor="#dc2c2c"
              ></DragScaleBar>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              What do you think is the percent of symptoms after a month for
              vaccination(COVID-19)?
            </Grid.Column>
            <Grid.Column width={8}>
              <DragScaleBar
                handleValue={(num) => setSymptoms(num)}
                initValue={50}
                width={500}
                fillColor="#2285d0"
              ></DragScaleBar>
            </Grid.Column>
          </Grid.Row>
         
          <Grid.Row>
            <Grid.Column width={6}>
              What do you think is the hospilization rate of COVID-19 for people
              WITHOUT vaccination?
            </Grid.Column>
            <Grid.Column width={8}>
              <DragScaleBar
                handleValue={(num) => sethospilizationNoVac(num)}
                initValue={50}
                width={500}
                fillColor="#dc2c2c"
              ></DragScaleBar>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              What do you think is the hospilization rate of COVID-19 for people
              WITH vaccination?
            </Grid.Column>
            <Grid.Column width={8}>
              <DragScaleBar
                handleValue={(num) => sethospilizationVac(num)}
                initValue={50}
                width={500}
                fillColor="#2285d0"
              ></DragScaleBar>
            </Grid.Column>
          </Grid.Row>
          
        </Grid>

        <Typography
          id="modal-modal-description"
          style={{ marginTop: "5%", textAlign: "center", fontWeight: 600 }}
          sx={{ mt: 2 }}
        >
          Submit your response and let's see the real data.
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "15px",
            fontWeight: 600,
          }}
        >
          <Button onClick={handleSubmit} variant="outlined">
            Submit
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
export default DraggableBar;
