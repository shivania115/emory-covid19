import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Grid, List, Divider, Image, Header, Table } from 'semantic-ui-react'

export default function DataSources(props){
    const history = useHistory();


  return (
    <div>
      <AppBar menu='mediaHub'/>
      <Container style={{marginTop: '8em', minWidth: '1260px'}}>

        <Header as='h2' style={{fontWeight: 400, paddingLeft: 0}}>
          <Header.Content style = {{paddingTop: 20, fontSize: "24pt"}}>
            Media Hub

            <Header.Subheader style={{fontWeight: 300, fontSize: "20pt", paddingTop: 20}}>

              Tune in for videos, podcasts, blogs, and more on COVID-19. 
            </Header.Subheader>
          </Header.Content>
        </Header>

      <Grid style={{paddingTop: 2}}>
        <Grid.Row columns={3} style={{paddingBottom: 20}}> 

        {/* <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 0}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='290' href = '/media-hub/podcast/Katie_Kirkpatrick_on_economic_responses' src='/podcast images/Katie Kirkpatrick.jpeg' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href = '/media-hub/podcast/Katie_Kirkpatrick_on_economic_responses'>“You can't have good public health, but not have equity and economic growth”: A conversation with Katie Kirkpatrick about economic responses to the COVID-19 pandemic.</Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: Jan. 11, 2021 <br/> 
                        Media Type: Podcast<br/><br/>
                        Katie Kirkpatrick, the president and CEO of the Metro Atlanta Chamber of Commerce, talks about the ramifications of COVID-19 in the business community, from issues ranging to supply chain management to staff and customer safety, to the new MAC initiative, the Task Force to Restore Georgia's Economy. 
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column> */}

        <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 0}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='290' href = '/media-hub/podcast/Allison_Chamberlain_on_public_health_education_pandemic' src='/podcast images/Allison Chamberlain.png' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href = '/media-hub/podcast/Allison_Chamberlain_on_public_health_education_pandemic'>“A teaching opportunity for many years to come”: Dr. Allison Chamberlain on public health education in the time of the COVID-19 pandemic</Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: Nov. 18, 2020 <br/> 
                        Media Type: Podcast<br/><br/>
                        Dr. Allison Chamberlain talks about blending public health academia and practice, and how institutions like Emory can step up during the pandemic to put the skills of their faculty to use. We also discuss how the COVID-19 pandemic may change public health education forever, thinking about the communication and other skills students will need to combat current and future public health threats. 
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

        <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 0}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='290' href = '/media-hub/podcast/Robert_Breiman_on_COVID-19_vaccine_development_and_distribution' src='/podcast images/Robert Breiman.png' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href = '/media-hub/podcast/Robert_Breiman_on_COVID-19_vaccine_development_and_distribution'>“Information equity is a critical part of the whole picture”: Dr. Robert Breiman on COVID-19 vaccine development and distribution</Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: Nov. 18, 2020 <br/> 
                        Media Type: Podcast<br/><br/>
                        Dr. Robert Breiman talks about where different SARS-CoV-2 vaccines are in development and clinical trials, and considerations for production and distribution related to logistics and equity. How might vaccines be allocated fairly, both in consideration of essential workers and those at higher risk of developing severe COVID-19 outcomes?
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

        <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 0}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='290' href = '/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances' src='/podcast images/Vincent Macroni.png' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href = '/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances'>Innovations in Covid-19 Treatment: Dr. Vincent Marconi on Anti-Viral and Anti-Inflammatory Advances Against Covid-19 Infection</Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: October 26, 2020 <br/> 
                        Media Type: Podcast<br/><br/>
                        Dr. Vincent Marconi talks about the state of research around baricitinib, a JAK-STAT inhibitor that reduces inflammation and may reduce viral replication, and has played an important role in treating patients with severe Covid-19. We discuss the current state of research and considerations around underlying conditions and health equity. 
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

        <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='236' href = '/media-hub/blog/povertyRelatedIssues' src='/blog images/pri/Image 15.png' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href="/media-hub/blog/povertyRelatedIssues">COVID-19 and Poverty-related issues</Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Edited: October 7, 2020 <br/> 
                        Media Type: Blog<br/><br/>
                        Since COVID-19 coronavirus pandemic took off in the United States in 2020, data show that poverty, lack of health insurance, socioeconomic vulnerability, and housing insecurity may all contribute to higher risk of contracting COVID-19 and having severe outcomes. As the pandemic affects businesses and employment, the cycle of poverty may be reinforced.


                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
        </Grid.Column>


        <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='236' href = '/media-hub/blog/swNativeAmericanCommunities' src='/blog images/swna/Image 7.png' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href="/media-hub/blog/swNativeAmericanCommunities">COVID-19 in SW Native American Communities</Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Edited: October 1, 2020 <br/> 
                        Media Type: Blog<br/><br/>
                        Since COVID-19 coronavirus epidemic took off in the United States in 2020, data continue to show that Native Americans, particularly in the Southwest, are disproportionately impacted by infection and death. Some of the contributing factors may include high rates of poverty and chronic disease, lack of critical infrastructure like running water, isolation from health resources, crowded and multigenerational living conditions, and close-knit community support systems. 


                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
        </Grid.Column>

        <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='236' href = '/media-hub/blog/africanAmericanCommunity' src='/blog images/aac/Image 1.png' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href="/media-hub/blog/africanAmericanCommunity">COVID-19 in African American Communities</Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Edited: September 30, 2020 <br/> 
                        Media Type: Blog<br/><br/>
                        COVID-19 has disproportionately African Americans, with 2.6 times the infection rate of white non-Hispanic people, 4.7 times the hospitalization rate, and 2.1 times the death rate. African Americans have the highest rate of death of any racial or ethnic group in the United States.


                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>


          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='236' href = '/media-hub/blog/underlyingConditions' src='/blog images/underlying/underlying_1.png' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href="/media-hub/blog/underlyingConditions">COVID-19 and Underlying Conditions</Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Edited: September 28, 2020 <br/> 
                        Media Type: Blog<br/><br/>
                        Underlying conditions like having obesity or diabetes, and being over age 65, may make individuals more likely to develop severe COVID-19 infection and be at a higher risk of hospitalization and death. For example, 42% of US adults have obesity, which may lead to higher mortality among those with COVID-19. 

                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='290' href = '/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics' src='/podcast images/Dr. Nneka Sederstrom.jpg' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href = '/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics'>"We Have to Be Better": Dr. Nneka Sederstrom on Racism and Ethics During Covid-19</Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: September 7, 2020 <br/> 
                        Media Type: Podcast<br/><br/>
                        Dr. Nneka Sederstrom discusses how COVID-19 has brought issues of structural racism in medicine to the forefront of clinical ethics and pandemic response conversations. We talk about how the process of change is accelerating as people are forced to have difficult but necessary reckonings with racism in medicine. 
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='290' href = '/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC' src='/podcast images/JudyMonroe.jpg' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href = '/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC'>"You've Got to Have Trust": Dr. Judy Monroe on Lessons Learned About Pandemic Preparedness </Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: August 26, 2020 <br/> 
                        Media Type: Podcast<br/><br/>
                        Dr. Monroe tells us about the lessons she learned about leadership and community partnerships during pandemics based on her experience as State Health Commissioner of Indiana during the 2009 H1N1 pandemic. We talk about new initiatives the CDC Foundation is spearheading or partnering with to address health equity: gathering accurate data, engaging underserved communities, working on communications campaigns, and supporting virus hotspots with needed response personnel. 
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='300' href = '/media-hub/podcast/Dr.Carlos_Del_Rio_on_COVID-19_Equity_&_Outcomes' src='/podcast images/CarlosdelRio.jpg' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href = '/media-hub/podcast/Dr.Carlos_Del_Rio_on_COVID-19_Equity_&_Outcomes'>Dr. Carlos Del Rio on COVID-19 Equity and Outcomes </Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: August 10, 2020 <br/> 
                        Media Type: Podcast<br/><br/>
                        Considering health equity and disparity, how will the pandemic progress? What is our current strategy? What can be and needs to be done to change the course of the pandemic? Listen to what Dr. Carlos Del Rio has to say. 
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>
          
          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='236' href = '/media-hub/blog/Will_SARS-CoV-2_beat_the_Power_Five_Conferences' src='/blog images/power five/blog1cover.jpeg' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content style ={{color: "#397AB9"}} href="/media-hub/blog/Will_SARS-CoV-2_beat_the_Power_Five_Conferences">Will SARS-CoV-2 beat the Power Five Conferences? </Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Edited: August 19, 2020 <br/> 
                        Media Type: Blog<br/><br/>
                        With almost half of all college football players being African American, resuming the football season might put African American athletes at an occupational risk due to COVID-19. Our data highlights greater severity of COVID-19 outcomes in counties where Power Five schools are located. With that said, can a team sport like football co-exist with COVID-19?
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <iframe width="390" height="236" src="https://www.youtube.com/embed/b9jvwt0dUPQ" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      COVID-19 and Population Density
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: July 30, 2020 <br/> 
                        Media Type: Video<br/><br/>
                        Because the virus SARS-COV-2 is transmitted through droplets, proximity to other individuals is one of the risk factors, so in places where it is harder to practice social distancing, like densely populated urban areas, we often see higher cases per capita. At the same time, there are some states where rural communities are actually the ones experiencing disproportionate infection rates, often because of local outbreaks and exacerbating underlying conditions. 
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <iframe width="390" height="236" src="https://www.youtube.com/embed/IEojaw9cND4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      COVID-19 and Poverty-related Issues
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: July 27, 2020<br/> 
                        Media Type: Video<br/><br/>
                        Poverty, lack of health insurance, socioeconomic vulnerability, and housing insecurity may all contribute to higher risk of contracting COVID-19 and having severe outcomes. As the pandemic affects businesses and employment, the cycle of poverty may be reinforced by the progression of the pandemic and worsen unemployment, poverty, and related issues like insurance and housing.
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop:70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <iframe width="390" height="236" src="https://www.youtube.com/embed/U-Aqx7vQocY" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>        
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      COVID-19 in SW Native American Communities
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: July 14, 2020 <br/> 
                        Media Type: Video<br/><br/>
                        Native American communities, particularly in the Southwest, are hard-hit by COVID-19. Contributing factors may include high rates of poverty and chronic disease, lack of critical infrastructure like running water, isolation from health resources, crowded and multigenerational living conditions, and close-knit community support systems.
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>


          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop:70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <iframe width="390" height="236" src="https://www.youtube.com/embed/0eFjhnDQe6g" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2' >
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      COVID-19 in African American Communities
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: July 9, 2020<br/> 
                        Media Type: Video<br/><br/>
                        13% of the United States population is African American, but 23% of reported COVID-19 deaths have occurred in African Americans. In Georgia, African Americans represent 32% of the state’s population but 47% of COVID-19 deaths.
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <iframe width="390" height="236" src="https://www.youtube.com/embed/2lWS3LGZUFU" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2' style={{width:400, paddingLeft: 0}}>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      COVID-19 and Underlying Conditions
                      <Header.Subheader style={{fontWeight: 300, width: 400, fontSize: "14pt"}}>
                        Date Published: July 1, 2020<br/> 
                        Media Type: Video<br/><br/>
                        Underlying conditions like having obesity or diabetes, and being over age 65, may make individuals more likely to develop severe COVID-19 infection and be at a higher risk of hospitalization and death.
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 70}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <iframe width="390" height="236" src="https://www.youtube.com/embed/PmI42rHnI6U" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2' style={{width:400, paddingLeft: 0}}>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      Dashboard Tutorial
                      <Header.Subheader style={{fontWeight: 300, width: 400, fontSize: "14pt"}}>
                        Date Published: June 5, 2020 <br/> 
                        Media Type: Video<br/><br/>
                        Tutorial video walks you through the basics of the dashboard.
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>


        </Grid.Row>
        <Notes />
      </Grid>
      </Container>
    </div>);
}
