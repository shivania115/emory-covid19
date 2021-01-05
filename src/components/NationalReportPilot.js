import React, { useEffect, useState, Component, createRef, useContext, useMemo} from 'react'
import { Container, Header, Grid, Loader, Divider, Popup, Button, Image, Rail, Sticky, Ref, Segment, Accordion, Icon, Menu, Message, Transition} from 'semantic-ui-react'
import AppBar from './AppBar';
import { useParams, useHistory } from 'react-router-dom';
import { geoCentroid } from "d3-geo";
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { scaleQuantile } from "d3-scale";
import configs from "./state_config.json";
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
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, LabelList, ReferenceArea} from "recharts";

var obj;
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"

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
// 

export function useGeographies({ geography, parseGeographies }) {
  const { path } = useContext(MapContext)
  const [geographies, setGeographies] = useState()

  useEffect(() => {
    if (typeof window === `undefined`) return

    if (isString(geography)) {
      obj.then(geos => {
        if (geos) setGeographies(getFeatures(geos, parseGeographies))
      })
    } else {
      setGeographies(getFeatures(geography, parseGeographies))
    }
  }, [geography, parseGeographies])

  const output = useMemo(() => {
    return prepareFeatures(geographies, path)
  }, [geographies, path])

  return { geographies: output }
}

const Geographies = ({
  geography,
  children,
  parseGeographies,
  className = "",
  ...restProps
}) => {
  const { path, projection } = useContext(MapContext)
  const { geographies } = useGeographies({ geography, parseGeographies })

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
  children: PropTypes.func,
  parseGeographies: PropTypes.func,
  className: PropTypes.string,
}

const style = <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css'/>

const Placeholder = () => <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />

class StickyExampleAdjacentContext extends Component{
  
  contextRef = createRef();
  
  render(){

    return (

        <div >
          <Ref innerRef={this.contextRef}>
            <Rail attached size='mini' >
                <Sticky offset={180} position= "fixed" context={this.contextRef}>
                {/* <div class="ui secondary vertical menu">
                  
                  <a class="item" href="#title">
                  COVID-19 National Health Equity Report
                  </a>
                  <a class="item" href="#cases">
                  Cases in the U.S. Over Time
                  </a>
                  <a class="item" href="#deaths">
                  Deaths in the U.S. Over Time
                  </a>
                  <a class="item" href="#half">
                  50% of Cases Comes From These States
                  </a>
                  <a class="item" href="#commu">
                  COVID-19 Across the U.S. Communities
                  </a>
                  <a class="item" href="#ccvi">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Community Vulnerability Index
                  </a>
                  <a class="item" href="#poverty">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent in Poverty
                  </a>
                  <a class="item" href="#metro">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Metropolitan Status
                  </a>
                  <a class="item" href="#region">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Region
                  </a>
                  <a class="item" href="#black">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent African American
                  </a>
                  <a class="item" href="#resseg">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Residential Segregation Index'
                  </a>

                </div> */}
                    <Menu
                        size='small'
                        compact
                        pointing secondary vertical>
                        {/* <Menu.Item as='a' href="#title" name='COVID-19 National Health Equity Report' active={props.activeCharacter == 'COVID-19 National Health Equity Report' || activeItem === 'COVID-19 National Health Equity Report'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>COVID-19 National Health Equity Report</Header></Menu.Item>
                        <Menu.Item as='a' href="#cases" name='Cases in the U.S. Over Time' active={props.activeCharacter == 'Cases in the U.S. Over Time' || activeItem === 'Cases in the U.S. Over Time'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>Cases in the U.S. Over Time</Header></Menu.Item>
                        <Menu.Item as='a' href="#deaths" name='Deaths in the U.S. Over Time' active={props.activeCharacter == 'Deaths in the U.S. Over Time' || activeItem === 'Deaths in the U.S. Over Time'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>Deaths in the U.S. Over Time</Header></Menu.Item>
                        <Menu.Item as='a' href="#half" name='50% of Cases Comes From These States' active={props.activeCharacter == '50% of Cases Comes From These States' || activeItem === '50% of Cases Comes From These States'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>50% of Cases Comes From These States</Header></Menu.Item>
                        <Menu.Item as='a' href="#commu" name='COVID-19 Across the U.S. Communities' active={props.activeCharacter == 'COVID-19 Across the U.S. Communities' || activeItem === 'COVID-19 Across the U.S. Communities'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>COVID-19 Across the U.S. Communities</Header></Menu.Item>
                        <Menu.Item as='a' href="#ccvi" name='COVID-19 by Community Vulnerability Index' active={props.activeCharacter == 'COVID-19 by Community Vulnerability Index' || activeItem === 'COVID-19 by Community Vulnerability Index'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Community Vulnerability Index</Header></Menu.Item>
                        <Menu.Item as='a' href="#poverty" name='COVID-19 by Percent in Poverty' active={props.activeCharacter == 'COVID-19 by Percent in Poverty' || activeItem === 'COVID-19 by Percent in Poverty'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent in Poverty</Header></Menu.Item>
                        <Menu.Item as='a' href="#metro" name='COVID-19 by Metropolitan Status' active={props.activeCharacter == 'COVID-19 by Metropolitan Status' || activeItem === 'COVID-19 by Metropolitan Status'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Metropolitan Status</Header></Menu.Item>
                        <Menu.Item as='a' href="#region" name='COVID-19 by Region' active={props.activeCharacter == 'COVID-19 by Region' || activeItem === 'COVID-19 by Region'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Region</Header></Menu.Item>
                        <Menu.Item as='a' href="#black" name='COVID-19 by Percent African American' active={props.activeCharacter == 'COVID-19 by Percent African American' || activeItem === 'COVID-19 by Percent African American'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent African American </Header></Menu.Item>
                        <Menu.Item as='a' href="#resseg" name='COVID-19 by Residential Segregation Index' active={props.activeCharacter == 'COVID-19 by Residential Segregation Index' || activeItem === 'COVID-19 by Residential Segregation Index'}
                              onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Residential Segregation Index</Header></Menu.Item>
                          */}

                        <Menu.Item as='a' href="#title" name='COVID-19 National Health Equity Report'><Header as='h4'>COVID-19 National 
                                                                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                                &nbsp;&nbsp;
                                                                                                                Health Equity Report</Header></Menu.Item>
                        <Menu.Item as='a' href="#cases" name='Cases in the U.S. Over Time'><Header as='h4'>Cases in the U.S. Over Time</Header></Menu.Item>
                        <Menu.Item as='a' href="#deaths" name='Deaths in the U.S. Over Time'><Header as='h4'>Deaths in the U.S. Over Time</Header></Menu.Item>
                        <Menu.Item as='a' href="#half" name='50% of Cases Comes From These States'><Header as='h4'>50% of Cases Comes From These States</Header></Menu.Item>
                        <Menu.Item as='a' href="#commu" name='COVID-19 Across the U.S. Communities'><Header as='h4'>COVID-19 Across the U.S. Communities</Header></Menu.Item>
                        <Menu.Item as='a' href="#ccvi" name='COVID-19 by Community Vulnerability Index'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Community Vulnerability Index</Header></Menu.Item>
                        <Menu.Item as='a' href="#poverty" name='COVID-19 by Percent in Poverty'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent in Poverty</Header></Menu.Item>
                        <Menu.Item as='a' href="#metro" name='COVID-19 by Metropolitan Status'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Metropolitan Status</Header></Menu.Item>
                        <Menu.Item as='a' href="#region" name='COVID-19 by Region'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Region</Header></Menu.Item>
                        <Menu.Item as='a' href="#black" name='COVID-19 by Percent African American'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent African American </Header></Menu.Item>
                        <Menu.Item as='a' href="#resseg" name='COVID-19 by Residential Segregation Index'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Residential Segregation Index</Header></Menu.Item>
                         
                        
                    </Menu>
                </Sticky>
            </Rail>
          </Ref> 
        </div>
    )
  }

}


