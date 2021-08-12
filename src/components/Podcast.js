import AppBar from './AppBar';
import Notes from './Notes';
import { useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Container, Grid, List, Divider, Image, Breadcrumb, Header, Segment } from 'semantic-ui-react'


export default function AboutUs(props) {
  const history = useHistory();
  let { podcastTitle } = useParams();

  return (

    <div>
      <AppBar />
      {podcastTitle === "Maria_Sundaram_about_COVID-19_restrictions" &&
        <Container style={{ marginTop: "8em", minWidth: '1260px' }}>

          <Breadcrumb style={{ fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt" }}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{ fontSize: "14pt" }} />
            <Breadcrumb.Section active>Podcast</Breadcrumb.Section>
          </Breadcrumb>
          <div width={888}>

            <Header style={{ width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400 }}>
              <Header.Content>
                “We need to use every tool in our toolbox”: A conversation with Dr. Maria Sundaram about COVID-19 restrictions, travel, and protecting children from COVID-19.

                <Header.Subheader style={{ fontSize: "18pt", fontWeight: 300, paddingTop: "15px" }}>


                </Header.Subheader>
                <div style={{ paddingTop: 10 }}>
                  <iframe src="https://anchor.fm/rsph-ched/embed/episodes/We-need-to-use-every-tool-in-our-toolbox-A-conversation-with-Dr--Maria-Sundaram-about-COVID-19-restrictions--travel--and-protecting-children-from-COVID-19-e15442k" height="150px" width="800px" frameborder="0" scrolling="no"></iframe>                </div>

                <Header style={{ fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0 }}>

                  <p style={{ textAlign: "left", fontWeight: 300 }}>

                    By Gaëlle Sabben on July. 09, 2021

                    
                    <br />
                    From Emory University

                    <br />

                  </p>

                  <br />
                  <b>Transcript</b>
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:00:00] </b> Welcome back to the COVID-19 Health Equity dashboard podcast. My name is Gaëlle Sabben. Today we'll be talking about COVID-19 among younger people, with Dr. Maria Sundaram. Dr. Sundaram is an infectious disease epidemiologist and postdoctoral fellow at ICES in Toronto, Canada. She specializes in respiratory virus epidemiology and vaccines, including those against influenza and COVID-19. Dr. Sundaram welcome.



                  <br />
                  <br />
                  <br />

                  <b>Dr. Maria Sundaram: [00:00:25] </b> Oh, thank you so much.

                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:00:27] </b>Could you tell us a little bit about your background and the work you've been doing with regard to COVID-19?
                  <br />
                  <br />
                  <br />

                  <b>Dr. Maria Sundaram: [00:00:32] </b> Sure, so from 2011 to 2014 I was a research epidemiologist at Marshfield Clinic which is a small clinic in central Wisconsin and this clinic is really special because they do the yearly vaccine effectiveness estimates for flu vaccine along with four other sites across the US. So that's where I got my start in infectious disease epidemiology I got my PhD in infectious disease epidemiology at the University of Minnesota in 2018. I've been doing a couple of postdocs and being a respiratory virus epidemiologist during this really unusual pandemic time has been... It's been interesting in about 100 different ways.

                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:01:16] </b> What are a couple of those ways?

                  <br />
                  <br />
                  <br />

                  <b> Dr. Maria Sundaram: [00:01:19] </b> One of the biggest ones is that you know we, infectious disease epidemiologists, have been beating the drum for quite a while now about the risk of a pandemic due to a respiratory virus. We kind of all assumed that that would be influenza because we know influenza has very clear demonstrated pandemic potential. I find myself wishing that more of my classes and more of the conference symposia and more of the discussion in general had focused on coronaviruses because I think in retrospect it is quite clear that they also had pandemic potential.

                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:01:55] </b> So, we're reaching a point in the pandemic where, particularly in the US, with increased access and increased uptake of vaccines. A lot of the restrictions are being lifted. So, I wanted to get your thoughts on the on the shift in guidance and your thoughts on, for example increases in travel or relaxing of restrictions at this point.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Maria Sundaram: [00:02:15] </b> It's challenging to say, well, you know, like, “oh, they're good” or “oh, they're bad”. I mean, obviously, as we've seen this pandemic is very complex and this situation is constantly changing. And so, I don't want to be my sort of standard fun police and say, “Oh, you know, we really need to continue to be careful.” I think relaxing of restrictions is a very important component of the timeline of this pandemic response when we have a lot of people vaccinated when we have low community level transmission, that's when we can feel comfortable to relax some of these components, but I think what's happening in Australia right now with outbreaks due to the Delta variant despite extremely strong contact tracing strategies and other pandemic control strategies, that really illustrates to us like the importance of staying vigilant even when it kind of feels like we're done with the pandemic because the pandemic ultimately is not quite done with us yet.

                  <br />
                  <br />
                  So, I think you know it's a little bit of like you know, yes, cautious optimism, right? I mean, if there's no community level transmission, if we have an extremely highly vaccinated population then we should be able to relax some of these restrictions, but we have to have that infrastructure in place to support that relaxation. So, we have to have the infrastructure that supports contact tracing that supports PPE for essential workers and for health care workers. You know that gives us all of these other sort of lines of defense.

                  <br />
                  <br />
                  <br />


                  <b>Gaëlle Sabben: [00:03:52] </b> You mentioned the Delta variant. Could you talk a little bit more about any increased risk or kind of how that's changing the situation in certain areas?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Maria Sundaram: [00:04:04] </b> Yeah, so the Delta variant like some other variants of concern, has shown an increased transmission and so it's really very challenging to think of this variant in terms of what we already know about COVID, right? We've structured our pandemic response to a version of this virus that was less transmissible than what we're seeing now and we've also structured our vaccines to that version of the virus. That's not necessarily a bad thing, but I think it's really important, again, to remain kind of flexible and agile towards these changing environments.

                  <br />
                  <br />


                  Delta variant is a good example of a variant that is more transmissible and therefore could cause a lot more havoc than the original version of this virus. And so again, this is kind of like another like really good reason for us to then make sure as we relax restrictions that we have all of these other control and protection mechanisms in place.

                  <br />
                  <br />
                  <br />



                  <b>Gaëlle Sabben: [00:05:01] </b> That's very helpful. The Delta variant is also coming at a time when, for example, in the US, people are really talking much more about travel, especially families that maybe have been staying home, being very careful for the last 15 months or so, and so they're feeling like with relaxing restrictions, with increased vaccines that they can take vacations, especially maybe with school-aged children during the summer. What advice would you have for a family that's trying to decide whether they should be traveling?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Maria Sundaram: [00:05:31] </b> Oh, this is the tough one, right? And a lot of these circumstances are going to be really context specific. You know, a three-hour car ride to grandma's house is a different travel environment than like, you know, an international flight that lasts 12 hours, let's say, or you know, more than one international flight. The things that are really important to keeping in mind when we're thinking about how to travel safely are, let's kind of keep stock of all of the tools that we have to prevent COVID-19 transmission to us and from us, right? So, to us would include, like if we're all eligible. Let's make sure that all of us are fully vaccinated before we travel.
                  <br />
                  <br />
                  That's a huge chunk of peace of mind, right there, but then also considering if there is a delta variant circulating in the community that we're in, or the community that we're about to travel to, or any community along the way that poses an additional risk that you know was not part of the original sort of pandemic control response strategies, right? So, it's really good again to have those additional measures in place that includes masking, that includes hand washing. That includes trying to limit your time indoors with other people. That includes trying to improve ventilation. These kinds of things as well, and then just kind of keeping in mind that whatever community you might be visiting may be more vulnerable than you.
                  <br />
                  <br />
                  Vaccine equity has been a huge problem in our pandemic response. I'd say most places outside of the US do not have the same access to vaccines that Americans do, and so we cannot expect other communities to be behaving in the way that people can sometimes behave in the US with reductions in pandemic control strategies. So, I think it's also really, really important when you're traveling to consider the risk you might be posing to others and try to limit that as much as possible.
                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:07:26] </b> Good point and good advice for people planning that, especially with international travel. With those countries that are opening borders or relaxing restrictions for fully vaccinated individuals from certain countries, including the US. Would those be situations in which travel would be maybe less of a concern, even though the communities that people are going into might still have more restrictions or might have lower vaccine access?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Maria Sundaram: [00:07:53] </b> So, one example could be the US and Canada. There's a lot of you know in normal times there's a lot of cross border commuting, as well as, sort of travel for vacation purposes. And I would say the majority of the Canadian population lives pretty close to the US Canada border. So, for Americans that are traveling to Canada, for example, if they're allowed to enter the country, they need to consider the fact that they may have had an opportunity to be fully vaccinated, whereas someone in the area that they're traveling to may not have had that opportunity yet. Vaccine rollout has been a little bit slower in Canada compared to the US. Depending on the community that they're going to, it might have a really high prevalence of people who have been on the short end with regard to vaccine equity, so this includes people of color as well as people who are working. What I call “essential jobs” and what we call essential jobs. But then we failed to sort of support the essential nature of those jobs, with PPE with vaccines, et cetera.
                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:08:54] </b> Right.
                  <br />
                  <br />
                  <br />

                  <b>Dr. Maria Sundaram: [00:08:55] </b> So kind of an overall assumption that because Canada is a rich country and because there is access to vaccines in Canada that the risk to Americans versus Canadians is the same. I don't think that that's correct. The risk, for example, in a in a bigger city versus a smaller community is also not comparable, and so these are kind of like these unique components that are really context specific that I think people really do need to investigate.
                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:09:24] </b> Sure, that's something that hopefully people will be looking at. Kind of shifting it slightly when we're thinking about families traveling. You mentioned that if people are eligible, they should be getting vaccinated. There have been fewer opportunities, potentially for younger people to get vaccinated, since the three vaccines that have been authorized in the US were primarily authorized for ages 18 and up. There's one vaccine that's been approved for 12 to 15, which is the Pfizer BioNTech.
                  <br />
                  <br />
                  Moderna filed for emergency use authorization for their vaccine for that same age range recently. Do you expect that vaccine to also get authorized for younger adolescents?
                  <br />
                  <br />
                  <br />
                  <b>Dr. Maria Sundaram: [00:10:04] </b> It's tough to know without seeing the documentation from the EUA application, whether it's likely to be, you know, to get any authorization or not, and luckily for me, that decision is above my pay grade and it's made by wonderful folks at FDA, including the people that serve on the VRBPAC committee, it's the Vaccines and Related Biologic Products Advisory Committee.

                  <br />
                  <br />
                  That being said, I mean there are obvious advantages to making sure that children can be vaccinated. One of those is that children are what we call high degree nodes in contact networks. So, this means that when we mix together in groups of people, when people sort of like have different contacts. Children, especially children under five, are the people in a population that tend to have the most number of contacts and that makes sense? They have a bunch of friends. They have their parents and there are other family members they might have grandparents. They might have people at daycare. There's a lot of other, you know, sort of social interactions that children tend to have, and when we talk about COVID-19 and children and you know, I, I think the evidence would suggest that severe disease is not as much of a concern for COVID as it is for something like influenza or RSV, which is another respiratory virus. But thinking from a population perspective, they do still play a really important role in pandemic control because they are kind of super high contact individuals if that makes sense, so that's another really good reason to make sure that vaccines are available to children and adolescents in particular. So, I've got my fingers crossed that that works out for Moderna.
                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:11:52] </b> That would be great. Certainly giving more people access to preventive measures seems like it can mostly only be good. Sort of related to that, there have been a few reports and CDC came out with an MMWR last week about some reports of heart inflammation, myocarditis and pericarditis in younger people, especially, I believe young men under 16, after receipt of one of the mRNA vaccines. Could you offer some insights on this and why it might be happening?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Maria Sundaram: [00:12:25] </b> So, I think one of the most logical things is to ask “What is myocarditis?” for those who may not be familiar with this term. It is an inflammation of heart muscle. Pericarditis is very similar. It's inflammation of the area around the heart. What we know about myocarditis is that it is not completely unheard of and it happens. We know that it happens after infection with respiratory viruses. So, for example, we know that myocarditis can be caused by influenza infection so much so that we can consider influenza vaccine to almost be a vaccine against heart attacks.

                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:13:07] </b> Wow

                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:13:08] </b> So, this is a really very strong, very well-known relationship between influenza virus and myocarditis. We know that other respiratory viruses can cause myocarditis including COVID-19 infection, so people can get myocarditis after COVID-19 infection. Outcomes of myocarditis after mNA vaccination, specifically in younger adults, specifically in younger males, are extremely rare, but they're absolutely worth investigating because we have to compare the risk of getting myocarditis after COVID-19 or the risk of other bad outcomes from COVID-19 infection to this outcome that could be associated with a vaccine. It's currently being investigated.

                  <br />
                  <br />
                  Another really important thing to know about myocarditis is that usually people that have myocarditis, especially younger people, after their symptoms, improve, they can usually return to their just normal daily life, and we know that's not always the case for people who have COVID-19 infection. In fact, it's quite common for people that recover from COVID-19 to have longer-term effects that could last for an unknown length of time.
                  <br />
                  <br />
                  So again, this is kind of one very good example of like how it's important to balance this sort of risk that we are currently investigating versus the known risk of myocarditis and other severe outcomes in this age group, in particular due to COVID-19.
                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:14:39] </b> Right.

                  <br />
                  <br />
                  <br />
                  <b>Dr. Maria Sundaram: [00:14:40] </b> So, what the CDC says right now while they're investigating this is that they're continuing to recommend vaccination for everyone 12 years and up because the risk of COVID-19 illnesses and related complications is so high, even in this younger age group.
                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:14:57] </b>Just linking that back to the Moderna filing. Do you think that these reports of heart inflammation on younger people who would fall into the age group that would newly be eligible for Moderna? Do you think that's going to play a role in the approval process for Moderna?

                  <br />
                  <br />
                  <br />
                  <b>Dr. Maria Sundaram: [00:15:13] </b> Oh yeah, absolutely. I absolutely think it will. So, for EUA authorization the value of the evidence, the kind of the weight of the evidence has to be such that the benefits outweigh the risks. And one of the risks could be this myocarditis outcome, that seems like you know once your symptoms subside you can kind of go back to normal daily activities. That's something that is going to be sort of balanced with the potential benefit of vaccination in this population, and so that will certainly be weighed. It's my opinion and I suspect it will be the opinion of the VRBPAC committee as well that the benefits still outweigh the risks. But that's something that they'll have to decide, sort of a priori, explicitly.

                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:15:57] </b> So, it sounds like if a parent of an adolescent, or if you had an adolescent, was asking for your advice, you would still suggest that they get their kid vaccinated with one of these vaccines, should it be authorized.

                  <br />
                  <br />
                  <br />
                  <b>Dr. Maria Sundaram: [00:16:06] </b> Yes, if I had a child who was 12 or up, I would still have them get vaccinated. You know, I think it's absolutely completely understandable to feel a little nervous about it, to have questions, to want those questions answered, and there actually are quite a good number of answers to those questions on the CDC website and on the Emory website as well. You guys have been doing a wonderful job, but, you know, it's also helpful to maybe have a conversation with your doctor, with your child’s doctor if you have more questions.
                  <br />
                  <br />
                  It's important for us to say, hey like that's normal and understandable that you have questions. We as scientists should be more understanding of that than anyone else because that's all we do is ask questions and try to answer them. So, I think that's really important to acknowledge and, but it's possible to answer those questions.
                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:16:57] </b> Talking about travel with young people and then talking about young people getting vaccinated, it's kind of a natural next question to ask if you have any thoughts about the return to school in the fall or young people returning to school in person in the fall.

                  <br />
                  <br />
                  <br />
                  <b>Dr. Maria Sundaram: [00:17:09] </b> The existing data support, again, that children are these, what we call “high degree nodes” in contact networks. That means that they just come in contact with a lot of people and they tend to facilitate the spread of respiratory viruses in populations as a result of that. Existing good evidence indicates that children above the age of 10 can transmit this virus potentially as efficiently as adults, even if they are at reduced risk for these severe outcomes. Existing evidence does indicate that children can have severe outcomes and that can be very scary for parents. Again, it's not the same sort of frequency or prevalence as in older age groups, but I know that you know we may have a different risk tolerance also, for the people that are our children. 
                  <br />
                  <br />
                  So, these are things that are on my mind as we're discussing, you know, back to school. I think that if we do wind up going back to school in person again, we need to have this perspective that is not just about vaccination. We need to use every tool in our toolbox. So, that includes improved ventilation in schools. That may include things like cohorting. That certainly includes things like regular extremely easily accessible testing and very high-quality contact tracing in the event that an infection in the school does occur. You know, obviously at some point we will be back in school in person. We need to make sure that we can do that in the safest possible way.
                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:18:42] </b> So, should there be a vaccine available to, if possible, get that vaccine before going back to school in person?

                  <br />
                  <br />
                  <br />
                  <b>Dr. Maria Sundaram: [00:18:50] </b> Yeah.
                 
                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:18:51] </b> Well, great. Thank you so much, this is very helpful.
                 
                 <br />
                 <br />
                 <br />
                 <b>Dr. Maria Sundaram: [00:18:55] </b> You're more than welcome.
                 
                 <br />
                 <br />
                 <br />



                </Header>
              </Header.Content>
            </Header>


          </div>
          <Notes />

        </Container>
      }



      {podcastTitle === "Bob_Bednarczyk_about_Covid-19_Vaccine_Uptake" &&
        <Container style={{ marginTop: "8em", minWidth: '1260px' }}>

          <Breadcrumb style={{ fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt" }}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{ fontSize: "14pt" }} />
            <Breadcrumb.Section active>Podcast</Breadcrumb.Section>
          </Breadcrumb>
          <div width={888}>

            <Header style={{ width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400 }}>
              <Header.Content>
                “Going beyond the benchmarks: What it takes to get Americans vaccinated”: A conversation with Dr. Bob Bednarczyk about COVID-19 vaccine uptake.

                <Header.Subheader style={{ fontSize: "18pt", fontWeight: 300, paddingTop: "15px" }}>


                </Header.Subheader>
                <div style={{ paddingTop: 10 }}>
                  <iframe src="https://anchor.fm/rsph-ched/embed/episodes/Going-beyond-the-benchmarks-What-it-takes-to-get-Americans-vaccinated-A-conversation-with-Dr--Bob-Bednarczyk-about-COVID-19-vaccine-uptake-e14hg7j" height="150px" width="800px" frameborder="0" scrolling="no"></iframe>                </div>

                <Header style={{ fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0 }}>

                  <p style={{ textAlign: "left", fontWeight: 300 }}>

                    By Gaëlle Sabben on July. 09, 2021

                    <br />
                    Contributors: K.M. Venkat Narayan, Shivani A. Patel
                    <br />
                    From Emory University

                    <br />

                  </p>

                  <br />
                  <b>Transcript</b>
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:00:00] </b> Hi, my name is Gaëlle Sabben with the COVID-19 Health Equity Dashboard Podcast.
                  <br />
                  <br />
                  Today we're talking to Dr. Robert Bednarczyk, an associate professor of global health and epidemiology at the Rollins School of Public Health. Welcome Dr. Bednarczyk.


                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:00:17] </b> Thank you, Gaëlle.

                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:00:19] </b> Could you tell us a little bit about your background and your work in vaccines and both during the COVID-19 pandemic and previously?
                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:00:27] </b> Yes, so I've been studying the uptake of vaccines and the determinants around that uptake, including vaccine hesitancy for approximately 15 years. Now, I'm going back to [when I was] doing my doctoral studies in infectious disease epidemiology and one of the things that really came together for me was working on my PhD in epidemiology in 2009, when the H1N1 influenza pandemic occurred and that gave me the opportunity to work both with the New York State Health Department on their pandemic response as well as the other position that I was working at the time which was assistant to the Chair for the US National Vaccine Advisory Committee, so I was able to see both state and federal response to a pandemic, including a vaccine rollout and a lot of the lessons that were learned during that time have really come in handy as we've thought through the earliest stages of the COVID-19 pandemic now, leading up to the current days of mass vaccine rollout across the US.

                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:01:33] </b> And what are some of the lessons that you've seen applied from the H1N1 pandemic to the vaccine rollout now?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:01:39] </b> I think one of the biggest lessons is to be able to understand and embrace uncertainty, especially with as much as things change on a day-to-day basis, and in some cases a minute-to-minute basis, where we know that what we knew yesterday may not be the same as what we're going to know today, and we saw that come through in the earliest days of the pandemic, and we really saw a lot of that come through with the rollout of the vaccines, uncertainties around, vaccine availability, uncertainties around vaccine allocation, and the specific recommendations on who should be first in line to get vaccinated and how we would get vaccines out to those individuals.

                  <br />
                  <br />


                  So, sadly I think a lot of the lessons that we learned in 2009 were in the back of people's minds, but it did feel a little bit like, through COVID-19, we've been having to reinvent a lot of these processes, and I'm hoping that we can learn from this, so that, should another pandemic occur, we'll be much better prepared to move forward much faster.


                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:02:47] </b> You're pointing out some of the some of the lessons that were maybe learned and not applied, or that there'll be a lot more lessons to learn from COVID-19. Can you speak to any of the successes that you've seen in the vaccine rollout for COVID-19, and whether maybe some of those reflected lessons that were learned in H1N1 or maybe just new developments that have really struck you as being very positive?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:03:11] </b> In 2009 one of the big differences that we saw was that that was a pandemic that mostly affected younger individuals, primarily children and adolescents, where we have a very strong vaccination infrastructure. So, we know that we have a network of pediatricians who are available to vaccinate, we have the networks through the Vaccines for Children Programs for example, and I think that when COVID-19 emerged and we started to realize that the populations that were going to be most greatly affected were typically adults, and in many cases older adults, it changed a little bit on how we thought about some of the vaccine allocation and vaccine distribution.

                  <br />
                  <br />
                  So, I think that's a situation where maybe some of the lessons that were learned were not as readily applicable, but I think that we did a very good job of adjusting to the situation with COVID-19 in terms of getting state immunization information systems onboard; with getting you know new vaccine distribution systems going so whereas in 2009 we saw a lot of use of traditional pediatric office-based vaccine services. Here we saw a little bit more of the rollout of mass vaccination sites, more engagement with pharmacies, and I think that some of that was really built off what had come out of 2009, where some of those systems were tested maybe for the first time. It may not have been used as widely, but it gave us a solid base to move forward on, and I think that was one of the places where we've seen some success with COVID-19 vaccine distribution.

                  <br />
                  <br />
                  <br />


                  <b>Gaëlle Sabben: [00:05:05] </b> That's great that’s been able to work out that way. At this point, looking at the latest data, it looks like we've reached about 53% partial or full vaccination for the US as a whole and we've got about just under 45% that are fully vaccinated. One of the goals of the new administration was to get 70% of Americans vaccinated by July 4th, which is at this point in about 2 weeks. Based on where we are now, does that number seem doable nationally to you?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:05:33] </b> I think that it is doable if we come together and if we have a very strong commitment, not just within public health, but across the entire population. A commitment to protect ourselves and protect our communities and protect our neighbors. Going out and getting vaccinated. One piece of data that I saw just this morning that I think was pointing us in the right direction is that currently 14 states have reached that 70% benchmark, so this is showing that it can be achieved. It's showing that we can reach these goals where there is a strong commitment.

                  <br />
                  <br />


                  I think in places where we are falling behind, we have to do a better job of going out, speaking with the community, working with community leaders, reaching out through all of our networks, and not just through our public health networks, but through our community networks, our faith communities, etc. to really get the message out there that we have a safe and effective vaccine that is widely available, which I think is very different than where we were at just a few months ago where there were so many issues with making appointments and scheduling to get vaccinated.

                  <br />
                  <br />


                  Now we have vaccine available, there still are some issues in terms of geographic equity of just individuals who may not be able to easily get to a vaccination site, but there's been work done in in that regard. You know here in DeKalb County, the DeKalb County Board of Health, for example, is running mobile vaccination clinics where they can actually go out to individuals who may be homebound individuals who may not be able to get to a vaccination center to get them vaccinated. So, seeing some of these new initiatives really gives me hope that we can reach a broader part of the population.

                  <br />
                  <br />
                  <br />



                  <b>Gaëlle Sabben: [00:07:41] </b> You mentioned that there's certain areas that, 14 states I believe you said that have reached 70%. What are some areas that you're concerned are lagging behind? So are there particular states that you're concerned about, or is it more within states there's geographically certain areas that are struggling more than others to get vaccines out or to increase vaccine uptake?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:08:03] </b> Some of the states where we've seen a lot of success tend to be more densely populated states or states with smaller populations overall where it is just easier to do that outreach, and when we see that across areas of the American South and Midwest where you don't have that same population density where it's, there's just more distance to go to get to medical care and to get to vaccination centers. I think maybe a challenge that we need to continue facing. When you consider that in light of vaccine hesitancy when you consider that in light of individuals who may not trust the vaccine or trust the systems that are supporting these vaccination efforts, it really highlights the need for doing this committed community-based outreach to speak with these individuals and to speak with these populations to really be able to listen to their concerns and answer their questions so that we hopefully can reach these goals through much greater vaccine availability and access.

                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:09:17] </b> So in addition to, geographically, some concerns about less densely populated states, having trouble with access or reaching people who are maybe farther from a clinic or farther from a center where they can get access to vaccines, what are the patterns, if any, that we're seeing in terms of vaccine uptake or vaccination coverage demographically? You've pointed to certain differences that were geographic, but are there demographic differences or is it kind of similar across the country?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:09:49] </b> We've seen some differences in the typical health disparities that we often observe where we are seeing lower vaccine uptake among African American and Latinx populations. But even along with that we've seen a lot of vaccine hesitancy coming from, in particular, white Evangelical Christians. So. this is showing us that these concerns about the vaccine are not limited to just one section of the population, but they are very wide ranging, and I think that when we look at these demographic differences in vaccine uptake, it helps us to identify communities where we need to do a better job of outreach, but I think it's important to remember that these communities are not identical in terms of their vaccine attitudes, even within these communities, and some people may be more accepting and some people may be less accepting even within these demographic groupings.

                  <br />
                  <br />
                  I bring that up because it's important to not just rely on the shorthand of looking at these demographic categories and saying, “Well, this group isn't getting vaccinated enough;” we need to understand the complexity of some of that, so a lot of the work that we're doing and all of our colleagues are doing is really trying to use some of these initial demographics to help identify communities where we need to do a better job of outreach, but then not assuming that everyone is going to think or feel the same within these communities. And really, going out to the communities and speaking with them so that we can understand specific concerns that they may have so that we can better address those.

                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:11:35] </b> So you're talking about hesitance and people maybe needing to be reached out to a little bit more to talk about the vaccine is do you feel like what's driving low vaccination uptake in certain areas or in certain populations is mostly due to vaccine hesitancy or is it access to vaccines? Is it a combination and   is that similar for all the different demographics that you mentioned? Are there specific issues for specific populations?
                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:12:04] </b> OI think that there are some specific issues for some specific populations. With generations of systemic racism and medical maltreatment, that can lead to a lack of trust in the vaccination systems among the African American population in a greater level than we may see for other demographic groups, but again, these groupings are not going to all going to be seeing the same way and some of the concerns that we see maybe moving outside just a lack of trust in the vaccine, or a lack of belief in the safety of the vaccine, but maybe just personal risk benefit calculation. If they've made it through this far in the pandemic and they haven't gotten sick, is it really worth going out and getting vaccinated?
                  <br />
                  <br />
                  I think these are personal decisions that people are making may not always be rooted in the best science. Just because you've made it through 15 months of the pandemic without getting infected doesn't mean that that that it can't happen tomorrow. And that's why it's so important for everyone to be as protected as possible, so we need to take some of those considerations into our work and also thinking about, again. access issues, the convenience of being able to get vaccinated when we look at groups like hourly workers and essential workers who may not always have access to paid sick time. You know, there's been a lot of attention paid to the side-effects after the COVID-19 vaccines, and some people may not feel that they could take a day or two off work if they ended up getting hit with a bad round of side-effects and because of that they may choose to take their chances and not vaccinating, so we need to be aware of all of these different perceptions and figure out the best way to address these concerns that may require much more tailoring as we go out and talk with different people.
                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:14:05] </b> That’s very helpful. Earlier you mentioned some of the more innovative ways that groups have been trying to reach communities, especially in cases of lack of access. You've mentioned mobile clinics, maybe larger vaccine clinics in certain areas that might have lower access. Are there any other, either creative or less creative ways that you've seen communities or states in the US as a whole that you think that you think are working?

                  <br />
                  <br />
                  <br />
                  <b>Dr. Bob Bednarczyk: [00:14:35] </b> Initially I think many of us in public health were caught by a little bit of surprise when we saw the state of Ohio announcing their lottery system for individuals who had gotten vaccinated against COVID-19, my initial reaction was that it's a good way to motivate people who maybe aren't hesitant about the vaccine, who believe that the vaccine is worth getting, but just need that extra push to get up, get in the car, go to a vaccination site and get the vaccine. What it may not address are some of the concerns around the effectiveness of the vaccine. The safety of the vaccine or trust in the systems that have produced the vaccine. And that's where I think that, you know, we need to be cautious in the amount of money and resources that are put into some of these very large incentive programs to ensure that we're not taking that money away from core public health functions.

                  <br />
                  <br />
                  Other organizations have started doing very similar types of incentives, but maybe on a smaller scale. We've seen Krispy Kreme Donuts, for example, announced that individuals who bring in their vaccination card can get free Donuts. There have been situations in Louisiana where there were crawfish giveaways for individuals who got vaccinated. There's actually even been some bars that have done a “shot for a shot” night where they had a mobile vaccination van set up and anybody who got vaccinated that night would get a free drink. And so, I think that there's been a lot of new opportunities to think outside the box and reach people where they're at.
                  <br />
                  <br />
                  And I think when we look at some of these issues of convenience of maybe individual complacency, you know going to people and reaching them where they're at, that instead of making them come out to you for the vaccine, may be a useful way to boost some of our vaccine uptake.
                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:16:28] </b> Do you see that as being helpful for people who are hesitant for reasons other than access? For example, for people who are maybe more hesitant, unsure about the effectiveness or unsure about side effects. Have you seen any incentives or any programs put into place to really reach those people that you feel have been effective?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:16:47] </b> I think that a lot of the outreach activities that that have been occurring, you know, especially when we see for African American and Latinx communities. For example, having community events where we see leaders in these communities getting vaccinated. So, people can now start to see people who look like them getting the vaccine that can go a very long way in terms of making this more normalized and establishing vaccination as a social norm. When you combine those events with education and with ease of access, we've seen a lot of successes in that regard. I think that all of these efforts that are being put in place are really starting to have an effect.

                  <br />
                  <br />
                  You know we've seen vaccine uptake increase, and I think with the data that you mentioned before, with about 53% of the entire US population having at least one dose of the vaccine, we're actually seeing about 65% of people 18 and older who have had at least one dose of the vaccine. And that recommendation has been in place for a little bit longer than for the 12- to 17-year-olds and, as of right now, individuals under 12 are not recommended for the vaccine. When we get out to the groups that we're really trying to reach, we're doing a very good job.
                  <br />
                  <br />
                  What we need to recognize now is that while vaccine numbers are going up and case numbers are going down, that doesn't mean that we can stop, that doesn't mean that we can be complacent. We've seen new variants of the virus emerge, and this gives us pause to recognize that but just because we may feel like we're done with the pandemic, the pandemic is not done with us until we can get all of the vaccine coverage up and that's why it's so important for everyone who is recommended for vaccination and able to get vaccinated to get the COVID-19 vaccine.
                  <br />
                  <br />
                  <br />

                  <b>Gaëlle Sabben: [00:18:44] </b> Good point. So, as you mentioned earlier on, we've got about 14 states, they've reached the 70% threshold, and so some states have started completely opening up and removing the remaining restrictions. Do you feel like the threshold of 70% or 80% depending on the state for reopening, is a good one?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Bob Bednarczyk: [00:19:03] </b> So pinning, reopening to a specific vaccine coverage benchmark may miss a few important considerations. One just because 70% of a state is vaccinated doesn't mean that that other 30% are evenly distributed across the state and if those individuals are living in closer proximity to each other, if they tend to be clustered closer to each other, it's easier to see local outbreaks of disease occur among those groups, so that's one thing that I think that we need to be very aware of.

                  <br />
                  <br />
                  The other thing is that if we pin everything to a singular benchmark number and we start getting closer to that number, my concern is that some people may say, well, we're so close and I really don't want to get the vaccine, but it seems like everybody else is getting it, so now I don't have to. And I don't want that to become normalized, so that's why I'm not a huge fan of linking everything to these benchmarks. I think the benchmarks are great to keep pushing us forward, but when we look at things like states reopening removing restrictions around businesses, whether it be the number of people allowed in a specific place or mask requirements, for example. It's important to know that once those restrictions are officially removed, just because the current CDC guidance says that fully vaccinated individuals can go about things without masks and without physical distancing, it doesn't mean that they have to. And if people still want to take some of those other precautions that only serves to help support the greater public health.
                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:20:47] </b> Lastly, bringing us back to what you were talking about at the very beginning about lessons learned from H1N1 that may or may not have been implemented for COVID, you mentioned that through this pandemic we were also learning new lessons about different issues, both for vaccines and kind of across the board. So, are there any lessons that you feel have been learned at this point that will be useful going forward, or anything else that you hope is kept in mind in terms of vaccine distribution, vaccine equity, and those kinds of areas of this pandemic for the future?

                  <br />
                  <br />
                  <br />
                  <b>Dr. Bob Bednarczyk: [00:21:19] </b> One of the big lessons that I think we've learned from this is that historically, much of our pandemic preparedness has focused around influenza pandemics, and now with the COVID-19 pandemic, it's highlighted for us that it's not just a situation of being concerned around influenza, where we have a vaccine that we've used for decades. It may not always be the best vaccine, but we have a long track record of using influenza vaccines and being able to adapt them pretty quickly. This pandemic I think, has shown us that there are many other possibilities of diseases that can emerge and can greatly impact us as a species, so having a broader view of what it means to be prepared is an important consideration moving forward.

                  <br />
                  <br />
                  I think that the ability to accelerate research that has been ongoing but may be sitting on the shelf a little bit more than we would have liked, such as the mRNA vaccines really gives us the ability to plan for future pandemics. And we've even seen a lot of vaccine manufacturers starting to think about ways to utilize this mRNA technology for other diseases that we haven't been able to successfully develop vaccines against, so I think that there are some very good opportunities that have come out of this pandemic, and I think that because of that it opens a lot of doors for greater protection of public health, not just in an emergency setting, but against maybe some of the more routine things that we face every year, like influenza.
                  <br />
                  <br />
                  One of the hard things that has come out though with these new technologies and the mRNA vaccines is learning how to communicate with the public about them, because it is a new technology, at least to be used on this large scale, and that's raised a lot of questions and it feels like throughout most of this pandemic, those of us who do this type of response or who study infectious diseases have been in a very reactive mode of addressing the issues when they come up as opposed to having the ability to be proactive and be able to get good messaging out there, so I'm hoping that that's one of the lessons we can take from this is that need to capitalize on a greater public awareness of science right now and use this to help you know, improve public understanding of public health and disease control and prevention.
                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:23:58] </b> Great. Do you think there's any larger lessons that are going to be applied to tackling health disparities? Whether it's for vaccine coverage or other health disparities that you are pointing to.

                  <br />
                  <br />
                  <br />
                  <b>Dr. Bob Bednarczyk: [00:24:07] </b> Throughout a lot of the outreach that has occurred during the COVID-19 pandemic, we've seen so much engagement of community organizations we've seen so much real work to bring people together and to bring these community partners together and what I'm hoping is that once we're able to fully emerge from COVID-19, that we don't lose all of that community engagement that that has come about, because I think that that would be a huge missed opportunity and one area where we can use these networks and we can use these linkages to address other important diseases and other areas where we see a tremendous amount of health disparities.

                  <br />
                  <br />
                  <br />
                  <b>Gaëlle Sabben: [00:24:54] </b> Well, on that note, thank you very much.

                  <br />
                  <br />
                  <br />
                  <b>Dr. Bob Bednarczyk: [00:24:56] </b> Thank you.

                  <br />
                  <br />
                  <br />


                </Header>
              </Header.Content>
            </Header>


          </div>
          <Notes />

        </Container>
      }

      {podcastTitle === "Katie_Kirkpatrick_on_economic_responses" &&
        <Container style={{ marginTop: "8em", minWidth: '1260px' }}>

          <Breadcrumb style={{ fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt" }}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{ fontSize: "14pt" }} />
            <Breadcrumb.Section active>Podcast</Breadcrumb.Section>
          </Breadcrumb>
          <div width={888}>

            <Header style={{ width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400 }}>
              <Header.Content>
                “You can't have good public health, but not have equity and economic growth”: A conversation with Katie Kirkpatrick about economic responses to the COVID-19 pandemic.

                <Header.Subheader style={{ fontSize: "18pt", fontWeight: 300, paddingTop: "15px" }}>


                </Header.Subheader>
                <div style={{ paddingTop: 10 }}>
                  <iframe src="https://anchor.fm/rsph-ched/embed/episodes/You-cant-have-good-public-health--but-not-have-equity-and-economic-growth-A-conversation-with-Katie-Kirkpatrick-about-economic-responses-to-the-COVID-19-pandemic-eooltg" height="150px" width="800px" frameborder="0" scrolling="no"></iframe>                </div>

                <Header style={{ fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0 }}>

                  <p style={{ textAlign: "left", fontWeight: 300 }}>

                    By Leanna Ehrlich on Jan. 11, 2021

                    <br />
                    Contributors: K.M. Venkat Narayan, Shivani A. Patel
                    <br />
                    From Emory University

                    <br />

                  </p>

                  <br />
                  <b>Transcript</b>
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:00:03] </b> Welcome back to the COVID-19 Equity and Outcomes podcast. Today we're talking to Katie Kirkpatrick, the President and CEO of the Metro Atlanta Chamber. We'll be hearing about what it's been like to run the Metro Atlanta Chamber during the pandemic, and what sorts of considerations have had to be made for economic development and support during these challenging times. Welcome, Ms. Kirkpatrick.

                  <br />
                  <br />
                  <br />

                  <b>Katie Kirkpatrick: [00:00:25] </b> Good morning. Thanks for having me.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:00:28] </b> Can you please first tell our listeners a little bit about your professional background and your work at the Metro Atlanta Chamber?

                  <br />
                  <br />
                  <br />

                  <b>Katie Kirkpatrick: [00:00:35] </b> It's interesting, when you when you introduced and talked about my role at the Metro Atlanta Chamber – interestingly enough, I became the president and CEO of the Metro Atlanta Chamber on June 15, 2020. So right in the middle of the pandemic, and now in hindsight, at the beginning of the pandemic; but prior to coming into that role, I was with the chamber for 13 years. In the public policy group, I ultimately was the chief policy officer for the Metro Atlanta Chamber working on public policy, government affairs, and political action on behalf of the business community. But my background and my educational degree, I'm an environmental engineer, and professionally licensed in a number of states, and really cut my teeth on public policy, through the environmental lens, and looking at Environmental Public Policy. So that's a little bit about my background.

                  <br />
                  <br />
                  <br />

                  From a chamber perspective, we are a business organization that focuses on economic development. And that is a wide range of activities from starting new companies, expanding those that are here, and also recruiting new ones to move to the region. Of course, I've touched on public policy, as an activity of the Chamber, and then of course, promote, which is telling the story of our region, not only to our region's residents, but also to those in the United States and abroad. So, really positioning Atlanta as a global city.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:02:11] </b> So how would you say over the last few months, you've seen the coronavirus pandemic impacting businesses and Atlanta, what have been some of the major impacts in your view and how they've been different between industries in the region?

                  <br />
                  <br />
                  <br />

                  <b>Katie Kirkpatrick: [00:02:24] </b> I don't think you're going to be surprised when I say that, about the middle of March here in Georgia, most companies had to pivot hard, from an environment where we filled up office buildings, and retail establishments and restaurants, and go to a virtual work environment. And so I think that was an immediate learning curve for companies – they may have been set up for an occasional, maybe, day or half day at home. But for the majority of employees that work in a commercial office space, that was not the norm. And so companies learned very quickly about technology needs, and what types of environments were conducive for their employees working from home.

                  <br />
                  <br />
                  <br />

                  I think you have a whole other set of industries that also at that time had to think about frontline employees and their health and well-being. And to say that that wasn't already a priority, is a misnomer in a way. We already provided adequate safety and precautions for those that might be in jobs where you were interacting with the public. But this is a very different crisis. And we didn't have a whole lot of information at the beginning, about how the virus was transmitted. So how did you provide the appropriate personal protective equipment? To what types of employees and what types of settings, was a real conundrum? And then, of course, you had the supply chain issues.

                  <br />
                  <br />
                  <br />

                  To tee off on supply chain issues, it's really interesting when you look back, and we're probably seeing a little bit of it now, too, right – the grocery stores, no longer could you find toilet paper and paper towels. But that was not because they didn't exist. It was a supply chain issue. When you think about toilet paper, about half of toilet paper manufacturing in the United States is for residential use, and about half is for commercial. So our entire universe quit going to commercial in spaces, including schools, right? It's not just office schools, and everyone was at home. So your supply chain was not set up to meet the demands of 90% of the US working or being in their homes. It forced that type of industry to have to re imagine their supply chain to meet the new demand, and it takes time for that to happen. And then those companies also have to think about well, I'm doing this in the short term, what does it look in the mid to long term, because I'm thinking about capital investments that have to be made.

                  <br />
                  <br />
                  <br />

                  The other piece to me – when I think at the beginning of the pandemic, technology and work from home was a big pivot and required ingenuity – I think the second piece was really focused on supply chain and logistics, and how to get products where they needed to go. You can also think of personal protective equipment, right, we had high demands. So you saw companies like Home Depot, who would normally stock the N-95 mask for construction workers, make the decision to no longer stock those masks, so those masks could go to health care workers, frontline workers, etc. So, a lot of decisions were being made in that supply chain space.

                  <br />
                  <br />
                  <br />

                  And then the last thing I would just say to you, is there was a period of uncertainty. And so decisions about investment had to be put on hold for a period of time. Because, you can think about the home selling industry, or real estate, residential real estate industry, it cratered in April.  Those companies are thinking about, okay, well, what do we what do we need to forecast going forward? Well, guess what happened, all of a sudden, toward May, home sales began to pick up and then by June, it was skyrocketing. And many residential real estate firms are having their best year ever, because all of us were making decisions about where we wanted to work and live. And that was one place, your home. And so people were moving and buying new homes and used home – or used homes, that's not the right word, but existing stock at a much higher pace. And that, combined with low interest rates, really drove that market. So, in about a five week turn, that industry went from “we might not survive” to “we're having our best year ever.” So ,it was really a time of transformation for many of these industries.

                  <br />
                  <br />
                  <br />

                  Then last – it doesn't take an expert – our hospitality industry, which is a thriving part of our economy, has been decimated. That industry has a high percentage of small business owners in the hospitality space. So we've seen a real impact too, on small business owners with the loss of the business in the hospitality space.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:07:39] </b> That's been very difficult to see. You touched on a lot of different changes that we've seen over the last really nine months at this point, and some very surprising, like, “Where's all the toilet paper?”; and supply chains really needing to pivot very quickly over a month or two; the real estate market, having a really good year at the end, which, like you said, is due to consumers realizing this is a long-term issue, and we need to really think about where we want to be living. That seems like it was a surprising upwards turn. And then the hospitality industry not doing well, that future being more uncertain.

                  <br />
                  <br />
                  <br />

                  <b>Katie Kirkpatrick: [00:08:15] </b> You have captured that very well.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:08:20] </b> So thinking about all those different issues, can you talk about the Task Force to Restore Georgia's Economy? In the words of the MAC, you “aim to provide a blueprint for how Metro Atlanta and our state might accelerate recovery in a fiscally responsible and practically achievable way that takes into consideration our most vulnerable populations and prioritizes the health of our families and neighbors.” So how did the Task Force get started? Who's involved in the task force? And can you explain how you're balancing this need for economic recovery with residents’ health in the region?

                  <br />
                  <br />
                  <br />

                  <b>Katie Kirkpatrick: [00:08:50] </b> Absolutely. This really was an important part of our work. In the second quarter, how it got started was, I was sitting at home toward the end of March, asking myself “what is the role of a business organization?” as we're all trying to adapt and understand almost a river of information coming at us on public health and the various controls that were put in place, like lockdowns and other things. And I thought, now is the time for us to leverage the business mindset and think forward. I had full faith that at some point in the future, we would overcome the virus and we needed to be prepared for that moment. And Georgia was already set for success in the sense that our economy was performing above the national average in February. And so there were assets and opportunities to build upon.

                  <br />
                  <br />
                  <br />

                  So we called on a number of retired executives. We reached out to John Rice, who at the time, was still part of the senior team at General Electric (GE); we recruited a combination of retired executives and current CEOs of major companies and our community. I think we had 50. And then, thanks to the Boston Consulting Group, who gave us pro bono work, we begin to dig into industry segments, we took a look at consumer confidence, we took a look at varying tactics and strategies. Not only what were local governments taking, our state government, but maybe, what were other countries doing, as well, in terms of mitigating the impact virus. So that's how we began.

                  <br />
                  <br />
                  <br />

                  And here's what was not surprising, but interesting – because we really were looking at policy recommendations that we could go and hopefully partner with elected officials, to move things forward. A good example of one of those is, and you might chuckle at this, the delivery of alcohol was actually not legal in the state of Georgia. So you couldn't use Instacart and have a case of beer delivered to your home. That just didn't make sense when we were when we were locked down. And we had businesses that actually had alcohol to sell and couldn't do it because of an obstacle like that. So we worked with the industry, and we worked with lawmakers and were able to successfully move that through. Now, why is that important? Well, certainly for all of our enjoyment, right. But really, because that led to tax revenue, and again, led to local and state governments to pick up some tax revenue coming in at a time when we were uncertain what kind of revenue collections would look like for the state, and those revenues fund those critical services like education, and health care. It was very important for us to think about how do we support local and state government.

                  <br />
                  <br />
                  <br />

                  What I want to want to kind of point out here is that we came up with, I think, over 150 ideas, by talking with executives and interviewing them and surveying them. But what was really fundamental at the end of the day was that consumer confidence will drive our economic recovery. And until we have the consumer confidence that they can go to work safely send their children to school safely, shop and dine safely, and travel safely, then our economy will remain in a position of not full recovery. So in addition to pursuing policy recommendations, we also began really leaning into the health, public health space, thinking about health disparities, why were we seeing different outcomes in our communities, and working and building a stronger relationship with the Department of Health, both the state and the local level, finding ways for the business groups and companies to really be able to leverage their employee base customers, and stakeholders to impact public health and hopefully, then accelerate the economy.

                  <br />
                  <br />
                  <br />

                  I'll leave you with one example. If you think about Delta Airlines, they're our hometown airline, but also Georgia's largest employer. And they have a very robust health and wellness plan, to make sure that their customers can travel safely, and it's their number one priority. They were the one of the first ones to say we're going to mandate a mask. And you either wear a mask on our flight, or you can choose another airline. And they have held fast to that. What's interesting is, their scores have gone off the charts in terms of customer satisfaction and feeling safe flying. That ultimately is going to help them recover, that that creation of trust, and that brand value is going to benefit their economic recovery as well. So hopefully that answered your question around “restore.”

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:14:27] </b> Yes, it definitely did. That's really interesting about Delta. I've heard about the mask mandate, and I have not flown since the pandemic started. And I'm not trying to turn this into an ad for Delta, but if I were to fly, it would be Delta, because I know that they are the only airline to be guaranteed that sort of safety!

                  <br />
                  <br />
                  <br />

                  <b>Katie Kirkpatrick: [00:14:43] </b> I'm happy to had the experience of visiting the airport and visiting a plane and seeing the protocols actually in real life, in real time. I'm very proud of the work that a company that is based here is doing to keep the flying customer safe.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:15:08] </b> Yes, absolutely. Well, thank you so much for joining the Equity and Outcomes podcast today. Do you have anything else that you've thought of related to the business community and COVID-19 response that you've been working in that you think our listeners should know?

                  <br />
                  <br />
                  <br />

                  <b>Katie Kirkpatrick: [00:15:21] </b> I'll just leave you with one thought. We are not operating in a vacuum when we think about economic recovery. We are mindful that different communities have been impacted at different rates. Industries have been impacted. Of course, we know that black business owners have been impacted a disproportionate rate, black and Latinx. When we're thinking about moving forward as a business group, business organization, we think about three things, one of which is public health and restoring consumer confidence. The second piece is accelerating economic recovery for all Georgians, not just a few. And the third piece, and these are all three of these are tied together is racial equity. Equity is so important because you can't have good public health, but not have equity and economic growth, and really taking a look at social justice issues. All three of these have to work in concert. So I'll leave you with that message that we view all three as interdependent, and we approach it in that way.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:16:28] </b> Well, that's really great to hear. Thank you so much for joining today.

                  <br />
                  <br />
                  <br />

                  <b>Katie Kirkpatrick: [00:16:32] </b> Oh, you're welcome, Leanna, happy to join.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:16:36] </b> Yes, happy holidays. Thank you.

                  <br />
                  <br />
                  <br />

                </Header>
              </Header.Content>
            </Header>


          </div>
          <Notes />

        </Container>
      }


      {podcastTitle === "Allison_Chamberlain_on_public_health_education_pandemic" &&
        <Container style={{ marginTop: "8em", minWidth: '1260px' }}>

          <Breadcrumb style={{ fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt" }}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{ fontSize: "14pt" }} />
            <Breadcrumb.Section active>Podcast</Breadcrumb.Section>
          </Breadcrumb>
          <div width={888}>

            <Header style={{ width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400 }}>
              <Header.Content>
                “A teaching opportunity for many years to come”: Dr. Allison Chamberlain on public health education in the time of the COVID-19 pandemic

                <Header.Subheader style={{ fontSize: "18pt", fontWeight: 300, paddingTop: "15px" }}>


                </Header.Subheader>
                <div style={{ paddingTop: 10 }}>
                  <iframe src="https://anchor.fm/rsph-ched/embed/episodes/A-teaching-opportunity-for-many-years-to-come-Dr--Allison-Chamberlain-on-public-health-education-in-the-time-of-the-coronavirus-pandemic-emk7in" height="150px" width="800px" frameborder="0" scrolling="no"></iframe>
                </div>

                <Header style={{ fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0 }}>

                  <p style={{ textAlign: "left", fontWeight: 300 }}>

                    By Leanna Ehrlich on Nov. 18, 2020

                    <br />
                    Contributors: K.M. Venkat Narayan, Shivani A. Patel
                    <br />
                    From Emory University

                    <br />

                  </p>

                  <br />
                  <b>Transcript</b>
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:00:00] </b> Welcome back to the COVID-19 Equity and Outcomes Podcast Series. Today we're talking to Dr. Allison Chamberlain, a Professor of Epidemiology at the Emory Rollins School of Public Health. So, welcome to the podcast, and thank you for being here.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:00:14] </b> Thanks, glad to be here.

                  <br />
                  <br />
                  <br />


                  <b>Leanna Ehrlich: [00:00:17] </b> Could you first tell our audience a little bit about your background directing the Emory Center for Public Health Preparedness and Research, and the Emory COVID-19 Response Collaborative, especially in these very recent challenging pandemic times?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:00:31] </b> Certainly, yeah. I am acting director of this Emory Center for Public Health Preparedness and Research, which is an academic center that's been around since right after – since, I think, about 2001, 2002. Right after the 9/11 attacks, and the anthrax attacks. It was founded by a woman named Ruth Berkelman, a woman who was faculty at Emory for a number of years after she had a long career at the CDC. She was an infectious disease epidemiologist and physician, and she was the person who hired me, actually, at the Center for Public Health Preparedness and Research back in 2007, when I first came to Emory, as a staff person.


                  <br />
                  <br />
                  <br />

                  I have been with the Center since then, so about 13 years; and see the Center of focus on a lot of different topics in public health preparedness, primarily around infectious disease preparedness and response. And the Center's mission really is to focus on how we can better learn from public health preparedness, infectious disease outbreaks, pandemics, things like that, to better prepare as a nation for what the future might hold with respect to these types of threats. So, we have done a lot of work on a variety of different topics ranging from Zika virus disease to, back all the way to H1N1, vaccine distribution, vaccine allocation and promotion; things that are a little bit more common, like Legionnaires disease, and how you can prepare or prevent Legionella overgrowth, for instance, in premise plumbing. And thinking through how as, you know, the public health field, we can better prepare ourselves and our residents, essentially, for threats that might be both common and less common, like pandemics or bioterror events.

                  <br />
                  <br />
                  <br />

                  So I've had a long history with the Center, and it's been an exciting area to work in. By training, I'm an infectious disease epidemiologist, but have a background in public health preparedness that goes back to some work that I had done in Washington, DC prior to moving to Atlanta in 2007. So I have a kind of a background – I started out my career in in bio-defense policy and biosecurity which is really looking at how you how you prevent the misuse of legitimate life sciences research for nefarious purposes, like bioweapons. So, I've taken a number of twists and turns down paths that more or less always have something to do with infectious disease, epidemiology, and preparedness.

                  <br />
                  <br />
                  <br />

                  In 2017, I ended up starting to work as an epidemiology consultant down at the Fulton County Board of Health, here in Atlanta, which is one of our local health departments. I took on that role, because I found myself really eager to get some experience working at a state or local public health level. I had never done that before. And I thought, if I'm going to be teaching – like the class that I teach now, that you're in, Leanna, about public health preparedness and practice – I wanted to get that experience working inside of the organizations that do public health preparedness, as part of their purview. And they're charged – they're the ones that are trying to work with communities, to make sure that they stay safe in the event of public health threats. And so I started working down there in 2017, with the Epidemiology Division, and trying to use my epidemiologic toolkit to help them analyze data that they didn't really have, necessarily, the time to dive in deeply to, but if they did, it could really help improve their programmatic services. So I ended up doing a lot of work down there on STDs, actually, and looking at risk factors for HIV seroconversion among women, risk factors for recurrent syphilis; but in my experience down there, really got intimately aware of how a local health department operates and what their successes are, what their challenges are, what their strengths are, what their weaknesses are.

                  <br />
                  <br />
                  <br />

                  And that really set me up to be able to lead this this new initiative that we have now called the Emory COVID-19 Response Collaborative, that is really designed to help put our talented academic, faculty, staff and students into the service of our state and local public health department partners right now, during this COVID-19 crisis. As academics, we have a lot of skill sets, analytic skill sets, data collection skill sets, other types of things that we could really lend that expertise to, in this critical time, to our public health partners that are trying to combat COVID-19 here in Georgia. And so that is the premise behind the new Emory COVID-19 Response Collaborative. And it's been exciting to help sort of bridge the gap between academia and public health practice right now.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:05:50] </b> That's so great. There are so many resources at Rollins. So it's really cool that you're helping to harness all those skill sets to combat the pandemic locally, as well as people who are jointly appointed at CDC, and have all of this blend of academic and response experience.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:06:12] </b> Exactly.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:06:15] </b> So in addition, you talked about being a practitioner of epidemiology and public health preparedness, but of course, you also teach this class at Rollins on Public Health Preparedness and Practice, and I'm one of the students this semester. For me, this was a completely new topic – I had always studied mostly chronic disease and climate change. My interest in the topic was really spurred by the pandemic, which perhaps was true of some other students as well. So, I'm very curious about how you have been viewing this moment to prepare the next generation of public health students who will soon be entering the workforce, if they aren't already.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:06:47] </b> Yeah, this is a great question. You know, I think this is a remarkable time to be a student of public health. There are so many instances, in our history as public health students, all of us, where we already have data sets that we're going to analyze, and they're all from a previous epidemic, or pandemic, or outbreak, or something like that. But right now, we are in the midst of the largest pandemic that we've experienced in 100 years, and we are the ones that are collecting the data and being able, as a student of public health, to learn how hard it is to collect the data that we need to collect right now, to fully understand the epidemiology of this disease.

                  <br />
                  <br />
                  <br />

                  What's unique about this point in time is that we have not experienced a disease on this scale during the digital age. So that that means that we're all connected in terms of communication by cell phones, and internet. And while some of that can really facilitate our ability to collect data, we're learning sometimes that's a big hindrance, when traditional activities, like contact tracing, for instance, are sort of grounded in, you know, the need for people to be answering their phones. And I think that's illustrated what are the pros and cons of technology during this type of pandemic right now. And we're really grappling as a public health enterprise with how to collect the data that we need to both understand, like I said, the epidemiology, but also to stop transmission. And when a lot of it has to do with people being responsive to requests from entities, public health departments that they may have never even had an interface with, they've never heard of them before, and giving sensitive data away over a cell phone number that they don't recognize sometimes, that's a challenge. That is a big challenge.

                  <br />
                  <br />
                  <br />

                  But I think that in terms of being a student and thinking as an instructor myself, and training you all right now, just to be able to impart the gravity of what it's like to be inside the health department right now, what it's like to collect the data, giving you all opportunities to serve alongside of Public Health Department colleagues right now – I think it is just an invaluable point at which to start your career so that you learn exactly what it takes to stay the course with respect to all these different ebbs and flows of disease case counts and percent positivity and what that all means and how it relates to each other, with respect to understanding what we're going through. It's just an unprecedented time to have all of these inputs coming at you with respect to learning opportunities and examples like we've never seen before.


                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:09:47] </b> Yes, this is it's truly amazing to be a public health student right now, and I certainly didn't anticipate any of that, when I started a year and a half ago. But it's been crazy to really be learning in real time. And like you said, have data and have case studies that are unfolding right now, not a pandemic from 100 years ago, or 50 years ago.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:10:10] </b> That’s right.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:10:12] </b> So I'm curious about how you think this pandemic will influence public health education long term. So just like thinking short term, you seem to have really redesigned a lot of our classes this semester, to focus in many cases on COVID, for our topic of the week, or just sort of take that angle in approaching whatever topic we're learning about. Do you think that is going to be a long-term change for this class, and what about other professors? Is COVID-19 really going to be what professors are teaching about, and what students are studying, for many years to come?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:10:44] </b> I do. I think that between now and 100 years ago, when we first had the most similar pandemic, the 1918 Influenza, there have been a number of different seminal disease milestones, I would say, things that have really revealed themselves to be teaching opportunities, more so than others. And I can think of, for instance, the HIV epidemic, that that was a career-setting disease discovery. And understanding what the root cause of HIV and how it is transmitted, and how it can be stopped – I think that's a great example of how many of our examples in public health practice and teaching come from that type of time in our public health history.

                  <br />
                  <br />
                  <br />

                  Other sort of instances, I can think of, understanding learning from the eradication of smallpox, or the burgeoning obesity epidemic, things like that, that we're really utilizing to teach our students key aspects of how health and society intersect. And I think that this pandemic right now is going to change public health teaching for many years to come. In similar ways, COVID has revealed so many, pulled the blanket away from so many underlying societal conditions that contribute to health and the disparities that exist, and that have contributed to where we're seeing ourselves right now, and how COVID is affecting different populations differently. I feel like that, in and of itself, is going to be a lesson that we're going to be continuing to dissect for years to come. So, I think that more so now than ever, for more concentrated disciplines within public health, like infectious disease epidemiology, we're going to be focusing so much more on some of these social inequities and underlying systemic and cultural issues that perhaps we hadn't really focused on so much in the domain of infectious disease epidemiology before.

                  <br />
                  <br />
                  <br />

                  I think that it is going to be, again, going back to that whole sort of pandemic in a digital age, making a shift to think about more creative ways that we can engage people in embracing public health and outreach to communities that we might not have been as effective in reaching before. And figuring out how we can do our jobs better with respect to the most foundational aspects of epidemiology, in terms of case investigations and contact tracing – how can we maybe turn it on its head like we've never thought before, to try to empower people on their own, to give us close contacts and details about their illness, that perhaps deviates a little bit from the way we've done it in the past. So I think that, yes, absolutely, this whole experience that we've been experiencing now for the past eight or nine months of COVID is going to be going to remain such a teaching opportunity for many years to come.


                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:14:08] </b> Yeah, I really like how you highlighted that. So many health disparities and social inequities are really having a harsh light shined on them by the pandemic. That's exactly what the COVID-19 Health Equity Dashboard is trying to visualize. And I also really agree that a paradigm shift might be needed in how we contact trace. As someone who, I was very briefly a contact tracer this summer just for about two months, it was very difficult at times, and this is the only pandemic or situation that I've ever contact traced in, but I can see how there are a lot of benefits to the digital age like being able to share information more easily, but also a lot of drawbacks and concerns about privacy and who is contacting you, and these issues probably had not come up very much before in any contact tracing efforts because you never needed to roll it out at this massive scale.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:14:57] </b> That's right. And I will also say that never, I think even more so now, because we can tend to feel comfortable hiding behind our electronics, I think one of the biggest things that I would like students of public health to begin realizing the importance of again, is the soft skills and being able to connect with people on a face to face or voice to voice manner, because I think we take that for granted. And we've actually lost touch with that a little bit. And when you're in a situation like a stressful disease pandemic situation, that human connection can really go a long way with respect to making people feel comfortable with each other, enough to share personal details about their illness, or who they may have come in contact with. And I think that as we pushed as a country to get a lot of contact tracers on board, we trained them in the sort of hard skills about the data collection, and what were the data variables that we needed to them to collect, and things like that. But the soft skills are what gets people comfortable with sharing that data. And I think that if we keep moving forward, or even if we had an opportunity to go back in time a little bit to train a little bit more intentionally, on how to build that rapport quickly and effectively with various types of people, that you might have to reach out to, to get sensitive information from – [I’m] just curious [what] a different place we might be in if we had put a little bit more emphasis on those types of skill sets from the beginning.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:16:32] </b> Absolutely, that human communication seems like a really important skill to focus on in public health education moving forward. You don't just need data skills and hard skills, like you said, but you need communication skills, sort of like what doctors learn with bedside manner. And maybe this hasn't had to be so much a part of the public health toolkit in the past, but I can definitely vouch for it being very important when you're on the phone with someone contact tracing.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:17:00] </b> Exactly.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:17:02] </b> Well, thank you so much for joining today. These are all the questions that I had for you. But if you have any other thoughts on public health education, during and after this pandemic, I would be happy to hear them.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:17:13] </b> Yeah, I think anytime either now, or even into the future where public health students can get the opportunity to collaborate with or volunteer with a community group, whether that's a local health department or some other type of nonprofit or outreach group that is engaging with community – take that opportunity, because you learn so much about the application of your work, especially if you're in one of the harder disciplines within – harder meaning, I guess, kind of quantitative disciplines that don't naturally focus on some of these more behavioral aspects to public health. But if you're sort of an epidemiology focus, global epidemiology, or a biostats focus, that if you have opportunities to engage with the community, or a local health department to really sort of understand the intersection between people's behavior and their hesitancies and their concerns and the actual collection of the data that we ended up analyzing, you really can get a better sense of, I think your collective place in the fabric of public health practice, when you have that awareness of how you can interact with people to ultimately get the data that you want and need for understanding whatever disease you're trying to understand more.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:18:30] </b> Yes, you don't want to have waiting until after graduation to get involved in community work.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:18:37] </b> Definitely, exactly. Do it now. That's right.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:18:43] </b> Well, thank you again, Dr. Chamberlain, for joining us today, on the Equity and Outcomes podcast, and I'm very much looking forward to our last few weeks of class.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Allison Chamberlain: [00:18:53] </b> Thanks, Leanna.

                  <br />
                  <br />
                  <br />

                </Header>
              </Header.Content>
            </Header>


          </div>
          <Notes />

        </Container>
      }










      {podcastTitle === "Robert_Breiman_on_COVID-19_vaccine_development_and_distribution" &&
        <Container style={{ marginTop: "8em", minWidth: '1260px' }}>

          <Breadcrumb style={{ fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt" }}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{ fontSize: "14pt" }} />
            <Breadcrumb.Section active>Podcast</Breadcrumb.Section>
          </Breadcrumb>
          <div width={888}>

            <Header style={{ width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400 }}>
              <Header.Content>
                “Information equity is a critical part of the whole picture”: Dr. Robert Breiman on COVID-19 vaccine development and distribution

                <Header.Subheader style={{ fontSize: "18pt", fontWeight: 300, paddingTop: "15px" }}>


                </Header.Subheader>
                <div style={{ paddingTop: 10 }}>
                  <iframe src="https://anchor.fm/rsph-ched/embed/episodes/Information-equity-is-a-critical-part-of-the-whole-picture-Dr--Robert-Breiman-on-COVID-19-vaccine-development-and-distribution-emk23s" height="150px" width="800px" frameborder="0" scrolling="no"></iframe>
                </div>

                <Header style={{ fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0 }}>

                  <p style={{ textAlign: "left", fontWeight: 300 }}>

                    By Leanna Ehrlich on Nov. 18, 2020

                    <br />
                    Contributors: K.M. Venkat Narayan, Shivani A. Patel
                    <br />
                    From Emory University

                    <br />

                  </p>

                  <br />
                  <b>Transcript</b>
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:00:00] </b> Welcome to the COVID-19 Equity and Outcomes podcast series. Today we’re talking to Dr. Robert Breiman, a Professor of Global Health, Environmental Health, and Infectious Diseases, at Emory’s Rollins School of Public Health and at the School of Medicine. Today we're going to be talking about progress in development of a SARS-CoV-2 vaccine, or multiple vaccines. So could you first give everyone an overview of how to your knowledge, vaccine development is progressing? How many different vaccines are in development? And where are they in the clinical trials phases?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Robert Breiman: [00:00:33] </b> Yeah, thanks, Leanna. Great to be here and talk about vaccines, my favorite topic. We are in an unparalleled time right now. If you think back on it, we all first started hearing about this virus in January, and the pandemic ended up being called in March. And, here we are, in the first week of November. And, we have a panoply of vaccines that are in development. I've been doing epidemiology, public health, and prevention for my whole career – more than 30 years. And most of the time, when we talk about vaccines coming along, we have a 10 to 15-year window.

                  <br />
                  <br />
                  <br />

                  I remember when I was just starting out at CDC, and working on pneumococcal conjugate vaccines, back in 1987. And the word was, at that time, that the conjugate vaccines were two years away. And we thought, two years, that's a long time. But it wasn't till another 11 years – actually sorry, it wasn't until 13 years – until that vaccine actually became available in the United States and more like 20 years, in places where it's needed the most. So to have more than 100 vaccines in development [for SARS-CoV-2], this early, this quickly, is truly a testimony to technology advancements, and also to partnerships. And actually for, you know, to government, for stimulating, pushing, if you will, the vaccine development; and in helping to shoulder some of the risk – the financial risk – that allowed companies to move forward so aggressively.
                  <br />
                  <br />
                  <br />

                  And so there are there are five vaccines that are in in late staged evaluation clinical trials, in other words, either in phase three trials, or in the case of one vaccine, just about to move into a phase three trial. And, the other thing that is quite remarkable at this moment in time, is that the US government, and also other governments, have paid the vaccine companies to produce vaccine, so that it's waiting in the wings, in case the vaccines are safe and effective. If they're not, they'll just discard the vaccines. But if they are safe and effective, there won't be the usual many months or years to await production and having vaccines to actually give to people. So that's another amazing thing is that once these trials are done, and they go through rigorous regulatory review – which I always have to say, is crucial; you can't assume these vaccines are safe and effective. They have to be shown to be in the trials and then reviewed by regulatory experts and approved; and once you get to that point, there won't be much in the way to at least having vaccines that can start going into distribution.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:03:48] </b> That is really good to hear. I think a lot of people are anxious for the vaccines; and of course, a wait of many months after a discovery of the correct vaccine wouldn't be ideal, even if that's completely normal for basically any other vaccine. So to follow up on that, what do you see as an optimistic and then perhaps a more realistic timeline for vaccine distribution of the actual correct vaccine or vaccines that work, worldwide and within the US?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Robert Breiman: [00:04:14] </b> So, the four vaccines that are in phase three trial trials now include two vaccines that are messenger RNA vaccines, that have to be kept in very cold storage – like at minus 80 degrees; and then can only be out of that frozen state for a short relatively short period of time. And then the other two vaccines, which are – the first two are produced by Pfizer, and a company, a new company, called Moderna; and then the other two that are in phase three trials, Johnson and Johnson and AstraZeneca vaccines, in trials in the United States, I mean – are produced on an adenovirus back bone, which doesn't require freezing, but does require very careful storage. And so the big issues are actually going to be how these vaccines, in large amounts, are brought to points of use, in ways that they can be easily used without a great deal of wastage. And it's going to really be a challenge, a major challenge, for immunization managers, to ensure that the vaccine that they receive, it’s stored properly, and is handled properly, so that it can be given relatively easily to the people who need it the most. And the other big challenge is that these products, at least at the moment, based on what is understood, cannot be mixed and matched –they can't be interchanged. And so the systems will also have to, once there's more than one vaccine on the table, be able to differentiate between people that have received vaccine A, or vaccine B, or C, and so on, and make sure that their second dose, which needs to be a month later, is with the same vaccine.


                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:06:25] </b> Oh, that is complicated, because you're relying both on the people who you're giving the vaccine to, as well as health care systems, to keep track of that.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Robert Breiman: [00:06:31] </b> Yeah, I don't think there's from an immunization standpoint, I don't think we've ever had a challenge quite liked this one.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:06:37] </b> Yeah, that's really, really complex. So I've read some interesting pieces recently, about how vaccine distribution can, or will be, prioritized. And I think lots of people agree that prioritizing essential workers, especially those working in healthcare settings, seems like a very natural first step; they've already made many sacrifices and are definitely in a high-risk environment; and then maybe considering other essential workers like those in food services, or other emergency services. But then, I've also read some ideas about prioritizing different groups of people, people with underlying health conditions like diabetes, or asthma, or those in minority groups, ethnic or racial groups, because they may have a higher risk of severe outcomes of COVID-19. So I'm curious to hear your thoughts on equity surrounding vaccine distribution. Do you think that there is a certain prioritize scheme that should be used for deciding how and when vaccines are allocated, that would best promote equity, and also meet with public approval?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Robert Breiman: [00:07:33] </b> So the vaccines, even with this advanced market commitment, and vaccines being produced in parallel to the trials, so that, you know, we can get to them quickly – there will just be a relative trickle of vaccines early on, once they do become safe and effective (I always feel like I have to emphasize that), vaccines are available. And therefore, immunization managers, people in charge of the programs, health care providers and so on, may have a certain amount of vaccine in their stock, will have to have some sort of prioritization for who gets the limited numbers of vaccines first. And there are two philosophies around that, around how to do this, and, the concepts, I should say, work side by side. One is to use a safe and effective vaccine to keep society, all the key societal functions, operating; and that includes making sure our health care workers, both physicians, nurses, others involved in providing hands on health care, are able to keep doing that. Because you can imagine how devastating that would be if we had a shortage produced by the pandemic of healthcare workers. And as you say, there also is focus on protecting those who are involved with essential functions, critical functions in our society, especially among workers, who are substantially higher risk of exposure while carrying out those functions. So you have that side of things where you're thinking about using vaccine to protect our critical resources, if you will, or critical human resources.

                  <br />
                  <br />
                  <br />

                  And then you have the consideration of, there are certain people who are at disproportionate risk for illness, hospitalization, and death due to COVID. And so there would be interest in using limited quantities of vaccine to prevent illness and those that are at higher risk. And there has been a general move away of focusing use of vaccine based on racial characteristics, but more on social determinants of health. So that, the reason there is disproportionate risk among people of color in the United States for COVID is not necessarily related – or, there is no reason to think it's related, to any inherent qualities about them, about their physiology, and so on. But it's more related to structural imbalances in terms of the type of living and working conditions that exist that put certain populations at risk. So the focus is likely to be on those social determinants, if you will, rather than specifically on race.


                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:10:58] </b> Okay, and then do you foresee any barriers in vaccine distribution and uptake, specifically related to health disparities and health equity? Just some ideas that came to mind might be getting vaccines to rural populations, especially if you're talking about a cold chain supply management, or other medically underserved populations; or maybe overcoming social issues related to vaccine hesitancy or distrust in public health figures?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Robert Breiman: [00:11:23] </b> Yeah, I mean, there's been a lot of focus on how to distribute the vaccines so that they can be placed at locations that would enable vaccine to reach those that are normally hard to reach. So that might include communities that are far away from hospitals or research settings where the cold chain can be maintained. So, figuring out ways the vaccine can be moved to places where people would have greater access.

                  <br />
                  <br />
                  <br />

                  There's also discussion of using sort of non-traditional places to get vaccinated. I mean, one thing that we always used to call non-traditional, one place, are pharmacies themselves. And those are no longer non-traditional, because as you know, pharmacies are often places where many people get their vaccines now. And so they will almost certainly be right in the midst of things when it comes to COVID vaccine distribution.

                  <br />
                  <br />
                  <br />

                  But, other considerations that people are exploring is, can, for instance, houses of worship, serve as places that are both resources for trusted information about the vaccines, as well as places where people could actually go and get vaccine? And that might be a way to reach people, especially in communities that tend to be more marginalized. And then, there's also discussion of certain kinds of workplaces and actually offering vaccine directly there to people that are at increased risk. So there's a lot of strategies that are coming out that will require new ways of, you know, distributing vaccine.

                  <br />
                  <br />
                  <br />

                  And so, you touched on something that I think is really important, which is many of the people that are at disproportionate risk for COVID because of exposures – because their working conditions don't allow them work from home, they're often in situations where they're more likely to be exposed to the virus; maybe their living conditions at home also put them at increased risk for transmission – many of those communities and those populations, may be not only an increased risk for COVID, but they may be at increased likelihood to not accept a new vaccine that's been pushed along at warp speed, promoted by the government, and so on. And, maybe less likely to trust such an offer, such a system. And so, there does need to be a thoughtful, context specific, culturally appropriate and relevant translation of the science, as it comes out, in a transparent and clear way. So that there is what we call “information equity”: so that regardless of the community, that people will understand, in ways that are appropriate for their context, what are the benefits and what are the risks associated with being immunized with a COVID vaccine; and to be able to ultimately make an informed decision about getting vaccinated. And I think that information equity is really a critical part of the whole picture to address that issue because, as Walter Orenstein says, you know, “vaccines don't save lives, vaccinations do.” So we can produce all these wonderful vaccines and have them distributed right where people are, but if they don't get into the arms of people who need them the most, they won't really, they won't clearly, have done their job. So it's really important to have this information effort, as well.


                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:15:40] </b> Absolutely, I have never heard it particularly phrased that way. But I think that's such an important perspective, like information equity is absolutely critical. And it'll be interesting to see what happens. I'm a public health student right now. So I know everything happening over the past year, and over the next year or two is going to become a case study that we'll all learn about for future public health practitioners. But of course, we also want everything to run smoothly, without too many hard-won lessons. So I guess we'll just have to wait and see how everything unfolds.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Robert Breiman: [00:16:07] </b> Yeah, it's kind of a scary thought that, you know, oftentimes, we look back on the 1918 flu pandemic with sort of a morbid curiosity, you know, “how could things have been so severe?” And how could people have, you know, dealt with these things in the ways that they did, or early on, and so on. But it's somewhat concerning to imagine that decades, maybe even a century from now, people will look back on this period with amazement and wonder, both in terms of, maybe what we didn't do, despite the fact that we could have; and also those great achievements that we've just touched upon, especially around hopefully, the availability of safe and effective vaccines and a strategy equitably administer them.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:16:58] </b> Yes, absolutely. I think that the vaccine development and the scientific progress during COVID is, within the US, probably the best part of our country's response.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Robert Breiman: [00:17:08] </b> Yes, I agree with that. It seems non-partisan, almost. Which these days is refreshing?

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:17:19] </b> Yes, absolutely. Almost everyone wants a vaccine, and hopefully it will be trusted and accepted. So I was wondering if you have any other outstanding issues that you can think of related to vaccines and health equity that come to your mind that we haven't talked about today already?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Robert Breiman: [00:17:34] </b> Yeah, there's one issue I just would like to touch upon. And that many of us in public health are automatically focused on a prevention strategy, like immunization, as a way to save lives and prevent hospitalizations and, you know, prevent suffering. And, those are the right things to focus on. And in addition, because of the way our society is structured, and because of the social, the systemic social inequities that exist, that much of what makes our economy run is built on people that, you know, keep the trains moving, if you will, and, you know, keep the food moving and keep businesses and office places open. And those are the people that are at disproportionate risk for COVID.

                  <br />
                  <br />
                  <br />

                  So, it's our premise, and we're working with a group in Boston, that is going to be modeling the actual magnitude of this; but it's our premise that an equitable use of a safe and effective prevention strategy, not only makes sense from a standard health standpoint, but it also will save huge amounts of money. It'll be economically rewarding in ways that haven't been considered as well. And it's this nexus, I think, of public health and economics, that I think is particularly important to consider, and helps to make people think, regardless of their perspective, of where they are in society, in a parallel way regarding – in a similar way regarding – the benefits of not just giving vaccine out, but giving it out in the most equitable way possible.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:19:42] </b> Yeah, absolutely. Thank you so much for joining the podcast today, Dr. Breiman, this was a really important conversation. We're getting pretty close to vaccine distribution. I mean, not next week, but it's definitely on the horizon of our future. I think a lot of people will find this information really useful as this sort of starts to become more and more the topic in the news related to the pandemic. So thank you for sharing your thoughts related to vaccine development and issues of equity.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Robert Breiman: [00:20:09] </b> Thank you. Pleasure to be here.

                  <br />
                  <br />
                  <br />

                  <b>Addendum:</b>  Since this podcast was recorded, <a href="https://www.pfizer.com/news/press-release/press-release-detail/pfizer-and-biontech-announce-vaccine-candidate-against" target="_blank" rel="noopener noreferrer">Pfizer and BioNTech announced successful Phase 3 clinical trials</a> of a COVID-19 vaccine that appears to be more than 90% effective. We reached out to Dr. Breiman to get his comment on the new development, and he said “I look forward with great enthusiasm to seeing the data from the trial of the BioNTech/Pfizer mRNA SARS-CoV2 on efficacy against a variety of outcomes and on safety. Findings from the vaccine trial on safety and efficacy for people in a variety of risk categories (like underlying diseases, advanced age, and race/ethnicities) will be very helpful. While the recent press briefing certainly suggests that this vaccine (and potentially other formulations) offer substantial promise, the jury will remain out until the complete data are presented and there is rigorous regulatory review.”

                  <br />
                  <br />
                  <br />
                </Header>
              </Header.Content>
            </Header>


          </div>
          <Notes />

        </Container>
      }












      {podcastTitle === "Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances" &&
        <Container style={{ marginTop: "8em", minWidth: '1260px' }}>

          <Breadcrumb style={{ fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt" }}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{ fontSize: "14pt" }} />
            <Breadcrumb.Section active>Podcast</Breadcrumb.Section>
          </Breadcrumb>
          <div width={888}>

            <Header style={{ width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400 }}>
              <Header.Content>
                Innovations in Covid-19 Treatment: Dr. Vincent Marconi on Anti-Viral and Anti-Inflammatory Advances Against Covid-19 Infection
                <Header.Subheader style={{ fontSize: "18pt", fontWeight: 300, paddingTop: "15px" }}>


                </Header.Subheader>
                <div style={{ paddingTop: 10 }}>
                  <iframe src="https://anchor.fm/rsph-ched/embed/episodes/Innovations-in-Covid-19-Treatment-Dr--Vincent-Marconi-on-Anti-Viral-and-Anti-Inflammatory-Advances-Against-Covid-19-Infection-elj2vh" height="150px" width="800px" frameborder="0" scrolling="no"></iframe>
                </div>

                <Header style={{ fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0 }}>

                  <p style={{ textAlign: "left", fontWeight: 300 }}>

                    By Leanna Ehrlich on Oct. 26, 2020

                    <br />
                    Contributors: K.M. Venkat Narayan, Shivani A. Patel
                    <br />
                    From Emory University

                    <br />

                  </p>

                  <br />
                  <b>Transcript</b>
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:00:00] </b> Welcome back to the equity and outcomes podcast series from the COVID-19 Health Equity dashboard. On this episode, we're talking to Dr. Vincent Marconi, a Professor of Medicine in the Division of Infectious Diseases at Emory School of Medicine, as well as the Professor of Global Health at the Rollins School of Public Health and the Emory Vaccine Center. Welcome to the podcast, Dr. Marconi. Today, we're going to be talking about potential new treatments in antivirals and anti-inflammatories to address COVID-19 infection. So first, could you tell us about the treatments you've been working on related to baricitinib?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Vincent Marconi: [00:00:34] </b> Thank you, Leanna. It's great to be here. Absolutely. So we've been working with this particular class of drugs called JAK-STAT inhibitors, since about 2012. And this [work] is in conjunction with Dr. Raymond Schinazi and Christina Gavegnano, who worked in the Laboratory of Biochemical Pharmacology. That work was with me, [and it] focused primarily on people with HIV. They had found in the lab, that JAK-STAT inhibitors reduced inflammation for in vitro models of HIV. They've also looked at other viruses as well, but I was specifically interested in the results that they found related to HIV, as most of my research and clinical work deals with HIV. And it has already been known that these drugs reduced inflammation for many kinds of both autoimmune and inflammatory conditions, as well as cancers. And so it made sense for us to explore this [class of drugs], both in preclinical and then in clinical models for people with HIV, because inflammation is a large component of the disease and the morbidity and mortality associated with people living with HIV, even if they [the patients are] able to stay on treatment, and really suppress the virus in their body, that this ongoing [inflammatory] process, because of immunologic imbalance that happens early in infection, seems to be a persistent problem for a large percentage of patients receiving treatment.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:02:20] </b> So, how did you first come to the realization that these JAK-STAT inhibitors could be useful for treating patients with severe COVID?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Vincent Marconi: [00:02:28] </b> We had embarked on a large program of treating patients and doing clinical trials using JAK-STAT inhibitors. And so when COVID-19 emerged at the beginning of this year, and it showed many aspects of inflammation that were similar to what we had been looking at in people with HIV as well as [what] others had been looking at in people with these inflammatory conditions, it made sense to consider JAK-STAT inhibitors in particular, as one of the strategies to help with treating people having severe COVID-19 who are hospitalized, etc. And so when the publication by Stebbing, and his group from the United Kingdom came out in early February showing that an artificial intelligence – one of these sort of machine learning algorithms – to screen using computer modeling, large libraries of compounds, to identify those [drugs] that would be effective against SARS-COV-2, it was really startling to see that baricitinib, one of these JAK-STAT inhibitors that we've been looking at, seemed to be the most promising. And this was really not exclusively, or really, the point; the point of the model was not to identify anti-inflammatories, but actually looking for molecules and for compounds that would actually inhibit viral replication. So here, encouraged by both our preclinical and clinical work with these agents outside of COVID-19, but in an infectious disease, a viral disease in particular, showing reduction in inflammation, inflammatory biomarkers, plus this potential in silica model showing that there was a reduction in viral replication if these were to be used. We were very interested, as you might imagine, in pursuing this further.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:04:39] </b> That’s so interesting. So it sounds like the early artificial intelligence analysis suggesting the promise of baricitinib for SARS-COV-2 infection inspired you to pivot from your work with this drug in HIV to the direct investigation of how baricitinib may work for COVID-19 patients. Can you tell us more about how this went to trials?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Vincent Marconi: [00:04:58] </b> So, we approached [Eli] Lilly [and Company] pharmaceuticals, who makes baricitinib; and also through our contacts, here at Emory, who are working with the NIH. This [team] includes Dr. David Stevens, who is the head of the Infectious Disease Clinical Research Consortium; Dr. Nadine Rouphael, who is the director of the VTEU, and Dr. Aneesh Mehta, who is the NETEC director. We approached [each of] them with these ideas to see if it might be included in the NIH platform trial called ACTT. So we were sort of trying a couple of different routes. I submitted a protocol to Lilly outlining our proposal; we had several meetings with them. And as I said, these three individuals from Emory were approaching NIH. And so as this process was moving forward, we began to see large numbers of patients admitted to our hospitals with COVID-19. And were quite sick. And so one of my fellows, a mentee of mine, [Dr.] Boghuma Titanji, was working on clinical service with our division chair, Dr. Monica Farley, at the Atlanta VA; and they were seeing patients with severe COVID-19. One [of these patients] was a relatively young individual who was severely ill. And despite all of the possible therapies [for COVID-19], including those that are being used, still today, such as steroids, etc., this patient was doing quite poorly, and in fact, was ventilated; and, you know, was in critical, and even guarded, condition, and had shock and had renal failure, etc. And so in discussions with Dr. Schinazi, we decided to try baricitinib off-label for this one patient. And really, within 24 hours, this patient's fever decreased – deferversed, as we describe it – and then within 48 hours, his ventilation settings had gone down significantly, and eventually [he] came off the ventilator and all of his organ systems returned back to health fairly quickly; it was really impressive compared to a lot of the other patients we had seen who had done poorly.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:07:33] </b> Wow, that must have been an exciting moment.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Vincent Marconi: [00:07:36] </b> So encouraged by these findings, we decided to treat additional patients. [We] ended up treating 15 patients, 12 of which did very well, [while] a couple of patients declined further healthcare interventions such as intubation; and unfortunately, without [intubation], they were not able to survive, and one patient did ultimately die (despite being on the ventilator), who declined to have aggressive measures as well. So out of those 15 patients, again, we felt we had strong enough data to say, at least from a safety perspective, these patients appeared to tolerate the treatment and may have – although without a placebo control to compare it – but may have had improvement beyond [just tolerating the treatment], which we were seeing in other patients who did not receive it. And so with these data, we were more, again, justified in our discussions with both the NIH and Lilly to pursue this further. This resulted in two large international trials of treating patients with baricitinib compared to placebos [sponsored by] the NIH and Lilly.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:08:58] </b> So what do these two new, larger trials look like? How are they being conducted?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Vincent Marconi: [00:09:04] </b> So ACTT-2 [Adaptive COVID-19 Treatment Trial 2] was a study randomized [placebo]-controlled trial of remdesivir plus baricitinib, versus a control arm of remdesivir alone. Remdesivir, as you may know, in ACTT-1 was shown to be beneficial for patients [hospitalized with COVID] in a placebo-controlled trial. So, that had been moved into clinical care guidelines under [an] emergency use authorization. And so [remdesivir] became the standard of care for ACTT-2. [The ACTT-2] results are now put together in a publication and are very favorable [for baricitinib]. I’m unable at this point to go into the details, but they should be submitted to a journal within, hopefully the next few days, to a week. So [we are all] looking forward to seeing those in print soon.

                  <br />
                  <br />
                  <br />

                  The second study, COV-BARRIER, which Lilly pharmaceuticals is sponsoring, is currently about 50% enrolled, and so we'll have a second look at the same strategy coming up soon [in the next few months].

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:10:10] </b> Could you speak to any differences in race and ethnicity with distributing baricitinib and other inflammatory response drugs? Do you think there might be any differences in how these drugs work in people of different backgrounds or ethnicities or underlying medical conditions? And or might there be any issues to consider around distribution of the drugs? If and when they become more widely available?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Vincent Marconi: [00:10:29] </b> Yeah, this, Leanna is a critical question. Both for me personally, but obviously, I think for the wider community; both [those] affected by this disease, and the clinical community treating patients with this disease. And it clearly has been evident to the world, the disproportionate effects in this country at least, and elsewhere, of specific minority groups. In particular in the US, African Americans have been, from a mortality perspective, and also severity of disease, have been most heavily hit, by SARS-COV-2. It appears that a lot of this [difference] is related to aspects of underlying medical conditions, but also access to health care, etc. So trying to extrapolate how baricitinib could potentially either affect this positively or negatively is a critical question. For our small study of 15 patients it, again, it's really impossible for us to make any conclusions; I can say the vast majority of our patients at the Atlanta VA, who have been able to participate either in the single arm study or in our randomized controlled trials, have been African Americans and other minorities. So we feel confident that we'll be able to address this in the data we have now, and in ACTT2. That is being explored currently, but is not in the initial findings that we have [assembled] – the top line findings didn't get into those analyses at this point.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:12:11] </b> Well that seems promising from an equity standpoint, that you were already exploring the treatment in early versions among a diverse population. Where do you go from here?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Vincent Marconi: [00:12:22] </b> YFrom a biological perspective, you know, it all depends on both whether a drug can impact positively and reverse the disease, based on the biology[ical mechanism]; and so the biology, in this particular circumstance, is twofold. One, immunologically, patients who go on to severe disease are at a risk of not being able to, or predisposed to not being able to, control the virus. It is probably in part related to type I interferons; there may be some differences in antibody responses as well. Also, the innate immune system, natural killer cells, etc., macrophage response [may be playing a role]. So, it's possible that diabetes and other medical conditions, ([i.e.] hypertension and obesity) may have some impact on that initial immune response to clear the virus. And so, if the virus has not cleared initially, it triggers a cascade of multiple different arms involving both the ACE2 receptor and the clotting system to result in the pathology we see in severe COVID disease. So, that second piece, this triggering, probably in part, [happens] because the virus isn't cleared to it initially early; but [it] may also have to do with predispositions to inflammation. Again, these diseases such as diabetes, cardiovascular disease, obesity, [patients are] already inflamed, and primed for inflammation at baseline. So it may not be very difficult to trigger that cascade. And so the fact that inflammation is a predisposition, and then as a consequence of the virus, it would make sense that baricitinib, because it acts on this inflammation in particular, would have a beneficial effect for these individuals who are hardest hit. So I would anticipate it should be equal in response to people [of colors and those] who are not of color who are having severe COVID-19. But again, that remains to be seen. And we looked eagerly towards those results from both ACTT2 and COV-BARRIER.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:14:44] </b> And how do you think your environment at Emory, at your workplace, has contributed to the success of these discoveries?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Vincent Marconi: [00:14:50] </b> It's incredible to see what we've been able to accomplish here at Emory, and certainly around the world. But in particular, I think the environment here at Emory has really facilitated multiple different discoveries across diagnoses: across prevention, therapeutics, vaccines, you know, community outreach and epidemiology. So, you know, I think has been favorable environment, as I said, and culture, to allow for these cross-disciplinary collaborations, and really transdisciplinary collaborations to help the community, you know, respond to this disease. We've reached across our partners at other universities here, across Georgia Tech and Morehouse. And I think our existing collaborations is what has facilitated [these partnerships]: these were not new relationships, but were pre-existing. And so [it] allowed us to pivot and respond again, in particular, to reach out to the communities most heavily affected by the disease, and reach into communities that can be disenfranchised and underserved. And I think that, again, bringing information and knowledge from the lab, from drug discovery programs, from our colleagues at the non-human Primate Research Center, all the way through to clinical trials and out into the community, shows really the dynamic opportunities and resources here at Emory.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:16:28] </b> Definitely, Emory and Atlanta are great places for innovation, research and building partnerships with communities and other institutions. So sounds like a good place to be.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Vincent Marconi: [00:16:38] </b> I agree.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:16:40] </b> Well, thank you so much for joining the podcast today.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Vincent Marconi: [00:16:43] </b> My pleasure. Thanks, Leanna.

                  <br />
                  <br />
                  <br />
                </Header>
              </Header.Content>
            </Header>


          </div>
          <Notes />

        </Container>
      }












      {podcastTitle === "Dr._Nneka_Sederstrom_on_Racism_and_Ethics" &&
        <Container style={{ marginTop: "8em", minWidth: '1260px' }}>

          <Breadcrumb style={{ fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt" }}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{ fontSize: "14pt" }} />
            <Breadcrumb.Section active>Podcast</Breadcrumb.Section>
          </Breadcrumb>
          <div width={888}>

            <Header style={{ width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400 }}>
              <Header.Content>
                "We Have to Be Better": Dr. Nneka Sederstrom on Racism and Ethics During Covid-19
                <Header.Subheader style={{ fontSize: "18pt", fontWeight: 300, paddingTop: "15px" }}>


                </Header.Subheader>
                <div style={{ paddingTop: 10 }}>
                  <iframe src="https://anchor.fm/rsph-ched/embed/episodes/We-Have-to-Be-Better-Dr--Nneka-Sederstrom-on-Racism-and-Ethics-During-Covid-19-eiok5g" height="150px" width="800px" frameborder="0" scrolling="no"></iframe>
                </div>

                <Header style={{ fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0 }}>

                  <p style={{ textAlign: "left", fontWeight: 300 }}>

                    By Leanna Ehrlich on Sep. 7, 2020

                    <br />
                    Contributors: K.M. Venkat Narayan, Shivani A. Patel
                    <br />
                    From Emory University

                    <br />

                  </p>

                  <br />
                  <b>Transcript</b>
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:00:00] </b> Welcome to the third episode of the Health Equity and Outcomes
                  COVID-19 podcast. On this podcast, we talked to Dr. Nneka Sederstrom, the director of Clinical
                  Ethics at Children's Minnesota. Welcome, Dr. Sederstrom. First, would you mind telling our audience
                  a little bit about yourself and your vast background in medical ethics?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Nneka Sederstrom: [00:00:11] </b> Sure, I'm Nneka Sederstrom and I have been in the clinical
                  ethics space since 2001. I started my career off as a clinical ethicist at the Washington Hospital
                  Center, which is now called MedStar Washington Hospital Center in downtown Washington, D.C, and then
                  became the director of that about five years after I started and ran both the clinical ethics department
                  and the spiritual care department until I moved here to Minnesota, where I am now in charge of
                  developing a clinical ethics program at Children’s Minnesota. Part of my training and experience
                  and part of my PhD program was in race, class, and gender inequality, so I've also been really
                  involved in looking at health equity and addressing how ethics and equity mix, ethics, equality.
                  I've done a couple of talks on equality and ethics and how they intersect.

                  <br />
                  <br />
                  <br />

                  And then I also have an MPH that focuses on global health management because I believe that we
                  have to tie all this into our entire global community and not just the small hospital that I may
                  be in right now. So, I kind of tried to set my career in the global stage to address health equity,
                  ethics, and quality. And I'm very excited to be able to be on this podcast and talk about these
                  issues because I feel like not a lot of people have been paying attention to how to create solutions
                  around the COVID and inequity issue. And more people have just been paying attention to the fact that
                  there is an issue, and I think that it's time to try to be more solution oriented and be more
                  intentional with our decisions.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:02:03] </b> Can you speak to historical issues of trust between minority
                  communities and the medical establishment? How can we keep this in mind and maybe work to overcome it during the pandemic?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Nneka Sederstrom: [00:02:14] </b> Yes. So there's this misbelief that, especially in the
                  Black American or African American community, that the distrust of medicine started with the
                  Tuskegee experiments in the 1970s. Well, the experiment started earlier in the 30s, but ended in
                  the 1970s. And that is that is a misconception, because if you ask many in the Black African American
                  community, most don't have any idea what the Tuskegee experiment actually was, and to believe that
                  the only time when medicine was behaving in suspect or inhumane ways towards Black Americans was only
                  from the 1930s and a small population of Tuskegee, Alabama, is to also just live in some sort of
                  ignorance or denial about how African Americans and Black Americans were treated in this country
                  from the beginning of the slave trade in 1619.

                  <br />
                  <br />
                  <br />

                  I think that the assumption that distrust of medicine happened in the 70s and now we have to somehow
                  regain trust because of the Tuskegee experiment, is where all these interventions that people have
                  tried on gaining trust between the African American community and medical community have fallen short.
                  The premise is wrong. There's never been trust between the African American Black community and medicine.
                  One of the best books out there that highlights the fact that trust has never been around, is Harriet
                  Washington's book called Medical Apartheid. And in it she outlines beautifully and so brilliantly the
                  core of why there needs to be a reckoning between the medical community and the Black community, where
                  the medical community owns its part in racism from the beginning of Black people in America. Till this
                  day, I mean, we even have recent data just coming out showing that Black babies have a higher mortality
                  if treated by white doctors, a lower mortality if treated by Black doctors. I mean, just by virtue of
                  the race of the physician, because of the way that the physician cares for the baby, the way that
                  family trusts the physician, of all these additional elements that go into it.

                  <br />
                  <br />
                  <br />

                  But for that to be a study that happens in 2020 and still a part of how we measure success and outcomes
                  is based off of race of patients. I think that we still have to, we haven't done the work that we need
                  to do with owning our responsibility and our in our role in perpetuating structural racism in the United
                  States. And until that happens, there's never going to be an opportunity for trust to be built between the
                  communities. And I think that COVID has given us a unique opportunity to face that and say, as a member of
                  the medical community, we haven't gotten this right. We haven't done what needs to be done to develop trust
                  between this - our community as a medicine community, and this these populations of color that we really need to do.

                  <br />
                  <br />
                  <br />

                  COVID-19 has given us the glimpse into how the structures of racism that have led to inequities in patient
                  outcomes and access to care. And now we have to do something intentional to reverse it because we no longer
                  can pretend like we just didn't know it was there or it was only for a particular group of people who actually
                  paid attention to this. There's no way to now be in medicine and not have health equity be something that's in
                  your face, and I think that it's time for us to finally own it and address it.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:05:57] </b> What do you think are the best next steps forward in terms of addressing
                  the historical structural racism in the relationship between communities of color and medicine? What do you
                  see as some immediate steps that medical and health systems can be taking? I'm not trying to say that 400 years
                  of structural racism can be fixed immediately, but clearly there's a crisis that needs addressing, especially during the pandemic.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Nneka Sederstrom: [00:06:31] </b> The most powerful steps that I've seen happening are people standing
                  up and saying that we have to be better. I think that prior to this it was more of a “oh, I know we need to be
                  better,” but it was like someone else's job to think about how to be better.

                  <br />
                  <br />
                  <br />

                  Now there there's discourse and conversation bubbling up in every corner of the medical community on, how can
                  we do our part to be better? And that movement, I think is the only way to get things going forward. Being able
                  to have conversations that include terminology like racism, white supremacy, you know, structural, environmental,
                  institutional, all those terms that are used to describe racism, having those conversations now in spaces where
                  before the idea of even bringing it up would have would have caused you a lot of fear and distress, worrying about
                  how your job was going to be affected because you decided to call everybody in a room that was mostly white privileged,
                  right. So we no longer have a lot of those fears. Because there is no longer the ability to hide behind the
                  reality of how racism is affecting us. So I think that the biggest gift that we have from COVID is an opportunity
                  to start speaking truths and addressing things the way they need to be. I’ve seen it in the way that people
                  have responded to trying to undo the additional burden of blackness that COVID has added.

                  <br />
                  <br />
                  <br />

                  When our triage protocols were put into place, and most states enacted triage protocols that, the protocols
                  then, of themselves, had racist foundations – the way that the protocols were enacted based off the tools that
                  were developed that were foundationally racist, showed that we’re missed a huge opportunity to create structures
                  and ethical frameworks that truly address racism and being anti-racist. And I think that now that many states
                  are starting to look at that and say, how can we be intentional in ameliorating these harms that we know have
                  happened to these populations? What are the things that we can do to try to address that? Is it possible to address
                  it at a downstream bedside perspective with a triage protocol with having equity and inclusion officers like my
                  institution does: we included equity and inclusion officers as part of our triage protocols to try and address
                  equity and inclusion at the bedside level. Is it something that needs to be done more upstream from a population
                  health, public health perspective? Where it's in the conversations of how vaccines should be allocated, how
                  emergent therapeutics should be allocated? My answer is that it needs to be in all those spaces. But the beauty
                  is that people are having the conversations and they're trying to figure out how to implement it.

                  <br />
                  <br />
                  <br />

                  In the one thing that I worried about, that I feared probably when most when these conversations started over
                  that people were going to, instead of acting and then figuring out later, were just going to think about it and
                  do more research and write more thoughts about it and just drag on this process that the Academy is has sometimes
                  made it to seem like the only way that we can move things forward is through a series of thoughts, and arguments
                  on those thoughts, and new thoughts. But I think that people have jumped that queue and gone straight to the,
                  “This may not be a perfect system, but at least we're going to try it because the outcome is worse than not.”

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:10:17] </b> Definitely. This does seem like a turning point, and you're so right that
                  something good has to come of this because so much harm has already happened to many marginalized communities.
                  And at least if these conversations about race and racism in medicine are being held more often, and aren't these
                  like uncomfortable hidden conversations, that does seem like something good is happening. And I hope that it sticks
                  around long after the crisis is over.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Nneka Sederstrom: [00:10:41] </b> I think it will. I think that we've reached new movement rate in this
                  in this bigger movement, I think that this is another touch point in the movement that is going to be harder to
                  die out. I do believe in, and that, I think, is because of the fact that there are people who are engaged in these
                  conversations who historically have never had to. The white suburban mom at Target on a Saturday that normally
                  would never have thought about a book club talking about how to be an anti-racist is picking up her copy because
                  her Neighborhood Book club decided to do that book right. Those were not the usual areas and spaces that you see
                  these conversations in the past, but now that's where they are and they're being normalized. So I think that this
                  is one of those pivotal moments in history that that will actually turn out for the better.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:11:46] </b> Could you elaborate more on the triage protocols you mentioned, where you took
                  a role in addressing health equity and racial awareness as your hospital established these protocols?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Nneka Sederstrom: [00:12:10] </b> Although we've never had to go into triage, of course, everybody had to
                  set up what would happen if, and the biggest – I don't want to say fight – but the biggest discord that I came
                  across in trying to set up an established a triage mechanism, for assisting in the state of Minnesota trying to
                  establish a triage mechanism, was this issue around whether or not the information about the patient coming into
                  the door should be blinded from those doing the triage. Because there's this belief that if that information about
                  race and gender and ethnicity is kept a secret from those doing the triaging, then that decreases the opportunity
                  for bias. And my argument is that it may decrease the opportunity for explicit or even implicit bias. But what it
                  also does is decrease the opportunity for amelioration of structural racism.

                  <br />
                  <br />
                  <br />

                  And so what I have pushed back on is that there needs to be an unblinding of this data specifically because we
                  know that the patient populations that are being affected more by COVID have suffered from racism that we need
                  to be intentional in figuring out ways to ameliorate that racism. In doing that, we will be able to try and level
                  the playing field a little better. So if you were blinded, then we won't know and we will be allocating resources
                  based off of random, arbitrary numbers that are impacting humans attached to those numbers but, it kind of keeps a
                  firewall between the humanity of the of the person impacted and the humanity of the person making the decision. What
                  I've argued we need to do is unblind and allow for people in the triage teams, whose entire purpose and whose
                  education and training is to address equity and inclusion, to be members of it so that they can help us think
                  through better how to make these decisions in a manner that addresses the racism and provides a more equitable
                  option for allocation of the resources.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:14:34] </b> So as we start to wrap up today, what else has been on your mind in regard
                  to ethics in medicine and public health and where we go forward from here with COVID-19?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Nneka Sederstrom: [00:14:55] </b> Yeah, I think that's the biggest thing, now that I'm trying to just
                  kind of hash out more in my brain, is around this concept that I published on, called “the give back,” and figuring
                  out ways to create an allocation structure that allows for this amelioration in a manner that people can stomach,
                  so to speak, because I think that there's the stress initially about the idea of making decisions based off of race.
                  There is this worry and fear that somehow if we are intentional in our decision making, if race is part of the
                  intentionality, then we are somehow violating the 14th Amendment of the Constitution. And my arguments is, and what
                  I'm hoping some of legal scholars will address as time goes on, is that if the 14th Amendments bars us from being
                  deliberate and addressing racism because we have to address race, then that's a failing of the amendment and somebody
                  needs to address that change the amendment, or is that just an interpretation that's been somehow misconstrued?
                  And if we truly engage in what the 14th Amendment meant, then we should not be barred from actually using race.
                  Because if that's the case, when we're never going to get to equity. Because without directly saying, this event
                  or this feature or this access or this treatment or whatever it is, is being done in this way in particular, to
                  address racism and to create some sort of corrective action for systemic racism – if we can't do that, then we're
                  never gonna get past where we are now, and I don't believe that that's the case. But if it happens to be the case
                  then I don't believe us the end of the story, laws are always changed. And that, I think, is the purpose of lawyers,
                  to make better laws when they're not good. So that should give the lawyers something to do. If that's what it turns
                  into. But I have a strong feeling that that's not really what it meant, but I'm not a legal scholar, so I don't
                  really know. But it definitely is what people are using as an attempt to not bring race into the conversation: this
                  worry that it would be considered unconstitutional as of this moment in time. But I think we need to get past that
                  because if we don't, then we're just going to consign more generations to outcomes that are based off structural
                  racism and not really use this time in a manner that we should be.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:17:14] </b> Okay, well, that's about it for today. Thank you again so much, Dr. Sederstrom,
                  for joining the Equity and Outcomes COVID-19 podcast. These are really tough issues to unpack. So I appreciate you
                  answering all my questions and shedding a lot of light on these difficult conversations.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Nneka Sederstrom: [00:17:54] </b> Yes, one day we will be through this and hopefully on the other side, we've come out better!

                </Header>
              </Header.Content>
            </Header>


          </div>
          <Notes />

        </Container>
      }










      {podcastTitle === "Dr.Judy_Monroe_on_Lesson_Learned_&_CDC" &&
        <Container style={{ marginTop: "8em", minWidth: '1260px' }}>

          <Breadcrumb style={{ fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt" }}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{ fontSize: "14pt" }} />
            <Breadcrumb.Section active>Podcast</Breadcrumb.Section>
          </Breadcrumb>
          <div width={888}>

            <Header style={{ width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400 }}>
              <Header.Content>
                "You've Got to Have Trust": Dr. Judy Monroe on Lessons Learned About Pandemic Preparedness
                <Header.Subheader style={{ fontSize: "18pt", fontWeight: 300, paddingTop: "15px" }}>


                </Header.Subheader>
                <div style={{ paddingTop: 10 }}>
                  <iframe src="https://anchor.fm/rsph-ched/embed/episodes/Youve-Got-to-Have-Trust-Dr--Judy-Monroe-on-Lessons-Learned-About-Pandemic-Preparedness-ein8ii" height="150px" width="800px" frameborder="0" scrolling="no"></iframe>
                </div>

                <Header style={{ fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0 }}>

                  <p style={{ textAlign: "left", fontWeight: 300 }}>

                    By Leanna Ehrlich on Aug. 26, 2020

                    <br />
                    Contributors: K.M. Venkat Narayan, Shivani A. Patel
                    <br />
                    From Emory University

                    <br />

                  </p>

                  <br />
                  <b>Transcript</b>
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:00:00] </b> Welcome to the second episode of the Health Equity and Outcomes COVID-19 podcast.
                  On this episode, we talked to Dr. Judy Monroe, the president and CEO of the CDC
                  Foundation. Welcome, Dr. Monroe, and let’s get started. How do you
                  think the country’s doing right now responding to the pandemic, and what do you
                  see as some key successes and also notable failures - especially related to health equity?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Judy Monroe: [00:00:24] </b> Our country has had challenges with the response. If we look at the numbers we’re
                  at 5.5 million confirmed cases now, 172,000 deaths, which is almost 25% of the world
                  cases and deaths, so that's the bad news. Our overall response certainly could have
                  been better. I think for the moment, though, the good news is we’re seeing declines
                  over the past few weeks in parts of the country, and now testing is available in
                  different forms, particularly the rapid saliva testing, so hopefully that will be
                  a really positive force. In terms of what’s gone well, we are a country with technology
                  and innovation, with how rapid vaccine development has taken place and those types
                  of things, those are on the success side.

                  <br />
                  <br />
                  <br />
                  But you know, if we look also right now with where we are, despite the fact that
                  cases are declining in parts of the country, we’re seeing an upward trajectory of
                  cases in places like Guam, Hawaii, California, Indiana, and Vermont right now. My
                  concern is that, with the first wave going across the United States, we've seen
                  where cases have surged and then they start to decline, and then the problem is,
                  folks let their guard down. We have not been, in this country, consistently and
                  across the entire population, as diligent toward the measures that we can all take
                  to stop the spread of the virus. That’s just wearing masks, hand washing, and distancing,
                  keeping that social distance. So when we see folks going back into areas where
                  there’s mass gathering, or in the bars, that type of thing, it’s quite concerning.
                  Right now, we’re seeing our colleges trying to reopen and many of them are open
                  only a few days and then they're going back to remote learning because folks are
                  not following those very basic individual behaviors that we need to see.

                  <br />
                  <br />
                  <br />

                  On the health equity side, what’s really interesting is we're now beginning to get
                  at least some additional data around this. A report that just came out recently
                  from New York City where they had been able to do antibody testing in a number of
                  people across New York City. And as we would expect, the hardest hit a zip codes,
                  are those of people of color, those individuals that work in restaurants, they drive
                  cabs, or they’re Uber drivers, those types of jobs where they’re out in the public,
                  and certainly keep our economy running, but they’re the ones at higher risk. We’ve
                  always said when it comes to social determinants of health, your zip code matters
                  more than your genetic code.

                  <br />
                  <br />
                  <br />

                  And then when we look at, hit very hard are American Indians and Alaska Natives,
                  they’ve had substantially higher impact. It’s social determinants of health: do
                  you have running water, are you living in crowded conditions, can you get care
                  when needed, do you trust the testing, all of those factors have led us to some
                  really startling results coming out of COVID.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:04:18] </b> You were the state health commissioner in Indiana during the H1N1 pandemic, as
                  well as the president of the Association of State and Territorial Health Officers.
                  What did you take away or learn from that experience about the role of state governors
                  and local leaders in pandemic preparedness and response, especially like now where we
                  don’t really have a national strategy and it very much is up to local response?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Judy Monroe: [00:04:40] </b> My first day on the job as state health officer in Indiana, I was briefed on the
                  pandemic preparedness planning that was taking place. And at that time, now this
                  was back in 2005, we as a country, being led by a secretary Michael Leavitt, as a
                  country were undergoing pandemic preparedness planning. And that was a remarkable
                  experience, and was my introduction to being a leader at the state level demonstrated
                  for me, the need for national planning.

                  <br />
                  <br />
                  <br />

                  And so when H1N1 came along, the country was really prepared not just because
                  we had plans in place, but I think there was a mental preparedness, where our
                  elected officials knew that we needed to have a national plan and they all abided
                  by that. I learned a lot about leadership during H1N1. Governor Daniels was my
                  governor, and I remember meeting with him, early morning right after we heard about
                  H1N1, it’s 7:30 in the morning, I’m in his office at the state house, I’m briefing
                  him, and he says, “You know, Judy, the state wants to hear from you, not a layman
                  like myself, and I recommend that you get on a state plane and you go to every media
                  market across the state of Indiana and get in front of this and let people know what we know.”

                  <br />
                  <br />
                  <br />

                  Now at that point in time, what we knew was that we had an emerging novel
                  influenza virus, and we didn’t have a vaccine at that point. We didn’t know
                  how it would respond to treatment. But we were able to practice the basics of
                  risk communication: to be credible, to be first, to let people know what we did
                  know and what we didn't know. We gave everyone the actions that they could do.
                  We told everyone, wash your hands, cover your cough, stay home if you're sick:
                  that was our mantra until we were able to understand better the antivirals and
                  particularly when a vaccine became available.

                  <br />
                  <br />
                  <br />

                  So when I look at government, the importance of having a national plan, that
                  then the states are able to deploy, and then going down to that local level,
                  is really the way this should flow. And so as a state leader I was able to get
                  out there, shoulder to shoulder with local leaders, and we gave the message together.
                  So there was no question in the minds of the public that everyone was in alignment,
                  everyone was telling the public everything that we knew, and in doing that, we created
                  trust. We developed trust in the majority of the population. I was personally pleased
                  when I got feedback that the children had seen me on the news and would be telling
                  their parents, you’ve got to make sure you wash your hands, cover your cough.
                  You know you’ve broken through when the children are carrying your message for you
                  and they believe in that message, so really important.

                  <br />
                  <br />
                  <br />

                  One story I think about, with schools closing, was an area of real concern and
                  question. We needed to make some decisions about schools closing before CDC could
                  finalize it’s guidance. One of the things I told everyone in my state during H1N1
                  was, we will be following CDC guidance, and that's one way to certainly have consistency
                  across the country and CDC is constantly updating their guidance based on new
                  information as we learn about a novel virus such as this. And so there was a big
                  question though, because CDC guidance wasn’t quite available yet. So I remember,
                  again, wee hours of the morning, having conversations with the local health officer,
                  so that we came to a conclusion about closing schools that we were united in that
                  decision. Then I remember having calls, I took the state, she took the locals, and
                  I talked with state authorities, education, the governor’s office, with Homeland
                  Security, everyone, and she was managing all the local leaders. And at about 2
                  o’clock that day, we had a big press conference, to announce we were going to close
                  some schools there in the Indianapolis area. And again we were shoulder to shoulder -
                  there was no question in the minds of the public what the message was, why we were doing
                  it, and how long we anticipated. And everyone abided by our request, there was no
                  controversy, or pushback, it was pretty remarkable. So I think what I learned going
                  back to this is that you’ve gotta have trust, you need consistent messaging, it’s
                  gotta be science-driven, and letting people know that we will be learning along the way.

                  <br />
                  <br />
                  <br />

                  Another story, when the vaccine became available, that we had some challenges with,
                  were the black community in Lake County, Indiana. You know there's a long history of
                  African Americans being tested by the government and low trust in the government. So
                  now you have a free vaccine being given by the government. That put a lot of concern
                  in the minds of people in the community. And so I went up. I remember the day I went
                  up. We met with local pastors and First Ladies of the black churches. Again, I was
                  doing that in alignment with local authorities, state authorities. And these local
                  pastors and First Ladies got in line, and they were the first to get the vaccine.
                  And then they saw their trusted leaders. This really drives home how important communities are.

                  <br />
                  <br />
                  <br />

                  At the end of the day, any national plan has to be translated down to that community
                  neighborhood level. That's how we really manage a pandemic and do it effectively

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:11:08] </b> So our final question is about some work at the CDC Foundation has been doing.
                  We know the CDC Foundation has been drawing attention recently to the discrimination
                  against African Americans and other minorities, and cyclical inequities in education
                  and income and health that all sort of feed into each other. Could you tell us more
                  about what the Foundation and its allies are doing to promote health equity around COVID-19 outcomes?

                  <br />
                  <br />
                  <br />

                  <b>Dr. Judy Monroe: [00:11:32] </b> Yes, this is an area that we really feel passionate about. And so we have several
                  initiatives underway. One is working with Morehouse University in the Satcher Health
                  Leadership Institute on a project where there will be a Health Equity Task Force that
                  will utilise knowledge of experts in a range of fields to develop a platform that's
                  going to allow everyone from policymakers to researchers to be able to access standardized
                  demographic data related to the current pandemic. I think any time we see a pandemic or
                  other epidemics emerge, detailed demographic data about those being impacted by the
                  disease just seems to never be available when it's needed most. A hope of this project
                  is to take a deep level of data, make sure that there's a deep level of data available
                  in real time to be able to address health equity implications of the COVID-19 pandemic.
                  So we're really very excited about that and excited about being part of this Health Equity
                  Task Force. Morehouse is partnered with Google.org and Gilead Sciences, to be able to
                  collect and analyze this detailed data to get to these root causes and drivers of the differences for people of color.

                  <br />
                  <br />
                  <br />

                  So that's one. The other is Community Coalitions. We have some projects underway and
                  hope to do more in terms of really engaging communities with those trusted organizations
                  and institutions that can help mobilize African American communities and other communities
                  of color to be able to really address the morbidity and mortality that we're seeing and to
                  be able to make sure that preventive community mitigation strategy pieces are being
                  adopted and coming from trusted individuals. This has everything to do with contact
                  tracing. We need folks to answer the phone, but if they don't trust that they should
                  give information out about their contacts, that's a problem for this response.

                  <br />
                  <br />
                  <br />

                  We've talked about the face coverings and physical distancing which is needed, and then,
                  of course, that once the vaccines are available, the vaccine engagement is going to be a
                  really important area. So along with that, we also are doing a number of things in
                  communications. We have some national communication efforts underway to help drive the
                  message to these vulnerable populations, particularly. One thing that's really interesting
                  for the Foundation and new for us, we've partnered with CDC on, we've been able to hire,
                  we're calling it the COVID-19 Corps, the CDC Foundation COVID-19 Corps, where we've hired
                  literally hundreds of people across the country. We have a team in every state, tribal
                  organizations, the six largest cities and territories. These range from contact tracers,
                  to epidemiologists, nurses, physicians, data analysts, a whole host of positions we've
                  been able to hire. In addition to 10 senior advisers that are very seasoned individuals
                  with backgrounds as state health officers or state epidemiologists as examples,
                  long careers at CDC, and they have formed among themselves a smaller group that's
                  looking at health equity particularly. We broke it down to the HHS regions across the
                  country. So we have these senior advisers looking at their states in their region at
                  vulnerable populations; again, this such an important area for us, and diving deep into
                  where those communities of need are, and then we are working to try to support communities
                  on the ground where they're needed.

                  <br />
                  <br />
                  <br />

                  A new example of that is Richmond, Virginia, where there was a Latinx community where
                  they represented 6% of the population, had 30% of the COVID cases. Again kind of the gig economy.
                  These were folks living in, multiple people living in households, but they're part of the
                  gig economy with driving Ubers, or doing hourly wage type of work. They were really fearful
                  if they gave information to contact tracers, they were fearful they would lose their jobs.
                  So we had a whole community on the verge of homelessness because they had so many COVID cases.
                  And so that's a population that we're working with. We were able to provide funding
                  and to help them. And working with the mayor's office, the local authorities, state authorities,
                  and our senior advisor’s been involved in that response area.

                  <br />
                  <br />
                  <br />

                  So when we look across the country, there's just one community after another that needs help,
                  and we need to drive, we need to understand the data, we need to know the best practices, and
                  then disseminate those quickly. But nothing takes the place of really partnering right down to that neighborhood level.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:17:06] </b> Well, thank you so much for joining today. I want to draw attention as well to a podcast that
                  the CDC Foundation has been releasing that people can access at
                  <a style={{ color: "#397AB9" }} href="http://www.CDCfoundation.org/conversations" target="_blank" rel="noopener noreferrer"> www.CDCfoundation.org/conversations. </a>
                  And I know you guys have recorded three episodes recently focused on COVID-19. So we encourage people
                  to check those out as well, if this conversation was of interest to them.


                </Header>
              </Header.Content>
            </Header>


          </div>
          <Notes />

        </Container>
      }










      {podcastTitle == "Dr.Carlos_Del_Rio_on_COVID-19_Equity_&_Outcomes" &&
        <Container style={{ marginTop: "8em", minWidth: '1260px' }}>

          <Breadcrumb style={{ fontSize: "14pt", paddingTop: "14pt", paddingBottom: "14pt" }}>
            <Breadcrumb.Section link onClick={() => history.push('/media-hub')}>Media Hub</Breadcrumb.Section>
            <Breadcrumb.Divider style={{ fontSize: "14pt" }} />
            <Breadcrumb.Section active>Podcast</Breadcrumb.Section>
          </Breadcrumb>
          <div width={888}>

            <Header style={{ width: 800, marginLeft: 260, fontSize: "32pt", fontWeight: 400 }}>
              <Header.Content>
                Dr. Carlos Del Rio on COVID-19 Equity and Outcomes
                <Header.Subheader style={{ fontSize: "18pt", fontWeight: 300, paddingTop: "15px" }}>


                </Header.Subheader>
                <div style={{ paddingTop: 10 }}>
                  <iframe src="https://anchor.fm/rsph-ched/embed/episodes/Dr--Carlos-Del-Rio-on-COVID-19-Equity-and-Outcomes-ehuljb" height="150px" width="800px" frameborder="0" scrolling="no"></iframe>
                </div>

                <Header style={{ fontSize: "14pt", lineHeight: "16pt", fontWeight: 400, paddingTop: 0 }}>

                  <p style={{ textAlign: "left", fontWeight: 300 }}>

                    By Leanna Ehrlich on Aug. 10, 2020

                    <br />
                    Contributors: Pooja Naik, K.M. Venkat Narayan, Shivani A. Patel
                    <br />
                    From Emory University

                    <br />

                  </p>

                  <br />
                  <b>Transcript</b>
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:00:00]</b> Welcome to the first. Health Equity and outcomes COVID-19 Podcast.
                  On this episode we talked to Dr. Carlos Del Rio, a distinguished professor of medicine in
                  the division of infectious diseases at Emory University School of Medicine and Executive
                  Associate Dean for Emory at Grady Hospital. He is also Professor of Global Health in the
                  Department of Global Health and a Professor of Epidemiology at the Rollins School of Public Health.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Carlos Del Rio: [00:00:26]</b> It's just been so hard to see how how disproportionate impact this epidemic
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

                  <br />
                  <br />
                  <br />

                  <b>Dr. Carlos Del Rio: [00:01:57]</b> So I think if COVID tells us something is that we need to really
                  at the root address and and and eradicate and really begin to take seriously the racial disparities
                  that have existed for such a long time.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:02:12]</b> I'm really curious like what you see as I guess the future of the
                  pandemic response taking into account these inequities.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Carlos Del Rio: [00:02:20]</b> Well you know I think what we need to realize is that we have multiple
                  pandemics in this country. We have several pandemics and each community has to have a different approach.
                  And we need to think about how do we involve the community. How do we really have a true community response.
                  How do we truly have a community participation. How do we make sure the community that we work with community
                  in addressing the pandemic because this is not going to be solved from from the top down. This is going to be
                  solved with community participation. So as we look at for example vaccine studies my biggest fear is that we're
                  not going to be involving the community as much as we should because we really need the community to be front
                  and center in the response. I mean we have you know among the African-American population there's been mistrust
                  from just keep you down. Right. So.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:03:12]</b> Yes.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Carlos Del Rio: [00:03:12]</b> So you know you're gonna go in there with a vaccine.
                  It's gonna be difficult so we have to work with community to educate them and to make them understand why this is important.

                  <br />
                  <br />
                  <br />

                  <b>Dr. Carlos Del Rio: [00:03:21]</b> And I think that one thing that to me is is very significant is how
                  you know a place like like Grady has which has responded to African-American populations and has done
                  this for a long time. What we've seen here is we haven't seen a higher higher impact of the epidemic.
                  I mean we have seen a higher mortality among minorities. Right. The the the outcomes have been the same.
                  And I think that's because we are we are. This is our population we're comfortable treating them. And
                  therefore we've done a good job with them.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:03:57]</b> Absolutely. Do you see there being a reality in the near future where we're
                  testing catches up to cases either because cases are going down hopefully or because testing is significantly ramped up.

                  <br />
                  <br />
                  <br />

                  <b> Dr. Carlos Del Rio: [00:04:08]</b> They are. But you don't can't you can't ramp it up much more.
                  The problem is you know the U.S. already is consuming 55 percent of the testing capacity of the world.
                  So imagine if we all of a sudden consume even more. Wouldn't that be an inequity for the rest of the world.
                  And it's just because we're not doing a good job controlling our epidemic that we need more and more testing.
                  I mean the problem is you know we need a national strategy. And here's what would happen in our national strategy.
                  You know the testing capacity up in Boston cannot be moved to Atlanta but if you had a national coordinator
                  the testing capacity in Atlanta. So you would say oh Atlanta has too little testing capacity but Boston has
                  too much. We'll take the swabs from Atlanta and ship them to Boston and get them run in Boston right.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:04:48]</b> Yeah.

                  <br />
                  <br />
                  <br />

                  <b> Dr. Carlos Del Rio: [00:04:48]</b> But but that wouldn't require a national strategy which the president
                  from day one said it's gonna be a state strategy. And I think having a state strategy has been one of the
                  biggest problems in our country because by having a state strategy we essentially have 50 strategies and
                  we don't have any way to actually you know consolidate and synergize and help each other out.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:05:11]</b> Do you think right now is the biggest change that could be made in the US
                  either within population health or in the medical system or public health system to change the course of the pandemic?

                  <br />
                  <br />
                  <br />

                  <b> Dr. Carlos Del Rio: [00:05:21]</b> We need rapid turn around in testing and we need quick very efficient
                  and well done contact tracing. We're not doing contact tracing the way it's supposed to be done where we're
                  essentially are wasting what would be the benefits of contact tracing by not doing it the right way.

                  <br />
                  <br />
                  <br />

                  <b>Leanna Ehrlich: [00:05:38]</b> Well this has been such an interesting conversation. Thank you for joining
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
