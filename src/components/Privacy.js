import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header, Segment } from 'semantic-ui-react'

export default function AboutUs(props){

  return (
    <div>
    <AppBar/>
      <Container style={{marginTop: 128, minWidth: '1260px'}}>
        <Header style={{fontSize: "24pt", fontWeight: 400}}>
          <Header.Content>
            Privacy Policy
            <Header.Subheader style={{fontSize: "18pt", fontWeight: 400, color: "#000000", paddingTop: "15px"}}>
            Website Privacy Statement
            </Header.Subheader>
            <Header style={{fontSize: "14pt", fontWeight: 400, paddingTop: 0}}>
            Emory University’s COVID-19 Health Equity Dashboard (CHED) is committed to protecting your personal information and respecting your privacy. 
            In general, you can visit our website without telling us who you are or revealing information about yourself.  
            CHED uses various methods to collect certain other kinds of information including cookies, referrers, IP addresses, and system information.
            </Header>
          </Header.Content>
        </Header>
        <Header style={{fontSize: "14pt", fontWeight: 400}}>
          <Header.Content>
            <b>Cookies: </b> Cookies are small snippets of data passed from a website to your PC as you browse the Internet that can be transferred
             back to the original site or domain with future requests from your browser. Cookies can be used in a variety of ways, including 
             ways that have privacy implications, such as tracking your previous activities at a particular site. Most browsers allow you 
             to choose not to accept cookies. Choosing to accept cookies, however, enables some online services to work more efficiently 
             or makes the use of services more convenient.
          </Header.Content>
        </Header>

        <Header style={{fontSize: "14pt", fontWeight: 400}}>
          <Header.Content>
            <b>Referrers: </b> A referrer is the information passed along by a browser that references the Internet URL you linked from. 
            Our Internet server automatically gathers this information. CHED uses this information for site statistical analysis. 
            CHED will not use this information to attempt to identify your personal information.
          </Header.Content>
        </Header>

        <Header style={{fontSize: "14pt", fontWeight: 400}}>
          <Header.Content>
            <b>IP Addresses: </b> Your computer uses IP addresses every time you connect to the Internet. 
            Computers on the network use your IP address to identify your computer so that data, such as the webpages you request, 
            can be sent to you. Our server automatically gathers them. CHED uses this information for site statistical analysis. 
            CHED will not use your IP address to attempt to identify your personal information.
          </Header.Content>
        </Header>

        <Header style={{fontSize: "14pt", fontWeight: 400}}>
          <Header.Content>
            <b>System Information: </b> System information includes time, type of browser being used, the operating system or platform, and CPU speed. 
            Your browser sends this information automatically when you are connected to a website. This information is used by CHED to 
            identify broad demographic statistics and may be used to provide information appropriate for your computer system. CHED will 
            not use this information to attempt to identify your personal information.
          </Header.Content>
        </Header>

        <Header style={{fontSize: "14pt", fontWeight: 400}}>
          <Header.Content>
            <b>Security: </b> While no system can provide guaranteed security, we take reasonable efforts to keep information 
            you provide to us secure, including encryption technology and physical security at the location of the server where 
            information is stored.
          </Header.Content>
        </Header>

        <Header style={{fontSize: "14pt", fontWeight: 400}}>
          <Header.Content>
            <b>Links to Other Sites: </b> The CHED website includes hyperlinks to sites maintained or controlled by others. 
            Any links to external websites is provided as a courtesy and are not an endorsement by CHED of the content or views of 
            the linked website or web page. CHED is not responsible for and does not routinely screen, approve, review, or endorse 
            the contents or use of any of the products or services that may be offered at at any other website. We advise you to 
            review the individual privacy policies of the respective sites.
          </Header.Content>
        </Header>

        <Header.Subheader style={{fontSize: "18pt", fontWeight: 400, color: "#000000", paddingTop: "15px"}}>
            Website Disclaimer
        </Header.Subheader>
        <Header style={{fontSize: "14pt", fontWeight: 400}}>
            CHED provides information as a service to users. This website does not constitute a legal contract between CHED and the user. 
            Content is subject to change without notice and CHED makes no guarantees, warranties, or representations, express or limited, 
            on the website’s operation, information, content, and materials.
        </Header>

        <Header.Subheader style={{fontSize: "18pt", fontWeight: 400, color: "#000000", paddingTop: "15px"}}>
            Liability
        </Header.Subheader>
        <Header style={{fontSize: "14pt", fontWeight: 400}}>
            CHED is not liable for damages of any kind arising from the use of or reliance on any content, goods, or services available on 
            or through this website or any hyperlinked site or resource.
        </Header>

        <Header.Subheader style={{fontSize: "18pt", fontWeight: 400, color: "#000000", paddingTop: "15px"}}>
            Contact Us
        </Header.Subheader>
        <Header style={{fontSize: "14pt", fontWeight: 400}}>
            <a href="mailto:covid19dashboard@emory.edu"> covid19dashboard@emory.edu</a>
        </Header>

        <Notes />

      </Container>
    </div>);
}
