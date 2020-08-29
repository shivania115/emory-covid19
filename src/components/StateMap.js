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
import Slider from "@material-ui/core/Slider";


import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _ from 'lodash';
import { scaleQuantile, scaleLinear } from "d3-scale";
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
const colorPalette1 = [
    "#67335E",
    "#6B2A4D",
    "#70213B",
    "#74182A",
    '#7d0707'
];

const colorOut = '#7d0707';

const countyColor = '#f2a900';
const stateColor = '#bdbfc1';
const nationColor = '#d9d9d7';
const colorHighlight = '#f2a900';
const marks = [
    {
        value: 0,
        label: 'Mar 1',
    },
    {
        value: 10,
        label: 'April 1',
    },
    {
        value: 20,
        label: 'May 1',
    },
    {
        value: 30,
        label: 'June 1',
    },
];

function valuetext(value) {
    return `${value}°C`;
}

function SvgMap(props) {
    var lengthSplit1 = props.lengthSplit1;
    if (props.name === 'casescum') {
        return (
            <svg width="500" height="55">
                {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={50 + 25 * i} y={20} width="25" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                })}
                {_.map(colorPalette1, (color, i) => {
                    return <rect key={i} x={200 + 25 * i} y={20} width="25" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                })}

                {/* <rect x={180} y={20} width="25" height="20" style={{ fill: colorOut, strokeWidth: 1, stroke: colorOut }} /> */}
                <text x={50} y={52} style={{ fontSize: '0.8em' }}>Low</text>
                <text x={300} y={52} style={{ fontSize: '0.8em' }}>High</text>
                {_.map(props.legendSplit, (splitpoint, i) => {
                    if (props.legendSplit[i] < 1) {
                        return <text key={i} x={57 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit[i].toFixed(1)}</text>
                    }
                    if (props.legendSplit[i] >= 1000) {
                        return <text key={i} x={70 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(props.legendSplit[i] / 1000).toFixed(1) + "K"}</text>
                    }
                    return <text key={i} x={70 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit[i].toFixed(0)}</text>
                })}

                {_.map(props.legendSplit1, (splitpoint, i) => {
                    if (props.legendSplit1[i] >= 1000) {
                        return <text key={i} x={220 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(props.legendSplit1[i] / 1000).toFixed(1) + "K"}</text>
                    }
                    return <text key={i} x={220 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit1[i].toFixed(0)}</text>
                })}

                <text x={50} y={15} style={{ fontSize: '0.7em' }}> {(props.legendMin / 100).toFixed(0)} </text>
                <rect x={5} y={20} width="25" height="20" style={{ fill: "#FFFFFF", strokeWidth: 0.5, stroke: "#000000" }} />
                <text x={8} y={52} style={{ fontSize: '0.7em' }}> N/A </text>
            </svg>

        )
    }
    else {
        return (
            <svg width="500" height="55">
                {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={55 + 25 * i} y={20} width="25" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                })}

                <rect x={230} y={20} width="25" height="20" style={{ fill: colorOut, strokeWidth: 1, stroke: colorOut }} />
                <text x={55} y={52} style={{ fontSize: '0.8em' }}>Low</text>
                <text x={230} y={52} style={{ fontSize: '0.8em' }}>High</text>
                {_.map(props.legendSplit, (splitpoint, i) => {
                    if (props.legendSplit[i] < 1) {
                        return <text key={i} x={62 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit[i].toFixed(1)}</text>
                    }
                    if (props.legendSplit[i] >= 1000) {
                        return <text key={i} x={72 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(props.legendSplit[i] / 1000).toFixed(1) + "K"}</text>
                    }
                    return <text key={i} x={72 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit[i].toFixed(0)}</text>
                })}
                {props.legendMin < 100 ? <text x={55} y={15} style={{ fontSize: '0.7em' }}> {(props.legendMin / 1).toFixed(0)} </text> :
                    <text x={47} y={15} style={{ fontSize: '0.7em' }}> {(props.legendMin / 1).toFixed(0)} </text>
                }



                <text x={224} y={15} style={{ fontSize: '0.7em' }}>{props.legendSplit[colorPalette.length - 1] < 1 ? props.legendSplit[colorPalette.length - 1].toFixed(1)
                    : props.legendSplit[colorPalette.length - 1] > 1000 ?
                        (props.legendSplit[colorPalette.length - 1] / 1000).toFixed(1) + "K" : props.legendSplit[colorPalette.length - 1].toFixed(0)
                }</text>
                <text x={251} y={15} style={{ fontSize: '0.7em' }}>{props.legendMax}</text>
                <rect x={5} y={20} width="25" height="20" style={{ fill: "#FFFFFF", strokeWidth: 0.5, stroke: "#000000" }} />
                <text x={8} y={52} style={{ fontSize: '0.7em' }}> N/A </text>

                {/* <text x={250} y={42} style={{fontSize: '0.8em'}}> Click on a county below </text>
          <text x={250} y={52} style={{fontSize: '0.8em'}}> for a detailed report. </text> */}
            </svg>

        )
    }
}

