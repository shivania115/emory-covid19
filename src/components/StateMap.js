import React, { useEffect, useState } from 'react'
import { Container, Dropdown, Grid, Breadcrumb, Header, Loader, Divider } from 'semantic-ui-react'
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
const stateColor = '#778899';
const nationColor = '#b2b3b3';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];



function BarChart(props) {
  const colors = {"USA": nationColor, 
                  stateName: stateColor, 
                  countyName: countyColor};
  if (props.countyFips !== "_nation" && props.stateFips !== "_nation") {
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={230}
      height={90}       
      domainPadding={10}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 120, right: 30, top: 20, bottom: 20}}
      containerComponent={<VictoryContainer responsive={false}/>}
    >
      <VictoryLabel text={props.title} x={140} y={10} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>
      <VictoryAxis style={{tickLabels: {fontSize: 10, fontFamily: 'lato'}}} />
      <VictoryAxis dependentAxis style={{tickLabels: {fontSize: 8, padding: 1,  fontFamily: 'lato'}}}/>
      <VictoryBar
        horizontal
        barRatio={0.8}
        labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
        data={[{key: 'USA', 'value': props.data['_nation'][props.var] || 0},
              {key: props.stateName, 'value': props.data[props.stateFips][props.var]>0?props.data[props.stateFips][props.var] : 0},
              {key: props.countyName, 'value': props.data[props.stateFips+props.countyFips][props.var] > 0? props.data[props.stateFips+props.countyFips][props.var]:  0}]}
        labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: 10, fill: ({datum}) => datum.key === props.countyName?countyColor:datum.key === props.stateName?stateColor:nationColor }}/>}
        style={{
          data: {
            fill: ({ datum }) => datum.key === props.countyName?countyColor:datum.key === props.stateName?stateColor:nationColor
          }
        }}
        x="key"
        y="value"
      />
    </VictoryChart>);
  }

  return (

    

    <VictoryChart
      theme={VictoryTheme.material}
      width={230}
      height={90}       
      domainPadding={10}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 120, right: 30, top: 20, bottom: 30}}
      containerComponent={<VictoryContainer responsive={false}/>}>
      <VictoryLabel text={props.title} x={140} y={10} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato'}}/>
      <VictoryAxis style={{tickLabels: {fontSize: 10, fontFamily: 'lato'}}} />
      <VictoryAxis dependentAxis style={{tickLabels: {fontSize: 8, padding: 1, fontFamily: 'lato'}}}/>
      <VictoryBar
        horizontal
        barRatio={0.8}
        labels={({ datum }) => (Math.round(datum.value*100)/100)}
        data={[{key: 'USA', 'value': props.data['_nation'][props.var] || 0}]}
        labelComponent={<VictoryLabel dx={5} style={{fontFamily: 'lato', fontSize: 10, fill: ({datum}) => datum.key === props.countyName?countyColor:datum.key === props.stateName?stateColor:nationColor}}/>}
        style={{
          data: {
            fill: ({ datum }) => datum.key === props.countyName?countyColor:datum.key === props.stateName?stateColor:nationColor
          }
        }}
        x="key"
        y="value"
      />
    </VictoryChart>

    
    );
  
}

