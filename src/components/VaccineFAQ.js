import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, Rail, Ref, Sticky, Divider, Accordion, Icon, Header, Table, Menu } from 'semantic-ui-react'
import React, { useEffect, useState, Component, createRef, useRef, useContext, useMemo } from 'react'
import { Waypoint } from 'react-waypoint'


const contextRef = createRef()
// const nameList = ['General Information', 'Vaccine Development', 'Vaccine Safety', 'Getting Vaccinated', 'After You Are Vaccinated'];
// let scrollCount = 0;

function StickyExampleAdjacentContext(props) {
  const contextRef = createRef();
  const [activeItem, setActiveItem] = useState('General Information')
  var activeCharacter = props.activeCharacter;
  //const { activeItem } = sTate
  // useEffect(() => {
  //     setActiveItem(nameList[scrollCount])
  // }, [scrollCount])

  console.log(props.activeCharacter)

  return (

    <div >
      <Ref innerRef={contextRef}>
        <Rail attached size='mini' >
          <Sticky offset={180} position="fixed" context={contextRef}>
            <div style={{ width: 240, overflow: "hidden" }}>
              <div style={{ height: 600, width: 250, overflowY: "scroll", overflowX: "hidden" }}>
                {/* <div style={{height: "100%", width: 240}}> */}
                <Menu
                  //   size='small'
                  style={{ width: 240, marginTop: '2rem', fontSize: '14pt' }}
                  // compact
                  pointing secondary vertical>
                  <Menu.Item as='a' name='General Information' active={activeItem === 'General Information'}
                    // || activeItem === 'General Information'
                    onClick={(e, { name }) => { setActiveItem(name) }}><Header as='h4'>General Information</Header></Menu.Item>
                  <Menu.Item as='a' href="#develop" name='Vaccine Development' active={activeItem === 'Vaccine Development'}
                    // || activeItem === 'Vaccine Development'
                    onClick={(e, { name }) => { setActiveItem(name) }}><Header as='h4'>Vaccine Development</Header></Menu.Item>
                  <Menu.Item as='a' href="#safety" name='Vaccine Safety' active={activeItem === 'Vaccine Safety'}
                    // || activeItem === 'Vaccine Safety'
                    onClick={(e, { name }) => { setActiveItem(name) }}><Header as='h4'>Vaccine Safety</Header></Menu.Item>
                  <Menu.Item as='a' href="#pregnancy" name='Vaccines, Fertility, and Pregnancy' active={activeItem === 'Vaccines, Fertility, and Pregnancy'}
                    // || activeItem === 'After You Are Vaccinated'
                    onClick={(e, { name }) => { setActiveItem(name) }}><Header as='h4'>COVID-19 Vaccines, Fertility, And Pregnancy</Header></Menu.Item>
                  <Menu.Item as='a' href="#get" name='Getting Vaccinated' active={activeItem === 'Getting Vaccinated'}
                    // || activeItem === 'Getting Vaccinated'
                    onClick={(e, { name }) => { setActiveItem(name) }}><Header as='h4'>Getting Vaccinated</Header></Menu.Item>
                  <Menu.Item as='a' href="#after" name='After You Are Vaccinated' active={activeItem === 'After You Are Vaccinated'}
                    // || activeItem === 'After You Are Vaccinated'
                    onClick={(e, { name }) => { setActiveItem(name) }}><Header as='h4'>After You Are Vaccinated</Header></Menu.Item>

                </Menu>
                {/* </div> */}
              </div>
            </div>
          </Sticky>
        </Rail>
      </Ref>
    </div>
  )
  // }

}






