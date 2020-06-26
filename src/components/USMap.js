import React, { useEffect, useState } from 'react'
import { Container, Grid, Dropdown, Breadcrumb, Header, List, Loader, Divider } from 'semantic-ui-react'
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
const colorPalette = [
        "#e1dce2",
        "#d3b6cd",
        "#bf88b5", 
        "#af5194", 
        "#99528c", 
        "#633c70", 
      ];
const colorHighlight = '#f2a900';


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
  const [dataFltrd, setDataFltrd] = useState();

  const [dataStateFltrd, setDataStateFltrd] = useState();
  const [dataState, setDataState] = useState();

  const [data, setData] = useState();
  const [date, setDate] = useState('');
  const [stateLabels, setStateLabels] = useState();
  const [colorScale, setColorScale] = useState();

  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [metric, setMetric] = useState('mean7daycases');
  const [metricOptions, setMetricOptions] = useState('mean7daycases');
  const [metricName, setMetricName] = useState('Average Daily COVID-19 Cases');

  const [varMap, setVarMap] = useState({});


  useEffect(()=>{
    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        setMetricOptions(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.variable, text: d.name, group: d.group};
        }), d => (d.text !== "Urban-Rural Status") && (d.group === "outcomes")));
      });
  }, []);




  useEffect(() => {
    if (metric) {
    fetch('/data/data.json').then(res => res.json())
      .then(x => {
        
        setData(x);
        setDataFltrd(_.filter(_.map(x, (d, k) => {
          d.fips = k
          return d}), 
          d => (d.Population > 10000 && 
              d.black > 5 && 
              d.fips.length === 5 && 
              d['covidmortalityfig'] > 0)));
      
        const cs = scaleQuantile()
        .domain(_.map(_.filter(_.map(x, (d, k) => {
          d.fips = k
          return d}), 
          d => (
              d[metric] >= 0 &&
              d.fips.length === 5)),
          d=> d[metric]))
        .range(colorPalette);
        let scaleMap = {}
        _.each(x, d=>{
          if(d[metric] > 0){
          scaleMap[d[metric]] = cs(d[metric])}});
      
        setColorScale(scaleMap);
        var max = 0
        var min = 100
        var length = 0
        _.each(x, d=> { 
          if(d[metric] !== null){
            length += 1
          }
          if (d[metric] > max && d.fips.length === 5) {
            max = d[metric]
          } else if (d[metric] < min && d[metric] >= 0){
            min = d[metric]
          }
        });

        if (max > 999) {
          max = (max/1000).toFixed(0) + "K";
          setLegendMax(max);
        }else{
          setLegendMax(max.toFixed(0));

        }
        setLegendMin(min.toFixed(0));

        var split = scaleQuantile()
        .domain(_.map(_.filter(_.map(x, (d, k) => {
          d.fips = k
          return d}), 
          d => (
              d[metric] >= 0 &&
              d.fips.length === 5)),
          d=> d[metric]))
        .range(colorPalette);

        setLegendSplit(split.quantiles());


      });

    fetch('/data/date.json').then(res => res.json())
      .then(x => setDate(x.date));
    
    fetch('/data/allstates.json').then(res => res.json())
      .then(x => setStateLabels(x));

    fetch('/data/data.json').then(res => res.json())
      .then(x => {
        setDataState(x);
        setDataStateFltrd(_.filter(_.map(x, (c, l) => {
          c.fips = l
          return c}),
          c => (c.fips.length === 2)));
      });
    }

  }, [metric])

  if (data && dataFltrd && stateLabels && dataStateFltrd && dataState) {

  return (
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '6em', minWidth: '960px'}}>
          <Breadcrumb>
            <Breadcrumb.Section active>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </Breadcrumb>
          <Divider hidden />
          <Grid columns={16}>
          <div>
            <a href="Dashboard user guide.pdf" target="_blank"> See Dashboard Guide (PDF) </a> 
            <br></br>
            <a href="https://youtu.be/PmI42rHnI6U" target="_blank"> See Dashboard Guide (YouTube) </a>
          </div>
            <Grid.Row>
              <Grid.Column width={9}>
                <Header as='h2' style={{fontWeight: 400}}>
                  <Header.Content>
                    COVID-19 is affecting every community differently.<br/>
                    Some areas are much harder-hit than others. What is happening where you live?
                    <Header.Subheader style={{fontWeight: 300}}></Header.Subheader>
                  </Header.Content>
                </Header>
                

                <Grid.Row columns={2} style={{width: 650, padding: 0, paddingTop: 0, paddingBottom: 0}}>

                      <Dropdown
                        icon=''

                        style={{background: '#fff', 
                                fontSize: "1.2em",
                                fontWeight: 400, 
                                theme: '#000000',
                                width: '300px',
                                top: '12px',
                                left: '0px',
                                text: "Select",
                                borderTop: 'none',
                                borderLeft: '1px solid #FFFFFF',
                                borderRight: 'none', 
                                borderBottom: '0.5px solid #bdbfc1',
                                borderRadius: 0,
                                minHeight: '1.0em',
                                paddingBottom: '0.0em'}}
                        placeholder= "Average Daily COVID-19 Cases"
                        inline
                        search
                        pointing = 'top'
                        options={metricOptions}
                        onChange={(e, { value }) => {
                          setMetric(value);
                          setMetricName(varMap[value]['name']);
                        }}

                        
                      />

                <svg width="350" height="80">
                  

                  <text x={100} y={70} style={{fontSize: '0.8em'}}>Low</text>
                  <text x={100+20 * (colorPalette.length - 1)} y={70} style={{fontSize: '0.8em'}}>High</text>

                  {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={100+20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                  })} 

                  <rect x={245} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                  <text x={267} y={50} style={{fontSize: '0.7em'}}> None </text>
                  <text x={267} y={59} style={{fontSize: '0.7em'}}> Reported </text>

                  {_.map(legendSplit, (splitpoint, i) => {
                    if(legendSplit[i] < 1){
                      return <text key = {i} x={120 + 20 * (i)} y={37} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(1)}</text>                    
                    }
                    return <text key = {i} x={120 + 20 * (i)} y={37} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(0)}</text>                    
                  })} 
                  <text x={100} y={37} style={{fontSize: '0.7em'}}>{legendMin}</text>
                  <text x={220} y={37} style={{fontSize: '0.7em'}}>{legendMax}</text>

                </svg>
                </Grid.Row>


                <ComposableMap 
                  projection="geoAlbersUsa" 
                  data-tip=""
                  width={600} 
                  height={380}
                  strokeWidth= {0.1}
                  stroke= 'black'
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
                              //setTooltipContent()                            
                            }}
                            onMouseLeave={()=>{
                              setTooltipContent("")
                            }}
                            onClick={()=>{
                              history.push("/"+geo.id.substring(0,2)+"");
                            }}
                            fill={fips===geo.id.substring(0,2)?colorHighlight:
                            ((colorScale && data[geo.id] && (data[geo.id][metric]) > 0)?
                                colorScale[data[geo.id][metric]]: 
                                (colorScale && data[geo.id] && data[geo.id][metric] === 0)?
                                  '#e1dce2':'#FFFFFF')}
                            
                          />
                        ))}
                        <MapLabels geographies={geographies} stateLabels={stateLabels} />
                      </svg>
                    }
                  </Geographies>
                </ComposableMap>
                
                <Grid.Row style={{paddingTop: 0}}>
                    <small style={{fontWeight: 300}}>
                    <em>Daily Cases</em> is the average number of new positive cases for COVID-19 infection over the last seven days. <br/>
                    <em>Daily Deaths</em> is the average number of new deaths due to confirmed or presumed COVID-19 infection over the last seven days. <br/>
                    For a complete table of variable defintion, click <a href="https://covid19.emory.edu/data-sources" target="_blank"> here. </a>
                    </small>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header as='h2' style={{fontWeight: 400}}>
                  <Header.Content>
                    A Snapshot of Health Disparities in <span style={{color: colorHighlight}}>{stateName}</span>
                    <Header.Subheader style={{fontWeight: 300}}>
                      Counties with higher proportions of African American residents tend to have higher rates of death from COVID-19. 
                    </Header.Subheader>
                    <Header.Subheader style={{fontWeight: 300}}>
                      Click on the map to explore your state and county.
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
                        colorScale={["#bdbfc1", colorHighlight]}
                        data ={[
                          {name: ('Other counties in '+ 'US')}, {name: 'Counties in '+stateName}
                          ]}
                      />
                      <VictoryScatter
                        sortKey={(d) => d.fips.substring(0,2)===fips}
                        style={{ data: { fill: ({datum}) => datum.fips.substring(0,2)===fips?"#f2a900":"#bdbfc1",
                                 fillOpacity: ({datum}) => datum.fips.substring(0,2)===fips?1.0:0.5} }}
                        data={dataFltrd}
                        size={4}
                        x='black'
                        y='covidmortalityfig'
                      />
                      <VictoryAxis label={'% African American'}/>
                      <VictoryAxis dependentAxis 
                        label={'COVID-19 Deaths / 100k (log-scale)'} 
                        style={{ axisLabel: {padding: 40} }} 
                        tickCount={5}
                        tickFormat={(y) => (Math.round(y*100)/100)}/>
                    </VictoryChart>
                  </Grid.Row>
                  <Grid.Row style={{paddingTop: 0}}>
                    <small style={{fontWeight: 300}}>
                    Data last updated: {date}, updated every week<br/>
                    The chart does not contain those counties with less than 10,000 population and less than 5% African American.
                    </small>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Notes />
        </Container>
        <ReactTooltip > <font size="+2"><b >{stateName}</b> </font> <br/> <b> Daily Cases</b>: {dataState[fips]['mean7daycases'].toFixed(0)} <br/> <b> Daily Deaths</b>: {dataState[fips]['mean7daydeaths'].toFixed(0)} <br/> <b>Click to see county-level data.</b> </ReactTooltip>
      </div>
      );
  } else {
    return <Loader active inline='centered' />
  }
}