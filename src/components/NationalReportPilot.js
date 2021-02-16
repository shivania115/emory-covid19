import React, { useEffect, useState, Component, createRef, useRef, useContext, useMemo} from 'react'
import { Container, Header, Grid, Loader, Divider, Button, Dropdown, Image, Rail, Sticky, Ref, Accordion, Menu, Message, Transition, List} from 'semantic-ui-react'
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
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell} from "recharts";
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
const nameList = ['COVID-19 National Health Equity Report', 'Cases in the U.S. Over Time', 
'Deaths in the U.S. Over Time', '50% of Cases Comes From These States', 'COVID-19 Across U.S. Communities',
 'COVID-19 by Community Vulnerability Index', 'COVID-19 by Percent in Poverty', 'COVID-19 by Metropolitan Status', 
 'COVID-19 by Region', 'COVID-19 by Percent African American', 'COVID-19 by Residential Segregation Index',
 "COVID-19 by Underlying Comorbidity", "COVID-19 by Percent COPD", 'COVID-19 by Percent CKD',
 'COVID-19 by Percent Diabetes', 'COVID-19 by Percent Heart Disease', "Obesity"];
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
                                
                          <Menu.Item as='a' href="#cases" name={nameList[1]} active={props.activeCharacter == nameList[1] || activeItem === nameList[1]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[1]}</Header></Menu.Item>

                          <Menu.Item as='a' href="#deaths" name={nameList[2]} active={props.activeCharacter == nameList[2] || activeItem === nameList[2]}
                                onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>{nameList[2]}</Header></Menu.Item>

                          <Menu.Item as='a' href="#half" name={nameList[3]} active={props.activeCharacter == nameList[3] || activeItem === nameList[3]}
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


function CaseSection(props){
  const [activeItem, setActiveItem] = useState('All');
  const data = props.data;
  const [dataPassed, setDataPassed] = useState(data["_nation"]);
  const [caseTicks, setCaseTicks] = useState([]);

useEffect(()=>{
  if(activeItem==='All') {
    setCaseTicks([data["_nation"][0].t,
    data["_nation"][30].t,
    data["_nation"][61].t,
    data["_nation"][91].t,
    data["_nation"][122].t,
    data["_nation"][153].t,
    data["_nation"][183].t,
    data["_nation"][214].t,
    data["_nation"][244].t,
    data["_nation"][data["_nation"].length-1].t]);
    setDataPassed(data["_nation"]);
  } else if(activeItem==='90 Days'){
    setCaseTicks([data["_nation"][214].t,
    data["_nation"][244].t,
    data["_nation"][data["_nation"].length-1].t]);
    setDataPassed(data["_nation"].slice(-90));
  } else{
    setCaseTicks([
      data["_nation"][data["_nation"].length-15].t,
      data["_nation"][data["_nation"].length-1].t]);
    setDataPassed(data["_nation"].slice(-14));
  }
}, [activeItem]);


  return(
  <Grid.Row style={{paddingLeft: '3rem', paddingBottom: '0rem', height:'39rem'}}>  
  <Grid.Column style={{paddingTop: '1rem', paddingLeft: '22rem'}}>
    <Menu pointing secondary widths={3} style={{width: '16rem'}}> 
    <Menu.Item name='All' active={activeItem==='All'} onClick={()=>setActiveItem('All')}/>
    {/* active={activeItem==='all'} onClick={setActiveItem('all')} defaultActiveIndex='All'*/}
    <Menu.Item name='90 Days' active={activeItem==='90 Days'} onClick={()=>setActiveItem('90 Days')}/>
    <Menu.Item name='14 Days' active={activeItem==='14 Days'} onClick={()=>setActiveItem('14 Days')}/>
    </ Menu>
    </Grid.Column>
    {/* <CaseChart90 data={data["_nation"]} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter}/> */}
    {(()=>{
    if (activeItem==='All'){
   return <CaseChartAll data={data["_nation"]} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter} history={activeItem}/>
  } else if(activeItem==='90 Days'){
    return <CaseChart90 data={data["_nation"]} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter} history={activeItem}/>
    } else {
      return <CaseChart14 data={data["_nation"]} barColor={props.barColor} lineColor={props.lineColor} 
              tick={caseTicks} tickFormatter={props.tickFormatter} history={activeItem}/>
    }
  }
    )()}
  </ Grid.Row>
  )
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
    setAnimationBool(playCount>-1);
  },[playCount])

  useEffect(() =>{
    setHighlightIndex([-1]);
    console.log("highlightIndex", highlightIndex);
  },[props.history])

  var wait=0;

  return(
    <Grid.Column style={{paddingTop:20, paddingleft: '5rem', width: 850, height: 500}}>

      <ComposedChart width={830} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter}/>
      <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
      <Bar name="New cases" dataKey='dailyCases' barSize={18} 
            isAnimationActive={animationBool} 
            animationEasing='ease'
            onAnimationStart={() => {setDisabled(true); setVisible1(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
                                    setHighlightIndex([-1]);
              // setTimeout(()=>setVisible1(true), wait); 
              // setTimeout(()=>setVisible2(true), wait+1000); 
              // setTimeout(()=>setHighlightIndex(9), wait+1000);
              // setTimeout(()=>setVisible3(true), wait+2000);
              // setTimeout(()=>setHighlightIndex(71), wait+2000);  
              // setTimeout(()=>setVisible4(true), wait+3000); 
              // setTimeout(()=>setHighlightIndex(101), wait+3000);  
              // setTimeout(()=>setVisible5(true), wait+4000);
              // setTimeout(()=>setHighlightIndex(260), wait+4000);  
              // setTimeout(()=>setDisabled(false),wait+4500);
              // setTimeout(()=>setHighlightIndex(-1), wait+4500); 
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
             barSize={2} >
             {/* fill={barColor} */}
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : barColor}/>
              ))
              // fill={index === highlightIndex ? "red" : barColor}
            }
      </ Bar>
      <Line name="7-day average" id='all-line' type='monotone' dataKey='caseRateMean' dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={3500} 
            strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      {/* <Brush dataKey='t'/> */}
      </ComposedChart>
      <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/>
      <Transition visible={visible1} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-28rem', left:'10rem', padding: '1rem', fontSize: '0.8rem'}}> Jan. 21: <br /> 1st case in the U.S. confirmed in Washington</Message>
      </Transition>
      <Transition visible={visible2} animation='scale' duration={300}>
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
      </Transition> 
      
      {/* <renderArrow /> */}
      </Grid.Column>
  );
}

