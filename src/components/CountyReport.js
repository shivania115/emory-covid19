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

function ScatterChart(props) {

  return (
    <VictoryChart
      width={400}
      height={300}
      scale={{x: props.xlog?'log':'linear', y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 80, right: 10, top: 50, bottom: 50}}>
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
                 d[props.x] && d[props.y]))}
        sortKey={(d) => d.fips===(props.stateFips + props.countyFips)}
        style={{ data: { fill: ({datum}) => datum.fips===(props.stateFips + props.countyFips)?countyColor:stateColor,
                 fillOpacity: ({datum}) => datum.fips===(props.stateFips + props.countyFips)?1.0:0.7} }}
        size={4}
        x={props.x}
        y={props.y}
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
  const colors = {"nation": nationColor, 
                  "state": stateColor, 
                  "county": countyColor};
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={props.width || 560}
      height={140}       
      domainPadding={10}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 60, right: 50, top: 40, bottom: 50}}
      containerComponent={<VictoryContainer responsive={false}/>}
    >
      <VictoryLabel text={props.title} x={(props.width || 560)/2} y={30} textAnchor="middle"/>
      <VictoryAxis/>
      <VictoryAxis dependentAxis/>
      <VictoryBar
        horizontal
        barRatio={0.8}
        labels={({ datum }) => (Math.round(datum.value*100)/100)}
        data={[{key: 'nation', 'value': props.data['_nation'][props.var] || 0},
              {key: 'state', 'value': props.data[props.stateFips][props.var] || 0},
              {key: 'county', 'value': props.data[props.stateFips+props.countyFips][props.var] || 0}]}
        labelComponent={<VictoryLabel dx={5} style={{fill: ({datum}) => colors[datum.key] }}/>}
        style={{
          data: {
            fill: ({ datum }) => colors[datum.key]
          }
        }}
        x="key"
        y="value"
      />
    </VictoryChart>);
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
  const [covidMetric, setCovidMetric] = useState({cases: 'N/A', deaths: 'N/A', t: 'n/a'});
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
        <Container style={{marginTop: '8em', minWidth: '960px'}}>
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
          <Grid style={{paddingTop: '2em'}}>
            <Grid.Row>
              <Grid.Column>
                <Statistic size='small'>
                  <Statistic.Value>
                    {covidMetric.cases===null?'0':covidMetric.cases.toLocaleString()}
                  </Statistic.Value>
                  <Statistic.Label>Total Cases</Statistic.Label>
                </Statistic>
                <Statistic style={{paddingLeft: '2em'}} size='small'>
                  <Statistic.Value>
                    {covidMetric.deaths===null?'0':covidMetric.deaths.toLocaleString()}
                  </Statistic.Value>
                  <Statistic.Label>Total Deaths</Statistic.Label>
                </Statistic>
                <span style={{padding: '3em', color: '#bdbfc1'}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider horizontal style={{fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em'}}>COVID-19 Outcome Variables</Divider>
          <Grid columns={2} centered>
            <Grid.Row>
              <Grid.Column>
                <VictoryChart theme={VictoryTheme.material}
                  width={550}
                  height={300}       
                  padding={{left: 50, right: 60, top: 60, bottom: 30}}>
                  <VictoryLabel text="Average Daily COVID-19 Cases / 100,000" x={140} y={20} textAnchor="middle"/>
                  <VictoryLegend
                    x={10} y={35}
                    orientation="horizontal"
                    colorScale={[nationColor, stateColor, countyColor]}
                    data ={[
                      {name: "nation"}, {name: "state"}, {name: "county"}
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
                      />
                    <VictoryLine data={dataTS[stateFips]}
                      x='t' y='caseRateMA'
                      />
                    <VictoryLine data={dataTS[stateFips+countyFips]?dataTS[stateFips+countyFips]:dataTS["99999"]}
                      x='t' y='caseRateMA'
                      />
                  </VictoryGroup>
                </VictoryChart>
              </Grid.Column>
              <Grid.Column>
                <VictoryChart theme={VictoryTheme.material}
                  width={550}
                  height={300}       
                  padding={{left: 50, right: 60, top: 60, bottom: 30}}>
                  <VictoryLabel text="Average Daily COVID-19 Deaths / 100,000" x={140} y={20} textAnchor="middle"/>
                  <VictoryLegend
                    x={10} y={35}
                    orientation="horizontal"
                    colorScale={[nationColor, stateColor, countyColor]}
                    data ={[
                      {name: "nation"}, {name: "state"}, {name: "county"}
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
                      />
                    <VictoryLine data={dataTS[stateFips]}
                      x='t' y='mortalityMA'
                      />
                    <VictoryLine data={dataTS[stateFips+countyFips]?dataTS[stateFips+countyFips]:dataTS["99999"]}
                      x='t' y='mortalityMA'
                      />
                  </VictoryGroup>
                </VictoryChart>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <BarChart 
                  title="" 
                  var="caserate7day" 
                  stateFips={stateFips}
                  countyFips={countyFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <BarChart 
                  title="" 
                  var="covidmortality7day" 
                  stateFips={stateFips}
                  countyFips={countyFips}
                  data={data} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider horizontal style={{fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em'}}>Exposure Variables</Divider>
          <Grid>
            <Grid.Row columns={3}>                    
              <Grid.Column>
                <BarChart 
                  title="% African American" 
                  var="black" 
                  width={350}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  data={data} />
                <BarChart 
                  title="% in Poverty" 
                  var="poverty" 
                  width={350}                 
                  stateFips={stateFips}
                  countyFips={countyFips}
                  data={data} />
                <BarChart 
                  title="% Uninsured" 
                  var="PCTUI" 
                  width={350}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  data={data} />  
              </Grid.Column>
              <Grid.Column>
                <BarChart 
                  title="% Diabetes" 
                  var="diabetes" 
                  width={350}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  data={data} /> 
                <BarChart 
                  title="% Obese" 
                  var="obesity"
                  width={350} 
                  stateFips={stateFips}
                  countyFips={countyFips}
                  data={data} />
                <BarChart 
                  title="% Over 65 y/o" 
                  var="age65over" 
                  width={350}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <BarChart 
                  title="% in Group Quarters" 
                  var="groupquater" 
                  width={350}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  data={data} />
                <BarChart 
                  title="% Male" 
                  var="male" 
                  width={350}
                  stateFips={stateFips}
                  countyFips={countyFips}
                  data={data} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider horizontal style={{fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em'}}>Bivariate Relationships of Outcomes and Exposure Variables</Divider>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
                <ScatterChart x="cases" y="deaths" 
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
                <ScatterChart x="caserate" y="covidmortality" 
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME1" y="covidmortality"
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
                <ScatterChart x="RPL_THEME2" y="covidmortality"
                  showLegend={true}
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME3" y="covidmortality"
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME4" y="covidmortality"
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
                <ScatterChart x="popden" y="covidmortality"
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
                <ScatterChart x="hhincome" y="covidmortality"
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
                <ScatterChart x="black" y="covidmortality"
                  varMap={varMap}
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider horizontal style={{fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em'}}>Data Table</Divider>
          <Table striped compact basic='very'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Variable Name</Table.HeaderCell>
                <Table.HeaderCell>{countyName}</Table.HeaderCell>
                <Table.HeaderCell>{stateName}</Table.HeaderCell>
                <Table.HeaderCell>United States</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.map(data[stateFips+countyFips], 
                (v, k) => (<Table.Row key={k}>
                  <Table.Cell>{varMap[k]?varMap[k].name:k}</Table.Cell>
                  <Table.Cell>{isNaN(v)?v:(Math.round(v*100)/100)}</Table.Cell>
                  <Table.Cell>{isNaN(data[stateFips][k])?data[stateFips][k]:(Math.round(data[stateFips][k]*100)/100)}</Table.Cell>
                  <Table.Cell>{isNaN(data['_nation'][k])?data['_nation'][k]:(Math.round(data['_nation'][k]*100)/100)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
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