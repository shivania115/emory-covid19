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
  import { Link, useNavigate} from 'react-router-dom';
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck ,faClock,faQuestionCircle,faUserCircle,faArrowAltCircleLeft} from '@fortawesome/free-regular-svg-icons'


function PersonalRisk(){
    const navigate = useNavigate();
    return(
        <div>
            <Grid>
            <Grid.Row>
            <Grid.Column width={3}></Grid.Column>
            <Grid.Column width={3}> <FontAwesomeIcon icon={faUserCircle} style={{fontSize:"10rem",marginTop:"10%",color:  "#024174", 
            }}/></Grid.Column>
             <Grid.Column width={10}>
             <Header
                            as="h2"
                            style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
                        >
                         <Header.Content>
                         <a href='https://www.mdcalc.com/calc/10348/covid-risk'>Calculate your personal mortality risk within 30 days of contracting COVID-19. <FontAwesomeIcon icon={faArrowAltCircleLeft} style={{fontSize:"2rem",marginTop:"3%",color:  "#024174", }}/></a>
                            </Header.Content>
                        </Header>
            
            </Grid.Column>
            </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3}></Grid.Column>
                    <Grid.Column width={3}>
                    <FontAwesomeIcon icon={faCircleCheck} style={{fontSize:"10rem",marginTop:"10%",color:  "#024174", 
            }}/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                    <Header
                            as="h2"
                            style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
                        >
                            <Header.Content>
                            You may be at a higher risk of severe COVID-19 and its health problems if:
                            </Header.Content>
                            <HeaderSubHeader style={{
                                paddingBottom: "0rem",
                                lineHeight: "20pt",
                                fontSize: "1rem",
                                color: "black",
                            }}>
                               <ul>
                                <li>
                                you are aged 70 years or older (noting that risk increases with age, even if you're under 70 years of age)
                                </li>
                                <li>
                                you have had an organ transplant and are on immune-suppressive therapy
                                </li>
                                <li>
                                you have had a bone marrow transplant in the last 24 months
                                </li>
                                <li>
                                you are having certain cancer treatments such as chemotherapy or radiotherapy
                                </li>
                                <li>
                                you have a long-term health problem such as chronic lung disease, kidney failure, liver disease, heart disease, diabetes or high blood pressure
                                </li>
                                <li>
                                you have challenges with your weight, such as obesity
                                </li>
                                <li>
                                you have a compromised immune system
                                </li>
                                <li>
                                you are pregnant
                                </li>
                                <li>
                                you have a disability that requires help with daily living activities.
                                </li>
                               </ul>
                            </HeaderSubHeader>
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3}></Grid.Column>
                    <Grid.Column width={3}>
                    <FontAwesomeIcon icon={faQuestionCircle} style={{fontSize:"10rem",marginTop:"10%",color:  "#024174", 
            }}/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                    <Header
                            as="h2"
                            style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
                        >
                            <Header.Content>
                            COVID-19 vaccination may not be recommended for you if:
                            </Header.Content>
                            <HeaderSubHeader style={{
                                paddingBottom: "0rem",
                                lineHeight: "20pt",
                                fontSize: "1rem",
                                color: "black",
                            }}>
                               <ul>
                                <li>
                                you have a past history of heparin-induced thrombocytopenia syndrome (HITS) or cerebral venous sinus thrombosis (CVST) (relevant for the AstraZeneca vaccine)
                                </li>
                                <li>
                                you have had a history of idiopathic splanchnic (mesenteric, portal, splenic) venous thrombosis (relevant for the AstraZeneca vaccine)
                                </li>
                                <li>
                                you have a history of inflammatory cardiac illness within the past three months (for the Pfizer and Moderna vaccines). People with these conditions can still receive a Pfizer or Moderna vaccine; however, your GP or cardiologist will recommend the best timing for vaccination
                                </li>
                              <li>
                              you have had a severe allergic reaction (anaphylaxis) to a previous dose or an ingredient
                              </li>
                              <li>
                              you have had any other serious adverse event attributed to a previous dose
                              </li>
                              <li>
                              you have had a current acute illness, including a fever.
                              </li>
                               </ul>
                            </HeaderSubHeader>
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                {/* <Grid.Row>
                    <Grid.Column width={3}></Grid.Column>
                    <Grid.Column width={3}>
                    <FontAwesomeIcon icon={faClock} style={{fontSize:"10rem",marginTop:"10%",color:  "#024174", 
            }}/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                    <Header
                            as="h2"
                            style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
                        >
                            <Header.Content>
                            Discuss the best timing of COVID-19 vaccination with your doctor if you:
                            </Header.Content>
                            <HeaderSubHeader style={{
                                paddingBottom: "0rem",
                                lineHeight: "20pt",
                                fontSize: "1rem",
                                color: "black",
                            }}>
                               <ul>
                                <li>
                                has current or recent (within past three months) inflammatory heart disease, acute heart failure or acute rheumatic heart disease
                                </li>
                                <li>
                                takes immunosuppressive medication
                                </li>
                                <li>
                                is acutely unwell (e.g. with a fever).
                                </li>
            
                               </ul>
                            </HeaderSubHeader>
                        </Header>
                    </Grid.Column>
                </Grid.Row> */}
            </Grid>
            <div style= {{paddingTop: 30}}>
        <button
          onClick={()=> {navigate("/decision-aid/step3")}}
          style={{ float: "left", size:"5rem",marginTop: "1rem", marginBottom: "4rem" }}
          class="ui large primary button"
        >
          Previous
        </button>
        <button
          onClick={()=> {navigate("/decision-aid/step5")}}
          style={{ float: "right", size:"5rem",marginTop: "1rem", marginBottom: "4rem" }}
          class="ui large primary button"
        >
          Next
        </button>
      </div>
        </div>

    )
}
export default PersonalRisk;