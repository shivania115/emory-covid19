import React from 'react'
import AppBar from './AppBar';
import { Container, Grid, List, Divider, Image, Header } from 'semantic-ui-react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
function myFunction() {
  alert('Link is copied to clipboard!');
  
}

export default function AboutUs(props){

  return (
    <div>
      <AppBar menu='aboutUs'/>
      <Container style={{marginTop: '8em', minWidth: '1260px'}}>
        
        <Grid row = {1} style = {{marginLeft: 0, paddingTop: 30}}>
            <Header style={{fontWeight: 400, fontSize: "24pt", paddingBottom: 0}}>
                About This Tool

                <Header.Subheader style={{color: "#000000", paddingTop: 13, lineHeight: "24pt", fontSize: "14pt"}}>Early data about COVID-19 suggests that communities are affected very differently 
                due to social determinants of health like population density, poverty, residential segregation, underlying chronic health conditions, and availability of medical services.
                 In order to predict how the epidemic will continue to unfold and prepare for the future, it is critical to understand differences in underlying risk factors. 
                 There is no one-size-fits all approach to combat the epidemic, but accurate and meaningful data is a key component of a robust public health response that is 
                 informed by contextual factors and prioritizes health equity.
                  <br/><br/>
                  The COVID-19 Health Equity Dashboard (<a style ={{color: "#397AB9"}} href="COVID19.emory.edu"> COVID19.emory.edu</a>) seeks to fill the gaps in county-level data about the virus and underlying social determinants of health. 
                  Our goal is for this Dashboard to facilitate easy comparisons of counties with respect to COVID-19 outcomes and social determinants. 
                  We hope this becomes a valuable resource for and critical component of tailored public health responses to COVID-19 across the wide range of environments that Americans inhabit.
                </Header.Subheader>
            </Header>

            
        </Grid>
        <Grid columns={2}>
          <Grid.Column>
            <Grid columns={2} style = {{width : 600, marginLeft: 0}}>

              <Header as='h1' style={{fontWeight: 400, width: 600}}>
                <Header.Content style = {{ fontSize: "24pt", paddingTop: 46, lineHeight: "24pt"}}>
                  Team
                  <Header.Subheader style={{color: "#000000", paddingTop: 17, paddingBottom: 0, lineHeight: "24pt", fontSize: "14pt"}}>We are an interdisciplinary group of researchers, clinicians, and students with expertise in epidemiology, social determinants of health, infectious disease, chronic disease, and computer science.</Header.Subheader>
                </Header.Content>
              </Header>
              <Grid.Column style = {{overFlow: "hidden"}}>
                <List bulleted style = {{lineHeight: "18pt", fontSize: "14pt"}}>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Shivani A. Patel, PhD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>K. M. Venkat Narayan, MD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Carlos Del Rio, MD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Robert F. Breiman, MD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Mark Hutcheson, BS</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Yubin Park, PhD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Daesung Choi, PhD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Jing Zhang, PhD</List.Item>                
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Pooja Naik, B.Pharm</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Star Liu</List.Item>               
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Leanna Ehrlich, BA</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Neil K. Mehta, PhD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Vince Marconi, MD</List.Item>                
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Joel P. Baumgart, PhD</List.Item> 
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Ke Sun</List.Item>                
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Sriya Naga Karra</List.Item>     
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Gaëlle L. Sabben, MPH</List.Item>     
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Jithin Sam Varghese, PhD</List.Item>     
            
                                
                </List>
              </Grid.Column>
              <Grid.Column style = {{overFlow: "hidden"}}>

                <List bulleted style = {{lineHeight: "18pt", fontSize: "14pt"}}>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Michael Kramer, PhD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Rob O'Reilly, PhD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Sanjana Pampati, MPH</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Joyce Ho, PhD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Shabatun Jamila Islam, MD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Anurag Mehta, MD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Aditi Nayak , MD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Arshed Quyyumi , MD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Yi-Ann Co, PhD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Samaah Sullivan, MD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Mohammed K. Ali, MD</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Xinzhu Wang, BS</List.Item>
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Kaifu Xiao</List.Item>                
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Isha Gavas</List.Item>                
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Aditya Rao</List.Item>                
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Alka Rao</List.Item> 
                  <List.Item style = {{lineHeight: "18pt", fontSize: "14pt"}}>Kamini Doraivelu, MPH</List.Item> 


                </List>
              </Grid.Column>
            </Grid> 
          </Grid.Column>

          <Grid.Column >
            <Grid columns={1} style = {{width : 600, marginLeft: 10, overFlow: "hidden"}}>
              <Header style={{fontWeight: 400, fontSize: "24pt", paddingTop: 41}}>
                  Funding
                <Header.Content style = {{paddingTop: 13, lineHeight: "24pt", paddingBottom: 20, fontSize: "14pt"}}>
                  The COVID-19 Health Equity Dashboard was developed with funding from the Robert Wood Johnson Foundation and Emory University’s Woodruff Health Sciences Center. Development was also supported by the Georgia Center for Diabetes Translation Research.
                </Header.Content>
              </Header>
              <br/>
              <br/>
              <Header style={{fontWeight: 400, fontSize: "24pt", paddingBottom: 0, paddingTop: 7}}>
                Feedback
                <Header.Content style = {{paddingTop: 9, lineHeight: "24pt", fontSize: "14pt"}}>
                  We strive to make this a user-friendly resource for policy makers, public health actors, the public, researchers, 
                  and the media. Please share your feedback by mailing us at: 
                  <a href="mailto:covid19dashboard@emory.edu"> covid19dashboard@emory.edu</a>
                </Header.Content>
              </Header>
            </Grid>
            </Grid.Column> 
          </Grid>


        

        <div style={{paddingTop: '2em', fontWeight: 300, overFlow: "hidden"}}>
          
    <Divider/>
    <Grid style = {{overFlow: "hidden" }}>
      <Divider hidden/>
        <Grid.Row columns={3} style = {{overFlow: "hidden"}}>
          <Grid.Column style={{fontSize: "14pt", overFlow: "hidden"}}>          
            <Image size='medium' src='/logo.png' />
            &copy; 2020 Emory University. All rights reserved.
            <br/>
            <a style ={{color: "#397AB9"}} href="/privacy"> Privacy Statement</a> 

          </Grid.Column>
          <Grid.Column style={{ left: 0, fontSize: "14pt", paddingRight: 0, width: "500px", overFlow: "hidden"}}>          
            <Header.Content style={{width: "500px", fontSize: "14pt"}}>
              This <a style ={{color: "#397AB9"}} href="COVID19.emory.edu"> COVID-19 Health Equity Dashboard </a> is created using
            </Header.Content>
              <List as='ol'>
                <List.Item as='li' value='-'><a style ={{color: "#397AB9"}} href="https://www.react-simple-maps.io/">React Simple Maps</a> by <a style ={{color: "#397AB9"}} href="https://www.zcreativelabs.com/">z creative labs</a></List.Item>
                <List.Item as='li' value='-'><a style ={{color: "#397AB9"}} href="https://formidable.com/open-source/victory/">Victory</a> by <a style ={{color: "#397AB9"}} href="https://formidable.com/">Formidable</a></List.Item>
                <List.Item as='li' value='-'><a style ={{color: "#397AB9"}} href="https://github.com/Semantic-Org/Semantic-UI-React">Semantic UI React</a> by <a style ={{color: "#397AB9"}} href="https://github.com/levithomason">@levithomason</a> and an amazing community of <a style ={{color: "#397AB9"}} href="https://github.com/Semantic-Org/Semantic-UI-React/graphs/contributors">contributors</a></List.Item> 
                <List.Item as='li' value='-'><a style ={{color: "#397AB9"}} href="https://github.com/facebook/create-react-app">Create React App</a> by <a style ={{color: "#397AB9"}} href="https://about.fb.com/company-info/">Facebook</a></List.Item> 
              </List>
            

          </Grid.Column>

          <Grid.Column style={{paddingLeft: 0, width: 300, overFlow: "hidden"}}>
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

      </div>
      </Container>
    </div>);
}
