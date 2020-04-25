// React
import React from "react";
// Components & Hooks
import USMap from "./USMap";
import StateMap from "./StateMap";
import CountyMap from "./CountyMap";
import { StitchAuthProvider, useStitchAuth } from "./StitchAuth";
import 'semantic-ui-css/semantic.min.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { 
  Loader, 
  Dimmer,
} from 'semantic-ui-react';

App.propTypes = {};
export default function App() {

  return (
    <StitchAuthProvider>
      <Router>
        <Switch>
          <Route path='/:stateFips/:countyFips'>
            <CountyMap />
          </Route>  
          <Route path='/:stateFips'>
            <StateMap />
          </Route>
          <Route path='/'>
            <USMap />
          </Route>
          <Route path="*">
            <Redirect to='/'/>
          </Route>
        </Switch>
      </Router>
    </StitchAuthProvider>
  );
}

