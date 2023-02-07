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
  import FormControlLabel from "@mui/material/FormControlLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
  import { Link} from 'react-router-dom';
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck ,faTimesCircle,faQuestionCircle} from '@fortawesome/free-regular-svg-icons'
// import VaccinePic from '/public/DA_pic/vaccine.jpg'
import i18n from "i18next";
import { initReactI18next,useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { TRANSLATIONS_SPAN } from "./span/translation";
import { TRANSLATIONS_EN } from "./en/translation";
 
i18n
 .use(LanguageDetector)
 .use(initReactI18next)
 .init({
  fallbackLng: 'en',
   resources: {
     en: {
       translation: TRANSLATIONS_EN
     },
     span: {
       translation: TRANSLATIONS_SPAN
     }
   }
 });
  function LandingPage(){
    const { t } = useTranslation();
    console.log(i18n.language);
    return(
      <div style={{height:"100%",width:"100%",backgroundImage: "url(/DA_pic/vaccine2.png)"}} >
     
        <center>
        <ToggleButtonGroup
        color='primary'
        value={i18n.language}
        size="small"
        exclusive
        onChange={(e,value)=>{
        i18n.changeLanguage(value);
        console.log(value);
        console.log(i18n.language);
        // console.log(value);
        // if(language!=value){
        //   i18n.changeLanguage(value);
        //   setLanguage(value);}
        }}
        aria-label="Platform"
        style={{paddingBottom:0,paddingTop:20}}
      >
        <ToggleButton style={{width:200,fontSize:'1.25rem'}}   value="en">English</ToggleButton>
        <ToggleButton style={{width:200,fontSize:'1.25rem'}} value="span">Español</ToggleButton>
      </ToggleButtonGroup>
        <Header
        as="h2"
        style={{ paddingTop: 25, fontWeight: 1000, fontSize: "3rem" }}
      >
        <Header.Content>
        {t('landingpage')}
        </Header.Content>
        
        <HeaderSubHeader  style={{
                      paddingTop: "1.5rem",
                      paddingLeft: "2rem",
                      paddingBottom: "1rem",
                      lineHeight: "20pt",
                      fontWeight: 500,
                      fontSize: "2rem",
                      color: "black",
                    }}>
                    
                    <FontAwesomeIcon icon={faCircleCheck} style={{fontSize:"3rem",marginRight:"20pt",color:  "#024174", 
}}/>
       {t('lp1')}
        </HeaderSubHeader>

      </Header>
      <List as='ul' >
      <List.Item style={{paddingTop: "1rem",paddingBottom: "0.5rem",lineHeight: "20pt",fontWeight: 400,fontSize: "1.5rem"}} as='li'>{t('lp2')}</List.Item>
      <List.Item style={{paddingTop: "0.5rem",paddingBottom: "0.5rem",lineHeight: "20pt",fontWeight: 400,fontSize: "1.5rem"}} as='li'>{t('lp3')}</List.Item>
      <List.Item style={{paddingTop: "0.5rem",paddingBottom: "0.5rem",lineHeight: "20pt",fontWeight: 400,fontSize: "1.5rem"}} as='li'>{t('lp4')}</List.Item>
      <List.Item style={{paddingTop: "0.5rem",paddingBottom: "0.5rem",lineHeight: "20pt",fontWeight: 400,fontSize: "1.5rem"}} as='li'>{t('lp5')}</List.Item>
        </List>
        {/* <Image size='large' src='/DA_pic/vaccine.jpg' >
        </Image> */}
      <Link  to="/decision-aid/step1" >
      <button style={{marginTop:"3rem",marginBottom:"10%"}} class="ui massive primary button">
      {t('start')}
    </button>
    </Link>
      </center>
      </div>
    )
  }
  export default LandingPage;