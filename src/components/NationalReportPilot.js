import React, { useEffect, useState, Component, createRef, useRef, useContext, useMemo, PureComponent} from 'react'
import { Container, Header, Grid, Loader, Divider, Button, Progress, Dropdown, Image, Rail, Sticky, Ref, Accordion, Menu, Message, Transition, List} from 'semantic-ui-react'
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
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,  PieChart, Pie, Sector, Label, Legend, ResponsiveContainer} from "recharts";
import {ArrowSvg} from 'react-simple-arrows';
import { CSSTransition } from 'react-transition-group';

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
 '50% of Cases Comes From These States', 'Cases & Deaths by race, age, and sex', 'COVID-19 Across U.S. Communities',
 'COVID-19 by Community Vulnerability Index', 'COVID-19 by Percent in Poverty', 'COVID-19 by Metropolitan Status', 
 'COVID-19 by Region', 'COVID-19 by Percent African American', 'COVID-19 by Residential Segregation Index',
 "COVID-19 by Underlying Comorbidity", "COVID-19 by Percent COPD", 'COVID-19 by Percent CKD',
 'COVID-19 by Percent Diabetes', 'COVID-19 by Percent Heart Disease', "Obesity", "COVID-19 Vaccination Tracker"];
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
                <div style={{width:312, overflow: "hidden"}}>
                  <div style= {{height:600, width: 320, overflowY: "scroll", overflowX:"hidden"}}> 
                    <div style={{height: "130%", width: 330}}>
                      <Menu
                          size='small'
                          compact
                          pointing secondary vertical>
                          <Menu.Item as='a' href="#" name={nameList[0]} active={props.activeCharacter == nameList[0] || activeItem === nameList[0]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[0]}</Header></Menu.Item>
                                
                          <Menu.Item as='a' href="#tracker" name={nameList[16]} active={props.activeCharacter == nameList[16] || activeItem === nameList[16]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'> COVID-19 Vaccination Tracker </Header></Menu.Item>

                          <Menu.Item as='a' href="#cases" name={nameList[1]} active={props.activeCharacter == nameList[1] || activeItem === nameList[1]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[1]}</Header></Menu.Item>

                          <Menu.Item as='a' href="#half" name={nameList[2]} active={props.activeCharacter == nameList[2] || activeItem === nameList[2]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[2]}</Header></Menu.Item>
                          
                          <Menu.Item as='a' href="#who" name={nameList[3]} active={props.activeCharacter == nameList[3] || activeItem === nameList[3]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[3]}</Header></Menu.Item>

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
                          
                          <Menu.Item as='a' href="#copd" name={nameList[12]} active={props.activeCharacter == nameList[12] || activeItem === nameList[12]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent with COPD</Header></Menu.Item>

                          <Menu.Item as='a' href="#ckd" name={nameList[13]} active={props.activeCharacter == nameList[13] || activeItem === nameList[13]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent with CKD</Header></Menu.Item>

                          <Menu.Item as='a' href="#diabetes" name={nameList[14]} active={props.activeCharacter == nameList[14] || activeItem === nameList[14]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent with Diabetes</Header></Menu.Item>

                          <Menu.Item as='a' href="#heart" name={nameList[15]} active={props.activeCharacter == nameList[15] || activeItem === nameList[15]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent with Heart Disease</Header></Menu.Item>

                          <Menu.Item as='a' href="#obesity" name={nameList[16]} active={props.activeCharacter == nameList[16] || activeItem === nameList[16]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent with Obesity</Header></Menu.Item>
                          
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
const pieChartRace = ['#007dba', '#a45791', '#e8ab3b', '#000000', '#b1b3b3'];


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
const fullMonthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


//const nationColor = '#487f84';


function ChartSection(props){
  //const [activeItem, setActiveItem] = useState('All');
  const [chartNo, setChartNo] = useState(-1);
  const data = props.data;
  const dailyCases = props.dailyCases;
  const dailyDeaths = props.dailyDeaths;
  const monthNames = props.monthNames;
  const mean7dayCases = props.mean7dayCases;
  const mortalityMean = props.mortalityMean;
  const percentChangeCases = props.percentChangeCases;
  const percentChangeMortality = props.percentChangeMortality;
  //const chart = props.chart;
  const [barName, setBarName] = useState('dailyCases');
  const [lineName, setLineName] = useState('caseRateMean');
  const [caseTicks, setCaseTicks] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [headerTime, setHeaderTime] = useState('');

useEffect(()=>{
  if(chartNo < 3){
    setBarName('dailyCases');
    setLineName('caseRateMean');
  } else {
    setBarName('dailyMortality');
    setLineName('mortalityMean');
  }

  if(chartNo===-1){
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
    data[data.length-1].t]);
  }else if(chartNo===0 || chartNo===3) {
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
    data[data.length-1].t]);
    setHeaderTime('');
    if(chartNo===0){
      setDisabled(true);
      setTimeout(()=>setChartNo(chartNo+1), 12000); //10000
    } else {
      setTimeout(()=>setChartNo(chartNo+1), 10000);   //8000
    }
  } else if(chartNo===1 || chartNo===4){
    setCaseTicks([data[214].t,
    data[244].t,
    data[275].t,
    data[306].t,
    data[data.length-1].t]);
    setHeaderTime('in Past 90 Days');
    setTimeout(()=>setChartNo(chartNo+1), 7000);   //5000
  } else if(chartNo===2 || chartNo===5){
    setCaseTicks([
      data[data.length-14].t,
      data[data.length-7].t,
      data[data.length-1].t]);
    setHeaderTime('in Past 14 Days');
    setTimeout(()=>setChartNo(chartNo+1), 7000);
    if(chartNo===5){
      setTimeout(()=>setDisabled(false), 7000);
    }
  }
}, [chartNo]);

  // console.log('chartNo', chartNo);

  return(
  <Grid.Row style={{paddingLeft: 20, paddingBottom: '0rem'}}>  
  <Header as='h2' style={{paddingTop: 30, paddingLeft: 60, color: mortalityColor[1], textAlign:'center',fontSize:"22pt"}}>
    <Header.Content>
      How have {chartNo<3 ? 'cases' : 'deaths'} in the U.S. changed over time?
    </Header.Content>
  </Header>
  <Grid.Row column = {1} style={{textAlign:'center', width: 800, paddingTop: '2rem', paddingLeft: '10rem'}}>
    <Header.Content x={0} y={20} style={{ fontSize: '18pt', marginLeft: 0, paddingBottom: '1rem', fontWeight: 600}}>Average Daily COVID-19 {chartNo<3 ? 'Cases' : 'Deaths'} {headerTime}</Header.Content>
  </ Grid.Row>
  {/* <Grid.Row style={{paddingTop: '1rem', paddingLeft: '23rem'}}>
    <Menu pointing secondary widths={3} style={{width: '16rem'}}> 
    <Menu.Item name='All' active={activeItem==='All'} onClick={()=>setActiveItem('All')}/>
    <Menu.Item name='90 Days' active={activeItem==='90 Days'} onClick={()=>setActiveItem('90 Days')}/>
    <Menu.Item name='14 Days' active={activeItem==='14 Days'} onClick={()=>setActiveItem('14 Days')}/>
    </ Menu>
    </Grid.Row> */}

    {(()=>{
    if (chartNo===-1){
      return (<Grid.Column>
              <CaseChartStatic data={data} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter} />
              </Grid.Column>)
    }else if (chartNo===0){
      return (<Grid.Column>
              <CaseChartAll data={data} barColor={props.barColor} lineColor={props.lineColor}
              tick={caseTicks} tickFormatter={props.tickFormatter} />
              </Grid.Column>)
    } else if(chartNo===3){
      return <DeathChartAll data={data} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter} />
    } else if(chartNo===1 || chartNo===4){
      return <CaseChart90 data={data} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter}
              barName={barName} lineName={lineName}/>
    } else {
      return <CaseChart14 data={data} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter}
              barName={barName} lineName={lineName}/>
    }
  })()}
    
    <Button style={{marginLeft: 780}} content='Play' icon='play' disabled={disabled} onClick={() => {setChartNo(0);}}/>
   
    {(()=>{
      if (chartNo<3){
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
                  <Header as='h2' style={{fontWeight: 400, paddingTop: 0, paddingBottom: 20}}>
                  <Header.Content  style={{fontSize: "14pt"}}>
                    <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt", paddingLeft: '2rem', paddingRight:65}}>
                          This figure shows the trend of daily COVID-19 deaths in the U.S.. The bar height reflects the number of new deaths 
                          per day and the line depicts the 7-day moving average of daily deaths in the U.S.. There were {dailyDeaths} new deaths 
                          associated with COVID-19 reported on {monthNames[new Date(data[data.length - 1].t*1000).getMonth()] + " " + new Date(data[data.length - 1].t*1000).getDate() + ", " + new Date(data[data.length - 1].t*1000).getFullYear()}, with 
                          an average of {mortalityMean} new deaths per day reported over the past 7 days. 
                          We see {percentChangeMortality.includes("-")? "a decrease of approximately " + percentChangeMortality.substring(1): "an increase of approximately " + percentChangeMortality} in the average new deaths over the past 14-day period. 
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
  // const [playCount, setPlayCount] = useState(0);
  // const [visible1, setVisible1] = useState(false);
  // const [visible2, setVisible2] = useState(false);
  // const [visible3, setVisible3] = useState(false);
  // const [visible4, setVisible4] = useState(false);
  // const [visible5, setVisible5] = useState(false);
  // const [disabled, setDisabled] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState([-1, 9, 71, 109, 260]);
  const data = props.data;
  const barColor = props.barColor;
  const lineColor = props.lineColor;
  const ticks = props.tick;
  const tickFormatter = props.tickFormatter;

  // const ytickFormatter = props.ytickFormatter;
  // const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };

  
  return(
    <Grid.Column style={{paddingTop:'1rem', paddingLeft: 35, width: 850, height: 450, position:'relative'}}>

      <ComposedChart width={850} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" ticks={ticks} domain={[1585713600, 1610859600]} tick={{fontSize: 16}} tickFormatter={tickFormatter}/>
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
      </ Bar>
      <Line name="7-day average" id='all-line' type='monotone' dataKey='caseRateMean' dot={false} 
            isAnimationActive={false} 
            stroke={lineColor}
            strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      </ComposedChart>
      {/* <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/> */}
      <Transition visible={true} animation='scale' duration={200}>
      <Message compact id='Jan' style={{ width: '18rem', top:'-28rem', left:'8rem', padding: '1rem', fontSize: '0.8rem'}}> Jan. 21: <br /> 1st case in the U.S. confirmed in Washington</Message>
      </Transition>
      <Transition visible={true} animation='scale' duration={200}>
      <Message compact id='message2' style={{ width: '10rem', top:'-26rem', left:'7.5rem', padding: '1rem', fontSize: '0.8rem'}}> Apr. 10: <br /> First wave peaked at 31,709 new cases <br />(7-day avg.) </Message>
      {/* <Arrow1/> */}
      </Transition> 
      {/* <ArrowSvg start={{ x: 200, y: 340 }} end={{ x: 200, y: 430 }}/> */}
      <Transition visible={true} animation='scale' duration={200}>
      <Message compact style={{ width: '8rem', top:'-26rem', left:'11.5rem', padding: '1rem', fontSize: '0.8rem'}}> June. 11: <br /> 2M confirmed cases in the U.S. </Message>
      </Transition> 
      <Transition visible={true} animation='scale' duration={200}>
      <Message compact style={{ width: '10rem', top:'-37rem', left:'21rem', padding: '1rem', fontSize: '0.8rem'}}> July. 19: <br /> Second wave peaked at 66,692 new cases <br />(7-day avg.) </Message>
      </Transition> 
      <Transition visible={true} animation='scale' duration={200}>
      <Message compact style={{ width: '10rem', top:'-53rem', left:'30rem', padding: '1rem', fontSize: '0.8rem'}}> Dec. 17: <br /> Third wave peaked at 222,822 new cases <br />(7-day avg.) </Message>
      </Transition> 
      <ArrowSvg start={{ x: 185, y: 246 }} end={{ x: 150, y: 336 }} strokeWidth='0.8'/>
      <ArrowSvg start={{ x: 260, y: 330 }} end={{ x: 268, y: 350 }} strokeWidth='0.8'/>
      <ArrowSvg start={{ x: 360, y: 280 }} end={{ x: 350, y: 302 }} strokeWidth='0.8'/>
      <ArrowSvg start={{ x: 605, y: 110 }} end={{ x: 630, y: 125 }} strokeWidth='0.8'/>
      </Grid.Column>
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

  // const ytickFormatter = props.ytickFormatter;
  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };


  useEffect(() =>{
    setHighlightIndex([-1]);
    
  },[props.history])

  var wait=0;

  // console.log("data[0].t", data[0].t);
  // console.log("data[data.length-1].t", data[data.length-1].t);
  
  return(
    <Grid.Column style={{paddingTop:'1rem', paddingLeft: 35, width: 850, height: 450, position:'relative'}}>

      <ComposedChart width={850} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" ticks={ticks} domain={[1585713600, 1610859600]} tick={{fontSize: 16}} tickFormatter={tickFormatter}/>
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
              setTimeout(()=>setVisible3(true), wait+2000);
              setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 71]), wait+2000);  
              setTimeout(()=>setVisible4(true), wait+3000); 
              setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 109]), wait+3000);  
              setTimeout(()=>setVisible5(true), wait+4000);
              setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 260]), wait+4000);  
              setTimeout(()=>setDisabled(false),wait+5000);
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
      </ Bar>
      <Line name="7-day average" id='all-line' type='monotone' dataKey='caseRateMean' dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={3500} 
            stroke={lineColor}
            strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      </ComposedChart>
      {/* <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/> */}
      <Transition visible={visible1} animation='scale' duration={200}>
      <Message compact id='Jan' style={{ width: '18rem', top:'-28rem', left:'8rem', padding: '1rem', fontSize: '0.8rem'}}> Jan. 21: <br /> 1st case in the U.S. confirmed in Washington</Message>
      </Transition>
      <Transition visible={visible2} animation='scale' duration={200}>
      <Message compact id='message2' style={{ width: '10rem', top:'-26rem', left:'7.5rem', padding: '1rem', fontSize: '0.8rem'}}> Apr. 10: <br /> First wave peaked at 31,709 new cases <br />(7-day avg.) </Message>
      {/* <Arrow1/> */}
      </Transition> 
      {/* <ArrowSvg start={{ x: 200, y: 340 }} end={{ x: 200, y: 430 }}/> */}
      <Transition visible={visible3} animation='scale' duration={200}>
      <Message compact style={{ width: '8rem', top:'-26rem', left:'11.5rem', padding: '1rem', fontSize: '0.8rem'}}> June. 11: <br /> 2M confirmed cases in the U.S. </Message>
      </Transition> 
      <Transition visible={visible4} animation='scale' duration={200}>
      <Message compact style={{ width: '10rem', top:'-37rem', left:'21rem', padding: '1rem', fontSize: '0.8rem'}}> July. 19: <br /> Second wave peaked at 66,692 new cases <br />(7-day avg.) </Message>
      </Transition> 
      <Transition visible={visible5} animation='scale' duration={200}>
      <Message compact style={{ width: '10rem', top:'-53rem', left:'30rem', padding: '1rem', fontSize: '0.8rem'}}> Dec. 17: <br /> Third wave peaked at 222,822 new cases <br />(7-day avg.) </Message>
      </Transition> 
      
      {visible2 ? <ArrowSvg start={{ x: 185, y: 246 }} end={{ x: 150, y: 336 }} strokeWidth='0.8'/> : null}
      {visible3 ? <ArrowSvg start={{ x: 260, y: 330 }} end={{ x: 268, y: 350 }} strokeWidth='0.8'/> : null}
      {visible4 ? <ArrowSvg start={{ x: 360, y: 280 }} end={{ x: 350, y: 302 }} strokeWidth='0.8'/> : null}
      {visible5 ? <ArrowSvg start={{ x: 605, y: 110 }} end={{ x: 630, y: 125 }} strokeWidth='0.8'/> : null}
      </Grid.Column>
  );
}

