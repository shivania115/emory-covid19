import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header, Table, Segment } from 'semantic-ui-react'

export default function VaccinesFAQ(props){

  return (
    <div>
      <AppBar menu='dataSources'/>
      <Container style={{marginTop: '8em', minWidth: '1260px'}}>
        <Header as='h1' style={{paddingTop: 16, fontWeight: 400, fontSize: "24pt"}}>

          <Header.Content>
            Frequently Asked Questions about COVID-19 Vaccines
            <Header.Subheader style={{paddingTop:'1rem', paddingBottom:'1rem', lineHeight: "18pt", fontWeight: 400, fontSize: "14pt", color: 'black'}}> 
            This is a resource guide to answer common questions about the COVID-19 vaccines. This guide is based on the best available information as of {Date().slice(4,10)}. Before taking the vaccine, please consult your healthcare provider.
            </Header.Subheader>
          </Header.Content>
        </Header>

        <Divider />

        <Header as='h2' style={{paddingTop: 0, fontWeight: 600}}>
            General Information
        </Header>

        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            What COVID-19 vaccines are approved for use in the United States?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
            At this time, two vaccines have been approved for use by the United States Food and Drug Administration (<a style ={{color: "#397AB9"}} href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/covid-19-vaccines" target="_blank" rel="noopener noreferrer">FDA</a>): 
            one developed by the company <a style ={{color: "#397AB9"}} href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/pfizer-biontech-covid-19-vaccine" target="_blank" rel="noopener noreferrer"> Pfizer-BioNTech </a>
            and one by <a style ={{color: "#397AB9"}} href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/moderna-covid-19-vaccine" target="_blank" rel="noopener noreferrer"> Moderna </a>. 
        </p>

        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            What are the differences between the approved vaccines?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
            Both the <a style ={{color: "#397AB9"}} href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/pfizer-biontech-covid-19-vaccine" target="_blank" rel="noopener noreferrer"> Pfizer-BioNTech </a>
            and the <a style ={{color: "#397AB9"}} href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/moderna-covid-19-vaccine" target="_blank" rel="noopener noreferrer"> Moderna </a>
            vaccines have shown that they are very effective in preventing symptomatic COVID-19 disease (95% and 94.1% effective, respectively). They have also shown that they are safe to get. 
            However, there are a few small differences in who should get them and when. The most important ones for anyone getting a vaccine are the following:
        </p>
        <Container style={{paddingLeft:'12rem', paddingBottom:'0.5rem'}}>
        <Table celled compact style={{fontWeight: 400, fontSize:'13pt', width: '60rem'}}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={3}>Pfizer-BioNTech COVID-19 vaccine</Table.HeaderCell>
              <Table.HeaderCell width={3}>Moderna COVID-19 vaccine</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{lineHeight: "14pt"}}>Approved for individuals aged 16 years and older</Table.Cell>
              <Table.Cell style={{lineHeight: "14pt"}}>Approved for individuals aged 18 years and older</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell style={{lineHeight: "14pt"}}>2 doses, 3 weeks apart</Table.Cell>
              <Table.Cell style={{lineHeight: "14pt"}}>2 doses, 4 weeks apart</Table.Cell>
            </Table.Row>
            </Table.Body>
        </Table>
    </Container>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            What ingredients are in the approved COVID-19 vaccines?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
            Each vaccine that is being developed is slightly different. The two vaccines for COVID-19 currently approved by the Food and Drug Administration (FDA) for use in the United States are the Pfizer-BioNTech COVID-19 vaccine and the Moderna COVID-19 vaccine. 
            The active ingredient of these vaccines is mRNA. The two vaccines also include other ingredients like fat, salts, and sugars that protect the mRNA. These ingredients also help the mRNA work better in the body, and protect the vaccine when it is stored at very cold temperatures. 
            The specific ingredients for each vaccine are listed <a style ={{color: "#397AB9"}} href="https://www.cvdvaccine-us.com/images/pdf/fact-sheet-for-recipients-and-caregivers.pdf" target="_blank" rel="noopener noreferrer"> here </a>for the Pfizer-BioNTech vaccine and
            <a style ={{color: "#397AB9"}} href="https://www.modernatx.com/covid19vaccine-eua/recipients/faq" target="_blank" rel="noopener noreferrer"> here </a> for the Moderna vaccine. 
            <u> Neither vaccine contains preservatives, eggs, or latex. Neither vaccine contains any kind of fetal tissue.</u>
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            What is an mRNA vaccine?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
            The approved COVID-19 vaccines are a new type of vaccine called an mRNA <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/different-vaccines/mrna.html" target="_blank" rel="noopener noreferrer"> vaccine</a>.
            An mRNA vaccine contains “instructions” for the body to make a piece of the “spike protein” found on the surface of the virus that causes COVID-19. These vaccines do not contain the whole virus.  
            The body then follows the instructions in the mRNA to make spike proteins and the immune system learns to recognize those proteins. 
            The body can then make antibodies to fight viruses that have this protein, in the same way it would learn to recognize and fight the virus if you actually got a COVID infection. 
        </p>
        <p style={{paddingTop:'1rem',paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
            mRNA vaccines cannot change a person’s DNA. The mRNA from the vaccine does not interact with a person’s DNA. mRNA is not “permanent”. In fact, it is quite fragile and breaks down quickly after it has triggered the body to make the virus spike proteins. 
            The mRNA “instructions” in these vaccines is likely to be read just by the muscle cells in your arm and some immune system cells. It will not be read by cells in other parts of your body.
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Can I get COVID-19 from taking the mRNA vaccine?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        No. mRNA vaccines cannot make anyone sick with COVID-19. They do not contain the virus that causes COVID-19. However, after receiving a vaccine, you may experience feelings like a headache or muscle aches. 
        The headaches and muscle aches happen because the vaccine triggers your body’s  immune system and teaches it how to fight the virus. That is good news! If you do <b>not</b> experience these symptoms, 
        however, that does not mean your immune system is not reacting to the vaccine and learning how to fight the virus or that the vaccine is not working. 
        Individuals react differently to vaccines and your body may just have a less pronounced response.
        </p>



        <Header as='h2'>
            <Header.Content>
                Vaccine Development
            </Header.Content>
        </Header>

        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            How many vaccines are currently being studied?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        There are <a style ={{color: "#397AB9"}} href="https://covid19.trackvaccines.org/vaccines/" target="_blank" rel="noopener noreferrer"> currently </a>
        78 vaccines in various phases of testing across the world. Of these, 20 are in <a style ={{color: "#397AB9"}} href="https://covid19.trackvaccines.org/trials-vaccine-testing/#trial-phases" target="_blank" rel="noopener noreferrer"> Phase 3 </a>
        clinical trials. Phase 3 trials are the large-scale studies done before a vaccine is approved.
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Will the approved vaccines protect against new variants of the coronavirus?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        It is hard to know exactly how effective the authorized vaccines will be against new and different variants of SARS-CoV-2, the virus that causes COVID-19. 
        Right now, the limited information we have suggests that the immune protection both from natural infection (i.e. actually getting COVID-19) or 
        from vaccination will still protect against most new variants. However, this is a changing situation, and something scientists are continuing to study. 
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            What is Operation Warp Speed?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
            Operation Warp Speed is a partnership among components of the Department of Health and Human Services and the Department of Defense to help develop, make, 
            and distribute millions of vaccine doses for COVID-19 as quickly as possible after making sure that the vaccines are safe and that they work. 
        </p>
        <p style={{paddingTop:'1rem',paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
            Details about Operation Warp Speed can be found <a style ={{color: "#397AB9"}} href="https://www.hhs.gov/coronavirus/explaining-operation-warp-speed/index.html" target="_blank" rel="noopener noreferrer"> here </a>.
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            What does it mean if a clinical trial is “paused”?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        During clinical trials, the top priority is safety of the participants. The clinical trials of the COVID-19 vaccines are no different. 
        It is normal for a clinical trial to be temporarily paused when a possible side effect (or “adverse event”) is found. This pause happens so that the side effect can be investigated fully, 
        to see if it is really related to the vaccine, or to something else. This is done by doctors and an independent monitoring board of other scientists, not by the pharmaceutical company. 
        Clinical trials are specifically designed to allow for potential pauses, so that they can put patient safety at the absolute top of the priority list. 
        </p>


        <Header as='h2'>
            <Header.Content>
                Vaccine Safety
            </Header.Content>
        </Header>

        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            What is an Emergency Use Authorization (EUA) for vaccines?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        An <a style ={{color: "#397AB9"}} href="https://www.fda.gov/emergency-preparedness-and-response/mcm-legal-regulatory-and-policy-framework/emergency-use-authorization" target="_blank" rel="noopener noreferrer"> Emergency Use Authorization </a>
        is a way that the Food and Drug Administration (FDA) can approve a treatment when there is no alternative treatment for a major health threat. 
        The Food and Drug Administration issues Emergency Use Authorization only when a panel of doctors agrees that the benefits of the treatment very clearly outweigh the risk. 
        The Food and Drug Administration issued Emergency Use Authorization of the COVID-19 vaccine because there are no other treatments available and a panel of doctors decided there was enough information that the benefits of the vaccine are greater than the risks. 
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Are the approved COVID-19 vaccines safe?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        Yes. Any vaccine that is approved for use is thoroughly tested to make sure that it is both effective and safe. Tests for safety already happen in Phase I, Phase II, and Phase III clinical trials. 
        However, vaccines continue to be tested for safety after they are approved for use, in what are called “Phase IV” studies. All the vaccines for COVID-19 are being developed through careful scientific studies, 
        which follow strict standards set by the Food and Drug Administration (FDA). During vaccine development and testing, researchers carefully study whether each vaccine effectively reduces the chances of getting COVID-19 or getting sick from COVID-19. 
        Researchers have tested the vaccines on thousands of study participants during Phases I-III. Researchers also track whether a vaccine causes side effects, the kind of side effects people experience, and how serious those are. 
        All of the side effects are reported to doctors making the decision about whether the vaccine is safe.
        </p>

        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        There are very strict standards about whether a vaccine is authorized as safe by the Food and Drug Administration. Before a COVID-19 vaccine is approved, scientists must show that any risks of side effects from the vaccine are outweighed by its benefits and 
        by the potential harm of getting sick from COVID-19. You can find additional information about COVID-19 vaccine safety on the <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety.html" target="_blank" rel="noopener noreferrer"> CDC’s website </a>
        and the full documents shared with the FDA <a style ={{color: "#397AB9"}} href="https://www.fda.gov/media/144434/download" target="_blank" rel="noopener noreferrer"> here </a> for the Moderna vaccine and
        <a style ={{color: "#397AB9"}} href="https://www.fda.gov/media/144245/download" target="_blank" rel="noopener noreferrer"> here </a> for the Pfizer-BioNTech vaccine. Vaccine safety monitoring does not stop once a vaccine is approved. 
        It continues on a larger scale with Phase IV studies as well as nationwide vaccine safety reporting systems.
        </p>
        
        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        There are multiple systems used to track any reports of any adverse side effects or reactions. The Vaccine Safety Datalink which helps to determine whether the reactions reported using the Vaccine Adverse Event Reporting System (VAERS) are related to a vaccine. 
        The Clinical Immunization Safety Assessment Project also helps to track and evaluate issues of vaccine safety. You can find out more about these and other different systems at CDC, the Food and Drug Administration, 
        and other groups used to monitor and assess safety  <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety.html" target="_blank" rel="noopener noreferrer"> here </a>.
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Are there concerns about the COVID-19 vaccine and fertility?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        No. There is no evidence to suggest that the COVID-19 mRNA vaccines would increase the risk of infertility. This is a concern that began to be shared widely by non-scientific sources. 
        However, there is no connection between the virus spike protein targeted by the vaccine and human reproductive tissue. As a result, there is no reason to be concerned about any effect of these vaccines on fertility.  
        </p>


        <Header as='h2'>
            <Header.Content>
                Getting Vaccinated
            </Header.Content>
        </Header>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Is the COVID-19 vaccine effective in protecting people against getting COVID-19?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        Yes. The clinical trials for each approved vaccine showed that the vaccine was effective in protecting vaccinated people from getting sick with COVID-19 disease. 
        For each of the approved vaccines, 2 doses are required to be fully protected from COVID-19. Individuals are not considered to be “vaccinated” until after they receive their 2<sup>nd</sup> dose.
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Can the vaccine make me sick with COVID-19?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        No. The COVID-19 vaccines do not contain COVID-19 virus particles that could cause the disease.
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Do I need two doses of the COVID-19 vaccine?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        Yes. Both approved vaccines (developed by Pfizer-BioNTech and Moderna) are given in two doses. One dose is not effective enough to provide strong protection against COVID-19. You can enroll in 
        <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/vaccines/covid-19/reporting/vaxtext/index.html" target="_blank" rel="noopener noreferrer"> CDC’s VaxText program </a>
        to receive text messages to remind you when it is time to get your second dose.
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Do I need two doses of the COVID-19 vaccine?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        Yes, whenever possible. You should get both doses of the same vaccine. In other words, you should not “mix and match” vaccines from different manufacturers. When you get your first vaccine dose, you will receive a card with the date, 
        the name of the manufacturer, and lot number of the vaccine you received and the date when you should get the second dose. You should take that card to your next vaccination appointment to keep track of what vaccine you were given and when. 
        This will help the healthcare staff provide you with the correct second dose. Getting two different types of vaccines will likely not give you more protection than one type of vaccine. 
        The safety of getting vaccinated by two different vaccines has not been directly tested in clinical trials, so this is not recommended. In very limited situations, CDC recently published
        <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/vaccines/covid-19/info-by-product/clinical-considerations.html" target="_blank" rel="noopener noreferrer"> guidance </a>
        to allow for two doses of different vaccines to be given. This should only be done if the vaccine given for the first dose is no longer available or it is not possible to determine which vaccine was used for the first dose. This should be avoided if at all possible.  
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Will a flu shot protect me from COVID-19?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        No. Getting a flu vaccine can only protect you from getting influenza (flu). It will not protect you from getting COVID-19 or from getting sick if you get COVID-19. If you do get COVID-19, being protected from the flu can keep you from having a more severe illness. 
        Therefore, getting a <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/flu/prevent/index.html" target="_blank" rel="noopener noreferrer"> flu vaccine </a>
        is still important. 
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Will the COVID-19 vaccine protect me from the flu?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        No. Once you are able to get a COVID-19 vaccine, it will not protect you from getting the flu (influenza) or from getting sick if you do get the flu. Even after you get a vaccine for COVID-19, you should continue getting a flu vaccine every year to protect yourself from seasonal flu.
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            I’ve already had COVID-19. Should I still get vaccinated?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        Yes. Since COVID-19 is a new virus, we do not know how long immunity (or protection) someone gets from having an infection lasts. In general, immunity after an infection depends on both the disease and the individual. 
        So far, based on evidence from a small number of people, it seems like immunity from a COVID-19 infection may not last very long. More research is needed to understand this fully and to get a clearer sense of how long it might last. 
        Because we do not yet know how long this immunity will last, it is still important to get vaccinated even if you had COVID-19 and recovered.
        </p>

        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        However, if you currently have COVID-19, you should wait to get vaccinated until you feel better and your isolation period is over. There is data suggesting that getting re-infected with COVID-19 within 90 days following infection is uncommon. 
        As a result, some people may choose to wait 90 days after they have recovered from COVID-19 before getting vaccinated.
        </p>
        
        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        If you were recently exposed to COVID-19 and you can safely quarantine away from other people, you should also wait to get the vaccine until after your quarantine period. If there is a high risk you could transmit the virus to others, 
        you may discuss getting vaccinated during your quarantine period with your healthcare provider so you can protect others.
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            What side effects can I expect after I get the COVID-19 vaccine?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        The <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/expect/after.html" target="_blank" rel="noopener noreferrer"> side effects </a> of the two approved vaccines are similar to typical side effects you might experience after getting other vaccines. 
        Common side effects people report are: a sore arm where you got the vaccine, tiredness, headaches, and muscle pain. Other side effects reported in some of the clinical trials include chills, joint pain, and fever. Most people reported that these lasted a day or less.
        </p>

        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        For both vaccines that have been approved, more people experienced side effects after the second dose than after the first dose. These side effects mean that your immune system is working to protect you against COVID-19, and that is a good sign.
        </p>
        
        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        More data on the types of side effects and reactions experienced by participants in the vaccine trials can be found <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/vaccines/covid-19/info-by-product/pfizer/reactogenicity.html" target="_blank" rel="noopener noreferrer"> here </a>
        for the Pfizer-BioNTech vaccine and <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/vaccines/covid-19/info-by-product/moderna/reactogenicity.html" target="_blank" rel="noopener noreferrer"> here </a> for the Moderna vaccine.
        </p>

        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        You may see some rumors about untrue side effects online or on social media. Make sure any time you see a claim about a side effect that you carefully check the source of that claim. Some trustworthy sources are:
        <ul>
        <li>
        <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/index.html" target="_blank" rel="noopener noreferrer"> CDC website </a>
        </li>
        <li>
        <a style ={{color: "#397AB9"}} href="https://www.mayoclinic.org/coronavirus-covid-19/vaccine" target="_blank" rel="noopener noreferrer"> Mayo Clinic website </a>
        </li>
        <li>
        Your local Department of Health website
        </li>
        </ul>
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            Is there a risk of an allergic reaction to the COVID-19 vaccine? 
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        As for any vaccine there is a very small chance of a severe allergic reaction. These are very rare but, when they do happen, they usually happen in people who have a history of severe allergic reactions. There are reports that a small number of people have had serious 
        <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety/allergic-reaction.html" target="_blank" rel="noopener noreferrer"> allergic reactions </a> after getting a COVID-19 vaccine. 
        </p>

        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        A severe allergic reaction will usually happen within a few minutes to an hour after getting vaccinated. Your healthcare provider may ask you to stay at the place where you received your vaccine for a short time so that they can make sure you are safe when you leave. 
        This is particularly important if you have had allergic reactions in the past. If you have had an allergic reaction to a vaccine in the past, you should let your healthcare provider know ahead of time. Signs of a severe allergic reaction can include: 
        <ul>
        <li>Difficulty breathing</li>
        <li>Swelling of your face and throat</li>
        <li>A fast heartbeat</li>
        <li>A bad rash all over your body</li>
        <li>Dizziness and weakness</li>
        </ul>
        Some people have reported less severe allergic reactions within 4 hours after getting vaccinated (known as an “immediate allergic reaction”). Symptoms of this type of reaction include:
        <ul>
        <li>Hives</li>
        <li>Swelling</li>
        <li>Wheezing</li>
        </ul>
        If you experience any of these symptoms after vaccination, tell your provider. They will be prepared and will be able to give you the care and advice that you need to resolve the allergic reaction. 
        </p>
        
        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        If you experienced any kind of allergic reaction after getting the first dose of a COVID-19 vaccine, you should not get the second dose. If you have had an allergic reaction to any of the ingredients in one of the COVID-19 vaccines, 
        you should not get these vaccines. In either case, you should let your healthcare provider know and report this reaction. 
        </p>


        <Header as='h3' style={{fontSize:'14pt', paddingLeft:'2rem'}}>
            How can I report any side effects or allergic reactions I have to a COVID-19 vaccine?
        </Header>
        <p style={{paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        You can report any possible side effects to CDC through the <a style ={{color: "#397AB9"}} href="https://vaers.hhs.gov/reportevent.html" target="_blank" rel="noopener noreferrer"> Vaccine Adverse Event Reporting System </a>. 
        This is a national system that helps CDC monitor the safety of approved vaccines, including the COVID-19 vaccines. Ensuring that vaccines are safe is a top priority for CDC and the Food and Drug Administration (FDA). 
        Vaccine Adverse Event Reporting System data helps scientists to look for side effects or reactions that are unexpected, more frequent than expected, or unusual. You can learn more about vaccine side effects and how they are monitored
        <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/vaccinesafety/ensuringsafety/sideeffects/index.html" target="_blank" rel="noopener noreferrer"> here </a>.
        </p>

        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', marginBottom:'0', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        Healthcare providers are required to report certain reactions and side effects following vaccination to the Vaccine Adverse Event Reporting System. They must follow certain requirements relating to any safety issues 
        while the vaccines are being used under the Food and Drug Administration’s Emergency Use Authorization; these requirements are posted on their 
        <a style ={{color: "#397AB9"}} href="https://www.fda.gov/emergency-preparedness-and-response/mcm-legal-regulatory-and-policy-framework/emergency-use-authorization" target="_blank" rel="noopener noreferrer"> website </a>.
        </p>
        
        <p style={{paddingTop:'1rem', paddingLeft:'2rem', paddingRight:'1rem', fontWeight: 400, fontSize: "14pt", textAlign: 'justify'}}>
        CDC is also using a new smartphone-based tool called <a style ={{color: "#397AB9"}} href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety/vsafe.html" target="_blank" rel="noopener noreferrer"> <b>v-safe</b> </a> 
        to check-in on people’s health after they receive a COVID-19 vaccine. When you receive your vaccine, you should also receive a <b>v-safe</b> information sheet telling you how to enroll in <b>v-safe</b>. If you enroll, 
        you will receive regular text messages for surveys where you can report any problems, side effects, or reactions you have after your vaccine. This tool does not track you or your location, and only records information that you directly give to it. 
        By using <b>v-safe</b>, you can help scientists gather even more information about vaccine safety, and you could be helping your community stay safe.
        </p>


        <Header as='h2'>
            <Header.Content>
                After You Are Vaccinated
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
