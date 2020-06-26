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
            About Us
            <Header.Subheader style={{fontWeight: 300}}>We are a group of epidemiologists, doctors, and software engineers from Emory University and University of Michigan.</Header.Subheader>
          </Header.Content>
        </Header>
        <Grid columns={3}>
          <Grid.Column>
            <List bulleted>
              <List.Item>Shivani A. Patel, PhD</List.Item>
              <List.Item>K. M. Venkat Narayan, MD</List.Item>
              <List.Item>Carlos Del Rio, MD</List.Item>
              <List.Item>Mark Hutcheson, BS</List.Item>
              <List.Item>Yubin Park, PhD</List.Item>
              <List.Item>Daesung Choi, PhD</List.Item>
              <List.Item>Pooja Naik, B.Pharm</List.Item>
              <List.Item>Star Liu</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column>
            <List bulleted>
              <List.Item>Leanna Ehrlich, BA</List.Item>
              <List.Item>Neil K. Mehta, PhD</List.Item>
              <List.Item>Vince Marconi, MD</List.Item>
              <List.Item>Michael Kramer, PhD</List.Item>
              <List.Item>Rob O'Reilly, PhD</List.Item>
              <List.Item>Sanjana Pampati, MPH</List.Item>
              <List.Item>Joyce Ho, PhD</List.Item>
              <List.Item>Shabatun Jamila Islam, MD</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column>
            <List bulleted>
              <List.Item>Anurag Mehta, MD</List.Item>
              <List.Item>Aditi Nayak , MD</List.Item>
              <List.Item>Arshed Quyyumi , MD</List.Item>
              <List.Item>Yi-Ann Co, PhD</List.Item>
              <List.Item>Samaah Sullivan, MD</List.Item>
              <List.Item>Mohammed K. Ali, MD</List.Item>
            </List>
          </Grid.Column>
        </Grid>
        <Divider hidden/>
        <Header as='h2' style={{fontWeight: 400}}>
          <Header.Content>
            Support
          </Header.Content>
        </Header>
        <p>The COVID-19 Health Equity Dashboard was developed with seed funding from Emory University’s Woodruff Health Sciences and support from the Georgia Center for Diabetes Translation Research.</p>
        <Divider hidden/>
        <Header as='h2' style={{fontWeight: 400}}>
          <Header.Content>
            Feedback
          </Header.Content>
        </Header>
        <p>We strive to make this a user-friendly resource for policy makers, public health actors, the public, researchers, 
          and the media. Please share your feedback by mailing us at: 
          <a href="mailto:covid19dashboard@emory.edu"> covid19dashboard@emory.edu</a>
        </p>

        <Notes />

      </Container>
    </div>);
}