export default function VaccinesFAQ(props) {
  const [activeCharacter, setActiveCharacter] = useState('');
  const [activeIndex, setActiveIndex] = useState([-1]);
  console.log(activeIndex);

  return (
    <div>

      <AppBar menu='vaccineTracker' />
      <Container style={{ marginTop: '0em', minWidth: '1260px', overflow: "hidden" }}>

        <Grid>
          {/* <Grid.Column width={2} style={{zIndex: 10}}>
          <Ref innerRef={createRef()} >
            <StickyExampleAdjacentContext activeCharacter={activeCharacter}  />
          </Ref>
        </Grid.Column> */}


          <Grid.Column width={14}>

            <div style={{ paddingLeft: '2rem', paddingRight: '8rem' }}>
              <Header as='h1' style={{ paddingTop: 30, fontWeight: 400, fontSize: "24pt" }}>

                <Header.Content>
                  Frequently Asked Questions about COVID-19 Vaccines
                  <Header.Subheader style={{ paddingTop: '2rem', paddingLeft: '0rem', paddingBottom: '0rem', lineHeight: "20pt", fontWeight: 400, fontSize: "14pt", color: 'black' }}>
                    This is a resource guide to answer common questions about the COVID-19 vaccines. This guide is based on the best available information as of {Date().slice(4, 10)}, 2021. Before taking the vaccine, please consult your healthcare provider.
                    If you have any questions or concerns beyond those addressed here, we recommend the following resources for additional information:
                    {/* {Date().slice(4,10)} */}
                    <ul style={{ paddingLeft: '6rem', fontSize: '14pt', lineHeight: '1.5' }}>
                      <li>
                        <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/index.html" target="_blank" rel="noopener noreferrer"> CDC website </a>
                      </li>
                      <li>
                        <a style={{ color: "#397AB9" }} href="https://www.mayoclinic.org/coronavirus-covid-19/vaccine" target="_blank" rel="noopener noreferrer"> Mayo Clinic website </a>
                      </li>
                      <li>
                        Your local Department of Health website
                      </li>
                    </ul>
                  </Header.Subheader>
                </Header.Content>
              </Header>


              <div style={{ height: 5 }}> </div>
              <Header as='h2' style={{ fontWeight: 600 }}>
                General Information
              </Header>

              <Waypoint
                onEnter={() => {
                  setActiveCharacter('General Information')
                  //console.log(activeCharacter)
                }}>
              </Waypoint>

              <div style={{ paddingLeft: '2rem', paddingBottom: '0rem' }}>
                <Accordion fluid styled exclusive={false}>

                  <Accordion.Title id="develop" style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={36}
                    onClick={() => activeIndex.indexOf(36) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 36]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 36))}
                  >
                    <Icon name='dropdown' />
                    Who can get vaccinated against COVID-19?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(36) > 0}>
                    <p>
                      At this point, anyone who is aged 12 or more is eligible to get vaccinated. Although there a few cases in which individuals should discuss vaccination with a healthcare provider before.
                    </p>
                  </Accordion.Content>

                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    index={0}
                    onClick={() => activeIndex.indexOf(0) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 0]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 0))}
                  >
                    <Icon name='dropdown' />
                    What COVID-19 vaccines are approved for use in the United States?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(0) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      At this time, three vaccines have been approved for use by the United States Food and Drug Administration (<a style={{ color: "#397AB9" }} href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/covid-19-vaccines" target="_blank" rel="noopener noreferrer">FDA</a>):
                      one developed by the company <a style={{ color: "#397AB9" }} href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/pfizer-biontech-covid-19-vaccine" target="_blank" rel="noopener noreferrer"> Pfizer-BioNTech</a>
                      , one by <a style={{ color: "#397AB9" }} href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/moderna-covid-19-vaccine" target="_blank" rel="noopener noreferrer"> Moderna </a>, and one by
                      <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/146305/download" target="_blank" rel="noopener noreferrer"> Janssen Biotech, Johnson & Johnson’s vaccine division</a>.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      NOTE: Use of the Johnson & Johnson vaccine was temporarily paused by the FDA and CDC “out of an abundance of caution” on 13 April 2021. After a review of the evidence relating to the safety of this vaccine on 23 April 2021, the Advisory Committee on Immunization Practices concluded that the vaccine was safe for use and
                      that its benefits outweighed any known or potential risks. The FDA and CDC ended  <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/media/releases/2021/fda-cdc-lift-vaccine-use.html" target="_blank" rel="noopener noreferrer"> the pause </a>
                      and indicated that the Johnson & Johnson vaccine can again be distributed.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={1}
                    onClick={() => activeIndex.indexOf(1) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 1]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 1))}
                  >
                    <Icon name='dropdown' />
                    What are the differences between the approved vaccines?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(1) > 0}>
                    <p>
                      Both the <a style={{ color: "#397AB9" }} href="https://www.nejm.org/doi/full/10.1056/NEJMoa2034577" target="_blank" rel="noopener noreferrer"> Pfizer-BioNTech </a>
                      and the <a style={{ color: "#397AB9" }} href="https://www.nejm.org/doi/full/10.1056/nejmoa2022483" target="_blank" rel="noopener noreferrer"> Moderna </a>
                      vaccines have shown that they are very effective in preventing symptomatic COVID-19 disease (95% and 94.1% effective, respectively). The Johnson & Johnson vaccine showed that it was also quite effective in preventing severe COVID-19 illness (85% effective),
                      as well as preventing less severe illness. All three vaccines  have also shown that they are safe to get. However, there are a few small differences in who should get them and when. The most important ones for anyone getting a vaccine are the following:
                    </p>
                    <Container style={{ paddingLeft: '3rem', paddingBottom: '0.5rem' }}>
                      <Table celled compact style={{ fontWeight: 400, fontSize: '13pt', width: '58rem' }}>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell width={3}>Pfizer-BioNTech COVID-19 vaccine</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Moderna COVID-19 vaccine</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Johnson & Johnson COVID-19 vaccine</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell style={{ lineHeight: "14pt" }}>Approved for individuals aged 12 years and older</Table.Cell>
                            <Table.Cell style={{ lineHeight: "14pt" }}>Approved for individuals aged 18 years and older</Table.Cell>
                            <Table.Cell style={{ lineHeight: "14pt" }}>Approved for individuals aged 18 years and older</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ lineHeight: "14pt" }}>2 doses, 3 weeks apart</Table.Cell>
                            <Table.Cell style={{ lineHeight: "14pt" }}>2 doses, 4 weeks apart</Table.Cell>
                            <Table.Cell style={{ lineHeight: "14pt" }}>1 dose</Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    </Container>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={2}
                    onClick={() => activeIndex.indexOf(2) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 2]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 2))}
                  >
                    <Icon name='dropdown' />
                    What ingredients are in the approved COVID-19 vaccines?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(2) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      Each vaccine that is being developed is slightly different. The three vaccines for COVID-19 currently approved by the Food and Drug Administration (FDA) for use in the United States are the Pfizer-BioNTech COVID-19 vaccine, the Moderna COVID-19 vaccine, and the Johnson & Johnson COVID-19 vaccine.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      For the Pfizer-BioNTech and Moderna vaccines, the active ingredient is mRNA.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      For the Johnson & Johnson vaccine, the active ingredient is modified virus particles that carry SARS-CoV-2 DNA. These virus particles are not active virus and cannot replicate in the body or cause illness.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      All of the vaccines also include other ingredients like fat, salts, and sugars that protect the active ingredients, either mRNA or modified virus cells, depending on the vaccine. These ingredients also help the active ingredients work better in the body, and protect the vaccine when it is stored at very cold temperatures.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      The specific ingredients for each vaccine are listed <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/144414/download" target="_blank" rel="noopener noreferrer"> here </a>for the Pfizer-BioNTech vaccine,
                      <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/144638/download" target="_blank" rel="noopener noreferrer"> here </a> for the Moderna vaccine, and
                      <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/146305/download" target="_blank" rel="noopener noreferrer"> here </a> for the Johnson & Johnson vaccine.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      <u>None of the approved vaccines contain preservatives, eggs, latex, or fetal tissue.</u>
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={3}
                    onClick={() => activeIndex.indexOf(3) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 3]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 3))}
                  >
                    <Icon name='dropdown' />
                    What is an mRNA vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(3) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      The first two approved COVID-19 vaccines, those from Pfizer-BioNTech and Moderna, are a new type of vaccine called an <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/different-vaccines/mrna.html" target="_blank" rel="noopener noreferrer"> mRNA vaccine</a>.
                      An mRNA vaccine contains “instructions” for the body to make a piece of the “spike protein” found on the surface of the virus that causes COVID-19. These vaccines do not contain the whole virus.
                      The body then follows the instructions in the mRNA to make spike proteins and the immune system learns to recognize those proteins.
                      The body can then make antibodies to fight viruses that have this protein, in the same way it would learn to recognize and fight the virus if you actually got a COVID infection.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      mRNA vaccines cannot change a person’s DNA. The mRNA from the vaccine does not interact with a person’s DNA. mRNA is not “permanent”. In fact, it is quite fragile and breaks down quickly after it has triggered the body to make the virus spike proteins.
                      The mRNA “instructions” in these vaccines is likely to be read just by the muscle cells in your arm and some immune system cells. It will not be read by cells in other parts of your body.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      Although these vaccines are the first mRNA vaccines approved for use against any disease, scientists have been studying and working with mRNA for decades. This type of vaccine is also being studied against flu, Zika, rabies, and cytomegalovirus (CMV).
                      Because of the type of technology and materials they use, mRNA vaccines can also be developed more quickly against new viruses than other types of vaccines, as they were against COVID-19.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={34}
                    onClick={() => activeIndex.indexOf(34) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 34]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 34))}
                  >
                    <Icon name='dropdown' />
                    What is a “viral vector” or “adenovirus-based” vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(34) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      The COVID-19 vaccine developed by Johnson & Johnson is part of a category of vaccines known as “non-replicating viral vector”, “adenovirus-based”, or simply “viral vector” vaccines. These vaccines contain modified virus cells to deliver information to the body’s cells.
                      These virus cells are modified to be harmless so that they cannot cause any kind of illness, including COVID-19. They are not SARS-CoV-2 virus cells.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      These cells carry the DNA, or genes, for the SARS-CoV-2 “spike protein”. Once in the body, these genes allow the body to produce the mRNA or instructions to build those spike proteins. Then the body makes those spike proteins and the immune system learns to recognize those proteins.
                      The body can then make antibodies to fight viruses that have this protein, in the same way it would learn to recognize and fight the virus if you actually got a COVID infection.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      The spike protein DNA in these vaccines cannot change or affect a person’s DNA. The genes in the vaccines do not interact with a person’s DNA.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      Although adenovirus-based vaccines are a newer type of vaccine, this technology has been studied since the 1970s. A safe and effective vaccine against Ebola (also developed by
                      <a style={{ color: "#397AB9" }} href="https://www.jnj.com/latest-news/latest-facts-about-johnson-johnson-ebola-vaccine" target="_blank" rel="noopener noreferrer"> Johnson & Johnson</a>) that uses this technology has been in use since 2019.
                      Other viral vector vaccines that are being studied now include vaccines against HIV, Zika, and flu.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title id="develop" style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={4}
                    onClick={() => activeIndex.indexOf(4) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 4]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 4))}
                  >
                    <Icon name='dropdown' />
                    Can I get COVID-19 from taking the mRNA vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(4) > 0}>
                    <p>
                      No. mRNA vaccines cannot make anyone sick with COVID-19. They do not contain the virus that causes COVID-19. However, after receiving a vaccine, you may experience feelings like a headache or muscle aches.
                      The headaches and muscle aches happen because the vaccine triggers your body’s immune system and teaches it how to fight the virus. That is good news! If you do <b>not</b> experience these symptoms,
                      however, that does not mean your immune system is not reacting to the vaccine and learning how to fight the virus or that the vaccine is not working.
                      Individuals react differently to vaccines and your body may just have a less pronounced response.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title id="develop" style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={35}
                    onClick={() => activeIndex.indexOf(35) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 35]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 35))}
                  >
                    <Icon name='dropdown' />
                    Can I get COVID-19 from taking the viral vector vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(35) > 0}>
                    <p>
                      No. Viral vector vaccines cannot make anyone sick with COVID-19. They do not contain the virus that causes COVID-19. However, after receiving a vaccine, you may experience feelings like a headache or muscle aches.
                      The headaches and muscle aches happen because the vaccine triggers your body’s immune system and teaches it how to fight the virus. That is good news! If you do not experience these symptoms, however,
                      that does not mean your immune system is not reacting to the vaccine and learning how to fight the virus or that the vaccine is not working. Individuals react differently to vaccines and your body may just have a less pronounced response.
                    </p>
                  </Accordion.Content>
                </Accordion>
              </div>



              <div style={{ height: 5 }}> </div>
              <Header as='h2' style={{ fontWeight: 600 }}>
                <Header.Content>
                  Vaccine Development
                </Header.Content>
              </Header>



              { /*<Header as='h3' style={{fontSize:'16pt', paddingLeft:'2rem'}}>
            How many vaccines are currently being studied?
        </Accordion.Title>
        <Accordion.Content style={{fontSize:'14pt'}}
          active={activeIndex.indexOf(0)>0}>
          <p>
        There are <a style ={{color: "#397AB9"}} href="https://covid19.trackvaccines.org/vaccines/" target="_blank" rel="noopener noreferrer"> currently </a>
        78 vaccines in various phases of testing across the world. Of these, 20 are in <a style ={{color: "#397AB9"}} href="https://covid19.trackvaccines.org/trials-vaccine-testing/#trial-phases" target="_blank" rel="noopener noreferrer"> Phase 3 </a>
        clinical trials. Phase 3 trials are the large-scale studies done before a vaccine is approved.
        </p>

        <Waypoint
            onEnter={() => {
                setActiveCharacter('Vaccine Development')
                //console.log(activeCharacter)
            }}>
        </Waypoint> 

        <Accordion fluid styled exclusive={false}>
        <Accordion.Title style={{fontSize:'15pt', color: 'black'}}
          // active={activeIndex === 0}
          index={0}
          onClick={() => activeIndex.indexOf(0) < 0 ? setActiveIndex(activeIndex =>[...activeIndex, 0]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 0))}
        >
          <Icon name='dropdown' />
            Will the approved vaccines protect against new variants of the coronavirus?
        </Accordion.Title>
        <Accordion.Content style={{fontSize:'14pt'}}
          active={activeIndex.indexOf(0)>0}>
          <p>
        It is hard to know exactly how effective the authorized vaccines will be against new and different variants of SARS-CoV-2, the virus that causes COVID-19. 
        Right now, the limited information we have suggests that the immune protection both from natural infection (i.e. actually getting COVID-19) or 
        from vaccination will still protect against most new variants. However, this is a changing situation, and something scientists are continuing to study. 
        </p>


        <Accordion fluid styled exclusive={false}>
        <Accordion.Title style={{fontSize:'15pt', color: 'black'}}
          // active={activeIndex === 0}
          index={0}
          onClick={() => activeIndex.indexOf(0) < 0 ? setActiveIndex(activeIndex =>[...activeIndex, 0]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 0))}
        >
          <Icon name='dropdown' />
            What is Operation Warp Speed?
        </Header>
        <p style={{paddingLeft:'4rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
            Operation Warp Speed is a partnership among components of the Department of Health and Human Services and the Department of Defense to help develop, make, 
            and distribute millions of vaccine doses for COVID-19 as quickly as possible after making sure that the vaccines are safe and that they work. 
        </p>
        <p style={{paddingTop:'1rem',paddingLeft:'4rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
            Details about Operation Warp Speed can be found <a style ={{color: "#397AB9"}} href="https://www.hhs.gov/coronavirus/explaining-operation-warp-speed/index.html" target="_blank" rel="noopener noreferrer"> here </a>.
        </p>


        <Accordion fluid styled exclusive={false}>
        <Accordion.Title style={{fontSize:'15pt', color: 'black'}}
          // active={activeIndex === 0}
          index={0}
          onClick={() => activeIndex.indexOf(0) < 0 ? setActiveIndex(activeIndex =>[...activeIndex, 0]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 0))}
        >
          <Icon name='dropdown' />
            What does it mean if a clinical trial is “paused”?
        </Accordion.Title>
        <Accordion.Content style={{fontSize:'14pt'}}
          active={activeIndex.indexOf(0)>0}>
          <p>
        During clinical trials, the top priority is safety of the participants. The clinical trials of the COVID-19 vaccines are no different. 
        It is normal for a clinical trial to be temporarily paused when a possible side effect (or “adverse event”) is found. This pause happens so that the side effect can be investigated fully, 
        to see if it is really related to the vaccine, or to something else. This is done by doctors and an independent monitoring board of other scientists, not by the pharmaceutical company. 
        Clinical trials are specifically designed to allow for potential pauses, so that they can put patient safety at the absolute top of the priority list. 
        </p> */}


              <div style={{ paddingLeft: '2rem', paddingBottom: '0rem' }}>
                <Accordion fluid styled exclusive={false}>
                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={5}
                    onClick={() => activeIndex.indexOf(5) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 5]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 5))}
                  >
                    <Icon name='dropdown' />
                    How many vaccines are currently being studied?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(5) > 0}>
                    <p>
                      There are <a style={{ color: "#397AB9" }} href="https://covid19.trackvaccines.org/vaccines/" target="_blank" rel="noopener noreferrer"> currently </a>
                      93 vaccines in various phases of testing across the world. Of these, 25 are in <a style={{ color: "#397AB9" }} href="https://covid19.trackvaccines.org/trials-vaccine-testing/#trial-phases" target="_blank" rel="noopener noreferrer"> Phase 3 </a>
                      clinical trials. Phase 3 trials are the large-scale studies done before a vaccine is approved. There are 12 vaccines approved for use in different countries, although only 3 have been approved for use in the United States under the Food and Drug Administration’s Emergency Use Authorization.
                    </p>
                  </Accordion.Content>



                  {/* <Accordion.Title style={{fontSize:'15pt', color: 'black'}}
          // active={activeIndex === 2}
          index={7}
          onClick={() => activeIndex.indexOf(7) <0 ? setActiveIndex(activeIndex =>[...activeIndex, 7]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 7))}
        >
          <Icon name='dropdown' />
          What is Operation Warp Speed?
        </Accordion.Title>
        <Accordion.Content style={{fontSize:'14pt'}}
          active={activeIndex.indexOf(7)>0}>
          <p>
            Operation Warp Speed is a partnership among components of the Department of Health and Human Services and the Department of Defense to help develop, make, 
            and distribute millions of vaccine doses for COVID-19 as quickly as possible after making sure that the vaccines are safe and that they work. 
            <br/><br/>
            Details about Operation Warp Speed can be found <a style ={{color: "#397AB9"}} href="https://www.hhs.gov/coronavirus/explaining-operation-warp-speed/index.html" target="_blank" rel="noopener noreferrer"> here </a>.
          </p>
        </Accordion.Content> */}


                  <Accordion.Title id="safety" style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 3}
                    index={8}
                    onClick={() => activeIndex.indexOf(8) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 8]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 8))}
                  >
                    <Icon name='dropdown' />
                    What does it mean if a clinical trial is “paused”?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(8) > 0}>
                    <p>
                      During clinical trials, the top priority is safety of the participants. The clinical trials of the COVID-19 vaccines are no different.
                      It is normal for a clinical trial to be temporarily paused when a possible side effect (or “adverse event”) is found. This pause happens so that the side effect can be investigated fully,
                      to see if it is really related to the vaccine, or to something else. This is done by doctors and an independent monitoring board of other scientists, not by the pharmaceutical company.
                      Clinical trials are specifically designed to allow for potential pauses, so that they can put patient safety at the absolute top of the priority list.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 1}
                    index={7}
                    onClick={() => activeIndex.indexOf(7) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 7]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 7))}
                  >
                    <Icon name='dropdown' />
                    How was it possible to develop these vaccines so quickly?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(7) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      As soon as the virus was identified as SARS-CoV-2 in early 2020, many researchers around the world began to work on mapping out its genetic code. Because scientists were already familiar with coronaviruses,
                      the virus family SARS-CoV-2 belongs to, and because they collaborated on this work, they were able to identify its viral sequence incredibly quickly. The technologies for the different types of vaccines (mRNA, viral vector, and others)
                      were already being tested on other viruses and in other areas of medicine. They were rapidly adapted against SARS-CoV-2 once scientists had its viral sequence fully mapped out.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      Because of the global urgency to fight the COVID-19 pandemic, researchers received very large amounts of funding from governments and private sector investors. Partnerships were also developed between groups of institutions to plan ahead
                      in case the vaccines that were being developed and tested proved to be effective. In the United States, one such partnership was Operation Warp Speed. This collaboration brought together components of the Department of Health and Human Services
                      and the Department of Defense to develop, make and distribute vaccines as quickly as possible after they were tested for safety and effectiveness.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 1}
                    index={6}
                    onClick={() => activeIndex.indexOf(6) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 6]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 6))}
                  >
                    <Icon name='dropdown' />
                    Will the approved vaccines protect against new variants of the coronavirus?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(6) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      It is hard to know exactly how effective the authorized vaccines will be against new and different variants of SARS-CoV-2, the virus that causes COVID-19.
                      The limited <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/transmission/variant.html" target="_blank" rel="noopener noreferrer"> information </a>
                      we have suggests that the immune protection both from natural infection (i.e. actually getting COVID-19) or from vaccination will still protect against death and serious illness caused by most new variants. However, this is a changing situation, and something scientists are continuing to study.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      At this time, the <a style={{ color: "#397AB9" }} href="https://www.bmj.com/content/372/bmj.n597" target="_blank" rel="noopener noreferrer"> data </a>
                      show a mixed picture, depending on the variant in question. Whether or not a vaccine is effective against a variant depends both on the specific vaccine and the specific variant. While the available vaccines, particularly the two mRNA vaccines do provide very good protection against severe illness and death, including against the most common variant, known as the Delta variant. However, some variants, including the Delta variant, could still be transmitted to others by people who are vaccinated. As a result, <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/fully-vaccinated.html" target="_blank" rel="noopener noreferrer"> CDC </a> recommends that even if you are vaccinated, you continue to wear a mask, especially in large groups, indoors, and in areas where transmission levels are <a style={{ color: "#397AB9" }} href="https://covid.cdc.gov/covid-data-tracker/#county-view" target="_blank" rel="noopener noreferrer"> high</a> .
                    </p>
                  </Accordion.Content>
                </Accordion>
              </div>




              <div style={{ height: 5 }}> </div>
              <Header as='h2' style={{ fontWeight: 600 }}>
                <Header.Content>
                  Vaccine Safety
                </Header.Content>
              </Header>

              <Waypoint
                onEnter={() => {
                  setActiveCharacter('Vaccine Safety')
                  //console.log(activeCharacter)
                }}>
              </Waypoint>

              <div style={{ paddingLeft: '2rem', paddingBottom: '0rem' }}>
                <Accordion fluid styled exclusive={false}>
                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={9}
                    onClick={() => activeIndex.indexOf(9) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 9]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 9))}
                  >
                    <Icon name='dropdown' />
                    What is an Emergency Use Authorization (EUA) for vaccines?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(9) > 0}>
                    <p>
                      An <a style={{ color: "#397AB9" }} href="https://www.fda.gov/emergency-preparedness-and-response/mcm-legal-regulatory-and-policy-framework/emergency-use-authorization" target="_blank" rel="noopener noreferrer"> Emergency Use Authorization </a>
                      is a way that the Food and Drug Administration (FDA) can approve a treatment when there is no alternative treatment for a major health threat.
                      The Food and Drug Administration issues Emergency Use Authorization only when a panel of doctors agrees that the benefits of the treatment very clearly outweigh the risk.
                      The Food and Drug Administration issued Emergency Use Authorization of the COVID-19 vaccine because there are no other treatments available and a panel of doctors decided there was enough information that the benefits of the vaccine are greater than the risks.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={10}
                    onClick={() => activeIndex.indexOf(10) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 10]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 10))}
                  >
                    <Icon name='dropdown' />
                    Are the approved COVID-19 vaccines safe?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(10) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      Yes. Any vaccine that is approved for use is thoroughly tested to make sure that it is both effective and safe. Tests for safety already happen in Phase I, Phase II, and Phase III clinical trials.
                      However, vaccines continue to be tested for safety after they are approved for use, in what are called “Phase IV” studies. All the vaccines for COVID-19 are being developed through careful scientific studies,
                      which follow strict standards set by the Food and Drug Administration (FDA). During vaccine development and testing, researchers carefully study whether each vaccine effectively reduces the chances of getting COVID-19 or getting sick from COVID-19.
                      Researchers have tested the vaccines on thousands of study participants during Phases I-III. Researchers also track whether a vaccine causes side effects, the kind of side effects people experience, and how serious those are.
                      All of the side effects are reported to doctors making the decision about whether the vaccine is safe.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      There are very strict standards about whether a vaccine is authorized as safe by the Food and Drug Administration. Before a COVID-19 vaccine is approved, scientists must show that any risks of side effects from the vaccine are outweighed by its benefits and
                      by the potential harm of getting sick from COVID-19. You can find additional information about COVID-19 vaccine safety on the <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety.html" target="_blank" rel="noopener noreferrer"> CDC’s website </a>
                      and the full documents shared with the FDA <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/144434/download" target="_blank" rel="noopener noreferrer"> here </a> for the Moderna vaccine,
                      <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/144245/download" target="_blank" rel="noopener noreferrer"> here </a> for the Pfizer-BioNTech vaccine, and <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/146217/download" target="_blank" rel="noopener noreferrer"> here </a>
                      for the Johnson & Johnson vaccine. Vaccine safety monitoring does not stop once a vaccine is approved. It continues on a larger scale with Phase IV studies as well as nationwide vaccine safety reporting systems.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      There are multiple systems used to track any reports of any adverse side effects or reactions. The Vaccine Safety Datalink which helps to determine whether the reactions reported using the Vaccine Adverse Event Reporting System (VAERS) are related to a vaccine.
                      The Clinical Immunization Safety Assessment Project also helps to track and evaluate issues of vaccine safety. You can find out more about these and other different systems at CDC, the Food and Drug Administration,
                      and other groups used to monitor and assess safety  <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety.html" target="_blank" rel="noopener noreferrer"> here </a>.
                    </p>
                  </Accordion.Content>

                  <Accordion.Title style={{ fontSize: '15pt', color: 'black', lineHeight: 1.4 }}
                    // active={activeIndex === 0}
                    index={39}
                    onClick={() => activeIndex.indexOf(39) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 39]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 39))}
                  >
                    <Icon name='dropdown' />
                    Use of the Johnson & Johnson vaccine was paused and then restarted. Is the Johnson & Johnson vaccine safe?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(39) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      Yes. In April 2021, the FDA and CDC recommended pausing the distribution of the Johnson & Johnson vaccine to allow the CDC’s Advisory Committee on Immunization Practices (ACIP)
                      to investigate extremely rare reports of individuals experiencing blood clotting events after having received this vaccine (6 reports after 6.8 million vaccine doses were administered).
                      These reports were identified through the careful monitoring of side effects and serious reactions being recorded via the Vaccine Adverse Event Reporting System (or VAERS).
                      This is a very good sign that not only is the monitoring working to catch any rare reactions to the vaccine but also that the FDA and CDC are taking quick action to review any potential new risks linked to the vaccines that are authorized.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      During two meetings, the ACIP reviewed the reports of blood clots and any other reports of adverse reactions to the vaccines. They reassessed how serious and common any risks linked to receiving the Johnson & Johnson vaccine might be,
                      including the likelihood of having this rare type of blood clot. They also considered the benefits of being vaccinated against COVID-19 and the risks associated with not being vaccinated. The cases of these rare blood clots (called cerebral venous sinus thromboses or CVST)
                      were all among women aged 18-59. The review concluded that the vaccine was safe and effective against COVID-19 and that its benefits outweigh any known or potential risks in all approved age groups and in both men and women.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      Following this review, the ACIP recommended continuing the use of the Johnson & Johnson vaccine. The FDA and CDC ended <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/media/releases/2021/fda-cdc-lift-vaccine-use.html" target="_blank" rel="noopener noreferrer"> the pause </a>
                      and indicated that the Johnson & Johnson vaccine can be made available again. Both FDA and CDC will continue to <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/mmwr/volumes/70/wr/mm7018e2.htm?s_cid=mm7018e2_e&ACSTrackingID=USCDC_921-DM56028&ACSTrackingLabel=MMWR%20Early%20Release%20-%20Vol.%2070%2C%20April%2030%2C%202021&deliveryName=USCDC_921-DM56028" target="_blank" rel="noopener noreferrer"> monitor </a>
                      any reports of blood clots and other serious side effects for both the Johnson & Johnson vaccine as well as the other vaccines under Emergency Use Authorization. The FDA and CDC reiterated that, based on the findings from the ACIP review:
                    </p>

                    <ul style={{ paddingLeft: '6rem', fontSize: '14pt', lineHeight: '1.5' }}>
                      <li>
                        Use of this vaccine should resume
                      </li>
                      <li>
                        The agencies are confident that the vaccine is safe and effective in preventing COVID-19
                      </li>
                      <li>
                        The data show that the vaccine’s known and potential benefits outweigh its known and potential risks
                      </li>
                      <li>
                        The data suggest that the risks of these types of blood clotting issues are very low
                      </li>
                      <li>
                        The FDA and CDC will continue to monitor these and any other reports relating to vaccine side effects and adverse reactions
                      </li>
                    </ul>

                    <p style={{ paddingTop: '0rem', paddingLeft: '0rem', paddingRight: '1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      The information sheets for vaccine administering <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/146304/download" target="_blank" rel="noopener noreferrer"> healthcare staff </a>
                      and <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/146305/download" target="_blank" rel="noopener noreferrer"> recipients </a> have also been updated to include information about this potential and very rare risk,
                      and about its treatment. Because this is a rare type of blood clot, the guidance for healthcare providers also ensures that they know what to look for to make sure that if they find these types of cases they treat them appropriately.
                    </p>
                  </Accordion.Content>


                  {/* <Accordion.Title id="get" style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={11}
                    onClick={() => activeIndex.indexOf(11) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 11]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 11))}
                  >
                    <Icon name='dropdown' />
                    Are there concerns about the COVID-19 vaccine and fertility?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(11) > 0}>
                    <p>
                      No. There is no evidence to suggest that the COVID-19 vaccines would increase the risk of infertility. This is a concern that began to be shared widely by non-scientific sources.
                      However, there is no connection between the virus spike protein targeted by the vaccine and human reproductive tissue. As a result, there is no reason to be concerned about any effect of these vaccines on fertility.
                    </p>
                  </Accordion.Content> */}

                  <Accordion.Title id="get" style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={37}
                    onClick={() => activeIndex.indexOf(37) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 37]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 37))}
                  >
                    <Icon name='dropdown' />
                    Are the COVID-19 vaccines safe for children?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(37) > 0}>
                    <p>
                      Yes, the vaccine is safe for children as young as 12. At this time one vaccine, Pfizer-BioNTech’s two-dose vaccine, has been given Emergency Use Authorization for adolescents down to age 12. Before applying for and getting Authorization, researchers carried out closely monitored trials and showed that this vaccine is safe and effective, including for <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/adolescents.html" target="_blank" rel="noopener noreferrer"> adolescents</a>. Trials are ongoing for other vaccines for younger adolescents and children. Children may have side-effects after getting a vaccine, just like adults do. They will not get a COVID-19 infection from the vaccine.
                    </p>
                  </Accordion.Content>


                </Accordion>
              </div>



              <div style={{ height: 5 }}> </div>
              <Header as='h2' style={{ fontWeight: 600 }}>
                <Header.Content>
                  COVID-19 Vaccines, Fertility, and Pregnancy
                </Header.Content>
              </Header>

       
              <Waypoint
                onEnter={() => {
                  setActiveCharacter('Vaccines, Fertility, and Pregnancy')
                  //console.log(activeCharacter)
                }}>
              </Waypoint>


              <div style={{ paddingLeft: '2rem', paddingBottom: '0rem' }}>
                <Accordion fluid styled exclusive={false}>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={43}
                    onClick={() => activeIndex.indexOf(43) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 43]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 43))}
                  >
                    <Icon name='dropdown' />
                    Are there concerns about the COVID-19 vaccine and fertility?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(43) > 0}>
                    <p>
                      No. There is no credible scientific evidence to suggest that vaccination against COVID-19 would increase the risk of infertility in either women or men. There is no connection between the virus spike protein targeted by the vaccine and human (female or male) reproductive tissue. As a result, there is no reason to be concerned about any effect of these vaccines on current or future fertility.
                    </p>
                  </Accordion.Content>

                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={46}
                    onClick={() => activeIndex.indexOf(46) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 46]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 46))}
                  >
                    <Icon name='dropdown' />
                    If I am trying to start a family or am considering starting a family in the future, should I get a COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(46) > 0}>
                    <p>
                      Yes. You can get any of the available and authorized vaccines even if you are considering becoming pregnant now or in the future.
                      <a style={{ color: "#397AB9" }} href="https://www.acog.org/clinical/clinical-guidance/practice-advisory/articles/2020/12/covid-19-vaccination-considerations-for-obstetric-gynecologic-care" target="_blank" rel="noopener noreferrer">  The American College of Obstetricians and Gynecologists </a> and <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/pregnancy.html" target="_blank" rel="noopener noreferrer">  CDC </a>  recommend the COVID-19 vaccine for people trying to conceive or planning to do so. There is no need to delay pregnancy after being fully vaccinated. There is no evidence that any of the vaccines have any effect on fertility or the ability to become pregnant, either in women or men. There is also some
                      <a style={{ color: "#397AB9" }} href="https://jamanetwork.com/journals/jama/fullarticle/2781360" target="_blank" rel="noopener noreferrer">  evidence  </a> that the SARS-CoV-2 virus can affect the testes and sperm quality, meaning that a COVID-19 infection could potentially affect male fertility later.
                    </p>
                  </Accordion.Content>

                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={47}
                    onClick={() => activeIndex.indexOf(47) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 47]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 47))}
                  >
                    <Icon name='dropdown' />
                    If I am already pregnant, should I get a COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(47) > 0}>
                    <p>
                      Yes. The American College of Obstetricians and Gynecologists strongly
                      <a style={{ color: "#397AB9" }} href="https://www.acog.org/clinical/clinical-guidance/practice-advisory/articles/2020/12/covid-19-vaccination-considerations-for-obstetric-gynecologic-care" target="_blank" rel="noopener noreferrer">  recommends  </a> that pregnant people who are eligible to get vaccinated get a COVID-19 vaccine. While it may be helpful to discuss vaccination with a healthcare provider to answer any outstanding questions, there are no contraindications based on pregnancy. A pregnant person can receive any of the vaccines that have received Emergency Use Authorization or full approval.
                    </p>
                  </Accordion.Content>

                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={48}
                    onClick={() => activeIndex.indexOf(48) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 48]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 48))}
                  >
                    <Icon name='dropdown' />
                    Is it safe to get a COVID-19 vaccine while breastfeeding?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(48) > 0}>
                    <p>
                      Yes. The American College of Obstetricians and Gynecologists <a style={{ color: "#397AB9" }} href="https://www.acog.org/clinical/clinical-guidance/practice-advisory/articles/2020/12/covid-19-vaccination-considerations-for-obstetric-gynecologic-care" target="_blank" rel="noopener noreferrer">  recommends  </a> that people who are breastfeeding get a

                      COVID-19 vaccine. They may continue breastfeeding after getting the COVID-19 vaccine.
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/pregnancy.html" target="_blank" rel="noopener noreferrer">  CDC notes  </a> that there is some recent evidence that people who received one of the mRNA vaccines have antibodies in their breastmilk, which could help to protect their babies from COVID-19.
                    </p>
                  </Accordion.Content>

                  <Accordion.Title style={{ fontSize: '15pt', color: 'black', lineHeight: 1.4 }}
                    // active={activeIndex === 0}
                    index={25}
                    onClick={() => activeIndex.indexOf(25) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 25]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 25))}
                  >
                    <Icon name='dropdown' />
                    If I am trying to become pregnant or am considering becoming pregnant in the future, should I get the COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(25) > 0}>
                    <p>
                      You may get any of the available vaccines even if you are considering becoming pregnant. The American College of Obstetricians and Gynecologists and
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/pregnancy.html" target="_blank" rel="noopener noreferrer"> CDC </a>
                      recommend the COVID-19 vaccine for people trying to become pregnant or considering becoming pregnant in the future. There is no need to delay pregnancy after being fully vaccinated.
                    </p>
                  </Accordion.Content>



                </Accordion>
              </div>




              <div style={{ height: 5 }}></div>
              <Header as='h2' style={{ fontWeight: 600 }}>
                <Header.Content>
                  Getting Vaccinated
                </Header.Content>
              </Header>

              <Waypoint
                onEnter={() => {
                  setActiveCharacter('Getting Vaccinated')
                  //console.log(activeCharacter)
                }}>
              </Waypoint>


              <div style={{ paddingLeft: '2rem', paddingBottom: '0rem' }}>
                <Accordion fluid styled exclusive={false}>
                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={12}
                    onClick={() => activeIndex.indexOf(12) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 12]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 12))}
                  >
                    <Icon name='dropdown' />
                    Is the COVID-19 vaccine effective in protecting people against getting COVID-19?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(12) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      Yes. The clinical trials for each approved vaccine showed that the vaccine was effective in protecting vaccinated people from getting sick with COVID-19 disease.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      For both the Pfizer-BioNTech and Moderna vaccines, 2 doses are required to be fully protected from COVID-19. Individuals are not considered to be “vaccinated” until after they receive their 2<sup>nd</sup> dose.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      For the Johnson & Johnson vaccine, only one dose is needed. For all vaccines, it takes around 2 weeks after vaccination to be fully protected.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={13}
                    onClick={() => activeIndex.indexOf(13) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 13]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 13))}
                  >
                    <Icon name='dropdown' />
                    Can the vaccine make me sick with COVID-19?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(13) > 0}>
                    <p>
                      No. The COVID-19 vaccines do not contain COVID-19 virus particles that could cause the disease.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={14}
                    onClick={() => activeIndex.indexOf(14) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 14]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 14))}
                  >
                    <Icon name='dropdown' />
                    Do I need two doses of the COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(14) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      Yes, if you are getting one of the approved mRNA vaccines (from Pfizer-BioNTech or Moderna), you need both doses. For these vaccines, one dose is not effective enough to provide strong protection against COVID-19. You can enroll in
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/vaccines/covid-19/reporting/vaxtext/index.html" target="_blank" rel="noopener noreferrer"> CDC’s VaxText program </a>
                      to receive text messages to remind you when it is time to get your second dose.
                    </p>
                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      For the vaccine developed by Johnson & Johnson, you do not need a second dose.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={15}
                    onClick={() => activeIndex.indexOf(15) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 15]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 15))}
                  >
                    <Icon name='dropdown' />
                    Do I need two doses of the same COVID-19 vaccine (if I get a two-dose vaccine)?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(15) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      Yes, whenever possible. You should get both doses of the same vaccine. In other words, you should not “mix and match” vaccines from different manufacturers. When you get your first vaccine dose, you will receive a card with the date,
                      the name of the manufacturer, and lot number of the vaccine you received and the date when you should get the second dose. You should take that card to your next vaccination appointment to keep track of what vaccine you were given and when.
                      This will help the healthcare staff provide you with the correct second dose.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      Getting two different types of vaccines will likely not give you more protection than one type of vaccine.
                      The safety of getting vaccinated by two different vaccines has not been directly tested in clinical trials, so this is not recommended. In very limited situations, CDC recently published
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/vaccines/covid-19/info-by-product/clinical-considerations.html" target="_blank" rel="noopener noreferrer"> guidance </a>
                      to allow for two doses of different vaccines to be given. This should only be done if the vaccine given for the first dose is no longer available or it is not possible to determine which vaccine was used for the first dose.
                      This should be avoided if at all possible.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={16}
                    onClick={() => activeIndex.indexOf(16) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 16]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 16))}
                  >
                    <Icon name='dropdown' />
                    Will a flu shot protect me from COVID-19?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(16) > 0}>
                    <p>
                      No. Getting a flu vaccine can only protect you from getting influenza (flu). It will not protect you from getting COVID-19 or from getting sick if you get COVID-19. If you do get COVID-19, being protected from the flu can keep you from having a more severe illness.
                      Therefore, getting a <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/flu/prevent/index.html" target="_blank" rel="noopener noreferrer"> flu vaccine </a>
                      is still important.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={17}
                    onClick={() => activeIndex.indexOf(17) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 17]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 17))}
                  >
                    <Icon name='dropdown' />
                    Will the COVID-19 vaccine protect me from the flu?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(17) > 0}>
                    <p>
                      No. Once you are able to get a COVID-19 vaccine, it will not protect you from getting the flu (influenza) or from getting sick if you do get the flu. Even after you get a vaccine for COVID-19, you should continue getting a flu vaccine every year to protect yourself from seasonal flu.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={18}
                    onClick={() => activeIndex.indexOf(18) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 18]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 18))}
                  >
                    <Icon name='dropdown' />
                    I’ve already had COVID-19. Should I still get vaccinated?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(18) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      Yes. Since COVID-19 is a new virus, we do not know how long immunity (or protection) someone gets from having an infection lasts. In general, immunity after an infection depends on both the disease and the individual.
                      So far, based on evidence from a small number of people, it seems like immunity from a COVID-19 infection may not last very long. More research is needed to understand this fully and to get a clearer sense of how long it might last.
                      Because we do not yet know how long this immunity will last, it is still important to get vaccinated even if you had COVID-19 and recovered.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      However, if you currently have COVID-19, you should wait to get vaccinated until you feel better and your isolation period is over. If you were treated with antibody therapy during your COVID-19 illness, you should wait until 90 days after you received this treatment to get vaccinated.
                      There is data suggesting that getting re-infected with COVID-19 within 90 days following infection is uncommon.
                      As a result, some people may choose to wait 90 days after they have recovered from COVID-19 before getting vaccinated.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      If you were recently exposed to COVID-19 and you can safely quarantine away from other people, you should also wait to get the vaccine until after your quarantine period. If there is a high risk you could transmit the virus to others,
                      you may discuss getting vaccinated during your quarantine period with your healthcare provider so you can protect others.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={37}
                    onClick={() => activeIndex.indexOf(37) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 37]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 37))}
                  >
                    <Icon name='dropdown' />
                    If I had COVID-19, can I just get one dose of the two-dose vaccines?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(37) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      At this time, there isn’t enough evidence that one dose would be enough. The guidelines still recommend that, if you are getting either the Pfizer-BioNTech or the Moderna vaccine,
                      you plan to get both doses to ensure you are fully vaccinated.
                    </p>

                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={38}
                    onClick={() => activeIndex.indexOf(38) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 38]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 38))}
                  >
                    <Icon name='dropdown' />
                    If I get a COVID-19 vaccine, will it cause me to test positive for COVID-19?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(38) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      You will not test positive on a <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/testing/diagnostic-testing.html" target="_blank" rel="noopener noreferrer"> viral test </a>
                      i.e. a swab or saliva test. These tests check for a current COVID-19 infection. Since the vaccines do not contain SARS-CoV-2 virus cells and cannot make you sick with the disease, you will not get a positive test after the vaccine.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      It is possible that you could get a positive <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/testing/serology-overview.html" target="_blank" rel="noopener noreferrer"> antibody (serological) test </a>
                      after receiving one or two doses of a COVID-19 vaccine. This type of tests checks for antibodies against SARS-CoV-2, which your body’s immune system produces to fight off an infection or in response to a vaccine.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      If you are concerned about a positive test result and unsure how to protect yourself and others, speak with your healthcare provider.
                    </p>
                  </Accordion.Content>



                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={19}
                    onClick={() => activeIndex.indexOf(19) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 19]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 19))}
                  >
                    <Icon name='dropdown' />
                    What side effects can I expect after I get the COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(19) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      The <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/expect/after.html" target="_blank" rel="noopener noreferrer"> side effects </a> of the approved vaccines are similar to typical side effects you might experience after getting other vaccines.
                      Common side effects people report are: a sore arm where you got the vaccine, tiredness, headaches, and muscle pain. Other side effects reported in some of the clinical trials include chills, joint pain, and fever. Most people reported that these lasted a day or less.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      For the approved two-dose vaccines, more people experienced side effects after the second dose than after the first dose. These side effects mean that your immune system is working to protect you against COVID-19, and that is a good sign.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      More data on the types of side effects and reactions experienced by participants in the vaccine trials can be found <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/vaccines/covid-19/info-by-product/pfizer/reactogenicity.html" target="_blank" rel="noopener noreferrer"> here </a>
                      for the Pfizer-BioNTech vaccine,<a style={{ color: "#397AB9" }} href="https://www.cdc.gov/vaccines/covid-19/info-by-product/moderna/reactogenicity.html" target="_blank" rel="noopener noreferrer"> here </a> for the Moderna vaccine, and
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/vaccines/covid-19/info-by-product/janssen/reactogenicity.html" target="_blank" rel="noopener noreferrer"> here </a>for the Johnson & Johnson vaccine.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      You may see some rumors about untrue side effects online or on social media. Make sure any time you see a claim about a side effect that you carefully check the source of that claim. Some trustworthy sources are:
                    </p>
                    <ul style={{ paddingLeft: '6rem', fontSize: '14pt', lineHeight: '1.5' }}>
                      <li>
                        <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/index.html" target="_blank" rel="noopener noreferrer"> CDC website </a>
                      </li>
                      <li>
                        <a style={{ color: "#397AB9" }} href="https://www.mayoclinic.org/coronavirus-covid-19/vaccine" target="_blank" rel="noopener noreferrer"> Mayo Clinic website </a>
                      </li>
                      <li>
                        Your local Department of Health website
                      </li>
                    </ul>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={20}
                    onClick={() => activeIndex.indexOf(20) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 20]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 20))}
                  >
                    <Icon name='dropdown' />
                    Is there a risk of an allergic reaction to the COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(20) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      As for any vaccine there is a very small chance of a severe allergic reaction. These are very rare but, when they do happen, they usually happen in people who have a history of severe allergic reactions. There are reports that a small number of people have had serious
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety/allergic-reaction.html" target="_blank" rel="noopener noreferrer"> allergic reactions </a> after getting a COVID-19 vaccine.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      A severe allergic reaction will usually happen within a few minutes to an hour after getting vaccinated. Your healthcare provider may ask you to stay at the place where you received your vaccine for a short time so that they can make sure you are safe when you leave.
                      This is particularly important if you have had allergic reactions in the past. If you have had an allergic reaction to a vaccine in the past, you should let your healthcare provider know ahead of time. Signs of a severe allergic reaction can include:
                    </p>
                    <ul style={{ paddingLeft: '6rem', fontSize: '14pt', lineHeight: '1.5' }}>
                      <li>Difficulty breathing</li>
                      <li>Swelling of your face and throat</li>
                      <li>A fast heartbeat</li>
                      <li>A bad rash all over your body</li>
                      <li>Dizziness and weakness</li>
                    </ul>
                    <p style={{ paddingTop: '0rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      Some people have reported less severe allergic reactions within 4 hours after getting vaccinated (known as an “immediate allergic reaction”). Symptoms of this type of reaction include:
                    </p>
                    <ul style={{ paddingLeft: '6rem', fontSize: '14pt', lineHeight: '1.5' }}>
                      <li>Hives</li>
                      <li>Swelling</li>
                      <li>Wheezing</li>
                    </ul>
                    <p style={{ paddingTop: '0rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      If you experience any of these symptoms after vaccination, tell your provider. They will be prepared and will be able to give you the care and advice that you need to resolve the allergic reaction.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      If you experienced any kind of allergic reaction after getting the first dose of a COVID-19 vaccine, you should not get the second dose. If you have had an allergic reaction to any of the ingredients in one of the COVID-19 vaccines,
                      you should not get these vaccines. In either case, you should let your healthcare provider know and report this reaction.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={21}
                    onClick={() => activeIndex.indexOf(21) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 21]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 21))}
                  >
                    <Icon name='dropdown' />
                    How can I report any side effects or allergic reactions I have to a COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(21) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      You can report any possible side effects to CDC through the <a style={{ color: "#397AB9" }} href="https://vaers.hhs.gov/reportevent.html" target="_blank" rel="noopener noreferrer"> Vaccine Adverse Event Reporting System </a>.
                      This is a national system that helps CDC monitor the safety of approved vaccines, including the COVID-19 vaccines. Ensuring that vaccines are safe is a top priority for CDC and the Food and Drug Administration (FDA).
                      Vaccine Adverse Event Reporting System data helps scientists to look for side effects or reactions that are unexpected, more frequent than expected, or unusual. You can learn more about vaccine side effects and how they are monitored
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/vaccinesafety/ensuringsafety/sideeffects/index.html" target="_blank" rel="noopener noreferrer"> here </a>.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', marginBottom: '0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      Healthcare providers are required to report certain reactions and side effects following vaccination to the Vaccine Adverse Event Reporting System. They must follow certain requirements relating to any safety issues
                      while the vaccines are being used under the Food and Drug Administration’s Emergency Use Authorization; these requirements are posted on their
                      <a style={{ color: "#397AB9" }} href="https://www.fda.gov/emergency-preparedness-and-response/mcm-legal-regulatory-and-policy-framework/emergency-use-authorization" target="_blank" rel="noopener noreferrer"> website </a>.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      CDC is also using a new smartphone-based tool called <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety/vsafe.html" target="_blank" rel="noopener noreferrer"> <b>v-safe</b> </a>
                      to check-in on people’s health after they receive a COVID-19 vaccine. When you receive your vaccine, you should also receive a <b>v-safe</b> information sheet telling you how to enroll in <b>v-safe</b>. If you enroll,
                      you will receive regular text messages for surveys where you can report any problems, side effects, or reactions you have after your vaccine. This tool does not track you or your location, and only records information that you directly give to it.
                      By using <b>v-safe</b>, you can help scientists gather even more information about vaccine safety, and you could be helping your community stay safe.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={22}
                    onClick={() => activeIndex.indexOf(22) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 22]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 22))}
                  >
                    <Icon name='dropdown' />
                    Who should <u>not</u> get the COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(22) > 0}>
                    <p>
                      Anyone who has had a serious allergic reaction to an ingredient in one of the COVID-19 vaccines should not get the vaccine. Similarly, anyone who has a serious allergic reaction to the first dose of a COVID-19 vaccine should not get the second dose.
                      You can find a list of the ingredients for the vaccines <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/144414/download" target="_blank" rel="noopener noreferrer"> here</a>,<a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/144638/download" target="_blank" rel="noopener noreferrer"> here</a>,
                      and <a style={{ color: "#397AB9" }} href="https://www.fda.gov/media/146305/download" target="_blank" rel="noopener noreferrer"> here</a>.
                      If you are not sure whether this applies to you, check with your healthcare provider.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={23}
                    onClick={() => activeIndex.indexOf(23) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 23]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 23))}
                  >
                    <Icon name='dropdown' />
                    I have allergies - can I still get the COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(23) > 0}>
                    <p style={{ marginBottom: 0 }}>
                      If you have had allergic reactions to other vaccines or injectable treatments in the past, you should check with your healthcare provider whether you can get the COVID-19 vaccine.
                    </p>

                    <p style={{ paddingTop: '1rem', paddingLeft: '0rem', paddingRight: '1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify' }}>
                      If you have allergies to other medications or to substances (including pets, foods, latex, pollen…), CDC still recommends that you
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety/allergic-reaction.html" target="_blank" rel="noopener noreferrer"> get vaccinated </a>.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={24}
                    onClick={() => activeIndex.indexOf(24) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 24]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 24))}
                  >
                    <Icon name='dropdown' />
                    I have a medical condition - can I still get the COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(24) > 0}>
                    <p>
                      This depends on your medical condition; in most cases you will still be eligible to get the COVID-19 vaccine. None of the approved COVID-19 vaccines have specific
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/underlying-conditions.html" target="_blank" rel="noopener noreferrer"> restrictions </a>
                      based on medical conditions. However, if you have concerns about whether a vaccine is right for you, you should speak with your healthcare provider.
                      They can answer your questions and advise you based on your risk factors, your medical condition, and your risks of getting COVID-19.
                    </p>
                  </Accordion.Content>





                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={36}
                    onClick={() => activeIndex.indexOf(36) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 36]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 36))}
                  >
                    <Icon name='dropdown' />
                    Can I get other vaccines at the same time as a COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(36) > 0}>
                    <p>
                      Yes. As more people have gotten vaccinated, we have evidence that shows that the body’s reaction to the COVID-19 vaccine is similar whether it is received alone or at the same time as other vaccines. There is
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/expect.html" target="_blank" rel="noopener noreferrer"> no evidence </a> that you need to wait at least 14 days between a COVID-19 vaccine and other vaccines.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={28}
                    onClick={() => activeIndex.indexOf(28) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 28]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 28))}
                  >
                    <Icon name='dropdown' />
                    What do I do to protect myself while I wait to get vaccinated against COVID-19?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(28) > 0}>
                    You can continue taking the same precautions CDC recommends to protect yourself and others from COVID-19. This includes washing your hands, wearing a face covering, maintaining a physical distance of at least 6 feet from others, and limiting gathering in groups.
                  </Accordion.Content>



                  {/* <Accordion.Title style={{fontSize:'15pt', color: 'black'}}
          // active={activeIndex === 0}
          index={29}
          onClick={() => activeIndex.indexOf(29) < 0 ? setActiveIndex(activeIndex =>[...activeIndex, 29]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 29))}
        >
          <Icon name='dropdown' />
        Why are some people getting the COVID-19 vaccine first?
        </Accordion.Title>
        <Accordion.Content style={{fontSize:'14pt'}}
          active={activeIndex.indexOf(29)>0}>
          <p style={{marginBottom:0}}>
        Because there are limited doses of the vaccine at this point, vaccination efforts are 
        <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations.html" target="_blank" rel="noopener noreferrer"> prioritizing </a> 
        people based on:
        </p>
        <ul style={{paddingLeft:'6rem', fontSize:'14pt', lineHeight:'1.5'}}>
        <li>Decreasing death and serious disease as much as possible</li>
        <li>Protecting our essential services and essential workers as much as possible </li>
        <li>Reducing the extra burden of COVID-19 on people already facing disparities</li>
        </ul>
        <p style={{paddingLeft:'0rem', paddingRight:'1rem', marginBottom: 0, fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        This means that those who have the highest risks of being exposed to COVID-19 or the highest risks of getting seriously ill if they become infected with COVID-19 are being vaccinated first. 
        For Phase 1a, the first phase, this means vaccinating healthcare workers and residents of long-term care facilities. The second phase (“Phase 1b”) focuses on frontline essential workers 
        and people aged 75 and over. During the third phase (“Phase 1c”), the following groups are also eligible: essential workers, people aged 65-74, and people aged 16-64 who have other medical conditions 
        that put them at risk for serious complications from COVID-19.
        </p>

        <p style={{paddingTop:'1rem', paddingLeft:'0rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        These decisions were made by the
        <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations-process.html" target="_blank" rel="noopener noreferrer"> Advisory Committee on Immunization Practices </a> 
        and are based on recommendations by, among others, the
        <a style ={{color: "#397AB9"}} href="https://www.nap.edu/catalog/25917/framework-for-equitable-allocation-of-covid-19-vaccine" target="_blank" rel="noopener noreferrer"> National Academies of Sciences, Engineering, and Medicine </a> 
        </p>
        </Accordion.Content> */}

                  <center> <Waypoint
                    onEnter={() => {
                      setActiveCharacter('Getting Vaccinated')
                      //console.log(activeCharacter)
                    }}>
                  </Waypoint>
                  </center>

                  {/* <Accordion.Title style={{fontSize:'15pt', color: 'black'}}
          // active={activeIndex === 0}
          index={30}
          onClick={() => activeIndex.indexOf(30) < 0 ? setActiveIndex(activeIndex =>[...activeIndex, 30]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 30))}
        >
          <Icon name='dropdown' />
        When can I get a COVID-19 vaccine?
        </Accordion.Title>
        <Accordion.Content style={{fontSize:'14pt'}}
          active={activeIndex.indexOf(30)>0}>
          <p>
        Since doses of the available vaccines continue to be limited at this point, certain groups are being prioritized, for example healthcare workers and residents in long-term care facilities, older age groups, and adults with some medical conditions. You can find out more about what groups of people are currently eligible 
        to be vaccinated in your state by accessing your state’s Department of Health website.
        </p>
        </Accordion.Content> */}




                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={29}
                    onClick={() => activeIndex.indexOf(29) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 29]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 29))}
                  >
                    <Icon name='dropdown' />
                    Do I need a COVID-19 vaccine booster?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(29) > 0}>
                    <p>
                      At this time, a vaccine booster is not <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/booster-shot.html" target="_blank" rel="noopener noreferrer"> recommended</a> by CDC or by the Advisory Council on Immunization Practices (ACIP) or authorized by the FDA. This may change as more evidence and data are collected from ongoing studies about long-term immunity against COVID-19 disease after vaccination.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title id="after" style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={41}
                    onClick={() => activeIndex.indexOf(41) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 41]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 41))}
                  >
                    <Icon name='dropdown' />
                    Do I need an additional dose of a COVID-19 vaccine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(41) > 0}>
                    <p>
                      <p>
                        For most people, no. It depends on your health condition and on the vaccine you received.
                      </p>
                      <p>
                        <a style={{ color: "#397AB9" }} href="https://www.fda.gov/news-events/press-announcements/coronavirus-covid-19-update-fda-authorizes-additional-vaccine-dose-certain-immunocompromised" target="_blank" rel="noopener noreferrer"> The FDA</a> reviewed data from several studies that looked at immunity to COVID-19 after vaccination among people with weakened immune systems (for example, due to a medical condition or if you are taking certain medications that weaken the immune system). The data from those studies show that the two doses were, in some cases, not enough to build a high level of immunity against the virus that causes COVID-19. They also showed that even if they are fully vaccinated, some immunocompromised people who get COVID-19 are more likely to transmit the virus to others and to get seriously sick from the virus. Therefore, <a style={{ color: "#397AB9" }} href="(https://www.cdc.gov/coronavirus/2019-ncov/vaccines/expect.html" target="_blank" rel="noopener noreferrer"> the FDA authorized</a> a 3rd shot of one of the mRNA vaccines (Pfizer-BioNTech or Moderna) for people with seriously or moderately suppressed immune systems. CDC now <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/immuno.html" target="_blank" rel="noopener noreferrer"> recommends</a> this third dose in certain cases.
                      </p>
                      <p>
                        If you have a condition or are taking medication that <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/immuno.html" target="_blank" rel="noopener noreferrer"> suppresses the immune system</a>, you should speak with your healthcare provider about getting a 3rd dose of the mRNA vaccine you have received previously (meaning, for example, that if you received Moderna, you should get a 3rd dose of Moderna). If you are receiving a 3rd dose, this should happen at least 4 weeks after your 2nd dose.
                      </p>
                      <p>
                        A 3rd dose is not recommended or authorized for any other group at this time.
                      </p>
                    </p>
                  </Accordion.Content>

                  <Accordion.Title id="get" style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={13}
                    onClick={() => activeIndex.indexOf(13) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 13]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 13))}
                  >
                    <Icon name='dropdown' />
                    Do I have to pay to get vaccinated against COVID-19?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(13) > 0}>
                    <p>
                      No. Vaccines against COVID-19 are available to everyone for <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/no-cost.html" target="_blank" rel="noopener noreferrer"> free </a>. The federal government will cover the cost of the COVID-19 vaccine and of its administration by a healthcare provider. A provider cannot charge you an office visit fee, or a fee to give you the vaccine, if the only service you get at that visit is the COVID-19 vaccine. If you have health insurance, this will cover these fees since this vaccine is recommended by the Advisory Committee on Immunization Practices. If you do not have health insurance, your provider can still be reimbursed. You cannot be charged for these fees. Vaccine providers can get reimbursed for costs associated with <a style={{ color: "#397AB9" }} href="https://www.hrsa.gov/coviduninsuredclaim" target="_blank" rel="noopener noreferrer">vaccinated uninsured people</a>.
                    </p>
                  </Accordion.Content>
                </Accordion>
              </div>





              <div style={{ height: 5 }}></div>
              <Header as='h2' style={{ fontWeight: 600 }}>
                <Header.Content>
                  After You Are Vaccinated
                </Header.Content>
              </Header>

              <center> <Waypoint
                onEnter={() => {
                  setActiveCharacter('After You Are Vaccinated')
                  //console.log(activeCharacter)
                }}>
              </Waypoint>
              </center>


              <div style={{ paddingLeft: '2rem', paddingBottom: '0rem' }}>
                <Accordion fluid styled exclusive={false}>
                  <Accordion.Title style={{ fontSize: '15pt', color: 'black', lineHeight: '1.4' }}
                    // active={activeIndex === 0}
                    index={32}
                    onClick={() => activeIndex.indexOf(32) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 32]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 32))}
                  >
                    <Icon name='dropdown' />
                    After I am fully vaccinated against COVID-19, do I still have to take other preventive measures?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(32) > 0}>
                    <p>
                      Yes.
                      <a style={{ color: "#397AB9" }} href="https://covid19.emory.edu/_nation" target="_blank" rel="noopener noreferrer"> COVID-19 transmission </a>
                      is very high in communities across the United States right now and the Delta variant transmits more easily from person to person. As such, CDC still recommends continuing to physically distance, wear a face covering, limit gatherings, and wash your hands thoroughly even once you are vaccinated, including after receiving both doses for the two-dose vaccines. Even though increasing numbers of people across the United States are fully vaccinated as the pandemic changes and transmission remains high, it is important that people continue to follow these precautions. The vaccine is the first part in a “one-two punch” that also includes physical distancing, wearing a mask, washing your hands regularly, and staying away from large gatherings.
                    </p>
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black' }}
                    // active={activeIndex === 0}
                    index={33}
                    onClick={() => activeIndex.indexOf(33) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 33]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 33))}
                  >
                    <Icon name='dropdown' />
                    After I am fully vaccinated, do I still need to quarantine if I am exposed to COVID-19?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(33) > 0}>
                    <p>
                      You may not need to quarantine, but it depends on your situation. Currently, COVID-19 recommendations
                      are that you should wear a mask indoors in public for 14 days after you are exposed or until you get a negative COVID-19 test. You should also get tested 3-5 days after your exposure, even if you do not have any symptoms. If your test is positive, you should isolate for 10 days.
                    </p>
                    {/* <ol style={{ paddingLeft: '4rem', lineHeight: "150%" }}>
                      <li>
                        You have been fully vaccinated (received both shots if the COVID-19 vaccine you are getting is a two-dose vaccine) more than 2 weeks ago
                      </li>
                      <li>
                        You received your last COVID-19 vaccine less than 3 months ago
                      </li>
                      <li>
                        AND you do not have any symptoms of COVID-19 since you were exposed.
                      </li>
                    </ol>
                    <p>
                      Transmission of COVID-19 is very high across the country so CDC still recommends quarantining if you are exposed through a close contact and do not meet all 3 of these conditions.
                    </p> */}
                  </Accordion.Content>


                  <Accordion.Title style={{ fontSize: '15pt', color: 'black', lineHeight: '1.4' }}
                    // active={activeIndex === 0}
                    index={45}
                    onClick={() => activeIndex.indexOf(45) < 0 ? setActiveIndex(activeIndex => [...activeIndex, 45]) : setActiveIndex(activeIndex => activeIndex.filter(item => item !== 45))}
                  >
                    <Icon name='dropdown' />
                    If I travel after I am fully vaccinated, do I still need to wear a mask or quarantine?
                  </Accordion.Title>
                  <Accordion.Content style={{ fontSize: '14pt' }}
                    active={activeIndex.indexOf(45) > 0}>
                    <p>
                      <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/travelers/face-masks-public-transportation.html" target="_blank" rel="noopener noreferrer">Federal regulations</a> do require wearing a mask for anyone traveling on any form of public transport, regardless of vaccination status. This includes: bus, plane, train, subways, taxis, ride-shares, boats, ships, trolleys, and cable cars. It also includes school buses and indoor transportation hubs such as airports, train stations, and subways stations.
                    </p>
                    <p>
                      If you are <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/travelers/travel-during-covid19.html" target="_blank" rel="noopener noreferrer">traveling within the United States</a>, you do not need to get tested before or after traveling or to quarantine after travel. You should still monitor your health for any symptoms after travel and follow testing and isolation guidance as appropriate.
                    </p>
                    <p>
                      If you are traveling <a style={{ color: "#397AB9" }} href="https://www.cdc.gov/coronavirus/2019-ncov/travelers/map-and-travel-notices.html" target="_blank" rel="noopener noreferrer">outside the United States</a>, you should check the situation at your destination to fully understand the regulations about masking, quarantine, and testing. They may be different from regulations within the United States.
                    </p>
                  </Accordion.Content>
                </Accordion>
              </div>


              <div id="after" style={{ height: 20 }}></div>
              <Header as='h2' style={{ fontWeight: 600 }}>
                Reviewed by
              </Header>

              <p style={{ fontSize: '14pt', paddingLeft: '0rem' }}>
                Robert A. Bednarczyk, PhD (Assistant Professor, Emory University Rollins School of Public Health) <br />
                Vincent Marconi, MD (Professor, Emory University School of Medicine, Division of Infectious Diseases; Emory University Rollins School of Public Health) <br />
                Maria Sundaram, MSPH, PhD (Postdoctoral Fellow, ICES/ University of Toronto Dalla Lana School of Public Health <br />
                Henry M. Wu, MD (Associate Professor, Emory University School of Medicine, Division of Infectious Diseases)
              </p>


            </div>
          </Grid.Column>
          {/* <Notes /> */}
        </Grid>
      </Container>

    </div>
  );
}