// function CaseChartAll1(props){
//   const [playCount, setPlayCount] = useState(0);
//   const [visible1, setVisible1] = useState(false);
//   const [visible2, setVisible2] = useState(false);
//   const [visible3, setVisible3] = useState(false);
//   const [visible4, setVisible4] = useState(false);
//   const [visible5, setVisible5] = useState(false);
//   const [disabled, setDisabled] = useState(true);
//   const [highlightIndex, setHighlightIndex] = useState([-1]);
//   const data = props.data;
//   const barColor = props.barColor;
//   const lineColor = props.lineColor;
//   const ticks = props.tick;
//   const tickFormatter = props.tickFormatter;

//   // const ytickFormatter = props.ytickFormatter;
//   const [animationBool, setAnimationBool] = useState(true);

//   const caseYTickFmt = (y) => {
//     return y<1000?y:(y/1000+'k');
//   };

//   useEffect(() =>{
//     setAnimationBool(playCount>-1);
//   },[playCount])

//   useEffect(() =>{
//     setHighlightIndex([-1]);
    
//   },[props.history])

//   var wait=0;

//   console.log("data[0].t", data[0].t);
//   console.log("data[data.length-1].t", data[data.length-1].t);
  
//   return(
//     <Grid.Column style={{paddingTop:'1rem', paddingLeft: '1rem', width: 850, height: 500, position:'relative'}}>
//         {/* <CSSTransition
//                   in={true}
//                   timeout={400}
//                   classNames="list-transition"
//                   unmountOnExit
//                   appear
//                   // onEntered={this.listSwitch}
//                   // onExit={this.listSwitch}
//                 > */}
//       <ComposedChart width={830} height={420} data={data}
//         margin={{top: 30, right: 60, bottom: 20, left: 30}}>
//       <CartesianGrid stroke='#f5f5f5'/>
//       <XAxis dataKey="t" ticks={ticks} domain={[1585713600, 1610859600]} tick={{fontSize: 16}} tickFormatter={tickFormatter}/>
//       <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
//       <Bar name="New cases" dataKey='dailyCases' barSize={10}
//             isAnimationActive={false} //animationBool
//             animationEasing='ease'
//             // onAnimationStart={() => {setDisabled(true); setVisible1(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
//             //                         setHighlightIndex([-1]);
//             // }} 
//             // onAnimationEnd={()=> {
//             //   setAnimationBool(false);
//             //   setTimeout(()=>setVisible1(true), wait); 
//             //   setTimeout(()=>setVisible2(true), wait+1000); 
//             //   setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 9]), wait+1000);
//             //   setTimeout(()=>setVisible3(true), wait+2000);
//             //   setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 71]), wait+2000);  
//             //   setTimeout(()=>setVisible4(true), wait+3000); 
//             //   setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 109]), wait+3000);  
//             //   setTimeout(()=>setVisible5(true), wait+4000);
//             //   setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 260]), wait+4000);  
//             //   setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 1000]), wait+5000);  
//             //   setTimeout(()=>setDisabled(false),wait+5000);
//             //   // setTimeout(()=>setHighlightIndex(-1), wait+5000);
//             // }}
//             animationDuration={3500} 
//             barSize={2} fill='grey' > 
//              {/* barColor */}
//             {
//               data.map((entry, index) => (
//                 <Cell id={index} key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : (index>highlightIndex[highlightIndex.length-1] ? "grey" : barColor)}/>
//               ))
              
//               // fill={index === highlightIndex ? "red" : barColor}
//             }
//       </ Bar>
//       <Line name="7-day average" id='all-line' type='monotone' dataKey='caseRateMean' dot={false} 
//             isAnimationActive={animationBool} animationDuration={5500} 
//             onAnimationStart={() => {setDisabled(true); setVisible1(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
//               setHighlightIndex([-1]);
//             // }} 
            
//             // onAnimationEnd={()=> {
              
//               setTimeout(()=>setVisible1(true), wait); 
//               setTimeout(()=>setVisible2(true), wait+1000); 
//               setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 9]), wait+1000);
//               setTimeout(()=>setVisible3(true), wait+2000);
//               setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 71]), wait+2000);  
//               setTimeout(()=>setVisible4(true), wait+3000); 
//               setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 109]), wait+3000);  
//               setTimeout(()=>setVisible5(true), wait+4000);
//               setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 260]), wait+4000);  
//               setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 1000]), wait+5000);  
//               }} 
            
//             onAnimationEnd={()=> {
//               setAnimationBool(false);
//               setTimeout(()=>setDisabled(false),wait+500);
//               // setTimeout(()=>setHighlightIndex(-1), wait+5000);
//             }}
//             stroke={lineColor}
//             strokeWidth="2" />
//       <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
//       </ComposedChart>
//       {/* </CSSTransition> */}
//       <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/>
//       <Transition visible={visible1} animation='scale' duration={200}>
//       <Message compact id='Jan' style={{ width: '18rem', top:'-28rem', left:'8rem', padding: '1rem', fontSize: '0.8rem'}}> Jan. 21: <br /> 1st case in the U.S. confirmed in Washington</Message>
//       </Transition>
//       <Transition visible={visible2} animation='scale' duration={200}>
//       <Message compact id='message2' style={{ width: '10rem', top:'-26rem', left:'8rem', padding: '1rem', fontSize: '0.8rem'}}> Apr. 10: <br /> First wave peaked at 31,709 new cases <br />(7-day avg.) </Message>
//       {/* <Arrow1/> */}
//       </Transition> 
//       {/* <ArrowSvg start={{ x: 200, y: 340 }} end={{ x: 200, y: 430 }}/> */}
//       <Transition visible={visible3} animation='scale' duration={200}>
//       <Message compact style={{ width: '8rem', top:'-26rem', left:'13.5rem', padding: '1rem', fontSize: '0.8rem'}}> June. 11: <br /> 2M confirmed cases in the U.S. </Message>
//       </Transition> 
//       <Transition visible={visible4} animation='scale' duration={200}>
//       <Message compact style={{ width: '10rem', top:'-36rem', left:'23rem', padding: '1rem', fontSize: '0.8rem'}}> July. 19: <br /> Second wave peaked at 66,692 new cases <br />(7-day avg.) </Message>
//       </Transition> 
//       <Transition visible={visible5} animation='scale' duration={200}>
//       <Message compact style={{ width: '10rem', top:'-53rem', left:'37rem', padding: '1rem', fontSize: '0.8rem'}}> Dec. 17: <br /> Third wave peaked at 222,822 new cases <br />(7-day avg.) </Message>
//       </Transition> 
//       {visible2 ? <ArrowSvg start={{ x: 175, y: 243 }} end={{ x: 131, y: 336 }} strokeWidth='0.8'/> : null}
//       {visible3 ? <ArrowSvg start={{ x: 255, y: 327 }} end={{ x: 267, y: 350 }} strokeWidth='0.8'/> : null}
//       {visible4 ? <ArrowSvg start={{ x: 370, y: 285 }} end={{ x: 362, y: 302 }} strokeWidth='0.8'/> : null}
//       {visible5 ? <ArrowSvg start={{ x: 675, y: 110 }} end={{ x: 690, y: 125 }} strokeWidth='0.8'/> : null}
//       </Grid.Column>
//   );
// }



