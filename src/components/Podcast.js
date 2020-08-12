import AppBar from './AppBar';
import Notes from './Notes';
import { useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Container, Grid, List, Divider, Image, Breadcrumb, Header, Segment } from 'semantic-ui-react'


export default function AboutUs(props){
  const history = useHistory();
  let {podcastTitle} = useParams();

  return (
    <div>
    <AppBar/>
    {podcastTitle == "Dr.Carlos_Del_Rio_on_COVID-19_Equity_&_Outcomes"&&
      <Container style={{marginTop: "8em", minWidth: '1260px'}}>

      <Breadcrumb style={{fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt"}}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{fontSize: "14pt"}}/>
            <Breadcrumb.Section active>Podcast</Breadcrumb.Section>
      </Breadcrumb>
        <div width = {888}>
        
            <Header style={{width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400}}>
              <Header.Content>
                Dr. Carlos Del Rio on COVID-19 Equity and Outcomes
                <Header.Subheader style={{fontSize: "18pt", fontWeight: 300, paddingTop: "15px"}}>


                </Header.Subheader>
                <div style = {{paddingTop: 10}}>
                  <iframe src="https://anchor.fm/rsph-ched/embed/episodes/Dr--Carlos-Del-Rio-on-COVID-19-Equity-and-Outcomes-ehuljb" height="150px" width="800px" frameborder="0" scrolling="no"></iframe>
                </div>

                <Header style={{fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0}}>

                      <p style={{textAlign:"left", fontWeight: 300}}>

                      By Leanna Ehrlick on Aug. 10, 2020

                      <br/>
                      Contributors: Pooja Naik, K.M. Venkat Narayan, Shivani A. Patel
                      <br/>
                      From Emory University

                      <br/>

                      </p>

                      <br/>
                      <b>Transcript</b>
                      <br/>
                      <br/>

                      <b>Leanna: [00:00:00]</b> Welcome to the first. Health Equity and outcomes COVID-19 Podcast. 
                      On this episode we talked to Dr. Carlos Del Rio, a distinguished professor of medicine in 
                      the division of infectious diseases at Emory University School of Medicine and Executive 
                      Associate Dean for Emory at Grady Hospital. He is also Professor of Global Health in the 
                      Department of Global Health and a Professor of Epidemiology at the Rollins School of Public Health.
                
                      <br/>
                      <br/>
                      <br/>

                      <b>Carlos del Rio: [00:00:26]</b> It's just been so hard to see how how disproportionate impact this epidemic 
                      has had in minority populations. We're not shocked we're not surprised because health equity in 
                      Health inequalities are...you know part of everyday everyday life right. The reality is is is 
                      it's been just a just really start to see how different the risk is to individuals how different 
                      the disease is how different the mortality is and you know there was an article in New York Times 
                      that really dug deep into this and I think it really highlighted for many of us how these differences 
                      are are really very real. You know how how much more at risk somebody who is Hispanic or African-American 
                      is compared to somebody who is white. Just to give you an idea you know we're seeing you know about about 
                      73 cases per 10000 people population in Latinos we're seeing twenty three cases per 10000 population of 
                      whites. Furthermore the disease in whites is primarily among older individuals and the disease in in in 
                      blacks and Latino population is really among all age groups including people in the ages of 40 50 so younger 
                      people. So what we're also seeing in our country is that the mortality of people with COVID is much younger 
                      than many other places in the world. And that's because of the disparity.

                      <br/>
                      <br/>
                      <br/>

                      <b>Carlos del Rio: [00:01:57]</b> So I think if COVID tells us something is that we need to really 
                      at the root address and and and eradicate and really begin to take seriously the racial disparities 
                      that have existed for such a long time.

                      <br/>
                      <br/>
                      <br/>

                      <b>Leanna: [00:02:12]</b> I'm really curious like what you see as I guess the future of the 
                      pandemic response taking into account these inequities.

                      <br/>
                      <br/>
                      <br/>

                      <b>Carlos del Rio: [00:02:20]</b> Well you know I think what we need to realize is that we have multiple 
                      pandemics in this country. We have several pandemics and each community has to have a different approach. 
                      And we need to think about how do we involve the community. How do we really have a true community response. 
                      How do we truly have a community participation. How do we make sure the community that we work with community 
                      in addressing the pandemic because this is not going to be solved from from the top down. This is going to be 
                      solved with community participation. So as we look at for example vaccine studies my biggest fear is that we're 
                      not going to be involving the community as much as we should because we really need the community to be front 
                      and center in the response. I mean we have you know among the African-American population there's been mistrust 
                      from just keep you down. Right. So. 

                      <br/>
                      <br/>
                      <br/>

                      <b>Leanna: [00:03:12]</b> Yes.

                      <br/>
                      <br/>
                      <br/>

                      <b>Carlos del Rio: [00:03:12]</b> So you know you're gonna go in there with a vaccine. 
                      It's gonna be difficult so we have to work with community to educate them and to make them understand why this is important.

                      <br/>
                      <br/>
                      <br/>

                      <b>Carlos del Rio: [00:03:21]</b> And I think that one thing that to me is is very significant is how 
                      you know a place like like Grady has which has responded to African-American populations and has done 
                      this for a long time. What we've seen here is we haven't seen a higher higher impact of the epidemic. 
                      I mean we have seen a higher mortality among minorities. Right. The the the outcomes have been the same. 
                      And I think that's because we are we are. This is our population we're comfortable treating them. And 
                      therefore we've done a good job with them.

                      <br/>
                      <br/>
                      <br/>

                      <b>Leanna: [00:03:57]</b> Absolutely. Do you see there being a reality in the near future where we're 
                      testing catches up to cases either because cases are going down hopefully or because testing is significantly ramped up.

                      <br/>
                      <br/>
                      <br/>

                      <b>Carlos del Rio: [00:04:08]</b> They are. But you don't can't you can't ramp it up much more. 
                      The problem is you know the U.S. already is consuming 55 percent of the testing capacity of the world. 
                      So imagine if we all of a sudden consume even more. Wouldn't that be an inequity for the rest of the world. 
                      And it's just because we're not doing a good job controlling our epidemic that we need more and more testing. 
                      I mean the problem is you know we need a national strategy. And here's what would happen in our national strategy. 
                      You know the testing capacity up in Boston cannot be moved to Atlanta but if you had a national coordinator 
                      the testing capacity in Atlanta. So you would say oh Atlanta has too little testing capacity but Boston has 
                      too much. We'll take the swabs from Atlanta and ship them to Boston and get them run in Boston right.

                      <br/>
                      <br/>
                      <br/>

                      <b>Leanna: [00:04:48]</b> Yeah.

                      <br/>
                      <br/>
                      <br/>

                      <b>Carlos del Rio: [00:04:48]</b> But but that wouldn't require a national strategy which the president 
                      from day one said it's gonna be a state strategy. And I think having a state strategy has been one of the 
                      biggest problems in our country because by having a state strategy we essentially have 50 strategies and 
                      we don't have any way to actually you know consolidate and synergize and help each other out.

                      <br/>
                      <br/>
                      <br/>

                      <b>Leanna: [00:05:11]</b> Do you think right now is the biggest change that could be made in the US 
                      either within population health or in the medical system or public health system to change the course of the pandemic? 

                      <br/>
                      <br/>
                      <br/>

                      <b>Carlos del Rio: [00:05:21]</b> We need rapid turn around in testing and we need quick very efficient 
                      and well done contact tracing. We're not doing contact tracing the way it's supposed to be done where we're 
                      essentially are wasting what would be the benefits of contact tracing by not doing it the right way.

                      <br/>
                      <br/>
                      <br/>

                      <b>Leanna: [00:05:38]</b> Well this has been such an interesting conversation. Thank you for joining 
                      the podcast today and sharing your experience and perspective with us.




                </Header>
              </Header.Content>
            </Header>
  
          
        </div>
        <Notes />

      </Container>
    }
    </div>);
}
