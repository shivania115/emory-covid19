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
  Button,
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
import Toastify from "toastify-js";
import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  PureComponent,
} from "react";
import Slider from "@mui/material/Slider";

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

function DecitionTable() {
  const navigate = useNavigate();
  //info contains slider information
  const [info, setInfo] = useState([50, 50, 50, 50, 50]);
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();
  const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);
  function handleSubmit() {
    // console.log(
    //   ageChecked === null ||
    //   genderChecked === null ||
    //   ethnicChecked === null ||
    //   educationChecked === null ||
    //   occupationChecked === null
    // );
    // if (
    //   ageChecked === null ||
    //   genderChecked === null ||
    //   ethnicChecked === null ||
    //   educationChecked === null ||
    //   occupationChecked === null
    // ) {
    //   Toastify({
    //     text: "Please fill out all fields before going to the next section",
    //     gravity: "bottom",
    //     backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    //     duration: -1,
    //   }).showToast();
    //   return;
    // }

    const age = AgeOptions[ageChecked];
    const gender = GenderOptions[genderChecked];
    const ethnicity = EthnicOptions[ethnicChecked];
    const occupation = OccupationOptions[occupationChecked];
    const vaccinated=VaccinateOptions[vaccinated];
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const cookie = {
      demographic: {
        vaccinated:vaccinated,
        age: age,
        gender: gender,
        ethnicity: ethnicity,
        occupation: occupation,
      },
      vaccine_survey: {
        effective: info[0],
        important: info[1],
        negative_stories: info[2],
        concerned_reactions: info[3],
        childhood_vaccines: info[4],
      },
    };
    setCookie(cookie, { path: "/", expires: tomorrow });
    return navigate("/decision-aid/step2");
  }
  function handleChange(index, value) {
    setInfo((previousState) => {
      const sliders = [...previousState];
      sliders[index] = value;
      return sliders;
    });
    // console.log(info);
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
const VaccinateOptions=['Yes','No'];
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
  ];

  //which index is currently being checked
  const [ageChecked, setAgeChecked] = useState();
  const [genderChecked, setGenderChecked] = useState();
  const [ethnicChecked, setEthnicChecked] = useState();
  const [educationChecked, setEducationChecked] = useState();
  const [occupationChecked, setOccupationChecked] = useState();
  const [vaccinated,setVaccinated]=useState();

  return (
    <div style={{ marginLeft: "10%", width: "85%" ,fontFamily: "lato",}}>
      <Divider></Divider>
      <div className="checkbox">
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
      <Header
        as="h2"
        style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
      >
        <Header.Content>COVID-19 Vaccine Survey</Header.Content>

        <HeaderSubHeader >
          Toggle to tell us about your opinions on each statements.
        </HeaderSubHeader>
      </Header>
   
      <table class="ui striped table">
        <thead>
          <tr>
            <th></th>
            <th>Strongly Disagree</th>
            <th>Neither Agree nor Disagree</th>
            <th>Strongly Agree</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>COVID-19 vaccines are effective.</td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={0}
                aria-label="Default"
                onChange={(event, value) => handleChange(0, value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              Vaccines are important for the health of others in my community.
            </td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={1}
                onChange={(event, value) => handleChange(1, value)}
                aria-label="Default"
              />
            </td>
          </tr>
          <tr>
            <td>
              I have heard negative stories that worry me about receiving the
              COVID-19 vaccine.
            </td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={2}
                onChange={(event, value) => handleChange(2, value)}
                aria-label="Default"
              />
            </td>
          </tr>
          <tr>
            <td>
              I am concerned about serious reactions I may have after receiving
              the COVID-19 vaccine.
            </td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={3}
                onChange={(event, value) => handleChange(3, value)}
                aria-label="Default"
              />
            </td>
          </tr>
          <tr>
            <td>I believe childhood vaccines are important and effective.</td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={4}
                onChange={(event, value) => handleChange(4, value)}
                aria-label="Default"
              />
            </td>
          </tr>
          {/* <tr>
            <td>
              If I get the COVID-19 vaccine I will be able to return to work.
            </td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={5}
                onChange={(event, value) => handleChange(5, value)}
                aria-label="Default"
              />
            </td>
          </tr>
          <tr>
            <td>
              If I get the COVID-19 vaccine I will be able to travel and move
              around my community more freely.
            </td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={6}
                onChange={(event, value) => handleChange(6, value)}
                aria-label="Default"
              />
            </td>
          </tr>
          <tr>
            <td>
              If I get the COVID-19 vaccine I won’t have to worry about being
              judged by my family or friends for not getting the vaccine.
            </td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={7}
                onChange={(event, value) => handleChange(7, value)}
                aria-label="Default"
              />
            </td>
          </tr>
          <tr>
            <td>
              If I get the COVID-19 vaccine I may experience side effects from
              the COVID-19 vaccine.
            </td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={8}
                onChange={(event, value) => handleChange(8, value)}
                aria-label="Default"
              />
            </td>
          </tr>
          <tr>
            <td>
              If I get the COVID-19 vaccine I may have to take time off work to
              get the vaccine or recover from side effects.
            </td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={9}
                onChange={(event, value) => handleChange(9, value)}
                aria-label="Default"
              />
            </td>
          </tr>
          <tr>
            <td>
              If I get the COVID-19 vaccine I will have to make the effort to
              find, book, and attend an appointment.
            </td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={10}
                onChange={(event, value) => handleChange(10, value)}
                aria-label="Default"
              />
            </td>
          </tr>
          <tr>
            <td>
              If I get the COVID-19 vaccine I will have to worry about being
              judged by my family or friends for getting the vaccine.
            </td>
            <td colspan="3">
              <Slider
                defaultValue={50}
                key={11}
                onChange={(event, value) => handleChange(11, value)}
                aria-label="Default"
              />
            </td>
          </tr> */}
        </tbody>
      </table>
      <Divider></Divider>
      <Form style={{paddingBottom: 30}}>
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
        style={{ float: "right", size:"5rem",marginTop: "1rem", marginBottom: "4rem" }}
        class="ui large primary button"
      >
        Next
      </button>
      <button
        onClick={()=>navigate("/decision-aid/about")}
        style={{ float: "left", size:"5rem",marginTop: "1rem", marginBottom: "4rem" }}
        class="ui large primary button"
      >
        Previous
      </button>
      
    </div>
  );
}
export default DecitionTable;
