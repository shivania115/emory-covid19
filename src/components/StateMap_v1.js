import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Dropdown, Header, Loader, Divider } from 'semantic-ui-react'
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import {
  VictoryChart,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryContainer,
  VictoryGroup,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  VictoryLegend,
  VictoryLine,
  VictoryLabel,
  VictoryScatter,
  VictoryPie,
} from 'victory';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";
import { quantile, ascending } from 'd3';
import fips2county from './fips2county.json'
import configscounty from "./county_config.json";

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
const colorHighlight = '#f2a900';


export default function StateMap(props) {

  // let { stateFips } = useParams();
  const hig= '80';
  const stateFips = '13';
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState('');

  const [countyFips, setCountyFips] = useState('121');
  const [countyName, setCountyName] = useState('Fulton County');
  const history = useHistory();
  const [fips, setFips] = useState('13');

  // const [dataFltrd, setDataFltrd] = useState();
  // const [dataFltrdUs, setDataFltrdUs] = useState();

  // const [dataStateFltrd, setDataStateFltrd] = useState();
  // const [dataState, setDataState] = useState();

  const [data, setData] = useState();
  const [dataUs, setDataUs] = useState();

  const [dateCur, setDateCur] = useState();
  // const [stateLabels, setStateLabels] = useState();
  const [covidMetric, setCovidMetric] = useState({ casesdaily: 'N/A', casesdailymean14: 'N/A', t: 'n/a' });
  const [covidMetric14, setCovidMetric14] = useState({ casesdaily: 'N/A', casesdailymean14: 'N/A', t: 'n/a' });

  const [dataTS, setDataTS] = useState();
  const [tooltipContent, setTooltipContent] = useState('');
  const [colorScale, setColorScale] = useState();

  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendMax_graph, setLegendMaxGraph] = useState({});
  const [legendSplit, setLegendSplit] = useState([]);

  const [metric, setMetric] = useState('casescumR');
  const [metric_graph, setMetricGraph] = useState(['casesdaily', 'casesdailymean14']);

  const metricOptions1 = [{ key: 'cacum', value: 'casescum', text: 'Total COVID-19 cases' },
  { key: 'decum', value: 'deathscum', text: 'Total COVID-19 deaths' },
  { key: 'cacumr', value: 'casescumR', text: 'COVID-19 cases per 100,000 population' },
  { key: 'decumr', value: 'deathscumR', text: 'COVID-19 deaths per 100,000 population' }];

  const metricOptions2 = [{ key: 'cs', value: 'cs', text: 'Confirmed cases per 100,000 population' },
  { key: 'hp', value: 'hp', text: 'Hospitalizations per 100,000 population' },
  { key: 'ds', value: 'ds', text: 'Deaths per 100,000 population' }];
  const dropdownopt = {
    'casescum': 'Total COVID-19 cases', 'deathscum': 'Total COVID-19 deaths',
    'casescumR': 'COVID-19 cases per 100,000 population', 'deathscumR': 'COVID-19 deaths per 100,000 population'
  };

  const varGraphPair = {
    "casescum": { "name": ['casesdaily', 'casesdailymean7'], "legend": ['Daily new cases', '7-d rolling average '] },
    "deathscum": { "name": ['deathsdaily', 'deathsdailymean7'], "legend": ['Daily new deaths', '7-d rolling average '] },
    "casescumR": { "name": ['casesdailyR', 'casesdailymean7R'], "legend": ['Daily new cases per 100,000', '7-d rolling average'] },
    "deathscumR": { "name": ['deathsdailyR', 'deathsdailymean7R'], "legend": ['Daily new deaths per 100,000', '7-d rolling average'] }
  };
  const [metricName, setMetricName] = useState('COVID-19 cases per 100,000 population');
  const varNameMap = {
    "casescum": { "name": 'cases', "text": "The map shows the total number of confirmed COVID-19 cases in each county as of " },
    "deathscum": { "name": 'deaths', "text": "The map shows the total number of confirmed COVID-19 deaths in each county as of " },
    "casescumR": { "name": 'cases per 100,000 residents', "text": "The map shows the total number of confirmed COVID-19 cases per 100,000 residents in each county as of " },
    "deathscumR": { "name": 'deaths per 100,000 residents', "text": "The map shows the total number of confirmed COVID-19 deaths per 100,000 residents in each county as of " }
  };
  const varMap = { "cacum": metricOptions2[0], "decum": metricOptions2[1], "cacumr": metricOptions2[2], "decumr": metricOptions1[1] };
  const [delayHandler, setDelayHandler] = useState(null)



  useEffect(() => {

    const configMatched = configs.find(s => s.fips === stateFips);
    // console.log(configMatched.fips);
    if (!configMatched) {
      history.push('/');
    } else {

      setConfig(configMatched);
      // console.log(countyFips);
      setStateName(configMatched.name);

      fetch('/data/data.json').then(res => res.json())
        .then(x => {
          setDataUs(x);

          const csUs = scaleQuantile()
            .domain(_.map(_.filter(_.map(x, (d, k) => {
              d.fips = k
              return d
            }),
              d => (
                d[metric] >= 0 &&
                d.fips.length === 5)),
              d => d[metric]))
            .range(colorPalette);

          let scaleMap = {}
          _.each(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d
          }),
            d => (
              d[metric] >= 0 &&
              d.fips.length === 5))
            , d => {
              scaleMap[d[metric]] = csUs(d[metric])
            });
          console.log(scaleMap);

          setColorScale(scaleMap);

          var max = 0
          var min = 100
          var length = 0
          _.each(x, d => {
            length = length + 1
            if (d[metric] > max && d.fips.length === 5 && d.fips[0] === '1' && d.fips[1] === '3') {
              max = d[metric];
              // console.log(max)
            } else if (d.fips.length === 5 && d[metric] < min && d[metric] >= 0 && d.fips[0] === '1' && d.fips[1] === '3') {
              min = d[metric]
              // console.log(d.fips)
            }


          });
          if (max > 999) {
            max = (max / 1000).toFixed(0) + "K";
            // console.log(max);
            setLegendMax(max);
          } else {
            setLegendMax(max.toFixed(0));

          }
          setLegendMin(min.toFixed(0));

          var split = scaleQuantile()
            .domain(_.map(_.filter(_.map(x, (d, k) => {
              d.fips = k
              return d
            }),
              d => (
                d[metric] >= 0 &&
                d.fips.length === 5)),
              d => d[metric]))
            .range(colorPalette);

          setLegendSplit(split.quantiles());
          // console.log(split.quantiles());

        });

      fetch('/data/data.json').then(res => res.json())
        .then(x => {
          setData(x);
          const cs = scaleQuantile()
            .domain(_.map(x, d => d[metric]))
            .range(colorPalette);

          let scaleMap = {}
          _.each(x, d => {
            scaleMap[d[metric]] = cs(d[metric])
          });
          console.log(scaleMap);
          setColorScale(scaleMap);
        });

      // fetch('/data/timeseries13' + '.json').then(res => res.json())
      //   .then(x => setDataTS(x));
      fetch('/data/timeseries13' + '.json').then(res => res.json())
        .then(
          x => {
            setDataTS(x);
            // var max = 0
            var dicto = {}
            for (var key in x) {
              var max = 0
              _.each(x[key], m => {
                if (m[varGraphPair[metric]['name'][0]] > max) {
                  max = m[varGraphPair[metric]['name'][0]];
                }
              });
              dicto[key] = max;
              // console.log(varNameMap['cacum'].text);
            }
            // console.log(dicto);
            setLegendMaxGraph(dicto);
          });

      fetch('/data/date.json').then(res => res.json())
        .then(x => {
          setDateCur(x)
          console.log(x)
        });
    }
  }, [stateFips, metric]);



  useEffect(() => {
    if (dataTS && dataTS[stateFips + countyFips]) {
      setCovidMetric(_.takeRight(dataTS[stateFips + countyFips])[0]);
      setCovidMetric14(_.takeRight(dataTS[stateFips + countyFips], 14)[0]);
      // console.log(new Date(_.takeRight(dataTS['13265'], 14)[0].t * 1000).toLocaleDateString())
    }
  }, [dataTS, countyFips])

  if (dataTS && dataUs) {

    return (
      <div>
        <AppBar menu='countyReport' />
        <Container style={{ marginTop: '6em', minWidth: '1260px' }}>
          {config &&
            <div>
              <Breadcrumb>
                {/* <Breadcrumb.Section link onClick={() => history.push('/')}></Breadcrumb.Section>
            <Breadcrumb.Divider /> */}
                <Breadcrumb.Section active>{stateName}</Breadcrumb.Section>
                {/* <Breadcrumb.Divider /> */}
              </Breadcrumb>
              <Divider hidden />
              <Grid columns={16}>
                <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                  <Header as='h2' style={{ fontWeight: 600 }}>
                    <Header.Content>
                      <Dropdown
                        icon=''
                        style={{
                          background: '#fff',
                          fontWeight: 600,
                          theme: '#000000',
                          width: '500px',
                          top: '0em',
                          left: '0em',
                          text: "Select",
                          borderTop: 'none',
                          borderLeft: '1px solid #FFFFFF',
                          borderRight: 'none',
                          borderBottom: '0.5px solid #bdbfc1',
                          borderRadius: 0,
                          minHeight: '1.0em',
                          paddingBottom: '0.1em'
                        }}
                        text={metricName}
                        inline
                        search
                        pointing='top'
                        options={metricOptions1}
                        onChange={(e, { value }) => {
                          setMetric(value);
                          // console.log(varNameMap);
                          // console.log(varMap['cs'].text);
                          setMetricName(dropdownopt[value]);
                        }}
                      />
                      {/* <Header.Subheader style={{ fontWeight: 300 }}>
                        Health determinants impact COVID-19 outcomes.
                    </Header.Subheader> */}
                      {/* <Header.Subheader style={{ fontWeight: 300 }}>Click on a state below to drill down to your county data.</Header.Subheader> */}
                    </Header.Content>
                  </Header>
                  <svg width="500" height="55">
                    {_.map(colorPalette, (color, i) => {
                      return <rect key={i} x={25 * i} y={20} width="25" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                    })}
                    <text x={0} y={52} style={{ fontSize: '0.8em' }}>Low</text>
                    <text x={25 * (colorPalette.length - 1)} y={52} style={{ fontSize: '0.8em' }}>High</text>
                    {_.map(legendSplit, (splitpoint, i) => {
                      if (legendSplit[i] < 1) {
                        return <text key={i} x={7 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {legendSplit[i].toFixed(1)}</text>
                      }
                      if (legendSplit[i] > 1000) {
                        return <text key={i} x={20 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(legendSplit[i] / 1000).toFixed(1) + "K"}</text>
                      }
                      return <text key={i} x={20 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {legendSplit[i].toFixed(0)}</text>
                    })}
                    <text x={0} y={15} style={{ fontSize: '0.7em' }}> {legendMin} </text>
                    <text x={150} y={15} style={{ fontSize: '0.7em' }}>{legendMax}</text>

                    {/* <text x={250} y={42} style={{fontSize: '0.8em'}}> Click on a county below </text>
                  <text x={250} y={52} style={{fontSize: '0.8em'}}> for a detailed report. </text> */}
                  </svg>
                  <ComposableMap projection="geoAlbersUsa"
                    projectionConfig={{ scale: `${config.scale}` }}
                    width={500}
                    height={580}
                    data-tip=""
                    offsetX={config.offsetX}
                    offsetY={config.offsetY}>
                    <Geographies geography={config.url}>
                      {({ geographies }) => geographies.map(geo =>
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => {
                            history.push("/" + stateFips + "/" + geo.properties.COUNTYFP);
                            // console.log(geo.properties.COUNTYFP);
                          }}
                          style={{
                            default: {
                              //  fill: "#ECEFF1",
                              stroke: "#607D8B",
                              strokeWidth: 0.95,
                              outline: "none",
                            },
                            // hover: {
                            //    fill: "#CFD8DC",
                            //    stroke: "#607D8B",
                            //    strokeWidth: 1,
                            //    outline: "none",
                            // },
                            pressed: {

                              outline: "none",
                            }
                          }}
                          onMouseEnter={() => {
                            setDelayHandler(setTimeout(() => {
                              setCountyFips(geo.properties.COUNTYFP);
                              setCountyName(fips2county[stateFips + geo.properties.COUNTYFP]);
                              // setTooltipContent('Click to see more county data');
                            }, 500))
                          }}
                          onMouseLeave={() => {
                            clearTimeout(delayHandler)
                            setTooltipContent("")
                          }}
                          fill={countyFips === geo.properties.COUNTYFP ? countyColor :
                            ((colorScale && dataUs[stateFips + geo.properties.COUNTYFP] && dataUs[stateFips + geo.properties.COUNTYFP][metric]) ?
                              colorScale[dataUs[stateFips + geo.properties.COUNTYFP][metric]] : colorPalette[0])}
                        />
                      )}
                    </Geographies>
                  </ComposableMap>
                  <Grid.Row style={{ paddingTop: 0, paddingLeft: '0em', paddingRight: '2em' }} centered>
                    <small style={{ fontWeight: 300, fontSize: 18, color: 'grey' }} align="justify">
                      {varNameMap[metric].text}{dateCur.date === 'n/a' ? 'N/A' : (new Date(dateCur.date * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))} . The darker shading indicates a larger number of {varNameMap[metric].name}.
                    </small>
                  </Grid.Row>

                </Grid.Column>
                <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                  <Header as='h2' style={{ fontWeight: 400, paddingLeft: "2.5" }}>
                    <Header.Content>
                      {/* {varGraphPair[metric]['legend'][0]} for <span style={{ color: countyColor }}>{countyName}</span> */}
                      {varGraphPair[metric]['legend'][0]} for <b>{countyName}</b>
                      <Header.Subheader style={{ fontWeight: 300 }}>
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                  <Grid>
                    <Grid.Column>
                      <Grid.Row style={{ paddingLeft: "1.5", paddingTop: "1", paddingBottom: 0 }} centered>
                  
                        <svg width="630" height='80'>
                        
                          <rect x={50} y={12} width="15" height="1" style={{ fill: countyColor, strokeWidth: 1, stroke: countyColor }} />
                          <text x={75} y={20} style={{ fontSize: 16 }}>7-day rolling average in {countyName}</text>

                          {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                            <rect x={50} y={40} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} /> :
                            <rect x={50} y={35} width="6" height="1" style={{ fill: 'red', strokeWidth: 1, stroke: 'red' }} />}
                          {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                            <text x={75} y={52} style={{ fontSize: 16 }}> {varGraphPair[metric]['legend'][0]} </text> :
                            <rect x={60} y={35} width="6" height="1" style={{ fill: 'red', strokeWidth: 1, stroke: 'red' }} />}
                          {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                            <text x={250} y={12} style={{ fontSize: 0 }}></text> :
                            <text x={75} y={43} style={{ fontSize: 16 }}>7-day rolling average in Georgia</text>}
                          {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                            <rect x={0} y={0} width="0" height="0" style={{ fill: 'white', strokeWidth: 0, stroke: 'white' }} /> :
                            <rect x={50} y={55} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} />}
                          {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                          <rect x={0} y={0} width="0" height="0" style={{ fill: 'white', strokeWidth: 0, stroke: 'white' }} />:
                          <text x={75} y={68} style={{ fontSize: 16 }}> {varGraphPair[metric]['legend'][0]} </text>}

                        </svg>
                        <VictoryChart theme={VictoryTheme.material}
                          containerComponent={
                            <VictoryVoronoiContainer
                              voronoiBlacklist={["Line1", "Line14"]}
                              labels={({ datum }) => `${new Date(datum.t * 1000).toLocaleDateString()}\n` + `${varGraphPair[metric]['legend'][0]}: ${Math.round(datum[varGraphPair[metric]['name'][0]], 2)}\n` + `${varGraphPair[metric]['legend'][1]}:${Math.round(datum[varGraphPair[metric]['name'][1]], 2)}`}
                              labelComponent={
                                <VictoryTooltip dy={-7} constrainToVisibleArea
                                  style={{ fontSize: 15 }} />
                              }
                            />
                          }
                          width={730}
                          height={550}
                          padding={{ left: 55, right: 70, top: 10, bottom: 50 }}>
                          {/* <VictoryLabel style={{
                            textAnchor: "start",
                            verticalAnchor: "end", fill: ["#000000",countyColor], fontFamily: "inherit",
                            fontSize: "30px", fontWeight: "bold"
                          }} text={varGraphPair[metric]['legend'][0]+" for "+ countyName} x={3} y={25} textAnchor="middle" /> */}
                          {/* <VictoryLegend
                            x={30} y={20}
                            style ={{labels:{fontSize:21.5}, symbol:{size:2}}}
                            orientation="horizontal"
                            colorScale={[stateColor, countyColor]}
                            data={[
                              { name: varGraphPair[metric]['legend'][0],symbol: {type: "square" } }, { name: varGraphPair[metric]['legend'][1],symbol: {scale:0.8,type: "minus" } }
                            ]}
                          /> */}

                          <VictoryAxis
                            style={{
                              tickLabels: { fontSize: 25, padding: 5 }
                            }}
                            tickFormat={(t) => new Date(t * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric' })}
                            tickValues={[
                              1583035200, 1585713600, 1588305600, 1590984000, 1593576000
                            ]}
                          // tickValues={[
                          //   dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) * 3 - 1].t,
                          //   dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) * 2 - 1].t,
                          //   dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) - 1].t,
                          //   dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - 1].t]} 


                          />
                          <VictoryAxis dependentAxis tickCount={5}
                            style={{
                              tickLabels: { fontSize: 25, padding: 5 }
                            }}
                            tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                          />
                          <VictoryBar style={{ data: { fill: stateColor } }} barWidth={4} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                            x='t' y={varGraphPair[metric]['name'][0]}
                          />
                          <VictoryLine name="Line1" style={{ data: { stroke: countyColor } }} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                            x='t' y={varGraphPair[metric]['name'][1]}
                          />
                          {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                            <VictoryAxis dependentAxis tickCount={5}
                              style={{
                                tickLabels: { fontSize: 25, padding: 5 }
                              }}
                              tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                            /> :
                            <VictoryLine name="Line11" style={{ data: { stroke: 'red', strokeDasharray: "5,5" } }} data={dataTS[stateFips] ? dataTS[stateFips] : dataTS["99999"]}
                              x='t' y={varGraphPair[metric]['name'][1]} />}
                          {/* <VictoryLine name="Line14" style={{ data: { stroke: 'red', strokeDasharray: "5,5" } }} data={[{ x: covidMetric14.t, y: 0 }, { x: covidMetric14.t, y: legendMax_graph[stateFips + countyFips] }]}
                          /> */}
                          {/* <VictoryLine name="Line14"
                            style={{ data: { stroke: 'red', strokeDasharray: "5,5" } }}
                            x={() => covidMetric14.t}
                          /> */}
                        </VictoryChart>
                      </Grid.Row>
                      <Grid.Row style={{ paddingTop: '2em', paddingLeft: '2.9em', paddingRight: '2.5em' }} centered>
                        <small style={{ fontWeight: 300, fontSize: 18, color: 'grey' }} align="justify">
                          As of {covidMetric.t === 'n/a' ? 'N/A' : (new Date(covidMetric.t * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}, this chart shows the daily number of new {varNameMap[metric].name} of confirmed COVID-19 in <b>{countyName}</b>. The daily number reflects the date the case was first reported to DPH.
                        The vertical bars show the number of new daily {varNameMap[metric].name} while the line shows the 7-day moving average of new daily {varNameMap[metric].name}.
                        </small>
                      </Grid.Row>
                    </Grid.Column>
                  </Grid>
                </Grid.Column>

              </Grid>
            </div>
          }
          <Notes />
        </Container>
        {/* <ReactTooltip>{tooltipContent}</ReactTooltip> */}
        <ReactTooltip > <font size="+2"><b >{countyName}</b> </font> <br />
          <b>Total Cases</b>: {data[stateFips + countyFips]['casescum'].toFixed(0)} <br />
          <b>Total Deaths</b>: {data[stateFips + countyFips]['deathscum'].toFixed(0)} <br />
          <b>Total case per 100k</b>: {data[stateFips + countyFips]['casescumR'].toFixed(0)} <br />
          <b>Total Deaths per 100k</b>: {data[stateFips + countyFips]['deathscumR'].toFixed(0)} <br />
          <b>Click to see county-level data.</b> </ReactTooltip>
      </div>
    );
  } else {
    return <Loader active inline='centered' />
  }




}