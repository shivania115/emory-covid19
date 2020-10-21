import React, { useEffect, useState, Component, createRef} from 'react'
import { Container, Header, Grid, Loader, Divider, Popup, Button, Image, Rail, Sticky, Ref, Segment} from 'semantic-ui-react'
import AppBar from './AppBar';
import { useParams, useHistory } from 'react-router-dom';
import { geoCentroid } from "d3-geo";
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { scaleQuantile } from "d3-scale";
import configs from "./state_config.json";
import Notes from './Notes';
import _ from 'lodash';
import { VictoryChart, 
  VictoryContainer,
  VictoryGroup, 
  VictoryBar, 
  VictoryTheme, 
  VictoryAxis, 
  VictoryLine,
  VictoryLabel, 
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';
import { render } from 'react-dom';
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"

const style = <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css'/>

const Placeholder = () => <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />

class StickyExampleAdjacentContext extends Component {
  state = {}

  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    const { contextRef } = this.state

    return (
      <Grid centered style = {{width: 1230}}>
        <Grid.Column >
          <div ref={this.handleContextRef}>
              <Rail position='right'>
                <Sticky offset={130}>
                  <br/><br/><br/><br/><br/><br/><br/><br/>
                  
                  <Popup position='left center' trigger={<Button style = {{borderRadius: "0px", paddingleft: -10, width: 78, textAlign: "left", fontSize: "14pt"}}>Jump to...</Button>} flowing hoverable>

                    <Grid.Column row = {2}>
                      <Grid.Column textAlign='right' >
                        <div class="ui ordered list" style = {{fontSize: "14pt"}}>
                          <a class="item" href= "#jump1">Return to the top</a> <br/>
                          <a class="item" href= "#jump2">Cases/Deaths in the US Over Time</a> <br/>
                          <a class="item" href= "#jump3">50% of Cases Comes From These States</a> <br/>
                          <a class="item" href= "#jump4">Top 10 Counties with Most Cases/Deaths</a> <br/>
                          <a class="item" href= "#jump5">Daily New Cases/Deaths per 100,000</a> <br/>
                          <a class="item" href= "#jump6">Community Vulnerability Index</a> <br/>
                          <a class="item" href= "#jump7">Residential Segregation Index</a> <br/>
                          <a class="item" href= "#jump8">Cases by County Characteristics</a> <br/>
                          <a class="item" href= "#jump9">Deaths by County Characteristics</a>
                        </div> 
                      </Grid.Column>
                    </Grid.Column>
                  </Popup>
                </Sticky>
              </Rail>
          </div>
        </Grid.Column>
      </Grid>
    )
  }
}



const casesColor = [
  "#72ABB1",
  "#337fb5"
];
const mortalityColor = [
  "#0270A1",
  "#024174"
];
const colorPalette = [
  "#e1dce2",
  "#d3b6cd",
  "#bf88b5", 
  "#af5194", 
  "#99528c", 
  "#633c70", 
];
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
const fullMonthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


//const nationColor = '#487f84';

