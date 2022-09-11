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
  import { Link} from 'react-router-dom';
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck ,faClock,faQuestionCircle} from '@fortawesome/free-regular-svg-icons'
function decisionTable(){
    return(
      <div style={{marginLeft:"10%",width:"80%"}}>
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
          <th>Really Important to Me</th>
          <th>Somewhat Important to Me</th>
          <th>Not Important to Me</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>If I gets the COVID-19 vaccine I will be better protected against COVID-19 and serious related health problems</td>
          <td colspan="3">
          <Slider defaultValue={50} aria-label="Default" />
          </td>
        </tr>
        <tr>
          <td>If I gets the COVID-19 vaccine I will be able to see family and friends more safely
</td>
          <td colspan="3">
          <Slider defaultValue={50} aria-label="Default" />
          </td>
        </tr>
        <tr>
          <td>If I gets the COVID-19 vaccine and I still catch COVID-19, my symptoms will be milder</td>
          <td>
          <Checkbox />
          </td>
          <td> <Checkbox /></td>
          <td> <Checkbox /></td>
        </tr>
        <tr>
          <td>If I gets the COVID-19 vaccine I will be free to travel around Australia or overseas</td>
          <td>
          <Checkbox />
          </td>
          <td> <Checkbox /></td>
          <td> <Checkbox /></td>
        </tr>
        <tr>
          <td>If I gets the COVID-19 vaccine I will be able to travel and move around the community more freely</td>
          <td>
          <Checkbox />
          </td>
          <td> <Checkbox /></td>
          <td> <Checkbox /></td>
        </tr>
        <tr>
          <td>If I gets the COVID-19 vaccine I won’t have to worry about being judged for not getting I vaccinated</td>
          <td>
          <Checkbox />
          </td>
          <td> <Checkbox /></td>
          <td> <Checkbox /></td>
        </tr>
        <tr>
          <td>If I gets the COVID-19 vaccine I may experience side effects from the COVID-19 vaccine</td>
          <td>
          <Checkbox />
          </td>
          <td> <Checkbox /></td>
          <td> <Checkbox /></td>
        </tr>
        <tr>
          <td>If I gets the COVID-19 vaccine I may have to take time off school to get the vaccine or recover from side effects</td>
          <td>
          <Checkbox />
          </td>
          <td> <Checkbox /></td>
          <td> <Checkbox /></td>
        </tr>
        <tr>
          <td>If I gets the COVID-19 vaccine I will have to make the effort to find, book and attend an appointment</td>
          <td>
          <Checkbox />
          </td>
          <td> <Checkbox /></td>
          <td> <Checkbox /></td>
        </tr>
        <tr>
          <td>If I gets the COVID-19 vaccine I will worry about being judged by people who disapprove of my decision
</td>
          <td>
          <Checkbox />
          </td>
          <td> <Checkbox /></td>
          <td> <Checkbox /></td>
        </tr>
      </tbody>
    </table>
    </div>
    )
}
export default decisionTable;