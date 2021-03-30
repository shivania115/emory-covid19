import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header, Table } from 'semantic-ui-react'

export default function DataSources(props){

  return (
    <div>
      <AppBar menu='dataSources'/>
      <Container style={{marginTop: '8em', minWidth: '1260px'}}>
        <Header as='h1' style={{paddingTop: 16, fontWeight: 400, fontSize: "24pt"}}>

          <Header.Content>
            Data Sources
          </Header.Content>
        </Header>
        <Table basic='very' style={{fontWeight: 400, fontSize: "14pt"}}>
          <Table.Header>
          <Table.Row>
              <Table.HeaderCell colSpan='2' width={15}>Individual-level data (presented as aggregated summaries)</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell width={3}>Measure</Table.HeaderCell>
              <Table.HeaderCell width={5}>Data Source</Table.HeaderCell>
            </Table.Row>
            
            </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Covid-19 case and death data</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> The Covid-19 outcome data for this dashboard were supplied by the Georgia Department of Public Health. The contents herein do not necessarily represent the official views of, nor an endorsement by, the Georgia Department of Public Health
               </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Table basic='very' style={{fontWeight: 400, fontSize: "14pt"}}>
          <Table.Header>
          <Table.Row>
              <Table.HeaderCell colSpan='2' width={15}>County level data</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell width={3}>Measure</Table.HeaderCell>
              <Table.HeaderCell width={5}>Data Source</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Socioeconomic Vulnerability
              <br></br>
            (range: 0-1; 1 indicates highest vulnerability)
            </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> <a style ={{color: "#397AB9"}} href="https://precisionforcovid.org/ccvi" target="_blank" rel="noopener noreferrer">Surgo Foundation </a> </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Minority/Language Vulnerability
              <br></br>
            (range: 0-1; 1 indicates highest vulnerability)
            </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>  <a style ={{color: "#397AB9"}} href="https://precisionforcovid.org/ccvi" target="_blank" rel="noopener noreferrer">Surgo Foundation </a></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Housing/Transportaion & Household Composition & Disability Vulnerability
              <br></br>
            (range: 0-1; 1 indicates highest vulnerability)
            </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>  <a style ={{color: "#397AB9"}} href="https://precisionforcovid.org/ccvi" target="_blank" rel="noopener noreferrer">Surgo Foundation </a></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Epidemiological Factors
              <br></br>
            (range: 0-1; 1 indicates highest vulnerability)
            </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>  <a style ={{color: "#397AB9"}} href="https://precisionforcovid.org/ccvi" target="_blank" rel="noopener noreferrer">Surgo Foundation </a></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Healthcare System Factors
              <br></br>
            (range: 0-1; 1 indicates highest vulnerability)
            </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>  <a style ={{color: "#397AB9"}} href="https://precisionforcovid.org/ccvi" target="_blank" rel="noopener noreferrer">Surgo Foundation </a></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>High Risk Environments
              <br></br>
            (range: 0-1; 1 indicates highest vulnerability)
            </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>  <a style ={{color: "#397AB9"}} href="https://precisionforcovid.org/ccvi" target="_blank" rel="noopener noreferrer">Surgo Foundation </a></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Population Density Factors
              <br></br>
            (range: 0-1; 1 indicates highest vulnerability)
            </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>  <a style ={{color: "#397AB9"}} href="https://precisionforcovid.org/ccvi" target="_blank" rel="noopener noreferrer">Surgo Foundation </a></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% American Natives </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> <a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Minority</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% in Poverty</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Uninsured</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Diabetes</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>CDC's<a style ={{color: "#397AB9"}} href="https://www.cdc.gov/diabetes/data/index.html" target="_blank" rel="noopener noreferrer"> Division of Diabetes Translation </a> </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Obesity</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>CDC's <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/diabetes/data/index.html" target="_blank" rel="noopener noreferrer"> Division of Diabetes Translation </a></Table.Cell>
              </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% over 65 y/o</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% in Group Quarters</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Male</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Population</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/nchs/nvss/bridged_race.htm#Newest%20Data%20Release" target="_blank" rel="noopener noreferrer">Bridged-race population estimates </a> by The National Center for Health Statistics </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Population Density</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Household Income</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau </Table.Cell>
            </Table.Row>           
          </Table.Body>
        </Table>
        
       
      </Container>
    </div>);
}
