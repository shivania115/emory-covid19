import React, { useEffect, useState, useRef, createRef, PureComponent} from 'react'
import { Container, Breadcrumb, Dropdown, Header, Grid, Progress, Loader, Divider, Popup, Tab, Table, Button, Image, Rail, Sticky, Ref, Segment, Accordion, Icon, Menu, Message, Transition} from 'semantic-ui-react'
import AppBar from './AppBar';
import { geoCentroid } from "d3-geo";
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import Marker from './Marker';
import Annotation from './Annotation';
import { Waypoint } from 'react-waypoint'
import ReactTooltip from "react-tooltip";
import VaccinesFAQ from './VaccineFAQ';
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

import { VictoryChart, 
  VictoryGroup, 
  VictoryBar, 
  VictoryTheme, 
  VictoryAxis, 
  // VictoryLegend,
  VictoryLine,  
  VictoryLabel, 
  VictoryArea,
  VictoryContainer
} from 'victory';
import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";
import configs from "./state_config.json";
// import ReactDOM from 'react-dom';
// import fips2county from './fips2county.json'
// import stateOptions from "./stateOptions.json";

import { var_option_mapping, CHED_static, CHED_series} from "../stitch/mongodb";
import {HEProvider, useHE} from './HEProvider';
import {useStitchAuth} from "./StitchAuth";
import {LineChart, BarChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Brush, ResponsiveContainer, Legend, Label, Cell,  PieChart, Pie, LabelList, ReferenceArea, ReferenceLine} from "recharts";
import DefaultTooltipContent from 'recharts/lib/component/DefaultTooltipContent';
import _get from 'lodash/get'
import { index } from 'd3';


// function getKeyByValue(object, value) {
//   return Object.keys(object).find(key => object[key] === value);
// }

function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function getMaxRange(arr, prop, range) {
    var max;
    for (var i=range ; i<arr.length ; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

// const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/states-10m.json"
const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21]
};

const colorPalette = [
        "#e1dce2",
        "#d3b6cd",
        "#bf88b5", 
        "#af5194", 
        "#99528c", 
        "#633c70", 
      ];

const mortalityColor = [
        "#0270A1",
        "#024174"
      ];
const colorHighlight = '#f2a900';
const stateColor = "#778899";
const nationColor = '#b1b3b3';
const pieChartRace = ['#007dba', '#a45791', '#e8ab3b', '#000000', '#b1b3b3'];

const VaxColor = [
  "#72ABB1",
  "#337fb5"
];

function goToAnchor(anchor) {
  var loc = document.location.toString().split('#')[0];
  document.location = loc + '#' + anchor;
  return false;
}
const contextRef = createRef()
const nameList = ['USA Vaccination Tracker', 'State Vaccination Tracker', 
'State COVID-19 Burden', 'General Information', 'Vaccine Development', 'Vaccine Safety', 
'Getting Vaccinated', 'After You Are Vaccinated','COVID-19 Vaccines FAQ'];
var scrollCount = 0;

function StickyExampleAdjacentContext(props) {
    const contextRef = createRef();
    const [actionItem, setActiveItem] = useState({ activeItem: nameList[0] })
    const { activeItem } = actionItem;
    useEffect(() => {
      setActiveItem(nameList[scrollCount])
    }, [scrollCount])
    
    return (

        <div style = {{width: 140}}>
          <Ref innerRef={contextRef}>
            <Rail attached size='mini' style = {{width: 250}}>
                <Sticky offset={180} position= "fixed" context={contextRef}>
                    <Menu
                        style = {{width: 140}}
                        size='small'
                        compact
                        pointing secondary vertical>
                        <Menu.Item as='a' href="#" name={nameList[0]} active={props.activeCharacter == nameList[0] || activeItem === nameList[0]}
                              onClick={(e, { name }) => { setActiveItem({ activeItem: name }) }}><Header as='h4'> {nameList[0]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </Header></Menu.Item>

                        <Menu.Item as='a' href="#vaccine" name={nameList[1]} active={props.activeCharacter == nameList[1] || activeItem === nameList[1]}
                              onClick={(e, { name }) => { setActiveItem({ activeItem: name }) }}><Header as='h4'>{nameList[1]}</Header></Menu.Item>

                        <Menu.Item as='a' href="#burden" name={nameList[2]} active={props.activeCharacter == nameList[2] || activeItem === nameList[2]}
                              onClick={(e, { name }) => { setActiveItem({ activeItem: name }) }}><Header as='h4'>{nameList[2]}</Header></Menu.Item>
                        <Menu.Item as='a' href="#general" name={nameList[8]} active={props.activeCharacter == nameList[8] || activeItem === nameList[8]}
                                onClick={(e, { name }) => { setActiveItem( { activeItem: name })  }}><Header as='h4'>{nameList[8]}</Header></Menu.Item>
                          <Menu.Item as='a' href="#general" name={nameList[3]} active={props.activeCharacter == nameList[3] || activeItem === nameList[3]}
                          // || activeItem === 'General Information'
                                onClick={(e, { name }) => { setActiveItem( { activeItem: name })  }}><Header as='h4'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{nameList[3]}</Header></Menu.Item>
                          <Menu.Item as='a' href="#develop" name={nameList[4]} active={props.activeCharacter == nameList[4] || activeItem === nameList[4]}
                          // || activeItem === 'Vaccine Development'
                                onClick={(e, { name }) => { setActiveItem({ activeItem: name }) }}><Header as='h4'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{nameList[4]}</Header></Menu.Item>
                          <Menu.Item as='a' href="#safety" name={nameList[5]} active={props.activeCharacter == nameList[5] || activeItem === nameList[5]}
                          // || activeItem === 'Vaccine Safety'
                                onClick={(e, { name }) => { setActiveItem( { activeItem: name } ) }}><Header as='h4'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{nameList[5]}</Header></Menu.Item>
                          <Menu.Item as='a' href="#get" name={nameList[6]} active={props.activeCharacter == nameList[6] || activeItem === nameList[6]}
                          // || activeItem === 'Getting Vaccinated'
                                onClick={(e, { name }) => { setActiveItem( { activeItem: name }) }}><Header as='h4'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{nameList[6]}</Header></Menu.Item>
                          <Menu.Item as='a' href="#after" name={nameList[7]} active={props.activeCharacter == nameList[7] || activeItem === nameList[7]}
                          // || activeItem === 'After You Are Vaccinated'
                                onClick={(e, { name }) => { setActiveItem( { activeItem: name }) }}><Header as='h4'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{nameList[7]}</Header></Menu.Item>
                    </Menu>
                </Sticky>
            </Rail>
          </Ref> 
        </div>
    )
  // }

}



function CaseChart(props){
  const [playCount, setPlayCount] = useState(0);
  const data = props.data;
  const dataState = props.dataState;
  const sfps = props.stateFips;
  const ticks = props.ticks;
  const variable = props.var;
  const tickFormatter = props.tickFormatter;
  const labelFormatter = props.labelFormatter;
  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };


  return(
    <div style={{paddingTop: 5, paddingBottom: 70, width: 500}}>
      <LineChart width={500} height={180} data = {data} margin={{right: 20}}>
        {/* <CartesianGrid stroke='#f5f5f5'/> */}
        <XAxis dataKey="t" ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter} allowDuplicatedCategory={false}/>
        <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
        <Brush dataKey="t"/>
        <Line data={data["_nation"]} name="Nation" type='monotone' dataKey={variable} dot={false} 
              isAnimationActive={animationBool} 
              onAnimationEnd={()=>setAnimationBool(false)} 
              animationDuration={5500} 
              animationBegin={500} 
              stroke={nationColor} strokeWidth="2" />
        {sfps !== "_nation" && <Line data={dataState} name="State" type='monotone' dataKey={variable} dot={false} 
              isAnimationActive={animationBool} 
              onAnimationEnd={()=>setAnimationBool(false)}
              animationDuration={5500} 
              animationBegin={500} 
              stroke={stateColor} strokeWidth="2" />}

        {/* <ReferenceLine x={data["_nation"][275].t} stroke="red" label="2021" /> */}
        

        
        <Tooltip labelFormatter={labelFormatter} formatter={variable === "covidmortality7dayfig" ? (value) => numberWithCommas(value.toFixed(1)): (value) => numberWithCommas(value.toFixed(0))} active={true}/>
      </LineChart>
      {/* <LineChart width={500} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" type="category" allowDuplicatedCategory={false} />
        <YAxis dataKey={variable} />
        <Tooltip />
        <Legend />
        
        <Line dataKey={variable} data={data["_nation"]} name = "nation" />
        <Line dataKey={variable} data={data[sfps]} name = "nation1"/>
        <Line dataKey={variable} data={data[sfps+cfps]} name = "nation2"/>
      </LineChart> */}
      {/* <Button content='Play' icon='play' floated="right" onClick={() => {setPlayCount(playCount+1); }}/> */}
    </div>
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
        {dataKey == "percentPop" ? "Percent of Population" : "Percent Fully Vaccinated"}
        
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


const renderCustomizedLabelFV = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload, index, }) => {
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
      {`${(payload.pctAdmDose2).toFixed(0)}%`}

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
      dataTot: []
    };


  }


  componentDidMount(){
    if(this.props.state === false){
      fetch('/data/nationalDemogdata.json').then(res => res.json()).then(data => this.setState({ 
        dataTot: [
          data['vaccineRace'][0]['Hispanic'][0], data['vaccineRace'][0]['Asian'][0],
          data['vaccineRace'][0]['American Natives'][0], data['vaccineRace'][0]['African American'][0],
          data['vaccineRace'][0]['White'][0]
        ] }));
    }else{
      
    }
  }
    

   

  render() {
    const { dataTot } = this.state;

    return (
      <Grid>
      <PieChart 
        width={300} height={280} >
          {/* transform='translate(-10,0)' */}
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
          dataKey={this.props.pop == true? "percentPop" : "pctAdmDose2"}
          // onMouseEnter={this.onPieEnter}
          labelLine={true}
          label = {this.props.pop == true? renderCustomizedLabelPop: renderCustomizedLabelFV}
          rate = {this.props.pop}
          
        >
          {dataTot.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORRace[index % COLORRace.length]} />
          ))}
        <Label value={this.props.pop == true? "Population" : "Fully Vaccinated"} position="center" />
          
        </Pie>
      </PieChart>
      </Grid>
    );
  }
}


// function Race(props) {
//   // static jsfiddleUrl = 'https://jsfiddle.net/alidingling/hqnrgxpj/';

//   // state = {
//   //   activeIndex: 0,
//   // };

//   // constructor(props) {
//   //   super(props);
 
//   //   this.state = {
//   //     dataTot: [],
//   //     chart: "",
//   //   };

//   //   // this.handleDownload = this.handleDownload.bind(this);

//   // }
//   const [dataTot, setDataTot] = useState([]);
//   const [activeIndex, setActiveIndex] = useState([]);
//   const [chart, setChart] = React.useState();

//   const onPieEnter = (_, index) => {
//     setActiveIndex([index]);
//     // console.log(index);
//   };

//   const [pngData, ref] = useRechartToPng();

//   const handleDownload = React.useCallback(async () => {
//     // Send the chart to getPngData
//     // const pngData = await getPngData(chart);
//     // Use FileSaver to download the PNG
//     FileSaver.saveAs(pngData, "test.png");
//   }, [pngData]);

//   // componentDidMount(){
//   useEffect(() => {
//     fetch('/data/nationalDemogdata.json').then(res => res.json()).then(data => setDataTot(
//       [
//         data['vaccineRace'][0]['Hispanic'][0], data['vaccineRace'][0]['Asian'][0],
//         data['vaccineRace'][0]['American Natives'][0], data['vaccineRace'][0]['African American'][0],
//         data['vaccineRace'][0]['White'][0]
//       ] ));
//   },[])
   

//   // render() {
//   //   const { dataTot } = this.state;
//     console.log("here", dataTot)

//     if(dataTot.length>1){
//     return (
//       <div >
//       <PieChart 
//         // ref={(ref) => setChart(ref)} // Save the ref of the chart
//         ref={ref}
//         width={300} height={280} transform='translate(-10,0)'>
//         <Pie
//           activeIndex={10}
//           activeShape={renderActiveShape}
//           data={dataTot}
//           cx={150}
//           cy={150}
//           innerRadius={50}
//           outerRadius={70}
//           paddingAngle = {5}
//           fill="#8884d8"
//           dataKey={props.pop == true? "percentPop" :"pctAdmDose2"}
//           // onMouseEnter={this.onPieEnter}
//           labelLine={true}
//           label = {props.pop == true? renderCustomizedLabelPop:renderCustomizedLabelFV }
//           rate = {props.pop}
          
//         >
//           {dataTot.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORRace[index % COLORRace.length]} />
//           ))}
//         <Label value={props.pop == true? "Population" : "Fully Vaccinated"} position="center" />
          
