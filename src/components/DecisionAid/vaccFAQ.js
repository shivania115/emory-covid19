import {
  Container,
  Grid,
  Rail,
  Ref,
  Sticky,
  Divider,
  Accordion,
  Icon,
  Header,
  Table,
  Loader,
  Menu,
  Tab,
  Progress,
  GridColumn,
} from "semantic-ui-react";
import Covid from "../icons/Covid";
import Medicine from "../icons/Medicine";
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
import { ProgressBar } from "react-bootstrap";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { TRANSLATIONS_SPAN } from "./span/translation";
import { TRANSLATIONS_EN } from "./en/translation";
import snarkdown from "snarkdown";

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

function VaccFAQ(props) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState([-1]);
  const navigate = useNavigate();
  const [vaccineData, setVaccineData] = useState();
  useEffect(() => {
    fetch("/data/vaccineData.json")
      .then((res) => res.json())
      .then((x) => setVaccineData(x));
  }, []);
  console.log(vaccineData);
  if (vaccineData) {
    return (
      <div>
        <Grid style={{ width: "100%" }}>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header
                as="h2"
                style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
              >
                <Header.Content>{t('vaccination')}</Header.Content>

                <Grid.Row>
                  <Grid.Column style={{ width: 600, paddingTop: 18 }}>
                    <div style={{ width: 600 }}>

                      <Header>

                      <div>
                          <Header
                            style={{
                              fontSize: "18px",
                              fontFamily: "lato",
                              color: "#004071",
                              width: 975,
                            }}
                          >
                          <div style={{ whiteSpace: 'pre-line' }}>
                          {t('percentbar_h3')}
                          </div>
                            
                     
                            <Header.Content
                              style={{
                                paddingBottom: 5,
                                fontWeight: 300,
                                paddingTop: 0,
                                paddingLeft: 0,
                                fontSize: "15px",
                              }}
                            >
                             {t('percentbar_sub3')}
                            </Header.Content>
                          </Header>
                        </div>
                        <Header.Content
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                        >
                          <ProgressBar
                            style={{ height: 30, width: 600 }}
                            label={`${(100 - (vaccineData["_nation"]["PercentAdministeredPartial"] + vaccineData["_nation"]["Series_Complete_Pop_Pct"])).toFixed(1)}%`}
                            variant="success"
                            now={(
                              100-
                              (vaccineData["_nation"][
                                "PercentAdministeredPartial"
                              ] +
                              vaccineData["_nation"]["Series_Complete_Pop_Pct"])
                            ).toFixed(1)}
                          ></ProgressBar>
                        </Header.Content>
                        <div>
                          <Header
                            style={{
                              fontSize: "18px",
                              fontFamily: "lato",
                              color: "#004071",
                              width: 705,
                            }}
                          >
                            {t('percentbar_h1')}
                            <br />
                            <Header.Content
                              style={{
                                paddingBottom: 5,
                                fontWeight: 300,
                                paddingTop: 0,
                                paddingLeft: 0,
                                fontSize: "15px",
                              }}
                            >
                             {t('percentbar_sub1')}
                            </Header.Content>
                          </Header>
                        </div>
                        <Header.Content
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                        >
                          <ProgressBar
                            style={{ height: 30, width: 600, marginBottom: 30 }}
                            label={`${
                              vaccineData["_nation"][
                                "PercentAdministeredPartial"
                              ]
                                ? vaccineData["_nation"][
                                    "PercentAdministeredPartial"
                                  ].toFixed(1)
                                : "Not Reported"
                            }%`}
                            variant="success"
                            now={
                              vaccineData["_nation"][
                                "PercentAdministeredPartial"
                              ]
                                ? vaccineData["_nation"][
                                    "PercentAdministeredPartial"
                                  ].toFixed(1)
                                : "Not Reported"
                            }
                          ></ProgressBar>
                        </Header.Content>

                        <div>
                          <Header
                            style={{
                              fontSize: "18px",
                              fontFamily: "lato",
                              color: "#004071",
                              width: 975,
                            }}
                          >
                            {t('percentbar_h2')}
                            <br />
                            <Header.Content
                              style={{
                                paddingBottom: 5,
                                fontWeight: 300,
                                paddingTop: 0,
                                paddingLeft: 0,
                                fontSize: "15px",
                              }}
                            >
                              {t('percentbar_sub2')}
                            </Header.Content>
                          </Header>
                        </div>
                        <Header.Content
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                        >
                          <ProgressBar
                            style={{ height: 30, width: 600, marginBottom: 30 }}
                            label={`${vaccineData["_nation"][
                              "Series_Complete_Pop_Pct"
                            ].toFixed(1)}%`}
                            variant="success"
                            now={vaccineData["_nation"][
                              "Series_Complete_Pop_Pct"
                            ].toFixed(1)}
                          ></ProgressBar>
                        </Header.Content>

                       
                      </Header>
                    </div>
                  </Grid.Column>
                </Grid.Row>

                {/* <Grid.Row>
                    { (
                      <Accordion
                        id="race"
                        style={{
                          paddingTop: 0,
                          paddingLeft: 30,
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
                                  About the data
                                </u>
                              ),
                              icon: "dropdown",
                            },
                            content: {
                              content: (
                                <Header.Content
                                  style={{
                                    fontWeight: 300,
                                    paddingTop: 7,
                                    paddingLeft: 5,
                                    fontSize: "15px",
                                    width: 975,
                                  }}
                                >
                                  Data are from the{" "}
                                  <a
                                    href="https://covid.cdc.gov/covid-data-tracker/#vaccinations"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    CDC COVID Data Tracker
                                  </a>
                                  , data as of {vaccineDate} <br />
                                  <b>
                                    <em>
                                      {" "}
                                      {vaxVarMap["Doses_Distributed"].name}{" "}
                                    </em>
                                  </b>{" "}
                                  {vaxVarMap["Doses_Distributed"].definition}{" "}
                                  <br />
                                  <b>
                                    <em>
                                      {" "}
                                      {
                                        vaxVarMap["Doses_Administered"].name
                                      }{" "}
                                    </em>
                                  </b>{" "}
                                  {vaxVarMap["Doses_Administered"].definition}{" "}
                                  <br />
                                  <b>
                                    <em>
                                      {" "}
                                      {
                                        vaxVarMap["Administered_Dose1"].name
                                      }{" "}
                                    </em>
                                  </b>{" "}
                                  {vaxVarMap["Administered_Dose1"].definition}{" "}
                                  <br />
                                  <b>
                                    <em>
                                      {" "}
                                      {
                                        vaxVarMap["Series_Complete_Yes"].name
                                      }{" "}
                                    </em>
                                  </b>{" "}
                                  {vaxVarMap["Series_Complete_Yes"].definition}{" "}
                                  <br />
                                  <b><em> {vaxVarMap["percentVaccinatedDose1"].name} </em></b> {vaxVarMap["percentVaccinatedDose1"].definition} <br/>
                            <b><em> {vaxVarMap["Series_Complete_Pop_Pct"].name} </em></b> {vaxVarMap["Series_Complete_Pop_Pct"].definition} <br/>
                                </Header.Content>
                              ),
                            },
                          },
                        ]}
                      />
                    )}
                  </Grid.Row> */}
                <HeaderSubHeader
                  style={{
                    paddingTop: "2rem",
                    paddingBottom: "0rem",
                    lineHeight: "20pt",
                    fontSize: "1rem",
                    color: "black",
                  }}
                >
                  {t('step2_left1')}
                </HeaderSubHeader>
                <HeaderSubHeader
                  style={{
                    paddingTop: "2rem",
                    paddingBottom: "0rem",
                    lineHeight: "20pt",
                    fontSize: "1rem",
                    color: "black",
                  }}
                >
                {t('step2_left2')}
                </HeaderSubHeader>
                <HeaderSubHeader
                  style={{
                    paddingTop: "2rem",
                    paddingBottom: "0rem",
                    lineHeight: "20pt",
                    fontSize: "1rem",
                    color: "black",
                  }}
                >
                 {t('step2_left3')}
                </HeaderSubHeader>
              </Header>
              <ul>
                <li>Pfizer/BioNTech</li>
                <li>Moderna</li>
              </ul>
            </Grid.Column>
            <Grid.Column width={8}>
              <Accordion
                style={{ marginLeft: "4rem", marginTop: 30 }}
                fluid
                styled
                exclusive={false}
              >
                <Accordion.Title
                  id="develop"
                  style={{ fontSize: "15pt", color: "black" }}
                  // active={activeIndex === 0}
                  index={36}
                  onClick={() =>
                    activeIndex.indexOf(36) < 0
                      ? setActiveIndex((activeIndex) => [...activeIndex, 36])
                      : setActiveIndex((activeIndex) =>
                          activeIndex.filter((item) => item !== 36)
                        )
                  }
                >
                  <Icon name="dropdown" />
                  {t("step2_1")}
                </Accordion.Title>
                <Accordion.Content
                  style={{ fontSize: "14pt" }}
                  active={activeIndex.indexOf(36) > 0}
                >
                  <p>{t("step2_2")}</p>
                </Accordion.Content>
                <Accordion.Title
                  style={{ fontSize: "15pt", color: "black" }}
                  index={0}
                  onClick={() =>
                    activeIndex.indexOf(0) < 0
                      ? setActiveIndex((activeIndex) => [...activeIndex, 0])
                      : setActiveIndex((activeIndex) =>
                          activeIndex.filter((item) => item !== 0)
                        )
                  }
                >
                  <Icon name="dropdown" />

                  {t("step2_3")}
                </Accordion.Title>
                <Accordion.Content
                  style={{ fontSize: "14pt" }}
                  active={activeIndex.indexOf(0) > 0}
                >
                  <p style={{ marginBottom: 0 }}>
                    {t("step2_4")}
                    <ul>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_5")),
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_6")),
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_7")),
                        }}
                      ></li>
                    </ul>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: snarkdown(t("step2_8")),
                      }}
                    ></p>
                    <ul>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_9")),
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_10")),
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_11")),
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_12")),
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_13")),
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_14")),
                        }}
                      ></li>
                      <li
                        dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_15")),
                        }}
                      ></li>
                    </ul>
                    {t("step2_16")}
                  </p>
                  {/* <p
                    style={{
                      paddingTop: "1rem",
                      paddingLeft: "0rem",
                      paddingRight: "1rem",
                      marginBottom: 0,
                      fontWeight: 400,
                      fontSize: "14pt",
                      textAlign: "justify",
                    }}
                  >
                    The vaccines developed by
                    <a
                      style={{ color: "#397AB9" }}
                      href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/comirnaty-and-pfizer-biontech-covid-19-vaccine"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      Pfizer-BioNTech{" "}
                    </a>
                    and
                    <a
                      style={{ color: "#397AB9" }}
                      href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/spikevax-and-moderna-covid-19-vaccine"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      Moderna{" "}
                    </a>
                    have received full FDA approval for people aged 18 and
                    older. The vaccine developed by
                    <a
                      style={{ color: "#397AB9" }}
                      href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/janssen-covid-19-vaccine"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      Johnson & Johnson{" "}
                    </a>
                    is currently available under Emergency Use Authorization.
                  </p>
                  <p
                    style={{
                      paddingTop: "1rem",
                      paddingLeft: "0rem",
                      paddingRight: "1rem",
                      marginBottom: 0,
                      fontWeight: 400,
                      fontSize: "14pt",
                      textAlign: "justify",
                    }}
                  >
                    NOTE: Use of the Johnson & Johnson vaccine was temporarily
                    paused by the FDA and CDC “out of an abundance of caution”
                    on 13 April 2021. After a review of the evidence relating to
                    the safety of this vaccine on 23 April 2021, the Advisory
                    Committee on Immunization Practices concluded that the
                    vaccine was safe for use and that its benefits outweighed
                    any known or potential risks. The FDA and CDC ended{" "}
                    <a
                      style={{ color: "#397AB9" }}
                      href="https://www.cdc.gov/media/releases/2021/fda-cdc-lift-vaccine-use.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      the pause{" "}
                    </a>
                    and indicated that the Johnson & Johnson vaccine can again
                    be distributed.
                  </p> */}
                </Accordion.Content>

                <Accordion.Title
                  style={{ fontSize: "15pt", color: "black" }}
                  // active={activeIndex === 0}
                  index={12}
                  onClick={() =>
                    activeIndex.indexOf(12) < 0
                      ? setActiveIndex((activeIndex) => [...activeIndex, 12])
                      : setActiveIndex((activeIndex) =>
                          activeIndex.filter((item) => item !== 12)
                        )
                  }
                >
                  <Icon name="dropdown" />
                  {t("step2_17")}
                </Accordion.Title>
                <Accordion.Content
                  style={{ fontSize: "14pt" }}
                  active={activeIndex.indexOf(12) > 0}
                >
                  <p style={{ marginBottom: 0 }}>{t("step2_18")}</p>
                  <p
                    style={{
                      paddingTop: "1rem",
                      paddingLeft: "0rem",
                      paddingRight: "1rem",
                      marginBottom: "0",
                      fontWeight: 400,
                      fontSize: "14pt",
                      textAlign: "justify",
                    }}
                  >
                    {t("step2_19")}
                  </p>
                  <p
                    style={{
                      paddingTop: "1rem",
                      paddingLeft: "0rem",
                      paddingRight: "1rem",
                      marginBottom: "0",
                      fontWeight: 400,
                      fontSize: "14pt",
                      textAlign: "justify",
                    }}
                  >
                    {t("step2_20")}
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  style={{ fontSize: "15pt", color: "black" }}
                  // active={activeIndex === 0}
                  index={10}
                  onClick={() =>
                    activeIndex.indexOf(10) < 0
                      ? setActiveIndex((activeIndex) => [...activeIndex, 10])
                      : setActiveIndex((activeIndex) =>
                          activeIndex.filter((item) => item !== 10)
                        )
                  }
                >
                  <Icon name="dropdown" />
                  {t('step2_23q')}
                </Accordion.Title>
                <Accordion.Content
                  style={{ fontSize: "14pt" }}
                  active={activeIndex.indexOf(10) > 0}
                >
                  <p style={{ marginBottom: 0 }}>
                    {t('step2_23')}
                  </p>
                  <p
                   dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_24")),
                        }}
                    style={{
                      paddingTop: "1rem",
                      paddingLeft: "0rem",
                      paddingRight: "1rem",
                      marginBottom: "0",
                      fontWeight: 400,
                      fontSize: "14pt",
                      textAlign: "justify",
                    }}
                  >
               
                  </p>
                  <p
                   dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_25")),
                        }}
                    style={{
                      paddingTop: "1rem",
                      paddingLeft: "0rem",
                      paddingRight: "1rem",
                      marginBottom: "0",
                      fontWeight: 400,
                      fontSize: "14pt",
                      textAlign: "justify",
                    }}
                  >
               
                  </p>

                </Accordion.Content>
                <Accordion.Title
                  style={{
                    fontSize: "15pt",
                    color: "black",
                    lineHeight: "1.4",
                  }}
                  // active={activeIndex === 0}
                  index={49}
                  onClick={() =>
                    activeIndex.indexOf(49) < 0
                      ? setActiveIndex((activeIndex) => [...activeIndex, 49])
                      : setActiveIndex((activeIndex) =>
                          activeIndex.filter((item) => item !== 49)
                        )
                  }
                >
                  <Icon name="dropdown" />
                 {t('step2_26q')}
                </Accordion.Title>
                <Accordion.Content
                  style={{ fontSize: "14pt" }}
                  active={activeIndex.indexOf(49) > 0}
                >
                  {/* <p 
                   dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_26")),
                        }}>
                
                  </p> */}
                  <p  dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_27")),
                        }}>
               
                  </p>
                  <p  dangerouslySetInnerHTML={{
                          __html: snarkdown(t("step2_28")),
                        }}>
          
                  </p>
                </Accordion.Content>
                <Accordion.Title
                  style={{ fontSize: "15pt", color: "black" }}
                  // active={activeIndex === 0}
                  index={13}
                  onClick={() =>
                    activeIndex.indexOf(13) < 0
                      ? setActiveIndex((activeIndex) => [...activeIndex, 13])
                      : setActiveIndex((activeIndex) =>
                          activeIndex.filter((item) => item !== 13)
                        )
                  }
                >
                  <Icon name="dropdown" />
                  {t("step2_21")}
                </Accordion.Title>
                <Accordion.Content
                  style={{ fontSize: "14pt" }}
                  active={activeIndex.indexOf(13) > 0}
                >
                  <p>{t("step2_22")}</p>
                </Accordion.Content>
              </Accordion>
            </Grid.Column>
          </Grid.Row>
          {/* <Grid.Row>
                  <Grid.Column width={7}>
                      <Header
                          as="h2"
                          style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
                      >
                          <Header.Content>
                              COVID-19 vaccination
                          </Header.Content>
                          <HeaderSubHeader style={{
                              paddingTop: "2rem",
                              paddingBottom: "0rem",
                              lineHeight: "20pt",
                              fontSize: "1rem",
                              color: "black",
                          }}>
                             COVID-19 vaccines train our bodies to recognise and fight the virus. They do this by teaching our immune system to read the genetic code for an important part of the virus, called the spike protein. 
          
          Vaccination means you will be less likely to catch COVID-19 and pass it on to others. There is still a small chance that you will catch the virus, but if you do, your symptoms will usually be mild.
                          </HeaderSubHeader>
                      </Header>
                  </Grid.Column>
              </Grid.Row> */}
        </Grid>
        {props.elicit?
        <div>
          <button
          onClick={() => {
            navigate("/decision-aid_elicit/step1");
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
            navigate("/decision-aid_elicit/step3");
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
        : 
        <div>
        <button
          onClick={() => {
            navigate("/decision-aid/step1");
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
            navigate("/decision-aid/step3");
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
        </button></div>}
        
      </div>
    );
  } else {
    return <Loader active inline="centered" />;
  }
}
export default VaccFAQ;
