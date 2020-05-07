import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, Loader, Dimmer, Segment } from 'semantic-ui-react'
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

export default function CountyMap() {

  let { stateFips, countyFips, countyName } = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
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
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={8}>
                <ComposableMap projection="geoAlbersUsa" 
                  projectionConfig={{scale:`${config.scale}`}} 
                  width={500} 
                  height={600} 
                  offsetX={config.offsetX}
                  offsetY={config.offsetY}>
                  <Geographies geography={config.url}>
                    {({geographies}) => geographies.map(geo =>
                      countyFips===geo.properties.COUNTYFP?
                      <Geography 
                        key={geo.rsmKey} 
                        geography={geo} 
                        style={{
                              default: {
                                fill: "#e31b23",
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
                            }}/>:
                      <Geography 
                        key={geo.rsmKey} 
                        geography={geo} 
                        style={{
                              default: {
                                fill: "#ffcf82",
                                stroke: '#fff'
                              },
                              hover: {
                                fill: "#ffcf82",
                                outline: "none"
                              },
                              pressed: {
                                fill: "#ffcf82",
                                outline: "none"
                              }
                            }}/>
                    )}
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column width={8}>
                <Dimmer.Dimmable as={Segment} dimmed={true}>
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
                        }}
                        onMouseEnter={()=>{
                        }}
                        onMouseLeave={()=>{
                          setTooltipContent("")
                        }}
                        style={{
                              default: {
                                fill: "#d0b5ca",
                                stroke: '#fff'
                              },
                              hover: {
                                fill: "#7c2b83",
                                outline: "none"
                              },
                              pressed: {
                                fill: "#7c2b83",
                                outline: "none"
                              }
                            }}/>
                    )}
                  </Geographies>
                </ComposableMap>
                </Dimmer.Dimmable>
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