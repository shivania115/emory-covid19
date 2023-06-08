import AppBar from "./AppBar";
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Dropdown,
  Table,
  Breadcrumb,
  Header,
  Loader,
  Divider,
  Image,
  Accordion,
  Icon,
  Tab,
} from "semantic-ui-react";
import Geographies from "./Geographies";
import Geography from "./Geography";
import ComposableMap from "./ComposableMap";
import { geoCentroid } from "d3-geo";
import { useParams, useNavigate } from "react-router-dom";
import { HEProvider, useHE } from "./HEProvider";
import ReactTooltip from "react-tooltip";
import Marker from "./Marker";
import configs from "./state_config.json";
import VariantFAQ from "./VariantFAQ";
import _, { map, reverse, set } from "lodash";
import Annotation from "./Annotation";
import allStates from "./allstates.json";
import Test_Region from "./Test_regions";
import InputRange from 'react-input-range';
import LatestOnThisDashboard from "./LatestOnThisDashboard";

import {
  LineChart,
  Line,
  Area,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  Cell,
  PieChart,
  Pie,
  LabelList,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
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
  VictoryPie,
} from "victory";
import regionState from "./stateRegionFip.json";
import * as d3 from "d3";
import Slider from "@material-ui/core/Slider";
import { scaleQuantile } from "d3-scale";
const stateColor = "#778899";
const nationColor = "#b1b3b3";
function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
}


