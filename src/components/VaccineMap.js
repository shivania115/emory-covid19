import React, { useEffect, useState, PureComponent} from 'react'
import { Container, Dropdown, Grid, Breadcrumb, Header, Loader, Divider, Accordion, Icon, Transition, Button} from 'semantic-ui-react'
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _, { toArray } from 'lodash';
import { scaleQuantile } from "d3-scale";
import fips2county from './fips2county.json'
import stateOptions from "./stateOptions.json";
import configs from "./state_config.json";
import racedatadate from "./Pre-Processed Data/racedatadate.json";

import { var_option_mapping, CHED_static, CHED_series} from "../stitch/mongodb";
import {HEProvider, useHE} from './HEProvider';
import {useStitchAuth} from "./StitchAuth";
import {LineChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, LabelList, ReferenceArea, ReferenceLine} from "recharts";

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

const countyColor = '#f2a900';


export default function VaccineMap(props){
    const {
        isLoggedIn,
        actions: { handleAnonymousLogin },
      } = useStitchAuth();  
    
      
      const history = useHistory();
      let {stateFips} = useParams();
      const [tooltipContent, setTooltipContent] = useState('');
    
      const [data, setData] = useState();
      const [dataTS, setDataTS] = useState();
      const [dataStateTS, setStateTS] = useState();
      const [raceData, setRaceData] = useState();
    
      const [config, setConfig] = useState();
      const [stateName, setStateName] = useState('');
      const [countyFips, setCountyFips] = useState('');
      const [countyName, setCountyName] = useState('');
      const [barCountyName, setBarCountyName] = useState('');
      
      const [colorScale, setColorScale] = useState();
      const [legendMax, setLegendMax] = useState([]);
      const [legendMin, setLegendMin] = useState([]);
      const [legendSplit, setLegendSplit] = useState([]);
    
      const [caseRate, setCaseRate] = useState();
      const [percentChangeCases, setPercentChangeCases] = useState();
      const [mortality, setMortality] = useState();
      const [percentChangeMortality, setPercentChangeMortality] = useState();
      const [pctPositive, setPctPositive] = useState();
      // const [totalCases, setTotalCases] = useState();
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
      const [selectedTrend, setSelectedTrend] = useState("");

      const [delayHandler, setDelayHandler] = useState();
    
    //variable list & fips code to county name 
    useEffect(()=>{
        fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
        .then(x => {
            setVarMap(x);
            setMetricOptions(_.filter(_.map(x, d=> {
            return {key: d.id, value: d.variable, text: d.name, group: d.group};
            }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
        });

        fetch('/data/rawdata/f2c.json').then(res => res.json())
        .then(x => {
            setCountyOption(_.filter(_.map(x, d=> {
            return {key: d.id, value: d.value, text: d.text, group: d.state};
            }), d => (d.group === stateFips && d.text !== "Augusta-Richmond County consolidated government" && d.text !== "Wrangell city and borough" && d.text !== "Zavalla city")));
        });
    }, []);

    // mongo
    useEffect(()=>{
        if (metric) {
        const configMatched = configs.find(s => s.fips === stateFips);
        if (!configMatched){
            history.push('/_nation');
        }else{
            if (isLoggedIn === true){
            let newDict = {};
            let caseRate = 0;
            let mortality = 0;
            let percentChangeCase = 0;
            let percentChangeMortality = 0;
            let hospD = 0;
            let totCases = 0;
            let percentChangeHospDaily = 0;
            let percentPositive = 0;    
            setConfig(configMatched);
            setStateName(configMatched.name);
            const fetchData = async() => { 
                if(stateFips !== "_nation"){
                //all static data
                const staticQ = {all: "all"};
                const promStatic = await CHED_static.find(staticQ,{projection:{}}).toArray();

                promStatic.forEach(i=> {
                    if(i.tag === "nationalrawfull"){ //nationalraw
                    newDict = i.data;
                    setData(newDict); 
                    }else if(i.tag === "racedataAll"){ //race data
                    setRaceData(i.racedataAll);       
                    }
                });
                        
            
                const stateSeriesQ = {tag: "stateonly"};
                const promState = await CHED_series.find(stateSeriesQ,{projection:{}}).toArray();
                let stateSeriesDict = promState[0].timeseriesAll[stateFips];
                setStateTS(stateSeriesDict);

                    if(stateFips === "_nation"){
                    caseRate = 0;
                    mortality = 0;
                    totCases = 0;
                    hospD = 0;
                    }else{
                    //case rate
                    caseRate = stateSeriesDict[stateSeriesDict.length-1].dailyCases;
                    percentChangeCase = stateSeriesDict[stateSeriesDict.length-1].percent14dayDailyCases;
                    
                    //mortality rate
                    mortality = stateSeriesDict[stateSeriesDict.length-1].dailyMortality;
                    percentChangeMortality = stateSeriesDict[stateSeriesDict.length-1].percent14dayDailyDeaths;

                    //hospitalization rate
                    percentChangeHospDaily = stateSeriesDict[stateSeriesDict.length-1].percent14dayhospDaily;
                    hospD = stateSeriesDict[stateSeriesDict.length-1].hospDaily;

                    //testing positive rate
                    percentPositive = stateSeriesDict[stateSeriesDict.length-1].percentPositive;

                    totCases = stateSeriesDict[stateSeriesDict.length-1].cases;

                    }
                }
                
                //manipulate string
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

                //set values
                setPctPositive(percentPositive.toFixed(0) + "%");
                // setIndexP(indexP);
                // setIndex(index);
                setCaseRate(numberWithCommas(caseRate.toFixed(0)));
                setMortality(numberWithCommas(mortality.toFixed(0)));
                // setTotalCases(numberWithCommas(totCases.toFixed(0)));
                setHospDaily(numberWithCommas(hospD.toFixed(0)));

                

                let seriesDict = {};
                let countyMost = '';
                let covidmortality7dayfig = 0;
                if( stateFips !== "_nation"){
                //Timeseries data
                const seriesQ = { $or: [ { state: "_n" } , { state: stateFips } ] }
                const prom = await CHED_series.find(seriesQ, {projection: {}}).toArray();
                _.map(prom, i=> {
                    seriesDict[i[Object.keys(i)[4]]] = i[Object.keys(i)[5]];
                    return seriesDict;
                });
                _.each(seriesDict, (v, k)=>{

                    if (k.length===5 && v.length > 0 && v[v.length-1].covidmortality7dayfig > covidmortality7dayfig){
                    countyMost = k.substring(2, 5);
                    covidmortality7dayfig = v[v.length-1].covidmortality7dayfig;
                    }
                });
                }
                setCountyFips(countyMost);
                if(stateFips !== "_nation"){
                setCountyName(fips2county[stateFips+countyMost]);
                setBarCountyName((fips2county[stateFips+countyMost]).match(/\S+/)[0]);
                }
                
                setDataTS(seriesDict);
            };
            fetchData();
            
            
            } else {
            handleAnonymousLogin();
            }
        }
        }
    },[isLoggedIn]);

    return(
    <div>
      
      <AppBar menu='vaccinemap'/>
      <Container style={{marginTop: '0em', minWidth: '1260px'}}>

      <Grid>
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
                if(stateFips !== "_nation"){
                    history.push("/" + stateFips + "/" +geo.properties.COUNTYFP);
                }
                }}
                onMouseEnter={()=>{setDelayHandler(setTimeout(() => {
                if(stateFips !== "_nation"){
                    setCountyFips(geo.properties.COUNTYFP);
                    setCountyName(fips2county[stateFips + geo.properties.COUNTYFP]);
                    setBarCountyName((fips2county[stateFips + geo.properties.COUNTYFP]).match(/\S+/)[0]);
                    }
                }, 300))
                
                }}
                onMouseLeave={()=>{
                if(stateFips !== "_nation"){
                    clearTimeout(delayHandler);

                    setTooltipContent("")
                }
                }}
                
                fill={(stateFips === "_nation" || stateFips === "72")? "#FFFFFF" :countyFips===geo.properties.COUNTYFP?countyColor:
                    ((colorScale && data[stateFips+geo.properties.COUNTYFP] && (data[stateFips+geo.properties.COUNTYFP][metric]) > 0)?
                        colorScale[data[stateFips+geo.properties.COUNTYFP][metric]]: 
                        (colorScale && data[stateFips+geo.properties.COUNTYFP] && data[stateFips+geo.properties.COUNTYFP][metric] === 0)?
                        '#e1dce2':'#FFFFFF')}
                />
            )}
        </Geographies>
        </ComposableMap>
        </Grid>
      </Container>
      
    </div>
    );
}
