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

                      By Pooja Naik on Aug. 7, 2020  &nbsp;&nbsp; |  &nbsp;&nbsp; 4-minute read

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
                                <p style = {{marginLeft: 0, fontSize: "14pt", fontWeight: 300, lineHeight: "16pt", lineSpacing: 0}}> Figure 2: COVID-19 outcomes in counties where each of the Power Five Conferences is located versus other counties where none are located. Data sources from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a></p>

                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <br/>

                      We found that COVID-19 infection and mortality rates in the total population were much higher in counties 
                      with the Power Five Schools compared to those without. We performed a statistical test (Welch t-test) to 
                      assess whether the mean difference between COVID-19 per capita infections and deaths were due to the huge 
                      difference in the number of counties with and without D1 football teams.  

                      <br/>
                      <br/>
                      <br/>

                      Our data as of August 3, 2020 suggests that counties with the Power Five schools are more affected 
                      by COVID-19. These counties have 23% higher COVID-19 cases per capita 
                      and 18% higher COVID-19 deaths per capita than the rest of the country. Notably, the Atlantic Coast Conference 
                      (ACC) and Southeastern Conference (SEC) schools are located in the counties most affected by COVID-19. Respectively, 
                      these counties have approximately 27% and 52% more COVID-19 cases per capita than counties without the Power Five schools. 
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
