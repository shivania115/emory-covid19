import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, Loader, Table, Divider } from 'semantic-ui-react'
import AppBar from './AppBar';
// import Geographies from './Geographies';
// import Geography from './Geography';
// import ComposableMap from './ComposableMap';
import { VictoryChart, 
  VictoryContainer,
  VictoryGroup, 
  VictoryBar, 
  VictoryTheme, 
  VictoryAxis, 
  VictoryLegend,
  VictoryLine,
  VictoryLabel, 
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import fips2county from './fips2county.json'
import configs from "./state_config.json";
import _ from 'lodash';

import { var_option_mapping, CHED_static, CHED_series} from "../stitch/mongodb";
import {HEProvider, useHE} from './HEProvider';
import {useStitchAuth} from "./StitchAuth";

const countyColor = '#f2a900';
const stateColor = "#778899";
const nationColor = '#b1b3b3';

const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
  "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
];

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function ScatterChart(props) {

  return (
    <VictoryChart
      width={450}
      height={350}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 80, right: 20, top: 50, bottom: 35}}>
      {props.showLegend && <VictoryLegend
        x={10} y={10}
        orientation="horizontal"
        style={{labels:{ fontFamily: 'lato'}}}
        colorScale={[stateColor, countyColor]}
        data ={[
          {name: ('Other counties in '+ props.stateName)}, {name: props.countyName}
          ]}
      />}
      <VictoryScatter
        data={_.filter(_.map(props.data, (d, k)=>{d.fips=k; return d;}), (d)=> (
                 d.fips.length===5 &&
                 d.fips.substring(0,2)===props.stateFips &&
                 d[props.x] >= 0 && d[props.y] >= 0))}
        sortKey={(d) => d.fips===(props.stateFips + props.countyFips)}
        style={{ 
                 data: { fontFamily: 'lato', 
                 fill: ({datum}) => datum.fips===(props.stateFips + props.countyFips)?countyColor:stateColor,
                 fillOpacity: ({datum}) => datum.fips===(props.stateFips + props.countyFips)?1.0:0.7} }}
        size={4}
        x={props.x}
        y={props.y}
        labels={({ datum }) => `${datum[props.y].toFixed(1)}`}
        labelComponent={<VictoryTooltip style = {{fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 30 }} cornerRadius={4} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}

      />
      <VictoryAxis 
        tickCount={4}
                          style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {fontWeight: 300,stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}}} 
        tickFormat={(y) => (props.rescaleX?(Math.round(y/1000)+'k'):(Math.round(y*100)/100))} />

      <VictoryAxis dependentAxis label={props.varMap[props.y]?props.varMap[props.y].name:props.y} 
                          style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, axisLabel: {padding: 60, fontFamily: 'lato', fontSize: "19px"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {fontWeight: 300,stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}}} 
        tickCount={5}
        tickFormat={(y) => (Math.round(y*100)/100)} />
    </VictoryChart>);

}

function BarChart(props) {
  const colors = {"USA": nationColor, 
                  stateName: stateColor, 
                  countyName: countyColor};
  if (props.stateFips !== "_nation") {

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={props.width || 460}
      height={140}       
      domainPadding={10}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 165, right: 50, top: 40, bottom: 50}}
      containerComponent={<VictoryContainer responsive={false}/>}>
      <VictoryLabel text={props.title} x={(props.width || 460)/2} y={30} textAnchor="middle" style={{fontSize: "19px", fontFamily: 'lato'}}/>
      <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "14px", fontFamily: 'lato'}}} />
      <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "14px", fontFamily: 'lato'}}} />
      <VictoryBar
        horizontal
        barRatio={0.8}
        labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
        data={[{key: 'USA', 'value': props.data['_nation'][props.var] || 0},
              {key: props.stateName, 'value': props.data[props.stateFips][props.var] > 0? props.data[props.stateFips][props.var] : 0},
              {key: props.countyName, 'value': props.data[props.stateFips+props.countyFips][props.var] > 0 ? props.data[props.stateFips+props.countyFips][props.var] : 0}]}
        labelComponent={<VictoryLabel dx={5} style={{fontFamily: 'lato', fill: "#000000", fontSize: "19px"}}/>}
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




}

