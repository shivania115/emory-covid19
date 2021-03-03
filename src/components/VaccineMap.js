import React, { useEffect, useState, PureComponent, createRef} from 'react'
import { Container, Dropdown, Grid, Breadcrumb, Header, Loader, Divider, Accordion, Icon, Transition, Button, Card} from 'semantic-ui-react'
import AppBar from './AppBar';
// import Geographies from './Geographies';
// import Geography from './Geography';
// import ComposableMap from './ComposableMap';
// import { Marker } from "react-simple-maps";

import {
    ComposableMap,
    ZoomableGroup,
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
// import vaccine_site_geocoded from "./vaccine_site_geocoded.json";

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


function CountySites(props) {
  const county = props.county;
  const siteData = props.siteData;
  console.log("selectedCounty", county)
  
  const CardGroup = _.filter(siteData, {'county':county+' County'}).map((obj, index) =>
    <Card 
      href={"https://maps.google.com?q="+obj.address}
      target='_blank'
      key={index}
      header={obj.address}
      // meta='Friend'
      description='Click to view on Google Map'
    />
    )
  
  return (
    <Card.Group style={{width:'280px', paddingTop:'2rem'}}>
      {CardGroup}
    </Card.Group>
  )
}


export default function VaccineMap(props) {
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();  

  const dropdownRef = createRef();
  
  const history = useHistory();
  //let {stateFips} = useParams();
  let stateFips = "13";
  const [tooltipContent, setTooltipContent] = useState("");
  // const [hoverMarker, setHoverMarker] = useState('');
  const [countyList, setCountyList] = useState([]);
  const [countySelected, setCountySelected] = useState([]);
  const [resultHeight, setResultHeight] = useState();

  const [siteData, setSiteData] = useState();
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

  var transform = [-900,-420];
  
  console.log("stateFips ", stateFips);


  const [delayHandler, setDelayHandler] = useState();
  

  //variable list & fips code to county name 
  useEffect(()=>{
    // fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
    //   .then(x => {
    //     setVarMap(x);
    //     // setMetricOptions(_.filter(_.map(x, d=> {
    //     //   return {key: d.id, value: d.variable, text: d.name, group: d.group};
    //     // }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
    //   });

    // fetch('/data/rawdata/f2c.json').then(res => res.json())
    //   .then(x => {
    //     setCountyOption(_.filter(_.map(x, d=> {
    //       return {key: d.id, value: d.value, text: d.text, group: d.state};
    //     }), d => (d.group === stateFips && d.text !== "Augusta-Richmond County consolidated government" && d.text !== "Wrangell city and borough" && d.text !== "Zavalla city")));
    //   });

    // fetch('data/vaccine_site_geocoded.json',{
    //   headers : { 
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //    }

    // }).then(res => res.json())
    //     .then(x => {
    //       setSiteData(
    //         _.map(x, d=> {
    //           return {name: d.id, address: d.address, coordinates: [d.lon, d.lat]};
    //         })
    //       );
    //   }).then(text => console.log(text))
    //   .catch(err => {
    //     // Do something for an error here
    //     console.log("Error Reading data " + err);
    //   });


      fetch('data/vaccinesite_0301_cleaned.json',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
  
      }).then(res => res.json())
          .then(x => {
            setSiteData(
              _.map(x, d=> {
                return {address: d.Address, county: d.County, coordinates: [d.Longitude, d.Latitude]};
              
              })
            );
        }).then(text => console.log(text))
        .catch(err => {
          // Do something for an error here
          console.log("Error Reading data " + err);
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
          // console.log("configMatched.offsetX", configMatched.offsetX);
          setConfig(configMatched);
        //   setTransform("translate(" + configMatched.offsetX + "," + configMatched.offsetY + ")")
          setStateName(configMatched.name);
          console.log("transform", "translate("+(transform[0]-12)+","+transform[1]+")")
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
  // console.log("config ", config);
  // console.log("tranform ", transform);
  console.log('site data', siteData);

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


  //set county list
  useEffect(() => {
    // county list
    if(config){
      fetch(config.url)
    .then(res => res.json())
    .then(x => {
      setCountyList(_.sortBy(_.map(_.map(x.objects.cb_2015_georgia_county_20m.geometries, 'properties'),
      d => {
        return {key:d.GEOID, value:d.NAME, text:d.NAME+' County'}
      }), 'text'));
      // setCountyList(_.map(_.map(x.objects.cb_2015_georgia_county_20m.geometries, 'properties'),'NAME'));
  })
    // setCountyList()
    }
    
  }, [config]);

  console.log("countyList", countyList)
  // const markers = [
  //   {
  //     markerOffset: 0,
  //     name: "230",
  //     coordinates: [-81.4865, 31.1979]
  //   },
  //   { markerOffset: 0, name: "111", coordinates: [-83.8838, 32.5556] },
  //   // { markerOffset: 0, name: "233", coordinates: [-83.8788, 32.5647] },
  //   { markerOffset: 0, name: "235", coordinates: [-84.1549, 31.5906] },
  //   { markerOffset: 0, name: "115", coordinates: [-83.2166, 34.3630] }
  // ];

  //useEffect(() => {
  console.log("countySelected", countySelected)
  useEffect ( () => {
    if(dropdownRef.current){  
        let ddHeight = dropdownRef.current.offsetHeight;  
        setResultHeight(700-ddHeight); 
        console.log(ddHeight);
    }
  }, [dropdownRef]);


  const CardGroup = _.filter(siteData, function(o) { return countySelected.indexOf(o.county.replace(' County',''))>-1; }).map((obj, index) =>
  // {'county':countySelected}
  
    <Card 
      href={"https://maps.google.com?q="+obj.address}
      target='_blank'
      key={index}
      header={obj.address}
      meta={obj.county}
      description='Click to view on Google Map'
      onMouseEnter={()=>{setTooltipContent([obj.address, obj.county])}}
      onMouseLeave={()=>{setTooltipContent("")}}
    />
    )
   //, [countySelected])
    
   
  // if (stateFips === "_nation" || (data && metric && trendOptions && trendline)) {
  // if (stateFips === "_nation" || (data && metric && trendOptions && trendline && dataTS)) {
    if (config && siteData && countyList) {
    
    return(
    <HEProvider>
    <div>
      
        <AppBar menu='vaccinemap'/>
        <Container style={{marginTop: '10em', minWidth: '1260px'}}>

        <Grid>
        <Header>Vaccination Distribution Sites</Header>
        </Grid>
        <Grid columns={2}>
        <Grid.Column width={10}>
            <ComposableMap projection="geoAlbersUsa" 
            //projectionConfig={{scale:`${config.scale*0.7}`}} 
            projectionConfig={{
                // rotate: [-100, 20, 0],
                scale: 4500,
              }}
            width={500} 
            height={400} 
            strokeWidth = {0.3}
            stroke = 'black'
            data-tip=""
            // offsetx={config.offsetX}
            // offsety={config.offsetY}
            >
            {/* <ZoomableGroup zoom={1}> */}
            <Geographies geography={config.url} transform={"translate("+transform[0]+","+transform[1]+")"}>
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
                    fill = {countySelected.indexOf(fips2county[stateFips + geo.properties.COUNTYFP].replace(' County',''))>-1 ? '#f2a900' : 'white'}
                    // fill={(stateFips === "_nation" || stateFips === "72")? "#FFFFFF" :countyFips===geo.properties.COUNTYFP?countyColor:
                    //     ((colorScale && data[stateFips+geo.properties.COUNTYFP] && (data[stateFips+geo.properties.COUNTYFP][metric]) > 0)?
                    //         colorScale[data[stateFips+geo.properties.COUNTYFP][metric]]: 
                    //         (colorScale && data[stateFips+geo.properties.COUNTYFP] && data[stateFips+geo.properties.COUNTYFP][metric] === 0)?
                    //         '#e1dce2':'#FFFFFF')}
                    // fill = 'white'
                    />
                )}
            </Geographies>
            {siteData.map(({ coordinates, address, county }) => (
              tooltipContent[0] === address ?
                <Marker className="marker" key={address} coordinates={coordinates} onClick={() => {
                    // window.open("https://maps.google.com?q="+coordinates[1]+","+coordinates[0]);
                    window.open("https://maps.google.com?q="+address);
                  }}
                  onMouseEnter={() => {
                    setTooltipContent([address,county]);
                    // setHoverMarker(address);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                    // setHoverMarker("");
                  }}
                  >
                {/* <circle cx="0" cy="0" fill="#FF5533" stroke="#FF5533" r="3" transform={transform}/> */}
                {/* <g id="icon" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-1.9444444444444287 -1.9444444444444287) scale(3.89 3.89)" >
                  <circle cx="44.75" cy="34.61" r="19" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,209,93); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                  <path d="M 45 0 C 25.463 0 9.625 15.838 9.625 35.375 c 0 8.722 3.171 16.693 8.404 22.861 L 45 90 l 26.97 -31.765 c 5.233 -6.167 8.404 -14.139 8.404 -22.861 C 80.375 15.838 64.537 0 45 0 z M 45 48.705 c -8.035 0 -14.548 -6.513 -14.548 -14.548 c 0 -8.035 6.513 -14.548 14.548 -14.548 s 14.548 6.513 14.548 14.548 C 59.548 42.192 53.035 48.705 45 48.705 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(243,112,91); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                </g> */}
              
                  {/* <div> */}
                <g
                    fill="#FF5533"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.8}
                    // transform={transform}
                    transform={"translate("+(transform[0]-12)+","+(transform[1]-20)+")"} 
                    // "translate(-912, -420)"
                >
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                    
                </g>
                <circle r={2.5} z-index={10} fill="white" stroke="white" strokeWidth={1} transform={"translate("+transform[0]+","+(transform[1]-10)+")"}/>
                {/* </div>   */}
                </Marker>

                :

                <Marker className="marker" key={address} coordinates={coordinates} onClick={() => {
                  // window.open("https://maps.google.com?q="+coordinates[1]+","+coordinates[0]);
                  window.open("https://maps.google.com?q="+address);
                }}
                onMouseEnter={() => {
                  setTooltipContent([address, county]);
                  // setHoverMarker(address);
                }}
                onMouseLeave={() => {
                  setTooltipContent("");
                  // setHoverMarker("");
                }}
                >
                <circle cx="0" cy="0" fill="#FF5533" stroke="white" r="2" transform={"translate("+transform[0]+","+transform[1]+")"}/>
                </Marker>
                
                // "rgb(255,209,93)"
                // <text
                //     textAnchor="middle"
                //     y={markerOffset}
                //     transform={transform}
                //     style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: 10 }}
                // >
                //     {name}
                // </text>
                
            ))}
            {/* </ZoomableGroup> */}
            </ComposableMap>
            </Grid.Column>
        <Grid.Column width={5} style={{height:'600px'}}>
          <Grid.Row >
          <Dropdown
                style={{background: '#fff', 
                        fontSize: "16px",
                        fontWeight: 400, 
                        theme: '#000000',
                        width: '350px',
                        left: '0px',
                        text: "Select",
                        borderTop: '0.5px solid #bdbfc1',
                        borderLeft: '0.5px solid #bdbfc1',
                        borderRight: '0.5px solid #bdbfc1', 
                        borderBottom: '0.5px solid #bdbfc1',
                        // borderRadius: 0,
                        paddingBottom: '0em'}}
                placeholder="Select County"
                // + (stateFips === "_nation" ? "The United States": stateName)
                multiple
                search
                selection
                pointing = 'top'
                options={countyList}
                onChange={(e, { value }) => {
                  setCountySelected(value);
              
                }}

              />
              </Grid.Row>
              <Grid.Row style={{width:'290px', height:'500px', marginTop:'2rem', overflow:'auto'}}>
              {/* <CountySites county={countySelected} siteData={siteData}/> */}
              <Card.Group style={{width:'280px', paddingTop:'1rem', paddingLeft:'0.5rem'}}>{CardGroup}</Card.Group>
              </Grid.Row>
          </Grid.Column>
          </Grid>
        </Container>
        {tooltipContent!=="" ?  <ReactTooltip place='right'> <font size="+1"> <b> {tooltipContent[0]} </b> </font> <br/> <b> {tooltipContent[1]} </b> <br/> Click to view on Google Map. </ReactTooltip> : null}
    </div>
    </HEProvider>
    );
} else {
        return <Loader active inline='centered' />
    }
}
