import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header, Table } from 'semantic-ui-react'

export default function OtherTools(props){

  return (
    <div>
      <AppBar menu='otherTools'/>
      <Container style={{marginTop: '8em', minWidth: '1260px'}}>
        <Header as='h1' style={{paddingTop: 16, fontWeight: 400, fontSize: "24pt"}}>

          <Header.Content>
            Other Tools
          </Header.Content>
        </Header>
        <Grid style = {{paddingTop: 30, paddingBottom: 100}}>
                <Grid.Row columns ={4}>
                  {/* <Grid.Column>
                    <Image width='300' height='192' href = '' style = {{stroke:  "#000000"}} src='/HomeIcons/Emory_Icons_NationalReport_v1.jpg' /> 
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> National Report </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}><br/>Coming soon...</Header.Content>

                  </Grid.Column> */}

                  <Grid.Column>
                    <Image width='300' height='236' href = '/_nation' src='/HomeIcons/Emory_Icons_SelectState_v1.jpg' />            
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Find State & County </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/>Click on icon to see how COVID-19 is impacting your state.</Header.Content>

                  </Grid.Column>
                  <Grid.Column>
                    <Image width='300' height='236' href = '/map-state' src='/HomeIcons/Emory_Icons_MapState_v1.jpg' />
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Map State </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/>Click on icon to visualize state-wide outcomes and characteristics.</Header.Content>

                  </Grid.Column>
                  {/* <Grid.Column>
                    <Image width='300' height='236' href = '/variants' src='/HomeIcons/Emory_Icons_MapState_v1.jpg' />
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Variant Map </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/>Click on icon to visualize variants' impacts on differet states.</Header.Content>

                  </Grid.Column> */}

                  
                  
                </Grid.Row>
                <Grid.Row columns ={4} style = {{paddingTop: 120}}>
                  

                  
                </Grid.Row>
            </Grid>
        <Notes />
      </Container>
    </div>);
}
