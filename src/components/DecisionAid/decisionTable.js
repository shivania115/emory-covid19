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
  Checkbox
} from "semantic-ui-react";
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
import { Link } from "react-router-dom";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClock,
  faQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
import { useCookie } from "react-use";

function DecitionTable() {

  const [info, setInfo] = useState([0, 0, 0, 0, 0]);
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();
  const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);
  function handleSubmit() {
    // if (isLoggedIn == true) {
    // const k = decision_aid.find({all:'all'}).toArray();
    // console.log(k);
    // decision_aid.insertOne({ type: "slider", rating: info });

    // }
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCookie(info, { path: "/", expires: tomorrow });
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

  const AgeOptions = ['18-29', '30-49', '50-69', '70+'];
  const genderOptions = ['Female', 'Male', 'Non-binary', 'Rather not say'];
  const ethnicOptions = ['White/Caucasian', 'Hispanic/Latino', 'Black/African American', 'Native American/American Indian', 'Asian/Pacific Islander', 'Other'];
  const educationOptions = ['Elementary', 'High school degree or equivalent', 'Some college', 'Bachelor’s degree (e.g. BA, BS)', 'Master’s degree (e.g. MA, MS, Med)', 'Doctorate (e.g. PhD, EdD)', 'Other'];

  const handleChangeAgeChecked = (e, {value}) => {
    console.log(value);
    setAgeChecked(value);
  }
  //which index is currently being checked
  const[ ageChecked, setAgeChecked ] = useState();
  const[ genderChecked, setGenderChecked ] = useState();
  const[ ethnicChecked, setEthnicChecked ] = useState();
  const[ educationChecked, setEducationChecked ] = useState();

  return (
    <div style={{ marginLeft: "10%", width: "85%" }}>
    <Divider></Divider>
        <div>
        <label>Age group:</label>
        {AgeOptions.map((option, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setAgeChecked(index);
              }}
              checked={ageChecked === index}
              style={{
                fontSize: "1.25rem",
                display: "block",
                marginTop: "10px",
              }}
              label={option}
            />
          );
        })}
      </div>
      <div>
        <label>Which best describes your gender?</label>
        {genderOptions.map((option, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setGenderChecked(index);
              }}
              checked={genderChecked === index}
              style={{
                fontSize: "1.25rem",
                display: "block",
                marginTop: "10px",
              }}
              label={option}
            />
          );
        })}
      </div>
      <div>
        <label>Which best describes your ethnic group?</label>
        {ethnicOptions.map((option, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setGenderChecked(index);
              }}
              checked={ethnicChecked === index}
              style={{
                fontSize: "1.25rem",
                display: "block",
                marginTop: "10px",
              }}
              label={option}
            />
          );
        })}
      </div>
      
      {/* <Form size='large'>
      <Form.Group unstackable widths={3}>
        <Form.Group grouped  >
      <label>Age group:</label>
      <Form.Input
        label='18-29'
        control='input'
        type='checkbox'
        name='htmlRadios'
        value = '1'
        checked = {ageChecked === '1'}
        onChange = {handleChangeAgeChecked}
      />
      <Form.Field
        label='30-49'
        control='input'
        type='checkbox'
        name='htmlRadios'
        value = '2'
        checked = {ageChecked === '2'}
        onChange = {(e, {value}) => {setAgeChecked(value)} }
      />
      <Form.Field
        label='50-69'
        control='input'
        type='checkbox'
        name='htmlRadios'
        value = '3'
        checked = {ageChecked === '3'}
        onChange = {(e, value) => {setAgeChecked(value)} }
      />
      <Form.Field
        label='70+'
        control='input'
        type='checkbox'
        name='htmlRadios'
        value = '4'
        checked = {ageChecked === '4'}
        onChange = {(e, value) => {setAgeChecked(value)} }
      />
    </Form.Group>
    <Form.Group style={{marginRight:30}} grouped>
      <label>Which best describes your gender?</label>
      <Form.Field
        label='Female'
        control='input'
        type='checkbox'
        name='htmlRadios'
        value = '1'
        checked = {genderChecked === '1'}
        onChange = {(e, value) => {setGenderChecked(value)} }
      />
      <Form.Field
        label='Male'
        control='input'
        type='checkbox'
        name='htmlRadios'
        value = '2'
        checked = {genderChecked === '2'}
        onChange = {(e, value) => {setGenderChecked(value)} }
      />
       <Form.Field
        label='Non-binary'
        control='input'
        type='checkbox'
        name='htmlRadios'
        value = '3'
        checked = {genderChecked === '3'}
        onChange = {(e, value) => {setGenderChecked(value)} }
      />
       <Form.Field
        label='Rather not say'
        control='input'
        type='checkbox'
        name='htmlRadios'
        value = '4'
        checked = {genderChecked === '4'}
        onChange = {(e, value) => {setGenderChecked(value)} }
      />
    </Form.Group>
    <Form.Group grouped>
      <label>Which best describes your ethnic group?</label>
      <Form.Field
        label='White/Caucasian'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
      <Form.Field
        label='Hispanic/Latino'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
        <Form.Field
        label='Black/African American'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
      <Form.Field
        label='Native American/American Indian'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
        <Form.Field
        label='Asian/Pacific Islander'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
      <Form.Field
        label='Other'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
    </Form.Group>
    </Form.Group>
    <Form.Group unstackable widths={2}>
    <Form.Group style={{marginRight:40}} grouped>
      <label>Which best describes your highest level of education?</label>
      <Form.Field
        label='Elementary'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
      <Form.Field
        label='High school degree or equivalent'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
        <Form.Field
        label='Some college'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
        <Form.Field
        label='Bachelor’s degree (e.g. BA, BS)'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
        <Form.Field
        label='Master’s degree (e.g. MA, MS, Med)'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
        <Form.Field
        label='Doctorate (e.g. PhD, EdD)'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
      <Form.Field
        label='Other'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
    </Form.Group>

    <Form.Group style={{marginRight:20}} grouped>
      <label>Which best describes your occupation?</label>
      <Form.Field
        label='Educator'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
      <Form.Field
        label='Business Professional'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
       <Form.Field
        label='Self-Employed'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
      <Form.Field
        label='Medical/Healthcare Professional'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
       <Form.Field
        label='Government/Civil Services'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
      <Form.Field
        label='Clerical/Secretary Support/Customer Service/Retail'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
       <Form.Field
        label='Technology/Engineering'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
      <Form.Field
        label='Transportation'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
         <Form.Field
        label='Full-Time Student'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
       <Form.Field
        label='Homemaker'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
      <Form.Field
        label='Retired'
        control='input'
        type='checkbox'
        name='htmlRadios'
      />
    </Form.Group>
    </Form.Group>
   
    </Form> */}
    <Divider></Divider>
      <Header
        as="h2"
        style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
      >
        <Header.Content>COVID-19 Vaccine Survey</Header.Content>
        <HeaderSubHeader>
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
            <td>
             COVID-19 vaccines are effective.
            </td>
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
              I have heard negative stories that worry me about receiving the COVID-19 vaccine.
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
             I am concerned about serious reactions I may have after receiving the COVID-19 vaccine. 
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
            <td>
            I believe childhood vaccines are important and effective. 
            </td>
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
      <Link to="/decision-aid/step2">
        <button
          onClick={handleSubmit}
          style={{ float: "right", marginBottom: "3rem" }}
          class="ui large primary button"
        >
          Next
        </button>
      </Link>
    </div>
  );
}
export default DecitionTable;