//         </Pie>
//       </PieChart>
//       {/* <span style={{ float: "left" }}>
//         <button onClick={handleDownload}>Download</button>
//       </span> */}
//       </div>
//     );} else {
//       return null;
//     }
// }

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
              <text x={372.5} y={70} style={{fontSize: '16px'}}> American Natives </text>                    


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
          <Race pop = {false} />
        </Grid.Column>
        <Grid.Column >
          <Race pop = {true}/> 
          {/* style = {{width: 200}} */}
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
                <Table.HeaderCell style={{fontSize: '14px'}}> {"Number received first dose"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {props.fips === "_nation" ? "":numberWithCommas(props.data[props.fips]["Administered_Dose1"])} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(props.data["_nation"]["Administered_Dose1"])} </Table.HeaderCell>

              </Table.Row>
              <Table.Row textAlign = 'center'>
                <Table.HeaderCell style={{fontSize: '14px'}}> {"Percent received first dose"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {props.fips === "_nation" ? "":numberWithCommas(props.data[props.fips]["percentVaccinatedDose1"]) + "%"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(props.data["_nation"]["percentVaccinatedDose1"]) + "%"} </Table.HeaderCell>

              </Table.Row>
              <Table.Row textAlign = 'center'>
                <Table.HeaderCell style={{fontSize: '14px'}}> {"Number received second dose"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {props.fips === "_nation" ? "":numberWithCommas(props.data[props.fips]["Series_Complete_Yes"])} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(props.data["_nation"]["Series_Complete_Yes"])} </Table.HeaderCell>

              </Table.Row>
              <Table.Row textAlign = 'center'>
                <Table.HeaderCell style={{fontSize: '14px'}}> {"Percent received second dose"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {props.fips === "_nation" ? "":numberWithCommas(props.data[props.fips]["Series_Complete_Pop_Pct"]) + "%"} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(props.data["_nation"]["Series_Complete_Pop_Pct"]) + "%"} </Table.HeaderCell>

              </Table.Row>
              
              <Table.Row textAlign = 'center'>
                <Table.HeaderCell style={{fontSize: '14px'}}> {"Distributed on " + props.date} </Table.HeaderCell>
                <Table.HeaderCell  style={{fontSize: '14px'}}> {props.fips === "_nation" ? "":numberWithCommas(props.data[props.fips]["Doses_Distributed"].toFixed(0))} </Table.HeaderCell>
                <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(props.data["_nation"]["Doses_Distributed"].toFixed(0))} </Table.HeaderCell>

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
    return payload[attribute]===0 ? null : payload[attribute]+'%';

  };

  let barSize = 50

  const data = [
    {
      name: '% Population',
      white: props.demogData['race'][0]['White'][0]['percentPop'].toFixed(1),
      black: props.demogData['race'][0]['African American'][0]['percentPop'].toFixed(1),
      hispanic: props.demogData['race'][0]['Hispanic'][0]['percentPop'].toFixed(1),
      asian: props.demogData['race'][0]['Asian'][0]['percentPop'].toFixed(1),
      american_natives: props.demogData['race'][0]['American Natives'][0]['percentPop'].toFixed(1),
    },
    {
      name: '% Vaccination',
      white: props.fips == '_nation' ? props.demogData['vaccineRace'][0]['White'][0]['pctAdmDose2'].toFixed(1)
         :(props.VaccineData[props.fips][0]['White'][0]['percentVaccinated'] === -9999 ? 0 
            : props.VaccineData[props.fips][0]['White'][0]['percentVaccinated']),
      black: props.fips == '_nation' ? props.demogData['vaccineRace'][0]['African American'][0]['pctAdmDose2'].toFixed(1)
         :(props.VaccineData[props.fips][0]['Black'][0]['percentVaccinated'] === -9999 ? 0 
            : props.VaccineData[props.fips][0]['Black'][0]['percentVaccinated']),
      hispanic: props.fips == '_nation' ? props.demogData['vaccineRace'][0]['Hispanic'][0]['pctAdmDose2'].toFixed(1)
         :(props.VaccineData[props.fips][0]['Hispanic'][0]['percentVaccinated'] === -9999 ? 0 
            : props.VaccineData[props.fips][0]['Hispanic'][0]['percentVaccinated']),
      asian: props.fips == '_nation' ? props.demogData['vaccineRace'][0]['Asian'][0]['pctAdmDose2'].toFixed(1)
         :(props.VaccineData[props.fips][0]['Asian'][0]['percentVaccinated'] === -9999 ? 0 
            : props.VaccineData[props.fips][0]['Asian'][0]['percentVaccinated']),
      american_natives: props.fips == '_nation' ? props.demogData['vaccineRace'][0]['American Natives'][0]['pctAdmDose2'].toFixed(1)
         :(props.VaccineData[props.fips][0]['American Natives'][0]['percentVaccinated'] === -9999 ? 0 
            : props.VaccineData[props.fips][0]['American Natives'][0]['percentVaccinated'])
    }
  ]

const CustomTooltip = ({ active, payload, label }) => {

  if (active && payload && payload.length && hoverBar[0]>=0) {
    var colIndex = 4-hoverBar[0];

    return (
      <div className='tooltip' style={{background: 'white', border:'2px', borderStyle:'solid', borderColor: '#DCDCDC', borderRadius:'2px', padding: '0.8rem'}}>
        <p style={{color: pieChartRace[colIndex]}}> <b> {hoverBar[2]} </b> </p>
        {/* ${payload[hoverBar[0]]['name']}  */}
        <p className="label">{`% Population: ${data[0][hoverBar[1]]}`}</p>
        <p className="label">{`% Vaccinated : ${data[1][hoverBar[1]]}`}</p>
      </div>
    );
  }

  return null;
};

console.log('active index', activeIndex);

  return(
    // <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={400}
          height={500}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 10,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis domain={[0,100]}/>
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
          <Legend />
          <Bar name='American Natives' id='an' barSize={barSize} dataKey="american_natives" stackId="a" fill={pieChartRace[4]}
            onMouseEnter={()=>{setHoverBar([0,'american_natives', 'American Natives']); setActiveIndex(0)}}
            onMouseLeave={()=>setActiveIndex(-1)}>
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={activeIndex === 0 ? 'white' : pieChartRace[4]}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("american_natives")} position="right" fill='black'/>
          </Bar>
          <Bar name='Asian' id='asian' barSize={barSize} dataKey="asian" stackId="a" fill={pieChartRace[3]}
            onMouseEnter={()=>{setHoverBar([1,'asian', 'Asian']); setActiveIndex(1)}}
            onMouseLeave={()=>setActiveIndex(-1)}> 
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} style={{zIndex: -10}} fill={activeIndex === 1 ? 'white' : pieChartRace[3]}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("asian")} fill='white'/>
          </Bar>
          <Bar name='Hispanic' id='hispanic' barSize={barSize} dataKey="hispanic" stackId="a" fill={pieChartRace[2]}
            onMouseEnter={()=>{setHoverBar([2,'hispanic', 'Hispanic']); setActiveIndex(2)}}
            onMouseLeave={()=>setActiveIndex(-1)}>
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={activeIndex === 2 ? 'white' : pieChartRace[2]}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("hispanic")} fill='white'/>
          </Bar>
          <Bar name='African Americans' id='black' barSize={barSize} dataKey="black" stackId="a" fill={pieChartRace[1]}
            onMouseEnter={()=>{setHoverBar([3,'black', 'African Americans']); setActiveIndex(3)}}
            onMouseLeave={()=>setActiveIndex(-1)}>
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} stroke='white' strokeWidth={activeIndex === 3 ? 2 : 0}/>
                // fill={activeIndex === 3 ? 'white' : pieChartRace[1]}
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("black")} fill='white'/>
          </Bar>
          <Bar name='White' id='white' barSize={barSize} dataKey="white" stackId="a" fill={pieChartRace[0]}
            onMouseEnter={()=>{setHoverBar([4,'white','White']); setActiveIndex(4)}}
            onMouseLeave={()=>setActiveIndex(-1)}>
            {/* {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={activeIndex === 4 ? 'white' : pieChartRace[0]}/>
              ))
            } */}
            <LabelList valueAccessor={valueAccessor("white")} fill='white'/>
            
          </Bar>
          
          
          
        </BarChart>
      //</ResponsiveContainer>


    // <div>
    //       <VictoryChart
    //         theme={VictoryTheme.material}
    //         domainPadding={{ x: 10 }}
    //         containerComponent={<VictoryContainer responsive={false}/>}
    //       >
    //         <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
    //         <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                          
    //         {props.fips === '_nation' ? null :
    //         <VictoryBar
    //           horizontal
    //           barWidth={20}
    //           labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
              
    //           style={{
    //             data: { fill: "#00ff00" , opacity: 0.5}
    //           }}
    //           data={
    //             [
    //               // {key: "Hispanic", 'value': props.VaccineData[props.fips][0]['Hispanic'][0]['percentVaccinated']},
    //             {key: "American Natives", 'value': props.VaccineData[props.fips][0]['American Natives'][0]['percentVaccinated']},
    //             {key: "Asian", 'value': props.VaccineData[props.fips][0]['Asian'][0]['percentVaccinated']},
    //             // {key: "African American", 'value': props.VaccineData[props.fips][0]['African American'][0]['percentVaccinated']},
    //             {key: "White", 'value': props.VaccineData[props.fips][0]['White'][0]['percentVaccinated']}
    //           ]
    //           }
    //           x="key"
    //           y="value"
    //         />}

    //         <VictoryBar 
    //           horizontal
    //           barWidth={20}
    //           labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0) <= 1? parseFloat(datum.value).toFixed(1) : parseFloat(datum.value).toFixed(0)) + "%"}
    //           style={{
    //             data: { fill: "#00000", opacity: 0.2 }
    //           }}
    //           data={
    //             [{key: props.data['race'][0]['Hispanic'][0]['demogLabel'], 'value': props.data['race'][0]['Hispanic'][0]['percentPop']},
    //             {key: props.data['race'][0]['American Natives'][0]['demogLabel'], 'value': props.data['race'][0]['American Natives'][0]['percentPop']},
    //             {key: props.data['race'][0]['Asian'][0]['demogLabel'], 'value': props.data['race'][0]['Asian'][0]['percentPop']},
    //             {key: props.data['race'][0]['African American'][0]['demogLabel'], 'value': props.data['race'][0]['African American'][0]['percentPop']},
    //             {key: props.data['race'][0]['White'][0]['demogLabel'], 'value': props.data['race'][0]['White'][0]['percentPop']}]
    //           }
    //           x="key"
    //           y="value"
    //         />
    //       </VictoryChart>
    //     </div>
  )
}


// const TabExampleBasic = () => <Tab panes={panes} />

