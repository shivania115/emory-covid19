import {
  Container,
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
  Checkbox,
  Menu,
  Message,
  Transition,
  List,
} from "semantic-ui-react";
import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  PureComponent,
} from "react";
import Slider from '@mui/material/Slider';
import { Link } from 'react-router-dom';
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faClock, faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
function DecitionTable() {
  const [info,setInfo]=useState([50]);

  function handleChange(index, value){
    setInfo(previousState=>{
      const sliders = [...previousState];
      sliders[index] = value;
      return sliders ;
    }
    )
    console.log(info);
  }

  return (
    <div style={{ marginLeft: "10%", width: "80%" }}>
      <Header
        as="h2"
        style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
      >

        <Header.Content>
          If I gets the COVID-19 vaccine
        </Header.Content>
      </Header>
      <table class="ui striped table">
        <thead>
          <tr>
            <th>
            </th>
            <th>Not Important to Me</th>
            <th>Somewhat Important to Me</th>
            <th>Really Important to Me</th>
            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>If I get the COVID-19 vaccine I will be better protected against COVID-19 and serious COVID-19-related health problems.
            </td>
            <td colspan="3">
              <Slider defaultValue={50} key={0} aria-label="Default" onChange={(event, value)=>handleChange(0,value)}/>
            </td>
          </tr>
          <tr>
            <td>If I get the COVID-19 vaccine I will help to increase the overall vaccination rate and restrictions will end sooner.
            </td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
          <tr>
            <td>If I gets the COVID-19 vaccine and I still catch COVID-19, my symptoms will be milder</td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
          <tr>
            <td>If I get the COVID-19 vaccine I will be able to see my family and friends.
            </td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
          <tr>
            <td>If I get the COVID-19 vaccine and I still catch COVID-19, my symptoms will be milder.
            </td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
          <tr>
            <td>If I get the COVID-19 vaccine I will be able to return to work.
            </td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
          <tr>
            <td>If I get the COVID-19 vaccine I will be able to travel and move around my community more freely.
            </td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
          <tr>
            <td>If I get the COVID-19 vaccine I won’t have to worry about being judged by my family or friends for not getting the vaccine.
            </td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
          <tr>
            <td>If I get the COVID-19 vaccine I may experience side effects from the COVID-19 vaccine.
            </td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
          <tr>
            <td>If I get the COVID-19 vaccine I may have to take time off work to get the vaccine or recover from side effects.

            </td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
          <tr>
            <td>If I get the COVID-19 vaccine I will have to make the effort to find, book, and attend an appointment.

            </td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
          <tr>
            <td>If I get the COVID-19 vaccine I will have to worry about being judged by my family or friends for getting the vaccine.

            </td>
            <td colspan="3">
              <Slider defaultValue={50} aria-label="Default" />
            </td>
          </tr>
        </tbody>
      </table>
      <button style={{float:'right',marginBottom:"3rem"}} class="ui large primary button">
      Submit
    </button>
    </div>
  )
}
export default DecitionTable;