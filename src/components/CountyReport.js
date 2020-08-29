import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, Loader, List, Table, Divider, Popup } from 'semantic-ui-react'
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
  VictoryPie
} from 'victory';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import fips2county from './fips2county.json'
import configs from "./state_config.json";
import configscounty from "./county_config.json";
import _ from 'lodash';
import * as d3 from 'd3-geo'
import Chart from "react-google-charts";
import { scaleQuantile, scaleQuantize } from "d3-scale";

const countyColor = '#f2a900';
const stateColor = '#bdbfc1';
const nationColor = '#d9d9d7';
const colorPalette = [
  "#e1dce2",
  "#d3b6cd",
  "#bf88b5",
  "#af5194",
  "#99528c",
  "#633c70",
];


function ScatterChart(props) {

  return (
    <VictoryChart
      width={400}
      height={300}
      scale={{ x: props.xlog ? 'log' : 'linear', y: props.ylog ? 'log' : 'linear' }}
      minDomain={{ y: props.ylog ? 1 : 0 }}
      padding={{ left: 80, right: 10, top: 50, bottom: 50 }}>
      {props.showLegend && <VictoryLegend
        x={10} y={10}
        orientation="horizontal"
        colorScale={[stateColor, countyColor]}
        data={[
          { name: ('Other counties in ' + props.stateName) }, { name: props.countyName }
        ]}
      />}
      <VictoryScatter
        data={_.filter(_.map(props.data, (d, k) => { d.fips = k; return d; }), (d) => (
          d.fips.length === 5 &&
          d.fips.substring(0, 2) === props.stateFips &&
          d[props.x] && d[props.y]))}
        sortKey={(d) => d.fips === (props.stateFips + props.countyFips)}
        style={{
          data: {
            fill: ({ datum }) => datum.fips === (props.stateFips + props.countyFips) ? countyColor : stateColor,
            fillOpacity: ({ datum }) => datum.fips === (props.stateFips + props.countyFips) ? 1.0 : 0.7
          }
        }}
        size={4}
        x={props.x}
        y={props.y}
      />
      <VictoryAxis label={props.varMap[props.x] ? props.varMap[props.x].name : props.x}
        tickCount={4}
        tickFormat={(y) => (props.rescaleX ? (Math.round(y / 1000) + 'k') : (Math.round(y * 100) / 100))} />
      <VictoryAxis dependentAxis label={props.varMap[props.y] ? props.varMap[props.y].name : props.y}
        style={{ axisLabel: { padding: 40 } }}
        tickCount={5}
        tickFormat={(y) => (Math.round(y * 100) / 100)} />
    </VictoryChart>);

}

function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
    x = x.replace(pattern, "$1,$2");
  return x;
}

function BarChart(props) {
  const colors = {
    "1": '#778899',
  };
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={props.width || 560}
      height={180}
      domainPadding={props.pad || 10}
      scale={{ y: props.ylog ? 'log' : 'linear' }}
      minDomain={{ y: props.ylog ? 1 : 0 }}
      padding={{ left: 79, right: 40, top: 40, bottom: 50 }}
      containerComponent={<VictoryContainer responsive={false} />}
    >
      <VictoryLabel style={{
        fontSize: 20, paddingBottom: '0.5em'
      }} text={props.title} x={(props.width || 560) / 2} y={26} textAnchor="middle" />
      <VictoryAxis style={{
        tickLabels: { fontSize: 18, padding: 2 }
      }} />
      <VictoryAxis dependentAxis style={{
        tickLabels: { fontSize: 18, padding: 2 }
      }}
        tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))} />
      <VictoryBar
        horizontal
        barRatio={0.8}
        // labels={({ datum }) => (Math.round(datum.value * 100) / 100)}
        data={[{ key: props.keyv[0], 'value': props.data[props.stateFips + props.countyFips][props.var[0]] || 0, 'colors': '1' },
        { key: props.keyv[1], 'value': props.data[props.stateFips + props.countyFips][props.var[1]] || 0, 'colors': '1' },
        { key: props.keyv[2], 'value': props.data[props.stateFips + props.countyFips][props.var[2]] || 0, 'colors': '1' },
        { key: props.keyv[3], 'value': props.data[props.stateFips + props.countyFips][props.var[3]] || 0, 'colors': '1' }]}
        labelComponent={<VictoryLabel dx={5} style={{ fontWeight: 300, fontSize: 18, fill: ({ datum }) => colors[datum.key] }} />}
        style={{
          data: {
            fill: ({ datum }) => colors[datum.colors]
          }
        }}
        x="key"
        y="value"
      />
    </VictoryChart>);
}

