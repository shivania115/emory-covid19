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
            <Image size='small' src='/emory-covid19/logo.png' style={{ marginRight: '1.5em'}} />
          </Menu.Item>
          <Menu.Item 
            active={props.menu==='countyReport'} 
            content='County Report'
            onClick={() => history.push('/emory-covid19')}
            name='countyReport'/>
          <Menu.Item 
            active={props.menu==='countyCompare'} 
            content='Compare Counties'
            onClick={() => history.push('/emory-covid19/compare-counties')}
            name='countyCompare'/>
        </Container>
      </Menu>
    </ErrorBoundary>
  );
}



