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
import { Link } from "react-router-dom";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClock,
  faQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";

function FinalDecision() {
  const choices = [
    "I have decided to get the COVID-19 vaccine",
    "I need to discuss the decision further with my family and doctor",
    "I need to learn more about COVID-19 and the COVID-19 vaccine",
    "I have decided not get the COVID-19 vaccine",
    "Other",
  ];
  const [checkedBoxes, setCheckedBoxes] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  return (
    <div style={{ marginLeft: "20%", width: "60%" }}>
      <Header
        as="h4"
        style={{ paddingTop: 30, fontWeight: 500, fontSize: "1.5rem" }}
      >
        <Header.Content>
          We hope the information in this decision aid has helped you to make a
          decision. Select from the options below to see what your next steps
          will be.
        </Header.Content>
      </Header>
      <div>
        {choices.map((choice, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                e.preventDefault();
              }}
              checked={checkedBoxes[index]}
              style={{
                fontSize: "1.25rem",
                display: "block",
                marginTop: "10px",
              }}
              label={choice}
            />
          );
        })}
      </div>

      <Link to="/decision-aid/about">
        <button style={{ marginTop: "3rem" }} class="ui large primary button">
          Submit
        </button>
      </Link>
    </div>
  );
}
export default FinalDecision;
