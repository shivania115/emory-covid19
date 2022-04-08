import React, { useEffect, useState, Component, createRef, useRef, useContext, useMemo, PureComponent} from 'react'
import { Container, Header, Grid, Loader, Divider, Button, Progress, Dropdown, Table, Image, Rail, Sticky, Tab, Ref, Accordion, Menu, Message, Transition, List} from 'semantic-ui-react'
import AppBar from './AppBar';
import { useParams, useHistory, Link } from 'react-router-dom';
import { geoCentroid } from "d3-geo";
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { scaleQuantile } from "d3-scale";
import configs from "./state_config.json";
import demog_descriptives from "./Pre-Processed Data/demogDescriptives.json";
import PropTypes from "prop-types"
import { Waypoint } from 'react-waypoint'
import { MapContext } from "./MapProvider"
// import useGeographies from "./useGeographies"
import {CHED_static, CHED_series} from "../stitch/mongodb";
import {useStitchAuth} from "./StitchAuth";

import {HEProvider, useHE} from './HEProvider';

import {getFeatures, prepareFeatures, isString } from "../utils"
import Notes from './Notes';
import _ from 'lodash';
import { VictoryChart, 
  VictoryContainer,
  VictoryGroup, 
  VictoryBar, 
  VictoryTheme, 
  VictoryAxis, 
  VictoryLine,
  VictoryLabel, 
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';
import { render } from 'react-dom';
import {ComposedChart, Line, Area, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Cell,  PieChart, Pie, Sector, Label, LabelList, Legend, ResponsiveContainer} from "recharts";
import {ArrowSvg} from 'react-simple-arrows';
import { CSSTransition } from 'react-transition-group';
import { index } from 'd3';

var obj, stobj;

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"
const stBoundUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/states-10m.json"


export function fetchGeographies(url) {
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText)
      }
      return res.json()
    }).catch(error => {
      console.log("There was a problem when fetching the data: ", error)
    })
}

obj = fetchGeographies(geoUrl);
stobj = fetchGeographies(stBoundUrl);
// 

export function useGeographies({ geography, stateBoundary, parseGeographies }) {
  const { path } = useContext(MapContext)
  const [geographies, setGeographies] = useState()

  useEffect(() => {
    if (typeof window === `undefined`) return

    if (isString(geography)) {
      if(stateBoundary === true){
        stobj.then(geos => {
          if (geos) setGeographies(getFeatures(geos, parseGeographies))
        })
      }else{
        obj.then(geos => {
          if (geos) setGeographies(getFeatures(geos, parseGeographies))
        })
      }
    } else {
      setGeographies(getFeatures(geography, stateBoundary, parseGeographies))
    }
  }, [geography, stateBoundary, parseGeographies])

  const output = useMemo(() => {
    return prepareFeatures(geographies, path)
  }, [geographies, path])

  return { geographies: output }
}

const Geographies = ({
  geography,
  stateBoundary, 
  children,
  parseGeographies,
  className = "",
  ...restProps
}) => {
  const { path, projection } = useContext(MapContext)
  const { geographies } = useGeographies({ geography, stateBoundary, parseGeographies })

  return (
    <g className={`rsm-geographies ${className}`} {...restProps}>
      {
        geographies && geographies.length > 0 &&
        children({ geographies, path, projection })
      }
    </g>
  )
}

Geographies.propTypes = {
  geography: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  stateBoundary: PropTypes.oneOfType([
    PropTypes.bool
  ]),
  children: PropTypes.func,
  parseGeographies: PropTypes.func,
  className: PropTypes.string,
}

const style = <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css'/>

const Placeholder = () => <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />

function goToAnchor(anchor) {
  var loc = document.location.toString().split('#')[0];
  document.location = loc + '#' + anchor;
  return false;
}
const contextRef = createRef()
const nameList = ['COVID-19 National Health Equity Report', 'Cases & Deaths in the U.S. Over Time', 
 '50% of Cases Comes From These States', 'COVID-19 by U.S. Demographics', 'COVID-19 Across U.S. Communities',
 'COVID-19 by Community Vulnerability Index', 'COVID-19 by Percent in Poverty', 'COVID-19 by Metropolitan Status', 
 'COVID-19 by Region', 'COVID-19 by Percent African American', 'COVID-19 by Residential Segregation Index',
 "COVID-19 by Underlying Comorbidity", "COVID-19 by Percent COPD", 'COVID-19 by Percent CKD',
 'COVID-19 by Percent Diabetes', 'COVID-19 by Percent Heart Disease', "Obesity", "COVID-19 Vaccination Tracker", 
 'Vaccination by Race & Ethnicity', 'Cases by Race & Ethnicity', 'Deaths by Race & Ethnicity', 
 'Cases & Deaths by Age', 'Cases & Deaths by Sex'];
var scrollCount = 0;

function StickyExampleAdjacentContext(props) {
    const contextRef = createRef();
    const [sTate, setsTate] = useState({ activeItem: 'Interactive Map' })
    const { activeItem } = sTate
    useEffect(() => {
        setsTate(nameList[scrollCount])
    }, [scrollCount])
    
    return (

        <div >
          <Ref innerRef={contextRef}>
            <Rail attached size='mini' >
              <Sticky offset={180} position= "fixed" context={contextRef}>
                <div style={{width:312, overflow: "auto", overflowX: "hidden"}}>
                  <div style= {{height:600, width: 320, overflowY: "auto", overflowX:"hidden"}}> 
                    <div style={{height: "130%", width: 330}}>
                      <Menu
                          size='small'
                          compact
                          pointing secondary vertical>
                          <Menu.Item as='a' href="#" name={nameList[0]} active={props.activeCharacter == nameList[0] || activeItem === nameList[0]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[0]}</Header></Menu.Item>
                                
                          <Menu.Item as='a' href="#tracker" name={nameList[16]} active={props.activeCharacter == nameList[16] || activeItem === nameList[16]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'> COVID-19 Vaccination Tracker </Header></Menu.Item>

                          <Menu.Item as='a' href="#vaccrace" name={nameList[18]} active={props.activeCharacter == nameList[18] || activeItem === nameList[18]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[18]}</Header></Menu.Item>


                          <Menu.Item as='a' href="#cases" name={nameList[1]} active={props.activeCharacter == nameList[1] || activeItem === nameList[1]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[1]}</Header></Menu.Item>

                          <Menu.Item as='a' href="#half" name={nameList[2]} active={props.activeCharacter == nameList[2] || activeItem === nameList[2]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[2]}</Header></Menu.Item>
                          
                          <Menu.Item as='a' href="#who" name={nameList[3]} active={props.activeCharacter == nameList[3] || activeItem === nameList[3]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[3]}</Header></Menu.Item>
                            <Menu.Item as='a' href="#who" name={nameList[19]} active={props.activeCharacter == nameList[19] || activeItem === nameList[19]}
                                  onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Cases by Race & Ethnicity</Header></Menu.Item>
                            <Menu.Item as='a' href="#dre" name={nameList[20]} active={props.activeCharacter == nameList[20] || activeItem === nameList[20]}
                                  onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Deaths by Race & Ethnicity</Header></Menu.Item>
                            <Menu.Item as='a' href="#cda" name={nameList[21]} active={props.activeCharacter == nameList[21] || activeItem === nameList[21]}
                                  onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Cases & Deaths by Age</Header></Menu.Item>
                            <Menu.Item as='a' href="#cds" name={nameList[22]} active={props.activeCharacter == nameList[22] || activeItem === nameList[22]}
                                  onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Cases & Deaths by Sex</Header></Menu.Item>
                          
                          <Menu.Item as='a' href="#commu" name={nameList[4]} active={props.activeCharacter == nameList[4] || activeItem === nameList[4]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[4]}</Header></Menu.Item>

                          <Menu.Item as='a' href="#ccvi" name={nameList[5]} active={props.activeCharacter == nameList[5] || activeItem === nameList[5]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Community Vulnerability Index</Header></Menu.Item>

                          <Menu.Item as='a' href="#poverty" name={nameList[6]} active={props.activeCharacter == nameList[6] || activeItem === nameList[6]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent in Poverty</Header></Menu.Item>

                          <Menu.Item as='a' href="#metro" name={nameList[7]} active={props.activeCharacter == nameList[7] || activeItem === nameList[7]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Metropolitan Status</Header></Menu.Item>

                          <Menu.Item as='a' href="#region" name={nameList[8]} active={props.activeCharacter == nameList[8] || activeItem === nameList[8]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Region</Header></Menu.Item>

                          <Menu.Item as='a' href="#black" name={nameList[9]} active={props.activeCharacter == nameList[9] || activeItem === nameList[9]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent African American </Header></Menu.Item>

                          <Menu.Item as='a' href="#resseg" name={nameList[10]} active={props.activeCharacter == nameList[10] || activeItem === nameList[10]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Residential Segregation Index</Header></Menu.Item>

                          <Menu.Item as='a' href="#comorb" name={nameList[11]} active={props.activeCharacter == nameList[11] || activeItem === nameList[11]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Underlying Comorbidity</Header></Menu.Item>
                          
                        
                          {/* <Menu.Item as='a' href="#copd" name={nameList[12]} active={props.activeCharacter == nameList[12] || activeItem === nameList[12]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent with COPD</Header></Menu.Item>

                          <Menu.Item as='a' href="#ckd" name={nameList[13]} active={props.activeCharacter == nameList[13] || activeItem === nameList[13]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent with CKD</Header></Menu.Item>

                          <Menu.Item as='a' href="#diabetes" name={nameList[14]} active={props.activeCharacter == nameList[14] || activeItem === nameList[14]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent with Diabetes</Header></Menu.Item>

                          <Menu.Item as='a' href="#heart" name={nameList[15]} active={props.activeCharacter == nameList[15] || activeItem === nameList[15]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent with Heart Disease</Header></Menu.Item>

                          <Menu.Item as='a' href="#obesity" name={nameList[16]} active={props.activeCharacter == nameList[16] || activeItem === nameList[16]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent with Obesity</Header></Menu.Item>
                           */}
                      </Menu>
                    </div>
                  </div>
                </div>
              </Sticky>
            </Rail>
          </Ref> 
        </div>
    )
  // }

}



const casesColor = [
  "#72ABB1",
  "#337fb5"
];
const mortalityColor = [
  "#0270A1",
  "#024174"
];
const colorPalette = [
  "#e1dce2",
  "#d3b6cd",
  "#bf88b5", 
  "#af5194", 
  "#99528c", 
  "#633c70", 
];

const colorPalett = [
  "#633c70", 
  "#99528c", 
  "#af5194", 
  "#bf88b5", 
  "#d3b6cd",
  "#e1dce2",
  
];
const pieChartRace = ['#007dba', '#808080', '#a45791', '#008000', '#e8ab3b', '#000000', '#8f4814'];


function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
  "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
];
// const monthNames = ["01/", "02/", "03/", "04/", "05/", "06/",
//   "07/", "08/", "09/", "10/", "11/", "12/"
// ];
const fullMonthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


//const nationColor = '#487f84';


function ChartSection(props){
  const [chartNo1, setChartNo1] = useState(-1);
  const [chartNo2, setChartNo2] = useState(2);
  const data = props.data;
  const dailyCases = props.dailyCases;
  const dailyDeaths = props.dailyDeaths;
  const monthNames = props.monthNames;
  const mean7dayCases = props.mean7dayCases;
  const mortalityMean = props.mortalityMean;
  const percentChangeCases = props.percentChangeCases;
  const percentChangeMortality = props.percentChangeMortality;
  const [barName, setBarName] = useState('dailyCases');
  const [lineName, setLineName] = useState('caseRateMean');
  const [caseTicks, setCaseTicks] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [headerTime, setHeaderTime] = useState('');
  const [activeItem, setActiveItem] = useState('Cases')


// console.log('chartNo', chartNo1, chartNo2)

useEffect(()=>{
  // var timer = 0

  // if(timer){
  //   clearTimeout(timer);
  //   timer = 0;
  // }

  if(activeItem==='Cases'){
    setBarName('dailyCases');
    setLineName('caseRateMean');
  } else {
    setBarName('dailyMortality');
    setLineName('mortalityMean');
  }

  if(chartNo1===-1){
    setCaseTicks([data[0].t,
    data[30].t,
    data[61].t,
    data[91].t,
    data[122].t,
    data[153].t,
    data[183].t,
    data[214].t,
    data[244].t,
    data[275].t,
    data[306].t,
    data[334].t,
    data[365].t,
    data[395].t,
    data[426].t,
    data[456].t,
    data[487].t,
    data[518].t,
    data[548].t,
    data[data.length-1].t]);
  }else if(chartNo1===0 || chartNo2===2) {
    setCaseTicks([data[0].t,
    data[30].t,
    data[61].t,
    data[91].t,
    data[122].t,
    data[153].t,
    data[183].t,
    data[214].t,
    data[244].t,
    data[275].t,
    data[306].t,
    data[334].t,
    data[365].t,
    data[395].t,
    data[426].t,
    data[456].t,
    data[487].t,
    data[518].t,
    data[548].t,
    data[data.length-1].t]);
    setHeaderTime('');
    setDisabled(true);
    if(activeItem==='Cases'){
      setChartNo2(3.5)
      setTimeout(()=>setChartNo1(1), 11000); //10000
    } else {
      setChartNo1(1.5);
      setTimeout(()=>setChartNo2(3), 10000);   //8000
    }
  } else if(chartNo1===1 || chartNo2===3){
    setCaseTicks([data[214].t,
    data[244].t,
    data[275].t,
    data[306].t,
    data[334].t,
    data[365].t,
    data[data.length-1].t]);
    setHeaderTime('in Past 90 Days');
    if(activeItem==='Cases'){
      setTimeout(()=>setChartNo1(1.5), 7000);   //5000
    } else {
      setTimeout(()=>setChartNo2(3.5), 7000);   //5000
    }
    
  } 
  else if(chartNo1===1.5 || chartNo2===3.5){
    setDisabled(false);
    // setCaseTicks([
    //   data[data.length-14].t,
    //   data[data.length-7].t,
    //   data[data.length-1].t]);
    // setHeaderTime('in Past 14 Days');
    // setTimeout(()=>setChartNo(chartNo+1), 7000);
    // if(chartNo===5){
    //   setTimeout(()=>setDisabled(false), 7000);
    // }
  }
}, [chartNo1, chartNo2]);


  return(
  <Grid.Row style={{paddingLeft: 20, paddingBottom: '0rem'}}>  
  <Header as='h2' style={{paddingTop: 30, paddingLeft: 60, color: mortalityColor[1], textAlign:'center',fontSize:"22pt"}}>
    <Header.Content>
      How have {activeItem==='Cases' ? 'cases' : 'deaths'} in the U.S. changed over time?
    </Header.Content>
  </Header>
  <Grid.Row style={{paddingTop: '1rem', paddingLeft: '25rem'}}>
    <Menu pointing secondary widths={2} style={{width: '15rem', fontSize: 17}}> 
    <Menu.Item name='Cases' active={activeItem==='Cases'} onClick={()=>{setActiveItem('Cases'); setChartNo1(0); setChartNo2(3.5); setDisabled(true)}}/>
    <Menu.Item name='Deaths' active={activeItem==='Deaths'} onClick={()=>{setActiveItem('Deaths'); setChartNo2(2); setChartNo1(1.5); setDisabled(true)}}/>
    </ Menu>
  </Grid.Row>
  <Grid.Row column = {1} style={{textAlign:'center', width: 800, paddingTop: '2rem', paddingLeft: '10rem'}}>
    <Header.Content x={0} y={20} style={{ fontSize: '18pt', marginLeft: 0, paddingBottom: '1rem', fontWeight: 600}}>Average Daily COVID-19 {activeItem==='Cases' ? 'Cases' : 'Deaths'} {headerTime}</Header.Content>
  </ Grid.Row>

    {(()=>{
    if (activeItem==='Cases' && chartNo1===-1){
      return (<Grid.Column>
              <CaseChartStatic data={data} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter} />
              </Grid.Column>)
    }else if (activeItem==='Cases' && chartNo1===0){
      return (<Grid.Column>
              <CaseChartAll data={data} barColor={props.barColor} lineColor={props.lineColor}
              tick={caseTicks} tickFormatter={props.tickFormatter} />
              </Grid.Column>)
    } else if(activeItem==='Deaths' && chartNo2===2){
      return <DeathChartAll data={data} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter} />
    } else if(activeItem==='Cases' && (chartNo1===1 || chartNo1===1.5)){
      return <CaseChart90 data={data} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter}
              barName={barName} lineName={lineName}/>
    } else if (activeItem==='Deaths' && (chartNo2===3 || chartNo2===3.5)) {
      return <CaseChart90 data={data} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter}
              barName={barName} lineName={lineName}/>
    }
    // else {
    //   return <CaseChart14 data={data} barColor={props.barColor} lineColor={props.lineColor} 
    //           tick={caseTicks} tickFormatter={props.tickFormatter}
    //           barName={barName} lineName={lineName}/>
    // }
  })()}
    
    <Button style={{marginLeft: 780}} content='Play' icon='play' disabled={disabled} onClick={() => {if(activeItem === 'Cases') {setChartNo1(0); setChartNo2(3.5)} else {setChartNo2(2); setChartNo1(1.5)}}}/>
   
    {(()=>{
      if (activeItem==='Cases'){
        return (<Accordion style = {{paddingLeft: 18}} defaultActiveIndex={1} panels={[
        {
            key: 'acquire-dog',
            title: {
                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                icon: 'dropdown',
            },
            content: {
                content: (
                  <Header as='h2' style={{fontWeight: 400, paddingTop: 0, paddingBottom: 20}}>
                  <Header.Content  style={{fontSize: "14pt"}}>
                    <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt", paddingLeft: '2rem', paddingRight:65}}>
                      This figure shows the trend of daily COVID-19 cases in the U.S.. The bar height reflects the number of 
                      new cases per day and the line depicts the 7-day moving average of daily cases in the U.S.. There were {numberWithCommas(dailyCases)} new COVID-19 cases reported on {monthNames[new Date(data[data.length - 1].t*1000).getMonth()] + " " + new Date(data[data.length - 1].t*1000).getDate() + ", " + new Date(data[data.length - 1].t*1000).getFullYear()}, with 
                      an average of {numberWithCommas(mean7dayCases)} new cases per day reported over the past 7 days. 
                      We see a {percentChangeCases.includes("-")? "decrease of approximately " + percentChangeCases.substring(1): "increase of approximately " + percentChangeCases} in 
                      the average new cases over the past 14-day period. 
                      <br/>
                      <br/>
                      *14-day period includes {monthNames[new Date(data[data.length - 15].t*1000).getMonth()] + " " + new Date(data[data.length - 15].t*1000).getDate() + ", " + new Date(data[data.length - 15].t*1000).getFullYear()} to {monthNames[new Date(data[data.length - 1].t*1000).getMonth()] + " " + new Date(data[data.length - 1].t*1000).getDate() + ", " + new Date(data[data.length - 1].t*1000).getFullYear()}.

                    </Header.Subheader>
                  </Header.Content>
                </Header>
              ),
            },
        }
    ]
          } />)}
      else{
        return (<Accordion style = {{paddingLeft: 20}} defaultActiveIndex={1} panels={[
        {
            key: 'acquire-dog',
            title: {
                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                icon: 'dropdown',
            },
            content: {
                content: (
                  <Header as='h2' style={{fontWeight: 300, paddingTop: 0, paddingBottom: 20}}>
                  <Header.Content  style={{fontSize: "19px"}}>
                    <Header.Subheader style={{color: '#000000', width: 900, fontSize: "19px", textAlign:'justify', paddingLeft: '2rem', paddingRight:65}}>
                          This figure shows the trend of daily COVID-19 deaths in the U.S.. The bar height reflects the number of new deaths 
                          per day and the line depicts the 7-day moving average of daily deaths in the U.S.. There were {dailyDeaths} new deaths 
                          associated with COVID-19 reported on {monthNames[new Date(data[data.length - 1].t*1000).getMonth()] + " " + new Date(data[data.length - 1].t*1000).getDate() + ", " + new Date(data[data.length - 1].t*1000).getFullYear()}, with 
                          an average of {mortalityMean} new deaths per day reported over the past 7 days. 
                          We see {percentChangeMortality.includes("-")? "a decrease of approximately " + percentChangeMortality.substring(1): "an increase of approximately " + percentChangeMortality} in average new deaths over the past 14-day period. 
                          <br/>
                          <br/>
                          *14-day period includes {monthNames[new Date(data[data.length - 15].t*1000).getMonth()] + " " + new Date(data[data.length - 15].t*1000).getDate() + ", " + new Date(data[data.length - 15].t*1000).getFullYear()} to {monthNames[new Date(data[data.length - 1].t*1000).getMonth()] + " " + new Date(data[data.length - 1].t*1000).getDate() + ", " + new Date(data[data.length - 1].t*1000).getFullYear()}.
                        
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                ),
              },
          }
      ]

      } />)}
    }
    )()
    }

  </ Grid.Row>
  )
}

function CaseChartStatic(props){
  const [highlightIndex, setHighlightIndex] = useState([-1, 9, 109, 282]);
  const data = props.data;
  const barColor = props.barColor;
  const lineColor = props.lineColor;
  const ticks = props.tick;
  const tickFormatter = props.tickFormatter;
  const labelWidth = '11rem'

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };

  console.log('data ', data)

  const radius = 10;
  const renderCustomizedLabel = (props) => {
    const { x, y, width, value } = props;
    

    if (value===1586491200){  // 1
      return (
        <g transform="translate(0, -10)">
          <circle cx={x + width / 2} cy={y - radius} r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
          <text
            x={x + width / 2}
            y={y - radius + 1}
            fill="red"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            1
          </text>
        </g>
      );
    } else if(value===1595131200){  // 2
      return (
        <g transform="translate(0, -20)">
          <circle cx={x + width / 2} cy={y - radius} r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
          <text
            x={x + width / 2}
            y={y - radius + 1}
            fill="red"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            2
          </text>
        </g>
      );
    }else if(value===1610082000){  // 3
      return (
      <g transform="translate(0, -10)">
        <circle cx={x + width / 2} cy={y - radius} r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
        <text
          x={x + width / 2}
          y={y - radius + 1}
          fill="red"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          3
        </text>
      </g>
    );
    }
    return null
  };

  
  return(
    <Grid columns={2} style={{paddingTop:'1rem', paddingLeft: 0, height: 450, width:930, position:'relative'}}>

      <Grid.Column width={12}>
      <ComposedChart width={750} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" ticks={ticks}  tick={{fontSize: 12}} tickFormatter={tickFormatter} angle={-25} interval={0}/>
      {/* domain={[1585713600, 1610859600]} */}
      <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
      <Bar name="New cases" dataKey='dailyCases' barSize={10}
            isAnimationActive={false} 
            animationEasing='ease'
            animationDuration={3500} 
             barSize={2} fill={barColor} >
            {
              data.map((entry, index) => (
                <Cell id={index} key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : barColor}/>
              ))
            }
          <LabelList dataKey='t' content={renderCustomizedLabel}/>
      </ Bar>
      <Line name="7-day average" id='all-line' type='monotone' dataKey='caseRateMean' dot={false} 
            isAnimationActive={false} 
            stroke={lineColor}
            strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      </ComposedChart>
      </Grid.Column>
    
      <Grid.Column width={3} style={{paddingLeft: '3rem'}}>

      <Message compact id='Jan' style={{ width: labelWidth, padding: '1rem', margin:3, fontSize: '0.8rem'}}> Jan. 21, 2020: <br /> 1st case in the U.S. confirmed in Washington</Message>

      <Message compact id='message2' style={{ width: labelWidth, padding: '1rem', margin:3, fontSize: '0.8rem'}}> 
      <svg height='25' width='30'>
        <circle cx='11' cy='11' r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
        <text
          x='11'
          y='11'
          fill="red"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
        >
          1
        </text></svg>
        <text zIndex={10}>Apr. 10, 2020: <br /> First wave peaked at 31,709 new cases <br />(7-day avg.) </text>
        </Message>

      <Message compact style={{ width: labelWidth, padding: '1rem', margin:3, fontSize: '0.8rem'}}> 
      <svg height='25' width='30'>
        <circle cx='11' cy='11' r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
        <text
          x='11'
          y='11'
          fill="red"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
        >
          2
        </text></svg>
      <text zIndex={10}>July. 19, 2020: <br /> Second wave peaked at 66,692 new cases <br />(7-day avg.) </text>
      </Message>

      <Message compact style={{ width: labelWidth, padding: '1rem', margin:3, fontSize: '0.8rem'}}> 
      <svg height='25' width='30'>
        <circle cx='11' cy='11' r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
        <text
          x='11'
          y='11'
          fill="red"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
        >
          3
        </text></svg>
        <text zIndex={10}>Jan. 8, 2021: <br /> Third wave peaked at 259,616 new cases <br />(7-day avg.) </text>
      
      </Message>
      </Grid.Column>
      
      </Grid>
  );
}


function CaseChartAll(props){
  const [playCount, setPlayCount] = useState(0);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState([-1]);
  const data = props.data;
  const barColor = props.barColor;
  const lineColor = props.lineColor;
  const ticks = props.tick;
  const tickFormatter = props.tickFormatter;
  const labelWidth = '12rem'

  // const ytickFormatter = props.ytickFormatter;
  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };


  useEffect(() =>{
    setHighlightIndex([-1]);
    
  },[props.history])

  var wait=0;

  const radius = 10;
  const renderCustomizedLabel = (props) => {
    const { x, y, width, value } = props;
    

    if (value===1586491200 && highlightIndex.length >= 2){  // 1
      return (
        <g transform="translate(0, -10)">
          <circle cx={x + width / 2} cy={y - radius} r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
          <text
            x={x + width / 2}
            y={y - radius + 1}
            fill="red"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            1
          </text>
        </g>
      );
    } else if(value===1595131200 && highlightIndex.length >= 3){  // 2
      return (
        <g transform="translate(0, -20)">
          <circle cx={x + width / 2} cy={y - radius} r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
          <text
            x={x + width / 2}
            y={y - radius + 1}
            fill="red"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            2
          </text>
        </g>
      );
    }else if(value===1610082000 && highlightIndex.length >= 4){  // 3
      return (
      <g transform="translate(0, -10)">
        <circle cx={x + width / 2} cy={y - radius} r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
        <text
          x={x + width / 2}
          y={y - radius + 1}
          fill="red"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          3
        </text>
      </g>
    );
    }
    return null
  };
  
  return(
    <Grid columns={2} style={{paddingTop:'1rem', paddingLeft: 0, height: 450, width:930, position:'relative'}}>

      <Grid.Column width={12}>
      <ComposedChart width={750} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" ticks={ticks} tick={{fontSize: 13}} tickFormatter={tickFormatter} angle={-30} interval={0}/>
      {/* domain={[1585713600, 1610859600]} */}
      <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
      <Bar name="New cases" dataKey='dailyCases' barSize={10}
            isAnimationActive={animationBool} 
            animationEasing='ease'
            onAnimationStart={() => {setDisabled(true); setVisible1(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
                                    setHighlightIndex([-1]);
            }} 
            onAnimationEnd={()=> {
              setAnimationBool(false);
              setTimeout(()=>setVisible1(true), wait); 
              setTimeout(()=>setVisible2(true), wait+1000); 
              setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 9]), wait+1000);
              // setTimeout(()=>setVisible3(true), wait+2000);
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 71]), wait+2000);  
              setTimeout(()=>setVisible4(true), wait+2000); 
              setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 109]), wait+2000);  
              setTimeout(()=>setVisible5(true), wait+3000);
              setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 282]), wait+3000);  
              setTimeout(()=>setDisabled(false),wait+4000);
              // setTimeout(()=>setHighlightIndex(-1), wait+5000);
            }}
            animationDuration={3500} 
             barSize={2} fill={barColor} >
            {
              data.map((entry, index) => (
                <Cell id={index} key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : barColor}/>
              ))
              
              // fill={index === highlightIndex ? "red" : barColor}
            }
            <LabelList dataKey='t' content={renderCustomizedLabel}/>
      </ Bar>
      <Line name="7-day average" id='all-line' type='monotone' dataKey='caseRateMean' dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={3500} 
            stroke={lineColor}
            strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      </ComposedChart>
      </Grid.Column>
    
      <Grid.Column width={3} style={{paddingLeft: '3rem'}}>
      <Transition visible={visible1} animation='scale' duration={200}>
      <Message compact id='Jan' style={{ width: labelWidth, padding: '1rem', margin:3, fontSize: '0.8rem'}}> Jan. 21, 2020: <br /> 1st case in the U.S. confirmed in Washington</Message>
      </Transition>
      <Transition visible={visible2} animation='scale' duration={200}>
      <Message compact id='message2' style={{ width: labelWidth, padding: '1rem', margin:3, fontSize: '0.8rem'}}> 
      <svg height='25' width='30'>
        <circle cx='11' cy='11' r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
        <text
          x='11'
          y='11'
          fill="red"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
        >
          1
        </text></svg>
        <text zindex={10}>Apr. 10, 2020: <br /> First wave peaked at 31,709 new cases <br />(7-day avg.) </text>
        </Message>
        </Transition> 

      <Transition visible={visible4} animation='scale' duration={200}>
      <Message compact style={{ width: labelWidth, padding: '1rem', margin:3, fontSize: '0.8rem'}}> 
      <svg height='25' width='30'>
        <circle cx='11' cy='11' r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
        <text
          x='11'
          y='11'
          fill="red"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
        >
          2
        </text></svg>
      <text zindex={10}>July. 19, 2020: <br /> Second wave peaked at 66,692 new cases <br />(7-day avg.) </text>
      </Message>
      </Transition> 
      
      <Transition visible={visible5} animation='scale' duration={200}>
      <Message compact style={{ width: labelWidth, padding: '1rem', margin:3, fontSize: '0.8rem'}}> 
      <svg height='25' width='30'>
        <circle cx='11' cy='11' r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
        <text
          x='11'
          y='11'
          fill="red"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
        >
          3
        </text></svg>
        <text zindex={10}>Jan. 8, 2021: <br /> Third wave peaked at 259,616 new cases <br />(7-day avg.) </text>
      
      </Message>
      </Transition> 
    
      </Grid.Column>
      
      </Grid>
  );
}



