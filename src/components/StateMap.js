import React, { useEffect, useState, PureComponent} from 'react'
import { Container, Dropdown, Grid, Breadcrumb, Header, Loader, Divider, Accordion, Icon, Transition, Button} from 'semantic-ui-react'
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { VictoryChart, 
  VictoryContainer,
  VictoryGroup, 
  VictoryBar, 
  VictoryTheme, 
  VictoryAxis, 
  VictoryLine,
  VictoryLabel,
  VictoryArea,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';

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



function getMax(arr, prop) {
  var max = 0;
  for (var i=0 ; i<arr.length ; i++) {
      if (max === 0 || parseInt(arr[i][prop]) > parseInt(max))
          max = arr[i][prop];
  }
  return max;
}

function getMaxRange(arr, prop, range) {
  var max = 0;
  for (var i=range ; i<arr.length ; i++) {
      if (max === 0 || parseInt(arr[i][prop]) > parseInt(max)){
          max = arr[i][prop];
      }
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


function CaseChart(props){
  const [playCount, setPlayCount] = useState(0);
  const data = props.data;
  const sfps = props.stateFips;
  const cfps = props.countyFips;
  const ticks = props.ticks;
  const variable = props.var;
  const tickFormatter = props.tickFormatter;
  const labelFormatter = props.labelFormatter;
  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y<1000?y:(y/1000+'k');
  };

  useEffect(() =>{
    setAnimationBool(true);
  },[playCount])

  return(
    <div style={{paddingTop: 5, paddingBottom: 70, width: 780}}>
      <LineChart width={720} height={180} data = {data} margin={{right: 20}}>
        {/* <CartesianGrid stroke='#f5f5f5'/> */}
        <XAxis dataKey="t" ticks={ticks} tick={{fontSize: 16}} tickFormatter={tickFormatter} allowDuplicatedCategory={false}/>
        <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}}/>
        <Line data={data["_nation"]} name="Nation" type='monotone' dataKey={variable} dot={false} 
              isAnimationActive={animationBool} 
              onAnimationEnd={()=>setAnimationBool(false)} 
              animationDuration={5500} 
              animationBegin={500} 
              stroke={nationColor} strokeWidth="2" />
        <Line data={data[sfps]} name="State" type='monotone' dataKey={variable} dot={false} 
              isAnimationActive={animationBool} 
              onAnimationEnd={()=>setAnimationBool(false)}
              animationDuration={5500} 
              animationBegin={500} 
              stroke={stateColor} strokeWidth="2" />
        <Line data={data[sfps+cfps]} name="County" type='monotone' dataKey={variable} dot={false} 
              isAnimationActive={animationBool} 
              onAnimationEnd={()=>setAnimationBool(false)}
              animationDuration={5500} 
              animationBegin={500} 
              stroke={countyColor} strokeWidth="2" />
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
      <Button content='Play' icon='play' floated="right" onClick={() => {setPlayCount(playCount+1); }}/>
    </div>
  );
}

function BarChart(props) {
  
  if (props.stateFips !== "_nation") {
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={190}
      height={115}       
      domainPadding={10}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 95, right: 30, top: 30, bottom: 20}}
      containerComponent={<VictoryContainer responsive={false}/>}
    >
      {props.title !== "Community Vulnerability Index" && props.title !== "Any Condition" && <VictoryLabel text={props.title} x={100} y={10} textAnchor="middle" style={{fontSize: "16px", fontFamily: 'lato'}}/> }
      {props.title === "Community Vulnerability Index" && <VictoryLabel text="COVID-19 Community" x={100} y={7} textAnchor="middle" style={{fontSize: "16px", fontFamily: 'lato'}}/> }
      {props.title === "Community Vulnerability Index" && <VictoryLabel text="Vulnerability Index" x={100} y={22} textAnchor="middle" style={{fontSize: "16px", fontFamily: 'lato'}}/> }
      {props.title === "Any Condition" && <VictoryLabel text="Prevalence of Any" x={100} y={7} textAnchor="middle" style={{fontSize: "16px", fontFamily: 'lato'}}/> }
      {props.title === "Any Condition" && <VictoryLabel text="Condition / 100K" x={100} y={22} textAnchor="middle" style={{fontSize: "16px", fontFamily: 'lato'}}/> }
      <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "16px", fontFamily: 'lato'}}}  />
      <VictoryAxis tickCount={3} dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", padding: 1, fontSize: "12px", fontFamily: 'lato'}}} />
      <VictoryBar
        horizontal
        barRatio={0.8}
        labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
        data={[{key: 'USA', 'value': props.data['_nation'][props.var] || 0},
              {key: props.stateName, 'value': props.data[props.stateFips][props.var]>0?props.data[props.stateFips][props.var] : 0},
              {key: "County", 'value': props.data[props.stateFips+props.countyFips][props.var] > 0? props.data[props.stateFips+props.countyFips][props.var]:  0}]}
        labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "14px", fill: "#000000" }}/>}
        style={{
          data: {
            fill: ({ datum }) => datum.key === "County"?countyColor:datum.key === props.stateName?stateColor:nationColor
          }
        }}
        x="key"
        y="value"
      />
    </VictoryChart>);
  }else{
    return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={190}
      height={100}       
      domainPadding={10}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 105, right: 30, top: 30, bottom: 20}}
      containerComponent={<VictoryContainer responsive={false}/>}
    >
      <VictoryLabel text={props.title} x={100} y={10} textAnchor="middle" style={{fontSize: "16px", fontFamily: 'lato'}}/>
      <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "16px", fontFamily: 'lato'}}}  />
      <VictoryAxis tickCount={3} dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", padding: 1, fontSize: "12px", fontFamily: 'lato'}}} />
      <VictoryBar
        horizontal
        barRatio={0.8}
        labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
        data={[{key: 'USA', 'value':  [1]}]}
        labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "14px", fill: "#000000" }}/>}
        style={{
          data: {
            fill: ({ datum }) => datum.key === "County"?countyColor:datum.key === props.stateName?stateColor:nationColor
          }
        }}
        x="key"
        y="value"
      />
    </VictoryChart>);

  };

  
}

function TopChart(params) {

  return(
      <VictoryChart 
        minDomain={{ x: params.sFips !== "_nation"? params.data[(params.data.length - params.recentIndex)-15][params.xVar] : 0}}
        maxDomain = {{x: params.sFips !== "_nation"? params.data[params.data.length - params.recentIndex - 1][params.xVar] : 0 , y: params.sFips !== "_nation"? getMaxRange(params.data, params.yVar, (params.data.length - params.recentIndex) -15)*params.resize: 0}}                            
        width={235}
        height={180}    
        parent= {{background: "#ccdee8"}}   
        padding={{marginleft: 0, right: -1, top: 150, bottom: -0.9}}
        containerComponent={<VictoryContainer responsive={false}/>}>
        
        <VictoryAxis
          tickValues={params.sFips !== "_nation"? [
            params.data[params.data.length - Math.round(params.data.length/3)*2 - 1][params.xVar],
            params.data[params.data.length - Math.round(params.data.length/3) - 1][params.xVar],
            params.data[params.data.length - params.recentIndex -1][params.xVar]] 
            : 
            [0]
          }                        
          style={{grid:{background: "#ccdee8"}, tickLabels: {background: "#ccdee8", fontSize: 10}}} 
          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
        
        <VictoryGroup 
          colorScale={[stateColor]}
        >

        <VictoryLine data={params.data && params.sFips !== "_nation"? params.data : [0,0,0]}
            x={params.xVar} y= {params.yVar}
            />

        </VictoryGroup>
        <VictoryArea
          style={{ data: {fill: "#080808" , fillOpacity: 0.1} }}
          data={params.data && params.sFips !== "_nation"? params.data : [0,0,0]}
          x= {params.xVar} y = {params.yVar}

        />

        <VictoryLabel text= {params.sFips === "_nation" ? 0 : params.rate} x={115} y={60} textAnchor="middle" style={{fontSize: 50, fontFamily: 'lato'}}/>
        <VictoryLabel text= {params.sFips === "_nation" ? "" : params.percentChange}  x={115} y={115} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>
        <VictoryLabel text= {params.sFips === "_nation" ? "" : params.yVar === "hospDaily" ? "7-day" : "14-day"}  x={180} y={110} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>
        <VictoryLabel text= {params.sFips === "_nation" ? "" : "change"}  x={180} y={120} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>

    </VictoryChart>
  )
}