function CaseChart90(props){
  const [playCount, setPlayCount] = useState(0);
  const [visible1, setVisible1] = useState(false);
  // const [visible2, setVisible2] = useState(false);
  // const [visible3, setVisible3] = useState(false);
  // const [visible4, setVisible4] = useState(false);
  // const [visible5, setVisible5] = useState(false);
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
      console.log(i);
    }
    setTotalCase(sum);
  },[])

  // useEffect(() =>{
  //   setAnimationBool(playCount>-1);
  // },[playCount])

  // useEffect(() =>{
  //   setHighlightIndex([-1]);
  // },[props.history])

  var wait = 0;
  

  return(
    <Grid.Column style={{paddingTop: '1em', paddingLeft: 35, width: 850, height: 450}}>

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
              //  setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
                                    setHighlightIndex([-1]);
            }} 
            onAnimationEnd={()=> {
              setAnimationBool(false);
              setTimeout(()=>setVisible1(true), wait); 
              // setTimeout(()=>setVisible2(true), wait+1000); 
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 9]), wait+1000);
              // setTimeout(()=>setVisible3(true), wait+2000);
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 71]), wait+2000);  
              // setTimeout(()=>setVisible4(true), wait+3000); 
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 109]), wait+3000);  
              // setTimeout(()=>setVisible5(true), wait+4000);
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 260]), wait+4000);  
              setTimeout(()=>setDisabled(false),wait);
              // setTimeout(()=>setHighlightIndex(-1), wait+5000);
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
      {/* <Transition visible={visible2} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-28rem', left:'10rem', padding: '1rem', fontSize: '0.8rem'}}> Apr. 10: <br /> First wave peaked at 31,709 new cases <br />(7-day avg.) </Message>
      </Transition> 
      <Transition visible={visible3} animation='scale' duration={300}>
      <Message compact style={{ width: '8rem', top:'-32rem', left:'21rem', padding: '1rem', fontSize: '0.8rem'}}> June. 11: <br /> 2M confirmed cases in the U.S. </Message>
      </Transition> 
      <Transition visible={visible4} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-41.5rem', left:'30rem', padding: '1rem', fontSize: '0.8rem'}}> July. 19: <br /> Second wave peaked at 66,692 new cases <br />(7-day avg.) </Message>
      </Transition> 
      <Transition visible={visible5} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-55.5rem', left:'38rem', padding: '1rem', fontSize: '0.8rem'}}> Dec. 17: <br /> Third wave peaked at 222,822 new cases <br />(7-day avg.) </Message>
      </Transition>  */}
      
      {/* <renderArrow /> */}
      </Grid.Column>
  );
}


function CaseChart14(props){
  const [playCount, setPlayCount] = useState(0);
  const [totalCase, setTotalCase] = useState(0);
  const [visible1, setVisible1] = useState(false);
  // const [visible2, setVisible2] = useState(false);
  // const [visible3, setVisible3] = useState(false);
  // const [visible4, setVisible4] = useState(false);
  // const [visible5, setVisible5] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState([-1]);
  const data = props.data;
  const barColor = props.barColor;
  const lineColor = props.lineColor;
  const ticks = props.tick;
  const tickFormatter = props.tickFormatter;
  const barName = props.barName;
  const lineName = props.lineName;

  // const ytickFormatter = props.ytickFormatter;
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

  // useEffect(() =>{
  //   setAnimationBool(playCount>-1);
  // },[playCount])

  var wait=0;

  return(
    <Grid.Column style={{paddingTop:'1rem', paddingLeft: 35, width: 850, height: 450}}>

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
              //  setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
                                    setHighlightIndex([-1]); 
            }} 
            onAnimationEnd={()=> {
              setAnimationBool(false);
              setTimeout(()=>setVisible1(true), wait); 
              // setTimeout(()=>setVisible2(true), wait+1000); 
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 9]), wait+1000);
              // setTimeout(()=>setVisible3(true), wait+2000);
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 71]), wait+2000);  
              // setTimeout(()=>setVisible4(true), wait+3000); 
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 109]), wait+3000);  
              // setTimeout(()=>setVisible5(true), wait+4000);
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 260]), wait+4000);  
              setTimeout(()=>setDisabled(false),wait);
              // setTimeout(()=>setHighlightIndex(-1), wait+5000);
            }}
            animationDuration={3500} 
            barSize={10} fill={barColor}>
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : barColor}/>
              ))
              // fill={index === highlightIndex ? "red" : barColor}
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
      {/* <Transition visible={visible2} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-28rem', left:'10rem', padding: '1rem', fontSize: '0.8rem'}}> Apr. 10: <br /> First wave peaked at 31,709 new cases <br />(7-day avg.) </Message>
      </Transition> 
      <Transition visible={visible3} animation='scale' duration={300}>
      <Message compact style={{ width: '8rem', top:'-32rem', left:'21rem', padding: '1rem', fontSize: '0.8rem'}}> June. 11: <br /> 2M confirmed cases in the U.S. </Message>
      </Transition> 
      <Transition visible={visible4} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-41.5rem', left:'30rem', padding: '1rem', fontSize: '0.8rem'}}> July. 19: <br /> Second wave peaked at 66,692 new cases <br />(7-day avg.) </Message>
      </Transition> 
      <Transition visible={visible5} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-55.5rem', left:'38rem', padding: '1rem', fontSize: '0.8rem'}}> Dec. 17: <br /> Third wave peaked at 222,822 new cases <br />(7-day avg.) </Message>
      </Transition>  */}
      
      {/* <renderArrow /> */}
      </Grid.Column>
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

  // const ytickFormatter = props.ytickFormatter;
  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };

  // useEffect(() =>{
  //   setAnimationBool(playCount>-1);
  // },[playCount])
  //console.log(data);

  var wait=0;

  return(
    <Grid.Column style={{paddingTop:'1rem', paddingLeft: 35, width: 850, height: 450}}>


      <ComposedChart height={420} width={850} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter}/>
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
              // setTimeout(()=>setVisible4(true), wait+3000); 
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 109]), wait+3000);  
              // setTimeout(()=>setVisible5(true), wait+4000);
              // setTimeout(()=>setHighlightIndex(highlightIndex => [...highlightIndex, 260]), wait+4000);  
              setTimeout(()=>setDisabled(false),wait+3000);
              // setTimeout(()=>setHighlightIndex(-1), wait+5000);
            }}
            animationDuration={3500} 
            barSize={2} fill={barColor}>
            {
              data.map((entry, index) => (
                <Cell id={index} key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : barColor}/>
              ))
            }
      </ Bar>
      <Line name="7-day average" type='monotone' dataKey='mortalityMean' dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={3500} 
            stroke={lineColor}
            strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      </ComposedChart>
      {/* <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/> */}
      <Transition visible={visible1} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-28rem', left:'8rem', padding: '1rem', fontSize: '0.8rem'}}> Feb. 6: <br /> First death in US </Message>
      </Transition>
      <Transition visible={visible2} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-27.5rem', left:'12rem', padding: '1rem', fontSize: '0.8rem'}}> May. 27: <br /> Coronavirus deaths in the U.S. passed 100,000 </Message>
      </Transition> 
      <Transition visible={visible3} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-30.5rem', left:'27.5rem', padding: '1rem', fontSize: '0.8rem'}}> Sep. 22: <br /> Coronavirus deaths in the U.S. passed 200,000 </Message>
      </Transition> 
      {visible2 ? <ArrowSvg start={{ x: 290, y: 380 }} end={{ x: 263, y: 442 }} strokeWidth='0.8'/> : null}
      {visible3 ? <ArrowSvg start={{ x: 490, y: 438 }} end={{ x: 495, y: 465 }} strokeWidth='0.8'/> : null}
      
      </Grid.Column>   

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
        data['race'][0]['American Natives'][0], data['race'][0]['African American'][0],
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


