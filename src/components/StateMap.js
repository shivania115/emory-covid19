import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, Loader, Divider } from 'semantic-ui-react'
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
  VictoryLine } from 'victory';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";


import configs from "./state_config.json";

//import dataState from "../data/data_state.json";
//import dataCountyPct from "../data/data_county_pct.json";

export default function StateMap(props) {

  let { stateFips } = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyFips, setCountyFips] = useState('');
  const [countyName, setCountyName] = useState('{County}');
  const history = useHistory();
  const [dataBar, setDataBar] = useState();
  const [dataLine, setDataLine] = useState();
  const [tooltipContent, setTooltipContent] = useState('');


  useEffect(()=>{
    
    const configMatched = configs.find(s => s.fips === stateFips);

    setConfig(configMatched);

    setStateName(configMatched.name);

    fetch('/emory-covid19/data/barchartSV'+stateFips+'.json').then(res => res.json())
      .then(data => setDataBar(data));
    
    fetch('/emory-covid19/data/linechartSV'+stateFips+'.json').then(res => res.json())
      .then(data => setDataLine(data));

  }, [stateFips]);

  if (dataBar && dataLine) {

  return (
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '8em'}}>
          {config &&
          <div>
          <Breadcrumb>
            <Breadcrumb.Section link onClick={() => history.push('/emory-covid19')}>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section active>{stateName}</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </Breadcrumb>
          <Divider hidden/>
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header as='h2' style={{fontWeight: 400}}>
                  <Header.Content>
                    Covid-19 Outcomes in {stateName}
                    <Header.Subheader style={{fontWeight: 300}}>
                    Health determinants impact COVID-19 outcomes. 
                    </Header.Subheader>
                    <Header.Subheader style={{fontWeight: 300}}>Click on a state below to drill down to your county data.</Header.Subheader>
                  </Header.Content>
                </Header>
                <ComposableMap projection="geoAlbersUsa" 
                  projectionConfig={{scale:`${config.scale}`}} 
                  width={500} 
                  height={600} 
                  data-tip=""
                  offsetX={config.offsetX}
                  offsetY={config.offsetY}>
                  <Geographies geography={config.url}>
                    {({geographies}) => geographies.map(geo =>
                      <Geography 
                        key={geo.rsmKey} 
                        geography={geo} 
                        onClick={()=>{
                          history.push("/emory-covid19/" + stateFips + "/" +geo.properties.COUNTYFP);
                        }}
                        onMouseEnter={()=>{
                          setCountyFips(geo.properties.COUNTYFP);
                          setCountyName(geo.properties.NAME);
                          setTooltipContent('Click to see more county data');
                        }}
                        onMouseLeave={()=>{
                          setTooltipContent("")
                        }}
                        style={{
                              default: {
                                fill: "#d0d0ce",
                                stroke: '#fff'
                              },
                              hover: {
                                fill: "#0033a0",
                                outline: "none"
                              },
                              pressed: {
                                fill: "#0033a0",
                                outline: "none"
                              }
                            }}/>
                    )}
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header style={{fontWeight: 400}}>
                  <Header.Content>
                    Statistics of {countyName}
                    <Header.Subheader style={{fontWeight: 300}}>
                      New cases and new deaths are shown in 7-days moving averages.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <VictoryChart theme={VictoryTheme.material}
                        height={250}
                        scale={{y: 'log'}}
                        minDomain={{y:1}}>
                        <VictoryLegend
                          x={10} y={10}
                          orientation="horizontal"
                          colorScale={["#0033a0", "#da291c"]}
                          data ={[
                            {name: "new cases"}, {name: "new deaths"}
                            ]}
                        />
                        <VictoryAxis tickCount={2}
                          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                          tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                          />
                        <VictoryGroup 
                          colorScale={["#0033a0", "#da291c"]}
                        >
                          <VictoryLine data={dataLine[countyFips]?dataLine[countyFips]:dataLine[""]}
                            x='t' y='dcase'
                            />
                          <VictoryLine data={dataLine[countyFips]?dataLine[countyFips]:dataLine[""]}
                            x='t' y='ddeath'
                            />
                        </VictoryGroup>  
                      </VictoryChart>
                    </Grid.Column>
                    <Grid.Column>
                      <VictoryChart theme={VictoryTheme.material}
                        height={250}       
                        scale={{y: 'log'}}                 
                        minDomain={{y:1}}>
                        <VictoryLegend
                          x={10} y={10}
                          orientation="horizontal"
                          colorScale={["#f2a900", "#0033a0"]}
                          data ={[
                            {name: "state new cases"}, {name: "county new cases"}
                            ]}
                        />
                        <VictoryAxis tickCount={2}
                          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                          tickFormat={(y) => (y<1000?y:(y/1000+'k'))}

                          />
                        <VictoryGroup 
                          colorScale={["#f2a900", "#0033a0"]}
                        >
                          <VictoryLine data={dataLine._state}
                            x='t' y='dcase'
                            />
                          <VictoryLine data={dataLine[countyFips]?dataLine[countyFips]:dataLine[""]}
                            x='t' y='dcase'
                            />
                        </VictoryGroup>
                      </VictoryChart>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <VictoryChart
                        theme={VictoryTheme.material}
                        domainPadding={20}
                        padding={{left: 150, top: 50, bottom: 50}}
                        height={400}
                      >
                        <VictoryAxis />
                        <VictoryAxis dependentAxis tickCount={2}/>
                        <VictoryGroup horizontal
                          offset={10}
                          style={{data: {width: 7}}}
                          colorScale={["#b1b3b3", "#d0d0ce", "#0033a0"]}
                        >
                          <VictoryBar
                            data={dataBar._nation.slice(6)}
                            x="nameShort"
                            y="value"
                          />
                          <VictoryBar
                            data={dataBar._state.slice(6)}
                            x="nameShort"
                            y="value"
                          />
                          <VictoryBar
                            data={dataBar[countyFips]?dataBar[countyFips].slice(6):[]}
                            x="nameShort"
                            y="value"
                          />
                        </VictoryGroup>
                      </VictoryChart>
                    </Grid.Column>
                    <Grid.Column>
                      <VictoryChart
                        theme={VictoryTheme.material}
                        domainPadding={20}
                        padding={{left: 150, top: 50, bottom: 50}}
                        height={400}
                      >
                        <VictoryLegend
                          x={10} y={10}
                          orientation="horizontal"
                          colorScale={["#b1b3b3", "#d0d0ce", "#0033a0"]}
                          data ={[
                            {name: "nation"}, {name: "state"}, {name: "county"}
                            ]}
                        />
                        <VictoryAxis />
                        <VictoryAxis dependentAxis tickCount={2}/>
                        <VictoryGroup horizontal
                          offset={10}
                          style={{data: {width: 7}}}
                          colorScale={["#b1b3b3", "#d0d0ce", "#0033a0"]}
                        >
                          <VictoryBar
                            data={dataBar._nation.slice(0,6)}
                            x="nameShort"
                            y="value"
                          />
                          <VictoryBar
                            data={dataBar._state.slice(0,6)}
                            x="nameShort"
                            y="value"
                          />
                          <VictoryBar
                            data={dataBar[countyFips]?dataBar[countyFips].slice(0,6):[]}
                            x="nameShort"
                            y="value"
                          />
                        </VictoryGroup>
                      </VictoryChart>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            
          </Grid>
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