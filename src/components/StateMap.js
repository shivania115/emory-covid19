import React, { useEffect, useState } from 'react'
import { Container, Dropdown, Grid, Breadcrumb, Header, Loader, Divider} from 'semantic-ui-react'
import Slider from '@material-ui/core/Slider';
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
  VictoryZoomContainer
} from 'victory';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _, { toArray } from 'lodash';
import { scaleQuantile } from "d3-scale";
import fips2county from './fips2county.json'
import stateOptions from "./stateOptions.json";
import configs from "./state_config.json";



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

const marks = [
  //{value: 1, label: 'Jan.'}, {value: 2, abel: 'Feb.'}, {value: 3, abel: 'Mar.'}, 
  {value: 4, abel: 'Apr.'},
  {value: 5, label: 'May'}, {value: 6, abel: 'Jun.'}, {value: 7, abel: 'Jul.'}, {value: 8, abel: 'Aug.'},
  {value: 9, label: 'Sep.'},//, {value: 10, abel: 'Oct.'}, {value: 11, abel: 'Nov.'}, {value: 12, abel: 'Dec.'},
  
];


function BarChart(props) {
  let colors = {"USA": nationColor, 
                  stateName: stateColor, 
                  "County": countyColor};
  if (props.stateFips !== "_nation") {
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
        data={[{key: 'USA', 'value': props.data['_nation'][props.var] || 0}]}
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

export default function StateMap(props) {
  
  const history = useHistory();
  let {stateFips} = useParams();
  const [tooltipContent, setTooltipContent] = useState('');

  const [data, setData] = useState();
  const [dataTS, setDataTS] = useState();
  const [raceData, setRaceData] = useState();

  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyFips, setCountyFips] = useState('');
  const [countyName, setCountyName] = useState('{County}');
  const [barCountyName, setBarCountyName] = useState('{County}');
  
  const [colorScale, setColorScale] = useState();
  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [caseRate, setCaseRate] = useState();
  const [percentChangeCases, setPercentChangeCases] = useState();
  const [mortality, setMortality] = useState();
  const [percentChangeMortality, setPercentChangeMortality] = useState();
  const [pctPositive, setPctPositive] = useState();
  const [pctBedsOccupied, setPctBedsOccupied] = useState();
  const [index, setIndex] = useState();
  const [indexP, setIndexP] = useState();

  const [varMap, setVarMap] = useState({});
  const [metric, setMetric] = useState('mean7daycases');
  const [metricOptions, setMetricOptions] = useState('mean7daycases');
  const [metricName, setMetricName] = useState('Average Daily COVID-19 Cases');
  const [covidMetric, setCovidMetric] = useState({t: 'n/a'});
  const [countyOption, setCountyOption] = useState();

  const [delayHandler, setDelayHandler] = useState();
  const [temp, setTemp] = useState();
  

  useEffect(()=>{
    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        setMetricOptions(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.variable, text: d.name, group: d.group};
        }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
      });
  }, []);

  useEffect(()=>{
    fetch('/data/rawdata/f2c.json').then(res => res.json())
      .then(x => {
        setCountyOption(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.value, text: d.text, group: d.state};
        }), d => (d.group === stateFips && d.text !== "Augusta-Richmond County consolidated government" && d.text !== "Wrangell city and borough")));
      });
  }, []);

  useEffect(()=>{
    fetch('/data/racedataAll.json').then(res => res.json())
      .then(x => {
        setRaceData(x);
        setTemp(x[stateFips]);
      });

  }, []);


  useEffect(()=>{
    if (metric) {

    
    const configMatched = configs.find(s => s.fips === stateFips);

    if (!configMatched){
      history.push('/_nation');
    }else{

      setConfig(configMatched);

      setStateName(configMatched.name);

      fetch('/data/data.json').then(res => res.json())
        .then(x => {
          setData(x);

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

          setColorScale(scaleMap);
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
            setLegendMax(max);
          }else{
            setLegendMax(max.toFixed(0));

          }
          setLegendMin(min.toFixed(0));

          var split = scaleQuantile()
          .domain(_.map(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[metric] > 0 &&
                d.fips.length === 5)),
            d=> d[metric]))
          .range(colorPalette);

          setLegendSplit(split.quantiles());
        });
      
      fetch('/data/timeseries'+stateFips+'.json').then(res => res.json())
        .then(x => {

          let countyMost = '';
          let covidmortality7dayfig = 0;
          let caseRate = 0;
          let mortality = 0;
          let percentChangeCase = 0;
          let percentChangeMortality = 0;
          let index = 0;
          let indexP = 0;
          let percentBedsOccupied = 0;

          let percentPositive = 0;

          _.each(x, (v, k)=>{

            if (k.length===5 && v.length > 0 && v[v.length-1].covidmortality7dayfig > covidmortality7dayfig){
              countyMost = k.substring(2, 5);
              covidmortality7dayfig = v[v.length-1].covidmortality7dayfig;
            }
            if (k.length===2 || stateFips === "_nation"){
              percentChangeCase = v[v.length-1].percent14dayDailyCases;
              if(stateFips === "_nation"){
                caseRate = 0;
              }else{
                caseRate = v[v.length-1].dailyCases;
              }
              

              percentChangeMortality = v[v.length-1].percent14dayDailyDeaths;
              if(stateFips === "_nation"){
                mortality = 0;
              }else{
                mortality = v[v.length-1].dailyMortality;
              }

              percentPositive = v[v.length-1].percentPositive;

              if(v[v.length-1].pctBedsOccupied === 0){
                for (var i = v.length - 1; i >= 0; i--) {
                  if (v[i].pctBedsOccupied === 0){

                }else{
                  percentBedsOccupied = v[i].pctBedsOccupied;
                  i = 0;
                }
              }
              

            }

              if((k.length===2 || stateFips === "_nation") && v[v.length-1].pctBedsOccupied === 0){
                for (var i = v.length - 1; i >= 0; i--) {
                  if (i ===0 ){
                    index = 1;
                    percentBedsOccupied = "None Reported";
                  }else if (v[i].pctBedsOccupied === 0){
                  }else{
                    index = v.length - i;
                    percentBedsOccupied = v[i].pctBedsOccupied;
                    i = 0;
                  }
                }
              }

              if(k.length===2 || stateFips === "_nation" && v[v.length-1].percentPositive === 0){
                for (var i = v.length - 1; i >= 0; i--) {
                  if (i ===0 ){
                    indexP = 1;
                    percentPositive = v[v.length-1].percentPositive;
                  }else if (v[i].percentPositive === 0){
                  }else{
                    indexP = v.length - i;
                    percentPositive = v[i].percentPositive;
                    i = 0;
                  }
                }
              }
            }

          });



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

          setPctPositive(percentPositive.toFixed(0) + "%");
          setIndexP(indexP);

          if(typeof percentBedsOccupied === "string"){
            setPctBedsOccupied(percentBedsOccupied);
          }else{
            setPctBedsOccupied(percentBedsOccupied.toFixed(0) + "%");
          }
            
          setIndex(index);

          setCaseRate(numberWithCommas(caseRate.toFixed(0)));
          setMortality(numberWithCommas(mortality.toFixed(0)));

          setCountyFips(countyMost);

          if(stateFips !== "_nation"){
            setCountyName(fips2county[stateFips+countyMost]);
            setBarCountyName((fips2county[stateFips+countyMost]).match(/\S+/)[0]);

          }
          
          

          setDataTS(x);
        });

      

            }
          }
  }, [metric]);

  useEffect(() => {
    if (dataTS && dataTS[stateFips]){
      setCovidMetric(_.takeRight(dataTS[stateFips])[0]);
    }
  }, [dataTS]);


  if (data && dataTS && metric) {
    console.log(caseRate);
  return (
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

                      <Dropdown
                        style={{background: '#fff', 
                                fontSize: "14pt",
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

                    <Dropdown
                        style={{background: '#fff', 
                                fontSize: "14pt",
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

                        
                      />
                      

          { 
              <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '22pt', paddingTop: 40, paddingBottom: 25}}> Covid-19 Outcomes in {stateName} </Divider>
          }

          { 

          <Grid columns={15}>

          <Grid.Row columns={5} style={{width: 252, paddingRight: 0, paddingTop: '2em', paddingBottom: "0"}}>
            <Grid.Column style = {{width:235}}> 
              <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> Daily Cases</center>

              <div style = {{width: 235, background: "#e5f2f7"}}>
                <VictoryChart 
                            minDomain={{ x: dataTS[stateFips][dataTS[stateFips].length-15].t}}
                            maxDomain = {{y: getMaxRange(dataTS[stateFips], "caseRateMean", dataTS[stateFips].length-15)*1.2}}                            
                            width={235}
                            height={180}    
                            parent= {{background: "#ccdee8"}}   
                            padding={{marginleft: 0, right: -1, top: 150, bottom: -0.9}}
                            containerComponent={<VictoryContainer responsive={false}/>}>
                            
                            <VictoryAxis
                              tickValues={[
                                dataTS[stateFips][dataTS[stateFips].length - Math.round(dataTS[stateFips].length/3)*2 - 1].t,
                                dataTS[stateFips][dataTS[stateFips].length - Math.round(dataTS[stateFips].length/3) - 1].t,
                                dataTS[stateFips][dataTS[stateFips].length-1].t]}                        
                              style={{grid:{background: "#ccdee8"}, tickLabels: {background: "#ccdee8", fontSize: 10}}} 
                              tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                            
                            <VictoryGroup 
                              colorScale={[stateColor]}
                            >

                            <VictoryLine data={dataTS[stateFips] && stateFips !== "_nation"? dataTS[stateFips] : 0}
                                x='t' y='caseRateMean'
                                />

                            </VictoryGroup>
                            <VictoryArea
                              style={{ data: {fill: "#080808" , fillOpacity: 0.1} }}
                              data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                              x= 't' y = 'caseRateMean'

                            />

                            <VictoryLabel text= {stateFips === "_nation" ? 0 : caseRate} x={115} y={60} textAnchor="middle" style={{fontSize: 50, fontFamily: 'lato'}}/>
                            <VictoryLabel text= {stateFips === "_nation" ? "" : percentChangeCases}  x={115} y={115} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>
                            <VictoryLabel text= {stateFips === "_nation" ? "" : "14-day"}  x={180} y={110} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>
                            <VictoryLabel text= {stateFips === "_nation" ? "" : "change"}  x={180} y={120} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>

                            
                </VictoryChart>
              </div>
            </Grid.Column>
            <Grid.Column style = {{width:235}}> 
              <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> Daily Deaths</center>
              <div style = {{width: 235, background: "#e5f2f7"}}>

                <VictoryChart theme={VictoryTheme.material}
                            minDomain={{ x: dataTS[stateFips][dataTS[stateFips].length-15].t }}
                            maxDomain = {{y: getMaxRange(dataTS[stateFips], "mortalityMean", dataTS[stateFips].length-15)*3}}                            
                            width={235}
                            height={180}       
                            padding={{left: 0, right: -1, top: 130, bottom: -0.9}}
                            containerComponent={<VictoryContainer responsive={false}/>}>
                            
                            <VictoryAxis
                              tickValues={[
                                dataTS[stateFips][dataTS[stateFips].length - Math.round(dataTS[stateFips].length/3)*2 - 1].t,
                                dataTS[stateFips][dataTS[stateFips].length - Math.round(dataTS[stateFips].length/3) - 1].t,
                                dataTS[stateFips][dataTS[stateFips].length-1].t]}                        
                              style={{tickLabels: {fontSize: 10}}} 
                              tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                            
                            <VictoryGroup 
                              colorScale={[stateColor]}
                            >

                              <VictoryLine data={dataTS[stateFips] && stateFips !== "_nation"? dataTS[stateFips] : 0}
                                x='t' y='mortalityMean'
                                />

                            </VictoryGroup>

                            <VictoryArea
                              style={{ data: { fill: "#080808", fillOpacity: 0.1} }}
                              data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                              x= 't' y = 'mortalityMean'

                            />
                            <VictoryLabel text= {stateFips === "_nation" ? 0 : mortality} x={115} y={60} textAnchor="middle" style={{fontSize: 50, fontFamily: 'lato'}}/>
                            <VictoryLabel text= {stateFips === "_nation" ? "" : percentChangeMortality} x={115} y={115} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>
                            <VictoryLabel text= {stateFips === "_nation" ? "" : "14-day"}  x={180} y={110} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>
                            <VictoryLabel text= {stateFips === "_nation" ? "" : "change"}  x={180} y={120} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>

                </VictoryChart>
              </div>
            </Grid.Column>
            <Grid.Column style = {{width:235}}>
              <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> Percent Occupied Beds</center>
              <div style = {{width: 235, background: "#e5f2f7"}}>
              <VictoryChart theme={VictoryTheme.material}
                            minDomain={{ x: dataTS[stateFips][dataTS[stateFips].length-(index+15)].t }}
                            maxDomain={{ x: dataTS[stateFips][dataTS[stateFips].length-index].t , y: getMax(dataTS[stateFips], "pctBedsOccupied")*1.1}}
                            width={235}
                            height={180}       
                            padding={{left: 0, right: -1, top: 150, bottom: -0.9}}
                            containerComponent={<VictoryContainer responsive={false}/>}>
                            
                            <VictoryAxis
                              tickValues={[
                                dataTS[stateFips][dataTS[stateFips].length-(index+15)].t,
                                dataTS[stateFips][dataTS[stateFips].length-(index+10)].t,
                                dataTS[stateFips][dataTS[stateFips].length-(index+5)].t,
                                dataTS[stateFips][dataTS[stateFips].length-(index)].t]}                
                              style={{tickLabels: {fontSize: 10}}} 
                              tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                            
                            <VictoryGroup 
                              colorScale={[stateColor]}
                            >

                              <VictoryLine data={dataTS[stateFips] ? dataTS[stateFips] : dataTS["_"]}
                                x='t' y='pctBedsOccupied'
                                />

                            </VictoryGroup>

                            <VictoryArea
                              style={{ data: { fill: "#080808", fillOpacity: 0.1} }}
                              data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                              x= 't' y = 'pctBedsOccupied'

                            />
                            <VictoryLabel text= {stateFips === "_nation" ? 0 :pctBedsOccupied} x={115} y={60} textAnchor="middle" style={{fontSize: (pctBedsOccupied === "None Reported" && stateFips !== "_nation")? 30: 50, fontFamily: 'lato'}}/>

                </VictoryChart>
              </div>
            </Grid.Column>
            <Grid.Column style = {{width:235}}>
              <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> Percent Tested Positive</center>
              <div style = {{width: 235, background: "#e5f2f7"}}>
                <VictoryChart theme={VictoryTheme.material}
                            minDomain={{ x: dataTS[stateFips][dataTS[stateFips].length-(indexP + 15)].t }}
                            maxDomain = {{x: dataTS[stateFips][dataTS[stateFips].length-indexP].t, y: getMaxRange(dataTS[stateFips], "positive", dataTS[stateFips].length-15)*1.05}}
                            width={235}
                            height={180}       
                            padding={{left: 0, right: -1, top: 150, bottom: -0.9}}
                            containerComponent={<VictoryContainer responsive={false}/>}>

                            
                            <VictoryAxis
                              tickValues={[
                                dataTS[stateFips][dataTS[stateFips].length-(indexP + 15)].t,
                                dataTS[stateFips][dataTS[stateFips].length-(indexP + 10)].t,
                                dataTS[stateFips][dataTS[stateFips].length-(indexP + 5)].t,
                                dataTS[stateFips][dataTS[stateFips].length-(indexP)].t]}                        
                              style={{tickLabels: {fontSize: 10}}} 
                              tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                            
                            <VictoryGroup 
                              colorScale={[stateColor]}
                            >

                              <VictoryLine data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                                x='t' y='positive'
                                />

                            </VictoryGroup>

                            <VictoryArea
                              style={{ data: { fill: "#080808", fillOpacity: 0.1} }}
                              data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                              x= 't' y = 'positive'

                            />
                            <VictoryLabel text= {stateFips === "_nation" ? 0 :pctPositive} x={115} y={60} textAnchor="middle" style={{fontSize: 50, fontFamily: 'lato'}}/>

                </VictoryChart>
              </div>
            </Grid.Column>
            <Grid.Column rows = {2} style = {{width:235}}>

              {stateFips === "_nation" && 
                <center style = {{ fontSize: "15pt", fontFamily: "lato", paddingBottom: 5, width: 238}}> Deaths by Race & Ethnicity</center>


              }
              {stateFips !== "_nation" && stateFips !== "72" &&
              <center style = {{ fontSize: "15pt", fontFamily: "lato", paddingBottom: 5, width: 238}}> Deaths by {(!!raceData[stateFips]["White Alone"] ||
                                                                                                      !!raceData[stateFips]["Asian Alone"] ||
                                                                                                      !!raceData[stateFips]["African American Alone"] ||
                                                                                                      !!raceData[stateFips]["American Natives Alone"]
                                                                                                      && !raceData[stateFips]["Hispanic"]? "Race" : "Race & Ethnicity")}</center>
               }
              {stateFips === "38" &&
                <div style = {{background: "#e5f2f7", paddingBottom: 61}}> <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> <br/> <br/> <br/> <br/> None Reported <br/>  <br/> </center></div>
              }

              {stateFips === "02" &&
                <div style = {{background: "#e5f2f7", paddingBottom: 13}}> <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> <br/> <br/> <br/>None Reported <br/>  <br/> </center></div>
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
                                      <VictoryAxis dependentAxis style={{ticks:{stroke: "#e5f2f7"}, axis: {stroke: "#000000"},grid: {stroke: "transparent"}, axis: {labels: {fill: '#000000'}}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
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
                        </VictoryChart>
                      }
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
                                      <VictoryAxis dependentAxis style={{ticks:{stroke: "#e5f2f7"}, axis: {stroke: "#000000"},grid: {stroke: "transparent"}, axis: {labels: {fill: '#000000'}}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                      
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
                                

                        </VictoryChart>
                     }
                </Grid.Row>
              </div>
            </Grid.Column>
            </Grid.Row>

            <Grid.Row columns = {5} style={{paddingBottom: 0, paddingTop: 10, paddingLeft: 15, paddingRight: 0}}>
              
                <Grid.Column style={{padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <text style={{fontWeight: 300, fontSize: "14pt"}}>
                    Daily new COVID-19 cases <br/>
                    (7-day rolling average) <br/><br/><br/>
                    <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target = "_blank" rel="noopener noreferrer"> New York Times </a> <br/>
                    </text>
                </Grid.Column>
                <Grid.Column style={{left: 3, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <text style={{fontWeight: 300, fontSize: "14pt"}}>
                    Daily new COVID-19 deaths 
                    (7-day rolling average) <br/><br/><br/>
                    <i>Data source</i>:<a style ={{color: "#397AB9"}} href = "https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target = "_blank" rel="noopener noreferrer"> New York Times </a> <br/>
                    </text>
                </Grid.Column>
                <Grid.Column style={{left: 4, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <text style={{fontWeight: 300, fontSize: "14pt"}}>
                    Percentage of inpatient
                    beds occupied by COVID-19 patients. <br/><br/>
                    <i>Data source</i>:  <a style ={{color: "#397AB9"}} href = "https://www.cdc.gov/nhsn/datastat/index.html" target = "_blank" rel="noopener noreferrer">CDC's NHSN </a><br/>
                    </text>
                </Grid.Column>
                <Grid.Column style={{left: 9, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <text style={{fontWeight: 300, fontSize: "14pt"}}>
                    Percentage of total tests for
                    COVID-19 that resulted in a positive result. <br/><br/>
                    <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a> <br/>
                    </text>
                </Grid.Column>
                <Grid.Column style={{left: 12, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <text style={{fontWeight: 300, fontSize: "14pt"}}>
                    Distribution of deaths per 100,000 persons. 
                    <br/><br/><br/>
                    <i>Data source</i>: <a style ={{color: "#397AB9"}} href="https://covidtracking.com/race" target="_blank" rel="noopener noreferrer"> The COVID Racial Data Tracker </a> <br/> 

                    </text>
                </Grid.Column>
              
            </Grid.Row>

            {stateFips !== "_nation" && stateFips === "38" &&
            <Grid.Row style={{paddingTop: 20, paddingBottom: 50, paddingLeft: 15}}>
                    <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "16pt"}}>
                      Percent Occupied Beds updated on 07/07/2020.
                      <br/>
                      {stateName} is not reporting deaths by race or ethnicity.
                    </text>
            </Grid.Row>
            }
                     
            {stateFips !== "_nation" && stateFips !== "38" &&
            <Grid.Row style={{paddingTop: 20, paddingBottom: 50, paddingLeft: 15}}>
                    <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "16pt"}}>
                      Percent Occupied Beds updated on 07/07/2020.
                      <br/>
                      {stateName} reports distribution of deaths across non-Hispanic race categories, with {!!raceData[stateFips]["Race Missing"]? raceData[stateFips]["Race Missing"][0]["percentRaceDeaths"] + "%":!!raceData[stateFips]["Ethnicity Missing"]? raceData[stateFips]["Ethnicity Missing"][0]["percentEthnicityDeaths"] + "%" : !!raceData[stateFips]["Race & Ethnicity Missing"]? raceData[stateFips]["Race & Ethnicity Missing"][0]["percentRaceEthnicityDeaths"] + "%": "na%"} of deaths of known {!!raceData[stateFips]["Race Missing"]? "race" :!!raceData[stateFips]["Ethnicity Missing"]? "ethnicity" : !!raceData[stateFips]["Race & Ethnicity Missing"]? "race & ethnicity": "race & ethnicity"}. Here we only show race categories that constitute at least 1% of the state population and have 30 or more deaths.
                    </text>
            </Grid.Row>
            }

          </Grid>
        }
        { 
          <span style={{color: '#73777B', fontSize: "14pt"}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>
        }

        { 
         <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '22pt', paddingTop: 37, paddingBottom: 35}}> COVID-19 County Outcomes </Divider>
          
        }
        { 
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={5}>

                <Dropdown

                        style={{background: '#fff', 
                                fontSize: "19px",
                                fontWeight: 400, 
                                theme: '#000000',
                                width: '410px',
                                top: '0px',
                                left: '0px',
                                text: "Select",
                                borderTop: 'none',
                                borderLeft: '1px solid #FFFFFF',
                                borderRight: 'none', 
                                borderBottom: '0.5px solid #bdbfc1',
                                borderRadius: 0,
                                minHeight: '1.0em',
                                paddingBottom: '0.5em',
                                paddingRight: 0}}
                        text= {metricName}
                        search
                        pointing = 'top'
                        options={metricOptions}
                        onChange={(e, { value }) => {
                          setMetric(value);
                          setMetricName(varMap[value]['name']);
                        }}

                        
                      />
                
                <svg width="400" height="90">
                  
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


                  <text x={250} y={49} style={{fontSize: '0.7em'}}> Click on a county</text>
                  <text x={250} y={59} style={{fontSize: '0.7em'}}> below for a detailed report. </text>


                </svg>
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

                <Grid.Row style={{paddingTop: "65px", width: "420px"}}>
                    <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "18pt"}}>
                    <b><em> {varMap[metric].name} </em></b> {varMap[metric].definition} <br/>
                    For a complete table of variable definition, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                    </text>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column width={6} style={{padding: 0, paddingLeft: 40}}>
                <Header as='h2' style={{fontWeight: 400, width: 410}}>
                  <Header.Content style={{fontSize: 20}}>
                    Comparing <b>{stateFips === "_nation" || stateFips === "72"? "":countyName}</b>
                    <Header.Subheader style={{fontWeight: 350, paddingTop: 15, width: 410, fontSize: "14pt", lineHeight: "16pt"}}>
                      The number of cases and deaths due to COVID-19 are dynamic. 
                      Cases are declining in many counties and rising in others. 
                      Trends in the case and death count in the past 14 days are being monitored to 
                      determine whether it is safe to reopen a county.
                      <br/>
                      <br/>
                      <p style={{color: "#024174", fontWeight: 500}}> Click and drag or zoom on the graphs below.</p>
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <Grid>
                  {stateFips !== "_nation" && 
                  <Grid.Row columns={1} style={{padding: 0, paddingTop: 19, paddingBottom: 0}}>
                     <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 15, paddingBottom: 5, fontWeight: 400}}>Average Daily COVID-19 Cases /100,000 </text>

                      <svg width = "370" height = "40">
                          <rect x = {20} y = {12} width = "12" height = "2" style = {{fill: nationColor, strokeWidth:1, stroke: nationColor}}/>
                          <text x = {35} y = {20} style = {{ fontSize: "12pt"}}> USA</text>
                          <rect x = {87} y = {12} width = "12" height = "2" style = {{fill: stateColor, strokeWidth:1, stroke: stateColor}}/>
                          <text x = {102} y = {20} style = {{ fontSize: "12pt"}}> {stateFips === "_nation" || stateFips === "72"? "":stateName} </text>
                          <rect x = {stateName.length > 10? 230: 180} y = {12} width = "12" height = "2" style = {{fill: countyColor, strokeWidth:1, stroke: countyColor}}/>
                          <text x = {stateName.length > 10? 245: 195} y = {20} style = {{ fontSize: "12pt"}}> {stateFips === "_nation" || stateFips === "72"? "":countyName}</text>
                      </svg>

                      <VictoryChart theme={VictoryTheme.material} minDomain={{ y: 0 }}
                        width={330}
                        height={160}       
                        padding={{left: 50, right: 60, top: 10, bottom: 30}}
                        minDomain ={{x: dataTS["_nation"][0].t}}
                        maxDomain = {{x: dataTS["_nation"][dataTS["_nation"].length-1].t}}
                        containerComponent={<VictoryZoomContainer zoomDomain={{x: [
                          dataTS["_nation"][92].t,
                          dataTS["_nation"][dataTS["_nation"].length-1].t]}} flyoutStyle={{fill: "white"}}/> }
                        >
                        
                        <VictoryAxis tickCount={4}
                               
                          style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: 14, fontFamily: 'lato'}}} 
                          tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                         style={{ticks: {stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "#000000", fill: "#000000", fillOpacity: 1}, tickLabels: {fill: "#000000", fontSize: 14, padding: 1}}} 
                          tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                          />
                        <VictoryGroup 
                          colorScale={[nationColor, stateColor, countyColor]}
                        >
                          <VictoryLine data={dataTS["_nation"]}
                            x='t' y='caserate7dayfig'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.caserate7dayfig.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: 14}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              
                              data: {strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                          <VictoryLine data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='caserate7dayfig'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.caserate7dayfig.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: 14}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: {strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                          <VictoryLine data={dataTS[stateFips+countyFips] && (stateFips !== "_nation")?dataTS[stateFips+countyFips]:dataTS["99999"]}
                            x='t' y='caserate7dayfig'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.caserate7dayfig.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: 14}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: {strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                        </VictoryGroup>
                      </VictoryChart>
                      
                  </Grid.Row>}

                  {stateFips !== "_nation" &&
                  <Grid.Row columns={1} style={{padding: 0, paddingTop: 30, paddingBottom: 0}}>
                      <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 15, paddingTop: 10, paddingBottom: 10, fontWeight: 400}}>Average Daily COVID-19 Deaths /100,000 </text>

                      <svg width = "370" height = "40">
                          <rect x = {20} y = {12} width = "12" height = "2" style = {{fill: nationColor, strokeWidth:1, stroke: nationColor}}/>
                          <text x = {35} y = {20} style = {{ fontSize: "12pt"}}> USA</text>
                          <rect x = {87} y = {12} width = "12" height = "2" style = {{fill: stateColor, strokeWidth:1, stroke: stateColor}}/>
                        
                          <text x = {102} y = {20} style = {{ fontSize: "12pt"}}> {stateFips === "_nation" || stateFips === "72"? "":stateName} </text>
                          <rect x = {stateName.length > 10? 230: 180} y = {12} width = "12" height = "2" style = {{fill: countyColor, strokeWidth:1, stroke: countyColor}}/>
                          <text x = {stateName.length > 10? 245: 195} y = {20} style = {{ fontSize: "12pt"}}> {stateFips === "_nation" || stateFips === "72"? "":countyName}</text>
                      </svg>

                      <VictoryChart theme={VictoryTheme.material} minDomain={{ y: 0 }}
                        width={330}
                        height={170}       
                        padding={{left: 50, right: 60, top: 10, bottom: 30}}
                        minDomain ={{x: dataTS["_nation"][0].t}}
                        containerComponent={<VictoryZoomContainer zoomDomain={{x: [
                          dataTS["_nation"][92].t,
                          dataTS["_nation"][dataTS["_nation"].length-1].t]}} flyoutStyle={{fill: "white"}}/> }
                        >
                        <VictoryAxis tickCount={4}
                          
                          style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: 14, fontFamily: 'lato'}}} 
                          tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                         style={{ticks: {stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "#000000", fill: "#000000", fillOpacity: 1}, tickLabels: {fill: "#000000", fontSize: 14, padding: 1}}} 
                         tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                          />
                        <VictoryGroup 
                          colorScale={[nationColor, stateColor, countyColor]}
                        >
                          <VictoryLine data={dataTS["_nation"]}
                            x='t' y='covidmortality7dayfig'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.covidmortality7dayfig.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: 14}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                          <VictoryLine data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='covidmortality7dayfig'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.covidmortality7dayfig.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: 14}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                          <VictoryLine data={dataTS[stateFips+countyFips] && (stateFips !== "_nation")?dataTS[stateFips+countyFips]:dataTS["99999"]}
                            x='t' y='covidmortality7dayfig'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.covidmortality7dayfig.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: 14}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                        </VictoryGroup>
                      </VictoryChart>
                  </Grid.Row>}
                </Grid>
              </Grid.Column>
              <Grid.Column width={5} style={{padding: 0, paddingLeft: 0}}>
                <Header as='h2' style={{width:410, paddingLeft: 0}}>
                  <Header.Content style={{fontSize: "14pt", lineHeight: "16pt", marginTop: 6}}>
                    {stateFips === "_nation" || stateFips === "72"? "":barCountyName} Population Characteristics
                    <Header.Subheader style={{fontWeight: 350, width: 390, fontSize: "14pt", lineHeight: "16pt", paddingTop: 18}}>
                    Social, economic, health and environmental factors impact an individual’s risk of infection and COVID-19 severity. 
                    Counties with large groups of vulnerable people may be  disproportionately impacted by COVID-19.
                    </Header.Subheader>
                  </Header.Content>

                </Header>
                <Grid>
                  <Grid.Row columns={2} style={{padding: 20, width: 410, paddingBottom: 20}}>                    
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
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 20, width: 410, paddingBottom: 20}}>
                      <BarChart 
                        title="% Native American" 
                        var="natives" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />  
                      <BarChart 
                        title="% Over 65 y/o" 
                        var="age65over" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 20, width: 410, paddingBottom: 20}}>
                      <BarChart 
                        title="% Obese" 
                        var="obesity" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />  
                      <BarChart 
                        title="% Diabetes" 
                        var="diabetes" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} /> 
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 20, width: 410, paddingBottom: 20}}>                    
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
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 20, width: 410}}>                    
                      <BarChart 
                        title="% in Group Quarters" 
                        var="groupquater" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />
                      <BarChart 
                        title="% Male" 
                        var="male" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={barCountyName}
                        stateName={stateName}
                        data={data} />
                  </Grid.Row>
                </Grid>
              </Grid.Column>

            </Grid.Row>  
            <span style={{color: '#73777B', fontSize: "14pt", paddingBottom: 40}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>
          
          </Grid>
          } 
          </div>
        }
        <Notes />
      </Container>
      {stateFips !== "_nation" && <ReactTooltip> <font size="+1"> <b> {countyName} </b> </font> <br/> Click for a detailed report. </ReactTooltip>}
    </div>
    );
  } else{
    return <Loader active inline='centered' />
  }




}