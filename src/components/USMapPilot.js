import React, { useEffect, useState } from 'react'
import { Container, Grid, Dropdown, Breadcrumb, Header, Loader, Divider, Image, Modal, Button, Icon} from 'semantic-ui-react'
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
  VictoryArea,
  VictoryContainer
} from 'victory';
import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";
import configs from "./state_config.json";
import ReactDOM from 'react-dom';
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

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
  const [open, setOpen] = React.useState(true)

  const history = useHistory();
  const [tooltipContent, setTooltipContent] = useState('');
  
  const [stateLabels, setStateLabels] = useState();
  const [date, setDate] = useState('');

  const [data, setData] = useState();
  const [allTS, setAllTS] = useState();
  const [raceData, setRaceData] = useState();
  const [dataFltrd, setDataFltrd] = useState();
  const [dataState, setDataState] = useState();

  const [stateName, setStateName] = useState('Georgia');
  const [fips, setFips] = useState('13');
  const [stateFips, setStateFips] = useState();
  
  const [colorScale, setColorScale] = useState();
  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [varMap, setVarMap] = useState({});
  const [metric, setMetric] = useState('mean7daycases');
  const [metricOptions, setMetricOptions] = useState('mean7daycases');
  const [metricName, setMetricName] = useState('Average Daily COVID-19 Cases');

  const [caseRate, setCaseRate] = useState();
  const [percentChangeCases, setPercentChangeCases] = useState();
  const [mortality, setMortality] = useState();
  const [percentChangeMortality, setPercentChangeMortality] = useState();

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

  if (data && dataFltrd && stateLabels) {
    console.log(Object.keys(raceData[fips]).length);
  return (
      <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '8em', minWidth: '1260px'}}>
          <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt"}}>
            <Breadcrumb.Section active >United States</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
          </Breadcrumb>
          <Divider hidden />
          <Grid columns={16}>
          <div style={{fontSize: "14pt", paddingTop: 10, paddingBottom: 30}}>
            See Dashboard Guide (<a style ={{color: "#397AB9"}}href="Dashboard user guide.pdf" target="_blank" rel="noopener noreferrer"> PDF </a> / <a style ={{color: "#397AB9"}} href="https://youtu.be/PmI42rHnI6U" target="_blank" rel="noopener noreferrer"> YouTube </a>)

          </div>

            <Modal
              open = {open}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
            >

            <Modal.Header>Welcome to the COVID-19 Health Equity Interactive Dashboard! <br/> New updates since Sept. 1, 2020:</Modal.Header>

            <Modal.Content image scrolling>
              <Image width = {430} height = {200}  src='/modal images/national.png' wrapped />
              <Modal.Description>
                <p>
                  <b> National Report <br/><br/><br/> </b>

                  The National Report tab takes you to a detailed overview of the impact of COVID-19 in the U.S.. 
                  How has the pandemic been trending? What are the most hard hit counties? 
                  Who are the most vulnerable communities?
                  <a href = "/national-report/pilot"> Click here for more</a>. 

                </p>
              </Modal.Description>
            </Modal.Content>

            <Modal.Content image scrolling>
              <Image width = {350} height = {120} src='/podcast images/Dr. Nneka Sederstrom.jpg' wrapped />
              <Modal.Description>
                <p>
                  <b>"We Have to Be Better": Dr. Nneka Sederstrom on Racism and Ethics During Covid-19 <br/><br/> <br/></b>

                  Dr. Nneka Sederstrom discusses how COVID-19 has brought issues of structural racism in medicine to the 
                  forefront of clinical ethics and pandemic response conversations...
                  <a href = "/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics">Click here for more</a>. 
                </p>
              </Modal.Description>
            </Modal.Content>

            <Modal.Content image scrolling>
              <Image width = {452} height = {235}  src='/podcast images/JudyMonroe.jpg' wrapped />
              <Modal.Description>
                <p>
                  <b>"You've Got to Have Trust": Dr. Judy Monroe on Lessons Learned About Pandemic Preparedness <br/><br/> <br/></b>

                  In a podcast, Dr. Monroe tells us about the lessons she learned about leadership and community partnerships during 
                  pandemics based on her experience as State Health Commissioner of Indiana during the 2009 H1N1 pandemic...
                  <a href = "/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC">Click here for more</a>. 
                </p>
              </Modal.Description>
            </Modal.Content>

            <Modal.Content image scrolling>
              <Image width = {438} height = {215}  src='/podcast images/CarlosdelRio.jpg' wrapped />
              <Modal.Description>
                <p>
                  <b>Dr. Carlos Del Rio on COVID-19 Equity and Outcomes<br/> <br/><br/></b>

                  Considering health equity and disparity, how will the pandemic progress? What is our current strategy? 
                  What can be and needs to be done to change the course of the pandemic? Listen to what Dr. Carlos Del Rio has to say. 
                  <a href = "/media-hub/podcast/Dr.Carlos_Del_Rio_on_COVID-19_Equity_&_Outcomes"> Click here for more</a>. 
                </p>
              </Modal.Description>
            </Modal.Content>

            <Modal.Actions>
              <Button onClick={() => setOpen(false)} primary>
                Close <Icon name='chevron right' />
              </Button>
            </Modal.Actions>
            </Modal>

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
                    For a complete table of variable definition, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                    </text>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column width={7} style ={{paddingLeft: 0}}>
                <Header as='h2' style={{fontWeight: 400}}>
                  <Header.Content style={{width : 550, fontSize: "18pt"}}>
                    A Snapshot of Health Disparities in <b>{stateName}</b>
                    
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

                                    <VictoryLabel text= {stateFips ? numberWithCommas((allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].caseRateMean).toFixed(0)) : numberWithCommas((allTS["13"]["13"][allTS["13"]["13"].length - 1].caseRateMean).toFixed(0))} x={80} y={30} textAnchor="middle" style={{fontSize: 40, fontFamily: 'lato', fill: "#004071"}}/>
                                    
                                    <VictoryLabel text= {stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) > 0? (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) + "%": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) < 0? ((allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0)).substring(1) + "%": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) + "%"
                                                        : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) > 0? (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) + "%": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) < 0? ((allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0)).substring(1) + "%": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) + "%"} x={182} y={30} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato', fill: "#004071"}}/>
                                    
                                    <VictoryLabel text= {stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) > 0? "↑": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) < 0? "↓": ""
                                                         : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) > 0? "↑": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) < 0? "↓": ""} 
                                                        

                                                        x={145} y={30} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'

                                                        , fill: stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) > 0? "#FF0000": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyCases).toFixed(0) < 0? "#32CD32": ""
                                                         : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) > 0? "#FF0000": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyCases).toFixed(0) < 0? "#32CD32": ""

                                                      }}/>

                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "14-day"}  x={180} y={50} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "change"}  x={180} y={60} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "Daily Cases"}  x={120} y={100} textAnchor="middle" style={{fontSize: "19px", fontFamily: 'lato', fill: "#004071"}}/>

                                    
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

                                    
                                    <VictoryLabel text= {stateFips ? numberWithCommas((allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].mortalityMean).toFixed(0)) : numberWithCommas((allTS["13"]["13"][allTS["13"]["13"].length - 1].mortalityMean).toFixed(0))} x={80} y={30} textAnchor="middle" style={{fontSize: 40, fontFamily: 'lato', fill: "#004071"}}/>
                                    
                                    <VictoryLabel text= {stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0) + "%": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0)< 0? ((allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0)).substring(1) + "%": 
                                                        "0%"
                                                         : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0) + "%": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0) < 0? ((allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0)).substring(1) + "%": 
                                                         "0%"} x={182} y={30} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato', fill: "#004071"}}/>

                                    <VictoryLabel text= {stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "↑": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0)< 0? "↓": ""
                                                         : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "↑": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0)< 0?"↓": ""} 

                                                        x={146} y={30} textAnchor="middle" style={{fontSize: 24, fontFamily: 'lato'

                                                        , fill: stateFips ? 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "#FF0000": 
                                                        (allTS[stateFips][stateFips][allTS[stateFips][stateFips].length - 1].percent14dayDailyDeaths).toFixed(0)< 0? "#32CD32": ""
                                                         : 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0) > 0? "#FF0000": 
                                                        (allTS["13"]["13"][allTS["13"]["13"].length - 1].percent14dayDailyDeaths).toFixed(0)< 0?"#32CD32": ""}}/>

                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "14-day"}  x={180} y={50} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "change"}  x={180} y={60} textAnchor="middle" style={{fontSize: 12, fontFamily: 'lato', fill: "#004071"}}/>
                                    <VictoryLabel text= {stateFips === "_nation" ? "" : "Daily Deaths"}  x={120} y={100} textAnchor="middle" style={{fontSize: "19px", fontFamily: 'lato', fill: "#004071"}}/>

                        </VictoryChart>}
                      </div>
                    
                    </Grid.Column>
                  </Grid.Row>

                  
                  {!raceData[fips]["Non-Hispanic African American"] && !!raceData[fips]["White Alone"] &&
                  <Grid.Row columns = {2} style = {{height: 298}}>
                    <Grid.Column> 
                      {!raceData[fips]["Non-Hispanic African American"] &&
                        <div style = {{marginTop: 50}}>
                          <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 15, fontWeight: 400}}> Cases per capita by Race</text>
                        </div>
                      }
                      {stateFips && !raceData[fips]["Non-Hispanic African American"] && 
                        <VictoryChart
                                      theme = {VictoryTheme.material}
                                      width = {250}
                                      height = {40 * (( !!raceData[fips]["Asian Alone"] && raceData[fips]["Asian Alone"][0]['caserateRace'] >= 0? 1: 0) + (!!raceData[fips]["American Natives Alone"] && raceData[fips]["American Natives Alone"][0]['caserateRace'] >= 0? 1: 0) + (!!raceData[fips]["African American Alone"] && raceData[fips]["African American Alone"][0]['caserateRace'] >= 0 ?1:0) + (!!raceData[fips]["White Alone"] && raceData[fips]["White Alone"][0]['caserateRace'] >= 0 ?1:0))}
                                      domainPadding={20}
                                      minDomain={{y: props.ylog?1:0}}
                                      padding={{left: 80, right: 35, top: 12, bottom: 1}}
                                      style = {{fontSize: "14pt"}}
                                      containerComponent={<VictoryContainer responsive={false}/>}
                                    >

                                      <VictoryAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "16px", fill: '#000000', fontFamily: 'lato'}}} />
                                      <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                      <VictoryGroup>
                                      
                                      {"Asian Alone" in raceData[fips] && raceData[fips]["Asian Alone"][0]['caserateRace'] >= 0 &&
                                        <VictoryBar
                                          barWidth= {10}
                                          horizontal
                                          barRatio={0.7}
                                          labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                          data={[

                                                 {key: "Asian", 'value': raceData[fips]["Asian Alone"][0]['caserateRace'], 'label': numberWithCommas(raceData[fips]["Asian Alone"][0]['caserateRace'])}

                                          ]}
                                          labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                          style={{
                                            data: {
                                              fill: "#487f84"
                                            }
                                          }}
                                          x="key"
                                          y="value"
                                        />
                                      }

                                      {"American Natives Alone" in raceData[fips] && raceData[fips]["American Natives Alone"][0]['caserateRace'] >= 0 &&
                                        <VictoryBar
                                          barWidth= {10}
                                          horizontal
                                          labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                          data={[

                                                 {key: "American\n Natives", 'value': raceData[fips]["American Natives Alone"][0]['caserateRace'], 'label': numberWithCommas(raceData[fips]["American Natives Alone"][0]['caserateRace'])}

                                          ]}
                                          labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                          style={{
                                            data: {
                                              fill: "#487f84"
                                            }
                                          }}
                                          x="key"
                                          y="value"
                                        />
                                      }


                                      {"African American Alone" in raceData[fips] && raceData[fips]["African American Alone"][0]['caserateRace'] >= 0 &&
                                        <VictoryBar
                                          barWidth= {10}
                                          horizontal
                                          labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                          data={[

                                                 {key: "African\n American", 'value': raceData[fips]["African American Alone"][0]['caserateRace'], 'label': numberWithCommas(raceData[fips]["African American Alone"][0]['caserateRace'])}

                                          ]}
                                          labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                          style={{
                                            data: {
                                              fill: "#487f84"
                                            }
                                          }}
                                          x="key"
                                          y="value"
                                        />
                                      }

                                      {"White Alone" in raceData[fips] && raceData[fips]["White Alone"][0]['caserateRace'] >= 0 &&
                                        <VictoryBar
                                          barWidth= {10}
                                          horizontal
                                          barRatio={0.7}
                                          labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                          data={[

                                                 {key: "White", 'value': raceData[fips]["White Alone"][0]['caserateRace'], 'label': numberWithCommas(raceData[fips]["White Alone"][0]['caserateRace'])}

                                          ]}
                                          labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                          style={{
                                            data: {
                                              fill: "#487f84"
                                            }
                                          }}
                                          x="key"
                                          y="value"
                                        />
                                      }

                                      
                                      </VictoryGroup>
                        </VictoryChart>
                      }

                      {stateFips && !raceData[fips]["Non-Hispanic African American"] && 

                        <div style = {{marginTop: 5}}>
                          <text x={0} y={20} style={{fontSize: '14pt', marginLeft: 60, fontWeight: 400}}> Cases per 100,000</text>
                        </div>

                      }
                    </Grid.Column>
                    <Grid.Column> 
                      {!!raceData[fips]["White Alone"] &&
                        <div style = {{marginTop: 50}}>
                          <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 15, fontWeight: 400}}> Cases per capita by Ethnicity</text>
                          {(!raceData[fips]["Hispanic"] && !raceData[fips]["Non Hispanic"] && !raceData[fips]["Non-Hispanic African American"] && !raceData[fips]["Non-Hispanic American Natives"] && !raceData[fips]["Non-Hispanic Asian"] && !raceData[fips]["Non-Hispanic White"] )
                              && 
                            <center> <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 0, fontWeight: 400}}> <br/> <br/> None Reported</text> </center>

                        }
                        </div>
                      }
                      {stateFips && !!raceData[fips]["White Alone"] &&
                        <VictoryChart
                                      theme = {VictoryTheme.material}
                                      width = {250}
                                      height = {!!raceData[fips]["Hispanic"] && !!raceData[fips]["Non Hispanic"] ?  81 : 32 * (!!raceData[fips]["Hispanic"] + !!raceData[fips]["Non Hispanic"] + !!raceData[fips]["Non-Hispanic African American"] + !!raceData[fips]["Non-Hispanic American Natives"] + !!raceData[fips]["Non-Hispanic Asian"] + !!raceData[fips]["Non-Hispanic White"] )}
                                      domainPadding={20}
                                      minDomain={{y: props.ylog?1:0}}
                                      padding={{left: 110, right: 35, top: !!raceData[fips]["Hispanic"] && !!raceData[fips]["Non Hispanic"] ? 13 : 10, bottom: 1}}
                                      style = {{fontSize: "14pt"}}
                                      containerComponent={<VictoryContainer responsive={false}/>}
                                    >

                                      <VictoryAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "16px", fill: '#000000', fontFamily: 'lato'}}} />
                                      <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                      
                                        <VictoryGroup>



                                        {!!raceData[fips]["Hispanic"] && !!raceData[fips]["White Alone"] && raceData[fips]["Hispanic"][0]['caserateEthnicity'] >=0 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            barRatio={0.1}
                                            horizontal
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "Hispanic", 'value': raceData[fips]["Hispanic"][0]['caserateEthnicity'], 'label': numberWithCommas(raceData[fips]["Hispanic"][0]['caserateEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#487f84"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non Hispanic"] && !!raceData[fips]["White Alone"] && raceData[fips]["Non Hispanic"][0]['caserateEthnicity'] >= 0 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            barRatio={0.1}
                                            horizontal
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "Non Hispanic", 'value': raceData[fips]["Non Hispanic"][0]['caserateEthnicity'], 'label': numberWithCommas(raceData[fips]["Non Hispanic"][0]['caserateEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#487f84"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }
                                        
                                      
                                        {!!raceData[fips]["Non-Hispanic African American"] && raceData[fips]["Non-Hispanic African American"][0]['caserateRaceEthnicity'] >= 0 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "African\n American", 'value': raceData[fips]["Non-Hispanic African American"][0]['caserateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic African American"][0]['caserateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#487f84"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non-Hispanic American Natives"] && raceData[fips]["Non-Hispanic American Natives"][0]['caserateRaceEthnicity'] >= 0 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "American\n Natives", 'value': raceData[fips]["Non-Hispanic American Natives"][0]['caserateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic American Natives"][0]['caserateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#487f84"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non-Hispanic Asian"] && raceData[fips]["Non-Hispanic Asian"][0]['caserateRaceEthnicity'] >= 0 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "Asian", 'value': raceData[fips]["Non-Hispanic Asian"][0]['caserateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic Asian"][0]['caserateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#487f84"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }
                                        {!!raceData[fips]["Non-Hispanic White"] && raceData[fips]["Non-Hispanic White"][0]['caserateRaceEthnicity'] >= 0 && 
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "White", 'value': raceData[fips]["Non-Hispanic White"][0]['caserateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic White"][0]['caserateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#487f84"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        
                                        </VictoryGroup>
                                

                        </VictoryChart>
                      }

                      {stateFips && !!raceData[fips]["White Alone"] &&

                        <div style = {{marginTop: 5}}>
                          <text x={0} y={20} style={{fontSize: '14pt', marginLeft: 90, fontWeight: 400}}> Cases per 100,000</text>
                        </div>

                      }
                    </Grid.Column>
                  </Grid.Row>
                  }

                  {(!!raceData[fips]["Non-Hispanic African American"] || !!raceData[fips]["Non-Hispanic White"] ) && 
                  <Grid.Row columns = {1}>
                    <Grid.Column style = {{ marginLeft : 110, paddingBottom: (20+ 30 * (!raceData[fips]["Hispanic"] + !raceData[fips]["Non Hispanic"] + !raceData[fips]["Non-Hispanic African American"] + !raceData[fips]["Non-Hispanic American Natives"] + !raceData[fips]["Non-Hispanic Asian"] + !raceData[fips]["Non-Hispanic White"] ))}}> 
                      {!raceData[fips]["White Alone"] &&
                        <div style = {{marginTop: 50}}>
                          <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 15, fontWeight: 400}}> Cases per capita by Race/Ethnicity</text>
                        </div>
                      }
                      {stateFips && !raceData[fips]["White Alone"] &&
                        <VictoryChart
                                      theme = {VictoryTheme.material}
                                      width = {300}
                                      height = {30 * (!!raceData[fips]["Hispanic"] + !!raceData[fips]["Non Hispanic"] + !!raceData[fips]["Non-Hispanic African American"] + !!raceData[fips]["Non-Hispanic American Natives"] + !!raceData[fips]["Non-Hispanic Asian"] + !!raceData[fips]["Non-Hispanic White"] )}
                                      domainPadding={20}
                                      minDomain={{y: props.ylog?1:0}}
                                      padding={{left: 110, right: 35, top: !!raceData[fips]["Hispanic"] && !!raceData[fips]["Non Hispanic"] ? 12 : 10, bottom: 1}}
                                      style = {{fontSize: "14pt"}}
                                      containerComponent={<VictoryContainer responsive={false}/>}
                                    >

                                      <VictoryAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "19px"}, tickLabels: {fontSize: "16px", fill: '#000000', fontFamily: 'lato'}}} />
                                      <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "19px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                                      
                                        <VictoryGroup>
                                        
                                        {!!raceData[fips]["Non-Hispanic African American"] && raceData[fips]["Non-Hispanic African American"][0]['caserateRaceEthnicity'] >= 0 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "African\n American", 'value': raceData[fips]["Non-Hispanic African American"][0]['caserateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic African American"][0]['caserateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#487f84"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non-Hispanic American Natives"] && raceData[fips]["Non-Hispanic American Natives"][0]['caserateRaceEthnicity'] >= 0 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "American\n Natives", 'value': raceData[fips]["Non-Hispanic American Natives"][0]['caserateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic American Natives"][0]['caserateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#487f84"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }

                                        {!!raceData[fips]["Non-Hispanic Asian"] && raceData[fips]["Non-Hispanic Asian"][0]['caserateRaceEthnicity'] >= 0 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "Asian", 'value': raceData[fips]["Non-Hispanic Asian"][0]['caserateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic Asian"][0]['caserateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#487f84"
                                              }
                                            }}
                                            x="key"
                                            y="value"
                                          />
                                        }
                                        {!!raceData[fips]["Non-Hispanic White"] && raceData[fips]["Non-Hispanic White"][0]['caserateRaceEthnicity'] >= 0 &&
                                          <VictoryBar
                                            barWidth= {10}
                                            horizontal
                                            barRatio={0.7}
                                            labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                            data={[

                                                   {key: "White", 'value': raceData[fips]["Non-Hispanic White"][0]['caserateRaceEthnicity'], 'label': numberWithCommas(raceData[fips]["Non-Hispanic White"][0]['caserateRaceEthnicity'])}

                                            ]}
                                            labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "19px", fill: "#000000" }}/>}
                                            style={{
                                              data: {
                                                fill: "#487f84"
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

                        <div style = {{marginTop: 5}}>
                          <text x={0} y={20} style={{fontSize: '14pt', marginLeft: 90, fontWeight: 400}}> Cases per 100,000</text>
                        </div>

                      }
                    </Grid.Column>
                  </Grid.Row>}

                  {Object.keys(raceData[fips]).length === 1 &&

                    <Grid.Row columns = {1}>
                    <Grid.Column style = {{ marginLeft : 110, paddingBottom: 120}}> 
                      {Object.keys(raceData[fips]).length === 1 &&
                        <div style = {{marginTop: 50}}>
                          <text x={0} y={20} style={{fontSize: '14pt', paddingLeft: 15, fontWeight: 400}}> Cases per capita by Race/Ethnicity <br/> <br/> <br/> <br/> </text>
                          <text x={100} y={20} style={{fontSize: '14pt', paddingLeft: 80, fontWeight: 400}}> None Reported</text>
                        </div>
                      }
                      
                    </Grid.Column>
                  </Grid.Row>


                  }

                  <Grid.Row style={{top: -30, paddingLeft: 0}}>
                    <text style={{fontWeight: 300, fontSize: "14pt", paddingTop: 1, lineHeight: "18pt"}}>
                      {stateName} reports distribution of cases across non-Hispanic race categories, with {!!raceData[fips]["Race Missing"]? raceData[fips]["Race Missing"][0]["percentCases"] + "%":!!raceData[fips]["Ethnicity Missing"]? raceData[fips]["Ethnicity Missing"][0]["percentCases"] + "%" : !!raceData[fips]["Race & Ethnicity Missing"]? raceData[fips]["Race & Ethnicity Missing"][0]["percentCases"] + "%": "na%"} of cases of unknown {!!raceData[fips]["Race Missing"]? "race" :!!raceData[fips]["Ethnicity Missing"]? "ethnicity" : !!raceData[fips]["Race & Ethnicity Missing"]? "race/ethnicity": "race and ethnicity"}. Here we only show race categories that constitute at least 1% of the state population and have 30 or more cases. Per capita is defined as per 100,000 population.
                      <br/>
                      <br/> <i>Data source</i>: <a style ={{color: "#397AB9"}} href = "https://covidtracking.com/about-data" target = "_blank" rel="noopener noreferrer"> The COVID Tracking Project </a>
                      <br/><b>Data last updated:</b> {date}, updated every weekday.<br/>
                    
                    </text>
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