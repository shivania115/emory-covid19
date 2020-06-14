// React
import React from "react";
// Components & Hooks
import USMap from "./USMap";
import StateMap from "./StateMap";
import CountyReport from "./CountyReport";
import CountyCompare from "./CountyCompare";
import AboutUs from "./AboutUs";
import DataSources from "./DataSources";
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
          <Route path='/compare-counties'>
            <CountyCompare />
          </Route>

          <Route path='/about-team'>
            <AboutUs />
          </Route>
          <Route path='/data-sources'>
            <DataSources />
          </Route>          
          <Route path='/:stateFips/:countyFips'>
            <CountyReport />
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
  );
}

