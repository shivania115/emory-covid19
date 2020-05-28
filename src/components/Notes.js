import React from 'react'
import { Grid, List, Divider, Image } from 'semantic-ui-react'

export default function Notes(props){

  return (
    <div style={{paddingTop: '2em', fontWeight: 300}}>
    <Divider/>
    <Grid>
      <Grid.Row>
        <Grid.Column style={{fontSize: '1em', lineHeight: '1.5em'}}>
          Early data about COVID-19 suggests that communities are affected very differently due to social determinants of health like population density, poverty, residential segregation, underlying chronic health conditions, and availability of medical services. 
          In order to predict how the epidemic will continue to unfold and prepare for the future, it is critical to understand differences in underlying risk factors. 
          There is no one-size-fits all approach to combat the epidemic, but accurate and meaningful data is a key component of a robust public health response that is informed by contextual factors and prioritizes health equity.
          <br/><br/>
          The COVID-19 Health Equity Dashboard seeks to fill the gaps in county-level data about the virus and underlying social determinants of health. 
          Our goal is for this Dashboard to facilitate easy comparisons of counties with respect to COVID-19 outcomes and social determinants. 
          We hope this becomes a valuable resource for and critical component of tailored public health responses to COVID-19 across the wide range of environments that Americans inhabit.
        </Grid.Column>
      </Grid.Row>
      <Divider hidden/>
      <Grid.Row columns={2}>
        <Grid.Column>          
          <Image size='small' src='/logo.png' />
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
