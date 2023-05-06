import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Dropdown,
  Breadcrumb,
  Header,
  Loader,
  Divider,
  Image,
  Accordion,
  Icon,
  Tab,
} from "semantic-ui-react";
import AppBar from "./AppBar";
import { geoCentroid } from "d3-geo";
import Geographies from "./Geographies";
import Geography from "./Geography";
import ComposableMap from "./ComposableMap";
import ReactTooltip from "react-tooltip";
import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  // VictoryLegend,
  VictoryLine,
  VictoryLabel,
  VictoryArea,
  VictoryContainer,
} from "victory";
import { useParams, useNavigate } from "react-router-dom";
import Notes from "./Notes";
import racedatadate from "./Pre-Processed Data/racedatadate.json";
import _, { set } from "lodash";
import { scaleQuantile } from "d3-scale";
import configs from "./state_config.json";
import stateOptions from "./stateOptions.json";
import ReactDOM from "react-dom";
import { CHED_static, CHED_series } from "../stitch/mongodb";
import { HEProvider, useHE } from "./HEProvider";
import { useStitchAuth } from "./StitchAuth";
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
const pieChartRace = [
  "#007dba",
  "#808080",
  "#e8ab3b",
  "#008000",
  "#a45791",
  "#000000",
  "#8f4814",
]; //不是恶心的绿色
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
// function getKeyByValue(object, value) {
//   return Object.keys(object).find(key => object[key] === value);
// }

function getMax(arr, prop) {
  var max;
  for (var i = 0; i < arr.length; i++) {
    if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
      max = arr[i];
  }
  return max;
}

function getMaxRange(arr, prop, range) {
  var max;
  for (var i = range; i < arr.length; i++) {
    if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
      max = arr[i];
  }
  return max;
}

function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
}

//const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
const colorPalette = [
  "#e1dce2",
  "#d3b6cd",
  "#bf88b5",
  "#af5194",
  "#99528c",
  "#633c70",
];
const colorHighlight = "#f2a900";
const stateColor = "#778899";


