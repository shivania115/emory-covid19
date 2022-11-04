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

function DecitionTable() {
  const navigate = useNavigate();
  //info contains slider information
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();
  const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);
  function RadioTableFilled() {
    for (let i = 0; i < 5; i++) {
      if (!radioSelectedValue[i]) {
        return false;
      }
    }
    return true;
  }
  function parseCookie() {
    const age = AgeOptions[ageChecked];
    const gender = GenderOptions[genderChecked];
    const ethnicity = EthnicOptions[ethnicChecked];
    const occupation = OccupationOptions[occupationChecked];
    const vaccinated = VaccinateOptions[vaccinated];
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const cookie = {
      demographic: {
        vaccinated: vaccinated,
        age: age,
        gender: gender,
        ethnicity: ethnicity,
        occupation: occupation,
        vaccinated: vaccinated ? false : true,
        booster_taken: booster ? false : true,
      },
      vaccine_survey: {
        effective: radioSelectedValue[0],
        important: radioSelectedValue[1],
        negative_stories: radioSelectedValue[2],
        concerned_reactions: radioSelectedValue[3],
        childhood_vaccines: radioSelectedValue[4],
      },
    };
    setCookie(cookie, { path: "/", expires: tomorrow });
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
      !RadioTableFilled()
    ) {
      parseCookie();
      setShow(true);
      return;
    }
    parseCookie();
    return navigate("/decision-aid/step2");
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
  const VaccinateOptions = ["Yes", "No"];
  const BoosterOptions = ["Yes", "No"];
  const AgeOptions = ["18-29", "30-49", "50-69", "70+"];
  const GenderOptions = ["Woman", "Man", "Non-binary", "Rather not say"];
  const EthnicOptions = [
    "White/Caucasian",
    "Hispanic/Latino",
    "Black/African American",
    "Native American/American Indian",
    "Asian/Pacific Islander",
    "Other",
  ];
  const EducationOptions = [
    "Elementary",
    "High school degree or equivalent",
    "Some college",
    "Bachelor’s degree (e.g. BA, BS)",
    "Master’s degree (e.g. MA, MS, Med)",
    "Doctorate (e.g. PhD, EdD)",
    "Other",
  ];
  const OccupationOptions = [
    "Educator",
    "Business Professional",
    "Self-Employed",
    "Medical/Healthcare Professional",
    "Gvoernment/Civil Services",
    "Clerical/Secretary Support/Customer Service/Retail",
    "Technology/Engineering",
    "Transportation",
    "Full-Time Student",
    "Homemaker",
    "Retired",
    "Other/Not Listed",
  ];

  //which index is currently being checked
  const [ageChecked, setAgeChecked] = useState();
  const [genderChecked, setGenderChecked] = useState();
  const [ethnicChecked, setEthnicChecked] = useState();
  const [educationChecked, setEducationChecked] = useState();
  const [occupationChecked, setOccupationChecked] = useState();
  const [vaccinated, setVaccinated] = useState();
  const [booster, setBooster] = useState();
  const [show, setShow] = useState(false);

  const [radioSelectedValue, setRadioSelectedValue] = useState([]);
  return (
    <>
      <div
        style={{
          marginLeft: "10%",
          width: "85%",
          fontFamily: "lato",
          paddingBottom: "30px",
        }}
      >
        <Header
          as="h2"
          style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
        >
          <Header.Content>COVID-19 Vaccine Survey</Header.Content>
          <HeaderSubHeader>
            Toggle to tell us about your opinions on each statements.
          </HeaderSubHeader>
        </Header>
        <div className="checkbox" style={{ paddingTop: "20px" }}>
          <label>Are you Vaccinated?</label>
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
          <label>Have you received any COVID-19 booster vaccines?</label>
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
        <Divider></Divider>
        <table class="ui striped table">
          <thead style={{ textAlign: "center" }}>
            <tr>
              <th></th>
              <div>
                <th style={{ width: "20%" }}>Strongly Disagree</th>
                <th style={{ width: "20%" }}>Slightly Disagree</th>
                <th style={{ width: "20%" }}>Neither Agree nor Disagree</th>
                <th style={{ width: "20%" }}>Slightly Agree</th>
                <th style={{ width: "20%" }}> Strongly Agree</th>
              </div>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>COVID-19 vaccines are effective.</td>
              <td colspan="5">
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
              <td>
                Vaccines are important for the health of others in my community.
              </td>
              <td colspan="3">
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
              <td>
                I have heard negative stories that worry me about receiving the
                COVID-19 vaccine.
              </td>
              <td colspan="3">
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
              <td>
                I am concerned about serious reactions I may have after
                receiving the COVID-19 vaccine.
              </td>
              <td colspan="3">
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
              <td>I believe childhood vaccines are important and effective.</td>
              <td colspan="3">
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
          </tbody>
        </table>
        <Divider></Divider>
        <Form style={{ paddingBottom: 30 }}>
          <div className="checkbox">
            <label>Age group:</label>
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
            <label>Which best describes your gender?</label>
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
            <label>Which best describes your ethnic group?</label>
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
            <label>Which best describes your highest level of education?</label>
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
            <label>Which best describes your occupation?</label>
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
        </Form>
        <button
          onClick={handleSubmit}
          style={{
            float: "right",
            size: "5rem",
            marginTop: "1rem",
            marginBottom: "4rem",
          }}
          class="ui large primary button"
        >
          Next
        </button>
        <button
          onClick={() => navigate("/decision-aid/about")}
          style={{
            float: "left",
            size: "5rem",
            marginTop: "1rem",
            marginBottom: "4rem",
          }}
          class="ui large primary button"
        >
          Previous
        </button>
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
                fill-rule="evenodd"
                d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z"
              />
            </svg>
          </div>
        </Modal.Header>
        <Modal.Body>
          You didn't complete the survey. Are you sure you want to continue?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/decision-aid/step2")}
          >
            Continue to Next Section
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default DecitionTable;