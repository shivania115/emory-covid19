import React, { useEffect, useState } from 'react'
import { Container, Dropdown, Header, Grid, Loader } from 'semantic-ui-react'
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import stateOptions from "./stateOptions.json";
import configs from "./state_config.json";
import _, { split } from 'lodash';
import { scaleQuantile } from "d3-scale";
import { var_option_mapping, CHED_static, CHED_series} from "../stitch/mongodb";
import {HEProvider, useHE} from './HEProvider';
import {useStitchAuth} from "./StitchAuth";
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"

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

export default function MapState() {
  const {
    isLoggedIn,
    actions: { handleAnonymousLogin },
  } = useStitchAuth();  
  const [stateFips, setStateFips] = useState();
  const [measureA, setMeasureA] = useState();
  const [measureB, setMeasureB] = useState();  
  const [colorScaleA, setColorScaleA] = useState();
  const [colorScaleB, setColorScaleB] = useState();
  const [config, setConfig] = useState();
  const [tooltipContent, setTooltipContent] = useState('');
  const [data, setData] = useState();
  const [oriData, setOriginalData] = useState();
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
  const [stateName, setStateName] = useState('');



  useEffect(()=>{
    fetch('/data/rawdata/variable_mapping.json').then(res => res.json())
      .then(x => {
        setVarMap(x);
        setMeasureOptionsA(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.name, text: d.name, group: d.group};
        }), d => (d.text !== "Urban-Rural Status") && (d.group === "outcomes")));
        setMeasureOptionsB(_.filter(_.map(x, d=> {
          return {key: d.id, value: d.name, text: d.name, group: d.group};
        }), d => (d.text !== "region") 
                && (d.text !== "Any Condition Prevalence2") && (d.text !== "Diabetes Prevalence") && (d.text !== "Heart Disease") 
                && (d.text !== "Chronic Obstructive Pulmonary Disease") && (d.text !== "Chronic Kidney Disease")
              && (d.text !== "Urban-Rural Status Name") && (d.text !== "Region Status Code") && (d.group === "exposure" || d.group === "misc" ) && (d.group !== "text") && (d.group !== "other") 
              || (d.text === "Percent of population fully vaccinated" || d.text === "Number fully vaccinated" 
              || d.text === "Percent of population 18+ fully vaccinated" || d.text === "Percent of population 65+ fully vaccinated")));

      });
  }, []);

  //local start
  // useEffect(() => {
  //   fetch('/data/data.json').then(res => res.json())
  //     .then(x => setOriginalData(x));
  // }, []);

  //local end

  //mongo start
  useEffect(() =>{
    if (isLoggedIn === true){
      let newDict = {};

      const fetchData = async() => {
          const mainQ = {all: "all"};
          const promStatic = await CHED_static.find(mainQ,{projection:{}}).toArray();
          promStatic.forEach( i => {
            if(i.tag === "nationalrawfull"){ //nationalraw
              newDict = i.data;
              setOriginalData(newDict);
            }
          });
        };
      fetchData();
      } else {
      handleAnonymousLogin();
    }
  }, [isLoggedIn]);
  //mongo end

  useEffect(()=>{
    
    const configMatched = configs.find(s => s.fips === stateFips);
    if (!configMatched){
      setStateName("Select State");
    }else{

      setConfig(configMatched);

      setStateName(configMatched.name);
    }


    if (varMap && stateFips !== "_nation"){
      let coldata = {};
      const dataFltrd = _.filter(_.map(oriData, (d, k)=>{d.fips=k; return d;}), (d)=> (
              d.fips.length===5 &&
              d.fips.substring(0,2)===stateFips));
      _.each(dataFltrd, (d) => {
        _.each(d, (v, k)=>{
          if (varMap[k]){
            if (!(varMap[k].name in coldata)){
              coldata[varMap[k].name] = {};
            }
            if(v > 0){
              coldata[varMap[k].name][d.fips] = v; 
            }
          }
        });
      });
      setData(coldata);
      setMeasureA(null);
      setMeasureB(null);
      setColorScaleA(null);
      setColorScaleB(null);
    } 
    else if (varMap && stateFips === "_nation"){
      let coldata = {};
      const dataFltrd = _.filter(_.map(oriData, (d, k)=>{d.fips=k; return d;}), (d)=> (
        d.fips.length===5 ));
      _.each(dataFltrd, (d) => {
        _.each(d, (v, k)=>{
          if (varMap[k]){
            if (!(varMap[k].name in coldata)){
              coldata[varMap[k].name] = {};
            }
            if(v > 0){
              coldata[varMap[k].name][d.fips] = v; 
            }
            
          }
        });
      });
      setData(coldata);
      setMeasureA(null);
      setMeasureB(null);
      setColorScaleA(null);
      setColorScaleB(null);
    }
  }, [stateFips]);

  useEffect(() => {

    if (measureA && stateFips){
      const cs = scaleQuantile()
        .domain(_.map(data[measureA], d=>d))
        .range(colorPalette);
      let scaleMapA = {}
      _.each(data[measureA], d=>{
        scaleMapA[d] = cs(d)});
      setColorScaleA(scaleMapA);
      
      var splitA = scaleQuantile()
        .domain(_.map(data[measureA], d=>d))
        .range(colorPalette);

      setLegendSplitA(splitA.quantiles());

      var maxA = 1
      var minA = 100
      _.each(data[measureA],d=>{
        if (d > maxA) {
          maxA = d
        }else if ( d < minA && d > 0){
          minA = d
        }
      });

      // if (maxA > 999) {
      //   setLegendMaxA((maxA/1000).toFixed(0) + "K");
      // }else{
      //   setLegendMaxA(maxA.toFixed(0));
      // }

      if (maxA > 999999) {
        setLegendMaxA((maxA/1000000).toFixed(1) + "M");
      }else if (maxA > 999) {
        setLegendMaxA((maxA/1000).toFixed(0) + "K");
      }else{
        setLegendMaxA(maxA.toFixed(0));
      }
      setLegendMinA(minA.toFixed(0));

      setName(measureA);
    } 
  }, [measureA]);

  useEffect(() => {
    if (measureB && stateFips){
      const cs = scaleQuantile()
        .domain(_.map(data[measureB], d=>d))
        .range(colorPalette2);
      let scaleMapB = {}
      _.each(data[measureB], d=>{
        scaleMapB[d] = cs(d)});
      setColorScaleB(scaleMapB);

      var splitB = scaleQuantile()
        .domain(_.map(data[measureB], d=>d))
        .range(colorPalette);

      setLegendSplitB(splitB.quantiles());

      var maxB = 1
      var minB = 100
      _.each(data[measureB],d=>{
        if (d > maxB) {
          maxB = d
        }else if (d < minB && d > 0){
          minB = d
        }
      });
      if (maxB > 999999) {
        setLegendMaxB((maxB/1000000).toFixed(1) + "M");
      }else if (maxB > 999) {
        setLegendMaxB((maxB/1000).toFixed(0) + "K");
      }else{
        setLegendMaxB(maxB.toFixed(0));

      }
      setLegendMinB(minB.toFixed(0));
    }
  }, [measureB]);  
  
  if (data && oriData) {
    console.log(measureB);
    return (
      <HEProvider> 
        <div>
          <AppBar menu='mapState'/>
          <Container style={{marginTop: '8em', minWidth: '1260px'}}>
            <Header as='h3'>
              <Header.Content style={{paddingTop: 8, fontWeight: 400, fontSize: "14pt"}}>

                Side-by-Side View of Counties in&nbsp;
                <Dropdown
                  style={{background: '#fff', 
                          fontWeight: 400, 
                          fontSize: "14pt",
                          width: '200px',
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none', 
                          borderBottom: '1px solid #bdbfc1',
                          borderRadius: 0,
                          minHeight: '2.2em',
                          paddingBottom: '0.2em'}}
                  text= {stateName}
                  search
                  selection
                  options={stateOptions}
                  onChange={(e, { value }) => {
                    setStateFips(value);
                  }}
                />
              </Header.Content>
            </Header>

            
            <Grid columns={2} style={{paddingTop: '2em', minHeight: '400px'}}>
              <Grid.Row>
                <Grid.Column>
                  <Grid columns={2} centered>
                    <Grid.Column>
                    <svg width = "500" height="30">
                        <text x={0} y={15} style={{fontSize: '14pt'}}>COVID-19 Outcome Measure:  </text>
                    </svg>
                      <Dropdown
                        style={{background: '#fff', 
                                width: 460, 
                                fontWeight: 400, 
                                fontSize: "14pt",
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none', 
                                borderBottom: '1ox solid #bdbfc1',
                                borderRadius: 0}}
                        text= {measureA ? measureA:"Select Measure"}
                        search
                        selection
                        value={measureA}
                        options={measureOptionsA}
                        onChange={(e, { value }) => {
                          setMeasureA(value);
                        }}
                      />
                      {measureA && legendSplitA && legendMinA && legendMaxA && colorPalette && 
                      <svg width="450" height="110">
                              
                        {_.map(legendSplitA, (split, i) => {
                          if (legendSplitA[0].toFixed(0) === legendSplitA[1].toFixed(0) && legendSplitA[1].toFixed(0) === legendSplitA[2].toFixed(0) && legendSplitA[2].toFixed(0) === legendSplitA[3].toFixed(0) && legendSplitA[3].toFixed(0) === legendSplitA[4].toFixed(0) ) {
                            return <text key = {i} x={40 + 40*i} y={34} style={{fontSize: '1.0em'}}> {legendSplitA[i].toFixed(2) < 0? 0:legendSplitA[i].toFixed(2)} </text>
                          }else if (legendSplitA[i].toFixed(0) < 1) {
                            return <text key = {i} x={40 + 40*i} y={34} style={{fontSize: '1.0em'}}> {legendSplitA[i].toFixed(1) < 0? 0:legendSplitA[i].toFixed(1)} </text>
                          }else if (legendSplitA[i] > 999) {
                            return <text key = {i} x={40 + 40*i} y={34} style={{fontSize: '1.0em'}}> {(legendSplitA[i]/1000).toFixed(0) < 0? 0:(legendSplitA[i]/1000).toFixed(0)}K </text>
                          }
                          return <text key = {i} x={40 + 40*i} y={34} style={{fontSize: '1.0em'}}> {legendSplitA[i].toFixed(0) < 0? 0:legendSplitA[i].toFixed(0)} </text>                    
                        })}
                        <text x={0} y={34} style={{fontSize: '1.0em'}}> {legendMinA} </text> 
                        <text x={240} y={34} style={{fontSize: '1.0em'}}> {legendMaxA} </text> 


                        {_.map(colorPalette, (color, i) => {
                          return <rect key={i} x={40*i} y={40} width="40" height="40" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                        })} 


                        <text x={0} y={99} style={{fontSize: '1.2em'}}> Low </text>
                        <text x={40 * (colorPalette.length - 1)} y={99} style={{fontSize: '1.2em'}}> High </text> 


                        <rect x={280} y={40} width="40" height="40" style={{fill: '#FFFFFF', strokeWidth:0.1, stroke: '#000000'}}/>
                        <text x={330} y={56} style={{fontSize: '1.2em'}}> None </text>
                        <text x={330} y={76} style={{fontSize: '1.2em'}}> Reported </text>

                      </svg>
                    }
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
                <Grid.Column>
                  <Grid columns={2} centered>
                    <Grid.Column>

                    <svg width = "500" height="30">
                        <text x={0} y={15} style={{fontSize: "14pt"}}>COVID-19 County Population Characteristics:  </text>
                    </svg>

                      <Dropdown
                        style={{background: '#fff', 
                                width: 460, 
                                fontWeight: 400, 
                                fontSize: "14pt",
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none', 
                                borderBottom: '1ox solid #bdbfc1',
                                borderRadius: 0}}
                        text= {measureB ? measureB:"Select Characteristic"}
                        fluid
                        labeled
                        search
                        selection
                        value={measureB}
                        options={measureOptionsB}
                        onChange={(e, { value }) => {
                          setMeasureB(value);
                        }}
                      />
                      {(measureB != "Region" && measureB != "Urban-Rural" && measureB != null) && legendSplitB && legendMinB && legendMaxB && colorPalette2 &&
                        <svg width="450" height="110">
                              
                          {_.map(legendSplitB, (split, i) => {
                            if (legendSplitB[0].toFixed(0) === legendSplitB[1].toFixed(0) && legendSplitB[1].toFixed(0) === legendSplitB[2].toFixed(0) && legendSplitB[2].toFixed(0) === legendSplitB[3].toFixed(0) && legendSplitB[3].toFixed(0) === legendSplitB[4].toFixed(0) ) {
                              return <text key = {i} x={40 + 40*i} y={34} style={{fontSize: '1.0em'}}> {legendSplitB[i].toFixed(2) < 0? 0:legendSplitB[i].toFixed(2)} </text>
                            }else if (legendSplitB[i].toFixed(0) < 1) {
                              return <text key = {i} x={40 + 40*i} y={34} style={{fontSize: '1.0em'}}> {legendSplitB[i].toFixed(1)< 0? 0:legendSplitB[i].toFixed(1)} </text>
                            }else if (legendSplitB[i] > 999999) {
                              return <text key = {i} x={40 + 40*i} y={34} style={{fontSize: '1.0em'}}> {(legendSplitB[i]/1000).toFixed(0)< 0? 0:(legendSplitB[i]/1000000).toFixed(0)}M </text>
                            }else if (legendSplitB[i] > 999) {
                              return <text key = {i} x={40 + 40*i} y={34} style={{fontSize: '1.0em'}}> {(legendSplitB[i]/1000).toFixed(0)< 0? 0:(legendSplitB[i]/1000).toFixed(0)}K </text>
                            }
                            return <text key = {i} x={40 + 40*i} y={34} style={{fontSize: '1.0em'}}> {legendSplitB[i].toFixed(0)< 0? 0:legendSplitB[i].toFixed(0)} </text>                    
                          })}   
                          <text x={0} y={34} style={{fontSize: '1.0em'}}> {legendMinB} </text> 
                          <text x={240} y={34} style={{fontSize: '1.0em'}}> {legendMaxB} </text>


                          {_.map(colorPalette2, (color, i) => {
                            return <rect key={i} x={40*i} y={40} width="40" height="40" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                          })} 


                          <text x={0} y={99} style={{fontSize: '1.2em'}}>Low</text>
                          <text x={40 * (colorPalette2.length - 1)} y={99} style={{fontSize: '1.2em'}}>High</text> 

                          <rect x={280} y={40} width="40" height="40" style={{fill: '#FFFFFF', strokeWidth:0.1, stroke: '#000000'}}/>
                          <text x={330} y={56} style={{fontSize: '1.2em'}}> None </text>
                          <text x={330} y={76} style={{fontSize: '1.2em'}}> Reported </text>

                        </svg>
                        
                      }

                      {(measureB === "Urban-Rural" && measureB != null) && legendSplitB && legendMinB && legendMaxB && colorPalette2 &&
                        <svg width="450" height="220">
                                
                          <text x={95} y={40} style={{fontSize: '1em'}}> Remote rural area</text>                    
                          <text x={95} y={70} style={{fontSize: '1em'}}> Rural areas near cities</text>                    
                          <text x={95} y={100} style={{fontSize: '1em'}}> Small cities</text>                    
                          <text x={95} y={130} style={{fontSize: '1em'}}> Small suburbs</text>                    
                          <text x={95} y={160} style={{fontSize: '1em'}}> Large suburbs</text>                    
                          <text x={95} y={190} style={{fontSize: '1em'}}> Inner City</text>                    

                          {_.map(colorPalette2, (color, i) => {
                            return <rect key={i} x={50} y={20+30*i} width="30" height="30" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                          })} 

                          <rect x={245} y={20} width="30" height="30" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                          <text x={290} y={33} style={{fontSize: '1em'}}> None </text>
                          <text x={290} y={48} style={{fontSize: '1em'}}> Reported </text>

                        </svg>
                      }

                      {(measureB === "Region" && measureB != null) && legendSplitB && legendMinB && legendMaxB && colorPalette2 &&
                        <svg width="450" height="160">
                                
                          <text x={95} y={40} style={{fontSize: '1em'}}> South</text>                    
                          <text x={95} y={70} style={{fontSize: '1em'}}> West</text>                    
                          <text x={95} y={100} style={{fontSize: '1em'}}> Northeast</text>                    
                          <text x={95} y={130} style={{fontSize: '1em'}}> Midwest</text>                    
                  

                          {_.map(colorPalette2.slice(2), (color, i) => {
                            return <rect key={i} x={50} y={20+30*i} width="30" height="30" style={{fill: color, strokeWidth:1, stroke: color}}/>                    
                          })} 

                          <rect x={245} y={20} width="30" height="30" style={{fill: "#FFFFFF", strokeWidth:0.5, stroke: "#000000"}}/>                    
                          <text x={290} y={33} style={{fontSize: '1em'}}> None </text>
                          <text x={290} y={48} style={{fontSize: '1em'}}> Reported </text>

                        </svg>
                      }
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <ComposableMap projection="geoAlbersUsa" 
                    projectionConfig={{scale: !config? 650:`${config.scale}`}} 
                    width={600} 
                    height={600} 
                    strokeWidth = {0.1}
                    stroke = 'black'
                    data-tip=""
                    offsetX={!config? 50: config.offsetX}
                    offsetY={!config? -120: config.offsetY}>
                    <Geographies geography={!config? geoUrl: config.url}>
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
                          fill={(measureA && colorScaleA && stateFips === "_nation" && data[measureA][geo.id] > 0)? colorScaleA[data[measureA][geo.id]]: 
                                  (measureA && colorScaleA && stateFips === "_nation" && data[measureA][geo.id] === 0)? '#FFFFFF':
                                  (measureA && colorScaleA && data[measureA][stateFips+geo.properties.COUNTYFP])?
                                  colorScaleA[data[measureA][stateFips+geo.properties.COUNTYFP]] : "#FFFFFF"}
                        />
                      )}
                    </Geographies>
                  </ComposableMap>
                </Grid.Column>
                <Grid.Column>
                  <ComposableMap projection="geoAlbersUsa" 
                    projectionConfig={{scale: !config? 650:`${config.scale}`}} 
                    width={600} 
                    height={measureB === "Urban-Rural" ? 600 : 600} 
                    strokeWidth = {0.1}
                    stroke = 'black'
                    data-tip=""
                    offsetX={!config? 50: config.offsetX}
                    offsetY={!config? -120: config.offsetY}>
                    <Geographies geography={!config? geoUrl: config.url}>
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
                          fill = {(measureB && colorScaleB && stateFips === "_nation" && data[measureB][geo.id] > 0)? colorScaleB[data[measureB][geo.id]]: 
                                  (measureB && colorScaleB && stateFips === "_nation" && data[measureB][geo.id] === 0)? '#FFFFFF':
                                  (measureB && colorScaleB && data[measureB][stateFips+geo.properties.COUNTYFP])?
                                  colorScaleB[data[measureB][stateFips+geo.properties.COUNTYFP]] : "#FFFFFF"}
                        />
                      )}
                    </Geographies>
                  </ComposableMap>
                  <ReactTooltip>{tooltipContent}</ReactTooltip>
                </Grid.Column>
              </Grid.Row>  
            </Grid>
            
            <Notes />
          </Container>

        </div>
      </HEProvider> 
      )}else {
        return <Loader active inline='centered' />
      };
      

}