import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, List } from 'semantic-ui-react'
import _ from 'lodash';
import AppBar from './AppBar';
import { geoCentroid } from "d3-geo";
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import Marker from './Marker';
import Annotation from './Annotation';
import {geoAlbersUsa} from "d3-geo";

import allStates from "../data/allstates.json";
import stats from "../data/data_state.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

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


export default function USMap(props) {

  const [stateName, setStateName] = useState('Select State');
  const [fips, setFips] = useState();

  return (
      <div>
        <AppBar />
        <Container style={{marginTop: '8em'}}>
          <Breadcrumb>
            <Breadcrumb.Section link>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section active>{stateName}</Breadcrumb.Section>
          </Breadcrumb>
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={12}>
                <ComposableMap projection="geoAlbersUsa" 
                  width={800} 
                  height={600}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) => (
                      <>
                        {geographies.map(geo => (
                          <Geography
                            key={geo.rsmKey}
                            stroke="#FFF"
                            geography={geo}
                            onMouseEnter={()=>{ 
                              setFips((+geo.id)+"");
                              setStateName(geo.properties.name); 
                            }}
                            style={{
                              default: {
                                fill: "#D6D6DA",
                                outline: "none"
                              },
                              hover: {
                                fill: "#F53",
                                outline: "none"
                              },
                              pressed: {
                                fill: "#E42",
                                outline: "none"
                              }
                            }}
                          />
                        ))}
                        {geographies.map(geo => {
                          const centroid = geoCentroid(geo);
                          const cur = allStates.find(s => s.val === geo.id);
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
                      </>
                    )}
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column width={4}>
                {
                  (fips && stats[fips]) && (
                     <div>
                       <Header size='medium'>{stats[fips].name}</Header>
                       <List bulleted>
                       {_.map(stats[fips], (value, key) => (
                           <List.Item key={key}>{key}: {Math.round(value*100)/100}</List.Item>
                        ))}
                       </List>
                     </div>
                    )
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
      );

}