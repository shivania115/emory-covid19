import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header } from 'semantic-ui-react'

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

        <List>
          <List.Item>
            <List.Header>Shivani A. Patel, PhD</List.Header>
            Assitant Professor of Global Health at the Rollins School of Public Health
          </List.Item>
          <List.Item>
            <List.Header>K. M. Venkat Narayan, MD</List.Header>
            OC Hubert Professor of Global Health and Epidemiology, Rollins School of Public Health
          </List.Item>
          <List.Item>
            <List.Header>Carlos Del Rio, MD</List.Header>
            Professor of Medicine in the Division of Infectious Diseases at Emory University School of Medicine
          </List.Item>
          <List.Item>
            <List.Header>Neil K. Mehta, PhD</List.Header>
            Assistant Professor of Health Management and Policy at University of Michigan
          </List.Item>
          <List.Item>
            <List.Header>Vince Marconi, MD</List.Header>
            Professor of Medicine at Emory University
          </List.Item>
          <List.Item>
            <List.Header>Michael Kramer, PhD</List.Header>
            Associate Professor of Epidemiology at Emory University
          </List.Item>
          <List.Item>
            <List.Header>Rob O'Reilly, PhD</List.Header>
            Numeric Data Services Leader at the Emory Center for Digital Scholarship
          </List.Item>
          <List.Item>
            <List.Header>Joyce Ho, PhD</List.Header>
            Assistant Professor of Computer Science at Emory University
          </List.Item>
          <List.Item>
            <List.Header>Yubin Park, PhD</List.Header>
            Principal at Bonsai Research, LLC. Software development lead for the COVID-19 Health Equity Interactive Dashboard.
          </List.Item>
          <List.Item>
            <List.Header>Daesung Choi, PhD</List.Header>
            Postdoctoral Research Associate in the Department of Global Health at Emory University
          </List.Item>
          <List.Item>
            <List.Header>Jing Zhang, PhD student</List.Header>
            Department of Computer Science at Emory University
          </List.Item>
          <List.Item>
            <List.Header>Mark Hutcheson</List.Header>
            Managing Director at Emory Global Diabetes Research Center
          </List.Item>
        </List>
      <Notes />
      </Container>
    </div>);
}
