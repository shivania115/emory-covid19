import React from "react";
import ErrorBoundary from "react-error-boundary";
import { Container, Menu, Image } from 'semantic-ui-react';

import { useHistory } from 'react-router-dom';


export default function AppBar(props) {

  const history = useHistory();

  return (
    <ErrorBoundary>
      <Menu borderless inverted fixed='top'
        style={{backgroundImage: 'url("/Emory_COVID_header_LightBlue.jpg")',
                backgroundSize: 'cover'}}>
        <Container style={{width: '1290px'}}>
          <Menu.Item as='a' header onClick={() => history.push('/')}>
            <span style={{fontWeight: 400, color: '#fff', lineHeight: 1.3}}>
           COVID-19 Health Equity<br/>Interactive Dashboard
           </span>
          </Menu.Item>
          <Menu.Item 
            active={props.menu==='countyReport'} 
            content='Home'
            onClick={() => history.push('/')}
            name='countyReport'/>
          <Menu.Item 
            active={props.menu==='mapState'} 
            onClick={() => history.push('/map-your-state')}
            name='mapState'>
            Map Your State
          </Menu.Item>
          <Menu.Item 
            active={props.menu==='mediaHub'} 
            onClick={() => history.push('/mediaHub')}
            name='mediaHub'>
            Media Hub
          </Menu.Item>
          <Menu.Item 
            active={props.menu==='dataSources'} 
            onClick={() => history.push('/data-sources')}
            name='dataSources'>
            Data Sources &<br/>Interpretation
          </Menu.Item>
          <Menu.Item 
            active={props.menu==='aboutUs'} 
            content='About Us'
            onClick={() => history.push('/about-team')}
            name='aboutUs'/>            
          <Menu.Menu position='right'>
            <Menu.Item as='a' header>
              <Image size='small' src='/logo_white.png' />
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    </ErrorBoundary>
  );
}