// class StickyExampleAdjacentContext extends Component {
//   state = {}

//   handleContextRef = contextRef => this.setState({ contextRef })

//   render() {
//     const { contextRef } = this.state

//     return (
//       <Grid centered style = {{width: 1230}}>
//         <Grid.Column >
//           <div ref={this.handleContextRef}>
//               <Rail position='right'>
//                 <Sticky offset={130}>
//                   <br/><br/><br/><br/><br/><br/><br/><br/>
                  
//                   <Popup position='left center' trigger={<Button style = {{borderRadius: "0px", paddingleft: -10, width: 78, textAlign: "left", fontSize: "14pt"}}>Jump to...</Button>} flowing hoverable>

//                     <Grid.Column row = {2}>
//                       <Grid.Column textAlign='right' >
//                         <div class="ui ordered list" style = {{fontSize: "14pt"}}>
//                           <a class="item" href= "#jump1">Return to the top</a> <br/>
//                           <a class="item" href= "#jump2">Cases/Deaths in the U.S. Over Time</a> <br/>
//                           <a class="item" href= "#jump3">50% of Cases Comes From These States</a> <br/>
//                           <a class="item" href= "#jump4">Top 10 Counties with Most Cases/Deaths</a> <br/>
//                           <a class="item" href= "#jump5">Daily New Cases/Deaths per 100,000</a> <br/>
//                           <a class="item" href= "#jump6">Community Vulnerability Index</a> <br/>
//                           <a class="item" href= "#jump7">Residential Segregation Index</a> <br/>
//                           <a class="item" href= "#jump8">County Characteristics</a> <br/>
//                         </div> 
//                       </Grid.Column>
//                     </Grid.Column>
//                   </Popup>
//                 </Sticky>
//               </Rail>
//           </div>
//         </Grid.Column>
//       </Grid>
//     )
//   }
// }



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