export default function ExtraFile(props) {

  const [data, setData] = useState();
  const [date, setDate] = useState('');
  const [fips, setFips] = useState('13');

  const [dataTS, setDataTS] = useState();
  const [topTen, setTopTen] = useState();
  const [states50, setStates50] = useState();

  const [dataTopCases, setDataTopCases] = useState();
  const [dataTopMortality, setDataTopMortality] = useState();
  const [nationalBarChartCases, setNationalBarChartCases] = useState();
  const [nationalBarChartMortality, setNationalBarChartMortality] = useState();

  const [percentChangeCases, setPercentChangeCases] = useState();

  const [percentChangeMortality, setPercentChangeMortality] = useState();
  const [mean7dayCases, setMean7dayCases] = useState();
  const [mortalityMean, setMortalityMean] = useState();

  const [dailyCases, setDailyCases] = useState();
  const [dailyDeaths, setDailyDeaths] = useState();
  const [CVI, setCVI] = useState("CVI");
  const [colorCVI, setColorCVI] = useState();

  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);
  const [covidMetric, setCovidMetric] = useState({cases: 'N/A', deaths: 'N/A', 
                                                  caseRate: "N/A", mortality: "N/A", 
                                                  caseRateMean: "N/A", mortalityMean: "N/A",
                                                  caseRateMA: "N/A", mortalityMA: "N/A",
                                                  cfr:"N/A", t: 'n/a'});
  const [varMap, setVarMap] = useState({});
  



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

      fetch('/data/nationalBarCases.json').then(res => res.json())
        .then(x => {
          setNationalBarChartCases(x);
        });

      fetch('/data/nationalBarMortality.json').then(res => res.json())
        .then(x => {
          setNationalBarChartMortality(x);
        });

      fetch('/data/date.json').then(res => res.json())
      .then(x => setDate(x.date.substring(5,7) + "/" + x.date.substring(8,10) + "/" + x.date.substring(0,4)));
      

      fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
        .then(x => setVarMap(x));
      
      fetch('/data/timeseries_.json').then(res => res.json())
        .then(x => {
          let t = 0;

          let percentChangeC = 0;
          let percentChangeM = 0;
          let cRateMean = 0;
          let dailyC = 0;
          let dailyD = 0;
          let mMean = 0;

          _.each(x, (v, k)=>{
            if(k === "_nation" && v.length > 0 && v[v.length-1].t > t){

                percentChangeC = v[v.length-1].percent14dayDailyCases;
                percentChangeM = v[v.length-1].percent14dayDailyDeaths;
                cRateMean = v[v.length-1].caseRateMean;
                mMean = v[v.length-1].mortalityMean;
                dailyC = v[v.length-1].dailyCases;
                dailyD = v[v.length-1].dailyMortality;
              }

            });

          setPercentChangeCases(percentChangeC.toFixed(0) + "%");
          setMean7dayCases(cRateMean.toFixed(0));
          setPercentChangeMortality(percentChangeM.toFixed(0) + "%");
          setMortalityMean(mMean.toFixed(0));

          setDailyCases(dailyC.toFixed(0));
          setDailyDeaths(dailyD.toFixed(0));
          setDataTS(x);
        }
      );

      fetch('/data/topTenCases.json').then(res => res.json())
        .then(x => setDataTopCases(x));

      fetch('/data/topTenMortality.json').then(res => res.json())
        .then(x => setDataTopMortality(x));

    }, []);

    useEffect(() => {
      if (CVI) {
      fetch('/data/data.json').then(res => res.json())
        .then(x => {
          
          setData(x);
        
          const cs = scaleQuantile()
          .domain(_.map(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d}), 
            d => (
                d[CVI] > 0 &&
                d.fips.length === 5)),
            d=> d[CVI]))
          .range(colorPalette);
  
          let scaleMap = {}
          _.each(x, d=>{
            if(d[CVI] > 0){
            scaleMap[d[CVI]] = cs(d[CVI])}});
        
          setColorCVI(scaleMap);
          var max = 0
          var min = 100
          _.each(x, d=> { 
            if (d[CVI] > max && d.fips.length === 5) {
              max = d[CVI]
            } else if (d.fips.length === 5 && d[CVI] < min && d[CVI] > 0){
              min = d[CVI]
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
  
    }, [CVI])

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
        <Container id="jump1" style={{marginTop: '8em', minWidth: '1260px'}}>
        <div >
          <br/><br/><br/><br/>
        </div>
        <div ><StickyExampleAdjacentContext/></div>
         <div>     	
          <Header as='h2' style={{color: '#487f84',textAlign:'center', fontWeight: 400, fontSize: "24pt", paddingTop: 17, paddingLeft: "7em", paddingRight: "7em"}}>
            <Header.Content>
            <b> COVID-19 US Health Equity Report </b> 
             <Header.Subheader style={{fontWeight:300,fontSize:"20pt", paddingTop:16}}> 
             <b>{monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}</b>
              
             </Header.Subheader>
            </Header.Content>
          </Header>
        </div>
        <div style={{paddingTop:36,textAlign:'justify', fontSize:"14pt", lineHeight: "16pt",paddingBottom:30, paddingLeft: "7em", paddingRight: "7em"}}>
        <text id="jump2" style={{fontFamily:'lato', fontSize: "14pt"}}>
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
                <Grid.Row column = {1}>
                      <Grid.Column style={{paddingTop:20, width: 1030, paddingLeft: 35}}>
                            <center> <text x={0} y={20} style={{fontSize: '18pt', marginLeft: 0, paddingBottom: 0, fontWeight: 600}}>Average Daily COVID-19 Cases </text> </center>

                            <VictoryChart theme={VictoryTheme.material}
                              width={1030}
                              height={400}       
                              padding={{left: 70, right: 40, top: 18, bottom: 40}}
                              containerComponent={<VictoryVoronoiContainer /> }
                              >

                            <VictoryAxis
                              tickValues={[
                                dataTS["_nation"][0].t,
                                dataTS["_nation"][30].t,
                                dataTS["_nation"][61].t,
                                dataTS["_nation"][91].t,
                                dataTS["_nation"][122].t,
                                dataTS["_nation"][dataTS["_nation"].length-1].t]}                        
                                style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                                tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                            <VictoryAxis dependentAxis tickCount={5}
                                style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 

                              tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                              />

                            <VictoryGroup>
                              <VictoryBar
                                barRatio={0.8}
                                data={dataTS["_nation"]}
                                style={{
                                  data: {
                                    fill: casesColor[0]
                                  }
                                }}
                                x="t"
                                y="dailyCases"
                              />
                            </VictoryGroup>
                            <VictoryGroup 
                                colorScale={[casesColor[1]]}
                            >
                                <VictoryLine data={dataTS["_nation"]}
                                  x='t' y='caseRateMean'
                                  labels={({ datum }) => `${fullMonthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}` + ` \n New cases: ${numberWithCommas(datum.dailyCases.toFixed(0))} \n 7-day average: ${numberWithCommas(datum.caseRateMean.toFixed(0))}`}
                                  labelComponent={
                                  <VictoryTooltip 
                                    style={{marginLeft: 100, fontWeight: 400, fontFamily: 'lato', fontSize: "19px", textAnchor: "start"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{marginLeft: 100, borderRadius: "0px", fill: "#FFFFFF", fillOpacity: 1, stroke: "#A9A9A9", strokeWidth: 1 }}
                                  />}
                                  style={{
                                    data: {strokeWidth: ({ active }) => active ? 3 : 2},
                                  }}
                                />
                            </VictoryGroup>
                            
                            
                          </VictoryChart>
                      </Grid.Column>

                      <Grid.Column style={{paddingTop:50, width: 1000}}>
                        <Header as='h2' style={{fontWeight: 400, width: 1000, paddingLeft: 35, paddingTop: 0, paddingBottom: 20}}>
                            <Header.Content style={{fontSize: "14pt"}}>
                              <Header.Subheader style={{color: '#000000', width: 1000, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                                This figure shows the trend of daily COVID-19 cases in US. The bar height reflects the number of 
                                new cases per day and the line depicts 7-day moving average of daily cases in US. There were {numberWithCommas(dailyCases)} new COVID-19 cases reported on {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}, with 
                                an average of {numberWithCommas(mean7dayCases)} new cases per day reported over the past 7 days. 
                                We see a {percentChangeCases.includes("-")? "decrease of approximately " + percentChangeCases.substring(1): "increase of approximately " + percentChangeCases} in 
                                the average new cases over the past 14-day period. 
                                <br/>
                                <br/>
                                *14-day period includes {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getFullYear()} to {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}.

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
                <Grid.Row column = {1} >

                      <Grid.Column style={{paddingTop:28, width: 1030, paddingLeft: 35}}>
                            <center> <text x={0} y={20} style={{fontSize: '18pt', paddingLeft: 0, paddingBottom: 5, fontWeight: 600}}>Average Daily COVID-19 Deaths </text> </center>

                            <VictoryChart theme={VictoryTheme.material} 
                              width={1030}
                              height={400}       
                              padding={{left: 70, right: 40, top: 24, bottom: 40}}
                              containerComponent={<VictoryVoronoiContainer/>}
                              >

                              <VictoryAxis
                                tickValues={[
                                  dataTS["_nation"][0].t,
                                  dataTS["_nation"][30].t,
                                  dataTS["_nation"][61].t,
                                  dataTS["_nation"][91].t,
                                  dataTS["_nation"][122].t,
                                  dataTS["_nation"][dataTS["_nation"].length-1].t]}                           
                                style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                                tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                              <VictoryAxis dependentAxis tickCount={5}
                                style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "14pt", fontFamily: 'lato'}}} 
                                tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                                />
                              <VictoryGroup 
                                colorScale={[mortalityColor[1]]}
                              >
                                <VictoryLine data={dataTS["_nation"]}
                                  x='t' y='mortalityMean'
                                  labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.mortalityMean.toFixed(0))}`}
                                  labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
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
                                    fill: mortalityColor[0]
                                  }
                                }}
                                x="t"
                                y="dailyMortality"
                              />
                            </VictoryGroup>
                            </VictoryChart>
                      </Grid.Column>

                      <Grid.Column style={{paddingTop:50, width: 1000}}>
                        <Header as='h2' style={{fontWeight: 400, width: 1000, paddingLeft: 35, paddingTop: 0, paddingBottom: 20}}>
                          <Header.Content style={{fontSize: "14pt"}}>
                            <Header.Subheader id="jump3" style={{color: '#000000', width: 1000, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                              This figure shows the trend of daily COVID-19 deaths in US. The bar height reflects the number of new deaths 
                              per day and the line depicts 7-day moving average of daily deaths in US. There were {dailyDeaths} new deaths 
                              associated with COVID-19 reported on {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}, with 
                              an average of {mortalityMean} new deaths per day reported over the past 7 days. 
                              We see {percentChangeMortality.includes("-")? "a decrease of approximately " + percentChangeMortality.substring(1): "an increase of approximately " + percentChangeMortality} in the average new deaths over the past 14-day period. 
                              <br/>
                              <br/>
                              *14-day period includes {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getFullYear()} to {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}.
                            
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
                the Northeast toward the Southeast and Southwest.
                Approximately 50% of new cases on {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()} in 
                the United States were attributed to {(states50[0]["statenames"].split(",")).length} states: <br/>

                <br/>
               <center> <b id="jump4" style = {{fontSize:"18pt"}}>{states50[0]["statenames"]}</b> </center>
              </Header.Subheader>
            </Header.Content>
          </Header>
        </div>
        <center><Divider style = {{width:1000}}/> </center>
        <div style={{paddingTop:'1em',paddingBottom:'1em', paddingLeft: "7em", paddingRight: "7em"}}>
          <Header as='h2' style={{textAlign:'center',fontSize:"22pt", color: '#487f84', paddingTop: 17, width: 1030, paddingLeft: 25}}>
            <Header.Content>
              The 10 counties with most new cases and deaths per 100,000 residents <br/> since {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 8].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 8].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 8].t*1000).getFullYear()}.
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
                    padding={{left: 255, right: 35, top: 20, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fill: '#000000'}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
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
                          fill: casesColor[1]
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
                    padding={{left: 255, right: 35, top: 20, bottom: -5}}
                    style = {{fontSize: "14pt",fontWeight: 500, }}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, grid: {stroke: "transparent"}, axis: {stroke: "#000000"}, labels: {fontWeight: 500, fill: '#000000', fontSize: "20px"}, tickLabels: {fontWeight: 500, fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, grid: {stroke: "transparent"}, axis: {stroke: "transparent"}, labels: {fontWeight: 500, fill: '#000000', fontSize: "20px"}, tickLabels: {fontWeight: 500, fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
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
                          fill: mortalityColor[1]
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
                       as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}.                   
					           </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 20}}>
                  <Header.Content>
                    <Header.Subheader id="jump5" style={{color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign:'justify'}}>
					             This figure shows the ten counties with the greatest average new COVID-19 deaths per 100,000 residents.
                       as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}.                   
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
              <Header.Subheader style={{color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 32, paddingRight: 27}}>
			         
                Counties that are currently experiencing large surges in cases and deaths attributed to COVID-19 
                may not have always been badly affected by the virus. In the figures below, we chart the 7-day 
                average of new cases and deaths in these ten hardest-hit counties over the past few months, 
                showing how their infection and death rates have sharply increased in recently weeks.

              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row columns={1} style={{paddingTop: 8}}>
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		  Daily New Cases per 100,000 population
            		</Header.Content>
            	</Header>
              
                      <svg width = "1030" height = "90" style = {{marginLeft: 10}}>
                          <rect x = {50} y = {12} width = "12" height = "4" style = {{fill: "#5d3f6d", strokeWidth:1}}/>
                          <text x = {65} y = {20} style = {{ fontSize: "14pt"}}> 1. {Object.keys(dataTopCases)[0]}</text>

                          <rect x = {390} y = {12} width = "12" height = "4" style = {{fill: "#007dba", strokeWidth:1}}/>
                          <text x = {405} y = {20} style = {{ fontSize: "14pt"}}> 2. {Object.keys(dataTopCases)[1]} </text>

                          <rect x = {740} y = {12} width = "12" height = "4" style = {{fill: "#b88bb2", strokeWidth:1}}/>
                          <text x = {755} y = {20} style = {{ fontSize: "14pt"}}> 3. {Object.keys(dataTopCases)[2]}</text>

                          <rect x = {230} y = {50} width = "12" height = "4" style = {{fill: "#00aeef", strokeWidth:1}}/>
                          <text x = {245} y = {58} style = {{ fontSize: "14pt"}}> 4. {Object.keys(dataTopCases)[3]}</text>

                          <rect x = {580} y = {50} width = "12" height = "4" style = {{fill: "#e8ab3b", strokeWidth:1}}/>
                          <text x = {595} y = {58} style = {{ fontSize: "14pt"}}> 5. {Object.keys(dataTopCases)[4]} </text>
                      </svg>
                <VictoryChart theme={VictoryTheme.material} 
                        width={1030}
                        height={400}       
                        padding={{left: 70, right:110, top: 20, bottom: 40}}
                        minDomain={{ x: dataTopCases[Object.keys(dataTopCases)[0]][13].t}}
                        maxDomain = {{ y: 1250}}
                        containerComponent={<VictoryVoronoiContainer/>}
                        >

                        <VictoryAxis
                          tickValues={[
                            dataTopCases[Object.keys(dataTopCases)[0]][13].t,
                            dataTopCases[Object.keys(dataTopCases)[0]][9].t,
                            dataTopCases[Object.keys(dataTopCases)[0]][5].t,
                            dataTopCases[Object.keys(dataTopCases)[0]][0].t]}                        
                          style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "19px", fontFamily: 'lato'}}} 
                          tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                          style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "19px", fontFamily: 'lato'}}} 
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
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopCases[Object.keys(dataTopCases)[1]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopCases[Object.keys(dataTopCases)[2]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopCases[Object.keys(dataTopCases)[3]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopCases[Object.keys(dataTopCases)[4]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopCases)[0].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={25} textAnchor="start" style = {{fontSize: "19px"}}/>
                              }
                            data={[{ x: dataTopCases[Object.keys(dataTopCases)[0]][0].t, y: dataTopCases[Object.keys(dataTopCases)[0]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopCases)[1].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={0} textAnchor="start" style = {{fontSize: "19px"}}/>
                              }
                            data={[{ x: dataTopCases[Object.keys(dataTopCases)[1]][0].t, y: dataTopCases[Object.keys(dataTopCases)[1]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopCases)[2].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={-3} textAnchor="start" style = {{fontSize: "19px"}}/>
                              }
                            data={[{ x: dataTopCases[Object.keys(dataTopCases)[2]][0].t, y: dataTopCases[Object.keys(dataTopCases)[2]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopCases)[3].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={-5} textAnchor="start" style = {{fontSize: "19px"}}/>
                              }
                            data={[{ x: dataTopCases[Object.keys(dataTopCases)[3]][0].t, y: dataTopCases[Object.keys(dataTopCases)[3]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopCases)[4].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={18} textAnchor="start" style = {{fontSize: "19px"}}/>
                              }
                            data={[{ x: dataTopCases[Object.keys(dataTopCases)[4]][0].t, y: dataTopCases[Object.keys(dataTopCases)[4]][0].measure }]}
                          />

                        </VictoryGroup>
                </VictoryChart>

            </Grid.Column>
            <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 1030, paddingLeft: 40, paddingTop: 30, paddingBottom: 50}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 1030, fontSize: "14pt", textAlign:'justify', paddingRight: 35}}>
                      This figure shows the 7-day average of new daily cases of COVID-19 per 100,000 residents in the five counties with the largest increase in daily cases since {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getFullYear()}.         
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>

            <Grid.Column style={{paddingTop:10, paddingBottom:25}}>
            	<Header as='h2' style={{marginLeft: -25, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
            		<Header.Content>
            		  Daily New Deaths per 100,000 population
            		</Header.Content>
            	</Header>
                
                <svg width = "1030" height = "90" style = {{marginLeft: 10}}>
                          <rect x = {50} y = {12} width = "12" height = "4" style = {{fill: "#5d3f6d", strokeWidth:1}}/>
                          <text x = {65} y = {20} style = {{ fontSize: "14pt"}}> 1. {Object.keys(dataTopMortality)[0]} </text>

                          <rect x = {390} y = {12} width = "12" height = "4" style = {{fill: "#007dba", strokeWidth:1}}/>
                          <text x = {405} y = {20} style = {{ fontSize: "14pt"}}> 2. {Object.keys(dataTopMortality)[1]} </text>

                          <rect x = {740} y = {12} width = "12" height = "4" style = {{fill: "#b88bb2", strokeWidth:1}}/>
                          <text x = {765} y = {20} style = {{ fontSize: "14pt"}}> 3. {Object.keys(dataTopMortality)[2]} </text>

                          <rect x = {230} y = {50} width = "12" height = "4" style = {{fill: "#00aeef", strokeWidth:1}}/>
                          <text x = {245} y = {58} style = {{ fontSize: "14pt"}}> 4. {Object.keys(dataTopMortality)[3]} </text>

                          <rect x = {580} y = {50} width = "12" height = "4" style = {{fill: "#e8ab3b", strokeWidth:1}}/>
                          <text x = {595} y = {58} style = {{ fontSize: "14pt"}}> 5. {Object.keys(dataTopMortality)[4]} </text>
                      </svg>
                <VictoryChart theme={VictoryTheme.material} 
                        width={1030}
                        height={400}       
                        padding={{left: 70, right: 110, top: 20, bottom: 40}}
                        minDomain={{ x: dataTopMortality[Object.keys(dataTopMortality)[0]][13].t}}                           
                        containerComponent={<VictoryVoronoiContainer/>}
                        >

                        <VictoryAxis
                          tickValues={[
                            dataTopMortality[Object.keys(dataTopMortality)[0]][13].t,
                            dataTopMortality[Object.keys(dataTopMortality)[0]][9].t,
                            dataTopMortality[Object.keys(dataTopMortality)[0]][5].t,
                            dataTopMortality[Object.keys(dataTopMortality)[0]][0].t]}                        
                          style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "19px", fontFamily: 'lato'}}} 
                          tickFormat={(t)=> monthNames[new Date(t*1000).getMonth()] + " " +  new Date(t*1000).getDate()}/>
                        <VictoryAxis dependentAxis tickCount={5}
                          style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent", fill: "#000000"}, tickLabels: {stroke: "#000000", fill: "#000000", fontSize: "19px", fontFamily: 'lato'}, labels: {fontSize: "19px", fontFamily: 'lato'}}} 
                          tickFormat={(y) => (y<1000?y:(y/1000+'k'))}
                          />
                        <VictoryGroup 
                          colorScale={["#5d3f6d",
                                      "#007dba", 
                                      "#b88bb2", 
                                      "#00aeef", 
                                      "#e8ab3b"]}
                          >

                          <VictoryLine data={dataTopMortality[Object.keys(dataTopMortality)[0]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}

                          />

                          <VictoryLine data={dataTopMortality[Object.keys(dataTopMortality)[1]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopMortality[Object.keys(dataTopMortality)[2]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopMortality[Object.keys(dataTopMortality)[3]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryLine data={dataTopMortality[Object.keys(dataTopMortality)[4]]}
                            x='t' y='measure'
                            labels={({ datum }) => `${monthNames[new Date(datum.t*1000).getMonth()] + " " +  new Date(datum.t*1000).getDate()}: ${numberWithCommas(datum.measure.toFixed(0))}`}
                            labelComponent={<VictoryTooltip style={{fontWeight: 400, fontFamily: 'lato', fontSize: "19px"}} centerOffset={{ x: 20, y: 20 }} flyoutStyle={{ fillOpacity: 0, stroke: "#FFFFFF", strokeWidth: 0 }}/>}
                            style={{
                              fontFamily: 'lato',
                              data: { strokeWidth: ({ active }) => active ? 3 : 2},
                            }}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopMortality)[0].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={0} textAnchor="start" style = {{fontSize: "19px"}}/>
                              }
                            data={[{ x: dataTopMortality[Object.keys(dataTopMortality)[0]][0].t, y: dataTopMortality[Object.keys(dataTopMortality)[0]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopMortality)[1].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={0} textAnchor="start" style = {{fontSize: "19px"}}/>
                              }
                            data={[{ x: dataTopMortality[Object.keys(dataTopMortality)[1]][0].t, y: dataTopMortality[Object.keys(dataTopMortality)[1]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopMortality)[2].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={0} textAnchor="start" style = {{fontSize: "19px"}}/>
                              }
                            data={[{ x: dataTopMortality[Object.keys(dataTopMortality)[2]][0].t, y: dataTopMortality[Object.keys(dataTopMortality)[2]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopMortality)[3].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={5} textAnchor="start" style = {{fontSize: "19px"}}/>
                              }
                            data={[{ x: dataTopMortality[Object.keys(dataTopMortality)[3]][0].t, y: dataTopMortality[Object.keys(dataTopMortality)[3]][0].measure }]}
                          />

                          <VictoryScatter
                          size = {1}
                            labels={Object.keys(dataTopMortality)[4].match(/\S+/)}
                              labelComponent={
                                <VictoryLabel dx={5} dy={0} textAnchor="start" style = {{fontSize: "19px"}}/>
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
            <Grid.Row columns={1} style={{paddingBottom: 47}}>
              
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 1030, paddingLeft: 130}}>
                  <Header.Content>
                    <Header.Subheader id="jump6" style={{color: '#000000', lineHeight: "16pt", width: 1030, fontSize: "14pt", textAlign:'justify', paddingRight: 35}}>
					            This figure shows the 7-day average of new daily deaths of COVID-19 per 100,000 residents in the five counties with the largest increase in daily cases since {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 15].t*1000).getFullYear()}.				
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
              COVID-19 by Community Vulnerability Index 
              <Header.Subheader style={{color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 32, paddingRight: 27}}>
               
                Some communities are limited in their ability to prevent, manage, and mitigate the spread of a pandemic disease, 
                and its economic and social impacts, rendering them more vulnerable to COVID-19 than others. CVI incorporates 
                the SVI’s sociodemographic variables, along with risk factors specific to COVID-19 and variables measuring the 
                capacity of public health systems. It considers six core themes that together account for 34 factors that make 
                a community vulnerable to the COVID-19 pandemic. 

                <br/>
                <br/>

              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row columns={2} style={{paddingTop: 8}}>
              <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
                

              <div >
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
                          {geographies.map(geo => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={
                              ((colorCVI && data[geo.id] && (data[geo.id][CVI]) > 0)?
                                  colorCVI[data[geo.id][CVI]]: 
                                  (colorCVI && data[geo.id] && data[geo.id][CVI] === 0)?
                                    '#FFFFFF':'#FFFFFF')}
                              
                            />
                          ))}
                        </svg>
                      }
                    </Geographies>
                    

                  </ComposableMap>
              </div>
              <div style = {{marginTop: 60}}>
                  <br/>
                  <br/>
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
                          {geographies.map(geo => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={
                              ((colorCVI && data[geo.id] && (data[geo.id][CVI]) > 0)?
                                  colorCVI[data[geo.id][CVI]]: 
                                  (colorCVI && data[geo.id] && data[geo.id][CVI] === 0)?
                                    '#FFFFFF':'#FFFFFF')}
                              
                            />
                          ))}
                        </svg>
                      }
                    </Geographies>
                    

                  </ComposableMap>

                </div>


              </Grid.Column>
              <Grid.Column>
              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                  <Header.Content>
                    Cases per 100,000 residents by Community Vulnerability Index
                  </Header.Content>
                </Header>
                    <VictoryChart
                      theme={VictoryTheme.material}
                      width={530}
                      height={220}
                      domainPadding={20}
                      minDomain={{y: props.ylog?1:0}}
                      padding={{left: 180, right: 30, top: 30, bottom: -5}}
                      style = {{fontSize: "14pt"}}
                      containerComponent={<VictoryContainer responsive={false}/>}
                    >
                      <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                      <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                      <VictoryBar
                        horizontal
                        barRatio={0.75}
                        labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                        data={[
                              {key: nationalBarChartCases['CVI'][0]['label'], 'value': (nationalBarChartCases['CVI'][0]['caserate7day']/nationalBarChartCases['CVI'][0]['caserate7day'])*nationalBarChartCases['CVI'][0]['caserate7day'] || 0},
                              {key: nationalBarChartCases['CVI'][1]['label'], 'value': (nationalBarChartCases['CVI'][1]['caserate7day']/nationalBarChartCases['CVI'][0]['caserate7day'])*nationalBarChartCases['CVI'][0]['caserate7day'] || 0},
                              {key: nationalBarChartCases['CVI'][2]['label'], 'value': (nationalBarChartCases['CVI'][2]['caserate7day']/nationalBarChartCases['CVI'][0]['caserate7day'])*nationalBarChartCases['CVI'][0]['caserate7day'] || 0},
                              {key: nationalBarChartCases['CVI'][3]['label'], 'value': (nationalBarChartCases['CVI'][3]['caserate7day']/nationalBarChartCases['CVI'][0]['caserate7day'])*nationalBarChartCases['CVI'][0]['caserate7day'] || 0},
                              {key: nationalBarChartCases['CVI'][4]['label'], 'value': (nationalBarChartCases['CVI'][4]['caserate7day']/nationalBarChartCases['CVI'][0]['caserate7day'])*nationalBarChartCases['CVI'][0]['caserate7day'] || 0}



                        ]}
                        labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                        style={{
                          data: {
                            fill: casesColor[1]
                          }
                        }}
                        x="key"
                        y="value"
                      />
                    </VictoryChart>

                    <Header.Content>
                      <center>
                      <text style={{fontWeight: 300, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                        <br/>
                        <b>{varMap["caserate7dayfig"].name}</b>
                      </text>
                      </center>
                    </Header.Content>
                  <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 530, paddingLeft: 40, paddingTop: 30, paddingBottom: 50}}>
                    <Header.Content>
                      <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 530, fontSize: "14pt", textAlign:'justify', paddingRight: 35}}>
                        US counties were grouped into 5 categories based on their CVI score.  As of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}, we can see that counties in US with higher vulnerability index have higher COVID-19 cases per 100,000 residents as compared to counties in US with lower vulnerability index. 
                      </Header.Subheader>
                    </Header.Content>
                  </Header>



                  <Header as='h2' style={{marginLeft: 0, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                  <Header.Content>
                    Deaths per 100,000 residents by Community Vulnerability Index
                  </Header.Content>
                </Header>
                    <VictoryChart
                      theme={VictoryTheme.material}
                      width={530}
                      height={220}
                      domainPadding={20}
                      minDomain={{y: props.ylog?1:0}}
                      padding={{left: 180, right: 30, top: 30, bottom: -5}}
                      style = {{fontSize: "14pt"}}
                      containerComponent={<VictoryContainer responsive={false}/>}
                    >
                      <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                      <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                      <VictoryBar
                        horizontal
                        barRatio={0.75}
                        labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
                        data={[
                              {key: nationalBarChartMortality['CVI'][0]['label'], 'value': (nationalBarChartMortality['CVI'][0]['covidmortality7day']/nationalBarChartMortality['CVI'][0]['covidmortality7day'])*nationalBarChartMortality['CVI'][0]['covidmortality7day'] || 0},
                              {key: nationalBarChartMortality['CVI'][1]['label'], 'value': (nationalBarChartMortality['CVI'][1]['covidmortality7day']/nationalBarChartMortality['CVI'][0]['covidmortality7day'])*nationalBarChartMortality['CVI'][0]['covidmortality7day'] || 0},
                              {key: nationalBarChartMortality['CVI'][2]['label'], 'value': (nationalBarChartMortality['CVI'][2]['covidmortality7day']/nationalBarChartMortality['CVI'][0]['covidmortality7day'])*nationalBarChartMortality['CVI'][0]['covidmortality7day'] || 0},
                              {key: nationalBarChartMortality['CVI'][3]['label'], 'value': (nationalBarChartMortality['CVI'][3]['covidmortality7day']/nationalBarChartMortality['CVI'][0]['covidmortality7day'])*nationalBarChartMortality['CVI'][0]['covidmortality7day'] || 0},
                              {key: nationalBarChartMortality['CVI'][4]['label'], 'value': (nationalBarChartMortality['CVI'][4]['covidmortality7day']/nationalBarChartMortality['CVI'][0]['covidmortality7day'])*nationalBarChartMortality['CVI'][0]['covidmortality7day'] || 0}



                        ]}
                        labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                        style={{
                          data: {
                            fill: mortalityColor[1]
                          }
                        }}
                        x="key"
                        y="value"
                      />
                    </VictoryChart>

                    <Header.Content>
                      <center>
                        <text style={{fontWeight: 300, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                          <br/>
                          <b>{varMap["covidmortality7dayfig"].name}</b>
                        </text>
                      </center>
                    </Header.Content>

                    <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 530, paddingLeft: 40, paddingTop: 30}}>
                      <Header.Content>
                        <Header.Subheader id="jump7" style={{color: '#000000', lineHeight: "16pt", width: 530, fontSize: "14pt", textAlign:'justify', paddingRight: 35}}>
                          US counties were grouped into 5 categories based on their CVI score. As of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}, we can see that counties in US with higher vulnerability index have higher deaths associated with COVID-19 per 100,000 residents as compared to counties in US with lower vulnerability index. 
                          <br/>
                          <br/>
                          <br/>
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>


        <center> <Divider style = {{width:1000}}/> </center>
        <div style = {{ paddingLeft: "7em", paddingRight: "7em"}}>
          <Header as='h2' style={{textAlign:'center', color: '#487f84', fontSize: "22pt", paddingTop: 30}}>
            <Header.Content>
              COVID-19 by Residential Segregation Index 
              <Header.Subheader style={{color: '#000000', textAlign:'left' , fontSize:"14pt", lineHeight: "16pt", paddingTop:16, paddingBottom:28, paddingLeft: 32, paddingRight: 27}}>
               
                Residential segregation is a key factor responsible for the disproportionate impact of COVID-19 on different communities in the US. 
                It allows for social conditions that facilitate transmission and vulnerability to the effects of pandemic to be concentrated in 
                geographically defined areas. This results in the entire neighborhood being more exposed to the virus than others and more 
                vulnerable to its effects and limited quality of care. In the figures below, we show the severity of COVID-19 across 
                counties with different levels of residential segregation index.

                <br/>
                <br/>

              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row columns={1} style={{paddingTop: 8}}>
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                <Header.Content>
                  Cases per 100,000 residents by Residential segregation 
                </Header.Content>
              </Header>
                  <VictoryChart
                    theme={VictoryTheme.material}
                    width={1030}
                    height={220}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 180, right: 30, top: 30, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.75}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarChartCases['resSeg'][0]['label'], 'value': (nationalBarChartCases['resSeg'][0]['caserate7day']/nationalBarChartCases['resSeg'][0]['caserate7day'])*nationalBarChartCases['resSeg'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['resSeg'][1]['label'], 'value': (nationalBarChartCases['resSeg'][1]['caserate7day']/nationalBarChartCases['resSeg'][0]['caserate7day'])*nationalBarChartCases['resSeg'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['resSeg'][2]['label'], 'value': (nationalBarChartCases['resSeg'][2]['caserate7day']/nationalBarChartCases['resSeg'][0]['caserate7day'])*nationalBarChartCases['resSeg'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['resSeg'][3]['label'], 'value': (nationalBarChartCases['resSeg'][3]['caserate7day']/nationalBarChartCases['resSeg'][0]['caserate7day'])*nationalBarChartCases['resSeg'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['resSeg'][4]['label'], 'value': (nationalBarChartCases['resSeg'][4]['caserate7day']/nationalBarChartCases['resSeg'][0]['caserate7day'])*nationalBarChartCases['resSeg'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: casesColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <center>
                      <text style={{fontWeight: 300, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                        <br/>
                        <b>{varMap["caserate7dayfig"].name}</b>
                      </text>
                    </center>
                  </Header.Content>

            </Grid.Column>
            <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 1030, paddingLeft: 40, paddingTop: 30, paddingBottom: 50}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 1030, fontSize: "14pt", textAlign:'justify', paddingRight: 35}}>
                      US counties were grouped into 5 categories based on their residential segregation index.  As of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}, we can see that counties in US with lower residential segregation index have higher COVID-19 cases per 100,000 residents as compared to counties in US with higher residential segregation index. 
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>

            <Grid.Column style={{paddingTop:10, paddingBottom:25}}>
              <Header as='h2' style={{marginLeft: -25, textAlign:'center',fontSize:"18pt", lineHeight: "16pt"}}>
                <Header.Content>
                  Deaths per 100,000 residents by Residential segregation 
                </Header.Content>
              </Header>
                  <VictoryChart
                    theme={VictoryTheme.material}
                    width={1030}
                    height={220}
                    domainPadding={20}
                    minDomain={{y: props.ylog?1:0}}
                    padding={{left: 180, right: 30, top: 30, bottom: -5}}
                    style = {{fontSize: "14pt"}}
                    containerComponent={<VictoryContainer responsive={false}/>}
                  >
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.75}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
                      data={[
                             {key: nationalBarChartMortality['resSeg'][0]['label'], 'value': (nationalBarChartMortality['resSeg'][0]['covidmortality7day']/nationalBarChartMortality['resSeg'][0]['covidmortality7day'])*nationalBarChartMortality['resSeg'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['resSeg'][1]['label'], 'value': (nationalBarChartMortality['resSeg'][1]['covidmortality7day']/nationalBarChartMortality['resSeg'][0]['covidmortality7day'])*nationalBarChartMortality['resSeg'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['resSeg'][2]['label'], 'value': (nationalBarChartMortality['resSeg'][2]['covidmortality7day']/nationalBarChartMortality['resSeg'][0]['covidmortality7day'])*nationalBarChartMortality['resSeg'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['resSeg'][3]['label'], 'value': (nationalBarChartMortality['resSeg'][3]['covidmortality7day']/nationalBarChartMortality['resSeg'][0]['covidmortality7day'])*nationalBarChartMortality['resSeg'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['resSeg'][4]['label'], 'value': (nationalBarChartMortality['resSeg'][4]['covidmortality7day']/nationalBarChartMortality['resSeg'][0]['covidmortality7day'])*nationalBarChartMortality['resSeg'][0]['covidmortality7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: mortalityColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <center>
                      <text style={{fontWeight: 300, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                        <br/>
                        <b>{varMap["covidmortality7dayfig"].name}</b>
                      </text>
                    </center>
                  </Header.Content>

            </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <Grid>
            <Grid.Row columns={1} style={{paddingBottom: 47}}>
              
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 1030, paddingLeft: 130}}>
                  <Header.Content>
                    <Header.Subheader id="jump8" style={{color: '#000000', lineHeight: "16pt", width: 1030, fontSize: "14pt", textAlign:'justify', paddingRight: 35}}>
                      US counties were grouped into 5 categories based on their residential segregation index.  As of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}, we can see that counties in US with lower residential segregation index have higher deaths associated with COVID-19 per 100,000 residents as compared to counties in US with higher residential segregation index. 
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
                <center> <b style= {{fontSize: "18pt"}}>COVID-19 cases per 100,000 across the population characteristics of all the counties in the United States </b> </center> 
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

                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"},grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarChartCases['male'][0]['label'], 'value': (nationalBarChartCases['male'][0]['caserate7day']/nationalBarChartCases['male'][0]['caserate7day'])*nationalBarChartCases['male'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['male'][1]['label'], 'value': (nationalBarChartCases['male'][1]['caserate7day']/nationalBarChartCases['male'][0]['caserate7day'])*nationalBarChartCases['male'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['male'][2]['label'], 'value': (nationalBarChartCases['male'][2]['caserate7day']/nationalBarChartCases['male'][0]['caserate7day'])*nationalBarChartCases['male'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['male'][3]['label'], 'value': (nationalBarChartCases['male'][3]['caserate7day']/nationalBarChartCases['male'][0]['caserate7day'])*nationalBarChartCases['male'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['male'][4]['label'], 'value': (nationalBarChartCases['male'][4]['caserate7day']/nationalBarChartCases['male'][0]['caserate7day'])*nationalBarChartCases['male'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: casesColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <center>
                      <text style={{fontWeight: 300, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                        <br/>
                        <b>{varMap["caserate7dayfig"].name}</b>
                      </text>
                    </center>
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarChartCases['age65over'][0]['label'], 'value': (nationalBarChartCases['age65over'][0]['caserate7day']/nationalBarChartCases['age65over'][0]['caserate7day'])*nationalBarChartCases['age65over'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['age65over'][1]['label'], 'value': (nationalBarChartCases['age65over'][1]['caserate7day']/nationalBarChartCases['age65over'][0]['caserate7day'])*nationalBarChartCases['age65over'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['age65over'][2]['label'], 'value': (nationalBarChartCases['age65over'][2]['caserate7day']/nationalBarChartCases['age65over'][0]['caserate7day'])*nationalBarChartCases['age65over'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['age65over'][3]['label'], 'value': (nationalBarChartCases['age65over'][3]['caserate7day']/nationalBarChartCases['age65over'][0]['caserate7day'])*nationalBarChartCases['age65over'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['age65over'][4]['label'], 'value': (nationalBarChartCases['age65over'][4]['caserate7day']/nationalBarChartCases['age65over'][0]['caserate7day'])*nationalBarChartCases['age65over'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: casesColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <center>
                      <text style={{fontWeight: 300, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                        <br/>
                        <b>{varMap["caserate7dayfig"].name}</b>
                      </text>
                    </center>
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
            					This figure shows total cases of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who are male. US counties were grouped into 5 categories based on the proportion of male residents. 
                      We can see that in counties with the highest proportion of male residents (highest 20%), the rate is <b>{(nationalBarChartCases['male'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000.
                      In counties with the lowest proportion of male residents (lowest 20%), the rate is <b>{(nationalBarChartCases['male'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 33}}>
                  <Header.Content style={{fontSize: "14pt"}}>
                    <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign:'justify'}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who are over the age of 65. US counties were grouped into 5 categories based on the proportion of 
                      over the age of 65 residents. We can see that in counties with the highest proportion of residents over the age of 65 years (highest 20%),
                      the rate is <b>{(nationalBarChartCases['age65over'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents over the age of 65 years (lowest 20%), 
                      the rate is <b>{(nationalBarChartCases['age65over'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.                 
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarChartCases['black'][0]['label'], 'value': (nationalBarChartCases['black'][0]['caserate7day']/nationalBarChartCases['black'][0]['caserate7day'])*nationalBarChartCases['black'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['black'][1]['label'], 'value': (nationalBarChartCases['black'][1]['caserate7day']/nationalBarChartCases['black'][0]['caserate7day'])*nationalBarChartCases['black'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['black'][2]['label'], 'value': (nationalBarChartCases['black'][2]['caserate7day']/nationalBarChartCases['black'][0]['caserate7day'])*nationalBarChartCases['black'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['black'][3]['label'], 'value': (nationalBarChartCases['black'][3]['caserate7day']/nationalBarChartCases['black'][0]['caserate7day'])*nationalBarChartCases['black'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['black'][4]['label'], 'value': (nationalBarChartCases['black'][4]['caserate7day']/nationalBarChartCases['black'][0]['caserate7day'])*nationalBarChartCases['black'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: casesColor[1]
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarChartCases['poverty'][0]['label'], 'value': (nationalBarChartCases['poverty'][0]['caserate7day']/nationalBarChartCases['poverty'][0]['caserate7day'])*nationalBarChartCases['poverty'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['poverty'][1]['label'], 'value': (nationalBarChartCases['poverty'][1]['caserate7day']/nationalBarChartCases['poverty'][0]['caserate7day'])*nationalBarChartCases['poverty'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['poverty'][2]['label'], 'value': (nationalBarChartCases['poverty'][2]['caserate7day']/nationalBarChartCases['poverty'][0]['caserate7day'])*nationalBarChartCases['poverty'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['poverty'][3]['label'], 'value': (nationalBarChartCases['poverty'][3]['caserate7day']/nationalBarChartCases['poverty'][0]['caserate7day'])*nationalBarChartCases['poverty'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['poverty'][4]['label'], 'value': (nationalBarChartCases['poverty'][4]['caserate7day']/nationalBarChartCases['poverty'][0]['caserate7day'])*nationalBarChartCases['poverty'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: casesColor[1]
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
					            This figure shows total cases of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who are African American. US counties were grouped into 5 categories based on the proportion of 
                      African American residents. We can see that in counties with the highest proportion of African American residents (highest 20%), 
                      the rate is <b>{(nationalBarChartCases['black'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of African American residents (lowest 20%),
                      the rate is <b>{(nationalBarChartCases['black'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 33}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who are below the federal poverty line. US counties were grouped into 5 categories based on the proportion of 
                      residents in poverty. We can see that in counties with the highest proportion of residents in poverty (highest 20%),  
                      the rate is <b>{(nationalBarChartCases['poverty'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents in poverty (lowest 20%), 
                       the rate is <b>{(nationalBarChartCases['poverty'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid> 
          <Grid style = {{paddingLeft: "7em", paddingRight: "7em"}}>
            <Grid.Row columns={2} style={{paddingTop: '2em'}}>            
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarChartCases['diabetes'][0]['label'], 'value': (nationalBarChartCases['diabetes'][0]['caserate7day']/nationalBarChartCases['diabetes'][0]['caserate7day'])*nationalBarChartCases['diabetes'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['diabetes'][1]['label'], 'value': (nationalBarChartCases['diabetes'][1]['caserate7day']/nationalBarChartCases['diabetes'][0]['caserate7day'])*nationalBarChartCases['diabetes'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['diabetes'][2]['label'], 'value': (nationalBarChartCases['diabetes'][2]['caserate7day']/nationalBarChartCases['diabetes'][0]['caserate7day'])*nationalBarChartCases['diabetes'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['diabetes'][3]['label'], 'value': (nationalBarChartCases['diabetes'][3]['caserate7day']/nationalBarChartCases['diabetes'][0]['caserate7day'])*nationalBarChartCases['diabetes'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['diabetes'][4]['label'], 'value': (nationalBarChartCases['diabetes'][4]['caserate7day']/nationalBarChartCases['diabetes'][0]['caserate7day'])*nationalBarChartCases['diabetes'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: casesColor[1]
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
            	<Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarChartCases['hispanic'][0]['label'], 'value': (nationalBarChartCases['hispanic'][0]['caserate7day']/nationalBarChartCases['hispanic'][0]['caserate7day'])*nationalBarChartCases['hispanic'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['hispanic'][1]['label'], 'value': (nationalBarChartCases['hispanic'][1]['caserate7day']/nationalBarChartCases['hispanic'][0]['caserate7day'])*nationalBarChartCases['hispanic'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['hispanic'][2]['label'], 'value': (nationalBarChartCases['hispanic'][2]['caserate7day']/nationalBarChartCases['hispanic'][0]['caserate7day'])*nationalBarChartCases['hispanic'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['hispanic'][3]['label'], 'value': (nationalBarChartCases['hispanic'][3]['caserate7day']/nationalBarChartCases['hispanic'][0]['caserate7day'])*nationalBarChartCases['hispanic'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['hispanic'][4]['label'], 'value': (nationalBarChartCases['hispanic'][4]['caserate7day']/nationalBarChartCases['hispanic'][0]['caserate7day'])*nationalBarChartCases['hispanic'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: casesColor[1]
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
					            This figure shows total cases of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who have diabetes. US counties were grouped into 5 categories based on the proportion of 
                      residents with diabetes. We can see that in counties with the highest proportion of residents with diabetes (highest 20%),
                      the rate is <b>{(nationalBarChartCases['diabetes'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents with diabetes (lowest 20%),
                      the rate is <b>{(nationalBarChartCases['diabetes'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 33}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who are Hispanic. US counties were grouped into 5 categories based on the proportion of 
                      Hispanic residents. We can see that in counties with the highest proportion of Hispanic residents (highest 20%),
                      the rate is <b>{(nationalBarChartCases['hispanic'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of Hispanic residents (lowest 20%), 
                      the rate is <b>{(nationalBarChartCases['hispanic'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					          </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid> 
          <Grid style = {{paddingLeft: "7em", paddingRight: "7em"}}>
            <Grid.Row columns={2} style={{paddingTop: '2em'}}>
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
            	<Header as='h2' style={{fontWeight: 600,textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.75}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarChartCases['urbanrural'][0]['label'], 'value': (nationalBarChartCases['urbanrural'][0]['caserate7day']/nationalBarChartCases['urbanrural'][0]['caserate7day'])*nationalBarChartCases['urbanrural'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['urbanrural'][1]['label'], 'value': (nationalBarChartCases['urbanrural'][1]['caserate7day']/nationalBarChartCases['urbanrural'][0]['caserate7day'])*nationalBarChartCases['urbanrural'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['urbanrural'][2]['label'], 'value': (nationalBarChartCases['urbanrural'][2]['caserate7day']/nationalBarChartCases['urbanrural'][0]['caserate7day'])*nationalBarChartCases['urbanrural'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['urbanrural'][5]['label'], 'value': (nationalBarChartCases['urbanrural'][5]['caserate7day']/nationalBarChartCases['urbanrural'][0]['caserate7day'])*nationalBarChartCases['urbanrural'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['urbanrural'][3]['label'], 'value': (nationalBarChartCases['urbanrural'][3]['caserate7day']/nationalBarChartCases['urbanrural'][0]['caserate7day'])*nationalBarChartCases['urbanrural'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['urbanrural'][4]['label'], 'value': (nationalBarChartCases['urbanrural'][4]['caserate7day']/nationalBarChartCases['urbanrural'][0]['caserate7day'])*nationalBarChartCases['urbanrural'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: casesColor[1]
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
            	<Header as='h2' style={{fontWeight: 600,textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                      data={[
                             {key: nationalBarChartCases['region'][0]['label'], 'value': (nationalBarChartCases['region'][0]['caserate7day']/nationalBarChartCases['region'][0]['caserate7day'])*nationalBarChartCases['region'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['region'][1]['label'], 'value': (nationalBarChartCases['region'][1]['caserate7day']/nationalBarChartCases['region'][0]['caserate7day'])*nationalBarChartCases['region'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['region'][2]['label'], 'value': (nationalBarChartCases['region'][2]['caserate7day']/nationalBarChartCases['region'][0]['caserate7day'])*nationalBarChartCases['region'][0]['caserate7day'] || 0},
                             {key: nationalBarChartCases['region'][3]['label'], 'value': (nationalBarChartCases['region'][3]['caserate7day']/nationalBarChartCases['region'][0]['caserate7day'])*nationalBarChartCases['region'][0]['caserate7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: casesColor[1]
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
					            This figure shows total cases of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who live in different types of metropolitan areas. US counties were grouped
                       into 6 categories based on metropolitan status. We can see that in small metro areas, 
                       the rate is <b>{(nationalBarChartCases['urbanrural'][4]['caserate7day']).toFixed(0)}</b> cases per 100,000. In large central metros, 
                       the rate is <b>{(nationalBarChartCases['urbanrural'][0]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					           </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 33}}>
                  <Header.Content>
                    <Header.Subheader id="jump9" style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
					            This figure shows total cases of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by region of the US. US counties were grouped into 4 categories based on region. We can see that in the South, 
                      the rate is <b>{(nationalBarChartCases['region'][2]['caserate7day']).toFixed(0)}</b> cases per 100,000. In the Northeast, 
                      the rate is <b>{(nationalBarChartCases['region'][1]['caserate7day']).toFixed(0)}</b> COVID-19 cases per 100,000.					
					         </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid> 
        </div>


    <div>
          <Header as='h2' style={{color: '#b2b3b3', textAlign:'center',fontSize:"22pt", paddingTop: 64}}>
            <Header.Content style={{fontSize:"22pt",color:'#487f84'}}>
              <Header.Subheader style={{color:'#000000', fontSize:"14pt", paddingTop:19, textAlign: "left", paddingLeft: "7em", paddingRight: "7em"}}>
                <center> <b style= {{fontSize: "18pt"}}>COVID-19 deaths per 100,000 across the population characteristics of all the counties in the United States </b> </center> 
                     
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Grid style = {{paddingLeft: "7em", paddingRight: "7em"}}>
            <Grid.Row columns={2} style={{paddingTop: 50}}>
            <Grid.Column style={{paddingTop:'1em',paddingBottom: 18}}>
              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
                <Header.Content>
                COVID-19 deaths by percentage of <br/> male population
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

                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
                      data={[
                             {key: nationalBarChartMortality['male'][0]['label'], 'value': (nationalBarChartMortality['male'][0]['covidmortality7day']/nationalBarChartMortality['male'][0]['covidmortality7day'])*nationalBarChartMortality['male'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['male'][1]['label'], 'value': (nationalBarChartMortality['male'][1]['covidmortality7day']/nationalBarChartMortality['male'][0]['covidmortality7day'])*nationalBarChartMortality['male'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['male'][2]['label'], 'value': (nationalBarChartMortality['male'][2]['covidmortality7day']/nationalBarChartMortality['male'][0]['covidmortality7day'])*nationalBarChartMortality['male'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['male'][3]['label'], 'value': (nationalBarChartMortality['male'][3]['covidmortality7day']/nationalBarChartMortality['male'][0]['covidmortality7day'])*nationalBarChartMortality['male'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['male'][4]['label'], 'value': (nationalBarChartMortality['male'][4]['covidmortality7day']/nationalBarChartMortality['male'][0]['covidmortality7day'])*nationalBarChartMortality['male'][0]['covidmortality7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: mortalityColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                        <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                          <b>{varMap["covidmortality7dayfig"].name}</b>
                        </text>
                  </Header.Content>

            </Grid.Column>
            <Grid.Column style={{paddingTop:'1em',paddingBottom:18}}>
              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
                <Header.Content>
                COVID-19 deaths by percentage of <br/>population over the age 65 years
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "transparent"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
                      data={[
                             {key: nationalBarChartMortality['age65over'][0]['label'], 'value': (nationalBarChartMortality['age65over'][0]['covidmortality7day']/nationalBarChartMortality['age65over'][0]['covidmortality7day'])*nationalBarChartMortality['age65over'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['age65over'][1]['label'], 'value': (nationalBarChartMortality['age65over'][1]['covidmortality7day']/nationalBarChartMortality['age65over'][0]['covidmortality7day'])*nationalBarChartMortality['age65over'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['age65over'][2]['label'], 'value': (nationalBarChartMortality['age65over'][2]['covidmortality7day']/nationalBarChartMortality['age65over'][0]['covidmortality7day'])*nationalBarChartMortality['age65over'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['age65over'][3]['label'], 'value': (nationalBarChartMortality['age65over'][3]['covidmortality7day']/nationalBarChartMortality['age65over'][0]['covidmortality7day'])*nationalBarChartMortality['age65over'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['age65over'][4]['label'], 'value': (nationalBarChartMortality['age65over'][4]['covidmortality7day']/nationalBarChartMortality['age65over'][0]['covidmortality7day'])*nationalBarChartMortality['age65over'][0]['covidmortality7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: mortalityColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["covidmortality7dayfig"].name}</b>
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
                      This figure shows total deaths of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who are male. US counties were grouped into 5 categories based on the proportion of male residents. 
                      We can see that in counties with the highest proportion of male residents (highest 20%), the rate is <b>{(nationalBarChartMortality['male'][4]['covidmortality7day']).toFixed(1)}</b> deaths per 100,000.
                      In counties with the lowest proportion of male residents (lowest 20%), the rate is <b>{(nationalBarChartMortality['male'][0]['covidmortality7day']).toFixed(1)}</b> COVID-19 deaths per 100,000.         
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 33}}>
                  <Header.Content style={{fontSize: "14pt"}}>
                    <Header.Subheader style={{color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign:'justify'}}>
                      This figure shows total deaths of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who are over the age of 65. US counties were grouped into 5 categories based on the proportion of 
                      over the age of 65 residents. We can see that in counties with the highest proportion of residents over the age of 65 years (highest 20%),
                      the rate is <b>{(nationalBarChartMortality['age65over'][4]['covidmortality7day']).toFixed(1)}</b> deaths per 100,000. In counties with the lowest proportion of residents over the age of 65 years (lowest 20%), 
                      the rate is <b>{(nationalBarChartMortality['age65over'][0]['covidmortality7day']).toFixed(1)}</b> COVID-19 deaths per 100,000.                 
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid> 
          <Grid style = {{paddingLeft: "7em", paddingRight: "7em"}}>
            <Grid.Row columns={2} style={{paddingTop: '2em'}}>
            <Grid.Column style={{paddingTop:10, paddingBottom:18}}>
              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
                <Header.Content>
                COVID-19 deaths by percentage of <br/>African American population
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
                      data={[
                             {key: nationalBarChartMortality['black'][0]['label'], 'value': (nationalBarChartMortality['black'][0]['covidmortality7day']/nationalBarChartMortality['black'][0]['covidmortality7day'])*nationalBarChartMortality['black'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['black'][1]['label'], 'value': (nationalBarChartMortality['black'][1]['covidmortality7day']/nationalBarChartMortality['black'][0]['covidmortality7day'])*nationalBarChartMortality['black'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['black'][2]['label'], 'value': (nationalBarChartMortality['black'][2]['covidmortality7day']/nationalBarChartMortality['black'][0]['covidmortality7day'])*nationalBarChartMortality['black'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['black'][3]['label'], 'value': (nationalBarChartMortality['black'][3]['covidmortality7day']/nationalBarChartMortality['black'][0]['covidmortality7day'])*nationalBarChartMortality['black'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['black'][4]['label'], 'value': (nationalBarChartMortality['black'][4]['covidmortality7day']/nationalBarChartMortality['black'][0]['covidmortality7day'])*nationalBarChartMortality['black'][0]['covidmortality7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: mortalityColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["covidmortality7dayfig"].name}</b>
                    </text>
                  </Header.Content>

            </Grid.Column>
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
                <Header.Content>
                COVID-19 deaths by percentage of <br/>population in poverty
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
                      data={[
                             {key: nationalBarChartMortality['poverty'][0]['label'], 'value': (nationalBarChartMortality['poverty'][0]['covidmortality7day']/nationalBarChartMortality['poverty'][0]['covidmortality7day'])*nationalBarChartMortality['poverty'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['poverty'][1]['label'], 'value': (nationalBarChartMortality['poverty'][1]['covidmortality7day']/nationalBarChartMortality['poverty'][0]['covidmortality7day'])*nationalBarChartMortality['poverty'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['poverty'][2]['label'], 'value': (nationalBarChartMortality['poverty'][2]['covidmortality7day']/nationalBarChartMortality['poverty'][0]['covidmortality7day'])*nationalBarChartMortality['poverty'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['poverty'][3]['label'], 'value': (nationalBarChartMortality['poverty'][3]['covidmortality7day']/nationalBarChartMortality['poverty'][0]['covidmortality7day'])*nationalBarChartMortality['poverty'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['poverty'][4]['label'], 'value': (nationalBarChartMortality['poverty'][4]['covidmortality7day']/nationalBarChartMortality['poverty'][0]['covidmortality7day'])*nationalBarChartMortality['poverty'][0]['covidmortality7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: mortalityColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["covidmortality7dayfig"].name}</b>
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
                      This figure shows total deaths of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who are African American. US counties were grouped into 5 categories based on the proportion of 
                      African American residents. We can see that in counties with the highest proportion of African American residents (highest 20%), 
                      the rate is <b>{(nationalBarChartMortality['black'][4]['covidmortality7day']).toFixed(1)}</b> deaths per 100,000. In counties with the lowest proportion of African American residents (lowest 20%),
                      the rate is <b>{(nationalBarChartMortality['black'][0]['covidmortality7day']).toFixed(1)}</b> COVID-19 deaths per 100,000.         
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 33}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                      This figure shows total deaths of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who are below the federal poverty line. US counties were grouped into 5 categories based on the proportion of 
                      residents in poverty. We can see that in counties with the highest proportion of residents in poverty (highest 20%),  
                      the rate is <b>{(nationalBarChartMortality['poverty'][4]['covidmortality7day']).toFixed(1)}</b> deaths per 100,000. In counties with the lowest proportion of residents in poverty (lowest 20%), 
                       the rate is <b>{(nationalBarChartMortality['poverty'][0]['covidmortality7day']).toFixed(1)}</b> COVID-19 deaths per 100,000.          
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid> 
          <Grid style = {{paddingLeft: "7em", paddingRight: "7em"}}>
            <Grid.Row columns={2} style={{paddingTop: '2em'}}>            
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
                <Header.Content>
                COVID-19 deaths by percentage of <br/>population with diabetes
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
                      data={[
                             {key: nationalBarChartMortality['diabetes'][0]['label'], 'value': (nationalBarChartMortality['diabetes'][0]['covidmortality7day']/nationalBarChartMortality['diabetes'][0]['covidmortality7day'])*nationalBarChartMortality['diabetes'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['diabetes'][1]['label'], 'value': (nationalBarChartMortality['diabetes'][1]['covidmortality7day']/nationalBarChartMortality['diabetes'][0]['covidmortality7day'])*nationalBarChartMortality['diabetes'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['diabetes'][2]['label'], 'value': (nationalBarChartMortality['diabetes'][2]['covidmortality7day']/nationalBarChartMortality['diabetes'][0]['covidmortality7day'])*nationalBarChartMortality['diabetes'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['diabetes'][3]['label'], 'value': (nationalBarChartMortality['diabetes'][3]['covidmortality7day']/nationalBarChartMortality['diabetes'][0]['covidmortality7day'])*nationalBarChartMortality['diabetes'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['diabetes'][4]['label'], 'value': (nationalBarChartMortality['diabetes'][4]['covidmortality7day']/nationalBarChartMortality['diabetes'][0]['covidmortality7day'])*nationalBarChartMortality['diabetes'][0]['covidmortality7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: mortalityColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["covidmortality7dayfig"].name}</b>
                    </text>
                  </Header.Content>

            </Grid.Column>
            <Grid.Column style={{paddingTop:10,paddingBottom: 18}}>
              <Header as='h2' style={{textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
                <Header.Content>
                COVID-19 deaths by percentage of <br/> Hispanic population
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
                      data={[
                             {key: nationalBarChartMortality['hispanic'][0]['label'], 'value': (nationalBarChartMortality['hispanic'][0]['covidmortality7day']/nationalBarChartMortality['hispanic'][0]['covidmortality7day'])*nationalBarChartMortality['hispanic'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['hispanic'][1]['label'], 'value': (nationalBarChartMortality['hispanic'][1]['covidmortality7day']/nationalBarChartMortality['hispanic'][0]['covidmortality7day'])*nationalBarChartMortality['hispanic'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['hispanic'][2]['label'], 'value': (nationalBarChartMortality['hispanic'][2]['covidmortality7day']/nationalBarChartMortality['hispanic'][0]['covidmortality7day'])*nationalBarChartMortality['hispanic'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['hispanic'][3]['label'], 'value': (nationalBarChartMortality['hispanic'][3]['covidmortality7day']/nationalBarChartMortality['hispanic'][0]['covidmortality7day'])*nationalBarChartMortality['hispanic'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['hispanic'][4]['label'], 'value': (nationalBarChartMortality['hispanic'][4]['covidmortality7day']/nationalBarChartMortality['hispanic'][0]['covidmortality7day'])*nationalBarChartMortality['hispanic'][0]['covidmortality7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: mortalityColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["covidmortality7dayfig"].name}</b>
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
                      This figure shows total deaths of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who have diabetes. US counties were grouped into 5 categories based on the proportion of 
                      residents with diabetes. We can see that in counties with the highest proportion of residents with diabetes (highest 20%),
                      the rate is <b>{(nationalBarChartMortality['diabetes'][4]['covidmortality7day']).toFixed(1)}</b> deaths per 100,000. In counties with the lowest proportion of residents with diabetes (lowest 20%),
                      the rate is <b>{(nationalBarChartMortality['diabetes'][0]['covidmortality7day']).toFixed(1)}</b> COVID-19 deaths per 100,000         
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 33}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                      This figure shows total deaths of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who are Hispanic. US counties were grouped into 5 categories based on the proportion of 
                      Hispanic residents. We can see that in counties with the highest proportion of Hispanic residents (highest 20%),
                      the rate is <b>{(nationalBarChartMortality['hispanic'][4]['covidmortality7day']).toFixed(1)}</b> deaths per 100,000. In counties with the lowest proportion of Hispanic residents (lowest 20%), 
                      the rate is <b>{(nationalBarChartMortality['hispanic'][0]['covidmortality7day']).toFixed(1)}</b> COVID-19 deaths per 100,000.          
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid> 
          <Grid style = {{paddingLeft: "7em", paddingRight: "7em"}}>
            <Grid.Row columns={2} style={{paddingTop: '2em'}}>
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
              <Header as='h2' style={{fontWeight: 600,textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
                <Header.Content>
                COVID-19 deaths by Metropolitan Status
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.75}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
                      data={[
                             {key: nationalBarChartMortality['urbanrural'][0]['label'], 'value': (nationalBarChartMortality['urbanrural'][0]['covidmortality7day']/nationalBarChartMortality['urbanrural'][0]['covidmortality7day'])*nationalBarChartMortality['urbanrural'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['urbanrural'][1]['label'], 'value': (nationalBarChartMortality['urbanrural'][1]['covidmortality7day']/nationalBarChartMortality['urbanrural'][0]['covidmortality7day'])*nationalBarChartMortality['urbanrural'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['urbanrural'][2]['label'], 'value': (nationalBarChartMortality['urbanrural'][2]['covidmortality7day']/nationalBarChartMortality['urbanrural'][0]['covidmortality7day'])*nationalBarChartMortality['urbanrural'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['urbanrural'][5]['label'], 'value': (nationalBarChartMortality['urbanrural'][5]['covidmortality7day']/nationalBarChartMortality['urbanrural'][0]['covidmortality7day'])*nationalBarChartMortality['urbanrural'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['urbanrural'][3]['label'], 'value': (nationalBarChartMortality['urbanrural'][3]['covidmortality7day']/nationalBarChartMortality['urbanrural'][0]['covidmortality7day'])*nationalBarChartMortality['urbanrural'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['urbanrural'][4]['label'], 'value': (nationalBarChartMortality['urbanrural'][4]['covidmortality7day']/nationalBarChartMortality['urbanrural'][0]['covidmortality7day'])*nationalBarChartMortality['urbanrural'][0]['covidmortality7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: mortalityColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["covidmortality7dayfig"].name}</b>
                    </text>
                  </Header.Content>

            </Grid.Column>
            <Grid.Column style={{paddingTop:10,paddingBottom:18}}>
              <Header as='h2' style={{fontWeight: 600,textAlign:'center',fontSize:"18pt", lineHeight: "18pt"}}>
                <Header.Content>
                COVID-19 deaths by Region
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
                    <VictoryAxis style={{ticks:{stroke: "#000000"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, labels: {fill: '#000000', fontSize: "20px"}, tickLabels: {fontSize: "20px", fill: '#000000', fontFamily: 'lato'}}} />
                    <VictoryAxis dependentAxis style={{ticks:{stroke: "#FFFFFF"}, axis: {stroke: "#000000"}, grid: {stroke: "transparent"}, tickLabels: {fontSize: "20px", fill: '#000000', padding: 10,  fontFamily: 'lato'}}}/>
                    <VictoryBar
                      horizontal
                      barRatio={0.7}
                      labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(1))}
                      data={[
                             {key: nationalBarChartMortality['region'][0]['label'], 'value': (nationalBarChartMortality['region'][0]['covidmortality7day']/nationalBarChartMortality['region'][0]['covidmortality7day'])*nationalBarChartMortality['region'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['region'][1]['label'], 'value': (nationalBarChartMortality['region'][1]['covidmortality7day']/nationalBarChartMortality['region'][0]['covidmortality7day'])*nationalBarChartMortality['region'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['region'][2]['label'], 'value': (nationalBarChartMortality['region'][2]['covidmortality7day']/nationalBarChartMortality['region'][0]['covidmortality7day'])*nationalBarChartMortality['region'][0]['covidmortality7day'] || 0},
                             {key: nationalBarChartMortality['region'][3]['label'], 'value': (nationalBarChartMortality['region'][3]['covidmortality7day']/nationalBarChartMortality['region'][0]['covidmortality7day'])*nationalBarChartMortality['region'][0]['covidmortality7day'] || 0}



                      ]}
                      labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }}/>}
                      style={{
                        data: {
                          fill: mortalityColor[1]
                        }
                      }}
                      x="key"
                      y="value"
                    />
                  </VictoryChart>

                  <Header.Content>
                    <text style={{fontWeight: 300, marginLeft: 100, paddingBottom:50, fontSize: "14pt", lineHeight: "18pt"}}>
                      <b>{varMap["covidmortality7dayfig"].name}</b>
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
                      This figure shows total deaths of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by proportion of county residents who live in different types of metropolitan areas. US counties were grouped
                       into 6 categories based on metropolitan status. We can see that in small metro areas, 
                       the rate is <b>{(nationalBarChartMortality['urbanrural'][4]['covidmortality7day']).toFixed(1)}</b> deaths per 100,000. In large central metros, 
                       the rate is <b>{(nationalBarChartMortality['urbanrural'][0]['covidmortality7day']).toFixed(1)}</b> COVID-19 deaths per 100,000.         
                     </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' style={{fontWeight: 400, width: 450, paddingLeft: 33}}>
                  <Header.Content>
                    <Header.Subheader style={{color: '#000000', width: 450, fontSize: "14pt", textAlign:'justify', lineHeight: "16pt"}}>
                      This figure shows total deaths of COVID-19 per 100,000 residents as of {monthNames[new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getMonth()] + " " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getDate() + ", " + new Date(dataTS['_nation'][dataTS['_nation'].length - 1].t*1000).getFullYear()}. 
                      Case rates are shown by region of the US. US counties were grouped into 4 categories based on region. We can see that in the South, 
                      the rate is <b>{(nationalBarChartMortality['region'][2]['covidmortality7day']).toFixed(1)}</b> deaths per 100,000. In the Northeast, 
                      the rate is <b>{(nationalBarChartMortality['region'][1]['covidmortality7day']).toFixed(1)}</b> COVID-19 deaths per 100,000.          
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


