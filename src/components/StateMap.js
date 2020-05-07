import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, Loader } from 'semantic-ui-react'
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
        <AppBar />
        <Container style={{marginTop: '8em'}}>
          {config &&
          <div>
          <Breadcrumb>
            <Breadcrumb.Section link onClick={() => history.push('/emory-covid19')}>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section active>{stateName}</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </Breadcrumb>
          <Header as='h2'>
            <Header.Content>
              Covid-19 Outcomes in {stateName}
              <Header.Subheader>
              Health determinants impact COVID-19 outcomes. 
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={8}>
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
                                fill: "#ffcf82",
                                stroke: '#fff'
                              },
                              hover: {
                                fill: "#e31b23",
                                outline: "none"
                              },
                              pressed: {
                                fill: "#e31b23",
                                outline: "none"
                              }
                            }}/>
                    )}
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header>Statistics of {countyName}</Header>
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
                        minDomain={{y:1}}>
                        <VictoryLegend
                          x={10} y={10}
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
                          <VictoryLine data={dataLine.state}
                            x='t' y='case'
                            />
                          <VictoryLine data={dataLine[countyFips]?dataLine[countyFips]:dataLine[""]}
                            x='t' y='case'
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
                          colorScale={["#bdbfc1", "#f4c082", "#e31b23"]}
                        >
                          <VictoryBar
                            data={dataBar.nation.slice(6)}
                            x="nameShort"
                            y="value"
                          />
                          <VictoryBar
                            data={dataBar.state.slice(6)}
                            x="nameShort"
                            y="value"
                          />
                          <VictoryBar
                            data={dataBar[countyFips].slice(6)}
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
                          colorScale={["#bdbfc1", "#f4c082", "#e31b23"]}
                          data ={[
                            {name: "nation"}, {name: "state"}, {name: "county"}
                            ]}
                        />
                        <VictoryAxis />
                        <VictoryAxis dependentAxis tickCount={2}/>
                        <VictoryGroup horizontal
                          offset={10}
                          style={{data: {width: 7}}}
                          colorScale={["#bdbfc1", "#f4c082", "#e31b23"]}
                        >
                          <VictoryBar
                            data={dataBar.nation.slice(0,6)}
                            x="nameShort"
                            y="value"
                          />
                          <VictoryBar
                            data={dataBar.state.slice(0,6)}
                            x="nameShort"
                            y="value"
                          />
                          <VictoryBar
                            data={dataBar[countyFips].slice(0,6)}
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