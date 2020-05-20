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
  VictoryLine,
  VictoryLabel,
} from 'victory';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";
import fips2county from './fips2county.json'


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
  const [data, setData] = useState();
  const [dataTS, setDataTS] = useState();
  const [tooltipContent, setTooltipContent] = useState('');
  const [colorScale, setColorScale] = useState();
  const colorPalette = [
          //"#324da0",
          "#799FCB", //"#009fa8",
          "#95B4CC", //"#Acd2bd",
          "#AFC7D0", //"#fefdbe",
          "#EEF1E6", //"#F1c363",
          "#FEC9C9", //"#E46f00",
          "#F9665E", //"#A51122",
        ];

  useEffect(()=>{
    
    const configMatched = configs.find(s => s.fips === stateFips);

    setConfig(configMatched);

    setStateName(configMatched.name);

    fetch('/emory-covid19/data/data.json').then(res => res.json())
      .then(x => {
        setData(x);

        const cs = scaleQuantile()
        .domain(_.map(x, d=>d['covidmortality']))
        .range(colorPalette);

        let scaleMap = {}
        _.each(x, d=>{
          scaleMap[d['covidmortality']] = cs(d['covidmortality'])});
        setColorScale(scaleMap);
      });
    
    fetch('/emory-covid19/data/timeseries'+stateFips+'.json').then(res => res.json())
      .then(x => {

        let countyMost = '';
        let mortalityMA = 0;
        _.each(x, (v, k)=>{
          if (k.length===5 && v.length > 0 && v[v.length-1].mortalityMA > mortalityMA){
            countyMost = k.substring(2, 5);
            mortalityMA = v[v.length-1].mortalityMA;
          }
        });
        setCountyFips(countyMost);
        setCountyName(fips2county[stateFips+countyMost]);

        setDataTS(x);
      });

  }, [stateFips]);

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
                <svg width="500" height="30">
                  <text x={0} y={7} style={{fontSize: '0.5em'}}>COVID-19 Mortality</text>
                  {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={12*i} y={10} width="12" height="12" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                  })} 
                  <text x={0} y={30} style={{fontSize: '0.5em'}}>Low</text>
                  <text x={12 * (colorPalette.length - 1)} y={30} style={{fontSize: '0.5em'}}>High</text>
                </svg>
                <ComposableMap projection="geoAlbersUsa" 
                  projectionConfig={{scale:`${config.scale}`}} 
                  width={500} 
                  height={550} 
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
                          setCountyName(fips2county[stateFips+geo.properties.COUNTYFP]);
                          setTooltipContent('Click to see more county data');
                        }}
                        onMouseLeave={()=>{
                          setTooltipContent("")
                        }}
                        fill={countyFips===geo.properties.COUNTYFP?'#012169':
                            ((colorScale && data[stateFips+geo.properties.COUNTYFP] && data[stateFips+geo.properties.COUNTYFP]['covidmortality'])?
                                colorScale[data[stateFips+geo.properties.COUNTYFP]['covidmortality']] : colorPalette[0])}
                        />
                    )}
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header style={{fontWeight: 400}}>
                  <Header.Content>
                    Statistics of {countyName}
                    <Header.Subheader style={{fontWeight: 300}}>
                      Case rates and mortalities are shown in 7-days moving averages.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <VictoryChart theme={VictoryTheme.material}
                        height={250}       
                        padding={{left: 50, right: 10, top: 60, bottom: 30}}>
                        <VictoryLabel text="COVID-19 Cases / 100,000" x={180} y={20} textAnchor="middle"/>
                        <VictoryLegend
                          x={10} y={35}
                          orientation="horizontal"
                          colorScale={["#f2a900", "#84754e", "#0033a0"]}
                          data ={[
                            {name: "nation"}, {name: "state"}, {name: "county"}
                            ]}
                        />
                        <VictoryAxis tickCount={2}
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
                        height={250}       
                        padding={{left: 50, right: 10, top: 60, bottom: 30}}>
                        <VictoryLabel text="COVID-19 Deaths / 100,000" x={180} y={20} textAnchor="middle"/>
                        <VictoryLegend
                          x={10} y={35}
                          orientation="horizontal"
                          colorScale={["#f2a900", "#84754e", "#0033a0"]}
                          data ={[
                            {name: "nation"}, {name: "state"}, {name: "county"}
                            ]}
                        />
                        <VictoryAxis tickCount={2}
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
                          colorScale={["#f2a900", "#84754e", "#0033a0"]}
                        >
                          <VictoryBar
                            data={_.map(data._nation, (v, k)=>{return {key: k, value: v};})}
                            x="key"
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