const SideRaceBarChart = (props) => {
  // https://codesandbox.io/s/recharts-issue-template-70kry?file=/src/index.js

  const [hoverBar, setHoverBar] = useState();
  const [activeIndex, setActiveIndex] = useState(-1);

  // const valueAccessor = attribute => ({ payload }) => {
  //   return payload[attribute] < 3 ? null : ( payload[attribute]=== undefined ? null : (payload[attribute]/barRatio).toFixed(1)+'%');

  // };

  const renderLegend = (props) => {
    const { payload } = props;

    return (
      <ul>
        {payload.map((entry, index) => (
          <li key={`item-${index}`}>{entry.value}</li>
        ))}
      </ul>
    );
  };

  let strokeWidth = 0.6;
  let labelSize = "12px";
  let fontWeight = 500;
  let tickFontSize =
    props.inTab === true && (props.fips === "_nation") === true ? 11 : 12;
  let barSize = props.fips === "_nation" ? 30 : 25;

  const data =
    // show all categories at national level

    [
      {
        name: "White",
        popDist:
          props.stateDeath[props.fips]["White"][0]["popDistribution"] === -9999
            ? 0
            : props.stateDeath[props.fips]["White"][0]["popDistribution"],
        covideathDistribution:
          props.stateDeath[props.fips]["White"][0]["covideathDistribution"] ===
          -9999
            ? 0
            : props.stateDeath[props.fips]["White"][0]["covideathDistribution"],
      },
      {
        name: "Hispanic",
        popDist:
          props.stateDeath[props.fips]["Hispanic"][0]["popDistribution"] ===
          -9999
            ? 0
            : props.stateDeath[props.fips]["Hispanic"][0]["popDistribution"],
        covideathDistribution:
          props.stateDeath[props.fips]["Hispanic"][0][
            "covideathDistribution"
          ] === -9999
            ? 0
            : props.stateDeath[props.fips]["Hispanic"][0][
                "covideathDistribution"
              ],
      },
      {
        name: "African American",
        popDist:
          props.stateDeath[props.fips]["African American"][0][
            "popDistribution"
          ] === -9999
            ? 0
            : props.stateDeath[props.fips]["African American"][0][
                "popDistribution"
              ],
        covideathDistribution:
          props.stateDeath[props.fips]["African American"][0][
            "covideathDistribution"
          ] === -9999
            ? 0
            : props.stateDeath[props.fips]["African American"][0][
                "covideathDistribution"
              ],
      },
      {
        name: "Asian",
        popDist:
          props.stateDeath[props.fips]["Asian"][0]["popDistribution"] === -9999
            ? 0
            : props.stateDeath[props.fips]["Asian"][0]["popDistribution"],
        covideathDistribution:
          props.stateDeath[props.fips]["Asian"][0]["covideathDistribution"] ===
          -9999
            ? 0
            : props.stateDeath[props.fips]["Asian"][0]["covideathDistribution"],
      },
      {
        name: "American Native",
        popDist:
          props.stateDeath[props.fips]["American Natives"][0][
            "popDistribution"
          ] === -9999
            ? 0
            : props.stateDeath[props.fips]["American Natives"][0][
                "popDistribution"
              ],
        covideathDistribution:
          props.stateDeath[props.fips]["American Natives"][0][
            "covideathDistribution"
          ] === -9999
            ? 0
            : props.stateDeath[props.fips]["American Natives"][0][
                "covideathDistribution"
              ],
      },

      {
        name: "NHPI",
        popDist:
          props.stateDeath[props.fips]["NHPI"][0]["popDistribution"] === -9999
            ? 0
            : props.stateDeath[props.fips]["NHPI"][0]["popDistribution"],
        covideathDistribution:
          props.stateDeath[props.fips]["NHPI"][0]["covideathDistribution"] ===
          -9999
            ? 0
            : props.stateDeath[props.fips]["NHPI"][0]["covideathDistribution"],
      },
      {
        name: "Non Hispanic Multiple Races",
        popDist:
          props.stateDeath[props.fips]["Non Hispanic Multiple Races"][0][
            "popDistribution"
          ] === -9999
            ? 0
            : props.stateDeath[props.fips]["Non Hispanic Multiple Races"][0][
                "popDistribution"
              ],
        covideathDistribution:
          props.stateDeath[props.fips]["Non Hispanic Multiple Races"][0][
            "covideathDistribution"
          ] === -9999
            ? 0
            : props.stateDeath[props.fips]["Non Hispanic Multiple Races"][0][
                "covideathDistribution"
              ],
      },
    ];


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
      
          style={{
            background: "white",
            border: "2px",
            borderStyle: "solid",
            borderColor: "#DCDCDC",
            borderRadius: "2px",
            padding: "0.8rem",
          }}
        >
          <p 
          style={{
              color: sideBySideColor[data.indexOf(payload[0].payload)],
              marginBottom: 4,
            }}
         >
            {" "}
            <b> {payload[0].payload.name} </b>{" "}
          </p>
          {/* color: sideBySideColor[data.indexOf(payload[0].payload)] */}
          <p className="label" style={{ marginBottom: 0 }}>
            % Covid Death:{" "}
            {/* {payload[0].payload.vaxvalue === 0
              ? "NA"
              : props.fips === "_nation"
              ? payload[0].payload.covideathDistribution.toFixed(1)
              : payload[0].payload.covideathDistribution} */}
              {props.fips === "_nation"
              ? payload[0].payload.covideathDistribution.toFixed(1)
              : payload[0].payload.covideathDistribution}
          </p>
          <p className="label" style={{ marginBottom: 3 }}>
            % Population:{" "}
            {/* {payload[0].payload.popvalue === 0
              ? "NA"
              : props.fips === "_nation"
              ? payload[0].payload.popDist.toFixed(1)
              : payload[0].payload.popDist} */}
              {props.fips === "_nation"
              ? payload[0].payload.popDist.toFixed(1)
              : payload[0].payload.popDist}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomizedLabellist = (props) => {
    console.log(props);
    const { width, height, x, y, value } = props;
    return (
      <g>
        {(() => {
          if (value === 0) {
            return (
              <text
                x={x + width + 6}
                y={height / 2 + y + 4}
                fill="#000"
                fontSize={labelSize}
              >
                Not Reported
              </text>
            );
          } else if (value > 60) {
            return (
              <text
                x={x + width - 40}
                y={height / 2 + y + 4}
                fill="#FFF"
                fontSize={labelSize}
              >
                {value.toFixed(1)}%
              </text>
            );
          } else {
            return (
              <text
                x={x + width + 6}
                y={height / 2 + y + 4}
                fill="#000"
                fontSize={labelSize}
              >
                {value.toFixed(1)}%
              </text>
            );
          }
        })()}
      </g>
    );
  };

  const CustomizedLabellist_state = (props) => {
    const { width, height, x, y, value } = props;

    return (
      <g>
        {(() => {
          if (value === 0) {
            return (
              <text
                x={x + width + 6}
                y={height / 2 + y + 4}
                fill="#000"
                fontSize={labelSize}
              >
                Not Reported
              </text>
            );
          } else if (value > 60) {
            return (
              <text
                x={x + width - 40}
                y={height / 2 + y + 4}
                fill="#FFF"
                fontSize={labelSize}
              >
                {value}%
              </text>
            );
          } else {
            return (
              <text
                x={x + width + 6}
                y={height / 2 + y + 4}
                fill="#000"
                fontSize={labelSize}
              >
                {value}%
              </text>
            );
          }
        })()}
      </g>
    );
  };

  const valueAccessor = (entry) => {
    return entry ? entry.value.toFixed(1) + "%" : null;
  };

  // console.log('active index', activeIndex);

  const sideBySideColor = [
    pieChartRace[6],
    pieChartRace[5],
    pieChartRace[4],
    pieChartRace[3],
    pieChartRace[1],
    pieChartRace[2],
    pieChartRace[0],
  ];
  const sideBySideColor_sep = [
    pieChartRace[3],
    pieChartRace[1],
    pieChartRace[0],
  ];

  return (
    <div>
      {(() => {
        if (props.fips != "error") {
          return (
            <Grid>
              <Grid.Column
                width={props.inTab === true ? 6 : 7}
                style={{
                  paddingLeft: props.inTab === true ? "0rem" : "0.5rem",
                  paddingTop: "3rem",
                  paddingRight: 0,
                }}
              >
                <Header
                  style={{
                    fontSize: "10pt",
                    paddingLeft: props.inTab === true ? "4.5rem" : "5.5rem",
                  }}
                >
                  {" "}
                  % Covid Deaths{" "}
                </Header>
                <BarChart
                  transform={
                    props.inTab === false
                      ? "translate(10, 0)"
                      : "translate(-15, 0)"
                  }
                  layout="vertical"
                  width={props.inTab === true ? 220 : 250}
                  height={props.inTab === true ? 330 : 330}
                  data={data}
                  margin={{
                    top: 0,
                    right: 15,
                    left: 35,
                    bottom: 0,
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis type="number" domain={[0, 100]} />
                  {/* domain={[dataMin => 0, dataMax => (dataMax.toFixed(0))]} */}
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: tickFontSize, fill: "black" }}
                  />
                  <Tooltip
                    wrapperStyle={{ zIndex: 10 }}
                    content={<CustomTooltip />}
                    // formatter={function(value, name) {
                    //     if(name === hoverBar){
                    //       return [value,name];
                    //     }else {
                    //       return null
                    //     }
                    //   }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="covideathDistribution"
                    barSize={barSize}
                    isAnimationActive={false}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={sideBySideColor[index]}
                      />
                    ))}
                    <LabelList
                      position="right"
                      content={
                        props.fips === "_nation" ? (
                          <CustomizedLabellist />
                        ) : (
                          <CustomizedLabellist_state />
                        )
                      }
                      fill="black"
                      strokeWidth={strokeWidth}
                      fontWeight={fontWeight}
                      fontSize={labelSize}
                    />
                    {/* valueAccessor={valueAccessor} */}
                  </Bar>
                </BarChart>
              </Grid.Column>
              <Grid.Column
                width={9}
                style={{ paddingLeft: 0, paddingTop: "3rem" }}
              >
                <Header style={{ fontSize: "10pt", paddingLeft: "5rem" }}>
                  {" "}
                  % Population{" "}
                </Header>
                <BarChart
                  transform={
                    props.inTab === false
                      ? "translate(10, 0)"
                      : "translate(-15, 0)"
                  }
                  layout="vertical"
                  width={props.inTab === true ? 220 : 250}
                  height={props.inTab === true ? 330 : 330}
                  data={data}
                  margin={{
                    top: 0,
                    right: 15,
                    left: 35,
                    bottom: 0,
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis type="number" domain={[0, 100]} />
                  {/* domain={[dataMin => 0, dataMax => (dataMax.toFixed(0))]} */}
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: tickFontSize, fill: "black" }}
                  />
                  <Tooltip
                    wrapperStyle={{ zIndex: 10 }}
                    content={<CustomTooltip />}
                    // formatter={function(value, name) {
                    //     if(name === hoverBar){
                    //       return [value,name];
                    //     }else {
                    //       return null
                    //     }
                    //   }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="popDist"
                    barSize={barSize}
                    isAnimationActive={false}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={sideBySideColor[index]}
                      />
                    ))}
                    <LabelList
                      position="right"
                      content={
                        props.fips === "_nation" ? (
                          <CustomizedLabellist />
                        ) : (
                          <CustomizedLabellist_state />
                        )
                      }
                      fill="black"
                      strokeWidth={strokeWidth}
                      fontWeight={fontWeight}
                      fontSize={labelSize}
                    />
                    {/* valueAccessor={valueAccessor} */}
                  </Bar>
                </BarChart>
              </Grid.Column>
              {/* {props.fips !== '_nation' ?
            <Grid.Row style={{paddingLeft: '2rem', paddingRight: '6rem'}}>
            <text><b>Note:</b> Native Hawaiian/Pacific Islanders, American Natives, and Multiple/Other races data are not consistently available across sources.</text>
            </Grid.Row>
            : null} */}
            </Grid>
          );
        } else {
          return (
            <Grid>
              <Grid.Row style={{ paddingTop: "7rem" }}>
                <Grid.Column
                  width={props.inTab === true ? 6 : 7}
                  style={{ paddingLeft: "0rem", paddingRight: 0 }}
                >
                  <Header style={{ fontSize: "10pt", paddingLeft: "3rem" }}>
                    {" "}
                    % Population{" "}
                  </Header>
                  <BarChart
                    transform="translate(-15, 0)"
                    layout="vertical"
                    width={210}
                    height={200}
                    data={data}
                    margin={{
                      top: 0,
                      right: 15,
                      left: 30,
                      bottom: 0,
                    }}
                  >
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: tickFontSize, fill: "black" }}
                    />
                    <Tooltip
                      wrapperStyle={{ zIndex: 10 }}
                      content={<CustomTooltip />}
                      cursor={false}
                    />
                    <Bar
                      dataKey="popDist"
                      barSize={barSize}
                      isAnimationActive={false}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={sideBySideColor_sep[index]}
                        />
                      ))}
                      <LabelList
                        position="right"
                        content={<CustomizedLabellist_state />}
                        fill="black"
                        strokeWidth={strokeWidth}
                        fontWeight={fontWeight}
                        fontSize={labelSize}
                      />
                      {/* valueAccessor={valueAccessor} */}
                    </Bar>
                  </BarChart>
                </Grid.Column>
                <Grid.Column width={9} style={{ paddingLeft: 0 }}>
                  <Header style={{ fontSize: "10pt", paddingLeft: "3rem" }}>
                    {" "}
                    % Covid Death{" "}
                  </Header>
                  <BarChart
                    transform="translate(-15, 0)"
                    layout="vertical"
                    width={210}
                    height={200}
                    data={data}
                    margin={{
                      top: 0,
                      right: 15,
                      left: 25,
                      bottom: 0,
                    }}
                  >
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: tickFontSize, fill: "black" }}
                    />
                    <Tooltip
                      wrapperStyle={{ zIndex: 10 }}
                      content={<CustomTooltip />}
                      cursor={false}
                    />
                    <Bar
                      dataKey="covideathDistribution"
                      barSize={barSize}
                      isAnimationActive={false}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={sideBySideColor_sep[index]}
                        />
                      ))}
                      <LabelList
                        position="right"
                        content={<CustomizedLabellist_state />}
                        fill="black"
                        strokeWidth={strokeWidth}
                        fontWeight={fontWeight}
                        fontSize={labelSize}
                      />
                      {/* valueAccessor={valueAccessor} */}
                    </Bar>
                  </BarChart>
                </Grid.Column>
              </Grid.Row>

              {/* <Grid.Row style={{paddingLeft: '2rem', paddingRight: '6rem'}}>
            <text><b>Note:</b> Native Hawaiian/Pacific Islanders, American Natives, and Multiple/Other races data are not consistently available across sources.</text>
          </Grid.Row> */}
            </Grid>
          );
        }
      })()}
      {/* {(() => {
          if ( props.fips !== '_nation') {
            return (
              <Accordion id="vaccine" style={{ paddingTop: 20, paddingLeft: 0, paddingBottom: 15 }} defaultActiveIndex={1} panels={[
                {
                  key: 'acquire-dog',
                  title: {
                    content: <u style={{ fontFamily: 'lato', fontSize: "19px", color: "#397AB9" }}>About the data</u>,
                    icon: 'dropdown',
                  },
                  content: {
                    content: (
                      <Header.Content style={{ fontFamily: 'lato', fontSize: "19px", fontWeight: 300, paddingTop: 5, paddingLeft: 5, width: 400, lineHeight: '20px' }}>
                        The left chart shows the race and ethnicity of persons who have received at least one vaccine dose in {props.stateName}.
                        
                        <br /> <br />
                      * Shares of vaccinations in each state may not sum to 100% due to rounding, pending, or missing data.
                        <br /> <br />
                      For comparison, the right chart shows the race and ethnicity of all adults in the {props.stateName} according to the US Census.
                        <br /> <br />
                      * Vaccination data may not be directly comparable across states due to differences in data reported, reporting periods, racial/ethnic classifications, and/or rates of unknown race/ethnicity.
                      </Header.Content>
                    ),
                  },
                }
              ]
              } />
            )
          }
        })()} */}
    </div>
  );
};