export default function StateMap(props) {
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();  

  
  const history = useHistory();
  let {stateFips} = useParams();
  const [tooltipContent, setTooltipContent] = useState('');

  const [hospDate, setHospDate] = useState();
  const [date, setDate] = useState();
  const [data, setData] = useState();
  const [dataTS, setDataTS] = useState();
  const [dataStateTS, setStateTS] = useState();
  const [raceData, setRaceData] = useState();

  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyFips, setCountyFips] = useState('');
  const [countyName, setCountyName] = useState('');
  const [barCountyName, setBarCountyName] = useState('');
  
  const [colorScale, setColorScale] = useState();
  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [caseRate, setCaseRate] = useState();
  const [percentChangeCases, setPercentChangeCases] = useState();
  const [mortality, setMortality] = useState();
  const [percentChangeMortality, setPercentChangeMortality] = useState();
  const [pctPositive, setPctPositive] = useState();
  // const [totalCases, setTotalCases] = useState();
  const [hospDaily, setHospDaily] = useState();
  const [percentChangeHospDaily, setPercentChangeHospDaily] = useState();
  const [index, setIndex] = useState();
  const [indexP, setIndexP] = useState(0);


  const [varMap, setVarMap] = useState({});

  // const [metric, setMetric] = useState('seriesCompletePopPct');
  // const [metricOptions, setMetricOptions] = useState('seriesCompletePopPct');
  // const [metricName, setMetricName] = useState('Percent of population fully vaccinated');

  const [metric, setMetric] = useState('caserate7dayfig');
  const [metricOptions, setMetricOptions] = useState('caserate7dayfig');
  const [metricName, setMetricName] = useState('Average Daily COVID-19 Cases per 100K');

  // const [metric, setMetric] = useState('casesfig');
  // const [metricOptions, setMetricOptions] = useState('casesfig');
  // const [metricName, setMetricName] = useState('Total COVID-19 Cases');


  const [covidMetric, setCovidMetric] = useState({t: 'n/a'});
  const [countyOption, setCountyOption] = useState();
  const [selectedTrend, setSelectedTrend] = useState("");
  

  const [trendline, setTrendline] = useState('caserate7dayfig');
  const trendOptions = [
    {
      key: 'caserate7dayfig',
      text: 'Average Daily COVID-19 Cases / 100K',
      value: 'caserate7dayfig',
    },
    {
      key: 'covidmortality7dayfig',
      text: 'Average Daily COVID-19 Deaths / 100K',
      value: 'covidmortality7dayfig',
    },
  ]
  const trendName = 
    {
      'caserate7dayfig': 'Average Daily COVID-19 Cases / 100K',
      'covidmortality7dayfig': 'Average Daily COVID-19 Deaths / 100K'

    }
  
  // console.log("stateFips ", stateFips);


  const [delayHandler, setDelayHandler] = useState();

  const [caseTicks, setCaseTicks] = useState([]);

  useEffect(() => {
    if (dataTS && stateFips !== "_nation"){
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
          dataTS["_nation"][275].t,
          dataTS["_nation"][306].t,
          dataTS["_nation"][334].t,
          dataTS["_nation"][365].t,
          dataTS["_nation"][395].t,
          dataTS["_nation"][426].t,
          dataTS["_nation"][456].t,
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

  //variable list & fips code to county name 
  useEffect(()=>{
    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        setMetricOptions(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.variable, text: d.name, group: d.group};
        }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
      });

    fetch('/data/rawdata/f2c.json').then(res => res.json())
      .then(x => {
        setCountyOption(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.value, text: d.text, group: d.state};
        }), d => (d.group === stateFips && d.text !== "Augusta-Richmond County consolidated government" && d.text !== "Wrangell city and borough" && d.text !== "Zavalla city")));
      });

    

  }, []);

     //local fetch

  // useEffect(()=>{
  //   fetch('/data/racedataAll.json').then(res => res.json())
  //     .then(x => {
  //       setRaceData(x);
  //       // setTemp(x[stateFips]);
  //     });
  //   fetch('/data/timeseriesAll.json').then(res => res.json())
  //     .then(x => {
  //       let caseRate = 0;
  //         let mortality = 0;
  //         let percentChangeCase = 0;
  //         let percentChangeMortality = 0;
  //         let index = 0;
  //         let indexP = 0;
  //         let hospD = 0;
  //         let totCases = 0;
  //         let percentChangeHospDaily = 0;
  //         let percentPositive = 0;
  //       setStateTS(x[stateFips]);
  //       if(stateFips === "_nation"){
  //                         caseRate = 0;
  //                         mortality = 0;
  //                         totCases = 0;
  //                         hospD = 0;
  //                       }else{
  //                         //case rate
  //                         caseRate = x[stateFips][x[stateFips].length-1].dailyCases;
  //                         percentChangeCase = x[stateFips][x[stateFips].length-1].percent14dayDailyCases;
                          
  //                         //mortality rate
  //                         mortality = x[stateFips][x[stateFips].length-1].dailyMortality;
  //                         percentChangeMortality = x[stateFips][x[stateFips].length-1].percent14dayDailyDeaths;
        
  //                         //hospitalization rate
  //                         percentChangeHospDaily = x[stateFips][x[stateFips].length-1].percent7dayhospDaily;
  //                         hospD = x[stateFips][x[stateFips].length-1].hospDaily;
        
  //                         //testing positive rate
  //                         percentPositive = x[stateFips][x[stateFips].length-1].percentPositive;
        
  //                         totCases = x[stateFips][x[stateFips].length-1].cases;
        
  //                       }

  //       //manipulate string
  //           if (percentChangeCase.toFixed(0) > 0){
  //             setPercentChangeCases("+" + percentChangeCase.toFixed(0) + "%");
  //           }else if(percentChangeCase.toFixed(0).substring(1) === "0"){
  //             setPercentChangeCases(percentChangeCase.toFixed(0).substring(1) + "%");
  //           }else{
  //             setPercentChangeCases(percentChangeCase.toFixed(0) + "%");
  //           }

  //           if (percentChangeMortality.toFixed(0) > 0){
  //             setPercentChangeMortality("+" + percentChangeMortality.toFixed(0) + "%");
  //           }else if(percentChangeMortality.toFixed(0).substring(1) === "0"){
  //             setPercentChangeMortality(percentChangeMortality.toFixed(0).substring(1) + "%");
  //           }else{
  //             setPercentChangeMortality(percentChangeMortality.toFixed(0) + "%");
  //           }

  //           if (percentChangeHospDaily.toFixed(0) > 0){
  //             setPercentChangeHospDaily("+" + percentChangeHospDaily.toFixed(0) + "%");
  //           }else if(percentChangeHospDaily.toFixed(0).substring(1) === "0"){
  //             setPercentChangeHospDaily(percentChangeHospDaily.toFixed(0).substring(1) + "%");
  //           }else{
  //             setPercentChangeHospDaily(percentChangeHospDaily.toFixed(0) + "%");
  //           }

  //           //set values
  //           setPctPositive(percentPositive.toFixed(0) + "%");
  //           // setIndexP(indexP);
  //           // setIndex(index);
  //           setCaseRate(numberWithCommas(caseRate.toFixed(0)));
  //           setMortality(numberWithCommas(mortality.toFixed(0)));
  //           // setTotalCases(numberWithCommas(totCases.toFixed(0)));
  //           setHospDaily(numberWithCommas(hospD.toFixed(0)));
  //     });

  // }, [stateFips]);

  // useEffect(()=>{
  //   if (metric) {
  //   const configMatched = configs.find(s => s.fips === stateFips);

  //     if (!configMatched){
  //       history.push('/_nation');
  //     }else{

  //       setConfig(configMatched);

  //       setStateName(configMatched.name);
  //       fetch('/data/date.json').then(res => res.json())
  //        .then(x => setDate(x.date.substring(5,7) + "/" + x.date.substring(8,10) + "/" + x.date.substring(0,4)));

  //       fetch('/data/data.json').then(res => res.json())
  //         .then(x => {
  //           setData(x);

  //           const cs = scaleQuantile()
  //           .domain(_.map(_.filter(_.map(x, (d, k) => {
  //             d.fips = k
  //             return d}), 
  //             d => (
  //                 d[metric] > 0 &&
  //                 d.fips.length === 5)),
  //             d=> d[metric]))
  //           .range(colorPalette);

  //           let scaleMap = {}
  //           _.each(_.filter(_.map(x, (d, k) => {
  //             d.fips = k
  //             return d}), 
  //             d => (
  //                 d[metric] > 0 &&
  //                 d.fips.length === 5))
  //                 , d=>{
  //             scaleMap[d[metric]] = cs(d[metric])});

  //           setColorScale(scaleMap);
  //           var max = 0
  //           var min = 100
  //           _.each(x, d=> { 
  //             if (d[metric] > max && d.fips.length === 5) {
  //               max = d[metric]
  //             } else if (d.fips.length === 5 && d[metric] < min && d[metric] > 0){
  //               min = d[metric]
  //             }
  //           });

  //           if (max > 999) {
  //             max = (max/1000).toFixed(0) + "K";
  //             setLegendMax(max);
  //           }else{
  //             setLegendMax(max.toFixed(0));

  //           }
  //           setLegendMin(min.toFixed(0));

  //           var split = scaleQuantile()
  //           .domain(_.map(_.filter(_.map(x, (d, k) => {
  //             d.fips = k
  //             return d}), 
  //             d => (
  //                 d[metric] > 0 &&
  //                 d.fips.length === 5)),
  //             d=> d[metric]))
  //           .range(colorPalette);

  //           setLegendSplit(split.quantiles());
  //         });
        
  //       fetch('/data/timeseries'+stateFips+'.json').then(res => res.json())
  //         .then(x => {

  //           let countyMost = '';
  //           let covidmortality7dayfig = 0;
            

  //           _.each(x, (v, k)=>{

  //             if (k.length===5 && v.length > 0 && v[v.length-1].covidmortality7dayfig > covidmortality7dayfig){
  //               countyMost = k.substring(2, 5);
  //               covidmortality7dayfig = v[v.length-1].covidmortality7dayfig;
  //             }
              
  //             setCountyFips(countyMost);

  //             if(stateFips !== "_nation"){
  //               setCountyName(fips2county[stateFips+countyMost]);
  //               // setBarCountyName((fips2county[stateFips+countyMost]).match(/\S+/)[0]);

  //            }
            
            

            
  //           });
  //         setDataTS(x);
  //      });
      
  //   }
  //  }
  

  
  // }, [metric]);
  // console.log("config ", config);

  // mongo
  useEffect(()=>{
    if (metric) {
      const configMatched = configs.find(s => s.fips === stateFips);
      // console.log("configMatched", configMatched);
      if (!configMatched){
        history.push('/_nation');
      }else{
        if (isLoggedIn === true){
          let newDict = {};
          let caseRate = 0;
          let mortality = 0;
          let percentChangeCase = 0;
          let percentChangeMortality = 0;
          let hospD = 0;
          let totCases = 0;
          let percentChangeHospDaily = 0;
          let percentPositive = 0;    
          let indexP = 0;
          let hospDate = 0;
          let str = "";
          setConfig(configMatched);
          setStateName(configMatched.name);
          const fetchData = async() => { 
            if(stateFips !== "_nation"){
              //all static data
              const staticQ = {all: "all"};
              const promStatic = await CHED_static.find(staticQ,{projection:{}}).toArray();

              promStatic.forEach(i=> {
                
                if(i.tag === "nationalrawfull"){ //nationalraw
                  newDict = i.data;
                  setData(newDict); 
                }else if(i.tag === "racedataAll"){ //race data
                  setRaceData(i.racedataAll);       
                }else if(i.tag === "date"){
                  setDate(i.date.substring(5,7) + "/" + i.date.substring(8,10) + "/" + i.date.substring(0,4));
                }
              });
                    
          
              const stateSeriesQ = {full_fips: stateFips};
              const promState = await CHED_series.find(stateSeriesQ,{projection:{}}).toArray();
              let stateSeriesDict = promState[0]["timeseries" + stateFips];
              setStateTS(stateSeriesDict);

              if(stateFips === "_nation"){
                caseRate = 0;
                mortality = 0;
                totCases = 0;
                hospD = 0;
              }else{
                //case rate
                caseRate = stateSeriesDict[stateSeriesDict.length-1].dailyCases;
                percentChangeCase = stateSeriesDict[stateSeriesDict.length-1].percent14dayDailyCases;
                
                //mortality rate
                mortality = stateSeriesDict[stateSeriesDict.length-1].dailyMortality;
                percentChangeMortality = stateSeriesDict[stateSeriesDict.length-1].percent14dayDailyDeaths;

                // //hospitalization rate
                // percentChangeHospDaily = stateSeriesDict[stateSeriesDict.length-1].percent7dayhospDaily;
                // hospD = stateSeriesDict[stateSeriesDict.length-1].hospDaily;

                // //testing positive rate
                // percentPositive = stateSeriesDict[stateSeriesDict.length-1].percentPositive;

                totCases = stateSeriesDict[stateSeriesDict.length-1].cases;

                if(stateSeriesDict[stateSeriesDict.length-1].hospDaily === 0){
                  for (var i = stateSeriesDict.length - 1; i >= 0; i--) {
                    if (i ===0 ){
                      indexP = 1;
                      hospD = stateSeriesDict[stateSeriesDict.length-1].hospDaily;
                      percentChangeHospDaily = stateSeriesDict[stateSeriesDict.length-1].percent7dayhospDaily;
                    }else if (stateSeriesDict[i].hospDaily === 0){
                    }else{
                      indexP = stateSeriesDict.length - i;
                      hospD = stateSeriesDict[i].hospDaily;
                      percentChangeHospDaily = stateSeriesDict[i].percent7dayhospDaily;
                      hospDate = stateSeriesDict[i-1].t;
                      i = 0;
                    }
                  }
                }else{
                  indexP = 0;
                  hospD = stateSeriesDict[stateSeriesDict.length-1].hospDaily;
                  percentChangeHospDaily = stateSeriesDict[stateSeriesDict.length-1].percent7dayhospDaily;
                  hospDate = stateSeriesDict[stateSeriesDict.length-1].t;
                  
                }

                if(stateSeriesDict[stateSeriesDict.length-1].percentPositive === 0){
                  for (var i = stateSeriesDict.length - 1; i >= 0; i--) {
                    if (i ===0 ){
                      indexP = 1;
                      percentPositive = stateSeriesDict[stateSeriesDict.length-1].percentPositive;

                    }else if (stateSeriesDict[i].percentPositive === 0){
                    }else{
                      indexP = stateSeriesDict.length - i;
                      percentPositive = stateSeriesDict[i].percentPositive;

                      i = 0;
                    }
                  }
                }else{
                  percentPositive = stateSeriesDict[stateSeriesDict.length-1].percentPositive;

                }
              }
            }
            
            
            setHospDate(("" + ((new Date(hospDate*1000).getMonth() + 1).toString().padStart(2, "0")) + "/" + new Date(hospDate*1000).getDate().toString().padStart(2, "0") + "/" + new Date(hospDate*1000).getFullYear().toString()));
            //manipulate string
            if (percentChangeCase.toFixed(0) > 0){
              setPercentChangeCases("+" + percentChangeCase.toFixed(0) + "%");
            }else if(percentChangeCase.toFixed(0).substring(1) === "0"){
              setPercentChangeCases(percentChangeCase.toFixed(0).substring(1) + "%");
            }else{
              setPercentChangeCases(percentChangeCase.toFixed(0) + "%");
            }

            if (percentChangeMortality.toFixed(0) > 0){
              setPercentChangeMortality("+" + percentChangeMortality.toFixed(0) + "%");
            }else if(percentChangeMortality.toFixed(0).substring(1) === "0"){
              setPercentChangeMortality(percentChangeMortality.toFixed(0).substring(1) + "%");
            }else{
              setPercentChangeMortality(percentChangeMortality.toFixed(0) + "%");
            }

            if (percentChangeHospDaily.toFixed(0) > 0){
              setPercentChangeHospDaily("+" + percentChangeHospDaily.toFixed(0) + "%");
            }else if(percentChangeHospDaily.toFixed(0).substring(1) === "0"){
              setPercentChangeHospDaily(percentChangeHospDaily.toFixed(0).substring(1) + "%");
            }else{
              setPercentChangeHospDaily(percentChangeHospDaily.toFixed(0) + "%");
            }

            //set values
            setPctPositive(percentPositive.toFixed(0) + "%");
            setIndexP(indexP);
            // console.log(indexP);
            // setIndex(index);
            setCaseRate(numberWithCommas(caseRate.toFixed(0)));
            setMortality(numberWithCommas(mortality.toFixed(0)));
            // setTotalCases(numberWithCommas(totCases.toFixed(0)));
            setHospDaily(numberWithCommas(hospD.toFixed(0)));

            let seriesDict = {};
            let countyMost = '';
            let covidmortality7dayfig = 0;
            if( stateFips !== "_nation"){
              //Timeseries data
              const seriesQ = { $or: [ { state: "_n" } , { state: stateFips } ] }
              const prom = await CHED_series.find(seriesQ, {projection: {}}).toArray();
              _.map(prom, i=> {
                seriesDict[i[Object.keys(i)[4]]] = i[Object.keys(i)[5]];
                return seriesDict;
              });
              _.each(seriesDict, (v, k)=>{

                if (k.length===5 && v.length > 0 && v[v.length-1].covidmortality7dayfig > covidmortality7dayfig){
                  countyMost = k.substring(2, 5);
                  covidmortality7dayfig = v[v.length-1].covidmortality7dayfig;
                }
              });
            }
            setCountyFips(countyMost);
            if(stateFips !== "_nation"){
              setCountyName(fips2county[stateFips+countyMost]);
              setBarCountyName((fips2county[stateFips+countyMost]).match(/\S+/)[0]);
            }
            
            setDataTS(seriesDict);
          };
          fetchData();
        
          
        } else {
          handleAnonymousLogin();
        }
      }
    }
  },[isLoggedIn]);


  useEffect(() => {
    if(stateFips !== "_nation"){
      let scaleMap = {};
      var max = 0;
      var min = 100;
      const cs = scaleQuantile()
      .domain(_.map(_.filter(data, 
        d => (
            d[metric] > 0 &&
            d.fips.length === 5)),
        d=> d[metric]))
      .range(colorPalette);

      _.each(data, d=>{
        if(d[metric] > 0){
        scaleMap[d[metric]] = cs(d[metric])}});
      setColorScale(scaleMap);
      setLegendSplit(cs.quantiles());

      //find the largest value and set as legend max
      _.each(data, d=> { 
        if (d[metric] > max && d.fips.length === 5) {
          max = d[metric]
        } else if (d.fips.length === 5 && d[metric] < min && d[metric] >= 0){
          min = d[metric]
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
    }

  }, [metric, data]);


  if (stateFips === "_nation" || (data && metric && trendOptions && trendline)) {
  // if (stateFips === "_nation" || (data && metric && trendOptions && trendline && dataTS)) {
    // console.log(date);
    

  return (
    <HEProvider>
      <div>
        <AppBar menu='countyReport'/>
          <Container style={{marginTop: '8em', minWidth: '1260px'}}>

            {config &&
            <div>
              <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt"}}>
                <Breadcrumb.Section link onClick={() => history.push('/')}>United States</Breadcrumb.Section>
                <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
                <Breadcrumb.Section active>{stateFips === "_nation" ? "The United States" :stateName}</Breadcrumb.Section>
                <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
              </Breadcrumb>
              {stateFips === "_nation"? 
                <div style ={{paddingTop: 26, paddingBottom: 6}}>
                  <Header.Content style={{paddingLeft: 0, fontFamily: "lato", fontSize: "14pt"}}>

                    <p style= {{fontSize: "20pt"}}>Select your state and then select your county.</p>
                    <b> Step 1.</b> Select your state.
                  </Header.Content>
                </div> 
                :
                <div style ={{paddingTop: 26, paddingBottom: 6}}>
                  <Header.Content style={{paddingLeft: 0, fontFamily: "lato", fontSize: "14pt"}}>

                    <p style= {{fontSize: "20pt"}}>Select your state and then select your county.</p>
                    <b> Step 1.</b> Select your state.<b> 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Step 2. </b> Select your county. <br/><br/>
                  </Header.Content>
                </div>
              }

              <Dropdown
                style={{background: '#fff', 
                        fontSize: "19px",
                        fontWeight: 400, 
                        theme: '#000000',
                        width: '380px',
                        left: '0px',
                        text: "Select",
                        borderTop: '0.5px solid #bdbfc1',
                        borderLeft: '0.5px solid #bdbfc1',
                        borderRight: '0.5px solid #bdbfc1', 
                        borderBottom: '0.5px solid #bdbfc1',
                        borderRadius: 0,
                        minHeight: '1.0em',
                        paddingBottom: '0.5em'}}
                text= {"Selected State: " + (stateFips === "_nation" ? "The United States": stateName)}
                search
                selection
                pointing = 'top'
                options={stateOptions}
                onChange={(e, { value }) => {
                  window.location.href = "/" + value;

                }}

              />

              {stateFips !== "_nation" && 
              <Dropdown
                  style={{background: '#fff', 
                          fontSize: "19px",
                          fontWeight: 400, 
                          theme: '#000000',
                          width: '450px',
                          left: '0px',
                          text: "Select",
                          borderTop: '0.5px solid #bdbfc1',
                          borderLeft: '0.5px solid #bdbfc1',
                          borderRight: '0.5px solid #bdbfc1', 
                          borderBottom: '0.5px solid #bdbfc1',
                          borderRadius: 0,
                          minHeight: '1.0em',
                          paddingBottom: '0.5em'}}
                  text= "Select County/Census Area/Borough"
                  search
                  selection
                  pointing = 'top'
                  options={countyOption}
                  onChange={(e, { value }) => {
                    if (value !== "Select County/Census Area/Borough") {
                      window.location.href = "/"+stateFips + "/" + value+"";
                    }
                    
                  }}
                  
              />}
                        
            <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '22pt', paddingTop: 40, paddingBottom: 25}}> Covid-19 Outcomes in {stateName} </Divider>
            
            {<Grid columns={15}>
              <Grid.Row columns={5} style={{width: 252, paddingRight: 0, paddingTop: '2em', paddingBottom: "0"}}>
                <Grid.Column style = {{width:235}}> 
                  <center style = {{ fontSize: "22px", fontFamily: "lato", paddingBottom: 5}}> Daily Cases</center>

                  <div style = {{width: 235, background: "#e5f2f7"}}>

                  {stateFips === "_nation" && 
                    <TopChart
                      data = {dataStateTS} 
                      sFips = {stateFips}
                      xVar = "t" 
                      yVar = "caseRateMean"
                      rate = {caseRate}
                      percentChange = {percentChangeCases}
                      resize= {1.2}
                      recentIndex = {0}

                    />}
                  {stateFips && dataStateTS && stateFips !== "_nation" && 
                    <TopChart
                      data = {dataStateTS} 
                      sFips = {stateFips}
                      xVar = "t" 
                      yVar = "caseRateMean"
                      rate = {caseRate}
                      percentChange = {percentChangeCases}
                      resize= {1.2}
                      recentIndex = {0}
                    />}
                    
                  </div>
                  
                </Grid.Column>
                <Grid.Column style = {{width:235}}> 
                  <center style = {{ fontSize: "22px", fontFamily: "lato", paddingBottom: 5}}> Daily Deaths</center>
                  <div style = {{width: 235, background: "#e5f2f7"}}>

                  {stateFips === "_nation" && 
                    <TopChart
                      data = {dataStateTS} 
                      sFips = {stateFips}
                      xVar = "t" 
                      yVar = "caseRateMean"
                      rate = {caseRate}
                      percentChange = {percentChangeCases}
                      resize= {1.2}
                      recentIndex = {0}
                    />}
                  {stateFips && dataStateTS && stateFips !== "_nation" && 

                    <TopChart
                      data = {dataStateTS} 
                      sFips = {stateFips}
                      xVar = "t" 
                      yVar = "mortalityMean"
                      rate = {mortality}
                      percentChange = {percentChangeMortality}
                      resize= {3}
                      recentIndex = {0}
                    />
                  }

                  </div>
                  
                </Grid.Column>

                <Grid.Column style = {{width:235}}> 
                  <center style = {{ fontSize: "22px", fontFamily: "lato", paddingBottom: 5}}> Daily Hospitalizations</center>

                  <div style = {{width: 235, background: "#e5f2f7"}}>

                  {stateFips === "_nation" && 
                    <TopChart
                      data = {dataStateTS} 
                      sFips = {stateFips}
                      xVar = "t" 
                      yVar = "caseRateMean"
                      rate = {caseRate}
                      percentChange = {percentChangeCases}
                      resize= {1.2}
                      recentIndex = {0}
                    />}
                  {stateFips && dataStateTS && stateFips !== "_nation" && 

                    <TopChart
                      data = {dataStateTS} 
                      sFips = {stateFips}
                      xVar = "t" 
                      yVar = "hospDaily"
                      rate = {hospDaily}
                      percentChange = {percentChangeHospDaily}
                      resize= {1.5}
                      recentIndex = {indexP}
                    />
                  }

                    
                  </div>
                  
                </Grid.Column>
              
                <Grid.Column style = {{width:235}}>
                  <center style = {{ fontSize: "22px", fontFamily: "lato", paddingBottom: 5}}> Percent Tested Positive</center>
                  
                  <div style = {{width: 235, background: "#e5f2f7"}}>

                  {stateFips === "_nation" && 
                    <TopChart
                      data = {dataStateTS} 
                      sFips = {stateFips}
                      xVar = "t" 
                      yVar = "caseRateMean"
                      rate = {caseRate}
                      percentChange = {percentChangeCases}
                      resize= {1.2}
                      recentIndex = {indexP}
                    />}
                  {stateFips && dataStateTS && stateFips !== "_nation" && 
                    <VictoryChart theme={VictoryTheme.material}
                                                  
                      minDomain={{ x: stateFips !== "_nation" ? dataStateTS[dataStateTS.length- indexP - 15].t : 0 }}
                      maxDomain={{ x: stateFips !== "_nation" ? dataStateTS[dataStateTS.length- indexP - 1].t : 0 , y: stateFips !== "_nation" ? getMaxRange(dataStateTS, "percentPositive", dataStateTS.length-indexP -15)*1.2 : 0 }}
                      width={235}
                      height={180}       
                      padding={{left: 0, right: -1, top: 150, bottom: -0.9}}
                      containerComponent={<VictoryContainer responsive={false}/>}>

                      
                      <VictoryAxis
                        tickValues={stateFips !== "_nation" ? [
                          dataStateTS[dataStateTS.length - Math.round(dataStateTS.length/3)*2 - 1].t,
                          dataStateTS[dataStateTS.length - Math.round(dataStateTS.length/3) - 1].t,
                          dataStateTS[dataStateTS.length-1].t]
                        :
                        [0]}                        
                        style={{tickLabels: {fontSize: 10}}} 
                        tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}
                      />
                      
                      <VictoryGroup colorScale={[stateColor]}>

                        <VictoryLine data={dataStateTS && stateFips !== "_nation"? dataStateTS : [0,0,0]}
                          x='t' y='percentPositive'
                        />

                      </VictoryGroup>

                      <VictoryArea
                        style={{ data: { fill: "#080808", fillOpacity: 0.1} }}
                        data={dataStateTS && stateFips !== "_nation"? dataStateTS : [0,0,0]}
                        x= 't' y = 'percentPositive'

                      />
                      <VictoryLabel text= {stateFips === "_nation" ? 0 :pctPositive} x={115} y={60} textAnchor="middle" style={{fontSize: 50, fontFamily: 'lato'}}/>
                    </VictoryChart>
                  }
                  </div>
                  
                </Grid.Column>

                {stateFips === "_nation" && 
                  <center style = {{ fontSize: "15pt", fontFamily: "lato", paddingBottom: 5, paddingLeft: 8, width: 250}}> Deaths by Race & Ethnicity</center>


                  }
                {stateFips && dataStateTS && stateFips !== "_nation" && 
                <Grid.Column rows = {2} style = {{width:235}}>

                    {stateFips === "_nation" && 
                    <TopChart
                      data = {dataStateTS} 
                      sFips = {stateFips}
                      xVar = "t" 
                      yVar = "caseRateMean"
                      rate = {caseRate}
                      percentChange = {percentChangeCases}
                      resize= {1.2}
                    />}

                  
                  {stateFips !== "_nation" && stateFips !== "72" &&
                  <center style = {{ fontSize: "15pt", fontFamily: "lato", paddingBottom: 5, width: 238}}> 
                    Deaths by {(!!raceData[stateFips]["White Alone"] ||
                    !!raceData[stateFips]["Asian Alone"] ||
                    !!raceData[stateFips]["African American Alone"] ||
                    !!raceData[stateFips]["American Natives Alone"]
                    && !raceData[stateFips]["Hispanic"]? "Race" : "Race & Ethnicity")}</center>
                  }
                  {stateFips === "38" &&
                  <div style = {{background: "#e5f2f7", paddingBottom: 61}}> <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> <br/> <br/> <br/> <br/> None Reported <br/>  <br/> </center></div>
                  }

                  {stateFips === "02" &&
                  <div style = {{background: "#e5f2f7", paddingBottom: 13, width: 235}}> <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> <br/> <br/> <br/>None Reported <br/>  <br/> </center></div>
                  }
                  
                  <div style = {{width: 235, background: "#e5f2f7"}}>
                    <Grid.Row>
                      {stateFips !== "_nation" && !raceData[stateFips]["Non-Hispanic African American"] && stateFips !== "38" && stateFips !== "02" && 
                      <VictoryChart
                        theme = {VictoryTheme.material}
                        width = {235}
                        height = {(!!raceData[stateFips]["African American Alone"] + !!raceData[stateFips]["American Natives Alone"] + !!raceData[stateFips]["Asian Alone"] + !!raceData[stateFips]["White Alone"] ) === 2? 88 : 112}
                        domainPadding={20}
                        minDomain={{y: props.ylog?1:0}}
                        padding={{left: 90, right: 35, top: 0, bottom: -2}}
                        style = {{fontSize: "14pt"}}
                        containerComponent={<VictoryContainer responsive={false}/>}
                      >

                        <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "16px", fill: '#000000', fontFamily: 'lato'}}} />
                        <VictoryAxis dependentAxis style={{ticks:{stroke: "#e5f2f7"}, axis: {stroke: "#000000"},grid: {stroke: "transparent"}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                        <VictoryGroup>

                          {"Asian Alone" in raceData[stateFips] && raceData[stateFips]["Asian Alone"][0]['deathrateRace'] >= 0 && raceData[stateFips]["Asian Alone"][0]['deaths'] > 30 && raceData[stateFips]["Asian Alone"][0]['percentPop'] >= 1 &&
                            <VictoryBar
                              barWidth= {10}
                              horizontal
                              barRatio={0.7}
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                              data={[

                                    {key: "Asian", 'value': raceData[stateFips]["Asian Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[stateFips]["Asian Alone"][0]['deathrateRace'])}

                              ]}
                              labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000", fontWeight: 600 }}/>}
                              style={{
                                data: {
                                  fill: "#487f84"
                                }
                              }}
                              x="key"
                              y="value"
                            />
                          }

                          {"American Natives Alone" in raceData[stateFips] && raceData[stateFips]["American Natives Alone"][0]['deathrateRace'] >= 0 && raceData[stateFips]["American Natives Alone"][0]['deaths'] > 30 && raceData[stateFips]["American Natives Alone"][0]['percentPop'] >= 1 &&
                            <VictoryBar
                              barWidth= {10}
                              horizontal
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                              data={[

                                    {key: "American\n Natives", 'value': raceData[stateFips]["American Natives Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[stateFips]["American Natives Alone"][0]['deathrateRace'])}

                              ]}
                              labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000", fontWeight: 600 }}/>}
                              style={{
                                data: {
                                  fill: "#487f84"
                                }
                              }}
                              x="key"
                              y="value"
                            />
                          }


                          {"African American Alone" in raceData[stateFips] && raceData[stateFips]["African American Alone"][0]['deathrateRace'] >= 0 && raceData[stateFips]["African American Alone"][0]['deaths'] > 30 && raceData[stateFips]["African American Alone"][0]['percentPop'] >= 1 &&
                            <VictoryBar
                              barWidth= {10}
                              horizontal
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                              data={[

                                    {key: "African\n American", 'value': raceData[stateFips]["African American Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[stateFips]["African American Alone"][0]['deathrateRace'])}

                              ]}
                              labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000", fontWeight: 600 }}/>}
                              style={{
                                data: {
                                  fill: "#487f84"
                                }
                              }}
                              x="key"
                              y="value"
                            />
                          }

                          {"White Alone" in raceData[stateFips] && raceData[stateFips]["White Alone"][0]['deathrateRace'] >= 0 && raceData[stateFips]["White Alone"][0]['deaths'] > 30 && raceData[stateFips]["White Alone"][0]['percentPop'] >= 1 &&
                            <VictoryBar
                              barWidth= {10}
                              horizontal
                              barRatio={0.7}
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                              data={[

                                    {key: "White", 'value': raceData[stateFips]["White Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[stateFips]["White Alone"][0]['deathrateRace'])}

                              ]}
                              labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000", fontWeight: 600 }}/>}
                              style={{
                                data: {
                                  fill: "#487f84"
                                }
                              }}
                              x="key"
                              y="value"
                            />
                          }

                        </VictoryGroup>
                      </VictoryChart>}
                    </Grid.Row>
                    {stateFips !== "_nation" && !raceData[stateFips]["Non-Hispanic African American"] && stateFips !== "38" &&
                      <div style={{lineHeight: "4px", background: "#FFFFFF"}}>
                        &nbsp;&nbsp;
                      </div>
                    }
                    <Grid.Row> 
                      {stateFips !== "_nation"  && stateFips !== "38" && !(stateFips !== "_nation" && stateFips !== "38" && !((!raceData[stateFips]["Hispanic"] || raceData[stateFips]["Hispanic"][0]['deathrateEthnicity'] < 0) && (!raceData[stateFips]["Non Hispanic"] || raceData[stateFips]["Non Hispanic"][0]['deathrateEthnicity'] < 0) && 
                      !raceData[stateFips]["Non-Hispanic African American"] && !raceData[stateFips]["Non-Hispanic American Natives"] && 
                      !raceData[stateFips]["Non-Hispanic Asian"] && !raceData[stateFips]["Non-Hispanic White"])) && 
                        <center style= {{height: 64}}> <text style={{fontSize: '14pt', lineHeight: "14pt"}}> <br/>Ethnicity Not Reported</text> </center>
                      }

                      { stateFips !== "38" && (stateFips !== "_nation" && stateFips !== "38" && !((!raceData[stateFips]["Hispanic"] || raceData[stateFips]["Hispanic"][0]['deathrateEthnicity'] < 0) && (!raceData[stateFips]["Non Hispanic"] || raceData[stateFips]["Non Hispanic"][0]['deathrateEthnicity'] < 0) && 
                      !raceData[stateFips]["Non-Hispanic African American"] && !raceData[stateFips]["Non-Hispanic American Natives"] && 
                      !raceData[stateFips]["Non-Hispanic Asian"] && !raceData[stateFips]["Non-Hispanic White"]))  &&
                      
                      <VictoryChart
                        theme = {VictoryTheme.material}
                        width = {235}
                        height = {(!!raceData[stateFips]["African American Alone"] + !!raceData[stateFips]["American Natives Alone"] + !!raceData[stateFips]["Asian Alone"] + !!raceData[stateFips]["White Alone"] ) === 2? 88 : stateFips !== "_nation" && !raceData[stateFips]["Non-Hispanic African American"] && stateFips !== "38" ? 64: 180}
                        domainPadding={20}
                        minDomain={{y: props.ylog?1:0}}
                        padding={{left: 90, right: 35, top: 0, bottom: -2}}
                        style = {{fontSize: "14pt"}}
                        containerComponent={<VictoryContainer responsive={false}/>}
                      >

                        <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "16px", fill: '#000000', fontFamily: 'lato'}}} />
                        <VictoryAxis dependentAxis style={{ticks:{stroke: "#e5f2f7"}, axis: {stroke: "#000000"},grid: {stroke: "transparent"}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                        
                        <VictoryGroup>

                          {!!raceData[stateFips]["Hispanic"]  && raceData[stateFips]["Hispanic"][0]['deathrateEthnicity'] >= 0 && raceData[stateFips]["Hispanic"][0]['deaths'] > 30 && raceData[stateFips]["Hispanic"][0]['percentPop'] >= 1 &&
                            <VictoryBar
                              barWidth= {10}
                              barRatio={0.1}
                              horizontal
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                              data={[

                                    {key: "Hispanic", 'value': raceData[stateFips]["Hispanic"][0]['deathrateEthnicity'], 'label': numberWithCommas(raceData[stateFips]["Hispanic"][0]['deathrateEthnicity'])}

                              ]}
                              labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000", fontWeight: 600 }}/>}
                              style={{
                                data: {
                                  fill: "#487f84"
                                }
                              }}
                              x="key"
                              y="value"
                            />
                          }

                          {!!raceData[stateFips]["Non Hispanic"] && raceData[stateFips]["Non Hispanic"][0]['deathrateEthnicity'] >= 0 && raceData[stateFips]["Non Hispanic"][0]['deaths'] > 30 && raceData[stateFips]["Non Hispanic"][0]['percentPop'] >= 1 &&
                            <VictoryBar
                              barWidth= {10}
                              barRatio={0.1}
                              horizontal
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                              data={[

                                    {key: "Non\n Hispanic", 'value': raceData[stateFips]["Non Hispanic"][0]['deathrateEthnicity'], 'label': numberWithCommas(raceData[stateFips]["Non Hispanic"][0]['deathrateEthnicity'])}

                              ]}
                              labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000", fontWeight: 600 }}/>}
                              style={{
                                data: {
                                  fill: "#487f84"
                                }
                              }}
                              x="key"
                              y="value"
                            />
                          }
                          
                        
                          {!!raceData[stateFips]["Non-Hispanic African American"] && raceData[stateFips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'] >= 0 && raceData[stateFips]["Non-Hispanic African American"][0]['deaths'] > 30 && raceData[stateFips]["Non-Hispanic African American"][0]['percentPop'] >= 1 &&
                            <VictoryBar
                              barWidth= {10}
                              horizontal
                              barRatio={0.7}
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                              data={[

                                    {key: "African\n American", 'value': raceData[stateFips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateFips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'])}

                              ]}
                              labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000", fontWeight: 600 }}/>}
                              style={{
                                data: {
                                  fill: "#487f84"
                                }
                              }}
                              x="key"
                              y="value"
                            />
                          }

                          {!!raceData[stateFips]["Non-Hispanic American Natives"] && raceData[stateFips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'] >= 0 && raceData[stateFips]["Non-Hispanic American Natives"][0]['deaths'] > 30 && raceData[stateFips]["Non-Hispanic American Natives"][0]['percentPop'] >= 1 &&
                            <VictoryBar
                              barWidth= {10}
                              horizontal
                              barRatio={0.7}
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                              data={[

                                    {key: "American\n Natives", 'value': raceData[stateFips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateFips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'])}

                              ]}
                              labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000", fontWeight: 600 }}/>}
                              style={{
                                data: {
                                  fill: "#487f84"
                                }
                              }}
                              x="key"
                              y="value"
                            />
                          }

                          {!!raceData[stateFips]["Non-Hispanic Asian"] && raceData[stateFips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'] >= 0 && raceData[stateFips]["Non-Hispanic Asian"][0]['deaths'] > 30 && raceData[stateFips]["Non-Hispanic Asian"][0]['percentPop'] >= 1 &&
                            <VictoryBar
                              barWidth= {10}
                              horizontal
                              barRatio={0.7}
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                              data={[

                                    {key: "Asian", 'value': raceData[stateFips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateFips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'])}

                              ]}
                              labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000", fontWeight: 600 }}/>}
                              style={{
                                data: {
                                  fill: "#487f84"
                                }
                              }}
                              x="key"
                              y="value"
                            />
                          }
                          {!!raceData[stateFips]["Non-Hispanic White"] && raceData[stateFips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'] >= 0 && raceData[stateFips]["Non-Hispanic White"][0]['deaths'] > 30 && raceData[stateFips]["Non-Hispanic White"][0]['percentPop'] >= 1 &&
                            <VictoryBar
                              barWidth= {10}
                              horizontal
                              barRatio={0.7}
                              labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                              data={[

                                    {key: "White", 'value': raceData[stateFips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[stateFips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'])}

                              ]}
                              labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "16px", fill: "#000000", fontWeight: 600}}/>}
                              style={{
                                data: {
                                  fill: "#487f84"
                                }
                              }}
                              x="key"
                              y="value"
                            />
                          }

                          
                        </VictoryGroup>
                      </VictoryChart>}
                    </Grid.Row>
                  </div>
                </Grid.Column>
                }
              </Grid.Row>

              <Grid.Row columns = {5} style={{paddingBottom: 0, paddingTop: 10, paddingLeft: 15, paddingRight: 0}}>
                
                <Grid.Column style={{padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <Header.Content style={{fontWeight: 300, fontSize: "14pt"}}>
                    Daily new COVID-19 cases <br/>
                    <br/><br/><br/>
                    <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target = "_blank" rel="noopener noreferrer"> New York Times </a> <br/>
                  </Header.Content>
                </Grid.Column>
                <Grid.Column style={{left: 3, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <Header.Content style={{fontWeight: 300, fontSize: "14pt"}}>
                    Daily new COVID-19 deaths <br/>
                    <br/><br/><br/>
                    <i>Data source</i>:<a style ={{color: "#397AB9"}} href = "https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target = "_blank" rel="noopener noreferrer"> New York Times </a> <br/>
                  </Header.Content>
                </Grid.Column>
                <Grid.Column style={{left: 4, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <Header.Content style={{fontWeight: 300, fontSize: "14pt"}}>
                    New daily COVID-19 Hospitalization <br/>
                    <br/><br/>
                    <i>Data source</i>: U.S. Department of Health & Human Services, <a style ={{color: "#397AB9"}} href = "https://beta.healthdata.gov/Health/COVID-19-Community-Profile-Report/gqxm-d9w9" target = "_blank" rel="noopener noreferrer">Community Profile Report </a> <br/>
                  </Header.Content>
                </Grid.Column>
                <Grid.Column style={{left: 9, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <Header.Content style={{fontWeight: 300, fontSize: "14pt"}}>
                    Percentage of total tests for
                    COVID-19 that resulted in a positive result. <br/><br/>
                    <i>Data source</i>: U.S. Department of Health & Human Services, <a style ={{color: "#397AB9"}} href = "https://beta.healthdata.gov/Health/COVID-19-Community-Profile-Report/gqxm-d9w9" target = "_blank" rel="noopener noreferrer">Community Profile Report </a> <br/>
                  </Header.Content>
                </Grid.Column>
                <Grid.Column style={{left: 12, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <Header.Content style={{fontWeight: 300, fontSize: "14pt"}}>
                    Distribution of deaths per 100K persons. 
                    <br/><br/><br/>
                    <i>Data source</i>: <a style ={{color: "#397AB9"}} href="https://covidtracking.com/race" target="_blank" rel="noopener noreferrer"> The COVID Racial Data Tracker </a> <br/> 

                  </Header.Content>
                </Grid.Column>
              </Grid.Row>

              <Accordion defaultActiveIndex={1} panels={[
              {
                  key: 'acquire-dog',
                  title: {
                      content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                      icon: 'dropdown',
                  },
                  content: {
                      content: (
                        <div>
                          {stateFips !== "_nation" && stateFips === "38" &&
                          <Grid.Row style={{paddingTop: 0, paddingBottom: 25, paddingLeft: 15}}>
                                  <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "16pt"}}>
                                    Cases and deaths data as of: {date}.
                                    <br/>
                                    Hospitalization data as of: 08/12/2021.
                                    <br/>
                                    {stateName} is not reporting deaths by race or ethnicity.
                                    <br/>
                                    Race data as of: {racedatadate.date}. 
                                    
                                  </text>
                          </Grid.Row>
                          }
                                  
                          {stateFips !== "_nation" && stateFips !== "38" &&
                          <Grid.Row style={{paddingTop: 0, paddingBottom: 25, paddingLeft: 15}}>
                                  <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "16pt"}}>
                                    Cases and deaths data as of: {date}.
                                    <br/>
                                    Hospitalization data as of: 08/12/2021.
                                    <br/>
                                    {stateName} reports distribution of deaths across non-Hispanic race categories, with {!!raceData[stateFips]["Race Missing"]? raceData[stateFips]["Race Missing"][0]["percentRaceDeaths"] + "%":!!raceData[stateFips]["Ethnicity Missing"]? raceData[stateFips]["Ethnicity Missing"][0]["percentEthnicityDeaths"] + "%" : !!raceData[stateFips]["Race & Ethnicity Missing"]? raceData[stateFips]["Race & Ethnicity Missing"][0]["percentRaceEthnicityDeaths"] + "%": "na%"} of deaths of known {!!raceData[stateFips]["Race Missing"]? "race" :!!raceData[stateFips]["Ethnicity Missing"]? "ethnicity" : !!raceData[stateFips]["Race & Ethnicity Missing"]? "race & ethnicity": "race & ethnicity"}. Here we only show race categories that constitute at least 1% of the state population and have 30 or more deaths.
                                    <br/>
                                    Race data as of: {racedatadate.date}. 
                                    
                                  </text>
                          </Grid.Row>
                          }

                          { false && 
                            <span style={{color: '#73777B', fontSize: "14pt"}}>Cases and deaths data as of: {date}</span>
                          }
                        </div>
                      ),
                    },
                }
            ]

            } />
            </Grid>
          }
          
            { 
            <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '22pt', paddingTop: 37, paddingBottom: 35}}> COVID-19 County Outcomes </Divider>
            }
          
            <Grid>
              <Grid.Row style = {{width: 1260}}>
                <Grid.Column style = {{width: 450}}>
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
                    text= { stateFips !== "_nation" ? metricName : "Select Metric"}
                    search
                    selection
                    pointing = 'top'
                    options={stateFips !== "_nation" ? metricOptions : ""}
                    onChange={(e, { value }) => {
                      setMetric(value);
                      setMetricName(varMap[value]['name']);
                    }}
                  />


                  <br/> <br/> 
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
                            paddingBottom: '0.5em'}}
                    text= { countyName !== "" ? countyName : "Select County/Census Area/Borough"}
                    search
                    selection
                    pointing = 'top'
                    options={countyOption}
                    onChange={(e, { value }) => {
                      setCountyFips(value);
                      setCountyName(fips2county[stateFips + value]);
                      setBarCountyName((fips2county[stateFips + value]).match(/\S+/)[0]);
                              
                    }}
                  />
                  
                  {dataTS && legendSplit && 
                  <svg width="420" height="90">
                    
                    {_.map(legendSplit, (splitpoint, i) => {
                      if(legendSplit[i] < 1){
                        return <text key = {i} x={20 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(1)}</text>                    
                      }else if(legendSplit[i] > 99999){
                        return <text key = {i} x={20 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplit[i]/1000000).toFixed(0) + "M"}</text>                    
                      }else if(legendSplit[i] > 999){
                        return <text key = {i} x={20 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplit[i]/1000).toFixed(0) + "K"}</text>                    
                      }
                      return <text key = {i} x={20 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(0)}</text>                    
                    })} 
                    <text x={0} y={35} style={{fontSize: '0.7em'}}> {legendMin} </text>
                    <text x={120} y={35} style={{fontSize: '0.7em'}}>{legendMax}</text>


                    {_.map(colorPalette, (color, i) => {
                      return <rect key={i} x={20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                    })} 


                    <text x={0} y={74} style={{fontSize: '0.8em'}}>Low</text>
                    <text x={20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>


                    <rect x={145} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                    <text x={167} y={50} style={{fontSize: '0.7em'}}> None </text>
                    <text x={167} y={59} style={{fontSize: '0.7em'}}> Reported </text>


                    <text x={250} y={49} style={{fontSize: '1em'}}> Click on a county</text>
                    <text x={250} y={65} style={{fontSize: '1em'}}> below for a detailed report. </text>


                  </svg>}
                  <ComposableMap projection="geoAlbersUsa" 
                    projectionConfig={{scale:`${config.scale*0.7}`}} 
                    width={400} 
                    height={500} 
                    strokeWidth = {0.1}
                    stroke = 'black'
                    data-tip=""
                    offsetX={config.offsetX}
                    offsetY={config.offsetY}>
                    <Geographies geography={config.url}>
                      {({geographies}) => geographies.map(geo =>
                        <Geography 
                          key={geo.rsmKey} 
                          geography={geo}  
                          onClick={()=>{
                            if(stateFips !== "_nation"){
                              history.push("/" + stateFips + "/" +geo.properties.COUNTYFP);
                            }
                          }}
                          onMouseEnter={()=>{setDelayHandler(setTimeout(() => {
                            if(stateFips !== "_nation"){
                                setCountyFips(geo.properties.COUNTYFP);
                                setCountyName(fips2county[stateFips + geo.properties.COUNTYFP]);
                                setBarCountyName((fips2county[stateFips + geo.properties.COUNTYFP]).match(/\S+/)[0]);
                              }
                            }, 300))
                            
                          }}
                          onMouseLeave={()=>{
                            if(stateFips !== "_nation"){
                              clearTimeout(delayHandler);

                              setTooltipContent("")
                            }
                          }}
                          
                          fill={(stateFips === "_nation" || stateFips === "72")? "#FFFFFF" :countyFips===geo.properties.COUNTYFP?countyColor:
                              ((colorScale && data[stateFips+geo.properties.COUNTYFP] && (data[stateFips+geo.properties.COUNTYFP][metric]) > 0)?
                                  colorScale[data[stateFips+geo.properties.COUNTYFP][metric]]: 
                                  (colorScale && data[stateFips+geo.properties.COUNTYFP] && data[stateFips+geo.properties.COUNTYFP][metric] === 0)?
                                    '#e1dce2':'#FFFFFF')}
                          />
                      )}
                    </Geographies>
                  </ComposableMap>
                  <Grid>
                    <Grid.Row>
                      <Accordion defaultActiveIndex={1} panels={[
                      {
                          key: 'acquire-dog',
                          title: {
                              content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9"}}>About the data</u>,
                              icon: 'dropdown',
                          },
                          content: {
                              content: (
                                <div>
                                {stateFips !== "_nation" && <Grid.Row style={{width: "420px"}}>
                                    <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "18pt"}}>
                                    <b><em> {varMap[metric].name} </em></b> {varMap[metric].definition} <br/>
                                    For a complete table of variable definition, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                                    <br/><br/>
                                    Data as of: {date}
                                    </text>


                                </Grid.Row>}
                                </div>
                                ),
                              },
                          }
                      ]

                      } />
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
                <Grid.Column style={{padding: 0, paddingLeft: 40, width: 810}}>
                  <Header as='h2' style={{fontWeight: 400, width: 800}}>
                    <Header.Content style={{fontSize: "22px"}}>
                      <b>{stateFips === "_nation" || stateFips === "72"? "Comparing ":countyName ? "Comparing " + countyName: "Loading..."}</b>
                      <Header.Subheader style={{fontWeight: 350, paddingTop: 15, width: 800, fontSize: "14pt", lineHeight: "16pt"}}>
                        The number of cases and deaths due to COVID-19 are dynamic. 
                        Cases are declining in many counties and rising in others. 
                        Trends in the case and death count in the past 14 days are being monitored to 
                        determine whether it is safe to reopen a county.
                        <br/>
                        <br/>
                        {/* <p style={{color: "#024174", fontWeight: 500}}> Click and drag or zoom on the graphs below.</p> */}
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                  <Grid>
                    {stateFips !== "_nation" && 
                    <Grid.Row columns={1} style={{padding: 0, paddingTop: 10, paddingBottom: 0, width: 800}}>
                      <Grid.Column>
                        {/* <Header.Content x={0} y={20} style={{fontSize: '14pt', width: 400, paddingLeft: 15, paddingBottom: 5, fontWeight: 400}}>Average Daily COVID-19 Cases /100K </Header.Content> */}
                        <Dropdown
                          style={{background: '#fff', 
                                  fontSize: "19px",
                                  fontWeight: 400, 
                                  theme: '#000000',
                                  width: '450px',
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
                          text= { selectedTrend? selectedTrend : "Average Daily COVID-19 Cases / 100K"}
                          pointing = 'top'
                          search
                          selection
                          options={trendOptions}
                          onChange={(e, { value}) => {
                            setTrendline(value);
                            setSelectedTrend(trendName[value]);
                            
                                    
                          }}
                        />
                        <div style = {{paddingTop: 10}}>
                          <svg width = "500" height = "40">
                              <rect x = {20} y = {12} width = "12" height = "2" style = {{fill: nationColor, strokeWidth:1, stroke: nationColor}}/>
                              <text x = {35} y = {20} style = {{ fontSize: "12pt"}}> USA</text>
                              <rect x = {87} y = {12} width = "12" height = "2" style = {{fill: stateColor, strokeWidth:1, stroke: stateColor}}/>
                              <text x = {102} y = {20} style = {{ fontSize: "12pt"}}> {stateFips === "_nation" || stateFips === "72"? "":stateName} </text>
                              <rect x = {stateName.length >= 10? 230: 180} y = {12} width = "12" height = "2" style = {{fill: countyColor, strokeWidth:1, stroke: countyColor}}/>
                              <text x = {stateName.length >= 10? 245: 195} y = {20} style = {{ fontSize: "12pt"}}> {stateFips === "_nation" || stateFips === "72"? "": countyName ? countyName: "Loading..."}</text>
                          </svg>
                        </div>
                        <div style = {{width: 1000, height: 180}}>
                          {dataTS && <CaseChart data={dataTS} lineColor={[colorPalette[1]]} stateFips = {stateFips} countyFips = {countyFips}
                                ticks={caseTicks} tickFormatter={caseTickFmt} labelFormatter = {labelTickFmt} var = {trendline}/>
                          }  
                        </div>
                                                
                      </Grid.Column>
                        
                    </Grid.Row>}

                  </Grid>

                  <Header as='h2' style={{width:800, paddingBottom: 10}}>
                    <Header.Content style={{fontSize: "22px", marginTop: 6}}>
                      {stateFips === "_nation" || stateFips === "72"? "":countyName} Population Characteristics
                      <Header.Subheader style={{fontWeight: 350, width: 800, fontSize: "14pt", lineHeight: "16pt", paddingTop: 18}}>
                      Social, economic, health and environmental factors impact an individual’s risk of infection and COVID-19 severity. 
                      Counties with large groups of vulnerable people may be  disproportionately impacted by COVID-19.
                      </Header.Subheader>
                    </Header.Content>

                  </Header>
                  <Grid>
                    <Grid.Row>
                      <BarChart 
                        title="% African American" 
                        var="black" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />
                      <BarChart 
                        title="% Hispanic or Latino" 
                        var="hispanic"  
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />
                      <BarChart 
                        title="% Native American" 
                        var="natives" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />  
                      <BarChart 
                        title="Community Vulnerability Index" 
                        var="ccvi" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />
                    </Grid.Row>
                    <Grid.Row style = {{paddingTop: 15}}>
                      <BarChart 
                        title="Any Condition" 
                        var="anycondition" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />  
                      {/* <BarChart 
                        title="% Diabetes" 
                        var="diabetes" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />  */}
                      <BarChart 
                        title="% in Poverty" 
                        var="poverty"  
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />
                      <BarChart 
                        title="% Uninsured" 
                        var="PCTUI" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />
                      <BarChart 
                        title="% in Group Quarters" 
                        var="groupquater" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />
                        {/* <BarChart 
                          title="% Male" 
                          var="male" 
                          stateFips={stateFips}
                          countyFips={countyFips}
                          countyName={barCountyName}
                          stateName={stateName}
                          data={data} /> */}
                    </Grid.Row>
                    <Grid.Row style={{paddingTop: 0, paddingBottom: 25, paddingLeft: 15}}>
                      <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "16pt"}}>
                      *The state and national level measure of any chronic condition prevalence (per 100K) is computed with the average of all the counties and states.
                      <br/>
                      *The national level measure of COVID-19 Community Vulnerability Index is computed with the average of all the states.

                      </text>
                    </Grid.Row>
                  </Grid>
                  
                </Grid.Column>
                <Grid.Row>
                  
                </Grid.Row>

              </Grid.Row>            
            </Grid>
            
            </div>
          }
          <Notes />
        </Container>
      {stateFips !== "_nation" && 
        <ReactTooltip offset = {{top: 40}}> 
          <font size="+1"> 
            <b> {countyName} </b> 
          </font> 
          <br/> 
          Click for a detailed report. 
        
        </ReactTooltip>}
    </div>
  </HEProvider>
    );
  } else{
    return <Loader active inline='centered' />
  }




}