export default function NationalReport(props) {



  
  const characterRef = createRef();
  const [activeCharacter, setActiveCharacter] = useState('');
  const [data, setData] = useState();
  const [date, setDate] = useState('');
  const [vaccineDate, setVaccineDate] = useState('');

  const [fips, setFips] = useState('13');
  const [nationalDemog, setNationalDemog] = useState();

  const [dataTS, setDataTS] = useState();
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

      // fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      //   .then(x => setVarMap(x));
      
      fetch('/data/topTenCases.json').then(res => res.json())
        .then(x => setDataTopCases(x));

      fetch('/data/topTenMortality.json').then(res => res.json())
        .then(x => setDataTopMortality(x));
      
      fetch('/data/nationalDemogdata.json').then(res => res.json())
        .then(x => setNationalDemog(x));

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
      if(data && Comorb){
          //Copd
          const csii = scaleQuantile()
          .domain(_.map(_.filter(_.map(data, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[Copd] > 0 &&
                d.fips.length === 5)),
            d=> d[Copd]))
          .range(colorPalette);

          let scaleMapii = {}
          _.each(data, d=>{
            if(d[Copd] > 0){
            scaleMapii[d[Copd]] = csii(d[Copd])}
          });
        
          setColorCopd(scaleMapii);
          var maxii = 0
          var minii = 100
          _.each(data, d=> { 
            if (d[Copd] > maxii && d.fips.length === 5) {
              maxii = d[Copd]
            } else if (d.fips.length === 5 && d[Copd] < minii && d[Copd] > 0){
              minii = d[Copd]
            }
          });
          if (maxii > 999999) {
            maxii = (maxii/1000000).toFixed(0) + "M";
            setLegendMaxCopd(maxii);
          }else if (maxii > 999) {
            maxii = (maxii/1000).toFixed(0) + "K";
            setLegendMaxCopd(maxii);
          }else{
            setLegendMaxCopd(maxii.toFixed(0));
          }
          setLegendMinCopd(minii.toFixed(0));
          setLegendSplitCopd(csii.quantiles());


      }

    },[data, Comorb]);

    

    useEffect(() => {
      if(data && Copd){
          //Ckd
          const csii = scaleQuantile()
          .domain(_.map(_.filter(_.map(data, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[Ckd] > 0 &&
                d.fips.length === 5)),
            d=> d[Ckd]))
          .range(colorPalette);

          let scaleMapii = {}
          _.each(data, d=>{
            if(d[Ckd] > 0){
            scaleMapii[d[Ckd]] = csii(d[Ckd])}
          });
        
          setColorCkd(scaleMapii);
          var maxii = 0
          var minii = 100
          _.each(data, d=> { 
            if (d[Ckd] > maxii && d.fips.length === 5) {
              maxii = d[Ckd]
            } else if (d.fips.length === 5 && d[Ckd] < minii && d[Ckd] > 0){
              minii = d[Ckd]
            }
          });
          if (maxii > 999999) {
            maxii = (maxii/1000000).toFixed(0) + "M";
            setLegendMaxCkd(maxii);
          }else if (maxii > 999) {
            maxii = (maxii/1000).toFixed(0) + "K";
            setLegendMaxCkd(maxii);
          }else{
            setLegendMaxCkd(maxii.toFixed(0));
          }
          setLegendMinCkd(minii.toFixed(0));
          setLegendSplitCkd(csii.quantiles());


      }

    },[data, Copd]);

    useEffect(() => {
      if(data && Ckd){
          //Diabetes
          const csii = scaleQuantile()
          .domain(_.map(_.filter(_.map(data, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[Diabetes] > 0 &&
                d.fips.length === 5)),
            d=> d[Diabetes]))
          .range(colorPalette);

          let scaleMapii = {}
          _.each(data, d=>{
            if(d[Diabetes] > 0){
            scaleMapii[d[Diabetes]] = csii(d[Diabetes])}
          });
        
          setColorDiabetes(scaleMapii);
          var maxii = 0
          var minii = 100
          _.each(data, d=> { 
            if (d[Diabetes] > maxii && d.fips.length === 5) {
              maxii = d[Diabetes]
            } else if (d.fips.length === 5 && d[Diabetes] < minii && d[Diabetes] > 0){
              minii = d[Diabetes]
            }
          });
          if (maxii > 999999) {
            maxii = (maxii/1000000).toFixed(0) + "M";
            setLegendMaxDiabetes(maxii);
          }else if (maxii > 999) {
            maxii = (maxii/1000).toFixed(0) + "K";
            setLegendMaxDiabetes(maxii);
          }else{
            setLegendMaxDiabetes(maxii.toFixed(0));
          }
          setLegendMinDiabetes(minii.toFixed(0));
          setLegendSplitDiabetes(csii.quantiles());


      }

    },[data, Ckd]);

    useEffect(() => {
      if(data && Diabetes){
          //Heart
          const csii = scaleQuantile()
          .domain(_.map(_.filter(_.map(data, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[Heart] > 0 &&
                d.fips.length === 5)),
            d=> d[Heart]))
          .range(colorPalette);

          let scaleMapii = {}
          _.each(data, d=>{
            if(d[Heart] > 0){
            scaleMapii[d[Heart]] = csii(d[Heart])}
          });
        
          setColorHeart(scaleMapii);
          var maxii = 0
          var minii = 100
          _.each(data, d=> { 
            if (d[Heart] > maxii && d.fips.length === 5) {
              maxii = d[Heart]
            } else if (d.fips.length === 5 && d[Heart] < minii && d[Heart] > 0){
              minii = d[Heart]
            }
          });
          if (maxii > 999999) {
            maxii = (maxii/1000000).toFixed(0) + "M";
            setLegendMaxHeart(maxii);
          }else if (maxii > 999) {
            maxii = (maxii/1000).toFixed(0) + "K";
            setLegendMaxHeart(maxii);
          }else{
            setLegendMaxHeart(maxii.toFixed(0));
          }
          setLegendMinHeart(minii.toFixed(0));
          setLegendSplitHeart(csii.quantiles());


      }

    },[data, Diabetes]);

    useEffect(() => {
      if(data && Heart){
          //Obesity
          const csii = scaleQuantile()
          .domain(_.map(_.filter(_.map(data, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[Obesity] > 0 &&
                d.fips.length === 5)),
            d=> d[Obesity]))
          .range(colorPalette);

          let scaleMapii = {}
          _.each(data, d=>{
            if(d[Obesity] > 0){
            scaleMapii[d[Obesity]] = csii(d[Obesity])}
          });
        
          setColorObesity(scaleMapii);
          var maxii = 0
          var minii = 100
          _.each(data, d=> { 
            if (d[Obesity] > maxii && d.fips.length === 5) {
              maxii = d[Obesity]
            } else if (d.fips.length === 5 && d[Obesity] < minii && d[Obesity] > 0){
              minii = d[Obesity]
            }
          });
          if (maxii > 999999) {
            maxii = (maxii/1000000).toFixed(0) + "M";
            setLegendMaxObesity(maxii);
          }else if (maxii > 999) {
            maxii = (maxii/1000).toFixed(0) + "K";
            setLegendMaxObesity(maxii);
          }else{
            setLegendMaxObesity(maxii.toFixed(0));
          }
          setLegendMinObesity(minii.toFixed(0));
          setLegendSplitObesity(csii.quantiles());


      }

    },[data, Heart]);

    

    

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
            <center> <Waypoint
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
                        {/* <p style={{fontSize: "24px", fontFamily: 'lato', color: "#004071", textAlign: "center"}}> Newly distributed per 100,000 <br/><br/></p> */}
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
                                        Data are from the <a href = 'https://covid.cdc.gov/covid-data-tracker/#vaccinations' target="_blank" rel="noopener noreferrer">CDC COVID Data Tracker</a>, last updated on {vaccineDate} <br/>
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
                

                <div id="cases" style = {{height: 45}}> </div>















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

            
            {/* <div id="deaths" style = {{height: 45}}> </div> */}

            {/* <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center> */}
            {/* <div style={{paddingBottom:'0em', paddingLeft: "12rem", paddingRight: "1em"}}> */}
            {/* <Header as='h2' style={{color: mortalityColor[1], textAlign:'center', fontSize:"22pt", paddingTop: 30}}>
                <Header.Content>
                  How have deaths in the U.S. changed over time? 
                </Header.Content>
              </Header>  */}

              {/* <Grid>
                    <Grid.Row column = {1} >
                      <DeathChart data={dataTS["_nation"]} barColor={mortalityColor[0]} lineColor={[mortalityColor[1]]} 
                          ticks={caseTicks} tickFormatter={caseTickFmt} />

                      <Accordion style = {{paddingTop: "19px"}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 0, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                          This figure shows the trend of daily COVID-19 deaths in the U.S.. The bar height reflects the number of new deaths 
                                          per day and the line depicts the 7-day moving average of daily deaths in the U.S.. There were {dailyDeaths} new deaths 
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

                      } />
                          <Accordion style = {{paddingTop: "19px"}}>
                            <Accordion.Title
                              active={accstate.activeIndex === 0}
                              index={0}
                              onClick={dealClick}
                              style ={{color: "#397AB9", fontSize: 19, paddingLeft: 30}}
                            >
                            <Icon id="half" name='dropdown' />
                              About the data
                            </Accordion.Title>
                              <Accordion.Content active={accstate.activeIndex === 0}>
                                <Header as='h2' style={{fontWeight: 400, paddingLeft: 35, paddingTop: 0, paddingBottom: 20}}>
                                  <Header.Content  style={{fontSize: "14pt"}}>
                                    <Header.Subheader style={{color: '#000000', width: 800, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                      This figure shows the trend of daily COVID-19 deaths in the U.S.. The bar height reflects the number of new deaths 
                                      per day and the line depicts the 7-day moving average of daily deaths in the U.S.. There were {dailyDeaths} new deaths 
                                      associated with COVID-19 reported on {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}, with 
                                      an average of {mortalityMean} new deaths per day reported over the past 7 days. 
                                      We see {percentChangeMortality.includes("-")? "a decrease of approximately " + percentChangeMortality.substring(1): "an increase of approximately " + percentChangeMortality} in the average new deaths over the past 14-day period. 
                                      <br/>
                                      <br/>
                                      *14-day period includes {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getFullYear()} to {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}.
                                    
                                    </Header.Subheader>
                                  </Header.Content>
                                </Header>
                            </Accordion.Content>

                          </Accordion> 
                          </Grid.Column> 
                    </Grid.Row>
                </Grid> */}

            {/* </div>   */}
            <div id="half" style = {{height: 45}}> </div>

            <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center>
            <div style={{paddingTop:'1em', paddingLeft: "13em", paddingRight: "2em"}}>
              <Header as='h2' style={{paddingTop: 17, textAlign:'center',fontSize:"22pt", color: mortalityColor[1]}}>
                <Header.Content style = {{paddingLeft: 54}}>
                  Where are cases and deaths occurring?
                  <Header.Subheader style={{ width: 810, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 2 }}>

                    Cases and deaths attributed to COVID-19 are rapidly rising in some counties, and 
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
                  <Header.Subheader style={{width: 810, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 6}}>
                  <center> <b style= {{fontSize: "18pt", paddingLeft: -3}}>Cases and Deaths by Race </b> </center> 
                  <br/><br/>
                  While people of all races, ages, and sex are impacted by COVID-19, some subgroups are disproportionally 
                  affected. The {Object.keys(demog_descriptives['Race'][0])[0]} population is seeing the largest mortality rate, with {numberWithCommas((demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]]).toFixed(0))} cases per 100,000 individuals, 
                  around {(demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]] / demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[1]]).toFixed(0)} times that of the {Object.keys(demog_descriptives['Race'][0])[1]} population, the group with the lowest mortality rate. 
                  
                    
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </div>

              {/* <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center> */}
              {/* <Grid>


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
                        <center> <b style= {{fontSize: "18pt"}}>Cases by Race</b> </center> 
                        <br/>
                      </Header.Subheader>
                  </Grid.Column>
                  <Grid.Column style = {{width: 450, paddingLeft: 100}}>
                        <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "2em", paddingRight: "1em", paddingBottom: -10}}>
                          <center> <b style= {{fontSize: "18pt"}}>Deaths by Race</b> </center> 
                          <br/>
                        </Header.Subheader>
                  </Grid.Column>
                </Grid.Row>
                <div style={{paddingLeft: "6em", paddingRight: "0em"}}></div> 
                
                <Grid.Row columns = {2} style = {{width: 1000}}>
                  <Grid.Column style = {{width: 450, paddingLeft: 100}}>
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
                          <VictoryGroup offset={23}>
                          <VictoryBar
                            horizontal
                            barWidth={20}
                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                            data={[
                              {key: nationalDemog['race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Hispanic'][0]['percentCases']},
                                    {key: nationalDemog['race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['race'][0]['American Natives'][0]['percentCases']},
                                    {key: nationalDemog['race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Asian'][0]['percentCases']},
                                    {key: nationalDemog['race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['race'][0]['African American'][0]['percentCases']},
                                    {key: nationalDemog['race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['race'][0]['White'][0]['percentCases']},
                                 


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
                              {key: nationalDemog['race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Hispanic'][0]['percentPop']},
                                    {key: nationalDemog['race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['race'][0]['American Natives'][0]['percentPop']},
                                    {key: nationalDemog['race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Asian'][0]['percentPop']},
                                    {key: nationalDemog['race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['race'][0]['African American'][0]['percentPop']},
                                    {key: nationalDemog['race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['race'][0]['White'][0]['percentPop']},
                                 


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
                  </Grid.Column>
                  <Grid.Column style = {{width: 450}}>
                    <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 40}}/> </center> 
                    
                      <div style={{paddingLeft: 64, paddingRight: "0em"}}>
                      
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
                          <VictoryGroup offset={23}>
                          <VictoryBar
                            horizontal
                            barWidth={20}
                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                            data={[
                              {key: nationalDemog['race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Hispanic'][0]['percentDeaths']},
                                    {key: nationalDemog['race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['race'][0]['American Natives'][0]['percentDeaths']},
                                    {key: nationalDemog['race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Asian'][0]['percentDeaths']},
                                    {key: nationalDemog['race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['race'][0]['African American'][0]['percentDeaths']},
                                    {key: nationalDemog['race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['race'][0]['White'][0]['percentDeaths']},
                                 


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
                              {key: nationalDemog['race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Hispanic'][0]['percentPop']},
                                    {key: nationalDemog['race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['race'][0]['American Natives'][0]['percentPop']},
                                    {key: nationalDemog['race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Asian'][0]['percentPop']},
                                    {key: nationalDemog['race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['race'][0]['African American'][0]['percentPop']},
                                    {key: nationalDemog['race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['race'][0]['White'][0]['percentPop']},
                                 


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














                
                
                
              </Grid> */}



              {/* <center style={{paddingLeft: 190}}><Divider style={{width: 900}}/> </center> */}
                <Grid.Row columns = {1} style = {{width: 1000, paddingTop: 15}}>
                  <Grid.Column style = {{width: 810, paddingLeft: 330}}>
                    <div style={{paddingTop:'0em'}}>
                      <Header.Subheader style={{width: 580, color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: 61, paddingRight: "1em", paddingBottom: 5}}>
                        <center> <b style= {{width: 580, fontSize: "18pt"}}>COVID-19 Death Rate by Race & Ethnicity</b> </center> 
                        <br/>
                      </Header.Subheader>
                    </div>
                  </Grid.Column>
                  
                </Grid.Row>
                <Grid>
                  
                  {/* <Grid.Row columns = {2} style = {{width: 1000}}>
                    <Grid.Column style = {{width: 450, paddingLeft: 300}}>
                        <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "2em", paddingRight: "1em", paddingBottom: -10}}>
                          <center> <b style= {{fontSize: "18pt"}}>Deaths by Race</b> </center> 
                          <br/>
                        </Header.Subheader>
                    </Grid.Column>
                    <Grid.Column style = {{width: 450, paddingLeft: 100}}>
                          <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "2em", paddingRight: "1em", paddingBottom: -10}}>
                            <center> <b style= {{fontSize: "18pt"}}></b> </center> 
                            <br/>
                          </Header.Subheader>
                    </Grid.Column>
                  </Grid.Row> */}
                  {/* <div style={{paddingLeft: "6em", paddingRight: "0em"}}></div> */}
                  
                  <Grid.Row columns = {2} style = {{width: 1000}}>
                    <Grid.Column style = {{width: 450, paddingLeft: 120}}>
                      <div style={{paddingLeft: "6em", paddingRight: "0em"}}>

                      <VictoryChart
                            theme={VictoryTheme.material}
                            width={450}
                            height={230}
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
                                      {key: nationalDemog['race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['race'][0]['American Natives'][0]['deathrate']},
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
                              <b>Deaths per 100,000 residents</b>
                              </Header.Content>
                          </Header.Content>
                      </div>

                      <Grid>
                      <Grid.Row>
                        <Accordion style = {{paddingTop: 50, paddingLeft: 98, paddingBottom: 45}} defaultActiveIndex={1} panels={[
                              {
                                  key: 'acquire-dog',
                                  title: {
                                      content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                      icon: 'dropdown',
                                  },
                                  content: {
                                      content: (
                                          <Header as='h2' style={{paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                            <Header.Content  style={{fontSize: "14pt"}}>
                                              <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                                The United States reports deaths by combined race and ethnicity groups. The chart shows race and ethnicity groups that constitute at least 1% of the state population and have 30 or more deaths. Race and ethnicity data are known for {nationalDemog['race'][0]['Unknown'][0]['availableDeaths'] + "%"} of deaths in the nation.
                                                <br/>
                                                <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covid.cdc.gov/covid-data-tracker/#demographics" target = "_blank" rel="noopener noreferrer"> The CDC </a>
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
                            affected. {Object.keys(demog_descriptives['Race'][0])[0]} are seeing the largest mortality rate, with {numberWithCommas((demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]]).toFixed(0))} cases per 100,000 individuals, 
                            around {(demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]] / demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[1]]).toFixed(0)} times that of {Object.keys(demog_descriptives['Race'][0])[1]}, the groups with the lowest mortality rate. 
                            
                              
                          </Header.Subheader> */}
                          <Header.Subheader style={{width: 400, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 6}}>
                            {/* <center> <b style= {{fontSize: "18pt", paddingLeft: 0}}> Risks for COVID-19 Deaths by Race/Ethnicity</b> </center>  */}
                            
                            <p style = {{paddingLeft: 20}}>
                              <b>Compared with death rates in White Americans, death rates* are: </b><br/>
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
                                <li>{(nationalDemog['race'][0]['American Natives'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1? "": 
                                  (nationalDemog['race'][0]['American Natives'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                                  {(nationalDemog['race'][0]['American Natives'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) == 1 ? "equal" :
                                  (nationalDemog['race'][0]['American Natives'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1)  < 1? "times lower" : "times higher"} in Native Americans
                                </li>
                              </ul>

                            <text style = {{fontSize: "13px"}}>
                            *The Hispanic population consists of mostly younger age groups. 
                            <br/>
                            *These are crude death rates based on cumulative deaths since January 2020. Age differences, such as the lower average age of Hispanic Americans, are not considered due to data limitations.
                            </text>
                            {/* While people of all races, ages, and sex are impacted by COVID-19, some subgroups are disproportionally 
                            affected. {Object.keys(demog_descriptives['Race'][0])[0]} are seeing the largest mortality rate, with {numberWithCommas((demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]]).toFixed(0))} cases per 100,000 individuals, 
                            around {(demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]] / demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[1]]).toFixed(0)} times that of {Object.keys(demog_descriptives['Race'][0])[1]}, the groups with the lowest mortality rate.  */}
                            </p>
                              
                          </Header.Subheader>
                        
                        </div>
                    </Grid.Column>
                  </Grid.Row>
                  

              </Grid>

              <center style={{paddingLeft: 190}}><Divider style={{width: 900}}/> </center>

              <Grid.Row columns = {1} style = {{width: 1000, paddingTop: 15}}>
                  <Grid.Column style = {{width: 810, paddingLeft: 330}}>
                    <div style={{paddingTop:'0em'}}>
                      <Header.Subheader style={{width: 560, color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: 61, paddingRight: "1em", paddingBottom: 0}}>
                        <center> <b style= {{width: 560, fontSize: "18pt"}}> COVID-19 Cases and U.S. Population <br/> distribution by race & ethnicity.</b> </center> 
                        <br/>
                      </Header.Subheader>
                    </div>
                  </Grid.Column>
                  
              </Grid.Row>
              <Grid>
                
                <Grid.Row columns = {2} style = {{width: 1360, paddingLeft: 120}} >
                  <Grid.Column rows = {2} >

                    <Grid.Row style = {{width: 550}}>
                      <Grid.Column style = {{width: 550, paddingLeft: 0}}>
                        <div>
                          <svg width="550" height="80">

                              <rect x={80} y={20} width="20" height="20" style={{fill: pieChartRace[0], strokeWidth:1, stroke: pieChartRace[0]}}/>                    
                              <text x={110} y={35} style={{fontSize: '16px'}}> White </text>  

                              <rect x={235} y={20} width="20" height="20" style={{fill: pieChartRace[1], strokeWidth:1, stroke: pieChartRace[1]}}/>                    
                              <text x={265} y={35} style={{fontSize: '16px'}}> African American </text>    

                              <rect x={430} y={20} width="20" height="20" style={{fill: pieChartRace[2], strokeWidth:1, stroke: pieChartRace[2]}}/>                    
                              <text x={460} y={35} style={{fontSize: '16px'}}> Hispanic </text>   

                              <rect x={167.5} y={55} width="20" height="20" style={{fill: pieChartRace[3], strokeWidth:1, stroke: pieChartRace[3]}}/>                    
                              <text x={197.6} y={70} style={{fontSize: '16px'}}> Asian </text>  

                              <rect x={322.5} y={55} width="20" height="20" style={{fill: pieChartRace[4], strokeWidth:1, stroke: pieChartRace[4]}}/>                    
                              <text x={352.5} y={70} style={{fontSize: '16px'}}> American Native </text>                    


                              {/* {_.map(pieChartRace, (color, i) => {
                                return <rect key={i} x={250} y={20*i} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                              })}  */}
                          </svg>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid>
                      <Grid.Row columns = {2} style = {{width: 900}}>
                        <Grid.Column style = {{width: 300}}>
                          <Race pop = {false}/>
                        </Grid.Column>
                        <Grid.Column style = {{width: 300, paddingLeft: 20}}>
                          <Race pop = {true}/> 
                        </Grid.Column>
                      </Grid.Row>
                      {/* <Grid.Row style = {{width: 900}}>
                        <Grid.Column style = {{width: 450, paddingLeft: 0}}>
                            <div>
                              <svg width="450" height="145">

                                  <text x={280} y={15} style={{fontSize: '16px'}}> Hispanic</text>                    
                                  <text x={280} y={35} style={{fontSize: '16px'}}> American Natives</text>                    
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
                    <div style={{paddingTop: 50, paddingLeft: 80}}>
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
                                <br/>
                            </li>
                            <li> Hispanic Americans: {(nationalDemog['race'][0]['Hispanic'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1? "": 
                                (nationalDemog['race'][0]['Hispanic'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) + " "}
                                {(nationalDemog['race'][0]['Hispanic'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1)  == 1 ? "equal" :
                                (nationalDemog['race'][0]['Hispanic'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1)  < 1? "times lower" : "times higher"} risk
                                <br/>
                            </li>
                            <li> Asian Americans: {(nationalDemog['race'][0]['Asian'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1? "": 
                                (nationalDemog['race'][0]['Asian'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) + " "}
                                {(nationalDemog['race'][0]['Asian'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1)  == 1 ? "equal" :
                                (nationalDemog['race'][0]['Asian'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) < 1? "times lower" : "times higher"} risk
                                <br/>
                            </li>
                            <li> Native Americans: {(nationalDemog['race'][0]['American Natives'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1? "": 
                                (nationalDemog['race'][0]['American Natives'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) + " "}
                                {(nationalDemog['race'][0]['American Natives'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) == 1 ? "equal" :
                                (nationalDemog['race'][0]['American Natives'][0]['caserate']/nationalDemog['race'][0]['White'][0]['caserate']).toFixed(1) < 1? "times lower" : "times higher"} risk
                            </li>
                          </ul>
                        {/* While people of all races, ages, and sex are impacted by COVID-19, some subgroups are disproportionally 
                        affected. {Object.keys(demog_descriptives['Race'][0])[0]} are seeing the largest mortality rate, with {numberWithCommas((demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]]).toFixed(0))} cases per 100,000 individuals, 
                        around {(demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]] / demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[1]]).toFixed(0)} times that of {Object.keys(demog_descriptives['Race'][0])[1]}, the groups with the lowest mortality rate.  */}
                        </p>
                          
                      </Header.Subheader>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Grid.Row>
                      <Accordion style = {{paddingTop: 30, paddingLeft: 190, paddingBottom: 45}}defaultActiveIndex={1} panels={[
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
                                          <Header.Content style={{fontWeight: 400, fontSize: "14pt", paddingTop: 7, paddingLeft: 0, lineHeight: "18pt", width: 900}}>
                                            The United States reports deaths by combined race and ethnicity groups. The chart shows race and ethnicity groups that constitute at least 1% of the state population and have 30 or more deaths. Race and ethnicity data are known for {nationalDemog['race'][0]['Unknown'][0]['availableDeaths'] + "%"} of deaths in the nation.
                                            <br/>
                                            <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.cdc.gov/diabetes/data/index.html" target = "_blank" rel="noopener noreferrer"> The CDC </a>
                                          
                                          </Header.Content>
                                        </Grid.Row>

                                      </div>
                                    ),
                                  },
                              }
                          ]

                          } /> 
                        
                        </Grid.Row>


              

              <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 0}}/> </center>

              <Grid.Row columns = {1} style = {{width: 1000, paddingTop: 15}}>
                  <Grid.Column style = {{width: 810, paddingLeft: 430}}>
                    <div style={{paddingTop:'0em'}}>
                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: 61, paddingRight: "1em", paddingBottom: 0}}>
                        <center> <b style= {{fontSize: "18pt"}}>Cases and Deaths by Age</b> </center> 
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
                        <center> <b style= {{fontSize: "18pt"}}>Cases by Age</b> </center> 
                        <br/>
                      </Header.Subheader>
                  </Grid.Column>
                  <Grid.Column style = {{width: 450, paddingLeft: 100}}>
                        <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "2em", paddingRight: "1em", paddingBottom: -10}}>
                          <center> <b style= {{fontSize: "18pt"}}>Deaths by Age</b> </center> 
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
                              {key: nationalDemog['age'][0]['5 - 17'][0]['demogLabel'], 'value': nationalDemog['age'][0]['5 - 17'][0]['percentCases']},
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
                              {key: nationalDemog['age'][0]['5 - 17'][0]['demogLabel'], 'value': nationalDemog['age'][0]['5 - 17'][0]['percentPop']},
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
                              {key: nationalDemog['age'][0]['5 - 17'][0]['demogLabel'], 'value': nationalDemog['age'][0]['5 - 17'][0]['percentDeaths']},
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
                              {key: nationalDemog['age'][0]['5 - 17'][0]['demogLabel'], 'value': nationalDemog['age'][0]['5 - 17'][0]['percentPop']},
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

              <Grid.Row columns = {1} style = {{width: 1000, paddingTop: 0}}>
                  <Grid.Column style = {{width: 1000, paddingLeft: 135}}>
                      <div style={{paddingLeft: "0em", paddingRight: "0em"}}>
                      <VictoryChart
                                theme={VictoryTheme.material}
                                width={910}
                                height={350}
                                domainPadding={{x:80}}
                                minDomain={{y: props.ylog?1:0}}
                                padding={{left: 200, right: 80, top: 30, bottom: 80}}
                                style = {{fontSize: "14pt"}}
                                containerComponent={<VictoryContainer responsive={false}/>}
                              >
                                <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                <VictoryAxis dependentAxis
                                  label="Percentage of COVID-19 Cases, Deaths, and Population" 
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

                              {/* <Header.Content style = {{width: 1000}}>
                                  <Header.Content style={{textOrientation: "sideways", fontWeight: 300, paddingLeft: 400, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                                  <b>Percentage of COVID-19 Deaths and Population</b>
                                  </Header.Content>
                              </Header.Content> */}
                    </div>
                    {/* <Accordion style = {{paddingTop: 20, paddingLeft: 103, paddingBottom: 28}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 0, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                          
                                        </Header.Subheader>
                                      </Header.Content>
                                    </Header>
                                ),
                              },
                          }
                      ]

                      } /> */}
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <div id="commu" style = {{height: 45}}> </div>

            <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 0}}/> </center>
            {true && <div style = {{ paddingLeft: "7em", paddingRight: "2em"}}>
              <Header as='h2' style={{color: '#b2b3b3', textAlign:'center',fontSize:"22pt", paddingTop: 29}}>
                <Header.Content  style={{fontSize:"22pt",color: mortalityColor[1], paddingLeft: 140}}>
                  COVID-19 Across U.S. Communities
                  <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingRight: 15}}>
                    <center> <b style= {{fontSize: "18pt", paddingLeft: 18}}>COVID-19 cases per 100,000 across the population characteristics of all the counties in the United States </b> </center> 
                    <br/>
                    <br/>
                    COVID-19 is affecting communities differently. Community-level factors such as urbanicity,  
                    socioeconomic status, race, and underlying medical conditions make some communities more 
                    vulnerable to COVID-19 than others. The maps and figures below show COVID-19 case rates and 
                    death rates across U.S. counties grouped by these community characteristics.  

                  </Header.Subheader>
                </Header.Content>
              </Header>

    
              {/* <div id="ccvi" style = {{height: 85}}> </div> */}
              <div id="ccvi" style = {{height: 45}}> </div>

              {/* <div style = {{paddingLeft: 50}}>
                <button class="ui black basic button" style = {{width: 120}} onClick={()=>
                                                        setMetric('ccvi')}>Community Vulnerability Index</button>
                <button class="ui black basic button" style = {{width: 120}} onClick={()=>
                                                        setMetric('poverty')}>by Percent in Poverty</button>
                
                                                        
              

              </div> */}