export default function USMap(props) {
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();

  const history = useNavigate();
  const [tooltipContent, setTooltipContent] = useState("");

  const [date, setDate] = useState("");
  const [nationalDemogDate, setNationalDemogDate] = useState("");

  const [data, setData] = useState();
  const [allTS, setAllTS] = useState();
  const [raceData, setRaceData] = useState();
  const [nationalDemog, setNationalDemog] = useState();

  // const [stateName, setStateName] = useState('Georgia');
  // const [fips, setFips] = useState('13');
  const [stateName, setStateName] = useState("The United States");
  const [fips, setFips] = useState("_nation");
  const [stateFips, setStateFips] = useState();

  const [colorScale, setColorScale] = useState();
  const [legendMax, setLegendMax] = useState([]);
  const [legendMin, setLegendMin] = useState([]);
  const [legendSplit, setLegendSplit] = useState([]);
  const [stateDeath, setstateDeath] = useState();
  const [varMap, setVarMap] = useState({});
  // const [metric, setMetric] = useState('seriesCompletePopPct');
  // const [metricOptions, setMetricOptions] = useState('seriesCompletePopPct');
  // const [metricName, setMetricName] = useState('Percent of population fully vaccinated');

  // const [metric, setMetric] = useState('casesfig');
  // const [metricOptions, setMetricOptions] = useState('casesfig');
  // const [metricName, setMetricName] = useState('Total COVID-19 Cases');

  const [metric, setMetric] = useState("caserate7dayfig");
  const [metricOptions, setMetricOptions] = useState("caserate7dayfig");
  const [metricName, setMetricName] = useState(
    "Average Daily COVID-19 Cases per 100K"
  );

  const [delayHandler, setDelayHandler] = useState();

  let newDict = {};
  let fltrdArray = [];
  let stateArray = [];
  let colorArray = [];
  let scaleMap = {};
  var max = 0;
  var min = 100;
  useEffect(() => {
    fetch("/data/rawdata/variable_mapping.json")
      .then((res) => res.json())
      .then((x) => {
        setVarMap(x);
        setMetricOptions(
          _.filter(
            _.map(x, (d) => {
              return {
                key: d.id,
                value: d.variable,
                text: d.name,
                def: d.definition,
                group: d.group,
              };
            }),
            (d) => d.text !== "Urban-Rural Status" && d.group === "outcomes"
          )
        );
      });

    fetch("/data/date.json")
      .then((res) => res.json())
      .then((x) =>
        setDate(
          x.date.substring(5, 7) +
            "/" +
            x.date.substring(8, 10) +
            "/" +
            x.date.substring(0, 4)
        )
      );

    fetch("/data/nationalDemogdate.json")
      .then((res) => res.json())
      .then((x) =>
        setNationalDemogDate(
          x.date.substring(5, 7) +
            "/" +
            x.date.substring(8, 10) +
            "/" +
            x.date.substring(0, 4)
        )
      );

    fetch("/data/nationalDemogdata.json")
      .then((res) => res.json())
      .then((x) => setNationalDemog(x));

    fetch("/data/racedataAll.json")
      .then((res) => res.json())
      .then((x) => setRaceData(x));

    fetch("/data/timeseriesAll.json")
      .then((res) => res.json())
      .then((x) => setAllTS(x));

    fetch("/data/stateDeath.json")
      .then((res) => res.json())
      .then((x) => setstateDeath(x));
    // local
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((x) => {
        setData(x);

        const cs = scaleQuantile()
          .domain(
            _.map(
              _.filter(
                _.map(x, (d, k) => {
                  d.fips = k;
                  return d;
                }),
                (d) => d[metric] > 0 && d.fips.length === 5
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
          if (d[metric] > max && d.fips.length === 5) {
            max = d[metric];
            console.log(metric);
            console.log(d.fips);
            console.log(max);
          } else if (d.fips.length === 5 && d[metric] < min && d[metric] >= 0) {
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

    //mongo
    // if (isLoggedIn === true){
    //   const fetchData = async() => {
    // const mainQ = {all: "all"};
    // const promStatic = await CHED_static.find(mainQ,{projection:{}}).toArray();
    // promStatic.forEach( i => {
    //   if(i.tag === "nationalrawfull"){ //nationalraw
    //     newDict = JSON.parse(JSON.stringify(i.data));

    //     const cs = scaleQuantile()
    //     .domain(_.map(_.filter(newDict,
    //       d => (
    //           d[metric] > 0 &&
    //           d.fips.length === 5)),
    //       d=> d[metric]))
    //     .range(colorPalette);

    //     let scaleMap = {}
    //     _.each(newDict, d=>{
    //       if(d[metric] > 0){
    //       scaleMap[d[metric]] = cs(d[metric])}});

    //     setColorScale(scaleMap);
    //     setLegendSplit(cs.quantiles());

    //     //find the largest value and set as legend max
    //     _.each(newDict, d=> {
    //       if (d[metric] > max && d.fips.length === 5) {
    //         max = d[metric]
    //       } else if (d.fips.length === 5 && d[metric] < min && d[metric] >= 0){
    //         min = d[metric]
    //       }
    //     });

    //     if (max > 999999) {
    //       max = (max/1000000).toFixed(0) + "M";
    //       setLegendMax(max);
    //     }else if (max > 999) {
    //       max = (max/1000).toFixed(0) + "K";
    //       setLegendMax(max);
    //     }else{
    //       setLegendMax(max.toFixed(0));

    //     }
    //     setLegendMin(min.toFixed(0));
    //     setData(newDict);

    //   }else if(i.tag === "racedataAll"){ //race data
    //     setRaceData(i.racedataAll);
    //   }else if(i.tag === "date"){
    //     setDate(i.date.substring(5,7) + "/" + i.date.substring(8,10) + "/" + i.date.substring(0,4));
    //   }else if(i.tag === "nationalDemog"){
    //     setNationalDemog(i.nationalDemog);
    //   }
    // });

    //all states' time series data in one single document
    //       let tempDict = {};
    //       const seriesQ = { $or: [ { state: "_n" } , { tag: "stateonly" } ] };
    //       const promSeries = await CHED_series.find(seriesQ,{projection:{}}).toArray();
    //       tempDict = promSeries[0].timeseriesAll;
    //       tempDict["_nation"] = promSeries[1].timeseries_nation;
    //       setAllTS(tempDict);

    //       //if timeseriesAll exceeds 16MB (max size for a single document on MongoDB),
    //       //use the following code and comment out the above

    //       // const seriesQ = { $or: [ { state: "_n" } , { stateonly: "true" } ] };
    //       // const promSeries = await CHED_series.find(seriesQ,{projection:{}}).toArray();
    //       // promSeries.forEach( i => {
    //       //   if(i.state === "_n"){
    //       //     tempDict["_nation"] = i["timeseries_nation"];
    //       //   }
    //       //   tempDict[i.state] = i["timeseries" + i.state];
    //       // });
    //       // setAllTS(tempDict);
    //     };

    //   fetchData();
    //   } else {
    //   handleAnonymousLogin();
    // }
    //local
  }, [metric]);
  //mongo
  // },[isLoggedIn]);

  //mongo
  // useEffect(() =>{
  //     const cs = scaleQuantile()
  //     .domain(_.map(_.filter(data,
  //       d => (
  //           d[metric] > 0 &&
  //           d.fips.length === 5)),
  //       d=> d[metric]))
  //     .range(colorPalette);

  //     let scaleMap = {}
  //     _.each(data, d=>{
  //       if(d[metric] > 0){
  //       scaleMap[d[metric]] = cs(d[metric])}});

  //     setColorScale(scaleMap);
  //     setLegendSplit(cs.quantiles());

  //     //find the largest value and set as legend max
  //     _.each(data, d=> {
  //       if (d[metric] > max && d.fips.length === 5) {
  //         max = d[metric]
  //       } else if (d.fips.length === 5 && d[metric] < min && d[metric] >= 0){
  //         min = d[metric]
  //       }
  //     });

  //     if (max > 999999) {
  //       max = (max/1000000).toFixed(0) + "M";
  //       setLegendMax(max);
  //     }else if (max > 999) {
  //       max = (max/1000).toFixed(0) + "K";
  //       setLegendMax(max);
  //     }else{
  //       setLegendMax(max.toFixed(0));

  //     }
  //     setLegendMin(min.toFixed(0));

  // }, [metric]);
  const panes = [
    {
      menuItem: {
        content: (
          <p style={{ fontSize: "9.5pt" }}>
            COVID-19<br></br>Death Rates
          </p>
        ),
      },
      render: () => (
        <Grid>
          <Grid.Row columns={1}>
            <Grid.Column style={{ paddingTop: 0, paddingBottom: 3 }}>
              <Header
                as="h2"
                style={{
                  width: "420",
                  textAlign: "center",
                  fontSize: "16pt",
                  lineHeight: "16pt",
                  paddingTop: "2rem",
                }}
              >
                <Header.Content>COVID-19 Death Rate per 100k</Header.Content>
              </Header>
              <VictoryChart
                theme={VictoryTheme.material}
                width={530}
                height={200}
                domainPadding={20}
                minDomain={{ y: props.ylog ? 1 : 0 }}
                padding={{ left: 160, right: 100, top: 10, bottom: 10 }}
                style={{
                  fontWeight: 300,
                  paddingLeft: 100,
                  paddingTop: 8,
                  paddingBottom: 28,
                  fontSize: "19px",
                  lineHeight: "18pt",
                }}
                containerComponent={<VictoryContainer responsive={false} />}
              >
                <VictoryAxis
                  style={{
                    ticks: { stroke: "#FFFFFF" },
                    axis: { stroke: "#000000" },
                    grid: { stroke: "transparent" },
                    axis: { stroke: "#000000" },
                    labels: { fill: "#000000", fontSize: "20px" },
                    tickLabels: {
                      fontSize: "16px",
                      fill: "#000000",
                      fontFamily: "lato",
                    },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  label="COVID-19 Cases per 100,000 Residents"
                  style={{
                    ticks: { stroke: "transparent" },
                    grid: { stroke: "transparent" },
                    axis: { stroke: "#000000" },
                    axisLabel: {
                      fontSize: "20px",
                      fill: "#000000",
                      fontFamily: "lato",
                    },
                    labels: {
                      fontSize: "20px",
                      fill: "#000000",
                      fontFamily: "lato",
                    },
                    tickLabels: {
                      fontSize: "0px",
                      fill: "#000000",
                      padding: 10,
                      fontFamily: "lato",
                    },
                  }}
                />
                <VictoryBar
                  horizontal
                  barRatio={0.6}
                  labels={({ datum }) =>
                    numberWithCommas(parseFloat(datum.value).toFixed(0))
                  }
                  data={[
                    {
                      key: "Multiple Races",
                      value:
                        stateDeath[fips]["Non Hispanic Multiple Races"][0][
                          "populacoviddeathRatetion"
                        ] == "-9999" ||
                        stateDeath[fips]["Non Hispanic Multiple Races"][0][
                          "covidDeaths"
                        ] == "-9999"
                          ? 0
                          : stateDeath[fips]["Non Hispanic Multiple Races"][0][
                              "coviddeathRate"
                            ],
                      label:
                        stateDeath[fips]["Non Hispanic Multiple Races"][0][
                          "coviddeathRate"
                        ] == "-9999"
                          ? "Not Reported"
                          : numberWithCommas(
                              stateDeath[fips][
                                "Non Hispanic Multiple Races"
                              ][0]["coviddeathRate"].toFixed(0)
                            ),
                    },
                    {
                      key: "NHPI",
                      value:
                        stateDeath[fips]["NHPI"][0]["coviddeathRate"] ==
                          "-9999" ||
                        stateDeath[fips]["NHPI"][0]["covidDeaths"] == "-9999"
                          ? 0
                          : stateDeath[fips]["NHPI"][0]["coviddeathRate"],
                      label:
                        stateDeath[fips]["NHPI"][0]["coviddeathRate"] == "-9999"
                          ? "Not Reported"
                          : numberWithCommas(
                              stateDeath[fips]["NHPI"][0][
                                "coviddeathRate"
                              ].toFixed(0)
                            ),
                    },
                    {
                      key: "American Native",
                      value:
                        stateDeath[fips]["American Natives"][0][
                          "coviddeathRate"
                        ] == "-9999" ||
                        stateDeath[fips]["American Natives"][0][
                          "covidDeaths"
                        ] == "-9999"
                          ? 0
                          : stateDeath[fips]["American Natives"][0][
                              "coviddeathRate"
                            ],
                      label:
                        stateDeath[fips]["American Natives"][0][
                          "coviddeathRate"
                        ] == "-9999"
                          ? "Not Reported"
                          : numberWithCommas(
                              stateDeath[fips]["American Natives"][0][
                                "coviddeathRate"
                              ].toFixed(0)
                            ),
                    },
                    {
                      key: "Asian",
                      value:
                        stateDeath[fips]["Asian"][0]["coviddeathRate"] ==
                          "-9999" ||
                        stateDeath[fips]["Asian"][0]["covidDeaths"] == "-9999"
                          ? 0
                          : stateDeath[fips]["Asian"][0]["coviddeathRate"],
                      label:
                        stateDeath[fips]["Asian"][0]["coviddeathRate"] ==
                        "-9999"
                          ? "Not Reported"
                          : numberWithCommas(
                              stateDeath[fips]["Asian"][0][
                                "coviddeathRate"
                              ].toFixed(0)
                            ),
                    },
                    {
                      key: "African American",
                      value:
                        stateDeath[fips]["African American"][0][
                          "coviddeathRate"
                        ] == "-9999" ||
                        stateDeath[fips]["African American"][0][
                          "covidDeaths"
                        ] == "-9999"
                          ? 0
                          : stateDeath[fips]["African American"][0][
                              "coviddeathRate"
                            ],
                      label:
                        stateDeath[fips]["African American"][0][
                          "coviddeathRate"
                        ] == "-9999"
                          ? "Not Reported"
                          : numberWithCommas(
                              stateDeath[fips]["African American"][0][
                                "coviddeathRate"
                              ].toFixed(0)
                            ),
                    },
                    {
                      key: "Hispanic",
                      value:
                        stateDeath[fips]["Hispanic"][0]["coviddeathRate"] ==
                          "-9999" ||
                        stateDeath[fips]["Hispanic"][0]["covidDeaths"] ==
                          "-9999"
                          ? 0
                          : stateDeath[fips]["Hispanic"][0]["coviddeathRate"],
                      label:
                        stateDeath[fips]["Hispanic"][0]["coviddeathRate"] ==
                        "-9999"
                          ? "Not Reported"
                          : numberWithCommas(
                              stateDeath[fips]["Hispanic"][0][
                                "coviddeathRate"
                              ].toFixed(0)
                            ),
                    },
                    {
                      key: "White",
                      value:
                        stateDeath[fips]["White"][0]["coviddeathRate"] ==
                          "-9999" ||
                        stateDeath[fips]["White"][0]["covidDeaths"] == "-9999"
                          ? 0
                          : stateDeath[fips]["White"][0]["coviddeathRate"],
                      label:
                        stateDeath[fips]["White"][0]["coviddeathRate"] ==
                        "-9999"
                          ? "Not Reported"
                          : numberWithCommas(
                              stateDeath[fips]["White"][0][
                                "coviddeathRate"
                              ].toFixed(0)
                            ),
                    },
                  ]}
                  labelComponent={
                    <VictoryLabel
                      dx={5}
                      style={{
                        fontFamily: "lato",
                        fontSize: "18px",
                        fill: "#000000",
                      }}
                    />
                  }
                  style={{
                    data: {
                      fill: "#004071",
                    },
                  }}
                  // style={{
                  //     data: {
                  //         fill: casesColor[1]
                  //     }
                  // }}
                  x="key"
                  y="value"
                />
              </VictoryChart>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ paddingTop: 22, paddingBottom: 53 }}>
            <Header.Content
              style={{
                fontWeight: 300,
                fontSize: "14pt",
                paddingTop: 7,
                lineHeight: "18pt",
              }}
            >
              The chart shows race and ethnicity groups that constitute at least
              1% of the state population and have 30 or more deaths. Race and
              ethnicity data are known for 95% of deaths in the nation. Rates
              are not reported for race & ethnic groups with {"<"} 30 deaths
              recorded or groups that constitute at least 1% of the state
              population. NHPI: Native Hawaiians and Pacific Islanders.
              <br />
              <br /> <i>Data source</i>:{" "}
              <a
                style={{ color: "#397AB9" }}
                href="https://covid.cdc.gov/covid-data-tracker/#demographics"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                The CDC{" "}
              </a>
              <br />
              <b>Deaths by Race & Ethnicity data as of:</b> {racedatadate.date}.
              <br />
            </Header.Content>
          </Grid.Row>
        </Grid>
      ),
    },
    {
      menuItem: {
        content: (
          <p style={{ fontSize: "9.5pt" }}>
            COVID-19<br></br>Death and Population
          </p>
        ),
      },
      render: () => (
        <Grid>
          <SideRaceBarChart stateDeath={stateDeath} fips={fips} />
          <Grid.Row style={{ paddingTop: 22, paddingBottom: 53 }}>
            <Header.Content
              style={{
                fontWeight: 300,
                fontSize: "14pt",
                paddingTop: 7,
                lineHeight: "18pt",
              }}
            >
              The percentage of COVID-19 deaths by race in{" "}
              {stateName == "The United States"
                ? "the United States"
                : stateName}{" "}
              is shown on the left, and the percentage of the population by race
              in{" "}
              {stateName == "The United States"
                ? "the United States"
                : stateName}{" "}
              is shown on the right. Race and ethnicity data are known for 95%
              of deaths in the nation. Rates are not reported for race & ethnic
              groups with {"<"} 30 deaths recorded or groups that constitute at
              least 1% of the state population. NHPI: Native Hawaiians and
              Pacific Islanders.
              <br />
              <br /> <i>Data source</i>:{" "}
              <a
                style={{ color: "#397AB9" }}
                href="https://covid.cdc.gov/covid-data-tracker/#demographics"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                The CDC{" "}
              </a>
              <br />
              <b>Deaths by Race & Ethnicity data as of:</b> {racedatadate.date}.
              <br />
            </Header.Content>
          </Grid.Row>
        </Grid>
      ),
    },
  ];

  if (data && allTS && metric && raceData) {
    // console.log(isJson(JSON.stringify(data)));
    // console.log(data);
    console.log(
      allTS["_nation"][
        allTS["_nation"].length - 1
      ].percent14dayDailyCases.toFixed(0)
    );
    return (
      <HEProvider>
        <div>
          <AppBar menu="countyReport" />
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
            {/* <Breadcrumb style={{ fontSize: "14pt", paddingTop: "14pt" }}>
              <Breadcrumb.Section active>United States</Breadcrumb.Section>
              <Breadcrumb.Divider style={{ fontSize: "14pt" }} />
            </Breadcrumb> */}
            <Divider hidden />
            <Grid
              columns={9}
              style={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
              <Grid.Row style={{ width: "100%", height: "100%" }}>
                <Grid.Column
                  width={9}
                  style={{ width: "100%", height: "100%" }}
                >
                  <div
                    style={{
                      fontSize: "14pt",
                      paddingTop: 5,
                      paddingBottom: 20,
                    }}
                  >
                    See Dashboard Guide (
                    <a
                      style={{ color: "#397AB9" }}
                      href="Dashboard user guide.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      PDF{" "}
                    </a>{" "}
                    /{" "}
                    <a
                      style={{ color: "#397AB9" }}
                      href="https://youtu.be/fV1mzyUIjis"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      YouTube{" "}
                    </a>
                    )
                  </div>
                  <Header as="h2" style={{ fontWeight: 400, fontSize: "18pt" }}>
                    <Header.Content>
                      COVID-19 is affecting every community differently.
                      <br />
                      Some areas are much harder-hit than others.
                      <br />
                      What is happening where you live?
                      <Header.Subheader
                        style={{ fontWeight: 300 }}
                      ></Header.Subheader>
                    </Header.Content>
                  </Header>

                  <Grid.Row
                    columns={2}
                    style={{
                      width: 680,
                      padding: 0,
                      paddingTop: 0,
                      paddingRight: 0,
                      paddingBottom: 0,
                    }}
                  >
                    <Dropdown
                      style={{
                        background: "#fff",
                        fontSize: "14pt",
                        fontWeight: 400,
                        theme: "#000000",
                        width: "420px",
                        top: "2px",
                        left: "0px",
                        text: "Select",
                        borderTop: "none",
                        borderLeft: "0px solid #FFFFFF",
                        borderRight: "0px",
                        borderBottom: "0.5px solid #bdbfc1",
                        borderRadius: 0,
                        minHeight: "1.0em",
                        paddingRight: 0,
                        paddingBottom: "0.5em",
                      }}
                      text={metricName}
                      pointing="top"
                      search
                      selection
                      options={metricOptions}
                      onChange={(e, { value }) => {
                        setMetric(value);
                        setMetricName(varMap[value]["name"]);
                      }}
                    />

                    <svg width="260" height="80">
                      {_.map(legendSplit, (splitpoint, i) => {
                        if (legendSplit[i] < 1) {
                          return (
                            <text
                              key={i}
                              x={70 + 20 * i}
                              y={35}
                              style={{ fontSize: "0.7em" }}
                            >
                              {" "}
                              {legendSplit[i].toFixed(1)}
                            </text>
                          );
                        } else if (legendSplit[i] > 999999) {
                          return (
                            <text
                              key={i}
                              x={70 + 20 * i}
                              y={35}
                              style={{ fontSize: "0.7em" }}
                            >
                              {" "}
                              {(legendSplit[i] / 1000000).toFixed(0) + "M"}
                            </text>
                          );
                        } else if (legendSplit[i] > 999) {
                          return (
                            <text
                              key={i}
                              x={70 + 20 * i}
                              y={35}
                              style={{ fontSize: "0.7em" }}
                            >
                              {" "}
                              {(legendSplit[i] / 1000).toFixed(0) + "K"}
                            </text>
                          );
                        }
                        return (
                          <text
                            key={i}
                            x={70 + 20 * i}
                            y={35}
                            style={{ fontSize: "0.7em" }}
                          >
                            {" "}
                            {legendSplit[i].toFixed(0)}
                          </text>
                        );
                      })}
                      <text x={50} y={35} style={{ fontSize: "0.7em" }}>
                        {legendMin}
                      </text>
                      <text x={170} y={35} style={{ fontSize: "0.7em" }}>
                        {legendMax}
                      </text>

                      {_.map(colorPalette, (color, i) => {
                        return (
                          <rect
                            key={i}
                            x={50 + 20 * i}
                            y={40}
                            width="20"
                            height="20"
                            style={{
                              fill: color,
                              strokeWidth: 1,
                              stroke: color,
                            }}
                          />
                        );
                      })}

                      <text x={50} y={74} style={{ fontSize: "0.8em" }}>
                        Low
                      </text>
                      <text
                        x={50 + 20 * (colorPalette.length - 1)}
                        y={74}
                        style={{ fontSize: "0.8em" }}
                      >
                        High
                      </text>

                      <rect
                        x={195}
                        y={40}
                        width="20"
                        height="20"
                        style={{
                          fill: "#FFFFFF",
                          strokeWidth: 0.5,
                          stroke: "#000000",
                        }}
                      />
                      <text x={217} y={50} style={{ fontSize: "0.7em" }}>
                        {" "}
                        None{" "}
                      </text>
                      <text x={217} y={59} style={{ fontSize: "0.7em" }}>
                        {" "}
                        Reported{" "}
                      </text>
                    </svg>
                  </Grid.Row>

                  <ComposableMap
                    projection="geoAlbersUsa"
                    data-tip=""
                    width={630}
                    height={380}
                    strokeWidth={0.1}
                    stroke="black"
                    projectionConfig={{ scale: 750 }}
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) => (
                        <svg>
                          {setStateFips(fips)}
                          {geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onMouseEnter={() => {
                                const stateFip = geo.id.substring(0, 2);
                                const configMatched = configs.find(
                                  (s) => s.fips === stateFip
                                );

                                setFips(geo.id.substring(0, 2));
                                setStateFips(geo.id.substring(0, 2));
                                setStateName(configMatched.name);
                              }}
                              onMouseLeave={() => {
                                setTooltipContent("");
                                setFips("_nation");
                                setStateFips("_nation");
                                setStateName("The United States");
                              }}
                              onClick={() => {
                                history("/" + geo.id.substring(0, 2) + "");
                              }}
                              fill={
                                fips === geo.id.substring(0, 2)
                                  ? colorHighlight
                                  : colorScale &&
                                    data[geo.id] &&
                                    data[geo.id][metric] > 0
                                  ? colorScale[data[geo.id][metric]]
                                  : "#FFFFFF"
                              }
                            />
                          ))}
                        </svg>
                      )}
                    </Geographies>
                  </ComposableMap>
                  <Grid>
                    <Header.Content
                      style={{
                        fontWeight: 300,
                        fontSize: "14pt",
                        paddingTop: 73,
                        lineHeight: "18pt",
                        width: 640,
                      }}
                    >
                      <b>Data as of:</b> {date}
                    </Header.Content>
                    <Grid.Row>
                      {stateFips && (
                        <Accordion
                          style={{ paddingTop: 0, paddingLeft: 10 }}
                          defaultActiveIndex={1}
                          panels={[
                            {
                              key: "acquire-dog",
                              title: {
                                content: (
                                  <u
                                    style={{
                                      fontFamily: "lato",
                                      fontSize: "19px",
                                      color: "#397AB9",
                                    }}
                                  >
                                    About the data
                                  </u>
                                ),
                                icon: "dropdown",
                              },
                              content: {
                                content: (
                                  <Header.Content
                                    style={{
                                      width: 640,
                                      fontWeight: 300,
                                      fontSize: "14pt",
                                      lineHeight: "18pt",
                                    }}
                                  >
                                    {stateFips == "_nation"
                                      ? ""
                                      : stateName +
                                        " is reporting the number of fully vaccinated and percent of population fully vaccinated" +
                                        (stateFips === "48"
                                          ? " (population aged 16 years and older)"
                                          : " (the entire population)")}
                                    {stateFips == "_nation" ? "" : <br />}
                                    <b>
                                      <em> {varMap[metric].name} </em>
                                    </b>{" "}
                                    {varMap[metric].definition} <br />
                                    For a complete table of definitions, click{" "}
                                    <a
                                      style={{ color: "#397AB9" }}
                                      href="https://covid19.emory.edu/data-sources"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {" "}
                                      here.{" "}
                                    </a>
                                  </Header.Content>
                                ),
                              },
                            },
                          ]}
                        />
                      )}
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
                <Grid.Column width={7} style={{ paddingLeft: 0 }}>
                  <Header as="h2" style={{ fontWeight: 400 }}>
                    <Header.Content
                      style={{
                        width: 550,
                        fontSize: "18pt",
                        textAlign: "center",
                      }}
                    >
                      Current Cases and Deaths in {stateName}
                      {/* <Dropdown
                      style={{background: '#fff', 
                              fontSize: "24px",
                              fontWeight: 400, 
                              theme: '#000000',
                              width: '230px',
                              top: '0px',
                              left: '0px',
                              text: "Select",
                              borderTop: 'none',
                              borderLeft: 'none',
                              borderRight: 'none', 
                              borderBottom: '0.5px solid #bdbfc1',
                              borderRadius: 0,
                              minHeight: '1.0em',
                              paddingBottom: '0.5em'}}
                      text= {stateName}
                      search
                      pointing = 'top'
                      options={stateOptions}
                      onChange={(e, { value}) => {
                        
                        setStateFips(value);
                        setFips(value);
                        const configMatched = configs.find(s => s.fips === value);
                        setStateName(configMatched.name);           
                        // setStateName(st[stateFips + value]);
                        
                                
                      }}
                    />     */}
                    </Header.Content>
                  </Header>
                  <Grid>
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <div>
                          {stateFips && (
                            <VictoryChart
                              minDomain={{
                                x: stateFips
                                  ? allTS[stateFips][
                                      allTS[stateFips].length - 15
                                    ].t
                                  : allTS["13"][allTS["13"]["13"].length - 15]
                                      .t,
                              }}
                              maxDomain={{
                                y: !stateFips
                                  ? getMaxRange(
                                      allTS["13"],
                                      "caseRateMean",
                                      allTS["13"].length - 15
                                    ).caseRateMean
                                  : getMaxRange(
                                      allTS[stateFips],
                                      "caseRateMean",
                                      allTS[stateFips].length - 15
                                    ).caseRateMean * 1.45,
                              }}
                              width={235}
                              height={180}
                              padding={{
                                marginLeft: 0,
                                right: -1,
                                top: 150,
                                bottom: -0.9,
                              }}
                              containerComponent={
                                <VictoryContainer responsive={false} />
                              }
                            >
                              <VictoryAxis
                                tickValues={
                                  stateFips
                                    ? [
                                        allTS[stateFips][
                                          allTS[stateFips].length -
                                            Math.round(
                                              allTS[stateFips].length / 3
                                            ) *
                                              2 -
                                            1
                                        ].t,
                                        allTS[stateFips][
                                          allTS[stateFips].length -
                                            Math.round(
                                              allTS[stateFips].length / 3
                                            ) -
                                            1
                                        ].t,
                                        allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].t,
                                      ]
                                    : [
                                        allTS["13"][
                                          allTS["13"].length -
                                            Math.round(allTS["13"].length / 3) *
                                              2 -
                                            1
                                        ].t,
                                        allTS["13"][
                                          allTS["13"].length -
                                            Math.round(allTS["13"].length / 3) -
                                            1
                                        ].t,
                                        allTS["13"][allTS["13"].length - 1].t,
                                      ]
                                }
                                style={{
                                  grid: { background: "#ccdee8" },
                                  tickLabels: { fontSize: 10 },
                                }}
                                tickFormat={(t) =>
                                  new Date(t * 1000).toLocaleDateString()
                                }
                              />

                              <VictoryGroup colorScale={[stateColor]}>
                                <VictoryLine
                                  data={
                                    stateFips && allTS[stateFips]
                                      ? allTS[stateFips]
                                      : allTS["13"]
                                  }
                                  x="t"
                                  y="caseRateMean"
                                />
                              </VictoryGroup>
                              <VictoryArea
                                style={{
                                  data: { fill: "#00BFFF", fillOpacity: 0.1 },
                                }}
                                data={
                                  stateFips && allTS[stateFips]
                                    ? allTS[stateFips]
                                    : allTS["13"]
                                }
                                x="t"
                                y="caseRateMean"
                              />

                              <VictoryLabel
                                text={
                                  stateFips
                                    ? numberWithCommas(
                                        allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].dailyCases.toFixed(0)
                                      )
                                    : numberWithCommas(
                                        allTS["13"][
                                          allTS["13"].length - 1
                                        ].dailyCases.toFixed(0)
                                      )
                                }
                                x={80}
                                y={80}
                                textAnchor="middle"
                                style={{
                                  fontSize: 40,
                                  fontFamily: "lato",
                                  fill: "#004071",
                                }}
                              />

                              <VictoryLabel
                                text={
                                  stateFips
                                    ? allTS[stateFips][
                                        allTS[stateFips].length - 1
                                      ].percent14dayDailyCases.toFixed(0) > 0
                                      ? allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyCases.toFixed(0) +
                                        "%"
                                      : allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyCases.toFixed(0) < 0
                                      ? allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyCases
                                          .toFixed(0)
                                          .substring(1) + "%"
                                      : allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyCases
                                          .toFixed(0)
                                          .substring(1) + "%"
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyCases.toFixed(0) > 0
                                    ? allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyCases.toFixed(0) + "%"
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyCases.toFixed(0) < 0
                                    ? allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyCases
                                        .toFixed(0)
                                        .substring(1) + "%"
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyCases.toFixed(0) + "%"
                                }
                                x={stateFips === "_nation" ? 202 : 182}
                                y={80}
                                textAnchor="middle"
                                style={{
                                  fontSize: 24,
                                  fontFamily: "lato",
                                  fill: "#004071",
                                }}
                              />

                              <VictoryLabel
                                text={
                                  stateFips
                                    ? allTS[stateFips][
                                        allTS[stateFips].length - 1
                                      ].percent14dayDailyCases.toFixed(0) > 0
                                      ? "↑"
                                      : allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyCases.toFixed(0) < 0
                                      ? "↓"
                                      : ""
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyCases.toFixed(0) > 0
                                    ? "↑"
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyCases.toFixed(0) < 0
                                    ? "↓"
                                    : ""
                                }
                                x={stateFips === "_nation" ? 165 : 145}
                                y={80}
                                textAnchor="middle"
                                style={{
                                  fontSize: 24,
                                  fontFamily: "lato",

                                  fill: stateFips
                                    ? allTS[stateFips][
                                        allTS[stateFips].length - 1
                                      ].percent14dayDailyCases.toFixed(0) > 0
                                      ? "#FF0000"
                                      : allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyCases.toFixed(0) < 0
                                      ? "#32CD32"
                                      : ""
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyCases.toFixed(0) > 0
                                    ? "#FF0000"
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyCases.toFixed(0) < 0
                                    ? "#32CD32"
                                    : "",
                                }}
                              />

                              <VictoryLabel
                                text={"14-day"}
                                x={stateFips === "_nation" ? 200 : 180}
                                y={100}
                                textAnchor="middle"
                                style={{
                                  fontSize: 12,
                                  fontFamily: "lato",
                                  fill: "#004071",
                                }}
                              />
                              <VictoryLabel
                                text={"change"}
                                x={stateFips === "_nation" ? 200 : 180}
                                y={110}
                                textAnchor="middle"
                                style={{
                                  fontSize: 12,
                                  fontFamily: "lato",
                                  fill: "#004071",
                                }}
                              />
                              <VictoryLabel
                                text={"Daily Cases"}
                                x={120}
                                y={20}
                                textAnchor="middle"
                                style={{
                                  fontSize: "19px",
                                  fontFamily: "lato",
                                  fill: "#004071",
                                }}
                              />
                            </VictoryChart>
                          )}
                        </div>
                      </Grid.Column>
                      <Grid.Column>
                        <div>
                          {stateFips && (
                            <VictoryChart
                              theme={VictoryTheme.material}
                              minDomain={{
                                x: stateFips
                                  ? allTS[stateFips][
                                      allTS[stateFips].length - 15
                                    ].t
                                  : allTS["13"][allTS["13"].length - 15].t,
                                y: 0,
                              }}
                              maxDomain={{
                                y: stateFips
                                  ? getMax(allTS[stateFips], "mortalityMean")
                                      .mortalityMean * 1.1
                                  : getMax(allTS["13"], "mortalityMean")
                                      .mortalityMean * 1.5,
                              }}
                              width={235}
                              height={180}
                              padding={{
                                left: 0,
                                right: -1,
                                top: 150,
                                bottom: -0.9,
                              }}
                              containerComponent={
                                <VictoryContainer responsive={false} />
                              }
                            >
                              <VictoryAxis
                                tickValues={
                                  stateFips
                                    ? [
                                        allTS[stateFips][
                                          allTS[stateFips].length -
                                            Math.round(
                                              allTS[stateFips].length / 3
                                            ) *
                                              2 -
                                            1
                                        ].t,
                                        allTS[stateFips][
                                          allTS[stateFips].length -
                                            Math.round(
                                              allTS[stateFips].length / 3
                                            ) -
                                            1
                                        ].t,
                                        allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].t,
                                      ]
                                    : [
                                        allTS["13"][
                                          allTS["13"].length -
                                            Math.round(allTS["13"].length / 3) *
                                              2 -
                                            1
                                        ].t,
                                        allTS["13"][
                                          allTS["13"].length -
                                            Math.round(allTS["13"].length / 3) -
                                            1
                                        ].t,
                                        allTS["13"][allTS["13"].length - 1].t,
                                      ]
                                }
                                style={{ tickLabels: { fontSize: 10 } }}
                                tickFormat={(t) =>
                                  new Date(t * 1000).toLocaleDateString()
                                }
                              />

                              <VictoryGroup colorScale={[stateColor]}>
                                <VictoryLine
                                  data={
                                    stateFips && allTS[stateFips]
                                      ? allTS[stateFips]
                                      : allTS["13"]
                                  }
                                  x="t"
                                  y="mortalityMean"
                                />
                              </VictoryGroup>

                              <VictoryArea
                                style={{
                                  data: {
                                    fill: "#00BFFF",
                                    stroke: "#00BFFF",
                                    fillOpacity: 0.1,
                                  },
                                }}
                                data={
                                  stateFips && allTS[stateFips]
                                    ? allTS[stateFips]
                                    : allTS["13"]
                                }
                                x="t"
                                y="mortalityMean"
                              />

                              <VictoryLabel
                                text={
                                  stateFips
                                    ? numberWithCommas(
                                        allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].dailyMortality.toFixed(0)
                                      )
                                    : numberWithCommas(
                                        allTS["13"][
                                          allTS["13"].length - 1
                                        ].dailyMortality.toFixed(0)
                                      )
                                }
                                x={80}
                                y={80}
                                textAnchor="middle"
                                style={{
                                  fontSize: 40,
                                  fontFamily: "lato",
                                  fill: "#004071",
                                }}
                              />

                              <VictoryLabel
                                text={
                                  stateFips
                                    ? allTS[stateFips][
                                        allTS[stateFips].length - 1
                                      ].percent14dayDailyDeaths.toFixed(0) > 0
                                      ? allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyDeaths.toFixed(0) +
                                        "%"
                                      : allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyDeaths.toFixed(0) < 0
                                      ? allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyDeaths
                                          .toFixed(0)
                                          .substring(1) + "%"
                                      : "0%"
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyDeaths.toFixed(0) > 0
                                    ? allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyDeaths.toFixed(0) + "%"
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyDeaths.toFixed(0) < 0
                                    ? allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyDeaths
                                        .toFixed(0)
                                        .substring(1) + "%"
                                    : "0%"
                                }
                                x={stateFips === "_nation" ? 202 : 182}
                                y={80}
                                textAnchor="middle"
                                style={{
                                  fontSize: 24,
                                  fontFamily: "lato",
                                  fill: "#004071",
                                }}
                              />

                              <VictoryLabel
                                text={
                                  stateFips
                                    ? allTS[stateFips][
                                        allTS[stateFips].length - 1
                                      ].percent14dayDailyDeaths.toFixed(0) > 0
                                      ? "↑"
                                      : allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyDeaths.toFixed(0) < 0
                                      ? "↓"
                                      : ""
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyDeaths.toFixed(0) > 0
                                    ? "↑"
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyDeaths.toFixed(0) < 0
                                    ? "↓"
                                    : ""
                                }
                                x={stateFips === "_nation" ? 166 : 146}
                                y={80}
                                textAnchor="middle"
                                style={{
                                  fontSize: 24,
                                  fontFamily: "lato",

                                  fill: stateFips
                                    ? allTS[stateFips][
                                        allTS[stateFips].length - 1
                                      ].percent14dayDailyDeaths.toFixed(0) > 0
                                      ? "#FF0000"
                                      : allTS[stateFips][
                                          allTS[stateFips].length - 1
                                        ].percent14dayDailyDeaths.toFixed(0) < 0
                                      ? "#32CD32"
                                      : ""
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyDeaths.toFixed(0) > 0
                                    ? "#FF0000"
                                    : allTS["13"][
                                        allTS["13"].length - 1
                                      ].percent14dayDailyDeaths.toFixed(0) < 0
                                    ? "#32CD32"
                                    : "",
                                }}
                              />

                              <VictoryLabel
                                text={"14-day"}
                                x={stateFips === "_nation" ? 200 : 180}
                                y={100}
                                textAnchor="middle"
                                style={{
                                  fontSize: 12,
                                  fontFamily: "lato",
                                  fill: "#004071",
                                }}
                              />
                              <VictoryLabel
                                text={"change"}
                                x={stateFips === "_nation" ? 200 : 180}
                                y={110}
                                textAnchor="middle"
                                style={{
                                  fontSize: 12,
                                  fontFamily: "lato",
                                  fill: "#004071",
                                }}
                              />
                              <VictoryLabel
                                text={"Daily Deaths"}
                                x={120}
                                y={20}
                                textAnchor="middle"
                                style={{
                                  fontSize: "19px",
                                  fontFamily: "lato",
                                  fill: "#004071",
                                }}
                              />
                            </VictoryChart>
                          )}
                        </div>
                      </Grid.Column>
                      <Header.Content
                        style={{
                          fontWeight: 300,
                          paddingLeft: 15,
                          fontSize: "14pt",
                          lineHeight: "18pt",
                        }}
                      >
                        *14-day change trends use 7-day averages.
                      </Header.Content>
                    </Grid.Row>

                    <Header as="h2" style={{ fontWeight: 400 }}>
                      <Header.Content
                        style={{
                          width: 550,
                          fontSize: "18pt",
                          textAlign: "center",
                        }}
                      >
                        Disparities in COVID-19 Mortality{" "}
                        <b>{fips !== "_nation" ? stateName : "Nation"}</b>
                      </Header.Content>
                    </Header>
                    <Tab panes={panes} renderActiveOnly />
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Notes />
          </Container>
          {/* <ReactTooltip overridePosition = {(currentEvent, currentTarget, node, place, desiredPlace, effect, offset) => ({left: 400, top: 600})}>  */}
          <ReactTooltip offset={{ top: 40 }}>
            <font size="+2">
              <b>{stateName}</b>{" "}
            </font>
            <br />
            <b>Click for county-level data.</b>
          </ReactTooltip>{" "}
        </div>
      </HEProvider>
    );
  } else {
    return <Loader active inline="centered" />;
  }
}
