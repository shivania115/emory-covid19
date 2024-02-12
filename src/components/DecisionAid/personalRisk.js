import {
  faArrowAltCircleLeft,
  faUserCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faExclamationCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import React, { useEffect, useState } from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Grid, Header } from "semantic-ui-react";
import { TRANSLATIONS_EN } from "./en/translation";
import { TRANSLATIONS_SPAN } from "./span/translation";
import { Box } from "@mui/material";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        translation: TRANSLATIONS_EN,
      },
      span: {
        translation: TRANSLATIONS_SPAN,
      },
    },
  });

function PersonalRisk(props) {
  // handle screen size change to conditionally render page
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // end of screen size monitor
  const navigate = useNavigate();
  const { t } = useTranslation();
  //Mobile View------------------------------------------------------------------------------------------------------------------------------------------------------
  if (isMobileView) {
    return (
      <div>
        <Grid>
          <Grid item xs={12}>
            <Header as="h3" style={{ paddingTop: 25, fontWeight: 800 }}>
              <Header.Content>
                Click on the drop down menus and links below to learn more about
                personal risks related to Covid-19.
              </Header.Content>
            </Header>
            <pre></pre>
          </Grid>
          {/* Icon & You may be at a higher risk of... */}
          <Grid item xs={12}>
            {" "}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Header
                  as="h3"
                  style={{
                    paddingTop: 30,
                    fontWeight: 1000,
                    fontSize: "1.7rem",
                  }}
                >
                  <Header.Content>
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      style={{
                        fontSize: "2rem",
                        marginRight: "10px",
                        color: "#024174",
                      }}
                    />
                    {t("step4_2header")}
                  </Header.Content>
                </Header>
              </AccordionSummary>
              <AccordionDetails>
                <ul
                  style={{
                    paddingBottom: "0rem",
                    lineHeight: "20pt",
                    fontSize: "1rem",
                    color: "black",
                  }}
                >
                  <li>{t("step4_11")}</li>
                  <li>{t("step4_12")}</li>
                  <li>{t("step4_13")}</li>
                  <li>{t("step4_14")}</li>
                  <li>{t("step4_15")}</li>
                  <li>{t("step4_16")}</li>
                  <li>{t("step4_17")}</li>
                  <li>{t("step4_18")}</li>
                  <li>{t("step4_19")}</li>
                </ul>
              </AccordionDetails>
            </Accordion>
            {/* </Grid.Column> */}
          </Grid>
          {/* Second icon & COVID-19 vaccination may not be ... */}
          <Grid item xs={12} style={{ marginTop: "30px" }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Header
                  as="h3"
                  style={{
                    paddingTop: 30,
                    fontWeight: 1000,
                    fontSize: "1.7rem",
                  }}
                >
                  <Header.Content>
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      style={{
                        fontSize: "2rem",
                        marginRight: "10px",
                        color: "#024174",
                      }}
                    />
                    {t("step4_3header")}
                  </Header.Content>
                </Header>
              </AccordionSummary>
              <AccordionDetails>
                <ul
                  style={{
                    paddingBottom: "0rem",
                    lineHeight: "20pt",
                    fontSize: "1rem",
                    color: "black",
                  }}
                >
                  <li>{t("step4_31")}</li>
                  <li>{t("step4_32")}</li>
                  <li>{t("step4_33")}</li>
                  <li>{t("step4_34")}</li>
                  <li>{t("step4_35")}</li>
                  <li>{t("step4_36")}</li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </Grid>
          {/* Warning below accordions */}
          <Grid xs={12}>
            <Grid.Column
              width={16}
              textAlign="center"
              style={{ marginTop: "20px" }}
            >
              <Header>
                <Header.Content>
                  This link below will open in a new window. Once you are done
                  reading, you can return to this page.
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>
          {/* third icon & calculate your personal... */}
          <Grid xs={12}>
            {/* <Grid.Column width={3}></Grid.Column>
            <Grid.Column width={3}>
              {" "}
              <FontAwesomeIcon
                icon={faUserCircle}
                style={{ fontSize: "7rem", marginTop: "10%", color: "#024174" }}
              />
            </Grid.Column> */}
            <Grid xs={12}>
              <Header
                as="h2"
                style={{ paddingTop: 10, fontWeight: 1000, fontSize: "1.5rem" }}
              >
                <Header.Content>
                  <a
                    target="_blank"
                    href="https://www.mdcalc.com/calc/10348/covid-risk"
                  >
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      style={{
                        fontSize: "2rem",
                        marginRight: "10px",
                        color: "#024174",
                      }}
                    />
                    {t("step4_1header")}{" "}
                    <FontAwesomeIcon
                      icon={faArrowAltCircleLeft}
                      style={{
                        fontSize: "2rem",
                        // marginTop: "3%",
                        color: "#024174",
                      }}
                    />
                  </a>
                </Header.Content>
              </Header>
            </Grid>
          </Grid>
        </Grid>
        {props.elicit ? (
          <div style={{ paddingTop: 30 }}>
            <button
              onClick={() => {
                navigate("/decision-aid_elicit/step3");
              }}
              style={{
                float: "left",
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              class="ui large primary button"
            >
              {t("prev")}
            </button>
            <button
              onClick={() => {
                navigate("/decision-aid_elicit/step5");
              }}
              style={{
                float: "right",
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              class="ui large primary button"
            >
              {t("next")}
            </button>
          </div>
        ) : (
          <div style={{ paddingTop: 30 }}>
            <button
              onClick={() => {
                navigate("/decision-aid/step3");
              }}
              style={{
                float: "left",
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              class="ui large primary button"
            >
              {t("prev")}
            </button>
            <button
              onClick={() => {
                navigate("/decision-aid/step5");
              }}
              style={{
                float: "right",
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              class="ui large primary button"
            >
              {t("next")}
            </button>
          </div>
        )}
      </div>
    );
  } else {
    //Desktop View------------------------------------------------------------------------------------------------------------------------
    return (
      <div>
        <Grid>
          <Grid item xs={12}>
            <Header as="h2" style={{ paddingTop: 25, fontWeight: 800 }}>
              <Header.Content>
                Click on the drop down menus and links below to learn more about
                personal risks related to Covid-19.
              </Header.Content>
            </Header>
            <pre></pre>
          </Grid>

          <Grid.Row>
            <Grid.Column width={3}></Grid.Column>
            <Grid.Column width={3}>
              <FontAwesomeIcon
                icon={faExclamationCircle}
                style={{ fontSize: "7rem", marginTop: "10%", color: "#024174" }}
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Header
                    as="h2"
                    style={{
                      paddingTop: 30,
                      fontWeight: 1000,
                      fontSize: "1.7rem",
                    }}
                  >
                    <Header.Content>{t("step4_2header")}</Header.Content>
                  </Header>
                </AccordionSummary>
                <AccordionDetails>
                  <ul
                    style={{
                      paddingBottom: "0rem",
                      lineHeight: "20pt",
                      fontSize: "1rem",
                      color: "black",
                    }}
                  >
                    <li>{t("step4_11")}</li>
                    <li>{t("step4_12")}</li>
                    <li>{t("step4_13")}</li>
                    <li>{t("step4_14")}</li>
                    <li>{t("step4_15")}</li>
                    <li>{t("step4_16")}</li>
                    <li>{t("step4_17")}</li>
                    <li>{t("step4_18")}</li>
                    <li>{t("step4_19")}</li>
                  </ul>
                </AccordionDetails>
              </Accordion>
              {/* <Header
                            as="h2"
                            style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
                        >
                            <Header.Content>
                            You may be at a higher risk of severe COVID-19 and its health problems if:
                            </Header.Content>
                            <HeaderSubHeader style={{
                                paddingBottom: "0rem",
                                lineHeight: "20pt",
                                fontSize: "1rem",
                                color: "black",
                            }}>
                            
                               <ul>
                                <li>
                                you are aged 70 years or older (noting that risk increases with age, even if you're under 70 years of age)
                                </li>
                                <li>
                                you have had an organ transplant and are on immune-suppressive therapy
                                </li>
                                <li>
                                you have had a bone marrow transplant in the last 24 months
                                </li>
                                <li>
                                you are having certain cancer treatments such as chemotherapy or radiotherapy
                                </li>
                                <li>
                                you have a long-term health problem such as chronic lung disease, kidney failure, liver disease, heart disease, diabetes or high blood pressure
                                </li>
                                <li>
                                you have challenges with your weight, such as obesity
                                </li>
                                <li>
                                you have a compromised immune system
                                </li>
                                <li>
                                you are pregnant
                                </li>
                                <li>
                                you have a disability that requires help with daily living activities.
                                </li>
                               </ul>
                            </HeaderSubHeader>
                        </Header> */}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}></Grid.Column>
            <Grid.Column width={3}>
              <FontAwesomeIcon
                icon={faTimesCircle}
                style={{ fontSize: "7rem", marginTop: "10%", color: "#024174" }}
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Header
                    as="h2"
                    style={{
                      paddingTop: 30,
                      fontWeight: 1000,
                      fontSize: "1.7rem",
                    }}
                  >
                    <Header.Content>{t("step4_3header")}</Header.Content>
                  </Header>
                </AccordionSummary>
                <AccordionDetails>
                  <ul
                    style={{
                      paddingBottom: "0rem",
                      lineHeight: "20pt",
                      fontSize: "1rem",
                      color: "black",
                    }}
                  >
                    <li>{t("step4_31")}</li>
                    <li>{t("step4_32")}</li>
                    <li>{t("step4_33")}</li>
                    <li>{t("step4_34")}</li>
                    <li>{t("step4_35")}</li>
                    <li>{t("step4_36")}</li>
                  </ul>
                </AccordionDetails>
              </Accordion>
              {/* <Header
                            as="h2"
                            style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
                        >
                            <Header.Content>
                            COVID-19 vaccination may not be recommended for you if:
                            </Header.Content>
                            <HeaderSubHeader style={{
                                paddingBottom: "0rem",
                                lineHeight: "20pt",
                                fontSize: "1rem",
                                color: "black",
                            }}>
                               <ul>
                                <li>
                                you have a past history of heparin-induced thrombocytopenia syndrome (HITS) or cerebral venous sinus thrombosis (CVST) (relevant for the AstraZeneca vaccine)
                                </li>
                                <li>
                                you have had a history of idiopathic splanchnic (mesenteric, portal, splenic) venous thrombosis (relevant for the AstraZeneca vaccine)
                                </li>
                                <li>
                                you have a history of inflammatory cardiac illness within the past three months (for the Pfizer and Moderna vaccines). People with these conditions can still receive a Pfizer or Moderna vaccine; however, your GP or cardiologist will recommend the best timing for vaccination
                                </li>
                              <li>
                              you have had a severe allergic reaction (anaphylaxis) to a previous dose or an ingredient
                              </li>
                              <li>
                              you have had any other serious adverse event attributed to a previous dose
                              </li>
                              <li>
                              you have had a current acute illness, including a fever.
                              </li>
                               </ul>
                            </HeaderSubHeader>
                        </Header> */}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              <Header>
                <Header.Content>
                  This link will open in a new window. Once you are done
                  reading, you can return to this page.
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}></Grid.Column>
            <Grid.Column width={3}>
              {" "}
              <FontAwesomeIcon
                icon={faUserCircle}
                style={{ fontSize: "7rem", marginTop: "10%", color: "#024174" }}
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Header
                as="h2"
                style={{ paddingTop: 30, fontWeight: 1000, fontSize: "1.7rem" }}
              >
                <Header.Content>
                  <a
                    target="_blank"
                    href="https://www.mdcalc.com/calc/10348/covid-risk"
                  >
                    {t("step4_1header")}{" "}
                    <FontAwesomeIcon
                      icon={faArrowAltCircleLeft}
                      style={{
                        fontSize: "2rem",
                        marginTop: "3%",
                        color: "#024174",
                      }}
                    />
                  </a>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>
          {/* <Grid.Row>
                    <Grid.Column width={3}></Grid.Column>
                    <Grid.Column width={3}>
                    <FontAwesomeIcon icon={faClock} style={{fontSize:"10rem",marginTop:"10%",color:  "#024174", 
            }}/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                    <Header
                            as="h2"
                            style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
                        >
                            <Header.Content>
                            Discuss the best timing of COVID-19 vaccination with your doctor if you:
                            </Header.Content>
                            <HeaderSubHeader style={{
                                paddingBottom: "0rem",
                                lineHeight: "20pt",
                                fontSize: "1rem",
                                color: "black",
                            }}>
                               <ul>
                                <li>
                                has current or recent (within past three months) inflammatory heart disease, acute heart failure or acute rheumatic heart disease
                                </li>
                                <li>
                                takes immunosuppressive medication
                                </li>
                                <li>
                                is acutely unwell (e.g. with a fever).
                                </li>
            
                               </ul>
                            </HeaderSubHeader>
                        </Header>
                    </Grid.Column>
                </Grid.Row> */}
        </Grid>
        {props.elicit ? (
          <div style={{ paddingTop: 30 }}>
            <button
              onClick={() => {
                navigate("/decision-aid_elicit/step3");
              }}
              style={{
                float: "left",
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              class="ui large primary button"
            >
              {t("prev")}
            </button>
            <button
              onClick={() => {
                navigate("/decision-aid_elicit/step5");
              }}
              style={{
                float: "right",
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              class="ui large primary button"
            >
              {t("next")}
            </button>
          </div>
        ) : (
          <div style={{ paddingTop: 30 }}>
            <button
              onClick={() => {
                navigate("/decision-aid/step3");
              }}
              style={{
                float: "left",
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              class="ui large primary button"
            >
              {t("prev")}
            </button>
            <button
              onClick={() => {
                navigate("/decision-aid/step5");
              }}
              style={{
                float: "right",
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              class="ui large primary button"
            >
              {t("next")}
            </button>
          </div>
        )}
      </div>
    );
  }
}
export default PersonalRisk;
