import React from "react";
import {
  Grid,
  Image,

} from "semantic-ui-react";


function LatestOnThisDashboard() {
    return (
      <Grid>
        <Grid.Column style={{ width: 110, fontSize: "16pt", lineHeight: "18pt" }}>
          <b>The Latest on this Dashboard</b>
        </Grid.Column>
        <Grid.Column style={{ width: 20 }}></Grid.Column>
  
        {/* <Grid.Column style={{width: 190}}>
          <Image width = {175} height = {95} src='/HomeIcons/Emory_Icons_NationalReport_v1.jpg' />
        </Grid.Column>
        <Grid.Column style={{width: 250, fontSize: "8pt"}}>
          <b> National Report <br/> </b>
  
          The National Report tab takes you to a detailed overview of the impact of COVID-19 in the U.S.. 
          How has the pandemic been trending?  
          Who are the most vulnerable communities...
          <a href = "/national-report">for more</a>. 
          
        </Grid.Column> */}
  
        {/* <Grid.Column style={{ width: 190 }}>
          <Image width={175} height={95} href="/national-report" src='/HomeIcons/Emory_Icons_LatestBlog_v1.jpg' />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b> National Report <br /> </b>
  
          The National Report offers a detailed overview of the impact of COVID-19 in the U.S..
          How has the pandemic been trending?
          Who are the most vulnerable communities...
          <a href="/national-report">click to access</a>.
  
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image width={175} height={95} href="/Vaccine-Tracker" src='/HomeIcons/Emory_Icons_NationalReport_v1.jpg' />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b> COVID-19 Vaccination Tracker <br /> </b>
  
          The COVID-19 Vaccionation Tracker tab takes you to an overview of current vaccination status in the U.S. and in each state.
          For FAQs on COVID-19 Vaccines...
          <a href="/Vaccine-Tracker">click to access</a>.
  
        </Grid.Column> */}
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={175}
            height={95}
            href="/ExcessDeath"
            src="/USplot1.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            {" "}
            COVID-19 Excess Death Tracking
            <br />{" "}
          </b>
          The Excess Death page demonstrate the number of additional deaths that occurred during the pandemic as compared with prior time points. 
          <a href="/ExcessDeath"> Click to Access</a>.
        </Grid.Column>
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={175}
            height={95}
            href="/Georgia"
            src="/LatestOnThisDashboard/GADash.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            {" "}
            Georgia COVID-19 Health Equity Dashboard
            <br />{" "}
          </b>
          The Georgia COVID-19 Health Equity dashboard is a tool to dynamically
          track and compare the burden of cases and deaths across counties in
          Georgia.
          <a href="/Georgia"> Click to Access</a>.
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Chacin_on_Covid_in_Florida"
            src="/podcast images/Ana Claudia.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            Digesting COVID-19 data
            <br />
          </b>
          Ms. Ana Claudia Chacin talks about the challenges she and other
          journalists have faced in accessing and reporting accurate COVID-19 data
          in Florida.
          <a href="/media-hub/podcast/Chacin_on_Covid_in_Florida">for more</a>.
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Benkeser_about_immunity"
            src="/podcast images/Benkeser.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            {" "}
            “Antibodies are driving a lot of the protection, but it's not the
            whole story”
            <br />
          </b>
          Dr. David Benkeser talks about analyses of COVID-19 vaccine trials data
          on the immune response to those vaccines.
          <a href="/media-hub/podcast/Benkeser_about_immunity">for more</a>.
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Maria_Sundaram_about_COVID-19_restrictions"
            src="/podcast images/Maria_Sundaram.jpg"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            {" "}
            “We need to use every tool in our toolbox”
            <br />
          </b>
          Dr. Maria Sundaram talks about loosening COVID-19 restrictions and
          traveling safely during the ongoing pandemic.
          <a href="/media-hub/podcast/Maria_Sundaram_about_COVID-19_restrictions">
            for more
          </a>
          .
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/trends_vaccine_coverage_by_county_characteristics"
            src="/blog images/vaccineTrends/cover.PNG"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            Trends in COVID-19 Vaccine Coverage in the United States by County
            Characteristics
            <br />
          </b>
          Comparing vaccination coverage across counties based on social
          characteristics-considering
          <a href="/media-hub/podcast/trends_vaccine_coverage_by_county_characteristics">
            for more
          </a>
          .
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/blog/maskmandate"
            src="/blog images/maskmandate/Mask Mandate blog.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            Statewide Mask Mandates in the United States
            <br />
          </b>
          State-wide mask mandate in the early stages of the pandemic may have
          been clever for US states, lowering case rates during the third wave of
          the pandemic compared to...
          <a href="/media-hub/blog/maskmandate">for more</a>.
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Robert_Breiman_on_COVID-19_vaccine_development_and_distribution"
            src="/podcast images/Robert Breiman.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            “Information equity is a critical part of the whole picture”
            <br />
          </b>
          Dr. Robert Breiman talks about SARS-CoV-2 vaccine development,
          distribution, and clinical trials...
          <a href="/media-hub/podcast/Robert_Breiman_on_COVID-19_vaccine_development_and_distribution">
            for more
          </a>
          .
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances"
            src="/podcast images/Vincent Macroni.png"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            Innovations in Covid-19 Treatment: Dr. Vincent Marconi on Anti-Viral
            and Anti-Inflammatory Advances Against COVID-19 <br />
          </b>
          Dr. Vincent Marconi talks about the state of research around
          baricitinib...
          <a href="/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances">
            for more
          </a>
          .
        </Grid.Column>
  
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics"
            src="/podcast images/Dr. Nneka Sederstrom.jpg"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            "We Have to Be Better": Dr. Nneka Sederstrom on Racism and Ethics
            During Covid-19 <br />
          </b>
          Dr. Nneka Sederstrom discusses how Covid-19 has brought issues of
          structural racism in medicine to the forefront of clinical ethics and
          pandemic...
          <a href="/media-hub/podcast/Dr._Nneka_Sederstrom_on_Racism_and_Ethics">
            for more
          </a>
          .
        </Grid.Column>
        <Grid.Column style={{ width: 190 }}>
          <Image
            width={165}
            height={95}
            href="/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC"
            src="/podcast images/JudyMonroe.jpg"
          />
        </Grid.Column>
        <Grid.Column style={{ width: 250, fontSize: "8pt" }}>
          <b>
            "You've Got to Have Trust": Dr. Judy Monroe on Lessons Learned About
            Pandemic Preparedness <br />
          </b>
          In a podcast, Dr. Monroe tells us about the lessons she learned about
          leadership and community partnerships during pandemics based on her
          experience as...
          <a href="/media-hub/podcast/Dr.Judy_Monroe_on_Lesson_Learned_&_CDC">
            for more
          </a>
          .
        </Grid.Column>
      </Grid>
    );
  }

  export default LatestOnThisDashboard;