export default function CountyReport() {

  let { stateFips, countyFips } = useParams();
  // const [countyFips, setCountyFips] = useState('121');
  const [configsCounty, setConfig] = useState();
  const [stateName, setStateName] = useState('Georgia');
  const [countyName, setCountyName] = useState('');
  const [dateCur, setDateCur] = useState();
  const [zipCode, setZipCode] = useState('30328');
  const [zipCodeH, setZipCodeH] = useState('30328');
  const [zipCodeD, setZipCodeD] = useState('30328');
  const [zipCodeFinal, setZipCodeFinal] = useState('30328');
  const history = useHistory();
  const [data, setData] = useState();
  const [data_cases, setDataCG] = useState();
  const [data_deaths, setDataDG] = useState();
  const [datades_cases, setDatadesCG] = useState();
  const [datades_deaths, setDatadesDG] = useState();
  const [dataG, setDataG] = useState();
  const [dataZip, setDataZip] = useState();
  const [dataTS, setDataTS] = useState();
  const [mapOut, setDataMapOut] = useState();

  const [legendMax, setLegendMax] = useState([]);
  const [legendMaxD, setLegendMaxD] = useState([]);

  const [legendMax_graph, setLegendMaxGraph] = useState(0);

  const [legendMin, setLegendMin] = useState([]);
  const [legendMinD, setLegendMinD] = useState([]);

  const [legendSplit, setLegendSplit] = useState([]);
  const [legendSplitD, setLegendSplitD] = useState([]);
  const [colorScale, setColorScale] = useState();
  const [colorScaleD, setColorScaleD] = useState();


  // const [metric, setMetric] = useState('mean7daycases');
  const [tooltipContent, setTooltipContent] = useState('');
  const [covidMetric, setCovidMetric] = useState({
    casescum: 'N/A', deathscum: 'N/A', casescumR: 'N/A', deathscumR: 'N/A',
    casesdailymean14: 'N/A', deathsdailymean14: 'N/A', casesdailymean14R: 'N/A', deathsdailymean14R: 'N/A', "cfr": 'N/A', "cfrcompare": '', t: 'n/a'
  });
  const [covidMetricLast, setCovidMetricLast] = useState({
    casescum: 'N/A', deathscum: 'N/A', casescumR: 'N/A', deathscumR: 'N/A',
    casesdailymean14: 'N/A', deathsdailymean14: 'N/A', casesdailymean14R: 'N/A', deathsdailymean14R: 'N/A', "cfr": 'N/A', "cfrcompare": '', t: 'n/a'
  });
  const [covidMetricGa, setCovidMetricGa] = useState({
    casescum: 'N/A', deathscum: 'N/A', casescumR: 'N/A', deathscumR: 'N/A',
    casesdailymean14: 'N/A', deathsdailymean14: 'N/A', casesdailymean14R: 'N/A', deathsdailymean14R: 'N/A', "cfr": 'N/A', "cfrcompare": '', t: 'n/a'
  });
  const [covidMetric14, setCovidMetric14] = useState({
    casescum: 'N/A', deathscum: 'N/A', casescumR: 'N/A', deathscumR: 'N/A',
    casesdailymean14: 'N/A', deathsdailymean14: 'N/A', casesdailymean14R: 'N/A', deathsdailymean14R: 'N/A', "cfr": 'N/A', "cfrcompare": '', t: 'n/a'
  });
  const [varMap, setVarMap] = useState({});
  // const [countyFips, setCountyFips] = useState('');


  const varNameMap = {
    "casescum": { "name": 'cases', "text": "The map shows the total number of confirmed COVID-19 cases in each zip code as of " },
    "deathscum": { "name": 'deaths', "text": "The map shows the total number of confirmed COVID-19 deaths in each zip code as of " },
    "casescumR": { "name": 'cases per 100,000 residents', "text": "The map shows the total number of confirmed COVID-19 cases per 100,000 residents in each zip code as of " },
    "deathscumR": { "name": 'deaths per 100,000 residents', "text": "The map shows the total number of confirmed COVID-19 deaths per 100,000 residents in each zip code as of " }
  };

  const [delayHandler, setDelayHandler] = useState(null)

  useEffect(() => {

    const configMatched = configscounty.find(s => s.countyfips === countyFips);

    // let projection = d3.geoAlbersUsa();
    // // let gps = [-85.504701, 34.855196]
    // let gps = [-0.6, 38.7]
    // console.log(projection.center)
    // console.log(countyfips);

    // console.log(configMatched);
    if (!configMatched || !fips2county[stateFips + countyFips]) {
      history.push('/');
    } else {
      setConfig(configMatched);
      // setStateName(configMatched.name);
      setCountyName(fips2county[stateFips + countyFips]);

      fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
        .then(x => setVarMap(x));

      fetch('/data/data_us.json').then(res => res.json())
        .then(x => setData(x));
      fetch('/data/data.json').then(res => res.json())
        .then(x => setDateCur(x));
      fetch('/data/data_cases_ga.json').then(res => res.json())
        .then(x => setDataCG(x));
      fetch('/data/data_deaths_ga.json').then(res => res.json())
        .then(x => setDataDG(x));
      fetch('/data/data_describe_cases.json').then(res => res.json())
        .then(x => setDatadesCG(x));
      fetch('/data/data_describe_deaths.json').then(res => res.json())
        .then(x => setDatadesDG(x));
      fetch('/data/data.json').then(res => res.json())
        .then(x => setDataG(x));

      fetch('/data/zipcode.json').then(res => res.json())
        .then(x => setDataZip(x));

      fetch('/data/timeseries13' + '.json').then(res => res.json())
        .then(x => setDataTS(x));

      fetch('/data/mapout' + '.json').then(res => res.json())
        .then(x => setDataMapOut(x));

      fetch('/data/timeseries13' + '.json').then(res => res.json())
        .then(
          x => {
            // setDataTS(x);
            var max = 0
            var length = 0
            _.each(x[stateFips + countyFips], d => {
              length = length + 1
              // console.log(d);
              if (d['cases'] > max) {
                max = d['cases'];
              }

            });
            setLegendMaxGraph(max.toFixed(0));
            // console.log(max.toFixed(0));
          });

      fetch('/data/zipcode.json').then(res => res.json())
        .then(x => {
          // setDataZip(x);

          const cs = scaleQuantile()
            .domain(_.map(_.filter(_.map(x, (d, k) => {
              d.fips = k
              return d
            }),
              d => (
                (d.casescum >= 0 &&
                  d.fips.length === 5 && Number(d.fips) >= 30001 && Number(d.fips) <= 31999) || (d.casescum >= 0 &&
                    d.fips.length === 5 && Number(d.fips) >= 39800 && Number(d.fips) <= 39999))),
              d => d['casescum']))
            .range(colorPalette);

          let scaleMap = {}
          _.each(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d
          }),
            d => (
              (d.casescum >= 0 &&
                d.fips.length === 5 && Number(d.fips) >= 30001 && Number(d.fips) <= 31999) || (d.casescum >= 0 &&
                  d.fips.length === 5 && Number(d.fips) >= 39800 && Number(d.fips) <= 39999)))
            , d => {
              scaleMap[d['casescum']] = cs(d['casescum'])
            });
          setColorScale(scaleMap);

          var max = 0
          var min = 100
          var length = 0
          _.each(x, d => {
            // console.log(d.fips[0]);
            if ((d['casescum'] > max && d.fips.length === 5 && Number(d.fips) >= 30001 && Number(d.fips) <= 31999) ||
              (d['casescum'] > max && d.fips.length === 5 && Number(d.fips) >= 39800 && Number(d.fips) <= 39999)
            ) {
              max = d['casescum'];
              // console.log(d.fips)
            } else if ((d.fips.length === 5 && d['casescum'] < min && d['casescum'] >= 0 && Number(d.fips) >= 30001 && Number(d.fips) <= 31999) ||
              (d.fips.length === 5 && d['casescum'] < min && d['casescum'] >= 0 && Number(d.fips) >= 39800 && Number(d.fips) <= 39999)
            ) {
              min = d['casescum']
              // console.log(d.fips)
            }

          });
          if (max > 999) {
            max = (max / 1000).toFixed(0) + "K";
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
                (d.casescum >= 0 &&
                  d.fips.length === 5 && Number(d.fips) >= 30001 && Number(d.fips) <= 31999) || (d.casescum >= 0 &&
                    d.fips.length === 5 && Number(d.fips) >= 39800 && Number(d.fips) <= 39999))),
              d => d['casescum']))
            .range(colorPalette);

          setLegendSplit(split.quantiles());
          console.log(split.quantiles());
        });


    }
  }, [countyFips]);

  useEffect(() => {
    fetch('/data/zipcode.json').then(res => res.json())
      .then(x => {
        const csD = scaleQuantile()
          .domain(_.map(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d
          }),
            d => (
              (d.deathscum >= 0 &&
                d.fips.length === 5 && Number(d.fips) >= 30001 && Number(d.fips) <= 31999) || (d.deathscum >= 0 &&
                  d.fips.length === 5 && Number(d.fips) >= 39800 && Number(d.fips) <= 39999))),
            d => d['deathscum']))
          .range(colorPalette);

        let scaleMap = {}
        _.each(_.filter(_.map(x, (d, k) => {
          d.fips = k
          return d
        }),
          d => (
            (d.deathscum >= 0 &&
              d.fips.length === 5 && Number(d.fips) >= 30001 && Number(d.fips) <= 31999) || (d.deathscum >= 0 &&
                d.fips.length === 5 && Number(d.fips) >= 39800 && Number(d.fips) <= 39999)))
          , d => {
            scaleMap[d['deathscum']] = csD(d['deathscum'])
          });
        setColorScaleD(scaleMap);

        var max = 0
        var min = 100
        _.each(x, d => {
          // console.log(d.fips[0]);
          if ((d['deathscum'] > max && d.fips.length === 5 && Number(d.fips) >= 30001 && Number(d.fips) <= 31999) ||
            (d['deathscum'] > max && d.fips.length === 5 && Number(d.fips) >= 39800 && Number(d.fips) <= 39999)
          ) {
            max = d['deathscum'];
            console.log(max)
          } else if ((d.fips.length === 5 && d['deathscum'] < min && d['deathscum'] >= 0 && Number(d.fips) >= 30001 && Number(d.fips) <= 31999) ||
            (d.fips.length === 5 && d['deathscum'] < min && d['deathscum'] >= 0 && Number(d.fips) >= 39800 && Number(d.fips) <= 39999)
          ) {
            min = d['deathscum']
            // console.log(d.fips)
          }


        });
        if (max > 999) {
          max = (max / 1000).toFixed(0) + "K";
          setLegendMaxD(max);
        } else {
          setLegendMaxD(max.toFixed(0));

        }
        setLegendMinD(min.toFixed(0));

        var split = scaleQuantile()
          .domain(_.map(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d
          }),
            d => (
              (d.deathscum >= 0 &&
                d.fips.length === 5 && Number(d.fips) >= 30001 && Number(d.fips) <= 31999) || (d.deathscum >= 0 &&
                  d.fips.length === 5 && Number(d.fips) >= 39800 && Number(d.fips) <= 39999))),
            d => d['deathscum']))
          .range(colorPalette);

        setLegendSplitD(split.quantiles());
        // console.log(split.thresholds().reverse());
      });
  }, [])

  useEffect(() => {
    if (dataTS && dataTS[stateFips + countyFips]) {
      setCovidMetric(dataG[stateFips + countyFips]);
      setCovidMetricGa(dataG[stateFips]);
      // setCovidMetric(dataG[stateFips + countyFips]);
      setCovidMetric14(_.takeRight(dataTS[stateFips + countyFips], 14)[0]);
      setCovidMetricLast(_.takeRight(dataTS[stateFips + countyFips])[0]);
    }
  }, [dataTS])

  if (data && dataTS && varMap) {

    return (
      <div>
        <AppBar menu='countyReport' />
        <Container style={{ marginTop: '8em', minWidth: '1260px', paddingRight: 0 }}>
          {configsCounty &&
            <div>
              <Breadcrumb>
                {/* <Breadcrumb.Section link onClick={() => history.push('/')}>United States</Breadcrumb.Section>
            <Breadcrumb.Divider /> */}
                <Breadcrumb.Section link onClick={() => history.push('/' + stateFips)}>{stateName}</Breadcrumb.Section>
                <Breadcrumb.Divider />
                <Breadcrumb.Section active>{countyName}</Breadcrumb.Section>
                <Breadcrumb.Divider />
              </Breadcrumb>
              <Header as='h1' style={{ fontWeight: 300 }}>
                <Header.Content>
                  {/* Covid-19 Health Equity Report for <span style={{color: countyColor}}>{countyName}</span> */}
                  {/* <span style={{ color: countyColor }}>{countyName}</span> */}
                  <b>{countyName}</b>
                  {/* <Header.Subheader style={{fontWeight: 300}}>
              See how health determinants impact COVID-19 outcomes. 
              </Header.Subheader> */}
                </Header.Content>
              </Header>
              <Divider horizontal style={{ fontWeight: 600, color: '#232423', fontSize: '16pt', paddingTop: '1em' }}>SUMMARY OF COVID-19 IN <b>{countyName}</b>, GEORGIA</Divider>

              <Grid style={{ paddingTop: '2em', width: "1260px" }} centered>
                <Header as='h2' style={{ fontWeight: 300, textAlign: 'center' }} >
                  <Header.Content>
                    COVID-19 <b>cases</b> in {countyName}
                  </Header.Content>
                </Header>
                <Grid.Row style={{ paddingTop: '1em' }}>
                  <Grid.Column width={16} style={{ paddingLeft: '0', paddingRight: '0' }}>
                    <Table called fixed>
                      <Table.Header>
                        <Table.Row textAlign='center'>
                          <Table.HeaderCell colSpan='1' style={{ width: 150 }}> </Table.HeaderCell>
                          <Popup
                            trigger={
                              <Table.HeaderCell style={{ width: 200 }}> ALL CASES TO DATE</Table.HeaderCell>}
                            content={"All confirmed cases reported to DPH as of " + new Date(dateCur[stateFips + countyFips].todaydat * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' })}
                            basic />
                          <Popup
                            trigger={
                              <Table.HeaderCell style={{ width: 200 }}> CASES IN PAST 14 DAYS</Table.HeaderCell>}
                            content={"All confirmed cases reported to DPH during the 14 days preceding the report publication date."}
                            basic />
                          <Popup
                            trigger={
                              <Table.HeaderCell style={{ width: 200 }}> CASES PER 100K (PAST 14 DAYS)</Table.HeaderCell>}
                            content={"14-day case count/100K residents based on 2020 population projects derived from census data."}
                            basic />
                          <Popup
                            trigger={
                              <Table.HeaderCell style={{ width: 200 }}> 14-DAY RATE CATEGORY</Table.HeaderCell>} flowing hoverable>
                            Based on the 14-day case rate
                          <List as='ul'>
                              <List.Item as='li'>High: {'>'} 100 cases/100K</List.Item>
                              <List.Item as='li'>Moderately high: {">"} 50-100 cases/100K</List.Item>
                              <List.Item as='li'>Moderately: {">"} 10-50 cases/100K</List.Item>
                              <List.Item as='li'>Low: {">"} 0-10 cases/100K</List.Item>
                              <List.Item as='li'>Less than 5 cases reported, rate not calculated</List.Item>
                            </List>
                          </Popup>

                          <Popup
                            trigger={
                              <Table.HeaderCell style={{ width: 200 }}> CHANGE IN LAST 2 WEEKS</Table.HeaderCell>} flowing hoverable>
                            Change in case count during the previous 14 days, comparing<br></br> the second 7-day period to the first 7-day period.
                          <List as='ul'>
                              <List.Item as='li'>Increasing: 5% or greater change</List.Item>
                              <List.Item as='li'>Decreasing: -5% or less change</List.Item>
                              <List.Item as='li'>Less than 5% change</List.Item>
                            </List>
                          </Popup>
                        </Table.Row>

                        <Table.Row textAlign='center'>
                          <Table.HeaderCell style={{ fontSize: '18px' }}> {countyName} </Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetric.casescum === null || covidMetric.casescum < 0 ? '0' : covidMetric.casescum.toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetric.casescum14day === null || covidMetric.casescum14day < 0 ? '0' : numberWithCommas(parseFloat(covidMetric.casescum14day).toFixed(0)).toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetric.casescum14dayR === null || covidMetric.casescum14dayR < 0 ? '0' : numberWithCommas(parseFloat(covidMetric.casescum14dayR).toFixed(2)).toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '18px' }}>{covidMetric.category14day === null || covidMetric.category14day < 0 ? '0' : covidMetric.category14day}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '18px' }}>{covidMetric.change14day === null ? '0' : covidMetric.change14day}</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row textAlign='center'>
                          <Table.HeaderCell style={{ fontSize: '18px' }}>Georgia</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetricGa.casescum === null || covidMetricGa.casescum < 0 ? '0' : covidMetricGa.casescum.toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetricGa.casescum14day === null || covidMetricGa.casescum14day < 0 ? '0' : numberWithCommas(parseFloat(covidMetricGa.casescum14day).toFixed(0)).toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetricGa.casescum14dayR === null || covidMetricGa.casescum14dayR < 0 ? '0' : numberWithCommas(parseFloat(covidMetricGa.casescum14dayR).toFixed(2)).toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '18px' }}>{covidMetricGa.category14day === null || covidMetricGa.category14day < 0 ? '0' : covidMetricGa.category14day}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '18px' }}>{covidMetricGa.change14day === null || covidMetricGa.change14day < 0 ? '0' : covidMetricGa.change14day}</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                    </Table>
                  </Grid.Column>

                </Grid.Row>

                <Header as='h2' style={{ fontWeight: 300, textAlign: 'center' }} >
                  <Header.Content>
                    COVID-19 <b>deaths</b> in {countyName}
                  </Header.Content>
                </Header>
                <Grid.Row style={{ paddingTop: '1em' }}>
                  <Grid.Column width={16} style={{ paddingLeft: '0', paddingRight: '0' }}>

                    <Table celled fixed singleLine>
                      <Table.Header>
                        <Table.Row textAlign='center'

                        >
                          <Table.HeaderCell colSpan='1' style={{ width: 150 }}> </Table.HeaderCell>
                          <Popup
                            trigger={
                              <Table.HeaderCell style={{ width: 200 }}> ALL DEATHS TO DATE</Table.HeaderCell>}
                            content={"All confirmed deaths reported to DPH as of " + new Date(dateCur.date * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' })}
                            basic />
                          <Popup
                            trigger={
                              <Table.HeaderCell style={{ width: 230 }}> DEATHS IN PAST 14 DAYS</Table.HeaderCell>}
                            content={"All confirmed deaths reported to DPH during the 14 days preceding the report publication date."}
                            basic />
                          <Popup
                            trigger={
                              <Table.HeaderCell style={{ width: 200 }}> DEATHS PER 100K (PAST 14 DAYS)</Table.HeaderCell>}
                            content={"14-day deaths count/100K residents based on 2020 population projects derived from census data."}
                            basic />
                          <Popup
                            trigger={
                              <Table.HeaderCell style={{ width: 200 }}> CASE FATALITY RATIO (%)</Table.HeaderCell>}
                            content={"The case fatality ratio is the percent of all confirmed cases who have been reported as having died. While this is used as a measure of disease severity, the ratio may also be affected by the level of testing and quality of follow-up data on cases."}
                            basic />
                        </Table.Row>

                        <Table.Row textAlign='center'>
                          <Table.HeaderCell style={{ fontSize: '18px' }}> {countyName} </Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetric.deathscum === null || covidMetric.deathscum < 0 ? '0' : covidMetric.deathscum.toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetric.deathscum14day === null || covidMetric.deathscum14day < 0 ? '0' : numberWithCommas(parseFloat(covidMetric.deathscum14day).toFixed(0)).toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetric.deathscum14dayR === null || covidMetric.deathscum14dayR < 0 ? '0' : numberWithCommas(parseFloat(covidMetric.deathscum14dayR).toFixed(2)).toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetric.cfr === null || covidMetric.cfr < 0 ? '0' : numberWithCommas(parseFloat(covidMetric.cfr).toFixed(2)).toLocaleString() + '%'}</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row textAlign='center'>
                          <Table.HeaderCell style={{ fontSize: '18px' }}>Georgia</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetricGa.deathscum === null || covidMetricGa.deathscum < 0 ? '0' : covidMetricGa.deathscum.toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetricGa.deathscum14day === null || covidMetricGa.deathscum14day < 0 ? '0' : numberWithCommas(parseFloat(covidMetricGa.deathscum14day).toFixed(0)).toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetricGa.deathscum14dayR === null || covidMetricGa.deathscum14dayR < 0 ? '0' : numberWithCommas(parseFloat(covidMetricGa.deathscum14dayR).toFixed(2)).toLocaleString()}</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '27px' }}>{covidMetricGa.cfr === null || covidMetricGa.cfr < 0 ? '0' : numberWithCommas(parseFloat(covidMetricGa.cfr).toFixed(2)).toLocaleString() + '%'}</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                    </Table>
                  </Grid.Column>

                </Grid.Row>

                <Grid.Row style={{ paddingTop: 0 }}>
                  <Grid.Column style={{ paddingLeft: '0.01', paddingRight: '0' }}>
                    <small style={{ fontWeight: 300, fontSize: 16, color: 'black' }} align="justify">
                      As of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}, there were a total of {covidMetric.casescum.toLocaleString()} confirmed cases of COVID-19 and {covidMetric.deathscum.toLocaleString()} deaths due to COVID-19 reported to DPH for {countyName}. In {countyName}, this translates to {numberWithCommas(parseFloat(covidMetric.casescumR).toFixed(0)).toLocaleString()} case(s) per 100,000 residents and {numberWithCommas(parseFloat(covidMetric.deathscumR).toFixed(0)).toLocaleString()} death(s) per 100,000 residents.
                        On a day-to-day basis, {numberWithCommas(parseFloat(covidMetric.casesdailymean7).toFixed(0)).toLocaleString()} new cases and {numberWithCommas(parseFloat(covidMetric.deathsdailymean7).toFixed(0)).toLocaleString()} new deaths are reported to DPH on average (based on a 14-day rolling average). This means that there are {covidMetric.casesdailymean7 === null || covidMetric.casesdailymean7 < 0 ? '0' : numberWithCommas(parseFloat(covidMetric.casesdailymean7).toFixed(0)).toLocaleString()} new cases and {covidMetric.deathsdailymean7 === null || covidMetric.deathsdailymean7 < 0 ? '0' : numberWithCommas(parseFloat(covidMetric.deathsdailymean7).toFixed(0)).toLocaleString()} new deaths per 100,000 residents in {countyName}. The case-fatality ratio measures
                          the proportion of confirmed COVID-19 cases that ultimately die due to the disease. This is used by epidemiologists to gauge the severity of disease in a particular locale.  In {countyName}, the case-fatality ratio was {covidMetric.cfr === null || covidMetric.cfr < 0 ? '0' : numberWithCommas(parseFloat(covidMetric.cfr).toFixed(2)).toLocaleString() + '%'}, which is {covidMetric.cfrcompare === null || covidMetric.cfrcompare < 0 ? '0' : covidMetric.cfrcompare} than the national average of 4%. All of these data must be interpreted in light of constraints on testing, PUI follow-up quality, and reporting lags in the county.
                  </small>
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <Divider horizontal style={{ fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em' }}></Divider>
              <Grid column={2} style={{ paddingTop: '2em', paddingBottom: '2em', width: "1260px" }}>
                <Grid.Row style={{ paddingTop: '2em' }}>

                  <Grid.Column width={8}>
                    <Header as='h2' style={{ fontWeight: "bold", fontSize: "27px", paddingLeft: ".5em" }}>
                      <Header.Content>
                        Daily cases in {countyName}
                        <Header.Subheader style={{ fontWeight: 300 }}>
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                    <svg width="550" height="90">
                      <rect x={50} y={50} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} />
                      <rect x={50} y={22} width="15" height="1" style={{ fill: countyColor, strokeWidth: 1, stroke: countyColor }} />
                      <text x={75} y={64} style={{ fontSize: 18 }}> Daily new cases </text>
                      <text x={75} y={30} style={{ fontSize: 18 }}>7-D Rolling average</text>
                    </svg>
                    <VictoryChart theme={VictoryTheme.material}
                      containerComponent={
                        <VictoryVoronoiContainer
                          voronoiBlacklist={["Line14", "Line"]}
                          labels={({ datum }) => `${new Date(datum.t * 1000).toLocaleDateString()}\n` + `Daily new cases: ${Math.round(datum.casesdaily, 2)}\n` + `7-d Rolling average of daily new cases: ${Math.round(datum.casesdailymean7, 2)}`}
                          labelComponent={
                            <VictoryTooltip dy={-7} constrainToVisibleArea
                              style={{ fontSize: 15 }} />
                          }
                        />
                      }
                      width={550}
                      height={450}
                      padding={{ left: 40, right: 60, top: 10, bottom: 60 }}>
                      {/* <VictoryLabel style={{
                        textAnchor: "start",
                        verticalAnchor: "end", fontFamily: "inherit",
                        fontSize: "27px", fontWeight: "bold"
                      }} text={" Daily new cases in " + countyName} x={15} y={28} textAnchor="middle" /> */}
                      {/* <VictoryLegend
                        style={{ labels: { fontSize: 16 } }}
                        x={30} y={35}
                        orientation="vertical"
                        colorScale={[stateColor, countyColor]}
                        data={[
                          { name: "Daily new cases",symbol: {type: "square" } }, { name: "7-D Rolling average",symbol: {type: "minus" } }
                        ]}
                      /> */}

                      <VictoryAxis
                        style={{
                          tickLabels: { fontSize: 20, padding: 5 }
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
                          tickLabels: { fontSize: 17, paddingLeft: '0em' }
                        }}
                        tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                      />

                      <VictoryBar style={{ data: { fill: stateColor } }} barWidth={4} data={dataTS[stateFips + countyFips] ? _.take(dataTS[stateFips + countyFips], 141) : dataTS["99999"]}
                        x='t' y='casesdaily'
                      />
                      <VictoryLine name="Line" style={{ data: { stroke: countyColor } }} data={dataTS[stateFips + countyFips] ? _.take(dataTS[stateFips + countyFips], 141) : dataTS["99999"]}
                        x='t' y='casesdailymean7'
                      />
                      {/* <VictoryLine name="Line14"
                        style={{ data: { stroke: 'red', strokeDasharray: "5,5" } }}
                        x={() => covidMetric14.t}
                        samples={1}
                        labelComponent={<VictoryLabel renderInPortal dx={20} dy={-20} />} /> */}
                      {/* <VictoryLine name="Line14" style={{ data: { stroke: 'red' , strokeDasharray:"5,5"} }} data={[{x:covidMetric14.t, y:0},{x:covidMetric14.t, y:Math.round(legendMax_graph)}] }
                      /> */}
                    </VictoryChart>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Header as='h2' style={{ fontWeight: "bold", fontSize: "27px", paddingLeft: ".5em" }}>
                      <Header.Content>
                        Daily deaths in {countyName}
                        <Header.Subheader style={{ fontWeight: 300 }}>
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                    <svg width="550" height="90">
                      <rect x={50} y={50} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} />
                      <rect x={50} y={22} width="15" height="1" style={{ fill: countyColor, strokeWidth: 1, stroke: countyColor }} />
                      <text x={75} y={64} style={{ fontSize: 18 }}> Daily new deaths </text>
                      <text x={75} y={30} style={{ fontSize: 18 }}>7-D Rolling average</text>
                    </svg>
                    <VictoryChart theme={VictoryTheme.material}
                      containerComponent={
                        <VictoryVoronoiContainer
                          voronoiBlacklist={["Line", "Line14"]}
                          labels={({ datum }) => `${new Date(datum.t * 1000).toLocaleDateString()}\n` + `Daily new deaths: ${Math.round(datum.deathsdaily, 2)}\n` + `7-d Rolling average of daily new deaths: ${Math.round(datum.deathsdailymean7, 2)}`}
                          labelComponent={
                            <VictoryTooltip dy={-7} constrainToVisibleArea
                              style={{ fontSize: 15 }} />
                          }
                        />
                      }
                      width={550}
                      height={450}
                      padding={{ left: 30, right: 60, top: 10, bottom: 60 }}>
                      {/* <VictoryLabel style={{
                        textAnchor: "start",
                        verticalAnchor: "end", fill: "#000000", fontFamily: "inherit",
                        fontSize: "28px", fontWeight: "bold"
                      }} text={"Daily new deaths in " + countyName} x={15} y={28} textAnchor="middle" /> */}
                      {/* <VictoryLegend
                        style={{ labels: { fontSize: 16 } }}
                        x={30} y={35}
                        orientation="vertical"
                        colorScale={[stateColor, countyColor]}
                        data={[
                          { name: "Daily new deaths" }, { name: "7-d Rolling average" }
                        ]}
                      /> */}
                      <VictoryAxis
                        style={{
                          tickLabels: { fontSize: 20, padding: 5 }
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
                          tickLabels: { fontSize: 20, padding: 5 }
                        }}
                        tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                      />

                      <VictoryBar style={{ data: { fill: stateColor } }} barWidth={4} data={dataTS[stateFips + countyFips] ? _.take(dataTS[stateFips + countyFips], 141) : dataTS["99999"]}
                        x='t' y='deathsdaily'
                      />
                      <VictoryLine name="Line" style={{ data: { stroke: countyColor } }} data={dataTS[stateFips + countyFips] ? _.take(dataTS[stateFips + countyFips], 141) : dataTS["99999"]}
                        x='t' y='deathsdailymean7'
                      />
                      {/* <VictoryLine name="Line14"
                        style={{ data: { stroke: 'red', strokeDasharray: "5,5" } }}
                        x={() => covidMetric14.t}
                        samples={1}
                        labelComponent={<VictoryLabel renderInPortal dx={20} dy={-20} />} /> */}
                      {/* <VictoryLine name="Line14" style={{ data: { stroke: 'red' , strokeDasharray:"5,5"} }} data={[{x:covidMetric14.t, y:0},{x:covidMetric14.t, y:Math.round(legendMax_graph)}] }
                      /> */}
                    </VictoryChart>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ paddingTop: '2em', paddingLeft: '0em', paddingRight: '2em' }} >
                  <Grid.Column width={8} style={{ paddingLeft: '1em', paddingRight: '3em' }}>
                    <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                      As of {covidMetricLast.t === 'n/a' ? 'N/A' : (new Date(covidMetricLast.t * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}, this chart shows the daily number of new cases of confirmed COVID-19 in <b>{countyName}</b>. The daily number reflects the date the case was first reported to DPH.
                  The vertical bars show the number of new daily cases while the line shows the 7-day moving average of new daily cases.
                  </small>
                  </Grid.Column>
                  <Grid.Column width={8} style={{ paddingLeft: '3em', paddingRight: '3em' }}>
                    <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                      As of {covidMetricLast.t === 'n/a' ? 'N/A' : (new Date(covidMetricLast.t * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}, this chart shows the daily number of new deaths of confirmed COVID-19 in <b>{countyName}</b>. The daily number reflects the date the death was first reported to DPH.
                  The vertical bars show the number of new daily deaths while the line shows the 7-day moving average of new daily cases.
                  </small>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ paddingTop: '8em' }}>
                  <Grid.Column width={9}>
                    <Header as='h2' style={{ fontWeight: 400, paddingLeft: '1em' }}>
                      <Header.Content >
                        <strong>Confirmed COVID-19 cases {countyName} by zip code</strong>
                        {/* <Header.Subheader style={{fontWeight: 300}}>.</Header.Subheader> */}
                      </Header.Content>
                    </Header>
                    <svg width="120" height="300" style={{ paddingLeft: '3.5em' }}>
                      {_.map(colorPalette, (color, i) => {
                        return <rect key={i} y={20 * i} x={25} width="20" height="20" style={{ fill: colorPalette[(colorPalette.length - 1 - i).toString()], strokeWidth: 1, stroke: colorPalette[(colorPalette.length - 1 - i).toString()] }} />
                      })}
                      {/* <text y={15} x={47} style={{fontSize: '0.8em'}}>High</text>
                  <text y={20 * (colorPalette.length)} x={47} style={{fontSize: '0.8em'}}>Low</text> */}
                      {/* {_.map(legendSplit, (splitpoint, i) => {
                        if (legendSplit[i] < 1) {
                          return <text key={i} y={21 * (legendSplit.length - i)} x={47} style={{ fontSize: '0.8em' }}> {legendSplit[i].toFixed(1)}</text>
                        }
                        return <text key={i} y={21 * ((legendSplit.length - i))} x={47} style={{ fontSize: '0.8em' }}> {legendSplit[i].toFixed(0)}</text>
                      })} */}
                      <text y={20 * (colorPalette.length)} x={47} style={{ fontSize: '0.8em' }}> {legendMin} </text>
                      <text y={8} x={47} style={{ fontSize: '0.8em' }}>{legendMax}</text>
                    </svg>

                    <ComposableMap projection="geoAlbersUsa"
                      style={{ paddingLeft: '2em' }}
                      projectionConfig={{ scale: `${configsCounty.scale}` }}
                      width={500}
                      height={350}
                      data-tip=""
                      offsetX={configsCounty.offsetX}
                      offsetY={configsCounty.offsetY}>
                      <Geographies geography={configsCounty.url}>
                        {({ geographies }) => geographies.map(geo =>
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            style={{
                              default: {
                                stroke: "#607D8B",
                                strokeWidth: 0.95,
                                outline: "none",
                              }
                            }}
                            onMouseEnter={(event) => {
                              // console.log(event);
                              // setCountyFips(geo.properties.COUNTYFP);
                              setCountyName(fips2county[stateFips + geo.properties.COUNTYFP]);
                              setZipCode(geo.properties.ZCTA5CE10);
                              setZipCodeFinal(geo.properties.ZCTA5CE10);
                              setTooltipContent(<div><font size="+2"><b >{geo.properties.ZCTA5CE10}</b> </font> <br />
                                {/* <b>Total Cases</b>: {dataZip[geo.properties.ZCTA5CE10]['casescum']} <br />
                                <b>Total Deaths</b>: {dataZip[geo.properties.ZCTA5CE10]['deathscum']} <br /> */}
                              </div>);
                            }}
                            onMouseLeave={(event) => {
                              setTooltipContent("")
                            }}
                            fill={zipCode === geo.properties.ZCTA5CE10 ? countyColor :
                              ((colorScale && dataZip[geo.properties.ZCTA5CE10] && dataZip[geo.properties.ZCTA5CE10]['casescum']) ?
                                colorScale[dataZip[geo.properties.ZCTA5CE10]['casescum']] : colorPalette[0])}
                          />
                        )}
                      </Geographies>
                    </ComposableMap>
                  </Grid.Column>

                </Grid.Row>
                

                <Grid.Row style={{ paddingTop: '2em', paddingLeft: '0em', paddingRight: '2em' }} >
                
                  <Grid.Column width={9} style={{ paddingLeft: '2em', paddingRight: '5em' }}>
                    <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                      {varNameMap['casescum'].text}{dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))} . The darker shading indicates a larger number of {varNameMap['casescum'].name}.</small>
                  </Grid.Column>

                </Grid.Row>
                <Grid.Row style={{ paddingTop: 0 }}>
                  <small style={{ fontWeight: 300, color: 'black' }}>
                    Note: Data are provisional and subject to change. Zip codes may cross county boundaries. Zip codes being displayed include the total count of cases for that zip code.
                    </small>
                </Grid.Row>
              </Grid>
              <Divider horizontal style={{ fontWeight: 600, color: '#232423', fontSize: '16pt', paddingTop: '1em' }}>Characteristics of confirmed cases for {countyName}</Divider>
              <Grid columns={2} style={{ width: "1260px" }} centered>
                <Grid.Row >
                  <Grid.Column>
                    <svg width="400" height="500" >
                      <VictoryLabel style={{
                        textAnchor: "start",
                        verticalAnchor: "end", fill: "#000000", fontFamily: "inherit",
                        fontSize: "20px", fontWeight: "bold"
                      }} text="Proportion of cases with a comorbidity
                  " x={15} y={28} textAnchor="middle" />
                      <VictoryPie
                        colorScale={['Gray', 'GoldenRod']}
                        standalone={false}
                        style={{ labels: { fill: "white" } }}
                        labelRadius={80}
                        width={400} height={400}
                        padAngle={1}
                        data={[
                          { x: "Cats", y: 22, label: "22%" },
                          { x: "Dogs", y: 78, label: "78%" },
                        ]}
                      />
                      <VictoryLegend
                        standalone={false}
                        colorScale={['Gray', 'GoldenRod']}
                        x={150} y={350}
                        data={[{ name: "No underlying conditions", labels: { fontSize: 18 } },
                        { name: "Underlying health condition", labels: { fontSize: 18 } }
                        ]}
                      />
                    </svg>
                  </Grid.Column>
                  <Grid.Column style={{ paddingLeft: '2em', paddingRight: '1em', paddingTop: '8em' }}>
                    <small style={{ fontWeight: 300, fontSize: 20, color: 'black' }} align="justify">
                      The pie chart shows the proportion of confirmed COVID-19 cases in <b>{countyName}</b> who
                  presented with an underlying medical condition. Underlying medical conditions
                  increase the risk of experiencing severe disease which may lead to hospitalization
                  and death. Of the {datades_cases[stateFips + countyFips]['cdc_underlying2_N'] ? datades_cases[stateFips + countyFips]['cdc_underlying2_N'] : "N/A"} confirmed cases, {datades_cases[stateFips + countyFips]['cdc_underlying2Percent'] ? datades_cases[stateFips + countyFips]['cdc_underlying2Percent'].toFixed(2) : "N/A"}% had an underlying comorbidity using the CDC definition.The chart excludes data from {datades_cases[stateFips + countyFips]['cdc_underlying2Pmiss'] ? datades_cases[stateFips + countyFips]['cdc_underlying2Pmiss'].toFixed(2) : "N/A"}% of confirmed COVID-19 cases whose medical history was unknown.
                    </small>
                  </Grid.Column>

                </Grid.Row>
              </Grid>
              <Divider horizontal style={{ fontWeight: 600, color: '#232423', fontSize: '16pt', paddingTop: '1em', paddingBottom: "0em" }}>Confirmed cases per capita by demographic group in {countyName}</Divider>
              <Grid style={{ width: "1260px" }}>
                {datades_cases[stateFips + countyFips]['NObs'] < 50 && datades_cases[stateFips + countyFips]['outcome'] === 'COVID Death' ?
                  <Header as='h2' style={{ fontWeight: 400 }}>
                    <Header.Content>
                      <Header.Subheader style={{ fontWeight: 300, fontSize: '16pt', color: 'black' }}>
                        Rates broken down by age, sex, and race are not shown for {countyName} because there are fewer than 50 confirmed COVID-19 cases with complete information.
                </Header.Subheader>
                    </Header.Content>
                  </Header>
                  :
                  <Grid.Row columns={3} style={{ paddingTop: 0 }}>
                    <Grid.Column>
                      <BarChart
                        title="Age Group"
                        keyv={["< 18", "18-44", "45-64", "65+"]}
                        var={["rate017ageC", "rate1844ageC", "rate4564ageC", "rate65ageC"]}
                        width={400}
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data_cases} />
                    </Grid.Column>
                    <Grid.Column>
                      <BarChart
                        title="Sex"
                        keyv={["Female", "Male"]}
                        var={["female_rateC", "male_rateC"]}
                        pad={25}
                        width={400}
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data_cases} />
                    </Grid.Column>
                    <Grid.Column>
                      <BarChart
                        title="Race"
                        keyv={["Other", "Hispanic", "Black", "White"]}
                        var={["otherNH_rateC", "hispanic_rateC", "black_rateC", "white_rateC"]}
                        width={400}
                        stateFips={stateFips}
                        countyFips={countyFips}
                        data={data_cases} />
                    </Grid.Column>
                  </Grid.Row>
                }
                {datades_cases[stateFips + countyFips]['NObs'] < 50 && datades_cases[stateFips + countyFips]['outcome'] === 'COVID Death' ? ' ' :
                  <Grid.Row columns={3} style={{ padding: 0 }}>
                    <Grid.Column style={{ paddingLeft: '3em', paddingRight: '0em' }}>
                      <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                        This chart shows the number of total cases per 100,000 residents by age group for <b>{countyName}</b>. The chart excludes data from {datades_cases[stateFips + countyFips]['age4catPmiss'].toFixed(2)}% of confirmed cases who were missing information on age.
                    </small>
                    </Grid.Column>
                    <Grid.Column style={{ paddingLeft: '2em', paddingRight: '0em' }}>
                      <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                        This chart shows the number of total cases per 100,000 residents by sex for <b>{countyName}</b>. The chart excludes data from {datades_cases[stateFips + countyFips]['femalePmiss'].toFixed(2)}% of confirmed cases who were missing information on sex.
                    </small>
                    </Grid.Column>
                    <Grid.Column style={{ paddingLeft: '2em', paddingRight: '0em' }}>
                      <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                        This chart shows the total cases per 100,000 residents by race/ethnicity for <b>{countyName}</b>. The chart excludes data from {datades_cases[stateFips + countyFips]['race_3Pmiss'].toFixed(2)}% of confirmed cases who were missing information on race/ethnicity.                    </small>
                    </Grid.Column>
                  </Grid.Row>}
              </Grid>

              <Divider horizontal style={{ fontWeight: 600, color: '#232423', fontSize: '16pt', paddingTop: '1em', paddingBottom: "0em" }}>Deaths per capita by demographic group in {countyName}</Divider>
              <Grid style={{ width: "1260px" }}>
                {!(datades_deaths[stateFips + countyFips]) ? <Header as='h2' style={{ fontWeight: 400, paddingTop: '0.5em' }}>
                  <Header.Content>
                    <Header.Subheader style={{ fontWeight: 300, fontSize: '16pt' }}>
                      Rates broken down by age, sex, and race are not shown for {countyName} because there are fewer than 50 confirmed COVID-19 deaths with complete information.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                  :
                  datades_deaths[stateFips + countyFips]['NObs'] < 50 && datades_deaths[stateFips + countyFips]['outcome'] === 'COVID Death' ?
                    <Header as='h2' style={{ fontWeight: 400, paddingTop: '0.5em' }}>
                      <Header.Content>
                        <Header.Subheader style={{ fontWeight: 300, fontSize: '16pt' }}>
                          Rates broken down by age, sex, and race are not shown for {countyName} because there are fewer than 50 confirmed COVID-19 deaths with complete information.
                    </Header.Subheader>
                      </Header.Content>
                    </Header>
                    :
                    <Grid.Row columns={3} style={{ paddingTop: 0 }}>
                      <Grid.Column>
                        <BarChart
                          title="Age Group"
                          keyv={["< 18", "18-44", "45-64", "65+"]}
                          var={["rate017ageD", "rate1844ageD", "rate4564ageC", "rate65ageD"]}
                          width={400}
                          stateFips={stateFips}
                          countyFips={countyFips}
                          data={data_deaths} />
                      </Grid.Column>
                      <Grid.Column>
                        <BarChart
                          title="Sex"
                          keyv={["Female", "Male"]}
                          var={["female_rateD", "male_rateD"]}
                          width={400}
                          pad={25}
                          stateFips={stateFips}
                          countyFips={countyFips}
                          data={data_deaths} />
                      </Grid.Column>
                      <Grid.Column>
                        <BarChart
                          title="Race"
                          keyv={["Other", "Hispanic", "Black", "White"]}
                          var={["otherNH_rateD", "hispanic_rateD", "black_rateD", "white_rateD"]}
                          width={400}
                          stateFips={stateFips}
                          countyFips={countyFips}
                          data={data_deaths} />
                      </Grid.Column>
                    </Grid.Row>}
                {!(datades_deaths[stateFips + countyFips]) ? ' ' :


                  datades_deaths[stateFips + countyFips]['NObs'] < 50 && datades_deaths[stateFips + countyFips]['outcome'] === 'COVID Death' ? ' ' :
                    <Grid.Row columns={3} style={{ padding: 0 }}>
                      <Grid.Column style={{ paddingLeft: '3em', paddingRight: '0em' }}>
                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                          This chart shows the number of total deaths per 100,000 residents by age group for <b>{countyName}</b>. The chart excludes data from {datades_deaths[stateFips + countyFips]['age4catPmiss'].toFixed(2)}% of confirmed deaths who were missing information on age.
                    </small>
                      </Grid.Column>
                      <Grid.Column style={{ paddingLeft: '2em', paddingRight: '0em' }}>
                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                          This chart shows the number of total deaths per 100,000 residents by sex for <b>{countyName}</b>. The chart excludes data from {datades_deaths[stateFips + countyFips]['femalePmiss'].toFixed(2)}% of confirmed deaths who were missing information on sex.
                    </small>
                      </Grid.Column>
                      <Grid.Column style={{ paddingLeft: '2em', paddingRight: '0em' }}>
                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                          This chart shows the total deaths per 100,000 residents by race/ethnicity for <b>{countyName}</b>. The chart excludes data from {datades_deaths[stateFips + countyFips]['race_3Pmiss'].toFixed(2)}% of confirmed deaths who were missing information on race/ethnicity.                    </small>
                      </Grid.Column>
                    </Grid.Row>}
              </Grid>
              <Divider horizontal style={{ fontWeight: 600, color: '#232423', fontSize: '16pt', paddingTop: '1em' }}>{countyName} characteristics</Divider>
              <Header as='h2' style={{ fontWeight: 400 }}>
                <Header.Content>
                  <Header.Subheader style={{ fontWeight: 300, fontSize: '16pt', color: 'black' }}>
                    Social, economic, health and environmental factors impact an individual’s risk of infection and COVID-19 severity.
                    Counties with large groups of vulnerable people may be disproportionately impacted by COVID-19. The table below characterizes <b>{countyName}</b>, Georgia, and the United States.
                    </Header.Subheader>
                </Header.Content>
              </Header>
              <small style={{ fontWeight: 300, color: 'black' }}>
                <div>Note: These are not characteristics of covid.</div>
              </small>
              <Table striped compact basic='very'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Characteristic</Table.HeaderCell>
                    <Table.HeaderCell>{countyName}</Table.HeaderCell>
                    <Table.HeaderCell>{stateName}</Table.HeaderCell>
                    <Table.HeaderCell>United States</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {_.map(data[stateFips + countyFips],
                    (v, k) => {
                      var rmList = ["cases", "deaths", "dailycases", "dailydeaths", "mean7daycases", "mean7daydeaths", "covidmortality"
                        , "caserate", "covidmortality7day", "caserate7day"];
                      if (!rmList.includes(k)) {
                        return (
                          <Table.Row key={k}>
                            <Table.Cell>{varMap[k] ? varMap[k].name : k}</Table.Cell>
                            <Table.Cell>{isNaN(v) ? v : (Math.round(v * 100) / 100)}</Table.Cell>
                            <Table.Cell>{isNaN(data[stateFips][k]) ? data[stateFips][k] : (Math.round(data[stateFips][k] * 100) / 100)}</Table.Cell>
                            <Table.Cell>{isNaN(data['_nation'][k]) ? data['_nation'][k] : (Math.round(data['_nation'][k] * 100) / 100)}</Table.Cell>
                          </Table.Row>
                        )
                      }
                    })}
                </Table.Body>
              </Table>
            </div>
          }
          {/* <Divider horizontal style={{ fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em' }}></Divider> */}
          <small>
            <div style={{ paddingTop: '1em', paddingBottom: '1em' }}><a href="/data-sources">Data source and interpretation</a></div>
          </small>
        </Container>
        <ReactTooltip>{tooltipContent}</ReactTooltip>

      </div>
    );
  } else {
    return <Loader active inline='centered' />
  }



}