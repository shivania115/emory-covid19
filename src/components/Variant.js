import AppBar from './AppBar';
import React, { useEffect, useState } from 'react'
import { Container, Grid, Dropdown,Table, Breadcrumb, Header, Loader, Divider, Image, Accordion, Icon, Tab } from 'semantic-ui-react'
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { geoCentroid } from "d3-geo";
import { useParams, useHistory } from 'react-router-dom';
import { HEProvider, useHE } from './HEProvider';
import ReactTooltip from "react-tooltip";
import Marker from './Marker';
import configs from "./state_config.json";
import VariantFAQ from './VariantFAQ';
import _, { map, set } from 'lodash';
import Annotation from './Annotation';
import allStates from "./allstates.json";
import Test_Region from './Test_regions';

import { LineChart, Line, Area, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, Cell, PieChart, Pie, LabelList, ReferenceArea, ReferenceLine } from "recharts";
import {
  VictoryChart,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryContainer,
  VictoryGroup,
  VictoryBar,
  VictoryTheme,
  VictoryArea,
  VictoryAxis,
  VictoryLegend,
  VictoryLine,
  VictoryLabel,
  VictoryScatter,
  VictoryPie
} from 'victory';
import regionState from "./stateRegionFip.json";
import * as d3 from "d3";
import { scaleQuantile } from "d3-scale";
const stateColor = "#778899";
const nationColor = '#b1b3b3';
function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
    x = x.replace(pattern, "$1,$2");
  return x;
}
function LatestOnThisDashboard() {

    return (
        <Grid>
            <Grid.Column style={{ width: 110, fontSize: "16pt", lineHeight: "18pt" }}>

                <b>The Latest on this Dashboard</b>

            </Grid.Column>
            <Grid.Column style={{ width: 20 }}>

            </Grid.Column>

            {/* <Grid.Column style={{width: 190}}>
          <Image width = {175} height = {95} src='/HomeIcons/Emory_Icons_NationalReport_v1.jpg' />
        </Grid.Column>
        <Grid.Column style={{width: 250, fontSize: "8pt"}}>
          <b> National Report <br/> </b>
  
          The National Report tab takes you to a detailed overview of the impact of COVID-19 in the U.S.. 
          How has the pandemic been trending?  
          Who are the most vulnerable communities...
          <a href = "/national-report">for more</a>. 
          
        </Grid.Column> */}

            <Grid.Column style={{ width: 190 }}>
                <Image width={175} height={95} href="/national-report" src='/HomeIcons/Emory_Icons_LatestBlog_v1.jpg' />
            </Grid.Column>
            <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
                <b> National Report <br /> </b>

                The National Report offers a detailed overview of the impact of COVID-19 in the U.S..
                How has the pandemic been trending?
                Who are the most vulnerable communities...
                <a href="/national-report">click to access</a>.

            </Grid.Column>

            <Grid.Column style={{ width: 190 }}>
                <Image width={175} height={95} href="/Vaccine-Tracker" src='/HomeIcons/Emory_Icons_NationalReport_v1.jpg' />
            </Grid.Column>
            <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
                <b> COVID-19 Vaccination Tracker <br /> </b>

                The COVID-19 Vaccionation Tracker tab takes you to an overview of current vaccination status in the U.S. and in each state.
                For FAQs on COVID-19 Vaccines...
                <a href="/Vaccine-Tracker">click to access</a>.

            </Grid.Column>

            <Grid.Column style={{ width: 190 }}>
                <Image width={175} height={95} href="/Georgia" src='/LatestOnThisDashboard/GADash.png' />
            </Grid.Column>
            <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
                <b> Georgia COVID-19 Health Equity Dashboard<br /> </b>

                The Georgia COVID-19 Health Equity dashboard is a tool to dynamically track and compare the burden of cases and deaths across counties in Georgia.

                <a href="/Georgia"> Click to Access</a>.

            </Grid.Column>



            <Grid.Column style={{ width: 190 }}>
                <Image width={165} height={95} href="/media-hub/blog/maskmandate" src='/blog images/maskmandate/Mask Mandate blog.png' />
            </Grid.Column>
            <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
                <b>Statewide Mask Mandates in the United States<br /></b>

                State-wide mask mandate in the early stages of the pandemic may have been clever for US states, lowering case rates during the third wave of the pandemic compared to...
                <a href="/media-hub/blog/maskmandate">for more</a>.
            </Grid.Column>

            <Grid.Column style={{ width: 190 }}>
                <Image width={165} height={95} href="/media-hub/podcast/Katie_Kirkpatrick_on_economic_responses" src='/podcast images/Katie Kirkpatrick.jpeg' />
            </Grid.Column>
            <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
                <b>“You can't have good public health, but not have equity and economic growth”<br /></b>

                Katie Kirkpatrick discusses the economic responses to COVID-19 & ramifications in the business community...
                <a href="/media-hub/podcast/Katie_Kirkpatrick_on_economic_responses">for more</a>.
            </Grid.Column>

            <Grid.Column style={{ width: 190 }}>
                <Image width={165} height={95} href="/media-hub/podcast/Allison_Chamberlain_on_public_health_education_pandemic" src='/podcast images/Allison Chamberlain.png' />
            </Grid.Column>
            <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
                <b>“A teaching opportunity for many years to come”<br /></b>

                Dr. Allison Chamberlain talks about public health education in the time of the COVID-19 pandemic, blending public health...

                <a href="/media-hub/podcast/Allison_Chamberlain_on_public_health_education_pandemic">for more</a>.
            </Grid.Column>

            <Grid.Column style={{ width: 190 }}>
                <Image width={165} height={95} href="/media-hub/podcast/Robert_Breiman_on_COVID-19_vaccine_development_and_distribution" src='/podcast images/Robert Breiman.png' />
            </Grid.Column>
            <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
                <b>“Information equity is a critical part of the whole picture”<br /></b>

                Dr. Robert Breiman talks about SARS-CoV-2 vaccine development, distribution, and clinical trials...
                <a href="/media-hub/podcast/Robert_Breiman_on_COVID-19_vaccine_development_and_distribution">for more</a>.
            </Grid.Column>

            <Grid.Column style={{ width: 190 }}>
                <Image width={165} height={95} href="/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances" src='/podcast images/Vincent Macroni.png' />
            </Grid.Column>
            <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
                <b>Innovations in Covid-19 Treatment: Dr. Vincent Marconi on Anti-Viral and Anti-Inflammatory Advances Against COVID-19 <br /></b>

                Dr. Vincent Marconi talks about the state of research around baricitinib...
                <a href="/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances">for more</a>.
            </Grid.Column>

            <Grid.Column style={{ width: 190 }}>
                <Image width={165} height={95} href="/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics" src='/podcast images/Dr. Nneka Sederstrom.jpg' />
            </Grid.Column>
            <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
                <b>"We Have to Be Better": Dr. Nneka Sederstrom on Racism and Ethics During Covid-19 <br /></b>

                Dr. Nneka Sederstrom discusses how Covid-19 has brought issues of structural racism in
                medicine to the forefront of clinical ethics and pandemic...
                <a href="/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics">for more</a>.
            </Grid.Column>
            <Grid.Column style={{ width: 190 }}>
                <Image width={165} height={95} href="/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC" src='/podcast images/JudyMonroe.jpg' />
            </Grid.Column>
            <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
                <b>"You've Got to Have Trust": Dr. Judy Monroe on Lessons Learned About Pandemic Preparedness <br /></b>

                In a podcast, Dr. Monroe tells us about the lessons she learned about leadership and community partnerships during
                pandemics based on her experience as...
                <a href="/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC">for more</a>.
            </Grid.Column>

        </Grid>
    )
}
function CaseChart(props) {
  const [playCount, setPlayCount] = useState(0);
  const data = props.data;
  const dataState = props.dataState;
  const sfps = props.stateFips;
  const ticks = props.ticks;
  const variable = props.var;
  const tickFormatter = props.tickFormatter;
  const labelFormatter = props.labelFormatter;
  const [animationBool, setAnimationBool] = useState(true);

  const caseYTickFmt = (y) => {
    return y < 1000 ? y : (y / 1000 + 'k');
  };


  return (
    <div style={{ paddingTop: 5, paddingBottom: 70, width: 500 }}>
      <LineChart width={500} height={180} data={data} margin={{ right: 20 }}>
        {/* <CartesianGrid stroke='#f5f5f5'/> */}
        <XAxis dataKey="t" ticks={ticks} tick={{ fontSize: 16 }} tickFormatter={tickFormatter} allowDuplicatedCategory={false} />
        <YAxis tickFormatter={caseYTickFmt} tick={{ fontSize: 16 }} />
        <Line data={data["_nation"]} name="Nation" type='monotone' dataKey={variable} dot={false}
          isAnimationActive={animationBool}
          onAnimationEnd={() => setAnimationBool(false)}
          animationDuration={5500}
          animationBegin={500}
          stroke={nationColor} strokeWidth="2" />
        {sfps !== "_nation" && <Line data={dataState} name="State" type='monotone' dataKey={variable} dot={false}
          isAnimationActive={animationBool}
          onAnimationEnd={() => setAnimationBool(false)}
          animationDuration={5500}
          animationBegin={500}
          stroke={stateColor} strokeWidth="2" />}

        {/* <ReferenceLine x={data["_nation"][275].t} stroke="red" label="2021" /> */}



        <Tooltip labelFormatter={labelFormatter} formatter={variable === "covidmortality7dayfig" ? (value) => numberWithCommas(value.toFixed(1)) : (value) => numberWithCommas(value.toFixed(0))} active={true} />
      </LineChart>
      {/* <LineChart width={500} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" type="category" allowDuplicatedCategory={false} />
        <YAxis dataKey={variable} />
        <Tooltip />
        <Legend />
        
        <Line dataKey={variable} data={data["_nation"]} name = "nation" />
        <Line dataKey={variable} data={data[sfps]} name = "nation1"/>
        <Line dataKey={variable} data={data[sfps+cfps]} name = "nation2"/>
      </LineChart> */}
      {/* <Button content='Play' icon='play' floated="right" onClick={() => {setPlayCount(playCount+1); }}/> */}
    </div>
  );
}
export default function Variant(props) {
    const [stateName, setStateName] = useState('The United States');
    const [fips, setFips] = useState('_nation');
    const [stateFips, setStateFips] = useState();
    const [activeHover,setActiveHover]=useState(false);
  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [caseTicks, setCaseTicks] = useState([]);
    const[stateColor,setStateColor]=useState('');
    const [legendSplit, setLegendSplit] = useState([]);
    const [variantTimeseries,setVariantTimeseries]=useState();
    const [stateMapFips, setStateMapFips] = useState("USA");
    const [tooltipContent, setTooltipContent] = useState('');
    const [vaccineData, setVaccineData] = useState();
    const [showState, setShowState] = useState(false);
    const [variantData,setrVariantData]=useState();
    const [clicked, setClicked] = useState(false);
    const [hoverName, setHoverName] = useState('The United States');
    const [fully, setFully] = useState('');
    const d3graph = React.useRef(null);
    const[regionMatched,setRegionMatched]=useState('USA')
    const [stateMatched,setStateMathched]=useState([]);
    const colorPalette = [
      "#e1dce2",
      "#d3b6cd",
      "#bf88b5",
      "#af5194",
      "#99528c",
      "#633c70",
    ];
    const offsets = {
        VT: [50, -8],
        NH: [34, 2],
        MA: [30, -1],
        RI: [28, 2],
        CT: [35, 10],
        NJ: [34, 1],
        DE: [33, 0],
        MD: [47, 10],
        DC: [49, 21]
      };
      const countyGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"
      const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/states-10m.json"
    const [colorScale, setColorScale] = useState();
    const history = useHistory();
    const [varMap, setVarMap] = useState({});
    const [metric, setMetric] = useState('caserate7dayfig');
    const [metricOptions, setMetricOptions] = useState('caserate7dayfig');
    const [metricName, setMetricName] = useState('Delta');
    const colorHighlight = '#f2a900';
    useEffect(() => {
      fetch('/data/variantTimeseries.json').then(res=>res.json())
      .then(x=> {setVariantTimeseries(x)});
      fetch('/data/variantData.json').then(res => res.json())
      .then(x => {
        setrVariantData(x);
        
      let stateValue = {}
      regionState.map((y)=>{
        stateValue[y.id.toString()]=x[y.region].DeltaB16172;
        setStateColor(stateValue);
      });
        
       
        const cs = scaleQuantile()
          .domain(_.map(_.filter(_.map(x, (d, k) => {
            d.fips = k
            // console.log(d);
            return d
          }),
            d => (
              
              d['DeltaB16172'] > 0)),
            d => d['DeltaB16172']))
          .range(colorPalette);

        let scaleMap = {}
        _.each(x, d => {
          if (d['DeltaB16172'] >= 0) {
            scaleMap[d['DeltaB16172']] = cs(d['DeltaB16172'])
          }
        });
        console.log(scaleMap);
        setColorScale(scaleMap);
        console.log(colorScale);
        var max = 0
        var min = 100
        _.each(x, d => {
          if (d['DeltaB16172'] > max ) {
            max = d['DeltaB16172']
          } else if ( d['DeltaB16172'] < min && d['DeltaB16172'] >= 0) {
            min = d['DeltaB16172']
          }
        });
        if (max > 999999) {
          max = (max / 1000000).toFixed(1) + "M";
          setLegendMax(max);
        } else if (max > 999) {
          max = (max / 1000).toFixed(0) + "K";
          setLegendMax(max);
        } else {
          setLegendMax(max.toFixed(0));
        }
        setLegendMin(min.toFixed(0));
        setLegendSplit(cs.quantiles());
      });
     
      
        fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
            .then(x => {
                setVarMap(x);
                setMetricOptions(_.filter(_.map(x, d => {
                    return { key: d.id, value: d.variable, text: d.name, def: d.definition, group: d.group };
                }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
            });
    },[]);
    useEffect(
      ()=>{
            var w=500;
            var h=400;
          const svg=d3.select(d3graph.current).append("svg").attr("width",w).attr("height",h);
          d3.json('/data/variantTimeseries.json').then(function(data){
            const xScale=d3.scaleLinear().domain([data[regionMatched][0].t,data[regionMatched][data[regionMatched].length-1].t]);
            const yMinValue=d3.min(data[regionMatched],d=>d.DeltaB16172);
            const yMaxValue=d3.max(data[regionMatched],d=>d.DeltaB16172);
            const yScale=d3.scaleLinear().domain([legendMin,legendMax]).range([90,100]);
            svg.append("g")
            .attr("transform", "translate(0," + h + ")")
            .call(d3.axisBottom(xScale));
  
           svg.append("g")
            .call(d3.axisLeft(yScale));
          
            var line = d3.line()
        .x(function(d) { 
          console.log(d);
          return xScale; }) 
        .y(function(d) { 
          console.log(d);
          return yScale; }) 
        .curve(d3.curveMonotoneX);
      
        svg.append("path")
        .datum(data[regionMatched]) 
        .attr("class", "line") 
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");
          });
        
      }
    )
    const labelTickFmt = (tick) => {
      return (
        // <text>// </ text>
        /* {tick} */
        // monthNames[new Date(tick*1000).getMonth()] + " " +  new Date(tick*1000).getDate()
        new Date(tick * 1000).getFullYear() + "/" + (new Date(tick * 1000).getMonth() + 1) + "/" + new Date(tick * 1000).getDate()
  
      );
    };
  
    const caseTickFmt = (tick) => {
      // console.log((new Date(tick * 1000).getMonth() + 1) + "/" + new Date(tick * 1000).getDate())
      return (
        // <text>// </ text>
        /* {tick} */
        // monthNames[new Date(tick*1000).getMonth()] + " " +  new Date(tick*1000).getDate()
        (new Date(tick * 1000).getMonth() + 1) + "/" + new Date(tick * 1000).getDate()
  
      );
    };
function handleCallback(childData){
  setStateMapFips(childData);
}
if (stateColor){
  console.log(variantTimeseries);
  // console.log(stateMapFips);
  // console.log((stateColor['13']));
  // console.log(colorScale[stateColor[13]['Delta (B.1.617.2)']]);
    return (
        <HEProvider>
            <div>
                <AppBar menu='countyReport' />
                <Container style={{ marginTop: '8em', minWidth: '1260px' }}>
                    <Grid style={{ height: 130, overflow: "hidden" }}>

                        <div style={{ paddingBottom: 8 }}>
                        </div>

                        <div style={{ height: 130, overflowY: "hidden", overflowX: "auto" }}>
                            <div style={{ width: "260%" }}>
                                <LatestOnThisDashboard />
                            </div>
                        </div>
                    </Grid>
                    <Divider hidden />
                    <Grid columns={9} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                        <Grid.Row style={{ width: "100%", height: "100%" }}>
                            <Grid.Column width={9} style={{ width: "100%", height: "100%" }}>
                                <Grid.Row columns={2} style={{ width: 680, padding: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0 }}>

                                    <Dropdown
                                        style={{
                                            background: '#fff',
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
                                            paddingBottom: '0.5em'
                                        }}
                                        text={metricName}
                                        pointing='top'
                                        search
                                        selection
                                        //   options={metricOptions}

                                        onChange={(e, { value }) => {
                                            setMetric(value);
                                            setMetricName(varMap[value]['name']);
                                        }}
                                    />

                                    <svg width="260" height="80">

                      {_.map(legendSplit, (splitpoint, i) => {
                        if (legendSplit[i] < 1) {
                          return <text key={i} x={70 + 20 * (i)} y={35} style={{ fontSize: '0.7em' }}> {legendSplit[i].toFixed(1)}</text>
                        } else if (legendSplit[i] > 999999) {
                          return <text key={i} x={70 + 20 * (i)} y={35} style={{ fontSize: '0.7em' }}> {(legendSplit[i] / 1000000).toFixed(0) + "M"}</text>
                        } else if (legendSplit[i] > 999) {
                          return <text key={i} x={70 + 20 * (i)} y={35} style={{ fontSize: '0.7em' }}> {(legendSplit[i] / 1000).toFixed(0) + "K"}</text>
                        }
                        return <text key={i} x={70 + 20 * (i)} y={35} style={{ fontSize: '0.7em' }}> {legendSplit[i].toFixed(0)}</text>
                      })}
                      <text x={50} y={35} style={{ fontSize: '0.7em' }}>{legendMin}</text>
                      <text x={170} y={35} style={{ fontSize: '0.7em' }}>{legendMax}</text>


                      {_.map(colorPalette, (color, i) => {
                        return <rect key={i} x={50 + 20 * i} y={40} width="20" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                      })}


                      <text x={50} y={74} style={{ fontSize: '0.8em' }}>Low</text>
                      <text x={50 + 20 * (colorPalette.length - 1)} y={74} style={{ fontSize: '0.8em' }}>High</text>


                      <rect x={195} y={40} width="20" height="20" style={{ fill: "#FFFFFF", strokeWidth: 0.5, stroke: "#000000" }} />
                      <text x={217} y={50} style={{ fontSize: '0.7em' }}> None </text>
                      <text x={217} y={59} style={{ fontSize: '0.7em' }}> Reported </text>

                    </svg>
                                </Grid.Row>
                                <Test_Region parentCallback={handleCallback}/>
                                {/* <ComposableMap
                              projection="geoAlbersUsa"
                              data-tip=""
                              width={1200}
                              height={450}
                              strokeWidth={0.1}
                              stroke='black'
                              offsetX={-380}
                              projectionConfig={{ scale: 800 }}


                            >
                              <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                  <svg>
                                    {setStateFips(fips)}
                                    {geographies.map(geo => (
                                      
                                      <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => {
                                          setTooltipContent("");

                                          setActiveHover(true);
                                          const fips = geo.id.substring(0, 2);
                                           setRegionMatched(regionState.find(s => s.id === fips).region);
                                          setFips(fips);
                                        
                                          console.log(regionMatched);
                                          setHoverName(regionMatched);
                                          
                                    
                                        }}


                                        onMouseLeave={() => {
                                          setActiveHover(false);
                                          setTooltipContent("");
                                          setFips("_nation");
                                          setRegionMatched("USA");
                                          setHoverName("The United States");
                                        }}

                                        onClick={() => {
                                          const configMatched = configs.find(s => s.fips === fips);
                                          setStateName(configMatched.name);
                                          setStateMapFips(geo.id.substring(0, 2));

                                          setClicked(true);
                                          setShowState(true);

                                        }}

                                        
                                        fill={((colorScale && stateColor[geo.id] && (stateColor[geo.id]) > 0) ?
                                                                colorScale[stateColor[geo.id]] :
                                                                '#FFFFFF')}                                 
                                      />
                                    

                                    ))}

                                    {geographies.map(geo => {
                                      const centroid = geoCentroid(geo);
                                    
                                      const cur = allStates.find(s => s.val === geo.id.substring(0,2));
                                  
                                      return (
                                        <g key={geo.rsmKey + "-name"}>
                                          {cur &&
                                            centroid[0] > -160 &&
                                            centroid[0] < -67 &&
                                            (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                                              <Marker coordinates={centroid}>
                                                <text y="2" fontSize={14} textAnchor="middle">
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
                                }
                              </Geographies>


                            </ComposableMap> */}
                            </Grid.Column>
                            <Grid.Column width={7} style={{paddingLeft:0}}>
                            <Header as='h2' style={{ fontWeight: 400 }}>
                    <Header.Content style={{ width: 550, fontSize: "20pt", textAlign: "center" }}>
                      HIII

                    </Header.Content>
                  </Header>
                  <Grid>
                    <Grid.Row columns={1}>
                    <Header.Content style={{ fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "20pt" }}>
                        The U.S. map shows the estimated proportions of the most common SARS-CoV-2 (the virus that causes COVID-19) variants circulating in the United States, divided by <a href="https://www.hhs.gov/about/agencies/iea/regional-offices/index.html">HHS regions</a>. Scroll over each region to see the exact breakdown of what proportion of confirmed cases of COVID-19 in that region are due to which variants. Data can be filtered by region and variant. 
                        
                        </Header.Content>
                        </Grid.Row>
                        <Grid.Row columns={1}>
                    <Header.Content style={{ fontWeight: 300, fontSize: "14pt", paddingTop: 7, lineHeight: "20pt" }}>
                    The most prevalent variant in region _____ is _____ which is attributed to  _____% of cases. 
                        
                        </Header.Content>
                        </Grid.Row>
                        <Grid.Row>
                        {/* line graph */}
                        {/* <VictoryChart
                                    theme={VictoryTheme.material}
                                    width={630}
                                    height={230}
                                    domainPadding={20}
                                    minDomain={{ y: props.ylog ? 1 : 0 }}
                                    padding={{ left: 160, right: 100, top: 10, bottom: 10 }}
                                    style={{ fontSize: "14pt" }}
                                    containerComponent={<VictoryContainer responsive={false} />}
                                >
                                    <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                    <VictoryAxis dependentAxis
                                        label='COVID-19 Cases per 100,000 Residents'
                                        style={{
                                            ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                            labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                        }} />
                                    <VictoryBar
                                        horizontal
                                        barRatio={0.75}
                                        labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                        data={[
                                            { key: "Very low CCVI", 'value': (data_index['cvi_index']["low20"]['casescumR'] / data_index['cvi_index']["low20"]['casescumR']) * data_index['cvi_index']["low20"]['casescumR'] || 0, 'ez': data_index['cvi_index']["low20"]['county_list'] },
                                            { key: "Low CCVI", 'value': (data_index['cvi_index']["Q2"]['casescumR'] / data_index['cvi_index']["Q2"]['casescumR']) * data_index['cvi_index']["Q2"]['casescumR'] || 0, 'ez': data_index['cvi_index']["Q2"]['county_list'] },
                                            { key: "Moderate CCVI", 'value': (data_index['cvi_index']["Q3"]['casescumR'] / data_index['cvi_index']["Q3"]['casescumR']) * data_index['cvi_index']["Q3"]['casescumR'] || 0, 'ez': data_index['cvi_index']["Q3"]['county_list'] },
                                            { key: "High CCVI", 'value': (data_index['cvi_index']["Q4"]['casescumR'] / data_index['cvi_index']["Q4"]['casescumR']) * data_index['cvi_index']["Q4"]['casescumR'] || 0, 'ez': data_index['cvi_index']["Q4"]['county_list'] },
                                            { key: "Very high CCVI", 'value': (data_index['cvi_index']["high20"]['casescumR'] / data_index['cvi_index']["high20"]['casescumR']) * data_index['cvi_index']["high20"]['casescumR'] || 0, 'ez': data_index['cvi_index']["high20"]['county_list'] }
                                        ]}
                                        labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                        style={{
                                            data: {
                                                fill: ({ datum }) => datum.ez.includes(countyFipscvi) ? countyColor : casesColor[1]
                                            }
                                        }}
        
                                        x="key"
                                        y="value"
                                    />
                                </VictoryChart> */}
                                <div>
                              {/* {fips &&
                                <VictoryChart
                                  // minDomain={{ x: fips ? variantTimeseries[fips][variantTimeseries[fips].length - 15].t : variantTimeseries["13"][variantTimeseries["13"].length - 15].t }}
                                  // maxDomain={{ y: fips ? getMaxRange(variantTimeseries[stateMapFips], "caseRateMean", (variantTimeseries[stateMapFips].length - 15)).caseRateMean * 1.05 : getMaxRange(variantTimeseries["13"], "caseRateMean", (variantTimeseries["13"].length - 15)).caseRateMean * 1.05 }}
                                  width={220}
                                  height={180}
                                  padding={{ marginLeft: 0, right: -1, top: 150, bottom: -0.9 }}
                                  containerComponent={<VictoryContainer responsive={false} />}>

                                  <VictoryAxis
                                    tickValues={fips ?
                                      [
                                        variantTimeseries[fips][variantTimeseries[fips].length - Math.round(variantTimeseries[fips].length / 3) * 2 - 1].t,
                                        variantTimeseries[fips][variantTimeseries[fips].length - Math.round(variantTimeseries[fips].length / 3) - 1].t,
                                        variantTimeseries[fips][variantTimeseries[fips].length - 1].t]
                                      :
                                      [
                                        variantTimeseries["13"][variantTimeseries["13"].length - Math.round(variantTimeseries["13"].length / 3) * 2 - 1].t,
                                        variantTimeseries["13"][variantTimeseries["13"].length - Math.round(variantTimeseries["13"].length / 3) - 1].t,
                                        variantTimeseries["13"][variantTimeseries["13"].length - 1].t]}
                                    style={{ grid: { background: "#ccdee8" }, tickLabels: { fontSize: 10 } }}
                                    tickFormat={(t) => new Date(t * 1000).toLocaleDateString()} />

                                  <VictoryGroup
                                    colorScale={[stateColor]}
                                  >

                                    <VictoryLine data={stateMapFips && variantTimeseries[stateMapFips] ? variantTimeseries[stateMapFips] : variantTimeseries["13"]}
                                      x='t' y='caseRateMean'
                                    />

                                  </VictoryGroup>
                                  <VictoryArea
                                    style={{ data: { fill: "#00BFFF", fillOpacity: 0.1 } }}
                                    data={stateMapFips && variantTimeseries[stateMapFips] ? variantTimeseries[stateMapFips] : variantTimeseries["13"]}
                                    x='t' y='caseRateMean'

                                  />

                                  <VictoryLabel text={stateMapFips ? numberWithCommas((variantTimeseries[stateMapFips][variantTimeseries[stateMapFips].length - 1].percentVaccinatedDose2_avg7).toFixed(0)) : numberWithCommas((variantTimeseries["13"][variantTimeseries["13"].length - 1].dailyCases).toFixed(0))} x={80} y={80} textAnchor="middle" style={{ fontSize: 40, fontFamily: 'lato', fill: "#004071" }} />

                                  <VictoryLabel text={stateMapFips ?
                                    (variantTimeseries[stateMapFips][variantTimeseries[stateMapFips].length - 1].percentVaccinatedDose2_avg7).toFixed(0) > 0 ? (variantTimeseries[stateMapFips][variantTimeseries[stateMapFips].length - 1].percentVaccinatedDose2_avg7).toFixed(0) + "%" :
                                      (variantTimeseries[stateMapFips][variantTimeseries[stateMapFips].length - 1].percentVaccinatedDose2_avg7).toFixed(0) < 0 ? ((variantTimeseries[stateMapFips][variantTimeseries[stateMapFips].length - 1].percentVaccinatedDose2_avg7).toFixed(0)).substring(1) + "%" :
                                        (variantTimeseries[stateMapFips][variantTimeseries[stateMapFips].length - 1].percentVaccinatedDose2_avg7).toFixed(0) + "%"
                                    :
                                    (variantTimeseries["13"][variantTimeseries["13"].length - 1].percentVaccinatedDose2_avg7).toFixed(0) > 0 ? (variantTimeseries["13"][variantTimeseries["13"].length - 1].percentVaccinatedDose2_avg7).toFixed(0) + "%" :
                                      (variantTimeseries["13"][variantTimeseries["13"].length - 1].percentVaccinatedDose2_avg7).toFixed(0) < 0 ? ((variantTimeseries["13"][variantTimeseries["13"].length - 1].percentVaccinatedDose2_avg7).toFixed(0)).substring(1) + "%" :
                                        (variantTimeseries["13"][variantTimeseries["13"].length - 1].percentVaccinatedDose2_avg7).toFixed(0) + "%"} x={197} y={80} textAnchor="middle" style={{ fontSize: 24, fontFamily: 'lato', fill: "#004071" }} />

                                  <VictoryLabel text={stateMapFips ?
                                    (variantTimeseries[stateMapFips][variantTimeseries[stateMapFips].length - 1].percentVaccinatedDose2_avg7).toFixed(0) > 0 ? "↑" :
                                      (variantTimeseries[stateMapFips][variantTimeseries[stateMapFips].length - 1].percentVaccinatedDose2_avg7).toFixed(0) < 0 ? "↓" : ""
                                    :
                                    (variantTimeseries["13"][variantTimeseries["13"].length - 1].percentVaccinatedDose2_avg7).toFixed(0) > 0 ? "↑" :
                                      (variantTimeseries["13"][variantTimeseries["13"].length - 1].percentVaccinatedDose2_avg7).toFixed(0) < 0 ? "↓" : ""}


                                    x={160} y={80} textAnchor="middle" style={{
                                      fontSize: 24, fontFamily: 'lato'

                                      , fill: stateMapFips ?
                                        (variantTimeseries[stateMapFips][variantTimeseries[stateMapFips].length - 1].percentVaccinatedDose2_avg7).toFixed(0) > 0 ? "#FF0000" :
                                          (variantTimeseries[stateMapFips][variantTimeseries[stateMapFips].length - 1].percentVaccinatedDose2_avg7).toFixed(0) < 0 ? "#32CD32" : ""
                                        :
                                        (variantTimeseries["13"][variantTimeseries["13"].length - 1].percentVaccinatedDose2_avg7).toFixed(0) > 0 ? "#FF0000" :
                                          (variantTimeseries["13"][variantTimeseries["13"].length - 1].percentVaccinatedDose2_avg7).toFixed(0) < 0 ? "#32CD32" : ""

                                    }} />

                                  <VictoryLabel text={"14-day"} x={197} y={100} textAnchor="middle" style={{ fontSize: 12, fontFamily: 'lato', fill: "#004071" }} />
                                  <VictoryLabel text={"change"} x={197} y={110} textAnchor="middle" style={{ fontSize: 12, fontFamily: 'lato', fill: "#004071" }} />
                                  <VictoryLabel text={"Daily Cases"} x={110} y={20} textAnchor="middle" style={{ fontSize: "22px", fontFamily: 'lato' }} />


                                </VictoryChart>} */}
                                {stateMapFips && <CaseChart data={variantTimeseries} dataState={variantTimeseries[stateMapFips]} lineColor={[colorPalette[1]]} stateFips={stateMapFips}
                          ticks={caseTicks} tickFormatter={caseTickFmt} labelFormatter={labelTickFmt} var={"Delta_B"} />
                        }
                             
                            </div>
        
                                <svg className="svgRef"
                                width={300}
                                  height={100}
                                  ref={d3graph}>
                                  
                                </svg>
                        </Grid.Row>
                  </Grid>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <div id="general" style={{ height: 40 }}></div>
                  <Grid>
                    <Grid.Column style={{ paddingLeft: 33 }}>
                      <Divider style={{ width: 980 }} />

                    </Grid.Column>
                  </Grid>
                  <Grid >
                    <VariantFAQ />

                  </Grid>
                </Container>
                {(activeHover) && <ReactTooltip >
            <font size="+1"><b >{hoverName}</b> </font>
            <br />
            {/* <b> # received first dose: </b> {numberWithCommas(vaccineData[fips]["Administered_Dose1"])}
          <br/>
          <b> % received first dose: </b> {numberWithCommas(vaccineData[fips]["percentVaccinatedDose1"]) + "%"}
          <br/>
          <b> # received second dose: </b> {numberWithCommas(vaccineData[fips]["Series_Complete_Yes"])}
          <br/>
          <b> % received second dose: </b> {numberWithCommas(vaccineData[fips]["Series_Complete_Pop_Pct"]) + "%"}
          <br/> */}
            
            {/* <Grid>
              <Grid.Row>
              % Delta
              </Grid.Row>
              <Grid.Row>
              {numberWithCommas(variantData[hoverName].DeltaB16172)+"%"}
              </Grid.Row>
            </Grid> */}

            <Table celled inverted selectable  >
              {/* <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Header</Table.HeaderCell>
                <Table.HeaderCell>Header</Table.HeaderCell>
                <Table.HeaderCell>Header</Table.HeaderCell>
              </Table.Row>
              </Table.Header> */}

              <Table.Body>
        
                <Table.Row >
                <Table.HeaderCell style={{ fontSize: "14px", lineHeight: "14px" }}>% Delta</Table.HeaderCell>
                  <Table.Cell style={{ fontSize: "14px", lineHeight: "14px", textAlign: "right"}}>{(variantData[hoverName].DeltaB16172)+"%"}</Table.Cell>
                 
                </Table.Row>
                <Table.Row >
                  <Table.HeaderCell style={{ fontSize: "14px", lineHeight: "14px" }}> % Alpha</Table.HeaderCell>
                  <Table.Cell style={{ fontSize: "14px", lineHeight: "14px", textAlign: "right" }}>{(variantData[hoverName].Alpha) + "%"}</Table.Cell>
                </Table.Row>
                {/* <Table.Row style={{ height: 25 }}>
                  <Table.HeaderCell style={{ fontSize: "16px", lineHeight: "16px" }}> # fully vaccinated</Table.HeaderCell>
                  <Table.HeaderCell style={{ fontSize: "16px", lineHeight: "16px", textAlign: "right" }}>{numberWithCommas(vaccineData[fips]["Series_Complete_Yes"])}</Table.HeaderCell>
                </Table.Row>
                <Table.Row style={{ height: 25 }}>
                  <Table.HeaderCell style={{ fontSize: "16px", lineHeight: "16px" }}> % fully vaccinated</Table.HeaderCell>
                  <Table.HeaderCell style={{ fontSize: "16px", lineHeight: "16px", textAlign: "right" }}>{numberWithCommas(vaccineData[fips]["Series_Complete_Pop_Pct"]) + "%"}</Table.HeaderCell>
                </Table.Row> */}
              </Table.Body>
            </Table>
          </ReactTooltip>}
            </div>
        </HEProvider>
    );}
    else{
      return <Loader active inline='centered'></Loader>
    }
}