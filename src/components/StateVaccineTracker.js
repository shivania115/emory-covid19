import React, { useEffect, useState, Component, createRef} from 'react'
import { Container, Breadcrumb, Dropdown, Header, Grid, Loader, Divider, Popup, Button, Image, Rail, Sticky, Ref, Segment, Accordion, Icon, Menu, Message, Transition} from 'semantic-ui-react'
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
  VictoryLine,
  VictoryLabel,
  VictoryArea,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryZoomContainer
} from 'victory';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _, { toArray } from 'lodash';
import { scaleQuantile } from "d3-scale";
import fips2county from './fips2county.json'
import stateOptions from "./stateOptions.json";
import configs from "./state_config.json";



function getMax(arr, prop) {
  var max = 0;
  for (var i=0 ; i<arr.length ; i++) {
      if (max === 0 || parseInt(arr[i][prop]) > parseInt(max))
          max = arr[i][prop];
  }
  return max;
}

function getMaxRange(arr, prop, range) {
  var max = 0;
  for (var i=range ; i<arr.length ; i++) {
      if (max === 0 || parseInt(arr[i][prop]) > parseInt(max)){
          max = arr[i][prop];
      }
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


const colorPalette = [
        "#e1dce2",
        "#d3b6cd",
        "#bf88b5", 
        "#af5194", 
        "#99528c", 
        "#633c70", 
      ];
const countyColor = '#f2a900';
const stateColor = "#778899";
const nationColor = '#b1b3b3';
const VaxColor = [
  "#72ABB1",
  "#337fb5"
];

const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
  "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
];

// const marks = [
//   //{value: 1, label: 'Jan.'}, {value: 2, abel: 'Feb.'}, {value: 3, abel: 'Mar.'}, 
//   {value: 4, abel: 'Apr.'},
//   {value: 5, label: 'May'}, {value: 6, abel: 'Jun.'}, {value: 7, abel: 'Jul.'}, {value: 8, abel: 'Aug.'},
//   {value: 9, label: 'Sep.'},//, {value: 10, abel: 'Oct.'}, {value: 11, abel: 'Nov.'}, {value: 12, abel: 'Dec.'},
  
// ];


class StickyExampleAdjacentContext extends Component{
  
  contextRef = createRef();
  
  render(){

    return (

        <div >
          <Ref innerRef={this.contextRef}>
            <Rail attached size='mini' >
                <Sticky offset={180} position= "fixed" context={this.contextRef}>
                    <Menu
                        size='small'
                        compact
                        pointing secondary vertical>
                        
                        <Menu.Item as='a' href="/Vaccine-Tracker" name='Vaccination Tracker'><Header as='h4'>Vaccination Tracker</Header></Menu.Item>
                        <Menu.Item as='a' href="#cases" name='Cases in the U.S. Over Time'><Header as='h4'>Cases in the U.S. Over Time</Header></Menu.Item>
                        <Menu.Item as='a' href="#deaths" name='Deaths in the U.S. Over Time'><Header as='h4'>Deaths in the U.S. Over Time</Header></Menu.Item>
                        <Menu.Item as='a' href="#half" name='50% of Cases Comes From These States'><Header as='h4'>50% of Cases Comes From These States</Header></Menu.Item>
                        <Menu.Item as='a' href="#commu" name='COVID-19 Across the U.S. Communities'><Header as='h4'>COVID-19 Across the U.S. Communities</Header></Menu.Item>
                        <Menu.Item as='a' href="#ccvi" name='COVID-19 by Community Vulnerability Index'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Community Vulnerability Index</Header></Menu.Item>
                        <Menu.Item as='a' href="#poverty" name='COVID-19 by Percent in Poverty'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent in Poverty</Header></Menu.Item>
                        <Menu.Item as='a' href="#metro" name='COVID-19 by Metropolitan Status'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Metropolitan Status</Header></Menu.Item>
                        <Menu.Item as='a' href="#region" name='COVID-19 by Region'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Region</Header></Menu.Item>
                        <Menu.Item as='a' href="#black" name='COVID-19 by Percent African American'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Percent African American </Header></Menu.Item>
                        <Menu.Item as='a' href="#resseg" name='COVID-19 by Residential Segregation Index'><Header as='h5'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Residential Segregation Index</Header></Menu.Item>
                         
                        
                    </Menu>
                </Sticky>
            </Rail>
          </Ref> 
        </div>
    )
  }

}



export default function StateMap(props) {
  const [activeCharacter, setActiveCharacter] = useState('');

  const history = useHistory();
  let {stateFips} = useParams();
  const [fips, setFips] = useState(stateFips);
  const [tooltipContent, setTooltipContent] = useState('');

  const [data, setData] = useState();
  const [dataTS, setDataTS] = useState();
  const [raceData, setRaceData] = useState();

  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyFips, setCountyFips] = useState('');
  const [countyName, setCountyName] = useState('{County}');
  const [barCountyName, setBarCountyName] = useState('{County}');
  
  const [colorScale, setColorScale] = useState();
  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [caseRate, setCaseRate] = useState();
  const [percentChangeCases, setPercentChangeCases] = useState();
  const [mortality, setMortality] = useState();
  const [percentChangeMortality, setPercentChangeMortality] = useState();
  const [pctPositive, setPctPositive] = useState();
  const [totalCases, setTotalCases] = useState();
  const [hospDaily, setHospDaily] = useState();
  const [percentChangeHospDaily, setPercentChangeHospDaily] = useState();
  const [index, setIndex] = useState();
  const [indexP, setIndexP] = useState();

  const [varMap, setVarMap] = useState({});
  const [metric, setMetric] = useState('caserate7dayfig');
  const [metricOptions, setMetricOptions] = useState('caserate7dayfig');
  const [metricName, setMetricName] = useState('Average Daily COVID-19 Cases per 100,000');
  const [covidMetric, setCovidMetric] = useState({t: 'n/a'});
  const [countyOption, setCountyOption] = useState();

  const [delayHandler, setDelayHandler] = useState();

  
  const [accstate, setAccstate] = useState({ activeIndex: 1 });

  const dealClick = (e, titleProps) => {
  const { index } = titleProps
  const { activeIndex } = accstate
  const newIndex = activeIndex === index ? -1 : index

  setAccstate({ activeIndex: newIndex })
  }

  useEffect(()=>{
    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        setMetricOptions(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.variable, text: d.name, group: d.group};
        }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
      });
  }, []);

  // useEffect(()=>{
  //   fetch('/data/rawdata/f2c.json').then(res => res.json())
  //     .then(x => {
  //       setCountyOption(_.filter(_.map(x, d=> {
  //         return {key: d.id, value: d.value, text: d.text, group: d.state};
  //       }), d => (d.group === fips && d.text !== "Augusta-Richmond County consolidated government" && d.text !== "Wrangell city and borough" && d.text !== "Zavalla city")));
  //     });
  // }, [fips]);

  useEffect(()=>{
    fetch('/data/racedataAll.json').then(res => res.json())
      .then(x => {
        setRaceData(x);
        // setTemp(x[stateFips]);
      });

  }, []);


  useEffect(()=>{
    if (metric) {

    
    const configMatched = configs.find(s => s.fips === fips);

    if (!configMatched){
      history.push('/Vaccine-Tracker');
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
                d[metric] > 0 &&
                d.fips.length === 5)),
            d=> d[metric]))
          .range(colorPalette);

          let scaleMap = {}
          _.each(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[metric] > 0 &&
                d.fips.length === 5))
                , d=>{
            scaleMap[d[metric]] = cs(d[metric])});

          setColorScale(scaleMap);
          var max = 0
          var min = 100
          _.each(x, d=> { 
            if (d[metric] > max && d.fips.length === 5) {
              max = d[metric]
            } else if (d.fips.length === 5 && d[metric] < min && d[metric] > 0){
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
                d[metric] > 0 &&
                d.fips.length === 5)),
            d=> d[metric]))
          .range(colorPalette);

          setLegendSplit(split.quantiles());
        });
      
      fetch('/data/timeseries'+fips+'.json').then(res => res.json())
        .then(x => {

          let countyMost = '';
          let covidmortality7dayfig = 0;
          let caseRate = 0;
          let mortality = 0;
          let percentChangeCase = 0;
          let percentChangeMortality = 0;
          let index = 0;
          let indexP = 0;
          let hospD = 0;
          let totCases = 0;
          let percentChangeHospDaily = 0;
          let percentPositive = 0;

          _.each(x, (v, k)=>{

            if (k.length===5 && v.length > 0 && v[v.length-1].covidmortality7dayfig > covidmortality7dayfig){
              countyMost = k.substring(2, 5);
              covidmortality7dayfig = v[v.length-1].covidmortality7dayfig;
            }
            if (k.length===2 || fips === "_nation"){
              percentChangeCase = v[v.length-1].percent14dayDailyCases;
              if(fips === "_nation"){
                caseRate = 0;
              }else{
                caseRate = v[v.length-1].dailyCases;
              }
              

              percentChangeMortality = v[v.length-1].percent14dayDailyDeaths;
              if(fips === "_nation"){
                mortality = 0;
              }else{
                mortality = v[v.length-1].dailyMortality;
              }

              if(fips === "_nation"){
                totCases = 0;
              }else{
                totCases = v[v.length-1].cases;
              }

              percentChangeHospDaily = v[v.length-1].percent14dayhospDaily;
              if(fips === "_nation"){
                hospD = 0;
              }else{
                hospD = v[v.length-1].hospDaily;
              }

              percentPositive = v[v.length-1].percentPositive;

              

              if(k.length===2 || fips === "_nation" && v[v.length-1].percentPositive === 0){
                for (var i = v.length - 1; i >= 0; i--) {
                  if (i ===0 ){
                    indexP = 1;
                    percentPositive = v[v.length-1].percentPositive;
                  }else if (v[i].percentPositive === 0){
                  }else{
                    indexP = v.length - i;
                    percentPositive = v[i].percentPositive;
                    i = 0;
                  }
                }
              }
            }

          });



          if (percentChangeCase.toFixed(0) > 0){
            setPercentChangeCases("+" + percentChangeCase.toFixed(0) + "%");
          }else if(percentChangeCase.toFixed(0).substring(1) === "0"){
            setPercentChangeCases(percentChangeCase.toFixed(0).substring(1) + "%");
          }else{
            setPercentChangeCases(percentChangeCase.toFixed(0) + "%");
          }

          if (percentChangeMortality.toFixed(0) > 0){
            setPercentChangeMortality("+" + percentChangeMortality.toFixed(0) + "%");
          }else if(percentChangeMortality.toFixed(0).substring(1) === "0"){
            setPercentChangeMortality(percentChangeMortality.toFixed(0).substring(1) + "%");
          }else{
            setPercentChangeMortality(percentChangeMortality.toFixed(0) + "%");
          }

          if (percentChangeHospDaily.toFixed(0) > 0){
            setPercentChangeHospDaily("+" + percentChangeHospDaily.toFixed(0) + "%");
          }else if(percentChangeHospDaily.toFixed(0).substring(1) === "0"){
            setPercentChangeHospDaily(percentChangeHospDaily.toFixed(0).substring(1) + "%");
          }else{
            setPercentChangeHospDaily(percentChangeHospDaily.toFixed(0) + "%");
          }

          setPctPositive(percentPositive.toFixed(0) + "%");
          setIndexP(indexP);

          
            
          setIndex(index);

          setCaseRate(numberWithCommas(caseRate.toFixed(0)));
          setMortality(numberWithCommas(mortality.toFixed(0)));
          setTotalCases(numberWithCommas(totCases.toFixed(0)));
          setHospDaily(numberWithCommas(hospD.toFixed(0)));

          setCountyFips(countyMost);

          if(fips !== "_nation"){
            setCountyName(fips2county[fips+countyMost]);
            setBarCountyName((fips2county[fips+countyMost]).match(/\S+/)[0]);

          }
          
          

          setDataTS(x);
        });

      

            }
          }
  }, [metric, fips]);

  useEffect(() => {
    if (dataTS && dataTS[fips]){
      setCovidMetric(_.takeRight(dataTS[fips])[0]);
    }
  }, [dataTS, fips]);


  if (data && dataTS && metric) {

    
  return (

    <div>
        <AppBar menu='countyReport'/>
        <Container style={{marginTop: '8em', minWidth: '1260px'}}>
          {/* <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt"}}>
            <Breadcrumb.Section active >Vaccination: United States</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
          </Breadcrumb>
          <Divider hidden /> */}
          <Grid >
          
              <Grid.Column width={2} style={{zIndex: 10}}>
                <Ref innerRef={createRef()} >
                  <StickyExampleAdjacentContext activeCharacter={activeCharacter}  />
                </Ref>
              </Grid.Column>
            <Grid.Column style = {{paddingLeft: 200, width: 1000}}>
            {/* <Grid columns={14}> */}
            
              <Grid.Row>
                <Grid.Column width={14}>
                <div>     	
                  <Header as='h2' style={{color: VaxColor[1],textAlign:'center', fontWeight: 400, fontSize: "24pt", paddingTop: 17, paddingLeft: "7em"}}>
                    <Header.Content>
                    <b> Vaccination Tracker </b> 
                    
                    </Header.Content>
                  </Header>
                </div>
                  
                  <Grid.Row columns={2} style={{width: 680, padding: 0, paddingTop: 50, paddingRight: 0, paddingBottom: 0}}>

                        

                  <Grid.Column width={5}>

                {/* <Dropdown

                        style={{background: '#fff', 
                                fontSize: "19px",
                                fontWeight: 400, 
                                theme: '#000000',
                                width: '410px',
                                top: '0px',
                                left: '0px',
                                text: "Select",
                                borderTop: 'none',
                                borderLeft: '1px solid #FFFFFF',
                                borderRight: 'none', 
                                borderBottom: '0.5px solid #bdbfc1',
                                borderRadius: 0,
                                minHeight: '1.0em',
                                paddingBottom: '0.5em',
                                paddingRight: 0}}
                        text= {metricName}
                        search
                        pointing = 'top'
                        options={metricOptions}
                        onChange={(e, { value }) => {
                          setMetric(value);
                          setMetricName(varMap[value]['name']);
                        }}

                        
                      />
                 */}

                  <Dropdown
                        style={{background: '#fff', 
                                fontSize: "14pt",
                                fontWeight: 400, 
                                theme: '#000000',
                                width: '380px',
                                left: '0px',
                                text: "Select",
                                borderTop: '0.5px solid #bdbfc1',
                                borderLeft: '0.5px solid #bdbfc1',
                                borderRight: '0.5px solid #bdbfc1', 
                                borderBottom: '0.5px solid #bdbfc1',
                                borderRadius: 0,
                                minHeight: '1.0em',
                                paddingBottom: '0.5em'}}
                        text= {"Selected State: " + (fips === "_nation" ? "The United States": stateName)}
                        search
                        selection
                        pointing = 'top'
                        options={stateOptions}
                        onChange={(e, { value }) => {
                          // window.location.href = "/" + value;
                          setFips(value);

                        }}

                        
                      />
                <svg width="400" height="90">
                  
                  {_.map(legendSplit, (splitpoint, i) => {
                    if(legendSplit[i] < 1){
                      return <text key = {i} x={20 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(1)}</text>                    
                    }else if(legendSplit[i] > 99999){
                      return <text key = {i} x={20 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplit[i]/1000000).toFixed(0) + "M"}</text>                    
                    }else if(legendSplit[i] > 999){
                      return <text key = {i} x={20 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {(legendSplit[i]/1000).toFixed(0) + "K"}</text>                    
                    }
                    return <text key = {i} x={20 + 20 * (i)} y={35} style={{fontSize: '0.7em'}}> {legendSplit[i].toFixed(0)}</text>                    
                  })} 
                  <text x={0} y={35} style={{fontSize: '0.7em'}}> {legendMin} </text>
                  <text x={120} y={35} style={{fontSize: '0.7em'}}>{legendMax}</text>


                  {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={20*i} y={40} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                  })} 


                  <text x={0} y={74} style={{fontSize: '0.8em'}}>Low</text>
                  <text x={20 * (colorPalette.length - 1)} y={74} style={{fontSize: '0.8em'}}>High</text>


                  <rect x={145} y={40} width="20" height="20" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                  <text x={167} y={50} style={{fontSize: '0.7em'}}> None </text>
                  <text x={167} y={59} style={{fontSize: '0.7em'}}> Reported </text>


                  <text x={250} y={49} style={{fontSize: '0.7em'}}> Click on a county</text>
                  <text x={250} y={59} style={{fontSize: '0.7em'}}> below for a detailed report. </text>


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
                          // if(fips !== "_nation"){
                          //   history.push("/" + stateFips + "/" +geo.properties.COUNTYFP);
                          // }
                        }}
                        onMouseEnter={()=>{setDelayHandler(setTimeout(() => {
                          if(fips !== "_nation"){
                              setCountyFips(geo.properties.COUNTYFP);
                              setCountyName(fips2county[fips + geo.properties.COUNTYFP]);
                              setBarCountyName((fips2county[fips + geo.properties.COUNTYFP]).match(/\S+/)[0]);
                            }
                          }, 300))
                          
                        }}
                        onMouseLeave={()=>{
                          if(fips !== "_nation"){
                            clearTimeout(delayHandler);

                            setTooltipContent("")
                          }
                        }}
                        
                        fill={(fips === "_nation" || fips === "72")? "#FFFFFF" :countyFips===geo.properties.COUNTYFP?countyColor:
                            ((colorScale && data[fips+geo.properties.COUNTYFP] && (data[fips+geo.properties.COUNTYFP][metric]) > 0)?
                                colorScale[data[fips+geo.properties.COUNTYFP][metric]]: 
                                (colorScale && data[fips+geo.properties.COUNTYFP] && data[fips+geo.properties.COUNTYFP][metric] === 0)?
                                  '#e1dce2':'#FFFFFF')}
                        />
                    )}
                  </Geographies>
                </ComposableMap>
                <Accordion>
                  <Accordion.Title
                    active={accstate.activeIndex === 0}
                    index={0}
                    onClick={dealClick}
                    style ={{color: "#397AB9", fontSize: "14pt"}}
                  >
                  <Icon name='dropdown'/>
                    About this data
                  </Accordion.Title>
                    <Accordion.Content active={accstate.activeIndex === 0}>
                    <Grid.Row style={{width: "420px"}}>
                        <text style={{fontWeight: 300, fontSize: "14pt", lineHeight: "18pt"}}>
                        <b><em> {varMap[metric].name} </em></b> {varMap[metric].definition} <br/>
                        For a complete table of variable definition, click <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu/data-sources" target="_blank" rel="noopener noreferrer"> here. </a>
                        <br/><br/>
                        Last updated on {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}
                        </text>


                    </Grid.Row>
                  </Accordion.Content>

                </Accordion> 
              </Grid.Column>
                
              </Grid.Row>
              

          </Grid.Column>
          </Grid.Row>
          </Grid.Column>
          </Grid>
        </Container>
        <Container id="title" style={{marginTop: '8em', minWidth: '1260px'}}>
            <Notes />
          </Container>
        <ReactTooltip > <font size="+2"><b >{stateName}</b> </font> <br/>  <b>Click for county-level data.</b> </ReactTooltip>
      </div>
      );

  } else{
    return <Loader active inline='centered' />
  }




}