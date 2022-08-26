import React, { useEffect, useState, useRef, createRef, PureComponent } from 'react'
import { Container, Breadcrumb, Dropdown, Header, Grid, Progress, Loader, Divider, Popup, Table, Button, Image, Rail, Sticky, Ref, Segment, Accordion, Icon, Menu, Message, Transition, List } from 'semantic-ui-react'
import AppBar from './AppBar';
import { geoCentroid } from "d3-geo";
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import Marker from './Marker';
import Annotation from './Annotation';
import { Waypoint } from 'react-waypoint'
import stateOptions from "./stateOptions.json";
import ReactTooltip from "react-tooltip";
import VaccinesFAQ from './VaccineFAQPilot';
//asdjflkasjd
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   Marker,
//   Annotation
// } from "react-simple-maps";
import allStates from "./allstates.json";

// import FileSaver from "file-saver";
// import { getPngData, useRechartToPng } from "recharts-to-png";
// import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';

import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  VictoryLegend,
  VictoryLine,
  VictoryScatter,
  VictoryLabel,
  VictoryTooltip,
  VictoryArea,
  VictoryContainer,
  VictoryVoronoiContainer
} from 'victory';
import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import _, { map } from 'lodash';
import { scaleQuantile } from "d3-scale";
import configs from "./state_config.json";
// import ReactDOM from 'react-dom';
import fips2county from './fips2county.json'
// import stateOptions from "./stateOptions.json";

import { var_option_mapping, CHED_static, CHED_series } from "../stitch/mongodb";
import { HEProvider, useHE } from './HEProvider';
import { useStitchAuth } from "./StitchAuth";
import { LineChart, Line, Area, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, Cell, PieChart, Pie, LabelList, ReferenceArea, ReferenceLine } from "recharts";

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBarMU from '@material-ui/core/AppBar';
import TabsMU from '@material-ui/core/Tabs';
import TabMU from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const DecisionAid = (props) => {

    return(
        <HEProvider>
        <AppBar menu='vaccineTracker' />
      
        </HEProvider>
    )
}
export default DecisionAid;