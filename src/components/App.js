// React
import React, {useEffect}from "react";
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
import {HEProvider} from './HEProvider';
import USVaccineTracker from "./USVaccineTracker";
import USVaccineTrackerPilot from "./USVaccineTrackerPilot";
import VaccineFAQ from "./VaccineFAQ";
import VaccineMap from "./VaccineMap";
import GDPHStateMap from "./GDPH/StateMap";
import GDPHCountyReport from "./GDPH/CountyReport";
import GDPHAboutUs from "./GDPH/AboutUs";
import GDPHDataSources from "./GDPH/DataSources";
import { StitchAuthProvider, useStitchAuth} from "./StitchAuth";

// import USMapPilot from "./USMapPilot";
import NationalReportPilot from "./NationalReportPilot";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


App.propTypes = {};
export default function App() {

  return (
    <StitchAuthProvider>
      <AppUI />
    </StitchAuthProvider>
  );
}

AppUI.propTypes = {};
function AppUI() {
  const {
    isLoggedIn,
    actions: { handleLogout, handleAnonymousLogin },
  } = useStitchAuth();

  useEffect(()=>{
    handleAnonymousLogin();
  });

  return (
    <HEProvider>
      <Router>
        <Switch>
          {/* GDPH urls */}
          <Route path='/Georgia/data-sources'>
            <GDPHDataSources />
          </Route>
          <Route path='/Georgia/about-team'>
            <GDPHAboutUs />
          </Route>
          <Route path='/Georgia/:countyFips'>
            <GDPHCountyReport />
          </Route>
          <Route path='/Georgia' component={GDPHStateMap} />


          {/* Main urls */}
          <Route path='/pilot-09-01-2020/national-report'>
            <NationalReportPilot />
          </Route>

          <Route path='/Vaccine-Tracker-Pilot03022021'>
            <USVaccineTrackerPilot />
          </Route>
          <Route path='/Vaccine-Tracker'>
            <USVaccineTracker />
          </Route>
          <Route path='/vaccine-map'>
            <VaccineMap />
          </Route>
          
          <Route path='/map-state'>
            <MapYourState />
          </Route>
          <Route path='/media-hub/blog/:blogTitle'>
            <Blog />
          </Route>
          <Route path='/media-hub/podcast/:podcastTitle'>
            <Podcast />
          </Route>
          <Route path='/media-hub'>
            <MediaHub />
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
      </HEProvider>
  );
}

