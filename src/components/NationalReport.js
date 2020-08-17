import React, { useEffect, useState } from 'react'
import { Container, Dropdown, Header, Grid ,Statistic,Loader,Divider} from 'semantic-ui-react'
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import stateOptions from "./stateOptions.json";
import configs from "./state_config.json";
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";
import fips2county from './fips2county.json'
import { VictoryChart, 
  VictoryContainer,
  VictoryGroup, 
  VictoryBar, 
  VictoryTheme, 
  VictoryAxis, 
  VictoryLegend,
  VictoryLine,
  VictoryArea,
  VictoryLabel, 
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';

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

const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
  "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
];

const nationColor = '#487f84';

export default function ExtraFile(props) {
  let { stateFips } = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');
  const [countyFips, setCountyFips] = useState('');
  const [countyName, setCountyName] = useState('{County}');
  const history = useHistory();
  const [data, setData] = useState();
  const [date, setDate] = useState('');

  const [dataTS, setDataTS] = useState();
  const [dataRD, setDataRD] = useState();
  const [topTen, setTopTen] = useState();
  const [states50, setStates50] = useState();

  const [dataTopCases, setDataTopCases] = useState();
  const [dataTopMortality, setDataTopMortality] = useState();
  const [nationalBarCharts, setNationalBarCharts] = useState();

  const [colorScale, setColorScale] = useState();
  const [tooltipContent, setTooltipContent] = useState('');

  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [caseRate, setCaseRate] = useState();
  const [percentChangeCases, setPercentChangeCases] = useState();

  const [mortality, setMortality] = useState();
  const [percentChangeMortality, setPercentChangeMortality] = useState();

  const [metric, setMetric] = useState('mean7daycases');
  const [metricOptions, setMetricOptions] = useState('mean7daycases');
  const [metricName, setMetricName] = useState('Average Daily COVID-19 Cases');

  const [covidMetric, setCovidMetric] = useState({cases: 'N/A', deaths: 'N/A', 
                                                  caseRate: "N/A", mortality: "N/A", 
                                                  caseRateMean: "N/A", mortalityMean: "N/A",
                                                  caseRateMA: "N/A", mortalityMA: "N/A",
                                                  cfr:"N/A", t: 'n/a'});
  const [varMap, setVarMap] = useState({});

  const [countyCasesOutcome, setCountyCasesOutcome] = useState();
  const [countyDeathsOutcome, setCountyDeathsOutcome] = useState();

  const [stateCasesOutcome, setStateCasesOutcome] = useState();
  const [stateDeathsOutcome, setStateDeathsOutcome] = useState();

  const [nationCasesOutcome, setNationCasesOutcome] = useState();
  const [nationDeathsOutcome, setNationDeathsOutcome] = useState();

  useEffect(()=>{
    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
      });
  }, []);


  useEffect(()=>{

      fetch('/data/contristates.json').then(res => res.json())
        .then(x => {
          setStates50(x);
        });

      fetch('/data/topten.json').then(res => res.json())
        .then(x => {
          setTopTen(x);
        });

      fetch('/data/nationalBarCharts.json').then(res => res.json())
        .then(x => {
          setNationalBarCharts(x);
        });

      fetch('/data/date.json').then(res => res.json())
      .then(x => setDate(x.date.substring(5,7) + "/" + x.date.substring(8,10) + "/" + x.date.substring(0,4)));
      

      fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
        .then(x => setVarMap(x));

      fetch('/data/data.json').then(res => res.json())
        .then(x => setData(x));


      fetch('/data/timeseries_.json').then(res => res.json())
        .then(x => {
          let t = 0;
          let countyCases = 0;
          let stateCases = 0;
          let nationCases = 0;

          let countyDeaths = 0;
          let stateDeaths = 0;
          let nationDeaths = 0;

          let percentChangeCase = 0;
          let percentChangeMortality = 0;

          _.each(x, (v, k)=>{
            if(k === "_nation" && v.length > 0 && v[v.length-1].t > t){
                nationCases = v[v.length-1].caseRateMA;
                nationDeaths = v[v.length-1].covidmortality7dayfig;

                percentChangeCase = v[v.length-1].percent14dayDailyCases;
                percentChangeMortality = v[v.length-1].percent14dayDailyDeaths;

              }

            });

              setPercentChangeCases(percentChangeCase.toFixed(0) + "%");


              setPercentChangeMortality(percentChangeMortality.toFixed(0) + "%");

            setDataTS(x);
        }
      );

      fetch('/data/topTenCases.json').then(res => res.json())
        .then(x => setDataTopCases(x));

      fetch('/data/topTenMortality.json').then(res => res.json())
        .then(x => setDataTopMortality(x));

    }, [stateFips]);





  useEffect(() => {
    if (dataTS){
      setCovidMetric(_.takeRight(dataTS['_nation'])[0]);
    }
  }, [dataTS])


  if (data && dataTS && varMap) {
    console.log();

  return (
      <div>
        <AppBar menu='nationalReport'/>
        <Container style={{marginTop: '8em', minWidth: '1260px'}}>
         <div>     	
          <Header as='h2' style={{color: '#487f84',textAlign:'center', fontWeight: 400, fontSize: "24pt", paddingTop: 17, paddingLeft: "7em", paddingRight: "7em"}}>
            <Header.Content>
            <b> COVID-19 US Health Equity Report </b> 
             <Header.Subheader style={{fontWeight:300,fontSize:"20pt", paddingTop:16}}> 
             <b>{date}</b>
             </Header.Subheader>
            </Header.Content>
          </Header>
        </div>
        <div style={{paddingTop:36,textAlign:'justify', fontSize:"14pt", lineHeight: "16pt",paddingBottom:30, paddingLeft: "7em", paddingRight: "7em"}}>
        <text style={{fontFamily:'lato', fontSize: "14pt"}}>
         The United States has reported {numberWithCommas(data['_nation']['casesfig'])} cases, the highest number of any country in the world. 
         The number of cases and deaths differ substantially across American communities. The COVID-19 US Health Equity 
         Report documents how COVID-19 cases and deaths are changing over time, geography, and demography. The report will 
         be released each week to keep track of how COVID-19 is impacting US communities.
        </text>
        </div>
        <center> <Divider style={{width: 1000}}/> </center>
        <div style={{paddingBottom:'2em', paddingLeft: "7em", paddingRight: "7em"}}>
          <Header as='h2' style={{color: '#487f84', textAlign:'center',fontSize:"22pt", paddingTop: 30}}>
            <Header.Content>
              How have cases in the US changed over time?
            </Header.Content>
          </Header>
            <Grid>
                <Grid.Row column = {2}>
                      <Grid.Column style={{paddingTop:20, width: 650}}>
                            <text x={0} y={20} style={{fontSize: '18pt', marginLeft: 175, paddingBottom: 0, fontWeight: 600}}>Average Daily COVID-19 Cases </text>

                            <VictoryChart theme={VictoryTheme.material}
                              width={400}
                              height={230}       
                              padding={{left: 70, right: 40, top: 18, bottom: 30}}
                              containerComponent={<VictoryVoronoiContainer flyoutStyle={{fill: "white"}}/> }
                              >

                            <VictoryAxis
                              tickValues={[
                                dataTS["_nation"][0].t,
                                dataTS["_nation"][30].t,
                                dataTS["_nation"][61].t,
                                dataTS["_nation"][91].t,
                                dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                                style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "14pt", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                              tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                            <VictoryAxis dependentAxis tickCount={5}
                                style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "14pt", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 

                              tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                              />
                            <VictoryGroup 
                                colorScale={[nationColor]}
                            >
                                <VictoryLine data={dataTS["_nation"]}
                                  x='t' y='caseRateMean'
                                  labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.caseRateMean.toFixed(0))}`}
                                  labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                                  style={{
                                     
                                  data: {strokeWidth: ({ active }) => active ? 3 : 2},
                                  }}
                                />
                            </VictoryGroup>
                            <VictoryGroup>
                              <VictoryBar
                                barRatio={0.8}
                                data={dataTS["_nation"]}
                                style={{
                                  data: {
                                    fill: nationColor
                                  }
                                }}
                                x="t"
                                y="dailyCases"
                              />
                            </VictoryGroup>
                          </VictoryChart>
                      </Grid.Column>

                      <Grid.Column style={{paddingTop:150, width: 350}}>
                        <Header as='h2' style={{fontWeight: 400, width: 350, paddingLeft: 0, paddingTop: 0, paddingBottom: 20}}>
                            <Header.Content style={{fontSize: "14pt"}}>
                              <Header.Subheader style={{color: '#000000', width: 350, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                This figure shows the daily average of newly reported cases of COVID-19 in the past 7 days. The daily average of new cases had {percentChangeCases.includes("-")? "decreased by " + percentChangeCases.substring(1): "increased by " + percentChangeCases} since {dataTS['_nation'][dataTS['_nation'].length - 14].t==='n/a'?'N/A':(new Date(dataTS['_nation'][dataTS['_nation'].length - 14].t*1000).toLocaleDateString())}.                  
                              </Header.Subheader>
                            </Header.Content>
                          </Header>
                      </Grid.Column>

                </Grid.Row>
            </Grid>

        </div>
        <center> <Divider style= {{width : 1000}}/> </center>
        <div style={{paddingBottom:'2em', paddingLeft: "7em", paddingRight: "7em"}}>
          <Header as='h2' style={{color: '#487f84', textAlign:'center',fontSize:"22pt", paddingTop: 30, paddingLeft: "7em", paddingRight: "7em"}}>
            <Header.Content>
              How have deaths in the US changed over time? 
            </Header.Content>
          </Header>

            <Grid>
                <Grid.Row column = {2} >

                      <Grid.Column style={{paddingTop:28, width: 650}}>
                            <text x={0} y={20} style={{fontSize: '18pt', paddingLeft: 175, paddingBottom: 5, fontWeight: 600}}>Average Daily COVID-19 Deaths </text>

                            <VictoryChart theme={VictoryTheme.material} 
                              width={400}
                              height={230}       
                              padding={{left: 70, right: 40, top: 24, bottom: 30}}
                              containerComponent={<VictoryVoronoiContainer/>}
                              >

                              <VictoryAxis
                                tickValues={[
                                  dataTS["_nation"][0].t,
                                  dataTS["_nation"][30].t,
                                  dataTS["_nation"][61].t,
                                  dataTS["_nation"][91].t,
                                  dataTS["_nation"][dataTS["_nation"].length-1].t]}                           
                                style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "14pt", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                                tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                              <VictoryAxis dependentAxis tickCount={5}
                                style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "14pt", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                                tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                                />
                              <VictoryGroup 
                                colorScale={[nationColor]}
                              >
                                <VictoryLine data={dataTS["_nation"]}
                                  x='t' y='mortalityMean'
                                  labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.mortalityMean.toFixed(0))}`}
                                  labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                                  style={{
                                    fontFamily: 'lato',
                                    data: { strokeWidth: ({ active }) => active ? 3 : 2},
                                  }}
                                  />
                              </VictoryGroup>
                            <VictoryGroup>
                              <VictoryBar
                                barRatio={0.8}
                                data={dataTS["_nation"]}
                                style={{
                                  data: {
                                    fill: nationColor
                                  }
                                }}
                                x="t"
                                y="dailyMortality"
                              />
                            </VictoryGroup>
                            </VictoryChart>
                      </Grid.Column>

                      <Grid.Column style={{paddingTop:150, width: 350}}>
                        <Header as='h2' style={{fontWeight: 400, width: 350, paddingLeft: 0, paddingTop: 0, paddingBottom: 20}}>
                          <Header.Content style={{fontSize: "14pt"}}>
                            <Header.Subheader style={{color: '#000000', width: 350, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                              This figure shows the daily average of newly reported deaths of COVID-19 in the past 7 days. The daily average of new deaths had {percentChangeMortality.includes("-")? "decreased by " + percentChangeMortality.substring(1): "increased by " + percentChangeMortality} since {dataTS['_nation'][dataTS['_nation'].length - 14].t==='n/a'?'N/A':(new Date(dataTS['_nation'][dataTS['_nation'].length - 14].t*1000).toLocaleDateString())}.
                            </Header.Subheader>
                          </Header.Content>
                        </Header>
                      </Grid.Column>
                </Grid.Row>
            </Grid>

        </div>  
  
        <center> <Divider style = {{width: 1000}}/> </center>
        <div style={{paddingTop:'1em', paddingLeft: "7em", paddingRight: "7em"}}>
          <Header as='h2' style={{paddingTop: 17, textAlign:'center',fontSize:"22pt", color: '#487f84'}}>
            <Header.Content>
            Where are cases and deaths occurring?
              <Header.Subheader style={{color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 32, paddingRight: 30}}>

                Cases and deaths attributed to COVID-19 are rapidly rising in some counties. Additionally, 
                the geographic distribution of the hardest-hit counties is changing, with the virus shifting from 
                the Northeast toward the Southeast and Southwest. As of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}, approximately 50% of new cases in the United States come from: <br/>

                <br/>
               <center> <b style = {{fontSize:"18pt"}}>{states50[0]["statenames"]}</b> </center>
              </Header.Subheader>
            </Header.Content>
          </Header>
        </div>
        <center><Divider style = {{width:1000}}/> </center>
        <div style={{paddingTop:'1em',paddingBottom:'1em', paddingLeft: "7em", paddingRight: "7em"}}>
          <Header as='h2' style={{textAlign:'center',fontSize:"22pt", color: '#487f84', paddingTop: 17}}>
            <Header.Content>
              The 10 counties with most new cases and deaths per 100,000 residents since {dataTS['_nation'][dataTS['_nation'].length - 7].t==='n/a'?'N/A':(new Date(dataTS['_nation'][dataTS['_nation'].length - 7].t*1000).toLocaleDateString())}.
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row columns={2} style={{paddingTop: '2em'}}>
            <Grid.Column style={{paddingTop:10,paddingBottom:25}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt", paddingLeft:'2em',paddingRight:'2em'}}>
            		<Header.Content>
            		  Average new cases per 100,000 residents
            		</Header.Content>
            	</Header>

              <VictoryChart
                    theme={VictoryTheme.material}
                    width={500}
                    height={400}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 250, right: 30, top: 20, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.6}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[{key: topTen['caserate7day'][9]['county'], 'value': (topTen['caserate7day'][9]['measure']/topTen['caserate7day'][0]['measure'])*topTen['caserate7day'][0]['measure'] || 0},
                             {key: topTen['caserate7day'][8]['county'], 'value': (topTen['caserate7day'][8]['measure']/topTen['caserate7day'][0]['measure'])*topTen['caserate7day'][0]['measure'] || 0},
                             {key: topTen['caserate7day'][7]['county'], 'value': (topTen['caserate7day'][7]['measure']/topTen['caserate7day'][0]['measure'])*topTen['caserate7day'][0]['measure'] || 0},
                             {key: topTen['caserate7day'][6]['county'], 'value': (topTen['caserate7day'][6]['measure']/topTen['caserate7day'][0]['measure'])*topTen['caserate7day'][0]['measure'] || 0},
                             {key: topTen['caserate7day'][5]['county'], 'value': (topTen['caserate7day'][5]['measure']/topTen['caserate7day'][0]['measure'])*topTen['caserate7day'][0]['measure'] || 0},
                             {key: topTen['caserate7day'][4]['county'], 'value': (topTen['caserate7day'][4]['measure']/topTen['caserate7day'][0]['measure'])*topTen['caserate7day'][0]['measure'] || 0},
                             {key: topTen['caserate7day'][3]['county'], 'value': (topTen['caserate7day'][3]['measure']/topTen['caserate7day'][0]['measure'])*topTen['caserate7day'][0]['measure'] || 0},
                             {key: topTen['caserate7day'][2]['county'], 'value': (topTen['caserate7day'][2]['measure']/topTen['caserate7day'][0]['measure'])*topTen['caserate7day'][0]['measure'] || 0},
                             {key: topTen['caserate7day'][1]['county'], 'value': (topTen['caserate7day'][1]['measure']/topTen['caserate7day'][0]['measure'])*topTen['caserate7day'][0]['measure'] || 0},
                             {key: topTen['caserate7day'][0]['county'], 'value': (topTen['caserate7day'][0]['measure']/topTen['caserate7day'][0]['measure'])*topTen['caserate7day'][0]['measure'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: "#487f84"
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>
            </Grid.Column>

            
            <Grid.Column style={{paddingTop:10,paddingBottom:25}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt", paddingLeft:'2em',paddingRight:'2em'}}>
            		<Header.Content>
            		  Average new deaths per 100,000 residents
            		</Header.Content>
            	</Header>


              <VictoryChart
                    theme={VictoryTheme.material}
                    width={500}
                    height={400}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 250, right: 30, top: 20, bottom: -5}}
                    style = {{fontSize: "14pt",fontWeight: 500, }}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fontWeight: 500, fill: '#000000', fontSize: "20px"}, tickLabels: {fontWeight: 500, fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fontWeight: 500, fill: '#000000', fontSize: "20px"}, tickLabels: {fontWeight: 500, fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.6}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[{key: topTen['covidmortality7day'][9]['county'], 'value': (topTen['covidmortality7day'][9]['measure']/topTen['covidmortality7day'][0]['measure'])*topTen['covidmortality7day'][0]['measure'] || 0},
                             {key: topTen['covidmortality7day'][8]['county'], 'value': (topTen['covidmortality7day'][8]['measure']/topTen['covidmortality7day'][0]['measure'])*topTen['covidmortality7day'][0]['measure'] || 0},
                             {key: topTen['covidmortality7day'][7]['county'], 'value': (topTen['covidmortality7day'][7]['measure']/topTen['covidmortality7day'][0]['measure'])*topTen['covidmortality7day'][0]['measure'] || 0},
                             {key: topTen['covidmortality7day'][6]['county'], 'value': (topTen['covidmortality7day'][6]['measure']/topTen['covidmortality7day'][0]['measure'])*topTen['covidmortality7day'][0]['measure'] || 0},
                             {key: topTen['covidmortality7day'][5]['county'], 'value': (topTen['covidmortality7day'][5]['measure']/topTen['covidmortality7day'][0]['measure'])*topTen['covidmortality7day'][0]['measure'] || 0},
                             {key: topTen['covidmortality7day'][4]['county'], 'value': (topTen['covidmortality7day'][4]['measure']/topTen['covidmortality7day'][0]['measure'])*topTen['covidmortality7day'][0]['measure'] || 0},
                             {key: topTen['covidmortality7day'][3]['county'], 'value': (topTen['covidmortality7day'][3]['measure']/topTen['covidmortality7day'][0]['measure'])*topTen['covidmortality7day'][0]['measure'] || 0},
                             {key: topTen['covidmortality7day'][2]['county'], 'value': (topTen['covidmortality7day'][2]['measure']/topTen['covidmortality7day'][0]['measure'])*topTen['covidmortality7day'][0]['measure'] || 0},
                             {key: topTen['covidmortality7day'][1]['county'], 'value': (topTen['covidmortality7day'][1]['measure']/topTen['covidmortality7day'][0]['measure'])*topTen['covidmortality7day'][0]['measure'] || 0},
                             {key: topTen['covidmortality7day'][0]['county'], 'value': (topTen['covidmortality7day'][0]['measure']/topTen['covidmortality7day'][0]['measure'])*topTen['covidmortality7day'][0]['measure'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: "#487f84"
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>
            </Grid.Column>

            
            </Grid.Row>
          </Grid>
        </div>
          <Grid>
            <Grid.Row columns={2} style={{paddingTop: 20, paddingBottom: 47}}>
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 132}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign:'justify'}}>
					             This figure shows the ten counties with the greatest average new COVID-19 cases per 100,000 residents. 
                       as of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}.                   
					           </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 20}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign:'justify'}}>
					             This figure shows the ten counties with the greatest average new COVID-19 deaths per 100,000 residents.
                       as of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}.                   
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>  
        <center> <Divider style = {{width:1000}}/> </center>
        <div style = {{ paddingLeft: "7em", paddingRight: "7em"}}>
          <Header as='h2' style={{textAlign:'center', color: '#487f84', fontSize: "22pt", paddingTop: 30}}>
            <Header.Content>
              Trajectories of per capita cases and deaths in the 5 counties with the largest increase in cases and deaths
              <Header.Subheader style={{color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 32, paddingRight: 32}}>
			         
                Counties that are currently experiencing large surges in cases and deaths attributed to COVID-19 
                may not have always been badly affected by the virus. In the figures below, we chart the 7-day 
                average of new cases and deaths in these ten hardest-hit counties over the past few months, 
                showing how their infection and death rates have sharply increased in recently weeks.

              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row columns={2} style={{paddingTop: 8}}>
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		Daily New Cases per 100,000 population
            		</Header.Content>
            	</Header>
              
                      <svg width = "640" height = "90" style = {{marginLeft: 10}}>
                          <rect x = {20} y = {12} width = "12" height = "2" style = {{fill: "#5d3f6d", strokeWidth:1}}/>
                          <text x = {35} y = {20} style = {{ fontSize: "14pt"}}> 1. {Object.keys(dataTopCases)[0]}</text>

                          <rect x = {280} y = {12} width = "12" height = "2" style = {{fill: "#007dba", strokeWidth:1}}/>
                          <text x = {295} y = {20} style = {{ fontSize: "14pt"}}> 2. {Object.keys(dataTopCases)[1]} </text>

                          <rect x = {20} y = {40} width = "12" height = "2" style = {{fill: "#b88bb2", strokeWidth:1}}/>
                          <text x = {35} y = {48} style = {{ fontSize: "14pt"}}> 3. {Object.keys(dataTopCases)[2]}</text>

                          <rect x = {280} y = {40} width = "12" height = "2" style = {{fill: "#00aeef", strokeWidth:1}}/>
                          <text x = {295} y = {48} style = {{ fontSize: "14pt"}}> 4. {Object.keys(dataTopCases)[3]}</text>

                          <rect x = {20} y = {68} width = "12" height = "2" style = {{fill: "#e8ab3b", strokeWidth:1}}/>
                          <text x = {35} y = {76} style = {{ fontSize: "14pt"}}> 5. {Object.keys(dataTopCases)[4]} </text>
                      </svg>
                <VictoryChart theme={VictoryTheme.material} 
                        width={330}
                        height={180}       
                        padding={{left: 50, right: 80, top: 20, bottom: 30}}
                        minDomain={{ x: dataTopCases[Object.keys(dataTopCases)[0]][13].t}}
                        maxDomain = {{ y: 80}}
                        containerComponent={<VictoryVoronoiContainer/>}
                        >

                        <VictoryAxis
                          tickValues={[
                            dataTopCases[Object.keys(dataTopCases)[0]][13].t,
                            dataTopCases[Object.keys(dataTopCases)[0]][9].t,
                            dataTopCases[Object.keys(dataTopCases)[0]][5].t,
                            dataTopCases[Object.keys(dataTopCases)[0]][0].t]}                        
                          style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "14pt", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                          tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                          style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "14pt", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                          tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                          />
                        <VictoryGroup 
                          colorScale={["#5d3f6d",
                                      "#007dba", 
                                      "#b88bb2", 
                                      "#00aeef", 
                                      "#e8ab3b"]}
                          >

                          <VictoryLine data={dataTopCases[Object.keys(dataTopCases)[0]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopCases[Object.keys(dataTopCases)[1]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopCases[Object.keys(dataTopCases)[2]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopCases[Object.keys(dataTopCases)[3]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopCases[Object.keys(dataTopCases)[4]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopCases)[0].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={-10} dy={20} textAnchor="start"/>
                              }
                            data={[{ x: dataTopCases[Object.keys(dataTopCases)[0]][0].t, y: dataTopCases[Object.keys(dataTopCases)[0]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopCases)[1].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={0} dy={0} textAnchor="start"/>
                              }
                            data={[{ x: dataTopCases[Object.keys(dataTopCases)[1]][0].t, y: dataTopCases[Object.keys(dataTopCases)[1]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopCases)[2].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={-5} dy={0} textAnchor="start"/>
                              }
                            data={[{ x: dataTopCases[Object.keys(dataTopCases)[2]][0].t, y: dataTopCases[Object.keys(dataTopCases)[2]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopCases)[3].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={0} dy={-5} textAnchor="start"/>
                              }
                            data={[{ x: dataTopCases[Object.keys(dataTopCases)[3]][0].t, y: dataTopCases[Object.keys(dataTopCases)[3]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopCases)[4].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={12} textAnchor="start"/>
                              }
                            data={[{ x: dataTopCases[Object.keys(dataTopCases)[4]][0].t, y: dataTopCases[Object.keys(dataTopCases)[4]][0].measure }]}
                          />

                        </VictoryGroup>
                </VictoryChart>

            </Grid.Column>
            <Grid.Column style={{paddingTop:10,paddingBottom:25}}>
            	<Header as='h2' style={{marginLeft: -25, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		  Daily New Deaths per 100,000 population
            		</Header.Content>
            	</Header>
                
                <svg width = "640" height = "90" style = {{marginLeft: 10}}>
                          <rect x = {0} y = {12} width = "12" height = "2" style = {{fill: "#778899", strokeWidth:1}}/>
                          <text x = {15} y = {20} style = {{ fontSize: "14pt"}}> 1. {Object.keys(dataTopMortality)[0]} </text>

                          <rect x = {230} y = {12} width = "12" height = "2" style = {{fill: "#000000", strokeWidth:1}}/>
                          <text x = {245} y = {20} style = {{ fontSize: "14pt"}}> 2. {Object.keys(dataTopMortality)[1]} </text>

                          <rect x = {0} y = {40} width = "12" height = "2" style = {{fill: "#c6007e", strokeWidth:1}}/>
                          <text x = {15} y = {48} style = {{ fontSize: "14pt"}}> 3. {Object.keys(dataTopMortality)[2]} </text>

                          <rect x = {230} y = {40} width = "12" height = "2" style = {{fill: "#a45791", strokeWidth:1}}/>
                          <text x = {245} y = {48} style = {{ fontSize: "14pt"}}> 4. {Object.keys(dataTopMortality)[3]} </text>

                          <rect x = {0} y = {68} width = "12" height = "2" style = {{fill: "#153f6e", strokeWidth:1}}/>
                          <text x = {15} y = {76} style = {{ fontSize: "14pt"}}> 5. {Object.keys(dataTopMortality)[4]} </text>
                      </svg>
                <VictoryChart theme={VictoryTheme.material} 
                        width={330}
                        height={180}       
                        padding={{left: 50, right: 80, top: 20, bottom: 30}}
                        minDomain={{ x: dataTopMortality[Object.keys(dataTopMortality)[0]][13].t}}                           
                        containerComponent={<VictoryVoronoiContainer/>}
                        >

                        <VictoryAxis
                          tickValues={[
                            dataTopMortality[Object.keys(dataTopMortality)[0]][13].t,
                            dataTopMortality[Object.keys(dataTopMortality)[0]][9].t,
                            dataTopMortality[Object.keys(dataTopMortality)[0]][5].t,
                            dataTopMortality[Object.keys(dataTopMortality)[0]][0].t]}                        
                          style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "14pt", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                          tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                          style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "14pt", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                          tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                          />
                        <VictoryGroup 
                          colorScale={["#778899",
                                      "#000000",
                                      "#c6007e", 
                                      "#a45791", 
                                      "#153f6e"]}
                          >

                          <VictoryLine data={dataTopMortality[Object.keys(dataTopMortality)[0]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}

                          />

                          <VictoryLine data={dataTopMortality[Object.keys(dataTopMortality)[1]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopMortality[Object.keys(dataTopMortality)[2]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopMortality[Object.keys(dataTopMortality)[3]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopMortality[Object.keys(dataTopMortality)[4]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato'}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopMortality)[0].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={-10} dy={0} textAnchor="start"/>
                              }
                            data={[{ x: dataTopMortality[Object.keys(dataTopMortality)[0]][0].t, y: dataTopMortality[Object.keys(dataTopMortality)[0]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopMortality)[1].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={-10} dy={0} textAnchor="start"/>
                              }
                            data={[{ x: dataTopMortality[Object.keys(dataTopMortality)[1]][0].t, y: dataTopMortality[Object.keys(dataTopMortality)[1]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopMortality)[2].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={-10} dy={0} textAnchor="start"/>
                              }
                            data={[{ x: dataTopMortality[Object.keys(dataTopMortality)[2]][0].t, y: dataTopMortality[Object.keys(dataTopMortality)[2]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopMortality)[3].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={5} textAnchor="start"/>
                              }
                            data={[{ x: dataTopMortality[Object.keys(dataTopMortality)[3]][0].t, y: dataTopMortality[Object.keys(dataTopMortality)[3]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopMortality)[4].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={-10} dy={0} textAnchor="start"/>
                              }
                            data={[{ x: dataTopMortality[Object.keys(dataTopMortality)[4]][0].t, y: dataTopMortality[Object.keys(dataTopMortality)[4]][0].measure }]}
                          />
                        </VictoryGroup>
                </VictoryChart>

            </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <Grid>
            <Grid.Row columns={2} style={{paddingBottom: 47}}>
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 132}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign:'justify'}}>
					            This figure shows the 7-day average of new daily cases of COVID-19 per 100,000 residents in the five counties with the largest increase in daily cases since {dataTS['_nation'][dataTS['_nation'].length - 14].t==='n/a'?'N/A':(new Date(dataTS['_nation'][dataTS['_nation'].length - 14].t*1000).toLocaleDateString())}.					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 20}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign:'justify'}}>
					            This figure shows the 7-day average of new daily deaths of COVID-19 per 100,000 residents in the five counties with the largest increase in daily cases since {dataTS['_nation'][dataTS['_nation'].length - 14].t==='n/a'?'N/A':(new Date(dataTS['_nation'][dataTS['_nation'].length - 14].t*1000).toLocaleDateString())}.				
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>  
        <center> <Divider style = {{width: 1000}}/> </center>
        <div>
          <Header as='h2' style={{color: '#b2b3b3', textAlign:'center',fontSize:"22pt", paddingTop: 32}}>
            <Header.Content style={{fontSize:"22pt",color:'#487f84'}}>
            COVID-19 by County Characteristics
              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "7em", paddingRight: "7em"}}>
                COVID-19 cases per 100,000 grouped by county proportion of population characteristics   
                <br/>
                <br/>
                COVID-19 is affecting communities very differently. Underlying medical conditions; racial, 
                gender, and age demographics; income levels; and population density are all contributing factors 
                that determine the rate of COVID-19 in different counties. Some of the many county characteristics 
                that may have a large impact on disparate rates of infection are displayed below, with counties divided 
                into quintiles based on each characteristic unless otherwise noted.           

              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid style = {{paddingLeft: "7em", paddingRight: "7em"}}>
            <Grid.Row columns={2} style={{paddingTop: 11}}>
            <Grid.Column style={{paddingTop:'1em',paddingBottom: 18}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		COVID-19 cases by percentage of <br/> male population
            		</Header.Content>
            	</Header>

                  <VictoryChart
                    theme = {VictoryTheme.material}
                    width = {500}
                    height = {220}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 160, right: 30, top: 30, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >

                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"},grid: {stroke: "transparent"}, axis: {labels: {fill: '#000000'}}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarCharts['male'][0]['label'], 'value': (nationalBarCharts['male'][0]['caserate7day']/nationalBarCharts['male'][0]['caserate7day'])*nationalBarCharts['male'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['male'][1]['label'], 'value': (nationalBarCharts['male'][1]['caserate7day']/nationalBarCharts['male'][0]['caserate7day'])*nationalBarCharts['male'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['male'][2]['label'], 'value': (nationalBarCharts['male'][2]['caserate7day']/nationalBarCharts['male'][0]['caserate7day'])*nationalBarCharts['male'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['male'][3]['label'], 'value': (nationalBarCharts['male'][3]['caserate7day']/nationalBarCharts['male'][0]['caserate7day'])*nationalBarCharts['male'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['male'][4]['label'], 'value': (nationalBarCharts['male'][4]['caserate7day']/nationalBarCharts['male'][0]['caserate7day'])*nationalBarCharts['male'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: "#487f84"
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                        <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                          <b>{varMap["caserate7dayfig"].name}</b>
                        </text>
                  </Header.Content>

            </Grid.Column>
            <Grid.Column style={{paddingTop:'1em',paddingBottom:18}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		COVID-19 cases by percentage of <br/>population over the age 65 years
            		</Header.Content>
            	</Header>

                  <VictoryChart
                    theme={VictoryTheme.material}
                    width={500}
                    height={220}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 160, right: 30, top: 30, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {labels: {fill: '#000000'}}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarCharts['age65over'][0]['label'], 'value': (nationalBarCharts['age65over'][0]['caserate7day']/nationalBarCharts['age65over'][0]['caserate7day'])*nationalBarCharts['age65over'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['age65over'][1]['label'], 'value': (nationalBarCharts['age65over'][1]['caserate7day']/nationalBarCharts['age65over'][0]['caserate7day'])*nationalBarCharts['age65over'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['age65over'][2]['label'], 'value': (nationalBarCharts['age65over'][2]['caserate7day']/nationalBarCharts['age65over'][0]['caserate7day'])*nationalBarCharts['age65over'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['age65over'][3]['label'], 'value': (nationalBarCharts['age65over'][3]['caserate7day']/nationalBarCharts['age65over'][0]['caserate7day'])*nationalBarCharts['age65over'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['age65over'][4]['label'], 'value': (nationalBarCharts['age65over'][4]['caserate7day']/nationalBarCharts['age65over'][0]['caserate7day'])*nationalBarCharts['age65over'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: "#487f84"
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["caserate7dayfig"].name}</b>
                    </text>
                  </Header.Content>
            </Grid.Column>
            </Grid.Row>
          </Grid>
        <Grid>
            <Grid.Row columns={2} style={{paddingBottom: 7}}>
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 132}}>
                  <Header.Content style={{fontSize: "14pt"}}>
                    <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign:'justify'}}>
            					This figure shows total cases of COVID-19 per 100,000 residents as of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}. 
                      Case rates are shown by proportion of county residents who are male. US counties were grouped into 5 categories based on the proportion of male residents. 
                      We can see that in counties with the highest proportion of male residents (highest 20%), the rate is <b>{(nationalBarCharts['male'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000.
                      In counties with the lowest proportion of male residents (lowest 20%), the rate is <b>{(nationalBarCharts['male'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 33}}>
                  <Header.Content style={{fontSize: "14pt"}}>
                    <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign:'justify'}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}. 
                      Case rates are shown by proportion of county residents who are over the age of 65. US counties were grouped into 5 categories based on the proportion of 
                      over the age of 65 residents. We can see that in counties with the highest proportion of residents over the age of 65 years (highest 20%),
                      the rate is <b>{(nationalBarCharts['age65over'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents over the age of 65 years (lowest 20%), 
                      the rate is <b>{(nationalBarCharts['age65over'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.                 
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid> 
          <Grid style = {{paddingLeft: "7em", paddingRight: "7em"}}>
            <Grid.Row columns={2} style={{paddingTop: '2em'}}>
            <Grid.Column style={{paddingTop:10, paddingBottom:18}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		COVID-19 cases by percentage of <br/>African American population
            		</Header.Content>
            	</Header>

                  <VictoryChart
                    theme={VictoryTheme.material}
                    width={500}
                    height={220}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 160, right: 30, top: 30, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {labels: {fill: '#000000'}}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarCharts['black'][0]['label'], 'value': (nationalBarCharts['black'][0]['caserate7day']/nationalBarCharts['black'][0]['caserate7day'])*nationalBarCharts['black'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['black'][1]['label'], 'value': (nationalBarCharts['black'][1]['caserate7day']/nationalBarCharts['black'][0]['caserate7day'])*nationalBarCharts['black'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['black'][2]['label'], 'value': (nationalBarCharts['black'][2]['caserate7day']/nationalBarCharts['black'][0]['caserate7day'])*nationalBarCharts['black'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['black'][3]['label'], 'value': (nationalBarCharts['black'][3]['caserate7day']/nationalBarCharts['black'][0]['caserate7day'])*nationalBarCharts['black'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['black'][4]['label'], 'value': (nationalBarCharts['black'][4]['caserate7day']/nationalBarCharts['black'][0]['caserate7day'])*nationalBarCharts['black'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: "#487f84"
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["caserate7dayfig"].name}</b>
                    </text>
                  </Header.Content>

            </Grid.Column>
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		COVID-19 cases by percentage of <br/>population in poverty
            		</Header.Content>
            	</Header>
                  <VictoryChart
                    theme={VictoryTheme.material}
                    width={500}
                    height={220}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 160, right: 30, top: 30, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {labels: {fill: '#000000'}}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarCharts['poverty'][0]['label'], 'value': (nationalBarCharts['poverty'][0]['caserate7day']/nationalBarCharts['poverty'][0]['caserate7day'])*nationalBarCharts['poverty'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['poverty'][1]['label'], 'value': (nationalBarCharts['poverty'][1]['caserate7day']/nationalBarCharts['poverty'][0]['caserate7day'])*nationalBarCharts['poverty'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['poverty'][2]['label'], 'value': (nationalBarCharts['poverty'][2]['caserate7day']/nationalBarCharts['poverty'][0]['caserate7day'])*nationalBarCharts['poverty'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['poverty'][3]['label'], 'value': (nationalBarCharts['poverty'][3]['caserate7day']/nationalBarCharts['poverty'][0]['caserate7day'])*nationalBarCharts['poverty'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['poverty'][4]['label'], 'value': (nationalBarCharts['poverty'][4]['caserate7day']/nationalBarCharts['poverty'][0]['caserate7day'])*nationalBarCharts['poverty'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: "#487f84"
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["caserate7dayfig"].name}</b>
                    </text>
                  </Header.Content>

            </Grid.Column>
            </Grid.Row>
          </Grid>
        <Grid>
            <Grid.Row columns={2} style={{paddingBottom: 7}}>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 132}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}. 
                      Case rates are shown by proportion of county residents who are African American. US counties were grouped into 5 categories based on the proportion of 
                      African American residents. We can see that in counties with the highest proportion of African American residents (highest 20%), 
                      the rate is <b>{(nationalBarCharts['black'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of African American residents (lowest 20%),
                      the rate is <b>{(nationalBarCharts['black'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 33}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}. 
                      Case rates are shown by proportion of county residents who are below the federal poverty line. US counties were grouped into 5 categories based on the proportion of 
                      residents in poverty. We can see that in counties with the highest proportion of residents in poverty (highest 20%),  
                      the rate is <b>{(nationalBarCharts['poverty'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents in poverty (lowest 20%), 
                       the rate is <b>{(nationalBarCharts['poverty'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid> 
          <Grid style = {{paddingLeft: "7em", paddingRight: "7em"}}>
            <Grid.Row columns={2} style={{paddingTop: '2em'}}>            
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		COVID-19 cases by percentage of <br/>population with diabetes
            		</Header.Content>
            	</Header>
                  <VictoryChart
                    theme={VictoryTheme.material}
                    width={500}
                    height={220}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 160, right: 30, top: 30, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {labels: {fill: '#000000'}}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarCharts['diabetes'][0]['label'], 'value': (nationalBarCharts['diabetes'][0]['caserate7day']/nationalBarCharts['diabetes'][0]['caserate7day'])*nationalBarCharts['diabetes'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['diabetes'][1]['label'], 'value': (nationalBarCharts['diabetes'][1]['caserate7day']/nationalBarCharts['diabetes'][0]['caserate7day'])*nationalBarCharts['diabetes'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['diabetes'][2]['label'], 'value': (nationalBarCharts['diabetes'][2]['caserate7day']/nationalBarCharts['diabetes'][0]['caserate7day'])*nationalBarCharts['diabetes'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['diabetes'][3]['label'], 'value': (nationalBarCharts['diabetes'][3]['caserate7day']/nationalBarCharts['diabetes'][0]['caserate7day'])*nationalBarCharts['diabetes'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['diabetes'][4]['label'], 'value': (nationalBarCharts['diabetes'][4]['caserate7day']/nationalBarCharts['diabetes'][0]['caserate7day'])*nationalBarCharts['diabetes'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: "#487f84"
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["caserate7dayfig"].name}</b>
                    </text>
                  </Header.Content>

            </Grid.Column>
            <Grid.Column style={{paddingTop:10,paddingBottom: 18}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		COVID-19 cases by percentage of <br/> Hispanic population
            		</Header.Content>
            	</Header>

                  <VictoryChart
                    theme={VictoryTheme.material}
                    width={500}
                    height={220}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 160, right: 30, top: 30, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {labels: {fill: '#000000'}}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarCharts['hispanic'][0]['label'], 'value': (nationalBarCharts['hispanic'][0]['caserate7day']/nationalBarCharts['hispanic'][0]['caserate7day'])*nationalBarCharts['hispanic'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['hispanic'][1]['label'], 'value': (nationalBarCharts['hispanic'][1]['caserate7day']/nationalBarCharts['hispanic'][0]['caserate7day'])*nationalBarCharts['hispanic'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['hispanic'][2]['label'], 'value': (nationalBarCharts['hispanic'][2]['caserate7day']/nationalBarCharts['hispanic'][0]['caserate7day'])*nationalBarCharts['hispanic'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['hispanic'][3]['label'], 'value': (nationalBarCharts['hispanic'][3]['caserate7day']/nationalBarCharts['hispanic'][0]['caserate7day'])*nationalBarCharts['hispanic'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['hispanic'][4]['label'], 'value': (nationalBarCharts['hispanic'][4]['caserate7day']/nationalBarCharts['hispanic'][0]['caserate7day'])*nationalBarCharts['hispanic'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: "#487f84"
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["caserate7dayfig"].name}</b>
                    </text>
                  </Header.Content>

            </Grid.Column>
            </Grid.Row>
          </Grid>
        <Grid>
            <Grid.Row columns={2} style={{paddingBottom: 7}}>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 132}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}. 
                      Case rates are shown by proportion of county residents who have diabetes. US counties were grouped into 5 categories based on the proportion of 
                      residents with diabetes. We can see that in counties with the highest proportion of residents with diabetes (highest 20%),
                      the rate is <b>{(nationalBarCharts['diabetes'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents with diabetes (lowest 20%),
                      the rate is <b>{(nationalBarCharts['diabetes'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 33}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}. 
                      Case rates are shown by proportion of county residents who are Hispanic. US counties were grouped into 5 categories based on the proportion of 
                      Hispanic residents. We can see that in counties with the highest proportion of Hispanic residents (highest 20%),
                      the rate is <b>{(nationalBarCharts['hispanic'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of Hispanic residents (lowest 20%), 
                      the rate is <b>{(nationalBarCharts['hispanic'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid> 
          <Grid style = {{paddingLeft: "7em", paddingRight: "7em"}}>
            <Grid.Row columns={2} style={{paddingTop: '2em'}}>
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
            	<Header as='h2' style={{fontWeight: 600,textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		COVID-19 cases by Metropolitan Status
            		</Header.Content>
            	</Header>

                  <VictoryChart
                    theme={VictoryTheme.material}
                    width={500}
                    height={220}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 275, right: 30, top: 30, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {labels: {fill: '#000000'}}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.75}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarCharts['urbanrural'][0]['label'], 'value': (nationalBarCharts['urbanrural'][0]['caserate7day']/nationalBarCharts['urbanrural'][0]['caserate7day'])*nationalBarCharts['urbanrural'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['urbanrural'][1]['label'], 'value': (nationalBarCharts['urbanrural'][1]['caserate7day']/nationalBarCharts['urbanrural'][0]['caserate7day'])*nationalBarCharts['urbanrural'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['urbanrural'][2]['label'], 'value': (nationalBarCharts['urbanrural'][2]['caserate7day']/nationalBarCharts['urbanrural'][0]['caserate7day'])*nationalBarCharts['urbanrural'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['urbanrural'][3]['label'], 'value': (nationalBarCharts['urbanrural'][3]['caserate7day']/nationalBarCharts['urbanrural'][0]['caserate7day'])*nationalBarCharts['urbanrural'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['urbanrural'][4]['label'], 'value': (nationalBarCharts['urbanrural'][4]['caserate7day']/nationalBarCharts['urbanrural'][0]['caserate7day'])*nationalBarCharts['urbanrural'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['urbanrural'][5]['label'], 'value': (nationalBarCharts['urbanrural'][5]['caserate7day']/nationalBarCharts['urbanrural'][0]['caserate7day'])*nationalBarCharts['urbanrural'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: "#487f84"
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["caserate7dayfig"].name}</b>
                    </text>
                  </Header.Content>

            </Grid.Column>
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
            	<Header as='h2' style={{fontWeight: 600,textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		COVID-19 cases by Region
            		</Header.Content>
            	</Header>

                  <VictoryChart
                    theme={VictoryTheme.material}
                    width={500}
                    height={220}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 160, right: 30, top: 30, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {labels: {fill: '#000000'}}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarCharts['region'][0]['label'], 'value': (nationalBarCharts['region'][0]['caserate7day']/nationalBarCharts['region'][0]['caserate7day'])*nationalBarCharts['region'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['region'][1]['label'], 'value': (nationalBarCharts['region'][1]['caserate7day']/nationalBarCharts['region'][0]['caserate7day'])*nationalBarCharts['region'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['region'][2]['label'], 'value': (nationalBarCharts['region'][2]['caserate7day']/nationalBarCharts['region'][0]['caserate7day'])*nationalBarCharts['region'][0]['caserate7day'] || 0},
                             {key: nationalBarCharts['region'][3]['label'], 'value': (nationalBarCharts['region'][3]['caserate7day']/nationalBarCharts['region'][0]['caserate7day'])*nationalBarCharts['region'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: "#487f84"
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["caserate7dayfig"].name}</b>
                    </text>
                  </Header.Content>
            </Grid.Column>
            </Grid.Row>
          </Grid>
        <Grid>
            <Grid.Row columns={2} style={{paddingBottom: 7}}>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 132}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}. 
                      Case rates are shown by proportion of county residents who live in different types of metropolitan areas. US counties were grouped
                       into 6 categories based on metropolitan status. We can see that in small metro areas, 
                       the rate is <b>{(nationalBarCharts['urbanrural'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In large central metros, 
                       the rate is <b>{(nationalBarCharts['urbanrural'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					           </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 33}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {covidMetric.t==='n/a'?'N/A':(new Date(covidMetric.t*1000).toLocaleDateString())}. 
                      Case rates are shown by region of the US. US counties were grouped into 4 categories based on region. We can see that in the South, 
                      the rate is <b>{(nationalBarCharts['region'][2]['caserate7day']).toFixed(0)}</b> cases per 100,000. In the Northeast, 
                      the rate is <b>{(nationalBarCharts['region'][1]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					         </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid> 
        </div>
        <Notes />
        </Container>
    </div>
    );
  } else{
    return <Loader active inline='centered' />
  }


}


