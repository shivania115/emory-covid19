import AppBar from './AppBar';
import Notes from './Notes';
import { useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react'

import { Container, Grid, List, Divider, Image, Breadcrumb, Header, Segment } from 'semantic-ui-react'

export default function AboutUs(props){
  const history = useHistory();
  let {blogTitle} = useParams();

  return (
    <div>
    <AppBar/>


    {blogTitle == "swNativeAmericanCommunities"&&
      <Container style={{marginTop: "8em", minWidth: '1260px'}}>

      <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt"}}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
            <Breadcrumb.Section active>Blog</Breadcrumb.Section>
      </Breadcrumb>
        <div width = {888}>
        
            <Header style={{width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400}}>
              <Header.Content>
                COVID-19 in SW Native American Communities

                <Header.Subheader style={{fontSize: "18pt", fontWeight: 300, paddingTop: "15px"}}>
                This blog provides an update to our July 14th video, “COVID-19 in SW Native American Communities.” What do state maps look like now?

                </Header.Subheader>
                <div style = {{paddingTop: 10}}>
                       <Image width='600' height='350' href = '/media-hub/blog/swNativeAmericanCommunities' src='/blog images/swna/Image 7.png' />            

                </div>

                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <p style={{textAlign:"left", fontWeight: 300}}>

                      By Leanna Ehrlich, published on October 1, 2020  &nbsp;&nbsp; |  &nbsp;&nbsp; 2-minute read

                      <br/>
                      Contributors: K.M. Venkat Narayan, Shivani A. Patel
                      <br/>
                      From Emory University

                      <br/>

                      </p>

                      <br/>

                      <b> This topic was first covered in the July 14th video “COVID-19 in SW Native American Communities” </b>
                      <br/>
                      <br/>
                        <iframe width="700" height="400" src="https://www.youtube.com/embed/U-Aqx7vQocY" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                      <br/>
                      <br/>
                      <br/>

                      COVID-19 is affecting every community differently. The COVID-19 Health Equity Dashboard 
                      compiles publicly available data from across the United States to track COVID-19 infections 
                      and deaths across counties while considering demographic, social, and economic context.  

                
                      <br/>
                      <br/>
                      <br/>

                      Since COVID-19 coronavirus epidemic took off in the United States in 2020, data continue 
                      to show that Native Americans, particularly in the Southwest, are disproportionately 
                      impacted by infection and death. Contributing factors may include high rates of poverty 
                      and chronic disease, lack of critical infrastructure like running water, isolation from 
                      health resources, crowded and multigenerational living conditions, and close-knit community 
                      support systems.
                      
                      <br/>
                      <br/>
                      <br/>

                      Despite many of these Native American communities being located in rural areas, 
                      the low population density has not had a protective effect against infection as seen 
                      elsewhere in the country. The COVID-19 fatality rate (meaning the percentage of people 
                      who test positive who have died) in the state of Arizona is 2.5 percent [1], whereas in 
                      Navajo Nation (located primarily in Arizona as well as the other Four Corners states), 
                      it is 5.3 percent [2].


                      
                      <br/>
                      <br/>
                      <br/>

                      Looking at county comparisons on the COVID-19 Health Equity Dashboard, we can find visual 
                      representations of these statistics across many states.


                      <br/>
                      <br/>
                      <br/>

                      To start visualizing, click on the tab “Map State.” By selecting a state and selecting 
                      “Total COVID-19 Deaths per 100,000” under “COVID-19 Outcome Measure,” and then selecting 
                      “% Native American” in “COVID-19 County Population Characteristics,” you can map these 
                      relationships. Deaths per 100,000 (left) track with the Native American population (right) 
                      in Arizona. So do poverty, diabetes, and socioeconomic vulnerability. 

                      <br/>
                      <br/>
                      <br/>

                      <center>      <Image width='850' height='450' src='/blog images/swna/Image 8.png' /> </center>

                      <br/>
                      <br/>
                      <br/>

                      <center>      <Image width='850' height='450' src='/blog images/swna/Image 9.png' /> </center>


                      <br/>
                      <br/>
                      <br/>

                      <center>      <Image width='850' height='450' src='/blog images/swna/Image 10.png' /> </center>


                      <br/>
                      <br/>
                      <br/>

                      <center>      <Image width='850' height='450' src='/blog images/swna/Image 11.png' /> </center>

                      <br/>
                      <br/>
                      <br/>
                      
                      Cases per 100,000 track with minority/language vulnerability.
                      
                      <br/>
                      <br/>
                      <br/>

                      <center>      <Image width='850' height='450' src='/blog images/swna/Image 12.png' /> </center>

                      
                      <br/>
                      <br/>
                      <br/>

                      Directly east, in New Mexico, we see a similar pattern, although the case and 
                      death rate is lower overall. Deaths per 100,000 tracks with the Native American 
                      population, and lack of insurance tracks with cases per 100,000.

                      <br/>
                      <br/>
                      <br/>

                      <center>      <Image width='850' height='450' src='/blog images/swna/Image 13.png' /> </center>

                      <br/>
                      <br/>
                      <br/>

                      <center>      <Image width='850' height='450' src='/blog images/swna/Image 14.png' /> </center>


                  
                      <br/>
                      <br/>
                      <br/>

                      Two articles in the New England Journal of Medicine explore this issue: 
                      <a href = "https://www.nejm.org/doi/full/10.1056/NEJMp2012114?query=TOC" target="_blank" rel="noopener noreferrer">“Rural Matters — Coronavirus and the Navajo Nation,” </a>
                      and <a href = "https://www.nejm.org/doi/full/10.1056/NEJMc2023540?query=TOC" target="_blank" rel="noopener noreferrer">“Contact Tracing for Native Americans in Rural Arizona.” </a>

                      <br/>
                      <br/>
                      <br/>

                      We encourage you to read more and think about the systemic issues that are 
                      leading to severe COVID-19 outcomes in Native American communities. 

                      <br/>
                      <br/>
                      <br/>


                      <b> References: </b>
                      <br/>
                      1. <a href="https://www.azdhs.gov/preparedness/epidemiology-disease-control/infectious-disease-epidemiology/covid-19/dashboards/" target="_blank" rel="noopener noreferrer"> https://www.azdhs.gov/preparedness/epidemiology-disease-control/infectious-disease-epidemiology/covid-19/dashboards/ </a>
                      <br/>
                      2. <a href="https://navajotimes.com/coronavirus-updates/covid-19-across-the-navajo-nation/" target="_blank" rel="noopener noreferrer">https://navajotimes.com/coronavirus-updates/covid-19-across-the-navajo-nation/ </a>


                </Header>

              </Header.Content>
            </Header>
  
          
        </div>
        <Notes />

      </Container>
    }



    {blogTitle == "africanAmericanCommunity"&&
      <Container style={{marginTop: "8em", minWidth: '1260px'}}>

      <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt"}}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
            <Breadcrumb.Section active>Blog</Breadcrumb.Section>
      </Breadcrumb>
        <div width = {888}>
        
            <Header style={{width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400}}>
              <Header.Content>
                COVID-19 in African American Communities

                <Header.Subheader style={{fontSize: "18pt", fontWeight: 300, paddingTop: "15px"}}>
                This blog provides an update to our July 9th video, “COVID-19 in African American Communities.” What do state maps look like now?



                </Header.Subheader>
                <div style = {{paddingTop: 10}}>
                       <Image width='600' height='350' href = '/media-hub/blog/africanAmericanCommunity' src='/blog images/aac/Image 1.png' />            

                </div>

                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <p style={{textAlign:"left", fontWeight: 300}}>

                      By Leanna Ehrlich, published on Sep. 30, 2020  &nbsp;&nbsp; |  &nbsp;&nbsp; 2-minute read

                      <br/>
                      Contributors: K.M. Venkat Narayan, Shivani A. Patel
                      <br/>
                      From Emory University

                      <br/>

                      </p>

                      <br/>

                      <b> This topic was first covered in the July 9th video “COVID-19 in African American Communities” </b>
                      <br/>
                      <br/>
                        <iframe width="700" height="400" src="https://www.youtube.com/embed/0eFjhnDQe6g" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                      <br/>
                      <br/>
                      <br/>
                      COVID-19 is affecting every community differently. The COVID-19 Health Equity Dashboard compiles publicly 
                      available data from across the United States to track COVID-19 infections and deaths across 
                      counties while considering demographic, social, and economic context.
                
                      <br/>
                      <br/>
                      <br/>

                      Since COVID-19 coronavirus epidemic took off in the United States in 2020, data continue 
                      to show that African Americans are disproportionately impacted by infection and death. 
                      In the US, African Americans have contracted COVID-19 at 2.6 times the rate of white 
                      non-Hispanic people, are hospitalized at 4.7 times the rate, and die at 2.1 times the 
                      rate [1]. Per 100,000, 88 African Americans have died versus 40 white Americans. African 
                      Americans have the highest rate of death of any racial or ethnic group in the United States [2]. 
                      At a community-level, this manifests  as a striking visual correlation between the proportion 
                      of a county that is African American and its per capita cases of COVID-19.


                      <br/>
                      <br/>
                      <br/>

                      <center>      <Image width='850' height='450' src='/blog images/aac/Image 2.png' /> </center>

                      <br/>
                      <br/>
                      <br/>

                      Looking at county comparisons on the COVID-19 Health Equity Dashboard, 
                      we can find visual representations of these statistics across many states.

                      <br/>
                      <br/>
                      <br/>

                      To start visualizing, click on the tab “Map State.” By selecting a state and selecting 
                      “Total COVID-19 Cases per 100,000” under “COVID-19 Outcome Measure,” and then selecting 
                      “% African American” in “COVID-19 County Population Characteristics,” you can map these 
                      relationships. Cases per 100,000 (left) track with the African American population (right) 
                      in places like Florida, Mississippi, Tennessee, and Virginia.

                      <br/>
                      <br/>
                      <br/>


                      <b> FLORIDA: </b>
                      <center>      <Image width='800' height='500' src='/blog images/aac/Image 3.png' /> </center>
                      
                      <br/>
                      <br/>
                      <br/>

                      <b> MISSISSIPPI: </b>
                      <center>      <Image width='800' height='500' src='/blog images/aac/Image 4.png' /> </center>
                      
                      <br/>
                      <br/>
                      <br/>

                      <b> TENNESSEE: </b>
                      <center>      <Image width='800' height='500' src='/blog images/aac/Image 5.png' /> </center>
                      
                      <br/>
                      <br/>
                      <br/>

                      <b> VIRGINIA: </b>
                      <center>      <Image width='800' height='500' src='/blog images/aac/Image 6.png' /> </center>
                      
                      <br/>
                      <br/>
                      <br/>

                      <b> References: </b>
                      <br/>
                      1. <a href="https://www.cdc.gov/coronavirus/2019-ncov/covid-data/investigations-discovery/hospitalization-death-by-race-ethnicity.html" target="_blank" rel="noopener noreferrer"> https://www.cdc.gov/coronavirus/2019-ncov/covid-data/investigations-discovery/hospitalization-death-by-race-ethnicity.html </a>
                      <br/>
                      2. <a href="https://www.apmresearchlab.org/covid/deaths-by-race#counts" target="_blank" rel="noopener noreferrer">https://www.apmresearchlab.org/covid/deaths-by-race#counts </a>


                </Header>

              </Header.Content>
            </Header>
  
          
        </div>
        <Notes />

      </Container>
    }






    {blogTitle == "underlyingConditions"&&
      <Container style={{marginTop: "8em", minWidth: '1260px'}}>

      <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt"}}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
            <Breadcrumb.Section active>Blog</Breadcrumb.Section>
      </Breadcrumb>
        <div width = {888}>
        
            <Header style={{width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400}}>
              <Header.Content>
                COVID-19 and Underlying Conditions
                <Header.Subheader style={{fontSize: "18pt", fontWeight: 300, paddingTop: "15px"}}>
                This blog provides an update to our July 1st video, “COVID-19 and Underlying Conditions.” What do state maps look like now?



                </Header.Subheader>
                <div style = {{paddingTop: 10}}>
                       <Image width='600' height='350' href = '/media-hub/blog/underlyingConditions' src='/blog images/underlying/underlying_1.png' />            

                </div>

                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <p style={{textAlign:"left", fontWeight: 300}}>

                      By Leanna Ehrlich, published on Sep. 28, 2020  &nbsp;&nbsp; |  &nbsp;&nbsp; 2-minute read

                      <br/>
                      Contributors: K.M. Venkat Narayan, Shivani A. Patel
                      <br/>
                      From Emory University

                      <br/>

                      </p>

                      <br/>

                      <b> This topic was first covered in the July 1st video “COVID-19 and Underlying Conditions” </b>
                      <br/>
                      <br/>
                        <iframe width="700" height="400" src="https://www.youtube.com/embed/2lWS3LGZUFU" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                      <br/>
                      <br/>
                      <br/>
                      COVID-19 is affecting every community differently. The COVID-19 Health Equity Dashboard compiles publicly 
                      available data from across the United States to track COVID-19 infections and deaths across counties 
                      while considering demographic, social, and economic context. 
                
                      <br/>
                      <br/>
                      <br/>

                      There are a lot of underlying conditions that may predispose certain people to develop severe COVID-19 
                      infection and be at a higher risk of hospitalization and death. These include having underlying health 
                      conditions like obesity and diabetes, and being over 65 years old. Since COVID-19 coronavirus epidemic 
                      took off in the United States in 2020, data continue to show that people with underlying conditions are 
                      disproportionately impacted by infection and death. 

                      <br/>
                      <br/>
                      <br/>

                      42% of US adults have obesity, and data shows that especially among adults under age 60 and who are male, 
                      obesity leads to higher mortality among those with COVID-19 [1]. Due to the impact of obesity on the 
                      immune systems, individuals with obesity may also be more susceptible to COVID-19 infection in the first place. 
                      <br/>
                      <br/>
                      <br/>

                      Looking at county comparisons on the COVID-19 Health Equity Dashboard, we can find visual representations 
                      of these statistics across many states.
                      <br/>
                      <br/>
                      <br/>

                      To start visualizing, click on the tab “Map State.” By selecting a state and selecting “Total COVID-19 
                      Cases per 100,000” under “COVID-19 Outcome Measure,” and then selecting “% Obesity” in “COVID-19 County 
                      Population Characteristics,” you can map these relationships in any state. Cases per 100,000 (left) 
                      track with obesity (right) in states like Alabama, Idaho, and Oregon.
                      <br/>
                      <br/>
                      <br/>

                      <b> ALABAMA: </b>
                      <center>      <Image width='800' height='500' src='/blog images/underlying/underlying_2.png' /> </center>
                      
                      <br/>
                      <br/>
                      <br/>

                      <b> IDAHO: </b>
                      <center>      <Image width='800' height='500' src='/blog images/underlying/underlying_3.png' /> </center>
                      
                      <br/>
                      <br/>
                      <br/>

                      <b> OREGON: </b>
                      <center>      <Image width='800' height='500' src='/blog images/underlying/underlying_4.png' /> </center>
                      
                      <br/>
                      <br/>
                      <br/>

                      Diabetes is another risk factor for COVID-19 complications. Over 10% of the US population has Type II diabetes, 
                      and data shows that having Type II diabetes increases the risk of having serious complications from COVID-19 - 
                      including death while hospitalized, based on data from the UK [2].
                      <br/>
                      <br/>
                      <br/>

                      In Arizona and New Mexico, deaths per 100,000 (left) track with the percent of county residents who have diabetes (right).
                      <br/>
                      <br/>
                      <br/>

                      <b> ARIZONA: </b>
                      <center>      <Image width='800' height='500' src='/blog images/underlying/underlying_5.png' /> </center>
                      
                      <br/>
                      <br/>
                      <br/>

                      <b> NEW MEXICO: </b>
                      <center>      <Image width='800' height='500' src='/blog images/underlying/underlying_6.png' /> </center>
                      <br/>
                      <br/>
                      <br/>
                      
                      Age is also a risk factor for COVID-19 due to older individuals having less robust immune systems and 
                      higher prevalence of comorbidities. 
                      <br/>
                      <br/>
                      <br/>

                      In the United States, 15% of the population is over age 65, but 80% of COVID-19 deaths have been in 
                      people over age 65 [3]. Visually, however, this is hard to see in state maps, because older people 
                      disproportionately live in rural parts of the country, and COVID-19 disproportionately affects urban 
                      areas due to population density. The map on the left shows the US population density per county and 
                      the right shows percent of the population over 65 years old.
                      <br/>
                      <br/>
                      <br/>

                      <Grid>
                        <Grid.Row columns = {2}>
                          <Grid.Column>
                            <Image width='390' height='280' src='/blog images/underlying/underlying_7.png' />
                          </Grid.Column>
                          <Grid.Column>
                            <Image width='390' height='250' src='/blog images/underlying/underlying_8.png' />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>

                      <br/>
                      <br/>
                      <br/>

                      <b> References: </b>
                      <br/>
                      1. <a href="https://www.acpjournals.org/doi/10.7326/M20-3742" target="_blank" rel="noopener noreferrer"> https://www.acpjournals.org/doi/10.7326/M20-3742 </a>
                      <br/>
                      2. <a href="https://www.thelancet.com/journals/landia/article/PIIS2213-8587(20)30272-2/fulltext" target="_blank" rel="noopener noreferrer">https://www.thelancet.com/journals/landia/article/PIIS2213-8587(20)30272-2/fulltext </a>
                      <br/>
                      3. <a href="https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/older-adults.html#:~:text=In%20general%2C%20your%20risk%20of,aged%2065%20years%20and%20older" target="_blank" rel="noopener noreferrer"> https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/older-adults.html#:~:text=In%20general%2C%20your%20risk%20of,aged%2065%20years%20and%20older </a>


                </Header>

              </Header.Content>
            </Header>
  
          
        </div>
        <Notes />

      </Container>
    }









    {blogTitle == "Will_SARS-CoV-2_beat_the_Power_Five_Conferences"&&
      <Container style={{marginTop: "8em", minWidth: '1260px'}}>

      <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt"}}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
            <Breadcrumb.Section active>Blog</Breadcrumb.Section>
      </Breadcrumb>
        <div width = {888}>
        
            <Header style={{width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400}}>
              <Header.Content>
                Will SARS-CoV-2 beat the Power Five Conferences?
                <Header.Subheader style={{fontSize: "18pt", fontWeight: 300, paddingTop: "15px"}}>
                  Playing college football during the COVID-19 pandemic may unduly increase risk of infection, especially for African American student-athletes, our data suggest.


                </Header.Subheader>
                <div style = {{paddingTop: 10}}>
                       <Image width='600' height='350' href = '/media-hub/blog/Will_SARS-CoV-2_beat_the_Power_Five_Conferences' src='/blog images/power five/blog1cover.jpeg' />            

                </div>

                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <p style={{textAlign:"left", fontWeight: 300}}>

                      By Pooja Naik, edited on Aug. 19, 2020  &nbsp;&nbsp; |  &nbsp;&nbsp; 4-minute read

                      <br/>
                      Contributors: Leanna Ehrlich, Aditya Rao, Alka Rao, Star Liu, K.M. Venkat Narayan, Shivani A. Patel
                      <br/>
                      From Emory University

                      <br/>

                      </p>

                      <br/>


                      College football season is approaching, but the COVID-19 pandemic still looms large in the United States. 
                      The ability for colleges to pursue a 2020-2021 football season remains unclear, as it seems impossible to 
                      maintain student-athlete safety during practices and games. While some of the Power Five conferences like
                      the Big Ten and Pac-12 have switched to conference-only games, other conferences are pushing their season
                      to start late, at the end of September, or waiting until Spring 2021 to play any games. The unavoidable
                      fact remains that there is no way to maintain physical distancing between players during practices and
                      games. In the absence of a vaccine, physical distancing is the only way to prevent community spread, 
                      and this necessity clashes with the reality of college football. 
                
                      <br/>
                      <br/>
                      <br/>

                      According to <a style ={{color: "#397AB9"}} href="http://www.ncaa.org/about/resources/research/ncaa-demographics-database" target="_blank" rel="noopener noreferrer"> NCAA Demographics Database</a>, almost half of all college football players in the United States 
                      are African Americans. Meanwhile, African Americans only make up 13% of the US population as per <a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer"> American Community Survey </a>
                      by the U.S. Census Bureau. <a style ={{color: "#397AB9"}} href="https://doi.org/10.1111/pai.13271" target="_blank" rel="noopener noreferrer"> Research from Italy and Germany</a> has highlighted the heightened 
                      risk of infection posed by playing college football, a strenuous exercise makes athletes more likely to inhale 
                      virus particles to the lower areas of their lungs - putting athletes such as football players at a higher risk 
                      of infection as they share close airspace on playing fields. Therefore, playing college football is an occupational 
                      risk for COVID-19 that disproportionately falls on African American young men. 

                      <br/>
                      <br/>
                      <br/>

                      The college football scenario mirrors the disparate impact of the pandemic across American communities, 
                      <a style ={{color: "#397AB9"}} href="https://www.thedailybeast.com/coronavirus-is-hitting-black-and-hispanic-americans-way-harder-cdc-data-shows?ref=scroll" target="_blank" rel="noopener noreferrer"> with significantly higher rates of infection and death seen in many marginalized populations</a>
                      , including 
                      African Americans. Mortality rate in African Americans continue to rise and is 
                      <a style ={{color: "#397AB9"}} href="https://covidtracking.com/race" target="_blank" rel="noopener noreferrer"> 2.5 times as high as White Americans’ mortality rates. </a>
                      As communities of color grapple with higher infection rates caused by a wide 
                      range of factors, including higher participation in essential occupations and higher levels of underlying 
                      chronic disease, poverty, and constrained access to healthcare, it is important to give special consideration 
                      to the health of African American student athletes and occupational risk posed by college football season.

                      <br/>
                      <br/>

                </Header>

                                <center>      <Image width='800' height='500' src='/blog images/power five/Figure 1.png' /> </center>
                                <p style = {{marginLeft: 0, fontSize: "14pt", fontWeight: 300, lineHeight: "16pt", lineSpacing: 0}}> Figure 1: COVID-19 outcomes in all the 62 counties where conferences are located versus other counties. Data sources from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a>  </p>
                
                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>
                      <br/>

                      In order to make an informed decision about how the college football season can proceed, it is important 
                      to understand the status of COVID-19 outbreaks in the counties where the Power Five schools are located 
                      and to account for interstate travel. To find out how these counties are affected by COVID-19, we used 
                      data compiled through 
                      <a style ={{color: "#397AB9"}} href="http://covid19.emory.edu/" target="_blank" rel="noopener noreferrer"> The COVID-19 Health Equity Dashboard </a>
                      to compare the COVID-19 infections and deaths 
                      in these counties with the rest of the counties in the country (Figure 1), adjusted for population. The 
                      analysis was then repeated to investigate how per capita infections and deaths compared across counties 
                      in each of the Power Five Conferences (Figure 2).

                      <br/>
                      <br/>

                </Header>

                                <center>      <Image width='800' height='500' src='/blog images/power five/Figure 2.png' /> </center>
                                <p style = {{marginLeft: 0, fontSize: "14pt", fontWeight: 300, lineHeight: "16pt", lineSpacing: 0}}> Figure 2: COVID-19 outcomes among counties where schools in each of the Power Five Conferences are located and counties where none are located. Data sources from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a></p>

                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <br/>

                      We found that COVID-19 infection and mortality rates in the total population were much higher in counties 
                      with the Power Five Schools compared to those without. We performed a statistical test (Welch t-test) to 
                      assess whether the mean difference between COVID-19 per capita infections and deaths were due to the huge 
                      difference in the number of counties with and without D1 football teams.  

                      <br/>
                      <br/>
                      <br/>

                      Our data as of August 16, 2020 suggests that counties with the Power Five schools are more affected 
                      by COVID-19. These counties have 19% higher COVID-19 cases per capita 
                      and 12% higher COVID-19 deaths per capita than the rest of the country. Notably, the Atlantic Coast Conference 
                      (ACC) and Southeastern Conference (SEC) schools are located in the counties most affected by COVID-19. Respectively, 
                      these counties have approximately 25% and 63% more COVID-19 cases per capita than counties without the Power Five schools. 
                      The Welch t-test demonstrates that these differences are indeed statistically significant. This raises 
                      the question of whether it would be safe to bring student-athletes back to counties that are already 
                      hard-hit by COVID-19.

                      <br/>
                      <br/>
                      <br/>

                      Even if the ACC and SEC decide to play conference-only games, there is still a high risk of infection for 
                      everyone playing within the conference due to lack of social distancing and high infection rates in these 
                      counties. Nevertheless, economic implications are large; for example, a “no-go” decision from any of the 
                      three remaining powerhouse conferences could cost the city of Atlanta $100 million in expected revenue from 
                      hosting games in the first week of conference play. However, it is reckless to risk the lives of athletes to 
                      ensure the college sports’ revenue streams. With athlete scholarships tied to team membership, conferences 
                      and schools must find a balance between supporting educational opportunities for student athletes while not 
                      unduly exposing student athletes to additional risk of COVID-19 infection. And, the outcome of these decisions 
                      will have a significant impact on students of color, who make up a large share of student athletes.


                </Header>
              </Header.Content>
            </Header>
  
          
        </div>
        <Notes />

      </Container>
    }
    </div>);
}
