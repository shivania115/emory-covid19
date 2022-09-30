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
  import { Link} from 'react-router-dom';
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck ,faTimesCircle,faQuestionCircle} from '@fortawesome/free-regular-svg-icons'
// import VaccinePic from '/public/DA_pic/vaccine.jpg'

  function LandingPage(){
    return(
      <div style={{height:"100%"}}>
        <center>
        
        <Header
        as="h2"
        style={{ paddingTop: 25, fontWeight: 1000, fontSize: "3rem" }}
      >
        <Header.Content>
        COVID19 Vaccine Decision Aid
        </Header.Content>
        
        <HeaderSubHeader  style={{
                      paddingTop: "1.5rem",
                      paddingLeft: "2rem",
                      paddingBottom: "0rem",
                      lineHeight: "20pt",
                      fontWeight: 300,
                      fontSize: "2rem",
                      color: "black",
                    }}>
                    
                    <FontAwesomeIcon icon={faCircleCheck} style={{fontSize:"3rem",marginRight:"20pt",color:  "#024174", 
}}/>
       This is a new decision-support tool that is designed to help you:
        </HeaderSubHeader>

      </Header>
      <List as='ul' >
      <List.Item style={{paddingTop: "1rem",paddingBottom: "0.5rem",lineHeight: "20pt",fontWeight: 300,fontSize: "1.5rem"}} as='li'>Understand about COVID-19 infection and the available vaccine options</List.Item>
      <List.Item style={{paddingTop: "1rem",paddingBottom: "0.5rem",lineHeight: "20pt",fontWeight: 300,fontSize: "1.5rem"}} as='li'>Compare the risks and benefits of vaccination</List.Item>
      <List.Item style={{paddingTop: "1rem",paddingBottom: "0.5rem",lineHeight: "20pt",fontWeight: 300,fontSize: "1.5rem"}} as='li'>Your personal risk of getting the COVID-19 infection</List.Item>
      <List.Item style={{paddingTop: "1rem",paddingBottom: "0.5rem",lineHeight: "20pt",fontWeight: 300,fontSize: "1.5rem"}} as='li'>Assist in decision making regarding vaccination.</List.Item>
        </List>
        <Image size='large' src='/DA_pic/vaccine.jpg' >
        </Image>
      <Link  to="/decision-aid/step1" >
      <button style={{marginTop:"3rem",marginBottom:"10%"}} class="ui massive primary button">
      Start
    </button>
    </Link>
      </center>
      </div>
    )
  }
  export default LandingPage;