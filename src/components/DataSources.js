import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header, Table } from 'semantic-ui-react'

export default function DataSources(props){

  return (
    <div>
      <AppBar menu='dataSources'/>
      <Container style={{marginTop: '8em', minWidth: '1260px'}}>
        <Header as='h1' style={{paddingTop: 16, fontWeight: 400, fontSize: "24pt"}}>

          <Header.Content>
            Data Sources and Interpretation
          </Header.Content>
        </Header>
        <Table basic='very' style={{fontWeight: 400, fontSize: "14pt"}}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={3}>Measure</Table.HeaderCell>
              <Table.HeaderCell width={5}>Data Source</Table.HeaderCell>
              <Table.HeaderCell width={8}>How to Interpret</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Total COVID-19 Cases</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> The <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a> in the United States </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Total COVID-19 Cases</i> is the number of people who have tested positive for COVID-19 in each county. This database includes case counts from "both laboratory confirmed and probable cases using criteria that were developed by states and the federal government." </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Total COVID-19 Deaths</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> The <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a> in the United States  </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Total COVID-19 Deaths</i> is the number of people who have died of confirmed or presumed COVID-19 cases in each county. This database includes case counts from "both laboratory confirmed and probable cases using criteria that were developed by states and the federal government." </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Average Daily COVID-19 Cases</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> Derived from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a> in the United States </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Average Daily Cases</i> is the average number of positive cases for COVID-19 infection per county in the United States over the last seven days.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Average Daily COVID-19 Deaths</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>Derived from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a> in the United States  </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Average Daily Deaths</i> is the average number of deaths due to confirmed or presumed COVID-19 infection per county in the United States over the last seven days.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Total COVID-19 Cases per 100,000</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>Derived from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a> in the United States and <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/nchs/nvss/bridged_race.htm#Newest%20Data%20Release" target="_blank" rel="noopener noreferrer">Bridged-race population estimates </a> by The National Center for Health Statistics </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Total Cases per 100,000</i> helps us understand COVID-19 cases (people who have tested positive for COVID-19) by the population of the county per 100,000 people. 
                          <br/><br/>
                          If every county in the United States had 100,000 residents, this is how many would have COVID-19 in each county. 
                          This measurement adjusts for different counties’ populations to provide a standardized point of comparison of 
                          cases in each county.
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Total COVID-19 Deaths per 100,000</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>Derived from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a> in the United States and <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/nchs/nvss/bridged_race.htm#Newest%20Data%20Release" target="_blank" rel="noopener noreferrer">Bridged-race population estimates </a> by The National Center for Health Statistics </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Total Deaths per 100,000</i> helps us understand COVID-19 deaths by population of the county per 100,000 people. 
                            <br/><br/>
                          If every county in the United States had 100,000 residents, this is how many would have died in each county from 
                          COVID-19. This measurement adjusts for different counties’ populations to provide a standardized point of comparison 
                          of deaths in each county.
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Average Daily COVID-19 Cases per 100,000</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>Derived from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a> in the United States and <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/nchs/nvss/bridged_race.htm#Newest%20Data%20Release" target="_blank" rel="noopener noreferrer">Bridged-race population estimates </a> by The National Center for Health Statistics </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Average Daily Cases per 100,000</i> helps us understand the average number of positive cases for COVID-19 infection over the last seven days by population of the county per 100,000 people. 
                          <br/><br/>
                          If every county in the United States had 100,000 residents, this is how many would have tested positive for COVID-19 
                          over a recent 7-day period, in each county. This measurement adjusts for different counties’ populations to provide a 
                          standardized point of comparison of cases in each county.
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Average Daily COVID-19 Deaths per 100,000</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>Derived from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a> in the United States and <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/nchs/nvss/bridged_race.htm#Newest%20Data%20Release" target="_blank" rel="noopener noreferrer">Bridged-race population estimates </a> by The National Center for Health Statistics </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Average Daily Deaths per 100,000</i> helps us understand the average number of deaths due to confirmed or presumed COVID-19 infection over the last seven days by population of the county per 100,000 people. 
                          <br/><br/>
                          If every county in the United States had 100,000 residents, this is how many would have died from COVID-19 
                          over a recent 7-day period, in each county. This measurement adjusts for different counties’ populations to 
                          provide a standardized point of comparison of deaths in each county.
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Daily Hospitalization</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> <a style ={{color: "#397AB9"}} href="https://covidtracking.com/about-data" target="_blank" rel="noopener noreferrer"> The COVID Tracking Project </a> </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Daily Hospitalization</i> is the number of new COVID-19 hospitalizations.
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Percent Positive</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> <a style ={{color: "#397AB9"}} href="https://covidtracking.com/about-data" target="_blank" rel="noopener noreferrer"> The COVID Tracking Project </a> </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Percent Positive</i> is the percentage of total tests for COVID-19 that resulted in a positive result.
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Percent Occupied Beds</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> CDC's<a style ={{color: "#397AB9"}} href="https://www.cdc.gov/nhsn/datastat/index.html" target="_blank" rel="noopener noreferrer"> National Healthcare Safety Network  </a> </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Percent Occupied Beds</i> is the state representative estimates for percentage of inpatient beds cccupied by COVID-19 patients.
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Cases per 100,000 Persons by Race</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> Derived from <a style ={{color: "#397AB9"}} href="https://covidtracking.com/race" target="_blank" rel="noopener noreferrer"> The COVID Racial Data Tracker </a> and <a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Cases per 100,000 persons by race</i> shows the distribution of COVID-19 infections across the race categories relative to the size of their population, among those with race information available.
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% African American</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> <a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% African American</i> is the percentage of residents in each county who self-identify as having African American ancestry. These data are from 2018. </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Hispanic or Latino</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% Hispanic or Latino</i> is the percentage of residents in each county who self-identified as Hispanic or Latino to the American Community Survey (ACS). These data are from ACS 2014-2016 (5-Year Estimate). </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% American Natives </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> <a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% American Natives </i> is the percentage of residents in each county who self-identified as American Indian and Alaska Native alone to the American Community Survey (ACS). These data are from ACS 2014-2016 (5-Year Estimate). </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Minority</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% Minority</i> is the percentage of residents in each county who self-identify as having ancestry other than non-Hispanic white. These data are from 2018. </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% in Poverty</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% in Poverty</i> is the percentage of residents in each county whose household income falls at or below the poverty thresholds set by the U.S. Census Bureau. These data are from 2018. </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Uninsured</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% Uninsured</i> is the percentage of residents in each county who currently lack personal health insurance. These data are from 2018. </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Diabetes</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>CDC's<a style ={{color: "#397AB9"}} href="https://www.cdc.gov/diabetes/data/index.html" target="_blank" rel="noopener noreferrer"> Division of Diabetes Translation </a> </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% Diabetes</i> is the percentage of residents in each county who currently have a medical diagnosis of Type 2 Diabetes, previously called Adult Onset Diabetes. These data are from 2016. </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Obesity</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}>CDC's <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/diabetes/data/index.html" target="_blank" rel="noopener noreferrer"> Division of Diabetes Translation </a></Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% Obesity</i> is the percentage of residents in each county who have obesity, defined as having a Body Mass Index (weight in kilograms divided by the square of height in meters) above 30. These data are from 2016.  </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% over 65 y/o</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% over 65 y/o</i> is the percentage of residents in each county who are older than 65 years. These data are from 2018.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% in Group Quarters</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% in Group Quarters</i> is the percentage of residents in each county who live in group living arrangements, such as nursing or assisted-living facilities. These data are from 2018. </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>% Male</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau  </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>% Male</i> is the percentage of residents in each county who are male. These data are from 2018.</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>COVID-19 Community Vulnerability Index (CCVI)</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://precisionforcovid.org/ccvi" target="_blank" rel="noopener noreferrer">Surgo Foundation </a> </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>The COVID-19 Community Vulnerability Index (CCVI)</i> can be used to identify the communities that may need the most support during the pandemic. CCVI scores range in value from 0 to 1, with higher scores indicating greater vulnerability.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Residential Segregation</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.countyhealthrankings.org/explore-health-rankings/measures-data-sources/county-health-rankings-model/health-factors/social-and-economic-factors/family-social-support/residential-segregation-blackwhite" target="_blank" rel="noopener noreferrer">Robert Wood Johnson Foundation program </a> </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Residential Segregation</i> is an index of dissimilarity where higher values indicate greater degree of Black and White county residents living separately from one another in a geographic area. 
                                                          <br/> <br/>
                                                          The index score can be interpreted as the percentage of either Black or White residents that would have to move to different geographic areas to produce a distribution that matches that of the larger area.
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Socioeconomic Vulnerability</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> CDC’s <a style ={{color: "#397AB9"}} href="https://svi.cdc.gov/data-and-tools-download.html" target="_blank" rel="noopener noreferrer">Social Vulnerability Index data 2018 database</a> </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Socioeconomic Vulnerability</i> is a composite measurement for each county that takes into account poverty, unemployment, per capita income, and not having a high school diploma; with the highest level of vulnerability assigned to tracts in the top 10% based on values for all of these measurements. These data are from 2018.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Household Composition Vulnerability</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> CDC’s <a style ={{color: "#397AB9"}} href="https://svi.cdc.gov/data-and-tools-download.html" target="_blank" rel="noopener noreferrer">Social Vulnerability Index data 2018 database</a></Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Household Composition Vulnerability</i> is a composite measurement for each county that takes into account population aged 65 and older, population aged 17 and younger, people with disabilities who do not live in an institutional setting, and single-parent households with child(ren) under age 18; with the highest level of vulnerability assigned to tracts in the top 10% based on values for all of these measurements. These data are from 2018.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Minority/Language Vulnerability</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> CDC’s <a style ={{color: "#397AB9"}} href="https://svi.cdc.gov/data-and-tools-download.html" target="_blank" rel="noopener noreferrer"> Social Vulnerability Index data 2018 database</a></Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Minority/Language Vulnerability</i> is a composite measurement for each county that takes into account all people except the white non-Hispanic population and those who speak English “less than well,” with the highest level of vulnerability assigned to tracts in the top 10% based on values for the measurements. These data are from 2018.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Housing/Transportation Vulnerability</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> CDC's <a style ={{color: "#397AB9"}} href="https://svi.cdc.gov/data-and-tools-download.html" target="_blank" rel="noopener noreferrer"> Social Vulnerability Index data 2018 database</a></Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Housing/Transportation Vulnerability</i> is a composite measurement for each county that takes into account living structures with 10 or more units, mobile homes, having more people than rooms in occupied housing, households with no vehicle available, and those living in institutionalized group quarters; with the highest level of vulnerability assigned to tracts in the top 10% based on values for all of these measurements. These data are from 2018.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Population</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}> <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/nchs/nvss/bridged_race.htm#Newest%20Data%20Release" target="_blank" rel="noopener noreferrer">Bridged-race population estimates </a> by The National Center for Health Statistics </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Population</i> is the total number of people who live in each county. </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Population Density</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Population Density</i> is the total number of people who live in each county per square mile. </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "16pt"}}>Household Income</Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><a style ={{color: "#397AB9"}} href="https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/" target="_blank" rel="noopener noreferrer">American Community Survey </a> by the U.S. Census Bureau </Table.Cell>
              <Table.Cell style={{lineHeight: "16pt"}}><i>Mean Household Income</i> measures the average total income per household in each county. These data are from 2018.</Table.Cell>
            </Table.Row>            
          </Table.Body>
        </Table>
        <Notes />
      </Container>
    </div>);
}
