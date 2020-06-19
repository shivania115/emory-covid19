import React, { useEffect, useState } from 'react'
import { Container, Dropdown, Header, Grid } from 'semantic-ui-react'
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import stateOptions from "./stateOptions.json";
import configs from "./state_config.json";
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";


const colorPalette = [
        "#e1dce2",
        "#d3b6cd",
        "#bf88b5", 
        "#af5194", 
        "#99528c", 
        "#633c70", 
      ];
const colorPalette2 = [
        "#e1dce2",
        "#71C7EC",
        "#1EBBD7",
        "#0B92BF", 
        "#0270A1", 
        "#024174",  
      ];

export default function CountyCompare() {

  const [stateFips, setStateFips] = useState();
  const [measureA, setMeasureA] = useState();
  const [measureB, setMeasureB] = useState();  
  const [colorScaleA, setColorScaleA] = useState();
  const [colorScaleB, setColorScaleB] = useState();
  const [config, setConfig] = useState();
  const [tooltipContent, setTooltipContent] = useState('');
  const [data, setData] = useState();
  const [varMap, setVarMap] = useState({});
  const [measureOptionsA, setMeasureOptionsA] = useState([]);
  const [measureOptionsB, setMeasureOptionsB] = useState([]);

  const [legendSplitA, setLegendSplitA] = useState([]);
  const [legendSplitB, setLegendSplitB] = useState([]);

  const [legendMaxA, setLegendMaxA] = useState([]);
  const [legendMaxB, setLegendMaxB] = useState([]);

  const [legendMinA, setLegendMinA] = useState([]);
  const [legendMinB, setLegendMinB] = useState([]);

  const [name, setName] = useState([]);



  useEffect(()=>{
    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        setMeasureOptionsA(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.name, text: d.name, group: d.group};
        }), d => (d.text !== "Urban-Rural Status") && (d.group === "outcomes")));
        setMeasureOptionsB(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.name, text: d.name, group: d.group};
        }), d => (d.text !== "Urban-Rural Status") && (d.group !== "outcomes")));

      });
  }, []);

  useEffect(()=>{
    
    const configMatched = configs.find(s => s.fips === stateFips);
    setConfig(configMatched);

    if (stateFips && varMap){
      fetch('/data/data.json').then(res => res.json())
        .then(data => {
          let coldata = {};
          const dataFltrd = _.filter(_.map(data, (d, k)=>{d.fips=k; return d;}), (d)=> (
                 d.fips.length===5 &&
                 d.fips.substring(0,2)===stateFips));
          _.each(dataFltrd, (d) => {
            _.each(d, (v, k)=>{
              if (varMap[k]){
                if (!(varMap[k].name in coldata)){
                  coldata[varMap[k].name] = {};
                }
                coldata[varMap[k].name][d.fips] = v; 
              }
            });
          });
          setData(coldata);

        });
      setMeasureA(null);
      setMeasureB(null);
      setColorScaleA(null);
      setColorScaleB(null);
    }
  }, [stateFips]);

  useEffect(() => {
    if (measureA){
      const cs = scaleQuantile()
        .domain(_.map(data[measureA], d=>d))
        .range(colorPalette);
      let scaleMap = {}
      _.each(data[measureA], d=>{
        scaleMap[d] = cs(d)});
      setColorScaleA(scaleMap);
      
      var splitA = scaleQuantile()
        .domain(_.map(data[measureA], d=>d))
        .range(colorPalette);

      setLegendSplitA(splitA.quantiles());

      var maxA = 0
      var minA = 0
      _.each(data[measureA],d=>{
        if (d > maxA) {
          maxA = d
        }else if (d < minA && d >= 0){
            minA = d
        }
      });

      if (maxA > 999) {
        setLegendMaxA((maxA/1000).toFixed(0) + "K");
      }else{
        setLegendMaxA(maxA.toFixed(0));
      }
      setLegendMinA(minA.toFixed(0));

      setName(measureA);
    }
  }, [measureA]);

  useEffect(() => {
    if (measureB){
      const cs = scaleQuantile()
        .domain(_.map(data[measureB], d=>d))
        .range(colorPalette2);
      let scaleMap = {}
      _.each(data[measureB], d=>{
        scaleMap[d] = cs(d)});
      setColorScaleB(scaleMap);

      var splitB = scaleQuantile()
        .domain(_.map(data[measureB], d=>d))
        .range(colorPalette);

      setLegendSplitB(splitB.quantiles());

      var maxB = 0
      var minB = 0
      _.each(data[measureB],d=>{
        if (d > maxB) {
          maxB = d
        }else if (d < minB && d >=0){
          minB = d
        }
      });
      if (maxB > 999) {
        setLegendMaxB((maxB/1000).toFixed(0) + "K");
      }else{
        setLegendMaxB(maxB.toFixed(0));

      }
      setLegendMinB(minB.toFixed(0));
    }
  }, [measureB]);  



  return (
      <div>
        <AppBar menu='countyCompare'/>
        <Container style={{marginTop: '8em'}}>
          <Header as='h3'>
            <Header.Content style={{fontWeight: 400}}>
              Side-by-Side View of Counties in&nbsp;
              <Dropdown
                icon=''
                style={{background: '#fff', 
                        fontWeight: 400, 
                        width: '200px',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none', 
                        borderBottom: '1px solid #bdbfc1',
                        borderRadius: 0,
                        minHeight: '2.2em',
                        paddingBottom: '0.2em'}}
                placeholder='Select State'
                inline
                search
                selection
                options={stateOptions}
                onChange={(e, { value }) => {
                  setStateFips(value);
                }}
              />
            </Header.Content>
          </Header>

          {config &&
          <Grid columns={2} style={{paddingTop: '2em', minHeight: '400px'}}>
            <Grid.Row>
              <Grid.Column>
                <Grid columns={2} centered>
                  <Grid.Column>
                  <svg width = "500" height="30">
                       <text x={0} y={15} style={{fontSize: '1.4em'}}>COVID-19 Outcome Measure:  </text>
                  </svg>
                    <Dropdown
                      style={{background: '#fff', 
                              fontWeight: 400, 
                              borderTop: 'none',
                              borderLeft: 'none',
                              borderRight: 'none', 
                              borderBottom: '1ox solid #bdbfc1',
                              borderRadius: 0}}
                      placeholder='Select Measure'
                      search
                      selection
                      value={measureA}
                      options={measureOptionsA}
                      onChange={(e, { value }) => {
                        setMeasureA(value)
                      }}
                    />

                    <svg width="450" height="110">
                            {_.map(colorPalette, (color, i) => {
                              return <rect key={i} x={40*i} y={40} width="40" height="40" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                            })} 
                            <rect x={280} y={40} width="40" height="40" style={{fill: '#FFFFFF', strokeWidth:0.1, stroke: '#000000'}}/>
                            <text x={330} y={58} style={{fontSize: '1.2em'}}> None </text>
                            <text x={330} y={74} style={{fontSize: '1.2em'}}> Reported </text>
                            <text x={0} y={36} style={{fontSize: '1.2em'}}> Low </text>
                            <text x={40 * (colorPalette.length - 1)} y={36} style={{fontSize: '1.2em'}}> High </text> 
                            {_.map(legendSplitA, (split, i) => {
                              if (legendSplitA[0].toFixed(0) == legendSplitA[1].toFixed(0) && legendSplitA[1].toFixed(0) == legendSplitA[2].toFixed(0) && legendSplitA[2].toFixed(0) == legendSplitA[3].toFixed(0) && legendSplitA[3].toFixed(0) == legendSplitA[4].toFixed(0) ) {
                                return <text x={40 + 40*i} y={95} style={{fontSize: '1.0em'}}> {legendSplitA[i].toFixed(2) < 0? 0:legendSplitA[i].toFixed(2)} </text>
                              }else if (legendSplitA[i].toFixed(0) < 1) {
                                return <text x={40 + 40*i} y={95} style={{fontSize: '1.0em'}}> {legendSplitA[i].toFixed(1) < 0? 0:legendSplitA[i].toFixed(1)} </text>
                              }else if (legendSplitA[i] > 999) {
                                return <text x={40 + 40*i} y={95} style={{fontSize: '1.0em'}}> {(legendSplitA[i]/1000).toFixed(0) < 0? 0:(legendSplitA[i]/1000).toFixed(0)}K </text>
                              }
                              return <text x={40 + 40*i} y={95} style={{fontSize: '1.0em'}}> {legendSplitA[i].toFixed(0) < 0? 0:legendSplitA[i].toFixed(0)} </text>                    
                            })}
                            <text x={0} y={95} style={{fontSize: '1.0em'}}> {legendMinA} </text> 
                            <text x={240} y={95} style={{fontSize: '1.0em'}}> {legendMaxA} </text> 

                    </svg>

                  </Grid.Column>
                </Grid>
              </Grid.Column>
              <Grid.Column>
                <Grid columns={2} centered>
                  <Grid.Column>

                  <svg width = "500" height="30">
                      <text x={0} y={15} style={{fontSize: '1.4em'}}>COVID-19 County Population Characteristics:  </text>
                  </svg>

                    <Dropdown
                      style={{background: '#fff', 
                              fontWeight: 400, 
                              borderTop: 'none',
                              borderLeft: 'none',
                              borderRight: 'none', 
                              borderBottom: '1ox solid #bdbfc1',
                              borderRadius: 0}}
                      placeholder='Select Measure'
                      fluid
                      labeled
                      search
                      selection
                      value={measureB}
                      options={measureOptionsB}
                      onChange={(e, { value }) => {
                        setMeasureB(value)
                      }}
                    />

                    <svg width="450" height="110">
                            {_.map(colorPalette2, (color, i) => {
                              return <rect key={i} x={40*i} y={40} width="40" height="40" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                            })} 
                            <rect x={280} y={40} width="40" height="40" style={{fill: '#FFFFFF', strokeWidth:0.1, stroke: '#000000'}}/>
                            <text x={330} y={58} style={{fontSize: '1.2em'}}> None </text>
                            <text x={330} y={74} style={{fontSize: '1.2em'}}> Reported </text>
                            <text x={0} y={36} style={{fontSize: '1.2em'}}>Low</text>
                            <text x={40 * (colorPalette2.length - 1)} y={36} style={{fontSize: '1.2em'}}>High</text> 
                            {_.map(legendSplitB, (split, i) => {
                              if (legendSplitB[0].toFixed(0) == legendSplitB[1].toFixed(0) && legendSplitB[1].toFixed(0) == legendSplitB[2].toFixed(0) && legendSplitB[2].toFixed(0) == legendSplitB[3].toFixed(0) && legendSplitB[3].toFixed(0) == legendSplitB[4].toFixed(0) ) {
                                return <text x={40 + 40*i} y={95} style={{fontSize: '1.0em'}}> {legendSplitB[i].toFixed(2) < 0? 0:legendSplitB[i].toFixed(2)} </text>
                              }else if (legendSplitB[i].toFixed(0) < 1) {
                                return <text x={40 + 40*i} y={95} style={{fontSize: '1.0em'}}> {legendSplitB[i].toFixed(1)< 0? 0:legendSplitB[i].toFixed(1)} </text>
                              }else if (legendSplitB[i] > 999) {
                                return <text x={40 + 40*i} y={95} style={{fontSize: '1.0em'}}> {(legendSplitB[i]/1000).toFixed(0)< 0? 0:(legendSplitB[i]/1000).toFixed(0)}K </text>
                              }
                              return <text x={40 + 40*i} y={95} style={{fontSize: '1.0em'}}> {legendSplitB[i].toFixed(0)< 0? 0:legendSplitB[i].toFixed(0)} </text>                    
                            })}   
                            <text x={0} y={95} style={{fontSize: '1.0em'}}> {legendMinB} </text> 
                            <text x={240} y={95} style={{fontSize: '1.0em'}}> {legendMaxB} </text>

                            

                    </svg>

                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <ComposableMap projection="geoAlbersUsa" 
                  projectionConfig={{scale:`${config.scale}`}} 
                  width={500} 
                  height={600} 
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
                        onMouseEnter={()=>{
                          if(measureA && colorScaleA){
                            const cur = data[measureA][geo.properties.COUNTYFP];
                            setTooltipContent(cur?(Math.round(cur*100)/100):'');
                          }
                        }}
                        onMouseLeave={()=>{
                          setTooltipContent("")
                        }}
                        fill={(measureA && colorScaleA && data[measureA][stateFips+geo.properties.COUNTYFP])?
                                colorScaleA[data[measureA][stateFips+geo.properties.COUNTYFP]] : "#FFFFFF"}
                      />
                    )}
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column>
                <ComposableMap projection="geoAlbersUsa" 
                  projectionConfig={{scale:`${config.scale}`}} 
                  width={500} 
                  height={600} 
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
                        onMouseEnter={()=>{
                          if(measureB && colorScaleB){
                            const cur = data[measureB][geo.properties.COUNTYFP];
                            setTooltipContent(cur?(Math.round(cur*100)/100):'');
                          }
                        }}
                        onMouseLeave={()=>{
                          setTooltipContent("")
                        }}
                        fill = {(measureB && colorScaleB && data[measureB][stateFips+geo.properties.COUNTYFP])?
                                colorScaleB[data[measureB][stateFips+geo.properties.COUNTYFP]] : "#FFFFFF"}
                      />
                    )}
                  </Geographies>
                </ComposableMap>
                <ReactTooltip>{tooltipContent}</ReactTooltip>
              </Grid.Column>
            </Grid.Row>  
          </Grid>
          }
          <Notes />
        </Container>

      </div>
    );

}