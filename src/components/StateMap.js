import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header, List } from 'semantic-ui-react'
import _ from 'lodash';
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';

import { useParams } from 'react-router-dom';

import configs from "../data/state_config.json";
import stats from "../data/data_state.json";


export default function StateMap(props) {

  let { stateFips } = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState();
  const [countyName, setCountyName] = useState('Select County');

  useEffect(()=>{
    setConfig(configs.find(s => s.fips === stateFips));

    setStateName(stats[stateFips].name);

  }, []);

  return (
      <div>
        <AppBar />
        <Container style={{marginTop: '8em'}}>
          {config &&
          <Grid columns={16}>
            <Breadcrumb>
              <Breadcrumb.Section link>United States</Breadcrumb.Section>
              <Breadcrumb.Divider />
              <Breadcrumb.Section link>{stateName}</Breadcrumb.Section>
              <Breadcrumb.Divider />
              <Breadcrumb.Section active>{countyName}</Breadcrumb.Section>
            </Breadcrumb>
            <Grid.Row>
              <Grid.Column width={12}>
                <ComposableMap projection="geoAlbersUsa" 
                  projectionConfig={{scale:`${config.scale}`}} 
                  width={800} 
                  height={600} 
                  offsetX={config.offsetX}
                  offsetY={config.offsetY}>
                  <Geographies geography={config.url}>
                    {({geographies}) => geographies.map(geo =>
                      <Geography 
                        key={geo.rsmKey} 
                        geography={geo} 
                        onMouseEnter={()=>console.log(geo)}
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
                            }}/>
                    )}
                  </Geographies>
                </ComposableMap>
              </Grid.Column>
              <Grid.Column width={4}>
                TBD
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
        </Container>
      </div>
      );

}