export default function StateMap(props) {

  let {stateFips} = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyFips, setCountyFips] = useState('');
  const [countyName, setCountyName] = useState('{County}');
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
    if (metric) {

    
    const configMatched = configs.find(s => s.fips === stateFips);

    if (!configMatched){
      history.push('/');
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
          let mortalityMA = 0;
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
            if (k.length===5 && v.length > 0 && v[v.length-1].mortalityMA > mortalityMA){
              countyMost = k.substring(2, 5);
              mortalityMA = v[v.length-1].mortalityMA;
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


          
          setPercentChangeCases(percentChangeCase.toFixed(0) + "%");
          setPercentChangeMortality(percentChangeMortality.toFixed(0) + "%");
          setPctPositive(percentPositive.toFixed(0) + "%");
          setPctBedsOccupied(percentBedsOccupied.toFixed(0) + "%");
          setTime(monthNames[new Date(jstime*1000).getMonth()] + " " +  new Date(jstime*1000).getDate());
          setIndex(index);

          setCaseRate(numberWithCommas(caseRate.toFixed(0)));
          setMortality(numberWithCommas(mortality.toFixed(0)));

          setPositive(numberWithCommas(positive.toFixed(0)))

          setCountyFips(countyMost);
          setCountyName(fips2county[stateFips+countyMost]);
          

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


  if (data && dataTS && dataRD) {
    console.log(time);
  return (
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '6em', minWidth: '1260px'}}>
          {config &&
          <div>
          <Breadcrumb>
            <Breadcrumb.Section link onClick={() => history.push('/')}>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section active>{stateName}</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </Breadcrumb>
          <Divider hidden/>

                      

          <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '2.0em', paddingBottom: 10}}> Covid-19 Outcomes in {stateName} </Divider>


          <Grid columns={15}>

          <Grid.Row columns={5} style={{width: 252, paddingLeft: 5, paddingTop: '2em', paddingBottom: "0"}}>

            <VictoryChart theme={VictoryTheme.material} 
                        minDomain={{ x: dataTS["_nation"][dataTS["_nation"].length-15].t }}
                        width={252}
                        height={180}       
                        padding={{left: 11, right: -1, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        <VictoryLabel text="Daily Cases" x={130} y={10} textAnchor="middle" style={{fontSize: 21, fontFamily: 'lato'}}/>
                        
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3)*2 - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3) - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                          style={{tickLabels: {fontSize: 10}}} 
                          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                        
                        <VictoryGroup 
                          colorScale={[stateColor]}
                        >

                        <VictoryLine data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='caseRateMean'
                            />

                        </VictoryGroup>
                        <VictoryArea
                          style={{ data: {  fill: percentChangeCases.includes("+")? "#C0C0C0": percentChangeCases.includes("-")? "#C0C0C0" : "#C0C0C0" , fillOpacity: 0.1} }}
                          data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                          x= 't' y = 'caseRateMean'

                        />

                        <VictoryLabel text= {caseRate} x={130} y={75} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>
                        <VictoryLabel text= {percentChangeCases}  x={130} y={115} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>

                        
            </VictoryChart>
            

            <VictoryChart theme={VictoryTheme.material}
                        minDomain={{ x: dataTS["_nation"][dataTS["_nation"].length-15].t }}
                        width={252}
                        height={180}       
                        padding={{left: 11, right: -1, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        <VictoryLabel text="Daily Deaths" x={130} y={10} textAnchor="middle" style={{fontSize: 21, fontFamily: 'lato'}}/>
                        
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3)*2 - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3) - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                          style={{tickLabels: {fontSize: 10}}} 
                          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                        
                        <VictoryGroup 
                          colorScale={[stateColor]}
                        >

                          <VictoryLine data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='mortalityMean'
                            />

                        </VictoryGroup>

                        <VictoryArea
                          style={{ data: { fill: percentChangeMortality.includes("+")? "#C0C0C0": (percentChangeMortality.includes("-")? "#C0C0C0" : "#C0C0C0"), fillOpacity: 0.1} }}
                          data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                          x= 't' y = 'mortalityMean'

                        />
                        <VictoryLabel text= {mortality} x={130} y={75} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>
                        <VictoryLabel text= {percentChangeMortality} x={130} y={115} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>

            </VictoryChart>

            <VictoryChart theme={VictoryTheme.material}
                        minDomain={{ x: dataTS["_nation"][dataTS["_nation"].length-(index+15)].t }}
                        maxDomain={{ x: dataTS["_nation"][dataTS["_nation"].length-index].t }}
                        width={252}
                        height={180}       
                        padding={{left: 11, right: -1, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        <VictoryLabel text="Percent Occupied Beds" x={130} y={10} textAnchor="middle" style={{fontSize: 21, fontFamily: 'lato'}}/>
                        
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3)*2 - index].t,
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3) - index].t,
                            dataTS["_nation"][dataTS["_nation"].length - index].t]}                        
                          style={{tickLabels: {fontSize: 10}}} 
                          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                        
                        <VictoryGroup 
                          colorScale={[stateColor]}
                        >

                          <VictoryLine data={stateFips !== "_nation" ? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='pctBedsOccupied'
                            />

                        </VictoryGroup>

                        <VictoryArea
                          style={{ data: { fill: "#C0C0C0", fillOpacity: 0.1} }}
                          data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                          x= 't' y = 'pctBedsOccupied'

                        />
                        <VictoryLabel text= {pctBedsOccupied} x={130} y={95} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>

            </VictoryChart>

            <VictoryChart theme={VictoryTheme.material}
                        minDomain={{ x: dataTS["_nation"][dataTS["_nation"].length-15].t }}
                        width={252}
                        height={180}       
                        padding={{left: 11, right: -1, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        <VictoryLabel text="Percent Positive" x={130} y={10} textAnchor="middle" style={{fontSize: 21, fontFamily: 'lato'}}/>

                        
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3)*2 - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3) - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                          style={{tickLabels: {fontSize: 10}}} 
                          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                        
                        <VictoryGroup 
                          colorScale={[stateColor]}
                        >

                          <VictoryLine data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='positive'
                            />

                        </VictoryGroup>

                        <VictoryArea
                          style={{ data: { fill: "#C0C0C0", fillOpacity: 0.1} }}
                          data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                          x= 't' y = 'positive'

                        />
                        <VictoryLabel text= {pctPositive} x={130} y={95} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'}}/>

            </VictoryChart>


            <VictoryChart
                        theme={VictoryTheme.material} 
                        width={252}
                        height={180}        
                        scale={{y: props.ylog?'log':'linear'}}
                        minDomain={{y: props.ylog?1:0}}
                        domainPadding={10}
                        style={{labels:{ fontFamily: 'lato'}}}
                        padding={{left: 115, right: dataRD[stateFips][1]['African American'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] > 7 ? 115:
                                                      dataRD[stateFips][1]['African American'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] > 3 && dataRD[stateFips][1]['African American'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] < 4 ? 60:
                                                        data[stateFips]['natives'] >= 1 && dataRD[stateFips][3]['American Natives'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] > 3 ? 80: 10, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer style ={{fontFamily: 'lato'}} responsive={false}/>}
                      >
                        <VictoryLabel text="Cases per 100,000" x={130} y={10} textAnchor="middle" style={{fontSize: 21, fontFamily: 'lato'}}/>
                        <VictoryLabel text="persons by race" x={130} y={30} textAnchor="middle" style={{fontSize: 21, fontFamily: 'lato'}}/>

                        <VictoryAxis 
                            style={{axis: {stroke: "transparent"}, tickLabels: {fontSize: 10, fontFamily: 'lato'}}}

                         />
                        <VictoryAxis dependentAxis 
                          style ={{fontFamily: 'lato'}}
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
                            {key: "African American", 'value': dataRD[stateFips][1]['African American'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0},
                            {key: "Native American", 'value': dataRD[stateFips][3]['American Natives'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0},
                            {key: "All Races Combined", 'value': dataRD[stateFips][0]['All Races Combined'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0}
                            ]
                            :[{key: "White", 'value': dataRD[stateFips][2]['White'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0},
                            {key: "African American", 'value': dataRD[stateFips][1]['African American'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0},
                            {key: "All Races Combined", 'value': dataRD[stateFips][0]['All Races Combined'][0]['caseRate']/dataRD[stateFips][0]['All Races Combined'][0]['caseRate'] || 0}
                            ]}
                          labelComponent={<VictoryLabel dx = {0} style={{fontSize: 12, fontFamily: 'lato', fill: ({datum}) => '#000000' }}/>}
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


            </Grid.Row>

            <Grid.Row columns = {5} style={{paddingBottom: 0, paddingTop: 0, paddingLeft: 15, paddingRight: 0}}>
              
                <Grid.Column style={{padding: 0, paddingLeft: 0, lineHeight: '1em'}}>
                  <small style={{fontWeight: 300}}>
                    <i>Daily Cases</i>: Daily new COVID-19 cases <br/> 
                    (7-day rolling average) <br/>
                    <i>Data source</i>: <a href = "https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target = "_blank" rel="noopener noreferrer"> New York Times </a> <br/>
                    </small>
                </Grid.Column>
                <Grid.Column style={{left: -3, padding: 0, paddingLeft: 0, lineHeight: '1em'}}>
                  <small style={{fontWeight: 300}}>
                    <i>Daily Deaths</i>: Daily new COVID-19 deaths <br/> 
                    (7-day rolling average) <br/>
                    <i>Data source</i>:<a href = "https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target = "_blank" rel="noopener noreferrer"> New York Times </a> <br/>
                    </small>
                </Grid.Column>
                <Grid.Column style={{left: -3, padding: 0, paddingLeft: 0, paddingRight: 0, lineHeight: '1em'}}>
                  <small style={{fontWeight: 300}}>
                    <i>Percent Occupied Beds</i>: Percentage of inpatient <br/>
                    beds occupied by COVID-19 patients. <br/>
                    <i>Data source</i>:  <a href = "https://www.cdc.gov/nhsn/datastat/index.html" target = "_blank" rel="noopener noreferrer">CDC's NHSN </a><br/>
                    </small>
                </Grid.Column>
                <Grid.Column style={{left: -8, padding: 0, paddingLeft: 0, lineHeight: '1em'}}>
                  <small style={{fontWeight: 300}}>
                    <i>Percent Positive</i>: Percentage of total tests for <br/>
                     COVID-19 that resulted in a positive result. <br/>
                    <i>Data source</i>: <a href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a> <br/>
                    </small>
                </Grid.Column>
                <Grid.Column style={{left: -13, padding: 0, paddingLeft: 0, lineHeight: '1em'}}>
                  <small style={{fontWeight: 300}}>
                    <i>Rates</i>: Cases per 100,000, among those with race <br/> 
                    information available <br/>
                    <i>Data source</i>: <a href="https://covidtracking.com/race" target="_blank" rel="noopener noreferrer"> The COVID Racial Data Tracker </a> <br/> 

                    </small>
                </Grid.Column>
              
            </Grid.Row>

            <Grid.Row style={{paddingTop: 20, paddingBottom: 50, paddingLeft: 15}}>
                    <small style={{fontWeight: 300}}>
                      All percent changes for a 14-day period. <br/>
                      Percent Occupied Beds updated on 07/07/2020.
                    </small>
            </Grid.Row>

          </Grid>

          <span style={{color: '#bdbfc1'}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>
         
         <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '2.0em', paddingBottom: 10}}> COVID-19 County Outcomes </Divider>
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={5}>

                <Dropdown
                        icon=''

                        style={{background: '#fff', 
                                fontSize: 16,
                                fontWeight: 400, 
                                theme: '#000000',
                                width: '370px',
                                top: '0px',
                                left: '0px',
                                text: "Select",
                                borderTop: 'none',
                                borderLeft: '1px solid #FFFFFF',
                                borderRight: 'none', 
                                borderBottom: '0.5px solid #bdbfc1',
                                borderRadius: 0,
                                minHeight: '1.0em',
                                paddingBottom: '0.0em',
                                paddingRight: 0}}
                        placeholder= "Average Daily COVID-19 Cases"
                        inline
                        search
                        pointing = 'top'
                        options={metricOptions}
                        onChange={(e, { value }) => {
                          setMetric(value);
                          setMetricName(varMap[value]['name']);
                        }}

                        
                      />
                
                <svg width="400" height="90">
                  <text x={0} y={70} style={{fontSize: '0.8em'}}>Low</text>
                  <text x={20 * (colorPalette.length - 1)} y={70} style={{fontSize: '0.8em'}}>High</text>

                  {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                  })} 

                  <rect x={145} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                  <text x={167} y={50} style={{fontSize: '0.7em'}}> None </text>
                  <text x={167} y={59} style={{fontSize: '0.7em'}}> Reported </text>

                  {_.map(legendSplit, (splitpoint, i) => {
                    if(legendSplit[i] < 1){
                      return <text key = {i} x={20 + 20 * (i)} y={37} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(1)}</text>                    
                    }else if(legendSplit[i] > 99999){
                      return <text key = {i} x={20 + 20 * (i)} y={37} style={{fontSize: '0.7em'}}> {(legendSplit[i]/1000000).toFixed(0) + "M"}</text>                    
                    }else if(legendSplit[i] > 999){
                      return <text key = {i} x={20 + 20 * (i)} y={37} style={{fontSize: '0.7em'}}> {(legendSplit[i]/1000).toFixed(0) + "K"}</text>                    
                    }
                    return <text key = {i} x={20 + 20 * (i)} y={37} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(0)}</text>                    
                  })} 
                  <text x={0} y={37} style={{fontSize: '0.7em'}}> {legendMin} </text>
                  <text x={120} y={37} style={{fontSize: '0.7em'}}>{legendMax}</text>

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
              <Grid.Column width={5} style={{padding: 0, paddingLeft: 0}}>
                <Header as='h2' style={{fontWeight: 400, width: 410}}>
                  <Header.Content style={{fontSize: 20}}>
                    How Does <span style={{color: countyColor, fontSize: 20}}>{countyName}</span> Compare?
                    <Header.Subheader style={{fontWeight: 300, width: 390, fontSize: 14}}>
                      The number of cases and deaths due to COVID-19 are dynamic. 
                      Cases are declining in many counties and rising in others. 
                      Trends in the case and hospitalization count in the past 14 days are being monitored to determine whether it is safe to reopen a county.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <Grid>
                  <Grid.Row columns={1} style={{padding: 0, paddingTop: 20, paddingBottom: 0}}>
                     <text x={0} y={20} style={{fontSize: '16px', paddingLeft: 15, paddingBottom: 5, fontWeight: 400}}>Average Daily COVID-19 Cases /100,000 </text>

                      <VictoryChart theme={VictoryTheme.material} minDomain={{ y: 0 }}
                        width={330}
                        height={160}       
                        padding={{left: 50, right: 40, top: 24, bottom: 30}}
                        containerComponent={<VictoryVoronoiContainer flyoutStyle={{fill: "white"}}/> }
                        >
                        <VictoryLegend
                          x={40} y={5}
                          borderPadding={{ left: 0, right: 0 }}
                          symbolSpacer={5}
                          orientation="horizontal"
                          style={{labels:{ fontFamily: 'lato'}}}
                          colorScale={[nationColor, stateColor, countyColor]}
                          data ={[
                            {name: "USA   "}, {name: stateName }, {name: countyName}
                            ]}
                        />
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3)*2 - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3) - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                          style={{tickLabels: {fontSize: 10, fontFamily: 'lato'}}} 
                          tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                         style={{tickLabels: {fontSize: 8, padding: 1}}} 
                          tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                          />
                        <VictoryGroup 
                          colorScale={[nationColor, stateColor, countyColor]}
                        >
                          <VictoryLine data={dataTS["_nation"]}
                            x='t' y='caseRateMA'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.caseRateMA.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: -50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              
                              data: {strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                          <VictoryLine data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='caseRateMA'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.caseRateMA.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: -50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                          <VictoryLine data={dataTS[stateFips+countyFips] && (stateFips !== "_nation")?dataTS[stateFips+countyFips]:dataTS["99999"]}
                            x='t' y='caseRateMA'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.caseRateMA.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: -50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                        </VictoryGroup>
                      </VictoryChart>
                    </Grid.Row>
                  <Grid.Row columns={1} style={{padding: 0, paddingTop: 20, paddingBottom: 0}}>
                      <text x={0} y={20} style={{fontSize: '16px', paddingLeft: 15, paddingBottom: 5, fontWeight: 400}}>Average Daily COVID-19 Deaths /100,000 </text>

                      <VictoryChart theme={VictoryTheme.material} minDomain={{ y: 0 }}
                        width={330}
                        height={160}       
                        padding={{left: 50, right: 40, top: 24, bottom: 30}}
                        containerComponent={<VictoryVoronoiContainer/>}
                        >
                        <VictoryLegend
                          x={40} y={5}
                          borderPadding={{ left: 0, right: 0 }}
                          symbolSpacer={5}
                          orientation="horizontal"
                          style={{labels:{ fontFamily: 'lato'}}}
                          colorScale={[nationColor, stateColor, countyColor]}
                          data ={[
                            {name: "USA   "}, {name: stateName }, {name: countyName}
                            ]}
                        />
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3)*2 - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3) - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                          style={{tickLabels: {fontSize: 10, fontFamily: 'lato'}}} 
                          tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                         style={{tickLabels: {fontSize: 8, padding: 1}}} 
                          tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                          />
                        <VictoryGroup 
                          colorScale={[nationColor, stateColor, countyColor]}
                        >
                          <VictoryLine data={dataTS["_nation"]}
                            x='t' y='mortalityMA'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.mortalityMA.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: -50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                          <VictoryLine data={stateFips !== "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='mortalityMA'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.mortalityMA.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: -50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                            />
                          <VictoryLine data={dataTS[stateFips+countyFips] && (stateFips !== "_nation")?dataTS[stateFips+countyFips]:dataTS["99999"]}
                            x='t' y='mortalityMA'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.mortalityMA.toFixed(1)}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: -50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
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
              <Grid.Column width={6} style={{padding: 0, paddingLeft: 10}}>
                <Header as='h2' style={{width:460}}>
                  <Header.Content style={{fontSize: 20, fontWeight: 400}}>
                    County Population Characteristics
                    <Header.Subheader style={{fontWeight: 300, width: 460, fontSize: 14}}>
                    Social, economic, health and environmental factors impact an individual’s risk of infection and COVID-19 severity. 
                    Counties with large groups of vulnerable people may be  disproportionately impacted by COVID-19.
                    </Header.Subheader>
                  </Header.Content>

                </Header>
                <Grid>
                  <Grid.Row columns={2} style={{padding: 20, width: 460, paddingBottom: 20}}>                    
                      <BarChart 
                        title="% African American" 
                        var="black" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={countyName}
                        stateName={stateName}
                        data={data} />
                      <BarChart 
                        title="% Hispanic or Latino" 
                        var="hispanic"  
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={countyName}
                        stateName={stateName}
                        data={data} />
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 20, width: 460, paddingBottom: 20}}>
                      <BarChart 
                        title="% Native American" 
                        var="natives" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={countyName}
                        stateName={stateName}
                        data={data} />  
                      <BarChart 
                        title="% Over 65 y/o" 
                        var="age65over" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={countyName}
                        stateName={stateName}
                        data={data} />
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 20, width: 460, paddingBottom: 20}}>
                      <BarChart 
                        title="% Obese" 
                        var="obesity" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={countyName}
                        stateName={stateName}
                        data={data} />  
                      <BarChart 
                        title="% Diabetes" 
                        var="diabetes" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={countyName}
                        stateName={stateName}
                        data={data} /> 
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 20, width: 460, paddingBottom: 20}}>                    
                      <BarChart 
                        title="% in Poverty" 
                        var="poverty"  
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={countyName}
                        stateName={stateName}
                        data={data} />
                      <BarChart 
                        title="% Uninsured" 
                        var="PCTUI" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={countyName}
                        stateName={stateName}
                        data={data} />
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 20, width: 460}}>                    
                      <BarChart 
                        title="% in Group Quarters" 
                        var="groupquater" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={countyName}
                        stateName={stateName}
                        data={data} />
                      <BarChart 
                        title="% Male" 
                        var="male" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        countyName={countyName}
                        stateName={stateName}
                        data={data} />
                  </Grid.Row>
                </Grid>
              </Grid.Column>

            </Grid.Row>  
            <span style={{color: '#bdbfc1'}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>
          
          </Grid>
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