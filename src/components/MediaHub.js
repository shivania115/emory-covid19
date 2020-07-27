import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header, Table } from 'semantic-ui-react'

export default function DataSources(props){

  return (
    <div>
      <AppBar menu='mediaHub'/>
      <Container style={{marginTop: '8em', minWidth: '1260px'}}>
        <Header as='h2' style={{fontWeight: 400, paddingLeft: 0}}>
          <Header.Content style = {{paddingTop: 20, fontSize: "24pt"}}>
            Media Hub
            <Header.Subheader style={{fontWeight: 300, fontSize: "20pt", paddingTop: 10}}>
              Tune in for videos, podcasts, blogs, and more on COVID-19. 
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Divider hidden/>


      <Grid columns={3} style={{paddingLeft: 0}}>
        <Grid.Row columns={3} style={{width: 420, paddingRight: 0}}> 
            <div style = {{paddingLeft: 15}}>
              <iframe width="390" height="236" src="https://www.youtube.com/embed/PmI42rHnI6U" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div style = {{paddingLeft: 40}}>
              <iframe width="390" height="236" src="https://www.youtube.com/embed/0eFjhnDQe6g" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div style = {{paddingLeft: 40}}>
              <iframe width="390" height="236" src="https://www.youtube.com/embed/U-Aqx7vQocY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>        
            </div>
        </Grid.Row>
        <Grid.Row columns={3} style={{width: 420, paddingBottom: 20}}> 
            <div style = {{paddingLeft: 15}}>
              <Header as='h2' style={{width:390, paddingLeft: 0}}>
                  <Header.Content style={{fontSize: "14pt", fontWeight: 400}}>
                    Dashboard Tutorial
                    <Header.Subheader style={{fontWeight: 300, width: 390, fontSize: "14pt"}}>
                    Date Published: June 5, 2020 <br/> <br/>
                    Tutorial video walks you through the basics of the dashboard.
                    </Header.Subheader>
                  </Header.Content>
              </Header>
            </div>
            <div style = {{paddingLeft: 40}}>
              <Header as='h2' style={{width:390}}>
                  <Header.Content style={{width:400, fontSize: "14pt", fontWeight: 400}}>
                    COVID-19 in African American Communities
                    <Header.Subheader style={{fontWeight: 300, width: 390, fontSize: "14pt"}}>
                    Date Published: July 9, 2020 <br/><br/>
                    13% of the United States population is African American, but 23% of reported COVID-19 deaths have occurred in African Americans. In Georgia, African Americans represent 32% of the state’s population but 47% of COVID-19 deaths.
                    </Header.Subheader>
                  </Header.Content>
              </Header>
            </div>
            <div style = {{paddingLeft: 40}}>
              <Header as='h2' style={{width:390}}>
                  <Header.Content style={{width:420, fontSize: "14pt", fontWeight: 400}}>
                    COVID-19 in SW Native American Communities
                    <Header.Subheader style={{fontWeight: 300, width: 390, fontSize: "14pt"}}>
                    Date Published: July 14, 2020 <br/><br/>
                    Native American communities, particularly in the Southwest, are hard-hit by COVID-19. Contributing factors may include high rates of poverty and chronic disease, lack of critical infrastructure like running water, isolation from health resources, crowded and multigenerational living conditions, and close-knit community support systems.
                    </Header.Subheader>
                  </Header.Content>
              </Header>
            </div>


        </Grid.Row>
        <Notes />
      </Grid>
      </Container>
    </div>);
}
