import React, { useEffect, useState, PureComponent} from 'react'
import { Container, Dropdown, Grid, Breadcrumb, Header, Loader, Divider, Accordion, Icon, Transition, Button} from 'semantic-ui-react'
import AppBar from './AppBar';
// import Geographies from './Geographies';
// import Geography from './Geography';
// import ComposableMap from './ComposableMap';
// import { Marker } from "react-simple-maps";

import {
    ComposableMap,
    Geographies,
    Geography,
    Marker
  } from "react-simple-maps";

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _, { toArray } from 'lodash';
import { scaleQuantile } from "d3-scale";
import fips2county from './fips2county.json'
import stateOptions from "./stateOptions.json";
import configs from "./state_config.json";
import racedatadate from "./Pre-Processed Data/racedatadate.json";

import { var_option_mapping, CHED_static, CHED_series} from "../stitch/mongodb";
import {HEProvider, useHE} from './HEProvider';
import {useStitchAuth} from "./StitchAuth";
import {LineChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, LabelList, ReferenceArea, ReferenceLine} from "recharts";




const colorPalette = [
        "#e1dce2",
        "#d3b6cd",
        "#bf88b5", 
        "#af5194", 
        "#99528c", 
        "#633c70", 
      ];
const countyColor = '#f2a900';
const stateColor = "#778899";
const nationColor = '#b1b3b3';

const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
  "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
];



export default function VaccineMap(props) {
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();  

  
  const history = useHistory();
  //let {stateFips} = useParams();
  let stateFips = "13";
  const [tooltipContent, setTooltipContent] = useState('');

  const [data, setData] = useState();
  const [dataTS, setDataTS] = useState();
  const [dataStateTS, setStateTS] = useState();
  const [raceData, setRaceData] = useState();

  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyFips, setCountyFips] = useState('');
  const [countyName, setCountyName] = useState('');
  
  const [colorScale, setColorScale] = useState();
  const [pctPositive, setPctPositive] = useState();
  // const [totalCases, setTotalCases] = useState();
  const [hospDaily, setHospDaily] = useState();
  const [percentChangeHospDaily, setPercentChangeHospDaily] = useState();
  const [index, setIndex] = useState();
  const [indexP, setIndexP] = useState();

  const [varMap, setVarMap] = useState({});
  const [metric, setMetric] = useState('caserate7dayfig');
  const [countyOption, setCountyOption] = useState();

  const [transform, setTransform] = useState();
  
  console.log("stateFips ", stateFips);


  const [delayHandler, setDelayHandler] = useState();


  //variable list & fips code to county name 
  useEffect(()=>{
    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        // setMetricOptions(_.filter(_.map(x, d=> {
        //   return {key: d.id, value: d.variable, text: d.name, group: d.group};
        // }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
      });

    fetch('/data/rawdata/f2c.json').then(res => res.json())
      .then(x => {
        setCountyOption(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.value, text: d.text, group: d.state};
        }), d => (d.group === stateFips && d.text !== "Augusta-Richmond County consolidated government" && d.text !== "Wrangell city and borough" && d.text !== "Zavalla city")));
      });
  }, []);


  // mongo
  useEffect(()=>{
    //if (metric) {

    if (isLoggedIn === true){
        const configMatched = configs.find(s => s.fips === stateFips);
      
        if (!configMatched){
            history.push('/_nation');
        } else{
        //   let newDict = {}; 
          console.log("configMatched.offsetX", configMatched.offsetX);
          setConfig(configMatched);
        //   setTransform("translate(" + configMatched.offsetX + "," + configMatched.offsetY + ")")
          setTransform("translate(-900, -400)")
          setStateName(configMatched.name);
        //   const fetchData = async() => { 
        //     if(stateFips !== "_nation"){
        //       //all static data
        //       const staticQ = {all: "all"};
        //       const promStatic = await CHED_static.find(staticQ,{projection:{}}).toArray();

        //       promStatic.forEach(i=> {
        //         if(i.tag === "nationalrawfull"){ //nationalraw
        //           newDict = i.data;
        //           setData(newDict); 
        //         }else if(i.tag === "racedataAll"){ //race data
        //           setRaceData(i.racedataAll);       
        //         }
        //       });
                    
          
        //       const stateSeriesQ = {tag: "stateonly"};
        //       const promState = await CHED_series.find(stateSeriesQ,{projection:{}}).toArray();
        //       let stateSeriesDict = promState[0].timeseriesAll[stateFips];
        //       setStateTS(stateSeriesDict);

        //       }
              

        //     let seriesDict = {};
        //     let countyMost = '';
        //     if( stateFips !== "_nation"){
        //       //Timeseries data
        //       const seriesQ = { $or: [ { state: "_n" } , { state: stateFips } ] }
        //       const prom = await CHED_series.find(seriesQ, {projection: {}}).toArray();
        //       _.map(prom, i=> {
        //         seriesDict[i[Object.keys(i)[4]]] = i[Object.keys(i)[5]];
        //         return seriesDict;
        //       });
        //       _.each(seriesDict, (v, k)=>{

        //       });
        //     }
        //     setCountyFips(countyMost);
        //     if(stateFips !== "_nation"){
        //       setCountyName(fips2county[stateFips+countyMost]);
        //       //setBarCountyName((fips2county[stateFips+countyMost]).match(/\S+/)[0]);
        //     }
            
        //     setDataTS(seriesDict);
        //   };
        //   fetchData();
        }
          
        } else {
          handleAnonymousLogin();
        
      }
    //}
  },[isLoggedIn]);
  console.log("config ", config);
  console.log("tranform ", transform);