function TabExampleBasic(props){
  console.log('fips', props.fips)
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


function NewLinePlot(props){
  const data = props.data;
  const dataState = props.dataState;
  const sfps = props.stateFips;
  const ticks = props.ticks;
  const variable = props.var;
  const tickFormatter = props.tickFormatter;
  const labelFormatter = props.labelFormatter;

  
// ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter}
    return (
      
        <LineChart width={450} height={300} data={data["_nation"]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey = "t" allowDuplicatedCategory={false}/>
          <YAxis  />
          <Tooltip />
          <Line data = {data["_nation"]} type="monotone" dataKey={variable} stroke="#8884d8" dot={false}/>
          {/* <Line data = {dataState} type="monotone" dataKey={variable} stroke="#82ca9d" dot={false}/> */}
          
          <Brush dataKey = "t" startIndex = {0} />

        </LineChart>

      
    );
  
}



export default function USVaccineTracker(props) {
// const USVaccineTracker = (props) => {
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();
  const [caseTicks, setCaseTicks] = useState([]);
  
  // const [open, setOpen] = React.useState(true)
  const [showState, setShowState] = useState(false);
  const [clicked, setClicked] = useState(false);

  const [activeCharacter, setActiveCharacter] = useState('');

  const history = useHistory();
  const [tooltipContent, setTooltipContent] = useState('');
  
  const [stateLabels, setStateLabels] = useState();
  const [date, setDate] = useState('');
  const [vaccineDate, setVaccineDate] = useState('');

  const [data, setData] = useState();
  const [dataTS, setDataTS] = useState();
  const [VaxSeries, setVaxSeries] = useState();
  const [vaccineData, setVaccineData] = useState();
  const [stateVaccineData, setStateVaccineData] = useState();
  const [allTS, setAllTS] = useState();
  const [raceData, setRaceData] = useState();
  const [nationalDemog, setNationalDemog] = useState();

  const [hoverName, setHoverName] = useState('The United States');
  const [stateName, setStateName] = useState('The United States');
  const [usAbbrev, setUSabbrev] = useState('');
  const [stateMapName, setStateMapName] = useState('State');
  const [fips, setFips] = useState('_nation');
  const [stateFips, setStateFips] = useState();
  const [stateMapFips, setStateMapFips] = useState("_nation");
  const [config, setConfig] = useState();
  const [countyFips, setCountyFips] = useState('');
  const [colorScaleState, setColorScaleState] = useState();
  const [legendMaxState, setLegendMaxState] = useState([]);
  const [legendMinState, setLegendMinState] = useState([]);
  const [legendSplitState, setLegendSplitState] = useState([]);
  const [metricOptions, setMetricOptions] = useState('caserate7dayfig');

  const [colorScale, setColorScale] = useState();
  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [varMap, setVarMap] = useState({});
  const [vaxVarMap, setVaxVarMap] = useState({});
  const [metric, setMetric] = useState('caserate7dayfig');
  const [fully, setFully] = useState('PercentAdministeredPartial');

  const [pctVacPopDisp, setPctVacPopDisp] = useState(0);
  const [finalStr, setFinalStr] = useState('');
  const [vaccineProp, setVaccine] = useState();
  const [selectedName, setSelectedName] = useState();

  const vaccineOptions = [
    {
      key: 'PercentAdministeredPartial',
      text: '% of population partially vaccinated (one dose received)',
      value: 'PercentAdministeredPartial',
    },
    {
      key: 'Series_Complete_Pop_Pct',
      text: '% of population fully vaccinated (two doses received)',
      value: 'Series_Complete_Pop_Pct',
    },
  ]
  const vaccineList = 
    {
      'PercentAdministeredPartial': '% of population partially vaccinated (one dose received)',
      'Series_Complete_Pop_Pct': '% of population fully vaccinated (two doses received)'

    }
    
  useEffect(() => {
    if (dataTS ){
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
          dataTS["_nation"][275 ].t,
          dataTS["_nation"][dataTS["_nation"].length-1].t]);
          //console.log("dataTS", dataTS["_nation"][0].t);
    }
  }, [dataTS]);

  const labelTickFmt = (tick) => { 
    return (
      // <text>// </ text>
        /* {tick} */
        // monthNames[new Date(tick*1000).getMonth()] + " " +  new Date(tick*1000).getDate()
        new Date(tick*1000).getFullYear() + "/" + (new Date(tick*1000).getMonth()+1) + "/" +  new Date(tick*1000).getDate()
      
      );
  };

  const caseTickFmt = (tick) => { 
    return (
      // <text>// </ text>
        /* {tick} */
        // monthNames[new Date(tick*1000).getMonth()] + " " +  new Date(tick*1000).getDate()
        (new Date(tick*1000).getMonth()+1) + "/" +  new Date(tick*1000).getDate()
      
      );
  };

  useEffect(()=>{
    fetch('/data/date.json').then(res => res.json())
      .then(x => {setDate(x.date.substring(5,7) + "/" + x.date.substring(8,10) + "/" + x.date.substring(0,4));});
    
    fetch('/data/vaccinedate.json').then(res => res.json())
      .then(x => {setVaccineDate(x.date.substring(5,7) + "/" + x.date.substring(8,10));});
    
    fetch('/data/allstates.json').then(res => res.json())
      .then(x => {setStateLabels(x);});

    fetch('/data/stateVaccineData.json').then(res => res.json())
      .then(x => {setStateVaccineData(x);});


    fetch('/data/rawdata/variable_mapping_Vaccine.json').then(res => res.json())
      .then(x => {setVaxVarMap(x);});

    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        setMetricOptions(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.variable, text: d.name, def: d.definition, group: d.group};
        }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
      });
    fetch('/data/nationalDemogdata.json').then(res => res.json())
      .then(x => {
        setNationalDemog(x);
        var listW = [];
        var count = (x['vaccineRace'][0]['White'][0]['pctAdmDose2'] >= x['vaccineRace'][0]['White'][0]['percentPop']) 
        + 
        (x['vaccineRace'][0]['Hispanic'][0]['pctAdmDose2'] >= x['vaccineRace'][0]['Hispanic'][0]['percentPop']) 
        + 
        (x['vaccineRace'][0]['African American'][0]['pctAdmDose2'] >= x['vaccineRace'][0]['African American'][0]['percentPop']) 
        +
        (x['vaccineRace'][0]['Asian'][0]['pctAdmDose2'] >= x['vaccineRace'][0]['Asian'][0]['percentPop'])
        +
        (x['vaccineRace'][0]['American Natives'][0]['pctAdmDose2'] >= x['vaccineRace'][0]['American Natives'][0]['percentPop']);

        setPctVacPopDisp(count);

        if(x['vaccineRace'][0]['White'][0]['pctAdmDose2'] > x['vaccineRace'][0]['White'][0]['percentPop']){
          listW.push("Whites");
        }
        if(x['vaccineRace'][0]['Hispanic'][0]['pctAdmDose2'] > x['vaccineRace'][0]['Hispanic'][0]['percentPop']){
          listW.push("Hispanic");
        }
        if(x['vaccineRace'][0]['African American'][0]['pctAdmDose2'] > x['vaccineRace'][0]['African American'][0]['percentPop']){
          listW.push("African American");
        }
        if(x['vaccineRace'][0]['Asian'][0]['pctAdmDose2'] > x['vaccineRace'][0]['Asian'][0]['percentPop']){
          listW.push("Asian");
        }
        if(x['vaccineRace'][0]['American Natives'][0]['pctAdmDose2'] > x['vaccineRace'][0]['American Natives'][0]['percentPop']){
          listW.push("American Natives");
        }
        var joinedStr = listW.join();
        var indexStr = 0;
        var i;
        for (i = 0; i< (count - 1); i++){
          indexStr = joinedStr.indexOf(',', indexStr);
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

    fetch('/data/timeseriesAll.json').then(res => res.json())
      .then(x => {setAllTS(x);});

    fetch('/data/racedataAll.json').then(res => res.json())
      .then(x => {setRaceData(x);});
    
    fetch('/data/rawdata/USabb.json').then(res => res.json())
      .then(x => {setUSabbrev(x);});

    fetch('/data/data.json').then(res => res.json())
      .then(x => {
        setData(x);
      });
    
  }, []);



  useEffect(() => {
    if (metric) {
      fetch('/data/VaccineTimeseries.json').then(res => res.json())
        .then(x => {setVaxSeries(x);});
      
      fetch('/data/vaccineData.json').then(res => res.json())
        .then(x => {
          setVaccineData(x);
          const cs = scaleQuantile()
            .domain(_.map(_.filter(_.map(x, (d, k) => {
              d.fips = k
              return d}), 
              d => (
                  d[fully] >= 0 &&
                  d.fips.length === 2)),
              d=> d[fully]))
            .range(colorPalette);
  
            let scaleMap = {}
            _.each(x, d=>{
              if(d[fully] >= 0){
              scaleMap[d[fully]] = cs(d[fully])}});
          
            setColorScale(scaleMap);
            var max = 0
            var min = 100
            _.each(x, d=> { 
              if (d[fully] > max && d.fips.length === 2) {
                max = d[fully]
              } else if (d.fips.length === 2 && d[fully] < min && d[fully] >= 0){
                min = d[fully]
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
      
    }
  }, [fully]);



  useEffect(()=>{
    if (metric) {

    
    const configMatched = configs.find(s => s.fips === stateMapFips);

    if (!configMatched){
      
    }else{

      setConfig(configMatched);

      setStateMapName(configMatched.name);

      fetch('/data/data.json').then(res => res.json())
        .then(x => {
          

          const cs = scaleQuantile()
          .domain(_.map(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[metric] > 0 &&
                d.fips.length === 5)),
            d=> d[metric]))
          .range(colorPalette);

          let scaleMap = {}
          _.each(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[metric] > 0 &&
                d.fips.length === 5))
                , d=>{
            scaleMap[d[metric]] = cs(d[metric])});

          setColorScaleState(scaleMap);
          var max = 0
          var min = 100
          _.each(x, d=> { 
            if (d[metric] > max && d.fips.length === 5) {
              max = d[metric]
            } else if (d.fips.length === 5 && d[metric] < min && d[metric] > 0){
              min = d[metric]
            }
          });

          if (max > 999) {
            max = (max/1000).toFixed(0) + "K";
            setLegendMaxState(max);
          }else{
            setLegendMaxState(max.toFixed(0));

          }
          setLegendMinState(min.toFixed(0));

          var split = scaleQuantile()
          .domain(_.map(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[metric] > 0 &&
                d.fips.length === 5)),
            d=> d[metric]))
          .range(colorPalette);

          setLegendSplitState(split.quantiles());
        });
      }
    }
     
  }, []);

  // useEffect(()=>{
    
  //   if (isLoggedIn === true){
  //     const fetchData = async() => { 
  //       // let seriesDict = {};
  //       const stateSeriesQ = {tag: "stateonly"};
  //       const promState = await CHED_series.find(stateSeriesQ,{projection:{}}).toArray();
  //       // _.map(promState, i=> {
  //       //   seriesDict[i[Object.keys(i)[4]]] = i[Object.keys(i)[5]];
  //       //   return seriesDict;
  //       // });
  //       // let seriesDict = promState[0].timeseriesAll;
  //       setDataTS(promState[0].timeseriesAll);
  //     };
  //     fetchData();
  //   } else {
  //     handleAnonymousLogin();
  //   }


  // },[isLoggedIn]);

  

  useEffect(()=>{
    fetch('/data/timeseriesAll.json').then(res => res.json())
        .then(x => setDataTS(x));
  
  },[]);


  const componentRef = useRef();


  if (data && stateLabels && allTS && vaccineData && fips && dataTS && stateMapFips && VaxSeries && nationalDemog && stateVaccineData) {
    console.log(stateVaccineData["01"][0]["Asian"][0]["percentVaccinated"]);
    console.log('nationalDemog', nationalDemog)
    console.log('stateVaccineData', stateVaccineData)
  return (
    <HEProvider>
      <div>
        <AppBar menu='vaccineTracker'/>
        <Container style={{marginTop: '8em', width: 1260, overFlowX: 'hidden'}}>
          {/* <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt"}}>
            <Breadcrumb.Section active >Vaccination: United States</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
          </Breadcrumb>
          <Divider hidden /> */}
          <Grid >
            
            <Grid.Column style={{zIndex: 10, width:140}}>
              <Ref innerRef={createRef()} >
                <StickyExampleAdjacentContext activeCharacter={activeCharacter}  />
              </Ref>
            </Grid.Column>
            <Grid.Column style = {{paddingLeft: 170, width: 1000}}>
              <center>  
                <Waypoint onEnter={() => {
                  setActiveCharacter('USA Vaccination Tracker')}}>
                </Waypoint> 
              </center>
              {/* <Grid columns={14}> */}
              <div>     	
                <Header as='h2' style={{color: "#004071",textAlign:'center', fontWeight: 400, fontSize: "24pt", paddingTop: 17, paddingLeft: 210, paddingBottom: 50}}>
                  <Header.Content >
                  <b> COVID-19 Vaccination Tracker </b> 
                  
                  </Header.Content>
                </Header>
              </div>
              <Divider horizontal style={{fontWeight: 400, width: 1000, color: 'black', fontSize: '22pt', paddingLeft: 20}}> The United States </Divider>

              <Grid>


              <Grid.Row columns = {5} style = {{width: 1000, paddingLeft: 35, paddingTop: 40}}>
                  <Grid.Column style = {{width: 240, paddingLeft: 0, paddingTop: 8, paddingBottom: 0}}> 
                        <center style={{width: 240,fontSize: "22px", fontFamily: 'lato', color: "#000000", textAlign: "center", paddingBottom: 0}}>Total doses delivered</center>

                    
                  </Grid.Column>
                  
                  <Grid.Column style = {{width: 240, paddingLeft: 85, paddingTop: 8}}> 
                        <center style={{width: 240,fontSize: "22px", fontFamily: 'lato', color: "#000000", textAlign: "center", paddingBottom: 0}}>Total doses administered</center>

                  </Grid.Column>
                  <Grid.Column style = {{width: 240, paddingLeft: 170, paddingTop: 8}}> 
           
                        <center style={{width: 240, fontSize: "22px", fontFamily: 'lato', color: "#000000", textAlign: "center"}}>Number received <br/> at least one dose</center>

                  </Grid.Column>
                  <Grid.Column style = {{width: 240, paddingLeft: 232, paddingTop: 8}}> 
                   
                        <center style={{width: 240, fontSize: "22px", fontFamily: 'lato', color: "#000000", textAlign: "center"}}>Number received <br/> second dose</center>
  
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns = {5} style = {{width: 1000, paddingLeft: 35, paddingTop: 0}}>
                  <Grid.Column style = {{width: 240, paddingLeft: 0, paddingTop: 0}}> 
                    <div style = {{width: 240, background: "#e5f2f7", height: 130}}>
                      <Header style = {{textAlign: "center"}}>
                        {/* <p style={{fontSize: "24px", fontFamily: 'lato', color: "#004071", textAlign: "center"}}> Number received <br/> first dose <br/><br/></p> */}
                        <Header.Content style = {{paddingBottom: 5}}>
                        <br/><br/><p style={{width: 240, fontSize: "28px", fontFamily: 'lato', color: "#000000"}}>{numberWithCommas(vaccineData["_nation"]["Doses_Distributed"])}</p><br/>
                        </Header.Content>
                      </Header>
                    </div>
                  </Grid.Column>
                  
                  <Grid.Column style = {{width: 240, paddingLeft: 85, paddingTop: 0}}> 
                    <div style = {{width: 240, background: "#e5f2f7", height: 130}}>
                      <Header style = {{textAlign: "center"}}>
                        {/* <p style={{fontSize: "24px", fontFamily: 'lato', color: "#004071", textAlign: "center"}}> Number received <br/> first dose <br/><br/></p> */}
                        <Header.Content style = {{paddingBottom: 5}}>
                        <br/><br/><p style={{width: 240, fontSize: "28px", fontFamily: 'lato', color: "#000000"}}>{numberWithCommas(vaccineData["_nation"]["Doses_Administered"])}</p><br/>
                        </Header.Content>
                      </Header>
                    </div>
                  </Grid.Column>
                  <Grid.Column style = {{width: 240, paddingLeft: 170, paddingTop: 0}}> 
                    <div style = {{width: 240, background: "#e5f2f7", height: 130}}>
                      <Header style = {{textAlign: "center"}}>
                        {/* <p style={{fontSize: "24px", fontFamily: 'lato', color: "#004071", textAlign: "center"}}> Number received <br/> first dose <br/><br/></p> */}
                        <Header.Content style = {{paddingBottom: 5}}>
                          
                        <br/><br/><p style={{fontSize: "28px", fontFamily: 'lato', color: "#000000"}}>{numberWithCommas(vaccineData["_nation"]["Administered_Dose1"])}</p><br/>
                        </Header.Content>
                      </Header>
                    </div>
                  </Grid.Column>
                  <Grid.Column style = {{width: 240, paddingLeft: 232, paddingTop: 0}}> 
                    <div style = {{width: 240, background: "#e5f2f7", height: 130}}>
                      <Header style = {{textAlign: "center"}}>
                        {/* <p style={{fontSize: "24px", fontFamily: 'lato', color: "#004071", textAlign: "center"}}> Number received second dose <br/><br/></p> */}
                        <Header.Content style = {{paddingBottom: 5}}>
                        
                        <br/><br/><p style={{fontSize: "28px", fontFamily: 'lato', color: "#000000"}}>{numberWithCommas(vaccineData["_nation"]["Series_Complete_Yes"])}</p><br/>
                        </Header.Content>
                      </Header>
                      {/* <Grid style = {{width: 240}}>
                        <Grid.Row style = {{width: 240}}>
                          <Grid.Column style = {{width: 240, paddingTop: 0, paddingBottom: 5, textAlign: "center"}}>
                            <Header>
                              <p style={{fontSize: "24px", fontFamily: 'lato', color: "#004071", textAlign: "center"}}> Newly distributed per 100,000 <br/><br/></p>
                            </Header>
                            <p style={{fontSize: "28px", fontWeight: 800, fontFamily: 'lato', color: "#004071"}}>{numberWithCommas(vaccineData["_nation"]["Dist_Per_100K_new"].toFixed(0))}</p>

                          </Grid.Column>
                          
                        </Grid.Row> */}
                        {/* <Grid.Row columns = {2} style = {{width: 240}}>
                          
                          <Grid.Column style = {{width: 140, height: 100}}>
                            
                            <br/><br/><br/><br/>
                              <p style={{fontSize: "28px", fontWeight: 800, fontFamily: 'lato', color: "#004071"}}>{numberWithCommas(vaccineData["_nation"]["Dist_Per_100K_new"].toFixed(0))}</p>
                       
                          </Grid.Column>
                          <Grid.Column style = {{width: 100, paddingLeft: 0}}>
                                  <VictoryChart 
                                                      
                                    width={100}
                                    height={118}
                                    padding={{left: -5, right: -1, top: 20, bottom: 0}}
                                    containerComponent={<VictoryContainer responsive={false}/>}>
                                    
                                    <VictoryGroup 
                                      colorScale={[stateColor]}
                                    >

                                    <VictoryLine data={VaxSeries ? VaxSeries["_nation"] : [0,0,0]}
                                        x='t' y='Dist_new'
                                        />

                                    </VictoryGroup>
                                    <VictoryArea
                                      style={{ data: {fill: "#00BFFF" , fillOpacity: 0.1} }}
                                      data={VaxSeries? VaxSeries["_nation"] : [0,0,0]}
                                      x= 't' y = 'Dist_new'

                                    />
                                    
                                </VictoryChart>
                            </Grid.Column>
                          </Grid.Row> */}
                        {/* </Grid> */}
                      </div>
                    </Grid.Column>
                </Grid.Row>

                
              
              <Grid.Row>
               <Grid.Column style = {{width: 900, paddingLeft: 35, paddingTop: 18}}> 
                  <div style = {{width: 900}}>
                    <Header>
                    {/* <Accordion style = {{fontSize: "22px", fontFamily: 'lato', color: "#004071", paddingBottom: 0, lineHeight: "22px"}}defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{fontSize: "22px", fontFamily: 'lato', color: "#004071"}}>Percent of the U.S. population partially vaccinated</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                  <Header.Content style={{paddingBottom: 5, fontWeight: 300, paddingTop: 0, paddingLeft: 0,fontSize: "19px", width: 975}}>
                                    One of two doses of Pfizer or Moderna vaccine received
                                  </Header.Content>
                                ),
                              },
                          }
                      ]
                      } /> */}

                      {/* <p style={{fontSize: "22px", fontFamily: 'lato', color: "#004071", paddingBottom: 0, lineHeight: "22px"}}> Percent of population partially vaccinated
                        <Dropdown inline header = "">
                          <Dropdown.Menu>
                            <Dropdown.Item text = 'One of two doses of Pfizer or Moderna vaccine received' />
                            
                          </Dropdown.Menu>
                          
                        </Dropdown>
                      </p> */}
                      <div>
                        <Header style={{fontSize: "22px", fontFamily: 'lato', color: "#004071", width: 975}}>
                          Percent of the U.S. population partially vaccinated<br/>
                          <Header.Content style={{paddingBottom: 5, fontWeight: 300, paddingTop: 0, paddingLeft: 0,fontSize: "19px"}}>
                            One of two doses of Pfizer or Moderna vaccine received
                          </Header.Content>
                        </Header>
                      </div>
                      <Header.Content style = {{paddingBottom: 0, paddingTop: 0}}>
                        <Progress style = {{width: 970}} percent={((vaccineData["_nation"]["PercentAdministeredPartial"]).toFixed(1))} size='large' color='green' progress/>
                      </Header.Content>

                      {/* <Accordion style = {{fontSize: "22px", fontFamily: 'lato', color: "#004071", paddingBottom: 0, lineHeight: "22px"}}defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{fontSize: "22px", fontFamily: 'lato', color: "#004071"}}>Percent of the U.S. population fully vaccinated</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                  <Header.Content style={{paddingBottom: 5, fontWeight: 300, paddingTop: 0, paddingLeft: 0,fontSize: "19px", width: 975}}>
                                    Both doses of Pfizer or Moderna vaccine or one and only dose of Johnson and Johnson received
                                  </Header.Content>
                                ),
                              },
                          }
                      ]
                      } />  */}

                      {/* <p style={{fontSize: "22px", fontFamily: 'lato', color: "#004071", paddingBottom: 0, lineHeight: "22px"}}> Percent of population fully vaccinated 
                        <Dropdown inline header = "">
                          <Dropdown.Menu>
                            <Dropdown.Item text = 'Both doses of Pfizer or Moderna vaccine or one and only dose of Johnson and Johnson received' />
                            
                          </Dropdown.Menu>
                          
                        </Dropdown>
                      </p> */}
                      <div>
                        <Header style={{fontSize: "22px", fontFamily: 'lato', color: "#004071", width: 975}}>
                          Percent of the U.S. population fully vaccinated<br/>
                          <Header.Content style={{paddingBottom: 5, fontWeight: 300, paddingTop: 0, paddingLeft: 0,fontSize: "19px"}}>
                            Both doses of Pfizer or Moderna vaccine or one and only dose of Johnson and Johnson received
                          </Header.Content>
                        </Header>
                      </div>
                      <Header.Content style = {{paddingBottom: 0, paddingTop: 0}}>
                        <Progress style = {{width: 970}} percent={((vaccineData["_nation"]["Series_Complete_Pop_Pct"]).toFixed(1))} size='large' color='green' progress/>
                      </Header.Content>

                      {/* <Accordion style = {{fontSize: "22px", fontFamily: 'lato', color: "#004071", paddingBottom: 0, lineHeight: "22px"}}defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{fontSize: "22px", fontFamily: 'lato', color: "#004071"}}>Percent of the U.S. population that received at least one dose</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                  <Header.Content style={{paddingBottom: 5, fontWeight: 300, paddingTop: 0, paddingLeft: 0,fontSize: "19px", width: 975}}>
                                    One or more doses of any of the authorized vaccines received
                                  </Header.Content>
                                ),
                              },
                          }
                      ]
                      } /> */}

                      {/* <p style={{fontSize: "22px", fontFamily: 'lato', color: "#004071", paddingBottom: 0, lineHeight: "22px"}}> Percent of population that received at least one dose
                        <Dropdown inline header = "">
                          <Dropdown.Menu>
                            <Dropdown.Item text = 'One or more doses of any of the authorized vaccines received' />
                            
                          </Dropdown.Menu>
                          
                        </Dropdown>
                      
                      </p> */}
                      <div>
                        <Header style={{fontSize: "22px", fontFamily: 'lato', color: "#004071", width: 975}}>
                          Percent of the U.S. population that received at least one dose<br/>
                          <Header.Content style={{paddingBottom: 5, fontWeight: 300, paddingTop: 0, paddingLeft: 0,fontSize: "19px"}}>
                            One or more doses of any of the authorized vaccines received
                          </Header.Content>
                        </Header>
                      </div>
                      <Header.Content style = {{paddingBottom: 0, paddingTop: 0}}>
                        <Progress style = {{width: 970}} percent={((vaccineData["_nation"]["PercentAdministeredPartial"] + vaccineData["_nation"]["Series_Complete_Pop_Pct"]).toFixed(1))} size='large' color='green' progress/>
                      </Header.Content>
                    </Header>
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row >
              {stateFips && <Accordion id = "vaccine" style = {{paddingTop: 0, paddingLeft: 30, paddingBottom: 15}}defaultActiveIndex={1} panels={[
                        {
                            key: 'acquire-dog',
                            title: {
                                content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                icon: 'dropdown',
                            },
                            content: {
                                content: (
                                  <Header.Content style={{fontWeight: 300, paddingTop: 7, paddingLeft: 0,fontSize: "19px", width: 975}}>
                                    Data are from the <a href = 'https://covid.cdc.gov/covid-data-tracker/#vaccinations' target="_blank" rel="noopener noreferrer">CDC COVID Data Tracker</a>, last updated on {vaccineDate} <br/>
                                    <b><em> {vaxVarMap["Doses_Distributed"].name} </em></b> {vaxVarMap["Doses_Distributed"].definition} <br/>
                                    <b><em> {vaxVarMap["Administered_Dose1"].name} </em></b> {vaxVarMap["Administered_Dose1"].definition} <br/>
                                    <b><em> {vaxVarMap["Series_Complete_Yes"].name} </em></b> {vaxVarMap["Series_Complete_Yes"].definition} <br/>

                                    <b><em> Newly distributed per 100,000 </em></b> is the number of vaccine doses per 100,000 that have been 
                                    distributed to facilities across the United States by the federal government. 
                                    Newly distributed per 100,000 for the US was last updated on {vaccineData["_nation"]['distDate'].substring(5,7) + "/" + vaccineData["_nation"]['distDate'].substring(8,10)}.<br/>
                                    
                                    <b><em> {vaxVarMap["percentVaccinatedDose1"].name} </em></b> {vaxVarMap["percentVaccinatedDose1"].definition} <br/>
                                    <b><em> {vaxVarMap["Series_Complete_Pop_Pct"].name} </em></b> {vaxVarMap["Series_Complete_Pop_Pct"].definition} <br/>


                                  </Header.Content>
                                ),
                              },
                          }
                      ]
                      } /> }
              </Grid.Row>
              <div style = {{height: 25}}> </div>
              <Grid>
                <Grid.Column>
                  <Divider horizontal style={{fontWeight: 400, width: 1000, color: 'black', fontSize: '29px', paddingLeft: 20}}> COVID-19 Vaccination by Race & Ethnicity </Divider>

                </Grid.Column>
              </Grid>

              {/* <center style={{paddingLeft: 190}}><Divider style={{width: 900}}/> </center> */}
              {/* <Grid.Row columns = {1} style = {{width: 1000, paddingTop: 15}}>
                  <Grid.Column style = {{width: 810, paddingLeft: 60}}>
                    <div style={{paddingTop:'0em'}}>
                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: 190, paddingRight: "1em", paddingBottom: 0}}>
                        <center> <b style= {{fontSize: "22px"}}>Deaths by Race</b> </center> 
                        <br/>
                      </Header.Subheader>
                    </div>
                  </Grid.Column>
                  
              </Grid.Row>
                <Grid>
                  <Grid.Row columns = {2} style = {{width: 1000}}>
                    <Grid.Column style = {{width: 450, paddingLeft: 0}}>
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
                          <Header.Content style = {{paddingLeft: 50, width: 450}}>
                              <Header.Content style={{ fontWeight: 300, paddingTop: 20, paddingBottom:5, fontSize: "14pt", lineHeight: "18pt"}}>
                              <b>Percentage of COVID-19 Deaths and Population</b>
                              </Header.Content>
                          </Header.Content>
                      </div>
                    </Grid.Column>
                    <Grid.Column style = {{width: 0}}>
                      
                        <div style={{paddingLeft: 140, paddingRight: "0em"}}>
                          
                          <Header.Subheader style={{width: 400, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 6}}>
                            <center> <b style= {{fontSize: "22px", paddingLeft: 0}}> Risks for COVID-19 Deaths by Race/Ethnicity</b> </center> 
                            <br/><br/>
                            <p style = {{paddingLeft: 40}}>
                              Compared to the White <br/>
                              - African Americans: {(nationalDemog['race'][0]['African American'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                              {(nationalDemog['race'][0]['African American'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) <= 1? "times" : "times"} the risk
                              <br/>
                              - Hispanic: {(nationalDemog['race'][0]['Hispanic'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                              {(nationalDemog['race'][0]['Hispanic'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) <= 1? "times" : "times"} the risk
                              <br/>
                              - Asians: {(nationalDemog['race'][0]['Asian'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                              {(nationalDemog['race'][0]['Asian'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) <= 1? "times" : "times"} the risk
                              <br/>
                              - American Natives: {(nationalDemog['race'][0]['American Natives'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) + " "}
                              {(nationalDemog['race'][0]['American Natives'][0]['deathrate']/nationalDemog['race'][0]['White'][0]['deathrate']).toFixed(1) <= 1? "times" : "times"} the risk

                            
                              
                          </Header.Subheader>
                        
                        </div>
                    </Grid.Column>
                  </Grid.Row>

              </Grid> */}

              {/* <center style={{paddingLeft: 30}}><Divider style={{width: 1000}}/> </center> */}

              <Grid.Row columns = {1} style = {{width: 1000, paddingTop: 15}}>
                  <Grid.Column style = {{width: 810, paddingLeft: 60}}>
                    <div style={{paddingTop:'0em'}}>
                      <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: 190, paddingRight: "1em", paddingBottom: 0}}>
                        <center> <b style= {{fontSize: "22px"}}>Vaccination by Race & Ethnicity</b> </center> 
                        <br/>
                      </Header.Subheader>
                    </div>
                  </Grid.Column>
                  
              </Grid.Row>
              
              
                    
              <Grid>
                
                <Grid.Row columns = {2} style = {{width: 1000, paddingLeft: 0}} >
                  <Grid.Column rows = {2} >

                    {/* <Grid.Row style = {{width: 550}}>
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
                              <text x={352.5} y={70} style={{fontSize: '16px'}}> American Native </text>                     */}


                              {/* {_.map(pieChartRace, (color, i) => {
                                return <rect key={i} x={250} y={20*i} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                              })}  */}
                          {/* </svg>
                        </div>
                      </Grid.Column>
                    </Grid.Row> */}
                    {/* <Grid >
                      <Grid.Row columns = {2} style = {{width: 1000}}>
                        <Grid.Column style = {{width: 300}}>
                          <Race pop = {false}/>
                        </Grid.Column>
                        <Grid.Column style = {{width: 300, paddingLeft: 50}}>
                          <Race pop = {true}/> 
                        </Grid.Column>
                      </Grid.Row> */}
                      
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
                      {/* </Grid> */}
                      <ToPrint ref={componentRef} />
                    {/* <Button style={{marginTop: 10, marginLeft: 10}} active={false}
                      content='Export As PNG' onClick={() => exportComponentAsPNG(componentRef, {fileName:'vaccination_by_race&ethnicity'})} /> */}
                  </Grid.Column>
                  
                  <Grid.Column style = {{width: 450}}>
                    
                    <div style={{paddingTop: 0, paddingLeft: 140}}>
                      <Header.Subheader style={{width: 400, color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 6}}>
                        <center> <b style= {{fontSize: "22px", paddingLeft: 0}}> Under-vaccinated Populations</b> </center> 
                        
                        <p style = {{paddingLeft: 40}}>
                          <ul>
                            
                          {nationalDemog['vaccineRace'][0]['White'][0]['pctAdmDose2'] < nationalDemog['vaccineRace'][0]['White'][0]['percentPop'] && <li>
                            {nationalDemog['vaccineRace'][0]['White'][0]['pctAdmDose2'] < nationalDemog['vaccineRace'][0]['White'][0]['percentPop'] ? 
                            " White Americans make up " + (nationalDemog['vaccineRace'][0]['White'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['White'][0]['pctAdmDose2']).toFixed(0) + "% of the fully vaccinated." 
                          :
                            ""} </li>}

                            {nationalDemog['vaccineRace'][0]['Hispanic'][0]['pctAdmDose2'] < nationalDemog['vaccineRace'][0]['Hispanic'][0]['percentPop'] && <li>
                              {nationalDemog['vaccineRace'][0]['Hispanic'][0]['pctAdmDose2'] < nationalDemog['vaccineRace'][0]['Hispanic'][0]['percentPop'] ? 
                            " Hispanic Americans make up " + (nationalDemog['vaccineRace'][0]['Hispanic'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['Hispanic'][0]['pctAdmDose2']).toFixed(0) + "% of the fully vaccinated." 
                          :
                            ""}</li>}

                          {nationalDemog['vaccineRace'][0]['African American'][0]['pctAdmDose2'] < nationalDemog['vaccineRace'][0]['African American'][0]['percentPop'] && <li> 
                            {nationalDemog['vaccineRace'][0]['African American'][0]['pctAdmDose2'] < nationalDemog['vaccineRace'][0]['African American'][0]['percentPop'] ? 
                            " African Americans make up " + (nationalDemog['vaccineRace'][0]['African American'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['African American'][0]['pctAdmDose2']).toFixed(0) + "% of the fully vaccinated."
                          :
                            ""} </li>}

                          {nationalDemog['vaccineRace'][0]['Asian'][0]['pctAdmDose2'] < nationalDemog['vaccineRace'][0]['Asian'][0]['percentPop'] && <li>
                            {nationalDemog['vaccineRace'][0]['Asian'][0]['pctAdmDose2'] < nationalDemog['vaccineRace'][0]['Asian'][0]['percentPop'] ? 
                            " Asian Americans make up " + (nationalDemog['vaccineRace'][0]['Asian'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['Asian'][0]['pctAdmDose2']).toFixed(0) + "% of the fully vaccinated."
                          :
                            ""}</li>}

                          {nationalDemog['vaccineRace'][0]['American Natives'][0]['pctAdmDose2'] < nationalDemog['vaccineRace'][0]['American Natives'][0]['percentPop'] && <li>
                            {nationalDemog['vaccineRace'][0]['American Natives'][0]['pctAdmDose2'] < nationalDemog['vaccineRace'][0]['American Natives'][0]['percentPop'] ? 
                            " Native Americans make up " + (nationalDemog['vaccineRace'][0]['American Natives'][0]['percentPop']).toFixed(0) + "% of the population, but only " + 
                            (nationalDemog['vaccineRace'][0]['American Natives'][0]['pctAdmDose2']).toFixed(0) + "% of the fully vaccinated."
                          :
                            ""} </li>}
                          
                          
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

              <div style = {{height: 25}}> </div>
              <Grid>
                <Grid.Column>
                  <Divider horizontal style={{fontWeight: 400, width: 1000, color: 'black', fontSize: '29px', paddingLeft: 20}}> COVID-19 Vaccination by State </Divider>
                  
                </Grid.Column>
              </Grid>

              <Grid>

                <Grid.Row columns = {2} style = {{width: 1260}}>

                  <Grid.Column style = {{width: 1000, paddingLeft: 30, paddingRight: 50}}>

                        <div style = {{paddingBottom: 0, width: 1000}}>
                          <Header.Content style = {{paddingLeft: 20, fontSize: "22px"}}>
                            <a style = {{color: "#004071"}}> Click on a state. </a>
                            <br/>
                            <br/>
                            {/* <b> { selectedName? selectedName : "% of population partially vaccinated (one dose received)"}</b> */}
                          </Header.Content>

                          <Dropdown
                          style={{background: '#fff', 
                                  fontSize: "19px",
                                  fontWeight: 400, 
                                  theme: '#000000',
                                  width: '530px',
                                  top: '0px',
                                  left: '15px',
                                  text: "Select",
                                  borderTop: '0.5px solid #bdbfc1',
                                  borderLeft: '0.5px solid #bdbfc1',
                                  borderRight: '0.5px solid #bdbfc1', 
                                  borderBottom: '0.5px solid #bdbfc1',
                                  borderRadius: 0,
                                  minHeight: '1.0em',
                                  paddingBottom: '0.5em',
                                  paddingLeft: '1em'}}
                          text= { selectedName? selectedName : "% of population partially vaccinated (one dose received)"}
                          pointing = 'top'
                          search
                          selection
                          options={vaccineOptions}
                          onChange={(e, { value}) => {
                            setFully(value);
                            setSelectedName(vaccineList[value]);
                            
                                    
                          }}
                        />
                        <br/>
                          <svg width="460" height="80" >
                            {/* <text x={280} y={59} style={{fontSize: '1.5em'}}> Click on a state</text> */}
                            
                            {/* {_.map(legendSplit, (splitpoint, i) => {
                              if(legendSplit[i] < 1){
                                return <text key = {i} x={40 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(1)}</text>                    
                              }else if(legendSplit[i] > 999999){
                                return <text key = {i} x={40 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplit[i]/1000000).toFixed(0) + "M"}</text>                    
                              }else if(legendSplit[i] > 999){
                                return <text key = {i} x={40 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplit[i]/1000).toFixed(0) + "K"}</text>                    
                              }
                              return <text key = {i} x={40 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(0)}</text>                    
                            })}  */}
                            <text x={20} y={35} style={{fontSize: '0.7em'}}>{legendMin + "%"}</text>
                            <text x={140} y={35} style={{fontSize: '0.7em'}}>{legendMax + "%"}</text>


                            {_.map(colorPalette, (color, i) => {
                              return <rect key={i} x={20+20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                            })} 


                            <text x={20} y={74} style={{fontSize: '0.8em'}}>Low</text>
                            <text x={20+20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>

                          </svg>
                        </div>

                        <ComposableMap 
                          projection="geoAlbersUsa" 
                          data-tip=""
                          width={1100} 
                          height={450}
                          strokeWidth= {0.1}
                          stroke= 'black'
                          offsetX = {-375}
                          projectionConfig={{scale: 750}}


                          >
                          <Geographies geography={geoUrl}>
                            {({ geographies }) => 
                              <svg>
                                {setStateFips(fips)}
                                {geographies.map(geo => (
                                  <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onMouseEnter={()=>{
                                      const fips = geo.id.substring(0,2);
                                      const configMatched = configs.find(s => s.fips === fips);
                                      setFips(fips);
                                      setHoverName(configMatched.name)

                                    }}
                                    
                                    onMouseLeave={()=>{

                                      setTooltipContent("");
                                      setFips("_nation");
                                      setHoverName("The United States");
                                    }}

                                    onClick={()=>{
                                      const configMatched = configs.find(s => s.fips === fips);
                                      setStateName(configMatched.name); 
                                      setStateMapFips(geo.id.substring(0,2));

                                      setClicked(true);
                                      setShowState(true);

                                    }}

                                    
                                    fill={stateMapFips===geo.id.substring(0,2) || fips===geo.id.substring(0,2)?colorHighlight:
                                    ((colorScale && vaccineData[geo.id] && (vaccineData[geo.id][fully]) > 0)?
                                        colorScale[vaccineData[geo.id][fully]]: 
                                        (colorScale && vaccineData[geo.id] && vaccineData[geo.id][fully] === 0)?
                                          '#e1dce2':'#FFFFFF')}
                                  />


                                ))}

                                {geographies.map(geo => {
                                              const centroid = geoCentroid(geo);
                                              const cur = allStates.find(s => s.val === geo.id);
                                              return (
                                                <g key={geo.rsmKey + "-name"}>
                                                  {cur &&
                                                    centroid[0] > -160 &&
                                                    centroid[0] < -67 &&
                                                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                                                      <Marker coordinates={centroid}>
                                                        <text y="2" fontSize={14} textAnchor="middle">
                                                          {cur.id}
                                                        </text>
                                                      </Marker>
                                                    ) : (
                                                      <Annotation
                                                        subject={centroid}
                                                        dx={offsets[cur.id][0]}
                                                        dy={offsets[cur.id][1]}
                                                      >
                                                        <text x={4} fontSize={14} alignmentBaseline="middle">
                                                          {cur.id}
                                                        </text>
                                                      </Annotation>
                                                    ))}
                                                </g>
                                              );
                                            })}
                              </svg>
                            }
                          </Geographies>
                          

                        </ComposableMap>
                    
                        <Grid>
                          <Grid.Row>
                            {stateFips && <Accordion id = "burden" style = {{paddingTop: 10, paddingLeft: 14}} defaultActiveIndex={1} panels={[
                              {
                                  key: 'acquire-dog',
                                  title: {
                                      content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,icon: 'dropdown',
                                    },
                                    content: {
                                        content: (
                                          <Header.Content style={{fontWeight: 300, paddingTop: 7, paddingLeft: 0,fontSize: "19px", width: 975}}>
                                            Data are from the <a href = 'https://covid.cdc.gov/covid-data-tracker/#vaccinations' target="_blank" rel="noopener noreferrer">CDC COVID Data Tracker</a>, last updated on {vaccineDate} <br/>

                                            <b><em> {vaxVarMap["Doses_Distributed"].name} </em></b> {vaxVarMap["Doses_Distributed"].definition} <br/>
                                            <b><em> {vaxVarMap["Administered_Dose1"].name} </em></b> {vaxVarMap["Administered_Dose1"].definition} <br/>
                                            <b><em> {vaxVarMap["Series_Complete_Yes"].name} </em></b> {vaxVarMap["Series_Complete_Yes"].definition} <br/>

                                            <b><em> Newly distributed per 100,000 </em></b> is the number of vaccine doses per 100,000 that have been 
                                            distributed to facilities across the United States by the federal government. 
                                            Newly distributed per 100,000 for the US was last updated on {vaccineData["_nation"]['distDate'].substring(5,7) + "/" + vaccineData["_nation"]['distDate'].substring(8,10)}. 
                                            For {stateName === "_nation" ? "SELECT STATE": stateName}, the most recent date of new distribution was on {vaccineData[stateMapFips]['distDate'].substring(5,7) + "/" + vaccineData[stateMapFips]['distDate'].substring(8,10)}. <br/>
                                            
                                            <b><em> {vaxVarMap["percentVaccinatedDose1"].name} </em></b> {vaxVarMap["percentVaccinatedDose1"].definition} <br/>
                                            <b><em> {vaxVarMap["Series_Complete_Pop_Pct"].name} </em></b> {vaxVarMap["Series_Complete_Pop_Pct"].definition} <br/>

                                          </Header.Content>
                                      ),
                                    },
                                }
                              ]
                            } /> }
                          </Grid.Row>
                        </Grid>
                  </Grid.Column>
                  
                  <Grid.Column>
                    <div style = {{width: 425}}>
                      <TabExampleBasic data = {vaccineData} fips = {stateMapFips} stateName = {stateName} abbrev = {usAbbrev} date = {vaccineDate} demogData = {nationalDemog} VaccineData = {stateVaccineData}/>

                    </div>
                    {/* <Header as='h2' style={{fontWeight: 400}}>
                      <Header.Content style={{width : 350, height: 100, fontSize: "22px", textAlign: "center", paddingTop: 36, paddingLeft: 35}}>
                        Vaccination Status in <b>{stateName}</b>
                        
                        
                      </Header.Content>
                    </Header>
                    <Grid>
                      <Grid.Row style={{width: 350, paddingLeft: 35}}>
                        <Table celled fixed style = {{width: 350}}>
                          <Table.Header>

                            <tr textalign = "center" colSpan = "5" style = {{backgroundImage : 'url(/Emory_COVID_header_LightBlue.jpg)'}}>
                                <td colSpan='1' style={{width:130}}> </td>
                                <td colSpan='1' style={{width:110, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> {stateMapFips === "_nation" ? "Select State":usAbbrev[stateMapFips]["state_abbr"]}</td>
                                <td colSpan='1' style={{width:110, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> U.S.</td>
                            </tr>
                            <Table.Row textAlign = 'center' style = {{height: 40}}>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {"Number received first dose"} </Table.HeaderCell>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {stateMapFips === "_nation" ? "":numberWithCommas(vaccineData[stateMapFips]["Administered_Dose1"])} </Table.HeaderCell>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(vaccineData["_nation"]["Administered_Dose1"])} </Table.HeaderCell>

                            </Table.Row>
                            <Table.Row textAlign = 'center'>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {"Percent received first dose"} </Table.HeaderCell>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {stateMapFips === "_nation" ? "":numberWithCommas(vaccineData[stateMapFips]["percentVaccinatedDose1"]) + "%"} </Table.HeaderCell>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(vaccineData["_nation"]["percentVaccinatedDose1"]) + "%"} </Table.HeaderCell>

                            </Table.Row>
                            <Table.Row textAlign = 'center'>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {"Number received second dose"} </Table.HeaderCell>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {stateMapFips === "_nation" ? "":numberWithCommas(vaccineData[stateMapFips]["Series_Complete_Yes"])} </Table.HeaderCell>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(vaccineData["_nation"]["Series_Complete_Yes"])} </Table.HeaderCell>

                            </Table.Row>
                            <Table.Row textAlign = 'center'>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {"Percent received second dose"} </Table.HeaderCell>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {stateMapFips === "_nation" ? "":numberWithCommas(vaccineData[stateMapFips]["Series_Complete_Pop_Pct"]) + "%"} </Table.HeaderCell>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(vaccineData["_nation"]["Series_Complete_Pop_Pct"]) + "%"} </Table.HeaderCell>

                            </Table.Row>
                            
                            <Table.Row textAlign = 'center'>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {"Distributed on " + vaccineDate} </Table.HeaderCell>
                              <Table.HeaderCell  style={{fontSize: '14px'}}> {stateMapFips === "_nation" ? "":numberWithCommas(vaccineData[stateMapFips]["Doses_Distributed"].toFixed(0))} </Table.HeaderCell>
                              <Table.HeaderCell style={{fontSize: '14px'}}> {numberWithCommas(vaccineData["_nation"]["Doses_Distributed"].toFixed(0))} </Table.HeaderCell>

                            </Table.Row>
                            
                          </Table.Header>
                        </Table>
                      </Grid.Row>
                      
                    </Grid> */}
                    
                  </Grid.Column>
                </Grid.Row> 
                
              </Grid>
              <div style = {{height: 55}}> </div>

              <Grid>
                <Grid.Column>
                <Divider horizontal style={{fontWeight: 400, width: 1000, color: 'black', fontSize: '22pt', paddingLeft: 20, paddingBottom: 15}}> COVID-19 Burden in {stateName} </Divider>

                </Grid.Column>
              </Grid>

              <Grid.Row columns = {2} style = {{width: 1000}}>

                
                <Grid.Column style = {{width: 630}}>
                  <Grid>
                    

                  <Grid.Row columns = {2} style = {{width: 630, paddingLeft: 20}}>
                    <Grid.Column style = {{width: 240, paddingLeft: 15}}> 

                      <div>
                      {stateMapFips &&
                        <VictoryChart 
                                    minDomain={{ x: stateMapFips? allTS[stateMapFips][allTS[stateMapFips].length-15].t : allTS["13"][allTS["13"].length-15].t}}
                                    maxDomain = {{y: stateMapFips? getMaxRange(allTS[stateMapFips], "caseRateMean", (allTS[stateMapFips].length-15)).caseRateMean*1.05 : getMaxRange(allTS["13"], "caseRateMean", (allTS["13"].length-15)).caseRateMean*1.05}}                            
                                    width={220}
                                    height={180}
                                    padding={{marginLeft: 0, right: -1, top: 150, bottom: -0.9}}
                                    containerComponent={<VictoryContainer responsive={false}/>}>
                                    
                                    <VictoryAxis
                                      tickValues={stateMapFips ? 
                                        [
                                        allTS[stateMapFips][allTS[stateMapFips].length - Math.round(allTS[stateMapFips].length/3)*2 - 1].t,
                                        allTS[stateMapFips][allTS[stateMapFips].length - Math.round(allTS[stateMapFips].length/3) - 1].t,
                                        allTS[stateMapFips][allTS[stateMapFips].length-1].t]
                                        :
                                      [
                                        allTS["13"][allTS["13"].length - Math.round(allTS["13"].length/3)*2 - 1].t,
                                        allTS["13"][allTS["13"].length - Math.round(allTS["13"].length/3) - 1].t,
                                        allTS["13"][allTS["13"].length-1].t]}                         
                                      style={{grid:{background: "#ccdee8"}, tickLabels: {fontSize: 10}}} 
                                      tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                                    
                                    <VictoryGroup 
                                      colorScale={[stateColor]}
                                    >

                                    <VictoryLine data={stateMapFips && allTS[stateMapFips] ? allTS[stateMapFips] : allTS["13"]}
                                        x='t' y='caseRateMean'
                                        />

                                    </VictoryGroup>
                                    <VictoryArea
                                      style={{ data: {fill: "#00BFFF" , fillOpacity: 0.1} }}
                                      data={stateMapFips && allTS[stateMapFips]? allTS[stateMapFips] : allTS["13"]}
                                      x= 't' y = 'caseRateMean'

                                    />

                                    <VictoryLabel text= {stateMapFips ? numberWithCommas((allTS[stateMapFips][allTS[stateMapFips].length - 1].dailyCases).toFixed(0)) : numberWithCommas((allTS["13"][allTS["13"].length - 1].dailyCases).toFixed(0))} x={80} y={80} textAnchor="middle" style={{fontSize: 40, fontFamily: 'lato', fill: "#004071"}}/>
                                    
                                    <VictoryLabel text= {stateMapFips ? 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyCases).toFixed(0) > 0? (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyCases).toFixed(0) + "%": 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyCases).toFixed(0) < 0? ((allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyCases).toFixed(0)).substring(1) + "%": 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyCases).toFixed(0) + "%"
                                                        : 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyCases).toFixed(0) > 0? (allTS["13"][allTS["13"].length - 1].percent14dayDailyCases).toFixed(0) + "%": 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyCases).toFixed(0) < 0? ((allTS["13"][allTS["13"].length - 1].percent14dayDailyCases).toFixed(0)).substring(1) + "%": 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyCases).toFixed(0) + "%"} x={197} y={80} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato', fill: "#004071"}}/>
                                    
                                    <VictoryLabel text= {stateMapFips ? 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyCases).toFixed(0) > 0? "↑": 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyCases).toFixed(0) < 0? "↓": ""
                                                        : 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyCases).toFixed(0) > 0? "↑": 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyCases).toFixed(0) < 0? "↓": ""} 
                                                        

                                                        x={160} y={80} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'

                                                        , fill: stateMapFips ? 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyCases).toFixed(0) > 0? "#FF0000": 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyCases).toFixed(0) < 0? "#32CD32": ""
                                                        : 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyCases).toFixed(0) > 0? "#FF0000": 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyCases).toFixed(0) < 0? "#32CD32": ""

                                                      }}/>

                                    <VictoryLabel text= {"14-day"}  x={197} y={100} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {"change"}  x={197} y={110} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {"Daily Cases"}  x={110} y={20} textAnchor="middle" style={{fontSize: "22px", fontFamily: 'lato'}}/>

                                    
                        </VictoryChart>}
                      </div>
                    </Grid.Column>
                    <Grid.Column style = {{width: 240, paddingLeft: 55}}> 
                      <div>
                      {stateMapFips && 
                        <VictoryChart theme={VictoryTheme.material}
                                    minDomain={{ x: stateMapFips? allTS[stateMapFips][allTS[stateMapFips].length-15].t: allTS["13"][allTS["13"].length-15].t}}
                                    maxDomain = {{y: stateMapFips? getMax(allTS[stateMapFips], "mortalityMean").mortalityMean + 0.8: getMax(allTS["13"], "mortalityMean").mortalityMean + 0.8}}                            
                                    width={220}
                                    height={180}       
                                    padding={{left: 0, right: -1, top: 150, bottom: -0.9}}
                                    containerComponent={<VictoryContainer responsive={false}/>}>
                                    
                                    <VictoryAxis
                                      tickValues={stateMapFips ? 
                                        [
                                        allTS[stateMapFips][allTS[stateMapFips].length - Math.round(allTS[stateMapFips].length/3)*2 - 1].t,
                                        allTS[stateMapFips][allTS[stateMapFips].length - Math.round(allTS[stateMapFips].length/3) - 1].t,
                                        allTS[stateMapFips][allTS[stateMapFips].length-1].t]
                                        :
                                      [
                                        allTS["13"][allTS["13"].length - Math.round(allTS["13"].length/3)*2 - 1].t,
                                        allTS["13"][allTS["13"].length - Math.round(allTS["13"].length/3) - 1].t,
                                        allTS["13"][allTS["13"].length-1].t]}                        
                                      style={{tickLabels: {fontSize: 10}}} 
                                      tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                                    
                                    <VictoryGroup 
                                      colorScale={[stateColor]}
                                    >

                                      <VictoryLine data={stateMapFips && allTS[stateMapFips] ? allTS[stateMapFips] : allTS["13"]}
                                        x='t' y='mortalityMean'
                                        />

                                    </VictoryGroup>

                                    <VictoryArea
                                      style={{ data: { fill: "#00BFFF", stroke: "#00BFFF", fillOpacity: 0.1} }}
                                      data={stateMapFips && allTS[stateMapFips]? allTS[stateMapFips] : allTS["13"]}
                                      x= 't' y = 'mortalityMean'

                                    />

                                    
                                    <VictoryLabel text= {stateMapFips ? numberWithCommas((allTS[stateMapFips][allTS[stateMapFips].length - 1].dailyMortality).toFixed(0)) : numberWithCommas((allTS["13"][allTS["13"].length - 1].dailyMortality).toFixed(0))} x={80} y={80} textAnchor="middle" style={{fontSize: 40, fontFamily: 'lato', fill: "#004071"}}/>
                                    
                                    <VictoryLabel text= {stateMapFips ? 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyDeaths).toFixed(0) + "%": 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyDeaths).toFixed(0)< 0? ((allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyDeaths).toFixed(0)).substring(1) + "%": 
                                                        "0%"
                                                        : 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? (allTS["13"][allTS["13"].length - 1].percent14dayDailyDeaths).toFixed(0) + "%": 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyDeaths).toFixed(0) < 0? ((allTS["13"][allTS["13"].length - 1].percent14dayDailyDeaths).toFixed(0)).substring(1) + "%": 
                                                        "0%"} x={197} y={80} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato', fill: "#004071"}}/>

                                    <VictoryLabel text= {stateMapFips ? 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "↑": 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyDeaths).toFixed(0)< 0? "↓": ""
                                                        : 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "↑": 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyDeaths).toFixed(0)< 0?"↓": ""} 

                                                        x={160} y={80} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'

                                                        , fill: stateMapFips ? 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "#FF0000": 
                                                        (allTS[stateMapFips][allTS[stateMapFips].length - 1].percent14dayDailyDeaths).toFixed(0)< 0? "#32CD32": ""
                                                        : 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "#FF0000": 
                                                        (allTS["13"][allTS["13"].length - 1].percent14dayDailyDeaths).toFixed(0)< 0?"#32CD32": ""}}/>

                                    <VictoryLabel text= {"14-day"}  x={197} y={100} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {"change"}  x={197} y={110} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {"Daily Deaths"}  x={110} y={20} textAnchor="middle" style={{fontSize: "22px", fontFamily: 'lato'}}/>

                        </VictoryChart>}
                      </div>
                    
                    </Grid.Column>
                    
                    
                  </Grid.Row>
                  <div style = {{height: 60}}>
                    {stateFips && <Accordion style = {{paddingTop: 10, paddingLeft: 15}} defaultActiveIndex={1} panels={[
                          {
                              key: 'acquire-dog',
                              title: {
                                  content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,icon: 'dropdown',
                                },
                                content: {
                                    content: (
                                      <Header.Content style={{fontWeight: 300, paddingTop: 0, paddingLeft: 5,fontSize: "19px", width: 460}}>
                                        *14-day change trends use 7-day averages.
                                        <br/>
                                        <b><em> {varMap["dailycases"].name} </em></b> {varMap["dailycases"].definition}
                                        <br/> 
                                        <b><em> {varMap["dailydeaths"].name} </em></b> {varMap["dailydeaths"].definition} 
                                        <br/>
                                        <br/>
                                        



                                      </Header.Content>
                                  ),
                                },
                            }
                          ]
                        } /> }
                  </div>

                  <Grid.Row>
                    <Grid.Column style = {{paddingLeft: 20, paddingTop: 101}}>
                      <Header as='h2' style={{fontWeight: 400, paddingTop: 10}}>
                        <Header.Content style={{width : 500, fontSize: "22px", textAlign: "center"}}>
                          Disparities in COVID-19 Mortality <br/> <b>{stateMapFips !== "_nation" ? stateName : "Nation"}</b>
                          
                        </Header.Content>
                      </Header>

                      {stateMapFips && stateMapFips === "_nation" && <div style = {{marginTop: 13}}>
                              <Header.Content x={0} y={20} style={{fontSize: '19px', paddingLeft: 130, fontWeight: 400, width: 400}}> Deaths by Race & Ethnicity</Header.Content>
                      </div>}

                      {stateMapFips && stateMapFips === "_nation" && <div style={{paddingLeft: "0em", paddingRight: "2em"}}>

                      <VictoryChart
                                theme={VictoryTheme.material}
                                width={400}
                                height={160}
                                domainPadding={20}
                                minDomain={{y: props.ylog?1:0}}
                                padding={{left: 164, right: 35, top: 12, bottom: 1}}
                                style = {{fontSize: "19px"}}
                                containerComponent={<VictoryContainer responsive={false}/>}
                              >
                                <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "19px", fill: '#000000', fontFamily: 'lato'}}} />
                                <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                <VictoryBar
                                  horizontal
                                  barRatio={0.45}
                                  labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                  data={[
                                    {key: nationalDemog['race'][0]['American Natives'][0]['demogLabel'], 'value': nationalDemog['race'][0]['American Natives'][0]['deathrate']},
                                    {key: nationalDemog['race'][0]['Asian'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Asian'][0]['deathrate']},
                                    {key: nationalDemog['race'][0]['Hispanic'][0]['demogLabel'], 'value': nationalDemog['race'][0]['Hispanic'][0]['deathrate']},
                                    {key: nationalDemog['race'][0]['African American'][0]['demogLabel'], 'value': nationalDemog['race'][0]['African American'][0]['deathrate']},
                                    {key: nationalDemog['race'][0]['White'][0]['demogLabel'], 'value': nationalDemog['race'][0]['White'][0]['deathrate']},
                                    
                                      


                                  ]}
                                  labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                  style={{
                                    data: {
                                      fill: "#004071"
                                    }
                                  }}
                                  x="key"
                                  y="value"
                                />
                              </VictoryChart>
                              <Header.Content style = {{width: 420}}>
                                  <Header.Content style={{ fontWeight: 300, paddingLeft: 150, paddingTop: 8, paddingBottom:34, fontSize: "19px", lineHeight: "18pt"}}>
                                    <b>Deaths per 100,000 residents</b>
                                  </Header.Content>
                              </Header.Content>
                    </div>}
                    
                          {stateMapFips !== "_nation" && !raceData[stateMapFips]["Non-Hispanic African American"] && !!raceData[stateMapFips]["White Alone"] && stateMapFips !== "38" &&
                          <Grid>
                            <Grid.Row columns = {2} style = {{height: 273, paddingBottom: 0}}>
                              <Grid.Column style = {{paddingLeft: 20}}> 
                                {!raceData[stateMapFips]["Non-Hispanic African American"]  && stateMapFips !== "02"  && 
                                  <div style = {{marginTop: 10, width: 250}}>
                                    <Header.Content x={0} y={20} style={{fontSize: '14pt', paddingLeft: 58, fontWeight: 400}}> Deaths by Race</Header.Content>
                                  </div>
                                }
                                {stateMapFips && !raceData[stateMapFips]["Non-Hispanic African American"] && stateMapFips !== "38"  && stateMapFips !== "02" &&
                                  <VictoryChart
                                                theme = {VictoryTheme.material}
                                                width = {250}
                                                height = {40 * (( !!raceData[stateMapFips]["Asian Alone"] && raceData[stateMapFips]["Asian Alone"][0]['deathrateRace'] >= 0 && raceData[stateMapFips]["Asian Alone"][0]["deaths"] > 30 && raceData[stateMapFips]["Asian Alone"][0]["percentPop"] >= 1 ? 1: 0) + 
                                                (!!raceData[stateMapFips]["American Natives Alone"] && raceData[stateMapFips]["American Natives Alone"][0]['deathrateRace'] >= 0 && raceData[stateMapFips]["American Natives Alone"][0]['deaths'] > 30 && raceData[stateMapFips]["American Natives Alone"][0]["percentPop"] >= 1 ? 1 : 0) + 
                                                (!!raceData[stateMapFips]["African American Alone"] && raceData[stateMapFips]["African American Alone"][0]['deathrateRace'] >= 0 && raceData[stateMapFips]["African American Alone"][0]['deaths'] > 30 && raceData[stateMapFips]["African American Alone"][0]["percentPop"] >= 1 ? 1 : 0) + 
                                                (!!raceData[stateMapFips]["White Alone"] && raceData[stateMapFips]["White Alone"][0]['deathrateRace'] >= 0 && raceData[stateMapFips]["White Alone"][0]['deaths'] > 30 && raceData[stateMapFips]["White Alone"][0]["percentPop"] >= 1 ?1:0))}
                                                domainPadding={20}
                                                minDomain={{y: props.ylog?1:0}}
                                                padding={{left: 100, right: 65, top: 12, bottom: 1}}
                                                style = {{fontSize: "14pt"}}
                                                containerComponent={<VictoryContainer responsive={false}/>}
                                              >

                                                <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "19px", fill: '#000000', fontFamily: 'lato'}}} />
                                                <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                                <VictoryGroup>
                                                
                                                

                                                {"American Natives Alone" in raceData[stateMapFips] && raceData[stateMapFips]["American Natives Alone"][0]['deathrateRace'] >= 0 && raceData[stateMapFips]["American Natives Alone"][0]['deaths'] > 30 && raceData[stateMapFips]["American Natives Alone"][0]["percentPop"] >= 1 &&
                                                  <VictoryBar
                                                    barWidth= {10}
                                                    horizontal
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                    data={[

                                                          {key: "American\n Natives", 'value': raceData[stateMapFips]["American Natives Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[stateMapFips]["American Natives Alone"][0]['deathrateRace'])}

                                                    ]}
                                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                    style={{
                                                      data: {
                                                        fill: "#004071"
                                                      }
                                                    }}
                                                    x="key"
                                                    y="value"
                                                  />
                                                }

                                                {"Asian Alone" in raceData[stateMapFips] && raceData[stateMapFips]["Asian Alone"][0]['deathrateRace'] >= 0 && raceData[stateMapFips]["Asian Alone"][0]["deaths"] > 30 && raceData[stateMapFips]["Asian Alone"][0]["percentPop"] >= 1 && 
                                                  <VictoryBar
                                                    barWidth= {10}
                                                    horizontal
                                                    barRatio={0.7}
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                    data={[

                                                          {key: "Asian", 'value': raceData[stateMapFips]["Asian Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[stateMapFips]["Asian Alone"][0]['deathrateRace'])}

                                                    ]}
                                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                    style={{
                                                      data: {
                                                        fill: "#004071"
                                                      }
                                                    }}
                                                    x="key"
                                                    y="value"
                                                  />
                                                }


                                                {"African American Alone" in raceData[stateMapFips] && raceData[stateMapFips]["African American Alone"][0]['deathrateRace'] >= 0  && raceData[stateMapFips]["African American Alone"][0]['deaths'] > 30 && raceData[stateMapFips]["African American Alone"][0]["percentPop"] >= 1 && 
                                                  <VictoryBar
                                                    barWidth= {10}
                                                    horizontal
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                    data={[

                                                          {key: "African\n American", 'value': raceData[stateMapFips]["African American Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[stateMapFips]["African American Alone"][0]['deathrateRace'])}

                                                    ]}
                                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                    style={{
                                                      data: {
                                                        fill: "#004071"
                                                      }
                                                    }}
                                                    x="key"
                                                    y="value"
                                                  />
                                                }

                                                {"White Alone" in raceData[stateMapFips] && raceData[stateMapFips]["White Alone"][0]['deathrateRace'] >= 0  && raceData[stateMapFips]["White Alone"][0]['deaths'] > 30 && raceData[stateMapFips]["White Alone"][0]["percentPop"] >= 1 && 
                                                  <VictoryBar
                                                    barWidth= {10}
                                                    horizontal
                                                    barRatio={0.7}
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                    data={[

                                                          {key: "White", 'value': raceData[stateMapFips]["White Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[stateMapFips]["White Alone"][0]['deathrateRace'])}

                                                    ]}
                                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                    style={{
                                                      data: {
                                                        fill: "#004071"
                                                      }
                                                    }}
                                                    x="key"
                                                    y="value"
                                                  />
                                                }

                                                
                                                </VictoryGroup>
                                  </VictoryChart>
                                }
                                {!raceData[stateMapFips]["Non-Hispanic African American"] && stateMapFips !== "38" && stateMapFips !== "02" &&
                                  <div style = {{marginTop: 10, textAlign: "center", width: 250}}>
                                    <Header.Content x={15} y={20} style={{fontSize: '14pt', paddingLeft: 15, fontWeight: 400}}> Deaths per 100,000 <br/> residents</Header.Content>
                                  </div>
                                }

                                {stateMapFips === "02" &&
                                  <div style = {{marginTop: 10, width: 250}}>
                                    <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 35, fontWeight: 400}}> Deaths by Race</text>

                                    <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 0, fontWeight: 400}}> <br/> <br/> <br/> 
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    None Reported</text>
                                  </div>
                                }

                              </Grid.Column>
                              <Grid.Column style = {{paddingLeft: 50}}> 
                                {!!raceData[stateMapFips]["White Alone"] && stateMapFips !== "38" &&
                                  <div style = {{marginTop: 10}}>
                                    <Header.Content x={0} y={20} style={{fontSize: '14pt', paddingLeft: 60, fontWeight: 400, width: 250}}> Deaths by Ethnicity</Header.Content>
                                    {!(stateMapFips && !!raceData[stateMapFips]["White Alone"] && stateMapFips !== "38" && !(raceData[stateMapFips]["Hispanic"][0]['deathrateEthnicity'] < 0 || (!raceData[stateMapFips]["Hispanic"] && !raceData[stateMapFips]["Non Hispanic"] && !raceData[stateMapFips]["Non-Hispanic African American"] && !raceData[stateMapFips]["Non-Hispanic American Natives"] && !raceData[stateMapFips]["Non-Hispanic Asian"] && !raceData[stateMapFips]["Non-Hispanic White"] ) ))
                                        && 
                                      <center> <Header.Content x={0} y={20} style={{fontSize: '14pt', paddingLeft: 20, fontWeight: 400, width: 250}}> <br/> <br/> None Reported</Header.Content> </center>

                                  }
                                  </div>
                                }
                                {stateMapFips && !!raceData[stateMapFips]["White Alone"] && stateMapFips !== "38" && !(raceData[stateMapFips]["Hispanic"][0]['deathrateEthnicity'] < 0 || (!raceData[stateMapFips]["Hispanic"] && !raceData[stateMapFips]["Non Hispanic"] && !raceData[stateMapFips]["Non-Hispanic African American"] && !raceData[stateMapFips]["Non-Hispanic American Natives"] && !raceData[stateMapFips]["Non-Hispanic Asian"] && !raceData[stateMapFips]["Non-Hispanic White"] ) ) && 
                                  <VictoryChart
                                                theme = {VictoryTheme.material}
                                                width = {250}
                                                height = {!!raceData[stateMapFips]["Hispanic"] && !!raceData[stateMapFips]["Non Hispanic"] ?  81 : 3 * (!!raceData[stateMapFips]["Hispanic"] + !!raceData[stateMapFips]["Non Hispanic"] + !!raceData[stateMapFips]["Non-Hispanic African American"] + !!raceData[stateMapFips]["Non-Hispanic American Natives"] + !!raceData[stateMapFips]["Non-Hispanic Asian"] + !!raceData[stateMapFips]["Non-Hispanic White"] )}
                                                domainPadding={20}
                                                minDomain={{y: props.ylog?1:0}}
                                                padding={{left: 130, right: 35, top: !!raceData[stateMapFips]["Hispanic"] && !!raceData[stateMapFips]["Non Hispanic"] ? 13 : 10, bottom: 1}}
                                                style = {{fontSize: "14pt"}}
                                                containerComponent={<VictoryContainer responsive={false}/>}
                                              >

                                                <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "19px", fill: '#000000', fontFamily: 'lato'}}} />
                                                <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                                
                                                  <VictoryGroup>


                                                  {!!raceData[stateMapFips]["Non-Hispanic American Natives"] && raceData[stateMapFips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'] >= 0 && raceData[stateMapFips]["Non-Hispanic American Natives"][0]['deaths'] > 30 && raceData[stateMapFips]["Non-Hispanic American Natives"][0]["percentPop"] >= 1 &&
                                                    <VictoryBar
                                                      barWidth= {10}
                                                      horizontal
                                                      barRatio={0.7}
                                                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                      data={[

                                                            {key: "American\n Natives", 'value': raceData[stateMapFips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'])}

                                                      ]}
                                                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                      style={{
                                                        data: {
                                                          fill: "#004071"
                                                        }
                                                      }}
                                                      x="key"
                                                      y="value"
                                                    />
                                                  }

                                                  {!!raceData[stateMapFips]["Non-Hispanic Asian"] && raceData[stateMapFips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'] >= 0  && raceData[stateMapFips]["Non-Hispanic Asian"][0]['deaths'] > 30 && raceData[stateMapFips]["Non-Hispanic Asian"][0]["percentPop"] >= 1 &&
                                                    <VictoryBar
                                                      barWidth= {10}
                                                      horizontal
                                                      barRatio={0.7}
                                                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                      data={[

                                                            {key: "Asian", 'value': raceData[stateMapFips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'])}

                                                      ]}
                                                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                      style={{
                                                        data: {
                                                          fill: "#004071"
                                                        }
                                                      }}
                                                      x="key"
                                                      y="value"
                                                    />
                                                  }
                                                  

                                                  {!!raceData[stateMapFips]["Non Hispanic"] && !!raceData[stateMapFips]["White Alone"] && raceData[stateMapFips]["Non Hispanic"][0]['deathrateEthnicity'] >= 0  && raceData[stateMapFips]["Non Hispanic"][0]['deaths'] > 30 && raceData[stateMapFips]["Non Hispanic"][0]["percentPop"] >= 1 &&
                                                    <VictoryBar
                                                      barWidth= {10}
                                                      barRatio={0.1}
                                                      horizontal
                                                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                      data={[

                                                            {key: "Non Hispanic", 'value': raceData[stateMapFips]["Non Hispanic"][0]['deathrateEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Non Hispanic"][0]['deathrateEthnicity'])}

                                                      ]}
                                                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                      style={{
                                                        data: {
                                                          fill: "#004071"
                                                        }
                                                      }}
                                                      x="key"
                                                      y="value"
                                                    />
                                                  }

                                                  {(!!raceData[stateMapFips]["Hispanic"] || (!!raceData[stateMapFips]["Hispanic"] && !!raceData[stateMapFips]["White Alone"] && raceData[stateMapFips]["Hispanic"][0]['deathrateEthnicity'] >= 0  && raceData[stateMapFips]["Hispanic"][0]['deaths'] > 30 && raceData[stateMapFips]["Hispanic"][0]["percentPop"] >= 1))&&
                                                    <VictoryBar
                                                      barWidth= {10}
                                                      barRatio={0.1}
                                                      horizontal
                                                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                      data={[

                                                            {key: "Hispanic", 'value': raceData[stateMapFips]["Hispanic"][0]['deathrateEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Hispanic"][0]['deathrateEthnicity'])}

                                                      ]}
                                                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                      style={{
                                                        data: {
                                                          fill: "#004071"
                                                        }
                                                      }}
                                                      x="key"
                                                      y="value"
                                                    />
                                                  }
                                                  
                                                
                                                  {!!raceData[stateMapFips]["Non-Hispanic African American"] && raceData[stateMapFips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'] >= 0  && raceData[stateMapFips]["Non-Hispanic African American"][0]['deaths'] > 30 && raceData[stateMapFips]["Non-Hispanic African American"][0]["percentPop"] >= 1 &&
                                                    <VictoryBar
                                                      barWidth= {10}
                                                      horizontal
                                                      barRatio={0.7}
                                                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                      data={[

                                                            {key: "African\n American", 'value': raceData[stateMapFips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'])}

                                                      ]}
                                                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                      style={{
                                                        data: {
                                                          fill: "#004071"
                                                        }
                                                      }}
                                                      x="key"
                                                      y="value"
                                                    />
                                                  }

                                                  
                                                  {!!raceData[stateMapFips]["Non-Hispanic White"] && raceData[stateMapFips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'] >= 0  && raceData[stateMapFips]["Non-Hispanic White"][0]['deaths'] > 30 && raceData[stateMapFips]["Non-Hispanic White"][0]["percentPop"] >= 1 &&
                                                    <VictoryBar
                                                      barWidth= {10}
                                                      horizontal
                                                      barRatio={0.7}
                                                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                      data={[

                                                            {key: "White", 'value': raceData[stateMapFips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'])}

                                                      ]}
                                                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                      style={{
                                                        data: {
                                                          fill: "#004071"
                                                        }
                                                      }}
                                                      x="key"
                                                      y="value"
                                                    />
                                                  }

                                                  
                                                  </VictoryGroup>
                                          

                                  </VictoryChart>
                                }
                                {stateMapFips !== "_nation" && !!raceData[stateMapFips]["White Alone"] && stateMapFips !== "38" && !(raceData[stateMapFips]["Hispanic"][0]['deathrateEthnicity'] < 0 || (!raceData[stateMapFips]["Hispanic"] && !raceData[stateMapFips]["Non Hispanic"] && !raceData[stateMapFips]["Non-Hispanic African American"] && !raceData[stateMapFips]["Non-Hispanic American Natives"] && !raceData[stateMapFips]["Non-Hispanic Asian"] && !raceData[stateMapFips]["Non-Hispanic White"] ) ) && 
                                  <div style = {{marginTop: 10, textAlign: "center", width: 250}}>
                                    <Header.Content style={{fontSize: '14pt', paddingLeft: 35, fontWeight: 400}}> Deaths per 100,000 <br/> &nbsp;&nbsp;&nbsp;&nbsp;residents</Header.Content>
                                  </div>
                                }

                                
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                          }

                          {stateMapFips !== "_nation" && (!!raceData[stateMapFips]["Non-Hispanic African American"] || !!raceData[stateMapFips]["Non-Hispanic White"] ) && stateMapFips !== "38" &&
                          <Grid.Row columns = {1}>
                            <Grid.Column style = {{ marginLeft : 0, paddingBottom: (13+ 2 * (!raceData[stateMapFips]["Hispanic"] + !raceData[stateMapFips]["Non Hispanic"] + !raceData[stateMapFips]["Non-Hispanic African American"] + !raceData[stateMapFips]["Non-Hispanic American Natives"] + !raceData[stateMapFips]["Non-Hispanic Asian"] + !raceData[stateMapFips]["Non-Hispanic White"] ))}}> 
                              {stateMapFips && !raceData[stateMapFips]["White Alone"] &&
                                <div style = {{marginTop:10, width: 400}}>
                                  <Header.Content x={0} y={20} style={{fontSize: '14pt', paddingLeft: 150, fontWeight: 400}}> Deaths by Race & Ethnicity</Header.Content>
                                </div>
                              }
                              {stateMapFips && !raceData[stateMapFips]["White Alone"] && stateMapFips !== "38" &&
                              <div style={{paddingLeft: "1em", paddingRight: "0em", width: 550}}>
                                <VictoryChart
                                              theme = {VictoryTheme.material}
                                              width = {400}
                                              height = {32 * (!!raceData[stateMapFips]["Hispanic"] + !!raceData[stateMapFips]["Non Hispanic"] + !!raceData[stateMapFips]["Non-Hispanic African American"] + !!raceData[stateMapFips]["Non-Hispanic American Natives"] + !!raceData[stateMapFips]["Non-Hispanic Asian"] + !!raceData[stateMapFips]["Non-Hispanic White"] )}
                                              domainPadding={20}
                                              minDomain={{y: props.ylog?1:0}}
                                              padding={{left: 160, right: 35, top: !!raceData[stateMapFips]["Hispanic"] && !!raceData[stateMapFips]["Non Hispanic"] ? 12 : 10, bottom: 1}}
                                              style = {{fontSize: "14pt"}}
                                              containerComponent={<VictoryContainer responsive={false}/>}
                                            >

                                              <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "19px", fill: '#000000', fontFamily: 'lato'}}} />
                                              <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                              
                                                <VictoryGroup>

                                                {!!raceData[stateMapFips]["Non-Hispanic American Natives"] && raceData[stateMapFips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'] >= 0  && raceData[stateMapFips]["Non-Hispanic American Natives"][0]['deaths'] > 30 && raceData[stateMapFips]["Non-Hispanic American Natives"][0]["percentPop"] >= 1 &&
                                                  <VictoryBar
                                                    barWidth= {10}
                                                    horizontal
                                                    barRatio={0.7}
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                    data={[

                                                          {key: "American Natives", 'value': raceData[stateMapFips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'])}

                                                    ]}
                                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                    style={{
                                                      data: {
                                                        fill: "#004071"
                                                      }
                                                    }}
                                                    x="key"
                                                    y="value"
                                                  />
                                                }

                                                {!!raceData[stateMapFips]["Non-Hispanic Asian"] && raceData[stateMapFips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'] >= 0  && raceData[stateMapFips]["Non-Hispanic Asian"][0]['deaths'] > 30 && raceData[stateMapFips]["Non-Hispanic Asian"][0]["percentPop"] >= 1 &&
                                                  <VictoryBar
                                                    barWidth= {10}
                                                    horizontal
                                                    barRatio={0.7}
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                    data={[

                                                          {key: "Asian", 'value': raceData[stateMapFips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'])}

                                                    ]}
                                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                    style={{
                                                      data: {
                                                        fill: "#004071"
                                                      }
                                                    }}
                                                    x="key"
                                                    y="value"
                                                  />
                                                }

                                                {!!raceData[stateMapFips]["Non Hispanic"] && !!raceData[stateMapFips]["White Alone"] && raceData[stateMapFips]["Non Hispanic"][0]['deathrateEthnicity'] >= 0  && raceData[stateMapFips]["Non Hispanic"][0]['deaths'] > 30 && raceData[stateMapFips]["Non Hispanic"][0]["percentPop"] >= 1 &&
                                                  <VictoryBar
                                                    barWidth= {10}
                                                    barRatio={0.1}
                                                    horizontal
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                    data={[

                                                          {key: "Non Hispanic", 'value': raceData[stateMapFips]["Non Hispanic"][0]['deathrateEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Non Hispanic"][0]['deathrateEthnicity'])}

                                                    ]}
                                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                    style={{
                                                      data: {
                                                        fill: "#004071"
                                                      }
                                                    }}
                                                    x="key"
                                                    y="value"
                                                  />
                                                }

                                                {(!!raceData[stateMapFips]["Hispanic"] || (!!raceData[stateMapFips]["Hispanic"] && !!raceData[stateMapFips]["White Alone"] && raceData[stateMapFips]["Hispanic"][0]['deathrateEthnicity'] >= 0  && raceData[stateMapFips]["Hispanic"][0]['deaths'] > 30 && raceData[stateMapFips]["Hispanic"][0]["percentPop"] >= 1 ))&&
                                                  <VictoryBar
                                                    barWidth= {10}
                                                    barRatio={0.1}
                                                    horizontal
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                    data={[

                                                          {key: "Hispanic", 'value': raceData[stateMapFips]["Hispanic"][0]['deathrateEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Hispanic"][0]['deathrateEthnicity'])}

                                                    ]}
                                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                    style={{
                                                      data: {
                                                        fill: "#004071"
                                                      }
                                                    }}
                                                    x="key"
                                                    y="value"
                                                  />
                                                } 
                                                
                                                {!!raceData[stateMapFips]["Non-Hispanic African American"] && raceData[stateMapFips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'] >= 0  && raceData[stateMapFips]["Non-Hispanic African American"][0]['deaths'] > 30 && raceData[stateMapFips]["Non-Hispanic African American"][0]["percentPop"] >= 1 &&
                                                  <VictoryBar
                                                    barWidth= {10}
                                                    horizontal
                                                    barRatio={0.7}
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                    data={[

                                                          {key: "African American", 'value': raceData[stateMapFips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'])}

                                                    ]}
                                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                    style={{
                                                      data: {
                                                        fill: "#004071"
                                                      }
                                                    }}
                                                    x="key"
                                                    y="value"
                                                  />
                                                }

                                                
                                                {!!raceData[stateMapFips]["Non-Hispanic White"] && raceData[stateMapFips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'] >= 0 && raceData[stateMapFips]["Non-Hispanic White"][0]['deaths'] > 30 && raceData[stateMapFips]["Non-Hispanic White"][0]["percentPop"] >= 1 &&
                                                  <VictoryBar
                                                    barWidth= {10}
                                                    horizontal
                                                    barRatio={0.7}
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                    data={[

                                                          {key: "White", 'value': raceData[stateMapFips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateMapFips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'])}

                                                    ]}
                                                    labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                                    style={{
                                                      data: {
                                                        fill: "#004071"
                                                      }
                                                    }}
                                                    x="key"
                                                    y="value"
                                                  />
                                                }

                                                
                                                </VictoryGroup>
                                        

                                </VictoryChart>
                                </div>
                              }
                              {stateMapFips && !raceData[stateMapFips]["White Alone"] &&
                                <div style = {{marginTop: 10, width: 400, paddingBottom: 3}}>
                                  <Header.Content style={{fontSize: '19px', marginLeft: 150, fontWeight: 400}}> Deaths per 100,000 residents<br/> 
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  
                                  
                                  </Header.Content>
                                </div>
                              }

                            </Grid.Column>
                          </Grid.Row>}

                          {stateMapFips === "38" &&
                            <Grid.Row columns = {1}>
                            <Grid.Column style = {{ marginLeft : 0, paddingTop: 8, paddingBottom: 87, width: 500}}> 
                                <div style = {{marginTop: 50}}>
                                  <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 90, fontWeight: 400}}> Deaths per capita by Race & Ethnicity <br/> <br/> <br/> <br/> </text>
                                  <text style={{fontSize: '14pt', paddingLeft: 190, fontWeight: 400}}> None Reported</text>
                                </div>                            
                            </Grid.Column>
                          </Grid.Row>
                          }
                      <Grid>
                        <Grid.Row>
                          {stateMapFips && <Accordion style = {{paddingTop: 30, paddingLeft: 23}}defaultActiveIndex={1} panels={[
                            {
                                key: 'acquire-dog',
                                title: {
                                    content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                                    icon: 'dropdown',
                                },
                                content: {
                                    content: (

                                      <div style = {{fontSize: "19px"}}>
                                        
                                        For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>

                                        {stateMapFips && stateMapFips === "_nation" && <Grid.Row style= {{paddingTop: 0, paddingBottom: 25}}> 
                                          <Header.Content style={{fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "18pt", width: 450}}>
                                            The United States reports deaths by combined race and ethnicity groups. The chart shows race and ethnicity groups that constitute at least 1% of the state population and have 30 or more deaths. Race and ethnicity data are known for {nationalDemog['race'][0]['Unknown'][0]['availableDeaths'] + "%"} of deaths in the nation.
                                            <br/>
                                            <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.cdc.gov/diabetes/data/index.html" target = "_blank" rel="noopener noreferrer"> The CDC </a>
                                            <br/><b>Data last updated:</b> {date}, updated every weekday.<br/>
                                          
                                          </Header.Content>
                                        </Grid.Row>}

                                        {stateMapFips && stateMapFips !== "_nation" && <Grid.Row style={{top: stateMapFips === "38"? -30 : stateMapFips && !raceData[stateMapFips]["White Alone"] ? -40 : -30, paddingLeft: 0}}>
                                        

                                        

                                        {stateMapFips === "38" &&
                                          <Header.Content style={{fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "18pt", width: 450}}>
                                            {stateName} is not reporting deaths by race or ethnicity.
                                            <br/>
                                            <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a>
                                            <br/><b>Data last updated:</b> {date}, updated every weekday.<br/>
                                          
                                          </Header.Content>}

                                        {stateMapFips !== "38" && !raceData[stateMapFips]["Non-Hispanic African American"] && !!raceData[stateMapFips]["White Alone"] && (!raceData[stateMapFips]["Non Hispanic"] && !raceData[stateMapFips]["Non-Hispanic American Natives"] && !raceData[stateMapFips]["Non-Hispanic Asian"] && !raceData[stateMapFips]["Non-Hispanic White"] )
                                                    && 
                                          <Header.Content style={{fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "18pt", width: 450}}>
                                            {stateName} reports deaths by race. The chart shows race groups that constitutes at least 1% of the state population and have 30 or more deaths. Race data are known for {raceData[stateMapFips]["Race Missing"][0]["percentRaceDeaths"] + "%"} of deaths in {stateName}.
                                            <br/>
                                            <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a>
                                            <br/><b>Data last updated:</b> {date}, updated every weekday.<br/>
                                          
                                          </Header.Content>}

                                        {stateMapFips !== "38"  && !!raceData[stateMapFips]["White Alone"] && !!raceData[stateMapFips]["White Alone"] && !(!raceData[stateMapFips]["Hispanic"] && !raceData[stateMapFips]["Non Hispanic"] && !raceData[stateMapFips]["Non-Hispanic African American"] && !raceData[stateMapFips]["Non-Hispanic American Natives"] && !raceData[stateMapFips]["Non-Hispanic Asian"] && !raceData[stateMapFips]["Non-Hispanic White"] )
                                                    && 
                                          <Header.Content style={{fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "18pt", width: 450}}>
                                            {stateName} reports deaths by race and ethnicity separately. The chart shows race and ethnicity groups that constitute at least 1% of the state population and have 30 or more deaths. Race data are known for {raceData[stateMapFips]["Race Missing"][0]["percentRaceDeaths"] + "%"} of deaths while ethnicity data are known for {raceData[stateMapFips]["Ethnicity Missing"][0]["percentEthnicityDeaths"] + "%"} of deaths in {stateName}.
                                            <br/>
                                            <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a>
                                            <br/><b>Data last updated:</b> {date}, updated every weekday.<br/>
                                          
                                          </Header.Content>}

                                        {stateMapFips !== "38"  && (!!raceData[stateMapFips]["Non-Hispanic African American"] || !!raceData[stateMapFips]["Non-Hispanic White"] ) && 
                                          <Header.Content style={{fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "18pt", width: 450}}>
                                            {stateName} reports deaths by combined race and ethnicity groups. The chart shows race and ethnicity groups that constitute at least 1% of the state population and have 30 or more deaths. Race and ethnicity data are known for {raceData[stateMapFips]["Race & Ethnicity Missing"][0]["percentRaceEthnicityDeaths"] + "%"} of deaths in {stateName}.
                                            <br/>
                                            <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a>
                                            <br/><b>Data last updated:</b> {date}, updated every weekday.<br/>
                                          
                                          </Header.Content>}

                                          {!raceData[stateMapFips]["Non-Hispanic African American"]  && stateMapFips !== "02"  && 
                                              <div style = {{marginTop: 10}}>
                                              </div>
                                            }

                                        </Grid.Row>}

                                      </div>
                                    ),
                                  },
                              }
                          ]

                          } /> }
                        
                        </Grid.Row>
                      </Grid>
                          


                      </Grid.Column>
                    </Grid.Row>
                      

                  </Grid>
                </Grid.Column>
                <Grid.Column style = {{paddingLeft: 80, width: 630}}>
                  <div style = {{paddingTop: 10, paddingLeft: 50}}>
                    <div style = {{paddingTop: 0, width: 500, paddingBottom: 20}}>
                      <Header.Content x={0} y={20} style={{fontSize: "22px", fontWeight: 400}}>Average Daily COVID-19 Cases /100,000 </Header.Content>
                    </div>
                    <svg width = "500" height = "40">
                        <rect x = {20} y = {12} width = "12" height = "2" style = {{fill: nationColor, strokeWidth:1, stroke: nationColor}}/>
                        <text x = {35} y = {20} style = {{ fontSize: "22px"}}> USA</text>
                        <rect x = {87} y = {12} width = "12" height = "2" style = {{fill: stateColor, strokeWidth:1, stroke: stateColor}}/>
                        <text x = {102} y = {20} style = {{ fontSize: "22px"}}> {stateMapFips === "_nation" || stateMapFips === "72"? "Select State":stateName} </text>
                    </svg>
                  </div>
                  <div style = {{width: 500, height: 180}}>
                  {stateMapFips && 
                  
                  // <CaseChart data={dataTS} dataState = {dataTS[stateMapFips]} lineColor={[colorPalette[1]]} stateFips = {stateMapFips} 
                  //               ticks={caseTicks} tickFormatter={caseTickFmt} labelFormatter = {labelTickFmt} var = {"caserate7dayfig"}/>
                    <ResponsiveContainer width="100%" height={300}>
                      <NewLinePlot data={dataTS} dataState = {dataTS[stateMapFips]} lineColor={[colorPalette[1]]} stateFips = {stateMapFips} 
                                   ticks={caseTicks} tickFormatter={caseTickFmt} labelFormatter = {labelTickFmt} var = {"caserate7dayfig"}/> 
                    </ResponsiveContainer>
                   }
                  </div>

                  <div style = {{paddingTop: 65, paddingLeft: 50}}>
                    <div style = {{paddingTop: 47, width: 500, paddingBottom: 20}}>
                      <Header.Content style={{fontSize: "22px", fontWeight: 400}}>Average Daily COVID-19 Deaths /100,000 </Header.Content>
                    </div>
                    <svg width = "500" height = "40">
                        <rect x = {20} y = {12} width = "12" height = "2" style = {{fill: nationColor, strokeWidth:1, stroke: nationColor}}/>
                        <text x = {35} y = {20} style = {{ fontSize: "22px"}}> USA</text>
                        <rect x = {87} y = {12} width = "12" height = "2" style = {{fill: stateColor, strokeWidth:1, stroke: stateColor}}/>
                        <text x = {102} y = {20} style = {{ fontSize: "22px"}}> {stateMapFips === "_nation" || stateMapFips === "72"? "Select State":stateName} </text>
                    </svg>
                  </div>
                  <div style = {{width: 500, height: 180}}>
                  {stateMapFips && <CaseChart data={dataTS} dataState = {dataTS[stateMapFips]} lineColor={[colorPalette[1]]} stateFips = {stateMapFips} 
                                ticks={caseTicks} tickFormatter={caseTickFmt} labelFormatter = {labelTickFmt} var = {"covidmortality7dayfig"}/>
                          }
                  </div>
                  <Grid>
                    <Grid.Row>

                      {stateFips && <Accordion style = {{paddingTop: 85, paddingLeft: 32}} defaultActiveIndex={1} panels={[
                              {
                                  key: 'acquire-dog',
                                  title: {
                                      content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,icon: 'dropdown',
                                    },
                                    content: {
                                        content: (
                                          <Header.Content style={{fontWeight: 300, paddingTop: 0, paddingLeft: 0,fontSize: "19px", width: 510}}>
                                            <b><em> {varMap["caserate7dayfig"].name} </em></b> {varMap["caserate7dayfig"].definition}
                                            <br/> 
                                            <b><em> {varMap["covidmortality7dayfig"].name} </em></b> {varMap["covidmortality7dayfig"].definition} 
                                            <br/>
                                            <br/>
                                            



                                          </Header.Content>
                                      ),
                                    },
                                }
                              ]
                            } /> }
                    </Grid.Row>
                  </Grid>
                  
                </Grid.Column>

              </Grid.Row>
              <div id = "general" style = {{height: 40}}></div>
              <Grid>
                <Grid.Column style = {{paddingLeft: 33}}>
                  <Divider style={{width: 980}}/> 

                </Grid.Column>
              </Grid>
              <Grid >
                <VaccinesFAQ />

              </Grid>

              {/* <Grid.Row>
                <Header as='h2' style={{fontWeight: 400, paddingTop: 70}}>
                  <Header.Content style={{width : 900, fontSize: "18pt"}}>
                    Vaccination FAQs
                    
                  </Header.Content>
                </Header>
              </Grid.Row> */}
              </Grid>
            </Grid.Column>
          </Grid>
          
          <Container id="title" style={{marginTop: '8em', minWidth: '1260px', overFlowX: 'hidden'}}>
            <Notes />
          </Container>
        </Container>
        <ReactTooltip > 
          <font size="+2"><b >{hoverName}</b> </font> 
          <br/> 
          {/* <b> # received first dose: </b> {numberWithCommas(vaccineData[fips]["Administered_Dose1"])}
          <br/>
          <b> % received first dose: </b> {numberWithCommas(vaccineData[fips]["percentVaccinatedDose1"]) + "%"}
          <br/>
          <b> # received second dose: </b> {numberWithCommas(vaccineData[fips]["Series_Complete_Yes"])}
          <br/>
          <b> % received second dose: </b> {numberWithCommas(vaccineData[fips]["Series_Complete_Pop_Pct"]) + "%"}
          <br/> */}

          <b>Click to lock.</b> 

          <table class="ui celled inverted table" >
            <thead>
              <tr>
                <th># received first dose</th>
                <th>{numberWithCommas(vaccineData[fips]["Administered_Dose1"])}</th>
              </tr>
              <tr>
                <th> % received first dose</th>
                <th>{numberWithCommas(vaccineData[fips]["percentVaccinatedDose1"]) + "%"}</th>
              </tr>
              <tr>
                <th> # received second dose</th>
                <th>{numberWithCommas(vaccineData[fips]["Series_Complete_Yes"])}</th>
              </tr>
              <tr>
                <th> % received second dose</th>
                <th>{numberWithCommas(vaccineData[fips]["Series_Complete_Pop_Pct"]) + "%"}</th>
              </tr>
            </thead>
          </table>
        </ReactTooltip>
      </div>
    </HEProvider>
      );
  } else {
    return <Loader active inline='centered' />
  }
}

// export default USVaccineTracker;