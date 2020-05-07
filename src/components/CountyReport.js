import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, Loader, Statistic, Table, Divider } from 'semantic-ui-react'
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { VictoryChart, 
  VictoryGroup, 
  VictoryBar, 
  VictoryTheme, 
  VictoryAxis, 
  VictoryLegend,
  VictoryLine,
  VictoryLabel, 
VictoryScatter} from 'victory';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import fips2county from './fips2county.json'
import configs from "./state_config.json";
import _ from 'lodash';

export default function CountyReport() {

  let { stateFips, countyFips } = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyName, setCountyName] = useState('');
  const history = useHistory();
  const [dataBar, setDataBar] = useState();
  const [dataLine, setDataLine] = useState();
  const [tooltipContent, setTooltipContent] = useState('');
  const [covidMetric, setCovidMetric] = useState({case: 'N/A', death: 'N/A', t: 'n/a'});
  const scatterX0 = 'COVID Mortality / 100k';
  const scatterX1 = 'COVID Case Rate / 1M';
  const scatterX2 = '% Over 65 Yrs';
  const scatterX3 = '% Poverty';
  const scatterX4 = '% Unemployed';

  useEffect(()=>{

    const configMatched = configs.find(s => s.fips === stateFips);
    setConfig(configMatched);
    setStateName(configMatched.name);
    setCountyName(fips2county[stateFips+countyFips]);

    fetch('/emory-covid19/data/barchartSV'+stateFips+'.json').then(res => res.json())
      .then(data => setDataBar(data));
    
    fetch('/emory-covid19/data/linechartSV'+stateFips+'.json').then(res => res.json())
      .then(data => setDataLine(data));

  }, [stateFips]);

  useEffect(() => {
    if (dataLine && dataLine[countyFips]){
      setCovidMetric(_.takeRight(dataLine[countyFips])[0]);
    }
  }, [dataLine])

  if (dataBar && dataLine) {

  return (
      <div>
        <AppBar />
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
              Covid-19 Outcomes in {countyName}
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
                    {covidMetric.case.toLocaleString()}
                  </Statistic.Value>
                  <Statistic.Label>Cases</Statistic.Label>
                </Statistic>
                <Statistic style={{paddingLeft: '2em'}} size='small'>
                  <Statistic.Value>
                    {covidMetric.death.toLocaleString()}
                  </Statistic.Value>
                  <Statistic.Label>Death</Statistic.Label>
                </Statistic>
                <span style={{padding: '3em', color: '#bdbfc1'}}>Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}</span>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
                <VictoryChart theme={VictoryTheme.material}
                  height={250}
                  scale={{y: 'log'}}
                  padding={{left: 50, right: 10, top: 60, bottom: 30}}
                  minDomain={{y:1}}>
                  <VictoryLabel text="Cases & Deaths over Time" x={180} y={20} textAnchor="middle"/>
                  <VictoryLegend
                    x={10} y={35}
                    orientation="horizontal"
                    colorScale={["#e31b23", "#333333"]}
                    data ={[
                      {name: "cases"}, {name: "deaths"}
                      ]}
                  />
                  <VictoryAxis tickCount={2}
                    tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                  <VictoryAxis dependentAxis tickCount={5}
                    tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                    />
                  <VictoryGroup 
                    colorScale={["#e31b23", "#333333"]}
                  >
                    <VictoryLine data={dataLine[countyFips]?dataLine[countyFips]:dataLine[""]}
                      x='t' y='case'
                      />
                    <VictoryLine data={dataLine[countyFips]?dataLine[countyFips]:dataLine[""]}
                      x='t' y='death'
                      />
                  </VictoryGroup>  
                </VictoryChart>
              </Grid.Column>
              <Grid.Column>
                <VictoryChart theme={VictoryTheme.material}
                  height={250}
                  scale={{y: 'log'}}
                  padding={{left: 50, right: 10, top: 60, bottom: 30}}
                  minDomain={{y:1}}>
                  <VictoryLabel text="County vs. State Cases over Time" x={180} y={20} textAnchor="middle"/>
                  <VictoryLegend
                    x={10} y={35}
                    orientation="horizontal"
                    colorScale={["#df7a1c", "#e31b23"]}
                    data ={[
                      {name: "state cases"}, {name: "county cases"}
                      ]}
                  />
                  <VictoryAxis tickCount={2}
                    tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                  <VictoryAxis dependentAxis tickCount={5}
                    tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                    />
                  <VictoryGroup 
                    colorScale={["#df7a1c", "#e31b23"]}
                  >
                    <VictoryLine data={dataLine['state']}
                      x='t' y='case'
                      />
                    <VictoryLine data={dataLine[countyFips]?dataLine[countyFips]:dataLine[""]}
                      x='t' y='case'
                      />
                  </VictoryGroup>  
                </VictoryChart>
              </Grid.Column>
              <Grid.Column>
                <VictoryChart theme={VictoryTheme.material}
                  height={250}
                  scale={{y: 'log'}}
                  padding={{left: 50, right: 10, top: 60, bottom: 30}}
                  minDomain={{y:1}}>
                  <VictoryLabel text="County vs. State Deaths over Time" x={180} y={20} textAnchor="middle"/>
                  <VictoryLegend
                    x={10} y={35}
                    orientation="horizontal"
                    colorScale={["#df7a1c", "#e31b23"]}
                    data ={[
                      {name: "state deaths"}, {name: "county deaths"}
                      ]}
                  />
                  <VictoryAxis tickCount={2}
                    tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                  <VictoryAxis dependentAxis tickCount={5}
                    tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                    />
                  <VictoryGroup 
                    colorScale={["#df7a1c", "#e31b23"]}
                  >
                    <VictoryLine data={dataLine['state']}
                      x='t' y='death'
                      />
                    <VictoryLine data={dataLine[countyFips]?dataLine[countyFips]:dataLine[""]}
                      x='t' y='death'
                      />
                  </VictoryGroup>  
                </VictoryChart>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={1}>
            <Grid.Row>
              <Grid.Column>
                <VictoryChart
                  theme={VictoryTheme.material}
                  domainPadding={20}
                  width={960}
                  height={300}
                  padding={{left: 50, right: 10, top: 60, bottom: 80}}
                >
                  <VictoryLabel text="Heatlh Determinants and COVID Statistics" x={480} y={20} textAnchor="middle"/>
                  <VictoryLegend
                    x={80} y={40}
                    orientation="horizontal"
                    colorScale={["#bdbfc1", "#f4c082", "#e31b23"]}
                    data ={[
                      {name: "nation"}, {name: "state"}, {name: "county"}
                      ]}
                  />
                  <VictoryGroup
                    offset={10}
                    style={{data: {width: 5}}}
                    colorScale={["#bdbfc1", "#f4c082", "#e31b23"]}
                  >
                    <VictoryBar
                      data={_.sortBy(dataBar.nation, 'seq')}
                      x="nameShort"
                      y="value"
                    />
                    <VictoryBar
                      data={_.sortBy(dataBar.state, 'seq')}
                      x="nameShort"
                      y="value"
                    />
                    <VictoryBar
                      data={_.sortBy(dataBar[countyFips], 'seq')}
                      x="nameShort"
                      y="value"
                    />
                  </VictoryGroup>
                  <VictoryAxis tickLabelComponent={<VictoryLabel angle={-45} textAnchor="end" style={{fontSize: '8px'}}/>} /> 
                  <VictoryAxis dependentAxis/> 
                </VictoryChart>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={1} textAlign='center'>
            <Grid.Row>
              <Grid.Column>
              <small style={{fontWeight: 700}}>{'Statistics of '+countyName + ' and Other Counties in '+ stateName}</small>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={4}>
            <Grid.Row>
              <Grid.Column>
                <VictoryChart
                  width={400}
                  height={300}
                  padding={{left: 80, right: 10, top: 50, bottom: 50}}>
                  <VictoryLegend
                    x={10} y={10}
                    orientation="horizontal"
                    colorScale={["#bdbfc1", "#e31b23"]}
                    data ={[
                      {name: ('Other counties in '+ stateName)}, {name: countyName}
                      ]}
                  />
                  <VictoryScatter
                    sortKey={(d) => d.fips===countyFips}
                    style={{ data: { fill: ({datum}) => datum.fips===countyFips?"#e31b23":"#bdbfc1",
                             fillOpacity: ({datum}) => datum.fips===countyFips?1.0:0.5} }}
                    data={_.filter(dataBar['scatter'], (d)=> (d[scatterX0] && d[scatterX1]))}
                    size={5}
                    x={scatterX1}
                    y={scatterX0}
                  />
                  <VictoryAxis label={scatterX1}/>
                  <VictoryAxis dependentAxis label={scatterX0} style={{ axisLabel: {padding: 40} }} />
                </VictoryChart>
              </Grid.Column>
              <Grid.Column>
                <VictoryChart
                  width={400}
                  height={300}
                  padding={{left: 80, right: 10, top: 50, bottom: 50}}>
                  <VictoryScatter
                    sortKey={(d) => d.fips===countyFips}
                    style={{ data: { fill: ({datum}) => datum.fips===countyFips?"#e31b23":"#bdbfc1",
                             fillOpacity: ({datum}) => datum.fips===countyFips?1.0:0.5} }}
                    data={_.filter(dataBar['scatter'], (d)=> (d[scatterX0] && d[scatterX2]))}
                    size={5}
                    x={scatterX2}
                    y={scatterX0}
                  />
                  <VictoryAxis label={scatterX2}/>
                  <VictoryAxis dependentAxis label={scatterX0} style={{ axisLabel: {padding: 40} }} />
                </VictoryChart>
              </Grid.Column>
              <Grid.Column>
                <VictoryChart
                  width={400}
                  height={300}
                  padding={{left: 80, right: 10, top: 50, bottom: 50}}>
                  <VictoryScatter
                    sortKey={(d) => d.fips===countyFips}
                    style={{ data: { fill: ({datum}) => datum.fips===countyFips?"#e31b23":"#bdbfc1",
                             fillOpacity: ({datum}) => datum.fips===countyFips?1.0:0.5} }}
                    data={_.filter(dataBar['scatter'], (d)=> (d[scatterX1] && d[scatterX3]))}
                    size={5}
                    x={scatterX3}
                    y={scatterX1}
                  />
                  <VictoryAxis label={scatterX3}/>
                  <VictoryAxis dependentAxis label={scatterX1} style={{ axisLabel: {padding: 40} }} />
                </VictoryChart>
              </Grid.Column>
              <Grid.Column>
                <VictoryChart
                  width={400}
                  height={300}
                  padding={{left: 80, right: 10, top: 50, bottom: 50}}>
                  <VictoryScatter
                    sortKey={(d) => d.fips===countyFips}
                    style={{ data: { fill: ({datum}) => datum.fips===countyFips?"#e31b23":"#bdbfc1",
                             fillOpacity: ({datum}) => datum.fips===countyFips?1.0:0.5} }}
                    data={_.filter(dataBar['scatter'], (d)=> (d[scatterX1] && d[scatterX4]))}
                    size={5}
                    x={scatterX4}
                    y={scatterX1}
                  />
                  <VictoryAxis label={scatterX4}/>
                  <VictoryAxis dependentAxis label={scatterX1} style={{ axisLabel: {padding: 40} }} />
                </VictoryChart>
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
              {_.map(_.sortBy(dataBar[countyFips], 'seq'), 
                (d) => (<Table.Row key={d.nameShort}>
                  <Table.Cell>{d.nameShort}</Table.Cell>
                  <Table.Cell>{Math.round(d.value*100)/100}</Table.Cell>
                  <Table.Cell>{Math.round(_.find(dataBar.state, (x) => x.name==d.name).value*100)/100}</Table.Cell>
                  <Table.Cell>{Math.round(_.find(dataBar.nation, (x) => x.name==d.name).value*100)/100}</Table.Cell>
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