export default function CountyReport() {
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();  

  let { stateFips, countyFips } = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyName, setCountyName] = useState('');
  const history = useHistory();

  const [date, setDate] = useState();
  const [data, setData] = useState();
  const [dataTS, setDataTS] = useState();
   const [tooltipContent, setTooltipContent] = useState('');
  // const [countyMetric, setCountyMetric] = useState({cases: 'N/A', deaths: 'N/A', 
  //                                                 caseRate: "N/A", mortality: "N/A", 
  //                                                 caseRateMean: "N/A", mortalityMean: "N/A",
  //                                                 caserate7dayfig: "N/A", covidmortality7dayfig: "N/A",
  //                                                 cfr:"N/A", t: 'n/a'});
    const [countyMetric, setCountyMetric] = useState();

  // const [stateMetric, setStateMetric] = useState({cases: 'N/A', deaths: 'N/A', 
  //                                                 caseRate: "N/A", mortality: "N/A", 
  //                                                 caseRateMean: "N/A", mortalityMean: "N/A",
  //                                                 caserate7dayfig: "N/A", covidmortality7dayfig: "N/A",
  //                                                 cfr:"N/A", t: 'n/a'});

  const [stateMetric, setStateMetric] = useState();                                                
  const [varMap, setVarMap] = useState({});


  const [countyCasesOutcome, setCountyCasesOutcome] = useState();
  const [countyDeathsOutcome, setCountyDeathsOutcome] = useState();

  const [stateCasesOutcome, setStateCasesOutcome] = useState();
  const [stateDeathsOutcome, setStateDeathsOutcome] = useState();

  const [nationCasesOutcome, setNationCasesOutcome] = useState();
  const [nationDeathsOutcome, setNationDeathsOutcome] = useState();



  // useEffect(()=>{

    // const configMatched = configs.find(s => s.fips === stateFips);
    // if(!configMatched || !fips2county[stateFips+countyFips]){
    //   history.push('/');
    // }else{
    //   setConfig(configMatched);
    //   setStateName(configMatched.name);
    //   setCountyName(fips2county[stateFips+countyFips]);

    //   fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
    //     .then(x => setVarMap(x));

      // local

      // fetch('/data/data.json').then(res => res.json())
      //   .then(x => setData(x));
      
      // fetch('/data/timeseries'+stateFips+'.json').then(res => res.json())
      //   .then(x => {
      //   let t = 0;
      //   let countyCases = 0;
      //   let stateCases = 0;
      //   let nationCases = 0;

      //   let countyDeaths = 0;
      //   let stateDeaths = 0;
      //   let nationDeaths = 0;
      //   _.each(x, (v, k)=>{
      //       if (k === stateFips + countyFips && v.length > 0 ){
      //         countyCases = v[v.length-1].caserate7dayfig;
      //         countyDeaths = v[v.length-1].covidmortality7dayfig;
      //       }else if(k.length===2 && v.length > 0 && v[v.length-1].t > t){
      //         stateCases = v[v.length-1].caserate7dayfig;
      //         stateDeaths = v[v.length-1].covidmortality7dayfig;
      //       }else if(k === "_nation" && v.length > 0 && v[v.length-1].t > t){
      //         nationCases = v[v.length-1].caserate7dayfig;
      //         nationDeaths = v[v.length-1].covidmortality7dayfig;
      //       }

      //     });

      //     setCountyCasesOutcome(countyCases.toFixed(0));
      //     setStateCasesOutcome(stateCases.toFixed(0));
      //     setNationCasesOutcome(nationCases.toFixed(0));

      //     setCountyDeathsOutcome(countyDeaths.toFixed(1));
      //     setStateDeathsOutcome(stateDeaths.toFixed(1));
      //     setNationDeathsOutcome(nationDeaths.toFixed(1));

      //     setDataTS(x);
      //   }
      // );
    // }
  // }, []);

  // useEffect(() => {
  //   fetch('/data/date.json').then(res => res.json())
  //     .then(x => setDate(x.date.substring(5,7) + "/" + x.date.substring(8,10) + "/" + x.date.substring(0,4)));


  // });

  // mongo
  useEffect(()=>{
    const configMatched = configs.find(s => s.fips === stateFips);
    if(!configMatched || !fips2county[stateFips+countyFips]){
      history.push('/');
    }else{
      setConfig(configMatched);
      setStateName(configMatched.name);
      setCountyName(fips2county[stateFips+countyFips]);
      fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
        .then(x => setVarMap(x));
    
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

        const fetchData = async() => { 
          //all static data
          const staticQ = { $or: [ {tag: "date"}, {tag: "nationalrawfull"}] };
          
          const promStatic = await CHED_static.find(staticQ,{projection:{}}).toArray();

          promStatic.forEach( i => {
            if(i.tag === "nationalrawfull"){ //race data
              setData(i.data);       
            }else if(i.tag === "date"){
              setDate(i.date.substring(5,7) + "/" + i.date.substring(8,10) + "/" + i.date.substring(0,4));
            }
          });
          // setData(promStatic[0].data);

          let seriesDict = {};
          let covidmortality7dayfig = 0;
          let t = 0;
          let countyCases = 0;
          let stateCases = 0;
          let nationCases = 0;

          let countyDeaths = 0;
          let stateDeaths = 0;
          let nationDeaths = 0;
          if( stateFips !== "_nation"){
            //Timeseries data
            const seriesQ = { $or: [ { state: "_n" } , { full_fips: stateFips } , {full_fips: "" + stateFips + countyFips}] }
            const prom = await CHED_series.find(seriesQ, {projection: {}}).toArray();
            _.map(prom, i=> {
              seriesDict[i[Object.keys(i)[4]]] = i[Object.keys(i)[5]];
              return seriesDict;
            });
            _.each(seriesDict, (v, k)=>{
              if (k === stateFips + countyFips && v.length > 0 ){
                countyCases = v[v.length-1].caserate7dayfig;
                countyDeaths = v[v.length-1].covidmortality7dayfig;
              }else if(k.length===2 && v.length > 0 && v[v.length-1].t > t){
                stateCases = v[v.length-1].caserate7dayfig;
                stateDeaths = v[v.length-1].covidmortality7dayfig;
              }else if(k === "_nation" && v.length > 0 && v[v.length-1].t > t){
                nationCases = v[v.length-1].caserate7dayfig;
                nationDeaths = v[v.length-1].covidmortality7dayfig;
              }

            });

            setCountyCasesOutcome(countyCases.toFixed(0));
            setStateCasesOutcome(stateCases.toFixed(0));
            setNationCasesOutcome(nationCases.toFixed(0));

            setCountyDeathsOutcome(countyDeaths.toFixed(1));
            setStateDeathsOutcome(stateDeaths.toFixed(1));
            setNationDeathsOutcome(nationDeaths.toFixed(1));

            setDataTS(seriesDict);
          }
          
          
        };
        fetchData();
    
      } else {
        handleAnonymousLogin();
      }
    }
  },[isLoggedIn]);


  if (data && varMap) {
    // console.log(data[stateFips]['casesfig']);
  return (
    <HEProvider> 
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '8em', minWidth: '1260px', paddingRight: 0, overflow: "hidden"}}>
          {config &&
          <div>
          <Breadcrumb style={{fontSize: "19px", paddingTop: "19px"}}>
            <Breadcrumb.Section style ={{color: "#397AB9"}} link onClick={() => history.push('/')}>United States</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "19px"}}/>
            <Breadcrumb.Section style ={{color: "#397AB9"}} link onClick={() => history.push('/'+stateFips)}>{stateName}</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "19px"}}/>
            <Breadcrumb.Section active>{countyName}</Breadcrumb.Section>
          </Breadcrumb>
          <div style={{fontWeight: 300, fontSize: "24pt", paddingTop: 30, paddingBottom: "19px"}}>
            <Header.Content>
              <b>{countyName}, {stateName}</b>
            </Header.Content>
          </div>

          <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '22pt', paddingBottom: 20}}> SUMMARY OF COVID-19 IN {countyName}, {stateName} </Divider>
              <div>
                <center style={{fontSize: "19px", fontWeight: 400, textAlign: "center"}}> COVID-19 Cases in {countyName} </center >
              </div>
          <Grid style={{paddingTop: '2em', width: "1260px", paddingBottom: "2em"}}>
            <Grid.Row style={{paddingLeft:20}}>

              <Table celled fixed singleLine>
                <Table.Header>

                  <tr textalign = "center" colSpan = "5" style = {{backgroundImage : 'url(/Emory_COVID_header_LightBlue.jpg)'}}>
                      <td colSpan='1' style={{width:220}}> </td>
                      <td colSpan='1' style={{width:200, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> TOTAL TO DATE</td>
                      <td colSpan='1' style={{width:200, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> TOTAL TO DATE PER 100,000</td>
                      <td colSpan='1' style={{width:200, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> DAILY AVERAGE</td>
                      <td colSpan='1' style={{width:200, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> DAILY AVERAGE PER 100,000</td>
                  </tr>
                  <Table.Row textAlign = 'center'>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {stateFips == "02"? countyName : countyName.match(/[^\s]+/)} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips + countyFips].casesfig=== "N/A"? "Loading..." : data["" + stateFips + countyFips].casesfig < 0?'0':data["" + stateFips + countyFips].casesfig.toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips + countyFips].caseratefig==="N/A"? "Loading..." : data["" + stateFips + countyFips].caseratefig < 0?'0':numberWithCommas(parseFloat(data["" + stateFips + countyFips].caseratefig).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips + countyFips].mean7daycases==="N/A"? "Loading..." : data["" + stateFips + countyFips].mean7daycases < 0?'0':numberWithCommas(parseFloat(data["" + stateFips + countyFips].mean7daycases).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips + countyFips].caserate7dayfig==="N/A"? "Loading..." : data["" + stateFips + countyFips].caserate7dayfig < 0?'0':numberWithCommas(parseFloat(data["" + stateFips + countyFips].caserate7dayfig).toFixed(0)).toLocaleString()} </Table.HeaderCell>

                  </Table.Row>
                  <Table.Row textAlign = 'center'>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {stateName} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips].casesfig==="N/A"? "Loading..." : data["" + stateFips].casesfig < 0?'0':data["" + stateFips].casesfig.toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips].caseratefig==="N/A"? "Loading..." : data["" + stateFips].caseratefig < 0?'0':numberWithCommas(parseFloat(data["" + stateFips].caseratefig).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips].mean7daycases==="N/A"? "Loading..." : data["" + stateFips].mean7daycases < 0?'0':numberWithCommas(parseFloat(data["" + stateFips].mean7daycases).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips].caserate7dayfig==="N/A"? "Loading..." : data["" + stateFips].caserate7dayfig < 0?'0':numberWithCommas(parseFloat(data["" + stateFips].caserate7dayfig).toFixed(0)).toLocaleString()} </Table.HeaderCell>

                  </Table.Row>
                </Table.Header>
              </Table>
            </Grid.Row>
          </Grid>
          <div>
            <center style={{fontSize: "19px", fontWeight: 400, textAlign: "center"}}> <br/>COVID-19 Deaths in {countyName} </center >
          </div>  
          <Grid style={{paddingTop: '2em', width: "1260px"}}>
            <Grid.Row style={{paddingLeft:20}}>
              <Table celled fixed singleLine>
                <Table.Header>
                  <tr textalign = 'center' colSpan = "5" style = {{backgroundImage : 'url(/Emory_COVID_header_LightBlue.jpg)'}}>
                    <td colSpan='1' style={{width:220}}> </td>
                    <td colSpan='1' style={{width:186, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> TOTAL TO DATE</td>
                    <td colSpan='1' style={{width:186, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> TOTAL TO DATE PER 100,000</td>
                    <td colSpan='1' style={{width:186, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> DAILY AVERAGE</td>
                    <td colSpan='1' style={{width:186, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> DAILY AVERAGE PER 100,000</td>
                    <td colSpan='1' style={{width:186, fontSize: '14px', textAlign : "center", font: "lato", fontWeight: 600, color: "#FFFFFF"}}> CASE FATALITY RATIO</td>
                  </tr>
                  <Table.Row textAlign = 'center'>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {stateFips == "02"? countyName :countyName.match(/[^\s]+/)} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips + countyFips].deathsfig==="N/A"? "Loading..." : data["" + stateFips + countyFips].deathsfig < 0?'0':data["" + stateFips + countyFips].deathsfig.toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips + countyFips].covidmortalityfig==="N/A"? "Loading..." : data["" + stateFips + countyFips].covidmortalityfig < 0?'0':numberWithCommas(parseFloat(data["" + stateFips + countyFips].covidmortalityfig).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips + countyFips].mean7daydeaths==="N/A"? "Loading..." : data["" + stateFips + countyFips].mean7daydeaths < 0?'0':numberWithCommas(parseFloat(data["" + stateFips + countyFips].mean7daydeaths).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips + countyFips].covidmortality7dayfig==="N/A"? "Loading..." : data["" + stateFips + countyFips].covidmortality7dayfig < 0?'0':numberWithCommas(parseFloat(data["" + stateFips + countyFips].covidmortality7dayfig).toFixed(0)).toLocaleString()} </Table.HeaderCell> 
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips + countyFips].cfr==="N/A"? "Loading..." : data["" + stateFips + countyFips].cfr < 0?'0':numberWithCommas(parseFloat(data["" + stateFips + countyFips].cfr).toFixed(2)).toLocaleString() + "%"} </Table.HeaderCell>

                  </Table.Row>
                  <Table.Row textAlign = 'center'>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {stateName} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips].deathsfig==="N/A"? "Loading..." : data["" + stateFips].deathsfig < 0?'0':data["" + stateFips].deathsfig.toLocaleString()} </Table.HeaderCell> 
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips].covidmortalityfig==="N/A"? "Loading..." : data["" + stateFips].covidmortalityfig < 0?'0':numberWithCommas(parseFloat(data["" + stateFips].covidmortalityfig).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips].mean7daydeaths==="N/A"? "Loading..." : data["" + stateFips].mean7daydeaths < 0?'0':numberWithCommas(parseFloat(data["" + stateFips].mean7daydeaths).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips].covidmortality7dayfig==="N/A"? "Loading..." : data["" + stateFips].covidmortality7dayfig < 0?'0':numberWithCommas(parseFloat(data["" + stateFips].covidmortality7dayfig).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {data["" + stateFips].cfr==="N/A"? "Loading..." : data["" + stateFips].cfr < 0?'0':numberWithCommas(parseFloat(data["" + stateFips].cfr).toFixed(2)).toLocaleString() + "%"} </Table.HeaderCell>

                  </Table.Row>
                </Table.Header>
              </Table>
            </Grid.Row>

            <span style={{ color: '#000000', paddingTop: 20, fontSize:"19px"}}>Last updated on {date}</span>

          </Grid>
          <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '22pt', paddingTop: 51, paddingBottom: 40}}>COVID-19 Outcomes </Divider>
          <Grid columns={2} centered>
            <Grid.Row>
              <Grid.Column>
                <div style = {{paddingBottom: 20}}>
                  <Header.Content x={0} y={20} style={{fontSize: 20, fontWeight: 400}}>Average Daily COVID-19 Cases /100,000 </Header.Content>
                </div>
                      <svg width = "370" height = "40">
                          <rect x = {20} y = {12} width = "12" height = "2" style = {{fill: nationColor, strokeWidth:1, stroke: nationColor}}/>
                          <text x = {35} y = {20} style = {{ fontSize: "12pt"}}> USA</text>
                          <rect x = {87} y = {12} width = "12" height = "2" style = {{fill: stateColor, strokeWidth:1, stroke: stateColor}}/>
                          <text x = {102} y = {20} style = {{ fontSize: "12pt"}}> {stateName} </text>
                          <rect x = {stateName.length > 10? 230: 190} y = {12} width = "12" height = "2" style = {{fill: countyColor, strokeWidth:1, stroke: countyColor}}/>
                          <text x = {stateName.length > 10? 245: 205} y = {20} style = {{ fontSize: "12pt"}}> {countyName}</text>
                      </svg>
                <div style = {{height: 300}}>
                  { dataTS && <VictoryChart theme={VictoryTheme.material}
                    width={550}
                    height={300}       
                    padding={{left: 50, right: 60, top: 10, bottom: 40}}
                    containerComponent={<VictoryVoronoiContainer/>}
                    
                    >


                    <VictoryAxis
                      style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}}} 

                      tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}
                      tickValues={[
                        dataTS["_nation"][30].t,
                        dataTS["_nation"][91].t,
                        dataTS["_nation"][153].t,
                        dataTS["_nation"][214].t,
                        dataTS["_nation"][275].t,

                        

                        // dataTS["_nation"][0].t,
                        // dataTS["_nation"][61].t,
                        // dataTS["_nation"][122].t,
                        // dataTS["_nation"][183].t,
                        // dataTS["_nation"][244].t,
                        // dataTS["_nation"][306].t,
                        dataTS["_nation"][dataTS["_nation"].length-1].t]}/>
                    <VictoryAxis dependentAxis tickCount={5}
                      style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}}} 

                      tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                      />
                    <VictoryGroup 
                      colorScale={[nationColor, stateColor, countyColor]}
                    >
                      <VictoryLine data={dataTS["_nation"]}
                        x='t' y='caserate7dayfig'
                        labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.caserate7dayfig.toFixed(1)}`}
                        labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                        style={{
                            data: { strokeWidth: ({ active }) => active ? 3 : 2},
                        }}
                        />
                      <VictoryLine data={dataTS[stateFips]}
                        x='t' y='caserate7dayfig'
                        labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.caserate7dayfig.toFixed(1)}`}
                        labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                        style={{
                            data: { strokeWidth: ({ active }) => active ? 3 : 2},
                        }}
                        />
                      <VictoryLine data={dataTS[stateFips+countyFips]?dataTS[stateFips+countyFips]:dataTS["99999"]}
                        x='t' y='caserate7dayfig'
                        labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.caserate7dayfig.toFixed(1)}`}
                        labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                        style={{
                            data: { strokeWidth: ({ active }) => active ? 3 : 2},
                        }}

                        />
                    </VictoryGroup>
                  </VictoryChart>}
                </div>
              </Grid.Column>
              <Grid.Column >
                <div style = {{paddingBottom: 20}}>
                  <Header.Content x={0} y={20} style={{fontSize: 20, paddingBottom: 10, fontWeight: 400}}>Average Daily COVID-19 Deaths /100,000 </Header.Content>
                </div>
                  <svg width = "370" height = "40">
                      <rect x = {20} y = {12} width = "12" height = "2" style = {{fill: nationColor, strokeWidth:1, stroke: nationColor}}/>
                      <text x = {35} y = {20} style = {{ fontSize: "12pt"}}> USA</text>
                      <rect x = {87} y = {12} width = "12" height = "2" style = {{fill: stateColor, strokeWidth:1, stroke: stateColor}}/>
                      <text x = {102} y = {20} style = {{ fontSize: "12pt"}}> {stateName} </text>
                      <rect x = {stateName.length > 10? 230: 190} y = {12} width = "12" height = "2" style = {{fill: countyColor, strokeWidth:1, stroke: countyColor}}/>
                      <text x = {stateName.length > 10? 245: 205} y = {20} style = {{ fontSize: "12pt"}}> {countyName}</text>
                  </svg>
                  <div style = {{height: 300}}>
                    { dataTS && <VictoryChart theme={VictoryTheme.material}
                      width={550}
                      height={300}       
                      padding={{left: 50, right: 60, top: 10, bottom: 40}}
                      containerComponent={<VictoryVoronoiContainer/>}
                      
                      >

                      <VictoryAxis
                        style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}}} 
                        tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}
                        tickValues={[
                          dataTS["_nation"][30].t,
                          dataTS["_nation"][91].t,
                          dataTS["_nation"][153].t,
                          dataTS["_nation"][214].t,
                          dataTS["_nation"][275].t,
                          // dataTS["_nation"][0].t,
                          // dataTS["_nation"][61].t,
                          // dataTS["_nation"][122].t,
                          // dataTS["_nation"][183].t,
                          // dataTS["_nation"][244].t,
                          // dataTS["_nation"][306 ].t,

                          dataTS["_nation"][dataTS["_nation"].length-1].t]}/>
                      <VictoryAxis dependentAxis tickCount={5}
                        style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}}} 
                        tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                        />
                      <VictoryGroup 
                        colorScale={[nationColor, stateColor, countyColor]}
                      >
                        <VictoryLine data={dataTS["_nation"]}
                          x='t' y='covidmortality7dayfig'
                          labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.covidmortality7dayfig.toFixed(1)}`}
                          labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                          style={{
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                          }}
                          />
                        <VictoryLine data={dataTS[stateFips]}
                          x='t' y='covidmortality7dayfig'
                          labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.covidmortality7dayfig.toFixed(1)}`}
                          labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                          style={{
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                          }}
                          />
                        <VictoryLine data={dataTS[stateFips+countyFips]?dataTS[stateFips+countyFips]:dataTS["99999"]}
                          x='t' y='covidmortality7dayfig'
                          labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${datum.covidmortality7dayfig.toFixed(1)}`}
                          labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 50, y: 30 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                          style={{
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                          }}
                          />
                      </VictoryGroup>
                    </VictoryChart>}
                  </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2} style={{paddingBottom: 50}}>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 540, paddingLeft: 55}}>
                  <Header.Content style={{fontSize: "19px"}}>
                    <Header.Subheader style={{color: '#000000', fontWeight: 300, width: 540, fontSize: "19px", lineHeight: "16pt"}}>
                      As of <b>{date}</b>, the daily average of new COVID-19 cases<br/> 
                      in <b>{countyName}</b> numbered <b>{numberWithCommas(parseFloat(countyCasesOutcome))} case(s) per 100,000 residents</b>. In comparison, the daily average in {stateName} was <b>{numberWithCommas(parseFloat(stateCasesOutcome))}</b> case(s) per 100,000 and in the United States was <b>{numberWithCommas(parseFloat(nationCasesOutcome))}</b> case(s) per 100,000.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 550, paddingLeft: 55}}>
                  <Header.Content style={{fontSize: "19px"}}>
                    <Header.Subheader style={{color: '#000000', fontWeight: 300, width: 570, fontSize: "19px", lineHeight: "16pt"}}>
                      As of <b>{date}</b>, the daily average of new COVID-19 deaths<br/>
                      in <b>{countyName}</b> numbered <b>{numberWithCommas(parseFloat(countyDeathsOutcome))} death(s) per 100,000 residents</b>. In comparison, the daily average in {stateName} was <b>{numberWithCommas(parseFloat(stateDeathsOutcome))}</b> death(s) per 100,000 and in the United States was <b>{numberWithCommas(parseFloat(nationDeathsOutcome))}</b> death(s) per 100,000.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <span style={{color: '#000000', fontSize:"19px"}}>Last updated on {date}</span>

          <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '22pt', paddingTop: 40, paddingBottom: 10}}>County Characteristics</Divider>

          <center style = {{marginLeft: 250, paddingBottom: 20, width: 750}}>
            <Header as='h2' style={{fontWeight: 400, width: 750}}>
                  <Header.Content style={{fontSize: "19px"}}>
                    <Header.Subheader style={{color: '#000000', fontWeight: 300, width: 750, fontSize: "19px", lineHeight: "16pt"}}>
                      Social, economic, health and environmental factors impact an individual’s risk of infection and COVID-19 severity. 
                      Counties with large groups of vulnerable people may be disproportionately impacted by COVID-19. The table below shows {countyName}, {stateName}, 
                      and national statistics regarding the proportion of individuals falling into various high risk categories.
                      <br/> <br/>
                      <b>Note:</b> These are not characteristics of COVID-19.
                    </Header.Subheader>
                  </Header.Content>
                </Header>

          </center>
          <Grid>
            <Grid.Row columns={3}>                    
              <Grid.Column>
                <BarChart 
                  title="% African American" 
                  var="black" 
                  width={400}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} />
                <BarChart 
                  title="Community Vulnerability Index" 
                  var="ccvi" 
                  width={400}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} /> 
                <BarChart 
                  title="% Over 65 y/o" 
                  var="age65over" 
                  width={400}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} />
                  
              </Grid.Column>
              <Grid.Column>
                <BarChart 
                  title="% Hispanic or Latino" 
                  var="hispanic" 
                  width={400}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} />
                <BarChart 
                  title="% in Poverty" 
                  var="poverty" 
                  width={400}                 
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} />
                <BarChart 
                  title="% in Group Quarters" 
                  var="groupquater" 
                  width={400}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} />
                
              </Grid.Column>


              <Grid.Column>
                <BarChart 
                  title="Any Condition" 
                  var="anycondition"
                  width={400} 
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} />
                <BarChart 
                  title="% Uninsured" 
                  var="PCTUI" 
                  width={400}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} />
                <BarChart 
                  title="% Male" 
                  var="male" 
                  width={400}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} />
                
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{paddingTop: 0, paddingBottom: 25, paddingLeft: 15}}>
                                            <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "16pt"}}>
                                            *The state and national level measure of any chronic condition prevalence is computed with the average of all the counties and states.
                                            <br/>
                                            *The national level measures of COVID-19 Community Vulnerability Index and Residential Segregation Index are computed with the average of all the states.


                                            </text>
                                            <span style={{color: '#000000', fontSize:"19px"}}>Last updated on {date}</span>

                                    </Grid.Row>
          </Grid>

          <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '22pt', paddingTop: 54, paddingBottom: 25}}> County Characteristics and Outcomes</Divider>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
                <ScatterChart x="casesfig" y="deathsfig" 
                  showLegend={true}
                  varMap={varMap}
                  xlog={true} 
                  ylog={true} 
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
                  <Header.Content style={{marginLeft:"40%", marginTop: -35}}>
                    <Header.Content style={{fontWeight: 300, left: 50, paddingBottom:50, fontSize: "10pt", lineHeight: "19px"}}>
                      <b>{varMap["casesfig"].name}</b>
                    </Header.Content>
                  </Header.Content>
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="caseratefig" y="covidmortalityfig" 
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
                  <Header.Content style={{marginLeft:"40%", marginTop: -35}}>
                    <Header.Content style={{fontWeight: 300, left: 50, paddingBottom:50, fontSize: "10pt", lineHeight: "19px"}}>
                      <b>{varMap["caseratefig"].name}</b>
                    </Header.Content>
                  </Header.Content>
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME1" y="covidmortalityfig"
                 varMap={varMap} 
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
                  <Header.Content style={{marginLeft:"40%", marginTop: -35}}>
                    <Header.Content style={{fontWeight: 300, left: 50, paddingBottom:50, fontSize: "10pt", lineHeight: "19px"}}>
                      <b>{varMap["RPL_THEME1"].name}</b>
                    </Header.Content>
                  </Header.Content>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <ScatterChart x="RPL_THEME2" y="covidmortalityfig"
                  showLegend={true}
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
                  <Header.Content style={{marginLeft:"40%", marginTop: -35}}>
                    <Header.Content style={{fontWeight: 300, left: 50, paddingBottom:50, fontSize: "10pt", lineHeight: "19px"}}>
                      <b>{varMap["RPL_THEME2"].name}</b>
                    </Header.Content>
                  </Header.Content>
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME3" y="covidmortalityfig"
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
                  <Header.Content style={{marginLeft:"40%", marginTop: -35}}>
                    <Header.Content style={{fontWeight: 300, left: 50, paddingBottom:50, fontSize: "10pt", lineHeight: "19px"}}>
                      <b>{varMap["RPL_THEME3"].name}</b>
                    </Header.Content>
                  </Header.Content>
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME4" y="covidmortalityfig"
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
                  <Header.Content style={{marginLeft:"40%", marginTop: -35}}>
                    <Header.Content style={{fontWeight: 300, left: 50, paddingBottom:50, fontSize: "10pt", lineHeight: "19px"}}>
                      <b>{varMap["RPL_THEME4"].name}</b>
                    </Header.Content>
                  </Header.Content>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <ScatterChart x="popden" y="covidmortalityfig"
                  showLegend={true}
                  xlog={true}
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
                  <Header.Content style={{marginLeft:"40%", marginTop: -35}}>
                    <Header.Content style={{fontWeight: 300, left: 50, paddingBottom:50, fontSize: "10pt", lineHeight: "19px"}}>
                      <b>{varMap["popden"].name}</b>
                    </Header.Content>
                  </Header.Content>
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="hhincome" y="covidmortalityfig"
                  varMap={varMap}
                  xlog={true}
                  rescaleX={true}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
                  <Header.Content style={{marginLeft:"40%", marginTop: -35}}>
                    <Header.Content style={{fontWeight: 300, left: 50, paddingBottom:50, fontSize: "10pt", lineHeight: "19px"}}>
                      <b>{varMap["hhincome"].name}</b>
                    </Header.Content>
                  </Header.Content>
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="black" y="covidmortalityfig"
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
                  <Header.Content style={{marginLeft:"40%", marginTop: -35}}>
                    <Header.Content style={{fontWeight: 300, left: 50, paddingBottom:50, fontSize: "10pt", lineHeight: "19px"}}>
                      <b>{varMap["black"].name}</b>
                    </Header.Content>
                  </Header.Content>
              </Grid.Column>
            </Grid.Row>
            <span style={{color: '#000000', fontSize:"19px", paddingTop: "30px"}}>Last updated on {date}</span>

          </Grid>
          <Divider horizontal style={{fontWeight: 400, color: 'black', fontSize: '20pt', paddingTop: 54, paddingBottom: 20}}>Data Table</Divider>
          <Table striped compact basic='very' style={{fontSize: "19px"}}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>County Population Characteristics</Table.HeaderCell>
                <Table.HeaderCell>{countyName}</Table.HeaderCell>
                <Table.HeaderCell>{stateName}</Table.HeaderCell>
                <Table.HeaderCell>United States</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
                  {_.map(data[stateFips + countyFips],
                    (v, k) => {
                      var rmList = ["casesfig", "deathsfig", "dailycases", "dailydeaths", "mean7daycases", "mean7daydeaths", "covidmortalityfig"
                        , "caseratefig", "covidmortality7dayfig", "caserate7dayfig", "fips", "region", "urbanrural"];
                      if (!rmList.includes(k)) {
                        return (
                          <Table.Row key={k}>
                            <Table.Cell>{varMap[k] ? varMap[k].name: k}</Table.Cell>
                            <Table.Cell>{isNaN(v) ? v : varMap[k].name === "Socioeconomic Vulnerability" || 
                                                        varMap[k].name === "Household Composition Vulnerability" || 
                                                        varMap[k].name === "Minority/Language Vulnerability" || 
                                                        varMap[k].name === "Housing/Transportaion Vulnerability" ||
                                                        varMap[k].name === "% Native American" || 
                                                        varMap[k].name === "% in Group Quarters" ||
                                                        varMap[k].name === "COVID-19 Community Vulnerability Index"? 
                                                        numberWithCommas(parseFloat(v).toFixed(1)): k === "urbanrural_text" ? 
                                                        v : numberWithCommas(parseFloat(v).toFixed(0))}</Table.Cell>
                            <Table.Cell>{isNaN(data[stateFips][k]) ? data[stateFips][k] : (numberWithCommas(parseFloat(data[stateFips][k]).toFixed(0)) === "NaN" || k === "region_text") ? "" : 
                                                        varMap[k].name === "% Native American" || varMap[k].name === "% in Group Quarters" ? numberWithCommas(parseFloat(data[stateFips][k]).toFixed(1)) : numberWithCommas(parseFloat(data[stateFips][k]).toFixed(0))}</Table.Cell>
                            <Table.Cell>{isNaN(data['_nation'][k]) ? data[stateFips][k] : numberWithCommas(parseFloat(data['_nation'][k]).toFixed(0)) === "NaN" ? "" : 
                                                        varMap[k].name === "% Native American" || varMap[k].name === "% in Group Quarters" ? numberWithCommas(parseFloat(data['_nation'][k]).toFixed(1)) : numberWithCommas(parseFloat(data['_nation'][k]).toFixed(0))}</Table.Cell>
                          </Table.Row>
                        )
                      }
                    })}
                </Table.Body>
            </Table>
            <a style ={{color: "#397AB9", fontSize: "19px", marginLeft: 12}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> Data Sources and Definitions</a>

            <Divider hidden/>
            <span style={{color: '#000000', fontSize:"19px"}}>Last updated on {date}</span>

            </div>
          }
          <Notes />
        </Container>
        <ReactTooltip>{tooltipContent}</ReactTooltip>
      </div>
    </HEProvider>
    );
  } else{
    return <Loader active inline='centered' />
  }



}