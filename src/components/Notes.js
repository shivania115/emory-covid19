import React from 'react'
import { Grid, List, Divider, Image } from 'semantic-ui-react'

export default function Notes(props){

  return (
    <div style={{paddingTop: '2em', fontWeight: 300}}>
    <Divider/>
    <Grid>
      <Grid.Row>
        <Grid.Column style={{fontSize: '1.2em', lineHeight: '1.5em'}}>
          Early data about COVID-19 suggests that communities are affected very differently due to social determinants of health like population density, poverty, residential segregation, underlying chronic health conditions, and availability of medical services. 
          In order to predict how the epidemic will continue to unfold and prepare for the future, it is critical to understand differences in underlying risk factors. 
          There is no one-size-fits all approach to combat the epidemic, but accurate and meaningful data is a key component of a robust public health response that is informed by contextual factors and prioritizes health equity.
          <br/><br/>
          The COVID-19 Health Equity Dashboard seeks to fill the gaps in county-level data about the virus and underlying social determinants of health. 
          Our goal is for this Dashboard to become a valuable resource for and critical component of tailored public health responses to COVID-19 across the wide range of environments that Americans inhabit. 
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <b>Data Sources</b><br/>
          <List as='ul'>
            <List.Item as='li'><a href="https://covidtracking.com/data">The COVID Tracking Project by The Atlantic</a></List.Item>
            <List.Item as='li'><a href="https://www.census.gov/programs-surveys/acs">American Community Survey by the U.S. Census Bureau</a></List.Item>
            <List.Item as='li'>The Center for Systems Science and Engineering at Johns Hopkins University</List.Item>
            <List.Item as='li'>The Institute for Health Metrics and Evaluation</List.Item>
            <List.Item as='li'>American Hospital Association</List.Item>
            <List.Item as='li'>Centers for Disease Control and Prevention</List.Item>
          </List>
        </Grid.Column>
        <Grid.Column>
          <b>Variable Definitions</b><br/>
          <List as='ul'>
            <List.Item as='li'><b>COVID Case Rate / 1M</b>: COVID-19 positive case rate per one million people.</List.Item>
            <List.Item as='li'><b>COVID Mortality / 100k</b>: Deaths due to COVID-19 per one hundred thousand people.</List.Item>
            <List.Item as='li'><b># of Primary Care / 1M</b>: Number of primary care doctors per one million people, reported in 2016.</List.Item>
            <List.Item as='li'><b>% Diabetes</b>: Percent of population with diabetes, reported in 2016</List.Item>
            <List.Item as='li'><b>% Obesity</b>: Percent of population with obesity, reported in 2016</List.Item>
            <List.Item as='li'><b>% Hispanics</b>: Percent of Hispanic population, reported in 2010</List.Item>
            <List.Item as='li'><b>% Blacks</b>: Percent of African American population, reported in 2010</List.Item>
            <List.Item as='li'><b>% Poverty</b>: Percent of population with poverty, reported in 2010. For more information, please see 
              "<a href="https://www.census.gov/topics/income-poverty/poverty/guidance/poverty-measures.html">How the Census Bureau Measures Poverty</a>"</List.Item>
            <List.Item as='li'><b>% Unemployed</b>: Percent of unemployed population, reported between 2006 and 2010.</List.Item>
            <List.Item as='li'><b>% Over 65 Yrs</b>: Percent of population with over 65 years old, reported in 2017.</List.Item> 
            <List.Item as='li'><b>% Long Commute</b>: Percent of population who need long commute-driving alone, reported between 2009 and 2013.</List.Item>                                       
          </List>
        </Grid.Column>
      </Grid.Row>
      <Divider hidden/>
      <Grid.Row columns={2}>
        <Grid.Column>          
          <Image size='small' src='/emory-covid19/logo.png' />
          &copy; 2020 Emory University. All rights reserved.
        </Grid.Column>
        <Grid.Column>          
          <small>
            This dashboard is created using
            <List as='ol'>
              <List.Item as='li' value='-'><a href="https://www.react-simple-maps.io/">React Simple Maps</a> by <a href="https://www.zcreativelabs.com/">z creative labs</a></List.Item>
              <List.Item as='li' value='-'><a href="https://formidable.com/open-source/victory/">Victory</a> by <a href="https://formidable.com/">Formidable</a></List.Item>
              <List.Item as='li' value='-'><a href="https://github.com/Semantic-Org/Semantic-UI-React">Semantic UI React</a> by <a href="https://github.com/levithomason">@levithomason</a>and an amazing community of <a href="https://github.com/Semantic-Org/Semantic-UI-React/graphs/contributors">contributors</a></List.Item> 
              <List.Item as='li' value='-'><a href="https://github.com/facebook/create-react-app">Create React App</a> by <a href="https://about.fb.com/company-info/">Facebook</a></List.Item> 
            </List>
          </small>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    </div>);
}
