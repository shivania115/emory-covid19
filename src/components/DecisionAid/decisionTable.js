//Step 5: Background Survey
import {
  Container,
  Breadcrumb,
  Dropdown,
  Header,
  Grid,
  Progress,
  Loader,
  Popup,
  Table,
  Image,
  Rail,
  Sticky,
  Ref,
  Segment,
  Divider,
  Form,
  Accordion,
  Icon,
  Menu,
  Message,
  Transition,
  List,
  Checkbox,
} from "semantic-ui-react";
import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  PureComponent,
} from "react";
import Slider from "@mui/material/Slider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useStitchAuth } from "../StitchAuth";
import {
  var_option_mapping,
  decision_aid,
  CHED_static,
} from "../../stitch/mongodb";
import { useNavigate } from "react-router-dom";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClock,
  faQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
import { useCookie } from "react-use";
import "./DecisionAid.css";
import "toastify-js/src/toastify.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { TRANSLATIONS_SPAN } from "./span/translation";
import { TRANSLATIONS_EN } from "./en/translation";
import { Box } from "@mui/system";

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

function DecitionTable(props) {
  // handle screen size change to conditionally render page
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const conditionalWrapperStyle = isMobileView
    ? { fontFamily: "lato", paddingBottom: "30px" }
    : {
        marginLeft: "10%",
        width: "85%",
        fontFamily: "lato",
        paddingBottom: "30px",
      };
  const tableMargin = isMobileView
    ? { alignContent: "center", marginLeft: "-3vw" }
    : {};
  // end of screen size monitor
  const { t } = useTranslation();
  const navigate = useNavigate();
  //info contains slider information
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();
  const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);

  function RadioTableFilled() {
    for (let i = 0; i < 7; i++) {
      if (!radioSelectedValue[i]) {
        return false;
      }
    }
    return true;
  }

  function parseCookie() {
    let cookie = JSON.parse(cookies);
    const age = AgeOptions[ageChecked];
    const gender = GenderOptions[genderChecked];
    const ethnicity = EthnicOptions[ethnicChecked];
    const occupation = OccupationOptions[occupationChecked];
    const vaccinatedOption = VaccinateOptions[vaccinated];
    const informedOption = VaccinateOptions[informedChecked];
    const sources = selectedSources.map((index) => SourcesOptions[index]);

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    var timeNow = new Date();

    const step2_cookie = {
      step2_demograhpic_vaccinated: vaccinatedOption ? false : true,
      step2_demographic_booster_taken: booster ? false : true,
      step2_demographic_informed: informedOption,
      step2_demographic_age: age,
      step2_demographic_gender: gender,
      step2_demographic_ethnicity: ethnicity,
      step2_demographic_occupation: occupation,
      step2_survey_effective: radioSelectedValue[0],
      step2_survey_important: radioSelectedValue[1],
      step2_survey_negative_stories: radioSelectedValue[2],
      step2_survey_concerned_reactions: radioSelectedValue[3],
      step2_survey_childhood_vaccines: radioSelectedValue[4],
      step2_survey_trust: radioSelectedValue[5],
      step2_survey_online_tools: radioSelectedValue[6],
      step2_survey_source: sources,
      recordTime:
        timeNow.toLocaleDateString("en-us") +
        " " +
        timeNow.toLocaleTimeString("en-us"),
    };
    console.log(step2_cookie.recordTime);
    cookie = { ...cookie, ...step2_cookie };
    decision_aid.insertOne({ cookie });
  }

  function handleSubmit() {
    if (
      ageChecked === undefined ||
      genderChecked === undefined ||
      ethnicChecked === undefined ||
      educationChecked === undefined ||
      occupationChecked === undefined ||
      vaccinated === undefined ||
      booster === undefined ||
      informedChecked === undefined ||
      selectedSources == undefined ||
      !RadioTableFilled()
    ) {
      parseCookie();
      setShow(true);
      return;
    }
    parseCookie();
    // check cookies
    props.elicit
      ? navigate("/decision-aid_elicit/step6")
      : navigate("/decision-aid/step6");
    // return navigate("/decision-aid/step2");
  }

  function handleRadioChange(index, event) {
    setRadioSelectedValue((previousState) => {
      const radios = [...previousState];
      radios[index] = event.target.value;
      return radios;
    });
  }

  const options = [
    {
      label: "Checkbox Option 1",
      value: "1",
    },
    {
      label: "Checkbox Option 2",
      value: "2",
    },
  ];
  const VaccinateOptions = [t("yes"), t("no")];

  const BoosterOptions = [t("yes"), t("No")];
  const AgeOptions = ["18-29", "30-49", "50-69", "70+"];
  const GenderOptions = [t("female"), t("male"), t("non_binary"), t("not_say")];
  const EthnicOptions = [
    t("white"),
    t("hispanic"),
    t("black"),
    t("native"),
    t("asian"),
    t("other"),
  ];
  const EducationOptions = [
    t("elementary"),
    t("highschool"),
    t("college"),
    t("bachelor"),
    t("master"),
    t("doctor"),
    t("other"),
  ];
  const OccupationOptions = [
    t("educator"),
    t("business"),
    t("self_employed"),
    t("medical"),
    t("government"),
    t("customer"),
    t("technology"),
    t("transportation"),
    t("student"),
    t("home"),
    t("retired"),
    t("other"),
  ];
  const SourcesOptions = [
    "Healthcare professionals",
    "Government websites",
    "News media",
    "Social media",
    "Friends/family",
    "Other",
  ];

  //which index is currently being checked
  const [ageChecked, setAgeChecked] = useState();
  const [genderChecked, setGenderChecked] = useState();
  const [ethnicChecked, setEthnicChecked] = useState();
  const [educationChecked, setEducationChecked] = useState();
  const [occupationChecked, setOccupationChecked] = useState();
  const [vaccinated, setVaccinated] = useState();
  const [informedChecked, setInformedChecked] = useState();
  const [booster, setBooster] = useState();
  const [show, setShow] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);

  const [language, setLanguage] = useState("en");
  const [radioSelectedValue, setRadioSelectedValue] = useState([]);
  const handleCheckboxChange = (index) => {
    if (selectedSources.includes(index)) {
      setSelectedSources(selectedSources.filter((item) => item !== index));
    } else {
      setSelectedSources([...selectedSources, index]);
    }
  };
  return (
    <>
      <div style={conditionalWrapperStyle}>
        {/* <ToggleButtonGroup
        color='primary'
        value={i18n.language}
        size="small"
        exclusive
        onChange={(e,value)=>{
        i18n.changeLanguage(value)
        // console.log(value);
        // if(language!=value){
        //   i18n.changeLanguage(value);
        //   setLanguage(value);}
        }}
        aria-label="Platform"
        style={{paddingBottom:0,paddingTop:20}}
      >
        <ToggleButton style={{width:200,fontSize:'1.25rem'}}   value="en">English</ToggleButton>
        <ToggleButton style={{width:200,fontSize:'1.25rem'}} value="span">Spanish</ToggleButton>
      </ToggleButtonGroup> */}
        <Header as="h2" style={{ fontWeight: 1000, fontSize: "2rem" }}>
          <Header.Content>{t("survey")}</Header.Content>
          <HeaderSubHeader>{t("toggle")}</HeaderSubHeader>
        </Header>
        <div className="checkbox" style={{ paddingTop: "15px" }}>
          <label>{t("step1_ques1")} </label>
          {VaccinateOptions.map((option, index) => {
            return (
              <Checkbox
                onClick={(e) => {
                  setVaccinated(index);
                }}
                checked={vaccinated === index}
                style={{
                  fontSize: "1 rem",
                  display: "block",
                  marginTop: "10px",
                }}
                label={option}
              />
            );
          })}
        </div>
        <div className="checkbox">
          <label>{t("step1_ques2")}</label>
          {BoosterOptions.map((option, index) => {
            return (
              <Checkbox
                onClick={(e) => {
                  setBooster(index);
                }}
                checked={booster === index}
                style={{
                  fontSize: "1 rem",
                  display: "block",
                  marginTop: "10px",
                }}
                label={option}
              />
            );
          })}
        </div>
        <div className="checkbox" style={{ paddingTop: "15px" }}>
          <label>
            Have you received any information or education about COVID-19
            vaccines before this study?{" "}
          </label>
          {VaccinateOptions.map((option, index) => {
            return (
              <Checkbox
                onClick={(e) => {
                  setInformedChecked(index);
                }}
                checked={informedChecked === index}
                style={{
                  fontSize: "1 rem",
                  display: "block",
                  marginTop: "10px",
                }}
                label={option}
              />
            );
          })}
        </div>
        <Divider></Divider>
        {t("table_des")}
        <Box style={tableMargin}>
          <table className="ui striped table">
            <thead style={{ textAlign: "center" }}>
              <tr>
                <th></th>
                <div>
                  <th style={{ width: "20%" }}>{t("stronglydisagree")}</th>
                  <th style={{ width: "20%" }}>{t("slightlydisagree")}</th>
                  <th style={{ width: "20%" }}>{t("neither")}</th>
                  <th style={{ width: "20%" }}>{t("slightlyagree")}</th>
                  <th style={{ width: "20%" }}> {t("stronglyagree")}</th>
                </div>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t("table_ques1")}</td>
                <td colSpan="5">
                  {/* <Slider
                  defaultValue={50}
                  key={0}
                  aria-label="Default"
                  onChange={(event, value) => handleChange(0, value)}
                /> */}
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    row
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: "5%",
                      paddingRight: "5%",
                    }}
                  >
                    <Radio
                      checked={radioSelectedValue[0] === "Strongly Disagree"}
                      onChange={(e) => handleRadioChange(0, e)}
                      value="Strongly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[0] === "Slightly Disagree"}
                      onChange={(e) => handleRadioChange(0, e)}
                      value="Slightly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={
                        radioSelectedValue[0] === "Neither Agree nor Disagree"
                      }
                      onChange={(e) => handleRadioChange(0, e)}
                      value="Neither Agree nor Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[0] === "Slightly Agree"}
                      onChange={(e) => handleRadioChange(0, e)}
                      value="Slightly Agree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[0] === "Strongly Agree"}
                      onChange={(e) => handleRadioChange(0, e)}
                      value="Strongly Agree"
                      name="radio-buttons"
                    />
                  </RadioGroup>
                </td>
              </tr>
              <tr>
                <td>{t("table_ques2")}</td>
                <td colSpan="3">
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    row
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: "5%",
                      paddingRight: "5%",
                    }}
                  >
                    <Radio
                      checked={radioSelectedValue[1] === "Strongly Disagree"}
                      onChange={(e) => handleRadioChange(1, e)}
                      value="Strongly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[1] === "Slightly Disagree"}
                      onChange={(e) => handleRadioChange(1, e)}
                      value="Slightly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={
                        radioSelectedValue[1] === "Neither Agree nor Disagree"
                      }
                      onChange={(e) => handleRadioChange(1, e)}
                      value="Neither Agree nor Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[1] === "Slightly Agree"}
                      onChange={(e) => handleRadioChange(1, e)}
                      value="Slightly Agree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[1] === "Strongly Agree"}
                      onChange={(e) => handleRadioChange(1, e)}
                      value="Strongly Agree"
                      name="radio-buttons"
                    />
                  </RadioGroup>
                </td>
              </tr>
              <tr>
                <td>{t("table_ques3")}</td>
                <td colSpan="3">
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    row
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: "5%",
                      paddingRight: "5%",
                    }}
                  >
                    <Radio
                      checked={radioSelectedValue[2] === "Strongly Disagree"}
                      onChange={(e) => handleRadioChange(2, e)}
                      value="Strongly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[2] === "Slightly Disagree"}
                      onChange={(e) => handleRadioChange(2, e)}
                      value="Slightly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={
                        radioSelectedValue[2] === "Neither Agree nor Disagree"
                      }
                      onChange={(e) => handleRadioChange(2, e)}
                      value="Neither Agree nor Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[2] === "Slightly Agree"}
                      onChange={(e) => handleRadioChange(2, e)}
                      value="Slightly Agree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[2] === "Strongly Agree"}
                      onChange={(e) => handleRadioChange(2, e)}
                      value="Strongly Agree"
                      name="radio-buttons"
                    />
                  </RadioGroup>
                </td>
              </tr>
              <tr>
                <td>{t("table_ques4")}</td>
                <td colSpan="3">
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    row
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: "5%",
                      paddingRight: "5%",
                    }}
                  >
                    <Radio
                      checked={radioSelectedValue[3] === "Strongly Disagree"}
                      onChange={(e) => handleRadioChange(3, e)}
                      value="Strongly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[3] === "Slightly Disagree"}
                      onChange={(e) => handleRadioChange(3, e)}
                      value="Slightly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={
                        radioSelectedValue[3] === "Neither Agree nor Disagree"
                      }
                      onChange={(e) => handleRadioChange(3, e)}
                      value="Neither Agree nor Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[3] === "Slightly Agree"}
                      onChange={(e) => handleRadioChange(3, e)}
                      value="Slightly Agree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[3] === "Strongly Agree"}
                      onChange={(e) => handleRadioChange(3, e)}
                      value="Strongly Agree"
                      name="radio-buttons"
                    />
                  </RadioGroup>
                </td>
              </tr>
              <tr>
                <td>{t("table_ques5")}</td>
                <td colSpan="3">
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    row
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: "5%",
                      paddingRight: "5%",
                    }}
                  >
                    <Radio
                      checked={radioSelectedValue[4] === "Strongly Disagree"}
                      onChange={(e) => handleRadioChange(4, e)}
                      value="Strongly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[4] === "Slightly Disagree"}
                      onChange={(e) => handleRadioChange(4, e)}
                      value="Slightly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={
                        radioSelectedValue[4] === "Neither Agree nor Disagree"
                      }
                      onChange={(e) => handleRadioChange(4, e)}
                      value="Neither Agree nor Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[4] === "Slightly Agree"}
                      onChange={(e) => handleRadioChange(4, e)}
                      value="Slightly Agree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[4] === "Strongly Agree"}
                      onChange={(e) => handleRadioChange(4, e)}
                      value="Strongly Agree"
                      name="radio-buttons"
                    />
                  </RadioGroup>
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  I trust the information provided by healthcare authorities and
                  experts regarding COVID-19 vaccines
                </td>
                <td colSpan="3">
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    row
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: "5%",
                      paddingRight: "5%",
                    }}
                  >
                    <Radio
                      checked={radioSelectedValue[5] === "Strongly Disagree"}
                      onChange={(e) => handleRadioChange(5, e)}
                      value="Strongly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[5] === "Slightly Disagree"}
                      onChange={(e) => handleRadioChange(5, e)}
                      value="Slightly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={
                        radioSelectedValue[5] === "Neither Agree nor Disagree"
                      }
                      onChange={(e) => handleRadioChange(5, e)}
                      value="Neither Agree nor Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[5] === "Slightly Agree"}
                      onChange={(e) => handleRadioChange(5, e)}
                      value="Slightly Agree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[5] === "Strongly Agree"}
                      onChange={(e) => handleRadioChange(5, e)}
                      value="Strongly Agree"
                      name="radio-buttons"
                    />
                  </RadioGroup>
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  I am likely to use an online decision-aid tool to learn more
                  about the risks and potential benefits of COVID-19 vaccines
                </td>
                <td colSpan="3">
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    row
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: "5%",
                      paddingRight: "5%",
                    }}
                  >
                    <Radio
                      checked={radioSelectedValue[6] === "Strongly Disagree"}
                      onChange={(e) => handleRadioChange(6, e)}
                      value="Strongly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[6] === "Slightly Disagree"}
                      onChange={(e) => handleRadioChange(6, e)}
                      value="Slightly Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={
                        radioSelectedValue[6] === "Neither Agree nor Disagree"
                      }
                      onChange={(e) => handleRadioChange(6, e)}
                      value="Neither Agree nor Disagree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[6] === "Slightly Agree"}
                      onChange={(e) => handleRadioChange(6, e)}
                      value="Slightly Agree"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={radioSelectedValue[6] === "Strongly Agree"}
                      onChange={(e) => handleRadioChange(6, e)}
                      value="Strongly Agree"
                      name="radio-buttons"
                    />
                  </RadioGroup>
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
        <Divider></Divider>
        <Form style={{ paddingBottom: 30 }}>
          <div className="checkbox">
            <label>{t("step1_ques3")}</label>
            {AgeOptions.map((option, index) => {
              return (
                <Checkbox
                  onClick={(e) => {
                    setAgeChecked(index);
                  }}
                  checked={ageChecked === index}
                  style={{
                    fontSize: "1 rem",
                    display: "block",
                    marginTop: "10px",
                  }}
                  label={option}
                />
              );
            })}
          </div>
          <div className="checkbox">
            <label>{t("step1_ques4")}</label>
            {GenderOptions.map((option, index) => {
              return (
                <Checkbox
                  onClick={(e) => {
                    setGenderChecked(index);
                  }}
                  checked={genderChecked === index}
                  style={{
                    fontSize: "1 rem",
                    display: "block",
                    marginTop: "10px",
                  }}
                  label={option}
                />
              );
            })}
          </div>
          <div className="checkbox">
            <label>{t("step1_ques5")}</label>
            {EthnicOptions.map((option, index) => {
              return (
                <Checkbox
                  onClick={(e) => {
                    setEthnicChecked(index);
                  }}
                  checked={ethnicChecked === index}
                  style={{
                    fontSize: "1 rem",
                    display: "block",
                    marginTop: "10px",
                  }}
                  label={option}
                />
              );
            })}
          </div>
          <div className="checkbox">
            <label>{t("step1_ques6")}</label>
            {EducationOptions.map((option, index) => {
              return (
                <Checkbox
                  onClick={(e) => {
                    setEducationChecked(index);
                  }}
                  checked={educationChecked === index}
                  style={{
                    fontSize: "1 rem",
                    display: "block",
                    marginTop: "10px",
                  }}
                  label={option}
                />
              );
            })}
          </div>
          <div className="checkbox">
            <label>{t("step1_ques7")}</label>
            {OccupationOptions.map((option, index) => {
              return (
                <Checkbox
                  onClick={(e) => {
                    setOccupationChecked(index);
                  }}
                  checked={occupationChecked === index}
                  style={{
                    fontSize: "1 rem",
                    display: "block",
                    marginTop: "10px",
                  }}
                  label={option}
                />
              );
            })}
          </div>
          <div className="checkbox">
            <label>
              What are your main sources of information about COVID-19 and
              vaccines? (Select all that apply){" "}
            </label>
            {SourcesOptions.map((option, index) => {
              return (
                <Checkbox
                  key={index}
                  onClick={() => handleCheckboxChange(index)}
                  checked={selectedSources.includes(index)}
                  style={{
                    fontSize: "1rem",
                    display: "block",
                    marginTop: "10px",
                  }}
                  label={option}
                />
              );
            })}
          </div>
        </Form>
        {props.elicit ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => navigate("/decision-aid_elicit/about")}
              style={{
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              className="ui large primary button"
            >
              {t("prev")}
            </button>
            <button
              onClick={handleSubmit}
              style={{
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              className="ui large primary button"
            >
              {t("submit")}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => navigate("/decision-aid/about")}
              style={{
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              className="ui large primary button"
            >
              {t("prev")}
            </button>
            <button
              onClick={handleSubmit}
              style={{
                size: "5rem",
                marginTop: "1rem",
                marginBottom: "4rem",
              }}
              className="ui large primary button"
            >
              {t("submit")}
            </button>
          </div>
        )}
      </div>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
      >
        <Modal.Header style={{ display: "flex", justifyContent: "end" }}>
          <div
            onClick={() => {
              setShow(false);
            }}
          >
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#BEBEBE"
                fillRule="evenodd"
                d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z"
              />
            </svg>
          </div>
        </Modal.Header>
        <Modal.Body>Please finish the survey before moving on.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            {t("close")}
          </Button>
          {/* {props.elicit?
            <Button
            variant="primary"
            onClick={() => navigate("/decision-aid_elicit/step2")}
          >
            {t('continue')}
          </Button>:
          <Button
            variant="primary"
            onClick={() => navigate("/decision-aid/step2")}
          >
            {t('continue')}
          </Button>} */}
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default DecitionTable;
