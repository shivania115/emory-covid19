import {
  faExclamationTriangle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import React, { useEffect, useState } from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { useCookie } from "react-use";
import {
  Accordion,
  Grid,
  GridColumn,
  Header,
  Progress,
} from "semantic-ui-react";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import styled from "styled-components";
import Compare_mobile_pane from "./compare_mobile_pane";
import { TRANSLATIONS_EN } from "./en/translation";
import { TRANSLATIONS_SPAN } from "./span/translation";
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
function CompareNoElicit(props) {
  const navigate = useNavigate();
  const [vaccine, setVaccine] = useState("pfizer");
  const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);
  const [hospilizationVac, sethospilizationVac] = useState(0);
  const [hospilizationNoVac, sethospilizationNoVac] = useState(0);
  const [symptomsCOVID, setSymptomsCOVID] = useState(0);
  const [symptomsVac, setSymptomsVac] = useState(0);
  const cookie = JSON.parse(cookies);
  const { t } = useTranslation();
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
  const Panes = () => (
    <div class="ui bottom attached segment active tab" style={{}}>
      <Grid>
        <Grid.Row style={{ paddingTop: 20 }}>
          <GridColumn width={6}>
            {" "}
            {/* <MultipleChoice></MultipleChoice> */}
            <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
            >
              <Header.Content>{t("step3_risk")}</Header.Content>
            </Header>
          </GridColumn>
          <GridColumn width={3}>{t("step3_conditions")}</GridColumn>

          <GridColumn width={7}>{t("step3_number")}</GridColumn>
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
              <Header.Content>
                {t("step3_hospitalization")}
                <sup style={{ verticalAlign: "super" }}>
                  <FontAwesomeIcon
                    color="#ADD8E6"
                    size="xs"
                    icon={faInfoCircle}
                    data-html={true}
                    data-tip={`The data is taken from <a target='_blank' href="https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2796235#:~:text=Monthly%20hospitalization%20rates%20ranged%20from,eTable%207%20in%20the%20" target="_blank" rel="noopener noreferrer">JAMA Internal Medicine</a>, it displays the hospitalization rate of COVID-19 patients with vaccine and without vaccine.`}
                  />
                </sup>
              </Header.Content>
              <HeaderSubHeader>
                {
                  "Number of people hospitalized with Covid-19 in the United States since March 2020"
                }
              </HeaderSubHeader>
            </Header>
          </GridColumn>
          <GridColumn width={3}>
            <Header as="h4">
              <Header.Content>{t("step3_novac")}</Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "4%" }}>
              <Header.Content>{t("step3_vac")}</Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "4%" }}>
              <Header.Content>{t("step3_boost")}</Header.Content>
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
          <GridColumn width={2} style={{ whiteSpace: "nowrap" }}>
            <Header as="h4">
              <Header.Content style={{ color: "#e02c2c" }}>
                {t("t28")}
                <sup style={{ verticalAlign: "super" }}>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    data-tip="The ratio is out of 1,000."
                  />
                </sup>
              </Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "0%" }}>
              <Header.Content style={{ color: "#0E6EB8" }}>
                {t("t8")}
              </Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "0%" }}>
              <Header.Content style={{ color: "#0E6EB8" }}>
                {t("t7")}
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
              <Header.Content>
                {t("step3_ICU")}
                <sup style={{ verticalAlign: "super" }}>
                  <FontAwesomeIcon
                    color="#ADD8E6"
                    size="xs"
                    icon={faInfoCircle}
                    data-html={true}
                    data-tip={
                      'This data comes from <a href="https://pubmed-ncbi-nlm-nih-gov.proxy.library.emory.edu/35113851/" target="_blank" rel="noopener noreferrer" >Los Angeles County. (2022). COVID-19 hospitalization rates by vaccination status during Omicron variant predominance.</a> '
                    }
                  />
                </sup>
              </Header.Content>
              <HeaderSubHeader>{t("step3_number")}</HeaderSubHeader>
            </Header>
          </GridColumn>
          <GridColumn width={3}>
            <Header as="h4">
              <Header.Content>{t("step3_novac")}</Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "4%" }}>
              <Header.Content>{t("step3_vac")}</Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "4%" }}>
              <Header.Content>{t("step3_boost")}</Header.Content>
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
          <GridColumn width={2} style={{ whiteSpace: "nowrap" }}>
            <Header as="h4">
              <Header.Content
                style={{ color: "#e02c2c", whiteSpace: "nowrap" }}
              >
                {t("tt50")}
                <sup style={{ verticalAlign: "super" }}>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    data-tip="The ratio is out of 10,000 people."
                  />
                </sup>
              </Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "0%" }}>
              <Header.Content style={{ color: "#0E6EB8" }}>
                {t("tt12")}
              </Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "0%" }}>
              <Header.Content style={{ color: "#0E6EB8" }}>
                {t("tt8")}
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
              <Header.Content>{t("step3_long")}</Header.Content>
              <sup style={{ verticalAlign: "super" }}>
                <FontAwesomeIcon
                  color="#ADD8E6"
                  size="xs"
                  icon={faInfoCircle}
                  data-html={true}
                  data-tip={
                    "Some people who have been infected with the virus that causes COVID-19 can experience long-term effects from their infection, known as Post-COVID Conditions (PCC) or Long COVID. The data comes from a article that can be accessed through The article was published in  <a target='_blank' href='https://pubmed.ncbi.nlm.nih.gov/36231717/'> the International Journal of Environmental Research and Public Health</a>."
                  }
                />
              </sup>
              <HeaderSubHeader>{t("step3_number")}</HeaderSubHeader>
            </Header>
          </GridColumn>
          <GridColumn width={3}>
            <Header as="h4">
              <Header.Content>{t("step3_novac")}</Header.Content>
            </Header>

            <Header as="h4" style={{ marginTop: "4%" }}>
              <Header.Content>{t("step3_vac")}</Header.Content>
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
          <GridColumn width={2} style={{ whiteSpace: "nowrap" }}>
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
                {t("t242")}
                <sup style={{ verticalAlign: "super" }}>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    data-tip="The ratio is out of 1,000 people."
                  />
                </sup>
              </Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "0%" }}>
              <Header.Content style={{ color: "#0E6EB8" }}>
                {t("t145")}
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
              <Header.Content>
                {t("step3_death")}
                <ReactTooltip
                  className="extraClass"
                  sticky={true}
                  place="right"
                  effect="solid"
                  delayHide={1000}
                />
                <sup style={{ verticalAlign: "super" }}>
                  <FontAwesomeIcon
                    color="#ADD8E6"
                    size="xs"
                    icon={faInfoCircle}
                    data-html={true}
                    data-tip={
                      'This data comes from <a href="https://pubmed-ncbi-nlm-nih-gov.proxy.library.emory.edu/35113851/" target="_blank" rel="noopener noreferrer" >Los Angeles County. (2022). COVID-19 hospitalization rates by vaccination status during Omicron variant predominance.</a> '
                    }
                  />
                </sup>
              </Header.Content>
              <HeaderSubHeader>{t("step3_number")}</HeaderSubHeader>
            </Header>
          </GridColumn>
          <GridColumn width={3}>
            <Header as="h4">
              <Header.Content>{t("step3_novac")}</Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "4%" }}>
              <Header.Content>{t("step3_vac")}</Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "4%" }}>
              <Header.Content>{t("step3_boost")}</Header.Content>
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
          <GridColumn width={2} style={{ whiteSpace: "nowrap" }}>
            <Header as="h4">
              <Header.Content
                style={{ color: "#e02c2c", whiteSpace: "nowrap" }}
              >
                {t("tt30")}
                <sup style={{ verticalAlign: "super" }}>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    data-tip="The ratio is out of 10,000 people."
                  />
                </sup>
              </Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "0%" }}>
              <Header.Content style={{ color: "#0E6EB8" }}>
                {t("tt8")}
              </Header.Content>
            </Header>
            <Header as="h4" style={{ marginTop: "0%" }}>
              <Header.Content style={{ color: "#0E6EB8" }}>
                {t("tt7")}
              </Header.Content>
            </Header>
          </GridColumn>
        </Grid.Row>
      </Grid>

      <hr />
      <Grid style={{ paddingTop: 20 }}>
        <Grid.Row style={{ paddingTop: 0, marginBottom: 0, paddingBottom: 0 }}>
          <GridColumn width={6}>
            {" "}
            <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
            >
              <Header.Content>
                {t("step3_symptoms")}
                <sup style={{ verticalAlign: "super" }}>
                  <FontAwesomeIcon
                    color="#ADD8E6"
                    size="xs"
                    icon={faInfoCircle}
                    data-html={true}
                    data-tip={`Each of the trials were run in tandem timelines with different cohorts. The statistic represents the PREVALENCE rates of symptoms linked to COVID-19 run with clinical trial cohorts for each respective vaccines. 
                  <br></br>  <a target='_blank' href="https://www.nejm.org/doi/full/10.1056/nejmoa2002032">Link to data about COVID-19 symptoms.</a>
                  <br></br>  <a target='_blank' href="https://www.fda.gov/media/157233/download">Link to data about the Moderna Vaccine.</a>
                  <br></br>  <a target='_blank' href="https://www.fda.gov/media/153713/download">Link to data about the Pfizer Vaccine.</a>
                  `}
                  />
                </sup>
              </Header.Content>

              <HeaderSubHeader>{t("step3_number")}</HeaderSubHeader>
            </Header>
          </GridColumn>
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
                      {t("clicktoview")}
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
                            <Header.Content>{t("step3_fever")}</Header.Content>
                            <HeaderSubHeader>
                              {t("step3_number")}
                            </HeaderSubHeader>
                          </Header>
                        </GridColumn>
                        <GridColumn width={3}>
                          <Header as="h4">
                            <Header.Content>
                              {t("step3_withCOVID")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "4%" }}>
                            <Header.Content>
                              {t("step3_withPfizer")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "4%" }}>
                            <Header.Content>
                              {t("step3_withModerna")}
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
                        <GridColumn width={2} style={{ whiteSpace: "nowrap" }}>
                          <Header as="h4">
                            <Header.Content
                              style={{
                                marginTop: 0,
                                color: "#e02c2c",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {t("t562")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "0%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("t174")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "0%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("t158")}
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
                            <Header.Content>{t("step3_cough")}</Header.Content>
                            <HeaderSubHeader>
                              {t("step3_number")}
                            </HeaderSubHeader>
                          </Header>
                        </GridColumn>
                        <GridColumn width={3}>
                          <Header as="h4">
                            <Header.Content>
                              {t("step3_withCOVID")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "4%" }}>
                            <Header.Content>
                              {t("step3_withPfizer")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "4%" }}>
                            <Header.Content>
                              {t("step3_withModerna")}
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
                        <GridColumn width={2} style={{ whiteSpace: "nowrap" }}>
                          <Header as="h4">
                            <Header.Content
                              style={{ color: "#e02c2c", whiteSpace: "nowrap" }}
                            >
                              {t("t678")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "0%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("notreport")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "0%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("notreport")}
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
                              {t("step3_shortness")}
                            </Header.Content>
                            <HeaderSubHeader>
                              {t("step3_number")}
                            </HeaderSubHeader>
                          </Header>
                        </GridColumn>
                        <GridColumn width={3}>
                          <Header as="h4">
                            <Header.Content>
                              {t("step3_withCOVID")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "4%" }}>
                            <Header.Content>
                              {t("step3_withPfizer")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "4%" }}>
                            <Header.Content>
                              {t("step3_withModerna")}
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
                        <GridColumn width={2} style={{ whiteSpace: "nowrap" }}>
                          <Header as="h4">
                            <Header.Content
                              style={{ color: "#e02c2c", whiteSpace: "nowrap" }}
                            >
                              {t("t187")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "0%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("notreport")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "0%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("notreport")}
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
                              {t("step3_myalgia")}
                            </Header.Content>
                            <HeaderSubHeader>
                              {t("step3_number")}
                            </HeaderSubHeader>
                          </Header>
                        </GridColumn>
                        <GridColumn width={3}>
                          <Header as="h4" style={{ marginTop: "1%" }}>
                            <Header.Content>
                              {t("step3_withCOVID")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "8%" }}>
                            <Header.Content>
                              {t("step3_withPfizer")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "8%" }}>
                            <Header.Content>
                              {t("step3_withModerna")}
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
                        <GridColumn width={2} style={{ whiteSpace: "nowrap" }}>
                          <Header as="h4">
                            <Header.Content
                              style={{ color: "#e02c2c", whiteSpace: "nowrap" }}
                            >
                              {t("t149")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "4%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("t237")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "4%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("t213")}
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
                            <Header.Content>{t("step3_sore")}</Header.Content>
                            <HeaderSubHeader>
                              {t("step3_number")}
                            </HeaderSubHeader>
                          </Header>
                        </GridColumn>
                        <GridColumn width={3}>
                          <Header as="h4">
                            <Header.Content>
                              {t("step3_withCOVID")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "4%" }}>
                            <Header.Content>
                              {t("step3_withPfizer")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "4%" }}>
                            <Header.Content>
                              {t("step3_withModerna")}
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
                        <GridColumn width={2} style={{ whiteSpace: "nowrap" }}>
                          <Header as="h4">
                            <Header.Content
                              style={{
                                marginTop: "0%",
                                color: "#e02c2c",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {t("t139")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "0%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("notreport")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "0%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("notreport")}
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
                            <Header.Content>{t("step3_swell")}</Header.Content>
                            <HeaderSubHeader>
                              {t("step3_number")}
                            </HeaderSubHeader>
                          </Header>
                        </GridColumn>
                        <GridColumn width={3}>
                          <Header as="h4">
                            <Header.Content>
                              {t("step3_withCOVID")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "2%" }}>
                            <Header.Content>
                              {t("step3_withPfizer")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "2%" }}>
                            <Header.Content>
                              {t("step3_withModerna")}
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
                              {t("notapply")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "0%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("t85")}
                            </Header.Content>
                          </Header>
                          <Header as="h4" style={{ marginTop: "0%" }}>
                            <Header.Content style={{ color: "#0E6EB8" }}>
                              {t("t63")}
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
    </div>
  );

  // const [belief, setBelief] = useState();
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <div>
      <div class="ui two column centered grid">
        <div style={{}}>
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
              {t("step3_title")}
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
                {t("step3_subtitle")}
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
            }}
            defaultActiveIndex={1}
            panels={[
              {
                key: "acquire-dog",
                title: {
                  content: (
                    <>
                      <u
                        style={{
                          fontFamily: "lato",
                          fontSize: "1.5rem",
                        }}
                      >
                        {t("aboutVaccine")}
                      </u>
                      <br />
                      Click to read more about the vaccine
                    </>
                  ),
                  icon: "dropdown",
                },
                content: {
                  content: (
                    <ul style={{ textAlign: "left" }}>
                      <li>{t("step3_pfizer")}</li>
                      <pre />
                      <li>{t("step3_moderna")}</li>
                    </ul>
                  ),
                },
              },
            ]}
          />
          {/* <Header as="h4" style={{ fontWeight: 400 }}>
            <Header.Content>
              "Click to read more about the vaccine"
            </Header.Content>
          </Header> */}
          <pre></pre>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            style={{ color: "red" }}
          />
          <em>{t("step3_warning")}</em>
          <div class="ui attached tabular menu">
            {isMobileView ? <Compare_mobile_pane /> : <Panes />}
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
          {t("prev")}
        </button>
        <button
          onClick={() => {
            navigate("/decision-aid/step4");
          }}
          style={{ size: "5rem", marginTop: "1rem", marginBottom: "4rem" }}
          class="ui large primary button"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
export default CompareNoElicit;