function CaseChart90(props){
  const [playCount, setPlayCount] = useState(0);
  // const [visible1, setVisible1] = useState(false);
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

  // const ytickFormatter = props.ytickFormatter;
  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };

  useEffect(() =>{
    setAnimationBool(playCount>-1);
  },[playCount])

  useEffect(() =>{
    setHighlightIndex([-1]);
    console.log("highlightIndex", highlightIndex);
  },[props.history])

  var wait=0;
  console.log("animationBool", animationBool);

  return(
    <Grid.Column style={{paddingTop:20, paddingleft: '5rem', width: 850, height: 500}}>

      <ComposedChart width={830} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" type="number" domain={[data[data.length-91].t,'dataMax']} padding={{ left: 3, right: 3 }}
      ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter} allowDataOverflow={true}/>
      {/* ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter} data[data.length-1].t-90*/}
      <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
      <Bar name="New cases" dataKey='dailyCases' barSize={18} 
            isAnimationActive={animationBool} 
            animationEasing='ease'
            onAnimationStart={() => {setDisabled(true); 
              // setVisible1(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
                                    setHighlightIndex([-1]);
              // setTimeout(()=>setVisible1(true), wait); 
              // setTimeout(()=>setVisible2(true), wait+1000); 
              // setTimeout(()=>setHighlightIndex(9), wait+1000);
              // setTimeout(()=>setVisible3(true), wait+2000);
              // setTimeout(()=>setHighlightIndex(71), wait+2000);  
              // setTimeout(()=>setVisible4(true), wait+3000); 
              // setTimeout(()=>setHighlightIndex(101), wait+3000);  
              // setTimeout(()=>setVisible5(true), wait+4000);
              // setTimeout(()=>setHighlightIndex(260), wait+4000);  
              // setTimeout(()=>setDisabled(false),wait+4500);
              // setTimeout(()=>setHighlightIndex(-1), wait+4500); 
            }} 
            onAnimationEnd={()=> {
              setAnimationBool(false);
              // setTimeout(()=>setVisible1(true), wait); 
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
             barSize={3} >
             {/* fill={barColor} */}
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : barColor}/>
              ))
              // fill={index === highlightIndex ? "red" : barColor}
            }
      </ Bar>
      <Line name="7-day average" id='90-line' type='monotone' dataKey='caseRateMean' dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={3500} 
            stroke={lineColor} strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      {/* <Brush dataKey='t'/> */}
      </ComposedChart>
      <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/>
      {/* <Transition visible={visible1} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-28rem', left:'10rem', padding: '1rem', fontSize: '0.8rem'}}> Jan. 21: <br /> 1st case in the U.S. confirmed in Washington</Message>
      </Transition>
      <Transition visible={visible2} animation='scale' duration={300}>
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
  // const [visible1, setVisible1] = useState(false);
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

  // const ytickFormatter = props.ytickFormatter;
  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };

  useEffect(() =>{
    setAnimationBool(playCount>-1);
  },[playCount])

  useEffect(() =>{
    setHighlightIndex([-1]);
    console.log("highlightIndex", highlightIndex);
  },[props.history])

  var wait=0;
  console.log("animationBool", animationBool);

  return(
    <Grid.Column style={{paddingTop:20, paddingleft: '5rem', width: 850, height: 500}}>

      <ComposedChart width={830} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" type="number" domain={[data[data.length-15].t,'dataMax']} padding={{ left: 5, right: 5 }}
      ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter} allowDataOverflow={true}/>
      {/* ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter} data[data.length-1].t-90*/}
      <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
      <Bar name="New cases" dataKey='dailyCases' 
            isAnimationActive={animationBool} 
            animationEasing='ease'
            onAnimationStart={() => {setDisabled(true); 
              // setVisible1(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
                                    setHighlightIndex([-1]);
              // setTimeout(()=>setVisible1(true), wait); 
              // setTimeout(()=>setVisible2(true), wait+1000); 
              // setTimeout(()=>setHighlightIndex(9), wait+1000);
              // setTimeout(()=>setVisible3(true), wait+2000);
              // setTimeout(()=>setHighlightIndex(71), wait+2000);  
              // setTimeout(()=>setVisible4(true), wait+3000); 
              // setTimeout(()=>setHighlightIndex(101), wait+3000);  
              // setTimeout(()=>setVisible5(true), wait+4000);
              // setTimeout(()=>setHighlightIndex(260), wait+4000);  
              // setTimeout(()=>setDisabled(false),wait+4500);
              // setTimeout(()=>setHighlightIndex(-1), wait+4500); 
            }} 
            onAnimationEnd={()=> {
              setAnimationBool(false);
              // setTimeout(()=>setVisible1(true), wait); 
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
             barSize={10} >
             {/* fill={barColor} */}
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={highlightIndex.indexOf(index)>0 ? "red" : barColor}/>
              ))
              // fill={index === highlightIndex ? "red" : barColor}
            }
      </ Bar>
      <Line name="7-day average" id='14-line' type='monotone' dataKey='caseRateMean' dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={3500} 
            stroke={lineColor} strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      {/* <Brush dataKey='t'/> */}
      </ComposedChart>
      <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/>
      {/* <Transition visible={visible1} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-28rem', left:'10rem', padding: '1rem', fontSize: '0.8rem'}}> Jan. 21: <br /> 1st case in the U.S. confirmed in Washington</Message>
      </Transition>
      <Transition visible={visible2} animation='scale' duration={300}>
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

function DeathChart(props){
  const [playCount, setPlayCount] = useState(0);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const data = props.data;
  const barColor = props.barColor;
  const lineColor = props.lineColor;
  const ticks = props.ticks;
  const tickFormatter = props.tickFormatter;
  // const playCount = props.playCount;

  // const ytickFormatter = props.ytickFormatter;
  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };

  useEffect(() =>{
    setAnimationBool(playCount>-1);
    // console.log("change ",playCount);
    console.log("animation ", animationBool);
  },[playCount])


  var wait=4000;
  // useEffect (() => {
  //   setTimeout(() => setVisible1(true), wait);
  //   setTimeout(() => setVisible2(true), wait+1000);
  //   setTimeout(() => setVisible3(true), wait+2000);
  //   setTimeout(() => setVisible4(true), wait+3000);
  //   setTimeout(() => setVisible5(true), wait+4000);
  //   setTimeout(() => setDisabled(false), wait+5000);
  // }, [])

  // const handlePlay = () => {
  //   setPlayCount(playCount+1); 
  //   setTimeout(()=>setVisible1(true), 5000); 
  //   setTimeout(()=>setVisible2(true), 6000); 
  //   setVisible1(false);
  //   setVisible2(false);
  // }

  // console.log("data", data["_nation"][0].t);

  return(
    <Grid.Column style={{paddingTop:28, width: 850, height: 500}}>
    <center> <Header.Content x={0} y={20} style={{fontSize: '18pt', paddingLeft: 0, paddingBottom: 5, fontWeight: 600}}>Average Daily COVID-19 Deaths </Header.Content> </center>

    {/* <Grid.Row position='relative'> */}
      <ComposedChart width={830} height={420} data={data}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter}/>
      <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
      {/* <Legend /> */}
      <Bar name="New cases" dataKey='dailyMortality' barSize={18} 
            isAnimationActive={animationBool} 
            onAnimationStart={() => {setDisabled(true); setVisible1(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
              setTimeout(()=>setVisible1(true), wait); 
              setTimeout(()=>setVisible2(true), wait+1000); 
              setTimeout(()=>setVisible3(true), wait+2000); 
              setTimeout(()=>setVisible4(true), wait+3000); 
              setTimeout(()=>setVisible5(true), wait+4000); 
              setTimeout(()=>setDisabled(false),wait+2500)
            }} 
            onAnimationEnd={()=>setAnimationBool(false)} 
            animationDuration={5500} 
            fill={barColor} barSize={2.1} />
      <Line name="7-day average" type='monotone' dataKey='mortalityMean' dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={5500} 
            // animationBegin={500} 
            strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      </ComposedChart>
      <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/>
      {/* </Grid.Row>    */}

      {/* <Grid.Row columns={5}>
      <Grid.Column >                                                                    */}
      <Transition visible={visible1} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-30rem', left:'10rem', padding: '1rem', fontSize: '0.8rem'}}> Feb. 6: <br /> First death in US </Message>
      </Transition>
      {/* </Grid.Column> 
      <Grid.Column >              */}
      <Transition visible={visible2} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-32rem', left:'18rem', padding: '1rem', fontSize: '0.8rem'}}> May. 27: <br /> Coronavirus deaths in the U.S. passed 100,000 </Message>
      </Transition> 
      <Transition visible={visible3} animation='scale' duration={300}>
      <Message compact style={{ width: '8rem', top:'-34rem', left:'36rem', padding: '1rem', fontSize: '0.8rem'}}> Sep. 22: <br /> Coronavirus deaths in the U.S. passed 200,000 </Message>
      </Transition> 
      {/* <Transition visible={visible4} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-42rem', left:'30rem', padding: '1rem', fontSize: '0.8rem'}}> July. 19: <br /> Second wave peaked at 66,692 new cases <br />(7-day avg.) </Message>
      </Transition> 
      <Transition visible={visible5} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-52rem', left:'45rem', padding: '1rem', fontSize: '0.8rem'}}> Dec. 17: <br /> Third wave peaked at 222,786 new cases <br />(7-day avg.) </Message>
      </Transition>  */}
      
      </Grid.Column>
  );
}


