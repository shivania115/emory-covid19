
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
function VaccFAQ() {
    const [activeIndex, setActiveIndex] = useState([-1]);
    return (
        <Grid>
            <Grid.Row>
                <GridColumn width={3}>

                </GridColumn>
                <Grid.Column width={4}>
                    <Header
                        as="h2"
                        style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
                    >

                        <Header.Content>
                            COVID-19
                        </Header.Content>
                        <HeaderSubHeader style={{
                            paddingTop: "2rem",

                            paddingBottom: "0rem",
                            lineHeight: "20pt",

                            fontSize: "1rem",
                            color: "black",
                        }}>
                            COVID-19 is caused by the SARS-CoV-2 virus. There have been millions of confirmed cases of COVID-19 in Australia, including hundreds of thousands of children.1 Thousands of people have lost their lives, including children.1 Most children who catch COVID-19 will get better; however, some children get so sick they need to go to hospital or be cared for by hospital staff in a 'hospital at home' program. Children with existing health issues are more likely to require hospitalisation.
                        </HeaderSubHeader>
                    </Header>
                </Grid.Column>
                <Grid.Column width={6}>
                    <Accordion style={{marginLeft:"4rem",marginTop:30}} fluid styled exclusive={false}>
                        <Accordion.Title
                            id="develop"
                            style={{ fontSize: "15pt", color: "black" }}
                            // active={activeIndex === 0}
                            index={36}
                            onClick={() =>
                                activeIndex.indexOf(36) < 0
                                    ? setActiveIndex((activeIndex) => [...activeIndex, 36])
                                    : setActiveIndex((activeIndex) =>
                                        activeIndex.filter((item) => item !== 36)
                                    )
                            }
                        >
                            <Icon name="dropdown" />
                            Who can get vaccinated against COVID-19?
                        </Accordion.Title>
                        <Accordion.Content
                            style={{ fontSize: "14pt" }}
                            active={activeIndex.indexOf(36) > 0}
                        >
                            <p>
                                At this point, anyone who is aged 12 or more is eligible
                                to get vaccinated. Although there a few cases in which
                                individuals should discuss vaccination with a healthcare
                                provider before.
                            </p>
                        </Accordion.Content>

                        <Accordion.Title
                            style={{ fontSize: "15pt", color: "black" }}
                            index={0}
                            onClick={() =>
                                activeIndex.indexOf(0) < 0
                                    ? setActiveIndex((activeIndex) => [...activeIndex, 0])
                                    : setActiveIndex((activeIndex) =>
                                        activeIndex.filter((item) => item !== 0)
                                    )
                            }
                        >
                            <Icon name="dropdown" />
                            What COVID-19 vaccines are approved for use in the United
                            States?
                        </Accordion.Title>
                        <Accordion.Content
                            style={{ fontSize: "14pt" }}
                            active={activeIndex.indexOf(0) > 0}
                        >
                            <p style={{ marginBottom: 0 }}>
                                At this time, three vaccines have been approved for use by
                                the United States Food and Drug Administration (
                                <a
                                    style={{ color: "#397AB9" }}
                                    href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/covid-19-vaccines"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    FDA
                                </a>
                                ): one developed by the company{" "}
                                <a
                                    style={{ color: "#397AB9" }}
                                    href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/pfizer-biontech-covid-19-vaccine"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {" "}
                                    Pfizer-BioNTech
                                </a>
                                , one by{" "}
                                <a
                                    style={{ color: "#397AB9" }}
                                    href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/moderna-covid-19-vaccine"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {" "}
                                    Moderna{" "}
                                </a>
                                , and one by
                                <a
                                    style={{ color: "#397AB9" }}
                                    href="https://www.fda.gov/media/146305/download"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {" "}
                                    Janssen Biotech, Johnson & Johnson’s vaccine division
                                </a>
                                .
                            </p>
                            <p
                                style={{
                                    paddingTop: "1rem",
                                    paddingLeft: "0rem",
                                    paddingRight: "1rem",
                                    marginBottom: 0,
                                    fontWeight: 400,
                                    fontSize: "14pt",
                                    textAlign: "justify",
                                }}
                            >

                                The vaccines developed by
                                <a
                                    style={{ color: "#397AB9" }}
                                    href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/comirnaty-and-pfizer-biontech-covid-19-vaccine"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >{" "}Pfizer-BioNTech{" "}
                                </a>
                                and
                                <a
                                    style={{ color: "#397AB9" }}
                                    href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/spikevax-and-moderna-covid-19-vaccine"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {" "}
                                    Moderna{" "}
                                </a>
                                have received full FDA approval for people aged 18 and older.
                                The vaccine developed by
                                <a
                                    style={{ color: "#397AB9" }}
                                    href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/janssen-covid-19-vaccine"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {" "}
                                    Johnson & Johnson{" "}
                                </a>
                                is currently available under Emergency Use Authorization.
                            </p>

                            <p
                                style={{
                                    paddingTop: "1rem",
                                    paddingLeft: "0rem",
                                    paddingRight: "1rem",
                                    marginBottom: 0,
                                    fontWeight: 400,
                                    fontSize: "14pt",
                                    textAlign: "justify",
                                }}
                            >
                                NOTE: Use of the Johnson & Johnson vaccine was temporarily
                                paused by the FDA and CDC “out of an abundance of caution”
                                on 13 April 2021. After a review of the evidence relating
                                to the safety of this vaccine on 23 April 2021, the
                                Advisory Committee on Immunization Practices concluded
                                that the vaccine was safe for use and that its benefits
                                outweighed any known or potential risks. The FDA and CDC
                                ended{" "}
                                <a
                                    style={{ color: "#397AB9" }}
                                    href="https://www.cdc.gov/media/releases/2021/fda-cdc-lift-vaccine-use.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {" "}
                                    the pause{" "}
                                </a>
                                and indicated that the Johnson & Johnson vaccine can again
                                be distributed.
                            </p>
                        </Accordion.Content>
                      
                  <Accordion.Title
                    style={{ fontSize: "15pt", color: "black" }}
                    // active={activeIndex === 0}
                    index={12}
                    onClick={() =>
                      activeIndex.indexOf(12) < 0
                        ? setActiveIndex((activeIndex) => [...activeIndex, 12])
                        : setActiveIndex((activeIndex) =>
                            activeIndex.filter((item) => item !== 12)
                          )
                    }
                  >
                    <Icon name="dropdown" />
                    Is the COVID-19 vaccine effective in protecting people
                    against getting COVID-19?
                  </Accordion.Title>
                  <Accordion.Content
                    style={{ fontSize: "14pt" }}
                    active={activeIndex.indexOf(12) > 0}
                  >
                    <p style={{ marginBottom: 0 }}>
                      Yes. The clinical trials for each approved vaccine showed
                      that the vaccine was effective in protecting vaccinated
                      people from getting sick with COVID-19 disease.
                    </p>

                    <p
                      style={{
                        paddingTop: "1rem",
                        paddingLeft: "0rem",
                        paddingRight: "1rem",
                        marginBottom: "0",
                        fontWeight: 400,
                        fontSize: "14pt",
                        textAlign: "justify",
                      }}
                    >
                      For both the Pfizer-BioNTech and Moderna vaccines, 2 doses
                      are required to be fully protected from COVID-19.
                      Individuals are not considered to be “vaccinated” until
                      after they receive their 2<sup>nd</sup> dose.
                    </p>

                    <p
                      style={{
                        paddingTop: "1rem",
                        paddingLeft: "0rem",
                        paddingRight: "1rem",
                        marginBottom: "0",
                        fontWeight: 400,
                        fontSize: "14pt",
                        textAlign: "justify",
                      }}
                    >
                      For the Johnson & Johnson vaccine, only one dose is
                      needed. For all vaccines, it takes around 2 weeks after
                      vaccination to be fully protected.
                    </p>
                  </Accordion.Content>
                  <Accordion.Title
                    id="get"
                    style={{ fontSize: "15pt", color: "black" }}
                    // active={activeIndex === 0}
                    index={37}
                    onClick={() =>
                      activeIndex.indexOf(37) < 0
                        ? setActiveIndex((activeIndex) => [...activeIndex, 37])
                        : setActiveIndex((activeIndex) =>
                            activeIndex.filter((item) => item !== 37)
                          )
                    }
                  >
                    <Icon name="dropdown" />
                    Are the COVID-19 vaccines safe for children?
                  </Accordion.Title>
                  <Accordion.Content
                    style={{ fontSize: "14pt" }}
                    active={activeIndex.indexOf(37) > 0}
                  >
                    <p>
                      Yes, the vaccine is safe for children as young as 12. At
                      this time one vaccine, Pfizer-BioNTech’s two-dose vaccine,
                      has been given Emergency Use Authorization for adolescents
                      down to age 12. Before applying for and getting
                      Authorization, researchers carried out closely monitored
                      trials and showed that this vaccine is safe and effective,
                      including for{" "}
                      <a
                        style={{ color: "#397AB9" }}
                        href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/adolescents.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        adolescents
                      </a>
                      . Trials are ongoing for other vaccines for younger
                      adolescents and children. Children may have side-effects
                      after getting a vaccine, just like adults do. They will
                      not get a COVID-19 infection from the vaccine.
                    </p>
                  </Accordion.Content>
                  <Accordion.Title
                    style={{
                      fontSize: "15pt",
                      color: "black",
                      lineHeight: "1.4",
                    }}
                    // active={activeIndex === 0}
                    index={49}
                    
                    onClick={() =>
                      activeIndex.indexOf(49) < 0
                        ? setActiveIndex((activeIndex) => [...activeIndex, 49])
                        : setActiveIndex((activeIndex) =>
                            activeIndex.filter((item) => item !== 49)
                          )
                    }
                  >
                    <Icon name="dropdown" />
                    What is the difference between an additional dose of a
                    COVID-19 vaccine and a booster?
                  </Accordion.Title>
                  <Accordion.Content
                    style={{ fontSize: "14pt" }}
                    active={activeIndex.indexOf(49) > 0}
                  >
                    <p>
                    Right now, the FDA and CDC have authorized and recommended additional doses of the Pfizer-BioNTech (Comirnaty) or Moderna (Spikevax) vaccines in certain circumstances. 
                    While both terms currently refer to a third shot, there are some differences in why an “additional dose” or a “booster dose” are recommended.
                    </p>

                    <p>
                      An <b>additional dose</b> of vaccine (i.e. a third dose of
                      the Pfizer or Moderna two-shot vaccines in this case,
                      received 28 days at least after the second dose) is
                      authorized by{" "}
                      <a
                        style={{ color: "#397AB9" }}
                        href="https://www.fda.gov/news-events/press-announcements/coronavirus-covid-19-update-fda-authorizes-additional-vaccine-dose-certain-immunocompromised"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        FDA
                      </a>{" "}
                      outside the United States and recommended by{" "}
                      <a
                        style={{ color: "#397AB9" }}
                        href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/immuno.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        CDC
                      </a>{" "}
                      for people who have moderately or severely compromised
                      immune systems, who may not have built up high enough
                      immunity from the first two shots. The goal of this
                      additional dose is to help their immune system build up a
                      stronger immune response than they built up from the first
                      two doses. This will provide a similar level of protection
                      in immunocompromised people as in seen in those who are
                      not immunocompromised. People with compromised immune
                      systems include those immunocompromised due to certain
                      treatments or medical condition or following{" "}
                      <a
                        style={{ color: "#397AB9" }}
                        href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/immuno.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        organ transplants.
                      </a>{" "}
                      At this time, there are no authorizations or
                      recommendations for additional doses for people who
                      received the Johnson & Johnson/ Janssen vaccine.
                    </p>
                    <p>
                      <b>A booster shot</b> (i.e. another dose of one of the available vaccines at least 5 months after getting a full primary 
                      series of either the Pfizer-BioNTech or Moderna two-shot vaccines or at least 2 months after the Johnson &Johnson/ Janssen one-shot vaccine) 
                      is authorized by{" "}
                      <a
                        style={{ color: "#397AB9" }}
                        href="https://www.fda.gov/news-events/press-announcements/fda-authorizes-booster-dose-pfizer-biontech-covid-19-vaccine-certain-populations"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        FDA
                      </a>{" "}
                      and recommended by{" "}
                      <a
                        style={{ color: "#397AB9" }}
                        href="https://www.cdc.gov/media/releases/2021/p0924-booster-recommendations-.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        CDC
                      </a>{" "}
                      for everyone. In this case, the booster counters the decrease in immunity that was developed after becoming fully vaccinated. 
                      Studies have shown that vaccine-induced protection from COVID-19 illness decreases over time and may also be decreased by newer variants of SARS-CoV-2, the virus that causes COVID-19. 
                      The reduction in immunity is primarily a reduction in protection from symptomatic COVID-19 illness; however, protection from more serious illness and outcomes does also decrease somewhat over time.
                       In some 
                       {" "}
                      <a
                        style={{ color: "#397AB9" }}
                        href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/booster-shot.html#second-booster"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                      cases
                      </a>{" "}
                       , a second booster is also recommended. 
                    </p>
                  </Accordion.Content>
                        </Accordion>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <GridColumn width={3}>

                </GridColumn>
                <Grid.Column width={4}>
                    <Header
                        as="h2"
                        style={{ paddingTop: 30, fontWeight: 1000, fontSize: "2rem" }}
                    >

                        <Header.Content>
                            COVID-19 vaccination
                        </Header.Content>
                        <HeaderSubHeader style={{
                            paddingTop: "2rem",

                            paddingBottom: "0rem",
                            lineHeight: "20pt",

                            fontSize: "1rem",
                            color: "black",
                        }}>
                            COVID-19 vaccines train our bodies to recognise and fight the virus. They do this by teaching our immune system to read the genetic code for an important part of the virus, called the spike protein.

                            Vaccination means your child will be less likely to catch COVID-19 and pass it on to others. There is still a small chance that they will catch the virus, but if they do, their symptoms will usually be mild.
                        </HeaderSubHeader>
                    </Header>
                </Grid.Column>
                <Grid.Column width={6}>

                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
export default VaccFAQ;