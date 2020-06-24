import React, { useEffect, useState } from 'react'
import { Container, Dropdown, Grid, Breadcrumb, Header, Loader, Divider } from 'semantic-ui-react'
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
  VictoryArea
} from 'victory';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";
import fips2county from './fips2county.json'
import stateOptions from "./stateOptions.json";



import configs from "./state_config.json";

const colorPalette = [
        "#e1dce2",
        "#d3b6cd",
        "#bf88b5", 
        "#af5194", 
        "#99528c", 
        "#633c70", 
      ];
const countyColor = '#f2a900';
const stateColor = '#b2b3b3';
const nationColor = '#d9d9d7';



function BarChart(props) {
  const colors = {"nation": nationColor, 
                  "state": stateColor, 
                  "county": countyColor};
  if (props.countyFips != "_nation" && props.stateFips != "_nation") {
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={200}
      height={90}       
      domainPadding={10}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 55, right: 20, top: 20, bottom: 20}}
      containerComponent={<VictoryContainer responsive={false}/>}
    >
      <VictoryLabel text={props.title} x={100} y={10} textAnchor="middle" style={{fontSize: 12}}/>
      <VictoryAxis style={{tickLabels: {fontSize: 10}}} />
      <VictoryAxis dependentAxis style={{tickLabels: {fontSize: 8, padding: 1}}}/>
      <VictoryBar
        horizontal
        barRatio={0.8}
        labels={({ datum }) => (Math.round(datum.value*100)/100)}
        data={[{key: 'nation', 'value': props.data['_nation'][props.var] || 0},
              {key: 'state', 'value': props.data[props.stateFips][props.var]>0?props.data[props.stateFips][props.var] : 0},
              {key: 'county', 'value': props.data[props.stateFips+props.countyFips][props.var] > 0? props.data[props.stateFips+props.countyFips][props.var]:  0}]}
        labelComponent={<VictoryLabel dx={5} style={{fontSize: 10, fill: ({datum}) => colors[datum.key] }}/>}
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

  return (

    

    <VictoryChart
      theme={VictoryTheme.material}
      width={280}
      height={90}       
      domainPadding={10}
      scale={{y: props.ylog?'log':'linear'}}
      minDomain={{y: props.ylog?1:0}}
      padding={{left: 70, right: 30, top: 20, bottom: 30}}
      containerComponent={<VictoryContainer responsive={false}/>}
    >
      <VictoryLabel text={props.title} x={140} y={10} textAnchor="middle" style={{fontSize: 12}}/>
      <VictoryAxis style={{tickLabels: {fontSize: 10}}} />
      <VictoryAxis dependentAxis style={{tickLabels: {fontSize: 8, padding: 1}}}/>
      <VictoryBar
        horizontal
        barRatio={0.8}
        labels={({ datum }) => (Math.round(datum.value*100)/100)}
        data={[{key: 'nation', 'value': props.data['_nation'][props.var] || 0}]}
        labelComponent={<VictoryLabel dx={5} style={{fontSize: 10, fill: ({datum}) => colors[datum.key] }}/>}
        style={{
          data: {
            fill: ({ datum }) => colors[datum.key]
          }
        }}
        x="key"
        y="value"
      />
    </VictoryChart>

    
    );
  
}

