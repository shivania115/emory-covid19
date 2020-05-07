// React
import React from "react";
// Components & Hooks
import USMap from "./USMap";
import StateMap from "./StateMap";
import CountyReport from "./CountyReport";
import 'semantic-ui-css/semantic.min.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


App.propTypes = {};
export default function App() {

  return (
      <Router>
        <Switch>
          <Route path='/emory-covid19/:stateFips/:countyFips'>
            <CountyReport />
          </Route>  
          <Route path='/emory-covid19/:stateFips'>
            <StateMap />
          </Route>
          <Route path='/emory-covid19'>
            <USMap />
          </Route>
          <Route path="*">
            <Redirect to='/emory-covid19/'/>
          </Route>
        </Switch>
      </Router>
  );
}

