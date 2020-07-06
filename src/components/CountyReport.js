import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, Loader, Statistic, Table, Divider } from 'semantic-ui-react'
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

const countyColor = '#f2a900';
const stateColor = '#b2b3b3';
const nationColor = '#d9d9d7';

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
      width={400}
      height={300}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 80, right: 20, top: 50, bottom: 50}}>
      {props.showLegend && <VictoryLegend
        x={10} y={10}
        orientation="horizontal"
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
        style={{ data: { fill: ({datum}) => datum.fips===(props.stateFips + props.countyFips)?countyColor:stateColor,
                 fillOpacity: ({datum}) => datum.fips===(props.stateFips + props.countyFips)?1.0:0.7} }}
        size={4}
        x={props.x}
        y={props.y}
        labels={({ datum }) => `${datum[props.y].toFixed(1)}`}
        labelComponent={<VictoryTooltip cornerRadius={4} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}

      />
      <VictoryAxis label={props.varMap[props.x]?props.varMap[props.x].name:props.x}
        tickCount={4}
        tickFormat={(y) => (props.rescaleX?(Math.round(y/1000)+'k'):(Math.round(y*100)/100))} />
      <VictoryAxis dependentAxis label={props.varMap[props.y]?props.varMap[props.y].name:props.y} 
        style={{ axisLabel: {padding: 40} }}
        tickCount={5}
        tickFormat={(y) => (Math.round(y*100)/100)} />
    </VictoryChart>);

}

