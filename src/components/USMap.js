import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, List, Loader } from 'semantic-ui-react'
import AppBar from './AppBar';
import { geoCentroid } from "d3-geo";
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import Marker from './Marker';
import Annotation from './Annotation';
import ReactTooltip from "react-tooltip";
import { VictoryChart, 
  VictoryGroup, 
  VictoryBar, 
  VictoryTheme, 
  VictoryAxis, 
  VictoryLegend,
  VictoryLine } from 'victory';
import { useHistory } from "react-router-dom";
import Notes from './Notes';


const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";


function MapLabels(props){

  const offsets = {
    VT: [50, -8],
    NH: [34, 2],
    MA: [30, -1],
    RI: [28, 2],
    CT: [35, 10],
    NJ: [34, 1],
    DE: [33, 0],
    MD: [47, 10],
    DC: [49, 21]
  };

  return (
    <svg>
      {props.geographies.map(geo => {
          const centroid = geoCentroid(geo);
          const cur = props.stateLabels.find(s => s.val === geo.id);
          return (
            <g key={geo.rsmKey + "-name"}>
              {cur &&
                centroid[0] > -160 &&
                centroid[0] < -67 &&
                (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                  <Marker coordinates={centroid}>
                    <text y="2" fontSize={14} textAnchor="middle">
                      {cur.id}
                    </text>
                  </Marker>
                ) : (
                  <Annotation
                    subject={centroid}
                    dx={offsets[cur.id][0]}
                    dy={offsets[cur.id][1]}
                  >
                    <text x={4} fontSize={14} alignmentBaseline="middle">
                      {cur.id}
                    </text>
                  </Annotation>
                ))}
            </g>
          );
        })}
    </svg>
    );
}

export default function USMap(props) {

  const [stateName, setStateName] = useState('{State}');
  const [fips, setFips] = useState('');
  const [tooltipContent, setTooltipContent] = useState('');
  const history = useHistory();
  const [dataBar, setDataBar] = useState();
  const [dataLine, setDataLine] = useState();
  const [stateLabels, setStateLabels] = useState();

  useEffect(() => {

    fetch('/emory-covid19/data/barchartNV.json').then(res => res.json())
      .then(data => setDataBar(data));
    
    fetch('/emory-covid19/data/linechartNV.json').then(res => res.json())
      .then(data => setDataLine(data));

    fetch('/emory-covid19/data/allstates.json').then(res => res.json())
      .then(data => setStateLabels(data));

  }, [])

  if (dataBar && dataLine && stateLabels) {

  return (
      <div>
        <AppBar />
        <Container style={{marginTop: '8em'}}>
          <Breadcrumb>
            <Breadcrumb.Section active>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </Breadcrumb>
          <Header as='h2'>
            <Header.Content>
              Health Determinants impact COVID-19 Outcomes
              <Header.Subheader>The impact of COVID-19 is not equal to everybody. </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={12}>
                <ComposableMap 
                  projection="geoAlbersUsa" 
                  data-tip=""
                  width={800} 
                  height={600}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) => 
                      <svg>
                        {geographies.map(geo => (
                          <Geography
                            key={geo.rsmKey}
                            stroke="#FFF"
                            geography={geo}
                            onMouseEnter={()=>{ 
                              setFips(geo.id);
                              setStateName(geo.properties.name); 
                              setTooltipContent('Click to see county-level data')
                            }}
                            onMouseLeave={()=>{
                              setTooltipContent("")
                            }}
                            onClick={()=>{
                              history.push("/emory-covid19/"+geo.id+"");
                            }}
                            style={{
                              default: {
                                fill: "#bdbfc1",
                                outline: "none"
                              },
                              hover: {
                                fill: "#df7a1c",
                                outline: "none"
                              },
                              pressed: {
                                fill: "#df7a1c",
                                outline: "none"
                              }
                            }}
                          />
                        ))}
                        <MapLabels geographies={geographies} stateLabels={stateLabels}/>
                      </svg>
                    }
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column width={4}>
                <Header>
                Statistics of {stateName}
                </Header>
                <Grid.Row>
                  <VictoryChart theme={VictoryTheme.material}
                  height={250}
                  scale={{y: 'log'}}
                  minDomain={{y:1}}>
                    <VictoryLegend
                      x={10} y={10}
                      orientation="horizontal"
                      colorScale={["#df7a1c", "#333333"]}
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
                      colorScale={["#df7a1c", "#333333"]}
                    >
                      <VictoryLine data={dataLine[fips]}
                        x='t' y='case'
                        />
                      <VictoryLine data={dataLine[fips]}
                        x='t' y='death'
                        />
                    </VictoryGroup>
                  </VictoryChart>
                </Grid.Row>
                <Grid.Row>
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={12}
                    padding={{left: 150, top: 50, bottom: 50}}
                    height={400}
                  >
                    <VictoryLegend
                      x={10} y={10}
                      orientation="horizontal"
                      colorScale={["#bdbfc1", "#df7a1c"]}
                      data ={[
                        {name: "nation"}, {name: "state"}
                        ]}
                    />
                    <VictoryAxis />
                    <VictoryAxis dependentAxis tickCount={2}/>
                    <VictoryGroup horizontal
                      offset={10}
                      style={{data: {width: 6}}}
                      colorScale={["#bdbfc1", "#df7a1c"]}
                    >
                      <VictoryBar
                        data={dataBar['nation']}
                        x="nameShort"
                        y="value"
                      />
                      <VictoryBar
                        data={dataBar[fips]}
                        x="nameShort"
                        y="value"
                      />
                    </VictoryGroup>
                  </VictoryChart>
                </Grid.Row>
                <Grid.Row>
                  <span style={{fontSize: '0.8em', color: '#bdbfc1'}}>
                  Data last updated: MM/DD/YYYY <br/>
                  Data sources: TBD
                  </span>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Notes />
        </Container>
        <ReactTooltip>{tooltipContent}</ReactTooltip>
      </div>
      );
  } else {
    return <Loader active inline='centered' />
  }
}