import React, { useEffect, useState } from 'react'
import { Container, Grid, Dropdown, Breadcrumb, Header, Loader, Divider, Image} from 'semantic-ui-react'
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
  // VictoryLegend,
  VictoryLine,  
  VictoryLabel, 
  VictoryArea,
  VictoryContainer
} from 'victory';
import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";
import configs from "./state_config.json";
import ReactDOM from 'react-dom';
// function getKeyByValue(object, value) {
//   return Object.keys(object).find(key => object[key] === value);
// }

function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function getMaxRange(arr, prop, range) {
    var max;
    for (var i=range ; i<arr.length ; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

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
const stateColor = "#778899";


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
  // const [open, setOpen] = React.useState(true)

  const history = useHistory();
  const [tooltipContent, setTooltipContent] = useState('');
  
  const [stateLabels, setStateLabels] = useState();
  const [date, setDate] = useState('');

  const [data, setData] = useState();
  const [allTS, setAllTS] = useState();
  const [raceData, setRaceData] = useState();
  const [dataFltrd, setDataFltrd] = useState();
  // const [dataState, setDataState] = useState();

  const [stateName, setStateName] = useState('Georgia');
  const [fips, setFips] = useState('13');
  const [stateFips, setStateFips] = useState();
  
  const [colorScale, setColorScale] = useState();
  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [varMap, setVarMap] = useState({});
  const [metric, setMetric] = useState('caserate7dayfig');
  const [metricOptions, setMetricOptions] = useState('caserate7dayfig');
  const [metricName, setMetricName] = useState('Average Daily COVID-19 Cases per 100,000');

  // const [caseRate, setCaseRate] = useState();
  // const [percentChangeCases, setPercentChangeCases] = useState();
  // const [mortality, setMortality] = useState();
  // const [percentChangeMortality, setPercentChangeMortality] = useState();

  const [delayHandler, setDelayHandler] = useState();

  useEffect(()=>{
    fetch('/data/date.json').then(res => res.json())
      .then(x => setDate(x.date.substring(5,7) + "/" + x.date.substring(8,10) + "/" + x.date.substring(0,4)));
    
    fetch('/data/allstates.json').then(res => res.json())
      .then(x => setStateLabels(x));

    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        setMetricOptions(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.variable, text: d.name, def: d.definition, group: d.group};
        }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
      });
  }, []);

  useEffect(()=>{
    fetch('/data/timeseriesAll.json').then(res => res.json())
      .then(x => setAllTS(x));
  }, []);

  useEffect(()=>{
    fetch('/data/racedataAll.json').then(res => res.json())
      .then(x => setRaceData(x));

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
          if(d[metric] >= 0){
          scaleMap[d[metric]] = cs(d[metric])}});
      
        setColorScale(scaleMap);
        var max = 0
        var min = 100
        _.each(x, d=> { 
          if (d[metric] > max && d.fips.length === 5) {
            max = d[metric]
          } else if (d.fips.length === 5 && d[metric] < min && d[metric] >= 0){
            min = d[metric]
          }
        });

        if (max > 999999) {
          max = (max/1000000).toFixed(0) + "M";
          setLegendMax(max);
        }else if (max > 999) {
          max = (max/1000).toFixed(0) + "K";
          setLegendMax(max);
        }else{
          setLegendMax(max.toFixed(0));

        }
        setLegendMin(min.toFixed(0));
        setLegendSplit(cs.quantiles());

      });
    }
  }, [metric])

  if (data && dataFltrd && stateLabels && allTS) {
    
  return (
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '8em', minWidth: '1260px'}}>
        <div style={{height:130, overflow: "hidden"}}>
          <div style = {{ paddingBottom: 8}}>
          </div>
          
          <div style={{height:130, overflowY:"hidden", overflowX: "auto"}}>
            <p style={{width: "220%"}}>
              <Grid>
                <Grid.Column style={{width: 110, fontSize: "16pt", lineHeight: "18pt"}}>

                  <b>The Latest on this Dashboard</b>
                  
                </Grid.Column>
                <Grid.Column style={{width: 20}}>
                  
                </Grid.Column>

                {/* <Grid.Column style={{width: 190}}>
                  <Image width = {175} height = {95} src='/HomeIcons/Emory_Icons_NationalReport_v1.jpg' />
                </Grid.Column>
                <Grid.Column style={{width: 320, fontSize: "8pt"}}>
                  <b> National Report <br/> </b>

                  The National Report tab takes you to a detailed overview of the impact of COVID-19 in the U.S.. 
                  How has the pandemic been trending? What are the most hard hit counties? 
                  Who are the most vulnerable communities...
                  <a href = "/national-report/pilot">for more</a>. 
                  
                </Grid.Column> */}

                <Grid.Column style={{width: 190}}>
                  <Image width = {165} height = {95} href = "/media-hub/podcast/Allison_Chamberlain_on_public_health_education_pandemic" src='/podcast images/Allison Chamberlain.png' />
                </Grid.Column>
                <Grid.Column style={{width: 320, fontSize: "8pt"}}>
                  <b>“A teaching opportunity for many years to come”: Dr. Allison Chamberlain on public health education in the time of the COVID-19 pandemic <br/></b>

                  Dr. Allison Chamberlain talks about blending public health academia and practice, 
                  how public health educ... 
                  <a href = "/media-hub/podcast/Allison_Chamberlain_on_public_health_education_pandemic">for more</a>. 
                </Grid.Column>

                <Grid.Column style={{width: 190}}>
                  <Image width = {165} height = {95} href = "/media-hub/podcast/Robert_Breiman_on_COVID-19_vaccine_development_and_distribution" src='/podcast images/Robert Breiman.png' />
                </Grid.Column>
                <Grid.Column style={{width: 320, fontSize: "8pt"}}>
                  <b>“Information equity is a critical part of the whole picture”: Dr. Robert Breiman on COVID-19 vaccine development and distribution <br/></b>

                  Dr. Robert Breiman talks about where different SARS-CoV-2 vaccines are in development 
                  and clinical trials...
                  <a href = "/media-hub/podcast/Robert_Breiman_on_COVID-19_vaccine_development_and_distribution">for more</a>. 
                </Grid.Column>



                <Grid.Column style={{width: 190}}>
                  <Image width = {165} height = {95} href = "/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances" src='/podcast images/Vincent Macroni.png' />
                </Grid.Column>
                <Grid.Column style={{width: 320, fontSize: "8pt"}}>
                  <b>Innovations in Covid-19 Treatment: Dr. Vincent Marconi on Anti-Viral and Anti-Inflammatory Advances Against Covid-19 Infection <br/></b>

                  Dr. Vincent Marconi talks about the state of research around baricitinib, a JAK-STAT inhibitor 
                  that reduces...
                  <a href = "/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances">for more</a>. 
                </Grid.Column>

                <Grid.Column style={{width: 190}}>
                  <Image width = {165} height = {95} href = "/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics" src='/podcast images/Dr. Nneka Sederstrom.jpg' />
                </Grid.Column>
                <Grid.Column style={{width: 320, fontSize: "8pt"}}>
                  <b>"We Have to Be Better": Dr. Nneka Sederstrom on Racism and Ethics During Covid-19 <br/></b>

                  Dr. Nneka Sederstrom discusses how Covid-19 has brought issues of structural racism in 
                  medicine to the forefront of clinical ethics and pandemic... 
                  <a href = "/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics">for more</a>. 
                </Grid.Column>
                <Grid.Column style={{width: 190}}>
                  <Image width = {165} height = {95} href = "/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC" src='/podcast images/JudyMonroe.jpg' />
                </Grid.Column>
                <Grid.Column style={{width: 320, fontSize: "8pt"}}>
                  <b>"You've Got to Have Trust": Dr. Judy Monroe on Lessons Learned About Pandemic Preparedness <br/></b>

                  In a podcast, Dr. Monroe tells us about the lessons she learned about leadership and community partnerships during 
                  pandemics based on her experience as...
                  <a href = "/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC">for more</a>. 
                </Grid.Column>
                <Grid.Column style={{width: 190}}>
                  <Image width = {165} height = {95} href = "/media-hub/podcast/Dr.Carlos_Del_Rio_on_COVID-19_Equity_&_Outcomes" src='/podcast images/CarlosdelRio.jpg' />
                </Grid.Column>
                <Grid.Column style={{width: 320, fontSize: "8pt"}}>
                  <b>Dr. Carlos Del Rio on COVID-19 Equity and Outcomes<br/></b>

                  Considering health equity and disparity, how will the pandemic progress? What is our current strategy? 
                  What can be and needs to be done to change the course of the pandemic? <br/>
                  <a href = "/media-hub/podcast/Dr.Carlos_Del_Rio_on_COVID-19_Equity_&_Outcomes">for more</a>. 
                </Grid.Column>
              </Grid>
            </p>
          </div>
        </div>
          <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt"}}>
            <Breadcrumb.Section active >United States</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
          </Breadcrumb>
          <Divider hidden />
          <Grid columns={16}>
          <div style={{fontSize: "14pt", paddingTop: 10, paddingBottom: 30}}>
            See Dashboard Guide (<a style ={{color: "#397AB9"}}href="Dashboard user guide.pdf" target="_blank" rel="noopener noreferrer"> PDF </a> / <a style ={{color: "#397AB9"}} href="https://youtu.be/PmI42rHnI6U" target="_blank" rel="noopener noreferrer"> YouTube </a>)

          </div>

            
            <Grid.Row>
              <Grid.Column width={9}>
                <Header as='h2' style={{fontWeight: 400, fontSize: "18pt"}}>
                  <Header.Content>
                    COVID-19 is affecting every community differently.<br/>
                    Some areas are much harder-hit than others.<br/>
                    What is happening where you live?
                    <Header.Subheader style={{fontWeight: 300}}></Header.Subheader>
                  </Header.Content>
                </Header>
                
                <Grid.Row columns={2} style={{width: 680, padding: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0}}>

                      <Dropdown
                        style={{background: '#fff', 
                                fontSize: "14pt",
                                fontWeight: 400, 
                                theme: '#000000',
                                width: '420px',
                                top: '2px',
                                left: '0px',
                                text: "Select",
                                borderTop: 'none',
                                borderLeft: '0px solid #FFFFFF',
                                borderRight: '0px', 
                                borderBottom: '0.5px solid #bdbfc1',
                                borderRadius: 0,
                                minHeight: '1.0em',
                                paddingRight: 0,
                                paddingBottom: '0.5em'}}
                        text= {metricName}
                        pointing = 'top'
                        search 
                        selection
                        options={metricOptions}
                        
                        onChange={(e, { value }) => {
                          setMetric(value);
                          setMetricName(varMap[value]['name']);
                        }}
                      />

                <svg width="260" height="80">
                  
                  {_.map(legendSplit, (splitpoint, i) => {
                    if(legendSplit[i] < 1){
                      return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(1)}</text>                    
                    }else if(legendSplit[i] > 999999){
                      return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplit[i]/1000000).toFixed(0) + "M"}</text>                    
                    }else if(legendSplit[i] > 999){
                      return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplit[i]/1000).toFixed(0) + "K"}</text>                    
                    }
                    return <text key = {i} x={70 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(0)}</text>                    
                  })} 
                  <text x={50} y={35} style={{fontSize: '0.7em'}}>{legendMin}</text>
                  <text x={170} y={35} style={{fontSize: '0.7em'}}>{legendMax}</text>


                  {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={50+20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                  })} 


                  <text x={50} y={74} style={{fontSize: '0.8em'}}>Low</text>
                  <text x={50+20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>


                  <rect x={195} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                  <text x={217} y={50} style={{fontSize: '0.7em'}}> None </text>
                  <text x={217} y={59} style={{fontSize: '0.7em'}}> Reported </text>

                </svg>
                </Grid.Row>


                <ComposableMap 
                  projection="geoAlbersUsa" 
                  data-tip=""
                  width={630} 
                  height={380}
                  strokeWidth= {0.1}
                  stroke= 'black'
                  projectionConfig={{scale: 750}}


                   >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) => 
                      <svg>
                        {setStateFips(fips)}
                        {geographies.map(geo => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={()=>{

                              const stateFip = geo.id.substring(0,2);
                              const configMatched = configs.find(s => s.fips === stateFip);

                              setFips(stateFip);
                              setStateFips(geo.id.substring(0,2));
                              setStateName(configMatched.name);           
                            
                            }}
                            
                            onMouseLeave={()=>{
                              setTooltipContent("");
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
                
                <Grid.Row style={{paddingTop: "59px", width: "660px"}}>
                    <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "18pt"}}>
                    <b><em> {varMap[metric].name} </em></b> {varMap[metric].definition} <br/>
                    For a complete table of definitions, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                    </text>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column width={7} style ={{paddingLeft: 0}}>
                <Header as='h2' style={{fontWeight: 400}}>
                  <Header.Content style={{width : 550, fontSize: "18pt", textAlign: "center"}}>
                    Current Cases and Deaths in <b>{stateName}</b>
                    
                  </Header.Content>
                </Header>
                <Grid>
                  <Grid.Row columns = {2}>
                    <Grid.Column> 

                      <div>
                      {stateFips &&
                        <VictoryChart 
                                    minDomain={{ x: stateFips? allTS[stateFips][stateFips][allTS[stateFips][stateFips].length-15].t : allTS["13"]["13"][allTS["13"]["13"].length-15].t}}
                                    maxDomain = {{y: stateFips? getMaxRange(allTS[stateFips][stateFips], "caseRateMean", (allTS[stateFips][stateFips].length-15)).caseRateMean*1.05 : getMaxRange(allTS["13"]["13"], "caseRateMean", (allTS["13"]["13"].length-15)).caseRateMean*1.05}}                            
                                    width={235}
                                    height={180}
                                    padding={{marginLeft: 0, right: -1, top: 150, bottom: -0.9}}
                                    containerComponent={<VictoryContainer responsive={false}/>}>
                                    
                                    <VictoryAxis
                                      tickValues={stateFips ? 
                                        [
                                        allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - Math.round(allTS[stateFips][stateFips].length/3)*2 - 1].t,
                                        allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - Math.round(allTS[stateFips][stateFips].length/3) - 1].t,
                                        allTS[stateFips][stateFips][allTS[stateFips][stateFips].length-1].t]
                                        :
                                      [
                                        allTS["13"]["13"][allTS["13"]["13"].length - Math.round(allTS["13"]["13"].length/3)*2 - 1].t,
                                        allTS["13"]["13"][allTS["13"]["13"].length - Math.round(allTS["13"]["13"].length/3) - 1].t,
                                        allTS["13"]["13"][allTS["13"]["13"].length-1].t]}                         
                                      style={{grid:{background: "#ccdee8"}, tickLabels: {fontSize: 10}}} 
                                      tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                                    
                                    <VictoryGroup 
                                      colorScale={[stateColor]}
                                    >

                                    <VictoryLine data={stateFips && allTS[stateFips][stateFips] ? allTS[stateFips][stateFips] : allTS["13"]["13"]}
                                        x='t' y='caseRateMean'
                                        />

                                    </VictoryGroup>
                                    <VictoryArea
                                      style={{ data: {fill: "#00BFFF" , fillOpacity: 0.1} }}
                                      data={stateFips && allTS[stateFips][stateFips]? allTS[stateFips][stateFips] : allTS["13"]["13"]}
                                      x= 't' y = 'caseRateMean'

                                    />

                                    <VictoryLabel text= {stateFips ? numberWithCommas((allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].dailyCases).toFixed(0)) : numberWithCommas((allTS["13"]["13"][allTS["13"]["13"].length - 1].dailyCases).toFixed(0))} x={80} y={80} textAnchor="middle" style={{fontSize: 40, fontFamily: 'lato', fill: "#004071"}}/>
                                    
                                    <VictoryLabel text= {stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) > 0? (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) + "%": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) < 0? ((allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0)).substring(1) + "%": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) + "%"
                                                        : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) > 0? (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) + "%": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) < 0? ((allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0)).substring(1) + "%": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) + "%"} x={182} y={80} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato', fill: "#004071"}}/>
                                    
                                    <VictoryLabel text= {stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) > 0? "↑": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) < 0? "↓": ""
                                                         : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) > 0? "↑": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) < 0? "↓": ""} 
                                                        

                                                        x={145} y={80} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'

                                                        , fill: stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) > 0? "#FF0000": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) < 0? "#32CD32": ""
                                                         : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) > 0? "#FF0000": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) < 0? "#32CD32": ""

                                                      }}/>

                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "14-day"}  x={180} y={100} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "change"}  x={180} y={110} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "Daily Cases"}  x={120} y={20} textAnchor="middle" style={{fontSize: "19px", fontFamily: 'lato', fill: "#004071"}}/>

                                    
                        </VictoryChart>}
                      </div>
                    </Grid.Column>
                    <Grid.Column> 
                      <div>
                      {stateFips && 
                        <VictoryChart theme={VictoryTheme.material}
                                    minDomain={{ x: stateFips? allTS[stateFips][stateFips][allTS[stateFips][stateFips].length-15].t: allTS["13"]["13"][allTS["13"]["13"].length-15].t}}
                                    maxDomain = {{y: stateFips? getMax(allTS[stateFips][stateFips], "mortalityMean").mortalityMean + 0.8: getMax(allTS["13"]["13"], "mortalityMean").mortalityMean + 0.8}}                            
                                    width={235}
                                    height={180}       
                                    padding={{left: 0, right: -1, top: 150, bottom: -0.9}}
                                    containerComponent={<VictoryContainer responsive={false}/>}>
                                    
                                    <VictoryAxis
                                      tickValues={stateFips ? 
                                        [
                                        allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - Math.round(allTS[stateFips][stateFips].length/3)*2 - 1].t,
                                        allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - Math.round(allTS[stateFips][stateFips].length/3) - 1].t,
                                        allTS[stateFips][stateFips][allTS[stateFips][stateFips].length-1].t]
                                        :
                                      [
                                        allTS["13"]["13"][allTS["13"]["13"].length - Math.round(allTS["13"]["13"].length/3)*2 - 1].t,
                                        allTS["13"]["13"][allTS["13"]["13"].length - Math.round(allTS["13"]["13"].length/3) - 1].t,
                                        allTS["13"]["13"][allTS["13"]["13"].length-1].t]}                        
                                      style={{tickLabels: {fontSize: 10}}} 
                                      tickFormat={(t)=> new Date(t*1000).toLocaleDateString()}/>
                                    
                                    <VictoryGroup 
                                      colorScale={[stateColor]}
                                    >

                                      <VictoryLine data={stateFips && allTS[stateFips][stateFips] ? allTS[stateFips][stateFips] : allTS["13"]["13"]}
                                        x='t' y='mortalityMean'
                                        />

                                    </VictoryGroup>

                                    <VictoryArea
                                      style={{ data: { fill: "#00BFFF", stroke: "#00BFFF", fillOpacity: 0.1} }}
                                      data={stateFips && allTS[stateFips][stateFips]? allTS[stateFips][stateFips] : allTS["13"]["13"]}
                                      x= 't' y = 'mortalityMean'

                                    />

                                    
                                    <VictoryLabel text= {stateFips ? numberWithCommas((allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].dailyMortality).toFixed(0)) : numberWithCommas((allTS["13"]["13"][allTS["13"]["13"].length - 1].dailyMortality).toFixed(0))} x={80} y={80} textAnchor="middle" style={{fontSize: 40, fontFamily: 'lato', fill: "#004071"}}/>
                                    
                                    <VictoryLabel text= {stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0) + "%": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0)< 0? ((allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0)).substring(1) + "%": 
                                                        "0%"
                                                         : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0) + "%": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0) < 0? ((allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0)).substring(1) + "%": 
                                                         "0%"} x={182} y={80} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato', fill: "#004071"}}/>

                                    <VictoryLabel text= {stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "↑": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0)< 0? "↓": ""
                                                         : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "↑": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0)< 0?"↓": ""} 

                                                        x={146} y={80} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'

                                                        , fill: stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "#FF0000": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0)< 0? "#32CD32": ""
                                                         : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "#FF0000": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0)< 0?"#32CD32": ""}}/>

                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "14-day"}  x={180} y={100} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "change"}  x={180} y={110} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "Daily Deaths"}  x={120} y={20} textAnchor="middle" style={{fontSize: "19px", fontFamily: 'lato', fill: "#004071"}}/>

                        </VictoryChart>}
                      </div>
                    
                    </Grid.Column>
                    <text style={{fontWeight: 300, paddingLeft: 15,fontSize: "14pt", lineHeight: "18pt"}}>
                      *14-day change trends use 7-day averages.
                    </text>
                  </Grid.Row>

                  <Header as='h2' style={{fontWeight: 400}}>
                    <Header.Content style={{width : 550, fontSize: "18pt", textAlign: "center"}}>
                      Disparities in COVID-19 Mortality <b>{stateName}</b>
                      
                    </Header.Content>
                  </Header>
                  
                  {!raceData[fips]["Non-Hispanic African American"] && !!raceData[fips]["White Alone"] && stateFips !== "38" &&
                  <Grid.Row columns = {2} style = {{height: 298, paddingBottom: 287}}>
                    <Grid.Column > 
                      {!raceData[fips]["Non-Hispanic African American"]  && stateFips !== "02"  && 
                        <div style = {{marginTop: 10}}>
                          <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 55, fontWeight: 400}}> Deaths by Race</text>
                        </div>
                      }
                      {stateFips && !raceData[fips]["Non-Hispanic African American"] && stateFips !== "38"  && stateFips !== "02" &&
                        <VictoryChart
                                      theme = {VictoryTheme.material}
                                      width = {250}
                                      height = {40 * (( !!raceData[fips]["Asian Alone"] && raceData[fips]["Asian Alone"][0]['deathrateRace'] >= 0 && raceData[fips]["Asian Alone"][0]["deaths"] > 30 && raceData[fips]["Asian Alone"][0]["percentPop"] >= 1 ? 1: 0) + 
                                      (!!raceData[fips]["American Natives Alone"] && raceData[fips]["American Natives Alone"][0]['deathrateRace'] >= 0 && raceData[fips]["American Natives Alone"][0]['deaths'] > 30 && raceData[fips]["American Natives Alone"][0]["percentPop"] >= 1 ? 1 : 0) + 
                                      (!!raceData[fips]["African American Alone"] && raceData[fips]["African American Alone"][0]['deathrateRace'] >= 0 && raceData[fips]["African American Alone"][0]['deaths'] > 30 && raceData[fips]["African American Alone"][0]["percentPop"] >= 1 ? 1 : 0) + 
                                      (!!raceData[fips]["White Alone"] && raceData[fips]["White Alone"][0]['deathrateRace'] >= 0 && raceData[fips]["White Alone"][0]['deaths'] > 30 && raceData[fips]["White Alone"][0]["percentPop"] >= 1 ?1:0))}
                                      domainPadding={20}
                                      minDomain={{y: props.ylog?1:0}}
                                      padding={{left: 80, right: 35, top: 12, bottom: 1}}
                                      style = {{fontSize: "14pt"}}
                                      containerComponent={<VictoryContainer responsive={false}/>}
                                    >

                                      <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "16px", fill: '#000000', fontFamily: 'lato'}}} />
                                      <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                      <VictoryGroup>
                                      
                                      {"Asian Alone" in raceData[fips] && raceData[fips]["Asian Alone"][0]['deathrateRace'] >= 0 && raceData[fips]["Asian Alone"][0]["deaths"] > 30 && raceData[fips]["Asian Alone"][0]["percentPop"] >= 1 && 
                                        <VictoryBar
                                          barWidth= {10}
                                          horizontal
                                          barRatio={0.7}
                                          labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                          data={[

                                                 {key: "Asian", 'value': raceData[fips]["Asian Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[fips]["Asian Alone"][0]['deathrateRace'])}

                                          ]}
                                          labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                          style={{
                                            data: {
                                              fill: "#004071"
                                            }
                                          }}
                                          x="key"
                                          y="value"
                                        />
                                      }

                                      {"American Natives Alone" in raceData[fips] && raceData[fips]["American Natives Alone"][0]['deathrateRace'] >= 0 && raceData[fips]["American Natives Alone"][0]['deaths'] > 30 && raceData[fips]["American Natives Alone"][0]["percentPop"] >= 1 &&
                                        <VictoryBar
                                          barWidth= {10}
                                          horizontal
                                          labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                          data={[

                                                 {key: "American\n Natives", 'value': raceData[fips]["American Natives Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[fips]["American Natives Alone"][0]['deathrateRace'])}

                                          ]}
                                          labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                          style={{
                                            data: {
                                              fill: "#004071"
                                            }
                                          }}
                                          x="key"
                                          y="value"
                                        />
                                      }


                                      {"African American Alone" in raceData[fips] && raceData[fips]["African American Alone"][0]['deathrateRace'] >= 0  && raceData[fips]["African American Alone"][0]['deaths'] > 30 && raceData[fips]["African American Alone"][0]["percentPop"] >= 1 && 
                                        <VictoryBar
                                          barWidth= {10}
                                          horizontal
                                          labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                          data={[

                                                 {key: "African\n American", 'value': raceData[fips]["African American Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[fips]["African American Alone"][0]['deathrateRace'])}

                                          ]}
                                          labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                          style={{
                                            data: {
                                              fill: "#004071"
                                            }
                                          }}
                                          x="key"
                                          y="value"
                                        />
                                      }

                                      {"White Alone" in raceData[fips] && raceData[fips]["White Alone"][0]['deathrateRace'] >= 0  && raceData[fips]["White Alone"][0]['deaths'] > 30 && raceData[fips]["White Alone"][0]["percentPop"] >= 1 && 
                                        <VictoryBar
                                          barWidth= {10}
                                          horizontal
                                          barRatio={0.7}
                                          labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                          data={[

                                                 {key: "White", 'value': raceData[fips]["White Alone"][0]['deathrateRace'], 'label': numberWithCommas(raceData[fips]["White Alone"][0]['deathrateRace'])}

                                          ]}
                                          labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                          style={{
                                            data: {
                                              fill: "#004071"
                                            }
                                          }}
                                          x="key"
                                          y="value"
                                        />
                                      }

                                      
                                      </VictoryGroup>
                        </VictoryChart>
                      }
                      {!raceData[fips]["Non-Hispanic African American"] && stateFips !== "38" && stateFips !== "02" &&
                        <div style = {{marginTop: 10, textAlign: "center"}}>
                          <text x={15} y={20} style={{fontSize: '14pt', paddingLeft: 15, fontWeight: 400}}> Deaths per 100,000 <br/> residents</text>
                        </div>
                      }

                      {stateFips === "02" &&
                        <div style = {{marginTop: 10}}>
                          <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 55, fontWeight: 400}}> Deaths by Race</text>

                           <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 0, fontWeight: 400}}> <br/> <br/> <br/> 
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                           &nbsp;&nbsp;None Reported</text>
                        </div>
                      }

                    </Grid.Column>
                    <Grid.Column> 
                      {!!raceData[fips]["White Alone"] && stateFips !== "38" &&
                        <div style = {{marginTop: 10}}>
                          <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 55, fontWeight: 400}}> Deaths by Ethnicity</text>
                          {!(stateFips && !!raceData[fips]["White Alone"] && fips !== "38" && !(raceData[fips]["Hispanic"][0]['deathrateEthnicity'] < 0 || (!raceData[fips]["Hispanic"] && !raceData[fips]["Non Hispanic"] && !raceData[fips]["Non-Hispanic African American"] && !raceData[fips]["Non-Hispanic American Natives"] && !raceData[fips]["Non-Hispanic Asian"] && !raceData[fips]["Non-Hispanic White"] ) ))
                              && 
                            <center> <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 0, fontWeight: 400}}> <br/> <br/> None Reported</text> </center>

                        }
                        </div>
                      }
                      {stateFips && !!raceData[fips]["White Alone"] && fips !== "38" && !(raceData[fips]["Hispanic"][0]['deathrateEthnicity'] < 0 || (!raceData[fips]["Hispanic"] && !raceData[fips]["Non Hispanic"] && !raceData[fips]["Non-Hispanic African American"] && !raceData[fips]["Non-Hispanic American Natives"] && !raceData[fips]["Non-Hispanic Asian"] && !raceData[fips]["Non-Hispanic White"] ) ) && 
                        <VictoryChart
                                      theme = {VictoryTheme.material}
                                      width = {250}
                                      height = {!!raceData[fips]["Hispanic"] && !!raceData[fips]["Non Hispanic"] ?  81 : 3 * (!!raceData[fips]["Hispanic"] + !!raceData[fips]["Non Hispanic"] + !!raceData[fips]["Non-Hispanic African American"] + !!raceData[fips]["Non-Hispanic American Natives"] + !!raceData[fips]["Non-Hispanic Asian"] + !!raceData[fips]["Non-Hispanic White"] )}
                                      domainPadding={20}
                                      minDomain={{y: props.ylog?1:0}}
                                      padding={{left: 110, right: 35, top: !!raceData[fips]["Hispanic"] && !!raceData[fips]["Non Hispanic"] ? 13 : 10, bottom: 1}}
                                      style = {{fontSize: "14pt"}}
                                      containerComponent={<VictoryContainer responsive={false}/>}
                                    >

                                      <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "16px", fill: '#000000', fontFamily: 'lato'}}} />
                                      <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                      
                                        <VictoryGroup>



                                        {(!!raceData[fips]["Hispanic"] || (!!raceData[fips]["Hispanic"] && !!raceData[fips]["White Alone"] && raceData[fips]["Hispanic"][0]['deathrateEthnicity'] >= 0  && raceData[fips]["Hispanic"][0]['deaths'] > 30 && raceData[fips]["Hispanic"][0]["percentPop"] >= 1))&&
                                          <VictoryBar
                                            barWidth= {10}
                                            barRatio={0.1}
                                            horizontal
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "Hispanic", 'value': raceData[fips]["Hispanic"][0]['deathrateEthnicity'], 'label': numberWithCommas(raceData[fips]["Hispanic"][0]['deathrateEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non Hispanic"] && !!raceData[fips]["White Alone"] && raceData[fips]["Non Hispanic"][0]['deathrateEthnicity'] >= 0  && raceData[fips]["Non Hispanic"][0]['deaths'] > 30 && raceData[fips]["Non Hispanic"][0]["percentPop"] >= 1 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            barRatio={0.1}
                                            horizontal
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "Non Hispanic", 'value': raceData[fips]["Non Hispanic"][0]['deathrateEthnicity'], 'label': numberWithCommas(raceData[fips]["Non Hispanic"][0]['deathrateEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }
                                        
                                      
                                        {!!raceData[fips]["Non-Hispanic African American"] && raceData[fips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'] >= 0  && raceData[fips]["Non-Hispanic African American"][0]['deaths'] > 30 && raceData[fips]["Non-Hispanic African American"][0]["percentPop"] >= 1 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "African\n American", 'value': raceData[fips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non-Hispanic American Natives"] && raceData[fips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'] >= 0 && raceData[fips]["Non-Hispanic American Natives"][0]['deaths'] > 30 && raceData[fips]["Non-Hispanic American Natives"][0]["percentPop"] >= 1 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "American\n Natives", 'value': raceData[fips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non-Hispanic Asian"] && raceData[fips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'] >= 0  && raceData[fips]["Non-Hispanic Asian"][0]['deaths'] > 30 && raceData[fips]["Non-Hispanic Asian"][0]["percentPop"] >= 1 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "Asian", 'value': raceData[fips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }
                                        {!!raceData[fips]["Non-Hispanic White"] && raceData[fips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'] >= 0  && raceData[fips]["Non-Hispanic White"][0]['deaths'] > 30 && raceData[fips]["Non-Hispanic White"][0]["percentPop"] >= 1 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "White", 'value': raceData[fips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        
                                        </VictoryGroup>
                                

                        </VictoryChart>
                      }
                      {!!raceData[fips]["White Alone"] && fips !== "38" && !(raceData[fips]["Hispanic"][0]['deathrateEthnicity'] < 0 || (!raceData[fips]["Hispanic"] && !raceData[fips]["Non Hispanic"] && !raceData[fips]["Non-Hispanic African American"] && !raceData[fips]["Non-Hispanic American Natives"] && !raceData[fips]["Non-Hispanic Asian"] && !raceData[fips]["Non-Hispanic White"] ) ) && 
                        <div style = {{marginTop: 10, textAlign: "center", width: 300}}>
                          <text style={{fontSize: '14pt', paddingLeft: 35, fontWeight: 400}}> Deaths per 100,000 <br/> &nbsp;&nbsp;&nbsp;&nbsp;residents</text>
                        </div>
                      }

                      
                    </Grid.Column>
                  </Grid.Row>
                  }

                  {(!!raceData[fips]["Non-Hispanic African American"] || !!raceData[fips]["Non-Hispanic White"] ) && fips !== "38" &&
                  <Grid.Row columns = {1}>
                    <Grid.Column style = {{ marginLeft : 110, paddingBottom: (13+ 30 * (!raceData[fips]["Hispanic"] + !raceData[fips]["Non Hispanic"] + !raceData[fips]["Non-Hispanic African American"] + !raceData[fips]["Non-Hispanic American Natives"] + !raceData[fips]["Non-Hispanic Asian"] + !raceData[fips]["Non-Hispanic White"] ))}}> 
                      {stateFips && !raceData[fips]["White Alone"] &&
                        <div style = {{marginTop: 10}}>
                          <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 50, fontWeight: 400}}> Deaths by Race & Ethnicity</text>
                        </div>
                      }
                      {stateFips && !raceData[fips]["White Alone"] && stateFips !== "38" &&
                        <VictoryChart
                                      theme = {VictoryTheme.material}
                                      width = {310}
                                      height = {32 * (!!raceData[fips]["Hispanic"] + !!raceData[fips]["Non Hispanic"] + !!raceData[fips]["Non-Hispanic African American"] + !!raceData[fips]["Non-Hispanic American Natives"] + !!raceData[fips]["Non-Hispanic Asian"] + !!raceData[fips]["Non-Hispanic White"] )}
                                      domainPadding={20}
                                      minDomain={{y: props.ylog?1:0}}
                                      padding={{left: 110, right: 45, top: !!raceData[fips]["Hispanic"] && !!raceData[fips]["Non Hispanic"] ? 12 : 10, bottom: 1}}
                                      style = {{fontSize: "14pt"}}
                                      containerComponent={<VictoryContainer responsive={false}/>}
                                    >

                                      <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "16px", fill: '#000000', fontFamily: 'lato'}}} />
                                      <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                      
                                        <VictoryGroup>

                                        {(!!raceData[fips]["Hispanic"] || (!!raceData[fips]["Hispanic"] && !!raceData[fips]["White Alone"] && raceData[fips]["Hispanic"][0]['deathrateEthnicity'] >= 0  && raceData[fips]["Hispanic"][0]['deaths'] > 30 && raceData[fips]["Hispanic"][0]["percentPop"] >= 1 ))&&
                                          <VictoryBar
                                            barWidth= {10}
                                            barRatio={0.1}
                                            horizontal
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "Hispanic", 'value': raceData[fips]["Hispanic"][0]['deathrateEthnicity'], 'label': numberWithCommas(raceData[fips]["Hispanic"][0]['deathrateEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non Hispanic"] && !!raceData[fips]["White Alone"] && raceData[fips]["Non Hispanic"][0]['deathrateEthnicity'] >= 0  && raceData[fips]["Non Hispanic"][0]['deaths'] > 30 && raceData[fips]["Non Hispanic"][0]["percentPop"] >= 1 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            barRatio={0.1}
                                            horizontal
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "Non Hispanic", 'value': raceData[fips]["Non Hispanic"][0]['deathrateEthnicity'], 'label': numberWithCommas(raceData[fips]["Non Hispanic"][0]['deathrateEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }
                                        
                                        {!!raceData[fips]["Non-Hispanic African American"] && raceData[fips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'] >= 0  && raceData[fips]["Non-Hispanic African American"][0]['deaths'] > 30 && raceData[fips]["Non-Hispanic African American"][0]["percentPop"] >= 1 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "African\n American", 'value': raceData[fips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic African American"][0]['deathrateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non-Hispanic American Natives"] && raceData[fips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'] >= 0  && raceData[fips]["Non-Hispanic American Natives"][0]['deaths'] > 30 && raceData[fips]["Non-Hispanic American Natives"][0]["percentPop"] >= 1 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "American\n Natives", 'value': raceData[fips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic American Natives"][0]['deathrateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non-Hispanic Asian"] && raceData[fips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'] >= 0  && raceData[fips]["Non-Hispanic Asian"][0]['deaths'] > 30 && raceData[fips]["Non-Hispanic Asian"][0]["percentPop"] >= 1 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "Asian", 'value': raceData[fips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic Asian"][0]['deathrateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }
                                        {!!raceData[fips]["Non-Hispanic White"] && raceData[fips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'] >= 0 && raceData[fips]["Non-Hispanic White"][0]['deaths'] > 30 && raceData[fips]["Non-Hispanic White"][0]["percentPop"] >= 1 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "White", 'value': raceData[fips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic White"][0]['deathrateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#004071"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        
                                        </VictoryGroup>
                                

                        </VictoryChart>
                      }
                      {stateFips && !raceData[fips]["White Alone"] &&
                        <div style = {{marginTop: 10}}>
                          <text style={{fontSize: '14pt', marginLeft: 109, fontWeight: 400}}> Deaths per 100,000 <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;residents</text>
                        </div>
                      }

                    </Grid.Column>
                  </Grid.Row>}

                  {stateFips === "38" &&

                    <Grid.Row columns = {1}>
                    <Grid.Column style = {{ marginLeft : 110, paddingBottom: 123}}> 
                      {stateFips === "38" &&
                        <div style = {{marginTop: 50}}>
                          <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 15, fontWeight: 400}}> Deaths per capita by Race & Ethnicity <br/> <br/> <br/> <br/> </text>
                          <text style={{fontSize: '14pt', paddingLeft: 100, fontWeight: 400}}> None Reported</text>
                        </div>
                      }
                      
                    </Grid.Column>
                  </Grid.Row>


                  }

                  <Grid.Row style={{top: fips === "38"? -30 : stateFips && !raceData[fips]["White Alone"] ? -40 : -30, paddingLeft: 0}}>
                  
                  {fips === "38" &&
                    <text style={{fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "18pt"}}>
                      {stateName} is not reporting deaths by race or ethnicity.
                      <br/>
                      <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a>
                      <br/><b>Data last updated:</b> {date}, updated every weekday.<br/>
                    
                    </text>}

                  {stateFips !== "38" && !raceData[fips]["Non-Hispanic African American"] && !!raceData[fips]["White Alone"] && (!raceData[fips]["Non Hispanic"] && !raceData[fips]["Non-Hispanic American Natives"] && !raceData[fips]["Non-Hispanic Asian"] && !raceData[fips]["Non-Hispanic White"] )
                              && 
                    <text style={{fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "18pt"}}>
                      {stateName} reports deaths by race. The chart shows race groups that constitutes at least 1% of the state population and have 30 or more deaths. Race data are known for {raceData[fips]["Race Missing"][0]["percentRaceDeaths"] + "%"} of deaths in {stateName}.
                      <br/>
                      <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a>
                      <br/><b>Data last updated:</b> {date}, updated every weekday.<br/>
                    
                    </text>}

                  {stateFips !== "38"  && !!raceData[fips]["White Alone"] && !!raceData[fips]["White Alone"] && !(!raceData[fips]["Hispanic"] && !raceData[fips]["Non Hispanic"] && !raceData[fips]["Non-Hispanic African American"] && !raceData[fips]["Non-Hispanic American Natives"] && !raceData[fips]["Non-Hispanic Asian"] && !raceData[fips]["Non-Hispanic White"] )
                              && 
                    <text style={{fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "18pt"}}>
                      {stateName} reports deaths by race and ethnicity separately. The chart shows race and ethnicity groups that constitute at least 1% of the state population and have 30 or more deaths. Race data are known for {raceData[fips]["Race Missing"][0]["percentRaceDeaths"] + "%"} of deaths while ethnicity data are known for {raceData[fips]["Ethnicity Missing"][0]["percentEthnicityDeaths"] + "%"} of deaths in {stateName}.
                      <br/>
                      <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a>
                      <br/><b>Data last updated:</b> {date}, updated every weekday.<br/>
                    
                    </text>}

                  {stateFips !== "38"  && (!!raceData[fips]["Non-Hispanic African American"] || !!raceData[fips]["Non-Hispanic White"] ) && 
                    <text style={{fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "18pt"}}>
                      {stateName} reports deaths by combined race and ethnicity groups. The chart shows race and ethnicity groups that constitute at least 1% of the state population and have 30 or more deaths. Race and ethnicity data are known for {raceData[fips]["Race & Ethnicity Missing"][0]["percentRaceEthnicityDeaths"] + "%"} of deaths in {stateName}.
                      <br/>
                      <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a>
                      <br/><b>Data last updated:</b> {date}, updated every weekday.<br/>
                    
                    </text>}

                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          

          <Notes />
        </Container>
        <ReactTooltip > <font size="+2"><b >{stateName}</b> </font> <br/>  <b>Click for county-level data.</b> </ReactTooltip>
      </div>
      );
  } else {
    return <Loader active inline='centered' />
  }
}