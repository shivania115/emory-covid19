import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Header } from 'semantic-ui-react'
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import { VictoryChart, VictoryGroup, VictoryBar, VictoryTheme, VictoryAxis, VictoryLegend } from 'victory';

import { useParams, useHistory } from 'react-router-dom';

import { configs }  from "../data/state_config.js";
import { dataState } from "../data/data_state.js";
import { dataCountyPct } from "../data/data_county_pct.js";

export default function StateMap(props) {

  let { stateFips } = useParams();
  const [config, setConfig] = useState();
  const [stateName, setStateName] = useState();
  const [countyFips, setCountyFips] = useState('');
  const [countyName, setCountyName] = useState('{County}');
  const history = useHistory();

  useEffect(()=>{
    setConfig(configs.find(s => s.fips === stateFips));

    setStateName(dataState[stateFips].name);

  }, []);

  return (
      <div>
        <AppBar />
        <Container style={{marginTop: '8em'}}>
          {config &&
          <div>
          <Breadcrumb>
            <Breadcrumb.Section link onClick={() => history.push('/emory-covid19')}>United States</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section active>{stateName}</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </Breadcrumb>
          <Header as='h2'>
            <Header.Content>
              Health Determinants impact COVID-19 Outcomes
              <Header.Subheader>The impact of COVID-19 is not equal to everybody. TBD.</Header.Subheader>
            </Header.Content>
          </Header>
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={12}>
                <ComposableMap projection="geoAlbers" 
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
                        onMouseEnter={()=>{
                          setCountyFips(geo.properties.COUNTYFP);
                          setCountyName(geo.properties.NAME);
                        }}
                        style={{
                              default: {
                                fill: "#D6D6DA",
                                stroke: '#fff'
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
                <Header>Statistics of {countyName}</Header>
                 {dataCountyPct[stateFips + countyFips] &&
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domain={{ y: [0, 1] }}
                    domainPadding={10}
                    padding={{left: 120, top: 50, bottom: 50}}
                    height={700}
                  >
                    <VictoryLegend
                      x={10} y={10}
                      orientation="horizontal"
                      colorScale={["brown", "gold", "tomato"]}
                      data ={[
                        {name: "nation"}, {name: "state"}, {name: "county"}
                        ]}
                    />
                    <VictoryAxis />
                    <VictoryAxis dependentAxis tickCount={2}/>
                    <VictoryGroup horizontal
                      offset={10}
                      style={{data: {width: 6}}}
                      colorScale={["brown", "gold", "tomato"]}
                    >
                      <VictoryBar
                        data={dataCountyPct[stateFips + countyFips]}
                        x="var"
                        y="nation"
                      />
                      <VictoryBar
                        data={dataCountyPct[stateFips + countyFips]}
                        x="var"
                        y="state"
                      />
                      <VictoryBar
                        data={dataCountyPct[stateFips + countyFips]}
                        x="var"
                        y="county"
                      />
                    </VictoryGroup>
                  </VictoryChart>
                }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <small>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non nisi est sit amet facilisis. Turpis massa sed elementum tempus. Semper viverra nam libero justo laoreet sit amet. Consequat interdum varius sit amet mattis vulputate enim nulla. Vel pretium lectus quam id leo in vitae. Diam in arcu cursus euismod. Donec enim diam vulputate ut pharetra sit amet. In iaculis nunc sed augue lacus viverra vitae congue. Ullamcorper eget nulla facilisi etiam. Tristique magna sit amet purus gravida quis blandit. Varius vel pharetra vel turpis. Arcu odio ut sem nulla. Est pellentesque elit ullamcorper dignissim cras. Faucibus turpis in eu mi bibendum. Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus. Accumsan lacus vel facilisis volutpat est velit egestas dui.
              <br/>
              Bibendum arcu vitae elementum curabitur. Etiam sit amet nisl purus in mollis. Vel turpis nunc eget lorem dolor. Id velit ut tortor pretium viverra suspendisse. Nec tincidunt praesent semper feugiat nibh sed. Tortor at auctor urna nunc id cursus metus. Convallis tellus id interdum velit laoreet id donec. Eleifend quam adipiscing vitae proin sagittis nisl rhoncus. Quis viverra nibh cras pulvinar. Quisque id diam vel quam elementum. Urna condimentum mattis pellentesque id nibh. Faucibus interdum posuere lorem ipsum. Tortor condimentum lacinia quis vel eros donec ac odio tempor. Tempor commodo ullamcorper a lacus vestibulum sed. Massa sapien faucibus et molestie ac.
              <br/>
              Cras fermentum odio eu feugiat pretium nibh. Sem integer vitae justo eget magna fermentum iaculis. Sed ullamcorper morbi tincidunt ornare. Scelerisque purus semper eget duis at tellus at urna condimentum. Euismod nisi porta lorem mollis aliquam ut porttitor leo a. Luctus venenatis lectus magna fringilla urna porttitor. Laoreet sit amet cursus sit amet dictum sit. Et egestas quis ipsum suspendisse ultrices gravida dictum. At varius vel pharetra vel turpis nunc eget. Interdum velit euismod in pellentesque massa. Risus nullam eget felis eget. Mauris cursus mattis molestie a iaculis at erat pellentesque. Lectus mauris ultrices eros in cursus turpis massa. Et ligula ullamcorper malesuada proin libero nunc consequat. Ornare arcu odio ut sem nulla pharetra. Ullamcorper morbi tincidunt ornare massa eget egestas.
              <br/>
              Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Dui faucibus in ornare quam. Velit scelerisque in dictum non consectetur a. Sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur. Odio pellentesque diam volutpat commodo sed egestas. Sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Condimentum mattis pellentesque id nibh. Velit dignissim sodales ut eu sem integer vitae justo. Diam vulputate ut pharetra sit. Montes nascetur ridiculus mus mauris vitae ultricies leo integer malesuada. Nam aliquam sem et tortor consequat id porta nibh venenatis. Sed tempus urna et pharetra pharetra massa massa. Dolor magna eget est lorem ipsum dolor. Egestas fringilla phasellus faucibus scelerisque eleifend donec. Morbi tincidunt augue interdum velit. Semper risus in hendrerit gravida rutrum. Vestibulum rhoncus est pellentesque elit ullamcorper. Lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit. Eu non diam phasellus vestibulum lorem sed risus.
              <br/>
              Congue quisque egestas diam in arcu cursus euismod quis. Eget dolor morbi non arcu risus quis varius. Quis lectus nulla at volutpat. Nisl vel pretium lectus quam id leo. Morbi tristique senectus et netus. Enim tortor at auctor urna nunc id cursus. Molestie nunc non blandit massa enim nec dui nunc. Quam elementum pulvinar etiam non quam. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar. Duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Etiam erat velit scelerisque in dictum non. Purus in mollis nunc sed id semper risus in hendrerit. Facilisis volutpat est velit egestas dui id ornare arcu. Lorem donec massa sapien faucibus et molestie ac feugiat sed. Integer quis auctor elit sed. Semper auctor neque vitae tempus quam pellentesque nec. Auctor urna nunc id cursus metus aliquam eleifend mi in. Sapien nec sagittis aliquam malesuada bibendum.
              </small>
            </Grid.Row>
          </Grid>
          </div>
        }
        </Container>
      </div>
      );

}