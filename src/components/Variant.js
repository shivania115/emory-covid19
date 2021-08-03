import AppBar from './AppBar';
import React, { useEffect, useState } from 'react'
import { Container, Grid, Dropdown, Breadcrumb, Header, Loader, Divider, Image, Accordion, Icon, Tab } from 'semantic-ui-react'
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { useParams, useHistory } from 'react-router-dom';
import { HEProvider, useHE } from './HEProvider';
import configs from "./state_config.json";
import _, { set } from 'lodash';
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
    VictoryContainer
} from 'victory';
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
export default function Variant(props) {
    const [stateName, setStateName] = useState('The United States');
    const [fips, setFips] = useState('_nation');
    const [stateFips, setStateFips] = useState();
    const [data, setData] = useState();
    const [legendSplit, setLegendSplit] = useState([]);
    const [tooltipContent, setTooltipContent] = useState('');
    const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"
    const [colorScale, setColorScale] = useState();
    const history = useHistory();
    const [varMap, setVarMap] = useState({});
    const [metric, setMetric] = useState('caserate7dayfig');
    const [metricOptions, setMetricOptions] = useState('caserate7dayfig');
    const [metricName, setMetricName] = useState('Delta');
    const colorHighlight = '#f2a900';
    useEffect(() => {
        fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
            .then(x => {
                setVarMap(x);
                setMetricOptions(_.filter(_.map(x, d => {
                    return { key: d.id, value: d.variable, text: d.name, def: d.definition, group: d.group };
                }), d => (d.text !== "Urban-Rural Status" && d.group === "outcomes")));
            });
    });
    console.log(metricOptions);
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

                                    {/* <svg width="260" height="80">

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

                    </svg> */}
                                </Grid.Row>
                                <ComposableMap
                                    projection="geoAlbersUsa"
                                    data-tip=""
                                    width={630}
                                    height={380}
                                    strokeWidth={0.1}
                                    stroke='black'
                                    projectionConfig={{ scale: 750 }}


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

                                                            const stateFip = geo.id.substring(0, 2);
                                                            const configMatched = configs.find(s => s.fips === stateFip);

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
                                                            history.push("/" + geo.id.substring(0, 2) + "");
                                                        }}


                                                        fill={fips === geo.id.substring(0, 2) ? colorHighlight :
                                                            ((colorScale && data[geo.id] && (data[geo.id][metric]) > 0) ?
                                                                colorScale[data[geo.id][metric]] :
                                                                '#FFFFFF')}

                                                    />
                                                ))}
                                            </svg>
                                        }
                                    </Geographies>

                                </ComposableMap>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>


                </Container>
            </div>
        </HEProvider>
    )
}