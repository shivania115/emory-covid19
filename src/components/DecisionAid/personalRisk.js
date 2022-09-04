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
import { faCircleCheck ,faClock,faQuestionCircle} from '@fortawesome/free-regular-svg-icons'

function PersonalRisk(){
    return(
        <Grid>
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
                        Your child may be at a higher risk of severe COVID-19 and ongoing COVID-related problems if they:
                        </Header.Content>
                        <HeaderSubHeader style={{
                            paddingBottom: "0rem",
                            lineHeight: "20pt",

                            fontSize: "1rem",
                            color: "black",
                        }}>
                           <ul>
                            <li>
                            have had an organ transplant and are on immune-suppressive therapy
                            </li>
                            <li>
                            have had a bone marrow transplant
                            </li>
                            <li>
                            have a complex chronic disease
                            </li>
                            <li>
                            live with a significant disability that requires assistance with activities of daily living
                            </li>
                            <li>
                            have chronic inflammatory conditions that require immune-suppressive or immunomodulatory medication
                            </li>
                            <li>
                            have chronic neurological conditions (e.g. epilepsy)
                            </li>
                            <li>
                            have a blood disorder or cancer
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
                        COVID-19 vaccination may not be recommended for your child if they:
                        </Header.Content>
                        <HeaderSubHeader style={{
                            paddingBottom: "0rem",
                            lineHeight: "20pt",

                            fontSize: "1rem",
                            color: "black",
                        }}>
                           <ul>
                            <li>
                            have previously had a severe allergic reaction (anaphylaxis) to a COVID-19 vaccine
                            </li>
                            <li>
                            have previously had a severe allergic reaction (anaphylaxis) to any other vaccine.
                            </li>
                          
                           </ul>
                        </HeaderSubHeader>
                    </Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
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
                        Discuss the best timing of COVID-19 vaccination with your doctor if your child:
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
            </Grid.Row>
        </Grid>

    )
}
export default PersonalRisk;