//   useEffect(() => {
//     if(stateFips !== "_nation"){
//       let scaleMap = {};
//       var max = 0;
//       var min = 100;
//       const cs = scaleQuantile()
//       .domain(_.map(_.filter(data, 
//         d => (
//             d[metric] > 0 &&
//             d.fips.length === 5)),
//         d=> d[metric]))
//       .range(colorPalette);

//       _.each(data, d=>{
//         if(d[metric] > 0){
//         scaleMap[d[metric]] = cs(d[metric])}});
//       setColorScale(scaleMap);
//       setLegendSplit(cs.quantiles());

//       //find the largest value and set as legend max
//       _.each(data, d=> { 
//         if (d[metric] > max && d.fips.length === 5) {
//           max = d[metric]
//         } else if (d.fips.length === 5 && d[metric] < min && d[metric] >= 0){
//           min = d[metric]
//         }
//       });

//       if (max > 999999) {
//         max = (max/1000000).toFixed(0) + "M";
//         setLegendMax(max);
//       }else if (max > 999) {
//         max = (max/1000).toFixed(0) + "K";
//         setLegendMax(max);
//       }else{
//         setLegendMax(max.toFixed(0));
//       }
//       setLegendMin(min.toFixed(0));
//     }

//   }, [metric, data]);


  //set date
//   useEffect(() => {
//     if (dataTS && dataTS[stateFips]){
//       setCovidMetric(_.takeRight(dataTS[stateFips])[0]);
//     }
//   }, [dataTS]);

  const markers = [
    {
      markerOffset: 0,
      name: "230",
      coordinates: [-81.4865, 31.1979]
    },
    { markerOffset: 0, name: "111", coordinates: [-83.8838, 32.5556] },
    // { markerOffset: 0, name: "233", coordinates: [-83.8788, 32.5647] },
    { markerOffset: 0, name: "235", coordinates: [-84.1549, 31.5906] },
    { markerOffset: 0, name: "115", coordinates: [-83.2166, 34.3630] }
  ];


  // if (stateFips === "_nation" || (data && metric && trendOptions && trendline)) {
  // if (stateFips === "_nation" || (data && metric && trendOptions && trendline && dataTS)) {
    if (config) {
    console.log( dataTS);
    return(
    <HEProvider>
    <div>
      
        <AppBar menu='vaccinemap'/>
        <Container style={{marginTop: '10em', minWidth: '1260px'}}>

        <Grid>
        <Header>Vaccination Sites</Header>
        </Grid>

        <Grid >
            <ComposableMap projection="geoAlbersUsa" 
            //projectionConfig={{scale:`${config.scale*0.7}`}} 
            projectionConfig={{
                // rotate: [-100, 20, 0],
                scale: 4000,
              }}
            width={800} 
            height={500} 
            strokeWidth = {0.1}
            stroke = 'black'
            data-tip=""
            // offsetx={config.offsetX}
            // offsety={config.offsetY}
            >
            <Geographies geography={config.url} transform={transform}>
                {({geographies}) => geographies.map(geo =>
                <Geography 
                    key={geo.rsmKey} 
                    geography={geo} 
                    
                    // onClick link
                    // onClick={()=>{
                    // if(stateFips !== "_nation"){
                    //     history.push("/" + stateFips + "/" +geo.properties.COUNTYFP);
                    // }
                    // }}

                    // onMouseEnter={()=>{setDelayHandler(setTimeout(() => {
                    // if(stateFips !== "_nation"){
                    //     setCountyFips(geo.properties.COUNTYFP);
                    //     setCountyName(fips2county[stateFips + geo.properties.COUNTYFP]);
                    //     setBarCountyName((fips2county[stateFips + geo.properties.COUNTYFP]).match(/\S+/)[0]);
                    //     }
                    // }, 300))
                    
                    // }}
                    // onMouseLeave={()=>{
                    // if(stateFips !== "_nation"){
                    //     clearTimeout(delayHandler);

                    //     setTooltipContent("")
                    // }
                    // }}
                    
                    // fill={(stateFips === "_nation" || stateFips === "72")? "#FFFFFF" :countyFips===geo.properties.COUNTYFP?countyColor:
                    //     ((colorScale && data[stateFips+geo.properties.COUNTYFP] && (data[stateFips+geo.properties.COUNTYFP][metric]) > 0)?
                    //         colorScale[data[stateFips+geo.properties.COUNTYFP][metric]]: 
                    //         (colorScale && data[stateFips+geo.properties.COUNTYFP] && data[stateFips+geo.properties.COUNTYFP][metric] === 0)?
                    //         '#e1dce2':'#FFFFFF')}
                    fill = 'white'
                    />
                )}
            </Geographies>
            {markers.map(({ name, coordinates, markerOffset }) => (
                <Marker key={name} coordinates={coordinates} onClick={() => {
                    window.open("https://maps.google.com?q="+coordinates[1]+","+coordinates[0]);
                  }}>
                <circle r={3} z-index={10} fill="#FF5533" stroke="#FF5533" strokeWidth={2} transform='translate(-900, -414)'/>
                <g
                    fill="none"
                    stroke="#FF5533"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    // transform={transform}
                    transform="translate(-912, -424)"
                >
                    {/* <circle cx="12" cy="10" r="3" transform={transform}/> */}
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                </g>
                <text
                    textAnchor="middle"
                    y={markerOffset}
                    transform={transform}
                    style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: 10 }}
                >
                    {name}
                </text>
                </Marker>
            ))}
            </ComposableMap>
            </Grid>
        </Container>
      
    </div>
    </HEProvider>
    );
} else {
        return <Loader active inline='centered' />
    }
}