function ChartGraph(props) {
    var varGraphPair = props.name;
    var dataTS;
    var metric = props.metric;
    var stateFips = props.stateFips;
    var countyFips = props.countyFips;

    if (props.metric === "casescum14dayR") {
        dataTS = props.data1;

        return (
            <VictoryChart theme={VictoryTheme.material}
                containerComponent={
                    <VictoryVoronoiContainer
                        voronoiBlacklist={["Line1", "Line14"]}
                        labels={({ datum }) => `${new Date(datum.t * 1000).toLocaleDateString()}\n` + `${varGraphPair[metric]['legend'][0]}: 
                    ${Math.round(datum[varGraphPair[metric]['name'][0]], 2)}\n` + `${varGraphPair[metric]['legend'][1]}:${Math.round(datum[varGraphPair[metric]['name'][1]], 2)}`}
                        labelComponent={
                            <VictoryTooltip dy={-7} constrainToVisibleArea
                                style={{ fontSize: 15 }} />
                        }
                    />
                }
                width={730}
                height={550}
                padding={{ left: 55, right: 70, top: 10, bottom: 50 }}>
                <VictoryAxis
                    style={{
                        tickLabels: { fontSize: 25, padding: 5 }
                    }}
                    tickFormat={(t) => new Date(t * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric' })}

                    tickValues={[
                        dataTS[dataTS.length - Math.round(dataTS.length / 4) * 3 - 1].t,
                        dataTS[dataTS.length - Math.round(dataTS.length / 4) * 2 - 1].t,
                        dataTS[dataTS.length - Math.round(dataTS.length / 4) - 1].t,
                        dataTS[dataTS.length - 1].t]}

                />
                <VictoryAxis dependentAxis tickCount={5}
                    style={{
                        tickLabels: { fontSize: 25, padding: 5 }
                    }}
                    tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                />
                <VictoryBar style={{ data: { fill: stateColor } }} barWidth={8} alignment="start" data={dataTS ? dataTS : props.data2["99999"]}
                    x='t' y={varGraphPair[metric]['name'][0]}
                />
                <VictoryLine name="Line1" style={{ data: { stroke: countyColor, strokeWidth: 5 } }} data={dataTS ? dataTS : props.data2["99999"]}
                    x='t' y={varGraphPair[metric]['name'][1]}
                />
                {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                    <VictoryAxis dependentAxis tickCount={5}
                        style={{
                            tickLabels: { fontSize: 25, padding: 5 }
                        }}
                        tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                    /> :
                    <VictoryLine name="Line11" style={{ data: { stroke: '#71c7ec', strokeWidth: 3 } }} data={_.takeRight(props.data2[stateFips], 14) ? _.takeRight(props.data2[stateFips], 14) : props.data2["99999"]}
                        x='t' y={varGraphPair[metric]['name'][1]} />}
            </VictoryChart>)
    }
    else {
        dataTS = props.data2;
        return (
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
                <VictoryLine name="Line1" style={{ data: { stroke: countyColor, strokeWidth: 5 } }} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                    x='t' y={varGraphPair[metric]['name'][1]}
                />
                {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                    <VictoryAxis dependentAxis tickCount={5}
                        style={{
                            tickLabels: { fontSize: 25, padding: 5 }
                        }}
                        tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                    /> :
                    <VictoryLine name="Line11" style={{ data: { stroke: '#71c7ec', strokeWidth: 3 } }} data={dataTS[stateFips] ? dataTS[stateFips] : dataTS["99999"]}
                        x='t' y={varGraphPair[metric]['name'][1]} />}
                {/* <VictoryLine name="Line14" style={{ data: { stroke: 'red', strokeDasharray: "5,5" } }} data={[{ x: covidMetric14.t, y: 0 }, { x: covidMetric14.t, y: legendMax_graph[stateFips + countyFips] }]}
                          /> */}
                {/* <VictoryLine name="Line14"
                            style={{ data: { stroke: 'red', strokeDasharray: "5,5" } }}
                            x={() => covidMetric14.t}
                          /> */}
            </VictoryChart>)
    }
}



export default function StateMap(props) {

    // let { stateFips } = useParams();
    const hig = '80';
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
    const [topTen, setTopTen] = useState([]);
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
    const [legendSplit1, setLegendSplit1] = useState([]);

    const [metric, setMetric] = useState('casescumR');
    const [metric_graph, setMetricGraph] = useState(['casesdaily', 'casesdailymean14']);

    const metricOptions1 = [{ key: 'cacum', value: 'casescum', text: 'Total COVID-19 cases' },
    { key: 'decum', value: 'deathscum', text: 'Total COVID-19 deaths' },
    { key: 'cacumr', value: 'casescumR', text: 'COVID-19 cases per 100,000 population' },
    { key: 'decumr', value: 'deathscumR', text: 'COVID-19 deaths per 100,000 population' },
    { key: 'cacum14R', value: 'casescum14dayR', text: 'Last two weeks cases per 100,000 population' }];

    const metricOptions2 = [{ key: 'cs', value: 'cs', text: 'Confirmed cases per 100,000 population' },
    { key: 'hp', value: 'hp', text: 'Hospitalizations per 100,000 population' },
    { key: 'ds', value: 'ds', text: 'Deaths per 100,000 population' }];
    const dropdownopt = {
        'casescum': 'Total COVID-19 cases', 'deathscum': 'Total COVID-19 deaths',
        'casescumR': 'COVID-19 cases per 100,000 population', 'deathscumR': 'COVID-19 deaths per 100,000 population'
    };

    const varGraphPair = {
        "casescum": { "name": ['casesdaily', 'casesdailymean7'], "legend": ['Daily cases', '7-d rolling average '] },
        "deathscum": { "name": ['deathsdaily', 'deathsdailymean7'], "legend": ['Daily deaths', '7-d rolling average '] },
        "casescumR": { "name": ['casesdailyR', 'casesdailymean7R'], "legend": ['Daily cases per 100,000', '7-d rolling average'] },
        "deathscumR": { "name": ['deathsdailyR', 'deathsdailymean7R'], "legend": ['Daily deaths per 100,000', '7-d rolling average'] },
        "casescum14dayR": { "name": ['casesdailyR', 'casesdailymean7R'], "legend": ['Last 14 days cases per 100,000', '7-d rolling average'] }
    };
    const [metricName, setMetricName] = useState('COVID-19 cases per 100,000 population');
    const varNameMap = {
        "casescum": { "name": 'cases', "text": "The map shows the total number of confirmed COVID-19 cases in each county as of " },
        "casescum14dayR": { "name": 'cases per 100,000 residents', "text": "The map shows the number of confirmed COVID-19 cases for past two weeks in each county as of " },
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
                    setData(x);
                    setDataUs(x);
                    if (metric === 'casescum') {

                        _.map(x, (d, k) => {
                            d.fips = k
                            return d
                        });
                        var temp_Data_metric = [];
                        // retrieve metric data as list
                        _.each(x, d => {
                            if (d.fips.length === 5 && d.fips[0] === '1' && d.fips[1] === '3') {
                                temp_Data_metric.push(d[metric]);
                            }
                        });

                        temp_Data_metric.sort(function (a, b) {
                            return a - b;
                        });
                        var countIqr = 3 * quantile(temp_Data_metric, 0.75) - 2 * quantile(temp_Data_metric, 0.25);
                        // console.log(temp_Data_metric);
                        //   var top10 = _.takeRight(temp_Data_metric,10)[0];

                        //   var belowIqr = _.map(_.filter(temp_Data_metric,
                        //     d => (d<top10
                        //       )),
                        //     d => d);
                        // console.log(belowTop)
                        var belowIqr = _.map(_.filter(temp_Data_metric,
                            d => (d < countIqr
                            )),
                            d => d);

                        var upIqr = _.map(_.filter(temp_Data_metric,
                            d => (d >= countIqr
                            )),
                            d => d);

                        var split = scaleQuantile()
                            .domain(belowIqr).range(colorPalette);
                        var split1 = scaleQuantile()
                            .domain(upIqr).range(colorPalette1);
                        console.log(split.quantiles())
                        console.log(split1.quantiles())


                        var thr = [];
                        var thr1 = [];
                        for (i = 0; i < split1.quantiles().length; i++) {
                            thr1[i] = split1.quantiles()[i];
                        }
                        thr1.push(_.takeRight(temp_Data_metric)[0]);

                        for (i = 0; i < split.quantiles().length; i++) {
                            thr[i] = split.quantiles()[i];
                        }
                        thr.push(Math.round(countIqr / 100) * 100);

                        console.log(thr1);
                        var i;
                        for (i = 0; i < thr.length; i++) {
                            if (thr[i] < 100) {
                                thr[i] = Math.round(thr[i] / 10) * 10;
                            }
                            else {
                                thr[i] = Math.round(thr[i] / 100) * 100;
                            }
                        }
                        for (i = 0; i < thr1.length; i++) {
                            if (thr1[i] < 100) {
                                thr1[i] = Math.floor(thr1[i] / 10) * 10;
                            }
                            else {
                                thr1[i] = Math.floor(thr1[i] / 100) * 100;
                            }

                        }
                        console.log(thr1)

                        const csUs = {};
                        var indexColor;
                        _.map(belowIqr, d => {
                            if (d >= 0 && d <= thr[0]) {
                                csUs[d] = colorPalette[0];
                            };
                            if (d > thr[0] && d <= thr[1]) {
                                csUs[d] = colorPalette[1];
                            }
                            if (d > thr[1] && d <= thr[2]) {
                                csUs[d] = colorPalette[2];
                            }
                            if (d > thr[2] && d <= thr[3]) {
                                csUs[d] = colorPalette[3];
                            }
                            if (d > thr[3] && d <= thr[4]) {
                                csUs[d] = colorPalette[4];
                            }
                            if (d > thr[4] && d <= thr[5]) {
                                csUs[d] = colorPalette[5];
                            }
                        });

                        _.map(upIqr, d => {
                            if (d > thr[5] && d <= thr1[0]) {
                                csUs[d] = colorPalette1[0];
                            }
                            if (d > thr1[0] && d <= thr1[1]) {
                                csUs[d] = colorPalette1[1];
                            }
                            if (d > thr1[1] && d <= thr1[2]) {
                                csUs[d] = colorPalette1[2];
                            }
                            if (d > thr1[2] && d <= thr1[3]) {
                                csUs[d] = colorPalette1[3];
                            }
                            if (d > thr1[3] && d <= thr1[4]) {
                                csUs[d] = colorPalette1[4];
                            }
                        })
                        let scaleMap = csUs;

                        setColorScale(scaleMap);

                        var max = _.takeRight(temp_Data_metric)[0];
                        var min = temp_Data_metric[0];
                        console.log(max);
                        if (max > 999) {
                            max = (max / 1000).toFixed(0) + "K";
                            console.log(max);
                            setLegendMax(max);
                        } else {
                            setLegendMax(max.toFixed(0));

                        }
                        setLegendMin(min.toFixed(0));

                        setLegendSplit(thr);
                        setLegendSplit1(thr1);

                    }
                    else {
                        _.map(x, (d, k) => {
                            d.fips = k
                            return d
                        });

                        var temp_Data = {};
                        var temp_Data_metric = [];
                        // retrieve metric data as list
                        _.each(x, d => {
                            if (d.fips.length === 5 && d.fips[0] === '1' && d.fips[1] === '3') {
                                temp_Data_metric.push(d[metric]);
                            }
                        });
                        temp_Data[metric] = temp_Data_metric;

                        temp_Data_metric.sort(function (a, b) {
                            return a - b;
                        });
                        console.log(temp_Data_metric);
                        //   console.log(quantile(temp_Data_metric, 0.75));
                        //   console.log(quantile(temp_Data_metric, 0.25));
                        //   console.log(3*quantile(temp_Data_metric, 0.75)-2*quantile(temp_Data_metric, 0.25));
                        // console.log(6*quantile(temp_Data_metric, 0.75)-5*quantile(temp_Data_metric, 0.25))
                        var countIqr = 6 * quantile(temp_Data_metric, 0.75) - 5 * quantile(temp_Data_metric, 0.25);
                        var rateIqr = 3 * quantile(temp_Data_metric, 0.75) - 2 * quantile(temp_Data_metric, 0.25);
                        var IQR3 = _.map(_.filter(_.map(x, (d, k) => {
                            d.fips = k
                            return d
                        }),
                            d => (metric === 'casescumR' || metric === 'deathscumR' ? d[metric] > 0 && d[metric] < rateIqr &&
                                d.fips.length === 5
                                : d[metric] > 0 && d[metric] < countIqr &&
                                d.fips.length === 5
                            )),
                            d => d[metric]);

                        console.log(IQR3);

                        const csUs = {};
                        var indexColor;
                        _.map(IQR3, d => {
                            if (metric === 'casescumR' || metric === 'deathscumR' || metric == 'casescum14dayR') { var interV = (rateIqr.toFixed(0)) / colorPalette.length }
                            else { var interV = (countIqr.toFixed(0)) / colorPalette.length }

                            if (metric === 'deathscum' || metric === 'deathscumR') {
                                indexColor = Math.round(interV / 10) * 10;
                            }
                            else {
                                indexColor = Math.round(interV / 100) * 100;
                            }
                            console.log(indexColor);
                            csUs[d] = colorPalette[Math.floor(d / indexColor)];
                        })

                        _.map(x, d => {
                            if (d[metric] > indexColor * colorPalette.length) {
                                csUs[d[metric]] = colorOut;
                            }
                            if (d[metric] < indexColor * colorPalette.length && d[metric] > 3 * quantile(temp_Data_metric, 0.75) - 2 * quantile(temp_Data_metric, 0.25).toFixed(0)) {
                                csUs[d[metric]] = colorPalette[colorPalette.length - 1];
                            }
                        })
                        let scaleMap = csUs;

                        setColorScale(scaleMap);

                        var max = _.takeRight(temp_Data_metric)[0];
                        var min = temp_Data_metric[0];
                        console.log(max);
                        if (max > 999) {
                            max = (max / 1000).toFixed(0) + "K";
                            console.log(max);
                            setLegendMax(max);
                        } else {
                            setLegendMax(max.toFixed(0));

                        }
                        setLegendMin(min.toFixed(0));
                        var split = [];
                        var i = 0;
                        for (i = 0; i < colorPalette.length; i++) {
                            split.push((i + 1) * indexColor);
                        }

                        setLegendSplit(split);
                        console.log(split);

                    }
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

            fetch('/data/data.json').then(res => res.json())
                .then(x => {
                    setDateCur(x)
                    // console.log(x)
                });
        }
    }, [stateFips, metric]);



    useEffect(() => {
        if (dataTS && dataTS[stateFips + countyFips]) {
            setCovidMetric(_.takeRight(dataTS[stateFips + countyFips])[0]);
            setCovidMetric14(_.takeRight(dataTS[stateFips + countyFips], 14));
            // console.log(data[stateFips+countyFips])
            // setDateCur(data[stateFips+countyFips])
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
                                                    width: '520px',
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
                                    <SvgMap name={metric}
                                        legendSplit={legendSplit}
                                        legendSplit1={legendSplit1}
                                        legendMin={legendMin}
                                        legendMax={legendMax}
                                    />

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
                                                        ((colorScale && dataUs[stateFips + geo.properties.COUNTYFP] &&
                                                            dataUs[stateFips + geo.properties.COUNTYFP][metric] && dataUs[stateFips + geo.properties.COUNTYFP][metric] > 0) ?
                                                            colorScale[dataUs[stateFips + geo.properties.COUNTYFP][metric]] :
                                                            (colorScale && dataUs[stateFips + geo.properties.COUNTYFP] && dataUs[stateFips + geo.properties.COUNTYFP][metric] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                />
                                            )}
                                        </Geographies>
                                    </ComposableMap>
                                    <div style={{ paddingTop: 0, paddingLeft: '1em', paddingRight: '4em' }}>
                                    <Slider
                                        defaultValue={20}
                                        // getAriaValueText={valuetext}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="off"
                                        step={10}
                                        marks={marks}
                                        min={0}
                                        max={40}
                                    />
                                    </div>
                                    


                                    <Grid.Row style={{ paddingTop: 0, paddingLeft: '0em', paddingRight: '2em' }} centered>
                                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                                            {varNameMap[metric].text}{dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))} . The darker shading indicates a larger number of {varNameMap[metric].name}.
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

                                                    <rect x={50} y={12} width="15" height="2" style={{ fill: countyColor, strokeWidth: 1, stroke: countyColor }} />
                                                    <text x={75} y={20} style={{ fontSize: 16 }}>7-day rolling average in {countyName}</text>

                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <rect x={50} y={40} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} /> :
                                                        <rect x={50} y={35} width="15" height="1" style={{ fill: '#71c7ec', strokeWidth: 1, stroke: '#71c7ec' }} />}
                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <text x={75} y={52} style={{ fontSize: 16 }}> {varGraphPair[metric]['legend'][0]} </text> :
                                                        <rect x={50} y={35} width="15" height="1" style={{ fill: '#71c7ec', strokeWidth: 1, stroke: '#71c7ec' }} />}
                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <text x={250} y={12} style={{ fontSize: 0 }}></text> :
                                                        <text x={75} y={43} style={{ fontSize: 16 }}>7-day rolling average in Georgia</text>}
                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <rect x={0} y={0} width="0" height="0" style={{ fill: 'white', strokeWidth: 0, stroke: 'white' }} /> :
                                                        <rect x={50} y={55} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} />}
                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <rect x={0} y={0} width="0" height="0" style={{ fill: 'white', strokeWidth: 0, stroke: 'white' }} /> :
                                                        <text x={75} y={68} style={{ fontSize: 16 }}> {varGraphPair[metric]['legend'][0]} </text>}

                                                </svg>

                                                <ChartGraph
                                                    name={varGraphPair}
                                                    metric={metric}
                                                    stateFips={stateFips}
                                                    countyFips={countyFips}
                                                    data1={covidMetric14}
                                                    data2={dataTS}

                                                />


                                            </Grid.Row>
                                            <Grid.Row style={{ paddingTop: '2em', paddingLeft: '2.9em', paddingRight: '2.9em' }} centered>
                                                <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                                                    As of {dataTS[stateFips + countyFips][0].todaydate === 'n/a' ? 'N/A' : (new Date(dataTS[stateFips + countyFips][0].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}, this chart shows the daily number of new {varNameMap[metric].name} of confirmed COVID-19 in <b>{countyName}</b>. The daily number reflects the date the case was first reported to DPH.
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
                    <b>Total Cases</b>: {data[stateFips + countyFips]['casescum'] >= 0 ? data[stateFips + countyFips]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFips]['deathscum'] >= 0 ? data[stateFips + countyFips]['deathscum'].toFixed(0) : "N/A"} <br />
                    <b>Total case per 100k</b>: {data[stateFips + countyFips]['casescumR'] >= 0 ? data[stateFips + countyFips]['casescumR'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths per 100k</b>: {data[stateFips + countyFips]['deathscumR'] >= 0 ? data[stateFips + countyFips]['deathscumR'].toFixed(0) : 'N/A'} <br />
                    <b>Last 14-day Cases per 100k</b>: {data[stateFips + countyFips]['casescum14dayR'] >= 0 ? data[stateFips + countyFips]['casescum14dayR'].toFixed(0) : "N/A"} <br />
                    <b>Click to see county-level data.</b> </ReactTooltip>
            </div>
        );
    } else {
        return <Loader active inline='centered' />
    }




}