function BarChart(props) {
  const colors = {"USA": nationColor, 
                  stateName: stateColor, 
                  countyName: countyColor};
  if (props.countyFips !== "_nation" && props.stateFips !== "_nation") {

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={props.width || 560}
      height={140}       
      domainPadding={10}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 165, right: 50, top: 40, bottom: 50}}
      containerComponent={<VictoryContainer responsive={false}/>}>
      <VictoryLabel text={props.title} x={(props.width || 560)/2} y={30} textAnchor="middle"/>
      <VictoryAxis style={{tickLabels: {fontSize: 14}}}/>
      <VictoryAxis dependentAxis style={{tickLabels: {fontSize: 14}}}/>
      <VictoryBar
        horizontal
        barRatio={0.8}
        labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
        data={[{key: 'USA', 'value': props.data['_nation'][props.var] || 0},
              {key: props.stateName, 'value': props.data[props.stateFips][props.var] > 0? props.data[props.stateFips][props.var] : 0},
              {key: props.countyName, 'value': props.data[props.stateFips+props.countyFips][props.var] > 0 ? props.data[props.stateFips+props.countyFips][props.var] : 0}]}
        labelComponent={<VictoryLabel dx={5} style={{fill: ({datum}) => datum.key === props.countyName?countyColor:datum.key === props.stateName?stateColor:nationColor }}/>}
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

  let { stateFips, countyFips } = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyName, setCountyName] = useState('');
  const history = useHistory();
  const [data, setData] = useState();
  const [dataTS, setDataTS] = useState();
  const [tooltipContent, setTooltipContent] = useState('');
  const [covidMetric, setCovidMetric] = useState({cases: 'N/A', deaths: 'N/A', 
                                                  caseRate: "N/A", mortality: "N/A", 
                                                  caseRateMean: "N/A", mortalityMean: "N/A",
                                                  caseRateMA: "N/A", mortalityMA: "N/A",
                                                  cfr:"N/A", t: 'n/a'});
  const [varMap, setVarMap] = useState({});

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

      fetch('/data/data.json').then(res => res.json())
        .then(x => setData(x));
      
      fetch('/data/timeseries'+stateFips+'.json').then(res => res.json())
        .then(x => setDataTS(x));
    }
  }, [stateFips]);

  useEffect(() => {
    if (dataTS && dataTS[stateFips+countyFips]){
      setCovidMetric(_.takeRight(dataTS[stateFips+countyFips])[0]);
    }
  }, [dataTS])


  if (data && dataTS && varMap) {

  return (
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '8em', minWidth: '1260px', paddingRight: 0}}>
          {config &&
          <div>
          <Breadcrumb>
            <Breadcrumb.Section link onClick={() => history.push('/')}>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section link onClick={() => history.push('/'+stateFips)}>{stateName}</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section active>{countyName}</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </Breadcrumb>
          <Header as='h1' style={{fontWeight: 300}}>
            <Header.Content>
              Covid-19 Health Equity Report for <span style={{color: countyColor}}>{countyName}</span>
              <Header.Subheader style={{fontWeight: 300}}>
              See how health determinants impact COVID-19 outcomes. 
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid style={{paddingTop: '2em', width: "1260px"}}>
            <Grid.Row style={{ paddingTop: '2em', paddingLeft:20}}>
              <Table celled fixed singleLine>
                <Table.Header>
                  <Table.Row textAlign = 'center'>
                    <Table.HeaderCell colSpan='1' style={{width:150}}> </Table.HeaderCell>

                    <Table.HeaderCell colSpan='1' style={{width:200}}> TOTAL TO DATE</Table.HeaderCell>
                    <Table.HeaderCell colSpan='1' style={{width:200}}> TOTAL TO DATE PER 100,000</Table.HeaderCell>
                    <Table.HeaderCell colSpan='1' style={{width:200}}> DAILY AVERAGE</Table.HeaderCell>
                    <Table.HeaderCell colSpan='1' style={{width:200}}> DAILY AVERAGE PER 100,000</Table.HeaderCell>
                    <Table.HeaderCell colSpan='1' style={{width:200}}> CASE FATALITY RATIO</Table.HeaderCell>
                  </Table.Row>
                  <Table.Row textAlign = 'center'>
                    <Table.HeaderCell > Cases </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {covidMetric.cases===null || covidMetric.cases < 0?'0':covidMetric.cases.toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {covidMetric.caseRate===null || covidMetric.caseRate < 0?'0':numberWithCommas(parseFloat(covidMetric.caseRate).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {covidMetric.caseRateMean===null || covidMetric.caseRateMean < 0?'0':numberWithCommas(parseFloat(covidMetric.caseRateMean).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {covidMetric.caseRateMA===null || covidMetric.caseRateMA < 0?'0':numberWithCommas(parseFloat(covidMetric.caseRateMA).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> Deaths : Cases </Table.HeaderCell>

                  </Table.Row>
                  <Table.Row textAlign = 'center'>
                    <Table.HeaderCell > Deaths </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {covidMetric.deaths===null || covidMetric.deaths < 0?'0':covidMetric.deaths.toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {covidMetric.mortality===null || covidMetric.mortality < 0?'0':numberWithCommas(parseFloat(covidMetric.mortality).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {covidMetric.mortalityMean===null || covidMetric.mortalityMean < 0?'0':numberWithCommas(parseFloat(covidMetric.mortalityMean).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {covidMetric.mortalityMA===null || covidMetric.mortalityMA < 0?'0':numberWithCommas(parseFloat(covidMetric.mortalityMA).toFixed(0)).toLocaleString()} </Table.HeaderCell>
                    <Table.HeaderCell style={{fontSize: '24px'}}> {covidMetric.cfr===null || covidMetric.cfr < 0?'0':numberWithCommas(parseFloat(covidMetric.cfr).toFixed(2)).toLocaleString()} </Table.HeaderCell>

                  </Table.Row>
                </Table.Header>
              </Table>
            </Grid.Row>

            <span style={{paddingBottom: "1em", color: '#bdbfc1'}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>

          </Grid>
          <Divider horizontal style={{fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em'}}>COVID-19 Outcomes </Divider>
          <Grid columns={2} centered>
            <Grid.Row>
              <Grid.Column>
                <text x={0} y={20} style={{fontSize: '1.0em', paddingBottom: 0, fontWeight: 400}}>Average Daily COVID-19 Cases /100,000 </text>

                <VictoryChart theme={VictoryTheme.material}
                  width={550}
                  height={300}       
                  padding={{left: 50, right: 60, top: 60, bottom: 30}}
                  containerComponent={<VictoryVoronoiContainer/>}
                  
                  >
                  <VictoryLegend
                    x={40} y={25}
                    orientation="horizontal"
                    colorScale={[nationColor, stateColor, countyColor]}
                    data ={[
                            {name: "USA   "}, {name: stateName }, {name: countyName}
                      ]}
                  />

                  <VictoryAxis
                    tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}
                    tickValues={[
                      dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/4)*3 - 1].t,
                      dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/4)*2 - 1].t,
                      dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/4) - 1].t,
                      dataTS["_nation"][dataTS["_nation"].length-1].t]}/>
                  <VictoryAxis dependentAxis tickCount={5}
                    tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                    />
                  <VictoryGroup 
                    colorScale={[nationColor, stateColor, countyColor]}
                  >
                    <VictoryLine data={dataTS["_nation"]}
                      x='t' y='caseRateMA'
                      labels={({ datum }) => `${new Date(datum.t*1000).toLocaleDateString()}: ${datum.caseRateMA.toFixed(1)}`}
                      labelComponent={<VictoryTooltip flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                      style={{
                          data: { strokeWidth: ({ active }) => active ? 3 : 2},
                      }}
                      />
                    <VictoryLine data={dataTS[stateFips]}
                      x='t' y='caseRateMA'
                      labels={({ datum }) => `${new Date(datum.t*1000).toLocaleDateString()}: ${datum.caseRateMA.toFixed(1)}`}
                      labelComponent={<VictoryTooltip flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                      style={{
                          data: { strokeWidth: ({ active }) => active ? 3 : 2},
                      }}
                      />
                    <VictoryLine data={dataTS[stateFips+countyFips]?dataTS[stateFips+countyFips]:dataTS["99999"]}
                      x='t' y='caseRateMA'
                      labels={({ datum }) => `${new Date(datum.t*1000).toLocaleDateString()}: ${datum.caseRateMA.toFixed(1)}`}
                      labelComponent={<VictoryTooltip flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                      style={{
                          data: { strokeWidth: ({ active }) => active ? 3 : 2},
                      }}

                      />
                  </VictoryGroup>
                </VictoryChart>
              </Grid.Column>
              <Grid.Column>
                <text x={0} y={20} style={{fontSize: '1.0em', paddingBottom: 0, fontWeight: 400}}>Average Daily COVID-19 Deaths /100,000 </text>

                <VictoryChart theme={VictoryTheme.material}
                  width={550}
                  height={300}       
                  padding={{left: 50, right: 60, top: 60, bottom: 30}}
                  containerComponent={<VictoryVoronoiContainer/>}
                  
                  >
                  <VictoryLegend
                    x={40} y={25}
                    orientation="horizontal"
                    colorScale={[nationColor, stateColor, countyColor]}
                    data ={[
                            {name: "USA   "}, {name: stateName }, {name: countyName}
                      ]}
                  />
                  <VictoryAxis
                    tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}
                    tickValues={[
                      dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/4)*3 - 1].t,
                      dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/4)*2 - 1].t,
                      dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/4) - 1].t,
                      dataTS["_nation"][dataTS["_nation"].length-1].t]}/>
                  <VictoryAxis dependentAxis tickCount={5}
                    tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                    />
                  <VictoryGroup 
                    colorScale={[nationColor, stateColor, countyColor]}
                  >
                    <VictoryLine data={dataTS["_nation"]}
                      x='t' y='mortalityMA'
                      labels={({ datum }) => `${new Date(datum.t*1000).toLocaleDateString()}: ${datum.mortalityMA.toFixed(1)}`}
                      labelComponent={<VictoryTooltip flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                      style={{
                          data: { strokeWidth: ({ active }) => active ? 3 : 2},
                      }}
                      />
                    <VictoryLine data={dataTS[stateFips]}
                      x='t' y='mortalityMA'
                      labels={({ datum }) => `${new Date(datum.t*1000).toLocaleDateString()}: ${datum.mortalityMA.toFixed(1)}`}
                      labelComponent={<VictoryTooltip flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                      style={{
                          data: { strokeWidth: ({ active }) => active ? 3 : 2},
                      }}
                      />
                    <VictoryLine data={dataTS[stateFips+countyFips]?dataTS[stateFips+countyFips]:dataTS["99999"]}
                      x='t' y='mortalityMA'
                      labels={({ datum }) => `${new Date(datum.t*1000).toLocaleDateString()}: ${datum.mortalityMA.toFixed(1)}`}
                      labelComponent={<VictoryTooltip flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                      style={{
                          data: { strokeWidth: ({ active }) => active ? 3 : 2},
                      }}
                      />
                  </VictoryGroup>
                </VictoryChart>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <BarChart 
                  title="Average Daily COVID-19 Cases per 100,000" 
                  var="caserate7dayfig" 
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <BarChart 
                  title="Average Daily COVID-19 Deaths per 100,000" 
                  var="covidmortality7dayfig" 
                  stateFips={stateFips}
                  countyFips={countyFips}
                  countyName={countyName}
                  stateName={stateName}
                  data={data} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <span style={{color: '#bdbfc1'}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>

          <Divider horizontal style={{fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em'}}>County Characteristics</Divider>
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
                  title="% Diabetes" 
                  var="diabetes" 
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
                  title="% Obese" 
                  var="obesity"
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
            <span style={{color: '#bdbfc1'}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>
          </Grid>

          <Divider horizontal style={{fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em'}}>Bivariate Relationships of Outcomes and Exposure Variables</Divider>
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
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="caseratefig" y="covidmortalityfig" 
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME1" y="covidmortalityfig"
                 varMap={varMap} 
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
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
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME3" y="covidmortalityfig"
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME4" y="covidmortalityfig"
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
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
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="black" y="covidmortalityfig"
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
            </Grid.Row>
            <span style={{color: '#bdbfc1'}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>

          </Grid>
          <Divider horizontal style={{fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em'}}>Data Table</Divider>
          <Table striped compact basic='very'>
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
                        , "caseratefig", "covidmortality7dayfig", "caserate7dayfig", "fips"];
                      if (!rmList.includes(k)) {
                        return (
                          <Table.Row key={k}>
                            <Table.Cell>{varMap[k] ? varMap[k].name : k}</Table.Cell>
                            <Table.Cell>{isNaN(v) ? v : (Math.round(v * 100) / 100)}</Table.Cell>
                            <Table.Cell>{isNaN(data[stateFips][k]) ? data[stateFips][k] : (Math.round(data[stateFips][k] * 100) / 100)}</Table.Cell>
                            <Table.Cell>{isNaN(data['_nation'][k]) ? data['_nation'][k] : (Math.round(data['_nation'][k] * 100) / 100)}</Table.Cell>
                          </Table.Row>
                        )
                      }
                    })}
                </Table.Body>
          </Table>
          <span style={{color: '#bdbfc1'}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>

          </div>
        }
        <Notes />
      </Container>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
    );
  } else{
    return <Loader active inline='centered' />
  }



}