import AppBar from './AppBar';
import Notes from './Notes';
import { useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Container, Grid, List, Divider, Button, Image, Breadcrumb, Header, Segment, Loader } from 'semantic-ui-react'
import {LineChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, LabelList, ReferenceArea, ReferenceLine} from "recharts";

const colorPalette = ['#007dba', '#808080', '#e8ab3b', '#008000', '#a45791', '#000000', '#8f4814'];

function getMin(arr, prop) {
  var min;
  for (var i=arr.length ; i > 0 ; i--) {
    min = arr[arr.length][prop];
      if (min == null || parseInt(arr[i][prop]) < min)
          min = arr[i][prop];
  }
  return min;
}

function getMax(arr, prop) {
  var max;
  for (var i=0 ; i < arr.length ; i++) {
      if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
          max = arr[i];
  }
  return max;
}

function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
}
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style = {{lineHeight: "19px"}}>
        <p style = {{margin: 0}} className="label">{`${(new Date(label*1000).getMonth()+1) + "/" +  new Date(label*1000).getDate() + "/" + new Date(label*1000).getFullYear()}`}</p>
        <p style = {{margin: 0, color: colorPalette[0]}} className="intro">{`Percent Vaccinated: ${(payload[0].value).toFixed(0)}`}</p>
        <p style = {{margin: 0, color : colorPalette[1]}} className="intro">{`Percent Vaccinated: ${(payload[1].value).toFixed(0)}`}</p>
        {payload.length > 2 && <p style = {{margin: 0, color : colorPalette[2]}} className="intro">{`Percent Vaccinated: ${(payload[2].value).toFixed(0)}`}</p>}
        {payload.length > 2 && <p style = {{margin: 0, color : colorPalette[3]}} className="intro">{`Percent Vaccinated: ${(payload[3].value).toFixed(0)}`}</p>}
        {/* <p className="desc">Anything you want can be displayed here.</p> */}
      </div>
    );
  }

  return null;
};

function VaccineDisparityCharts(props){
  const caseYTickFmt = (y) => {
    return y<1000?y.toFixed(0):(y/1000+'k');
  };
  return(
    <div style = {{fontSize: "19px"}}>
      <br/>
      <center><p> Vaccination Overtime by Vulnerable Populations</p></center>
      <LineChart width={720} height={450} data = {props.data} margin={{right: 20}}>
        {/* <CartesianGrid stroke='#f5f5f5'/> */}
        <XAxis dataKey="t" tick={{fontSize: 16}} tickFormatter={props.formatter} allowDuplicatedCategory={false}/>
        <YAxis tickFormatter={caseYTickFmt} tick={{fontSize: 16}} domain={["dataMin", "dataMax"]}/>
        <Line data={props.data[props.aboveM]} name={props.aboveM} type='monotone' dataKey={props.outcome} dot={false} 
              isAnimationActive={true} 
              stroke={colorPalette[0]} strokeWidth="2" />
        <Line data={props.data[props.belowM]} name={props.belowM} type='monotone' dataKey={props.outcome} dot={false} 
              isAnimationActive={true} 
              stroke={colorPalette[1]} strokeWidth="2" />
        {props.region && <Line data={props.data[props.trendGroup[2]]} name={props.trendGroup[2]} type='monotone' dataKey={props.outcome} dot={false} 
              isAnimationActive={true} 
              stroke={colorPalette[2]} strokeWidth="2" />}
        {props.region && <Line data={props.data[props.trendGroup[3]]} name={props.trendGroup[3]} type='monotone' dataKey={props.outcome} dot={false} 
              isAnimationActive={true} 
              stroke={colorPalette[3]} strokeWidth="2" />}
        <Legend />
        {/* <ReferenceLine x={data["_nation"][275].t} stroke="red" label="2021" /> */}

        {/* <Tooltip labelFormatter={props.formatter} formatter={ (value) => numberWithCommas(value.toFixed(0))} active={true}/> */}
        <Tooltip content={<CustomTooltip />}/>
      </LineChart>
    </div>
  )
}

