import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, Loader, Statistic, Table, Divider,List } from 'semantic-ui-react'
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
import { scaleQuantile } from "d3-scale";

const countyColor = '#f2a900';
const stateColor = '#b2b3b3';
const nationColor = '#d9d9d7';
const colorPalette = [
  "#e1dce2",
  "#d3b6cd",
  "#bf88b5",
  "#af5194",
  "#99528c",
  "#633c70",
];
// const colorPalette = [
//   "#e9f3fc",
//   "#91c1ee",
//   "#65a8e7", 
//   "#2283dd", 
//   "#185b9a", 
//   "#d80000", 
// ];

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

function BarChart(props) {
  const colors = {
    "0": nationColor,
    "1": stateColor,
    "2": countyColor
  };
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={props.width || 560}
      height={140}
      domainPadding={10}
      scale={{ y: props.ylog ? 'log' : 'linear' }}
      minDomain={{ y: props.ylog ? 1 : 0 }}
      padding={{ left: 60, right: 50, top: 40, bottom: 50 }}
      containerComponent={<VictoryContainer responsive={false} />}
    >
      <VictoryLabel text={props.title} x={(props.width || 560) / 2} y={30} textAnchor="middle" />
      <VictoryAxis />
      <VictoryAxis dependentAxis />
      <VictoryBar
        horizontal
        barRatio={0.8}
        labels={({ datum }) => (Math.round(datum.value * 100) / 100)}
        data={[{ key: props.keyv[0], 'value': props.data['_nation'][props.var] || 0, 'colors': '0' },
        { key: props.keyv[1], 'value': props.data[props.stateFips][props.var] || 0, 'colors': '1' },
        { key: props.keyv[2], 'value': props.data[props.stateFips + props.countyFips][props.var] || 0, 'colors': '2' }]}
        labelComponent={<VictoryLabel dx={5} style={{ fill: ({ datum }) => colors[datum.key] }} />}
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
  const [configsCounty, setConfig] = useState();
  const [stateName, setStateName] = useState('Georgia');
  const [countyName, setCountyName] = useState('');
  const [zipCode, setZipCode] = useState('30328');
  const [zipCodeH, setZipCodeH] = useState('30328');
  const [zipCodeD, setZipCodeD] = useState('30328');
  const [zipCodeFinal, setZipCodeFinal] = useState('30328');
  const history = useHistory();
  const [data, setData] = useState();
  const [dataZip, setDataZip] = useState();
  const [dataTS, setDataTS] = useState();

  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);

  // const [metric, setMetric] = useState('mean7daycases');
  const [tooltipContent, setTooltipContent] = useState('');
  const [covidMetric, setCovidMetric] = useState({ cases: 'N/A', meandaily: 'N/A', totalcases: 'N/A', t: 'n/a' });
  const [covidMetric14, setCovidMetric14] = useState({ cases: 'N/A', meandaily: 'N/A', totalcases: 'N/A', t: 'n/a' });
  const [varMap, setVarMap] = useState({});
  const [colorScale, setColorScale] = useState();
  // const [countyFips, setCountyFips] = useState('');

  useEffect(() => {

    const configMatched = configscounty.find(s => s.countyfips === countyFips);

    // let projection = d3.geoAlbersUsa();
    // // let gps = [-85.504701, 34.855196]
    // let gps = [-0.6, 38.7]
    // console.log(projection.center)
    // console.log(countyfips);

    console.log(configMatched);
    if (!configMatched || !fips2county[stateFips + countyFips]) {
      history.push('/');
    } else {
      setConfig(configMatched);
      // setStateName(configMatched.name);
      setCountyName(fips2county[stateFips + countyFips]);

      fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
        .then(x => setVarMap(x));

      fetch('/data/data.json').then(res => res.json())
        .then(x => setData(x));

      fetch('/data/zipcode.json').then(res => res.json())
        .then(x => setDataZip(x));

      fetch('/data/' + stateFips + '_county_timeseries' + '.json').then(res => res.json())
        .then(x => setDataTS(x));

      fetch('/data/zipcode.json').then(res => res.json())
        .then(x => {
          setDataZip(x);

          const cs = scaleQuantile()
            .domain(_.map(_.filter(_.map(x, (d, k) => {
              d.fips = k
              return d
            }),
              d => (
                d.confirmed >= 0 &&
                d.fips.length === 5)),
              d => d['confirmed']))
            .range(colorPalette);

          let scaleMap = {}
          _.each(_.filter(_.map(x, (d, k) => {
            d.fips = k
            return d
          }),
            d => (
              d.confirmed >= 0 &&
              d.fips.length === 5))
            , d => {
              scaleMap[d['confirmed']] = cs(d['confirmed'])
            });
          setColorScale(scaleMap);

          var max = 0
          var min = 100
          var length = 0
          _.each(x, d => {
            length = length + 1
            if (d['confirmed'] > max && d.fips.length === 5) {
              max = d['confirmed'];
              // console.log(d.fips)
            } else if (d.fips.length === 5 && d['confirmed'] < min && d['confirmed'] >= 0) {
              min = d['confirmed']
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
                d.confirmed >= 0 &&
                d.fips.length === 5)),
              d => d['confirmed']))
            .range(colorPalette);

          setLegendSplit(split.quantiles());
          console.log(split.quantiles());
        });
    }
  }, []);

  useEffect(() => {
    if (dataTS && dataTS[stateFips + countyFips]) {
      setCovidMetric(_.takeRight(dataTS[stateFips + countyFips])[0]);
      setCovidMetric14(_.takeRight(dataTS[stateFips + countyFips], 14)[0]);

    }
  }, [dataTS])

  if (data && dataTS && varMap) {

    return (
      <div>
        <AppBar menu='countyReport' />
        <Container style={{ marginTop: '8em', minWidth: '960px' }}>
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
                  <span style={{ color: countyColor }}>{countyName}</span>
                  {/* <Header.Subheader style={{fontWeight: 300}}>
              See how health determinants impact COVID-19 outcomes. 
              </Header.Subheader> */}
                </Header.Content>
              </Header>
              <Grid style={{ paddingTop: '2em' }}>
                <Grid.Row style={{ paddingTop: '2em' }}>
                  <Table celled fixed singleLine>
                    <Table.Header>
                      <Table.Row textAlign='center'>
                      <Table.HeaderCell />
                        <Table.HeaderCell >Total to date</Table.HeaderCell>
                        <Table.HeaderCell >Total per 100,000</Table.HeaderCell>
                        <Table.HeaderCell >Daily average</Table.HeaderCell>
                        <Table.HeaderCell >Daily average per 100,000</Table.HeaderCell>
                        <Table.HeaderCell>Case fatality <br/>ratio</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      <Table.Row textAlign='center'>
                      <Table.Cell><strong>Cases</strong></Table.Cell>
                        <Table.Cell>121045</Table.Cell>
                        <Table.Cell>761</Table.Cell>
                        <Table.Cell>7861</Table.Cell>
                        <Table.Cell>786</Table.Cell>
                        <Table.Cell rowSpan='2'>Deaths:Cases <br/>.05</Table.Cell>
                      </Table.Row>
                      <Table.Row textAlign='center'>
                      <Table.Cell><strong>Deaths</strong></Table.Cell>
                        <Table.Cell>45627</Table.Cell>
                        <Table.Cell>7861</Table.Cell>
                        <Table.Cell>786</Table.Cell>
                        <Table.Cell>13</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  {/* <Grid.Column>
                    <Statistic size='small'>
                      <Statistic.Label>Total Cases</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.cases === null ? '0' : covidMetric.cases.toLocaleString()}
                      </Statistic.Value>
                    </Statistic>
                    <Statistic style={{ paddingLeft: '2em' }} size='small'>
                      <Statistic.Label>Total Hospitalizations</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.deaths === null ? '0' : Math.round(covidMetric.meandaily, 2).toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                    <Statistic style={{ paddingLeft: '2em' }} size='small'>
                      <Statistic.Label>Total Deaths</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.deaths === null ? '0' : Math.round(covidMetric.meandaily, 2).toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                  </Grid.Column> */}
                {/* </Grid.Row>
                <Grid.Row style={{ paddingTop: '2em' }}>
                  <span style={{ padding: '1em', color: '#bdbfc1' }}>Last updated on {covidMetric.t === 'n/a' ? 'N/A' : (new Date(covidMetric.t * 1000).toLocaleDateString())}</span>
                  </Grid.Row>
                {/* <Divider horizontal style={{ fontWeight: 300, color: '#565757', fontSize: '1.2em', paddingTop: '1em' }}>Data Per 100,000 populations</Divider>
                <Grid.Row style={{ paddingTop: '2em' }}>
                  <Grid.Column>
                    <Statistic size='small'>
                      <Statistic.Label>Total cases </Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.cases === null ? '0' : covidMetric.cases.toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                    <Statistic style={{ paddingLeft: '2em' }} size='small'>
                      <Statistic.Label>Total Hospitalizations</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.deaths === null ? '0' : Math.round(covidMetric.meandaily, 2).toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                    <Statistic style={{ paddingLeft: '2em' }} size='small'>
                      <Statistic.Label>Total Deaths</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.deaths === null ? '0' : Math.round(covidMetric.meandaily, 2).toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                  </Grid.Column>
                </Grid.Row>
                <Divider horizontal style={{ fontWeight: 300, color: '#565757', fontSize: '1.2em', paddingTop: '1em' }}>Daily Rolling Average</Divider>
                <Grid.Row style={{ paddingTop: '2em' }}>
                  <Grid.Column>
                    <Statistic size='small'>
                      <Statistic.Label>Daily Cases</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.cases === null ? '0' : covidMetric.cases.toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                    <Statistic style={{ paddingLeft: '2em' }} size='small'>
                      <Statistic.Label>Daily Hospitalizations</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.deaths === null ? '0' : Math.round(covidMetric.meandaily, 2).toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                    <Statistic style={{ paddingLeft: '2em' }} size='small'>
                      <Statistic.Label>Daily Deaths</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.deaths === null ? '0' : Math.round(covidMetric.meandaily, 2).toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                  </Grid.Column>
                </Grid.Row >
                <Divider horizontal style={{ fontWeight: 300, color: '#565757', fontSize: '1.2em', paddingTop: '1em' }}>Changes in the past 14 days</Divider>
                <Grid.Row style={{ paddingTop: '2em' }}>
                  <Grid.Column>
                    <Statistic size='small'>
                      <Statistic.Label>Total cases</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric14.cases === null ? '0' : (Number(covidMetric.totalcases) - Number(covidMetric14.totalcases)).toString().toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                    <Statistic style={{ paddingLeft: '2em' }} size='small'>
                      <Statistic.Label>Total Hospitalizations</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.deaths === null ? '0' : (Number(covidMetric.cases) - Number(covidMetric14.cases)).toString().toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                    <Statistic style={{ paddingLeft: '2em' }} size='small'>
                      <Statistic.Label>Total Deaths</Statistic.Label>
                      <Statistic.Value>
                        {covidMetric.deaths === null ? '0' : (Math.round((Number(covidMetric.meandaily) - Number(covidMetric14.meandaily)) * 100) / 100).toString().toLocaleString()}
                      </Statistic.Value>

                    </Statistic>
                    <span style={{ padding: '16.5em', color: '#bdbfc1' }}>Last updated on {covidMetric.t === 'n/a' ? 'N/A' : (new Date(covidMetric.t * 1000).toLocaleDateString())}</span>
                  </Grid.Column> */}
                </Grid.Row>

              </Grid>

              <Divider horizontal style={{ fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em' }}></Divider>
              <Grid column={2} style={{ paddingTop: '2em' }}>
                <Grid.Row style={{ paddingTop: '2em' }}>
                  <Grid.Column width={7}>
                    <VictoryChart theme={VictoryTheme.material}
                      containerComponent={
                        <VictoryVoronoiContainer
                          // voronoiBlacklist={["Line"]}
                          labels={({ datum }) => `${new Date(datum.t * 1000).toLocaleDateString()}\n` + `New cases: ${Math.round(datum.cases, 2)}\n` + `Moving Average:${Math.round(datum.meandaily, 2)}`}
                          labelComponent={
                            <VictoryTooltip dy={-7} constrainToVisibleArea
                              style={{ fontSize: 15 }} />
                          }
                        />
                      }
                      width={550}
                      height={350}
                      padding={{ left: 50, right: 60, top: 60, bottom: 30 }}>
                      <VictoryLabel style={{
                        textAnchor: "start",
                        verticalAnchor: "end", fill: "#000000", fontFamily: "inherit",
                        fontSize: "28px", fontWeight: "bold"
                      }} text="Confirmed cases per 100,000 population
                  " x={15} y={28} textAnchor="middle" />
                      <VictoryLegend
                        x={10} y={35}
                        orientation="horizontal"
                        colorScale={[stateColor, countyColor]}
                        data={[
                          { name: "New Cases" }, { name: "7-day Moving Average" }
                        ]}
                      />

                      <VictoryAxis
                        tickFormat={(t) => new Date(t * 1000).toLocaleDateString()}
                        tickValues={[
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) * 3 - 1].t,
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) * 2 - 1].t,
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) - 1].t,
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - 1].t]} />
                      <VictoryAxis dependentAxis tickCount={5}
                        tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                      />

                      <VictoryBar style={{ data: { fill: stateColor } }} barWidth={4} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                        x='t' y='cases'
                      />
                      <VictoryLine name="Line" style={{ data: { stroke: countyColor } }} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                        x='t' y='meandaily'
                      />
                    </VictoryChart>
                  </Grid.Column>
                  <Grid.Column width={9}>
                    <Header as='h2' style={{ fontWeight: 400, paddingLeft: '2em' }}>
                      <Header.Content>
                        <strong>Zip code heat map of confirmed cases</strong>
                        {/* <Header.Subheader style={{fontWeight: 300}}>.</Header.Subheader> */}
                      </Header.Content>
                    </Header>
                    <svg width="120" height="300" style={{ paddingLeft: '3.5em' }}>
                      {_.map(colorPalette, (color, i) => {
                        return <rect key={i} y={20 * i} x={25} width="20" height="20" style={{ fill: colorPalette[(colorPalette.length - 1 - i).toString()], strokeWidth: 1, stroke: colorPalette[(colorPalette.length - 1 - i).toString()] }} />
                      })}
                      {/* <text y={15} x={47} style={{fontSize: '0.8em'}}>High</text>
                  <text y={20 * (colorPalette.length)} x={47} style={{fontSize: '0.8em'}}>Low</text> */}
                      {_.map(legendSplit, (splitpoint, i) => {
                        if (legendSplit[i] < 1) {
                          return <text key={i} y={21 * (legendSplit.length - i)} x={47} style={{ fontSize: '0.8em' }}> {legendSplit[i].toFixed(1)}</text>
                        }
                        return <text key={i} y={21 * ((legendSplit.length - i))} x={47} style={{ fontSize: '0.8em' }}> {legendSplit[i].toFixed(0)}</text>
                      })}
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
                              },
                              // hover: {
                              //    fill: "#CFD8DC",
                              //    stroke: "#607D8B",
                              //    strokeWidth: 1,
                              //    outline: "none",
                              // },
                              // pressed: {
                              //    fill: "#FF5722",
                              //    stroke: "#607D8B",
                              //    strokeWidth: 1,
                              //    outline: "none",
                              // }
                            }}
                            onMouseEnter={(event) => {
                              // setCountyFips(geo.properties.COUNTYFP);
                              setCountyName(fips2county[stateFips + geo.properties.COUNTYFP]);
                              setZipCode(geo.properties.ZCTA5CE10);
                              setZipCodeFinal(geo.properties.ZCTA5CE10);
                              setTooltipContent(<div><font size="+2"><b >{geo.properties.ZCTA5CE10}</b> </font> <br />
                                <b>Daily Test</b>: {dataZip[geo.properties.ZCTA5CE10]['test']} <br />
                                <b>Daily Confirmed</b>: {dataZip[geo.properties.ZCTA5CE10]['confirmed']} <br />
                              </div>);
                            }}
                            onMouseLeave={(event) => {
                              setTooltipContent("")
                            }}
                            fill={zipCode === geo.properties.ZCTA5CE10 ? countyColor :
                              ((colorScale && dataZip[geo.properties.ZCTA5CE10] && dataZip[geo.properties.ZCTA5CE10]['confirmed']) ?
                                colorScale[dataZip[geo.properties.ZCTA5CE10]['confirmed']] : colorPalette[0])}
                          />
                        )}
                      </Geographies>
                    </ComposableMap>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ paddingTop: '2em' }}>
                  <Grid.Column width={7}>
                    <VictoryChart theme={VictoryTheme.material}
                      containerComponent={
                        <VictoryVoronoiContainer
                          // voronoiBlacklist={["Line"]}
                          labels={({ datum }) => `${new Date(datum.t * 1000).toLocaleDateString()}\n` + `New cases: ${Math.round(datum.cases, 2)}\n` + `Moving Average:${Math.round(datum.meandaily, 2)}`}
                          labelComponent={
                            <VictoryTooltip dy={-7} constrainToVisibleArea
                              style={{ fontSize: 15 }} />
                          }
                        />
                      }
                      width={550}
                      height={350}
                      padding={{ left: 50, right: 60, top: 60, bottom: 30 }}>
                      <VictoryLabel style={{
                        textAnchor: "start",
                        verticalAnchor: "end", fill: "#000000", fontFamily: "inherit",
                        fontSize: "28px", fontWeight: "bold"
                      }} text="Hospitalizations per 100,000 population
                  " x={15} y={28} textAnchor="middle" />
                      <VictoryLegend
                        x={10} y={35}
                        orientation="horizontal"
                        colorScale={[stateColor, countyColor]}
                        data={[
                          { name: "New Cases" }, { name: "7-day Moving Average" }
                        ]}
                      />
                      <VictoryAxis
                        tickFormat={(t) => new Date(t * 1000).toLocaleDateString()}
                        tickValues={[
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) * 3 - 1].t,
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) * 2 - 1].t,
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) - 1].t,
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - 1].t]} />
                      <VictoryAxis dependentAxis tickCount={5}
                        tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                      />

                      <VictoryBar style={{ data: { fill: stateColor } }} barWidth={4} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                        x='t' y='cases'
                      />
                      <VictoryLine name="Line" style={{ data: { stroke: countyColor } }} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                        x='t' y='meandaily'
                      />
                    </VictoryChart>
                  </Grid.Column>
                  <Grid.Column width={9}>
                    <Header as='h2' style={{ fontWeight: 400, paddingLeft: '2em' }}>
                      <Header.Content>
                        <strong>Zip code heat map of hospitalizations</strong>
                        {/* <Header.Subheader style={{fontWeight: 300}}>.</Header.Subheader> */}
                      </Header.Content>
                    </Header>
                    <svg width="120" height="300" style={{ paddingLeft: '3.5em' }}>
                      {_.map(colorPalette, (color, i) => {
                        return <rect key={i} y={20 * i} x={25} width="20" height="20" style={{ fill: colorPalette[(colorPalette.length - 1 - i).toString()], strokeWidth: 1, stroke: colorPalette[(colorPalette.length - 1 - i).toString()] }} />
                      })}
                      {/* <text y={15} x={47} style={{fontSize: '0.8em'}}>High</text>
                  <text y={20 * (colorPalette.length)} x={47} style={{fontSize: '0.8em'}}>Low</text> */}
                      {_.map(legendSplit, (splitpoint, i) => {
                        if (legendSplit[i] < 1) {
                          return <text key={i} y={21 * (legendSplit.length - i)} x={47} style={{ fontSize: '0.8em' }}> {legendSplit[i].toFixed(1)}</text>
                        }
                        return <text key={i} y={21 * ((legendSplit.length - i))} x={47} style={{ fontSize: '0.8em' }}> {legendSplit[i].toFixed(0)}</text>
                      })}
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
                              // pressed: {
                              //    fill: "#FF5722",
                              //    stroke: "#607D8B",
                              //    strokeWidth: 1,
                              //    outline: "none",
                              // }
                            }}
                            onMouseEnter={() => {
                              // setCountyFips(geo.properties.COUNTYFP);
                              setCountyName(fips2county[stateFips + geo.properties.COUNTYFP]);
                              setZipCodeH(geo.properties.ZCTA5CE10);
                              // console.log(geo.rsmKey);
                              setTooltipContent(<div><font size="+2"><b >{geo.properties.ZCTA5CE10}</b> </font> <br />
                                <b>Daily Test</b>: {dataZip[geo.properties.ZCTA5CE10]['test']} <br />
                                <b>Daily Confirmed</b>: {dataZip[geo.properties.ZCTA5CE10]['confirmed']} <br />
                              </div>);
                            }}
                            onMouseLeave={() => {
                              setTooltipContent("")
                            }}
                            fill={zipCodeH === geo.properties.ZCTA5CE10 ? countyColor :
                              ((colorScale && dataZip[geo.properties.ZCTA5CE10] && dataZip[geo.properties.ZCTA5CE10]['confirmed']) ?
                                colorScale[dataZip[geo.properties.ZCTA5CE10]['confirmed']] : colorPalette[0])}
                          />
                        )}
                      </Geographies>
                    </ComposableMap>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ paddingTop: '2em' }}>
                  <Grid.Column width={7}>
                    <VictoryChart theme={VictoryTheme.material}
                      containerComponent={
                        <VictoryVoronoiContainer
                          // voronoiBlacklist={["Line"]}
                          labels={({ datum }) => `${new Date(datum.t * 1000).toLocaleDateString()}\n` + `New cases: ${Math.round(datum.cases, 2)}\n` + `Moving Average:${Math.round(datum.meandaily, 2)}`}
                          labelComponent={
                            <VictoryTooltip dy={-7} constrainToVisibleArea
                              style={{ fontSize: 15 }} />
                          }
                        />
                      }
                      width={550}
                      height={350}
                      padding={{ left: 50, right: 60, top: 60, bottom: 30 }}>
                      <VictoryLabel style={{
                        textAnchor: "start",
                        verticalAnchor: "end", fill: "#000000", fontFamily: "inherit",
                        fontSize: "28px", fontWeight: "bold"
                      }} text="Deaths per 100,000 population
                  " x={15} y={28} textAnchor="middle" />
                      <VictoryLegend
                        x={10} y={35}
                        orientation="horizontal"
                        colorScale={[stateColor, countyColor]}
                        data={[
                          { name: "New Cases" }, { name: "7-day Moving Average" }
                        ]}
                      />
                      <VictoryAxis
                        tickFormat={(t) => new Date(t * 1000).toLocaleDateString()}
                        tickValues={[
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) * 3 - 1].t,
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) * 2 - 1].t,
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - Math.round(dataTS[stateFips + countyFips].length / 4) - 1].t,
                          dataTS[stateFips + countyFips][dataTS[stateFips + countyFips].length - 1].t]} />
                      <VictoryAxis dependentAxis tickCount={5}
                        tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                      />

                      <VictoryBar style={{ data: { fill: stateColor } }} barWidth={4} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                        x='t' y='cases'
                      />
                      <VictoryLine name="Line" style={{ data: { stroke: countyColor } }} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                        x='t' y='meandaily'
                      />
                    </VictoryChart>
                  </Grid.Column>
                  <Grid.Column width={9}>
                    <Header as='h2' style={{ fontWeight: 400, paddingLeft: '2em' }}>
                      <Header.Content>
                        <strong>Zip code heat map of deaths</strong>
                        {/* <Header.Subheader style={{fontWeight: 300}}>.</Header.Subheader> */}
                      </Header.Content>
                    </Header>
                    <svg width="120" height="300" style={{ paddingLeft: '3.5em' }}>
                      {/* <text x={0} y={8} style={{fontSize: '0.8em'}}>Confirmed cases by Zip code</text> */}
                      {_.map(colorPalette, (color, i) => {
                        return <rect key={i} y={20 * i} x={25} width="20" height="20" style={{ fill: colorPalette[(colorPalette.length - 1 - i).toString()], strokeWidth: 1, stroke: colorPalette[(colorPalette.length - 1 - i).toString()] }} />
                      })}
                      {/* <text y={15} x={47} style={{fontSize: '0.8em'}}>High</text>
                  <text y={20 * (colorPalette.length)} x={47} style={{fontSize: '0.8em'}}>Low</text> */}
                      {_.map(legendSplit, (splitpoint, i) => {
                        if (legendSplit[i] < 1) {
                          return <text key={i} y={21 * (legendSplit.length - i)} x={47} style={{ fontSize: '0.8em' }}> {legendSplit[i].toFixed(1)}</text>
                        }
                        return <text key={i} y={21 * ((legendSplit.length - i))} x={47} style={{ fontSize: '0.8em' }}> {legendSplit[i].toFixed(0)}</text>
                      })}
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
                              // pressed: {
                              //    fill: "#FF5722",
                              //    stroke: "#607D8B",
                              //    strokeWidth: 1,
                              //    outline: "none",
                              // }
                            }}
                            onMouseEnter={() => {
                              // setCountyFips(geo.properties.COUNTYFP);
                              // setCountyName(fips2county[stateFips+geo.properties.COUNTYFP]);
                              console.log(geo.properties.ZCTA5CE10);
                              setZipCodeD(geo.properties.ZCTA5CE10);
                              console.log(geo.properties.ZCTA5CE10);

                              // setZipCodeFinal(geo.properties.ZCTA5CE10);
                              setTooltipContent(<div><font size="+2"><b >{geo.properties.ZCTA5CE10}</b> </font> <br />
                                <b>Daily Test</b>: {dataZip[geo.properties.ZCTA5CE10]['test']} <br />
                                <b>Daily Confirmed</b>: {dataZip[geo.properties.ZCTA5CE10]['confirmed']} <br />
                              </div>);
                            }}
                            onMouseLeave={() => {
                              setTooltipContent("")
                            }}
                            fill={zipCodeD === geo.properties.ZCTA5CE10 ? countyColor :
                              ((colorScale && dataZip[geo.properties.ZCTA5CE10] && dataZip[geo.properties.ZCTA5CE10]['confirmed']) ?
                                colorScale[dataZip[geo.properties.ZCTA5CE10]['confirmed']] : colorPalette[0])}
                          />
                        )}
                      </Geographies>
                    </ComposableMap>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ paddingTop: 0 }}>
                  <small style={{ fontWeight: 300 }}>
                    Note: Data are provisional and subject to change. Zip codes may cross county boundaries. Zip codes being displayed include the total count of cases for that zip code.
                    </small>
                </Grid.Row>
              </Grid>
              <Divider horizontal style={{ fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em' }}>Composition of cases</Divider>
              <Grid columns={3} centered>
                <Grid.Row >
                  <Grid.Column>
                    <svg width="400" height="500" >
                      <VictoryLabel style={{
                        textAnchor: "start",
                        verticalAnchor: "end", fill: "#000000", fontFamily: "inherit",
                        fontSize: "20px", fontWeight: "bold"
                      }} text="Proportion of test positives
                  " x={50} y={28} textAnchor="middle" />
                      <VictoryPie
                        colorScale={['GoldenRod', 'Gray']}
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
                        colorScale={['GoldenRod', 'Gray']}
                        standalone={false}
                        x={210} y={350}
                        data={[{ name: "Positive test result", labels: { fontSize: 18 } },
                        { name: "Negative test result", labels: { fontSize: 18 } }
                        ]}
                      />
                    </svg>
                  </Grid.Column>
                  <Grid.Column>
                    <svg width="400" height="500" >
                      <VictoryLabel style={{
                        textAnchor: "start",
                        verticalAnchor: "end", fill: "#000000", fontFamily: "inherit",
                        fontSize: "20px", fontWeight: "bold"
                      }} text="Proportion of cases with symptoms
                  " x={15} y={28} textAnchor="middle" />
                      <VictoryPie
                        standalone={false}
                        colorScale={['GoldenRod', 'Gray']}
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
                        colorScale={['GoldenRod', 'Gray']}
                        x={200} y={350}
                        data={[{ name: "Did not have symptoms", labels: { fontSize: 18 } },
                        { name: "Had symptoms", labels: { fontSize: 18 } }
                        ]}
                      />
                    </svg>

                  </Grid.Column>
                  <Grid.Column>
                    <svg width="400" height="500" >
                      <VictoryLabel style={{
                        textAnchor: "start",
                        verticalAnchor: "end", fill: "#000000", fontFamily: "inherit",
                        fontSize: "20px", fontWeight: "bold"
                      }} text="Proportion of cases with a comorbidity
                  " x={15} y={28} textAnchor="middle" />
                      <VictoryPie
                        colorScale={['GoldenRod', 'Gray']}
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
                        colorScale={['GoldenRod', 'Gray']}
                        x={150} y={350}
                        data={[{ name: "No underlying conditions", labels: { fontSize: 18 } },
                        { name: "Underlying health condition", labels: { fontSize: 18 } }
                        ]}
                      />
                    </svg>

                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Divider horizontal style={{ fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em' }}>Rates by Demographic Groups</Divider>
              <Grid >
                <Header as='h2' style={{ fontWeight: 400 }}>
                  <Header.Content>
                    Confirmed cases per 100,000
                    {/* <Header.Subheader style={{fontWeight: 300}}>.</Header.Subheader> */}
                  </Header.Content>
                </Header>
                <Grid.Row columns={3} style={{ padding: 0 }}>
                  <Grid.Column>
                    <BarChart
                      title="Age group"
                      keyv={["< 24", "< 54", "> 55"]}
                      var="groupquater"
                      width={350}
                      stateFips={stateFips}
                      countyFips={countyFips}
                      data={data} />
                  </Grid.Column>
                  <Grid.Column>
                    <BarChart
                      title="Sex"
                      keyv={["Other", "Female", "Male"]}
                      var="groupquater"
                      width={350}
                      stateFips={stateFips}
                      countyFips={countyFips}
                      data={data} />
                  </Grid.Column>
                  <Grid.Column>
                    <BarChart
                      title="Race"
                      keyv={["Other", "Black", "White"]}
                      var="groupquater"
                      width={350}
                      stateFips={stateFips}
                      countyFips={countyFips}
                      data={data} />
                  </Grid.Column>
                </Grid.Row>
                <Header as='h2' style={{ fontWeight: 400 }}>
                  <Header.Content>
                    Hospitalizations per 100,000
                    {/* <Header.Subheader style={{fontWeight: 300}}>.</Header.Subheader> */}
                  </Header.Content>
                </Header>
                <Grid.Row columns={3} style={{ padding: 0 }}>
                  <Grid.Column>
                    <BarChart
                      title="Age group"
                      keyv={["< 24", "< 54", "> 55"]}
                      var="groupquater"
                      width={350}
                      stateFips={stateFips}
                      countyFips={countyFips}
                      data={data} />
                  </Grid.Column>
                  <Grid.Column>
                    <BarChart
                      title="Sex"
                      keyv={["Other", "Female", "Male"]}
                      var="groupquater"
                      width={350}
                      stateFips={stateFips}
                      countyFips={countyFips}
                      data={data} />
                  </Grid.Column>
                  <Grid.Column>
                    <BarChart
                      title="Race"
                      keyv={["Other", "Black", "White"]}
                      var="groupquater"
                      width={350}
                      stateFips={stateFips}
                      countyFips={countyFips}
                      data={data} />
                  </Grid.Column>
                </Grid.Row>
                <Header as='h2' style={{ fontWeight: 400 }}>
                  <Header.Content>
                    Deaths per 100,000
                    {/* <Header.Subheader style={{fontWeight: 300}}>.</Header.Subheader> */}
                  </Header.Content>
                </Header>
                <Grid.Row columns={3} style={{ padding: 0 }}>
                  <Grid.Column>
                    <BarChart
                      title="% Age group"
                      keyv={["< 24", "< 54", "> 55"]}
                      var="groupquater"
                      width={350}
                      stateFips={stateFips}
                      countyFips={countyFips}
                      data={data} />
                  </Grid.Column>
                  <Grid.Column>
                    <BarChart
                      title="Sex"
                      keyv={["Other", "Female", "Male"]}
                      var="groupquater"
                      width={350}
                      stateFips={stateFips}
                      countyFips={countyFips}
                      data={data} />
                  </Grid.Column>
                  <Grid.Column>
                    <BarChart
                      title="Race"
                      keyv={["Other", "Black", "White"]}
                      var="groupquater"
                      width={350}
                      stateFips={stateFips}
                      countyFips={countyFips}
                      data={data} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Divider horizontal style={{ fontWeight: 300, color: '#b1b3b3', fontSize: '1.2em', paddingTop: '1em' }}>County characteristics</Divider>
              <Table striped compact basic='very'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Variable Name</Table.HeaderCell>
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
            <div style={{paddingTop: '1em',paddingBottom: '1em'}}><a href="/data-sources">Data source and interpretation</a></div>
          </small>
        </Container>
        <ReactTooltip>{tooltipContent}</ReactTooltip>

      </div>
    );
  } else {
    return <Loader active inline='centered' />
  }



}