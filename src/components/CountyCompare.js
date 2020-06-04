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
  const [measureOptions, setMeasureOptions] = useState([]);

  useEffect(()=>{
    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        setMeasureOptions(_.filter(_.map(x, d=> {
          return {key: d.name, value: d.name, text: d.name};
        }), d => d.key !== "Urban-Rural Status"));
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
    }
  }, [measureA]);

  useEffect(() => {
    if (measureB){
      const cs = scaleQuantile()
        .domain(_.map(data[measureB], d=>d))
        .range(colorPalette);
      let scaleMap = {}
      _.each(data[measureB], d=>{
        scaleMap[d] = cs(d)});
      setColorScaleB(scaleMap);
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

          <svg width="600" height="55">
           <text x={0} y={15} style={{fontSize: '0.8em'}}>COVID-19 Outcome Measure:  </text>
                  {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={20*i} y={20} width="20" height="20" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                  })} 
                  <text x={0} y={52} style={{fontSize: '0.8em'}}>Low</text>
                  <text x={20 * (colorPalette.length - 1)} y={52} style={{fontSize: '0.8em'}}>High</text>
          </svg>

          {config &&
          <Grid columns={2} style={{paddingTop: '2em', minHeight: '400px'}}>
            <Grid.Row>
              <Grid.Column>
                <Grid columns={2} centered>
                  <Grid.Column>
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
                      options={measureOptions}
                      onChange={(e, { value }) => {
                        setMeasureA(value)
                      }}
                    />
                  </Grid.Column>
                </Grid>
              </Grid.Column>
              <Grid.Column>
                <Grid columns={2} centered>
                  <Grid.Column>
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
                      options={measureOptions}
                      onChange={(e, { value }) => {
                        setMeasureB(value)
                      }}
                    />
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
                                colorScaleA[data[measureA][stateFips+geo.properties.COUNTYFP]] : "#EEE"}
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
                                colorScaleB[data[measureB][stateFips+geo.properties.COUNTYFP]] : "#EEE"}
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