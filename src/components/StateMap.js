import React, { useEffect, useState } from 'react'
import { Container, Dropdown, Grid, Breadcrumb, Header, Loader, Divider} from 'semantic-ui-react'
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
  VictoryLegend,
  VictoryLine,
  VictoryLabel,
  VictoryArea,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";
import fips2county from './fips2county.json'
import stateOptions from "./stateOptions.json";



import configs from "./state_config.json";

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

const nationName = "USA";



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
  };

  
}

export default function StateMap(props) {

  let {stateFips} = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyFips, setCountyFips] = useState('');
  const [countyName, setCountyName] = useState('{County}');
  const [barCountyName, setBarCountyName] = useState('{County}');
  const history = useHistory();
  const [data, setData] = useState();
  const [dataTS, setDataTS] = useState();
  const [dataRD, setDataRD] = useState();
  const [colorScale, setColorScale] = useState();
  const [tooltipContent, setTooltipContent] = useState('');

  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [caseRate, setCaseRate] = useState();
  const [percentChangeCases, setPercentChangeCases] = useState();

  const [mortality, setMortality] = useState();
  const [percentChangeMortality, setPercentChangeMortality] = useState();

  const [dataHospTestTS, setDataHospTestTS] = useState();
  const [positive, setPositive] = useState();
  const [pctPositive, setPctPositive] = useState();
  const [pctBedsOccupied, setPctBedsOccupied] = useState();
  const [time, setTime] = useState();
  const [index, setIndex] = useState();


  const [metric, setMetric] = useState('mean7daycases');
  const [metricOptions, setMetricOptions] = useState('mean7daycases');
  const [metricName, setMetricName] = useState('Average Daily COVID-19 Cases');

  const [varMap, setVarMap] = useState({});
  const [delayHandler, setDelayHandler] = useState();

  const [covidMetric, setCovidMetric] = useState({t: 'n/a'});

  const [countyMap, setCountyMap] = useState({});
  const [countyOption, setCountyOption] = useState();


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
        setCountyMap(x);
        setCountyOption(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.value, text: d.text, group: d.state};
        }), d => (d.group === stateFips && d.text !== "Augusta-Richmond County consolidated government" && d.text !== "Wrangell city and borough")));
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
                d[metric] >= 0 &&
                d.fips.length === 5)),
            d=> d[metric]))
          .range(colorPalette);

          let scaleMap = {}
          _.each(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[metric] >= 0 &&
                d.fips.length === 5))
                , d=>{
            scaleMap[d[metric]] = cs(d[metric])});

          setColorScale(scaleMap);
          var max = 0
          var min = 100
          _.each(x, d=> { 
            if (d[metric] > max && d.fips.length === 5) {
              max = d[metric]
            } else if (d.fips.length === 5 && d[metric] < min && d[metric] >= 0){
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
                d[metric] >= 0 &&
                d.fips.length === 5)),
            d=> d[metric]))
          .range(colorPalette);

          setLegendSplit(split.quantiles());
        });
      
      fetch('/data/timeseries'+stateFips+'.json').then(res => res.json())
        .then(x => {

          let countyMost = '';
          let covidmortality7dayfig = 0;
          let caseRate = 0.1;
          let mortality = 0;
          let jstime = 0;
          let percentChangeCase = 0;
          let percentChangeMortality = 0;
          let index = 0;
          let percentBedsOccupied = 0;

          let positive = 0.1;
          let percentPositive = 0;

          _.each(x, (v, k)=>{

            if (k.length===5 && v.length > 0 && v[v.length-1].covidmortality7dayfig > covidmortality7dayfig){
              countyMost = k.substring(2, 5);
              covidmortality7dayfig = v[v.length-1].covidmortality7dayfig;
            }
            if (k.length===2 && v.length > 0){
              percentChangeCase = v[v.length-1].percent14dayDailyCases;
              caseRate = v[v.length-1].caseRateMean;

              percentChangeMortality = v[v.length-1].percent14dayDailyDeaths;
              mortality = v[v.length-1].mortalityMean;

              positive = v[v.length-1].positive;
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

              if(k.length===2 && v[v.length-1].pctBedsOccupied === 0){
                for (var i = v.length - 1; i >= 0; i--) {
                  if (i ===0 ){
                    index = 1;
                    jstime = v[v.length-1].t;
                    percentBedsOccupied = v[v.length-1].pctBedsOccupied;
                  }else if (v[i].pctBedsOccupied === 0){
                  }else{
                    index = v.length - i;
                    jstime = v[i].t;
                    percentBedsOccupied = v[i].pctBedsOccupied;
                    i = 0;
                  }
                }
              }
            }

          });
          _.each(x, (v, k)=>{
            
          });



          if (percentChangeCase.toFixed(0) > 0){
            setPercentChangeCases("+" + percentChangeCase.toFixed(0) + "%");
          }else{
            setPercentChangeCases(percentChangeCase.toFixed(0) + "%");
          }
          if (percentChangeMortality.toFixed(0) > 0){
            setPercentChangeMortality("+" + percentChangeMortality.toFixed(0) + "%");
          }else{
            setPercentChangeMortality(percentChangeMortality.toFixed(0) + "%");
          }

          setPctPositive(percentPositive.toFixed(0) + "%");
          setPctBedsOccupied(percentBedsOccupied.toFixed(0) + "%");
          setTime(monthNames[new Date(jstime*1000).getMonth()] + " " +  new Date(jstime*1000).getDate());
          setIndex(index);

          setCaseRate(numberWithCommas(caseRate.toFixed(0)));
          setMortality(numberWithCommas(mortality.toFixed(0)));

          setPositive(numberWithCommas(positive.toFixed(0)))

          setCountyFips(countyMost);

          if(stateFips !== "_nation"){
            setCountyName(fips2county[stateFips+countyMost]);
            setBarCountyName((fips2county[stateFips+countyMost]).match(/\S+/)[0]);

          }
          
          

          setDataTS(x);
        });

        fetch('/data/staticracedata'+stateFips+'.json').then(res => res.json())
              .then(x => {
                setDataRD(x);
              });

            }
          }
  }, [stateFips, metric]);

  useEffect(() => {
    if (dataTS && dataTS[stateFips]){
      setCovidMetric(_.takeRight(dataTS[stateFips])[0]);
    }
  }, [dataTS]);


  if (data && dataTS) {
    console.log(dataTS[stateFips].length-15);

  return (
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '8em', minWidth: '1260px'}}>
          {config &&
          <div>
          <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt"}}>
            <Breadcrumb.Section link onClick={() => history.push('/')}>United States</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
            <Breadcrumb.Section active>{stateName}</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
          </Breadcrumb>
                <div style ={{paddingTop: 26, paddingBottom: 6}}>
                  <text style={{paddingLeft: 0, fontFamily: "lato", fontSize: "14pt"}}>
                    <b> Step 1.</b> Select your state.<b> &nbsp;&nbsp; Step 2. </b> Select your county. <br/><br/>
                  </text>
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
                        text= {"Selected State: " + stateName}
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
                      

          {stateFips !== "_nation" && 
              <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '22pt', paddingTop: 40, paddingBottom: 25}}> Covid-19 Outcomes in {stateName} </Divider>
          }

          {stateFips !== "_nation" && 

          <Grid columns={15}>

          <Grid.Row columns={5} style={{width: 252, paddingRight: 0, paddingTop: '2em', paddingBottom: "0"}}>
            <Grid.Column style = {{width:235}}> 
              <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> Daily Cases</center>

              <div style = {{width: 235, background: "#e5f2f7"}}>
                <VictoryChart 
                            minDomain={{ x: dataTS[stateFips][dataTS[stateFips].length-15].t}}
                            maxDomain = {{y: getMaxRange(dataTS[stateFips], "caseRateMean", (dataTS[stateFips].length-15)).caseRateMean*1.05}}                            
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

                            <VictoryLine data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                                x='t' y='caseRateMean'
                                />

                            </VictoryGroup>
                            <VictoryArea
                              style={{ data: {fill: "#080808" , fillOpacity: 0.1} }}
                              data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                              x= 't' y = 'caseRateMean'

                            />

                            <VictoryLabel text= {caseRate} x={115} y={60} textAnchor="middle" style={{fontSize: 50, fontFamily: 'lato'}}/>
                            <VictoryLabel text= {percentChangeCases}  x={115} y={115} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>
                            <VictoryLabel text= "14-day"  x={180} y={110} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>
                            <VictoryLabel text= "change"  x={180} y={120} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>

                            
                </VictoryChart>
              </div>
            </Grid.Column>
            <Grid.Column style = {{width:235}}> 
              <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> Daily Deaths</center>
              <div style = {{width: 235, background: "#e5f2f7"}}>

                <VictoryChart theme={VictoryTheme.material}
                            minDomain={{ x: dataTS[stateFips][dataTS[stateFips].length-15].t }}
                            maxDomain = {{y: getMax(dataTS[stateFips], "mortalityMean").mortalityMean + 0.8}}                            
                            width={235}
                            height={180}       
                            padding={{left: 0, right: -1, top: 150, bottom: -0.9}}
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

                              <VictoryLine data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                                x='t' y='mortalityMean'
                                />

                            </VictoryGroup>

                            <VictoryArea
                              style={{ data: { fill: "#080808", fillOpacity: 0.1} }}
                              data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                              x= 't' y = 'mortalityMean'

                            />
                            <VictoryLabel text= {mortality} x={115} y={60} textAnchor="middle" style={{fontSize: 50, fontFamily: 'lato'}}/>
                            <VictoryLabel text= {percentChangeMortality} x={115} y={115} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>
                            <VictoryLabel text= "14-day"  x={180} y={110} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>
                            <VictoryLabel text= "change"  x={180} y={120} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>

                </VictoryChart>
              </div>
            </Grid.Column>
            <Grid.Column style = {{width:235}}>
              <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> Percent Occupied Beds</center>
              <div style = {{width: 235, background: "#e5f2f7"}}>
                <VictoryChart theme={VictoryTheme.material}
                            minDomain={{ x: dataTS[stateFips][dataTS[stateFips].length-(index+15)].t }}
                            maxDomain={{ x: dataTS[stateFips][dataTS[stateFips].length-index].t , y: getMax(dataTS[stateFips], "pctBedsOccupied").pctBedsOccupied*1.1}}
                            width={235}
                            height={180}       
                            padding={{left: 0, right: -1, top: 150, bottom: -0.9}}
                            containerComponent={<VictoryContainer responsive={false}/>}>
                            
                            <VictoryAxis
                              tickValues={[
                                dataTS[stateFips][dataTS[stateFips].length - Math.round(dataTS[stateFips].length/3)*2 - index].t,
                                dataTS[stateFips][dataTS[stateFips].length - Math.round(dataTS[stateFips].length/3) - index].t,
                                dataTS[stateFips][dataTS[stateFips].length - index].t]}                        
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
                            <VictoryLabel text= {pctBedsOccupied} x={115} y={60} textAnchor="middle" style={{fontSize: 50, fontFamily: 'lato'}}/>

                </VictoryChart>
              </div>
            </Grid.Column>
            <Grid.Column style = {{width:235}}>
              <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> Percent Tested Positive</center>
              <div style = {{width: 235, background: "#e5f2f7"}}>
                <VictoryChart theme={VictoryTheme.material}
                            minDomain={{ x: dataTS[stateFips][dataTS[stateFips].length-15].t }}
                            maxDomain = {{y: getMax(dataTS[stateFips], "positive").positive*1.05}}
                            width={235}
                            height={180}       
                            padding={{left: 0, right: -1, top: 150, bottom: -0.9}}
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

                              <VictoryLine data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                                x='t' y='positive'
                                />

                            </VictoryGroup>

                            <VictoryArea
                              style={{ data: { fill: "#080808", fillOpacity: 0.1} }}
                              data={dataTS[stateFips]? dataTS[stateFips] : dataTS["_"]}
                              x= 't' y = 'positive'

                            />
                            <VictoryLabel text= {pctPositive} x={115} y={60} textAnchor="middle" style={{fontSize: 50, fontFamily: 'lato'}}/>

                </VictoryChart>
              </div>
            </Grid.Column>
            <Grid.Column style = {{width:235}}>
              <center style = {{ fontSize: "16pt", fontFamily: "lato", paddingBottom: 5}}> Cases by Race</center>

              <div style = {{width: 235, background: "#e5f2f7"}}>
                <VictoryChart
                            theme={VictoryTheme.material} 
                            width={235}
                            height={180}        
                            scale={{y: props.ylog?'log':'linear'}}
                            minDomain={{y: props.ylog?1:0}}
                            domainPadding={10}
                            style={{labels:{ fontFamily: 'lato'}}}
                            padding={{left: 65, right: dataRD[stateFips][1]['African American'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] > 6 ? 140:
                                                          dataRD[stateFips][1]['African American'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] > 3 && dataRD[stateFips][1]['African American'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] < 4 ? 80:
                                                            data[stateFips]['natives'] >= 1 && dataRD[stateFips][3]['American Natives'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] > 3 ? 100: 10, top: 20, bottom: -0.9}}
                            containerComponent={<VictoryContainer style ={{fontFamily: 'lato'}} responsive={false}/>}
                          >

                            <VictoryAxis 
                                style={{axis: {stroke: "transparent"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "11px", fontFamily: 'lato'}}}

                             />
                            <VictoryAxis dependentAxis 
                              style ={{axis: {stroke: "transparent"}, grid: {stroke: "transparent"}, fontFamily: 'lato'}}
                              tickValues = {
                                  data[stateFips]['natives'] >= 1?

                                  ([dataRD[stateFips][0]['All Races Combined'][0]['caseRate'], 
                                  dataRD[stateFips][1]['African American'][0]['caseRate'],
                                  dataRD[stateFips][2]['White'][0]['caseRate'],
                                  dataRD[stateFips][3]['American Natives'][0]['caseRate']])
                                  :
                                  ([
                                  dataRD[stateFips][0]['All Races Combined'][0]['caseRate'],
                                  dataRD[stateFips][1]['African American'][0]['caseRate'],
                                  dataRD[stateFips][2]['White'][0]['caseRate']
                                      
                                        ])}

                            />
                            <VictoryBar
                              horizontal
                              barRatio={0.8}

                              labels={({ datum }) => numberWithCommas((Math.round(datum.value*dataRD[stateFips][0]['All Races Combined'][0]['caseRate']))) !== 0?
                                                      numberWithCommas((Math.round(datum.value*dataRD[stateFips][0]['All Races Combined'][0]['caseRate']))): "Not Available"}
                              data={

                                data[stateFips]['natives'] >= 1? 
                                [{key: "White", 'value': dataRD[stateFips][2]['White'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0},
                                {key: "African \n American", 'value': dataRD[stateFips][1]['African American'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0},
                                {key: "Native \n American", 'value': dataRD[stateFips][3]['American Natives'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0},
                                {key: "All Races \n Combined", 'value': dataRD[stateFips][0]['All Races Combined'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0}
                                ]
                                :[{key: "White", 'value': dataRD[stateFips][2]['White'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0},
                                {key: "African \n American", 'value': dataRD[stateFips][1]['African American'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0},
                                {key: "All Races \n Combined", 'value': dataRD[stateFips][0]['All Races Combined'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0}
                                ]}
                              labelComponent={<VictoryLabel dx = {5} style={{fontSize: 14, fontFamily: 'lato', fill: ({datum}) => '#000000' }}/>}
                              style={{
                                data: {
                                  fontFamily: 'lato',
                                  fill: ({ datum }) => '#b2b3b3'
                                }
                              }}
                              x="key"
                              y="value"
                            />
                </VictoryChart>
              </div>
            </Grid.Column>
            </Grid.Row>

            <Grid.Row columns = {5} style={{paddingBottom: 0, paddingTop: 10, paddingLeft: 15, paddingRight: 0}}>
              
                <Grid.Column style={{padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <text style={{fontWeight: 300, fontSize: "14pt"}}>
                    Daily new COVID-19 cases <br/>
                    (7-day rolling average) <br/><br/><br/><br/>
                    <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target = "_blank" rel="noopener noreferrer"> New York Times </a> <br/>
                    </text>
                </Grid.Column>
                <Grid.Column style={{left: 3, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <text style={{fontWeight: 300, fontSize: "14pt"}}>
                    Daily new COVID-19 deaths 
                    (7-day rolling average) <br/><br/><br/><br/>
                    <i>Data source</i>:<a style ={{color: "#397AB9"}} href = "https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target = "_blank" rel="noopener noreferrer"> New York Times </a> <br/>
                    </text>
                </Grid.Column>
                <Grid.Column style={{left: 4, padding: 0, paddingLeft: 0, paddingRight: 10, paddingRight: 0, lineHeight: '16pt'}}>
                  <text style={{fontWeight: 300, fontSize: "14pt"}}>
                    Percentage of inpatient
                    beds occupied by COVID-19 patients. <br/><br/><br/>
                    <i>Data source</i>:  <a style ={{color: "#397AB9"}} href = "https://www.cdc.gov/nhsn/datastat/index.html" target = "_blank" rel="noopener noreferrer">CDC's NHSN </a><br/>
                    </text>
                </Grid.Column>
                <Grid.Column style={{left: 9, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <text style={{fontWeight: 300, fontSize: "14pt"}}>
                    Percentage of total tests for
                    COVID-19 that resulted in a positive result. <br/><br/><br/>
                    <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a> <br/>
                    </text>
                </Grid.Column>
                <Grid.Column style={{left: 12, padding: 0, paddingLeft: 0, paddingRight: 10, lineHeight: '16pt'}}>
                  <text style={{fontWeight: 300, fontSize: "14pt"}}>
                    Distribution of cases per 100,000 persons among races that constitute more than 1% of {stateName}'s total population. <br/><br/>
                    <i>Data source</i>: <a style ={{color: "#397AB9"}} href="https://covidtracking.com/race" target="_blank" rel="noopener noreferrer"> The COVID Racial Data Tracker </a> <br/> 

                    </text>
                </Grid.Column>
              
            </Grid.Row>

            <Grid.Row style={{paddingTop: 20, paddingBottom: 50, paddingLeft: 15}}>
                    <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "16pt"}}>
                      Percent Occupied Beds updated on 07/07/2020.
                    </text>
            </Grid.Row>

          </Grid>
        }
        {stateFips !== "_nation" && 
          <span style={{color: '#73777B', fontSize: "14pt"}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>
        }

        {stateFips !== "_nation" && 
         <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '22pt', paddingTop: 37, paddingBottom: 35}}> COVID-19 County Outcomes </Divider>
          
        }
        {stateFips !== "_nation" && 
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
                          history.push("/" + stateFips + "/" +geo.properties.COUNTYFP);
                        }}
                        onMouseEnter={()=>{setDelayHandler(setTimeout(() => {
                            setCountyFips(geo.properties.COUNTYFP);
                            setCountyName(fips2county[stateFips + geo.properties.COUNTYFP]);
                            setBarCountyName((fips2county[stateFips + geo.properties.COUNTYFP]).match(/\S+/)[0]);

                            
                            // setTooltipContent('Click to see more county data');
                          }, 300))
                        }}
                        onMouseLeave={()=>{
                          clearTimeout(delayHandler);

                          setTooltipContent("")
                        }}
                        
                        fill={countyFips===geo.properties.COUNTYFP?countyColor:
                            ((colorScale && data[stateFips+geo.properties.COUNTYFP] && (data[stateFips+geo.properties.COUNTYFP][metric]) > 0)?
                                colorScale[data[stateFips+geo.properties.COUNTYFP][metric]]: 
                                (colorScale && data[stateFips+geo.properties.COUNTYFP] && data[stateFips+geo.properties.COUNTYFP][metric] === 0)?
                                  '#e1dce2':'#FFFFFF')}
                        />
                    )}
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column width={6} style={{padding: 0, paddingLeft: 40}}>
                <Header as='h2' style={{fontWeight: 400, width: 410}}>
                  <Header.Content style={{fontSize: 20}}>
                    Comparing <b>{countyName}</b>
                    <Header.Subheader style={{fontWeight: 350, paddingTop: 15, width: 410, fontSize: "14pt", lineHeight: "16pt"}}>
                      The number of cases and deaths due to COVID-19 are dynamic. 
                      Cases are declining in many counties and rising in others. 
                      Trends in the case and death count in the past 14 days are being monitored to determine whether it is safe to reopen a county.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <Grid>
                  <Grid.Row columns={1} style={{padding: 0, paddingTop: 19, paddingBottom: 0}}>
                     <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 15, paddingBottom: 5, fontWeight: 400}}>Average Daily COVID-19 Cases /100,000 </text>

                      <svg width = "370" height = "40">
                          <rect x = {20} y = {12} width = "12" height = "2" style = {{fill: nationColor, strokeWidth:1, stroke: nationColor}}/>
                          <text x = {35} y = {20} style = {{ fontSize: "12pt"}}> USA</text>
                          <rect x = {87} y = {12} width = "12" height = "2" style = {{fill: stateColor, strokeWidth:1, stroke: stateColor}}/>
                          <text x = {102} y = {20} style = {{ fontSize: "12pt"}}> {stateName} </text>
                          <rect x = {stateName.length > 10? 230: 180} y = {12} width = "12" height = "2" style = {{fill: countyColor, strokeWidth:1, stroke: countyColor}}/>
                          <text x = {stateName.length > 10? 245: 195} y = {20} style = {{ fontSize: "12pt"}}> {countyName}</text>
                      </svg>

                      <VictoryChart theme={VictoryTheme.material} minDomain={{ y: 0 }}
                        width={330}
                        height={160}       
                        padding={{left: 50, right: 60, top: 10, bottom: 30}}
                        containerComponent={<VictoryVoronoiContainer flyoutStyle={{fill: "white"}}/> }
                        >
                        
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][0].t,
                            dataTS["_nation"][30].t,
                            dataTS["_nation"][61].t,
                            dataTS["_nation"][91].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                          style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: 14, fontFamily: 'lato'}}} 
                          tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                         style={{ticks: {stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {fill: "#000000", fontSize: 14, padding: 1}}} 
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
                    </Grid.Row>
                  <Grid.Row columns={1} style={{padding: 0, paddingTop: 30, paddingBottom: 0}}>
                      <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 15, paddingTop: 10, paddingBottom: 10, fontWeight: 400}}>Average Daily COVID-19 Deaths /100,000 </text>

                      <svg width = "370" height = "40">
                          <rect x = {20} y = {12} width = "12" height = "2" style = {{fill: nationColor, strokeWidth:1, stroke: nationColor}}/>
                          <text x = {35} y = {20} style = {{ fontSize: "12pt"}}> USA</text>
                          <rect x = {87} y = {12} width = "12" height = "2" style = {{fill: stateColor, strokeWidth:1, stroke: stateColor}}/>
                          <text x = {102} y = {20} style = {{ fontSize: "12pt"}}> {stateName} </text>
                          <rect x = {stateName.length > 10? 230: 180} y = {12} width = "12" height = "2" style = {{fill: countyColor, strokeWidth:1, stroke: countyColor}}/>
                          <text x = {stateName.length > 10? 245: 195} y = {20} style = {{ fontSize: "12pt"}}> {countyName}</text>
                      </svg>

                      <VictoryChart theme={VictoryTheme.material} minDomain={{ y: 0 }}
                        width={330}
                        height={170}       
                        padding={{left: 50, right: 60, top: 10, bottom: 30}}
                        containerComponent={<VictoryVoronoiContainer/>}
                        >
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][0].t,
                            dataTS["_nation"][30].t,
                            dataTS["_nation"][61].t,
                            dataTS["_nation"][91].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}    
                          style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: 14, fontFamily: 'lato'}}} 
                          tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                         style={{ticks: {stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {fill: "#000000", fontSize: 14, padding: 1}}} 
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
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column width={5} style={{padding: 0, paddingLeft: 0}}>
                <Header as='h2' style={{width:410, paddingLeft: 0}}>
                  <Header.Content style={{fontSize: "14pt", lineHeight: "16pt"}}>
                    {barCountyName} Population Characteristics
                    <Header.Subheader style={{fontWeight: 350, width: 390, fontSize: "14pt", lineHeight: "16pt", paddingTop: 17}}>
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
      <ReactTooltip><font size="+1"> <b> {countyName} </b> </font> <br/> Click for a detailed report. </ReactTooltip>
    </div>
    );
  } else{
    return <Loader active inline='centered' />
  }




}