export default function NationalReport(props) {
  const characterRef = createRef();
  const [activeCharacter, setActiveCharacter] = useState('');
  const [data, setData] = useState();
  const [date, setDate] = useState('');
  const [fips, setFips] = useState('13');
  const [nationalDemog, setNationalDemog] = useState();

  const [dataTS, setDataTS] = useState();
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
              <Header as='h2' style={{color: mortalityColor[1],textAlign:'center', fontWeight: 400, fontSize: "24pt", paddingTop: 17, paddingLeft: "17rem", paddingRight: "6rem"}}>
                <Header.Content>
                <b> COVID-19 National Health Equity Report </b> 
                <Header.Subheader style={{fontWeight:300,fontSize:"20pt", paddingTop:16, color: mortalityColor[1]}}> 
                <b>{monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}</b>
                  
                </Header.Subheader>
                </Header.Content>
              </Header>
            </div>
            <div style={{paddingTop:36,textAlign:'justify', fontSize:"14pt", lineHeight: "16pt",paddingBottom:30, paddingLeft: "12em", paddingRight: "2em"}}>
              <Header.Content style={{fontFamily:'lato', fontSize: "14pt", width: 810}}>
              The United States has reported {numberWithCommas(data['_nation']['casesfig'])} cases, the highest number of any country in the world. 
              The number of cases and deaths differ substantially across American communities. The COVID-19 U.S. Health Equity 
              Report documents how COVID-19 cases and deaths are changing over time, geography, and demography. The report will 
              be released each week to keep track of how COVID-19 is impacting U.S. communities.
              </Header.Content>
            </div>
            <div id="cases" style = {{height: 45}}> </div>
            <center style={{paddingLeft: 190}}><Divider style={{width: 900}}/> </center>
            <div style={{paddingBottom:'0em', paddingLeft: "12rem", paddingRight: "1rem"}}>
              {/* <Header as='h2' style={{color: mortalityColor[1], textAlign:'center',fontSize:"22pt", paddingTop: 30}}>
                <Header.Content>
                  How have cases in the U.S. changed over time?
                </Header.Content>
              </Header> */}
                <Grid>
                    <Grid.Row column = {1}>
                    <Grid.Row column = {1} style={{textAlign:'center', width: 800, paddingTop: '2rem', paddingLeft: '10rem'}}>
                    <Header.Content x={0} y={20} style={{ fontSize: '18pt', marginLeft: 0, paddingBottom: 0, fontWeight: 600}}>Average Daily COVID-19 Cases </Header.Content>
                    </ Grid.Row>
                    {/* <Grid.Row style={{textAlign:'center', paddingLeft: '22rem', paddingRight: '22rem'}}>                
                    <Menu pointing secondary widths={3}> 
                    <Menu.Item name='All' />
                    active={activeItem==='all'} onClick={setActiveItem('all')}
                    <Menu.Item name='90 Days' />
                    <Menu.Item name='14 Days' />
                    </ Menu>
                    </ Grid.Row>
                    <Grid.Row columns={1}> */}
                    <CaseSection data={dataTS} barColor={mortalityColor[0]} lineColor={[mortalityColor[1]]} 
                               tickFormatter={caseTickFmt} />
                          {/* <Accordion style = {{paddingTop: "19px"}}>
                            <Accordion.Title
                              active={accstate.activeIndex === 0}
                              index={0}
                              onClick={dealClick}
                              style ={{color: "#397AB9", fontSize: 19, paddingLeft: 30}}

                            >
                            <Icon id = "deaths" name='dropdown' />
                              About the data
                            </Accordion.Title>
                              <Accordion.Content active={accstate.activeIndex === 0}>
                              <Header  as='h2' style={{fontWeight: 400, paddingLeft: 35, paddingRight: 30, paddingBottom: 20}}>
                                  <Header.Content style={{fontSize: "14pt"}}>
                                    <Header.Subheader style={{color: '#000000', width: 800, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
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
                              </Accordion.Content>

                            </Accordion>  */}
                          {/* </div> */}
                        {/* </ Grid.Column> */}
                    </Grid.Row>
                </Grid>
            </div>
            <div id="deaths" style = {{height: 45}}> </div>

            <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center>
            <div style={{paddingBottom:'0em', paddingLeft: "12rem", paddingRight: "1em"}}>
            <Header as='h2' style={{color: mortalityColor[1], textAlign:'center', fontSize:"22pt", paddingTop: 30}}>
                <Header.Content>
                  How have deaths in the U.S. changed over time? 
                </Header.Content>
              </Header> 

              <Grid>
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

                      } />
                          {/* <Accordion style = {{paddingTop: "19px"}}>
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
                            </Accordion.Content>

                          </Accordion>  */}
                          {/* </Grid.Column>  */}
                    </Grid.Row>
                </Grid>

            </div>  
            <div id="half" style = {{height: 45}}> </div>

            <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center>
            <div style={{paddingTop:'1em', paddingLeft: "14em", paddingRight: "2em"}}>
              <Header as='h2' style={{paddingTop: 17, textAlign:'center',fontSize:"22pt", color: mortalityColor[1]}}>
                <Header.Content>
                  Where are cases and deaths occurring?
                  <Header.Subheader style={{color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 32, paddingRight: 30}}>

                    Cases and deaths attributed to COVID-19 are rapidly rising in some counties. Additionally, 
                    the geographic distribution of the hardest-hit counties is changing, with the virus shifting from 
                    the Northeast toward the Southeast and Southwest.
                    Approximately 50% of new cases on {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()} in 
                    the United States were attributed to {(states50[0]["statenames"].split(",")).length} states: <br/>

                    <br/>
                  <center> <b style = {{fontSize:"18pt"}}>{states50[0]["statenames"]}</b> </center>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </div>
            <div id="who" style = {{height: 45}}> </div>

            <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center>
            <div style={{paddingTop:'1em', paddingLeft: "14em", paddingRight: "2em"}}>
              <Header as='h2' style={{paddingTop: 17, textAlign:'center',fontSize:"22pt", color: mortalityColor[1]}}>
                <Header.Content>
                  Who is impacted by COVID-19?
                  <Header.Subheader style={{color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 32, paddingRight: 30}}>
                  <center> <b style= {{fontSize: "18pt"}}>Cases and deaths by race, age, and sex </b> </center> 
                  <br/><br/>
                  While people of all races, ages, and sex are impacted by COVID-19, some subgroups are disproportionally 
                  affected. {Object.keys(demog_descriptives['Race'][0])[0]} are seeing the largest mortality rate, with {(demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]]).toFixed(0)} cases per 100,000 individuals, 
                  around {(demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[0]] / demog_descriptives['Race'][0][Object.keys(demog_descriptives['Race'][0])[1]]).toFixed(0)} times that of {Object.keys(demog_descriptives['Race'][0])[1]}, the groups with the lowest mortality rate. 
                  Deaths are highest in the {Object.keys(demog_descriptives['Age'][0])[0]} age group ({(demog_descriptives['Age'][0][Object.keys(demog_descriptives['Age'][0])[0]]).toFixed(0)} deaths per 100,000), 
                  followed by {Object.keys(demog_descriptives['Age'][0])[1]} age group ({(demog_descriptives['Age'][0][Object.keys(demog_descriptives['Age'][0])[1]]).toFixed(0)} deaths per 100,000). 
                  Those {(Object.keys(demog_descriptives['Age'][0])[3] === "0 - 4" && Object.keys(demog_descriptives['Age'][0])[2] === "5 - 17") ? " under 18 ": "in " + (Object.keys(demog_descriptives['Age'][0])[3] + " and " + Object.keys(demog_descriptives['Age'][0])[2] + " age group ")} are, however, 
                  experiencing the lowest mortality from COVID-19.
                    
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </div>

              {/* <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center> */}
              <Grid>
                
                <Grid.Row columns = {1} style = {{width: 1000}}>
                  <Grid.Column style = {{width: 450, paddingLeft: 180}}>
                    <div style={{paddingTop:'0em'}}>
                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "2em", paddingRight: "1em", paddingBottom: 0}}>
                        <center> <b style= {{fontSize: "18pt"}}>Cases and Deaths by race</b> </center> 
                        <br/>
                        <br/>         
                      </Header.Subheader>
                    </div>
                  </Grid.Column>
                  
                </Grid.Row>
                <Grid.Row style = {{width: 1000, paddingLeft: 300, paddingTop:'1em'}}>
                  <svg width = "1000" height = "40">
                    <rect x = {40} y = {12} width = "20" height = "20" style = {{fill: casesColor[1], strokeWidth:1, stroke: casesColor[1]}}/>
                    <text x = {65} y = {30} style = {{ fontSize: "19px"}}> Percent of Cases</text>
                    <rect x = {250} y = {12} width = "20" height = "20" style = {{fill: mortalityColor[1], strokeWidth:1, stroke: mortalityColor[1]}}/>
                    <text x = {275} y = {30} style = {{ fontSize: "19px"}}> Percent of Deaths </text>
                    <rect x = {455} y = {12} width = "20" height = "20" style = {{fill: "#D3D3D3", strokeWidth:1, stroke: "#D3D3D3"}}/>
                    <text x = {480} y = {30} style = {{ fontSize: "19px"}}> Percent of Population</text>
                  </svg>
                </Grid.Row>
                {/* <Grid.Row columns = {2} style = {{width: 1000}}>
                  <Grid.Column style = {{width: 450, paddingLeft: 300}}>
                    <div style={{paddingTop:'1em'}}>
                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "2em", paddingRight: "1em", paddingBottom: 0}}>
                        <center> <b style= {{fontSize: "18pt"}}>Cases by race</b> </center> 
                        <br/>
                        <br/>         
                      </Header.Subheader>
                    </div>
                  </Grid.Column>
                  <Grid.Column style = {{width: 450, paddingLeft: 145}}>
                    <div style={{paddingTop:'1em'}}>
                        <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "2em", paddingRight: "1em", paddingBottom: 0}}>
                          <center> <b style= {{fontSize: "18pt"}}>Deaths by race</b> </center> 
                          <br/>
                          <br/>         
                        </Header.Subheader>
                      </div>
                  </Grid.Column>
                </Grid.Row> */}
                {/* <div style={{paddingLeft: "6em", paddingRight: "0em"}}></div> */}

                <Grid.Row columns = {1} style = {{width: 1000, paddingTop: 0}}>
                  <Grid.Column style = {{width: 1000, paddingLeft: 130}}>
                      <div style={{paddingLeft: "0em", paddingRight: "0em"}}>
                      <VictoryChart
                                theme={VictoryTheme.material}
                                width={1000}
                                height={500}
                                domainPadding={{x:80}}
                                minDomain={{y: props.ylog?1:0}}
                                padding={{left: 200, right: 80, top: 30, bottom: 50}}
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
                                <VictoryGroup offset={45}>

                                <VictoryBar
                                  
                                  barWidth={35}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                                  data={[
                                    {key: nationalDemog['Race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Hispanic'][0]['percentCases']},
                                    {key: nationalDemog['Race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['American Natives'][0]['percentCases']},
                                    {key: nationalDemog['Race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Asian'][0]['percentCases']},
                                    {key: nationalDemog['Race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['African American'][0]['percentCases']},
                                    {key: nationalDemog['Race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['White'][0]['percentCases']},
                                    
                                      


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
                                  
                                  barWidth={35}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                                  data={[
                                    {key: nationalDemog['Race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Hispanic'][0]['percentDeaths']},
                                    {key: nationalDemog['Race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['American Natives'][0]['percentDeaths']},
                                    {key: nationalDemog['Race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Asian'][0]['percentDeaths']},
                                    {key: nationalDemog['Race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['African American'][0]['percentDeaths']},
                                    {key: nationalDemog['Race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['White'][0]['percentDeaths']},
                                    
                                      


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
                                  
                                  barWidth={35}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                                  data={[
                                    {key: nationalDemog['Race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Hispanic'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['American Natives'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Asian'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['African American'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['White'][0]['percentPop']},
                                    
                                      


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

                              {/* <Header.Content style = {{width: 1000}}>
                                  <Header.Content style={{textOrientation: "sideways", fontWeight: 300, paddingLeft: 400, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                                  <b>Percentage of COVID-19 Deaths and Population</b>
                                  </Header.Content>
                              </Header.Content> */}
                    </div>
                    <Accordion style = {{paddingTop: 20, paddingLeft: 100, paddingBottom: 50}} defaultActiveIndex={1} panels={[
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
                                          Race groups are non-Hispanic
                                        </Header.Subheader>
                                      </Header.Content>
                                    </Header>
                                ),
                              },
                          }
                      ]

                      } />
                  </Grid.Column>
                </Grid.Row>
                
                {/* <Grid.Row columns = {2} style = {{width: 1000, paddingTop: 0}}>
                  <Grid.Column style = {{width: 450, paddingLeft: 100}}>
                  <div style={{paddingLeft: "6em", paddingRight: "0em"}}>

                      <VictoryChart
                                theme={VictoryTheme.material}
                                width={450}
                                height={300}
                                domainPadding={25}
                                minDomain={{y: props.ylog?1:0}}
                                padding={{left: 180, right: 40, top: 15, bottom: 1}}
                                style = {{fontSize: "14pt"}}
                                containerComponent={<VictoryContainer responsive={false}/>}
                              >
                                <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                                <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                <VictoryGroup offset={25}>

                                <VictoryBar
                                  horizontal
                                  barWidth={20}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                                  data={[
                                    {key: nationalDemog['Race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Hispanic'][0]['percentCases']},
                                    {key: nationalDemog['Race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['American Natives'][0]['percentCases']},
                                    {key: nationalDemog['Race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Asian'][0]['percentCases']},
                                    {key: nationalDemog['Race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['African American'][0]['percentCases']},
                                    {key: nationalDemog['Race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['White'][0]['percentCases']},
                                    
                                      


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
                                
                                <VictoryBar
                                  horizontal
                                  barWidth={20}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
                                  data={[
                                    {key: nationalDemog['Race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Hispanic'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['American Natives'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Asian'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['African American'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['White'][0]['percentPop']},
                                    
                                      


                                  ]}
                                  labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
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
                    
                      <div style={{paddingLeft: "6em", paddingRight: "0em"}}>
                      
                      <VictoryChart
                                theme={VictoryTheme.material}
                                width={450}
                                height={300}
                                domainPadding={23}
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
                                    {key: nationalDemog['Race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Hispanic'][0]['percentDeaths']},
                                    {key: nationalDemog['Race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['American Natives'][0]['percentDeaths']},
                                    {key: nationalDemog['Race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Asian'][0]['percentDeaths']},
                                    {key: nationalDemog['Race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['African American'][0]['percentDeaths']},
                                    {key: nationalDemog['Race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['White'][0]['percentDeaths']},
                                    
                                      


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
                                    {key: nationalDemog['Race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Hispanic'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['American Natives'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Asian'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['African American'][0]['percentPop']},
                                    {key: nationalDemog['Race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['White'][0]['percentPop']},
                                    
                                      


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
                                  <Header.Content style={{ fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                                  <b>Percentage of COVID-19 Deaths and Population</b>
                                  </Header.Content>
                              </Header.Content>
                    </div>
                  </Grid.Column>
                </Grid.Row> */}
              </Grid>

              <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 0}}/> </center>

              <Grid style = {{paddingTop: 0, paddingBottom: 0}}>
                <Grid.Row style = {{width: 1000, paddingLeft: 350}}>
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
                        <br/>         
                      </Header.Subheader>
                  </Grid.Column>
                  <Grid.Column style = {{width: 450, paddingLeft: 145}}>
                        <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "2em", paddingRight: "1em", paddingBottom: -10}}>
                          <center> <b style= {{fontSize: "18pt"}}>Deaths by Age</b> </center> 
                          <br/>
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
                              {key: nationalDemog['Age'][0]['0 - 4'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['0 - 4'][0]['percentCases']},
                              {key: nationalDemog['Age'][0]['5 - 17'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['5 - 17'][0]['percentCases']},
                              {key: nationalDemog['Age'][0]['18 - 29'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['18 - 29'][0]['percentCases']},
                              {key: nationalDemog['Age'][0]['30 - 39'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['30 - 39'][0]['percentCases']},
                              {key: nationalDemog['Age'][0]['40 - 49'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['40 - 49'][0]['percentCases']},
                              {key: nationalDemog['Age'][0]['50 - 64'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['50 - 64'][0]['percentCases']},
                              {key: nationalDemog['Age'][0]['65 - 74'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['65 - 74'][0]['percentCases']},
                              {key: nationalDemog['Age'][0]['75 - 84'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['75 - 84'][0]['percentCases']},
                              {key: nationalDemog['Age'][0]['85+'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['85+'][0]['percentCases']},
                                 


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
                              {key: nationalDemog['Age'][0]['0 - 4'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['0 - 4'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['5 - 17'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['5 - 17'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['18 - 29'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['18 - 29'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['30 - 39'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['30 - 39'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['40 - 49'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['40 - 49'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['50 - 64'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['50 - 64'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['65 - 74'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['65 - 74'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['75 - 84'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['75 - 84'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['85+'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['85+'][0]['percentPop']},
                                 


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
                              {key: nationalDemog['Age'][0]['0 - 4'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['0 - 4'][0]['percentDeaths']},
                              {key: nationalDemog['Age'][0]['5 - 17'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['5 - 17'][0]['percentDeaths']},
                              {key: nationalDemog['Age'][0]['18 - 29'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['18 - 29'][0]['percentDeaths']},
                              {key: nationalDemog['Age'][0]['30 - 39'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['30 - 39'][0]['percentDeaths']},
                              {key: nationalDemog['Age'][0]['40 - 49'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['40 - 49'][0]['percentDeaths']},
                              {key: nationalDemog['Age'][0]['50 - 64'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['50 - 64'][0]['percentDeaths']},
                              {key: nationalDemog['Age'][0]['65 - 74'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['65 - 74'][0]['percentDeaths']},
                              {key: nationalDemog['Age'][0]['75 - 84'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['75 - 84'][0]['percentDeaths']},
                              {key: nationalDemog['Age'][0]['85+'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['85+'][0]['percentDeaths']},
                                 


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
                              {key: nationalDemog['Age'][0]['0 - 4'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['0 - 4'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['5 - 17'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['5 - 17'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['18 - 29'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['18 - 29'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['30 - 39'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['30 - 39'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['40 - 49'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['40 - 49'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['50 - 64'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['50 - 64'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['65 - 74'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['65 - 74'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['75 - 84'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['75 - 84'][0]['percentPop']},
                              {key: nationalDemog['Age'][0]['85+'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['85+'][0]['percentPop']},
                                 


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
              </Grid>

              <div id="commu" style = {{height: 45}}> </div>

            <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 40}}/> </center>
            {true && <div style = {{ paddingLeft: "7em", paddingRight: "2em"}}>
              <Header as='h2' style={{color: '#b2b3b3', textAlign:'center',fontSize:"22pt", paddingTop: 32}}>
                <Header.Content  style={{fontSize:"22pt",color: mortalityColor[1], paddingLeft: 130}}>
                COVID-19 Across U.S. Communities
                  <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingRight: 25}}>
                    <center> <b style= {{fontSize: "18pt"}}>COVID-19 cases per 100,000 across the population characteristics of all the counties in the United States </b> </center> 
                    <br/>
                    <br/>
                    COVID-19 is affecting communities differently. Community-level factors such as urbanicity,  
                    socioeconomic status, race, and underlying medication conditions make some communities more 
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
          <Header as='h2' style={{paddingLeft: 80, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
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













              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:0, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                  <center> <b style= {{fontSize: "18pt"}}>COVID-19 by Community Vulnerability Index </b> </center> 
                  <br/>
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
                  <Accordion style = {{paddingTop: 100, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
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
                                    {key: nationalBarChart['caserate7day'][0]['CVI'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['CVI'][0]['measure']/nationalBarChart['caserate7day'][0]['CVI'][0]['measure'])*nationalBarChart['caserate7day'][0]['CVI'][0]['measure'] || 0},
                                    {key: nationalBarChart['caserate7day'][0]['CVI'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['CVI'][1]['measure']/nationalBarChart['caserate7day'][0]['CVI'][0]['measure'])*nationalBarChart['caserate7day'][0]['CVI'][0]['measure'] || 0},
                                    {key: nationalBarChart['caserate7day'][0]['CVI'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['CVI'][2]['measure']/nationalBarChart['caserate7day'][0]['CVI'][0]['measure'])*nationalBarChart['caserate7day'][0]['CVI'][0]['measure'] || 0},
                                    {key: nationalBarChart['caserate7day'][0]['CVI'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['CVI'][3]['measure']/nationalBarChart['caserate7day'][0]['CVI'][0]['measure'])*nationalBarChart['caserate7day'][0]['CVI'][0]['measure'] || 0},
                                    {key: nationalBarChart['caserate7day'][0]['CVI'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['CVI'][4]['measure']/nationalBarChart['caserate7day'][0]['CVI'][0]['measure'])*nationalBarChart['caserate7day'][0]['CVI'][0]['measure'] || 0}



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
                                  {key: nationalBarChart['covidmortality7day'][0]['CVI'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure']/nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['CVI'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['CVI'][1]['measure']/nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['CVI'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['CVI'][2]['measure']/nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['CVI'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['CVI'][3]['measure']/nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['CVI'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['CVI'][4]['measure']/nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['CVI'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center>


              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>Population in poverty</b> </center> 
                    <br/>
                    <br/>         

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
                  <Accordion style = {{paddingTop: 100, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                          This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                          per 100,000 residents by county ranking on percentage of population in poverty. 
                                          The y-axis displays percentage population in poverty rankings based on quintiles 
                                          (groups of 20%). The x-axis displays the average number of COVID-19 cases (top chart) 
                                          or deaths (bottom chart) per 100,000 that occurred in each group of counties ranked 
                                          by percentage population in poverty. The ranking classified counties into five groups 
                                          designed to be of equal size, so that the lowest quintile contains the counties with 
                                          values in the 0%-20% range for this county characteristic, and the highest quintile 
                                          contains counties with values in the 80%-100% range for this county characteristic. 
                                          Q2 indicates counties in the 20%-40% range, Q3 indicates counties in the 40%-60% range, 
                                          and Q4 indicates counties in the 60%-80% range.
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
                                  {key: nationalBarChart['caserate7day'][0]['poverty'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['poverty'][0]['measure']/nationalBarChart['caserate7day'][0]['poverty'][0]['measure'])*nationalBarChart['caserate7day'][0]['poverty'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['poverty'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['poverty'][1]['measure']/nationalBarChart['caserate7day'][0]['poverty'][0]['measure'])*nationalBarChart['caserate7day'][0]['poverty'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['poverty'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['poverty'][2]['measure']/nationalBarChart['caserate7day'][0]['poverty'][0]['measure'])*nationalBarChart['caserate7day'][0]['poverty'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['poverty'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['poverty'][3]['measure']/nationalBarChart['caserate7day'][0]['poverty'][0]['measure'])*nationalBarChart['caserate7day'][0]['poverty'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['poverty'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['poverty'][4]['measure']/nationalBarChart['caserate7day'][0]['poverty'][0]['measure'])*nationalBarChart['caserate7day'][0]['poverty'][0]['measure'] || 0}



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
                                  {key: nationalBarChart['covidmortality7day'][0]['poverty'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure']/nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['poverty'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['poverty'][1]['measure']/nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['poverty'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['poverty'][2]['measure']/nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['poverty'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['poverty'][3]['measure']/nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['poverty'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['poverty'][4]['measure']/nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['poverty'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center>

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>Metropolitan Status</b> </center> 
                    <br/>
                    <br/>         

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
                  <Accordion style = {{paddingTop: 40, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                          This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                          per 100,000 residents by metropolitan status (y-axis). Inner city counties have {">"} 
                                          1 million population or contain the entire or large part of the population of the 
                                          largest principle city. Large suburban counties have a population {">"} 1 million, but 
                                          do not qualify as inner city. Small suburban counties have a population of 250,000-999,999. 
                                          Small cities have populations {"<"} 250,000 and are near large cities. Smallest city counties 
                                          have an urbanized area with population between 10,000-49,999. Remote rural counties 
                                          have populations less than 10,000 individuals. This urban-rural classification comes 
                                          from the National Center for Health Statistics.
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
                                  {key: nationalBarChart['caserate7day'][0]['urbanrural'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure']/nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['urbanrural'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['urbanrural'][1]['measure']/nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['urbanrural'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['urbanrural'][2]['measure']/nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['urbanrural'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['urbanrural'][3]['measure']/nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['urbanrural'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['urbanrural'][4]['measure']/nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['urbanrural'][5]['label'], 'value': (nationalBarChart['caserate7day'][0]['urbanrural'][5]['measure']/nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['caserate7day'][0]['urbanrural'][0]['measure'] || 0}



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
                                  {key: nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure']/nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['urbanrural'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['urbanrural'][1]['measure']/nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['urbanrural'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['urbanrural'][2]['measure']/nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['urbanrural'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['urbanrural'][3]['measure']/nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['urbanrural'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['urbanrural'][4]['measure']/nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['urbanrural'][5]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['urbanrural'][5]['measure']/nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['urbanrural'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center>

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>Region</b> </center> 
                    <br/>
                    <br/>         

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
                  <Accordion style = {{paddingTop: 30, paddingLeft: 80}} defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the dataRegionRegionRegion</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                    <Header as='h2' style={{fontWeight: 400, paddingLeft: 0, paddingTop: 0, paddingBottom: 20}}>
                                      <Header.Content  style={{fontSize: "14pt"}}>
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        RegionRegionRegionRegionRegionRegionRegionRegionRegionRegionRegionRegionRegionRegionRegion 
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
                                  {key: nationalBarChart['caserate7day'][0]['region'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['region'][0]['measure']/nationalBarChart['caserate7day'][0]['region'][0]['measure'])*nationalBarChart['caserate7day'][0]['region'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['region'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['region'][1]['measure']/nationalBarChart['caserate7day'][0]['region'][0]['measure'])*nationalBarChart['caserate7day'][0]['region'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['region'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['region'][2]['measure']/nationalBarChart['caserate7day'][0]['region'][0]['measure'])*nationalBarChart['caserate7day'][0]['region'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['region'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['region'][3]['measure']/nationalBarChart['caserate7day'][0]['region'][0]['measure'])*nationalBarChart['caserate7day'][0]['region'][0]['measure'] || 0},
                                  // {key: nationalBarChart['caserate7day'][0]['region'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['region'][4]['measure']/nationalBarChart['caserate7day'][0]['region'][0]['measure'])*nationalBarChart['caserate7day'][0]['region'][0]['measure'] || 0}



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
                                  {key: nationalBarChart['covidmortality7day'][0]['region'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['region'][0]['measure']/nationalBarChart['covidmortality7day'][0]['region'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['region'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['region'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['region'][1]['measure']/nationalBarChart['covidmortality7day'][0]['region'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['region'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['region'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['region'][2]['measure']/nationalBarChart['covidmortality7day'][0]['region'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['region'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['region'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['region'][3]['measure']/nationalBarChart['covidmortality7day'][0]['region'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['region'][0]['measure'] || 0},
                                  // {key: nationalBarChart['covidmortality7day'][0]['region'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['region'][4]['measure']/nationalBarChart['covidmortality7day'][0]['region'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['region'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>African American population</b> </center> 
                    <br/>
                    <br/>         

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
                  <Accordion style = {{paddingTop: 100, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by percentage African American population ranking. The y-axis 
                                        displays percentage African American population rankings based on quintiles (groups 
                                        of 20%). The x-axis displays the average number of COVID-19 cases (top chart) or 
                                        deaths (bottom chart) per 100,000 that occurred in each group of counties ranked 
                                        by percentage percentage African American. The ranking classified counties into 
                                        five groups designed to be of equal size, so that the lowest quintile contains 
                                        the counties with values in the 0%-20% range for this county characteristic, and 
                                        the highest quintile contains counties with values in the 80%-100% range for this 
                                        county characteristic. Q2 indicates counties in the 20%-40% range, Q3 indicates 
                                        counties in the 40%-60% range, and Q4 indicates counties in the 60%-80% range.
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
                                  {key: nationalBarChart['caserate7day'][0]['black'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['black'][0]['measure']/nationalBarChart['caserate7day'][0]['black'][0]['measure'])*nationalBarChart['caserate7day'][0]['black'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['black'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['black'][1]['measure']/nationalBarChart['caserate7day'][0]['black'][0]['measure'])*nationalBarChart['caserate7day'][0]['black'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['black'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['black'][2]['measure']/nationalBarChart['caserate7day'][0]['black'][0]['measure'])*nationalBarChart['caserate7day'][0]['black'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['black'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['black'][3]['measure']/nationalBarChart['caserate7day'][0]['black'][0]['measure'])*nationalBarChart['caserate7day'][0]['black'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['black'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['black'][4]['measure']/nationalBarChart['caserate7day'][0]['black'][0]['measure'])*nationalBarChart['caserate7day'][0]['black'][0]['measure'] || 0}



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
                                  {key: nationalBarChart['covidmortality7day'][0]['black'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['black'][0]['measure']/nationalBarChart['covidmortality7day'][0]['black'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['black'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['black'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['black'][1]['measure']/nationalBarChart['covidmortality7day'][0]['black'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['black'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['black'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['black'][2]['measure']/nationalBarChart['covidmortality7day'][0]['black'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['black'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['black'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['black'][3]['measure']/nationalBarChart['covidmortality7day'][0]['black'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['black'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['black'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['black'][4]['measure']/nationalBarChart['covidmortality7day'][0]['black'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['black'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>COVID-19 by Residential Segregation Index</b> </center> 
                    <br/>
                    <br/>         

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
                  <Accordion style = {{paddingTop: 100, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by residential segregation index. The y-axis displays residential 
                                        segregation rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by residential segregation. The 
                                        ranking classified counties into five groups designed to be of equal size, so that 
                                        the lowest quintile contains the counties with values in the 0%-20% range for this 
                                        county characteristic, and the highest quintile contains counties with values in 
                                        the 80%-100% range for this county characteristic. Q2 indicates counties in the 
                                        20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties 
                                        in the 60%-80% range.
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
                                  {key: nationalBarChart['caserate7day'][0]['resSeg'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['resSeg'][0]['measure']/nationalBarChart['caserate7day'][0]['resSeg'][0]['measure'])*nationalBarChart['caserate7day'][0]['resSeg'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['resSeg'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['resSeg'][1]['measure']/nationalBarChart['caserate7day'][0]['resSeg'][0]['measure'])*nationalBarChart['caserate7day'][0]['resSeg'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['resSeg'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['resSeg'][2]['measure']/nationalBarChart['caserate7day'][0]['resSeg'][0]['measure'])*nationalBarChart['caserate7day'][0]['resSeg'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['resSeg'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['resSeg'][3]['measure']/nationalBarChart['caserate7day'][0]['resSeg'][0]['measure'])*nationalBarChart['caserate7day'][0]['resSeg'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['resSeg'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['resSeg'][4]['measure']/nationalBarChart['caserate7day'][0]['resSeg'][0]['measure'])*nationalBarChart['caserate7day'][0]['resSeg'][0]['measure'] || 0}



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
                                  {key: nationalBarChart['covidmortality7day'][0]['resSeg'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure']/nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['resSeg'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['resSeg'][1]['measure']/nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['resSeg'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['resSeg'][2]['measure']/nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['resSeg'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['resSeg'][3]['measure']/nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['resSeg'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['resSeg'][4]['measure']/nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['resSeg'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>COVID-19 by Underlying Comorbidity</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>

              {black && <Grid>
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
                  <Accordion style = {{paddingTop: 100, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by residential segregation index. The y-axis displays residential 
                                        segregation rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by residential segregation. The 
                                        ranking classified counties into five groups designed to be of equal size, so that 
                                        the lowest quintile contains the counties with values in the 0%-20% range for this 
                                        county characteristic, and the highest quintile contains counties with values in 
                                        the 80%-100% range for this county characteristic. Q2 indicates counties in the 
                                        20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties 
                                        in the 60%-80% range.
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
                                  {key: nationalBarChart['caserate7day'][0]['any condition'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['any condition'][0]['measure']/nationalBarChart['caserate7day'][0]['any condition'][0]['measure'])*nationalBarChart['caserate7day'][0]['any condition'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['any condition'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['any condition'][1]['measure']/nationalBarChart['caserate7day'][0]['any condition'][0]['measure'])*nationalBarChart['caserate7day'][0]['any condition'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['any condition'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['any condition'][2]['measure']/nationalBarChart['caserate7day'][0]['any condition'][0]['measure'])*nationalBarChart['caserate7day'][0]['any condition'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['any condition'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['any condition'][3]['measure']/nationalBarChart['caserate7day'][0]['any condition'][0]['measure'])*nationalBarChart['caserate7day'][0]['any condition'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['any condition'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['any condition'][4]['measure']/nationalBarChart['caserate7day'][0]['any condition'][0]['measure'])*nationalBarChart['caserate7day'][0]['any condition'][0]['measure'] || 0}



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
                                  {key: nationalBarChart['covidmortality7day'][0]['any condition'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure']/nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['any condition'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['any condition'][1]['measure']/nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['any condition'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['any condition'][2]['measure']/nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['any condition'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['any condition'][3]['measure']/nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['any condition'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['any condition'][4]['measure']/nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['any condition'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>COVID-19 by COPD</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>

              {black && <Grid>
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
                      
                      <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/copd.png' />
                  </div>
                  <Accordion style = {{paddingTop: 100, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by residential segregation index. The y-axis displays residential 
                                        segregation rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by residential segregation. The 
                                        ranking classified counties into five groups designed to be of equal size, so that 
                                        the lowest quintile contains the counties with values in the 0%-20% range for this 
                                        county characteristic, and the highest quintile contains counties with values in 
                                        the 80%-100% range for this county characteristic. Q2 indicates counties in the 
                                        20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties 
                                        in the 60%-80% range.
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
                                  {key: nationalBarChart['caserate7day'][0]['COPD'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['COPD'][0]['measure']/nationalBarChart['caserate7day'][0]['COPD'][0]['measure'])*nationalBarChart['caserate7day'][0]['COPD'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['COPD'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['COPD'][1]['measure']/nationalBarChart['caserate7day'][0]['COPD'][0]['measure'])*nationalBarChart['caserate7day'][0]['COPD'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['COPD'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['COPD'][2]['measure']/nationalBarChart['caserate7day'][0]['COPD'][0]['measure'])*nationalBarChart['caserate7day'][0]['COPD'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['COPD'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['COPD'][3]['measure']/nationalBarChart['caserate7day'][0]['COPD'][0]['measure'])*nationalBarChart['caserate7day'][0]['COPD'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['COPD'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['COPD'][4]['measure']/nationalBarChart['caserate7day'][0]['COPD'][0]['measure'])*nationalBarChart['caserate7day'][0]['COPD'][0]['measure'] || 0}



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
                                  {key: nationalBarChart['covidmortality7day'][0]['COPD'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure']/nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['COPD'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['COPD'][1]['measure']/nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['COPD'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['COPD'][2]['measure']/nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['COPD'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['COPD'][3]['measure']/nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['COPD'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['COPD'][4]['measure']/nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['COPD'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>COVID-19 by CKD</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>

              {black && <Grid>
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
                      
                      <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/ckd.png' />
                  </div>
                  <Accordion style = {{paddingTop: 100, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by residential segregation index. The y-axis displays residential 
                                        segregation rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by residential segregation. The 
                                        ranking classified counties into five groups designed to be of equal size, so that 
                                        the lowest quintile contains the counties with values in the 0%-20% range for this 
                                        county characteristic, and the highest quintile contains counties with values in 
                                        the 80%-100% range for this county characteristic. Q2 indicates counties in the 
                                        20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties 
                                        in the 60%-80% range.
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
                                  {key: nationalBarChart['caserate7day'][0]['CKD'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['CKD'][0]['measure']/nationalBarChart['caserate7day'][0]['CKD'][0]['measure'])*nationalBarChart['caserate7day'][0]['CKD'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['CKD'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['CKD'][1]['measure']/nationalBarChart['caserate7day'][0]['CKD'][0]['measure'])*nationalBarChart['caserate7day'][0]['CKD'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['CKD'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['CKD'][2]['measure']/nationalBarChart['caserate7day'][0]['CKD'][0]['measure'])*nationalBarChart['caserate7day'][0]['CKD'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['CKD'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['CKD'][3]['measure']/nationalBarChart['caserate7day'][0]['CKD'][0]['measure'])*nationalBarChart['caserate7day'][0]['CKD'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['CKD'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['CKD'][4]['measure']/nationalBarChart['caserate7day'][0]['CKD'][0]['measure'])*nationalBarChart['caserate7day'][0]['CKD'][0]['measure'] || 0}



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
                                  {key: nationalBarChart['covidmortality7day'][0]['CKD'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure']/nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['CKD'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['CKD'][1]['measure']/nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['CKD'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['CKD'][2]['measure']/nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['CKD'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['CKD'][3]['measure']/nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['CKD'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['CKD'][4]['measure']/nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['CKD'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>COVID-19 by diabetes 2018</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>

              {black && <Grid>
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
                      
                      <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/diabetes.png' />
                  </div>
                  <Accordion style = {{paddingTop: 100, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by residential segregation index. The y-axis displays residential 
                                        segregation rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by residential segregation. The 
                                        ranking classified counties into five groups designed to be of equal size, so that 
                                        the lowest quintile contains the counties with values in the 0%-20% range for this 
                                        county characteristic, and the highest quintile contains counties with values in 
                                        the 80%-100% range for this county characteristic. Q2 indicates counties in the 
                                        20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties 
                                        in the 60%-80% range.
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
                  <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content style = {{paddingLeft: 0, width: 500}}>
                      COVID-19 Cases by <br/> Percentage of Population with diabetes 2018
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
                                  {key: nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure']/nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure'])*nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['diabetes 2018'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['diabetes 2018'][1]['measure']/nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure'])*nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['diabetes 2018'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['diabetes 2018'][2]['measure']/nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure'])*nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['diabetes 2018'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['diabetes 2018'][3]['measure']/nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure'])*nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['diabetes 2018'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['diabetes 2018'][4]['measure']/nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure'])*nationalBarChart['caserate7day'][0]['diabetes 2018'][0]['measure'] || 0}



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
                          COVID-19 Deaths by <br/> Percentage of Population with diabetes 2018
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
                                  {key: nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure']/nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['diabetes 2018'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['diabetes 2018'][1]['measure']/nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['diabetes 2018'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['diabetes 2018'][2]['measure']/nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['diabetes 2018'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['diabetes 2018'][3]['measure']/nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['diabetes 2018'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['diabetes 2018'][4]['measure']/nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['diabetes 2018'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>COVID-19 by heart disease</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>

              {black && <Grid>
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
                      
                      <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/heartdisease.png' />
                  </div>
                  <Accordion style = {{paddingTop: 100, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by residential segregation index. The y-axis displays residential 
                                        segregation rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by residential segregation. The 
                                        ranking classified counties into five groups designed to be of equal size, so that 
                                        the lowest quintile contains the counties with values in the 0%-20% range for this 
                                        county characteristic, and the highest quintile contains counties with values in 
                                        the 80%-100% range for this county characteristic. Q2 indicates counties in the 
                                        20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties 
                                        in the 60%-80% range.
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
                  <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content style = {{paddingLeft: 0, width: 500}}>
                      COVID-19 Cases by <br/> Percentage of Population with heart disease
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
                                  {key: nationalBarChart['caserate7day'][0]['heart disease'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['heart disease'][0]['measure']/nationalBarChart['caserate7day'][0]['heart disease'][0]['measure'])*nationalBarChart['caserate7day'][0]['heart disease'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['heart disease'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['heart disease'][1]['measure']/nationalBarChart['caserate7day'][0]['heart disease'][0]['measure'])*nationalBarChart['caserate7day'][0]['heart disease'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['heart disease'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['heart disease'][2]['measure']/nationalBarChart['caserate7day'][0]['heart disease'][0]['measure'])*nationalBarChart['caserate7day'][0]['heart disease'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['heart disease'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['heart disease'][3]['measure']/nationalBarChart['caserate7day'][0]['heart disease'][0]['measure'])*nationalBarChart['caserate7day'][0]['heart disease'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['heart disease'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['heart disease'][4]['measure']/nationalBarChart['caserate7day'][0]['heart disease'][0]['measure'])*nationalBarChart['caserate7day'][0]['heart disease'][0]['measure'] || 0}



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
                          COVID-19 Deaths by <br/> Percentage of Population with heart disease
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
                                  {key: nationalBarChart['covidmortality7day'][0]['heart disease'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure']/nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['heart disease'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['heart disease'][1]['measure']/nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['heart disease'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['heart disease'][2]['measure']/nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['heart disease'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['heart disease'][3]['measure']/nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['heart disease'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['heart disease'][4]['measure']/nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['heart disease'][0]['measure'] || 0}



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

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>COVID-19 by obesity 2018</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>

              {black && <Grid>
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
                      
                      <Image width='520' height='386' style = {{paddingLeft: 0}} src='/NationalReportImages/obesity.png' />
                  </div>
                  <Accordion style = {{paddingTop: 100, paddingLeft: 80}} defaultActiveIndex={1} panels={[
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
                                        <Header.Subheader style={{color: '#000000', width: 850, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) 
                                        per 100,000 residents by residential segregation index. The y-axis displays residential 
                                        segregation rankings based on quintiles (groups of 20%). The x-axis displays the 
                                        average number of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 
                                        that occurred in each group of counties ranked by residential segregation. The 
                                        ranking classified counties into five groups designed to be of equal size, so that 
                                        the lowest quintile contains the counties with values in the 0%-20% range for this 
                                        county characteristic, and the highest quintile contains counties with values in 
                                        the 80%-100% range for this county characteristic. Q2 indicates counties in the 
                                        20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties 
                                        in the 60%-80% range.
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
                  <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content style = {{paddingLeft: 0, width: 500}}>
                      COVID-19 Cases by <br/> Percentage of Population with obesity 2018
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
                                  {key: nationalBarChart['caserate7day'][0]['obesity 2018'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure']/nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure'])*nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['obesity 2018'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['obesity 2018'][1]['measure']/nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure'])*nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['obesity 2018'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['obesity 2018'][2]['measure']/nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure'])*nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['obesity 2018'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['obesity 2018'][3]['measure']/nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure'])*nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['obesity 2018'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['obesity 2018'][4]['measure']/nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure'])*nationalBarChart['caserate7day'][0]['obesity 2018'][0]['measure'] || 0}



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
                          COVID-19 Deaths by <br/> Percentage of Population with obesity 2018
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
                                  {key: nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure']/nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['obesity 2018'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['obesity 2018'][1]['measure']/nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['obesity 2018'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['obesity 2018'][2]['measure']/nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['obesity 2018'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['obesity 2018'][3]['measure']/nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['obesity 2018'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['obesity 2018'][4]['measure']/nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['obesity 2018'][0]['measure'] || 0}



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