function HorizontalPercentageStackedBarChart (props) {
  const data = Object.entries(props.data).reduce((acc, [name, timeseriesData]) => {
    const addedDates = new Set(); // Keep track of which dates we've already added
    Object.entries(timeseriesData).forEach(([date, value]) => {
      const date1 = props.tickFormatter(value.t)
      if (!addedDates.has(date1)) {
        acc.push({ date1, name, value });
        addedDates.add(date1);
      }
    });
    return acc;
  }, []);
  data.sort((a, b) => new Date(a.date1)- new Date(b.date1));

  const uniqueDates = [...new Set(data.map((item) => item.date1))];
  const [selectedDate, setSelectedDate] = useState(uniqueDates.length - 1);

  const filteredData = data.filter(
    (item) => item.date1 === uniqueDates[selectedDate]
  );
  const chartData = filteredData.map((item) => ({
    name: item.name,
    Delta: item.value.Delta,
    Omicron_other:item.value.Omicron_other,
    XBB:item.value.XBB,
    Other:item.value.Other
  }));

  const handleSliderChange = (event, newValue) => {
    setSelectedDate(newValue);
    console.log(newValue)
  };
  // const data=props.data.slice(-10);
  const caseYTickFmt = (y) => {
    return y + "%";
  };
 

// console.log(uniqueDates[selectedDate])
  return (
    <div>
    <Header>

    </Header>
    <Header as="h3" style={{ fontWeight: 400, textAlign: "center", }}>
                    <Header.Content
                      style={{
                        width: 550,
                        fontSize: "15pt",
                       
                      }}
                    >
                  {uniqueDates[selectedDate]}
                    </Header.Content>
                    <Header.Subheader>
                    Slide to select the date
                    </Header.Subheader>
                  </Header>

       <Slider
        value={selectedDate}
        onChange={handleSliderChange}
        step={1}
        min={0}
        max={uniqueDates.length - 1}
        style={{ width: '95%' }}
      />
      {/* <BarChart width={500} height={500} data={data}>
      <CartesianGrid  />
      <XAxis dataKey="t" ticks={props.ticks} tickFormatter={props.tickFormatter} />
      <YAxis  tickFormatter={caseYTickFmt} />
      <Tooltip />
      <Legend />
      <Bar dataKey="XBB" stackId='a' fill="#8884d8" />
      <Bar dataKey="Omicron_other" stackId='a' fill="#82ca9d" />
      <Bar dataKey="Delta" stackId='a' fill="#ffc658" />
    </BarChart> */}
    <BarChart width={500} height={400} data={chartData}>
      <CartesianGrid  />
      <XAxis 
      dataKey='name'
      />
      <YAxis domain={[0, 100]} tickFormatter={caseYTickFmt} />
      <Tooltip />
      <Legend  wrapperStyle={{
      fontSize: "18px"
    }}/>
      <Bar dataKey="XBB" stackId='a' fill="#007dba" />
      <Bar dataKey="Omicron_other" stackId='a' fill="#a45791" />
      <Bar dataKey="Delta" stackId='a' fill="#e8ab3b" />
      <Bar dataKey="Other" stackId='a' fill="red" />
    </BarChart>
    </div>
  );
};


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
    return y + "%";
  };


  return (
    <div style={{ paddingTop: 5, paddingBottom: 10, width: 500 }}>
      <LineChart width={500} height={180} data={data} margin={{ right: 20 }}>
        {/* <CartesianGrid stroke='#f5f5f5'/> */}
        <XAxis
          angle={0}
          dataKey="t"
          ticks={ticks}
          tick={{ marginTop: 2, fontSize: 13 }}
          tickFormatter={tickFormatter}
          allowDuplicatedCategory={false}
        />
        <YAxis tickFormatter={caseYTickFmt} tick={{ fontSize: 16 }} />

        <Line
          data={dataState}
          name="Omicron_XBB"
          type="monotone"
          dataKey="XBB"
          dot={false}
          isAnimationActive={animationBool}
          onAnimationEnd={() => setAnimationBool(false)}
          animationDuration={5500}
          animationBegin={500}
          stroke="#007dba"
          strokeWidth="2"
        />
        <Line
          data={dataState}
          name="Delta"
          type="monotone"
          dataKey="Delta"
          dot={false}
          isAnimationActive={animationBool}
          onAnimationEnd={() => setAnimationBool(false)}
          animationDuration={5500}
          animationBegin={500}
          stroke="#e8ab3b"
          strokeWidth="2"
        />
      <Line
          data={dataState}
          name="Omicron_Other"
          type="monotone"
          dataKey="Omicron_other"
          dot={false}
          isAnimationActive={animationBool}
          onAnimationEnd={() => setAnimationBool(false)}
          animationDuration={5500}
          animationBegin={500}
          stroke="#a45791"
          strokeWidth="2"
        />
         <Line
          data={dataState}
          name="Other"
          type="monotone"
          dataKey="Other"
          dot={false}
          isAnimationActive={animationBool}
          onAnimationEnd={() => setAnimationBool(false)}
          animationDuration={5500}
          animationBegin={500}
          stroke="red"
          strokeWidth="2"
        />

        {/* <ReferenceLine x={data["_nation"][275].t} stroke="red" label="2021" /> */}

        <Tooltip
          labelFormatter={labelFormatter}
          formatter={
            variable === "covidmortality7dayfig"
              ? (value) => numberWithCommas(value.toFixed(1))
              : (value) => numberWithCommas(value.toFixed(0))
          }
          active={true}
        />
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
  const [stateName, setStateName] = useState("The United States");
  const [fips, setFips] = useState("USA");

  const [activeHover, setActiveHover] = useState(false);
  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [caseTicks, setCaseTicks] = useState([]);
  const [stateColor, setStateColor] = useState("");
  const [legendSplit, setLegendSplit] = useState([]);
  const [variantTimeseries, setVariantTimeseries] = useState();
  const [stateMapFips, setStateMapFips] = useState("USA");
  const [tooltipContent, setTooltipContent] = useState("");
  const [vaccineData, setVaccineData] = useState();
  const [showState, setShowState] = useState(false);
  const [variantData, setrVariantData] = useState();
  const [clicked, setClicked] = useState(false);
  const [hoverName, setHoverName] = useState("USA");
  const [fully, setFully] = useState("");
  const d3graph = React.useRef(null);
  const [regionMatched, setRegionMatched] = useState("USA");
  const [stateMatched, setStateMathched] = useState([]);
  
  
  const regionDescribe = {
    "01": "Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island, and Vermont.",
    "02": "New Jersey, New York, Puerto Rico, and the Virgin Islands ",
    "03": "Delaware, District of Columbia, Maryland, Pennsylvania, Virginia, and West Virginia",
    "04": "Alabama, Florida, Georgia, Kentucky, Mississippi, North Carolina, South Carolina, and Tennessee",
    "05": "Illinois, Indiana, Michigan, Minnesota, Ohio, and Wisconsin",
    "06": "Arkansas, Louisiana, New Mexico, Oklahoma, and Texas",
    "07": "Iowa, Kansas, Missouri, and Nebraska",
    "08": "Colorado, Montana, North Dakota, South Dakota, Utah, and Wyoming",
    "09": "Arizona, California, Hawaii, Nevada, American Samoa, Commonwealth of the Northern Mariana Islands, Federated States of Micronesia, Guam, Marshall Islands, and Republic of Palau",
    10: "Alaska, Idaho, Oregon, and Washington",
  };
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
    DC: [49, 21],
  };
  const countyGeoUrl =
    "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
  const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/states-10m.json";
  const [colorScale, setColorScale] = useState();
  const history = useNavigate();
  // const [varMap, setVarMap] = useState(["Delta,Omicron"]);
  const options = [
    { value: "Omicron", label: "Omicron" },
    { value: "Delta", label: "Delta" },
  ];
  const [metric, setMetric] = useState("Omicron");
  const [metricOptions, setMetricOptions] = useState("Omicron");
  const [metricName, setMetricName] = useState("Omicron");
  const colorHighlight = "#f2a900";
  useEffect(() => {
    fetch("/data/variantTimeseries.json")
      .then((res) => res.json())
      .then((x) => {
        setVariantTimeseries(x);
      });
    fetch("/data/variantData.json")
      .then((res) => res.json())
      .then((x) => {
        setrVariantData(x);

        // let stateValue = {}
        // regionState.map((y)=>{
        //   console.log(y);
        //   stateValue[y.id.toString()]=x[y.region].Delta;
        //   setStateColor(stateValue);
        // });

        const cs = scaleQuantile()
          .domain(
            _.map(
              _.filter(
                _.map(x, (d, k) => {
                  d.fips = k;
                  // console.log(d);
                  return d;
                }),
                (d) => d[metric] > 0
              ),
              (d) => d[metric]
            )
          )
          .range(colorPalette);

        let scaleMap = {};
        _.each(x, (d) => {
          if (d[metric] >= 0) {
            scaleMap[d[metric]] = cs(d[metric]);
          }
        });
      
        setColorScale(scaleMap);
   
        var max = 0;
        var min = 100;
        _.each(x, (d) => {
          if (d[metric] > max) {
            max = d[metric];
          } else if (d[metric] < min && d[metric] >= 0) {
            min = d[metric];
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

    // setMetricOptions(varMap.filter(varMap.map(x)=>{
    //   x
    // }))

    //   fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
    //       .then(x => {
    //           setVarMap(x);
    //           setMetricOptions(_.filter(_.map(x, d => {
    //               return { key: d.id, value: d.variable, text: d.name, def: d.definition, group: d.group };
    //           }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
    //       });
  }, [metric]);
  useEffect(() => {
    var w = 500;
    var h = 400;
    const svg = d3
      .select(d3graph.current)
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    d3.json("/data/variantTimeseries.json").then(function (data) {
      const xScale = d3
        .scaleLinear()
        .domain([
          data[regionMatched][0].t,
          data[regionMatched][data[regionMatched].length - 1].t,
        ]);
      const yMinValue = d3.min(data[regionMatched], (d) => d.Delta);
      const yMaxValue = d3.max(data[regionMatched], (d) => d.Delta);
      const yScale = d3
        .scaleLinear()
        .domain([legendMin, legendMax])
        .range([90, 100]);
      svg
        .append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(xScale));

      svg.append("g").call(d3.axisLeft(yScale));

      var line = d3
        .line()
        .x(function (d) {
          console.log(d);
          return xScale;
        })
        .y(function (d) {
          console.log(d);
          return yScale;
        })
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(data[regionMatched])
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");
    });
  });
  const labelTickFmt = (tick) => {
    return (
      // <text>// </ text>
      /* {tick} */
      // monthNames[new Date(tick*1000).getMonth()] + " " +  new Date(tick*1000).getDate()
      new Date(tick * 1000).getFullYear() +
      "/" +
      (new Date(tick * 1000).getMonth() + 1) +
      "/" +
      new Date(tick * 1000).getDate()
    );
  };

  const caseTickFmt = (tick) => {
    // console.log((new Date(tick * 1000).getMonth() + 1) + "/" + new Date(tick * 1000).getDate())
    return (
      // <text>// </ text>
      /* {tick} */
      // monthNames[new Date(tick*1000).getMonth()] + " " +  new Date(tick*1000).getDate()
      new Date(tick * 1000).getMonth() +
      1 +
      "/" +
      new Date(tick * 1000).getDate()+
      "/"+
    new Date(tick * 1000).getFullYear()
    );
  };
  function handleCallback(childData) {
    setStateMapFips(childData);
  }
  function handleClick(childData) {
    setFips(childData);
  }
  if (variantData && variantTimeseries) {
    // console.log(variantTimeseries);
    // console.log(stateMapFips);
    // console.log(variantTimeseries);
    // console.log(variantData['USA'].Delta)
    // console.log(variantData[stateMapFips])
    // console.log((stateColor['13']));
    // console.log(colorScale[stateColor[13]['Delta (B.1.617.2)']]);
    console.log(variantTimeseries)
    return (
      <HEProvider>
        <div>
          <AppBar menu="variants" />
          <Container style={{ marginTop: "8em", minWidth: "1260px" }}>
            <Grid style={{ height: 130, overflow: "hidden" }}>
              <div style={{ paddingBottom: 8 }}></div>

              <div
                style={{ height: 130, overflowY: "hidden", overflowX: "auto" }}
              >
                <div style={{ width: "260%" }}>
                  <LatestOnThisDashboard />
                </div>
              </div>
            </Grid>
            <Divider hidden />
            <Grid
              columns={9}
              style={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
              <Grid.Row style={{ width: "100%", height: "100%" }}>
                <Grid.Column
                  width={9}
                  style={{ width: "100%", height: "100%", paddingRight: 40 }}
                >
                  <Header as="h2" style={{ fontWeight: 400 }}>
                    <Header.Content
                      style={{
                        width: 550,
                        fontSize: "20pt",
                        textAlign: "center",
                      }}
                    >
                      Variant Regional Map
                    </Header.Content>
                 
             
                      <Header.Content
                        style={{
                          fontWeight: 300,
                          fontSize: "14pt",
                          paddingTop: 7,
                          lineHeight: "20pt",
                        }}
                      >
                        The U.S. map shows the estimated proportions of the most
                        common SARS-CoV-2 (the virus that causes COVID-19)
                        variants circulating in the United States, divided by{" "}
                        <a href="https://www.hhs.gov/about/agencies/iea/regional-offices/index.html">
                          HHS regions
                        </a>
                        . Scroll over each region to see the exact breakdown of
                        what proportion of confirmed cases of COVID-19 in that
                        region are due to which variants. Data can be filtered
                        by region and variant.
                      </Header.Content>
                     
                      <Header.Content
                        style={{
                          fontWeight: 300,
                          fontSize: "14pt",
                          paddingTop: 7,
                          lineHeight: "20pt",
                        }}
                      >
                        Currently, the most common variant in region{" "}
                        <b>{stateMapFips}</b> is{" "}
                        <b>
                          {variantData[stateMapFips].Delta >
                          variantData[stateMapFips].XBB
                            ? "Delta"
                            : "Omicron_XBB"}
                        </b>{" "}
                        which accounts for{" "}
                        <b>
                          {variantData[stateMapFips].Delta >
                          variantData[stateMapFips].XBB
                            ? variantData[stateMapFips].Delta
                            : variantData[stateMapFips].XBB}
                        </b>{" "}
                        % of cases.
                      </Header.Content>
                  
                    </Header>
                  <Test_Region
                    parentClick={handleClick}
                    parentCallback={handleCallback}
                  />
                </Grid.Column>         
                <Grid.Column width={7} style={{ paddingLeft: 20 }}>
                
                  <Grid>
                    {/* <Grid.Row columns={1}>
                      <Header.Content
                        style={{
                          fontWeight: 300,
                          fontSize: "14pt",
                          paddingTop: 7,
                          lineHeight: "20pt",
                        }}
                      >
                        The U.S. map shows the estimated proportions of the most
                        common SARS-CoV-2 (the virus that causes COVID-19)
                        variants circulating in the United States, divided by{" "}
                        <a href="https://www.hhs.gov/about/agencies/iea/regional-offices/index.html">
                          HHS regions
                        </a>
                        . Scroll over each region to see the exact breakdown of
                        what proportion of confirmed cases of COVID-19 in that
                        region are due to which variants. Data can be filtered
                        by region and variant.
                      </Header.Content>
                    </Grid.Row> */}
                    <HorizontalPercentageStackedBarChart ticks={caseTicks}
                            tickFormatter={caseTickFmt}  data={variantTimeseries}></HorizontalPercentageStackedBarChart>  
                    
                    <Grid.Row>
                      <div>
                        {fips == "USA" ? (
                          stateMapFips && (
                            <CaseChart
                              data={variantTimeseries}
                              dataState={variantTimeseries[stateMapFips]}
                              lineColor={[colorPalette[1]]}
                              stateFips={stateMapFips}
                              ticks={caseTicks}
                              tickFormatter={caseTickFmt}
                              labelFormatter={labelTickFmt}
                              var={metric}
                            />
                          )
                        ) : (
                          <CaseChart
                            data={variantTimeseries}
                            dataState={variantTimeseries[fips]}
                            lineColor={[colorPalette[1]]}
                            stateFips={fips}
                            ticks={caseTicks}
                            tickFormatter={caseTickFmt}
                            labelFormatter={labelTickFmt}
                            var={metric}
                          />
                        )}
                      </div>
                    </Grid.Row>
                    <Grid.Row>
                      <Header.Content
                        style={{
                          fontWeight: 300,
                          fontSize: "14pt",
                          lineHeight: "20pt",
                        }}
                      >
                        {stateMapFips != "USA"
                          ? "Region " +
                            stateMapFips +
                            " includes : " +
                            regionDescribe[stateMapFips]
                          : ""}
                      </Header.Content>
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
            <Grid>
              <VariantFAQ />
            </Grid>
          </Container>
          {activeHover && (
            <ReactTooltip>
              <font size="+1">
                <b>{hoverName}</b>{" "}
              </font>
              <br />
              <Table celled inverted selectable>         
                <Table.Body>
                  <Table.Row>
                    <Table.HeaderCell
                      style={{ fontSize: "14px", lineHeight: "14px" }}
                    >
                      % Delta
                    </Table.HeaderCell>
                    <Table.Cell
                      style={{
                        fontSize: "14px",
                        lineHeight: "14px",
                        textAlign: "right",
                      }}
                    >
                      {variantData[hoverName].Delta + "%"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.HeaderCell
                      style={{ fontSize: "14px", lineHeight: "14px" }}
                    >
                      {" "}
                      % Alpha
                    </Table.HeaderCell>
                    <Table.Cell
                      style={{
                        fontSize: "14px",
                        lineHeight: "14px",
                        textAlign: "right",
                      }}
                    >
                      {variantData[hoverName].Alpha + "%"}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </ReactTooltip>
          )}
        </div>
      </HEProvider>
    );
  } else {
    return <Loader active inline="centered"></Loader>;
  }
}
