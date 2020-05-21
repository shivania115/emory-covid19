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

function ScatterChart(props) {

  return (
    <VictoryChart
      width={400}
      height={300}
      scale={{x: props.xlog?'log':'linear', y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 80, right: 10, top: 50, bottom: 50}}>
      <VictoryLegend
        x={10} y={10}
        orientation="horizontal"
        colorScale={["#bdbfc1", "#0033a0"]}
        data ={[
          {name: ('Other counties in '+ props.stateName)}, {name: props.countyName}
          ]}
      />
      <VictoryScatter
        data={_.filter(_.map(props.data, (d, k)=>{d.fips=k; return d;}), (d)=> (
                 d.fips.length===5 &&
                 d.fips.substring(0,2)===props.stateFips &&
                 d[props.x] && d[props.y]))}
        sortKey={(d) => d.fips===(props.stateFips + props.countyFips)}
        style={{ data: { fill: ({datum}) => datum.fips===(props.stateFips + props.countyFips)?"#0033a0":"#bdbfc1",
                 fillOpacity: ({datum}) => datum.fips===(props.stateFips + props.countyFips)?1.0:0.5} }}
        size={5}
        x={props.x}
        y={props.y}
      />
      <VictoryAxis label={props.x}
        tickCount={5}
        tickFormat={(y) => (Math.round(y*100)/100)} />
      <VictoryAxis dependentAxis label={props.y} 
        style={{ axisLabel: {padding: 40} }}
        tickCount={5}
        tickFormat={(y) => (Math.round(y*100)/100)} />
    </VictoryChart>);

}

