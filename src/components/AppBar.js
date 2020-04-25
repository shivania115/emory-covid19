import React, { useState, useEffect } from "react";
import ErrorBoundary from "react-error-boundary";
import { useStitchAuth } from "./StitchAuth";
import { Container, Menu, Image, Dropdown, Button } from 'semantic-ui-react';
import Jdenticon from 'react-jdenticon';
import { users } from "../stitch";
import { useHistory } from "react-router-dom";

export default function Appbar(props) {
  
  const { currentUserName, actions} = useStitchAuth();
  const history = useHistory();

  return (
    <ErrorBoundary>
      <Menu borderless fixed='top'>
        <Container>
          <Menu.Item as='a' header>
            <Image size='small' src='/logo.png' style={{ marginRight: '1.5em'}} />
          </Menu.Item>
          <Menu.Item>
            COVID-19 Interactive Data Diver
          </Menu.Item>
        </Container>
      </Menu>
    </ErrorBoundary>
  );
}