export default function AboutUs(props){
  const history = useHistory();
  const [vaccDisparityData, setVaccDisparityData] = useState();
  const [region, setRegion] = useState();
  

  let {blogTitle} = useParams();
  const [vTrendGroup, setVTrendGroup] = useState();
  
  const caseTickFmt = (tick) => { 
    // return ((new Date(tick*1000).getMonth()+1) + "/" +  new Date(tick*1000).getDate() + "/" + new Date(tick*1000).getFullYear());
    return ((new Date(tick*1000).getMonth()+1) + "/" +  new Date(tick*1000).getDate() );
  };

  useEffect(() =>{
    if( blogTitle === "test123PilotBlog"){
      fetch('/data/vaccineDisparity.json').then(res => res.json())
        .then(x => setVaccDisparityData(x));
      
      setVTrendGroup(["Counties with high proportion of African American", 
      "Counties with low proportion of African American"]);
    }
  }, []);
  
  if(true){
    console.log();
  return (
    <div>
    <AppBar/>

    {blogTitle == "test123PilotBlog" && vaccDisparityData && 
      <Container style={{marginTop: "8em", minWidth: '1260px'}}>
        <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt"}}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
            <Breadcrumb.Section active>Blog</Breadcrumb.Section>
        </Breadcrumb>
        

        <div width = {888}>
        
            <Header style={{width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400}}>
              <Header.Content>
              Trend of COVID-19 Vaccine Administrations across the population characteristics of all counties in the United States
                
                <Header.Subheader style={{fontSize: "18pt", fontWeight: 300, paddingTop: "15px"}}>
                Vaccination efforts should absolutely be commended, but we have also had our share of neglect. Time to celebrate? Not quite yet. 


                </Header.Subheader>
                <div style = {{paddingTop: 10}}>
                       {/* <Image width='600' height='350' href = '/media-hub/blog/maskmandate' src='/blog images/maskmandate/Mask Mandate blog.png' />             */}

                </div>

                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <p style={{textAlign:"left", fontWeight: 300}}>

                      By Star Liu & Pooja Naik, Jun. 2, 2021  &nbsp;&nbsp; |  &nbsp;&nbsp; 3-minute read

                      <br/>
                      Contributors: Gaëlle Sabben, Shivani A. Patel 
                      <br/>
                      From Emory University

                      <br/>

                      </p>

                      <br/>
                      <br/>

                      Despite being a universal crisis, the COVID-19 pandemic has had a disproportionate 
                      impact on the people of color in the United States - particularly, the African 
                      American and the Hispanic community. Infection rate in African Americans is 1.1 
                      times as high as White Americans’ infection rates, while Hispanics experience 1.9 
                      times higher risk of getting infected with COVID-19 (Figure 1). The disproportionate 
                      impact of COVID-19 on racial and ethnic minorities is extensively discussed but it 
                      is yet to understand how much is being done to address it. Amidst CDC recommended 
                      non-pharmaceutical interventions such as mask wearing, hand washing, hand sanitizing 
                      and other measures taken by local, state and federal governments, the vaccines 
                      emerged as a valuable weapon against COVID-19. Ensuring equitable vaccine access 
                      remains a national priority. Despite targeted efforts in ensuring vaccine access 
                      to vulnerable communities, our data suggests that vaccine administration is not 
                      just lower in some vulnerable communities, but the gaps have been widening even 
                      further over time. In absence of individual-level data, we carried out an ecologic 
                      analysis. Although inferences from population-level data do not always translate 
                      to findings at individual-level, our study provides insight into health equity in 
                      COVID-19 vaccine administrations in the United States by comparing the U.S. 
                      counties with higher proportion of vulnerable communities to the counties with 
                      lower proportion of vulnerable communities. 

                      <br/>
                      <br/>
                      <br/>

                      As per the 
                      <a href="https://www.cdc.gov/mmwr/volumes/69/wr/mm695152e2.htm?s_cid=mm695152e2_w" target="_blank" rel="noopener noreferrer"> recommendations </a>
                      of Advisory Committee on Immunization Practices (ACIP), 
                      the COVID-19 vaccinations were offered in three phases. Health care personnel, 
                      residents of long-term care facilities, persons aged 65 – 74 years, persons aged 
                      16 – 64 years with high-risk medical conditions, and essential workers were the 
                      <a href="https://www.cdc.gov/mmwr/volumes/69/wr/mm695152e2.htm?s_cid=mm695152e2_w" target="_blank" rel="noopener noreferrer"> first groups to receive the vaccines</a>. This phased vaccine rollout provided guidance 
                      for federal, state and local governments while vaccine supply was limited. Owing 
                      to the intentionally targeted efforts to ensure that the population aged 65 and 
                      over were amongst the first communities to receive vaccines, it comes as no 
                      surprise that counties with higher population over the age of 65 years have had 
                      higher vaccination rates from the very beginning of the vaccine rollout. 
                      In contrast, American Indian and Alaska Natives (AIAN) and Hispanic communities, 
                      that were hit hard by the pandemic due to underlying inequities, revealed discussible trends.  

                      <div>
                        <center>
                          <Button content='African American' icon='users' floated="center" onClick={() => {
                            setVTrendGroup(["Counties with high proportion of African American", 
                            "Counties with low proportion of African American"]); 
                            setRegion(false);
                          }}/>
                          <Button content='Hispanic' icon='users' floated="center" onClick={() => {
                            setVTrendGroup(["Counties with high proportion of Hispanic", 
                            "Counties with low proportion of Hispanic"]); 
                            setRegion(false);
                          }}/>
                          <Button content='Age 65+' icon='users' floated="center" onClick={() => {
                            setVTrendGroup(["Counties with high proportion of age 65+", 
                            "Counties with low proportion of age 65+"]); 
                            setRegion(false);
                          }}/>
                          <Button content='Underlying condition' icon='users' floated="center" onClick={() => {
                            setVTrendGroup(["Counties with high proportion with underlying condition", 
                            "Counties with low proportion with underlying condition"]); 
                          }}/>
                          <Button content='In poverty' icon='users' floated="center" onClick={() => {
                            setVTrendGroup(["Counties with high proportion in poverty", 
                            "Counties with low proportion in poverty"]); 
                            setRegion(false);
                          }}/>
                          {/* <Button content='Residential Segregation' icon='users' floated="center" onClick={() => {
                            setVTrendGroup(["Counties with high residential segregation", 
                            "Counties with low residential segregation"]); 
                            setRegion(false);
                          }}/> */}
                          <Button content='Minority' icon='users' floated="center" onClick={() => {
                            setVTrendGroup(["Counties with high proportion of minority", 
                            "Counties with low proportion of minority"]); 
                            setRegion(false);
                          }}/>
                          <Button content='American Native' icon='users' floated="center" onClick={() => {
                            setVTrendGroup(["Counties with high proportion of American Native", 
                            "Counties with low proportion of American Native"]); 
                            setRegion(false);
                          }}/>
                          <Button content='Uninsured' icon='users' floated="center" onClick={() => {
                            setVTrendGroup(["Counties with high proportion of uninsured", 
                            "Counties with low proportion of uninsured"]); 
                            setRegion(false);
                          }}/>
                          <Button content='Region' icon='users' floated="center" onClick={() => {
                            setVTrendGroup(["Counties in the South", "Counties in the West", 
                            "Counties in the Northeast", "Counties in the Midwest", ]); 
                            setRegion(true);
                          }}/>
                        </center>
                        
                        
                        {vaccDisparityData && <VaccineDisparityCharts data = {vaccDisparityData} 
                          aboveM = {vTrendGroup[0]} belowM = {vTrendGroup[1]} region = {region} outcome = {"percentFullyVaccinated"} 
                          formatter= {caseTickFmt} trendGroup = {vTrendGroup}/>}
                      </div>

                      <br/>
                      <br/>
                      <br/>

                      The vaccination rates in counties with higher percentage of American Indian and 
                      Alaska Natives population have always been higher compared to the counties with 
                      lower percentage of American Indian and Alaska Natives population. This can, 
                      partly, be explained by strong implementation of vaccine distribution and 
                      prioritization strategies by the AIAN tribe community leaders. The Indian 
                      Health Service (IHS), a federal agency that maintains health service delivery 
                      system for American Indian and Alaska Natives, 
                      <a href="https://www.ihs.gov/sites/coronavirus/themes/responsive2017/display_objects/documents/COVID-19VaccineAllocationbyArea.pdf" target="_blank" rel="noopener noreferrer"> were initially shipped 68,400 vaccines </a>
                      which were distributed among the AIAN communities across 37 U.S. states 
                      when the vaccine rollout began. As for Hispanics, even though the vaccination 
                      rate in counties with higher proportion of Hispanics was XXX percentage points 
                      lower than that in counties with lower proportion of Hispanics in the early 
                      days of vaccine rollout, we see the tables turned by the mid-April. As of May 30, 
                      the counties with higher proportion of Hispanics showed higher vaccination rate. 
                      As per Urban Institute Analysis of 2018 American Community Survey data, 
                      
                      <a href="https://www.urban.org/research/publication/how-risk-exposure-coronavirus-work-varies-race-and-ethnicity-and-how-protect-health-and-well-being-workers-and-their-families/view/full_report" target="_blank" rel="noopener noreferrer"> 31% Hispanics </a>

                      had essential jobs and have a 
                      <a href="http://ftp.iza.org/dp13650.pdf" target="_blank" rel="noopener noreferrer"> higher representation </a>

                      in frontline workers. 
                      Frontline workers received vaccinations earlier as per ACIP’s recommendations and 
                      we can say that the effects of these efforts are reflected in our ecological data.

                      <br/>
                      <br/>
                      <br/>

                      On the other hand, there are communities in the United States that are under 
                      vaccinated right from the beginning of vaccination 
                      
                      <a href="https://www.cnn.com/2021/02/12/health/covid-19-vaccine-comorbidities-states-cnn-analysis-wellness/index.html" target="_blank" rel="noopener noreferrer"> rollout </a>

                      , despite robust evidence highlighting the disproportionate impact of the COVID-19 pandemic 
                      experienced by these communities. Particularly, counties with a higher proportion 
                      of minority, African American and uninsured population as well as counties with 
                      higher proportion of population with underlying conditions and population in 
                      poverty have seen overall lower vaccination turnout. What comes as a surprise 
                      is the vaccination turnout in counties with higher proportion of population 
                      with underlying conditions.  

                      Vaccination rollout started with healthcare workers, essential workers, and 
                      the elderly before it was for those with underlying conditions. However, 
                      we do not see the expected turnout like we do in counties with higher proportion 
                      of age 65 and older. By the end of March, most U.S. states had expanded vaccination 
                      eligibility to individuals with underlying medical conditions. The vaccination 
                      rate in counties with higher proportion of population with underlying conditions 
                      was then XXX percentage points lower than in counties with lower proportion of 
                      population with underlying conditions, but now has increased to XXX percentage points.  
                      
                      <br/>
                      <br/>
                      <br/>
                      
                      We see similar gaps in rollout between counties with higher and lower 
                      proportion of African American population. In early April, Dr. Gary Bennette, 
                      from Duke University, in an 
                       
                      <a href="https://researchblog.duke.edu/2021/04/08/black-americans-vaccine-hesitancy-is-grounded-by-more-than-mistrust/" target="_blank" rel="noopener noreferrer"> interview </a>

                      highlighted barriers in accessing health care services, mistrust, and uncertainties around vaccines as the root 
                      causes of increased vaccine hesitancy and, in turn, low vaccine turnout. 
                      Over a month later, the same gap in vaccination exists among the African 
                      American population. Better yet, the gap grew wider. Counties with higher 
                      proportion of African American population see 6% lower vaccination turnout 
                      compared to those with lower proportion. Among all minorities, except for 
                      Hispanic and American Native, we see similar trends in vaccination: counties 
                      with higher proportion of vulnerable communities are not hitting enough turnout.  
                      
                      <br/>
                      <br/>
                      <br/>
                      
                      When it comes to the impoverished and underserved communities, limited access 
                      is just one of the many obstacles that the residents of those neighborhoods 
                      must deal with. Earlier in February, 
                       
                      <a href="https://www.nytimes.com/2021/02/02/health/white-people-covid-vaccines-minorities.html" target="_blank" rel="noopener noreferrer"> vaccination efforts for the impoverished </a>

                      were hit with an influx of residents from other areas, further hindering the 
                      effort. Despite continued work in impoverished neighborhoods, we still see 
                      lower vaccination turnout among counties with higher proportion of population 
                      in poverty. Typically, it is hard to overlook this phenomenon because most of 
                      those impoverished communities are also the ones without insurance. Yet, if 
                      COVID-19 vaccines are free, then why are we seeing 
                       
                      <a href="https://www.forbes.com/sites/debgordon/2021/04/16/uninsured-americans-are-half-as-likely-to-get-the-covid-19-vaccine-even-though-its-free-new-data-shows/?sh=5aa6bbf1766f" target="_blank" rel="noopener noreferrer"> lower turnout </a>
                      among counties with greater proportion of uninsured residents? And, that gap has 
                      almost doubled since April.  

                      <Image width='2000' height='2450' src='/blog images/vaccineTrends/percentPoverty.png' />
                      <Image width='2000' height='2450' src='/blog images/vaccineTrends/percentUninsured.png' /> 

                      
                      <br/>
                      <br/>
                      <br/>                  
                      
                      There also exists discrepancies in vaccination among the four regions of 
                      the U.S.: South, West, Midwest, and Northeast. If you click on the “Region” 
                      button down below, you will find that among counties in the South, they have 
                      the lowest percent vaccinated population of the entire U.S.. The above heatmaps 
                      are also generated from 
                       
                      <a href="https://covid19.emory.edu/map-state" target="_blank" rel="noopener noreferrer"> Emory’s COVID-19 Health Equity Dashboard Map State</a>.

                      If I tell you that these heatmaps represent percent in poverty (left) and 
                      percent uninsured (right), would you be surprised that the South is doing 
                      poorly? This goes to show that COVID-19 has a differential impact, but 
                      more importantly, we are facing a challenge that needs to be addressed 
                      from multiple angles. And again, increasing proper access to care and 
                      continuing efforts in these more impoverished regions could just save some lives. 
                      
                      <br/>
                      <br/>
                      <br/>
                      
                      Most concerning challenges to vaccination hesitancy that has come up 
                      repeated in reports and articles, including this 
                       
                      <a href="https://www.ajmc.com/view/disparities-in-covid-19-vaccine-rates-tarnish-swift-us-rollout" target="_blank" rel="noopener noreferrer"> piece </a>
                      from AJMC, consist 
                      of access to health care, mistrust, and uncertainties. It is unlikely like 
                      we can turn the tide on mistrust in matters of weeks or months, perhaps even 
                      years. Increasing local access to much needed care is within our grasp. 
                      Don’t let this be another lesson learned. 
                      
                      <br/>
                      <br/>
                      <br/>

                      

                </Header>

              </Header.Content>
            </Header>
  
          
        </div>
        <Notes />
      </Container>
    }

    {blogTitle == "maskmandate" &&
      <Container style={{marginTop: "8em", minWidth: '1260px'}}>

      <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt"}}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
            <Breadcrumb.Section active>Blog</Breadcrumb.Section>
      </Breadcrumb>
        <div width = {888}>
        
            <Header style={{width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400}}>
              <Header.Content>
                Statewide Mask Mandates <br/>in the United States


                <Header.Subheader style={{fontSize: "18pt", fontWeight: 300, paddingTop: "15px"}}>
                  Implementing state-wide mask mandate in the early stages of the pandemic may have been a clever move 
                  for US states resulting in lower case rates during the third wave of the pandemic compared to states with 
                  later or no mask mandates, our data suggests.


                </Header.Subheader>
                <div style = {{paddingTop: 10}}>
                       <Image width='600' height='350' href = '/media-hub/blog/maskmandate' src='/blog images/maskmandate/Mask Mandate blog.png' />            

                </div>

                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <p style={{textAlign:"left", fontWeight: 300}}>

                      By Star Liu & Pooja Naik, Feb. 12, 2021  &nbsp;&nbsp; |  &nbsp;&nbsp; 5-minute read

                      <br/>
                      Contributors: Gaëlle Sabben, Shivani A. Patel 
                      <br/>
                      From Emory University

                      <br/>

                      </p>

                      <br/>
                      <br/>

                      By October 31<sup>st</sup>, 2020, over 
                      <a href="https://coronavirus.jhu.edu/us-map" target="_blank" rel="noopener noreferrer"> 9,000,000 cases and 200,000 deaths 
                          </a> had occurred in the U.S., 
                      with cases and death rates consistently higher than in most other countries. The ongoing 
                      epidemic has demanded a comprehensive response from the federal, state, and local governments. 
                      It has also challenged governments to act in extraordinary ways to contain the spread of coronavirus. 
                      In addition to thorough handwashing, social distancing and mask wearing are the primary prevention 
                      strategies available to prevent SARS-CoV-2 (the virus that causes COVID-19 disease) infection. 
                      In crises like this, citizens look to their governments for information, guidance, and safety. 
                      The coronavirus pandemic has affected nearly every nation in the world differently and each 
                      government’s response towards containing the pandemic has been equally distinct. 
                      This has been the case on a range of measures, including whether leaders implemented local mask mandates.


                
                      <br/>
                      <br/>
                      <br/>

                      The shifting guidelines on mask use by the World Health Organization (WHO) and U.S. 
                      Centers for Disease Control and Prevention (CDC) in the early days of the pandemic 
                      precipitated confusion among the general public about the effectiveness and utility 
                      of face masks. Both 
                      <a href="https://www.vox.com/2020/6/6/21282108/masks-for-covid-19-world-health-organizationguidelines-cloth-n95" target="_blank" rel="noopener noreferrer"> WHO </a>
                       and 
                       <a href="https://www.dallasnews.com/news/public-health/2020/04/08/why-did-the-recommendation-on-wearing-face-masks-change/" target="_blank" rel="noopener noreferrer"> CDC </a>
                        had deemed the use of face masks unnecessary earlier 
                      in the pandemic but later changed their stance in early June 2020. Several studies on the 
                      effectiveness of masks in controlling the spread of COVID-19 resulted in 
                      <a href="https://www.vox.com/2020/5/29/21273625/coronavirus-masks-required-virginia-china-hongkong" target="_blank" rel="noopener noreferrer"> 15 U.S. states suddenly mandating mask use statewide </a>
                           in April, May, and June. Twelve other states followed 
                      in June, July, and August 2020. Despite 
                      <a href="https://jamanetwork.com/journals/jama/fullarticle/2776536" target="_blank" rel="noopener noreferrer"> several strong pieces of evidence </a> on the 
                      effectiveness of masks in controlling spread, 18 states had failed to put a statewide 
                      order in place before the peak rose too high to be controlled by October 31<sup>st</sup>, 2020. There 
                      had been several additional studies of mask effectiveness done before the third wave hit. 
                      However, since November, almost all the states saw dramatic spikes in cases. Thus, as we 
                      consider additional measures to control the ongoing spread of COVID-19, we need to examine 
                      how mask mandates could have had important and lasting effects on recent trends in cases 
                      and the implications for the coming weeks and months. If mask mandates indeed are crucial 
                      in controlling the spread of COVID-19, we expect states with early mask mandates to have 
                      the lowest case rates (per 100,000) among them all. As we negotiate the added risks of 
                      infection from new and potentially more infectious variants of SARS-CoV-2, we revisit the 
                      efficacy of mask mandates to remind ourselves of the importance of mask-wearing and 
                      quantify the performance of statewide mask mandates in controlling the spread of COVID-19 in the United States. 

                      
                      <br/>
                      <br/>
                      <br/>

                      To understand the impact of mask mandates, we compared the trend of COVID-19 
                      infection rates in the 15 states that first mandated mask usage statewide early 
                      in the pandemic (before the second wave hit in June) with other states that passed 
                      the statewide mask mandate order either during or after the second wave and with 
                      those that had not implemented statewide mask mandates as of October 31<sup>st</sup>, 2020. 
                      Since November 2020, there have been multiple events such as national elections, 
                      the Thanksgiving and end of year holidays, the end of the Fall semester for schools, 
                      and riots that could have contributed to the spike in COVID-19 cases. Thus, our 
                      window of analysis is cut off on October 31<sup>st</sup>, 2020 and we considered states that 
                      adopted a statewide order after November to be part of the group of states without 
                      mandates. Each wave of the pandemic is defined as the period from the point of 
                      lowest growth in daily cases in the previous period to the next peak. The states 
                      that passed statewide mask mandate orders in April and early May were classified as 
                      the “first group of states with mask mandates (Before the second wave).” Those that 
                      mandated mask use statewide between June 7 and July 19 make up the “second group of 
                      states with mask mandate (During the second wave).” Finally, we consider the states 
                      that mandated mask usage statewide after the second curve abated as the “third group 
                      of states with mask mandate (After the second wave).” The states in each category are listed below in Table 1. 


                      
                      <br/>
                      <br/>
                      <br/>
                      
                        <table style= {{border: "1px solid black", borderCollapse: "collapse"}}>
                          <tbody>
                            <tr>
                              <th rowSpan = "2" style = {{border: "1px solid black", textAlign: "left"}}>States without statewide orders <br/>(N = 18)</th>
                              <th colSpan = "3" style= {{border: "1px solid black"}}>States that implemented statewide mask mandate orders in different phases of the pandemic </th>
                            </tr>
                            <tr>
                              <th style= {{border: "1px solid black"}}>First (Before the Second wave (N = 15)</th>
                              <th style= {{border: "1px solid black"}}>Second (During the Second wave (N = 12)</th>
                              <th style= {{border: "1px solid black"}}>Third (After the Second wave (N = 6)</th>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Alaska</td>
                              <td style= {{border: "1px solid black"}}>Connecticut</td>
                              <td style= {{border: "1px solid black"}}>Alabama</td>
                              <td style= {{border: "1px solid black"}}>Arkansas</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Arizona</td>
                              <td style= {{border: "1px solid black"}}>Delaware</td>
                              <td style= {{border: "1px solid black"}}>California</td>
                              <td style= {{border: "1px solid black"}}>Indiana</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Florida</td>
                              <td style= {{border: "1px solid black"}}>District of Columbia</td>
                              <td style= {{border: "1px solid black"}}>Colorado</td>
                              <td style= {{border: "1px solid black"}}>Minnesota</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Georgia</td>
                              <td style= {{border: "1px solid black"}}>Hawaii</td>
                              <td style= {{border: "1px solid black"}}>Kentucky</td>
                              <td style= {{border: "1px solid black"}}>Ohio</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Idaho</td>
                              <td style= {{border: "1px solid black"}}>Illinois</td>
                              <td style= {{border: "1px solid black"}}>Louisiana</td>
                              <td style= {{border: "1px solid black"}}>Louisiana</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Iowa</td>
                              <td style= {{border: "1px solid black"}}>Maine</td>
                              <td style= {{border: "1px solid black"}}>Montana</td>
                              <td style= {{border: "1px solid black"}}>Wisconsin</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Kansas</td>
                              <td style= {{border: "1px solid black"}}>Maryland</td>
                              <td style= {{border: "1px solid black"}}>Nevada</td>
                              <td rowSpan = "12" style= {{border: "1px solid black"}}></td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Missouri</td>
                              <td style= {{border: "1px solid black"}}>Massachusetts</td>
                              <td style= {{border: "1px solid black"}}>North Carolina</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Nebraska</td>
                              <td style= {{border: "1px solid black"}}>Michigan</td>
                              <td style= {{border: "1px solid black"}}>Oregon</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>North Dakota</td>
                              <td style= {{border: "1px solid black"}}>New Jersey</td>
                              <td style= {{border: "1px solid black"}}>Texas</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Oklahoma</td>
                              <td style= {{border: "1px solid black"}}>New Mexico</td>
                              <td style= {{border: "1px solid black"}}>Washington</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>South Carolina</td>
                              <td style= {{border: "1px solid black"}}>New York</td>
                              <td style= {{border: "1px solid black"}}>West Virginia</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>South Dakota</td>
                              <td style= {{border: "1px solid black"}}>Pennsylvania</td>
                              <td rowSpan = "6" style= {{border: "1px solid black"}}></td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Tennessee</td>
                              <td style= {{border: "1px solid black"}}>Rhode Island</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Utah</td>
                              <td style= {{border: "1px solid black"}}>Virginia</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>New Hampshire</td>
                              <td rowSpan = "3" style= {{border: "1px solid black"}}></td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Wyoming</td>

                            </tr>
                            <tr>
                              <td style= {{border: "1px solid black"}}>Mississippi<sup>*</sup></td>

                            </tr>
                          </tbody>
                        </table>
                      
                      <br/>
                      <br/>

                        <p style = {{marginLeft: 0, fontSize: "14pt", fontWeight: 300, lineHeight: "16pt", lineSpacing: 0}}>
                            <b>Table 1:</b> List of U.S. states without statewide mask mandate versus states 
                            that mandated mask use statewide in the early phase of the pandemic (before the second wave), 
                            in the later phase (during the second wave), and after the second wave (by October 31<sup>st</sup>, 2020). 
                            <br/>
                            <sup>*</sup>Mississippi is classified as such because it lifted mask mandate on September 30<sup>th</sup>.<br/>
                            Data source: 
                            <a href="https://www.aarp.org/health/healthy-living/info-2020/states-mask-mandates-coronavirus.html" target="_blank" rel="noopener noreferrer"> State-by-State Guide to Face Mask Requirements by Andy Markowitz, AARP.</a>
                            <br/>
                            
                        </p>
                      
                      <br/>

                      We computed the COVID-19 case rate in states grouped by our statewide mask mandate 
                      classification over time. In Figure 1, we show the cumulative COVID-19 cases, adjusted 
                      by population size, in states by the timing of mask mandate adoption.

                      <br/>
                      <br/>
                      <br/>

                        </Header>
                                <center> <Image width='800' height='500' src='/blog images/maskmandate/Picture1.png' /> </center>
                                <p style = {{marginLeft: 0, fontSize: "14pt", fontWeight: 300, lineHeight: "16pt", lineSpacing: 0}}> 
                                <b>Figure 1:</b> Cases per 100,000 in states with and without statewide mask 
                                mandate as of October 31, 2020. Each wave is defined as the period from the 
                                point of lowest growth in daily cases in the previous period to the next peak.  </p>
                
                        <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <br/>

                      One major assumption we make is that mask mandates have a direct effect on 
                      local residents’ behavior regarding mask-wearing. 15 states, including New York, 
                      New Jersey, Massachusetts, Rhode Island, and Connecticut, had implemented statewide 
                      mask mandates by the time first wave’s momentum halted in early June. Indeed, the first 
                      group of states that turned to mask mandates was the one that saw a spike in cases early 
                      on, but they were also the ones that limited the spike in case rate during the second wave. 
                      During the second wave, this group saw a flattened curve compared to states not yet 
                      implementing mandates, and the difference in case rate has grown only more separated 
                      since the start of the third wave. As of October 31<sup>st</sup>, the average case rate in states 
                      without mask mandates was approximately 50% more than (3,445 vs. 2,198 cases) that of 
                      states with the earliest mask mandates.

                      <br/>
                      <br/>
                      <br/>
                      
                      States that mandated mask use statewide in June, July, and August (the “second group” 
                      in our categorization), saw a minimal impact of the mandates on COVID-19 case rates in 
                      the few weeks that followed. While it may be tempting to discredit the effectiveness of 
                      these mandates, the differences have manifested since September as case rates in states 
                      without mask mandates skyrocketed. On October 31<sup>st</sup>, states with mask mandates during the 
                      second wave saw approximately 867 fewer cases per 100,000 compared to the group with no 
                      mask mandates. Similarly, states with statewide mask mandates after the second wave saw 
                      approximately 884 fewer cases per 100,000 compared to states without mask mandates. The 
                      average case rate across the group without mask mandates ticked up in the second half of 
                      October at an alarming rate while other groups with earlier mask mandates had a steady 
                      increase during the same period. This discrepancy sheds some light on the positive 
                      contribution that mask mandates might have played in containing the spread of the 
                      pandemic - even when the entire nation is experiencing worst of the pandemic.

                      <br/>
                      <br/>
                      <br/>

                      Multiple preventive guidelines beyond mask mandates could have contributed to 
                      controlling the SARS-CoV-2 virus, so it is difficult to assess what proportion of 
                      case control is due solely to mask mandates. For example, states that adopted early 
                      mask mandates may have also been more likely to adopt other simultaneous mitigation 
                      measures. Similarly, those states may have residents that are more compliant with 
                      public health guidance and invested in community-wide mitigation, which would allow 
                      decision-makers the political will to implement such measures in the first place. 
                      Nevertheless, the timing of mask mandates and the subsequent changes in the growth 
                      of case rates align. States that implemented statewide mask mandates saw a slower 
                      growth in cases compared to those that did not, not just in the weeks that followed 
                      the mandates, but for months after. The discrepancies in case rate trends affirm the 
                      correlation between mask mandates and COVID-19 case rate, but they also highlight 
                      that a lack thereof puts states in precarious situations.

                      <br/>
                      <br/>
                      <br/>

                      It has been over a year since the first COVID-19 case was discovered in the 
                      United States, and now the pandemic has reached new heights with increasing 
                      concerns about potential new variants of the SARS-CoV-2 virus. Statewide mask 
                      mandates assert states’ positions on following guidelines and could be game 
                      changing towards flattening the curve in states that are currently experiencing 
                      the worst of the pandemic. As vaccination slowly catches up, it remains critical 
                      to mandate masks, protecting each other’s health and buying time for greater 
                      vaccine uptake. Far too many lives have been lost, and there is no timetable for 
                      the end of this calamity. We just might get a glimpse of the light at the end of 
                      tunnel if we take all the necessary courses of action now. 

                      <br/>
                      <br/>
                      <br/>

                      

                </Header>

              </Header.Content>
            </Header>
  
          
        </div>
        <Notes />

      </Container>
    }








    {blogTitle == "povertyRelatedIssues"&&
      <Container style={{marginTop: "8em", minWidth: '1260px'}}>

      <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt"}}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
            <Breadcrumb.Section active>Blog</Breadcrumb.Section>
      </Breadcrumb>
        <div width = {888}>
        
            <Header style={{width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400}}>
              <Header.Content>
                COVID-19 and Poverty-related issues


                <Header.Subheader style={{fontSize: "18pt", fontWeight: 300, paddingTop: "15px"}}>
                This blog provides an update to our July 27th video, “COVID-19 and Poverty-related Issues.” What do state maps look like now?


                </Header.Subheader>
                <div style = {{paddingTop: 10}}>
                       <Image width='600' height='350' href = '/media-hub/blog/povertyRelatedIssues' src='/blog images/pri/Image 15.png' />            

                </div>

                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <p style={{textAlign:"left", fontWeight: 300}}>

                      By Leanna Ehrlich, published on October 7, 2020  &nbsp;&nbsp; |  &nbsp;&nbsp; 2-minute read

                      <br/>
                      Contributors: K.M. Venkat Narayan, Shivani A. Patel
                      <br/>
                      From Emory University

                      <br/>

                      </p>

                      <br/>

                      <b> This topic was first covered in the July 27th video “COVID-19 and Poverty-related Issues.” </b>
                      <br/>
                      <br/>
                        <iframe width="700" height="400" src="https://www.youtube.com/embed/IEojaw9cND4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                      <br/>
                      <br/>
                      <br/>

                      COVID-19 is affecting every community differently. The COVID-19 Health Equity 
                      Dashboard compiles publicly available data from across the United States to 
                      track COVID-19 infections and deaths across counties while considering demographic, social, and economic context.  


                
                      <br/>
                      <br/>
                      <br/>

                      Since COVID-19 coronavirus pandemic took off in the United States in 2020, 
                      data continue to show that poverty, lack of health insurance, socioeconomic 
                      vulnerability, and housing insecurity may all contribute to higher risk of 
                      contracting COVID-19 and having severe outcomes. In the United States, 
                      approximately 12 percent of people are experiencing poverty, 8.5 percent do 
                      not have health insurance; 10 to 15 percent experience housing insecurity, 
                      and 8 percent are unemployed (up from a high of nearly 15% in April) [1, 2, 3, 4, 5]. 
                      These issues are related. As the pandemic affects businesses and employment, the 
                      cycle of poverty may be reinforced.

                      
                      <br/>
                      <br/>
                      <br/>

                      Looking at county comparisons on the COVID-19 Health Equity Dashboard, 
                      we can find visual representations of these statistics across many states.


                      
                      <br/>
                      <br/>
                      <br/>

                      To start visualizing, click on the tab “Map State.” By selecting a state and 
                      selecting “Total COVID-19 Cases per 100,000” under “COVID-19 Outcome Measure,” 
                      and then selecting “% Poverty” in “COVID-19 County Population Characteristics,” 
                      you can map these relationships. Cases per 100,000 (left) track with poverty 
                      (right) in Arizona, Alabama, and Georgia.


                      <br/>
                      <br/>
                      <br/>

                      <b> ARIZONA: </b>
                      <center>      <Image width='850' height='450' src='/blog images/pri/Image 16.png' /> </center>

                      <br/>
                      <br/>
                      <br/>

                      <b> ALABAMA: </b>
                      <center>      <Image width='850' height='450' src='/blog images/pri/Image 17.png' /> </center>


                      <br/>
                      <br/>
                      <br/>

                      <b> GEORGIA: </b>
                      <center>      <Image width='850' height='450' src='/blog images/pri/Image 18.png' /> </center>

                      <br/>
                      <br/>
                      <br/>
                      
                      In New Jersey and Washington, the case rate roughly tracks with uninsured residents.

                      <br/>
                      <br/>
                      <br/>

                      <b> NEW JERSEY: </b>
                      <center>      <Image width='850' height='450' src='/blog images/pri/Image 19.png' /> </center>

                      
                      
                      <br/>
                      <br/>
                      <br/>

                      <b> WASHINGTON: </b>
                      <center>      <Image width='850' height='450' src='/blog images/pri/Image 20.png' /> </center>

                      
                      <br/>
                      <br/>
                      <br/>

                      The composite index of socioeconomic vulnerability, which takes 
                      into account poverty, unemployment, per capita income, and lacking 
                      a high school diploma, tracks with case rates in Mississippi, Alabama, and California.


                      <br/>
                      <br/>
                      <br/>

                      <b> MISSISSIPPI: </b>
                      <center>      <Image width='850' height='450' src='/blog images/pri/Image 21.png' /> </center>

                      <br/>
                      <br/>
                      <br/>

                      <b> ALABMA: </b>
                      <center>      <Image width='850' height='450' src='/blog images/pri/Image 22.png' /> </center>


                      <br/>
                      <br/>
                      <br/>

                      <b> CALIFORNIA: </b>
                      <center>      <Image width='850' height='450' src='/blog images/pri/Image 23.png' /> </center>

                      <br/>
                      <br/>
                      <br/>

                      Housing and transportation vulnerability, a composite measurement that takes into 
                      account dense living structures, mobile homes, households with no vehicle available, 
                      and institutionalized group living, tracks with case rates in Florida and Oregon.

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

                      <b> FLORIDA: </b>
                      <center>      <Image width='850' height='450' src='/blog images/pri/Image 24.png' /> </center>


                      <br/>
                      <br/>
                      <br/>

                      <b> OREGON: </b>
                      <center>      <Image width='850' height='450' src='/blog images/pri/Image 25.png' /> </center>

                      <br/>
                      <br/>
                      <br/>

                      <b> References: </b>
                      <br/>
                      1. <a href="https://www.census.gov/library/publications/2019/demo/p60-266.html" target="_blank" rel="noopener noreferrer"> https://www.census.gov/library/publications/2019/demo/p60-266.html </a>
                      <br/>
                      2. <a href="https://www.census.gov/library/publications/2019/demo/p60-267.html" target="_blank" rel="noopener noreferrer"> https://www.census.gov/library/publications/2019/demo/p60-267.html </a>
                      <br/>
                      3. <a href="https://www.enterprisecommunity.org/opportunity360" target="_blank" rel="noopener noreferrer"> https://www.enterprisecommunity.org/opportunity360 </a>
                      <br/>
                      4. <a href="https://www.bls.gov/news.release/pdf/empsit.pdf" target="_blank" rel="noopener noreferrer"> https://www.bls.gov/news.release/pdf/empsit.pdf </a>
                      <br/>
                      5. <a href="https://www.bls.gov/charts/employment-situation/civilian-unemployment-rate.htm" target="_blank" rel="noopener noreferrer"> https://www.bls.gov/charts/employment-situation/civilian-unemployment-rate.htm </a>
                      <br/>

                </Header>

              </Header.Content>
            </Header>
  
          
        </div>
        <Notes />

      </Container>
    }






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
                      1. <a href="https://www.cdc.gov/coronavirus/2019-ncov/covid-data/investigations-discovery/hospitalization-death-by-race-ethnicity.html" target="_blank" rel="noopener noreferrer"> 
                          https://www.cdc.gov/coronavirus/2019-ncov/covid-data/investigations-discovery/hospitalization-death-by-race-ethnicity.html 
                        </a>
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
                      3. <a href="https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/older-adults.html#:~:text=In%20general%2C%20your%20risk%20of,aged%2065%20years%20and%20older" target="_blank" rel="noopener noreferrer"> 
                          https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/older-adults.html#:~:text=In%20general%2C%20your%20risk%20of,aged%2065%20years%20and%20older 
                        </a>


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
                                <p style = {{marginLeft: 0, fontSize: "14pt", fontWeight: 300, lineHeight: "16pt", lineSpacing: 0}}> 
                                  Figure 1: COVID-19 outcomes in all the 62 counties where conferences are located versus other counties. 
                                  Data sources from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a>  
                                  </p>
                
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
                                <p style = {{marginLeft: 0, fontSize: "14pt", fontWeight: 300, lineHeight: "16pt", lineSpacing: 0}}> 
                                  Figure 2: COVID-19 outcomes among counties where schools in each of the Power Five Conferences 
                                  are located and counties where none are located. 
                                  Data sources from the <a style ={{color: "#397AB9"}} href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank" rel="noopener noreferrer"> New York Times Coronavirus (Covid-19) Data </a></p>

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
    </div>)
    }
    else {
      return <Loader active inline='centered' />
    }
    ;
}
