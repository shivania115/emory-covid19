import React, {useState } from 'react'
import { Grid, List, Divider, Image } from 'semantic-ui-react'
import ReactDOM from 'react-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
function myFunction() {
  alert('Link is copied to clipboard!');
  
}

export default function Notes(props){


  const [state, setState] = useState("https://covid19.emory.edu/");
 
  return (

  	

    <div style={{paddingTop: '2em', fontWeight: 300}}>
    <Divider/>
    <Grid>
      <Grid.Row>
        <Grid.Column style={{fontSize: '1em', lineHeight: '1.5em'}}>
          Early data about COVID-19 suggests that communities are affected very differently due to social determinants of health like population density, poverty, residential segregation, underlying chronic health conditions, and availability of medical services. 
          In order to predict how the epidemic will continue to unfold and prepare for the future, it is critical to understand differences in underlying risk factors. 
          There is no one-size-fits all approach to combat the epidemic, but accurate and meaningful data is a key component of a robust public health response that is informed by contextual factors and prioritizes health equity.
          <br/><br/>
          The COVID-19 Health Equity Dashboard (<a href="COVID19.emory.edu"> COVID19.emory.edu</a>) seeks to fill the gaps in county-level data about the virus and underlying social determinants of health. 
          Our goal is for this Dashboard to facilitate easy comparisons of counties with respect to COVID-19 outcomes and social determinants. 
          We hope this becomes a valuable resource for and critical component of tailored public health responses to COVID-19 across the wide range of environments that Americans inhabit.

        </Grid.Column>
      </Grid.Row>
      <Divider hidden/>
      <Grid.Row columns={3}>
        <Grid.Column>          
          <Image size='small' src='/logo.png' />
          &copy; 2020 Emory University. All rights reserved.
        </Grid.Column>
        <Grid.Column style={{paddingLeft: 130}}>          
          <small>
            This <a href="COVID19.emory.edu"> COVID-19 Health Equity Dashboard </a> is created using
            <List as='ol'>
              <List.Item as='li' value='-'><a href="https://www.react-simple-maps.io/">React Simple Maps</a> by <a href="https://www.zcreativelabs.com/">z creative labs</a></List.Item>
              <List.Item as='li' value='-'><a href="https://formidable.com/open-source/victory/">Victory</a> by <a href="https://formidable.com/">Formidable</a></List.Item>
              <List.Item as='li' value='-'><a href="https://github.com/Semantic-Org/Semantic-UI-React">Semantic UI React</a> by <a href="https://github.com/levithomason">@levithomason</a> and an amazing community of <a href="https://github.com/Semantic-Org/Semantic-UI-React/graphs/contributors">contributors</a></List.Item> 
              <List.Item as='li' value='-'><a href="https://github.com/facebook/create-react-app">Create React App</a> by <a href="https://about.fb.com/company-info/">Facebook</a></List.Item> 
            </List>
          </small>

        </Grid.Column>

        <Grid.Column style={{paddingLeft: 0}}>
          	<Grid>
	        	<Grid.Row style={{width: 400, paddingBottom: 0, right: -295}}> 
	            	Share This Dashboard 
				</Grid.Row>
				<Grid.Row columns = {15} style ={{ paddingTop: 0}}>
				  <Grid.Column style ={{paddingLeft: 0, paddingRight: 0, right: -295}}>
	            	<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-size="large" data-text="Check out the Emory COVID-19 Health Equity Interactive Dashboard! " data-url="https://covid19.emory.edu/" data-show-count="false" target="_blank"><Image width= "24px" src='/Twitter_Logo_Blue.png' /> </a><script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
			  	  </Grid.Column>
			  	  <Grid.Column style ={{paddingLeft: 0, paddingRight: 0, right: -299, bottom: -5}}>
	            	<a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcovid19.emory.edu%2F&amp;src=sdkpreparse" data-href="https://covid19.emory.edu/" target="_blank"><Image width= "14px" src='/f_logo_RGB-Blue_512.png' /></a>
			  	  </Grid.Column>
			  	  <Grid.Column style ={{paddingLeft: 0, paddingRight: 0, right: -295}}>
	            	<a href="https://web.whatsapp.com/send?text= Check out the Emory COVID-19 Health Equity Interactive Dashboard! https://covid19.emory.edu/" data-action="share/whatsapp/share" target="_blank"><Image width= "22px" src='/WhatsApp_Logo_1.png' /></a>
			  	  </Grid.Column>
				  <Grid.Column style ={{paddingLeft: 9, paddingRight: 0, paddingTop: 4, right: -290}}>
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
