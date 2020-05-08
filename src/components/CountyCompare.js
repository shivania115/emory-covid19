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
import measureOptions from "./measureOptions.json";
import configs from "./state_config.json";
import _ from 'lodash';
import { scaleQuantile } from "d3-scale";

export default function CountyCompare() {

  const [stateFips, setStateFips] = useState();
  const [measureA, setMeasureA] = useState();
  const [measureB, setMeasureB] = useState();  
  const [colorScaleA, setColorScaleA] = useState();
  const [colorScaleB, setColorScaleB] = useState();
  const [config, setConfig] = useState();
  const [tooltipContent, setTooltipContent] = useState('');
  const [dataBar, setDataBar] = useState();

  useEffect(()=>{
    
    const configMatched = configs.find(s => s.fips === stateFips);
    setConfig(configMatched);

    if (stateFips){
      fetch('/emory-covid19/data/barchartSV' + stateFips + '.json').then(res => res.json())
        .then(data => {
          let coldata = {};
          const dataFltrd = _.filter(data, (d, k)=>{
              _.each(d, (item)=> {item.fips = k});
              return (["scatter", "nation", "state", ""].indexOf(k) < 0);
            });
          _.each(dataFltrd, (d) => {
            _.each(d, (item)=>{
              if (!(item.nameShort in coldata)){
                coldata[item.nameShort] = {}
              }
              coldata[item.nameShort][item.fips] = item.value; 
            });
          });
          setDataBar(coldata);
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
        .domain(_.map(dataBar[measureA], d=>d))
        .range([
          "#ffedea",
          "#ffcec5",
          "#ffad9f",
          "#ff8a75",
          "#ff5533",
          "#e2492d",
          "#be3d26",
          "#9a311f",
          "#782618"
        ]);
      let scaleMap = {}
      _.each(dataBar[measureA], d=>{
        scaleMap[d] = cs(d)});
      setColorScaleA(scaleMap);
    }
  }, [measureA]);

  useEffect(() => {
    if (measureB){
      const cs = scaleQuantile()
        .domain(_.map(dataBar[measureB], d=>d))
        .range([
          "#ffedea",
          "#ffcec5",
          "#ffad9f",
          "#ff8a75",
          "#ff5533",
          "#e2492d",
          "#be3d26",
          "#9a311f",
          "#782618"
        ]);
      let scaleMap = {}
      _.each(dataBar[measureB], d=>{
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
                            const cur = dataBar[measureA][geo.properties.COUNTYFP];
                            setTooltipContent(cur?(Math.round(cur*100)/100):'');
                          }
                        }}
                        onMouseLeave={()=>{
                          setTooltipContent("")
                        }}
                        fill={(measureA && colorScaleA && dataBar[measureA][geo.properties.COUNTYFP])?
                                colorScaleA[dataBar[measureA][geo.properties.COUNTYFP]] : "#EEE"}
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
                            const cur = dataBar[measureB][geo.properties.COUNTYFP];
                            setTooltipContent(cur?(Math.round(cur*100)/100):'');
                          }
                        }}
                        onMouseLeave={()=>{
                          setTooltipContent("")
                        }}
                        fill = {(measureB && colorScaleB && dataBar[measureB][geo.properties.COUNTYFP])?
                                colorScaleB[dataBar[measureB][geo.properties.COUNTYFP]] : "#EEE"}
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