function CaseChart90(props){
  const [playCount, setPlayCount] = useState(0);
  const [visible1, setVisible1] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState([-1]);
  const [totalCase, setTotalCase] = useState(0);
  const data = props.data;
  const barColor = props.barColor;
  const lineColor = props.lineColor;
  const ticks = props.tick;
  const tickFormatter = props.tickFormatter;
  const barName = props.barName;
  const lineName = props.lineName;

  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };

  useEffect(() =>{
    var sum = 0;
    for(var i=data.length-90; i<data.length; i++) { 
      sum += data[i][barName]; 
    }
    setTotalCase(sum);
  },[])

  var wait = 0;
  

  return(
    <Grid style={{paddingTop: '1em', paddingLeft: 10, width: 930, height: 450}}>

      <ComposedChart width={850} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" type="number" domain={[data[data.length-90].t,'dataMax']} padding={{ left: 3, right: 3 }}
      ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter} allowDataOverflow={true}/>
      {/* ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter} data[data.length-1].t-90*/}
      <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}} domain={['auto','dataMax']}/>
      <Bar name="New cases" dataKey={barName} barSize={18} 
            isAnimationActive={animationBool} 
            animationEasing='ease'
            onAnimationStart={() => {setDisabled(true); setVisible1(false);
                                    setHighlightIndex([-1]);
            }} 
            onAnimationEnd={()=> {
              setAnimationBool(false);
              setTimeout(()=>setVisible1(true), wait);  
              setTimeout(()=>setDisabled(false),wait);
            }}
            animationDuration={3500} 
            fill={barColor}
            barSize={3} >
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : barColor}/>
              ))
            }
      </ Bar>
      <Line name="7-day average" id='90-line' type='monotone' dataKey={lineName} dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={3500} 
            stroke={lineColor} strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      </ComposedChart>
      {/* <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/> */}
      <Transition visible={visible1} animation='scale' duration={200}>
      <Message compact style={{ width: '15rem', top: '-29rem', left:'40rem', padding: '1rem', fontSize: '0.8rem'}}> Cumulative Confirmed New {barName==='dailyCases' ? 'Cases' : 'Deaths'} in Past 90 Days: {numberWithCommas(totalCase)}</Message>
      </Transition>
      </Grid>
  );
}


function CaseChart14(props){
  const [playCount, setPlayCount] = useState(0);
  const [totalCase, setTotalCase] = useState(0);
  const [visible1, setVisible1] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState([-1]);
  const data = props.data;
  const barColor = props.barColor;
  const lineColor = props.lineColor;
  const ticks = props.tick;
  const tickFormatter = props.tickFormatter;
  const barName = props.barName;
  const lineName = props.lineName;

  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };

  useEffect(() =>{
    var sum = 0;
    for(var i=data.length-14; i<data.length; i++) { 
      sum += data[i][barName]; 
      console.log(i);
    }
    setTotalCase(sum);
  },[])

  var wait=0;

  return(
    <Grid style={{paddingTop:'1rem', paddingLeft: 10, width: 930, height: 450}}>

      <ComposedChart width={850} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" type="number" domain={[data[data.length-14].t,'dataMax']} padding={{ left: 5, right: 5 }}
      ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter} allowDataOverflow={true}/>
      {/* ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter} data[data.length-1].t-90*/}
      <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
      <Bar name="New cases" dataKey={barName} 
            isAnimationActive={animationBool} 
            animationEasing='ease'
            onAnimationStart={() => {setDisabled(true); setVisible1(false);
                                    setHighlightIndex([-1]); 
            }} 
            onAnimationEnd={()=> {
              setAnimationBool(false);
              setTimeout(()=>setVisible1(true), wait); 
              setTimeout(()=>setDisabled(false),wait);
            }}
            animationDuration={3500} 
            barSize={10} fill={barColor}>
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : barColor}/>
              ))
            }
      </ Bar>
      <Line name="7-day average" id='14-line' type='monotone' dataKey={lineName} dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={3500} 
            stroke={lineColor} strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      {/* <Brush dataKey='t'/> */}
      </ComposedChart>
      {/* <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/> */}
      <Transition visible={visible1} animation='scale' duration={300}>
      <Message compact style={{ width: '15rem', top:'-29rem', left:'40rem', padding: '1rem', fontSize: '0.8rem'}}> Cumulative Confirmed New {barName==='dailyCases' ? 'Cases' : 'Deaths'} in Past 14 Days: {numberWithCommas(totalCase)}</Message>
      </Transition>
      </Grid>
  );
}

function DeathChartAll(props){
  const [playCount, setPlayCount] = useState(0);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState([-1]);
  const data = props.data;
  const barColor = props.barColor;
  const lineColor = props.lineColor;
  const ticks = props.tick;
  const tickFormatter = props.tickFormatter;
  const labelWidth = '12rem'

  // const ytickFormatter = props.ytickFormatter;
  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };


  var wait=0;
  const radius = 10;
  const renderCustomizedLabel = (props) => {
    const { x, y, width, value } = props;
    

    if (value===1590552000 && highlightIndex.length >= 2){  // 1
      return (
        <g transform="translate(0, -10)">
          <circle cx={x + width / 2} cy={y - radius} r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
          <text
            x={x + width / 2}
            y={y - radius + 1}
            fill="red"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            1
          </text>
        </g>
      );
    } else if(value===1600747200 && highlightIndex.length >= 3){  // 2
      return (
        <g transform="translate(0, -20)">
          <circle cx={x + width / 2} cy={y - radius} r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
          <text
            x={x + width / 2}
            y={y - radius + 1}
            fill="red"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            2
          </text>
        </g>
      );
    }
    return null
  };

  return(
    <Grid columns={2} style={{paddingTop:'1rem', paddingLeft: 0, height: 450, width: 930, position:'relative'}}>

      <Grid.Column width={12}>
      <ComposedChart width={750} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" ticks={ticks} tick={{fontSize: 12}} angle={-25} tickFormatter={tickFormatter} interval={0}/>
      <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
      <Bar name="New cases" dataKey='dailyMortality' barSize={18} 
            isAnimationActive={animationBool} 
            animationEasing='ease'
            onAnimationStart={() => {setDisabled(true); setVisible1(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
                                    setHighlightIndex([-1]);
            }} 
            onAnimationEnd={()=> {
              setAnimationBool(false);
              setTimeout(()=>setVisible1(true), wait); 
              setTimeout(()=>setVisible2(true), wait+1000); 
              setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 56]), wait+1000);
              setTimeout(()=>setVisible3(true), wait+2000);
              setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 174]), wait+2000);  
              setTimeout(()=>setDisabled(false),wait+3000);
            }}
            animationDuration={3500} 
            barSize={2} fill={barColor}>
            {
              data.map((entry, index) => (
                <Cell id={index} key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : barColor}/>
              ))
            }
          <LabelList dataKey='t' content={renderCustomizedLabel}/>
      </ Bar>
      <Line name="7-day average" type='monotone' dataKey='mortalityMean' dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={3500} 
            stroke={lineColor}
            strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      </ComposedChart>
      </Grid.Column>
    
      <Grid.Column width={3} style={{paddingLeft: '3rem'}}>
      <Transition visible={visible1} animation='scale' duration={300}>
      <Message compact style={{ width: labelWidth, padding: '1rem', margin:5, fontSize: '0.8rem'}}> Feb. 6, 2020: <br /> First death in US </Message>
      </Transition>
      <Transition visible={visible2} animation='scale' duration={300}>
      <Message compact style={{ width: labelWidth, padding: '1rem', margin:5, fontSize: '0.8rem'}}> 
      <svg height='25' width='30'>
        <circle cx='11' cy='11' r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
        <text
          x='11'
          y='11'
          fill="red"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
        >
          1
        </text></svg>
        <text zindex={10}>May. 27, 2020: <br /> Coronavirus deaths in the U.S. passed 100K </text>
        </Message>
      </Transition> 
      <Transition visible={visible3} animation='scale' duration={300}>
      <Message compact style={{ width: labelWidth, padding: '1rem', margin:5, fontSize: '0.8rem'}}> 
      <svg height='25' width='30'>
        <circle cx='11' cy='11' r={radius} fill="white" stroke='red' strokeWidth={1.5}/>
        <text
          x='11'
          y='11'
          fill="red"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
        >
          2
        </text></svg>
        <text zindex={10}>Sep. 22, 2020: <br /> Coronavirus deaths in the U.S. passed 200K </text>
      </Message>
      </Transition> 
      
      </Grid.Column>
      
      </Grid>

  );
}


const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, dataKey } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#000000">
        {dataKey == "percentPop" ? "Percent of Population" : "Percent of Cases"}
        
      </text>
      {/* <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      /> */}
      {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} fill="#333">{`${payload.demogLabel} ${(percent * 100).toFixed(0)}%`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey - payload.percentCases/100 * 10} dy={18} textAnchor={'end'} fill="#999">
        {`(${payload.demogLabel})(${(percent * 100).toFixed(2)}%)`}
      </text> */}
    </g>
  );
};

const COLORSex = ['#0088FE', '#00C49F'];
const COLORRace = ['#e8ab3b' , '#000000', '#b1b3b3', '#a45791', '#007dba'];

const RADIAN = Math.PI / 180;


const renderCustomizedLabelCases = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload, index, }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 0) * cos;
  const sy = cy + (outerRadius + 0) * sin;
  const mx = cx + (outerRadius + 25) * cos;
  const my = cy + (outerRadius + 35.5) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;


  return (
    <text x={ex} y={ey } 
      fill="black" textAnchor={x > cx? 'end' : 'start'} dominantBaseline="central">
      {/* {dataKey == "percentCases" ? `${(payload.percentCases).toFixed(0)}%` : `${(payload.caserate).toFixed(0)}`} */}
      {`${(payload.percentCases).toFixed(0)}%`}

    </text>
  );
};

  const renderCustomizedLabelPop = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload, index, }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 0) * cos;
    const sy = cy + (outerRadius + 0) * sin;
    const mx = cx + (outerRadius + 25) * cos;
    const my = cy + (outerRadius + 35.5) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
  
  
    return (
      <text x={ex} y={ey } 
        fill="black" textAnchor={x > cx? 'end' : 'start'} dominantBaseline="central">
        {/* {dataKey == "percentCases" ? `${(payload.percentCases).toFixed(0)}%` : `${(payload.caserate).toFixed(0)}`} */}
        {`${numberWithCommas((payload.percentPop).toFixed(0))}%`}
  
      </text>
    );


  // const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
  // const x = cx + radius * Math.cos(-midAngle * RADIAN);
  // const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  // return (
  //   <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
  //     {`${(percent * 100).toFixed(0)}%`}
  //   </text>
  // );
};



class Race extends PureComponent{
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/hqnrgxpj/';

  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: [index],
    });
    // console.log(index);
  };

  constructor(props) {
    super(props);
 
    this.state = {
      dataTot: [],
    };
  }
  componentDidMount(){
    fetch('/data/nationalDemogdata.json').then(res => res.json()).then(data => this.setState({ 
      dataTot: [
        data['race'][0]['Hispanic'][0], data['race'][0]['Asian'][0],
        data['race'][0]['American Native'][0], data['race'][0]['African American'][0],
        data['race'][0]['White'][0]
      ] }));
  }
   

  render() {
    const { dataTot } = this.state;
    // console.log("here", this.props.rate)

    return (
      <PieChart width={300} height={280}>
        <Pie
          
          activeIndex={10}
          activeShape={renderActiveShape}
          data={dataTot}
          cx={150}
          cy={150}
          innerRadius={50}
          outerRadius={70}
          paddingAngle = {5}
          fill="#8884d8"
          dataKey={this.props.pop == true? "percentPop" : "percentCases"}
          // onMouseEnter={this.onPieEnter}
          labelLine={true}
          label = {this.props.pop == true? renderCustomizedLabelPop: renderCustomizedLabelCases}
          rate = {this.props.pop}
          
        >
          {dataTot.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORRace[index % COLORRace.length]} />
          ))}
        <Label value={this.props.pop == true? "% of Population" : "% of Cases"} position="center" />
          
        </Pie>
      </PieChart>

   
    );
  }
}

const ToPrint = React.forwardRef((props, ref) => (
  
  <div ref={ref} style={{width: 550}}>
  <Grid.Column rows = {2}>
    <Grid.Row style = {{width: 550}}>
      <Grid.Column style = {{width: 550, paddingLeft: 0}}>
        <div>
          <svg width="550" height="80">

              <rect x={80} y={20} width="20" height="20" style={{fill: pieChartRace[0], strokeWidth:1, stroke: pieChartRace[0]}}/>                    
              <text x={110} y={35} style={{fontSize: '16px'}}> White </text>  

              <rect x={255} y={20} width="20" height="20" style={{fill: pieChartRace[1], strokeWidth:1, stroke: pieChartRace[1]}}/>                    
              <text x={285} y={35} style={{fontSize: '16px'}}> African Americans </text>    

              <rect x={430} y={20} width="20" height="20" style={{fill: pieChartRace[2], strokeWidth:1, stroke: pieChartRace[2]}}/>                    
              <text x={460} y={35} style={{fontSize: '16px'}}> Hispanic </text>   

              <rect x={167.5} y={55} width="20" height="20" style={{fill: pieChartRace[3], strokeWidth:1, stroke: pieChartRace[3]}}/>                    
              <text x={197.6} y={70} style={{fontSize: '16px'}}> Asian </text>  

              <rect x={342.5} y={55} width="20" height="20" style={{fill: pieChartRace[4], strokeWidth:1, stroke: pieChartRace[4]}}/>                    
              <text x={372.5} y={70} style={{fontSize: '16px'}}> American Native </text>     
              


              {/* {_.map(pieChartRace, (color, i) => {
                return <rect key={i} x={250} y={20*i} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
              })}  */}
          </svg>
        </div>
      </Grid.Column>
    </Grid.Row>
    <Grid >
      <Grid.Row columns = {2} >
      {/* style = {{width: 550}} */}
        <Grid.Column>
          {/* <Race pop = {false} /> */}
        </Grid.Column>
        <Grid.Column >
          {/* <Race pop = {true}/>  */}
          {/* style = {{width: 200}} */}
        </Grid.Column>
      </Grid.Row>

      {/* <Grid.Row style = {{width: 900}}>
        <Grid.Column style = {{width: 450, paddingLeft: 0}}>
            <div>
              <svg width="450" height="145">

                  <text x={280} y={15} style={{fontSize: '16px'}}> Hispanic</text>                    
                  <text x={280} y={35} style={{fontSize: '16px'}}> American Native</text>                    
                  <text x={280} y={55} style={{fontSize: '16px'}}> Asian</text>                    
                  <text x={280} y={75} style={{fontSize: '16px'}}> African American</text>                    
                  <text x={280} y={95} style={{fontSize: '16px'}}> White</text>                    


                  {_.map(pieChartRace, (color, i) => {
                    return <rect key={i} x={250} y={20*i} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                  })} 
              </svg>
            </div>
          </Grid.Column>
      </Grid.Row> */}
      </Grid>
  </Grid.Column>
  </div>
  
));






function ComparisonTable(props){
  return(
    <div>
      <Header as='h2' style={{fontWeight: 400}}>
        <Header.Content style={{width : 350, height: 100, fontSize: "22px", textAlign: "center", paddingTop: 20, paddingLeft: 35}}>
          Vaccination Status in <br/> <b>{props.stateName}</b>
          
          
        </Header.Content>
      </Header>
      <Grid>
        <Grid.Row style={{width: 350, paddingLeft: 35}}>
          <Table celled fixed style = {{width: 350}}>
            <Table.Header>

           

              <tr textalign = "center" colSpan = "5" style = {{backgroundImage : 'url(/Emory_COVID_header_LightBlue.jpg)'}}>
                <td colSpan='1' style={{width:130}}> </td>
                <td colSpan='1' style={{width:110, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> {props.fips === "_nation" ? "Select State":props.abbrev[props.fips]["state_abbr"]}</td>
                <td colSpan='1' style={{width:110, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> U.S.</td>
              </tr>
              <Table.Row textAlign = 'center' style = {{height: 40}}>
                <Table.HeaderCell style={{fontSize: '14px'}}> {"Number partially vaccinated"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {props.fips === "_nation" ? "":numberWithCommas(props.data[props.fips]["AdministeredPartial"])} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(props.data["_nation"]["AdministeredPartial"])} </Table.HeaderCell>

              </Table.Row>
              <Table.Row textAlign = 'center'>
                <Table.HeaderCell style={{fontSize: '14px'}}> {"Percent partially vaccinated"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {props.fips === "_nation" ? "":numberWithCommas(props.data[props.fips]["PercentAdministeredPartial"]) + "%"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(props.data["_nation"]["PercentAdministeredPartial"]) + "%"} </Table.HeaderCell>

              </Table.Row>
              <Table.Row textAlign = 'center'>
                <Table.HeaderCell style={{fontSize: '14px'}}> {"Number fully vaccinated"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {props.fips === "_nation" ? "":numberWithCommas(props.data[props.fips]["Series_Complete_Yes"])} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(props.data["_nation"]["Series_Complete_Yes"])} </Table.HeaderCell>

              </Table.Row>
              <Table.Row textAlign = 'center'>
                <Table.HeaderCell style={{fontSize: '14px'}}> {"Percent fully vaccinated"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {props.fips === "_nation" ? "":numberWithCommas(props.data[props.fips]["Series_Complete_Pop_Pct"]) + "%"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(props.data["_nation"]["Series_Complete_Pop_Pct"]) + "%"} </Table.HeaderCell>

              </Table.Row>
              
              <Table.Row textAlign = 'center'>
                <Table.HeaderCell style={{fontSize: '14px'}}> {"Distributed on " + props.date} </Table.HeaderCell>
                <Table.HeaderCell  style={{fontSize: '14px'}}> {props.fips === "_nation" ? "":numberWithCommas(props.data[props.fips]["Dist_new"].toFixed(0))} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(props.data["_nation"]["Dist_new"].toFixed(0))} </Table.HeaderCell>

              </Table.Row>
              
            </Table.Header>
          </Table>
        </Grid.Row>
        
      </Grid>
    </div>
  )
}

const RaceBarChart = (props) => {

  // https://codesandbox.io/s/recharts-issue-template-70kry?file=/src/index.js

  const [hoverBar, setHoverBar] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1)

  const valueAccessor = attribute => ({ payload }) => {
    return payload[attribute] < 3 ? null : ( payload[attribute]=== undefined ? null : (payload[attribute]/barRatio).toFixed(1)+'%');

  };

  const renderLegend = (props) => {
    const { payload } = props;
  
    return (
      <ul>
        {
          payload.map((entry, index) => (
            <li key={`item-${index}`}>{entry.value}</li>
          ))
        }
      </ul>
    );
  }

  let barSize = 50
  let strokeWidth = 1.5
  let labelSize = '13px'
  let fontWeight = 500
  let barRatio = 100/103

  const data = [
    {
      name: '% Population',
      white: props.demogData['race'][0]['White'][0]['percentPop']*barRatio,
      black: props.demogData['race'][0]['African American'][0]['percentPop']*barRatio,
      hispanic: props.demogData['race'][0]['Hispanic'][0]['percentPop']*barRatio,
      asian: props.demogData['race'][0]['Asian'][0]['percentPop']*barRatio,
      space: 0.5,
      american_natives: props.demogData['race'][0]['American Native'][0]['percentPop']*barRatio,
      NHPI: props.demogData['race'][0]['NHPI'][0]['percentPop']*barRatio,
      multiOther: props.demogData['vaccineRace'][0]['Multiracial'][0]['percentPop']*barRatio,
    },
    {
      name: '% Cases',
      white: props.fips == '_nation' ? props.demogData['race'][0]['White'][0]['percentCases']*barRatio
         :(props.VaccineData[props.fips][0]['White'][0]['percentVaccinated'] === -9999 ? 0 
            : props.VaccineData[props.fips][0]['White'][0]['percentVaccinated']*barRatio),
      black: props.fips == '_nation' ? props.demogData['race'][0]['African American'][0]['percentCases']*barRatio
         :(props.VaccineData[props.fips][0]['Black'][0]['percentVaccinated'] === -9999 ? 0 
            : props.VaccineData[props.fips][0]['Black'][0]['percentVaccinated']*barRatio),
      hispanic: props.fips == '_nation' ? props.demogData['race'][0]['Hispanic'][0]['percentCases']*barRatio
         :(props.VaccineData[props.fips][0]['Hispanic'][0]['percentVaccinated'] === -9999 ? 0 
            : props.VaccineData[props.fips][0]['Hispanic'][0]['percentVaccinated']*barRatio),
      asian: props.fips == '_nation' ? props.demogData['race'][0]['Asian'][0]['percentCases']*barRatio
         :(props.VaccineData[props.fips][0]['Asian'][0]['percentVaccinated'] === -9999 ? 0 
            : props.VaccineData[props.fips][0]['Asian'][0]['percentVaccinated']*barRatio),
      space: 0.5,
      american_natives: props.fips == '_nation' ? props.demogData['race'][0]['American Native'][0]['percentCases']*barRatio
         :(props.VaccineData[props.fips][0]['American Native'][0]['percentVaccinated'] === -9999 ? 0 
            : props.VaccineData[props.fips][0]['American Native'][0]['percentVaccinated']*barRatio),
      
      NHPI: props.fips == '_nation' ? props.demogData['race'][0]['NHPI'][0]['percentCases']*barRatio
            :(props.VaccineData[props.fips][0]['NHPI'][0]['percentVaccinated'] === -9999 ? 0 
               : props.VaccineData[props.fips][0]['NHPI'][0]['percentVaccinated']*barRatio),

      multiOther: props.fips == '_nation' ? props.demogData['race'][0]['Multiple/Other'][0]['percentCases']*barRatio
      :(props.VaccineData[props.fips][0]['Multiracial'][0]['percentVaccinated'] === -9999 ? 0 
         : props.VaccineData[props.fips][0]['Multiracial'][0]['percentVaccinated']*barRatio)
    }
  ]

  const legendFormatter = (value, entry) => {
    if(value !== 'space'){
      return <span >{value}</span>;
    } else {
      return null;
    }
    
  };

const CustomTooltip = ({ active, payload, label }) => {

  if (active && payload && payload.length && hoverBar[0]>=0) {
    // var colIndex = 6-hoverBar[0];

    return (
      <div className='tooltip' style={{background: 'white', border:'2px', borderStyle:'solid', borderColor: '#DCDCDC', borderRadius:'2px', padding: '0.8rem'}}>
        <p style={{color: pieChartRace[hoverBar[0]], marginBottom: 4}}> <b> {hoverBar[2]} </b> </p>
        {/* ${payload[hoverBar[0]]['name']}  */}
        <p className="label" style={{marginBottom: 3}}>{`% Population: ${(data[0][hoverBar[1]]/barRatio).toFixed(1)}`}</p>
        <p className="label" style={{marginBottom: 0}}>{`% Cases : ${(data[1][hoverBar[1]]/barRatio).toFixed(1)}`}</p>
      </div>
    );
  }

  return null;
};

// console.log('active index', activeIndex);

  return(
    // <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={400}
          height={500}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 10,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis domain={[dataMin => 0, dataMax => (dataMax.toFixed(0))]}/>
          <Tooltip content={<CustomTooltip />}
          // formatter={function(value, name) {
          //     if(name === hoverBar){
          //       return [value,name];
          //     }else {
          //       return null
          //     }
          //   }}
             cursor={false}/>
          {/* content={renderTooltip}  content={<CustomTooltip />}*/}
          <Legend width={410} formatter={legendFormatter}/>
          <Bar name='Hispanic' id='hispanic' barSize={barSize} dataKey="hispanic" stackId="a" fill={pieChartRace[2]}
            isAnimationActive={false}
            onMouseEnter={()=>{setHoverBar([2,'hispanic', 'Hispanic']); setActiveIndex(2)}}
            onMouseLeave={()=>setActiveIndex(-1)}>
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} stroke='white' strokeWidth={strokeWidth}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("hispanic")} fill='white' fontWeight={fontWeight} fontSize={labelSize}/>
          </Bar>

          <Bar name='space' id='space' barSize={barSize} dataKey="space" stackId="a" fill='white'
            isAnimationActive={false}> 
          </Bar>

          <Bar name='African Americans' id='black' barSize={barSize} dataKey="black" stackId="a" fill={pieChartRace[1]}
            isAnimationActive={false}
            onMouseEnter={()=>{setHoverBar([1,'black', 'African Americans']); setActiveIndex(1)}}
            onMouseLeave={()=>setActiveIndex(-1)}>
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} stroke='white' strokeWidth={strokeWidth}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("black")} fill='white' fontWeight={fontWeight} fontSize={labelSize}/>
          </Bar>

          <Bar name='space' id='space' barSize={barSize} dataKey="space" stackId="a" fill='white'
            isAnimationActive={false}> 
          </Bar>

          <Bar name='Asian' id='asian' barSize={barSize} dataKey="asian" stackId="a" fill={pieChartRace[3]}
            isAnimationActive={false}
            onMouseEnter={()=>{setHoverBar([3,'asian', 'Asian']); setActiveIndex(3)}}
            onMouseLeave={()=>setActiveIndex(-1)}> 
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} stroke='white' strokeWidth={strokeWidth}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("asian")} fill='white' fontWeight={fontWeight} fontSize={labelSize}/>
          </Bar>

          <Bar name='space' id='space' barSize={barSize} dataKey="space" stackId="a" fill='white'
            isAnimationActive={false}> 
          </Bar>
          
          <Bar name='Native Hawaiian/Pacific Islanders' id='NHPI' barSize={barSize} dataKey="NHPI" stackId="a" fill={pieChartRace[5]}
            isAnimationActive={false}
            onMouseEnter={()=>{setHoverBar([5,'NHPI', 'Native Hawaiian/Pacific Islanders']); setActiveIndex(5)}}
            onMouseLeave={()=>setActiveIndex(-1)}>
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} stroke='white' strokeWidth={2}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("NHPI")} position="left" fill='black'/>
          </Bar>

          <Bar name='space' id='space' barSize={barSize} dataKey="space" stackId="a" fill='white'
            isAnimationActive={false}> 
          </Bar>

          <Bar name='American Native' id='an' barSize={barSize} dataKey="american_natives" stackId="a" fill={pieChartRace[4]}
            isAnimationActive={false}
            onMouseEnter={()=>{setHoverBar([4,'american_natives', 'American Native']); setActiveIndex(4)}}
            onMouseLeave={()=>setActiveIndex(-1)}>
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} stroke='white' strokeWidth={0.5}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("american_natives")} position="right" fill='black'/>
          </Bar>
          
          <Bar name='space' id='space' barSize={barSize} dataKey="space" stackId="a" fill='white'
            isAnimationActive={false}> 
          </Bar>
          
          <Bar name='White' id='white' barSize={barSize} dataKey="white" stackId="a" fill={pieChartRace[0]}
            isAnimationActive={false}
            onMouseEnter={()=>{setHoverBar([0,'white','White']); setActiveIndex(0)}}
            onMouseLeave={()=>setActiveIndex(-1)}>
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} stroke='white' strokeWidth={strokeWidth}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("white")} fill='white' fontWeight={fontWeight} fontSize={labelSize}/>
          </Bar>

          <Bar name='space' id='space' barSize={barSize} dataKey="space" stackId="a" fill='white'
            isAnimationActive={false}> 
          </Bar>

          <Bar name='Multiracial' id='multiOther' barSize={barSize} dataKey="multiOther" stackId="a" fill={pieChartRace[6]}
            isAnimationActive={false}
            onMouseEnter={()=>{setHoverBar([6,'multiOther', 'Multiracial']); setActiveIndex(6)}}
            onMouseLeave={()=>setActiveIndex(-1)}>
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} stroke='white' strokeWidth={strokeWidth}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("multiOther")}  fill='white' fontWeight={fontWeight} fontSize={labelSize}/>
          </Bar>
          
        </BarChart>
      
  )
}

