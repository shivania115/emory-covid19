// React
import React from "react";
// Components & Hooks
import USMap from "./USMap";
import StateMap from "./StateMap";
import CountyReport from "./CountyReport";
import MapYourState from "./MapState";
import AboutUs from "./AboutUs";
import MediaHub from "./MediaHub";
import DataSources from "./DataSources";
import Privacy from "./Privacy";
import Blog from "./Blog";
import Podcast from "./Podcast";
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
          <Route path='/map-your-state'>
            <MapYourState />
          </Route>
          <Route path='/media-hub/blog/:blogTitle'>
            <Blog />
          </Route>
          <Route path='/media-hub/podcast/:podcastTitle'>
            <Podcast />
          </Route>
          <Route path='/about-team'>
            <AboutUs />
          </Route>
          <Route path='/privacy'>
            <Privacy />
          </Route>
          <Route path='/data-sources'>
            <DataSources />
          </Route>    
          <Route path='/mediahub'>
            <MediaHub />
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

