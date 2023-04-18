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
import Covid from "../icons/Covid";
import { blue } from "@mui/material/colors";
import Medicine from "../icons/Medicine";
import styled from "styled-components";
import React, {
  useEffect,
  useState,
  Component,
  createRef,
  useRef,
  useContext,
  useMemo,
} from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { useNavigate } from "react-router-dom";
import MultipleChoice from "./multiplechoice.js";
import { useCookie } from "react-use";
import {ProgressBar} from 'react-bootstrap';
import i18n from "i18next";
import { initReactI18next,useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle,faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';
import { TRANSLATIONS_SPAN } from "./span/translation";
import { TRANSLATIONS_EN } from "./en/translation";
const colorPalette = [
  "#007dba",
  "#808080",
  "#a45791",
  "#008000",
  "#e8ab3b",
  "#000000",
  "#8f4814",
];
i18n
 .use(LanguageDetector)
 .use(initReactI18next)
 .init({
  fallbackLng: 'en',
   resources: {
     en: {
       translation: TRANSLATIONS_EN
     },
     span: {
       translation: TRANSLATIONS_SPAN
     }
   }
 });
function CompareNoElicit(props) {
  
  const navigate = useNavigate();
  const [vaccine, setVaccine] = useState("pfizer");
  const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);
  const [hospilizationVac,sethospilizationVac]=useState(0);
  const [hospilizationNoVac,sethospilizationNoVac]=useState(0);
  const [symptomsCOVID,setSymptomsCOVID]=useState(0);
  const [symptomsVac, setSymptomsVac]=useState(0);
  const cookie = JSON.parse(cookies);
  const { t } = useTranslation();
  // useEffect(() => {
  //   console.log(cookie.step3);
  //   cookie.step3?sethospilizationVac(cookie.step3.hospilizationVac):sethospilizationVac(10);
  //   cookie.step3?sethospilizationNoVac(cookie.step3.hospilizationNoVac):sethospilizationNoVac(10);
  //   console.log(hospilizationVac);
  // }, [cookies]);
  const handleClick = (e) => {
    e.stopPropagation(); // prevent the click event from bubbling up to the document
  };
  const StyledProgressBar = styled(Progress)`
    &&& .bar {
      ${
        "" /* background-color: ${props => props.color || 'green'} !important; */
      }
      min-width: 0;
    }
  `;
  const panes = [
    {
      menuItem: {},
      render: () => (
        <div
          class="ui bottom attached segment active tab"
          style={{ width: "100%" }}
        >
          <Grid>
            <Grid.Row style={{ paddingTop: 20 }}>
              <GridColumn width={6}>
                {" "}
                {/* <MultipleChoice></MultipleChoice> */}
                <Header
                  as="h4"
                  style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
                >
                  <Header.Content>HEALTH RISKS</Header.Content>
                </Header>
              </GridColumn>
              <GridColumn width={3}>CONDITIONS</GridColumn>

              <GridColumn width={7}>Numble of People</GridColumn>
            </Grid.Row>
          </Grid>
          <hr />
          <Grid style={{ paddingTop: 5, paddingBottom: 0, marginBottom: 0 }}>
            <Grid.Row style={{ paddingBottom: 0, marginBottom: 0 }}>
              <GridColumn width={6}>
                {" "}
                <Header
                  as="h4"
                  style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
                >
                  <Header.Content>HOSPITALIZATION with COVID-19
                  <sup style={{ verticalAlign: 'super' }}>
                  <FontAwesomeIcon color='#ADD8E6' size='xs' icon={faInfoCircle} data-html={true} data-tip={`The data is taken from <a  href="https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2796235#:~:text=Monthly%20hospitalization%20rates%20ranged%20from,eTable%207%20in%20the%20" target="_blank" rel="noopener noreferrer">JAMA Internal Medicine</a>, it displays the hospitalization rate of COVID-19 patients with vaccine and without vaccine.`} />
                  </sup>
                  </Header.Content>
                  <HeaderSubHeader>Number of People</HeaderSubHeader>       
                </Header>
              </GridColumn>
              <GridColumn width={3}>
                <Header as="h4">
                  <Header.Content>Unvaccinated</Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "4%" }}>
                  <Header.Content>Fully Vaccinated</Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "4%" }}>
                  <Header.Content>Fully Vaccinated with Booster</Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <StyledProgressBar
                  style={{ marginBottom: 20 }}
                  reverse
                  percent={28}
                  color="red"
                ></StyledProgressBar>
                <StyledProgressBar
                  style={{ marginBottom: 20 }}
                  percent={8}
                  color="blue"
                ></StyledProgressBar>
                <StyledProgressBar percent={7} color="blue"></StyledProgressBar>
              </GridColumn>
              <GridColumn width={2}>
                <Header as="h4">
                  <Header.Content style={{ color: "#e02c2c" }}>
                    28 in 1000
                    <sup style={{ verticalAlign: 'super' }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} data-tip="The ratio is out of 1000."  />
                    </sup>
                   
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "0%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                    8 in 1000
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "0%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                    7 in 1000
                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
            {/* <Grid.Row>
              <GridColumn width={4}></GridColumn>
              <GridColumn width={8}>
                <a href="https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2796235#:~:text=Monthly%20hospitalization%20rates%20ranged%20from,eTable%207%20in%20the%20">
                  Link Here.
                </a>
              
              </GridColumn>
            </Grid.Row> */}
          </Grid>
          <hr />
          <Grid style={{ paddingTop: 5 }}>
            <Grid.Row>
              <GridColumn width={6}>
                {" "}
                <Header
                  as="h4"
                  style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
                >
                  <Header.Content>ICU-LEVEL CARE
                  <sup style={{ verticalAlign: 'super' }}>
                  <FontAwesomeIcon color='#ADD8E6' size='xs' icon={faInfoCircle} data-html={true} data-tip={'This data comes from <a href="https://pubmed-ncbi-nlm-nih-gov.proxy.library.emory.edu/35113851/" target="_blank" rel="noopener noreferrer" >Los Angeles County. (2022). COVID-19 hospitalization rates by vaccination status during Omicron variant predominance.</a> '}/>
                  </sup>
                 
                  </Header.Content>
                  <HeaderSubHeader>Number of People</HeaderSubHeader>
                </Header>
              </GridColumn>
              <GridColumn width={3}>
                <Header as="h4">
                  <Header.Content>Unvaccinated</Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "4%" }}>
                  <Header.Content>Fully Vaccinated</Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "4%" }}>
                  <Header.Content>Fully Vaccinated with Booster</Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <StyledProgressBar
                  style={{ marginBottom: 20 }}
                  reverse
                  percent={50}
                  color="red"
                ></StyledProgressBar>
                <StyledProgressBar
                  style={{ marginBottom: 20 }}
                  percent={12}
                  color="blue"
                ></StyledProgressBar>
                <StyledProgressBar percent={8} color="blue"></StyledProgressBar>
              </GridColumn>
              <GridColumn width={2}>
                <Header as="h4">
                  <Header.Content style={{ color: "#e02c2c" }}>
                    50 in 10000
                    <sup style={{ verticalAlign: 'super' }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} data-tip="The ratio is out of 10000 people." />
                    </sup>
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "0%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                    12 in 10000
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "0%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                    8 in 10000
                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
          </Grid>
          <hr />
          <Grid style={{ paddingTop: 20 }}>
            <Grid.Row
              style={{ paddingTop: 0, marginBottom: 0, paddingBottom: 0 }}
            >
              <GridColumn width={6}>
                {" "}
                <Header
                  as="h4"
                  style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
                >
                  <Header.Content>SYMPTOMS
                  <sup style={{ verticalAlign: 'super' }}>
                  <FontAwesomeIcon color='#ADD8E6' size='xs' icon={faInfoCircle} data-html={true} data-tip={`Each of the trials were run in tandem timelines with different cohorts. The statistic represents the PREVALENCE rates of symptoms linked to COVID-19 run with clinical trial cohorts for each respective vaccines. 
                  <br></br>  <a href="https://www.nejm.org/doi/full/10.1056/nejmoa2002032">Link to data about COVID-19 symptoms.</a>
                  <br></br>  <a href="https://www.fda.gov/media/157233/download">Link to data about the Moderna Vaccine.</a>
                  <br></br>  <a href="https://www.fda.gov/media/153713/download">Link to data about the Pfizer Vaccine.</a>
                  `} />
                  </sup>
                  </Header.Content>
                  
                  <HeaderSubHeader>Number of People</HeaderSubHeader>
                </Header>
              </GridColumn>
              {/* <GridColumn width={3}>
                <Header as="h4">
                  <Header.Content>With COVID-19</Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "6%" }}>
                  <Header.Content>With Pfizer Vaccine</Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "6%" }}>
                  <Header.Content>With Moderna Vaccine</Header.Content>
                </Header>
              </GridColumn> */}

              {/* <GridColumn width={5}>
                <StyledProgressBar
                  style={{ marginBottom: 20 }}
                  reverse
                  percent={90}
                  color="red"
                ></StyledProgressBar>
                <StyledProgressBar
                  style={{ marginBottom: 20 }}
                  percent={56}
                  color="blue"
                ></StyledProgressBar>
                <StyledProgressBar
                  percent={38}
                  color="blue"
                ></StyledProgressBar>
              </GridColumn>
              <GridColumn width={2}>
                <Header as="h4">
                  <Header.Content style={{ color: "#e02c2c" }}>
                    90 in 100
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "6%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                    56 in 100
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "6%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                    38 in 100
                  </Header.Content>
                </Header>
              </GridColumn> */}
            </Grid.Row>

            <Grid.Row>
              <Accordion
                id="race"
                style={{
                  paddingTop: 0,
                  width: "100%",
                  paddingBottom: 15,
                }}
                defaultActiveIndex={1}
                panels={[
                  {
                    key: "acquire-dog",
                    title: {
                      content: (
                        <u
                          style={{
                            fontFamily: "lato",
                            fontSize: "15px",
                            color: "#397AB9",
                          }}
                        >
                          CLICK TO SEE INDIVIDUAL SYMPTOMS
                        </u>
                      ),
                      icon: "dropdown",
                    },
                    content: {
                      content: (
                        <Grid style={{ paddingTop: 0 }}>
                          <Grid.Row
                            style={{ paddingBottom: 0, marginBottom: "1%" }}
                          >
                            <GridColumn width={6}>
                              {" "}
                              <Header
                                as="h4"
                                style={{
                                  paddingTop: 10,
                                  fontWeight: 400,
                                  fontSize: "12pt",
                                }}
                              >
                                <Header.Content>fever</Header.Content>
                                <HeaderSubHeader>
                                  Number of People
                                </HeaderSubHeader>
                              </Header>
                            </GridColumn>
                            <GridColumn width={3}>
                              <Header as="h4">
                                <Header.Content>With COVID-19</Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "4%" }}>
                                <Header.Content>
                                  With Pfizer Vaccine
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "4%" }}>
                                <Header.Content>
                                  With Moderna Vaccine
                                </Header.Content>
                              </Header>
                            </GridColumn>

                            <GridColumn width={5}>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                reverse
                                percent={56.2}
                                color="red"
                              ></StyledProgressBar>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                percent={17.4}
                                color="blue"
                              ></StyledProgressBar>
                              <StyledProgressBar
                                percent={15.8}
                                color="blue"
                              ></StyledProgressBar>
                            </GridColumn>
                            <GridColumn width={2}>
                              <Header as="h4">
                                <Header.Content
                                  style={{ marginTop: 0, color: "#e02c2c" }}
                                >
                                  562 in 1000
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "0%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  174 in 1000
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "0%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  158 in 1000
                                </Header.Content>
                              </Header>
                            </GridColumn>
                          </Grid.Row>

                          <Grid.Row
                            style={{ paddingBottom: 0, marginBottom: "1%" }}
                          >
                            <GridColumn width={6}>
                              {" "}
                              <Header
                                as="h4"
                                style={{
                                  paddingTop: 10,
                                  fontWeight: 400,
                                  fontSize: "12pt",
                                }}
                              >
                                <Header.Content>
                                 cough
                                </Header.Content>
                                <HeaderSubHeader>
                                  Number of People
                                </HeaderSubHeader>
                              </Header>
                            </GridColumn>
                            <GridColumn width={3}>
                              <Header as="h4">
                                <Header.Content>With COVID-19</Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "4%" }}>
                                <Header.Content>
                                  With Pfizer Vaccine
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "4%" }}>
                                <Header.Content>
                                  With Moderna Vaccine
                                </Header.Content>
                              </Header>
                            </GridColumn>

                            <GridColumn width={5}>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                reverse
                                percent={67.8}
                                color="red"
                              ></StyledProgressBar>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                percent={0}
                                color="blue"
                              ></StyledProgressBar>
                              <StyledProgressBar
                                percent={0}
                                color="blue"
                              ></StyledProgressBar>
                            </GridColumn>
                            <GridColumn width={2}>
                              <Header as="h4">
                                <Header.Content style={{ color: "#e02c2c" }}>
                                  678 in 1000
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "0%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  Not Reported
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "0%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  Not Reported
                                </Header.Content>
                              </Header>
                            </GridColumn>
                          </Grid.Row>

                          <Grid.Row
                            style={{ paddingBottom: 0, marginBottom: "1%" }}
                          >
                            <GridColumn width={6}>
                              {" "}
                              <Header
                                as="h4"
                                style={{
                                  paddingTop: 10,
                                  fontWeight: 400,
                                  fontSize: "12pt",
                                }}
                              >
                                <Header.Content>
                                  shortness of breath
                                </Header.Content>
                                <HeaderSubHeader>
                                  Number of People
                                </HeaderSubHeader>
                              </Header>
                            </GridColumn>
                            <GridColumn width={3}>
                              <Header as="h4">
                                <Header.Content>With COVID-19</Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "4%" }}>
                                <Header.Content>
                                  With Pfizer Vaccine
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "4%" }}>
                                <Header.Content>
                                  With Moderna Vaccine
                                </Header.Content>
                              </Header>
                            </GridColumn>

                            <GridColumn width={5}>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                color="red"
                                percent={18.7}
                              ></StyledProgressBar>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                percent={0}
                                color="blue"
                              ></StyledProgressBar>
                              <StyledProgressBar
                                percent={0}
                                color="blue"
                              ></StyledProgressBar>
                            </GridColumn>
                            <GridColumn width={2}>
                              <Header as="h4">
                                <Header.Content style={{ color: "#e02c2c" }}>
                                  187 in 1000
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "0%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  Not Reported
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "0%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  Not Reported
                                </Header.Content>
                              </Header>
                             
                            </GridColumn>
                          </Grid.Row>
                          <Grid.Row
                            style={{ paddingBottom: 0, marginBottom: "1%" }}
                          >
                            <GridColumn width={6}>
                              {" "}
                              <Header
                                as="h4"
                                style={{
                                  paddingTop: 10,
                                  fontWeight: 400,
                                  fontSize: "12pt",
                                }}
                              >
                                <Header.Content>
                                  Myalgia (muscle or joint pain)
                                </Header.Content>
                                <HeaderSubHeader>
                                  Number of People
                                </HeaderSubHeader>
                              </Header>
                            </GridColumn>
                            <GridColumn width={3}>
                              <Header as="h4" style={{ marginTop: "1%" }}>
                                <Header.Content>With COVID-19</Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "8%" }}>
                                <Header.Content>
                                  With Pfizer Vaccine
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "8%" }}>
                                <Header.Content>
                                  With Moderna Vaccine
                                </Header.Content>
                              </Header>
                            </GridColumn>

                            <GridColumn width={5}>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                reverse
                                percent={14.9}
                                color="red"
                              ></StyledProgressBar>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                percent={23.7}
                                color="blue"
                              ></StyledProgressBar>
                              <StyledProgressBar
                                percent={21.3}
                                color="blue"
                              ></StyledProgressBar>
                            </GridColumn>
                            <GridColumn width={2}>
                              <Header as="h4">
                                <Header.Content style={{ color: "#e02c2c" }}>
                                  149 in 1000
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "4%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  237 in 1000
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "4%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  213 in 1000
                                </Header.Content>
                              </Header>
                            </GridColumn>
                          </Grid.Row>

                          <Grid.Row
                            style={{ paddingBottom: 0, marginBottom: "1%" }}
                          >
                            <GridColumn width={6}>
                              {" "}
                              <Header
                                as="h4"
                                style={{
                                  paddingTop: 10,
                                  fontWeight: 400,
                                  fontSize: "12pt",
                                }}
                              >
                                <Header.Content>sore throat</Header.Content>
                                <HeaderSubHeader>
                                  Number of People
                                </HeaderSubHeader>
                              </Header>
                            </GridColumn>
                            <GridColumn width={3}>
                              <Header as="h4">
                                <Header.Content>With COVID-19</Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "4%" }}>
                                <Header.Content>
                                  With Pfizer Vaccine
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "4%" }}>
                                <Header.Content>
                                  With Moderna Vaccine
                                </Header.Content>
                              </Header>
                            </GridColumn>

                            <GridColumn width={5}>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                color="red"
                                percent={13.9}
                              ></StyledProgressBar>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                percent={0}
                                color="blue"
                              ></StyledProgressBar>
                              <StyledProgressBar
                                percent={0}
                                color="blue"
                              ></StyledProgressBar>
                            </GridColumn>
                            <GridColumn width={2}>
                              <Header as="h4">
                                <Header.Content
                                  style={{ marginTop: "0%", color: "#e02c2c" }}
                                >
                                  139 in 1000
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "0%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  Not Reported
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "0%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  Not Reported
                                </Header.Content>
                              </Header>
                            </GridColumn>
                          </Grid.Row>
                          <Grid.Row
                            style={{ paddingBottom: 0, marginBottom: "1%" }}
                          >
                            <GridColumn width={6}>
                              {" "}
                              <Header
                                as="h5"
                                style={{
                                  paddingTop: 5,
                                  fontWeight: 400,
                                  fontSize: "12pt",
                                }}
                              >
                                <Header.Content>
                                  local swelling at the injection
                                  site
                                </Header.Content>
                                <HeaderSubHeader>
                                  Number of People
                                </HeaderSubHeader>
                              </Header>
                            </GridColumn>
                            <GridColumn width={3}>
                              <Header as="h4">
                                <Header.Content>With COVID-19</Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "2%" }}>
                                <Header.Content>
                                  With Pfizer Vaccine
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "2%" }}>
                                <Header.Content>
                                  With Moderna Vaccination
                                </Header.Content>
                              </Header>
                            </GridColumn>

                            <GridColumn width={5}>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                reverse
                                percent={0}
                                color="red"
                              ></StyledProgressBar>
                              <StyledProgressBar
                                style={{ marginBottom: 20 }}
                                percent={8.5}
                                color="blue"
                              ></StyledProgressBar>
                              <StyledProgressBar
                                percent={6.3}
                                color="blue"
                              ></StyledProgressBar>
                            </GridColumn>
                            <GridColumn width={2}>
                              <Header as="h4">
                                <Header.Content style={{ color: "#e02c2c" }}>
                                  not applicable
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "0%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  85 in 1000
                                </Header.Content>
                              </Header>
                              <Header as="h4" style={{ marginTop: "0%" }}>
                                <Header.Content style={{ color: "#0E6EB8" }}>
                                  63 in 1000
                                </Header.Content>
                              </Header>
                            </GridColumn>
                          </Grid.Row>
                        </Grid>
                      ),
                    },
                  },
                ]}
              />
            </Grid.Row>
          </Grid>
          <hr />

          <Grid style={{ paddingTop: 5 }}>
            <Grid.Row>
              <GridColumn width={6}>
                {" "}
                <Header
                  as="h4"
                  style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
                >
                  <Header.Content>Long-COVID</Header.Content>
                  <sup style={{ verticalAlign: 'super' }}>
                    <FontAwesomeIcon color='#ADD8E6' size='xs' icon={faInfoCircle} data-html={true} data-tip={"Some people who have been infected with the virus that causes COVID-19 can experience long-term effects from their infection, known as Post-COVID Conditions (PCC) or Long COVID. The data comes from a article that can be accessed through The article was published in the International Journal of Environmental Research and Public Health and can be accessed <a href='doi:10.3390/ijerph191912422.'>here</a>."} />
                    </sup>
                  <HeaderSubHeader>Number of People</HeaderSubHeader>
                </Header>
              </GridColumn>
              <GridColumn width={3}>
                <Header as="h4">
                  <Header.Content>Unvaccinated</Header.Content>
                </Header>
               
                <Header as="h4" style={{ marginTop: "4%" }}>
                  <Header.Content>Vaccinated</Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
              <StyledProgressBar
                  style={{ marginBottom: 20 }}
                  reverse
                  percent={24.2}
                  color="red"
                ></StyledProgressBar>
         
                <StyledProgressBar
                  percent={14.5}
                  style={{ marginBottom: 20 }}
                  color="blue"
                ></StyledProgressBar>
              
             
              </GridColumn>
              <GridColumn width={2}>
                {/* <Header as="h4">
                  <Header.Content style={{ color: "#e02c2c" }}>
                    20 in 100
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "0%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                    zero
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "0%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                    zero
                  </Header.Content>
                </Header> */}
             <Header as="h4">
                  <Header.Content style={{ color: "#e02c2c" }}>
                   242 in 1000
                    <sup style={{ verticalAlign: 'super' }}>
                  <FontAwesomeIcon icon={faExclamationTriangle} data-tip="The ratio is out of 1000 people." />
                  </sup>
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "0%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                  145 in 1000
                  </Header.Content>
                </Header>
              
              </GridColumn>
            </Grid.Row>
          </Grid>
          <hr />
          <Grid style={{ paddingTop: 5 }}>
            <Grid.Row>
              <GridColumn width={6}>
                {" "}
                <Header
                  as="h4"
                  style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
                >
                  <Header.Content>DEATH
                  <ReactTooltip className='extraClass'  sticky={true} place="right" effect="solid"  delayHide={1000}  />
                    <sup style={{ verticalAlign: 'super' }}>
                    <FontAwesomeIcon color='#ADD8E6' size='xs' icon={faInfoCircle} data-html={true} data-tip={'This data comes from <a href="https://pubmed-ncbi-nlm-nih-gov.proxy.library.emory.edu/35113851/" target="_blank" rel="noopener noreferrer" >Los Angeles County. (2022). COVID-19 hospitalization rates by vaccination status during Omicron variant predominance.</a> '}/>

                    </sup>
                  </Header.Content>
                  <HeaderSubHeader>Number of People</HeaderSubHeader>
                </Header>
              </GridColumn>
              <GridColumn width={3}>
                <Header as="h4">
                  <Header.Content>Unvaccinated</Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "4%" }}>
                  <Header.Content>Fully Vaccinated</Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "4%" }}>
                  <Header.Content>Fully Vaccinated with Booster</Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <StyledProgressBar
                  style={{ marginBottom: 20 }}
                  color="red"
                  percent={30}
                ></StyledProgressBar>
                <StyledProgressBar
                  style={{ marginBottom: 20 }}
                  percent={8}
                  color="blue"
                ></StyledProgressBar>
                <StyledProgressBar percent={7} color="blue"></StyledProgressBar>
              </GridColumn>
              <GridColumn width={2}>
                <Header as="h4">
                  <Header.Content style={{ color: "#e02c2c" }}>
                    30 in 10000
                    <sup style={{ verticalAlign: 'super' }}>
                  <FontAwesomeIcon icon={faExclamationTriangle} data-tip="The ratio is out of 10000 people." />
                  </sup>
                   
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "0%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                    8 in 10000
                  </Header.Content>
                </Header>
                <Header as="h4" style={{ marginTop: "0%" }}>
                  <Header.Content style={{ color: "#0E6EB8" }}>
                    7 in 10000
                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
          </Grid>

          <hr />
        </div>
      ),
    },
  ];
  // const [belief, setBelief] = useState();

  return (
    <div>
      <div class="ui two column centered grid">
        <div style={{ maxWidth: "100%" }}>
          {/* <DraggableBar 
          sethospilizationVac={sethospilizationVac}
          sethospilizationNoVac={sethospilizationNoVac}
          setSymptomsCOVID={setSymptomsCOVID}
          setSymptomsVac={setSymptomsVac}
            ></DraggableBar> */}
          <Header
            as="h1"
            style={{ paddingTop: 30, fontWeight: 400, fontSize: "24pt" }}
          >
            <Header.Content>
              {t('step3_title')}
              <Header.Subheader
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
                {t('step3_subtitle')}
                {/* {Date().slice(4,10)} */}
              </Header.Subheader>
            </Header.Content>
          </Header>
          {/* <ToggleButtonGroup
        color='primary'
        value={vaccine}
        size="large"
        exclusive
        onChange={(e,value)=>{vaccine!=value&&setVaccine(value)}}
        aria-label="Platform"
       style={{padding:10}}
      >
        <ToggleButton style={{width:200,fontSize:'1.25rem'}}   value="pfizer">Pfizer/BioNTech</ToggleButton>
        <ToggleButton style={{width:200,fontSize:'1.25rem'}} value="moderna">Moderna</ToggleButton>
      </ToggleButtonGroup> */}

          <Accordion
            id="race"
            style={{
              paddingTop: 0,
              paddingBottom: 15,
            }}
            defaultActiveIndex={1}
            panels={[
              {
                key: "acquire-dog",
                title: {
                  content: (
                    <u
                      style={{
                        fontFamily: "lato",
                        fontSize: "1.5rem",
                      }}
                    >
                      About the Vaccine
                    </u>
                  ),
                  icon: "dropdown",
                },
                content: {
                  content: (
                    <ul>
                      <li>
                        The vaccine made by Pfizer and BioNTech is known as
                        'Comirnaty', or BNT162b2, or most commonly as 'the
                        Pfizer vaccine'. It is an mRNA vaccine which means it
                        uses genetic code from a part of the virus to train your
                        immune system. The genetic code is quickly broken down
                        by the body and cleared away. You can not catch COVID-19
                        from Comirnaty (Pfizer). After the second dose,
                        Comirnaty (Pfizer) is around 90% effective against the
                        Delta variant in children.1-2 Effectiveness against
                        Omicron is still unknown but if you catches COVID-19
                        after you've been vaccinated, your illness will usually
                        be mild.
                      </li>
                      <li>
                        Spikevax is a vaccine developed by Moderna. It is also
                        known as 'the Moderna vaccine'. It is an mRNA vaccine
                        which means it uses genetic code from a part of the
                        virus to train your immune system. The genetic code is
                        quickly broken down by your body and cleared away. You
                        can not catch COVID-19 from Spikevax (Moderna). After
                        the second dose, Spikevax (Moderna) is about 94%
                        effective against COVID-19.1 It may be slightly less
                        effective against more recent variants, such as the
                        Delta variant, but it will still protect you against
                        serious illness and reduce your risk of hospitalisation
                        and death.
                      </li>
                    </ul>
                  ),
                },
              },
            ]}
          />

          <div class="ui attached tabular menu">
            <Tab style={{ width: "100%" }} panes={panes} renderActiveOnly />
          </div>
        </div>
      </div>
      <div
        style={{
          paddingTop: 30,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => {
            navigate("/decision-aid/step2");
          }}
          style={{ size: "5rem", marginTop: "1rem", marginBottom: "4rem" }}
          class="ui large primary button"
        >
          {t('prev')}
        </button>
        <button
          onClick={() => {
            navigate("/decision-aid/step4");
          }}
          style={{ size: "5rem", marginTop: "1rem", marginBottom: "4rem" }}
          class="ui large primary button"
        >
          {t('next')}
        </button>
      </div>
    </div>
  );
}
export default CompareNoElicit;