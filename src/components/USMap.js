import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, List, Loader, Divider } from 'semantic-ui-react'
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
  VictoryLine,  
  VictoryLabel, 
  VictoryScatter,
} from 'victory';
import { useHistory } from "react-router-dom";
import Notes from './Notes';
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";
import configs from "./state_config.json";


//const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"

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
    DC: [49, 21],
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
                    <text y="2" fontSize={14} textAnchor="middle" fill="#eee">
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

  const [stateName, setStateName] = useState('Georgia');
  const [fips, setFips] = useState('13');
  const [tooltipContent, setTooltipContent] = useState('');
  const history = useHistory();
  const [dataScatter, setDataScatter] = useState();
  const [dataBar, setDataBar] = useState();
  //const [dataLine, setDataLine] = useState();
  const [stateLabels, setStateLabels] = useState();
  const [colorScale, setColorScale] = useState();


  useEffect(() => {

    fetch('/emory-covid19/data/data_county.json').then(res => res.json())
      .then(data => {
        setDataBar(data);
        const cs = scaleQuantile()
        .domain(_.map(data, d=>d['covidmortalitycounty']))
        .range([
          "#3ea9dc",
          "#3b9dd1",
          "#3890c7",
          "#3484bd",
          "#317ab5",
          "#2964a2",
          "#1d478a",
          "#0d2e75",
          "#012169",
        ]);
      let scaleMap = {}
      _.each(data, d=>{
        scaleMap[d['covidmortalitycounty']] = cs(d['covidmortalitycounty'])});
      setColorScale(scaleMap);
      });
    
    //fetch('/emory-covid19/data/linechartNV.json').then(res => res.json())
    //  .then(data => setDataLine(data));

    fetch('/emory-covid19/data/allstates.json').then(res => res.json())
      .then(data => setStateLabels(data));

    fetch('/emory-covid19/data/scatter.json').then(res => res.json())
      .then(data => setDataScatter(data));
  }, [])

  if (dataBar && dataScatter && stateLabels) {

  return (
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '8em'}}>
          <Breadcrumb>
            <Breadcrumb.Section active>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </Breadcrumb>
          <Divider hidden />
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={9}>
                <Header as='h2' style={{fontWeight: 400}}>
                  <Header.Content>
                    The health impacts of COVID-19 vary dramatically 
                    from community to community. <br/>
                    How does your community compare?
                    <Header.Subheader style={{fontWeight: 300}}>Click on a state below to drill down to your county data.</Header.Subheader>
                  </Header.Content>
                </Header>
                <ComposableMap 
                  projection="geoAlbersUsa" 
                  data-tip=""
                  width={600} 
                  height={450}
                  projectionConfig={{scale: 750}}
                   >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) => 
                      <svg>
                        {geographies.map(geo => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={()=>{
                              //console.log(geo); 
                              const stateFips = geo.id.substring(0,2);
                              const configMatched = configs.find(s => s.fips === stateFips);

                              setFips(stateFips);
                              setStateName(configMatched.name);
                              //setStateName(geo.id.substring(0,2));
                              //setStateName(geo.properties.name); 
                              setTooltipContent('Click to see county-level data')
                            }}
                            onMouseLeave={()=>{
                              setTooltipContent("")
                            }}
                            onClick={()=>{
                              history.push("/emory-covid19/"+geo.id.substring(0,2)+"");
                            }}
                            fill={fips===geo.id.substring(0,2)?'#f2a900':
                            ((colorScale && dataBar[geo.id] && dataBar[geo.id]['covidmortalitycounty'])?
                                colorScale[dataBar[geo.id]['covidmortalitycounty']] : "#41b7e7")}
                          />
                        ))}
                        <MapLabels geographies={geographies} stateLabels={stateLabels}/>
                      </svg>
                    }
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header style={{fontWeight: 400}}>
                  <Header.Content>
                    A Snapshot of Health Disparities in {stateName}
                    <Header.Subheader style={{fontWeight: 300}}>
                      This is one example of health disparities regarding the impacts of COVID-19. 
                      As can be seen, the proportion of African American residents is correlated with COVID-19 mortality.
                      Drill down to your county data by clicking on the map.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <Grid>
                  <Grid.Row>
                    <VictoryChart
                      width={500}
                      height={400}
                      scale={{y: 'log'}}
                      padding={{left: 100, right: 50, top: 50, bottom: 50}}>
                      <VictoryLegend
                        x={10} y={10}
                        orientation="horizontal"
                        colorScale={["#bdbfc1", "#f2a900"]}
                        data ={[
                          {name: ('Other counties in '+ 'US')}, {name: 'Counties in '+stateName}
                          ]}
                      />
                      <VictoryScatter
                        sortKey={(d) => d.fips.substring(0,2)===fips}
                        style={{ data: { fill: ({datum}) => datum.fips.substring(0,2)===fips?"#f2a900":"#bdbfc1",
                                 fillOpacity: ({datum}) => datum.fips.substring(0,2)===fips?1.0:0.5} }}
                        data={_.filter(dataScatter, (d)=> (d['% Blacks'] && d['COVID Mortality / 100k']))}
                        size={4}
                        x={'% Blacks'}
                        y={'COVID Mortality / 100k'}
                      />
                      <VictoryAxis label={'% African American'}/>
                      <VictoryAxis dependentAxis 
                        label={'COVID Mortality / 100k (log-scale)'} 
                        style={{ axisLabel: {padding: 40} }} 
                        tickCount={5}
                        tickFormat={(y) => (Math.round(y*100)/100)}/>
                    </VictoryChart>
                  </Grid.Row>
                  <Grid.Row style={{paddingTop: 0}}>
                    <small style={{color: '#bdbfc1'}}>
                    Data last updated: MM/DD/YYYY, updated every week<br/>
                    The chart does not contain those counties with less than 10,000 population and less than 5% African American.
                    Data sources: TBD
                    </small>
                  </Grid.Row>
                </Grid>
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