function BarChart(props) {
  const colors = {"nation": "#f2a900", 
                  "state": "#84754e", 
                  "county": "#0033a0"};
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={props.width || 560}
      height={140}       
      domainPadding={10}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 60, right: 10, top: 40, bottom: 50}}
      containerComponent={<VictoryContainer responsive={false}/>}
    >
      <VictoryLabel text={props.title} x={(props.width || 560)/2} y={30} textAnchor="middle"/>
      <VictoryAxis/>
      <VictoryAxis dependentAxis/>
      <VictoryBar
        horizontal
        data={[{key: 'nation', 'value': props.data['_nation'][props.var] || 0},
              {key: 'state', 'value': props.data[props.stateFips][props.var] || 0},
              {key: 'county', 'value': props.data[props.stateFips+props.countyFips][props.var] || 0}]}
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
  const scatterX0 = 'COVID Mortality / 100k';
  const scatterX1 = 'COVID Case Rate / 1M';
  const scatterX2 = '% Over 65 Yrs';
  const scatterX3 = '% Poverty';
  const scatterX4 = '% Unemployed';
  const scatterX5 = '% Diabetes';
  const scatterX6 = '% Obesity';
  const scatterX7 = '% Hispanics';
  const scatterX8 = '% Blacks';

  useEffect(()=>{

    const configMatched = configs.find(s => s.fips === stateFips);
    setConfig(configMatched);
    setStateName(configMatched.name);
    setCountyName(fips2county[stateFips+countyFips]);

    fetch('/emory-covid19/data/data.json').then(res => res.json())
      .then(x => setData(x));
    
    fetch('/emory-covid19/data/timeseries'+stateFips+'.json').then(res => res.json())
      .then(x => setDataTS(x));

  }, [stateFips]);

  useEffect(() => {
    if (data && dataTS[stateFips+countyFips]){
      setCovidMetric(_.takeRight(dataTS[stateFips+countyFips])[0]);
    }
  }, [dataTS])

  if (data && dataTS) {

  return (
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '8em'}}>
          {config &&
          <div>
          <Breadcrumb>
            <Breadcrumb.Section link onClick={() => history.push('/emory-covid19')}>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section link onClick={() => history.push('/emory-covid19/'+stateFips)}>{stateName}</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section active>{countyName}</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </Breadcrumb>
          <Header as='h2'>
            <Header.Content>
              Covid-19 Health Equity Report for {countyName}
              <Header.Subheader>
              Health determinants impact COVID-19 outcomes. 
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
          <Grid columns={2} centered>
            <Grid.Row>
              <Grid.Column>
                <VictoryChart theme={VictoryTheme.material}
                  width={550}
                  height={300}       
                  padding={{left: 50, right: 10, top: 60, bottom: 30}}>
                  <VictoryLabel text="Average Daily COVID-19 Cases / 100,000" x={140} y={20} textAnchor="middle"/>
                  <VictoryLegend
                    x={10} y={35}
                    orientation="horizontal"
                    colorScale={["#f2a900", "#84754e", "#0033a0"]}
                    data ={[
                      {name: "nation"}, {name: "state"}, {name: "county"}
                      ]}
                  />
                  <VictoryAxis
                    tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                  <VictoryAxis dependentAxis tickCount={5}
                    tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                    />
                  <VictoryGroup 
                    colorScale={["#f2a900", "#84754e", "#0033a0"]}
                  >
                    <VictoryLine data={dataTS["_nation"]}
                      x='t' y='caseRateMA'
                      />
                    <VictoryLine data={dataTS[stateFips]}
                      x='t' y='caseRateMA'
                      />
                    <VictoryLine data={dataTS[stateFips+countyFips]?dataTS[stateFips+countyFips]:dataTS["_"]}
                      x='t' y='caseRateMA'
                      />
                  </VictoryGroup>
                </VictoryChart>
              </Grid.Column>
              <Grid.Column>
                <VictoryChart theme={VictoryTheme.material}
                  width={550}
                  height={300}       
                  padding={{left: 50, right: 10, top: 60, bottom: 30}}>
                  <VictoryLabel text="Average Daily COVID-19 Deaths / 100,000" x={140} y={20} textAnchor="middle"/>
                  <VictoryLegend
                    x={10} y={35}
                    orientation="horizontal"
                    colorScale={["#f2a900", "#84754e", "#0033a0"]}
                    data ={[
                      {name: "nation"}, {name: "state"}, {name: "county"}
                      ]}
                  />
                  <VictoryAxis
                    tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                  <VictoryAxis dependentAxis tickCount={5}
                    tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                    />
                  <VictoryGroup 
                    colorScale={["#f2a900", "#84754e", "#0033a0"]}
                  >
                    <VictoryLine data={dataTS["_nation"]}
                      x='t' y='mortalityMA'
                      />
                    <VictoryLine data={dataTS[stateFips]}
                      x='t' y='mortalityMA'
                      />
                    <VictoryLine data={dataTS[stateFips+countyFips]?dataTS[stateFips+countyFips]:dataTS["_"]}
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
          <Divider/>
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
          <Grid columns={1} textAlign='center'>
            <Grid.Row>
              <Grid.Column style={{fontWeight: 400}}>
              {'Statistics of '+countyName + ' and Other Counties in '+ stateName}
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
                <ScatterChart x="cases" y="deaths" 
                  xlog={true} 
                  ylog={true} 
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="mean7daycases" y="mean7daydeaths" 
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME1" y="mean7daydeaths" 
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            <Grid.Column>
                <ScatterChart x="RPL_THEME2" y="mean7daydeaths" 
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME3" y="mean7daydeaths" 
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
              <Grid.Column>
                <ScatterChart x="RPL_THEME4" y="mean7daydeaths" 
                  stateName={stateName}
                  countyName={countyName}
                  countyFips={countyFips} 
                  stateFips={stateFips}
                  data={data} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Header as='h4'>
            <Header.Content>
              Data Table
            </Header.Content>
          </Header>
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
                  <Table.Cell>{k}</Table.Cell>
                  <Table.Cell>{Math.round(v*100)/100}</Table.Cell>
                  <Table.Cell>{Math.round(data[stateFips][k]*100)/100}</Table.Cell>
                  <Table.Cell>{Math.round(data['_nation'][k]*100)/100}</Table.Cell>
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