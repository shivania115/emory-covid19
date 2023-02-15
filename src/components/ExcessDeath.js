import React, {
    useEffect,
    useState,
    useRef,
    createRef,
    PureComponent,
  } from "react";

  import { VictoryChart,VictoryArea,VictoryTheme,VictoryVoronoiContainer,VictoryLabel, VictoryLine } from 'victory';
  import {Image, Grid,Divider,Header,Container,Accordion} from 'semantic-ui-react';
  import AppBar from "./AppBar";
  function LatestOnThisDashboard() {
    return (
      <Grid>
        <Grid.Column style={{ width: 110, fontSize: "16pt", lineHeight: "18pt" }}>
          <b>The Latest on this Dashboard</b>
        </Grid.Column>
        <Grid.Column style={{ width: 20 }}></Grid.Column>
  
        {/* <Grid.Column style={{width: 190}}>
            <Image width = {175} height = {95} src='/HomeIcons/Emory_Icons_NationalReport_v1.jpg' />
          </Grid.Column>
          <Grid.Column style={{width: 250, fontSize: "8pt"}}>
            <b> National Report <br/> </b>
    
            The National Report tab takes you to a detailed overview of the impact of COVID-19 in the U.S.. 
            How has the pandemic been trending?  
            Who are the most vulnerable communities...
            <a href = "/national-report">for more</a>. 
            
          </Grid.Column> */}
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={175}
            height={95}
            href="/national-report"
            src="/HomeIcons/Emory_Icons_LatestBlog_v1.jpg"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            {" "}
            National Report <br />{" "}
          </b>
          The National Report offers a detailed overview of the impact of COVID-19
          in the U.S.. How has the pandemic been trending? Who are the most
          vulnerable communities...
          <a href="/national-report">click to access</a>.
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={175}
            height={95}
            href="/Vaccine-Tracker"
            src="/HomeIcons/Emory_Icons_NationalReport_v1.jpg"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            {" "}
            COVID-19 Vaccination Tracker <br />{" "}
          </b>
          The COVID-19 Vaccionation Tracker tab takes you to an overview of
          current vaccination status in the U.S. and in each state. For FAQs on
          COVID-19 Vaccines...
          <a href="/Vaccine-Tracker">click to access</a>.
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={175}
            height={95}
            href="/Georgia"
            src="/LatestOnThisDashboard/GADash.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            {" "}
            Georgia COVID-19 Health Equity Dashboard
            <br />{" "}
          </b>
          The Georgia COVID-19 Health Equity dashboard is a tool to dynamically
          track and compare the burden of cases and deaths across counties in
          Georgia.
          <a href="/Georgia"> Click to Access</a>.
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/blog/maskmandate"
            src="/blog images/maskmandate/Mask Mandate blog.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            Statewide Mask Mandates in the United States
            <br />
          </b>
          State-wide mask mandate in the early stages of the pandemic may have
          been clever for US states, lowering case rates during the third wave of
          the pandemic compared to...
          <a href="/media-hub/blog/maskmandate">for more</a>.
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Katie_Kirkpatrick_on_economic_responses"
            src="/podcast images/Katie Kirkpatrick.jpeg"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            “You can't have good public health, but not have equity and economic
            growth”
            <br />
          </b>
          Katie Kirkpatrick discusses the economic responses to COVID-19 &
          ramifications in the business community...
          <a href="/media-hub/podcast/Katie_Kirkpatrick_on_economic_responses">
            for more
          </a>
          .
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Allison_Chamberlain_on_public_health_education_pandemic"
            src="/podcast images/Allison Chamberlain.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            “A teaching opportunity for many years to come”
            <br />
          </b>
          Dr. Allison Chamberlain talks about public health education in the time
          of the COVID-19 pandemic, blending public health...
          <a href="/media-hub/podcast/Allison_Chamberlain_on_public_health_education_pandemic">
            for more
          </a>
          .
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Robert_Breiman_on_COVID-19_vaccine_development_and_distribution"
            src="/podcast images/Robert Breiman.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            “Information equity is a critical part of the whole picture”
            <br />
          </b>
          Dr. Robert Breiman talks about SARS-CoV-2 vaccine development,
          distribution, and clinical trials...
          <a href="/media-hub/podcast/Robert_Breiman_on_COVID-19_vaccine_development_and_distribution">
            for more
          </a>
          .
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances"
            src="/podcast images/Vincent Macroni.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            Innovations in Covid-19 Treatment: Dr. Vincent Marconi on Anti-Viral
            and Anti-Inflammatory Advances Against COVID-19 <br />
          </b>
          Dr. Vincent Marconi talks about the state of research around
          baricitinib...
          <a href="/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances">
            for more
          </a>
          .
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics"
            src="/podcast images/Dr. Nneka Sederstrom.jpg"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            "We Have to Be Better": Dr. Nneka Sederstrom on Racism and Ethics
            During Covid-19 <br />
          </b>
          Dr. Nneka Sederstrom discusses how Covid-19 has brought issues of
          structural racism in medicine to the forefront of clinical ethics and
          pandemic...
          <a href="/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics">
            for more
          </a>
          .
        </Grid.Column>
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC"
            src="/podcast images/JudyMonroe.jpg"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            "You've Got to Have Trust": Dr. Judy Monroe on Lessons Learned About
            Pandemic Preparedness <br />
          </b>
          In a podcast, Dr. Monroe tells us about the lessons she learned about
          leadership and community partnerships during pandemics based on her
          experience as...
          <a href="/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC">
            for more
          </a>
          .
        </Grid.Column>
      </Grid>
    );
  }
  export default function ExcessDeath(){
    return(
        <div>
            <AppBar menu="variants" />
            {/* <Grid style={{ height: 130, overflow: "hidden",marginTop: "8em", minWidth: "1260px"  }}>
              <div style={{ paddingBottom: 8 }}></div>

              <div
                style={{ height: 130, overflowY: "hidden", overflowX: "auto" }}
              >
                <div style={{ width: "260%" }}>
                  <LatestOnThisDashboard />
                </div>
              </div>
            </Grid> */}
            <Divider hidden />
            {/* <VictoryChart 
            width={400}
            
            containerComponent={<VictoryVoronoiContainer   responsive={false}
            flyoutStyle={{ fill: "white" }}/>}

           >
           <VictoryLabel text="Missisipi"
        x={100} y={11}
        style={{fill:"black",fontSize: 20 }}
        textAnchor="end"
    />
            <VictoryLabel text="Average Monthly Excess Death"
        x={225} y={60}
        style={{fill:"#a45791"}}
        textAnchor="middle"
    />
        <VictoryArea
        domain={{y:[0,10]}}
      
          data={[
            { x: 1, y: 2, y0: 5 },
            { x: 2, y: 1, y0: 4 },
            { x: 3, y: 2, y0: 3 },
            { x: 4, y: 4, y0: 2 },
            { x: 5, y: 6, y0: 2 }
          ]}
          style={{
            data:{
                fill: "#cea3c3",  stroke: "#a45791",strokeOpacity:100,strokeWidth:5
            },
          }}
        />
      </VictoryChart> */}
      <Container
     style={{width:'85%'}}>
      <Header
            as="h1"
            style={{textAlign:'center',paddingTop: 80, fontWeight: 400, fontSize: "24pt" }}
          >
            <Header.Content>
            Excess Deaths Associated with the COVID-19 Pandemic
              <Header.Subheader
                style={{
                  paddingTop: "1rem",
                  paddingLeft: "0rem",
                  paddingBottom: "0rem",
                  lineHeight: "20pt",
                  fontWeight: 400,
                  fontSize: "12pt",
                  color: "black",
                }}
              >
                Excess deaths are the number of additional deaths that occurred during the pandemic as compared with prior time points. Excess deaths are used to measure the full toll of the pandemic and include all deaths -- not just deaths directly due to the SARS-Cov-2 virus.
              </Header.Subheader>
              <Accordion
                        id="race"
                        style={{
                          paddingTop: 0,
                          paddingLeft: 30,
                          paddingBottom: 15,
                        }}
                        defaultActiveIndex={1}
                        panels={[
                          {
                            key: "acquire-dog",
                            title: {
                              content: (
                                <u
                                  style={{
                                    fontFamily: "lato",
                                    fontSize: "17px",
                                    color: "#397AB9",
                                  }}
                                >
                                  About the data
                                </u>
                              ),
                              icon: "dropdown",
                            },
                            content: {
                              content: (
                                <Header.Content
                                  style={{
                                    fontWeight: 400,
                                    paddingTop: 0,
                                    paddingLeft: 5,
                                    fontSize: "15px",
                                    width: "80%",
                                  }}
                                >
                                  "Excess Deaths Associated with COVID-19" from National Center for Health Statistics.
The CDC estimated expected deaths using Farrington surveillance algorithms. See [website] for full details.
                                </Header.Content>
                              ),
                            },
                          },
                        ]}
                      />
            </Header.Content>
          </Header>
      <Grid stype={{width:'100%'}}>
        <Grid.Row>
        <Grid.Column width={10}>
        <img src="/USplot1.png"></img>
        <img src="/USplot2.png"></img>
        </Grid.Column>
        <Grid.Column  width={6}>
        <img src="/barplot.png"></img>
        </Grid.Column>
        </Grid.Row>
      </Grid>
      </Container>
      </div>
         

        
    )
  }