
import {
  Container,
  Grid,
  Rail,
  Ref,
  Sticky,
  Divider,
  Radio,
  Segment,
  Accordion,
  Icon,
  Header,
  Table,
  Menu,
  Tab,
  Progress,
  GridColumn
} from "semantic-ui-react";
import Covid from "../icons/Covid";
import { blue } from '@mui/material/colors';
import Medicine from "../icons/Medicine";

import React, {
  useEffect,
  useState,
  Component,
  createRef,
  useRef,
  useContext,
  useMemo,
} from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";

const colorPalette = ['#007dba', '#808080', '#a45791', '#008000', '#e8ab3b', '#000000', '#8f4814'];
function Compare(props) {
  const [vaccine, setVaccine] = useState('pfizer');

  const panes = [
    {
      menuItem: { content: <p style={{ fontSize: "100%" }}>PERCENTAGE OF PEOPLE</p> }, render: () =>
        // <div class="ui bottom attached segment active tab" style={{ width: '100%' }}>
        //   <Grid>
        //     <Grid.Row>
        //       <GridColumn width={4}><Covid></Covid></GridColumn>
        //       <GridColumn width={8}> <Header
        //         as="h4"
        //         style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
        //       >

        //         <Header.Content>
        //           HEALTH RISKS
        //         </Header.Content>
        //       </Header></GridColumn>
        //       <GridColumn width={4}><Medicine></Medicine></GridColumn>
        //     </Grid.Row>

        //   </Grid>

        //   <Grid>
        //     <Grid.Row>
        //       <GridColumn width={4}>With COVID-19</GridColumn>
        //       <GridColumn width={8}>Percentage of people</GridColumn>
        //       <GridColumn width={4}>With Vaccine</GridColumn>
        //     </Grid.Row>

        //   </Grid>
        //   <hr />
        //   <Header
        //     as="h4"
        //     style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
        //   >
        //     <Header.Content>
        //       SYMPTOMS 
        //     </Header.Content>
        //   </Header>
        //   <Grid>
        //     <Grid.Row>
        //       <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
        //       <GridColumn width={8}>%</GridColumn>
        //       <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
        //     </Grid.Row>

        //     <Grid.Row>
        //       <GridColumn width={4}></GridColumn>
        //       <GridColumn width={8}>
        //         <Accordion
        //           id="race"
        //           style={{
        //             paddingTop: 0,

        //             paddingBottom: 15,
        //           }}
        //           defaultActiveIndex={1}
        //           panels={[
        //             {
        //               key: "acquire-dog",
        //               title: {
        //                 content: (
        //                   <u
        //                     style={{
        //                       fontFamily: "lato",
        //                       fontSize: "15px",
        //                       color: "#397AB9",
        //                     }}
        //                   >
        //                     CLICK TO SEE INDIVIDUAL SYMPTOMS
        //                   </u>
        //                 ),
        //                 icon: "dropdown",
        //               },
        //               content: {
        //                 content: (
        //                   <Header.Content
        //                     style={{
        //                       fontWeight: 500,

        //                       fontSize: "12px",

        //                     }}
        //                   >
        //                     hello world!
        //                   </Header.Content>
        //                 ),
        //               },
        //             },
        //           ]}
        //         />
        //       </GridColumn>
        //       <GridColumn width={4}></GridColumn>
        //     </Grid.Row>



        //   </Grid>
        //   <hr />
        //   <Header
        //     as="h4"
        //     style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
        //   >
        //     <Header.Content>
        //       MULTISYSTEM INFLAMMATORY SYNDROME
        //     </Header.Content>
        //   </Header>
        //   <Grid>
        //     <Grid.Row>
        //       <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
        //       <GridColumn width={8}>%</GridColumn>
        //       <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
        //     </Grid.Row>

        //   </Grid>
        //   <hr />
        //   <Header
        //     as="h4"
        //     style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
        //   >
        //     <Header.Content>
        //       SEVERE ALLERGIC REACTIONS
        //     </Header.Content>
        //   </Header>
        //   <Grid>
        //     <Grid.Row>
        //       <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
        //       <GridColumn width={8}>%</GridColumn>
        //       <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
        //     </Grid.Row>

        //   </Grid>
        //   <hr />
        //   <Header
        //     as="h4"
        //     style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
        //   >
        //     <Header.Content>
        //       HOSPITALISATION
        //     </Header.Content>
        //   </Header>
        //   <Grid>
        //     <Grid.Row>
        //       <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
        //       <GridColumn width={8}>%</GridColumn>
        //       <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
        //     </Grid.Row>

        //   </Grid>
        //   <hr />
        //   <Header
        //     as="h4"
        //     style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
        //   >
        //     <Header.Content>
        //       INTENSIVE CARE
        //     </Header.Content>
        //   </Header>
        //   <Grid>
        //     <Grid.Row>
        //       <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
        //       <GridColumn width={8}>%</GridColumn>
        //       <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
        //     </Grid.Row>

        //   </Grid>
        //   <hr />
        //   <Header
        //     as="h4"
        //     style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
        //   >
        //     <Header.Content>
        //       SYMPTOMS AFTER 1 MONTH
        //     </Header.Content>
        //   </Header>
        //   <Grid>
        //     <Grid.Row>
        //       <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
        //       <GridColumn width={8}>%</GridColumn>
        //       <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
        //     </Grid.Row>

        //   </Grid>
        //   <hr />
        //   <Header
        //     as="h4"
        //     style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
        //   >
        //     <Header.Content>
        //       DEATH
        //     </Header.Content>
        //   </Header>
        //   <Grid>
        //     <Grid.Row>
        //       <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
        //       <GridColumn width={8}>%</GridColumn>
        //       <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
        //     </Grid.Row>

        //   </Grid>
        //   <hr />
        // </div>
        <div class="ui bottom attached segment active tab" style={{ width: '100%' }}>
        <Grid>
          <Grid.Row style={{paddingTop:20}}>
            <GridColumn width={6}> <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
            >

              <Header.Content>
                HEALTH RISKS
              </Header.Content>
            </Header></GridColumn>
            <GridColumn width={3}>CONDITIONS</GridColumn>

            <GridColumn width={7}><Covid></Covid>Percentage of people<Medicine ></Medicine></GridColumn>
          </Grid.Row>

        </Grid>
        <hr />

        <Grid  style={{paddingTop:20}}>
          <Grid.Row style={{paddingTop:0,marginBottom:0,paddingBottom:0}}>
            <GridColumn width={6}> <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
            >
              <Header.Content>
                SYMPTOMS
              </Header.Content>
              <HeaderSubHeader>
                Percentage of People
              </HeaderSubHeader>
            </Header>
            </GridColumn>
            <GridColumn width={3}>

              <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content>
                  With COVID-19

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content >
                  With Vaccination

                </Header.Content>
              </Header>
            </GridColumn>

            <GridColumn width={5}>
              <Progress style={{ marginBottom: 10 }} reverse percent={32} color='red'></Progress>
              <Progress percent={32} color='blue' ></Progress>
            </GridColumn>
            <GridColumn width={2}>
            <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content style={{color:"#e02c2c"}}>
                 3 in 100 

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content style={{color:"#0E6EB8"}}>
                 2 in 100

                </Header.Content>
              </Header>
            </GridColumn>
          </Grid.Row>

  <Grid.Row>
          <Accordion
            id="race"
            style={{
              paddingTop: 0,
              width:"100%",
              paddingBottom: 15,
            }}
            defaultActiveIndex={1}
            panels={[
              {
                key: "acquire-dog",
                title: {
                  content: (
                    <u
                      style={{
                        fontFamily: "lato",
                        fontSize: "15px",
                        color: "#397AB9",
                      }}
                    >
                      CLICK TO SEE INDIVIDUAL SYMPTOMS
                    </u>
                  ),
                  icon: "dropdown",
                },
                content: {
                  content: (
        
        <Grid  style={{paddingTop:0}}>
          <Grid.Row style={{paddingBottom:0,marginBottom:0}}>
            <GridColumn width={6}> <Header
              as="h5"
              style={{ paddingTop: 5, fontWeight: 400, fontSize: "12pt" }}
            >
              <Header.Content>
              injection pain, redness, swelling
              </Header.Content>
              <HeaderSubHeader>
                Percentage of People
              </HeaderSubHeader>
            </Header>
            </GridColumn>
            <GridColumn width={3}>

              <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content>
                  With COVID-19

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content>
                  With Vaccination

                </Header.Content>
              </Header>
            </GridColumn>

            <GridColumn width={5}>
              <Progress style={{ marginBottom: 10 }} reverse percent={32} color='red'></Progress>
              <Progress percent={32} color='blue' ></Progress>
            </GridColumn>
            <GridColumn width={2}>
            <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content style={{color:"#e02c2c"}}>
                 3 in 100 

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content style={{color:"#0E6EB8"}}>
                 2 in 100

                </Header.Content>
              </Header>
            </GridColumn>
          </Grid.Row>
      
      
     
          <Grid.Row style={{paddingBottom:0,marginBottom:0}}>
            <GridColumn width={6}> <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 400, fontSize: "12pt" }}
            >
              <Header.Content>
              fever
              </Header.Content>
              <HeaderSubHeader>
                Percentage of People
              </HeaderSubHeader>
            </Header>
            </GridColumn>
            <GridColumn width={3}>

              <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content>
                  With COVID-19

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content>
                  With Vaccination

                </Header.Content>
              </Header>
            </GridColumn>

            <GridColumn width={5}>
              <Progress style={{ marginBottom: 10 }}  reverse percent={32} color='red'></Progress>
              <Progress  percent={32} color='blue' ></Progress>
            </GridColumn>
            <GridColumn width={2}>
            <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content style={{color:"#e02c2c"}}>
                 3 in 100 

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content style={{color:"#0E6EB8"}}>
                 2 in 100

                </Header.Content>
              </Header>
            </GridColumn>
          </Grid.Row>
   

          <Grid.Row style={{paddingBottom:0,marginBottom:0}}>
            <GridColumn width={6}> <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 400, fontSize: "12pt" }}
            >
              <Header.Content>
              cough
              </Header.Content>
              <HeaderSubHeader>
                Percentage of People
              </HeaderSubHeader>
            </Header>
            </GridColumn>
            <GridColumn width={3}>

              <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content>
                  With COVID-19

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content>
                  With Vaccination

                </Header.Content>
              </Header>
            </GridColumn>

            <GridColumn width={5}>
              <Progress style={{ marginBottom: 10 }} reverse percent={32} color='red'></Progress>
              <Progress percent={32} color='blue' ></Progress>
            </GridColumn>
            <GridColumn width={2}>
            <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content  style={{color:"#e02c2c"}}>
                 3 in 100 

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content style={{color:"#0E6EB8"}}>
                 2 in 100

                </Header.Content>
              </Header>
            </GridColumn>
          </Grid.Row>
    
          <Grid.Row style={{paddingBottom:0,marginBottom:0}}>
            <GridColumn width={6}> <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 400, fontSize: "12pt" }}
            >
              <Header.Content>
            fatigue
              </Header.Content>
              <HeaderSubHeader>
                Percentage of People
              </HeaderSubHeader>
            </Header>
            </GridColumn>
            <GridColumn width={3}>

              <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content>
                  With COVID-19

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content>
                  With Vaccination

                </Header.Content>
              </Header>
            </GridColumn>

            <GridColumn width={5}>
              <Progress style={{ marginBottom: 10}} color="red" percent={32}></Progress>
              <Progress  percent={32} color='blue' ></Progress>
            </GridColumn>
            <GridColumn width={2}>
            <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content style={{color:"#e02c2c"}}>
                 3 in 100 

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content style={{color:"#0E6EB8"}}>
                 2 in 100

                </Header.Content>
              </Header>
            </GridColumn>
          </Grid.Row>
</Grid>
 
                  ),
                },
              },
            ]}
          />
          </Grid.Row>


        </Grid>
        <hr />
        <Grid  style={{paddingTop:5}}>
          <Grid.Row >
            <GridColumn width={6}> <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
            >
              <Header.Content>
                MULTISYSTEM INFLAMMATORY SYNDROME
              </Header.Content>
              <HeaderSubHeader>
                Percentage of people
              </HeaderSubHeader>
            </Header>
            </GridColumn>
            <GridColumn width={3}>

              <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content>
                  With COVID-19

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content>
                  With Vaccination

                </Header.Content>
              </Header>
            </GridColumn>

            <GridColumn width={5}>
              <Progress style={{ marginBottom: 10 }} reverse percent={32} color='red'></Progress>
              <Progress percent={32} color='blue' ></Progress>
            </GridColumn>
            <GridColumn width={2}>
            <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content style={{color:"#e02c2c"}}>
                 3 in 100 

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content style={{color:"#0E6EB8"}}>
                 2 in 100

                </Header.Content>
              </Header>
            </GridColumn>
          </Grid.Row>
        </Grid>
        <hr />
        <Grid  style={{paddingTop:5,paddingBottom:0,marginBottom:0}}>
          <Grid.Row style={{paddingBottom:0,marginBottom:0}}>
            <GridColumn width={6}> <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
            >
              <Header.Content>
              HOSPITALISATION
              </Header.Content>
              <HeaderSubHeader>
                Percentage of People
              </HeaderSubHeader>
            </Header>
            </GridColumn>
            <GridColumn width={3}>

              <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content>
                  With COVID-19

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content>
                  With Vaccination

                </Header.Content>
              </Header>
            </GridColumn>

            <GridColumn width={5}>
              <Progress style={{ marginBottom: 10 }}  reverse percent={32} color='red'></Progress>
              <Progress  percent={32} color='blue' ></Progress>
            </GridColumn>
            <GridColumn width={2}>
            <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content style={{color:"#e02c2c"}}>
                 3 in 100 

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content style={{color:"#0E6EB8"}}>
                 2 in 100

                </Header.Content>
              </Header>
            </GridColumn>
          </Grid.Row>
        </Grid>
        <hr />
        <Grid style={{paddingTop:5}}>
          <Grid.Row>
            <GridColumn width={6}> <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
            >
              <Header.Content>
              SYMPTOMS AFTER 1 MONTH
              </Header.Content>
              <HeaderSubHeader>
                Percentage of People
              </HeaderSubHeader>
            </Header>
            </GridColumn>
            <GridColumn width={3}>

              <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content>
                  With COVID-19

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content>
                  With Vaccination

                </Header.Content>
              </Header>
            </GridColumn>

            <GridColumn width={5}>
              <Progress style={{ marginBottom: 10 }} reverse percent={32} color='red'></Progress>
              <Progress percent={32} color='blue' ></Progress>
            </GridColumn>
            <GridColumn width={2}>
            <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content  style={{color:"#e02c2c"}}>
                 3 in 100 

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content style={{color:"#0E6EB8"}}>
                 2 in 100

                </Header.Content>
              </Header>
            </GridColumn>
          </Grid.Row>
        </Grid>
        <hr />
        <Grid style={{paddingTop:5}}>
          <Grid.Row>
            <GridColumn width={6}> <Header
              as="h4"
              style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
            >
              <Header.Content>
              DEATH
              </Header.Content>
              <HeaderSubHeader>
                Percentage of People
              </HeaderSubHeader>
            </Header>
            </GridColumn>
            <GridColumn width={3}>

              <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content>
                  With COVID-19

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content>
                  With Vaccination

                </Header.Content>
              </Header>
            </GridColumn>

            <GridColumn width={5}>
              <Progress style={{ marginBottom: 10}} color="red" percent={32}></Progress>
              <Progress  percent={32} color='blue' ></Progress>
            </GridColumn>
            <GridColumn width={2}>
            <Header
                as="h4"
                style={{marginTop:"1%"}}
              >
                <Header.Content style={{color:"#e02c2c"}}>
                 3 in 100 

                </Header.Content>
              </Header>
              <Header
                as="h4"
                style={{marginTop:"8%"}}
              >
                <Header.Content style={{color:"#0E6EB8"}}>
                 2 in 100

                </Header.Content>
              </Header>
            </GridColumn>
          </Grid.Row>
        </Grid>
        <hr />
      </div>

    },
    {
      menuItem: { content: <p style={{ fontSize: "100%" }}>NUMBER OF PEOPLE</p> }, render: () =>
        <div class="ui bottom attached segment active tab" style={{ width: '100%' }}>
          <Grid>
            <Grid.Row style={{paddingTop:20}}>
              <GridColumn width={6}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
              >

                <Header.Content>
                  HEALTH RISKS
                </Header.Content>
              </Header></GridColumn>
              <GridColumn width={3}>CONDITIONS</GridColumn>

              <GridColumn width={7}><Covid></Covid>Number of People<Medicine ></Medicine></GridColumn>
            </Grid.Row>

          </Grid>

          {/* <Grid>
 <Grid.Row>
 <GridColumn width={4}>With COVID-19</GridColumn>
 <GridColumn width={8}>Number of people</GridColumn>
 <GridColumn width={4}>With Vaccine</GridColumn>
 </Grid.Row>
  
 </Grid> */}
          <hr />

          <Grid  style={{paddingTop:20}}>
            <Grid.Row style={{paddingTop:0,marginBottom:0,paddingBottom:0}}>
              <GridColumn width={6}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
              >
                <Header.Content>
                  SYMPTOMS
                </Header.Content>
                <HeaderSubHeader>
                  Number of People
                </HeaderSubHeader>
              </Header>
              </GridColumn>
              <GridColumn width={3}>

                <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content >
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 10 }} reverse percent={32} color='red'></Progress>
                <Progress percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content style={{color:"#e02c2c"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content style={{color:"#0E6EB8"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>

    <Grid.Row>
            <Accordion
              id="race"
              style={{
                paddingTop: 0,
                width:"100%",
                paddingBottom: 15,
              }}
              defaultActiveIndex={1}
              panels={[
                {
                  key: "acquire-dog",
                  title: {
                    content: (
                      <u
                        style={{
                          fontFamily: "lato",
                          fontSize: "15px",
                          color: "#397AB9",
                        }}
                      >
                        CLICK TO SEE INDIVIDUAL SYMPTOMS
                      </u>
                    ),
                    icon: "dropdown",
                  },
                  content: {
                    content: (
          
          <Grid  style={{paddingTop:0}}>
            <Grid.Row style={{paddingBottom:0,marginBottom:0}}>
              <GridColumn width={6}> <Header
                as="h5"
                style={{ paddingTop: 5, fontWeight: 400, fontSize: "12pt" }}
              >
                <Header.Content>
                injection pain, redness, swelling
                </Header.Content>
                <HeaderSubHeader>
                  Number of People
                </HeaderSubHeader>
              </Header>
              </GridColumn>
              <GridColumn width={3}>

                <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 10 }} reverse percent={32} color='red'></Progress>
                <Progress percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content style={{color:"#e02c2c"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content style={{color:"#0E6EB8"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
        
        
       
            <Grid.Row style={{paddingBottom:0,marginBottom:0}}>
              <GridColumn width={6}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 400, fontSize: "12pt" }}
              >
                <Header.Content>
                fever
                </Header.Content>
                <HeaderSubHeader>
                  Number of People
                </HeaderSubHeader>
              </Header>
              </GridColumn>
              <GridColumn width={3}>

                <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 10 }}  reverse percent={32} color='red'></Progress>
                <Progress  percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content style={{color:"#e02c2c"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content style={{color:"#0E6EB8"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
     

            <Grid.Row style={{paddingBottom:0,marginBottom:0}}>
              <GridColumn width={6}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 400, fontSize: "12pt" }}
              >
                <Header.Content>
                cough
                </Header.Content>
                <HeaderSubHeader>
                  Number of People
                </HeaderSubHeader>
              </Header>
              </GridColumn>
              <GridColumn width={3}>

                <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 10 }} reverse percent={32} color='red'></Progress>
                <Progress percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content  style={{color:"#e02c2c"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content style={{color:"#0E6EB8"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
      
            <Grid.Row style={{paddingBottom:0,marginBottom:0}}>
              <GridColumn width={6}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 400, fontSize: "12pt" }}
              >
                <Header.Content>
              fatigue
                </Header.Content>
                <HeaderSubHeader>
                  Number of People
                </HeaderSubHeader>
              </Header>
              </GridColumn>
              <GridColumn width={3}>

                <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 10}} color="red" percent={32}></Progress>
                <Progress  percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content style={{color:"#e02c2c"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content style={{color:"#0E6EB8"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
 </Grid>
   
                    ),
                  },
                },
              ]}
            />
            </Grid.Row>


          </Grid>
          <hr />
          <Grid  style={{paddingTop:5}}>
            <Grid.Row >
              <GridColumn width={6}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
              >
                <Header.Content>
                  MULTISYSTEM INFLAMMATORY SYNDROME
                </Header.Content>
                <HeaderSubHeader>
                  Number of People
                </HeaderSubHeader>
              </Header>
              </GridColumn>
              <GridColumn width={3}>

                <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 10 }} reverse percent={32} color='red'></Progress>
                <Progress percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content style={{color:"#e02c2c"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content style={{color:"#0E6EB8"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
          </Grid>
          <hr />
          <Grid  style={{paddingTop:5,paddingBottom:0,marginBottom:0}}>
            <Grid.Row style={{paddingBottom:0,marginBottom:0}}>
              <GridColumn width={6}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
              >
                <Header.Content>
                HOSPITALISATION
                </Header.Content>
                <HeaderSubHeader>
                  Number of People
                </HeaderSubHeader>
              </Header>
              </GridColumn>
              <GridColumn width={3}>

                <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 10 }}  reverse percent={32} color='red'></Progress>
                <Progress  percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content style={{color:"#e02c2c"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content style={{color:"#0E6EB8"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
          </Grid>
          <hr />
          <Grid style={{paddingTop:5}}>
            <Grid.Row>
              <GridColumn width={6}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
              >
                <Header.Content>
                SYMPTOMS AFTER 1 MONTH
                </Header.Content>
                <HeaderSubHeader>
                  Number of People
                </HeaderSubHeader>
              </Header>
              </GridColumn>
              <GridColumn width={3}>

                <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 10 }} reverse percent={32} color='red'></Progress>
                <Progress percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content  style={{color:"#e02c2c"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content style={{color:"#0E6EB8"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
          </Grid>
          <hr />
          <Grid style={{paddingTop:5}}>
            <Grid.Row>
              <GridColumn width={6}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
              >
                <Header.Content>
                DEATH
                </Header.Content>
                <HeaderSubHeader>
                  Number of People
                </HeaderSubHeader>
              </Header>
              </GridColumn>
              <GridColumn width={3}>

                <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 10}} color="red" percent={32}></Progress>
                <Progress  percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                  style={{marginTop:"1%"}}
                >
                  <Header.Content style={{color:"#e02c2c"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                  style={{marginTop:"8%"}}
                >
                  <Header.Content style={{color:"#0E6EB8"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
          </Grid>
          <hr />
        </div>

    }

  ]
  return (

    <div class="ui two column centered grid" >
      <div style={{ maxWidth: "100%" }}>
        <Header
          as="h1"
          style={{ paddingTop: 30, fontWeight: 400, fontSize: "24pt" }}
        >
          <Header.Content>
            Which vaccine would you like to know more about?


            <Header.Subheader
              style={{
                paddingTop: "1.5rem",
                paddingLeft: "0rem",
                paddingBottom: "0rem",
                lineHeight: "20pt",
                fontWeight: 400,
                fontSize: "12pt",
                color: "black",
              }}
            >
              This is a resource guide to answer common questions about
              the COVID-19 vaccines. This guide is based on the best
              available information as of {Date().slice(4, 10)}, 2021.
              Before taking the vaccine, please consult your healthcare
              provider. If you have any questions or concerns beyond those
              addressed here, we recommend the following resources for
              additional information:
              {/* {Date().slice(4,10)} */}

            </Header.Subheader>
          </Header.Content>
        </Header>
        <ToggleButtonGroup
      color='primary'
      value={vaccine}
      size="large"
      exclusive
      onChange={(e,value)=>{setVaccine(value)}}
      aria-label="Platform"
     style={{padding:10}}
    >
      <ToggleButton style={{width:200,fontSize:'1.25rem'}}   value="pfizer">Pfizer/BioNTech</ToggleButton>
      <ToggleButton style={{width:200,fontSize:'1.25rem'}} value="moderna">Moderna</ToggleButton>
    </ToggleButtonGroup>
            
        <Accordion
                  id="race"
                  style={{
                    paddingTop: 0,

                    paddingBottom: 15,
                  }}
                  defaultActiveIndex={1}
                  panels={[
                    {
                      key: "acquire-dog",
                      title: {
                        content: (
                          <u
                            style={{
                              fontFamily: "lato",
                              fontSize: "1.5rem",
                              
                            }}
                          >
                            About the Vaccine
                          </u>
                        ),
                        icon: "dropdown",
                      },
                      content: {
                        content: (
                          <Header.Content
                            style={{
                              fontWeight: 400,

                              fontSize: "15px",

                            }}
                          >
                          {vaccine=='pfizer'? "The vaccine made by Pfizer and BioNTech is known as 'Comirnaty', or BNT162b2, or most commonly as 'the Pfizer vaccine'. It is an mRNA vaccine which means it uses genetic code from a part of the virus to train your immune system. The genetic code is quickly broken down by the body and cleared away. You can not catch COVID-19 from Comirnaty (Pfizer). After the second dose, Comirnaty (Pfizer) is around 90% effective against the Delta variant in children.1-2  Effectiveness against Omicron is still unknown but if you catches COVID-19 after you've been vaccinated, your illness will usually be mild.":
"Spikevax is a vaccine developed by Moderna. It is also known as 'the Moderna vaccine'. It is an mRNA vaccine which means it uses genetic code from a part of the virus to train your immune system. The genetic code is quickly broken down by your body and cleared away. You can not catch COVID-19 from Spikevax (Moderna). After the second dose, Spikevax (Moderna) is about 94% effective against COVID-19.1 It may be slightly less effective against more recent variants, such as the Delta variant, but it will still protect you against serious illness and reduce your risk of hospitalisation and death."
}
                             
                          </Header.Content>
                        ),
                      },
                    },
                  ]}
                />
      
        <div class="ui attached tabular menu">
          <Tab style={{ width: "100%" }} panes={panes} renderActiveOnly />
        </div>


      </div>

    </div>

  );
}
export default Compare;