export default function StateMap(props) {

  let {stateFips} = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyFips, setCountyFips] = useState('');
  const [countyName, setCountyName] = useState('{County}');
  const history = useHistory();
  const [data, setData] = useState();
  const [dataTS, setDataTS] = useState();
  const [tooltipContent, setTooltipContent] = useState('');
  const [colorScale, setColorScale] = useState();

  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  useEffect(()=>{
    
    const configMatched = configs.find(s => s.fips === stateFips);

    if (!configMatched){
      history.push('/');
    }else{

      setConfig(configMatched);

      setStateName(configMatched.name);

      fetch('/data/data.json').then(res => res.json())
        .then(x => {
          setData(x);

          const cs = scaleQuantile()
          .domain(_.map(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d.covidmortalityfig >= 0)),
            d=> d['covidmortalityfig']))
          .range(colorPalette);

          let scaleMap = {}
          _.each(x, d=>{
            scaleMap[d['covidmortalityfig']] = cs(d['covidmortalityfig'])});
          setColorScale(scaleMap);

          var max = 0
          var min = 100
          var length = 0
          _.each(x, d=> { 
            if(d['covidmortalityfig'] !== null){
              length += 1
            }
            if (d['covidmortalityfig'] > max) {
              max = d['covidmortalityfig']
            } else if (d['covidmortalityfig'] < min && d['covidmortalityfig'] >= 0){
              min = d['covidmortalityfig']
            }


          });

          setLegendMax(max.toFixed(0));
          setLegendMin(min.toFixed(0));

          var split = scaleQuantile()
          .domain(_.map(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d.covidmortalityfig >= 0)),
            d=> d['covidmortalityfig']))
          .range(colorPalette);

          setLegendSplit(split.quantiles());
        });
      
      fetch('/data/timeseries'+stateFips+'.json').then(res => res.json())
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
    }
  }, [stateFips]);

  if (data && dataTS) {
    console.log(data);
    console.log(dataTS);
  return (
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '6em', minWidth: '1260px'}}>
          {config &&
          <div>
          <Breadcrumb>
            <Breadcrumb.Section link onClick={() => history.push('/')}>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section active>{stateName}</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </Breadcrumb>
          <Divider hidden/>

          <div>
             <Header as='h2' style={{fontWeight: 400}}>
                  <Header.Content>
                    Covid-19 Outcomes in {stateName}
                    <Header.Subheader style={{fontWeight: 300}}>
                    Health determinants impact COVID-19 outcomes. 
                    </Header.Subheader>
                    <Header.Subheader style={{fontWeight: 300}}></Header.Subheader>
                  </Header.Content>
                </Header>
          </div>

          <Grid columns={15}>

          <Grid.Row columns={5} style={{width: 252, padding: 0, paddingTop: '1em', paddingBottom: "2.5em"}}>

            <VictoryChart theme={VictoryTheme.material}
                        width={252}
                        height={180}       
                        padding={{left: 50, right: 30, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        <VictoryLabel text="Average Daily COVID-19 Cases" x={130} y={20} textAnchor="middle" style={{fontSize: 12}}/>
                        
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3)*2 - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3) - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                          style={{tickLabels: {fontSize: 10}}} 
                          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                        
                        <VictoryGroup 
                          colorScale={[stateColor]}
                        >

                        <VictoryLine data={stateFips != "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='cases'
                            />

                        </VictoryGroup>
                        <VictoryArea
                          style={{ data: { fill: "##C0C0C0" , fillOpacity: 0.1} }}
                          data={stateFips != "_nation"? dataTS[stateFips] : dataTS["_"]}
                          x= 't' y = 'cases'

                        />
            </VictoryChart>
            

            <VictoryChart theme={VictoryTheme.material}
                        width={252}
                        height={180}       
                        padding={{left: 50, right: 30, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        <VictoryLabel text="Average Daily COVID-19 Deaths" x={130} y={20} textAnchor="middle" style={{fontSize: 12}}/>
                        
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3)*2 - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3) - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                          style={{tickLabels: {fontSize: 10}}} 
                          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                        
                        <VictoryGroup 
                          colorScale={[stateColor]}
                        >

                          <VictoryLine data={stateFips != "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='deaths'
                            />

                        </VictoryGroup>

                        <VictoryArea
                          style={{ data: { fill: "##C0C0C0" , fillOpacity: 0.1} }}
                          data={stateFips != "_nation"? dataTS[stateFips] : dataTS["_"]}
                          x= 't' y = 'deaths'

                        />
            </VictoryChart>
            </Grid.Row>
          </Grid>




          <Grid columns={18}>
            <Grid.Row>
              <Grid.Column width={5}>
                
                <svg width="400" height="90">
                  <text x={0} y={20} style={{fontSize: '1.0em'}}>COVID-19 Mortality per 100,000 </text>
                  <text x={0} y={35} style={{fontSize: '0.8em'}}>Low</text>
                  <text x={20 * (colorPalette.length - 1)} y={35} style={{fontSize: '0.8em'}}>High</text>

                  {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                  })} 

                  <rect x={145} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                  <text x={167} y={50} style={{fontSize: '0.7em'}}> No Deaths </text>
                  <text x={167} y={59} style={{fontSize: '0.7em'}}> Reported </text>

                  {_.map(legendSplit, (splitpoint, i) => {
                    if(legendSplit[i] < 1){
                      return <text key = {i} x={20 + 20 * (i)} y={70} style={{fontSize: '0.8em'}}> {legendSplit[i].toFixed(1)}</text>                    
                    }
                    return <text key = {i} x={20 + 20 * (i)} y={70} style={{fontSize: '0.8em'}}> {legendSplit[i].toFixed(0)}</text>                    
                  })} 
                  <text x={0} y={70} style={{fontSize: '0.8em'}}> 0 </text>
                  <text x={120} y={70} style={{fontSize: '0.8em'}}>{legendMax}</text>

                  <text x={250} y={59} style={{fontSize: '0.5em'}}> Click on a county below for a detailed report. </text>


                </svg>
                <ComposableMap projection="geoAlbersUsa" 
                  projectionConfig={{scale:`${config.scale*0.7}`}} 
                  width={400} 
                  height={500} 
                  strokeWidth = {0.1}
                  stroke = 'black'
                  data-tip=""
                  offsetX={config.offsetX}
                  offsetY={config.offsetY}>
                  <Geographies geography={config.url}>
                    {({geographies}) => geographies.map(geo =>
                      <Geography 
                        key={geo.rsmKey} 
                        geography={geo} 
                        onClick={()=>{
                          history.push("/" + stateFips + "/" +geo.properties.COUNTYFP);
                        }}
                        onMouseEnter={()=>{
                          setCountyFips(geo.properties.COUNTYFP);
                          setCountyName(fips2county[stateFips+geo.properties.COUNTYFP]);
                          setTooltipContent("");
                        }}
                        onMouseLeave={()=>{
                          setTooltipContent("")
                        }}
                        
                        fill={countyFips===geo.properties.COUNTYFP?countyColor:
                            ((colorScale && data[stateFips+geo.properties.COUNTYFP] && (data[stateFips+geo.properties.COUNTYFP]['covidmortalityfig']) > 0)?
                                colorScale[data[stateFips+geo.properties.COUNTYFP]['covidmortalityfig']]: 
                                (colorScale && data[stateFips+geo.properties.COUNTYFP] && data[stateFips+geo.properties.COUNTYFP]['covidmortalityfig'] === 0)?
                                  '#e1dce2':'#FFFFFF')}
                        />
                    )}
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column width={5} style={{padding: 0, paddingLeft: 40}}>
                <Header as='h2' style={{fontWeight: 400, width: 420}}>
                  <Header.Content style={{fontSize: 20}}>
                    How Does <span style={{color: countyColor, fontSize: 20}}>{countyName}</span> Compare?
                    <Header.Subheader style={{fontWeight: 300, width: 400, fontSize: 14}}>
                      The number of cases and deaths due to COVID-19 are dynamic. 
                      Cases are declining in many counties and rising in others. 
                      Trends in the case and hospitalization count in the past 14 days are being monitored to determine whether it is safe to reopen a county.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <Grid>
                  <Grid.Row columns={1} style={{padding: 0, paddingTop: 20, paddingBottom: 20}}>
                      <VictoryChart theme={VictoryTheme.material}
                        width={330}
                        height={180}       
                        padding={{left: 50, right: 30, top: 60, bottom: 30}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        <VictoryLabel text="Average Daily COVID-19 Cases / 100,000" x={140} y={20} textAnchor="middle" style={{fontSize: 12}}/>
                        <VictoryLegend
                          x={40} y={35}
                          orientation="horizontal"
                          colorScale={[nationColor, stateColor, countyColor]}
                          data ={[
                            {name: "nation"}, {name: "state"}, {name: "county"}
                            ]}
                        />
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3)*2 - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3) - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                          style={{tickLabels: {fontSize: 10}}} 
                          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                         style={{tickLabels: {fontSize: 8, padding: 1}}} 
                          tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                          />
                        <VictoryGroup 
                          colorScale={[nationColor, stateColor, countyColor]}
                        >
                          <VictoryLine data={dataTS["_nation"]}
                            x='t' y='caseRateMA'
                            />
                          <VictoryLine data={stateFips != "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='caseRateMA'
                            />
                          <VictoryLine data={dataTS[stateFips+countyFips] && (stateFips != "_nation")?dataTS[stateFips+countyFips]:dataTS["99999"]}
                            x='t' y='caseRateMA'
                            />
                        </VictoryGroup>
                      </VictoryChart>
                  </Grid.Row>
                  <Grid.Row columns={1} style={{padding: 0, paddingTop: 20, paddingBottom: 20}}>
                      <VictoryChart theme={VictoryTheme.material}
                        width={330}
                        height={180}       
                        padding={{left: 50, right: 30, top: 60, bottom: 30}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        <VictoryLabel text="Average Daily COVID-19 Deaths / 100,000" x={140} y={20} textAnchor="middle" style={{fontSize: 12}}/>
                        <VictoryLegend
                          x={40} y={35}
                          orientation="horizontal"
                          colorScale={[nationColor, stateColor, countyColor]}
                          data ={[
                            {name: "nation"}, {name: "state"}, {name: "county"}
                            ]}
                        />
                        <VictoryAxis
                          tickValues={[
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3)*2 - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length - Math.round(dataTS["_nation"].length/3) - 1].t,
                            dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                          style={{tickLabels: {fontSize: 10}}} 
                          tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                         style={{tickLabels: {fontSize: 8, padding: 1}}} 
                          tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                          />
                        <VictoryGroup 
                          colorScale={[nationColor, stateColor, countyColor]}
                        >
                          <VictoryLine data={dataTS["_nation"]}
                            x='t' y='mortalityMA'
                            />
                          <VictoryLine data={stateFips != "_nation"? dataTS[stateFips] : dataTS["_"]}
                            x='t' y='mortalityMA'
                            />
                          <VictoryLine data={dataTS[stateFips+countyFips] && (stateFips != "_nation")?dataTS[stateFips+countyFips]:dataTS["99999"]}
                            x='t' y='mortalityMA'
                            />
                        </VictoryGroup>
                      </VictoryChart>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column width={6} style={{padding: 0, paddingLeft: 80}}>
                <Header as='h2' style={{width:400}}>
                  <Header.Content style={{fontSize: 20}}>
                    <br/>
                    <Header.Subheader style={{fontWeight: 300, width: 400, fontSize: 14}}>
                    Social, economic, health and environmental factors impact an individual’s risk of infection and COVID-19 severity. 
                    Counties with large groups of vulnerable people may be  disproportionately impacted by COVID-19.
                    </Header.Subheader>
                  </Header.Content>

                </Header>
                <Grid>
                  <Grid.Row columns={2} style={{padding: 10, width: 400}}>                    
                      <BarChart 
                        title="% African American" 
                        var="black" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} />
                      <BarChart 
                        title="% in Poverty" 
                        var="poverty" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} />
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 10, width: 400}}>
                      <BarChart 
                        title="% Uninsured" 
                        var="PCTUI" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} />  
                      <BarChart 
                        title="% Diabetes" 
                        var="diabetes" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} /> 
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 10, width: 400}}>                    
                      <BarChart 
                        title="% Obese" 
                        var="obesity" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} />
                      <BarChart 
                        title="% Over 65 y/o" 
                        var="age65over" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} />
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 10, width: 400}}>                    
                      <BarChart 
                        title="% in Group Quarters" 
                        var="groupquater" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} />
                      <BarChart 
                        title="% Male" 
                        var="male" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} />
                  </Grid.Row>
                </Grid>
              </Grid.Column>

            </Grid.Row>            
          </Grid>
          </div>
        }
        <Notes />
      </Container>
      <ReactTooltip><font size="+1"> <b> {countyName} </b> </font> <br/> Click for a detailed report. </ReactTooltip>
    </div>
    );
  } else{
    return <Loader active inline='centered' />
  }




}