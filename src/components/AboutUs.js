import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header, Segment } from 'semantic-ui-react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
function myFunction() {
  alert('Link is copied to clipboard!');
  
}

export default function AboutUs(props){

  return (
    <div>
      <AppBar menu='aboutUs'/>
      <Container style={{marginTop: '8em', minWidth: '1260px'}}>

        <Grid row = {1} style = {{marginLeft: -10, paddingTop: 30}}>
            <Header style={{fontWeight: 400, fontSize: "24pt", paddingBottom: 0}}>
                About This Dashboard
                <Header.Subheader style={{color: "#000000", paddingTop: 15, lineHeight: "22pt", fontSize: "12pt"}}>Early data about COVID-19 suggests that communities are affected very differently due to social determinants of health like population density, poverty, residential segregation, underlying chronic health conditions, and availability of medical services. 
                  In order to predict how the epidemic will continue to unfold and prepare for the future, it is critical to understand differences in underlying risk factors. 
                  There is no one-size-fits all approach to combat the epidemic, but accurate and meaningful data is a key component of a robust public health response that is informed by contextual factors and prioritizes health equity.
                  <br/><br/>
                  The COVID-19 Health Equity Dashboard (<a href="COVID19.emory.edu"> COVID19.emory.edu</a>) seeks to fill the gaps in county-level data about the virus and underlying social determinants of health. 
                  Our goal is for this Dashboard to facilitate easy comparisons of counties with respect to COVID-19 outcomes and social determinants. 
                  We hope this becomes a valuable resource for and critical component of tailored public health responses to COVID-19 across the wide range of environments that Americans inhabit.
                </Header.Subheader>
            </Header>

            
          </Grid>
        <Grid columns={2}>
          <Grid columns={2} style = {{width : 600, marginLeft: -10}}>

            <Header as='h1' style={{fontWeight: 400, width: 600}}>
              <Header.Content style = {{ fontSize: "24pt", paddingTop: 44, lineHeight: "22pt"}}>
                Team
                <Header.Subheader style={{color: "#000000", paddingTop: 10, paddingBottom: 0, lineHeight: "24pt"}}>We are a group of epidemiologists, doctors, and software engineers from Emory University and University of Michigan.</Header.Subheader>
              </Header.Content>
            </Header>
            <Grid.Column>
              <List bulleted style = {{lineHeight: "18pt", fontSize: "12pt"}}>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Shivani A. Patel, PhD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>K. M. Venkat Narayan, MD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Carlos Del Rio, MD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Mark Hutcheson, BS</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Yubin Park, PhD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Daesung Choi, PhD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Pooja Naik, B.Pharm</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Star Liu</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Leanna Ehrlich, BA</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Neil K. Mehta, PhD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Vince Marconi, MD</List.Item>
                
              </List>
            </Grid.Column>
            <Grid.Column>
              <List bulleted style = {{lineHeight: "18pt", fontSize: "12pt"}}>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Michael Kramer, PhD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Rob O'Reilly, PhD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Sanjana Pampati, MPH</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Joyce Ho, PhD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Shabatun Jamila Islam, MD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Anurag Mehta, MD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Aditi Nayak , MD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Arshed Quyyumi , MD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Yi-Ann Co, PhD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Samaah Sullivan, MD</List.Item>
                <List.Item style = {{lineHeight: "18pt", fontSize: "12pt"}}>Mohammed K. Ali, MD</List.Item>

              </List>
            </Grid.Column>
          </Grid> 

          
          <Grid columns={1} style = {{width : 600, marginLeft: 80}}>
            <Header style={{fontWeight: 400, fontSize: "24pt", paddingTop: 24}}>
                Funding
              <Header.Content style = {{paddingTop: 4, lineHeight: "24pt", paddingBottom: 20, fontSize: "12pt"}}>
                The COVID-19 Health Equity Dashboard was developed with funding from the Robert Wood Johnson Foundation and Emory University’s Woodruff Health Sciences Center. Development was also supported by the Georgia Center for Diabetes Translation Research.
              </Header.Content>
            </Header>
            <br/>
            <br/>
            <br/>
            <Header style={{fontWeight: 400, fontSize: "24pt", paddingBottom: 0, paddingTop: 41}}>
              Feedback
              <Header.Content style = {{paddingTop: 9, lineHeight: "24pt", fontSize: "12pt"}}>
                We strive to make this a user-friendly resource for policy makers, public health actors, the public, researchers, 
                and the media. Please share your feedback by mailing us at: 
                <a href="mailto:covid19dashboard@emory.edu"> covid19dashboard@emory.edu</a>
              </Header.Content>
            </Header>
          </Grid>

        </Grid>


        

        <div style={{paddingTop: '2em', fontWeight: 300}}>
    <Divider/>
    <Grid>
      <Divider hidden/>
      <Grid.Row columns={3}>
        <Grid.Column>          
          <Image size='small' src='/logo.png' />
          &copy; 2020 Emory University. All rights reserved.
          <br/>
          <a href="/privacy"> Privacy Statement</a> 

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
                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-size="large" data-text="Check out the Emory COVID-19 Health Equity Interactive Dashboard! " data-url="https://covid19.emory.edu/" data-show-count="false" target="_blank" rel="noopener noreferrer"><Image width= "24px" src='/Twitter_Logo_Blue.png' /> </a><script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
            </Grid.Column>
            <Grid.Column style ={{paddingLeft: 0, paddingRight: 0, right: -299, bottom: -5}}>
                <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcovid19.emory.edu%2F&amp;src=sdkpreparse" data-href="https://covid19.emory.edu/" target="_blank" rel="noopener noreferrer"><Image width= "14px" src='/f_logo_RGB-Blue_512.png' /></a>
            </Grid.Column>
            <Grid.Column style ={{paddingLeft: 0, paddingRight: 0, right: -295}}>
                <a href="https://web.whatsapp.com/send?text= Check out the Emory COVID-19 Health Equity Interactive Dashboard! https://covid19.emory.edu/" data-action="share/whatsapp/share" target="_blank" rel="noopener noreferrer"><Image width= "22px" src='/WhatsApp_Logo_1.png' /></a>
            </Grid.Column>
          <Grid.Column style ={{paddingLeft: 9, paddingRight: 0, paddingTop: 4, right: -290}}>
              <div>
 
              <CopyToClipboard text="https://covid19.emory.edu/">
                <img onClick={()=>myFunction()} src='/copy_icon.png' style={{height: "13px", width: "13px" }}/>
              </CopyToClipboard>
              
            </div>
            
                
          </Grid.Column>
          </Grid.Row>
        </Grid>
        
          
        </Grid.Column>
      </Grid.Row>
    </Grid>
<Notes />

    </div>

      </Container>
    </div>);
}
