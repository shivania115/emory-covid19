import React from "react";
import ErrorBoundary from "react-error-boundary";
import { Container, Menu, Image } from 'semantic-ui-react';

import { useHistory } from 'react-router-dom';


export default function AppBar(props) {

  const history = useHistory();

  return (
    <ErrorBoundary>
      <Menu borderless fixed='top'>
        <Container>
          <Menu.Item as='a' header onClick={() => history.push('/emory-covid19')}>
            <span style={{fontWeight: 400, color: '#002878', lineHeight: 1.3}}>
           COVID-19 Health Equity<br/>Interactive Dashboard
           </span>
          </Menu.Item>
          <Menu.Item 
            active={props.menu==='countyReport'} 
            content='Home'
            onClick={() => history.push('/emory-covid19')}
            name='countyReport'/>
          <Menu.Item 
            active={props.menu==='countyCompare'} 
            content='Compare Counties'
            onClick={() => history.push('/emory-covid19/compare-counties')}
            name='countyCompare'/>
          <Menu.Item 
            active={props.menu==='aboutUs'} 
            content='About Us'
            onClick={() => history.push('/emory-covid19/about-us')}
            name='aboutUs'/>            
          <Menu.Menu position='right'>
            <Menu.Item as='a' header>
              <Image size='small' src='/emory-covid19/logo.png' />
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    </ErrorBoundary>
  );
}



