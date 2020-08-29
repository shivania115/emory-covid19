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
                backgroundSize: 'cover'}}>
      {/* <Menu borderless inverted fixed='top'
        style={{backgroundImage: 'url("https://www.htmlcsscolor.com/preview/128x128/103052.png")',
                backgroundSize: 'cover'}}> */}
        <Container>
          <Menu.Item as='a' header>
                <Image size='mini' src='https://dph.georgia.gov/themes/custom/ga_forest/orchard/assets/images/icons/logo/ga-logo--gold.svg' />
          </Menu.Item>
          
          <Menu.Item as='a' header onClick={() => history.push('/')}>
            <span style={{fontSize: '17px',fontWeight: 400, color: '#fff', lineHeight: 1.3}}>
           <strong>Georgia Department</strong>
           <br></br>
           <em>of</em>
           <strong>&nbsp;Public Health</strong>
           </span>
          </Menu.Item>
          <Menu.Item 
            active={props.menu==='countyReport'} 
            content='Home'
            onClick={() => history.push('/13')}
            name='countyReport'/>
          {/* <Menu.Item 
            active={props.menu==='countyCompare'} 
            onClick={() => history.push('/compare-counties')}
            name='countyCompare'>
            Compare Counties
          </Menu.Item> */}
          {/* <Menu.Item 
            active={props.menu==='dataSources'} 
            onClick={() => history.push('/data-sources')}
            name='dataSources'>
            Data Sources &<br/>Interpretation
          </Menu.Item>
          <Menu.Item 
            active={props.menu==='aboutUs'} 
            content='About Us'
            onClick={() => history.push('/about-team')}
            name='aboutUs'/>             */}
          {/* <Menu.Menu position='left'>
            <Menu.Item as='a' header>
              <Image size='mini' src='https://dph.georgia.gov/themes/custom/ga_forest/orchard/assets/images/icons/logo/ga-logo--gold.svg' />
            </Menu.Item>
          </Menu.Menu> */}
        </Container>
      </Menu>
    </ErrorBoundary>
  );
}