{/* <div>
      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:0, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
        <center> <b style= {{fontSize: "18pt"}}>{metricOptions[metric]}</b> </center> 
        <br/>
        <br/>         

      </Header.Subheader>
        <div style = {{paddingLeft: 70}}>
          <Dropdown

                        style={{background: '#fff', 
                                fontSize: "19px",
                                fontWeight: 400, 
                                theme: '#000000',
                                width: '440px',
                                top: '0px',
                                left: '0px',
                                text: "Select",
                                borderTop: '0.5px solid #bdbfc1',
                                borderLeft: '0.5px solid #bdbfc1',
                                borderRight: '0.5px solid #bdbfc1', 
                                borderBottom: '0.5px solid #bdbfc1',
                                borderRadius: 0,
                                minHeight: '1.0em',
                                paddingBottom: '0.5em',
                                paddingRight: 0}}
                        text= { "By " + metricName }
                        search
                        selection
                        pointing = 'top'
                        options={metricOptions}
                        onChange={(e, { value }) => {
                          setMetric(value);
                          setMetricName(varMap[value]['name']);
                        }}
                      />
          </div>
      <Grid>
        <Grid.Row columns={2} style={{paddingTop: 8}}>
          <Grid.Column style={{paddingTop:0,paddingBottom:0}}>
            

          <div >
            <br/>

            <svg width="400" height="80">
              
              {_.map(legendSplitMetric, (splitpoint, i) => {
                if(legendSplitMetric[i] < 1){
                  return <text key = {i} x={90 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitMetric[i].toFixed(1)}</text>                    
                }else if(legendSplitMetric[i] > 999999){
                  return <text key = {i} x={90 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitMetric[i]/1000000).toFixed(0) + "M"}</text>                    
                }else if(legendSplitMetric[i] > 999){
                  return <text key = {i} x={90 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitMetric[i]/1000).toFixed(0) + "K"}</text>                    
                }
                return <text key = {i} x={90 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitMetric[i].toFixed(0)}</text>                    
              })} 
              <text x={70} y={35} style={{fontSize: '0.7em'}}>{legendMinMetric}</text>
              <text x={190} y={35} style={{fontSize: '0.7em'}}>{legendMaxMetric}</text>


              {_.map(colorPalette, (color, i) => {
                return <rect key={i} x={70+20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
              })} 


              <text x={70} y={74} style={{fontSize: '0.8em'}}>Low</text>
              <text x={70+20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>


              <rect x={215} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
              <text x={237} y={50} style={{fontSize: '0.7em'}}> None </text>
              <text x={237} y={59} style={{fontSize: '0.7em'}}> Reported </text>
            

            </svg>

            <br/><br/><br/>
              <ComposableMap 
                projection="geoAlbersUsa" 
                data-tip=""
                width={520} 
                height={300}
                strokeWidth= {0.1}
                stroke= 'black'
                projectionConfig={{scale: 580}}
                style = {{paddingLeft: 50}}
                >
                <Geographies geography={geoUrl} stateBoundary = {metric === "region" ? true : false}>
                  {({ geographies }) => 
                    <svg>
                      {geographies.map(geo => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={
                          ((colorMetric && data[geo.id] && (data[geo.id][metric]) > 0)?
                          colorMetric[data[geo.id][metric]]: 
                              (colorMetric && data[geo.id] && data[geo.id][metric] === 0)?
                                '#FFFFFF':'#FFFFFF')}                              
                        />
                      ))}
                    </svg>
                  }
                </Geographies>
                

              </ComposableMap>
          </div>
          <Accordion style = {{paddingTop: 150, paddingLeft: 100}} defaultActiveIndex={1} panels={[
                {
                    key: 'acquire-dog',
                    title: {
                        content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                        icon: 'dropdown',
                    },
                    content: {
                        content: (
                            <Header as='h2' style={{fontWeight: 400, paddingLeft: 0, paddingTop: 0, paddingBottom: 20}}>
                              <Header.Content  style={{fontSize: "14pt"}}>
                                <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 100,000 
                                residents by CCVI ranking. The y-axis displays CCVI rankings based on quintiles (groups of 20%). 
                                The x-axis displays the average number of COVID-19 cases (top chart) or deaths (bottom chart) per 
                                100,000 that occurred in each group of counties ranked by CCVI. The ranking classified counties into 
                                five groups designed to be of equal size, so that the lowest quintile contains the counties with values 
                                in the 0%-20% range for this county characteristic, and the highest quintile contains counties with 
                                values in the 80%-100% range for this county characteristic. Q2 indicates counties in the 20%-40% 
                                range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties in the 60%-80% range.
                                </Header.Subheader>
                              </Header.Content>
                            </Header>
                        ),
                      },
                  }
              ]

              } />


          </Grid.Column>
          <Grid.Column>
          <Header as='h2' style={{paddingLeft: 60, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
              <Header.Content>
                Cases by {varMap[metric]['name']}
              </Header.Content>
            </Header>
                <VictoryChart
                  theme={VictoryTheme.material}
                  width={530}
                  height={180}
                  domainPadding={20}
                  minDomain={{y: props.ylog?1:0}}
                  padding={{left: metric !== "urbanrural" ? 180 : 250, right: 40, top: 5, bottom: 1}}
                  style = {{fontSize: "14pt"}}
                  containerComponent={<VictoryContainer responsive={false}/>}
                >
                  <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                  <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                  <VictoryBar
                    horizontal
                    barRatio={0.80}
                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                    data={metric !== "region" ? 
                    [
                      {key: nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['label'], 'value': (nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure']/nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'])*nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'] || 0},
                      {key: nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][1]['label'], 'value': (nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][1]['measure']/nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'])*nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'] || 0},
                      {key: nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][2]['label'], 'value': (nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][2]['measure']/nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'])*nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'] || 0},
                      {key: nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][3]['label'], 'value': (nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][3]['measure']/nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'])*nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'] || 0},
                      {key: nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][4]['label'], 'value': (nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][4]['measure']/nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'])*nationalBarChart['caserate7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'] || 0}
                    ]
                    :
                    [
                      {key: nationalBarChart['caserate7day'][0][metric][0]['label'], 'value': (nationalBarChart['caserate7day'][0][metric][0]['measure']/nationalBarChart['caserate7day'][0][metric][0]['measure'])*nationalBarChart['caserate7day'][0][metric][0]['measure'] || 0}, 
                      {key: nationalBarChart['caserate7day'][0][metric][1]['label'], 'value': (nationalBarChart['caserate7day'][0][metric][1]['measure']/nationalBarChart['caserate7day'][0][metric][0]['measure'])*nationalBarChart['caserate7day'][0][metric][0]['measure'] || 0},
                      {key: nationalBarChart['caserate7day'][0][metric][2]['label'], 'value': (nationalBarChart['caserate7day'][0][metric][2]['measure']/nationalBarChart['caserate7day'][0][metric][0]['measure'])*nationalBarChart['caserate7day'][0][metric][0]['measure'] || 0},
                      {key: nationalBarChart['caserate7day'][0][metric][3]['label'], 'value': (nationalBarChart['caserate7day'][0][metric][3]['measure']/nationalBarChart['caserate7day'][0][metric][0]['measure'])*nationalBarChart['caserate7day'][0][metric][0]['measure'] || 0},
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
                  
                  <Header.Content style={{fontWeight: 300, paddingLeft: 175, paddingTop: 20, paddingBottom:0, fontSize: "14pt", lineHeight: "18pt"}}>
                    <b>COVID-19 Cases per 100,000</b>
                  </Header.Content>
                </Header.Content>
                  
                  <br/>
                  <br/>

              <Header as='h2' style={{marginLeft: 80, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                  <Header.Content>
                    Deaths by {varMap[metric]['name']}
                  </Header.Content>
                </Header>
                <VictoryChart
                  theme={VictoryTheme.material}
                  width={530}
                  height={180}
                  domainPadding={20}
                  minDomain={{y: props.ylog?1:0}}
                  padding={{left: metric !== "urbanrural" ? 180 : 250, right: 40, top: 5, bottom: 1}}
                  style = {{fontSize: "14pt"}}
                  containerComponent={<VictoryContainer responsive={false}/>}
                >
                  <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                  <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                  <VictoryBar
                    horizontal
                    barRatio={0.80}
                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                    data={ metric !== "region" ? 
                    [
                      {key: nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure']/nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'])*nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'] || 0}, 
                      {key: nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][1]['measure']/nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'])*nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'] || 0},
                      {key: nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][2]['measure']/nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'])*nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'] || 0},
                      {key: nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][3]['measure']/nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'])*nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'] || 0},
                      {key: nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][4]['measure']/nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'])*nationalBarChart['covidmortality7day'][0][metric === "ccvi"? "CVI" : metric][0]['measure'] || 0}
                    ]
                    :
                    [
                      {key: nationalBarChart['covidmortality7day'][0][metric][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0][metric][0]['measure']/nationalBarChart['covidmortality7day'][0][metric][0]['measure'])*nationalBarChart['covidmortality7day'][0][metric][0]['measure'] || 0}, 
                      {key: nationalBarChart['covidmortality7day'][0][metric][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0][metric][1]['measure']/nationalBarChart['covidmortality7day'][0][metric][0]['measure'])*nationalBarChart['covidmortality7day'][0][metric][0]['measure'] || 0},
                      {key: nationalBarChart['covidmortality7day'][0][metric][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0][metric][2]['measure']/nationalBarChart['covidmortality7day'][0][metric][0]['measure'])*nationalBarChart['covidmortality7day'][0][metric][0]['measure'] || 0},
                      {key: nationalBarChart['covidmortality7day'][0][metric][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0][metric][3]['measure']/nationalBarChart['covidmortality7day'][0][metric][0]['measure'])*nationalBarChart['covidmortality7day'][0][metric][0]['measure'] || 0},
                    ]
                  
                  }
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
                    <Header.Content style={{ paddingLeft: 175,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>COVID-19 Deaths per 100,000</b>
                    </Header.Content>
                </Header.Content>

            </Grid.Column>
        </Grid.Row>
      </Grid>
    </div> */}













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
                                    content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                    icon: 'dropdown',
                                },
                                content: {
                                    content: (
                                        <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                          <Header.Content  style={{fontSize: "14pt"}}>
                                            <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                            This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                            per 100,000 residents by CCVI ranking. The y-axis displays CCVI rankings based on 
                                            quintiles (groups of 20%). The x-axis displays the average number of COVID-19 cases 
                                            (top chart) or deaths (bottom chart) per 100,000 that occurred in each group of 
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
                            <b>COVID-19 Cases per 100,000</b>
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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>

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
                     <Accordion style = {{paddingTop: 100, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by county ranking on percentage of population in poverty. The 
                                        y-axis displays percentage population in poverty rankings based on quintiles (groups of 20%). 
                                        The x-axis displays the average number of COVID-19 cases (top chart) or deaths (bottom chart) 
                                        per 100,000 that occurred in each group of counties ranked by percentage population in poverty. 
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
                            <b>COVID-19 Cases per 100,000</b>
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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
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

                      <text x={80} y={35} style={{fontSize: '0.8em'}}> NonCore (Nonmetro)</text>                    
                      <text x={80} y={55} style={{fontSize: '0.8em'}}> Micropolitan (Nonmetro)</text>                    
                      <text x={80} y={75} style={{fontSize: '0.8em'}}> Small Metro</text>                    
                      <text x={80} y={95} style={{fontSize: '0.8em'}}> Medium Metro</text>                    
                      <text x={80} y={115} style={{fontSize: '0.8em'}}> Large Central Metro</text>                    
                      <text x={80} y={135} style={{fontSize: '0.8em'}}> Large Fringe Metro</text>                    


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
                      <Accordion style = {{paddingTop: 40, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by metropolitan status (y-axis). Inner city counties have &#60; 1 
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
                                  {key: nationalBarChart['caserate'][0]['urbanrural'][0]['label'], 'value': (nationalBarChart['caserate'][0]['urbanrural'][0]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['urbanrural'][1]['label'], 'value': (nationalBarChart['caserate'][0]['urbanrural'][1]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['urbanrural'][2]['label'], 'value': (nationalBarChart['caserate'][0]['urbanrural'][2]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['urbanrural'][3]['label'], 'value': (nationalBarChart['caserate'][0]['urbanrural'][3]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['urbanrural'][4]['label'], 'value': (nationalBarChart['caserate'][0]['urbanrural'][4]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['urbanrural'][5]['label'], 'value': (nationalBarChart['caserate'][0]['urbanrural'][5]['measure']/nationalBarChart['caserate'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate'][0]['urbanrural'][0]['measure'] || 0}



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
                            <b>COVID-19 Cases per 100,000</b>
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
                                  {key: nationalBarChart['covidmortality'][0]['urbanrural'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['urbanrural'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][1]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['urbanrural'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][2]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['urbanrural'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][3]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['urbanrural'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][4]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['urbanrural'][5]['label'], 'value': (nationalBarChart['covidmortality'][0]['urbanrural'][5]['measure']/nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality'][0]['urbanrural'][0]['measure'] || 0}



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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:70, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
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
                      <Accordion style = {{paddingTop: 30, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by geographic region (y-axis).
                                        <br/>
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
                            <b>COVID-19 Cases per 100,000</b>
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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
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
                      <Accordion style = {{paddingTop: 100, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by percentage African American population ranking. The y-axis 
                                        displays percentage African American population rankings based on quintiles (groups of 20%). 
                                        The x-axis displays the average number of COVID-19 cases (top chart) or deaths (bottom chart) 
                                        per 100,000 that occurred in each group of counties ranked by percentage percentage African 
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
                            <b>COVID-19 Cases per 100,000</b>
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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
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
                      <Accordion style = {{paddingTop: 100, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 
                                        100,000 residents by residential segregation index. The y-axis displays residential 
                                        segregation rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
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
                            <b>COVID-19 Cases per 100,000</b>
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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
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
                      <Accordion style = {{paddingTop: 100, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 
                                        100,000 residents by percent of population with any underlying comorbidity. The y-axis 
                                        displays percent of population with any underlying comorbidity rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by percent of population with any underlying comorbidity. The ranking 
                                        classified counties into five groups designed to be of equal size, so that the population with "very 
                                        low percentage of any underlying comorbidity" group contains the counties with values in the 0%-20% range for this county 
                                        characteristic, and the population with "very high percentage of any underlying comorbidity" group contains counties with values in the 
                                        80%-100% range for this county characteristic. Low percentage of population with any underlying comorbidity indicates counties in 
                                        the 20%-40% range, moderate percentage of population with any underlying comorbidity indicates counties in the 40%-60% range, and 
                                        high percentage of population with any underlying comorbidity indicates counties in the 60%-80% range.
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
                            <b>COVID-19 Cases per 100,000</b>
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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row> 
              </Grid>}


              <div id="copd" style = {{height: 45}}> </div>

              <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center> 
              
              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                    <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>Chronic Obstructive Pulmonary Disease</b> </center> 
              </Header.Subheader>
              

              {Copd && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                  <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                    

                  <div >
                    
                    <svg width="260" height="80">
                      
                      {_.map(legendSplitCopd, (splitpoint, i) => {
                        if(legendSplitCopd[i] < 1){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitCopd[i].toFixed(1)}</text>                    
                        }else if(legendSplitCopd[i] > 999999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitCopd[i]/1000000).toFixed(0) + "M"}</text>                    
                        }else if(legendSplitCopd[i] > 999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitCopd[i]/1000).toFixed(0) + "K"}</text>                    
                        }
                        return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitCopd[i].toFixed(0)}</text>                    
                      })} 
                      <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinCopd}</text>
                      <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxCopd}</text>


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
                      
                      <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/copd.png' />
                  </div>
                  <Grid>
                    <Grid.Row>
                      <Accordion style = {{paddingTop: 100, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 
                                        100,000 residents by percent of population with COPD. The y-axis 
                                        displays percent of population with COPD rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by percent of population with COPD. The ranking 
                                        classified counties into five groups designed to be of equal size, so that the population with "very 
                                        low percentage of COPD" group contains the counties with values in the 0%-20% range for this county 
                                        characteristic, and the population with "very high percentage of COPD" group contains counties with values in the 
                                        80%-100% range for this county characteristic. Low percentage of population with COPD indicates counties in 
                                        the 20%-40% range, moderate percentage of population with COPD indicates counties in the 40%-60% range, and 
                                        high percentage of population with COPD indicates counties in the 60%-80% range.
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
                      COVID-19 Cases by <br/> Percentage of Population with COPD
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
                                  {key: nationalBarChart['caserate'][0]['copd'][0]['label'], 'value': (nationalBarChart['caserate'][0]['copd'][0]['measure']/nationalBarChart['caserate'][0]['copd'][0]['measure'])*nationalBarChart['caserate'][0]['copd'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['copd'][1]['label'], 'value': (nationalBarChart['caserate'][0]['copd'][1]['measure']/nationalBarChart['caserate'][0]['copd'][0]['measure'])*nationalBarChart['caserate'][0]['copd'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['copd'][2]['label'], 'value': (nationalBarChart['caserate'][0]['copd'][2]['measure']/nationalBarChart['caserate'][0]['copd'][0]['measure'])*nationalBarChart['caserate'][0]['copd'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['copd'][3]['label'], 'value': (nationalBarChart['caserate'][0]['copd'][3]['measure']/nationalBarChart['caserate'][0]['copd'][0]['measure'])*nationalBarChart['caserate'][0]['copd'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['copd'][4]['label'], 'value': (nationalBarChart['caserate'][0]['copd'][4]['measure']/nationalBarChart['caserate'][0]['copd'][0]['measure'])*nationalBarChart['caserate'][0]['copd'][0]['measure'] || 0}



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
                            <b>COVID-19 Cases per 100,000</b>
                          </Header.Content>
                        </Header.Content>
                          
                          <br/>
                          <br/>

                      <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                          <Header.Content style = {{paddingLeft: 0, width: 500}}>
                          COVID-19 Deaths by <br/> Percentage of Population with COPD
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
                                  {key: nationalBarChart['covidmortality'][0]['copd'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['copd'][0]['measure']/nationalBarChart['covidmortality'][0]['copd'][0]['measure'])*nationalBarChart['covidmortality'][0]['copd'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['copd'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['copd'][1]['measure']/nationalBarChart['covidmortality'][0]['copd'][0]['measure'])*nationalBarChart['covidmortality'][0]['copd'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['copd'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['copd'][2]['measure']/nationalBarChart['covidmortality'][0]['copd'][0]['measure'])*nationalBarChart['covidmortality'][0]['copd'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['copd'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['copd'][3]['measure']/nationalBarChart['covidmortality'][0]['copd'][0]['measure'])*nationalBarChart['covidmortality'][0]['copd'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['copd'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['copd'][4]['measure']/nationalBarChart['covidmortality'][0]['copd'][0]['measure'])*nationalBarChart['covidmortality'][0]['copd'][0]['measure'] || 0}



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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row> 
              </Grid>}








              <div id="ckd" style = {{height: 45}}> </div>

              <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                    <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>Chronic Kidney Disease</b> </center> 
              </Header.Subheader>
              

              {Ckd && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                  <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                    

                  <div >
                    
                    <svg width="260" height="80">
                      
                      {_.map(legendSplitCkd, (splitpoint, i) => {
                        if(legendSplitCkd[i] < 1){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitCkd[i].toFixed(1)}</text>                    
                        }else if(legendSplitCkd[i] > 999999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitCkd[i]/1000000).toFixed(0) + "M"}</text>                    
                        }else if(legendSplitCkd[i] > 999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitCkd[i]/1000).toFixed(0) + "K"}</text>                    
                        }
                        return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitCkd[i].toFixed(0)}</text>                    
                      })} 
                      <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinCkd}</text>
                      <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxCkd}</text>


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
                      
                      <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/ckd.png' />
                  </div>
                  <Grid>
                    <Grid.Row>
                      <Accordion style = {{paddingTop: 100, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 
                                        100,000 residents by percent of population with CKD. The y-axis 
                                        displays percent of population with CKD rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by percent of population with CKD. The ranking 
                                        classified counties into five groups designed to be of equal size, so that the population with "very 
                                        low percentage of CKD" group contains the counties with values in the 0%-20% range for this county 
                                        characteristic, and the population with "very high percentage of CKD" group contains counties with values in the 
                                        80%-100% range for this county characteristic. Low percentage of population with CKD indicates counties in 
                                        the 20%-40% range, moderate percentage of population with CKD indicates counties in the 40%-60% range, and 
                                        high percentage of population with CKD indicates counties in the 60%-80% range.
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
                      COVID-19 Cases by <br/> Percentage of Population with CKD
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
                                  {key: nationalBarChart['caserate'][0]['ckd'][0]['label'], 'value': (nationalBarChart['caserate'][0]['ckd'][0]['measure']/nationalBarChart['caserate'][0]['ckd'][0]['measure'])*nationalBarChart['caserate'][0]['ckd'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['ckd'][1]['label'], 'value': (nationalBarChart['caserate'][0]['ckd'][1]['measure']/nationalBarChart['caserate'][0]['ckd'][0]['measure'])*nationalBarChart['caserate'][0]['ckd'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['ckd'][2]['label'], 'value': (nationalBarChart['caserate'][0]['ckd'][2]['measure']/nationalBarChart['caserate'][0]['ckd'][0]['measure'])*nationalBarChart['caserate'][0]['ckd'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['ckd'][3]['label'], 'value': (nationalBarChart['caserate'][0]['ckd'][3]['measure']/nationalBarChart['caserate'][0]['ckd'][0]['measure'])*nationalBarChart['caserate'][0]['ckd'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['ckd'][4]['label'], 'value': (nationalBarChart['caserate'][0]['ckd'][4]['measure']/nationalBarChart['caserate'][0]['ckd'][0]['measure'])*nationalBarChart['caserate'][0]['ckd'][0]['measure'] || 0}



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
                            <b>COVID-19 Cases per 100,000</b>
                          </Header.Content>
                        </Header.Content>
                          
                          <br/>
                          <br/>

                      <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                          <Header.Content style = {{paddingLeft: 0, width: 500}}>
                          COVID-19 Deaths by <br/> Percentage of Population with CKD
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
                                  {key: nationalBarChart['covidmortality'][0]['ckd'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['ckd'][0]['measure']/nationalBarChart['covidmortality'][0]['ckd'][0]['measure'])*nationalBarChart['covidmortality'][0]['ckd'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['ckd'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['ckd'][1]['measure']/nationalBarChart['covidmortality'][0]['ckd'][0]['measure'])*nationalBarChart['covidmortality'][0]['ckd'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['ckd'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['ckd'][2]['measure']/nationalBarChart['covidmortality'][0]['ckd'][0]['measure'])*nationalBarChart['covidmortality'][0]['ckd'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['ckd'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['ckd'][3]['measure']/nationalBarChart['covidmortality'][0]['ckd'][0]['measure'])*nationalBarChart['covidmortality'][0]['ckd'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['ckd'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['ckd'][4]['measure']/nationalBarChart['covidmortality'][0]['ckd'][0]['measure'])*nationalBarChart['covidmortality'][0]['ckd'][0]['measure'] || 0}



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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row> 
              </Grid>}


              <div id="diabetes" style = {{height: 45}}> </div>

              <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                    <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>Diabetes</b> </center> 
              </Header.Subheader>


              {Diabetes && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                  <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                    

                  <div >
                    
                    <svg width="260" height="80">
                      
                      {_.map(legendSplitDiabetes, (splitpoint, i) => {
                        if(legendSplitDiabetes[i] < 1){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitDiabetes[i].toFixed(1)}</text>                    
                        }else if(legendSplitDiabetes[i] > 999999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitDiabetes[i]/1000000).toFixed(0) + "M"}</text>                    
                        }else if(legendSplitDiabetes[i] > 999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitDiabetes[i]/1000).toFixed(0) + "K"}</text>                    
                        }
                        return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitDiabetes[i].toFixed(0)}</text>                    
                      })} 
                      <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinDiabetes}</text>
                      <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxDiabetes}</text>


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
                      
                      <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/diabetes.png' />
                  </div>
                  <Grid>
                    <Grid.Row>
                      <Accordion style = {{paddingTop: 100, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 
                                        100,000 residents by percent of population with diabetes. The y-axis 
                                        displays percent of population with diabetes rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by percent of population with diabetes. The ranking 
                                        classified counties into five groups designed to be of equal size, so that the population with "very 
                                        low percentage of diabetes" group contains the counties with values in the 0%-20% range for this county 
                                        characteristic, and the population with "very high percentage of diabetes" group contains counties with values in the 
                                        80%-100% range for this county characteristic. Low percentage of population with diabetes indicates counties in 
                                        the 20%-40% range, moderate percentage of population with diabetes indicates counties in the 40%-60% range, and 
                                        high percentage of population with diabetes indicates counties in the 60%-80% range.
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
                      COVID-19 Cases by <br/> Percentage of Population with Diabetes
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
                                  {key: nationalBarChart['caserate'][0]['diabetes'][0]['label'], 'value': (nationalBarChart['caserate'][0]['diabetes'][0]['measure']/nationalBarChart['caserate'][0]['diabetes'][0]['measure'])*nationalBarChart['caserate'][0]['diabetes'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['diabetes'][1]['label'], 'value': (nationalBarChart['caserate'][0]['diabetes'][1]['measure']/nationalBarChart['caserate'][0]['diabetes'][0]['measure'])*nationalBarChart['caserate'][0]['diabetes'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['diabetes'][2]['label'], 'value': (nationalBarChart['caserate'][0]['diabetes'][2]['measure']/nationalBarChart['caserate'][0]['diabetes'][0]['measure'])*nationalBarChart['caserate'][0]['diabetes'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['diabetes'][3]['label'], 'value': (nationalBarChart['caserate'][0]['diabetes'][3]['measure']/nationalBarChart['caserate'][0]['diabetes'][0]['measure'])*nationalBarChart['caserate'][0]['diabetes'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['diabetes'][4]['label'], 'value': (nationalBarChart['caserate'][0]['diabetes'][4]['measure']/nationalBarChart['caserate'][0]['diabetes'][0]['measure'])*nationalBarChart['caserate'][0]['diabetes'][0]['measure'] || 0}



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
                            <b>COVID-19 Cases per 100,000</b>
                          </Header.Content>
                        </Header.Content>
                          
                          <br/>
                          <br/>

                      <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                          <Header.Content style = {{paddingLeft: 0, width: 500}}>
                          COVID-19 Deaths by <br/> Percentage of Population with Diabetes
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
                                  {key: nationalBarChart['covidmortality'][0]['diabetes'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['diabetes'][0]['measure']/nationalBarChart['covidmortality'][0]['diabetes'][0]['measure'])*nationalBarChart['covidmortality'][0]['diabetes'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['diabetes'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['diabetes'][1]['measure']/nationalBarChart['covidmortality'][0]['diabetes'][0]['measure'])*nationalBarChart['covidmortality'][0]['diabetes'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['diabetes'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['diabetes'][2]['measure']/nationalBarChart['covidmortality'][0]['diabetes'][0]['measure'])*nationalBarChart['covidmortality'][0]['diabetes'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['diabetes'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['diabetes'][3]['measure']/nationalBarChart['covidmortality'][0]['diabetes'][0]['measure'])*nationalBarChart['covidmortality'][0]['diabetes'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['diabetes'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['diabetes'][4]['measure']/nationalBarChart['covidmortality'][0]['diabetes'][0]['measure'])*nationalBarChart['covidmortality'][0]['diabetes'][0]['measure'] || 0}



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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row> 
              </Grid>}



              <div id="heart" style = {{height: 45}}> </div>

              <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                    <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>Heart disease</b> </center> 
              </Header.Subheader>


              {Heart && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                  <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                    

                  <div >
                    
                    <svg width="260" height="80">
                      
                      {_.map(legendSplitHeart, (splitpoint, i) => {
                        if(legendSplitHeart[i] < 1){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitHeart[i].toFixed(1)}</text>                    
                        }else if(legendSplitHeart[i] > 999999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitHeart[i]/1000000).toFixed(0) + "M"}</text>                    
                        }else if(legendSplitHeart[i] > 999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitHeart[i]/1000).toFixed(0) + "K"}</text>                    
                        }
                        return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitHeart[i].toFixed(0)}</text>                    
                      })} 
                      <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinHeart}</text>
                      <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxHeart}</text>


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
                      
                      <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/heartdisease.png' />
                  </div>
                  <Grid>
                    <Grid.Row>
                  <Accordion style = {{paddingTop: 100, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 
                                        100,000 residents by percent of population with heart disease. The y-axis 
                                        displays percent of population with heart disease rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by percent of population with heart disease. The ranking 
                                        classified counties into five groups designed to be of equal size, so that the population with "very 
                                        low percentage of heart disease" group contains the counties with values in the 0%-20% range for this county 
                                        characteristic, and the population with "very high percentage of heart disease" group contains counties with values in the 
                                        80%-100% range for this county characteristic. Low percentage of population with heart disease indicates counties in 
                                        the 20%-40% range, moderate percentage of population with heart disease indicates counties in the 40%-60% range, and 
                                        high percentage of population with heart disease indicates counties in the 60%-80% range.
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
                      COVID-19 Cases by <br/> Percentage of Population with Heart Disease
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
                                  {key: nationalBarChart['caserate'][0]['heartdisease'][0]['label'], 'value': (nationalBarChart['caserate'][0]['heartdisease'][0]['measure']/nationalBarChart['caserate'][0]['heartdisease'][0]['measure'])*nationalBarChart['caserate'][0]['heartdisease'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['heartdisease'][1]['label'], 'value': (nationalBarChart['caserate'][0]['heartdisease'][1]['measure']/nationalBarChart['caserate'][0]['heartdisease'][0]['measure'])*nationalBarChart['caserate'][0]['heartdisease'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['heartdisease'][2]['label'], 'value': (nationalBarChart['caserate'][0]['heartdisease'][2]['measure']/nationalBarChart['caserate'][0]['heartdisease'][0]['measure'])*nationalBarChart['caserate'][0]['heartdisease'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['heartdisease'][3]['label'], 'value': (nationalBarChart['caserate'][0]['heartdisease'][3]['measure']/nationalBarChart['caserate'][0]['heartdisease'][0]['measure'])*nationalBarChart['caserate'][0]['heartdisease'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['heartdisease'][4]['label'], 'value': (nationalBarChart['caserate'][0]['heartdisease'][4]['measure']/nationalBarChart['caserate'][0]['heartdisease'][0]['measure'])*nationalBarChart['caserate'][0]['heartdisease'][0]['measure'] || 0}



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
                            <b>COVID-19 Cases per 100,000</b>
                          </Header.Content>
                        </Header.Content>
                          
                          <br/>
                          <br/>

                      <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                          <Header.Content style = {{paddingLeft: 0, width: 500}}>
                          COVID-19 Deaths by <br/> Percentage of Population with Heart Disease
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
                                  {key: nationalBarChart['covidmortality'][0]['heartdisease'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure']/nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure'])*nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['heartdisease'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['heartdisease'][1]['measure']/nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure'])*nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['heartdisease'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['heartdisease'][2]['measure']/nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure'])*nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['heartdisease'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['heartdisease'][3]['measure']/nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure'])*nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['heartdisease'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['heartdisease'][4]['measure']/nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure'])*nationalBarChart['covidmortality'][0]['heartdisease'][0]['measure'] || 0}



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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row> 
              </Grid>}



              <div id="obesity" style = {{height: 45}}> </div>

              <center style={{paddingLeft: 90}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, paddingLeft: 0, paddingRight: 0, paddingBottom: 60}}>
                    <center> <b style= {{fontSize: "18pt", paddingLeft: 134}}>Obesity</b> </center> 
              </Header.Subheader>


              {Obesity && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8, width: 1000, paddingLeft: 60}}>
                  <Grid.Column style={{paddingTop:10, paddingLeft:0}}>

                    

                  <div >
                    
                    <svg width="260" height="80">
                      
                      {_.map(legendSplitObesity, (splitpoint, i) => {
                        if(legendSplitObesity[i] < 1){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitObesity[i].toFixed(1)}</text>                    
                        }else if(legendSplitObesity[i] > 999999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitObesity[i]/1000000).toFixed(0) + "M"}</text>                    
                        }else if(legendSplitObesity[i] > 999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitObesity[i]/1000).toFixed(0) + "K"}</text>                    
                        }
                        return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitObesity[i].toFixed(0)}</text>                    
                      })} 
                      <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinObesity}</text>
                      <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxObesity}</text>


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
                      
                      <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/obesity.png' />
                  </div>
                  <Grid>
                    <Grid.Row>
                      <Accordion style = {{paddingTop: 100, paddingLeft: 60}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 5, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 900, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 
                                        100,000 residents by percent of population with obesity. The y-axis 
                                        displays percent of population with obesity rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by percent of population with obesity. The ranking 
                                        classified counties into five groups designed to be of equal size, so that the population with "very 
                                        low percentage of obesity" group contains the counties with values in the 0%-20% range for this county 
                                        characteristic, and the population with "very high percentage of obesity" group contains counties with values in the 
                                        80%-100% range for this county characteristic. Low percentage of population with obesity indicates counties in 
                                        the 20%-40% range, moderate percentage of population with obesity indicates counties in the 40%-60% range, and 
                                        high percentage of population with obesity indicates counties in the 60%-80% range.
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
                      COVID-19 Cases by <br/> Percentage of Population with Obesity
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
                                  {key: nationalBarChart['caserate'][0]['obesity'][0]['label'], 'value': (nationalBarChart['caserate'][0]['obesity'][0]['measure']/nationalBarChart['caserate'][0]['obesity'][0]['measure'])*nationalBarChart['caserate'][0]['obesity'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['obesity'][1]['label'], 'value': (nationalBarChart['caserate'][0]['obesity'][1]['measure']/nationalBarChart['caserate'][0]['obesity'][0]['measure'])*nationalBarChart['caserate'][0]['obesity'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['obesity'][2]['label'], 'value': (nationalBarChart['caserate'][0]['obesity'][2]['measure']/nationalBarChart['caserate'][0]['obesity'][0]['measure'])*nationalBarChart['caserate'][0]['obesity'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['obesity'][3]['label'], 'value': (nationalBarChart['caserate'][0]['obesity'][3]['measure']/nationalBarChart['caserate'][0]['obesity'][0]['measure'])*nationalBarChart['caserate'][0]['obesity'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate'][0]['obesity'][4]['label'], 'value': (nationalBarChart['caserate'][0]['obesity'][4]['measure']/nationalBarChart['caserate'][0]['obesity'][0]['measure'])*nationalBarChart['caserate'][0]['obesity'][0]['measure'] || 0}



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
                            <b>COVID-19 Cases per 100,000</b>
                          </Header.Content>
                        </Header.Content>
                          
                          <br/>
                          <br/>

                      <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                          <Header.Content style = {{paddingLeft: 0, width: 500}}>
                          COVID-19 Deaths by <br/> Percentage of Population with Obesity
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
                                  {key: nationalBarChart['covidmortality'][0]['obesity'][0]['label'], 'value': (nationalBarChart['covidmortality'][0]['obesity'][0]['measure']/nationalBarChart['covidmortality'][0]['obesity'][0]['measure'])*nationalBarChart['covidmortality'][0]['obesity'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['obesity'][1]['label'], 'value': (nationalBarChart['covidmortality'][0]['obesity'][1]['measure']/nationalBarChart['covidmortality'][0]['obesity'][0]['measure'])*nationalBarChart['covidmortality'][0]['obesity'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['obesity'][2]['label'], 'value': (nationalBarChart['covidmortality'][0]['obesity'][2]['measure']/nationalBarChart['covidmortality'][0]['obesity'][0]['measure'])*nationalBarChart['covidmortality'][0]['obesity'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['obesity'][3]['label'], 'value': (nationalBarChart['covidmortality'][0]['obesity'][3]['measure']/nationalBarChart['covidmortality'][0]['obesity'][0]['measure'])*nationalBarChart['covidmortality'][0]['obesity'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality'][0]['obesity'][4]['label'], 'value': (nationalBarChart['covidmortality'][0]['obesity'][4]['measure']/nationalBarChart['covidmortality'][0]['obesity'][0]['measure'])*nationalBarChart['covidmortality'][0]['obesity'][0]['measure'] || 0}



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
                            <Header.Content style={{ paddingLeft: 140,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>COVID-19 Deaths per 100,000</b>
                            </Header.Content>
                        </Header.Content>
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


