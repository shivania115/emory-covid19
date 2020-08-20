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

          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 0}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='300' href = '/media-hub/podcast/Dr.Carlos_Del_Rio_on_COVID-19_Equity_&_Outcomes' src='/podcast images/CarlosdelRio.jpg' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content href = '/media-hub/podcast/Dr.Carlos_Del_Rio_on_COVID-19_Equity_&_Outcomes'>Podcast: Dr. Carlos Del Rio on COVID-19 Equity and Outcomes </Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: August 10, 2020 <br/><br/>
                        Considering health equity and disparity, how will the pandemic progress? What is our current strategy? What can be and needs to be done to change the course of the pandemic? Listen to what Dr. Carlos Del Rio has to say. 
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>
          
          <Grid.Column rows = {2} style={{paddingBottom: 20, paddingTop: 0}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <Image width='390' height='236' href = '/media-hub/blog/Will_SARS-CoV-2_beat_the_Power_Five_Conferences' src='/blog images/power five/blog1cover.jpeg' />            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      <div style = {{lineHeight: "16pt", paddingTop:9}}> <Header.Content href="/media-hub/blog/Will_SARS-CoV-2_beat_the_Power_Five_Conferences">Blog: Will SARS-CoV-2 beat the Power Five Conferences? </Header.Content></div>
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Edited: August 19, 2020 <br/><br/>
                        With almost half of all college football players being African American, resuming the football season might put African American athletes at an occupational risk due to COVID-19. Our data highlights greater severity of COVID-19 outcomes in counties where Power Five schools are located. With that said, can a team sport like football co-exist with COVID-19?
                      </Header.Subheader>
                    </Header.Content>
                </Header>
              </div>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column rows = {2} style={{paddingBottom: 20}}>
            <Grid.Row>
              <div style = {{paddingBottom: 10}}>
                <iframe width="390" height="236" src="https://www.youtube.com/embed/b9jvwt0dUPQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>            
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      COVID-19 and Population Density
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: July 30, 2020 <br/><br/>
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
                <iframe width="390" height="236" src="https://www.youtube.com/embed/IEojaw9cND4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      COVID-19 and Poverty-related Issues
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: July 27, 2020 <br/><br/>
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
                <iframe width="390" height="236" src="https://www.youtube.com/embed/U-Aqx7vQocY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>        
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2'>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      COVID-19 in SW Native American Communities
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: July 14, 2020 <br/><br/>
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
                <iframe width="390" height="236" src="https://www.youtube.com/embed/0eFjhnDQe6g" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2' >
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      COVID-19 in African American Communities
                      <Header.Subheader style={{fontWeight: 300, fontSize: "14pt"}}>
                        Date Published: July 9, 2020 <br/><br/>
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
                <iframe width="390" height="236" src="https://www.youtube.com/embed/2lWS3LGZUFU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2' style={{width:400, paddingLeft: 0}}>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      COVID-19 and Underlying Conditions
                      <Header.Subheader style={{fontWeight: 300, width: 400, fontSize: "14pt"}}>
                        Date Published: July 1, 2020 <br/> <br/>
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
                <iframe width="390" height="236" src="https://www.youtube.com/embed/PmI42rHnI6U" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div>
                <Header as='h2' style={{width:400, paddingLeft: 0}}>
                    <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                      Dashboard Tutorial
                      <Header.Subheader style={{fontWeight: 300, width: 400, fontSize: "14pt"}}>
                        Date Published: June 5, 2020 <br/> <br/>
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