function TabExampleBasic(props){
  // console.log('fips', props.fips)
  const panes = [
    { menuItem: 'State & Nation Vaccination', render: () => 
      <Tab.Pane attached={false}>
        <ComparisonTable 
          data = {props.data} 
          fips = {props.fips} 
          stateName = {props.stateName} 
          abbrev = {props.abbrev}
          date = {props.date}
        />
      </Tab.Pane> 
    },
    { menuItem: 'Vaccination by Race & Ethnicity', render: () => 
      <Tab.Pane attached={false}>
        <RaceBarChart
          demogData = {props.demogData}
          fips = {props.fips}
          VaccineData = {props.VaccineData}
        />
      </Tab.Pane> },
  ]

  return(
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
  )
}
const SideRaceBarChart = (props) => {

  // https://codesandbox.io/s/recharts-issue-template-70kry?file=/src/index.js

  const [hoverBar, setHoverBar] = useState();
  const [activeIndex, setActiveIndex] = useState(-1)

  // const valueAccessor = attribute => ({ payload }) => {
  //   return payload[attribute] < 3 ? null : ( payload[attribute]=== undefined ? null : (payload[attribute]/barRatio).toFixed(1)+'%');

  // };

  const renderLegend = (props) => {
    const { payload } = props;
  
    return (
      <ul>
        {
          payload.map((entry, index) => (
            <li key={`item-${index}`}>{entry.value}</li>
          ))
        }
      </ul>
    );
  }

  let barSize = 50
  let strokeWidth = 0.6
  let labelSize = '11px'
  let fontWeight = 500
  let tickFontSize = props.inTab === true ? 10 : 12

  const data = [
    {name:'Multiple/Other', popvalue: props.demogData['race'][0]['Multiple/Other'][0]['percentPop'],
    vaxvalue: props.vacc === false ? props.demogData['race'][0]['Multiple/Other'][0]['percentCases'] :
              props.demogData['vaccineRace'][0]['Multiracial'][0]['seriesCompletePopPctKnown'] },
    {name:'Native Hawaiian/Pacific Islanders', popvalue: props.demogData['race'][0]['NHPI'][0]['percentPop'],
    vaxvalue: props.vacc === false ? props.demogData['race'][0]['NHPI'][0]['percentCases'] :
              props.demogData['vaccineRace'][0]['NHPI'][0]['seriesCompletePopPctKnown']},
    {name:'American Natives', popvalue: props.demogData['race'][0]['American Native'][0]['percentPop'],
    vaxvalue: props.vacc === false ? props.demogData['race'][0]['American Native'][0]['percentCases'] :
              props.demogData['vaccineRace'][0]['American Native'][0]['seriesCompletePopPctKnown']},
    {name: 'Asian', popvalue: props.demogData['race'][0]['Asian'][0]['percentPop'],
    vaxvalue: props.vacc === false ? props.demogData['race'][0]['Asian'][0]['percentCases'] :
              props.demogData['vaccineRace'][0]['Asian'][0]['seriesCompletePopPctKnown']},
    {name: 'African Americans', popvalue : props.demogData['race'][0]['African American'][0]['percentPop'],
    vaxvalue: props.vacc === false ? props.demogData['race'][0]['African American'][0]['percentCases'] :
              props.demogData['vaccineRace'][0]['African American'][0]['seriesCompletePopPctKnown']},
    {name: 'Hispanic', popvalue: props.demogData['race'][0]['Hispanic'][0]['percentPop'],
    vaxvalue: props.vacc === false ? props.demogData['race'][0]['Hispanic'][0]['percentCases'] :
              props.demogData['vaccineRace'][0]['Hispanic'][0]['seriesCompletePopPctKnown']},
    {name: 'White', popvalue: props.demogData['race'][0]['White'][0]['percentPop'],
    vaxvalue: props.vacc === false ? props.demogData['race'][0]['White'][0]['percentCases'] :
              props.demogData['vaccineRace'][0]['White'][0]['seriesCompletePopPctKnown']}
      
  ]



  const CustomTooltip = ({ active, payload, label }) => {

    if (active && payload && payload.length ) {

      return (
        <div className='tooltip' style={{background: 'white', border:'2px', borderStyle:'solid', borderColor: '#DCDCDC', borderRadius:'2px', padding: '0.8rem'}}>
          <p style={{color: sideBySideColor[data.indexOf(payload[0].payload)], marginBottom: 4}}> <b> {payload[0].payload.name} </b> </p>
          {/* ${payload[hoverBar[0]]['name']}  */}
          <p className="label" style={{marginBottom: 3}}>% Population: {payload[0].payload.popvalue.toFixed(1)}</p>
          <p className="label" style={{marginBottom: 0}}>% Cases: {payload[0].payload.vaxvalue.toFixed(1)}</p>
        </div>
      );
    }

    return null;
  };

  const CustomizedLabellist =(props) =>{
    const { width, height, x, y, value } = props;

    return (
      <g>
      {(()=>{ if(value > 60){
          return <text x={x+width-40} y={height/2+y+4} fill="#FFF" fontSize={labelSize}>{value.toFixed(1)}%</text>
      }else{
        return <text x={x+width+6} y={height/2+y+4} fill="#000" fontSize={labelSize}>{value.toFixed(1)}%</text>
      }
      })()}
      </g>
    )
  }

  const valueAccessor = (entry) => {
    return entry ? (entry.value.toFixed(1) + '%') : null;
  };

  console.log('active index', activeIndex);

  const sideBySideColor = [pieChartRace[6], pieChartRace[5],pieChartRace[4],pieChartRace[3],pieChartRace[1],pieChartRace[2], pieChartRace[0]]

  return(
    <Grid style = {{paddingTop: 50}}>
      <Grid.Column width={props.inTab===true ? 8 : 7} style={{paddingLeft: '0.5rem',paddingRight: 0}}>
        <Header style={{fontSize: '10pt', paddingLeft: 5}}> <center> {props.vacc ? "% Vaccination" : "% Cases"} </center> </Header>
          <BarChart
              layout='vertical'
              width={props.inTab===true ? 200 : 260}
              height={330}
              data={data}
              margin={{
                top: 0,
                right: 15,
                left: props.inTab===true ? 25: 35,
                bottom: 0,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis type="number"/>
              {/* domain={[dataMin => 0, dataMax => (dataMax.toFixed(0))]} */}
              <YAxis type="category" dataKey='name' tick={{fontSize: tickFontSize, fill:'black'}}/>
              <Tooltip content={<CustomTooltip />}
              // formatter={function(value, name) {
              //     if(name === hoverBar){
              //       return [value,name];
              //     }else {
              //       return null
              //     }
              //   }}
                cursor={false}/>
              <Bar dataKey="vaxvalue"
                isAnimationActive={false}>
                {
                  data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sideBySideColor[index]}/>
                  ))
                }
                <LabelList position="right" content={<CustomizedLabellist />} fill='black' strokeWidth={strokeWidth} fontWeight={fontWeight} fontSize={labelSize}/>
                {/* valueAccessor={valueAccessor} */}
              </Bar>
              

              
            </BarChart>
          </Grid.Column>
          <Grid.Column width={props.inTab===true ? 8 : 9} style={{paddingLeft: 50}}>
            <Header style={{fontSize: '10pt', paddingLeft: 5}}> <center> % Population </center> </Header>
            <BarChart
            layout='vertical'
            width={props.inTab===true ? 210 : 260}
            height={330}
            data={data}
            margin={{
              top: 0,
              right: 15,
              left: props.inTab===true ? 30 : 35,
              bottom: 0,
            }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis type="number"/>
              {/* domain={[dataMin => 0, dataMax => (dataMax.toFixed(0))]} */}
              <YAxis type="category" dataKey='name' tick={{fontSize: tickFontSize, fill:'black'}}/>
              <Tooltip content={<CustomTooltip />}
              // formatter={function(value, name) {
              //     if(name === hoverBar){
              //       return [value,name];
              //     }else {
              //       return null
              //     }
              //   }}
                cursor={false}/>
              <Bar dataKey="popvalue"
                isAnimationActive={false}>
                {
                  data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sideBySideColor[index]}/>
                  ))
                }
                <LabelList position="right" content={<CustomizedLabellist />} fill='black' strokeWidth={strokeWidth} fontWeight={fontWeight} fontSize={labelSize}/>
                {/* valueAccessor={valueAccessor} */}
              </Bar>

          
            </BarChart>
          </Grid.Column>
          {/* <Grid.Row>
          <Grid style={{paddingTop: '3.5rem'}}>
            <Legend width={450} wrapperStyle={{paddingLeft: "60px"}} 
              iconSize={10} payload={
              data.map(
                item => ({
                  id: item.name,
                  type: "square",
                  value: `${item.name}`,
                  color: sideBySideColor[data.indexOf(item)]
                })
              )
            }/>
          </Grid>
          </Grid.Row> */}
      </Grid>
      
  )
}
export default function NationalReport(props) {
  const characterRef = createRef();
  const [activeCharacter, setActiveCharacter] = useState('');
  const [data, setData] = useState();
  const [date, setDate] = useState('');
  const [vaccineDate, setVaccineDate] = useState('');
  const [nationalDemogDate, setNationalDemogDate] = useState('');

  const [fips, setFips] = useState('13');
  const [nationalDemog, setNationalDemog] = useState();

  const [dataTS, setDataTS] = useState();
  // const [tempData, setTempData] = useState()
  const [vaccineData, setVaccineData] = useState();

  const [topTen, setTopTen] = useState();
  const [states50, setStates50] = useState();

  const [dataTopCases, setDataTopCases] = useState();
  const [dataTopMortality, setDataTopMortality] = useState();
  // const [nationalBarChart['caserate7day'][0], setnationalBarChart['caserate7day'][0]] = useState();
  // const [nationalBarChart['covidmortality7day'][0], setnationalBarChart['covidmortality7day'][0]] = useState();

  const [nationalBarChart, setNationalBarChart] = useState();

  const [percentChangeCases, setPercentChangeCases] = useState();

  const [percentChangeMortality, setPercentChangeMortality] = useState();
  const [mean7dayCases, setMean7dayCases] = useState();
  const [mortalityMean, setMortalityMean] = useState();

  const [dailyCases, setDailyCases] = useState();
  const [dailyDeaths, setDailyDeaths] = useState();

  const [bar, LoadBar] = useState(false);

  const [colorScale, setColorScale] = useState();
  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [ccvi] = useState("ccvi");
  const [colorccvi, setColorccvi] = useState();
  const [legendMaxccvi, setLegendMaxccvi] = useState([]);
  const [legendMinccvi, setLegendMinccvi] = useState([]);
  const [legendSplitccvi, setLegendSplitccvi] = useState([]);

  // const [metric, setMetric] = useState("ccvi");
  // const [colorMetric, setColorMetric] = useState();
  // const [legendMaxMetric, setLegendMaxMetric] = useState([]);
  // const [legendMinMetric, setLegendMinMetric] = useState([]);
  // const [legendSplitMetric, setLegendSplitMetric] = useState([]);

  const [pctVacPopDisp, setPctVacPopDisp] = useState(0);
  const [finalStr, setFinalStr] = useState('');

  const [resSeg] = useState("resSeg");
  const [colorResSeg, setColorResSeg] = useState();
  const [legendMaxResSeg, setLegendMaxResSeg] = useState([]);
  const [legendMinResSeg, setLegendMinResSeg] = useState([]);
  const [legendSplitResSeg, setLegendSplitResSeg] = useState([]);

  const [black] = useState("black");
  const [colorBlack, setColorBlack] = useState();
  const [legendMaxBlack, setLegendMaxBlack] = useState([]);
  const [legendMinBlack, setLegendMinBlack] = useState([]);
  const [legendSplitBlack, setLegendSplitBlack] = useState([]);

  const [poverty] = useState("poverty");
  const [colorPoverty, setColorPoverty] = useState();
  const [legendMaxPoverty, setLegendMaxPoverty] = useState([]);
  const [legendMinPoverty, setLegendMinPoverty] = useState([]);
  const [legendSplitPoverty, setLegendSplitPoverty] = useState([]);

  const [Comorb] = useState("anycondition");
  const [colorComorb, setColorComorb] = useState();
  const [legendMaxComorb, setLegendMaxComorb] = useState([]);
  const [legendMinComorb, setLegendMinComorb] = useState([]);
  const [legendSplitComorb, setLegendSplitComorb] = useState([]);

  const [Copd] = useState("copd");
  const [colorCopd, setColorCopd] = useState();
  const [legendMaxCopd, setLegendMaxCopd] = useState([]);
  const [legendMinCopd, setLegendMinCopd] = useState([]);
  const [legendSplitCopd, setLegendSplitCopd] = useState([]);

  const [Ckd] = useState("ckd");
  const [colorCkd, setColorCkd] = useState();
  const [legendMaxCkd, setLegendMaxCkd] = useState([]);
  const [legendMinCkd, setLegendMinCkd] = useState([]);
  const [legendSplitCkd, setLegendSplitCkd] = useState([]);

  const [Diabetes] = useState("diabetes");
  const [colorDiabetes, setColorDiabetes] = useState();
  const [legendMaxDiabetes, setLegendMaxDiabetes] = useState([]);
  const [legendMinDiabetes, setLegendMinDiabetes] = useState([]);
  const [legendSplitDiabetes, setLegendSplitDiabetes] = useState([]);

  const [Heart] = useState("heartdisease");
  const [colorHeart, setColorHeart] = useState();
  const [legendMaxHeart, setLegendMaxHeart] = useState([]);
  const [legendMinHeart, setLegendMinHeart] = useState([]);
  const [legendSplitHeart, setLegendSplitHeart] = useState([]);

  const [Obesity] = useState("obesity");
  const [colorObesity, setColorObesity] = useState();
  const [legendMaxObesity, setLegendMaxObesity] = useState([]);
  const [legendMinObesity, setLegendMinObesity] = useState([]);
  const [legendSplitObesity, setLegendSplitObesity] = useState([]);

  // --------------------------
  const [caseTicks, setCaseTicks] = useState([]);
  const [caseYTicks, setCaseYTicks] = useState([]);
  // --------------------------

  const [urbrur] = useState("urbanrural");
  const [dataUrb, setDataUrb] = useState();
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();  


  const [region, setRegion] = useState("region");
  const [colorRegion, setColorRegion] = useState();

  const [covidMetric, setCovidMetric] = useState({cases: 'N/A', deaths: 'N/A', 
                                                  caseRate: "N/A", mortality: "N/A", 
                                                  caseRateMean: "N/A", mortalityMean: "N/A",
                                                  caseRateMA: "N/A", mortalityMA: "N/A",
                                                  cfr:"N/A", t: 'n/a'});
  const [varMap, setVarMap] = useState({});
  const [vaxVarMap, setVaxVarMap] = useState({});

  const [metricName, setMetricName] = useState('COVID-19 Community Vulnerability Index');
  const [metricOptions, setMetricOptions] = useState();

  useEffect(()=>{


    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        setMetricOptions(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.variable, text: d.name, group: d.group};
        }), d => (
          d.value === "ccvi" || d.value === "poverty" || d.value === "urbanrural" || 
          d.value === "region" || d.value === "black" || d.value === "resSeg" 
        )));
      });
    fetch('/data/vaccinedate.json').then(res => res.json())
      .then(x => {setVaccineDate(x.date.substring(5,7) + "/" + x.date.substring(8,10));});
    fetch('/data/rawdata/variable_mapping_Vaccine.json').then(res => res.json())
      .then(x => {setVaxVarMap(x);});
    fetch('/data/vaccineData.json').then(res => res.json())
      .then(x => {
        setVaccineData(x);
        const cs = scaleQuantile()
          .domain(_.map(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d["percentVaccinatedDose1"] >= 0 &&
                d.fips.length === 2)),
            d=> d["percentVaccinatedDose1"]))
          .range(colorPalette);

          let scaleMap = {}
          _.each(x, d=>{
            if(d["percentVaccinatedDose1"] >= 0){
            scaleMap[d["percentVaccinatedDose1"]] = cs(d["percentVaccinatedDose1"])}});
        
          setColorScale(scaleMap);
          var max = 0
          var min = 100
          _.each(x, d=> { 
            if (d["percentVaccinatedDose1"] > max && d.fips.length === 2) {
              max = d["percentVaccinatedDose1"]
            } else if (d.fips.length === 2 && d["percentVaccinatedDose1"] < min && d["percentVaccinatedDose1"] >= 0){
              min = d["percentVaccinatedDose1"]
            }
          });

          if (max > 999999) {
            max = (max/1000000).toFixed(0) + "M";
            setLegendMax(max);
          }else if (max > 999) {
            max = (max/1000).toFixed(0) + "K";
            setLegendMax(max);
          }else{
            setLegendMax(max.toFixed(0));

          }
          setLegendMin(min.toFixed(0));
          setLegendSplit(cs.quantiles());
        
      });
  }, []);


  useEffect(()=>{

      fetch('/data/contristates.json').then(res => res.json())
        .then(x => {
          setStates50(x);

        });

      fetch('/data/topten.json').then(res => res.json())
        .then(x => {
          setTopTen(x);
        });

      fetch('/data/nationalBarChart.json').then(res => res.json())
        .then(x => {
          setNationalBarChart(x);
        });

      fetch('/data/date.json').then(res => res.json())
        .then(x => setDate(x.date.substring(5,7) + "/" + x.date.substring(8,10) + "/" + x.date.substring(0,4)));

      fetch('/data/vaccinedate.json').then(res => res.json())
        .then(x => {setVaccineDate(x.date.substring(5,7) + "/" + x.date.substring(8,10) + "/" + x.date.substring(0,4));});
      
      fetch('/data/nationalDemogdate.json').then(res => res.json())
        .then(x => setNationalDemogDate(x.date.substring(5,7) + "/" + x.date.substring(8,10) + "/" + x.date.substring(0,4)));

      // fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      //   .then(x => setVarMap(x));
      
      fetch('/data/topTenCases.json').then(res => res.json())
        .then(x => setDataTopCases(x));

      fetch('/data/topTenMortality.json').then(res => res.json())
        .then(x => setDataTopMortality(x));
      
      fetch('/data/nationalDemogdata.json').then(res => res.json())
        .then(x => {
          setNationalDemog(x); 
          console.log(x);
          var listW = [];
          var count = (x['vaccineRace'][0]['White'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['White'][0]['percentPop']) 
          + 
          (x['vaccineRace'][0]['Hispanic'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['Hispanic'][0]['percentPop']) 
          + 
          (x['vaccineRace'][0]['African American'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['African American'][0]['percentPop']) 
          +
          (x['vaccineRace'][0]['Asian'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['Asian'][0]['percentPop'])
          +
          (x['vaccineRace'][0]['American Native'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['American Native'][0]['percentPop'])
          +
          (x['vaccineRace'][0]['NHPI'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['NHPI'][0]['percentPop'])
          +
          (x['vaccineRace'][0]['Unknown'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['Unknown'][0]['percentPop'])
          +
          (x['vaccineRace'][0]['Multiracial'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['Multiracial'][0]['percentPop']);

          setPctVacPopDisp(count);

          if(x['vaccineRace'][0]['White'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['White'][0]['percentPop']){
            listW.push("White Americans");
          }
          if(x['vaccineRace'][0]['Hispanic'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['Hispanic'][0]['percentPop']){
            listW.push("Hispanic Americans");
          }
          if(x['vaccineRace'][0]['African American'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['African American'][0]['percentPop']){
            listW.push("African Americans");
          }
          if(x['vaccineRace'][0]['Asian'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['Asian'][0]['percentPop']){
            listW.push("Asian Americans");
          }
          if(x['vaccineRace'][0]['American Native'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['American Native'][0]['percentPop']){
            listW.push("Native Americans");
          }
          if(x['vaccineRace'][0]['NHPI'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['NHPI'][0]['percentPop']){
            listW.push("Native Hawaiian and Pacific Islanders");
          }
          if(x['vaccineRace'][0]['Unknown'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['Unknown'][0]['percentPop']){
            listW.push("Unknown");
          }
          if(x['vaccineRace'][0]['Multiracial'][0]['seriesCompletePopPctKnown'] >= x['vaccineRace'][0]['Multiracial'][0]['percentPop']){
            listW.push("Americans of Multiple races");
          }
          var joinedStr = listW.join();
          console.log(joinedStr);
          var indexStr = 0;
          var i;
          for (i = 0; i< (count - 1); i++){
            indexStr = joinedStr.indexOf(',', indexStr + 1);
            joinedStr = joinedStr.substring(0, indexStr + 1) + " " + joinedStr.substring(indexStr + 1);
          };
          var left = joinedStr.substring(0, indexStr);
          var right = joinedStr.substring(indexStr+1); 

          if(count == 1){
          }else if(count == 2){
            setFinalStr(left + " and " + right);
          }else if(count > 2){
            setFinalStr(left + ", and " + right); 
          }
        });
        

    },[]);

    useEffect(()=>{
      if (isLoggedIn === true){
        // fetchData();
      } else {
        handleAnonymousLogin();
      }
    },[isLoggedIn]);

    // useEffect(() => {
    //   fetch('/data/data.json').then(res => res.json())
    //     .then(x => {
    //       setData(x);  
    //     });

    //   fetch('/data/timeseries_nation.json').then(res => res.json())
    //     .then(x => {
          
    //     });
    // })


    useEffect(() => {

      let seriesDict = {};
      let newDict = {};
      const fetchTimeSeries = async() => { 
        const mainQ = {tag: "nationalrawfull"};
        const promStatic = await CHED_static.find(mainQ,{projection:{}}).toArray();
        // console.log(promStatic[0].data);

        const testQ = {full_fips: "_nation"};
        const promTs = await CHED_series.find(testQ,{projection:{}}).toArray();
                    
        setData(promStatic[0].data);  

        
        _.map(promTs, i=> {
            seriesDict[i[Object.keys(i)[4]]] = i[Object.keys(i)[5]];
        });
        
        let t = 0;
        
        let percentChangeC = 0;
        let percentChangeM = 0;
        let cRateMean = 0;
        let dailyC = 0;
        let dailyD = 0;
        let mMean = 0;
          
        _.each(seriesDict, (v, k)=>{
          if(k === "_nation" && v.length > 0 && v[v.length-1].t > t){

              percentChangeC = v[v.length-1].percent14dayDailyCases;
              percentChangeM = v[v.length-1].percent14dayDailyDeaths;
              cRateMean = v[v.length-1].caseRateMean;
              mMean = v[v.length-1].mortalityMean;
              dailyC = v[v.length-1].dailyCases;
              dailyD = v[v.length-1].dailyMortality;
            }

        });

          setPercentChangeCases(percentChangeC.toFixed(0) + "%");
          setMean7dayCases(cRateMean.toFixed(0));
          setPercentChangeMortality(percentChangeM.toFixed(0) + "%");
          setMortalityMean(mMean.toFixed(0));

          setDailyCases(dailyC.toFixed(0));
          setDailyDeaths(dailyD.toFixed(0));
          setDataTS(seriesDict);
      };

      fetchTimeSeries();
    }, []);


    // useEffect(() => {
    //     // === "resSeg" ? "RS_blackwhite" : metric === "urbanrural" ? "_013_Urbanization_Code" : metric
    //       if(data && metric){
    //       //metric
    //       const cs = scaleQuantile()
    //       .domain(_.map(_.filter(_.map(data, (d, k) => {
    //         d.fips = k
    //         return d}), 
    //         d => (
    //             d[metric] > 0 &&
    //             d.fips.length === 5)),
    //         d=> d[metric]))
    //       .range(colorPalette);
  
    //       let scaleMap = {}
    //       _.each(data, d=>{
    //         if(d[metric] > 0){
    //         scaleMap[d[metric]] = cs(d[metric])}
    //       });
        
    //       setColorMetric(scaleMap);
    //       var max = 0
    //       var min = 100
    //       _.each(data, d=> { 
    //         if (d[metric] > max && d.fips.length === 5) {
    //           max = d[metric]
    //         } else if (d.fips.length === 5 && d[metric] < min && d[metric] > 0){
    //           min = d[metric]
    //         }
    //       });
  
    //       if (max > 999999) {
    //         max = (max/1000000).toFixed(0) + "M";
    //         setLegendMaxMetric(max);
    //       }else if (max > 999) {
    //         max = (max/1000).toFixed(0) + "K";
    //         setLegendMaxMetric(max);
    //       }else{
    //         setLegendMaxMetric(max.toFixed(0));
  
    //       }
    //       setLegendMinMetric(min.toFixed(0));
  
    //       setLegendSplitMetric(cs.quantiles());


    //     }



    // },[data, metric]);


    useEffect(() => {
      //ccvi
      //metric
      const cs = scaleQuantile()
      .domain(_.map(_.filter(_.map(data, (d, k) => {
        d.fips = k
        return d}), 
        d => (
            d[ccvi] > 0 &&
            d.fips.length === 5)),
        d=> d[ccvi]))
      .range(colorPalette);

      let scaleMap = {}
      _.each(data, d=>{
        if(d[ccvi] > 0){
        scaleMap[d[ccvi]] = cs(d[ccvi])}
      });
    
      setColorccvi(scaleMap);
      var max = 0
      var min = 100
      _.each(data, d=> { 
        if (d[ccvi] > max && d.fips.length === 5) {
          max = d[ccvi]
        } else if (d.fips.length === 5 && d[ccvi] < min && d[ccvi] > 0){
          min = d[ccvi]
        }
      });

      if (max > 999999) {
        max = (max/1000000).toFixed(0) + "M";
        setLegendMaxccvi(max);
      }else if (max > 999) {
        max = (max/1000).toFixed(0) + "K";
        setLegendMaxccvi(max);
      }else{
        setLegendMaxccvi(max.toFixed(0));

      }
      setLegendMinccvi(min.toFixed(0));

      setLegendSplitccvi(cs.quantiles());


        

      

    },[data]);

    //replace
    useEffect(() => {
      if(data && ccvi){
        //poverty
        const cs_poverty = scaleQuantile()
        .domain(_.map(_.filter(_.map(data, (d, k) => {
          d.fips = k
          return d}), 
          d => (
              d[poverty] > 0 &&
              d.fips.length === 5)),
          d=> d[poverty]))
        .range(colorPalette);

        let scaleMap_poverty = {}
        _.each(data, d=>{
          if(d[poverty] > 0){
            scaleMap_poverty[d[poverty]] = cs_poverty(d[poverty])}
        });
      
        setColorPoverty(scaleMap_poverty);
        var max_poverty = 0
        var min_poverty = 100
        _.each(data, d=> { 
          if (d[poverty] > max_poverty && d.fips.length === 5) {
            max_poverty = d[poverty]
          } else if (d.fips.length === 5 && d[poverty] < min_poverty && d[poverty] > 0){
            min_poverty = d[poverty]
          }
        });
        if (max_poverty > 999999) {
          max_poverty = (max_poverty/1000000).toFixed(0) + "M";
          setLegendMaxPoverty(max_poverty);
        }else if (max_poverty > 999) {
          max_poverty = (max_poverty/1000).toFixed(0) + "K";
          setLegendMaxPoverty(max_poverty);
        }else{
          setLegendMaxPoverty(max_poverty.toFixed(0));
        }
        setLegendMinPoverty(min_poverty.toFixed(0));
        setLegendSplitPoverty(cs_poverty.quantiles());

      }

    },[data, ccvi]);

    useEffect(() => {
      if(data && poverty){
        //urbrur
        let tempDict = {};
        _.map(_.filter(_.map(data, (d, k) => {
          d.fips = k
          return d}), 
          d => (
              d[urbrur] !== "" &&
              d.fips.length === 5)), i => {
                tempDict[i.fips] = i
                return tempDict;
              });
        setDataUrb(tempDict);
      }

    }, [data, poverty])

//replace


    //replace
    // useEffect(() => {
    //   if(data && male){

    //       //age65over
    //       const cs_age65 = scaleQuantile()
    //       .domain(_.map(_.filter(_.map(data, (d, k) => {
    //         d.fips = k
    //         return d}), 
    //         d => (
    //             d[age65] > 0 &&
    //             d.fips.length === 5)),
    //         d=> d[age65]))
    //       .range(colorPalette);
  
    //       let scaleMap_age65 = {}
    //       _.each(data, d=>{
    //         if(d[age65] > 0){
    //           scaleMap_age65[d[age65]] = cs_age65(d[age65])}
    //       });
        
    //       setColorAge65(scaleMap_age65);
    //       var max_age65 = 0
    //       var min_age65 = 100
    //       _.each(data, d=> { 
    //         if (d[age65] > max_age65 && d.fips.length === 5) {
    //           max_age65 = d[age65]
    //         } else if (d.fips.length === 5 && d[age65] < min_age65 && d[age65] > 0){
    //           min_age65 = d[age65]
    //         }
    //       });
    //       if (max_age65 > 999999) {
    //         max_age65 = (max_age65/1000000).toFixed(0) + "M";
    //         setLegendMaxAge65(max_age65);
    //       }else if (max_age65 > 999) {
    //         max_age65 = (max_age65/1000).toFixed(0) + "K";
    //         setLegendMaxAge65(max_age65);
    //       }else{
    //         setLegendMaxAge65(max_age65.toFixed(0));
    //       }
    //       setLegendMinAge65(min_age65.toFixed(0));
    //       setLegendSplitAge65(cs_age65.quantiles());

    //   }

    // },[data, male]);
    

    
    useEffect(() => {
      if(data && urbrur){
        //black
        const cs_black = scaleQuantile()
        .domain(_.map(_.filter(_.map(data, (d, k) => {
          d.fips = k
          return d}), 
          d => (
              d[black] > 0 &&
              d.fips.length === 5)),
          d=> d[black]))
        .range(colorPalette);

        let scaleMap_black = {}
        _.each(data, d=>{
          if(d[black] > 0){
            scaleMap_black[d[black]] = cs_black(d[black])}
        });
      
        setColorBlack(scaleMap_black);
        var max_black = 0
        var min_black = 100
        _.each(data, d=> { 
          if (d[black] > max_black && d.fips.length === 5) {
            max_black = d[black]
          } else if (d.fips.length === 5 && d[black] < min_black && d[black] > 0){
            min_black = d[black]
          }
        });
        if (max_black > 999999) {
          max_black = (max_black/1000000).toFixed(0) + "M";
          setLegendMaxBlack(max_black);
        }else if (max_black > 999) {
          max_black = (max_black/1000).toFixed(0) + "K";
          setLegendMaxBlack(max_black);
        }else{
          setLegendMaxBlack(max_black.toFixed(0));
        }
        setLegendMinBlack(min_black.toFixed(0));
        setLegendSplitBlack(cs_black.quantiles());
      }

    },[data, urbrur]);

    useEffect(() => {
      if(data && black){
        //ResSeg
        const csii = scaleQuantile()
        .domain(_.map(_.filter(_.map(data, (d, k) => {
          d.fips = k
          return d}), 
          d => (
              d[resSeg] > 0 &&
              d.fips.length === 5)),
          d=> d[resSeg]))
        .range(colorPalette);

        let scaleMapii = {}
        _.each(data, d=>{
          if(d[resSeg] > 0){
          scaleMapii[d[resSeg]] = csii(d[resSeg])}
        });
      
        setColorResSeg(scaleMapii);
        var maxii = 0
        var minii = 100
        _.each(data, d=> { 
          if (d[resSeg] > maxii && d.fips.length === 5) {
            maxii = d[resSeg]
          } else if (d.fips.length === 5 && d[resSeg] < minii && d[resSeg] > 0){
            minii = d[resSeg]
          }
        });
        if (maxii > 999999) {
          maxii = (maxii/1000000).toFixed(0) + "M";
          setLegendMaxResSeg(maxii);
        }else if (maxii > 999) {
          maxii = (maxii/1000).toFixed(0) + "K";
          setLegendMaxResSeg(maxii);
        }else{
          setLegendMaxResSeg(maxii.toFixed(0));
        }
        setLegendMinResSeg(minii.toFixed(0));
        setLegendSplitResSeg(csii.quantiles());


      }

    },[data, black]);

    useEffect(() => {
      if(data && resSeg){
        //comorb
        const csii = scaleQuantile()
        .domain(_.map(_.filter(_.map(data, (d, k) => {
          d.fips = k
          return d}), 
          d => (
              d[Comorb] > 0 &&
              d.fips.length === 5)),
          d=> d[Comorb]))
        .range(colorPalette);

        let scaleMapii = {}
        _.each(data, d=>{
          if(d[Comorb] > 0){
          scaleMapii[d[Comorb]] = csii(d[Comorb])}
        });
      
        setColorComorb(scaleMapii);
        var maxii = 0
        var minii = 100
        _.each(data, d=> { 
          if (d[Comorb] > maxii && d.fips.length === 5) {
            maxii = d[Comorb]
          } else if (d.fips.length === 5 && d[Comorb] < minii && d[Comorb] > 0){
            minii = d[Comorb]
          }
        });
        if (maxii > 999999) {
          maxii = (maxii/1000000).toFixed(0) + "M";
          setLegendMaxComorb(maxii);
        }else if (maxii > 999) {
          maxii = (maxii/1000).toFixed(0) + "K";
          setLegendMaxComorb(maxii);
        }else{
          setLegendMaxComorb(maxii.toFixed(0));
        }
        setLegendMinComorb(minii.toFixed(0));
        setLegendSplitComorb(csii.quantiles());


      }

    },[data, resSeg]);

    
    

  useEffect(() => {
    if (dataTS){
      setCovidMetric(_.takeRight(dataTS['_nation'])[0]);
    }
  }, [dataTS])

  useEffect(() => {
    if (dataTS){
      setCovidMetric(_.takeRight(dataTS['_nation'])[0]);
      setCaseTicks([
        dataTS["_nation"][0].t,
        dataTS["_nation"][30].t,
        dataTS["_nation"][61].t,
        dataTS["_nation"][91].t,
        dataTS["_nation"][122].t,
        dataTS["_nation"][153].t,
        dataTS["_nation"][183].t,
        dataTS["_nation"][214].t,
        dataTS["_nation"][244].t,
        // heeeredataTS["_nation"]
        dataTS["_nation"][dataTS["_nation"].length-1].t]);
          //console.log("dataTS", dataTS["_nation"][0].t);
      setCaseYTicks();
    }
  }, [dataTS])

  //console.log(caseTicks);

  const caseTickFmt = (tick) => { 
    return (
        monthNames[new Date(tick*1000).getMonth()] + " " +  new Date(tick*1000).getDate()
      );
  };



  if (data && dataTS && varMap) {
    // console.log(demog_descriptives['AgeDescription']);
  return (
    <HEProvider>
      <div>
        <AppBar menu='nationalReport' /> 
        <Container id="title" style={{marginTop: '8em', minWidth: '1260px'}} >
        <div >
          <br/><br/><br/><br/>
        </div>
        <Grid >
          <Grid.Column width={2} style={{zIndex: 10}}>
            
            <Ref innerRef={createRef()} >
              <StickyExampleAdjacentContext activeCharacter={activeCharacter}  />
            </Ref>

            
          </Grid.Column>
          <Grid.Column width={14} style={{paddingLeft:'3rem'}}>
              <center> 
                <Waypoint
                  onEnter={() => {
                      setActiveCharacter('COVID-19 National Health Equity Report')
                      console.log(activeCharacter)
                  }}>
                </Waypoint> 
              </center>
              <div>     	
                <Header as='h2' style={{color: mortalityColor[1],textAlign:'center', fontWeight: 400, fontSize: "24pt", paddingTop: 17, paddingLeft: 272, paddingRight: "2em"}}>
                  <Header.Content>
                  <b> COVID-19 National Health Equity Report </b> 
                  <Header.Subheader style={{fontWeight:300,fontSize:"20pt", paddingTop:16, color: mortalityColor[1]}}> 
                  <b>{monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}</b>
                    
                  </Header.Subheader>
                  </Header.Content>
                </Header>
              </div>
              <div style={{paddingTop:36,textAlign:'justify', fontSize:"14pt", lineHeight: "16pt",paddingBottom:30, paddingLeft: 238, paddingRight: "2em"}}>
                <Header.Content style={{fontFamily:'lato', fontSize: "14pt", width: 810}}>
                The United States has reported {numberWithCommas(data['_nation']['casesfig'])} cases, the highest number of any country in the world. 
                The number of cases and deaths differ substantially across American communities. The COVID-19 U.S. Health Equity 
                Report documents how COVID-19 cases and deaths are changing over time, across geography, and by demographics. The report will 
                be released each week to keep track of how COVID-19 is impacting U.S. communities.
                </Header.Content>
              </div>
              <div id="tracker" style = {{height: 45}}> </div>

              <center style={{paddingLeft: 190}}><Divider style={{width: 900}}/> </center>

              <div>     	
                <Header as='h2' style={{color: mortalityColor[1],textAlign:'center', fontSize: "22pt", paddingTop: 30, paddingLeft: 272, paddingRight: "2em"}}>
                  <Header.Content>
                  COVID-19 Vaccination Tracker
                    {/* <a href = '/Vaccine-Tracker'>COVID-19 Vaccination Tracker</a> */}
                  
                  </Header.Content>
                </Header>
              </div>

              <Grid>
                <Grid.Row columns = {5} style = {{width: 1000, paddingLeft: 205, paddingTop: 40}}>
                  <Grid.Column style = {{width: 200, paddingLeft: 0, paddingTop: 8, paddingBottom: 0}}> 
                    <center style={{width: 200,fontSize: "22px", fontFamily: 'lato', color: "#000000", textAlign: "center", paddingBottom: 0}}>Total doses <br/> delivered</center>

                    
                  </Grid.Column>
                  
                  <Grid.Column style = {{width: 200, paddingLeft: 50, paddingTop: 8}}> 
                    <center style={{width: 200, fontSize: "22px", fontFamily: 'lato', color: "#000000", textAlign: "center"}}>Total doses <br/> administered</center>

                  </Grid.Column>
                  <Grid.Column style = {{width: 200, paddingLeft: 100, paddingTop: 8}}> 
            
                        <center style={{width: 200, fontSize: "22px", fontFamily: 'lato', color: "#000000", textAlign: "center"}}>Number received <br/> at least one dose</center>

                  </Grid.Column>
                  <Grid.Column style = {{width: 200, paddingLeft: 150, paddingTop: 8}}> 
                    
                        <center style={{width: 200, fontSize: "22px", fontFamily: 'lato', color: "#000000", textAlign: "center"}}>Number fully <br/> vaccinated </center>

                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns = {5} style = {{width: 1000, paddingLeft: 205, paddingTop: 0}}>
                  <Grid.Column style = {{width: 200, paddingLeft: 0, paddingTop: 0}}> 
                    <div style = {{width: 200, background: "#e5f2f7", height: 130}}>
                      <Header style = {{textAlign: "center"}}>
                        {/* <p style={{fontSize: "24px", fontFamily: 'lato', color: "#004071", textAlign: "center"}}> Number received <br/> first dose <br/><br/></p> */}
                        <Header.Content style = {{paddingBottom: 5}}>
                        <br/><br/><p style={{width: 200, fontSize: "28px", fontFamily: 'lato', color: "#000000"}}>{numberWithCommas(vaccineData["_nation"]["Doses_Distributed"])}</p><br/>
                        </Header.Content>
                      </Header>
                    </div>
                  </Grid.Column>
                  
                  <Grid.Column style = {{width: 200, paddingLeft: 50, paddingTop: 0}}> 
                    <div style = {{width: 200, background: "#e5f2f7", height: 130}}>
                      <Header style = {{textAlign: "center"}}>
                        {/* <p style={{fontSize: "24px", fontFamily: 'lato', color: "#004071", textAlign: "center"}}> Number received <br/> first dose <br/><br/></p> */}
                        <Header.Content style = {{paddingBottom: 5}}>
                          
                        <br/><br/><p style={{fontSize: "28px", fontFamily: 'lato', color: "#000000"}}>{numberWithCommas(vaccineData["_nation"]["Doses_Administered"])}</p><br/>
                        </Header.Content>
                      </Header>
                    </div>
                  </Grid.Column>
                  <Grid.Column style = {{width: 200, paddingLeft: 100, paddingTop: 0}}> 
                    <div style = {{width: 200, background: "#e5f2f7", height: 130}}>
                      <Header style = {{textAlign: "center"}}>
                        {/* <p style={{fontSize: "24px", fontFamily: 'lato', color: "#004071", textAlign: "center"}}> Number received second dose <br/><br/></p> */}
                        <Header.Content style = {{paddingBottom: 5}}>
                        
                        <br/><br/><p style={{fontSize: "28px", fontFamily: 'lato', color: "#000000"}}>{numberWithCommas(vaccineData["_nation"]["Administered_Dose1"])}</p><br/>
                        </Header.Content>
                      </Header>
                    </div>
                  </Grid.Column>
                  <Grid.Column style = {{width: 200, paddingLeft: 150, paddingTop: 0}}> 
                    <div style = {{width: 200, background: "#e5f2f7", height: 130}}>
                      <Header style = {{textAlign: "center"}}>
                        {/* <p style={{fontSize: "24px", fontFamily: 'lato', color: "#004071", textAlign: "center"}}> Newly distributed per 100K <br/><br/></p> */}
                        <Header.Content style = {{paddingBottom: 5}}>
                        
                        <br/><br/><p style={{fontSize: "28px", fontFamily: 'lato', color: "#000000"}}>{numberWithCommas(vaccineData["_nation"]["Series_Complete_Yes"].toFixed(0))}</p><br/>
                        </Header.Content>
                      </Header>
                      </div>
                    </Grid.Column>
                </Grid.Row>                
                <Grid.Row>
                <Grid.Column style = {{width: 900, paddingLeft: 205, paddingTop: 18}}> 
                    <div style = {{width: 900}}>
                      <Header>
                        <div>
                          <Header style={{fontSize: "22px", fontFamily: 'lato', color: "#004071", width: 900}}>
                            Percent of the U.S. population partially vaccinated<br/>
                            <Header.Content style={{paddingBottom: 5, fontWeight: 300, paddingTop: 0, paddingLeft: 0,fontSize: "19px"}}>
                              One of two doses of Pfizer or Moderna vaccine received
                            </Header.Content>
                          </Header>
                        </div>
                        <Header.Content style = {{paddingBottom: 0, paddingTop: 0}}>
                          <Progress style = {{width: 900}} percent={((vaccineData["_nation"]["PercentAdministeredPartial"]).toFixed(1))} size='large' color='green' progress/>
                        </Header.Content>

                        <div>
                          <Header style={{fontSize: "22px", fontFamily: 'lato', color: "#004071", width: 900}}>
                            Percent of the U.S. population fully vaccinated<br/>
                            <Header.Content style={{paddingBottom: 5, fontWeight: 300, paddingTop: 0, paddingLeft: 0,fontSize: "19px"}}>
                              Both doses of Pfizer or Moderna vaccine or one and only dose of Johnson and Johnson received
                            </Header.Content>
                          </Header>
                        </div>
                        <Header.Content style = {{paddingBottom: 0, paddingTop: 0}}>
                          <Progress style = {{width: 900}} percent={((vaccineData["_nation"]["Series_Complete_Pop_Pct"]).toFixed(1))} size='large' color='green' progress/>
                        </Header.Content>

                        <div>
                          <Header style={{fontSize: "22px", fontFamily: 'lato', color: "#004071", width: 900}}>
                            Percent of the U.S. population that received at least one dose<br/>
                            <Header.Content style={{paddingBottom: 5, fontWeight: 300, paddingTop: 0, paddingLeft: 0,fontSize: "19px"}}>
                              One or more doses of any of the authorized vaccines received
                            </Header.Content>
                          </Header>
                        </div>
                        <Header.Content style = {{paddingBottom: 0, paddingTop: 0}}>
                          <Progress style = {{width: 900}} percent={((vaccineData["_nation"]["PercentAdministeredPartial"] + vaccineData["_nation"]["Series_Complete_Pop_Pct"]).toFixed(1))} size='large' color='green' progress/>
                        </Header.Content>
                      </Header>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Grid>

                <Grid.Row >
                  <Accordion style = {{paddingTop: 0, paddingLeft: 204, paddingBottom: 0}}defaultActiveIndex={1} panels={[
                          {
                              key: 'acquire-dog',
                              title: {
                                  content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                  icon: 'dropdown',
                              },
                              content: {
                                  content: (
                                    <Header.Content style={{fontWeight: 300, paddingTop: 7, paddingLeft: 5,fontSize: "19px", width: 900}}>
                                      Data are from the <a href = 'https://covid.cdc.gov/covid-data-tracker/#vaccinations' target="_blank" rel="noopener noreferrer">CDC COVID Data Tracker</a>, data as of {vaccineDate} <br/>
                                      <b><em> {vaxVarMap["Doses_Distributed"].name} </em></b> {vaxVarMap["Doses_Distributed"].definition} <br/>
                                      <b><em> {vaxVarMap["Doses_Administered"].name} </em></b> {vaxVarMap["Doses_Administered"].definition} <br/>
                                      <b><em> {vaxVarMap["Administered_Dose1"].name} </em></b> {vaxVarMap["Administered_Dose1"].definition} <br/>
                                      <b><em> {vaxVarMap["Series_Complete_Yes"].name} </em></b> {vaxVarMap["Series_Complete_Yes"].definition} <br/>


                                    </Header.Content>
                                  ),
                                },
                            }
                        ]
                        } /> 
                </Grid.Row>
              </Grid>
                
              <div id="vaccrace" style = {{height: 45}}> </div>

              <center style={{paddingLeft: 190}}><Divider style={{width: 900}}/> </center>
              <div style={{paddingTop:'1em', paddingLeft: "13em", paddingRight: "2em"}}>
                <Header as='h2' style={{paddingTop: 17, textAlign:'center',fontSize:"22pt", color: mortalityColor[1]}}>
                  <Header.Content style = {{paddingLeft: 54}}>
                    COVID-19 Vaccination By Race & Ethnicity
                    <Header.Subheader style={{ width: 810, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 2 }}>
                      <center > <b style = {{fontSize:"18pt"}}>Vaccination by Race & Ethnicity</b> </center>
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </div>

              <Grid>

                <Grid.Row columns = {2} style = {{width: 1360, paddingLeft: 120}} >
                  <Grid.Column style = {{width: 1000}}>
                    <Grid rows = {1}>
                      <Grid.Row columns = {1} style = {{width: 1000, paddingLeft: 100}}>
                        <Grid.Column style = {{width: 300, paddingleft: 100}}>
                                    
                          <SideRaceBarChart
                            demogData = {nationalDemog}
                            fips = {"_nation"}
                            VaccineData = {vaccineData}
                            inTab = {false}
                            vacc = {true}
                          />
                        </Grid.Column>
                                  
                      </Grid.Row>
                                
                    </Grid>
                  </Grid.Column>
                  <Grid.Column style = {{width: 400}}>
                    <div style={{paddingTop: 0, paddingLeft: 30}}>
                      <Header.Subheader style={{width: 400, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:0, paddingLeft: 6}}>
                        <center> <b style= {{fontSize: "22px", paddingLeft: 0}}> Under-vaccinated Populations</b> </center> 
                        
                        <p style = {{paddingLeft: 40}}>
                          <ul>
                            
                          {nationalDemog['vaccineRace'][0]['White'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['White'][0]['percentPop'] && <li>
                            {nationalDemog['vaccineRace'][0]['White'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['White'][0]['percentPop'] ? 
                            " White Americans make up " + (nationalDemog['vaccineRace'][0]['White'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['White'][0]['seriesCompletePopPctKnown']).toFixed(0) + "% of the fully vaccinated." 
                          :
                            ""} </li>}

                            {nationalDemog['vaccineRace'][0]['Hispanic'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['Hispanic'][0]['percentPop'] && <li>
                              {nationalDemog['vaccineRace'][0]['Hispanic'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['Hispanic'][0]['percentPop'] ? 
                            " Hispanic Americans make up " + (nationalDemog['vaccineRace'][0]['Hispanic'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['Hispanic'][0]['seriesCompletePopPctKnown']).toFixed(0) + "% of the fully vaccinated." 
                          :
                            ""}</li>}

                          {nationalDemog['vaccineRace'][0]['African American'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['African American'][0]['percentPop'] && <li> 
                            {nationalDemog['vaccineRace'][0]['African American'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['African American'][0]['percentPop'] ? 
                            " African Americans make up " + (nationalDemog['vaccineRace'][0]['African American'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['African American'][0]['seriesCompletePopPctKnown']).toFixed(0) + "% of the fully vaccinated."
                          :
                            ""} </li>}

                          {nationalDemog['vaccineRace'][0]['Asian'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['Asian'][0]['percentPop'] && <li>
                            {nationalDemog['vaccineRace'][0]['Asian'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['Asian'][0]['percentPop'] ? 
                            " Asian Americans make up " + (nationalDemog['vaccineRace'][0]['Asian'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['Asian'][0]['seriesCompletePopPctKnown']).toFixed(0) + "% of the fully vaccinated."
                          :
                            ""}</li>}

                          {nationalDemog['vaccineRace'][0]['American Native'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['American Native'][0]['percentPop'] && <li>
                            {nationalDemog['vaccineRace'][0]['American Native'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['American Native'][0]['percentPop'] ? 
                            " Native Americans make up " + (nationalDemog['vaccineRace'][0]['American Native'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['American Native'][0]['seriesCompletePopPctKnown']).toFixed(0) + "% of the fully vaccinated."
                          :
                            ""} </li>}

                          {nationalDemog['vaccineRace'][0]['NHPI'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['NHPI'][0]['percentPop'] && <li>
                            {nationalDemog['vaccineRace'][0]['NHPI'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['NHPI'][0]['percentPop'] ? 
                            " Native Americans make up " + (nationalDemog['vaccineRace'][0]['NHPI'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['NHPI'][0]['seriesCompletePopPctKnown']).toFixed(0) + "% of the fully vaccinated."
                          :
                            ""} </li>}

                          {nationalDemog['vaccineRace'][0]['Multiracial'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['Multiracial'][0]['percentPop'] && <li>
                            {nationalDemog['vaccineRace'][0]['Multiracial'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['Multiracial'][0]['percentPop'] ? 
                            " Native Americans make up " + (nationalDemog['vaccineRace'][0]['Multiracial'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['Multiracial'][0]['seriesCompletePopPctKnown']).toFixed(0) + "% of the fully vaccinated."
                          :
                            ""} </li>}

                          {/* {nationalDemog['vaccineRace'][0]['American Native'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['American Native'][0]['percentPop'] && <li>
                            {nationalDemog['vaccineRace'][0]['American Native'][0]['seriesCompletePopPctKnown'] < nationalDemog['vaccineRace'][0]['American Native'][0]['percentPop'] ? 
                            " Native Americans make up " + (nationalDemog['vaccineRace'][0]['American Native'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['American Native'][0]['seriesCompletePopPctKnown']).toFixed(0) + "% of the fully vaccinated."
                          :
                            ""} </li>} */}
                          
                          
                          {pctVacPopDisp >= 1 && <li>
                            {(pctVacPopDisp) < 1 ? "": " " + finalStr + " make up a larger proportion of those fully vaccinated than of the population."}
                          </li>}

                          </ul>
                        </p>
                          
                      </Header.Subheader>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
                <Grid.Row>
                  <Accordion  id="cases" style = {{paddingTop: 30, paddingLeft: 190, paddingBottom: 45}}defaultActiveIndex={1} panels={[
                      {
                          key: 'acquire-dog',
                          title: {
                              content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                              icon: 'dropdown',
                          },
                          content: {
                              content: (

                                <div style = {{fontSize: "19px", paddingLeft: 5}}>
                                  

                                  <Grid.Row style= {{paddingTop: 0, paddingBottom: 25}}> 
                                    <Header.Content style={{fontWeight: 300, fontSize: "19px", paddingTop: 7, paddingLeft: 0, width: 900}}>
                                    Race & Ethnicity data as of {nationalDemogDate}.
                                    <br/>
                                    The demographics of vaccinated adults is obtained from the U.S.
                                    <a href = "https://covid.cdc.gov/covid-data-tracker/#vaccination-demographic" target="_blank" rel="noopener noreferrer"> CDC COVID Data Tracker</a>.
                                    The U.S. CDC reports distribution of vaccination across non-Hispanic race categories. Race & ethnicity was known for {(nationalDemog['vaccineRace'][0]['Unknown'][0]['seriesCompletePopPctUs']).toFixed(0) + "%"} of fully vaccinated adults.
                                    <br/>
                                    The CDC notes that “These demographic data only represent the geographic areas that 
                                    contributed data and might differ by populations prioritized within each state or 
                                    jurisdiction’s vaccination phase. Every geographic area has a different racial and 
                                    ethnic composition, and not all are in the same vaccination phase.” For comparison 
                                    purposes, we show the demographics of the U.S. population. Note that the demographics of the total 
                                    population will include some areas that are not represented in the vaccination data. 
                                    The numbers are therefore our best estimation of vaccination coverage by race.

                                    </Header.Content>
                                  </Grid.Row>

                                </div>
                              ),
                            },
                        }
                    ]

                    } /> 
                                
                </Grid.Row>

                <center style={{paddingLeft: 190}}><Divider style={{width: 900}}/> </center>
                <div style={{paddingBottom:'0em', paddingLeft: "12rem", paddingRight: "1rem"}}>
                  {/* <Header as='h2' style={{color: mortalityColor[1], textAlign:'center',fontSize:"22pt", paddingTop: 30}}>
                    <Header.Content>
                      How have cases in the U.S. changed over time?
                    </Header.Content>
                  </Header> */}
                  <Grid>
                      <Grid.Row>
                      {/* <Grid.Row column = {1} style={{textAlign:'center', width: 800, paddingTop: '2rem', paddingLeft: '10rem'}}>
                      <Header.Content x={0} y={20} style={{ fontSize: '18pt', marginLeft: 0, paddingBottom: 0, fontWeight: 600}}>Average Daily COVID-19 Cases </Header.Content>
                      </ Grid.Row> */}
                      {/* <Grid.Row style={{textAlign:'center', paddingLeft: '22rem', paddingRight: '22rem'}}>                
                      <Menu pointing secondary widths={3}> 
                      <Menu.Item name='All' />
                      active={activeItem==='all'} onClick={setActiveItem('all')}
                      <Menu.Item name='90 Days' />
                      <Menu.Item name='14 Days' />
                      </ Menu>
                      </ Grid.Row>
                      <Grid.Row columns={1}> */}
                      <ChartSection data={dataTS["_nation"]} barColor={mortalityColor[0]} lineColor={[mortalityColor[1]]} 
                                  tickFormatter={caseTickFmt} chart='case' dailyCases={dailyCases} monthNames={monthNames} 
                                  mean7dayCases={mean7dayCases} percentChangeCases={percentChangeCases} dailyDeaths={dailyDeaths}
                                  mortalityMean={mortalityMean} percentChangeMortality={percentChangeMortality}/>
                      <Grid.Row>
                            {/* <Accordion style = {{paddingLeft: '3rem'}} defaultActiveIndex={1} panels={[
                          {
                              key: 'acquire-dog',
                              title: {
                                  content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                  icon: 'dropdown',
                              },
                              content: {
                                  content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingTop: 0, paddingBottom: 20}}>
                                    <Header.Content  style={{fontSize: "14pt"}}>
                                      <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt", paddingLeft: '2rem', paddingRight:'4rem'}}>
                                        This figure shows the trend of daily COVID-19 cases in U.S.. The bar height reflects the number of 
                                        new cases per day and the line depicts 7-day moving average of daily cases in U.S.. There were {numberWithCommas(dailyCases)} new COVID-19 cases reported on {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}, with 
                                        an average of {numberWithCommas(mean7dayCases)} new cases per day reported over the past 7 days. 
                                        We see a {percentChangeCases.includes("-")? "decrease of approximately " + percentChangeCases.substring(1): "increase of approximately " + percentChangeCases} in 
                                        the average new cases over the past 14-day period. 
                                        <br/>
                                        <br/>
                                        *14-day period includes {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getFullYear()} to {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}.

                                      </Header.Subheader>
                                    </Header.Content>
                                  </Header>
                                ),
                              },
                          }
                      ]
                    } />
                    <Accordion style = {{paddingLeft: '3rem'}} defaultActiveIndex={1} panels={[
                          {
                              key: 'acquire-dog',
                              title: {
                                  content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                  icon: 'dropdown',
                              },
                              content: {
                                  content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingTop: 0, paddingBottom: 20}}>
                                    <Header.Content  style={{fontSize: "14pt"}}>
                                      <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt", paddingLeft: '2rem', paddingRight:'4rem'}}>
                                            This figure shows the trend of daily COVID-19 deaths in U.S.. The bar height reflects the number of new deaths 
                                            per day and the line depicts 7-day moving average of daily deaths in U.S.. There were {dailyDeaths} new deaths 
                                            associated with COVID-19 reported on {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}, with 
                                            an average of {mortalityMean} new deaths per day reported over the past 7 days. 
                                            We see {percentChangeMortality.includes("-")? "a decrease of approximately " + percentChangeMortality.substring(1): "an increase of approximately " + percentChangeMortality} in the average new deaths over the past 14-day period. 
                                            <br/>
                                            <br/>
                                            *14-day period includes {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getFullYear()} to {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}.
                                          
                                          </Header.Subheader>
                                        </Header.Content>
                                      </Header>
                                  ),
                                },
                            }
                        ]

                        } /> */}
                    </Grid.Row>
                            {/* </div> */}
                          {/* </ Grid.Column> */}
                      </Grid.Row>
                  </Grid>
                </div>

                <div id="half" style = {{height: 45}}> </div>

                <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center>
                <div style={{paddingTop:'1em', paddingLeft: "13em", paddingRight: "2em"}}>
                  <Header as='h2' style={{paddingTop: 17, textAlign:'center',fontSize:"22pt", color: mortalityColor[1]}}>
                    <Header.Content style = {{paddingLeft: 54}}>
                      Where are most cases occurring?
                      <Header.Subheader style={{ width: 810, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 2 }}>

                        Cases attributed to COVID-19 are rapidly rising in some counties, and 
                        the geographic distribution of the hardest-hit counties is changing.
                        Approximately 50% of new cases on {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()} in 
                        the United States were attributed to {(states50[0]["statenames"].split(",")).length} states: <br/>

                        <br/>
                      <center > <b style = {{fontSize:"18pt"}}>{states50[0]["statenames"]}</b> </center>
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </div>
                <div id="who" style = {{height: 45}}> </div>

                <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center>

                <div style={{paddingTop:'1em', paddingLeft: "13em", paddingRight: "2em"}}>
                  <Header as='h2' style={{paddingTop: 17, textAlign:'center',fontSize:"22pt", color: mortalityColor[1]}}>
                    <Header.Content style = {{paddingLeft: 50}}>
                    &nbsp;Who is impacted by COVID-19?
                      
                    </Header.Content>
                  </Header>
                </div>
                <Grid.Row columns = {1} style = {{width: 1000, paddingTop: 15}}>
                  <Grid.Column style = {{width: 810, paddingLeft: 180}}>
                    <div style={{paddingTop:'0em'}}>
                      <Header.Subheader style={{width: 850, color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: 60, paddingRight: 10, paddingBottom: 20}}>
                        <center> <b style= {{paddingLeft: 20, fontSize: "18pt"}}> COVID-19 Cases and U.S. Population <br/> distribution by race & ethnicity</b> </center> 
                        {/* <br/><br/>
                        While people of all races are impacted by COVID-19, some subgroups are disproportionally affected. 
                        The {Object.keys(demog_descriptives['Race'][0]["cases"])[0]} population has the highest proportion, with {numberWithCommas((demog_descriptives['Race'][0]["cases"][Object.keys(demog_descriptives['Race'][0]["cases"])[0]]).toFixed(0))}% of all cases.  
                        around {(demog_descriptives['Race'][0]["cases"][Object.keys(demog_descriptives['Race'][0]["cases"])[0]] / demog_descriptives['Race'][0]["cases"][Object.keys(demog_descriptives['Race'][0]["cases"])[1]]).toFixed(1)} times that of the {Object.keys(demog_descriptives['Race'][0]["cases"])[1]} population, the group that make up the fewest of total cases. 
                    */}
                      </Header.Subheader>
                      
                    </div>
                  </Grid.Column>
                    
                </Grid.Row>

                <Grid>
                    
                  <Grid.Row columns = {2} style = {{width: 1360, paddingLeft: 120}} >
                    <Grid.Column rows = {1} >
                      
                      <Grid>
                        <Grid.Row columns = {1} style = {{width: 1000, paddingLeft: 100}}>
                          <Grid.Column style = {{width: 300, paddingleft: 100}}>
                            {/* <RaceBarChart
                              demogData = {nationalDemog}
                              fips = {"_nation"}
                              VaccineData = {vaccineData}
                            /> */}
                            <SideRaceBarChart
                              demogData = {nationalDemog}
                              fips = {"_nation"}
                              VaccineData = {vaccineData}
                              inTab = {false}
                              vacc = {false}
                            />
                          </Grid.Column>
                          
                      </Grid.Row>
                        {/* <Grid.Row columns = {2} style = {{width: 900}}>
                          <Grid.Column style = {{width: 300}}>
                            <Race pop = {false}/>
                          </Grid.Column>
                          <Grid.Column style = {{width: 300, paddingLeft: 20}}>
                            <Race pop = {true}/> 
                          </Grid.Column>
                        </Grid.Row> */}
                        {/* <Grid.Row style = {{width: 900}}>
                          <Grid.Column style = {{width: 450, paddingLeft: 0}}>
                              <div>
                                <svg width="450" height="145">

                                    <text x={280} y={15} style={{fontSize: '16px'}}> Hispanic</text>                    
                                    <text x={280} y={35} style={{fontSize: '16px'}}> American Native</text>                    
                                    <text x={280} y={55} style={{fontSize: '16px'}}> Asian</text>                    
                                    <text x={280} y={75} style={{fontSize: '16px'}}> African American</text>                    
                                    <text x={280} y={95} style={{fontSize: '16px'}}> White</text>                    


                                    {_.map(pieChartRace, (color, i) => {
                                      return <rect key={i} x={250} y={20*i} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                                    })} 
                                </svg>
                              </div>
                            </Grid.Column>
                        </Grid.Row> */}
                      </Grid>
                    </Grid.Column>
                    <Grid.Column style = {{width: 450}}>
                      <div style={{paddingTop: 10, paddingLeft: 80}}>
                        <Header.Subheader style={{width: 400, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 6}}>
                          {/* <center> <b style= {{fontSize: "18pt", paddingLeft: 0}}> Risks for COVID-19 Infection by Race/Ethnicity</b> </center>  */}
                          <br/>
                          <p style = {{paddingLeft: 20}}>
                            Comparing with White Americans<br/>
                            <ul>
                              <li> African Americans: {(nationalDemog['race'][0]['African American'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1? "": 
                                  (nationalDemog['race'][0]['African American'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) + " "}
                                  {(nationalDemog['race'][0]['African American'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1)  == 1 ? "equal" :
                                  (nationalDemog['race'][0]['African American'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1)  < 1? "times lower" : "times higher"} risk
                                  {/* <br/><br/> */}
                              </li>
                              <li> Hispanic Americans: {(nationalDemog['race'][0]['Hispanic'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1? "": 
                                  (nationalDemog['race'][0]['Hispanic'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) + " "}
                                  {(nationalDemog['race'][0]['Hispanic'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1)  == 1 ? "equal" :
                                  (nationalDemog['race'][0]['Hispanic'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1)  < 1? "times lower" : "times higher"} risk
                                  {/* <br/><br/> */}
                              </li>
                              <li> Asian Americans: {(nationalDemog['race'][0]['Asian'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1? "": 
                                  (nationalDemog['race'][0]['Asian'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) + " "}
                                  {(nationalDemog['race'][0]['Asian'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1)  == 1 ? "equal" :
                                  (nationalDemog['race'][0]['Asian'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) < 1? "times lower" : "times higher"} risk
                                  {/* <br/><br/> */}
                              </li>
                              <li> Native Americans: {(nationalDemog['race'][0]['American Native'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1? "": 
                                  (nationalDemog['race'][0]['American Native'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) + " "}
                                  {(nationalDemog['race'][0]['American Native'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1 ? "equal" :
                                  (nationalDemog['race'][0]['American Native'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) < 1? "times lower" : "times higher"} risk
                                  {/* <br/><br/> */}
                              </li>
                              <li> Native Hawaiian and Pacific Islanders: {(nationalDemog['race'][0]['NHPI'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1? "": 
                                  (nationalDemog['race'][0]['NHPI'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) + " "}
                                  {(nationalDemog['race'][0]['NHPI'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1 ? "equal" :
                                  (nationalDemog['race'][0]['NHPI'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) < 1? "times lower" : "times higher"} risk
                                  {/* <br/><br/> */}
                              </li>
                              <li> Multi-Racial: {(nationalDemog['race'][0]['Multiple/Other'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1? "": 
                                  (nationalDemog['race'][0]['Multiple/Other'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) + " "}
                                  {(nationalDemog['race'][0]['Multiple/Other'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1 ? "equal" :
                                  (nationalDemog['race'][0]['Multiple/Other'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) < 1? "times lower" : "times higher"} risk
                                  
                              </li>
                            </ul>
                          {/* While people of all races, ages, and sex are impacted by COVID-19, some subgroups are disproportionally 
                          affected. {Object.keys(demog_descriptives['Race'][0])[0]} are seeing the largest mortality rate, with {numberWithCommas((demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]]).toFixed(0))} cases per 100K individuals, 
                          around {(demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]] / demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[1]]).toFixed(0)} times that of {Object.keys(demog_descriptives['Race'][0])[1]}, the groups with the lowest mortality rate.  */}
                          </p>
                            
                        </Header.Subheader>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Grid.Row>
                        <Accordion id="dre" style = {{paddingTop: 15, paddingLeft: 190, paddingBottom: 45}}defaultActiveIndex={1} panels={[
                              {
                                  key: 'acquire-dog',
                                  title: {
                                      content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                      icon: 'dropdown',
                                  },
                                  content: {
                                      content: (

                                        <div style = {{fontSize: "19px", paddingLeft: 5}}>
                                          

                                          <Grid.Row style= {{paddingTop: 0, paddingBottom: 25}}> 
                                            <Header.Content style={{fontWeight: 300, fontSize: "19px", paddingTop: 7, paddingLeft: 0, width: 900}}>
                                              The United States reports cases by combined race and ethnicity groups. The chart shows race and ethnicity groups that constitute at least 1% of the state population and have 30 or more cases. Race and ethnicity data are known for {nationalDemog['race'][0]['Unknown'][0]['availableCases'] + "%"} of cases in the nation.
                                              <br/>
                                              <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.cdc.gov/diabetes/data/index.html" target = "_blank" rel="noopener noreferrer"> The CDC COVID Data Tracker </a>
                                              <br/><b>Cases by Race & Ethnicity data as of:</b> {nationalDemogDate}.<br/>

                                            </Header.Content>
                                          </Grid.Row>

                                        </div>
                                      ),
                                    },
                                }
                            ]

                            } /> 
                </Grid.Row>

                <center style={{paddingLeft: 190}}><Divider style={{width: 900}}/> </center>

                <Grid.Row columns = {1} style = {{width: 1000, paddingTop: 15}}>
                    <Grid.Column style = {{width: 810, paddingLeft: 330}}>
                      <div style={{paddingTop:0}}>
                        <Header.Subheader style={{width: 560, color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: 61, paddingRight: "1em", paddingBottom: 0}}>
                          <center> <b style= {{width: 560, fontSize: "18pt"}}> COVID-19 Death Rate by Race & Ethnicity</b> </center> 
                        </Header.Subheader>
                      </div>
                    </Grid.Column>
                    
                </Grid.Row>
                <div style={{paddingTop:0, paddingLeft: "13em", paddingRight: "2em"}}>
                  <Header as='h2' style={{paddingTop: 0, textAlign:'center',fontSize:"22pt", color: mortalityColor[1]}}>
                    <Header.Content style = {{paddingLeft: 50}}>
                      <Header.Subheader style={{width: 810, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:0, paddingBottom:28, paddingLeft: 6}}>
                      {/* <br/><br/>
                      While people of all races are impacted by COVID-19, some subgroups are disproportionally 
                      affected. The {Object.keys(demog_descriptives['Race'][1]["deaths"])[0]} population is seeing the largest mortality rate, with {numberWithCommas((demog_descriptives['Race'][1]["deaths"][Object.keys(demog_descriptives['Race'][1]["deaths"])[0]]).toFixed(0))} cases per 100K individuals, 
                      around {(demog_descriptives['Race'][1]["deaths"][Object.keys(demog_descriptives['Race'][1]["deaths"])[0]] / demog_descriptives['Race'][1]["deaths"][Object.keys(demog_descriptives['Race'][1]["deaths"])[1]]).toFixed(0)} times that of the {Object.keys(demog_descriptives['Race'][1]["deaths"])[1]} population, the group with the lowest mortality rate. 
                          */}
                        
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </div>
                <Grid>
                        
                    <Grid.Row columns = {2} style = {{width: 1000}}>
                      <Grid.Column style = {{width: 450, paddingLeft: 120}}>
                        <div style={{paddingLeft: "6em", paddingRight: "0em"}}>

                          <VictoryChart
                              theme={VictoryTheme.material}
                              width={450}
                              height={320}
                              domainPadding={25}
                              minDomain={{y: props.ylog?1:0}}
                              padding={{left: 180, right: 40, top: 15, bottom: 1}}
                              style = {{fontSize: "14pt"}}
                              containerComponent={<VictoryContainer responsive={false}/>}
                            >
                              <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                              <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                              <VictoryGroup offset={13}>
                              <VictoryBar
                                horizontal
                                barWidth={20}
                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0))}
                                data={[
                                        {key: nationalDemog['race'][0]['Multiple/Other'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Multiple/Other'][0]['deathrate']},
                                        {key: nationalDemog['race'][0]['NHPI'][0]['demogLabel'], 'value': nationalDemog['race'][0]['NHPI'][0]['deathrate']},
                                        {key: nationalDemog['race'][0]['American Native'][0]['demogLabel'], 'value': nationalDemog['race'][0]['American Native'][0]['deathrate']},
                                        {key: nationalDemog['race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Asian'][0]['deathrate']},
                                        {key: nationalDemog['race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Hispanic'][0]['deathrate']},
                                        {key: nationalDemog['race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['race'][0]['African American'][0]['deathrate']},
                                        {key: nationalDemog['race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['race'][0]['White'][0]['deathrate']},
                                    


                                ]}
                                labelComponent={<VictoryLabel dx={0} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                style={{
                                  data: {
                                    fill: mortalityColor[1]
                                  }
                                }}
                                x="key"
                                y="value"
                              />

                            

                              </VictoryGroup>
                            </VictoryChart>
                          <Header.Content style = {{paddingLeft: 160, width: 450}}>
                              <Header.Content style={{ fontWeight: 300, paddingTop: 20, paddingBottom:5, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>Deaths per 100K residents</b>
                              </Header.Content>
                          </Header.Content>
                        </div>

                        <Grid>
                          <Grid.Row>
                            <Accordion id="cda" style = {{paddingTop: 50, paddingLeft: 98, paddingBottom: 45}} defaultActiveIndex={1} panels={[
                                  {
                                      key: 'acquire-dog',
                                      title: {
                                          content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                          icon: 'dropdown',
                                      },
                                      content: {
                                          content: (
                                              <Header as='h2' style={{paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                                <Header.Content  style={{fontSize: "19px"}}>
                                                  <Header.Subheader style={{color: '#000000', width: 900, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                    The United States reports deaths by combined race and ethnicity groups. The chart shows race and ethnicity groups that constitute at least 1% of the state population and have 30 or more deaths. Race and ethnicity data are known for {nationalDemog['race'][0]['Unknown'][0]['availableDeaths'] + "%"} of deaths in the nation.
                                                    <br/>
                                                    <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covid.cdc.gov/covid-data-tracker/#demographics" target = "_blank" rel="noopener noreferrer"> The CDC COVID Data Tracker </a>
                                                    <br/><b>Deaths by Race & Ethnicity data as of:</b> {nationalDemogDate}.<br/>
                                                  </Header.Subheader>
                                                </Header.Content>
                                              </Header>
                                          ),
                                        },
                                    }
                                ]

                                } />
                          </Grid.Row>
                        </Grid>
                      </Grid.Column>
                      <Grid.Column style = {{width: 450}}>
                        {/* <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 40}}/> </center> */}
                        
                          <div style={{paddingLeft: 140, paddingRight: "0em"}}>
                            {/* <Header.Subheader style={{width: 400, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 6}}>
                              <center> <b style= {{fontSize: "18pt", paddingLeft: -3}}> </b> </center> 
                              <br/><br/>
                              While people of all races, ages, and sex are impacted by COVID-19, some subgroups are disproportionally 
                              affected. {Object.keys(demog_descriptives['Race'][0])[0]} are seeing the largest mortality rate, with {numberWithCommas((demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]]).toFixed(0))} cases per 100K individuals, 
                              around {(demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]] / demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[1]]).toFixed(0)} times that of {Object.keys(demog_descriptives['Race'][0])[1]}, the groups with the lowest mortality rate. 
                              
                                
                            </Header.Subheader> */}
                            <Header.Subheader style={{width: 400, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 6}}>
                              {/* <center> <b style= {{fontSize: "18pt", paddingLeft: 0}}> Risks for COVID-19 Deaths by Race/Ethnicity</b> </center>  */}
                              
                              <p style = {{paddingLeft: 20}}>
                               Compared with death rates in White Americans, death rates* are: <br/>
                                <ul>
                                  <li>{(nationalDemog['race'][0]['African American'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1? "": 
                                    (nationalDemog['race'][0]['African American'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                                    {(nationalDemog['race'][0]['African American'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1 ? "equal" :
                                    (nationalDemog['race'][0]['African American'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1)  < 1? "times lower" : "times higher"} in African Americans
                                    <br/>
                                  </li>
                                  <li>{(nationalDemog['race'][0]['Hispanic'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1? "": 
                                    (nationalDemog['race'][0]['Hispanic'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                                    {(nationalDemog['race'][0]['Hispanic'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1 ? "equal" :
                                    (nationalDemog['race'][0]['Hispanic'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1)  < 1? "times lower" : "times higher"} in Hispanic Americans
                                    <br/>
                                  </li>
                                  <li>{(nationalDemog['race'][0]['Asian'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1? "": 
                                    (nationalDemog['race'][0]['Asian'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                                    {(nationalDemog['race'][0]['Asian'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1 ? "equal" :
                                    (nationalDemog['race'][0]['Asian'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1)  < 1? "times lower" : "times higher"} in Asian Americans
                                    <br/>
                                  </li>
                                  <li>{(nationalDemog['race'][0]['American Native'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1? "": 
                                    (nationalDemog['race'][0]['American Native'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                                    {(nationalDemog['race'][0]['American Native'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1 ? "equal" :
                                    (nationalDemog['race'][0]['American Native'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1)  < 1? "times lower" : "times higher"} in Native Americans
                                  </li>
                                  <li>{(nationalDemog['race'][0]['NHPI'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1? "": 
                                    (nationalDemog['race'][0]['NHPI'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                                    {(nationalDemog['race'][0]['NHPI'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1 ? "equal" :
                                    (nationalDemog['race'][0]['NHPI'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1)  < 1? "times lower" : "times higher"} in Native Hawaiian and Pacific Islanders
                                  </li>
                                  <li>{(nationalDemog['race'][0]['Multiple/Other'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1? "": 
                                    (nationalDemog['race'][0]['Multiple/Other'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                                    {(nationalDemog['race'][0]['Multiple/Other'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1 ? "equal" :
                                    (nationalDemog['race'][0]['Multiple/Other'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1)  < 1? "times lower" : "times higher"} in the Multiple/Other race group
                                  </li>
                                </ul>

                              <text style = {{fontSize: "13px"}}>
                              *The Hispanic population consists of mostly younger age groups. 
                              <br/>
                              *These are crude death rates based on cumulative deaths since January 2020. Age differences, such as the lower average age of Hispanic Americans, are not considered due to data limitations.
                              </text>
                              {/* While people of all races, ages, and sex are impacted by COVID-19, some subgroups are disproportionally 
                              affected. {Object.keys(demog_descriptives['Race'][0])[0]} are seeing the largest mortality rate, with {numberWithCommas((demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]]).toFixed(0))} cases per 100K individuals, 
                              around {(demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]] / demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[1]]).toFixed(0)} times that of {Object.keys(demog_descriptives['Race'][0])[1]}, the groups with the lowest mortality rate.  */}
                              </p>
                                
                            </Header.Subheader>
                          
                          </div>
                      </Grid.Column>
                    </Grid.Row>
                      

                  </Grid>
                    
                <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 0}}/> </center>

                <Grid.Row columns = {1} style = {{width: 1000, paddingTop: 15}}>
                  <Grid.Column style = {{width: 810, paddingLeft: 430}}>
                    <div style={{paddingTop:'0em'}}>
                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: 61, paddingRight: "1em", paddingBottom: 0}}>
                        <center> <b style= {{fontSize: "18pt"}}>Cases and Deaths by Age Group</b> </center> 
                        <br/>
                      </Header.Subheader>
                    </div>
                  </Grid.Column>
                    
                </Grid.Row>
                <div style={{paddingTop:5, paddingLeft: "13em", paddingRight: "2em"}}>
                  <Header as='h2' style={{paddingTop: 7, textAlign:'center',fontSize:"22pt", color: mortalityColor[1]}}>
                    <Header.Content style = {{paddingLeft: 50}}>
                      <Header.Subheader style={{width: 810, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 6}}>
                        
                        Cases are currently highest in the {Object.keys(demog_descriptives['Age'][0]["cases"])[0]} age group ({numberWithCommas((demog_descriptives['Age'][0]["cases"][Object.keys(demog_descriptives['Age'][0]["cases"])[0]]).toFixed(0))}% of all cases), 
                        followed by the {Object.keys(demog_descriptives['Age'][0]["cases"])[1]} age group ({numberWithCommas((demog_descriptives['Age'][0]["cases"][Object.keys(demog_descriptives['Age'][0]["cases"])[1]]).toFixed(0))}% of all cases). 
                        {demog_descriptives['AgeDescription'][0]["CasesDescription"] != "" ? 
                        " They are disproportionately high in the " + demog_descriptives['AgeDescription'][0]["CasesDescription"] + ", compared to those age groups' shares of the U.S. population.":""}
                          
                        
                        <br/>
                        <br/>
                        Deaths increase in prevalence with age and are highest in the {Object.keys(demog_descriptives['Age'][1]["deaths"])[0]} age group ({numberWithCommas((demog_descriptives['Age'][1]["deaths"][Object.keys(demog_descriptives['Age'][1]["deaths"])[0]]).toFixed(0))}% of all deaths), 
                        {demog_descriptives['AgeDescription'][0]["DeathsDescription"] != "" ? 
                        " Deaths are disproportionately high in the " + demog_descriptives['AgeDescription'][1]["DeathsDescription"] + ", compared to those age groups' shares of the U.S. population.":""} 


                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </div>

                <Grid style = {{paddingTop: 0, paddingBottom: 0}}>
                  <Grid.Row style = {{width: 1000, paddingLeft: 305}}>
                    <svg width = "1000" height = "40">
                      <rect x = {40} y = {12} width = "20" height = "20" style = {{fill: casesColor[1], strokeWidth:1, stroke: casesColor[1]}}/>
                      <text x = {65} y = {30} style = {{ fontSize: "19px"}}> Percent of Cases</text>
                      <rect x = {250} y = {12} width = "20" height = "20" style = {{fill: mortalityColor[1], strokeWidth:1, stroke: mortalityColor[1]}}/>
                      <text x = {275} y = {30} style = {{ fontSize: "19px"}}> Percent of Deaths </text>
                      <rect x = {455} y = {12} width = "20" height = "20" style = {{fill: "#D3D3D3", strokeWidth:1, stroke: "#D3D3D3"}}/>
                      <text x = {480} y = {30} style = {{ fontSize: "19px"}}> Percent of Population</text>
                    </svg>
                  </Grid.Row>
                  <Grid.Row columns = {2} style = {{width: 1000}}>
                    <Grid.Column style = {{width: 450, paddingLeft: 300}}>
                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "2em", paddingRight: "1em", paddingBottom: -10}}>
                        <center> <b style= {{fontSize: "18pt"}}>Cases by Age Group</b> </center> 
                        <br/>
                      </Header.Subheader>
                    </Grid.Column>
                    <Grid.Column style = {{width: 450, paddingLeft: 100}}>
                          <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "2em", paddingRight: "1em", paddingBottom: -10}}>
                            <center> <b style= {{fontSize: "18pt"}}>Deaths by Age Group</b> </center> 
                            <br/>
                          </Header.Subheader>
                    </Grid.Column>
                  </Grid.Row>
                  {/* <div style={{paddingLeft: "6em", paddingRight: "0em"}}></div> */}
                  
                  <Grid.Row columns = {2} style = {{width: 1000}}>
                    <Grid.Column style = {{width: 450, paddingLeft: 100}}>
                      <div style={{paddingLeft: "6em", paddingRight: "0em"}}>

                        <VictoryChart
                            theme={VictoryTheme.material}
                            width={450}
                            height={550}
                            domainPadding={25}
                            minDomain={{y: props.ylog?1:0}}
                            padding={{left: 180, right: 40, top: 15, bottom: 1}}
                            style = {{fontSize: "14pt"}}
                            containerComponent={<VictoryContainer responsive={false}/>}
                          >
                            <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                            <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                            <VictoryGroup offset={23}>
                            <VictoryBar
                              horizontal
                              barWidth={20}
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                              data={[
                                {key: nationalDemog['age'][0]['0 - 4'][0]['demogLabel'], 'value': nationalDemog['age'][0]['0 - 4'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['5 - 11'][0]['demogLabel'], 'value': nationalDemog['age'][0]['5 - 11'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['12 - 15'][0]['demogLabel'], 'value': nationalDemog['age'][0]['12 - 15'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['16 - 17'][0]['demogLabel'], 'value': nationalDemog['age'][0]['16 - 17'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['18 - 29'][0]['demogLabel'], 'value': nationalDemog['age'][0]['18 - 29'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['30 - 39'][0]['demogLabel'], 'value': nationalDemog['age'][0]['30 - 39'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['40 - 49'][0]['demogLabel'], 'value': nationalDemog['age'][0]['40 - 49'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['50 - 64'][0]['demogLabel'], 'value': nationalDemog['age'][0]['50 - 64'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['65 - 74'][0]['demogLabel'], 'value': nationalDemog['age'][0]['65 - 74'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['75 - 84'][0]['demogLabel'], 'value': nationalDemog['age'][0]['75 - 84'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['85+'][0]['demogLabel'], 'value': nationalDemog['age'][0]['85+'][0]['percentCases']},
                                    


                              ]}
                              labelComponent={<VictoryLabel dx={0} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                              style={{
                                data: {
                                  fill: casesColor[1]
                                }
                              }}
                              x="key"
                              y="value"
                            />

                            <VictoryBar
                              horizontal
                              barWidth={20}
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                              data={[
                                {key: nationalDemog['age'][0]['0 - 4'][0]['demogLabel'], 'value': nationalDemog['age'][0]['0 - 4'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['5 - 11'][0]['demogLabel'], 'value': nationalDemog['age'][0]['5 - 11'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['12 - 15'][0]['demogLabel'], 'value': nationalDemog['age'][0]['12 - 15'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['16 - 17'][0]['demogLabel'], 'value': nationalDemog['age'][0]['16 - 17'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['18 - 29'][0]['demogLabel'], 'value': nationalDemog['age'][0]['18 - 29'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['30 - 39'][0]['demogLabel'], 'value': nationalDemog['age'][0]['30 - 39'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['40 - 49'][0]['demogLabel'], 'value': nationalDemog['age'][0]['40 - 49'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['50 - 64'][0]['demogLabel'], 'value': nationalDemog['age'][0]['50 - 64'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['65 - 74'][0]['demogLabel'], 'value': nationalDemog['age'][0]['65 - 74'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['75 - 84'][0]['demogLabel'], 'value': nationalDemog['age'][0]['75 - 84'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['85+'][0]['demogLabel'], 'value': nationalDemog['age'][0]['85+'][0]['percentPop']},
                                    


                              ]}
                              labelComponent={<VictoryLabel dx={0} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                              style={{
                                data: {
                                  fill: "#D3D3D3"
                                }
                              }}
                              x="key" 
                              y="value"
                            />

                            </VictoryGroup>
                          </VictoryChart>
                          <Header.Content style = {{paddingLeft: 50, width: 450}}>
                              <Header.Content style={{ fontWeight: 300, paddingTop: 20, paddingBottom:28, fontSize: "14pt", lineHeight: "18pt"}}>
                                <b>Percentage of COVID-19 Cases and Population</b>
                              </Header.Content>
                          </Header.Content>
                        
                      </div>
                      <Grid.Row>
                        <Accordion id="cds" style = {{paddingTop: 50, paddingLeft: 103, paddingBottom: 45}} defaultActiveIndex={1} panels={[
                              {
                                  key: 'acquire-dog',
                                  title: {
                                      content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                      icon: 'dropdown',
                                  },
                                  content: {
                                      content: (
                                          <Header as='h2' style={{paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                            <Header.Content  style={{fontSize: "19px"}}>
                                              <Header.Subheader style={{color: '#000000', width: 900, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covid.cdc.gov/covid-data-tracker/#demographics" target = "_blank" rel="noopener noreferrer"> The CDC COVID Data Tracker </a>
                                                <br/><b>Data as of:</b> {nationalDemogDate}.<br/>
                                              </Header.Subheader>
                                            </Header.Content>
                                          </Header>
                                      ),
                                    },
                                }
                            ]

                            } />
                      </Grid.Row>
                    </Grid.Column>
                    <Grid.Column style = {{width: 450}}>
                      {/* <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 40}}/> </center> */}
                      
                      <div style={{paddingLeft: 64, paddingRight: "0em"}}>
                        
                        <VictoryChart
                            theme={VictoryTheme.material}
                            width={450}
                            height={550}
                            domainPadding={25}
                            minDomain={{y: props.ylog?1:0}}
                            padding={{left: 180, right: 40, top: 15, bottom: 1}}
                            style = {{fontSize: "14pt"}}
                            containerComponent={<VictoryContainer responsive={false}/>}
                          >
                            <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                            <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                            <VictoryGroup offset={23}>
                            <VictoryBar
                              horizontal
                              barWidth={20}
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                              data={[
                                {key: nationalDemog['age'][0]['0 - 4'][0]['demogLabel'], 'value': nationalDemog['age'][0]['0 - 4'][0]['percentDeaths']},
                                {key: nationalDemog['age'][0]['5 - 11'][0]['demogLabel'], 'value': nationalDemog['age'][0]['5 - 11'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['12 - 15'][0]['demogLabel'], 'value': nationalDemog['age'][0]['12 - 15'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['16 - 17'][0]['demogLabel'], 'value': nationalDemog['age'][0]['16 - 17'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['18 - 29'][0]['demogLabel'], 'value': nationalDemog['age'][0]['18 - 29'][0]['percentDeaths']},
                                {key: nationalDemog['age'][0]['30 - 39'][0]['demogLabel'], 'value': nationalDemog['age'][0]['30 - 39'][0]['percentDeaths']},
                                {key: nationalDemog['age'][0]['40 - 49'][0]['demogLabel'], 'value': nationalDemog['age'][0]['40 - 49'][0]['percentDeaths']},
                                {key: nationalDemog['age'][0]['50 - 64'][0]['demogLabel'], 'value': nationalDemog['age'][0]['50 - 64'][0]['percentDeaths']},
                                {key: nationalDemog['age'][0]['65 - 74'][0]['demogLabel'], 'value': nationalDemog['age'][0]['65 - 74'][0]['percentDeaths']},
                                {key: nationalDemog['age'][0]['75 - 84'][0]['demogLabel'], 'value': nationalDemog['age'][0]['75 - 84'][0]['percentDeaths']},
                                {key: nationalDemog['age'][0]['85+'][0]['demogLabel'], 'value': nationalDemog['age'][0]['85+'][0]['percentDeaths']},
                                    


                              ]}
                              labelComponent={<VictoryLabel dx={0} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                              style={{
                                data: {
                                  fill: mortalityColor[1]
                                }
                              }}
                              x="key"
                              y="value"
                            />

                            <VictoryBar
                              horizontal
                              barWidth={20}
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                              data={[
                                {key: nationalDemog['age'][0]['0 - 4'][0]['demogLabel'], 'value': nationalDemog['age'][0]['0 - 4'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['5 - 11'][0]['demogLabel'], 'value': nationalDemog['age'][0]['5 - 11'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['12 - 15'][0]['demogLabel'], 'value': nationalDemog['age'][0]['12 - 15'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['16 - 17'][0]['demogLabel'], 'value': nationalDemog['age'][0]['16 - 17'][0]['percentCases']},
                                {key: nationalDemog['age'][0]['18 - 29'][0]['demogLabel'], 'value': nationalDemog['age'][0]['18 - 29'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['30 - 39'][0]['demogLabel'], 'value': nationalDemog['age'][0]['30 - 39'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['40 - 49'][0]['demogLabel'], 'value': nationalDemog['age'][0]['40 - 49'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['50 - 64'][0]['demogLabel'], 'value': nationalDemog['age'][0]['50 - 64'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['65 - 74'][0]['demogLabel'], 'value': nationalDemog['age'][0]['65 - 74'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['75 - 84'][0]['demogLabel'], 'value': nationalDemog['age'][0]['75 - 84'][0]['percentPop']},
                                {key: nationalDemog['age'][0]['85+'][0]['demogLabel'], 'value': nationalDemog['age'][0]['85+'][0]['percentPop']},
                                    


                              ]}
                              labelComponent={<VictoryLabel dx={0} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                              style={{
                                data: {
                                  fill: "#D3D3D3"
                                }
                              }}
                              x="key" 
                              y="value"
                            />

                            </VictoryGroup>
                          </VictoryChart>
                        <Header.Content style = {{paddingLeft: 50, width: 450}}>
                            <Header.Content style={{ fontWeight: 300, paddingTop: 20, paddingBottom:28, fontSize: "14pt", lineHeight: "18pt"}}>
                            <b>Percentage of COVID-19 Deaths and Population</b>
                            </Header.Content>
                        </Header.Content>
                      </div>
                    </Grid.Column>
                  </Grid.Row>

                  <center style = {{paddingLeft: 200}}> <Divider style= {{width : 900, paddingTop: 0}}/> </center>

                  <Grid.Row columns = {1} style = {{width: 1000}}>
                    <Grid.Column style = {{width: 450, paddingLeft: 180}}>
                      <div style={{paddingTop:'0em'}}>
                        <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: 53, paddingRight: "1em", paddingBottom: 0}}>
                          <center> <b style= {{fontSize: "18pt"}}>Cases and Deaths by sex</b> </center> 
                          <br/>
                        </Header.Subheader>
                      </div>
                    </Grid.Column>
                    
                  </Grid.Row>

                  <div style={{paddingTop:5, paddingLeft: "13em", paddingRight: "2em"}}>
                    <Header as='h2' style={{paddingTop: 7, textAlign:'center',fontSize:"22pt", color: mortalityColor[1]}}>
                      <Header.Content style = {{paddingLeft: 50}}>
                        <Header.Subheader style={{width: 810, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:5, paddingBottom:28, paddingLeft: 6}}>
                          
                          Males make up {(nationalDemog['sex'][0]['Male'][0]['percentPop']).toFixed(0) + "%"} of the population and {(nationalDemog['sex'][0]['Male'][0]['percentCases']).toFixed(0) + "%"} of cases, yet they account for 
                          {" " + (nationalDemog['sex'][0]['Male'][0]['percentDeaths']).toFixed(0) + "%"} of deaths.
                            
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                  </div>

                  <Grid.Row style = {{width: 800, paddingLeft: 320, paddingTop:'1em'}}>
                    <svg width = "1000" height = "40">
                      <rect x = {40} y = {12} width = "20" height = "20" style = {{fill: casesColor[1], strokeWidth:1, stroke: casesColor[1]}}/>
                      <text x = {65} y = {30} style = {{ fontSize: "19px"}}> Percent of Cases</text>
                      <rect x = {250} y = {12} width = "20" height = "20" style = {{fill: mortalityColor[1], strokeWidth:1, stroke: mortalityColor[1]}}/>
                      <text x = {275} y = {30} style = {{ fontSize: "19px"}}> Percent of Deaths </text>
                      <rect x = {455} y = {12} width = "20" height = "20" style = {{fill: "#D3D3D3", strokeWidth:1, stroke: "#D3D3D3"}}/>
                      <text x = {480} y = {30} style = {{ fontSize: "19px"}}> Percent of Population</text>
                    </svg>
                  </Grid.Row>

                  <Grid.Row columns = {2} style = {{width: 1000}}>
                    <Grid.Column style = {{width: 450, paddingLeft: 100}}>
                      <div style={{paddingLeft: "6em", paddingRight: "0em"}}>

                        <VictoryChart
                                  theme={VictoryTheme.material}
                                  width={450}
                                  height={300}
                                  domainPadding={{x:80}}
                                  minDomain={{y: props.ylog?1:0}}
                                  padding={{left: 100, right: 80, top: 30, bottom: 50}}
                                  style = {{fontSize: "14pt"}}
                                  containerComponent={<VictoryContainer responsive={false}/>}
                                >
                                  <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                  <VictoryAxis dependentAxis
                                    style={{ticks:{stroke: "#000000"}, 
                                      axis: {stroke: "#000000"}, 
                                      axisLabel: {padding: 60, fontFamily: 'lato', fontSize: "19px", fill: '#000000'},
                                      grid: {stroke: "transparent"}, 
                                      tickLabels: {fontSize: "20px", 
                                      fill: '#000000', padding: 10, fontFamily: 'lato'}
                                    }}
                                  />
                                  <VictoryGroup offset={23}>

                                  <VictoryBar
                                    horizontal
                                    barWidth={20}
                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                                    data={[
                                      {key: nationalDemog['sex'][0]['Male'][0]['demogLabel'], 'value': nationalDemog['sex'][0]['Male'][0]['percentCases']},
                                      {key: nationalDemog['sex'][0]['Female'][0]['demogLabel'], 'value': nationalDemog['sex'][0]['Female'][0]['percentCases']},
                                      
                                        


                                    ]}
                                    labelComponent={<VictoryLabel dx={0} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000" }}/>}
                                    style={{
                                      data: {
                                        fill: casesColor[1]
                                      }
                                    }}
                                    x="key"
                                    y="value"
                                  />

                                  
                                  <VictoryBar
                                    horizontal
                                    barWidth={20}
                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                                    data={[
                                      {key: nationalDemog['sex'][0]['Male'][0]['demogLabel'], 'value': nationalDemog['sex'][0]['Male'][0]['percentPop']},
                                      {key: nationalDemog['sex'][0]['Female'][0]['demogLabel'], 'value': nationalDemog['sex'][0]['Female'][0]['percentPop']},
                                      
                                        


                                    ]}
                                    labelComponent={<VictoryLabel dx={0} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000" }}/>}
                                    style={{
                                      data: {
                                        fill: "#D3D3D3"
                                      }
                                    }}
                                    x="key"
                                    y="value"
                                  />
                                  </VictoryGroup>
                                </VictoryChart>

                        <Header.Content style = {{paddingLeft: 50, width: 450}}>
                            <Header.Content style={{ fontWeight: 300, paddingTop: 0, paddingBottom:28, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>Percentage of COVID-19 Cases and Population</b>
                            </Header.Content>
                        </Header.Content>
                        
                      </div>
                        <Grid.Row>
                          <Accordion id="commu" style = {{paddingTop: 20, paddingLeft: 103, paddingBottom: 45}} defaultActiveIndex={1} panels={[
                                {
                                    key: 'acquire-dog',
                                    title: {
                                        content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                        icon: 'dropdown',
                                    },
                                    content: {
                                        content: (
                                            <Header as='h2' style={{paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                              <Header.Content  style={{fontSize: "19px"}}>
                                                <Header.Subheader style={{color: '#000000', width: 900, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                  <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covid.cdc.gov/covid-data-tracker/#demographics" target = "_blank" rel="noopener noreferrer"> The CDC COVID Data Tracker </a>
                                                  <br/><b>Data as of:</b> {nationalDemogDate}.<br/>
                                                </Header.Subheader>
                                              </Header.Content>
                                            </Header>
                                        ),
                                      },
                                  }
                              ]

                              } />
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column style = {{width: 450}}>
                      {/* <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 40}}/> </center> */}
                      
                      <div style={{paddingLeft: 64, paddingRight: "0em"}}>
                        
                        <VictoryChart
                                  theme={VictoryTheme.material}
                                  width={450}
                                  height={300}
                                  domainPadding={{x:80}}
                                  minDomain={{y: props.ylog?1:0}}
                                  padding={{left: 100, right: 80, top: 30, bottom: 50}}
                                  style = {{fontSize: "14pt"}}
                                  containerComponent={<VictoryContainer responsive={false}/>}
                                >
                                  <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                  <VictoryAxis dependentAxis
                                    style={{ticks:{stroke: "#000000"}, 
                                      axis: {stroke: "#000000"}, 
                                      axisLabel: {padding: 60, fontFamily: 'lato', fontSize: "19px", fill: '#000000'},
                                      grid: {stroke: "transparent"}, 
                                      tickLabels: {fontSize: "20px", 
                                      fill: '#000000', padding: 10, fontFamily: 'lato'}
                                    }}
                                  />
                                  <VictoryGroup offset={23}>

                                  

                                  <VictoryBar
                                    horizontal
                                    barWidth={20}
                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                                    data={[
                                      {key: nationalDemog['sex'][0]['Male'][0]['demogLabel'], 'value': nationalDemog['sex'][0]['Male'][0]['percentDeaths']},
                                      {key: nationalDemog['sex'][0]['Female'][0]['demogLabel'], 'value': nationalDemog['sex'][0]['Female'][0]['percentDeaths']},
                                      
                                        


                                    ]}
                                    labelComponent={<VictoryLabel dx={0} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000" }}/>}
                                    style={{
                                      data: {
                                        fill: mortalityColor[1]
                                      }
                                    }}
                                    x="key"
                                    y="value"
                                  />
                                  
                                  <VictoryBar
                                    horizontal
                                    barWidth={20}
                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                                    data={[
                                      {key: nationalDemog['sex'][0]['Male'][0]['demogLabel'], 'value': nationalDemog['sex'][0]['Male'][0]['percentPop']},
                                      {key: nationalDemog['sex'][0]['Female'][0]['demogLabel'], 'value': nationalDemog['sex'][0]['Female'][0]['percentPop']},
                                      
                                        


                                    ]}
                                    labelComponent={<VictoryLabel dx={0} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000" }}/>}
                                    style={{
                                      data: {
                                        fill: "#D3D3D3"
                                      }
                                    }}
                                    x="key"
                                    y="value"
                                  />
                                  </VictoryGroup>
                                </VictoryChart>

                          <Header.Content style = {{paddingLeft: 50, width: 450}}>
                              <Header.Content style={{ fontWeight: 300, paddingTop: 0, paddingBottom:28, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>Percentage of COVID-19 Deaths and Population</b>
                              </Header.Content>
                          </Header.Content>
                      </div>
                    </Grid.Column>
                  </Grid.Row>

                </Grid>

                      {/* <div id="commu" style = {{height: 45}}> </div> */}

                <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 0}}/> </center>
                {true && <div style = {{ paddingLeft: "7em", paddingRight: "2em"}}>
                      <Header as='h2' style={{color: '#b2b3b3', textAlign:'center',fontSize:"22pt", paddingTop: 29}}>
                        <Header.Content  style={{fontSize:"22pt",color: mortalityColor[1], paddingLeft: 140}}>
                          COVID-19 Across U.S. Communities
                          <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingRight: 15}}>
                            <center> <b style= {{fontSize: "18pt", paddingLeft: 18}}>COVID-19 cases per 100K by population characteristics across all counties in the United States </b> </center> 
                            <br/>
                            <br/>
                            COVID-19 is affecting communities differently. Community-level factors such as urbanicity,  
                            socioeconomic status, race, and underlying medical conditions make some communities more 
                            vulnerable to COVID-19 than others. The maps and figures below show COVID-19 case rates and 
                            death rates across U.S. counties grouped by these community characteristics.  

                          </Header.Subheader>
                        </Header.Content>
                      </Header>

                      <div id="ccvi" style = {{height: 45}}> </div>

                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:0, textAlign: "left", paddingLeft: 234, paddingRight: "5em", paddingBottom: 40}}>
                          <center> <b style= {{fontSize: "18pt"}}>COVID-19 by Community Vulnerability Index </b> </center> 
                          <br/>

                        </Header.Subheader>
                      <Grid>
                        <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                          <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                            <div >
                              <br/>

                              <svg width="260" height="80">
                                
                                {_.map(legendSplitccvi, (splitpoint, i) => {
                                  if(legendSplitccvi[i] < 1){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitccvi[i].toFixed(1)}</text>                    
                                  }else if(legendSplitccvi[i] > 999999){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitccvi[i]/1000000).toFixed(0) + "M"}</text>                    
                                  }else if(legendSplitccvi[i] > 999){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitccvi[i]/1000).toFixed(0) + "K"}</text>                    
                                  }
                                  return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitccvi[i].toFixed(0)}</text>                    
                                })} 
                                <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinccvi}</text>
                                <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxccvi}</text>


                                {_.map(colorPalette, (color, i) => {
                                  return <rect key={i} x={50+20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                                })} 


                                <text x={50} y={74} style={{fontSize: '0.8em'}}>Low</text>
                                <text x={50+20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>


                                <rect x={195} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                                <text x={217} y={50} style={{fontSize: '0.7em'}}> None </text>
                                <text x={217} y={59} style={{fontSize: '0.7em'}}> Reported </text>
                              

                              </svg>

                              <br/><br/><br/>
                              

                              <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/ccvi.png' />            

                            </div>
                            <Grid>
                              <Grid.Row>
                                <Accordion style = {{paddingTop: 100, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                      {
                                          key: 'acquire-dog',
                                          title: {
                                              content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the map</u>,
                                              icon: 'dropdown',
                                          },
                                          content: {
                                              content: (
                                                  <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                                    <Header.Content  style={{fontSize: "19px"}}>
                                                      <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                      This map shows each U.S. county according to its Community Vulnerability ranking. 
                                                      County rankings are based on quintiles of the CCVI. The ranking classified counties 
                                                      into five groups designed to be of equal size, so that the lowest quintile contains 
                                                      the counties with values in the 0%-20% range for this county characteristic, and the highest 
                                                      quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                      <br/>
                                                      <br/>
                                                      <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://precisionforcovid.org/ccvi" target = "_blank" rel="noopener noreferrer"> Surgo Foundation </a>
                                                      <br/>
                                                      For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                      </Header.Subheader>
                                                    </Header.Content>
                                                  </Header>
                                              ),
                                            },
                                        }
                                    ]

                                    } />
                              </Grid.Row>
                            </Grid>


                          </Grid.Column>
                          <Grid.Column style = {{paddingLeft: 0}}>
                            <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                              <Header.Content style = {{paddingLeft: 0, width: 500}}>
                              COVID-19 Cases by <br/> Community Vulnerability Index
                              </Header.Content>
                            </Header>
                                <VictoryChart
                                  theme={VictoryTheme.material}
                                  width={530}
                                  height={180}
                                  domainPadding={20}
                                  minDomain={{y: props.ylog?1:0}}
                                  padding={{left: 130, right: 90, top: 5, bottom: 1}}
                                  style = {{fontSize: "14pt"}}
                                  containerComponent={<VictoryContainer responsive={false}/>}
                                >
                                  <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                  <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                  <VictoryBar
                                    horizontal
                                    barRatio={0.80}
                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                    data={[
                                          {key: nationalBarChart['caserate'][0]['ccvi'][0]['label'], 'value': (nationalBarChart['caserate'][0]['ccvi'][0]['measure']/nationalBarChart['caserate'][0]['ccvi'][0]['measure'])*nationalBarChart['caserate'][0]['ccvi'][0]['measure'] || 0},
                                          {key: nationalBarChart['caserate'][0]['ccvi'][1]['label'], 'value': (nationalBarChart['caserate'][0]['ccvi'][1]['measure']/nationalBarChart['caserate'][0]['ccvi'][0]['measure'])*nationalBarChart['caserate'][0]['ccvi'][0]['measure'] || 0},
                                          {key: nationalBarChart['caserate'][0]['ccvi'][2]['label'], 'value': (nationalBarChart['caserate'][0]['ccvi'][2]['measure']/nationalBarChart['caserate'][0]['ccvi'][0]['measure'])*nationalBarChart['caserate'][0]['ccvi'][0]['measure'] || 0},
                                          {key: nationalBarChart['caserate'][0]['ccvi'][3]['label'], 'value': (nationalBarChart['caserate'][0]['ccvi'][3]['measure']/nationalBarChart['caserate'][0]['ccvi'][0]['measure'])*nationalBarChart['caserate'][0]['ccvi'][0]['measure'] || 0},
                                          {key: nationalBarChart['caserate'][0]['ccvi'][4]['label'], 'value': (nationalBarChart['caserate'][0]['ccvi'][4]['measure']/nationalBarChart['caserate'][0]['ccvi'][0]['measure'])*nationalBarChart['caserate'][0]['ccvi'][0]['measure'] || 0}



                                    ]}
                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                    style={{
                                      data: {
                                        fill: casesColor[1]
                                      }
                                    }}
                                    x="key"
                                    y="value"
                                  />
                                </VictoryChart>

                                <Header.Content style = {{width: 550}}>
                                  
                                  <Header.Content style={{fontWeight: 300, paddingLeft: 140, paddingTop: 20, paddingBottom:0, fontSize: "14pt", lineHeight: "18pt"}}>
                                    <b>COVID-19 Cases per 100K</b>
                                  </Header.Content>
                                </Header.Content>
                                
                                <br/>
                                <br/>

                                <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                                  <Header.Content style = {{paddingLeft: 0, width: 500}}>
                                  COVID-19 Deaths by <br/> Community Vulnerability Index
                                  </Header.Content>
                                </Header>
                                <VictoryChart
                                  theme={VictoryTheme.material}
                                  width={530}
                                  height={180}
                                  domainPadding={20}
                                  minDomain={{y: props.ylog?1:0}}
                                  padding={{left: 130, right: 90, top: 5, bottom: 1}}
                                  style = {{fontSize: "14pt"}}
                                  containerComponent={<VictoryContainer responsive={false}/>}
                                >
                                  <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                  <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                  <VictoryBar
                                    horizontal
                                    barRatio={0.80}
                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                    data={[
                                          {key: nationalBarChart['covidmortality'][0]['ccvi'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['ccvi'][0]['measure']/nationalBarChart['covidmortality'][0]['ccvi'][0]['measure'])*nationalBarChart['covidmortality'][0]['ccvi'][0]['measure'] || 0},
                                          {key: nationalBarChart['covidmortality'][0]['ccvi'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['ccvi'][1]['measure']/nationalBarChart['covidmortality'][0]['ccvi'][0]['measure'])*nationalBarChart['covidmortality'][0]['ccvi'][0]['measure'] || 0},
                                          {key: nationalBarChart['covidmortality'][0]['ccvi'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['ccvi'][2]['measure']/nationalBarChart['covidmortality'][0]['ccvi'][0]['measure'])*nationalBarChart['covidmortality'][0]['ccvi'][0]['measure'] || 0},
                                          {key: nationalBarChart['covidmortality'][0]['ccvi'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['ccvi'][3]['measure']/nationalBarChart['covidmortality'][0]['ccvi'][0]['measure'])*nationalBarChart['covidmortality'][0]['ccvi'][0]['measure'] || 0},
                                          {key: nationalBarChart['covidmortality'][0]['ccvi'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['ccvi'][4]['measure']/nationalBarChart['covidmortality'][0]['ccvi'][0]['measure'])*nationalBarChart['covidmortality'][0]['ccvi'][0]['measure'] || 0}



                                    ]}
                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                    style={{
                                      data: {
                                        fill: mortalityColor[1]
                                      }
                                    }}
                                    x="key"
                                    y="value"
                                  />
                                </VictoryChart>

                                <Header.Content style = {{width: 550}}>
                                    <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:14, fontSize: "14pt", lineHeight: "18pt"}}>
                                      <b>COVID-19 Deaths per 100K</b>
                                    </Header.Content>
                                </Header.Content>
                                <Grid.Row>
                                  <Accordion style = {{paddingTop: 0, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                        {
                                            key: 'acquire-dog',
                                            title: {
                                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the chart</u>,
                                                icon: 'dropdown',
                                            },
                                            content: {
                                                content: (
                                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                                      <Header.Content  style={{fontSize: "19px"}}>
                                                        <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                                        per 100K residents by CCVI ranking. The y-axis displays CCVI rankings based on 
                                                        quintiles (groups of 20%). The x-axis displays the average number of COVID-19 cases 
                                                        (top chart) or deaths (bottom chart) per 100K that occurred in each group of 
                                                        counties ranked by CCVI. The ranking classified counties into five groups designed 
                                                        to be of equal size, so that the lowest quintile contains the counties with values 
                                                        in the 0%-20% range for this county characteristic, and the very high CCVI contains 
                                                        counties with values in the 80%-100% range for this county characteristic. Low CCVI 
                                                        indicates counties in the 20%-40% range, moderate CCVI indicates counties in the 40%-60% 
                                                        range, and high CCVI indicates counties in the 60%-80% range.
                                                        <br/>
                                                        <br/>
                                                        For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                        
                                                        
                                                        
                                                        </Header.Subheader>
                                                      </Header.Content>
                                                    </Header>
                                                ),
                                              },
                                          }
                                      ]} 
                                  />
                                </Grid.Row>
                          </Grid.Column>
                          
                        </Grid.Row>
                      </Grid>
                      <div id="poverty" style = {{height: 45}}> </div>

                      <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center>

                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                            <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>Population in poverty</b> </center> 
                      </Header.Subheader>

                      {ccvi && <Grid>
                        <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                          <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                            <div >
                              
                              <svg width="260" height="80">
                                
                                {_.map(legendSplitPoverty, (splitpoint, i) => {
                                  if(legendSplitPoverty[i] < 1){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitPoverty[i].toFixed(1)}</text>                    
                                  }else if(legendSplitPoverty[i] > 999999){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitPoverty[i]/1000000).toFixed(0) + "M"}</text>                    
                                  }else if(legendSplitPoverty[i] > 999){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitPoverty[i]/1000).toFixed(0) + "K"}</text>                    
                                  }
                                  return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitPoverty[i].toFixed(0)}</text>                    
                                })} 
                                <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinPoverty}</text>
                                <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxPoverty}</text>


                                {_.map(colorPalette, (color, i) => {
                                  return <rect key={i} x={50+20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                                })} 


                                <text x={50} y={74} style={{fontSize: '0.8em'}}>Low</text>
                                <text x={50+20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>


                                <rect x={195} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                                <text x={217} y={50} style={{fontSize: '0.7em'}}> None </text>
                                <text x={217} y={59} style={{fontSize: '0.7em'}}> Reported </text>
                              

                              </svg>

                              <br/><br/><br/>
                                {/* <ComposableMap 
                                  projection="geoAlbersUsa" 
                                  data-tip=""
                                  width={520} 
                                  height={300}
                                  strokeWidth= {0.1}
                                  stroke= 'black'
                                  projectionConfig={{scale: 580}}
                                  style = {{paddingLeft: 50}}
                                  >
                                  <Geographies geography={geoUrl}>
                                    {({ geographies }) => 
                                      <svg>
                                        {geographies.map(geo => (
                                          <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={
                                            ((colorPoverty && data[geo.id] && (data[geo.id][poverty]) > 0)?
                                                colorPoverty[data[geo.id][poverty]]: 
                                                (colorPoverty && data[geo.id] && data[geo.id][poverty] === 0)?
                                                  '#FFFFFF':'#FFFFFF')}
                                            
                                          />
                                        ))}
                                      </svg>
                                    }
                                  </Geographies>
                                  

                                </ComposableMap> */}
                                <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/poverty.png' />
                            </div>
                            <Grid>
                            <Grid.Row>
                            <Accordion style = {{paddingTop: 120, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                {
                                    key: 'acquire-dog',
                                    title: {
                                        content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the map</u>,
                                        icon: 'dropdown',
                                    },
                                    content: {
                                        content: (
                                            <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                              <Header.Content  style={{fontSize: "19px"}}>
                                                <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                This map shows each U.S. county according to its percentage of population in poverty. 
                                                County rankings are based on quintiles of percentage of population in poverty. The ranking classified counties 
                                                into five groups designed to be of equal size, so that the lowest quintile contains 
                                                the counties with values in the 0%-20% range for this county characteristic, and the highest 
                                                quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                <br/>
                                                <br/>
                                                <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target = "_blank" rel="noopener noreferrer"> American Community Survey</a> by the U.S. Census Bureau
                                                <br/>
                                                For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                </Header.Subheader>
                                              </Header.Content>
                                            </Header>
                                        ),
                                      },
                                  }
                              ]

                              } />

                            </Grid.Row>
                          </Grid>
                          </Grid.Column>
                          <Grid.Column>
                            <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                              <Header.Content style = {{paddingLeft: 0, width: 500}}>
                              COVID-19 Cases by Percentage of <br/> Population in Poverty
                              </Header.Content>
                            </Header>
                                <VictoryChart
                                  theme={VictoryTheme.material}
                                  width={530}
                                  height={180}
                                  domainPadding={20}
                                  minDomain={{y: props.ylog?1:0}}
                                  padding={{left: 120, right: 90, top: 5, bottom: 1}}
                                  style = {{fontSize: "14pt"}}
                                  containerComponent={<VictoryContainer responsive={false}/>}
                                >
                                  <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                  <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                  <VictoryBar
                                    horizontal
                                    barRatio={0.80}
                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                    data={[
                                          {key: nationalBarChart['caserate'][0]['poverty'][0]['label'], 'value': (nationalBarChart['caserate'][0]['poverty'][0]['measure']/nationalBarChart['caserate'][0]['poverty'][0]['measure'])*nationalBarChart['caserate'][0]['poverty'][0]['measure'] || 0},
                                          {key: nationalBarChart['caserate'][0]['poverty'][1]['label'], 'value': (nationalBarChart['caserate'][0]['poverty'][1]['measure']/nationalBarChart['caserate'][0]['poverty'][0]['measure'])*nationalBarChart['caserate'][0]['poverty'][0]['measure'] || 0},
                                          {key: nationalBarChart['caserate'][0]['poverty'][2]['label'], 'value': (nationalBarChart['caserate'][0]['poverty'][2]['measure']/nationalBarChart['caserate'][0]['poverty'][0]['measure'])*nationalBarChart['caserate'][0]['poverty'][0]['measure'] || 0},
                                          {key: nationalBarChart['caserate'][0]['poverty'][3]['label'], 'value': (nationalBarChart['caserate'][0]['poverty'][3]['measure']/nationalBarChart['caserate'][0]['poverty'][0]['measure'])*nationalBarChart['caserate'][0]['poverty'][0]['measure'] || 0},
                                          {key: nationalBarChart['caserate'][0]['poverty'][4]['label'], 'value': (nationalBarChart['caserate'][0]['poverty'][4]['measure']/nationalBarChart['caserate'][0]['poverty'][0]['measure'])*nationalBarChart['caserate'][0]['poverty'][0]['measure'] || 0}



                                    ]}
                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                    style={{
                                      data: {
                                        fill: casesColor[1]
                                      }
                                    }}
                                    x="key"
                                    y="value"
                                  />
                                </VictoryChart>

                                <Header.Content style = {{width: 550}}>
                                  
                                  <Header.Content style={{fontWeight: 300, paddingLeft: 140, paddingTop: 20, paddingBottom:0, fontSize: "14pt", lineHeight: "18pt"}}>
                                    <b>COVID-19 Cases per 100K</b>
                                  </Header.Content>
                                </Header.Content>
                                  
                                  <br/>
                                  <br/>

                                <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                                  <Header.Content style = {{paddingLeft: 0, width: 500}}>
                                    COVID-19 Deaths by Percentage of <br/> Population in Poverty
                                  </Header.Content>
                                </Header>
                                <VictoryChart
                                  theme={VictoryTheme.material}
                                  width={530}
                                  height={180}
                                  domainPadding={20}
                                  minDomain={{y: props.ylog?1:0}}
                                  padding={{left: 120, right: 90, top: 5, bottom: 1}}
                                  style = {{fontSize: "14pt"}}
                                  containerComponent={<VictoryContainer responsive={false}/>}
                                >
                                  <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                  <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                  <VictoryBar
                                    horizontal
                                    barRatio={0.80}
                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                    data={[
                                          {key: nationalBarChart['covidmortality'][0]['poverty'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['poverty'][0]['measure']/nationalBarChart['covidmortality'][0]['poverty'][0]['measure'])*nationalBarChart['covidmortality'][0]['poverty'][0]['measure'] || 0},
                                          {key: nationalBarChart['covidmortality'][0]['poverty'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['poverty'][1]['measure']/nationalBarChart['covidmortality'][0]['poverty'][0]['measure'])*nationalBarChart['covidmortality'][0]['poverty'][0]['measure'] || 0},
                                          {key: nationalBarChart['covidmortality'][0]['poverty'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['poverty'][2]['measure']/nationalBarChart['covidmortality'][0]['poverty'][0]['measure'])*nationalBarChart['covidmortality'][0]['poverty'][0]['measure'] || 0},
                                          {key: nationalBarChart['covidmortality'][0]['poverty'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['poverty'][3]['measure']/nationalBarChart['covidmortality'][0]['poverty'][0]['measure'])*nationalBarChart['covidmortality'][0]['poverty'][0]['measure'] || 0},
                                          {key: nationalBarChart['covidmortality'][0]['poverty'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['poverty'][4]['measure']/nationalBarChart['covidmortality'][0]['poverty'][0]['measure'])*nationalBarChart['covidmortality'][0]['poverty'][0]['measure'] || 0}



                                    ]}
                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                    style={{
                                      data: {
                                        fill: mortalityColor[1]
                                      }
                                    }}
                                    x="key"
                                    y="value"
                                  />
                                </VictoryChart>

                                <Header.Content style = {{width: 550}}>
                                    <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:14, fontSize: "14pt", lineHeight: "18pt"}}>
                                      <b>COVID-19 Deaths per 100K</b>
                                    </Header.Content>
                                </Header.Content>
                                <Grid.Row>
                                  <Accordion style = {{paddingTop: 0, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                        {
                                            key: 'acquire-dog',
                                            title: {
                                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the chart</u>,
                                                icon: 'dropdown',
                                            },
                                            content: {
                                                content: (
                                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                                      <Header.Content  style={{fontSize: "19px"}}>
                                                        <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                                        per 100K residents by county ranking on percentage of population in poverty. The 
                                                        y-axis displays percentage population in poverty rankings based on quintiles (groups of 20%). 
                                                        The x-axis displays the average number of COVID-19 cases (top chart) or deaths (bottom chart) 
                                                        per 100K that occurred in each group of counties ranked by percentage population in poverty. 
                                                        The ranking classified counties into five groups designed to be of equal size, so that the 
                                                        "very low % in poverty" group contains the counties with values in the 0%-20% range for this county 
                                                        characteristic, and the "very high % in poverty" group contains counties with values in the 80%-100% 
                                                        range for this county characteristic. Low % in poverty indicates counties in the 20%-40% range, 
                                                        moderate % in poverty indicates counties in the 40%-60% range, and high % in poverty indicates 
                                                        counties in the 60%-80% range.
                                                        <br/>
                                                        <br/>
                                                        For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                    
                                                        
                                                        
                                                        </Header.Subheader>
                                                      </Header.Content>
                                                    </Header>
                                                ),
                                              },
                                          }
                                      ]} 
                                  />
                                </Grid.Row>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>}
                      <div id="metro" style = {{height: 45}}> </div>

                      <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center>
                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                            <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>Metropolitan Status</b> </center> 
                      </Header.Subheader>
                    
                      {poverty && <Grid>
                        <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                          <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                            

                            <div >
                              
                              <svg width="550" height="145">

                                <text x={80} y={35} style={{fontSize: '0.8em'}}> Remote rural area</text>                    
                                <text x={80} y={55} style={{fontSize: '0.8em'}}> Rural areas near cities</text>                    
                                <text x={80} y={75} style={{fontSize: '0.8em'}}> Small cities</text>                    
                                <text x={80} y={95} style={{fontSize: '0.8em'}}> Small suburbs</text>                    
                                <text x={80} y={115} style={{fontSize: '0.8em'}}> Large suburbs</text>                    
                                <text x={80} y={135} style={{fontSize: '0.8em'}}> Inner City</text>                    


                                {_.map(colorPalette, (color, i) => {
                                  return <rect key={i} x={50} y={20+20*i} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                                })} 


                                <rect x={230} y={20} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                                <text x={252} y={30} style={{fontSize: '0.8em'}}> None </text>
                                <text x={252} y={40} style={{fontSize: '0.8em'}}> Reported </text>
                              

                              </svg>

                              <br/><br/><br/>
                                {/* <ComposableMap 
                                  projection="geoAlbersUsa" 
                                  data-tip=""
                                  width={520} 
                                  height={300}
                                  strokeWidth= {0.1}
                                  stroke= 'black'
                                  projectionConfig={{scale: 580}}
                                  style = {{paddingLeft: 50}}
                                  >
                                  <Geographies geography={geoUrl}>
                                    {({ geographies }) => 
                                      <svg>
                                        {geographies.map(geo => (
                                          <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={
                                            (
                                                (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === 1)?
                                                colorPalette[0]: 
                                                (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === 2)?
                                                colorPalette[1]: 
                                                (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === 3)?
                                                colorPalette[2]: 
                                                (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === 4)?
                                                colorPalette[3]: 
                                                (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === 5)?
                                                colorPalette[4]: 
                                                (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === 6)?
                                                colorPalette[5]: "#FFFFFF")}
                                            
                                          />
                                        ))}
                                      </svg>
                                    }
                                  </Geographies>
                                  

                                </ComposableMap> */}
                                <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/urbanrural.png' />
                                
                            </div>
                            <Grid>
                            <Grid.Row>
                              <Accordion style = {{paddingTop: 50, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                {
                                    key: 'acquire-dog',
                                    title: {
                                        content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the map</u>,
                                        icon: 'dropdown',
                                    },
                                    content: {
                                        content: (
                                            <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                              <Header.Content  style={{fontSize: "19px"}}>
                                                <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                This map shows each U.S. county according to its metropolitan status. Inner city counties 
                                                have &#60; 1 million population or contain the entire or large part of the population of the 
                                                largest principal city. Large suburban counties have a population &#60; 1 million, but do not 
                                                qualify as inner cities. Small suburban counties have a population of 250,000-999,999. 
                                                Small cities have populations &#62; 250,000 and are near large cities. Rural areas near cities 
                                                have an urbanized area with a population between 10,000-49,999. Remote rural 
                                                counties have populations less than 10,000 individuals.

                                                <br/>
                                                <br/>
                                                <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.cdc.gov/nchs/data_access/urban_rural.htm" target = "_blank" rel="noopener noreferrer"> 2013 Urban-Rural Classification Scheme for Counties</a> by The National Center for Health Statistics
                                                <br/>
                                                For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                </Header.Subheader>
                                              </Header.Content>
                                            </Header>
                                        ),
                                      },
                                  }
                              ]

                              } />


                            </Grid.Row>
                          </Grid>
                          </Grid.Column>
                          <Grid.Column>
                            <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                              <Header.Content style = {{paddingLeft: 0, width: 500}}>
                              COVID-19 Cases by <br/>  Metropolitan Status
                              </Header.Content>
                            </Header>
                              <VictoryChart
                                theme={VictoryTheme.material}
                                width={530}
                                height={180}
                                domainPadding={20}
                                minDomain={{y: props.ylog?1:0}}
                                padding={{left: 250, right: 90, top: 15, bottom: 1}}
                                style = {{fontSize: "14pt"}}
                                containerComponent={<VictoryContainer responsive={false}/>}
                              >
                                <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                <VictoryBar
                                  horizontal
                                  barRatio={0.80}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                  data={[
                                        {key: "Inner city", 'value': (nationalBarChart['caserate'][0]['urbanrural'][0]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0},
                                        {key: "Large suburbs", 'value': (nationalBarChart['caserate'][0]['urbanrural'][1]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0},
                                        {key: "Small suburbs", 'value': (nationalBarChart['caserate'][0]['urbanrural'][2]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0},
                                        {key: "Small cities", 'value': (nationalBarChart['caserate'][0]['urbanrural'][3]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0},
                                        {key: "Rural areas near cities", 'value': (nationalBarChart['caserate'][0]['urbanrural'][4]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0},
                                        {key: "Remote rural areas", 'value': (nationalBarChart['caserate'][0]['urbanrural'][5]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0}



                                  ]}
                                  labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                  style={{
                                    data: {
                                      fill: casesColor[1]
                                    }
                                  }}
                                  x="key"
                                  y="value"
                                />
                              </VictoryChart>

                              <Header.Content style = {{width: 550}}>
                                
                                <Header.Content style={{fontWeight: 300, paddingLeft: 140, paddingTop: 20, paddingBottom:0, fontSize: "14pt", lineHeight: "18pt"}}>
                                  <b>COVID-19 Cases per 100K</b>
                                </Header.Content>
                              </Header.Content>
                                
                                <br/>
                                <br/>

                              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                                <Header.Content style = {{paddingLeft: 0, width: 500}}>
                                  COVID-19 Deaths by <br/> Metropolitan Status
                                </Header.Content>
                              </Header>
                                <VictoryChart
                                  theme={VictoryTheme.material}
                                  width={530}
                                  height={180}
                                  domainPadding={20}
                                  minDomain={{y: props.ylog?1:0}}
                                  padding={{left: 250, right: 90, top: 15, bottom: 1}}
                                  style = {{fontSize: "14pt"}}
                                  containerComponent={<VictoryContainer responsive={false}/>}
                                >
                                  <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                  <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                  <VictoryBar
                                    horizontal
                                    barRatio={0.80}
                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                    data={[
                                          {key: "Inner city", 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0},
                                          {key: "Large suburbs", 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][1]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0},
                                          {key: "Small suburbs", 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][2]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0},
                                          {key: "Small cities", 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][3]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0},
                                          {key: "Rural areas near cities", 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][4]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0},
                                          {key: "Remote rural areas", 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][5]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0}



                                    ]}
                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                    style={{
                                      data: {
                                        fill: mortalityColor[1]
                                      }
                                    }}
                                    x="key"
                                    y="value"
                                  />
                                </VictoryChart>

                                <Header.Content style = {{width: 550}}>
                                    <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:10, fontSize: "14pt", lineHeight: "18pt"}}>
                                      <b>COVID-19 Deaths per 100K</b>
                                    </Header.Content>
                                </Header.Content>
                                <Grid.Row>
                                  <Accordion style = {{paddingTop: 0, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                        {
                                            key: 'acquire-dog',
                                            title: {
                                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the chart</u>,
                                                icon: 'dropdown',
                                            },
                                            content: {
                                                content: (
                                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                                      <Header.Content  style={{fontSize: "19px"}}>
                                                        <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                                        per 100K residents by metropolitan status (y-axis). Inner city counties have &#60; 1 
                                                        million population or contain the entire or large part of the population of the largest 
                                                        principle city. Large suburban counties have a population &#60; 1 million, but do not qualify 
                                                        as inner city. Small suburban counties have a population of 250,000-999,999. Small cities 
                                                        have populations &#62; 250,000 and are near large cities. Rural areas near cities have an 
                                                        urbanized area with population between 10,000-49,999. Remote rural counties have 
                                                        populations less than 10,000 individuals. This urban-rural classification scheme is 
                                                        from the National Center for Health Statistics.
                                                        <br/>
                                                        <br/>
                                                        For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                    
                                                        
                                                        
                                                        </Header.Subheader>
                                                      </Header.Content>
                                                    </Header>
                                                ),
                                              },
                                          }
                                      ]} 
                                  />
                                </Grid.Row>
                            </Grid.Column>
                        </Grid.Row>
                      </Grid>}

                      <div id="region" style = {{height: 45}}> </div>

                      <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center>

                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                            <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>Region</b> </center> 
                      </Header.Subheader>

                      {urbrur && <Grid>
                        <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                          <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                            <div >
                              
                            <svg width="550" height="130">

                                <text x={80} y={35} style={{fontSize: '0.8em'}}> South</text>                    
                                <text x={80} y={55} style={{fontSize: '0.8em'}}> West</text>                    
                                <text x={80} y={75} style={{fontSize: '0.8em'}}> Northeast</text>                    
                                <text x={80} y={95} style={{fontSize: '0.8em'}}> Midwest</text>                    


                                {_.map(colorPalette.slice(2), (color, i) => {
                                    return <rect key={i} x={50} y={20+20*i} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                                })} 


                                <rect x={130} y={20} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                                <text x={152} y={30} style={{fontSize: '0.8em'}}> None </text>
                                <text x={152} y={40} style={{fontSize: '0.8em'}}> Reported </text>


                                </svg>

                                <br/><br/><br/>
                                {/* <ComposableMap 
                                  projection="geoAlbersUsa" 
                                  data-tip=""
                                  width={520} 
                                  height={300}
                                  strokeWidth= {0.1}
                                  stroke= 'black'
                                  projectionConfig={{scale: 580}}
                                  style = {{paddingLeft: 50}}
                                  >
                                  <Geographies geography={stBoundUrl} stateBoundary = {true}>
                                    {({ geographies }) => 
                                      <svg>
                                        {geographies.map(geo => (
                                          <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={
                                            ((data[geo.id] && (data[geo.id][region]) === 1)?
                                                colorPalette[2]: 
                                                (data[geo.id] && (data[geo.id][region]) === 2)?
                                                colorPalette[3]:
                                                (data[geo.id] && (data[geo.id][region]) === 3)?
                                                colorPalette[4]:
                                                (data[geo.id] && (data[geo.id][region]) === 4)?
                                                colorPalette[5]:'#FFFFFF')}
                                            
                                          />
                                        ))}
                                      </svg>
                                    }
                                  </Geographies>
                                  

                                </ComposableMap> */}
                                <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/region.png' />
                            </div>
                            <Grid>
                            <Grid.Row>
                              <Accordion style = {{paddingTop: 25, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                {
                                    key: 'acquire-dog',
                                    title: {
                                        content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the map</u>,
                                        icon: 'dropdown',
                                    },
                                    content: {
                                        content: (
                                            <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                              <Header.Content  style={{fontSize: "19px"}}>
                                                <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                This map shows each U.S. county according to its geographic region.
                                                <br/>
                                                <br/>
                                                <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.census.gov/geographies/reference-maps/2010/geo/2010-census-regions-and-divisions-of-the-united-states.html" target = "_blank" rel="noopener noreferrer"> United States Census Bureau</a>
                                                <br/>
                                                For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                </Header.Subheader>
                                              </Header.Content>
                                            </Header>
                                        ),
                                      },
                                  }
                              ]

                              } />

                            </Grid.Row>
                          </Grid>
                          </Grid.Column>
                          <Grid.Column>
                            <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                              <Header.Content style = {{paddingLeft: 0, width: 500}}>
                              COVID-19 Cases by Region
                              </Header.Content>
                            </Header>
                            <VictoryChart
                              theme={VictoryTheme.material}
                              width={530}
                              height={180}
                              domainPadding={20}
                              minDomain={{y: props.ylog?1:0}}
                              padding={{left: 120, right: 90, top: 5, bottom: 1}}
                              style = {{fontSize: "14pt"}}
                              containerComponent={<VictoryContainer responsive={false}/>}
                            >
                              <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                              <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                              <VictoryBar
                                horizontal
                                barRatio={0.80}
                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                data={[
                                      {key: nationalBarChart['caserate'][0]['region'][0]['label'], 'value': (nationalBarChart['caserate'][0]['region'][0]['measure']/nationalBarChart['caserate'][0]['region'][0]['measure'])*nationalBarChart['caserate'][0]['region'][0]['measure'] || 0},
                                      {key: nationalBarChart['caserate'][0]['region'][1]['label'], 'value': (nationalBarChart['caserate'][0]['region'][1]['measure']/nationalBarChart['caserate'][0]['region'][0]['measure'])*nationalBarChart['caserate'][0]['region'][0]['measure'] || 0},
                                      {key: nationalBarChart['caserate'][0]['region'][2]['label'], 'value': (nationalBarChart['caserate'][0]['region'][2]['measure']/nationalBarChart['caserate'][0]['region'][0]['measure'])*nationalBarChart['caserate'][0]['region'][0]['measure'] || 0},
                                      {key: nationalBarChart['caserate'][0]['region'][3]['label'], 'value': (nationalBarChart['caserate'][0]['region'][3]['measure']/nationalBarChart['caserate'][0]['region'][0]['measure'])*nationalBarChart['caserate'][0]['region'][0]['measure'] || 0},
                                      // {key: nationalBarChart['caserate'][0]['region'][4]['label'], 'value': (nationalBarChart['caserate'][0]['region'][4]['measure']/nationalBarChart['caserate'][0]['region'][0]['measure'])*nationalBarChart['caserate'][0]['region'][0]['measure'] || 0}



                                ]}
                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                style={{
                                  data: {
                                    fill: casesColor[1]
                                  }
                                }}
                                x="key"
                                y="value"
                              />
                            </VictoryChart>

                            <Header.Content style = {{width: 550}}>
                              
                              <Header.Content style={{fontWeight: 300, paddingLeft: 140, paddingTop: 20, paddingBottom:0, fontSize: "14pt", lineHeight: "18pt"}}>
                                <b>COVID-19 Cases per 100K</b>
                              </Header.Content>
                            </Header.Content>
                                  
                                  <br/>
                                  <br/>

                            <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                                <Header.Content style = {{paddingLeft: 0, width: 500}}>
                                  COVID-19 Deaths by Region
                                </Header.Content>
                              </Header>
                            <VictoryChart
                              theme={VictoryTheme.material}
                              width={530}
                              height={180}
                              domainPadding={20}
                              minDomain={{y: props.ylog?1:0}}
                              padding={{left: 120, right: 90, top: 5, bottom: 1}}
                              style = {{fontSize: "14pt"}}
                              containerComponent={<VictoryContainer responsive={false}/>}
                            >
                              <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                              <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                              <VictoryBar
                                horizontal
                                barRatio={0.80}
                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                data={[
                                      {key: nationalBarChart['covidmortality'][0]['region'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['region'][0]['measure']/nationalBarChart['covidmortality'][0]['region'][0]['measure'])*nationalBarChart['covidmortality'][0]['region'][0]['measure'] || 0},
                                      {key: nationalBarChart['covidmortality'][0]['region'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['region'][1]['measure']/nationalBarChart['covidmortality'][0]['region'][0]['measure'])*nationalBarChart['covidmortality'][0]['region'][0]['measure'] || 0},
                                      {key: nationalBarChart['covidmortality'][0]['region'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['region'][2]['measure']/nationalBarChart['covidmortality'][0]['region'][0]['measure'])*nationalBarChart['covidmortality'][0]['region'][0]['measure'] || 0},
                                      {key: nationalBarChart['covidmortality'][0]['region'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['region'][3]['measure']/nationalBarChart['covidmortality'][0]['region'][0]['measure'])*nationalBarChart['covidmortality'][0]['region'][0]['measure'] || 0},
                                      // {key: nationalBarChart['covidmortality'][0]['region'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['region'][4]['measure']/nationalBarChart['covidmortality'][0]['region'][0]['measure'])*nationalBarChart['covidmortality'][0]['region'][0]['measure'] || 0}



                                ]}
                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                style={{
                                  data: {
                                    fill: mortalityColor[1]
                                  }
                                }}
                                x="key"
                                y="value"
                              />
                            </VictoryChart>

                            <Header.Content style = {{width: 550}}>
                                <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:14, fontSize: "14pt", lineHeight: "18pt"}}>
                                  <b>COVID-19 Deaths per 100K</b>
                                </Header.Content>
                            </Header.Content>
                            <Grid.Row>
                              <Accordion style = {{paddingTop: 0, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                    {
                                        key: 'acquire-dog',
                                        title: {
                                            content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the chart</u>,
                                            icon: 'dropdown',
                                        },
                                        content: {
                                            content: (
                                                <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                                  <Header.Content  style={{fontSize: "19px"}}>
                                                    <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                    This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                                    per 100K residents by geographic region (y-axis).
                                                    <br/>
                                                    <br/>
                                                    For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                    
                                                    </Header.Subheader>
                                                  </Header.Content>
                                                </Header>
                                            ),
                                          },
                                      }
                                  ]} 
                              />
                            </Grid.Row>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>}
                      <div id="black" style = {{height: 45}}> </div>

                      <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center> 

                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                            <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>African American population</b> </center> 
                      </Header.Subheader>
                      
                      {region && <Grid>
                        <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                          <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                            <div >
                              
                              <svg width="260" height="80">
                                
                                {_.map(legendSplitBlack, (splitpoint, i) => {
                                  if(legendSplitBlack[i] < 1){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitBlack[i].toFixed(1)}</text>                    
                                  }else if(legendSplitBlack[i] > 999999){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitBlack[i]/1000000).toFixed(0) + "M"}</text>                    
                                  }else if(legendSplitBlack[i] > 999){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitBlack[i]/1000).toFixed(0) + "K"}</text>                    
                                  }
                                  return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitBlack[i].toFixed(0)}</text>                    
                                })} 
                                <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinBlack}</text>
                                <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxBlack}</text>


                                {_.map(colorPalette, (color, i) => {
                                  return <rect key={i} x={50+20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                                })} 


                                <text x={50} y={74} style={{fontSize: '0.8em'}}>Low</text>
                                <text x={50+20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>


                                <rect x={195} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                                <text x={217} y={50} style={{fontSize: '0.7em'}}> None </text>
                                <text x={217} y={59} style={{fontSize: '0.7em'}}> Reported </text>
                              

                              </svg>

                              <br/><br/><br/>
                                {/* <ComposableMap 
                                  projection="geoAlbersUsa" 
                                  data-tip=""
                                  width={520} 
                                  height={300}
                                  strokeWidth= {0.1}
                                  stroke= 'black'
                                  projectionConfig={{scale: 580}}
                                  style = {{paddingLeft: 50}}
                                  >
                                  <Geographies geography={geoUrl}>
                                    {({ geographies }) => 
                                      <svg>
                                        {geographies.map(geo => (
                                          <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={
                                            ((colorBlack && data[geo.id] && (data[geo.id][black]) > 0)?
                                                colorBlack[data[geo.id][black]]: 
                                                (colorBlack && data[geo.id] && data[geo.id][black] === 0)?
                                                  '#FFFFFF':'#FFFFFF')}
                                            
                                          />
                                        ))}
                                      </svg>
                                    }
                                  </Geographies>
                                  

                                </ComposableMap> */}
                                <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/black.png' />
                            </div>
                            <Grid>
                            <Grid.Row>
                              <Accordion style = {{paddingTop: 119, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                {
                                    key: 'acquire-dog',
                                    title: {
                                        content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the map</u>,
                                        icon: 'dropdown',
                                    },
                                    content: {
                                        content: (
                                            <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                              <Header.Content  style={{fontSize: "19px"}}>
                                                <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                This map shows each U.S. county according to its percentage of African American population. 
                                                County rankings are based on quintiles of percentage of African American population. The ranking classified counties 
                                                into five groups designed to be of equal size, so that the lowest quintile contains 
                                                the counties with values in the 0%-20% range for this county characteristic, and the highest 
                                                quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                <br/>
                                                <br/>
                                                <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target = "_blank" rel="noopener noreferrer"> American Community Survey</a> by the U.S. Census Bureau
                                                <br/>
                                                For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                </Header.Subheader>
                                              </Header.Content>
                                            </Header>
                                        ),
                                      },
                                  }
                              ]

                              } />

                            </Grid.Row>
                          </Grid> 
                          </Grid.Column>
                          <Grid.Column>
                            <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                              <Header.Content style = {{paddingLeft: 0, width: 500}}>
                              COVID-19 Cases by Percentage of <br/> African American Population
                              </Header.Content>
                            </Header>
                            <VictoryChart
                              theme={VictoryTheme.material}
                              width={530}
                              height={180}
                              domainPadding={20}
                              minDomain={{y: props.ylog?1:0}}
                              padding={{left: 120, right: 90, top: 5, bottom: 1}}
                              style = {{fontSize: "14pt"}}
                              containerComponent={<VictoryContainer responsive={false}/>}
                            >
                              <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                              <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                              <VictoryBar
                                horizontal
                                barRatio={0.80}
                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                data={[
                                      {key: nationalBarChart['caserate'][0]['black'][0]['label'], 'value': (nationalBarChart['caserate'][0]['black'][0]['measure']/nationalBarChart['caserate'][0]['black'][0]['measure'])*nationalBarChart['caserate'][0]['black'][0]['measure'] || 0},
                                      {key: nationalBarChart['caserate'][0]['black'][1]['label'], 'value': (nationalBarChart['caserate'][0]['black'][1]['measure']/nationalBarChart['caserate'][0]['black'][0]['measure'])*nationalBarChart['caserate'][0]['black'][0]['measure'] || 0},
                                      {key: nationalBarChart['caserate'][0]['black'][2]['label'], 'value': (nationalBarChart['caserate'][0]['black'][2]['measure']/nationalBarChart['caserate'][0]['black'][0]['measure'])*nationalBarChart['caserate'][0]['black'][0]['measure'] || 0},
                                      {key: nationalBarChart['caserate'][0]['black'][3]['label'], 'value': (nationalBarChart['caserate'][0]['black'][3]['measure']/nationalBarChart['caserate'][0]['black'][0]['measure'])*nationalBarChart['caserate'][0]['black'][0]['measure'] || 0},
                                      {key: nationalBarChart['caserate'][0]['black'][4]['label'], 'value': (nationalBarChart['caserate'][0]['black'][4]['measure']/nationalBarChart['caserate'][0]['black'][0]['measure'])*nationalBarChart['caserate'][0]['black'][0]['measure'] || 0}



                                ]}
                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                style={{
                                  data: {
                                    fill: casesColor[1]
                                  }
                                }}
                                x="key"
                                y="value"
                              />
                            </VictoryChart>

                            <Header.Content style = {{width: 550}}>
                              
                              <Header.Content style={{fontWeight: 300, paddingLeft: 140, paddingTop: 20, paddingBottom:0, fontSize: "14pt", lineHeight: "18pt"}}>
                                <b>COVID-19 Cases per 100K</b>
                              </Header.Content>
                            </Header.Content>
                              
                              <br/>
                              <br/>

                            <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                              <Header.Content style = {{paddingLeft: 0, width: 500}}>
                                COVID-19 Deaths by Percentage of <br/> African American Population
                              </Header.Content>
                            </Header>
                            <VictoryChart
                                theme={VictoryTheme.material}
                                width={530}
                                height={180}
                                domainPadding={20}
                                minDomain={{y: props.ylog?1:0}}
                                padding={{left: 120, right: 90, top: 5, bottom: 1}}
                                style = {{fontSize: "14pt"}}
                                containerComponent={<VictoryContainer responsive={false}/>}
                              >
                                <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                <VictoryBar
                                  horizontal
                                  barRatio={0.80}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                  data={[
                                        {key: nationalBarChart['covidmortality'][0]['black'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['black'][0]['measure']/nationalBarChart['covidmortality'][0]['black'][0]['measure'])*nationalBarChart['covidmortality'][0]['black'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['black'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['black'][1]['measure']/nationalBarChart['covidmortality'][0]['black'][0]['measure'])*nationalBarChart['covidmortality'][0]['black'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['black'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['black'][2]['measure']/nationalBarChart['covidmortality'][0]['black'][0]['measure'])*nationalBarChart['covidmortality'][0]['black'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['black'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['black'][3]['measure']/nationalBarChart['covidmortality'][0]['black'][0]['measure'])*nationalBarChart['covidmortality'][0]['black'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['black'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['black'][4]['measure']/nationalBarChart['covidmortality'][0]['black'][0]['measure'])*nationalBarChart['covidmortality'][0]['black'][0]['measure'] || 0}



                                  ]}
                                  labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                  style={{
                                    data: {
                                      fill: mortalityColor[1]
                                    }
                                  }}
                                  x="key"
                                  y="value"
                                />
                              </VictoryChart>

                            <Header.Content style = {{width: 550}}>
                                  <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:14, fontSize: "14pt", lineHeight: "18pt"}}>
                                    <b>COVID-19 Deaths per 100K</b>
                                  </Header.Content>
                              </Header.Content>
                            <Grid.Row>
                              <Accordion style = {{paddingTop: 0, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                    {
                                        key: 'acquire-dog',
                                        title: {
                                            content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the chart</u>,
                                            icon: 'dropdown',
                                        },
                                        content: {
                                            content: (
                                                <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                                  <Header.Content  style={{fontSize: "19px"}}>
                                                    <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                    This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                                    per 100K residents by percentage African American population ranking. The y-axis 
                                                    displays percentage African American population rankings based on quintiles (groups of 20%). 
                                                    The x-axis displays the average number of COVID-19 cases (top chart) or deaths (bottom chart) 
                                                    per 100K that occurred in each group of counties ranked by percentage percentage African 
                                                    American. The ranking classified counties into five groups designed to be of equal size, 
                                                    so that the "very low % African American" group contains the counties with values in the 0%-20% 
                                                    range for this county characteristic, and the "very high % African American" group contains 
                                                    counties with values in the 80%-100% range for this county characteristic. Low % 
                                                    African American indicates counties in the 20%-40% range, moderate % African American 
                                                    indicates counties in the 40%-60% range, and high % African American indicates counties 
                                                    in the 60%-80% range.
                                                    <br/>
                                                    <br/>
                                                    
                                                    For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                    
                                                    
                                                    </Header.Subheader>
                                                  </Header.Content>
                                                </Header>
                                            ),
                                          },
                                      }
                                  ]} 
                              />
                            </Grid.Row>
                            </Grid.Column>
                        </Grid.Row>
                      </Grid>}
                      <div id="resseg" style = {{height: 45}}> </div>

                      <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center> 
                      
                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                            <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>Residential Segregation Index</b> </center> 
                      </Header.Subheader>

                      {black && <Grid>
                        <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                          <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                            <div >
                              
                              <svg width="260" height="80">
                                
                                {_.map(legendSplitResSeg, (splitpoint, i) => {
                                  if(legendSplitResSeg[i] < 1){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitResSeg[i].toFixed(1)}</text>                    
                                  }else if(legendSplitResSeg[i] > 999999){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitResSeg[i]/1000000).toFixed(0) + "M"}</text>                    
                                  }else if(legendSplitResSeg[i] > 999){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitResSeg[i]/1000).toFixed(0) + "K"}</text>                    
                                  }
                                  return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitResSeg[i].toFixed(0)}</text>                    
                                })} 
                                <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinResSeg}</text>
                                <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxResSeg}</text>


                                {_.map(colorPalette, (color, i) => {
                                  return <rect key={i} x={50+20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                                })} 


                                <text x={50} y={74} style={{fontSize: '0.8em'}}>Low</text>
                                <text x={50+20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>


                                <rect x={195} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                                <text x={217} y={50} style={{fontSize: '0.7em'}}> None </text>
                                <text x={217} y={59} style={{fontSize: '0.7em'}}> Reported </text>
                              

                              </svg>

                              <br/><br/><br/>
                                {/* <ComposableMap 
                                  projection="geoAlbersUsa" 
                                  data-tip=""
                                  width={520} 
                                  height={300}
                                  strokeWidth= {0.1}
                                  stroke= 'black'
                                  projectionConfig={{scale: 580}}
                                  style = {{paddingLeft: 50}}
                                  >
                                  <Geographies geography={geoUrl}>
                                    {({ geographies }) => 
                                      <svg>
                                        {geographies.map(geo => (
                                          <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={
                                            ((colorResSeg && data[geo.id] && (data[geo.id][resSeg]) > 0)?
                                                colorResSeg[data[geo.id][resSeg]]: 
                                                (colorResSeg && data[geo.id] && data[geo.id][resSeg] === 0)?
                                                  '#FFFFFF':'#FFFFFF')}
                                            
                                          />
                                        ))}
                                      </svg>
                                    }
                                  </Geographies>
                                  

                                </ComposableMap> */}
                                <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/resSeg.png' />
                            </div>
                            <Grid>
                            <Grid.Row>
                              <Accordion style = {{paddingTop: 119, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                {
                                    key: 'acquire-dog',
                                    title: {
                                        content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the map</u>,
                                        icon: 'dropdown',
                                    },
                                    content: {
                                        content: (
                                            <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                              <Header.Content  style={{fontSize: "19px"}}>
                                                <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                This map shows each U.S. county according to its racial segregation ranking. 
                                                County rankings are based on quintiles of the racial segregation index. The ranking classified counties 
                                                into five groups designed to be of equal size, so that the lowest quintile contains 
                                                the counties with values in the 0%-20% range for this county characteristic, and the highest 
                                                quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                <br/>
                                                <br/>
                                                <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.countyhealthrankings.org/explore-health-rankings/measures-data-sources/county-health-rankings-model/health-factors/social-and-economic-factors/family-social-support/residential-segregation-blackwhite" target = "_blank" rel="noopener noreferrer"> Robert Wood Johnson Foundation program</a> 
                                                <br/>
                                                For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                </Header.Subheader>
                                              </Header.Content>
                                            </Header>
                                        ),
                                      },
                                  }
                              ]

                              } />

                            </Grid.Row>
                          </Grid>
                          </Grid.Column>
                          <Grid.Column>
                            <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                              <Header.Content style = {{paddingLeft: 0, width: 500}}>
                              COVID-19 Cases by <br/> Residential Segregation Index
                              </Header.Content>
                            </Header>
                              <VictoryChart
                                theme={VictoryTheme.material}
                                width={530}
                                height={180}
                                domainPadding={20}
                                minDomain={{y: props.ylog?1:0}}
                                padding={{left: 120, right: 90, top: 5, bottom: 1}}
                                style = {{fontSize: "14pt"}}
                                containerComponent={<VictoryContainer responsive={false}/>}
                              >
                                <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                <VictoryBar
                                  horizontal
                                  barRatio={0.80}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                  data={[
                                        {key: nationalBarChart['caserate'][0]['resSeg'][0]['label'], 'value': (nationalBarChart['caserate'][0]['resSeg'][0]['measure']/nationalBarChart['caserate'][0]['resSeg'][0]['measure'])*nationalBarChart['caserate'][0]['resSeg'][0]['measure'] || 0},
                                        {key: nationalBarChart['caserate'][0]['resSeg'][1]['label'], 'value': (nationalBarChart['caserate'][0]['resSeg'][1]['measure']/nationalBarChart['caserate'][0]['resSeg'][0]['measure'])*nationalBarChart['caserate'][0]['resSeg'][0]['measure'] || 0},
                                        {key: nationalBarChart['caserate'][0]['resSeg'][2]['label'], 'value': (nationalBarChart['caserate'][0]['resSeg'][2]['measure']/nationalBarChart['caserate'][0]['resSeg'][0]['measure'])*nationalBarChart['caserate'][0]['resSeg'][0]['measure'] || 0},
                                        {key: nationalBarChart['caserate'][0]['resSeg'][3]['label'], 'value': (nationalBarChart['caserate'][0]['resSeg'][3]['measure']/nationalBarChart['caserate'][0]['resSeg'][0]['measure'])*nationalBarChart['caserate'][0]['resSeg'][0]['measure'] || 0},
                                        {key: nationalBarChart['caserate'][0]['resSeg'][4]['label'], 'value': (nationalBarChart['caserate'][0]['resSeg'][4]['measure']/nationalBarChart['caserate'][0]['resSeg'][0]['measure'])*nationalBarChart['caserate'][0]['resSeg'][0]['measure'] || 0}



                                  ]}
                                  labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                  style={{
                                    data: {
                                      fill: casesColor[1]
                                    }
                                  }}
                                  x="key"
                                  y="value"
                                />
                              </VictoryChart>

                              <Header.Content style = {{width: 550}}>
                                
                                <Header.Content style={{fontWeight: 300, paddingLeft: 140, paddingTop: 20, paddingBottom:0, fontSize: "14pt", lineHeight: "18pt"}}>
                                  <b>COVID-19 Cases per 100K</b>
                                </Header.Content>
                              </Header.Content>
                                
                                <br/>
                                <br/>

                              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                                  <Header.Content style = {{paddingLeft: 0, width: 500}}>
                                  COVID-19 Deaths by  <br/> Residential Segregation Index
                              </Header.Content>
                            </Header>
                              <VictoryChart
                                theme={VictoryTheme.material}
                                width={530}
                                height={180}
                                domainPadding={20}
                                minDomain={{y: props.ylog?1:0}}
                                padding={{left: 120, right: 90, top: 5, bottom: 1}}
                                style = {{fontSize: "14pt"}}
                                containerComponent={<VictoryContainer responsive={false}/>}
                              >
                                <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                <VictoryBar
                                  horizontal
                                  barRatio={0.80}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                  data={[
                                        {key: nationalBarChart['covidmortality'][0]['resSeg'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['resSeg'][0]['measure']/nationalBarChart['covidmortality'][0]['resSeg'][0]['measure'])*nationalBarChart['covidmortality'][0]['resSeg'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['resSeg'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['resSeg'][1]['measure']/nationalBarChart['covidmortality'][0]['resSeg'][0]['measure'])*nationalBarChart['covidmortality'][0]['resSeg'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['resSeg'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['resSeg'][2]['measure']/nationalBarChart['covidmortality'][0]['resSeg'][0]['measure'])*nationalBarChart['covidmortality'][0]['resSeg'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['resSeg'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['resSeg'][3]['measure']/nationalBarChart['covidmortality'][0]['resSeg'][0]['measure'])*nationalBarChart['covidmortality'][0]['resSeg'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['resSeg'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['resSeg'][4]['measure']/nationalBarChart['covidmortality'][0]['resSeg'][0]['measure'])*nationalBarChart['covidmortality'][0]['resSeg'][0]['measure'] || 0}



                                  ]}
                                  labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                  style={{
                                    data: {
                                      fill: mortalityColor[1]
                                    }
                                  }}
                                  x="key"
                                  y="value"
                                />
                              </VictoryChart>

                              <Header.Content style = {{width: 550}}>
                                <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:14, fontSize: "14pt", lineHeight: "18pt"}}>
                                  <b>COVID-19 Deaths per 100K</b>
                                </Header.Content>
                              </Header.Content>
                              <Grid.Row>
                                  <Accordion style = {{paddingTop: 0, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                        {
                                            key: 'acquire-dog',
                                            title: {
                                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the chart</u>,
                                                icon: 'dropdown',
                                            },
                                            content: {
                                                content: (
                                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                                      <Header.Content  style={{fontSize: "19px"}}>
                                                        <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 
                                                        100K residents by residential segregation index. The y-axis displays residential 
                                                        segregation rankings based on quintiles (groups of 20%). The x-axis displays the 
                                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100K 
                                                        that occurred in each group of counties ranked by residential segregation. The ranking 
                                                        classified counties into five groups designed to be of equal size, so that the "very 
                                                        low segregation" group contains the counties with values in the 0%-20% range for this county 
                                                        characteristic, and the "very high segregation" group contains counties with values in the 
                                                        80%-100% range for this county characteristic. Low segregation indicates counties in 
                                                        the 20%-40% range, moderate segregation indicates counties in the 40%-60% range, and 
                                                        high segregation indicates counties in the 60%-80% range.
                                                        <br/>
                                                        <br/>
                                                        For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                        
                                                        
                                                        </Header.Subheader>
                                                      </Header.Content>
                                                    </Header>
                                                ),
                                              },
                                          }
                                      ]} 
                                  />
                                </Grid.Row>
                          </Grid.Column>
                        </Grid.Row> 
                      </Grid>}

                      <div id="comorb" style = {{height: 45}}> </div>

                      <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center> 

                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                            <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>Any Underlying Comorbidity</b> </center> 
                      </Header.Subheader>

                      {Comorb && <Grid>
                        <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                          <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                            <div >
                              
                              <svg width="260" height="80">
                                
                                {_.map(legendSplitResSeg, (splitpoint, i) => {
                                  if(legendSplitComorb[i] < 1){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitComorb[i].toFixed(1)}</text>                    
                                  }else if(legendSplitComorb[i] > 999999){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitComorb[i]/1000000).toFixed(0) + "M"}</text>                    
                                  }else if(legendSplitComorb[i] > 999){
                                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitComorb[i]/1000).toFixed(0) + "K"}</text>                    
                                  }
                                  return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitComorb[i].toFixed(0)}</text>                    
                                })} 
                                <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinComorb}</text>
                                <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxComorb}</text>


                                {_.map(colorPalette, (color, i) => {
                                  return <rect key={i} x={50+20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                                })} 


                                <text x={50} y={74} style={{fontSize: '0.8em'}}>Low</text>
                                <text x={50+20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>


                                <rect x={195} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                                <text x={217} y={50} style={{fontSize: '0.7em'}}> None </text>
                                <text x={217} y={59} style={{fontSize: '0.7em'}}> Reported </text>
                              

                              </svg>

                              <br/><br/><br/>
                                {/* <ComposableMap 
                                  projection="geoAlbersUsa" 
                                  data-tip=""
                                  width={520} 
                                  height={300}
                                  strokeWidth= {0.1}
                                  stroke= 'black'
                                  projectionConfig={{scale: 580}}
                                  style = {{paddingLeft: 50}}
                                  >
                                  <Geographies geography={geoUrl}>
                                    {({ geographies }) => 
                                      <svg>
                                        {geographies.map(geo => (
                                          <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={
                                            ((colorComorb && data[geo.id] && (data[geo.id][Comorb]) > 0)?
                                                colorComorb[data[geo.id][Comorb]]: 
                                                (colorComorb && data[geo.id] && data[geo.id][Comorb] === 0)?
                                                  '#FFFFFF':'#FFFFFF')}
                                            
                                          />
                                        ))}
                                      </svg>
                                    }
                                  </Geographies>
                                  

                                </ComposableMap> */}
                                <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/anycondition.png' />
                            </div>
                            <Grid>
                            <Grid.Row>
                              <Accordion style = {{paddingTop: 119, paddingLeft: 70}} defaultActiveIndex={1} panels={[
                                {
                                    key: 'acquire-dog',
                                    title: {
                                        content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the map</u>,
                                        icon: 'dropdown',
                                    },
                                    content: {
                                        content: (
                                            <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                              <Header.Content  style={{fontSize: "19px"}}>
                                                <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                
                                                This map shows each U.S. county according to percentage of population with underlying conditions. 
                                                County rankings are based on quintiles of percentage of population with underlying conditions. The ranking classified counties 
                                                into five groups designed to be of equal size, so that the lowest quintile contains 
                                                the counties with values in the 0%-20% range for this county characteristic, and the highest 
                                                quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                <br/>
                                                <br/>
                                                <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://stacks.cdc.gov/" target = "_blank" rel="noopener noreferrer"> CDC Stacks Public Health Publicatiions</a> 
                                                <br/>
                                                For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                                </Header.Subheader>
                                              </Header.Content>
                                            </Header>
                                        ),
                                      },
                                  }
                              ]

                              } />

                            </Grid.Row>
                          </Grid>
                          </Grid.Column>
                          <Grid.Column>
                            <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                              <Header.Content style = {{paddingLeft: 0, width: 500}}>
                              COVID-19 Cases by <br/> Any Underlying Comorbidity
                              </Header.Content>
                            </Header>
                              <VictoryChart
                                theme={VictoryTheme.material}
                                width={530}
                                height={180}
                                domainPadding={20}
                                minDomain={{y: props.ylog?1:0}}
                                padding={{left: 120, right: 90, top: 5, bottom: 1}}
                                style = {{fontSize: "14pt"}}
                                containerComponent={<VictoryContainer responsive={false}/>}
                              >
                                <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                <VictoryBar
                                  horizontal
                                  barRatio={0.80}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                  data={[
                                        {key: nationalBarChart['caserate'][0]['anycondition'][0]['label'], 'value': (nationalBarChart['caserate'][0]['anycondition'][0]['measure']/nationalBarChart['caserate'][0]['anycondition'][0]['measure'])*nationalBarChart['caserate'][0]['anycondition'][0]['measure'] || 0},
                                        {key: nationalBarChart['caserate'][0]['anycondition'][1]['label'], 'value': (nationalBarChart['caserate'][0]['anycondition'][1]['measure']/nationalBarChart['caserate'][0]['anycondition'][0]['measure'])*nationalBarChart['caserate'][0]['anycondition'][0]['measure'] || 0},
                                        {key: nationalBarChart['caserate'][0]['anycondition'][2]['label'], 'value': (nationalBarChart['caserate'][0]['anycondition'][2]['measure']/nationalBarChart['caserate'][0]['anycondition'][0]['measure'])*nationalBarChart['caserate'][0]['anycondition'][0]['measure'] || 0},
                                        {key: nationalBarChart['caserate'][0]['anycondition'][3]['label'], 'value': (nationalBarChart['caserate'][0]['anycondition'][3]['measure']/nationalBarChart['caserate'][0]['anycondition'][0]['measure'])*nationalBarChart['caserate'][0]['anycondition'][0]['measure'] || 0},
                                        {key: nationalBarChart['caserate'][0]['anycondition'][4]['label'], 'value': (nationalBarChart['caserate'][0]['anycondition'][4]['measure']/nationalBarChart['caserate'][0]['anycondition'][0]['measure'])*nationalBarChart['caserate'][0]['anycondition'][0]['measure'] || 0}



                                  ]}
                                  labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                  style={{
                                    data: {
                                      fill: casesColor[1]
                                    }
                                  }}
                                  x="key"
                                  y="value"
                                />
                              </VictoryChart>

                              <Header.Content style = {{width: 550}}>
                                
                                <Header.Content style={{fontWeight: 300, paddingLeft: 140, paddingTop: 20, paddingBottom:0, fontSize: "14pt", lineHeight: "18pt"}}>
                                  <b>COVID-19 Cases per 100K</b>
                                </Header.Content>
                              </Header.Content>
                                
                                <br/>
                                <br/>

                              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                                  <Header.Content style = {{paddingLeft: 0, width: 500}}>
                                    COVID-19 Deaths by <br/> Any Underlying Comorbidity
                                </Header.Content>
                              </Header>
                              <VictoryChart
                                theme={VictoryTheme.material}
                                width={530}
                                height={180}
                                domainPadding={20}
                                minDomain={{y: props.ylog?1:0}}
                                padding={{left: 120, right: 90, top: 5, bottom: 1}}
                                style = {{fontSize: "14pt"}}
                                containerComponent={<VictoryContainer responsive={false}/>}
                              >
                                <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                <VictoryBar
                                  horizontal
                                  barRatio={0.80}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                  data={[
                                        {key: nationalBarChart['covidmortality'][0]['anycondition'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['anycondition'][0]['measure']/nationalBarChart['covidmortality'][0]['anycondition'][0]['measure'])*nationalBarChart['covidmortality'][0]['anycondition'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['anycondition'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['anycondition'][1]['measure']/nationalBarChart['covidmortality'][0]['anycondition'][0]['measure'])*nationalBarChart['covidmortality'][0]['anycondition'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['anycondition'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['anycondition'][2]['measure']/nationalBarChart['covidmortality'][0]['anycondition'][0]['measure'])*nationalBarChart['covidmortality'][0]['anycondition'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['anycondition'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['anycondition'][3]['measure']/nationalBarChart['covidmortality'][0]['anycondition'][0]['measure'])*nationalBarChart['covidmortality'][0]['anycondition'][0]['measure'] || 0},
                                        {key: nationalBarChart['covidmortality'][0]['anycondition'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['anycondition'][4]['measure']/nationalBarChart['covidmortality'][0]['anycondition'][0]['measure'])*nationalBarChart['covidmortality'][0]['anycondition'][0]['measure'] || 0}



                                  ]}
                                  labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                                  style={{
                                    data: {
                                      fill: mortalityColor[1]
                                    }
                                  }}
                                  x="key"
                                  y="value"
                                />
                              </VictoryChart>

                              <Header.Content style = {{width: 550}}>
                                  <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:14, fontSize: "14pt", lineHeight: "18pt"}}>
                                    <b>COVID-19 Deaths per 100K</b>
                                  </Header.Content>
                              </Header.Content>

                              <Grid.Row>
                                <Accordion style = {{paddingTop: 0, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                                      {
                                          key: 'acquire-dog',
                                          title: {
                                              content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the chart</u>,
                                              icon: 'dropdown',
                                          },
                                          content: {
                                              content: (
                                                  <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                                    <Header.Content  style={{fontSize: "19px"}}>
                                                      <Header.Subheader style={{color: '#000000', width: 420, fontWeight: 300, fontSize: "19px", textAlign:'justify'}}>
                                                      This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 
                                                      100K residents by percent of population with any underlying comorbidity. The y-axis 
                                                      displays percent of population with any underlying comorbidity rankings based on quintiles (groups of 20%). The x-axis displays the 
                                                      average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100K 
                                                      that occurred in each group of counties ranked by percent of population with any underlying comorbidity. The ranking 
                                                      classified counties into five groups designed to be of equal size, so that the population with "very 
                                                      low percentage of any underlying comorbidity" group contains the counties with values in the 0%-20% range for this county 
                                                      characteristic, and the population with "very high percentage of any underlying comorbidity" group contains counties with values in the 
                                                      80%-100% range for this county characteristic. Low percentage of population with any underlying comorbidity indicates counties in 
                                                      the 20%-40% range, moderate percentage of population with any underlying comorbidity indicates counties in the 40%-60% range, and 
                                                      high percentage of population with any underlying comorbidity indicates counties in the 60%-80% range.

                                                      <br/>
                                                      <br/>
                                                      For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                              
                                                      
                                                      </Header.Subheader>
                                                    </Header.Content>
                                                  </Header>
                                              ),
                                            },
                                        }
                                    ]} 
                                />
                              </Grid.Row>
                            </Grid.Column>
                        </Grid.Row> 
                      </Grid>}

                    </div>}

          </Grid.Column> 
        </Grid>
        
        </Container> 
        <Container style={{marginTop: '8em', minWidth: '1260px'}}>

          <Notes />
        </Container> 
        
      </div>
    </HEProvider>



    );
  } else{
    return <Loader active inline='centered' />
  }


}


