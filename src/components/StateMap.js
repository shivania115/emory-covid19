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
  const [dataRD, setDataRD] = useState();
  const [tooltipContent, setTooltipContent] = useState('');
  const [colorScale, setColorScale] = useState();

  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  const [caseRate, setCaseRate] = useState();
  const [percentChangeCases, setPercentChangeCases] = useState();

  const [mortality, setMortality] = useState();
  const [percentChangeMortality, setPercentChangeMortality] = useState();

  const [dataHospTestTS, setDataHospTestTS] = useState();
  const [hospRate, setHospRate] = useState();
  const [pctChangeHospRate, setPctChangeHospRate] = useState();
  const [testingRate, setTestingRate] = useState();
  const [pctChangeTestingRate, setPctChangeTestingRate] = useState();


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
          let caseRate = 0.1;
          let mortality = 0;
          let t = 0;
          let percentChangeCase = 0;
          let percentChangeMortality = 0;

          let hospRate = 0.1;
          let testingRate = 0.1;
          let percentChangeHospitalizationRate = 0;
          let percentChangeTestingRate = 0;
          _.each(x, (v, k)=>{
            if (k.length===5 && v.length > 0 && v[v.length-1].mortalityMA > mortalityMA){
              countyMost = k.substring(2, 5);
              mortalityMA = v[v.length-1].mortalityMA;
            }
            if (k.length===2 && v.length > 0 && v[v.length-1].t > t){
              percentChangeCase = (v[v.length-1].caseRateMA - v[v.length-2].caseRateMA)/v[v.length-2].caseRateMA;
              caseRate = v[v.length-1].caseRate;

              percentChangeMortality = (v[v.length-1].mortalityMA - v[v.length-2].mortalityMA)/v[v.length-2].mortalityMA;
              mortality = v[v.length-1].mortality;

              percentChangeHospitalizationRate = (v[v.length-1].hospitalizationRate - v[v.length-2].hospitalizationRate)/v[v.length-2].hospitalizationRate;
              hospRate = v[v.length-1].hospitalizationRate;

              percentChangeTestingRate = (v[v.length-1].testingRate - v[v.length-2].testingRate)/v[v.length-2].testingRate;
              testingRate = v[v.length-1].testingRate;
            }
          });


          if ((percentChangeCase*100).toFixed(0) > 0) {
            setPercentChangeCases("+" + (percentChangeCase*100).toFixed(0) + "%");
          }else if((percentChangeCase*100).toFixed(0) < 0){
            setPercentChangeCases((percentChangeCase*100).toFixed(0) + "%");
          }else if(isNaN((percentChangeCase*100).toFixed(0))){
            setPercentChangeCases("None Reported");
          }else{
            setPercentChangeCases("" + (percentChangeCase*100).toFixed(0) + "%");
          }

          if ((percentChangeMortality*100).toFixed(0) > 0) {
            setPercentChangeMortality("+" + (percentChangeMortality*100).toFixed(0) + "%");
          }else if ((percentChangeMortality*100).toFixed(0) < 0) {
            setPercentChangeMortality((percentChangeMortality*100).toFixed(0) + "%");
          }else if(isNaN((percentChangeMortality*100).toFixed(0))){
            setPercentChangeMortality("None Reported");
          }else{
            setPercentChangeMortality("" + (percentChangeMortality*100).toFixed(0) + "%");

          }

          if ((percentChangeHospitalizationRate*100).toFixed(0) > 0) {
            setPctChangeHospRate("+" + (percentChangeHospitalizationRate*100).toFixed(0) + "%");
          }else if((percentChangeHospitalizationRate*100).toFixed(0) < 0){
            setPctChangeHospRate((percentChangeHospitalizationRate*100).toFixed(0) + "%");
          }else if(isNaN((percentChangeHospitalizationRate*100).toFixed(0))){
            setPctChangeHospRate("None Reported");
          }else{
            setPctChangeHospRate("" + (percentChangeHospitalizationRate*100).toFixed(0) + "%");
          }

          if ((percentChangeTestingRate*100).toFixed(0) > 0) {
            setPctChangeTestingRate("+" + (percentChangeTestingRate*100).toFixed(0) + "%");
          }else if ((percentChangeTestingRate*100).toFixed(0) < 0) {
            setPctChangeTestingRate((percentChangeTestingRate*100).toFixed(0) + "%");
          }else if(isNaN((percentChangeTestingRate*100).toFixed(0))){
            setPctChangeTestingRate("None Reported");
          }else{
            setPctChangeTestingRate("" + (percentChangeTestingRate*100).toFixed(0) + "%");

          }

          setHospRate(hospRate.toFixed(0));
          setTestingRate(testingRate.toFixed(0));

          setCountyFips(countyMost);
          setCountyName(fips2county[stateFips+countyMost]);
          setCaseRate(caseRate.toFixed(0));
          setMortality(mortality.toFixed(0));

          setDataTS(x);
        });

  fetch('/data/staticracedata'+stateFips+'.json').then(res => res.json())
        .then(x => {
          setDataRD(x);
        });


    }
  }, [stateFips]);


  if (data && dataTS && dataRD) {
    console.log(dataRD.stateFips);
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
                        minDomain={{ x: dataTS["_nation"][dataTS["_nation"].length-15].t }}
                        width={252}
                        height={180}       
                        padding={{left: 10, right: 10, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        
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
                            x='t' y='caseRateMA'
                            />

                        </VictoryGroup>
                        <VictoryArea
                          style={{ data: {  fill: percentChangeCases.includes("+")? "#C0C0C0": percentChangeCases.includes("-")? "#C0C0C0" : "#C0C0C0" , fillOpacity: 0.1} }}
                          data={stateFips != "_nation"? dataTS[stateFips] : dataTS["_"]}
                          x= 't' y = 'caseRateMA'

                        />

                        <VictoryLabel text="Daily Cases" x={130} y={80} textAnchor="middle" style={{fontSize: 24}}/>
                        <VictoryLabel text= {caseRate} x={130} y={110} textAnchor="middle" style={{fontSize: 21}}/>
                        <VictoryLabel text= {percentChangeCases}  x={130} y={130} textAnchor="middle" style={{fontSize: 18}}/>

                        
            </VictoryChart>
            

            <VictoryChart theme={VictoryTheme.material}
                        minDomain={{ x: dataTS["_nation"][dataTS["_nation"].length-15].t }}
                        width={252}
                        height={180}       
                        padding={{left: 10, right: 10, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        
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
                            x='t' y='mortalityMA'
                            />

                        </VictoryGroup>

                        <VictoryArea
                          style={{ data: { fill: percentChangeMortality.includes("+")? "#C0C0C0": (percentChangeMortality.includes("-")? "#C0C0C0" : "##C0C0C0"), fillOpacity: 0.1} }}
                          data={stateFips != "_nation"? dataTS[stateFips] : dataTS["_"]}
                          x= 't' y = 'mortalityMA'

                        />
                        <VictoryLabel text="Daily Deaths" x={130} y={80} textAnchor="middle" style={{fontSize: 24}}/>
                        <VictoryLabel text= {mortality} x={130} y={110} textAnchor="middle" style={{fontSize: 21}}/>
                        <VictoryLabel text= {percentChangeMortality} x={130} y={130} textAnchor="middle" style={{fontSize: 18}}/>

            </VictoryChart>

            <VictoryChart theme={VictoryTheme.material}
                        minDomain={{ x: dataTS["_nation"][dataTS["_nation"].length-15].t }}
                        width={252}
                        height={180}       
                        padding={{left: 10, right: 10, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        
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
                            x='t' y='hospitalizationRate'
                            />

                        </VictoryGroup>

                        <VictoryArea
                          style={{ data: { fill: pctChangeHospRate.includes("+")? "#C0C0C0": (pctChangeHospRate.includes("-")? "#C0C0C0" : "##C0C0C0"), fillOpacity: 0.1} }}
                          data={stateFips != "_nation"? dataTS[stateFips] : dataTS["_"]}
                          x= 't' y = 'hospitalizationRate'

                        />
                        <VictoryLabel text="Hospitalization Rate" x={130} y={80} textAnchor="middle" style={{fontSize: 24}}/>
                        <VictoryLabel text= {hospRate} x={130} y={110} textAnchor="middle" style={{fontSize: 21}}/>
                        <VictoryLabel text= {pctChangeHospRate} x={130} y={130} textAnchor="middle" style={{fontSize: 18}}/>

            </VictoryChart>

            <VictoryChart theme={VictoryTheme.material}
                        minDomain={{ x: dataTS["_nation"][dataTS["_nation"].length-15].t }}
                        width={252}
                        height={180}       
                        padding={{left: 10, right: 20, top: 60, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}>
                        
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
                            x='t' y='testingRate'
                            />

                        </VictoryGroup>

                        <VictoryArea
                          style={{ data: { fill: pctChangeTestingRate.includes("+")? "#C0C0C0": (pctChangeTestingRate.includes("-")? "#C0C0C0" : "##C0C0C0"), fillOpacity: 0.1} }}
                          data={stateFips != "_nation"? dataTS[stateFips] : dataTS["_"]}
                          x= 't' y = 'testingRate'

                        />
                        <VictoryLabel text="Testing Rate" x={130} y={80} textAnchor="middle" style={{fontSize: 24}}/>
                        <VictoryLabel text= {testingRate} x={130} y={110} textAnchor="middle" style={{fontSize: 21}}/>
                        <VictoryLabel text= {pctChangeTestingRate} x={130} y={130} textAnchor="middle" style={{fontSize: 18}}/>

            </VictoryChart>

            <VictoryChart
                        theme={VictoryTheme.material} 
                        width={252}
                        height={180}        
                        domainPadding={10}
                        scale={{ y: 'scale'}}
                        padding={{left: -1, right: 100, top: 80, bottom: -0.9}}
                        containerComponent={<VictoryContainer responsive={false}/>}
                      >
                        <VictoryLabel text="Cases per 10K persons by race" x={115} y={50} textAnchor="middle" style={{fontSize: 18}}/>
                        <VictoryAxis style={{tickLabels: {fontSize: 10}}} />
                        <VictoryAxis dependentAxis style={{tickLabels: {fontSize: 8, padding: 10}}}/>
                        <VictoryBar
                          horizontal
                          barRatio={0.8}
                          labels={({ datum }) => `${datum.key}:  ${(Math.round(datum.value*100)/100)}`}
                          data={[
                            {key: "White", 'value': dataRD[stateFips][2]['White'][0]['cases'] || 0},
                            {key: "Black", 'value': dataRD[stateFips][1]['Black'][0]['cases'] || 0},
                            {key: "Total", 'value': dataRD[stateFips][0]['Total'][0]['cases'] || 0}
                                  
                                    ]}
                          labelComponent={<VictoryLabel dx={10} style={{fontSize: 20, fill: ({datum}) => '#000000' }}/>}
                          style={{
                            data: {
                              fill: ({ datum }) => '#b2b3b3'
                            }
                          }}
                          x="key"
                          y="value"
                        />
            </VictoryChart>

            </Grid.Row>
          </Grid>

          <Grid.Row style={{paddingBottom: 10}}>
            <small style={{fontWeight: 300}}>
            <em>Daily Cases</em>  <br/>
            <em>Daily Deaths</em>  <br/>
            For a complete table of variable defintion, click <a href="https://covid19.emory.edu/data-sources" target="_blank"> here. </a>
            </small>
          </Grid.Row>


          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={5}>
                
                <svg width="400" height="90">
                  <text x={0} y={20} style={{fontSize: '1.0em'}}>COVID-19 Deaths per 100,000 </text>
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

                  <text x={250} y={49} style={{fontSize: '0.8em'}}> Click on a county below </text>
                  <text x={250} y={59} style={{fontSize: '0.8em'}}> for a detailed report. </text>


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
                      <VictoryChart theme={VictoryTheme.material} minDomain={{ y: 0 }}
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
                        title="% Hispanic or Latino" 
                        var="hispanic"  
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
                        title="% Diabetes" 
                        var="diabetes" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} /> 
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 10, width: 400}}>                    
                      <BarChart 
                        title="% in Poverty" 
                        var="poverty"  
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} />
                      <BarChart 
                        title="% Uninsured" 
                        var="PCTUI" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} />
                  </Grid.Row>
                  <Grid.Row columns={2} style={{padding: 10, width: 400}}>                    
                      <BarChart 
                        title="% Over 65 y/o" 
                        var="age65over" 
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data} />
                      <BarChart 
                        title="% in Group Quarters" 
                        var="groupquater" 
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