import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  PureComponent,
} from "react";
import {
  Breadcrumb,
  Dropdown,
  Header,
  Grid,
  Progress,
  Loader,
  Divider,
  Popup,
  Table,
  Button,
  Image,
  Rail,
  Sticky,
  Ref,
  Segment,
  Accordion,
  Icon,
  Menu,
  Message,
  Transition,
  List,
  HeaderContent,
  Responsive
} from "semantic-ui-react";
import AppBar from "./AppBar";
import ErrorBoundary from "react-error-boundary";
import Information from "./icons/Information";
import Covid from "./icons/Covid";
import Medicine from "./icons/Medicine";
import Children from "./icons/Children";
import Family from "./icons/Family";
import Decision from "./icons/Decision";

// import FileSaver from "file-saver";
// import { getPngData, useRechartToPng } from "recharts-to-png";
// import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';

import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  VictoryLegend,
  VictoryLine,
  VictoryScatter,
  VictoryLabel,
  VictoryTooltip,
  VictoryArea,
  VictoryContainer,
  VictoryVoronoiContainer,
} from "victory";
import { useParams, useNavigate } from "react-router-dom";
import Notes from "./Notes";
import _, { map } from "lodash";
import { scaleQuantile } from "d3-scale";
import configs from "./state_config.json";
// import ReactDOM from 'react-dom';
import fips2county from "./fips2county.json";
// import stateOptions from "./stateOptions.json";

import {
  var_option_mapping,
  CHED_static,
  CHED_series,
} from "../stitch/mongodb";
import { HEProvider, useHE } from "./HEProvider";
import { useStitchAuth } from "./StitchAuth";
import {
  LineChart,
  Line,
  Area,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  Cell,
  PieChart,
  Pie,
  LabelList,
  ReferenceArea,
  ReferenceLine,
} from "recharts";

import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBarMU from "@material-ui/core/AppBar";
import TabsMU from "@material-ui/core/Tabs";
import TabMU from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import StepFlow from "./DecisionAid/StepFlow";
import Compare from "./DecisionAid/compare";
import About from "./DecisionAid/about";
import LandingPage from "./DecisionAid/landingPage";
import PersonalRisk from "./DecisionAid/personalRisk";
import VaccFAQ from "./DecisionAid/vaccFAQ";
import DecisionTable from "./DecisionAid/decisionTable";
import FinalDecision from "./DecisionAid/finalDecision";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
function AppBar3(props){
  return(
    <ErrorBoundary>
  <Container>
      <Navbar expand="lg" variant="light" bg="light">
        <Container>
          <Navbar.Brand href="#">Navbar</Navbar.Brand>
        </Container>
      </Navbar>
    </Container>
    </ErrorBoundary>
  )
}
function AppBar2(props) {
  const navigate = useNavigate();
  console.log(props.menu);
  return (
    <ErrorBoundary>
      <Menu
        borderless
        doubling
        
        inverted
        fixed="top"
        style={{
          backgroundImage: 'url("/Emory_COVID_header_LightBlue.jpg")',
          backgroundSize: "cover",
          fontSize: "14pt",
          overflowX:"scroll"
        }}
      >
        <Container >
          <Responsive
            as={Menu.Item}
            header
            onClick={() => navigate("/")}
            style={{ paddingLeft: 0, paddingRight: "3%" }}
          >
            <span style={{ fontWeight: 400, color: "#fff", lineHeight: 1.3 }}>
              COVID-19 Health Equity
              <br />
              Interactive Dashboard
            </span>
          </Responsive>

 

          <Responsive
          as={Menu.Item}
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "about"}
            onClick={() => navigate("/decision-aid/about")}
            name="about"
          >
            <Header style={{ color: "#fff", fontWeight: 400 }}>
              <HeaderContent>Start:</HeaderContent>
              <HeaderSubHeader style={{ color: "#fff" }}>
                About this
                <br></br>
                decision aid
              </HeaderSubHeader>
            </Header>

          </Responsive>

          <Responsive
          as={Menu.Item}
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "step1"}
            // onClick={() => navigate("/decision-aid/step1")}
            name="step4"
          >

            <Header style={{ color: "#fff", fontWeight: 400 }}>
              <HeaderContent>STEP 1:</HeaderContent>
              <HeaderSubHeader style={{ color: "#fff" }}>
                Consider what matter
                <br></br>
                most for your family
              </HeaderSubHeader>
            </Header>
          </Responsive>

          <Responsive
          as={Menu.Item}
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "step2"}
            // onClick={() => navigate("/decision-aid/step2")}
            name="step2"
          >
            <Header style={{ color: "#fff", fontWeight: 400 }}>
              <HeaderContent>STEP 2:</HeaderContent>
              <HeaderSubHeader style={{ color: "#fff" }}>
                Learn about the virus
                <br></br>
                and the vaccines
              </HeaderSubHeader>
            </Header>

          </Responsive>

          <Responsive
          as={Menu.Item}
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "step3"}
            // onClick={() => navigate("/decision-aid/step3")}
            name="step3"
          >
            <Header style={{ color: "#fff", fontWeight: 400 }}>
              <HeaderContent>STEP 3:</HeaderContent>
              <HeaderSubHeader style={{ color: "#fff" }}>
                Compare the risks
                <br></br>
                and benefits
              </HeaderSubHeader>
            </Header>
          </Responsive>

          {/* <Responsive style = {{paddingLeft: 15, paddingRight: 15}}
            active={props.menu==='mapState'} 
            onClick={() => history.push('/map-state')}
            name='mapState'>
            Map State
          </Responsive> */}
          <Responsive
          as={Menu.Item}
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "step4"}
            // onClick={() => navigate("/decision-aid/step4")}
            name="step4"
          >
            <Header style={{ color: "#fff", fontWeight: 400 }}>
              <HeaderContent>STEP 4:</HeaderContent>
              <HeaderSubHeader style={{ color: "#fff" }}>
                Check your
                <br></br>
                personal risk profile
              </HeaderSubHeader>
            </Header>
          </Responsive>

          <Responsive
          as={Menu.Item}
            style={{ paddingLeft: 15, paddingRight: 55 }}
            active={props.menu === "step5"}
            // onClick={() => navigate("/decision-aid/step5")}
            name="step5"
          >
            <Header style={{ color: "#fff", fontWeight: 400 }}>
              <HeaderContent>STEP 5</HeaderContent>
              <HeaderSubHeader style={{ color: "#fff" }}>
                Make your
                <br></br>
                decision
              </HeaderSubHeader>
            </Header>
          </Responsive>

          <Menu.Menu position="right">
            <Responsive as={Menu.Item} header>
              <Image size="small" src="/logo_white.png" />
            </Responsive>
          </Menu.Menu>
        </Container>
      </Menu>
    </ErrorBoundary>
  );
}
const DecisionAid = (props) => {
  const navigate = useNavigate();
  let { step = "about" } = useParams();

  return (
    <HEProvider>
      <AppBar2 menu={step} />
      {/* <br style={{ height: "200px" }}></br> */}
      {/* <StepFlow /> */}
      <Container style={{ marginTop: "8em" }}>
        {step == "about" && <LandingPage />}
        {step == "step2" && <VaccFAQ />}
        {step == "step3" && <Compare />}
        {step == "step1" && <DecisionTable />}
        {step == "step4" && <PersonalRisk />}
        {step == "step5" && <FinalDecision />}
      </Container>
    </HEProvider>
  );
};
export default DecisionAid;
