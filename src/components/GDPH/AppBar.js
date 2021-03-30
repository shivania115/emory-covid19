import React from "react";
import ErrorBoundary from "react-error-boundary";
import { Container, Menu, Image, Divider } from 'semantic-ui-react';

import { useHistory } from 'react-router-dom';


export default function AppBar(props) {

  const history = useHistory();

  return (
    <ErrorBoundary>
      <Menu borderless inverted fixed='top'
        style={{backgroundImage: 'url("/Emory_COVID_header_LightBlue.jpg")',
                backgroundSize: 'cover',
                fontSize: "15pt"}}>

        <Container style={{width: '1305px'}}>
          <Menu.Item as='a' header onClick={() => history.push('/Georgia')}>
            <span style={{fontSize: '15pt',fontWeight: 400, color: '#fff', lineHeight: 1.3}}>
           <strong>Georgia COVID-19</strong>
           <br></br>
           <strong>Health Equity Dashboard</strong>
           </span>
          </Menu.Item>
          <Menu.Item 
            content='Home'
            onClick={() => history.push('/')}
            name='countyReport'/>
            <Menu.Item 
            active={props.menu==='dataSources'} 
            content='Data Sources'
            onClick={() => history.push('/Georgia/data-sources')}
            name='dataSources'/>   
          <Menu.Item 
            active={props.menu==='aboutUs'} 
            content='Contact Us'
            onClick={() => history.push('/Georgia/about-team')}
            name='aboutUs'/>   



          <Menu.Menu position='right'>
          <Menu.Item as='a' header>
              <Image size='small' src='/logo_white.png' />
            </Menu.Item>
          <Menu.Item as='a' header>
              <Image size='tiny' src='/data/GDPH/rols.png'/>
            </Menu.Item>
            </Menu.Menu>
          
        </Container>
      </Menu>
    </ErrorBoundary>
  );
}