function CaseChart(props){
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


  return(
    <Grid.Column style={{paddingTop:20, width: 850, height: 500}}>
    <center> <Header.Content x={0} y={20} style={{fontSize: '18pt', marginLeft: 0, paddingBottom: 0, fontWeight: 600}}>Average Daily COVID-19 Cases </Header.Content> </center>

    {/* <Grid.Row position='relative'> */}
      <ComposedChart width={830} height={420} data={data["_nation"]}
        margin={{top: 30, right: 60, bottom: 20, left: 30}}>
      <CartesianGrid stroke='#f5f5f5'/>
      <XAxis dataKey="t" ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter}/>
      <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
      {/* <Legend /> */}
      <Bar name="New cases" dataKey='dailyCases' barSize={18} 
            isAnimationActive={animationBool} 
            onAnimationStart={() => {setDisabled(true); setVisible1(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); 
              setTimeout(()=>setVisible1(true), wait); 
              setTimeout(()=>setVisible2(true), wait+1000); 
              setTimeout(()=>setVisible3(true), wait+2000); 
              setTimeout(()=>setVisible4(true), wait+3000); 
              setTimeout(()=>setVisible5(true), wait+4000); 
              setTimeout(()=>setDisabled(false),wait+4500)
            }} 
            onAnimationEnd={()=> {setAnimationBool(false);}} 
            animationDuration={5500} 
            fill={barColor} barSize={2.1} />
      <Line name="7-day average" id={playCount} type='monotone' dataKey='caseRateMean' dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={5500} 
            // animationBegin={500} 
            stroke={lineColor} strokeWidth="2" />
      <Tooltip labelFormatter={tickFormatter} formatter={(value) => numberWithCommas(value.toFixed(0))} wrapperStyle={{zIndex: 10}}/>
      </ComposedChart>
      <Button content='Play' icon='play' floated="right" disabled={disabled} onClick={() => {setPlayCount(playCount+1);}}/>
      {/* </Grid.Row>    */}

      {/* <Grid.Row columns={5}>
      <Grid.Column >                                                                    */}
      <Transition visible={visible1} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-28rem', left:'10rem', padding: '1rem', fontSize: '0.8rem'}}> Jan. 21: <br /> 1st case in the US confirmed in Washinton State</Message>
      </Transition>
      {/* </Grid.Column> 
      <Grid.Column >              */}
      <Transition visible={visible2} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-28rem', left:'10rem', padding: '1rem', fontSize: '0.8rem'}}> Apr. 10: <br /> First wave peaked at 31,709 new cases <br />(7-day avg.) </Message>
      </Transition> 
      <Transition visible={visible3} animation='scale' duration={300}>
      <Message compact style={{ width: '8rem', top:'-32rem', left:'21rem', padding: '1rem', fontSize: '0.8rem'}}> June. 11: <br /> 2M confirmed cases in the US </Message>
      </Transition> 
      <Transition visible={visible4} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-42rem', left:'30rem', padding: '1rem', fontSize: '0.8rem'}}> July. 19: <br /> Second wave peaked at 66,692 new cases <br />(7-day avg.) </Message>
      </Transition> 
      <Transition visible={visible5} animation='scale' duration={300}>
      <Message compact style={{ width: '10rem', top:'-56rem', left:'40rem', padding: '1rem', fontSize: '0.8rem'}}> Dec. 17: <br /> Third wave peaked at 222,786 new cases <br />(7-day avg.) </Message>
      </Transition> 
      
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
      <Line name="7-day average" id={playCount} type='monotone' dataKey='mortalityMean' dot={false} 
            isAnimationActive={animationBool} 
            animationDuration={5500} 
            // animationBegin={500} 
            stroke={lineColor} strokeWidth="2" />
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




export default function ExtraFile(props) {
  
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

  const [resSeg] = useState("RS_blackwhite");
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

  // --------------------------
  const [caseTicks, setCaseTicks] = useState([]);
  const [caseYTicks, setCaseYTicks] = useState([]);
  // --------------------------

  const [urbrur] = useState("_013_Urbanization_Code");
  const [dataUrb, setDataUrb] = useState();
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();  


  const [region, setRegion] = useState("region_Code");
  const [colorRegion, setColorRegion] = useState();

  const [covidMetric, setCovidMetric] = useState({cases: 'N/A', deaths: 'N/A', 
                                                  caseRate: "N/A", mortality: "N/A", 
                                                  caseRateMean: "N/A", mortalityMean: "N/A",
                                                  caseRateMA: "N/A", mortalityMA: "N/A",
                                                  cfr:"N/A", t: 'n/a'});
  const [varMap, setVarMap] = useState({});

  const [accstate, setAccstate] = useState({ activeIndex: 1 });

  const dealClick = (e, titleProps) => {
  const { index } = titleProps
  const { activeIndex } = accstate
  const newIndex = activeIndex === index ? -1 : index

  setAccstate({ activeIndex: newIndex })
  }


  useEffect(()=>{
    
  }, []);

  useEffect(()=>{
    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
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

      // fetch('/data/nationalBarCases.json').then(res => res.json())
      //   .then(x => {
      //     setnationalBarChart['caserate7day'][0](x);
      //   });

      // fetch('/data/nationalBarMortality.json').then(res => res.json())
      //   .then(x => {
      //     setnationalBarChart['covidmortality7day'][0](x);
      //   });

      fetch('/data/nationalBarChart.json').then(res => res.json())
        .then(x => {
          setNationalBarChart(x);
        });

      fetch('/data/date.json').then(res => res.json())
      .then(x => setDate(x.date.substring(5,7) + "/" + x.date.substring(8,10) + "/" + x.date.substring(0,4)));

      fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
        .then(x => setVarMap(x));
      
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
    //   })


    useEffect(() => {

      let seriesDict = {};
      let newDict = {};
      const fetchTimeSeries = async() => { 
        const mainQ = {all: "all"};
        const promStatic = await CHED_static.find(mainQ,{projection:{}}).toArray();

        const testQ = {full_fips: "_nation"};
        const promTs = await CHED_series.find(testQ,{projection:{}}).toArray();
        promStatic.forEach ( i=> {
          if(i.tag === "nationalraw"){
            newDict[i[Object.keys(i)[3]]] = i.data;
            // return newDict;
          }
        });
        setData(newDict);  

        
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

    useEffect(() => {
      
          if(data){
          //ccvi
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


        }



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
      // <text>// </ text>
        /* {tick} */
        monthNames[new Date(tick*1000).getMonth()] + " " +  new Date(tick*1000).getDate()
      
      );
  };



  if (data && dataTS && varMap) {

    console.log(nationalBarChart['caserate7day'][0]['age65over'][0]['label']);
  return (
    <HEProvider>
      <div>
        <AppBar menu='nationalReport' /> 
        <Container id="title" style={{marginTop: '8em', minWidth: '1260px'}}>
        <div >
          <br/><br/><br/><br/>
        </div>
        <Grid >
            <Grid.Column width={2} style={{zIndex: 10}}>
              <Ref innerRef={createRef()} >
                <StickyExampleAdjacentContext activeCharacter={activeCharacter}  />
              </Ref>
            </Grid.Column>
            <Grid.Column width={14} >
            <center> <Waypoint
                                        onEnter={() => {
                                            setActiveCharacter('COVID-19 National Health Equity Report')
                                            console.log(activeCharacter)
                                        }}>
                                    </Waypoint> 
                                    </center>
            <div>     	
              <Header as='h2' style={{color: mortalityColor[1],textAlign:'center', fontWeight: 400, fontSize: "24pt", paddingTop: 17, paddingLeft: "10em", paddingRight: "6em"}}>
                <Header.Content>
                <b> COVID-19 National Health Equity Report </b> 
                <Header.Subheader style={{fontWeight:300,fontSize:"20pt", paddingTop:16, color: mortalityColor[1]}}> 
                <b>{monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}</b>
                  
                </Header.Subheader>
                </Header.Content>
              </Header>
            </div>
            <div style={{paddingTop:36,textAlign:'justify', fontSize:"14pt", lineHeight: "16pt",paddingBottom:30, paddingLeft: "12em", paddingRight: "2em"}}>
            <Header.Content id="cases" style={{fontFamily:'lato', fontSize: "14pt", width: 810}}>
            The United States has reported {numberWithCommas(data['_nation']['casesfig'])} cases, the highest number of any country in the world. 
            The number of cases and deaths differ substantially across American communities. The COVID-19 U.S. Health Equity 
            Report documents how COVID-19 cases and deaths are changing over time, geography, and demography. The report will 
            be released each week to keep track of how COVID-19 is impacting U.S. communities.
            </Header.Content>
            </div>
            <center style={{paddingLeft: 190}}><Divider style={{width: 900}}/> </center>
            <div style={{paddingBottom:'2em', paddingLeft: "15em", paddingRight: "1em"}}>
              <Header as='h2' style={{color: mortalityColor[1], textAlign:'center',fontSize:"22pt", paddingTop: 30}}>
                <Header.Content>
                  How have cases in the U.S. changed over time?
                </Header.Content>
              </Header>
                <Grid>
                    <Grid.Row column = {1}>

                    <CaseChart data={dataTS} barColor={mortalityColor[0]} lineColor={[mortalityColor[1]]} 
                              ticks={caseTicks} tickFormatter={caseTickFmt} />

                          {/* <Grid.Column style={{paddingTop:20, width: 1030, paddingLeft: 35}}>
                                <center> <Header.Content x={0} y={20} style={{fontSize: '18pt', marginLeft: 0, paddingBottom: 0, fontWeight: 600}}>Average Daily COVID-19 Cases </Header.Content> </center>

                                <VictoryChart theme={VictoryTheme.material}
                                  width={1030}
                                  height={400}       
                                  padding={{left: 70, right: 40, top: 18, bottom: 40}}
                                  containerComponent={<VictoryVoronoiContainer /> }
                                  >

                                <VictoryAxis
                                  tickValues={[
                                    dataTS["_nation"][0].t,
                                    dataTS["_nation"][30].t,
                                    dataTS["_nation"][61].t,
                                    dataTS["_nation"][91].t,
                                    dataTS["_nation"][122].t,
                                    dataTS["_nation"][153].t,
                                    dataTS["_nation"][183].t,
                                    dataTS["_nation"][214].t,
                                    dataTS["_nation"][244].t,
                                    dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                                    style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                                    tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                                <VictoryAxis dependentAxis tickCount={5}
                                    style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 

                                  tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                                  />

                                <VictoryGroup>
                                  <VictoryBar
                                    barRatio={0.8}
                                    data={dataTS["_nation"]}
                                    style={{
                                      data: {
                                        fill: casesColor[1]
                                      }
                                    }}
                                    x="t"
                                    y="dailyCases"
                                  />
                                </VictoryGroup>
                                <VictoryGroup 
                                    colorScale={[mortalityColor[1]]}
                                >
                                    <VictoryLine data={dataTS["_nation"]}
                                      x='t' y='caseRateMean'
                                      labels={({ datum }) => `${fullMonthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}` + ` \n New cases: ${numberWithCommas(datum.dailyCases.toFixed(0))} \n 7-day average: ${numberWithCommas(datum.caseRateMean.toFixed(0))}`}
                                      labelComponent={
                                      <VictoryTooltip 
                                        style={{marginLeft: 100, fontWeight: 400, fontFamily: 'lato', fontSize: "19px", textAnchor: "start"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{marginLeft: 100, borderRadius: "0px", fill: "#FFFFFF", fillOpacity: 1, stroke: "#A9A9A9", strokeWidth: 1 }}
                                      />}
                                      style={{
                                        data: {strokeWidth: ({ active }) => active ? 3 : 2},
                                      }}
                                    />
                                </VictoryGroup>
                                
                                
                              </VictoryChart>
                          </Grid.Column>

                          <Grid.Column style={{paddingTop:50, width: 1000}}>

                          <Accordion style = {{paddingTop: "19px"}}>
                            <Accordion.Title
                              active={accstate.activeIndex === 0}
                              index={0}
                              onClick={dealClick}
                              style ={{color: "#397AB9", fontSize: 19, paddingLeft: 30}}

                            >
                            <Icon id = "deaths" name='dropdown' />
                              About this data
                            </Accordion.Title>
                              <Accordion.Content active={accstate.activeIndex === 0}>
                              <Header  as='h2' style={{fontWeight: 400, width: 1000, paddingLeft: 35, paddingTop: 0, paddingBottom: 20}}>
                                  <Header.Content style={{fontSize: "14pt"}}>
                                    <Header.Subheader style={{color: '#000000', width: 1000, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
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

                            </Accordion> 
                          </Grid.Column> */}
                          {/* <Grid.Column style={{width:930}} > */}
                          {/* <div  > */}
                          <Accordion style = {{paddingTop: "19px"}}>
                            <Accordion.Title
                              active={accstate.activeIndex === 0}
                              index={0}
                              onClick={dealClick}
                              style ={{color: "#397AB9", fontSize: 19, paddingLeft: 30}}

                            >
                            <Icon id = "deaths" name='dropdown' />
                              About this data
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

                            </Accordion> 
                          {/* </div> */}
                        {/* </ Grid.Column> */}
                    </Grid.Row>
                </Grid>

            </div>
            <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center>
            <div style={{paddingBottom:'2em', paddingLeft: "15em", paddingRight: "1em"}}>
              <Header as='h2' style={{color: mortalityColor[1], textAlign:'center', fontSize:"22pt", paddingTop: 30}}>
                <Header.Content>
                  How have deaths in the U.S. changed over time? 
                </Header.Content>
              </Header>

                <Grid>
                    <Grid.Row column = {1} >
                      <DeathChart data={dataTS["_nation"]} barColor={mortalityColor[0]} lineColor={[mortalityColor[1]]} 
                          ticks={caseTicks} tickFormatter={caseTickFmt} />
                          {/* <Grid.Column style={{paddingTop:28, width: 1030, paddingLeft: 35}}>
                                <center> <Header.Content x={0} y={20} style={{fontSize: '18pt', paddingLeft: 0, paddingBottom: 5, fontWeight: 600}}>Average Daily COVID-19 Deaths </Header.Content> </center>

                                <VictoryChart theme={VictoryTheme.material} 
                                  width={1030}
                                  height={400}       
                                  padding={{left: 70, right: 40, top: 24, bottom: 40}}
                                  containerComponent={<VictoryVoronoiContainer/>}
                                  >

                                  <VictoryAxis
                                    tickValues={[
                                      dataTS["_nation"][0].t,
                                      dataTS["_nation"][30].t,
                                      dataTS["_nation"][61].t,
                                      dataTS["_nation"][91].t,
                                      dataTS["_nation"][122].t,
                                      dataTS["_nation"][153].t,
                                      dataTS["_nation"][183].t,
                                      dataTS["_nation"][214].t,
                                      dataTS["_nation"][244].t,
                                      dataTS["_nation"][dataTS["_nation"].length-1].t]}                           
                                    style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                                    tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                                  <VictoryAxis dependentAxis tickCount={5}
                                    style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                                    tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                                    />
                                
                                <VictoryGroup>
                                  <VictoryBar
                                    barRatio={0.8}
                                    data={dataTS["_nation"]}
                                    style={{
                                      data: {
                                        fill: casesColor[1]
                                      }
                                    }}
                                    x="t"
                                    y="dailyMortality"
                                  />
                                </VictoryGroup>

                                <VictoryGroup 
                                    colorScale={[mortalityColor[1]]}
                                  >
                                    <VictoryLine data={dataTS["_nation"]}
                                      x='t' y='mortalityMean'
                                      labels={({ datum }) => `${fullMonthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}` + ` \n New deaths: ${numberWithCommas(datum.dailyMortality.toFixed(0))} \n 7-day average: ${numberWithCommas(datum.mortalityMean.toFixed(0))}`}
                                      labelComponent={
                                        <VictoryTooltip 
                                          style={{marginLeft: 100, fontWeight: 400, fontFamily: 'lato', fontSize: "19px", textAnchor: "start"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{marginLeft: 100, borderRadius: "0px", fill: "#FFFFFF", fillOpacity: 1, stroke: "#A9A9A9", strokeWidth: 1 }}
                                        />}
                                        style={{
                                        fontFamily: 'lato',
                                        data: { strokeWidth: ({ active }) => active ? 3 : 2},
                                      }}
                                      />
                                  </VictoryGroup>
                                </VictoryChart>
                          </Grid.Column>

                          <Grid.Column style={{paddingTop:50, width: 1000}}> */}


                          <Accordion style = {{paddingTop: "19px"}}>
                            <Accordion.Title
                              active={accstate.activeIndex === 0}
                              index={0}
                              onClick={dealClick}
                              style ={{color: "#397AB9", fontSize: 19, paddingLeft: 30}}
                            >
                            <Icon id="half" name='dropdown' />
                              About this data
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

                          </Accordion> 
                          {/* </Grid.Column>  */}
                    </Grid.Row>
                </Grid>

            </div>  
      
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
                  <center> <b id="commu" style = {{fontSize:"18pt"}}>{states50[0]["statenames"]}</b> </center>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </div>













            <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center>
            <div style={{paddingTop:'1em', paddingLeft: "9em", paddingRight: "7em"}}>
              <Header as='h2' style={{paddingTop: 17, textAlign:'center',fontSize:"22pt", color: mortalityColor[1]}}>
                <Header.Content>
                  Who is impacted by COVID-19?
                  <Header.Subheader style={{color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 32, paddingRight: 30}}>
                  <center> <b style= {{fontSize: "18pt"}}>Cases and deaths by race, age, and sex </b> </center> 
                  TextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextText
                    
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </div>

              {/* <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900}}/> </center> */}
              <div style={{paddingTop:'1em'}}>
              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "12em", paddingRight: "4em", paddingBottom: 20}}>
                  <center> <b style= {{fontSize: "18pt"}}>Race</b> </center> 
                  <br/>
                  <br/>         

                </Header.Subheader>
                </div>
                <div style={{paddingLeft: "14em", paddingRight: "2em"}}>

                <VictoryChart
                          theme={VictoryTheme.material}
                          width={800}
                          height={220}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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
                              {key: nationalDemog['Race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Hispanic'][0]['caserate']},
                              {key: nationalDemog['Race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['American Natives'][0]['caserate']},
                              {key: nationalDemog['Race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['Asian'][0]['caserate']},
                              {key: nationalDemog['Race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['African American'][0]['caserate']},
                              {key: nationalDemog['Race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['Race'][0]['White'][0]['caserate']},
                              
                                 


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
                        <Header.Content style = {{paddingLeft: 300, width: 800}}>
                            <Header.Content id="region" style={{ fontWeight: 300, paddingTop: 20, paddingBottom:28, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>{varMap["covidmortalityfig"].name}</b>
                            </Header.Content>
                        </Header.Content>
              </div>
              
              <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 40}}/> </center>

              <div>
              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:0, textAlign: "left", paddingLeft: "12em", paddingRight: "4em", paddingBottom: 20}}>
                  <center> <b style= {{fontSize: "18pt"}}>Age</b> </center> 
                  <br/>
                  <br/>         

                </Header.Subheader>
                            </div>              
                            <div style={{paddingLeft: "14em", paddingRight: "2em"}}>

              <VictoryChart
                          theme={VictoryTheme.material}
                          width={800}
                          height={360}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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
                              {key: nationalDemog['Age'][0]['0 - 4 Years'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['0 - 4 Years'][0]['caserate']},
                              {key: nationalDemog['Age'][0]['5 - 17 Years'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['5 - 17 Years'][0]['caserate']},
                              {key: nationalDemog['Age'][0]['18 - 29 Years'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['18 - 29 Years'][0]['caserate']},
                              {key: nationalDemog['Age'][0]['30 - 39 Years'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['30 - 39 Years'][0]['caserate']},
                              {key: nationalDemog['Age'][0]['40 - 49 Years'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['40 - 49 Years'][0]['caserate']},
                              {key: nationalDemog['Age'][0]['50 - 64 Years'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['50 - 64 Years'][0]['caserate']},
                              {key: nationalDemog['Age'][0]['65 - 74 Years'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['65 - 74 Years'][0]['caserate']},
                              {key: nationalDemog['Age'][0]['75 - 84 Years'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['75 - 84 Years'][0]['caserate']},
                              {key: nationalDemog['Age'][0]['85+ Years'][0]['demogLabel'], 'value': nationalDemog['Age'][0]['85+ Years'][0]['caserate']},
                                 


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
                        <Header.Content style = {{paddingLeft: 300, width: 800}}>
                            <Header.Content id="region" style={{ fontWeight: 300, paddingTop: 20, paddingBottom:28, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>{varMap["covidmortalityfig"].name}</b>
                            </Header.Content>
                        </Header.Content>
                
              </div>

            


            <center style = {{paddingLeft: 190}}> <Divider style= {{width : 900, paddingTop: 40}}/> </center>
            {resSeg && <div style = {{ paddingLeft: "7em", paddingRight: "2em"}}>
              <Header as='h2' style={{color: '#b2b3b3', textAlign:'center',fontSize:"22pt", paddingTop: 32}}>
                <Header.Content  style={{fontSize:"22pt",color: mortalityColor[1], paddingLeft: 130}}>
                COVID-19 Across the U.S. Communities
                  <Header.Subheader id = "ccvi" style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingRight: 25, paddingBottom: 40}}>
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

              {/* <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "14em", paddingRight: "2em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>Population over the age 65 years</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>


              {male && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8}}>
                  <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
                    

                  <div >
                    
                    <svg width="260" height="80">
                      
                      {_.map(legendSplitAge65, (splitpoint, i) => {
                        if(legendSplitAge65[i] < 1){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitAge65[i].toFixed(1)}</text>                    
                        }else if(legendSplitAge65[i] > 999999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitAge65[i]/1000000).toFixed(0) + "M"}</text>                    
                        }else if(legendSplitAge65[i] > 999){
                          return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplitAge65[i]/1000).toFixed(0) + "K"}</text>                    
                        }
                        return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplitAge65[i].toFixed(0)}</text>                    
                      })} 
                      <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMinAge65}</text>
                      <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMaxAge65}</text>


                      {_.map(colorPalette, (color, i) => {
                        return <rect key={i} x={50+20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                      })} 


                      <text x={50} y={74} style={{fontSize: '0.8em'}}>Low</text>
                      <text x={50+20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>


                      <rect x={195} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                      <text x={217} y={50} style={{fontSize: '0.7em'}}> None </text>
                      <text x={217} y={59} style={{fontSize: '0.7em'}}> Reported </text>
                    

                    </svg>

              
                      <ComposableMap 
                        projection="geoAlbersUsa" 
                        data-tip=""
                        width={630} 
                        height={380}
                        strokeWidth= {0.1}
                        stroke= 'black'
                        projectionConfig={{scale: 750}}
                        >
                        <Geographies geography={geoUrl}>
                          {({ geographies }) => 
                            <svg>
                              {geographies.map(geo => (
                                <Geography
                                  key={geo.rsmKey}
                                  geography={geo}
                                  fill={
                                  ((colorAge65 && data[geo.id] && (data[geo.id][age65]) > 0)?
                                      colorAge65[data[geo.id][age65]]: 
                                      (colorAge65 && data[geo.id] && data[geo.id][age65] === 0)?
                                        '#FFFFFF':'#FFFFFF')}
                                  
                                />
                              ))}
                            </svg>
                          }
                        </Geographies>
                        

                      </ComposableMap>
                  </div>
                  <div style = {{marginTop: 60}}>
                      <br/>
                      <br/>
                      

                    </div>


                  </Grid.Column>
                  <Grid.Column>
                  <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                      COVID-19 cases by percentage of <br/> population over the age 65 years
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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
                                  {key: nationalBarChart['caserate7day'][0]['age65over'][0]['label'], 'value': (nationalBarChart['caserate7day'][0]['age65over'][0]['caserate']/nationalBarChart['caserate7day'][0]['age65over'][0]['caserate'])*nationalBarChart['caserate7day'][0]['age65over'][0]['caserate'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['age65over'][1]['label'], 'value': (nationalBarChart['caserate7day'][0]['age65over'][1]['caserate']/nationalBarChart['caserate7day'][0]['age65over'][0]['caserate'])*nationalBarChart['caserate7day'][0]['age65over'][0]['caserate'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['age65over'][2]['label'], 'value': (nationalBarChart['caserate7day'][0]['age65over'][2]['caserate']/nationalBarChart['caserate7day'][0]['age65over'][0]['caserate'])*nationalBarChart['caserate7day'][0]['age65over'][0]['caserate'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['age65over'][3]['label'], 'value': (nationalBarChart['caserate7day'][0]['age65over'][3]['caserate']/nationalBarChart['caserate7day'][0]['age65over'][0]['caserate'])*nationalBarChart['caserate7day'][0]['age65over'][0]['caserate'] || 0},
                                  {key: nationalBarChart['caserate7day'][0]['age65over'][4]['label'], 'value': (nationalBarChart['caserate7day'][0]['age65over'][4]['caserate']/nationalBarChart['caserate7day'][0]['age65over'][0]['caserate'])*nationalBarChart['caserate7day'][0]['age65over'][0]['caserate'] || 0}



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

                        <Header.Content style = {{width: 540}}>
                          
                          <Header.Content style={{fontWeight: 300, paddingLeft: 175, paddingTop: 20, paddingBottom:70, fontSize: "14pt", lineHeight: "18pt"}}>
                            <b>{varMap["caseratefig"].name}</b>
                          </Header.Content>
                        </Header.Content>
                      
                      <Header as='h2' style={{marginLeft: 13, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                      COVID-19 deaths by percentage of <br/> population over the age 65 years
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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
                                  {key: nationalBarChart['covidmortality7day'][0]['age65over'][0]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure']/nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['age65over'][1]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['age65over'][1]['measure']/nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['age65over'][2]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['age65over'][2]['measure']/nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['age65over'][3]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['age65over'][3]['measure']/nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure'] || 0},
                                  {key: nationalBarChart['covidmortality7day'][0]['age65over'][4]['label'], 'value': (nationalBarChart['covidmortality7day'][0]['age65over'][4]['measure']/nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure'])*nationalBarChart['covidmortality7day'][0]['age65over'][0]['measure'] || 0}



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
                            <Header.Content style={{ paddingLeft: 175,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>{varMap["covidmortalityfig"].name}</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row>
              </Grid>} */}


              
              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                  <center> <b style= {{fontSize: "18pt"}}>COVID-19 by Community Vulnerability Index </b> </center> 
                  <br/>
                  <br/>         

                </Header.Subheader>
              <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8}}>
                  <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
                    

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
                      <ComposableMap 
                        projection="geoAlbersUsa" 
                        data-tip=""
                        width={500} 
                        height={300}
                        strokeWidth= {0.1}
                        stroke= 'black'
                        projectionConfig={{scale: 600}}
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
                                  ((colorccvi && data[geo.id] && (data[geo.id][ccvi]) > 0)?
                                      colorccvi[data[geo.id][ccvi]]: 
                                      (colorccvi && data[geo.id] && data[geo.id][ccvi] === 0)?
                                        '#FFFFFF':'#FFFFFF')}                              
                                />
                              ))}
                            </svg>
                          }
                        </Geographies>
                        

                      </ComposableMap>
                  </div>
                  <div style = {{marginTop: 60}}>
                      <br/>
                      <br/>
                      

                    </div>


                  </Grid.Column>
                  <Grid.Column>
                  <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                        Cases by Community Vulnerability Index
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 5, bottom: 1}}
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

                        <Header.Content style = {{width: 540}}>
                          
                          <Header.Content style={{fontWeight: 300, paddingLeft: 175, paddingTop: 20, paddingBottom:70, fontSize: "14pt", lineHeight: "18pt"}}>
                            <b>{varMap["caseratefig"].name}</b>
                          </Header.Content>
                        </Header.Content>
                          
                          <br/>
                          <br/>

                      <Header as='h2' style={{marginLeft: 13, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                          <Header.Content>
                            Deaths by Community Vulnerability Index
                          </Header.Content>
                        </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 5, bottom: 1}}
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

                        <Header.Content id="poverty" style = {{width: 550}}>
                            <Header.Content style={{ paddingLeft: 175,fontWeight: 300, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>{varMap["covidmortalityfig"].name}</b>
                            </Header.Content>
                        </Header.Content>

                    </Grid.Column>
                </Grid.Row>
              </Grid>

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center>


              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>Population in poverty</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>

              {ccvi && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8}}>
                  <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
                    

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
                      <ComposableMap 
                        projection="geoAlbersUsa" 
                        data-tip=""
                        width={500} 
                        height={300}
                        strokeWidth= {0.1}
                        stroke= 'black'
                        projectionConfig={{scale: 600}}
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
                        

                      </ComposableMap>
                  </div>
                  <div style = {{marginTop: 60}}>
                      <br/>
                      <br/>
                      

                    </div>


                  </Grid.Column>
                  <Grid.Column>
                  <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                      COVID-19 cases by percentage of <br/> population in poverty
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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

                        <Header.Content style = {{width: 540}}>
                          
                          <Header.Content style={{fontWeight: 300, paddingLeft: 175, paddingTop: 20, paddingBottom:70, fontSize: "14pt", lineHeight: "18pt"}}>
                            <b>{varMap["caseratefig"].name}</b>
                          </Header.Content>
                        </Header.Content>
                      
                      <Header as='h2' style={{marginLeft: 13, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                      COVID-19 deaths by percentage of <br/> population in poverty
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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
                            <Header.Content id="metro" style={{ paddingLeft: 175,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>{varMap["covidmortalityfig"].name}</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row>
              </Grid>}

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center>

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>Metropolitan Status</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>

              {poverty && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8}}>
                  <Grid.Column style={{paddingTop:10,paddingBottom:0}}>
                    

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
                      <ComposableMap 
                        projection="geoAlbersUsa" 
                        data-tip=""
                        width={500} 
                        height={300}
                        strokeWidth= {0.1}
                        stroke= 'black'
                        projectionConfig={{scale: 600}}
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
                                      (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === "1")?
                                      colorPalette[0]: 
                                      (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === "2")?
                                      colorPalette[1]: 
                                      (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === "3")?
                                      colorPalette[2]: 
                                      (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === "4")?
                                      colorPalette[3]: 
                                      (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === "5")?
                                      colorPalette[4]: 
                                      (dataUrb[geo.id] && (dataUrb[geo.id][urbrur]) === "6")?
                                      colorPalette[5]: "#FFFFFF")}
                                  
                                />
                              ))}
                            </svg>
                          }
                        </Geographies>
                        

                      </ComposableMap>
                  </div>
                  <div style = {{marginTop: 30}}>
                      <br/>
                      <br/>
                      

                    </div>


                  </Grid.Column>
                  <Grid.Column>
                  <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                      COVID-19 cases by Metropolitan Status
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 300, right: 40, top: 15, bottom: 1}}
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

                        <Header.Content style = {{width: 540}}>
                          
                          <Header.Content style={{fontWeight: 300, paddingLeft: 175, paddingTop: 20, paddingBottom:70, fontSize: "14pt", lineHeight: "18pt"}}>
                            <b>{varMap["caseratefig"].name}</b>
                          </Header.Content>
                        </Header.Content>
                      
                      <Header as='h2' style={{marginLeft: 13, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                      COVID-19 deaths by Metropolitan Status
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 300, right: 40, top: 15, bottom: 1}}
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
                            <Header.Content id="region" style={{ paddingLeft: 175,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>{varMap["covidmortalityfig"].name}</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row>
              </Grid>}


              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center>

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:0, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>Region</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>


                  {urbrur && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8}}>
                  <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
                    

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
                      <ComposableMap 
                        projection="geoAlbersUsa" 
                        data-tip=""
                        width={500} 
                        height={300}
                        strokeWidth= {0.1}
                        stroke= 'black'
                        projectionConfig={{scale: 600}}
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
                        

                      </ComposableMap>
                  </div>
                  <div style = {{marginTop: 60}}>
                      <br/>
                      <br/>
                      

                    </div>


                  </Grid.Column>
                  <Grid.Column>
                  <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                      COVID-19 cases by Region
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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

                        <Header.Content style = {{width: 540}}>
                          
                          <Header.Content style={{fontWeight: 300, paddingLeft: 175, paddingTop: 20, paddingBottom:70, fontSize: "14pt", lineHeight: "18pt"}}>
                            <b>{varMap["caseratefig"].name}</b>
                          </Header.Content>
                        </Header.Content>
                      
                      <Header as='h2' style={{marginLeft: 13, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                      COVID-19 deaths by Region
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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
                            <Header.Content id="black" style={{ paddingLeft: 175,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>{varMap["covidmortalityfig"].name}</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row>
              </Grid>}

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>African American population</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>


              {region && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8}}>
                  <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
                    

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
                      <ComposableMap 
                        projection="geoAlbersUsa" 
                        data-tip=""
                        width={500} 
                        height={300}
                        strokeWidth= {0.1}
                        stroke= 'black'
                        projectionConfig={{scale: 600}}
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
                        

                      </ComposableMap>
                  </div>
                  <div style = {{marginTop: 60}}>
                      <br/>
                      <br/>
                      

                    </div>


                  </Grid.Column>
                  <Grid.Column>
                  <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                      COVID-19 cases by percentage of <br/> African American population
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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

                        <Header.Content style = {{width: 540}}>
                          
                          <Header.Content style={{fontWeight: 300, paddingLeft: 175, paddingTop: 20, paddingBottom:70, fontSize: "14pt", lineHeight: "18pt"}}>
                            <b>{varMap["caseratefig"].name}</b>
                          </Header.Content>
                        </Header.Content>
                      
                      <Header as='h2' style={{marginLeft: 13, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                      COVID-19 deaths by percentage of <br/> African American population
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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
                            <Header.Content id="resseg" style={{ paddingLeft: 175,fontWeight: 300, paddingTop: 20, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>{varMap["covidmortalityfig"].name}</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row>
              </Grid>}

              <center style={{paddingLeft: 100}}><Divider style={{width: 900}}/> </center> 

              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "11em", paddingRight: "5em", paddingBottom: 40}}>
                    <center> <b style= {{fontSize: "18pt"}}>COVID-19 by Residential Segregation Index</b> </center> 
                    <br/>
                    <br/>         

                  </Header.Subheader>

              {black && <Grid>
                <Grid.Row columns={2} style={{paddingTop: 8}}>
                  <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
                    

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
                      <ComposableMap 
                        projection="geoAlbersUsa" 
                        data-tip=""
                        width={500} 
                        height={300}
                        strokeWidth= {0.1}
                        stroke= 'black'
                        projectionConfig={{scale: 600}}
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
                        

                      </ComposableMap>
                  </div>
                  <div style = {{marginTop: 60}}>
                      <br/>
                      <br/>
                      

                    </div>


                  </Grid.Column>
                  <Grid.Column>
                  <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                        Cases by Residential segregation 
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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

                        <Header.Content style = {{width: 540}}>
                          
                          <Header.Content style={{fontWeight: 300, paddingLeft: 175, paddingTop: 20, paddingBottom:70, fontSize: "14pt", lineHeight: "18pt"}}>
                            <b>{varMap["caseratefig"].name}</b>
                          </Header.Content>
                        </Header.Content>
                      
                      <Header as='h2' style={{marginLeft: 13, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                      <Header.Content>
                        Deaths by Residential segregation 
                      </Header.Content>
                    </Header>
                        <VictoryChart
                          theme={VictoryTheme.material}
                          width={530}
                          height={180}
                          domainPadding={20}
                          minDomain={{y: props.ylog?1:0}}
                          padding={{left: 180, right: 40, top: 15, bottom: 1}}
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
                            <Header.Content style={{ paddingLeft: 175,fontWeight: 300, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>{varMap["covidmortalityfig"].name}</b>
                            </Header.Content>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row> 
              </Grid>}
              
            </div>}
            
            
            </Grid.Column> 
        </Grid>
        
        </Container> 
        <Container id="title" style={{marginTop: '8em', minWidth: '1260px'}}>

          <Notes />
        </Container> 
        
    </div>
  </HEProvider>



    );
  } else{
    return <Loader active inline='centered' />
  }


}


