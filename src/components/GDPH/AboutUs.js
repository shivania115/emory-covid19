import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header, Segment } from 'semantic-ui-react'

export default function AboutUs(props){

  return (
    <div>
      <AppBar menu='aboutUs'/>
      <Container style={{marginTop: '8em'}}>
        <Header as='h1' style={{fontWeight: 400}}>
          <Header.Content>
            Contact Us
            <Header.Subheader style={{fontWeight: 400}}>
              <br></br>
  We strive to make this a user-friendly resource for policy makers, public health actors, the public, researchers, and the media.
  <br></br>
  Please share your feedback by mailing us at: covid19dashboard@emory.edu
</Header.Subheader>
          </Header.Content>
        </Header>
      </Container>
    </div>);
}
