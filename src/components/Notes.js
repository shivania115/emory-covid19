import React, {useState } from 'react'
import { Header, Grid, List, Divider, Image } from 'semantic-ui-react'
// import ReactDOM from 'react-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
function myFunction() {
  alert('Link is copied to clipboard!');
  
}

export default function Notes(props){


  const [state] = useState("https://covid19.emory.edu");
 
  return (

  	

    <div style={{paddingTop: '2em', fontWeight: 300, overflow: "auto"}}>
      <Divider/>

            <Grid style = {{paddingTop: 30, paddingBottom: 30}}>
                <Grid.Row columns ={4}>
                  {/* <Grid.Column>
                    <Image width='300' height='192' href = '' style = {{stroke:  "#000000"}} src='/HomeIcons/Emory_Icons_NationalReport_v1.jpg' /> 
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> National Report </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}><br/>Coming soon...</Header.Content>

                  </Grid.Column> */}

                  <Grid.Column>
                    <Image width='300' height='192' href = '/Vaccine-Tracker' style = {{stroke:  "#000000"}} src='/HomeIcons/Emory_Icons_NationalReport_v1.jpg' /> 
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Vaccination Tracker </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}><br/>Click on icon for latest information on COVID-19 vaccination. </Header.Content>

                  </Grid.Column>
                  <Grid.Column>
                    <Image width='300' height='236' href = '/_nation' src='/HomeIcons/Emory_Icons_SelectState_v1.jpg' />            
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Find State & County </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/>Click on icon to see how COVID-19 is impacting your state.</Header.Content>

                  </Grid.Column>
                  <Grid.Column>
                    <Image width='300' height='236' href = '/map-state' src='/HomeIcons/Emory_Icons_MapState_v1.jpg' />
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Map State </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/>Click on icon to visualize state-wide outcomes and characteristics.</Header.Content>

                  </Grid.Column>
                  <Grid.Column>
                    <Image width='300' height='236' href = '/data-sources' src='/HomeIcons/Emory_Icons_DataSources_v1.jpg' />
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Sources & Interpretation </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/>Click on icon for a complete list of measures' definitions and sources.</Header.Content>

                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns ={4} style = {{paddingTop: 30}}>
                  <Grid.Column>
                    <Image width='300' height='236' href = '/about-team' src='/HomeIcons/Emory_Icons_AboutUs_v1.jpg' />
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> About This Dashboard </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/>Click on icon to learn about the goal of the dashboard and its team.</Header.Content>

                  </Grid.Column>
                  <Grid.Column>
                    <Image width='300' height='236' href = '/media-hub' src='/HomeIcons/Emory_Icons_MediaHub_v1.jpg' />
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Media Hub </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/>Click on icon for the latest video, podcast, and blog on COVID-19.</Header.Content>

                  </Grid.Column>
                  

                  {true && <Grid.Column>
                    <Image width='300' height='236' href = '/media-hub/blog/maskmandate' src='/HomeIcons/Emory_Icons_LatestBlog_v1.jpg' />
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Latest Blog </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/>State-wide mask mandate in the early stages resulting in lower case rates during ...</Header.Content>

                  </Grid.Column>}

                  {false && <Grid.Column>
                    <Image width='300' height='236' href = '/media-hub/podcast/Dr._Vincent_Marconi_on_Anti-Viral_and_Anti-Inflammatory_Advances' src='/HomeIcons/Emory_Icons_LatestVideo_v1.jpg' />
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Latest Podcast </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/> Dr. Vincent Marconi talks about the state of research around baricitinib, a JAK-STAT inhibitor that reduces ...</Header.Content>

                  </Grid.Column>}

                  {true && <Grid.Column>
                    <Image width='300' height='236' href = '/media-hub/podcast/Katie_Kirkpatrick_on_economic_responses' src='/HomeIcons/Emory_Icons_LatestVideo_v1.jpg' />
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Latest Podcast </Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/> Katie Kirkpatrick discusses the ramifications of COVID-19 in the business community...</Header.Content>

                  </Grid.Column>}

                  {false && <Grid.Column>
                    <Image width='300' height='236' href = '/media-hub/podcast/Allison_Chamberlain_on_public_health_education_pandemic' src='/HomeIcons/Emory_Icons_LatestVideo_v1.jpg' />
                    <Header.Subheader style = {{fontSize: "20pt", paddingTop: 10, fontWeight: 400}}> Latest Podcast 2</Header.Subheader>
                    <Header.Content style = {{fontSize: "14pt"}}> <br/> Dr. Allison Chamberlain talks about blending public health academia and practice, how public health educ... </Header.Content>

                  </Grid.Column>}

                  
                </Grid.Row>
            </Grid>
    <Divider/>
    <Grid style={{width :"1305px"}}>
      <Grid.Row>
        <Grid.Column style={{fontSize: "14pt", lineHeight: "16pt"}}>
          Early data about COVID-19 suggests that communities are affected very differently due to social determinants of health like population density, poverty, residential segregation, underlying chronic health conditions, and availability of medical services. 
          In order to predict how the epidemic will continue to unfold and prepare for the future, it is critical to understand differences in underlying risk factors. 
          There is no one-size-fits all approach to combat the epidemic, but accurate and meaningful data is a key component of a robust public health response that is informed by contextual factors and prioritizes health equity.
          <br/><br/>
          The COVID-19 Health Equity Dashboard (<a style ={{color: "#397AB9"}} href="https://covid19.emory.edu"> COVID19.emory.edu</a>) seeks to fill the gaps in county-level data about the virus and underlying social determinants of health. 
          Our goal is to facilitate easy comparisons of counties with respect to COVID-19 outcomes and social determinants. 
          We hope this becomes a valuable resource for and critical component of tailored public health responses to COVID-19 across the wide range of environments that Americans inhabit.

        </Grid.Column>
      </Grid.Row>
      <Divider hidden/>
      <Grid.Row columns={3} >
        <Grid.Column style={{fontSize: "14pt"}}>          
          <Image size='medium' src='/logo.png' />
          &copy; 2020 Emory University. All rights reserved.
          <br/>
          <a style ={{color: "#397AB9"}} href="/privacy"> Privacy Statement</a> 

        </Grid.Column>
        <Grid.Column style={{ left: 0, fontSize: "14pt", paddingRight: 0, width: "500px"}}>          
          <Header.Content style={{width: "500px", fontSize: "14pt"}}>
            This <a style ={{color: "#397AB9"}} href="https://covid19.emory.edu"> COVID-19 Health Equity Dashboard </a> is created using
          </Header.Content>
            <List as='ol'>
              <List.Item as='li' value='-'><a style ={{color: "#397AB9"}} href="https://www.react-simple-maps.io/">React Simple Maps</a> by <a style ={{color: "#397AB9"}} href="https://www.zcreativelabs.com/">z creative labs</a></List.Item>
              <List.Item as='li' value='-'><a style ={{color: "#397AB9"}} href="https://formidable.com/open-source/victory/">Victory</a> by <a style ={{color: "#397AB9"}} href="https://formidable.com/">Formidable</a></List.Item>
              <List.Item as='li' value='-'><a style ={{color: "#397AB9"}} href="https://github.com/Semantic-Org/Semantic-UI-React">Semantic UI React</a> by <a style ={{color: "#397AB9"}} href="https://github.com/levithomason">@levithomason</a> and an amazing community of <a style ={{color: "#397AB9"}} href="https://github.com/Semantic-Org/Semantic-UI-React/graphs/contributors">contributors</a></List.Item> 
              <List.Item as='li' value='-'><a style ={{color: "#397AB9"}} href="https://github.com/facebook/create-react-app">Create React App</a> by <a style ={{color: "#397AB9"}} href="https://about.fb.com/company-info/">Facebook</a></List.Item> 
            </List>
          

        </Grid.Column>

        <Grid.Column style={{paddingLeft: 0, width: 300}}>
          <Grid>
  	        	<Grid.Row style={{fontSize: "14pt", paddingBottom: 0, right: -240}}> 
  	            	Share This Dashboard 
  				    </Grid.Row>
  				  <Grid.Row columns = {15} style ={{ paddingTop: 5}}>
    				  <Grid.Column style ={{paddingLeft: 0, paddingRight: 0, right: -305}}>
    	            	<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-size="large" data-text="Check out the Emory COVID-19 Health Equity Interactive Dashboard! " data-url="https://covid19.emory.edu/" data-show-count="false" target="_blank" rel="noopener noreferrer"><Image width= "24px" src='/Twitter_Logo_Blue.png' /> </a><script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
    			  	</Grid.Column>
    			  	<Grid.Column style ={{paddingLeft: 0, paddingRight: 0, right: -309, bottom: -5}}>
    	            	<a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcovid19.emory.edu%2F&amp;src=sdkpreparse" data-href="https://covid19.emory.edu/" target="_blank" rel="noopener noreferrer"><Image width= "14px" src='/f_logo_RGB-Blue_512.png' /></a>
    			  	</Grid.Column>
    			  	<Grid.Column style ={{paddingLeft: 0, paddingRight: 0, right: -305}}>
    	            	<a href="https://web.whatsapp.com/send?text= Check out the Emory COVID-19 Health Equity Interactive Dashboard! https://covid19.emory.edu/" data-action="share/whatsapp/share" target="_blank" rel="noopener noreferrer"><Image width= "22px" src='/WhatsApp_Logo_1.png' /></a>
    			  	</Grid.Column>
    				  <Grid.Column style ={{paddingLeft: 9, paddingRight: 0, paddingTop: 4, right: -300}}>
    				      <div>
     
                  <CopyToClipboard text={state}>
                    <img onClick={()=>myFunction()} src='/copy_icon.png' style={{height: "13px", width: "13px" }}/>
                  </CopyToClipboard>
                  
                  </div>    								
    				  </Grid.Column>
  			  	</Grid.Row>
		  	  </Grid>
		  	
       	  
        </Grid.Column>
      </Grid.Row>
    </Grid>


    </div>);
}
