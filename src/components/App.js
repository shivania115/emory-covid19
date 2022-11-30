// React
import React, { useEffect } from "react";
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
import "semantic-ui-css/semantic.min.css";
import { HEProvider } from "./HEProvider";
import USVaccineTracker from "./USVaccineTracker";
import USVaccineTrackerPilot from "./USVaccineTrackerPilot";
import VaccineFAQ from "./VaccineFAQ";
import VaccineMap from "./VaccineMap";
import { default as GDPHStateMap } from "./GDPH/StateMap";
import GDPHCountyReport from "./GDPH/CountyReport";
import GDPHAboutUs from "./GDPH/AboutUs";
import GDPHDataSources from "./GDPH/DataSources";
import { StitchAuthProvider, useStitchAuth } from "./StitchAuth";
import USMapPilot from "./USMapPilot";
// import USMapPilot from "./USMapPilot";
import NationalReportPilot from "./NationalReportPilot";
import NationalReport from "./NationalReport";
import Variant from "./Variant";
import OtherTools from "./OtherTools";
import DecisionAid from "./DecisionAid.js";
import "bootstrap/dist/css/bootstrap.min.css";
import ExcessDeath from "./ExcessDeath";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

  useEffect(() => {
    handleAnonymousLogin();
  });

  return (
    <HEProvider>
      <Router>
        <Routes>
          {/* GDPH urls */}
          <Route
            path="/Georgia/data-sources"
            element={<GDPHDataSources />}
          ></Route>
          <Route path="/Georgia/about-team" element={<GDPHAboutUs />}></Route>
          <Route
            path="/Georgia/:countyFips"
            element={<GDPHCountyReport />}
          ></Route>
          <Route path="/Georgia" element={<GDPHStateMap />} />

          {/* Main urls */}
          <Route path="/national-report" element={<NationalReport />}></Route>
          <Route
            path="/national-report123321"
            element={<NationalReportPilot />}
          ></Route>
          <Route path="/variants" element={<Variant />}></Route>
          <Route path="/other-tools" element={<OtherTools />}></Route>
          <Route
            path="/Vaccine-Tracker-Pilot03022021"
            element={<USVaccineTrackerPilot />}
          ></Route>
          <Route path="/US-Map-Pilot-12312" element={<USMapPilot />}></Route>
          
          <Route path="/Vaccine-Tracker" element={<USVaccineTracker />}></Route>
          <Route path="/vaccine-map" element={<VaccineMap />}></Route>
          <Route path="/map-state" element={<MapYourState />}></Route>

          <Route path="/decision-aid/:step" element={<DecisionAid />}></Route>
          <Route path="/ExcessDeath" element={<ExcessDeath />}></Route>
          <Route path="/media-hub/blog/:blogTitle" element={<Blog />}></Route>
          <Route
            path="/media-hub/podcast/:podcastTitle"
            element={<Podcast />}
          ></Route>
          <Route path="/media-hub" element={<MediaHub />}></Route>
          <Route path="/about-team" element={<AboutUs />}></Route>
          <Route path="/privacy" element={<Privacy />}></Route>
          <Route path="/data-sources" element={<DataSources />}></Route>

          <Route
            path="/:stateFips/:countyFips"
            element={<CountyReport />}
          ></Route>
          <Route path="/:stateFips" element={<StateMap />}></Route>
          <Route path="/" element={<USMap />}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </Router>
    </HEProvider>
  );
}
