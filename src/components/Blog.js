import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header, Table } from 'semantic-ui-react'

export default function DataSources(props){

  return (
    <div>
      <AppBar menu='blog'/>
      <Container style={{marginTop: '8em', minWidth: '1260px'}}>
        <Header as='h2' style={{fontWeight: 400}}>
          <Header.Content>
            Talk COVID
          </Header.Content>
        </Header>
        <Divider hidden/>
        <Table basic='very' style={{fontWeight: 400}}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={6}>Description</Table.HeaderCell>
              <Table.HeaderCell width={2}></Table.HeaderCell>
              <Table.HeaderCell width={10}>Watch Video</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Emory COVID-19 Health Equity Interactive Dashboard Tutorial</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell> <iframe width="560" height="315" src="https://www.youtube.com/embed/PmI42rHnI6U" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>COVID-19 in Southwest Native American Communities: A Brief Overview</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell> <iframe width="560" height="315" src="https://www.youtube.com/embed/U-Aqx7vQocY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>COVID-19 in African American Communities: A Brief Overview</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell> <iframe width="560" height="315" src="https://www.youtube.com/embed/0eFjhnDQe6g" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></Table.Cell>
            </Table.Row>
            
            
          </Table.Body>
        </Table>
        <Notes />
      </Container>
    </div>);
}
