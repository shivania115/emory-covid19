
import {
  Container,
  Grid,
  Rail,
  Ref,
  Sticky,
  Divider,
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
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
function compare() {
  const panes = [
    {
      menuItem: { content: <p style={{ fontSize: "15pt" }}>PERCENTAGE OF PEOPLE</p> }, render: () =>
        <div class="ui bottom attached segment active tab" style={{ width: '100%' }}>
          <Grid>
            <Grid.Row>
              <GridColumn width={4}><Covid></Covid></GridColumn>
              <GridColumn width={8}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
              >

                <Header.Content>
                  HEALTH RISKS
                </Header.Content>
              </Header></GridColumn>
              <GridColumn width={4}><Medicine></Medicine></GridColumn>
            </Grid.Row>

          </Grid>

          <Grid>
            <Grid.Row>
              <GridColumn width={4}>With COVID-19</GridColumn>
              <GridColumn width={8}>Percentage of people</GridColumn>
              <GridColumn width={4}>With Vaccine</GridColumn>
            </Grid.Row>

          </Grid>
          <hr />
          <Header
            as="h4"
            style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
          >
            <Header.Content>
              SYMPTOMS AGE 5-11 YEARS
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row>
              <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
              <GridColumn width={8}>%</GridColumn>
              <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
            </Grid.Row>

            <Grid.Row>
              <GridColumn width={4}></GridColumn>
              <GridColumn width={8}>
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
                          <Header.Content
                            style={{
                              fontWeight: 500,

                              fontSize: "12px",

                            }}
                          >
                            hello world!
                          </Header.Content>
                        ),
                      },
                    },
                  ]}
                />
              </GridColumn>
              <GridColumn width={4}></GridColumn>
            </Grid.Row>



          </Grid>
          <hr />
          <Header
            as="h4"
            style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
          >
            <Header.Content>
              MULTISYSTEM INFLAMMATORY SYNDROME
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row>
              <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
              <GridColumn width={8}>%</GridColumn>
              <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
            </Grid.Row>

          </Grid>
          <hr />
          <Header
            as="h4"
            style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
          >
            <Header.Content>
              SEVERE ALLERGIC REACTIONS
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row>
              <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
              <GridColumn width={8}>%</GridColumn>
              <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
            </Grid.Row>

          </Grid>
          <hr />
          <Header
            as="h4"
            style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
          >
            <Header.Content>
              HOSPITALISATION
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row>
              <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
              <GridColumn width={8}>%</GridColumn>
              <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
            </Grid.Row>

          </Grid>
          <hr />
          <Header
            as="h4"
            style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
          >
            <Header.Content>
              INTENSIVE CARE
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row>
              <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
              <GridColumn width={8}>%</GridColumn>
              <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
            </Grid.Row>

          </Grid>
          <hr />
          <Header
            as="h4"
            style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
          >
            <Header.Content>
              SYMPTOMS AFTER 1 MONTH
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row>
              <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
              <GridColumn width={8}>%</GridColumn>
              <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
            </Grid.Row>

          </Grid>
          <hr />
          <Header
            as="h4"
            style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
          >
            <Header.Content>
              DEATH
            </Header.Content>
          </Header>
          <Grid>
            <Grid.Row>
              <GridColumn width={4}><Progress progress reverse percent={32} color='red' /></GridColumn>
              <GridColumn width={8}>%</GridColumn>
              <GridColumn width={4}><Progress progress percent={32} color='blue' /></GridColumn>
            </Grid.Row>

          </Grid>
          <hr />
        </div>
    },
    {
      menuItem: { content: <p style={{ fontSize: "15pt" }}>NUMBER OF PEOPLE</p> }, render: () =>
        <div class="ui bottom attached segment active tab" style={{ width: '100%' }}>
          <Grid>
            <Grid.Row>
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
            <Grid.Row>
              <GridColumn width={6}> <Header
                as="h4"
                style={{ paddingTop: 10, fontWeight: 500, fontSize: "15pt" }}
              >
                <Header.Content>
                  SYMPTOMS AGE 5-11 YEARS
                </Header.Content>
                <HeaderSubHeader>
                  Number of People
                </HeaderSubHeader>
              </Header>
              </GridColumn>
              <GridColumn width={3}>

                <Header
                  as="h4"
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 15 }} reverse percent={32} color='red'></Progress>
                <Progress percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                >
                  <Header.Content style={{color:"red"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                >
                  <Header.Content style={{color:"blue"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>


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
                      <Header.Content
                        style={{
                          fontWeight: 500,

                          fontSize: "12px",

                        }}
                      >
                        hello world!
                      </Header.Content>
                    ),
                  },
                },
              ]}
            />



          </Grid>
          <hr />
          <Grid  style={{paddingTop:20}}>
            <Grid.Row>
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
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 15 }} reverse percent={32} color='red'></Progress>
                <Progress percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                >
                  <Header.Content style={{color:"red"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                >
                  <Header.Content style={{color:"blue"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
          </Grid>
          <hr />
          <Grid  style={{paddingTop:20}}>
            <Grid.Row>
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
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 15 }}  reverse percent={32} color='red'></Progress>
                <Progress  percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                >
                  <Header.Content style={{color:"red"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                >
                  <Header.Content style={{color:"blue"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
          </Grid>
          <hr />
          <Grid style={{paddingTop:20}}>
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
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 15 }} reverse percent={32} color='red'></Progress>
                <Progress percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                >
                  <Header.Content style={{color:"red"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                >
                  <Header.Content style={{color:"blue"}}>
                   2 in 100

                  </Header.Content>
                </Header>
              </GridColumn>
            </Grid.Row>
          </Grid>
          <hr />
          <Grid style={{paddingTop:20}}>
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
                >
                  <Header.Content>
                    With COVID-19

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                >
                  <Header.Content>
                    With Vaccination

                  </Header.Content>
                </Header>
              </GridColumn>

              <GridColumn width={5}>
                <Progress style={{ marginBottom: 15 }}  reverse percent={32} color='red'></Progress>
                <Progress  percent={32} color='blue' ></Progress>
              </GridColumn>
              <GridColumn width={2}>
              <Header
                  as="h4"
                >
                  <Header.Content style={{color:"red"}}>
                   3 in 100 

                  </Header.Content>
                </Header>
                <Header
                  as="h4"
                >
                  <Header.Content style={{color:"blue"}}>
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
                              The vaccine made by Pfizer and BioNTech is known as 'Comirnaty', or BNT162b2, or most commonly as 'the Pfizer vaccine'.

It is an mRNA vaccine which means it uses genetic code from a part of the virus to train your child’s immune system. The genetic code is quickly broken down by the body and cleared away. Your child can not catch COVID-19 from Comirnaty (Pfizer).

After the second dose, Comirnaty (Pfizer) is around 90% effective against the Delta variant in children.1-2  Effectiveness against Omicron is still unknown but if your child catches COVID-19 after they've been vaccinated, their illness will usually be mild.
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
export default compare;