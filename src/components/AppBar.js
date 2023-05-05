import React from "react";
import ErrorBoundary from "react-error-boundary";
import { Container, Menu, Image } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

export default function AppBar(props) {
  const history = useNavigate();
  console.log(props.menu);
  return (
    <ErrorBoundary>
      <Menu
        borderless
        inverted
        fixed="top"
        style={{
          backgroundImage: 'url("/Emory_COVID_header_LightBlue.jpg")',
          backgroundSize: "cover",
          fontSize: "14pt",
        }}
      >
        <Container style={{ width: "80%" }}>
          <Menu.Item
            as="a"
            header
            onClick={() => history("/")}
            style={{ paddingLeft: 10, paddingRight: 15 }}
          >
            <span style={{ fontWeight: 400, color: "#fff", lineHeight: 1.3 }}>
              COVID-19 Health Equity
              <br />
              Interactive Dashboard
            </span>
          </Menu.Item>

          {/* <Menu.Item 
            active={props.menu==='countyReport'} 
            content='Home'
            onClick={() => history('/')}
            name='countyReport'/> */}

          <Menu.Item
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "nationalReport"}
            onClick={() => history("/national-report")}
            name="nationalReport"
          >
            National
            <br></br>
            Report
          </Menu.Item>

          <Menu.Item
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "vaccineTracker"}
            onClick={() => history("/Vaccine-Tracker")}
            name="vaccineTracker"
          >
            Vaccination
            <br></br>
            Surveillance
          </Menu.Item>

          <Menu.Item
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "variants"}
            onClick={() => history("/variants")}
            name="variants"
          >
            Variant Map
          </Menu.Item>

          <Menu.Item style = {{paddingLeft: 15, paddingRight: 15}}
            active={props.menu==='ExcessDeath'} 
            onClick={() => history('/ExcessDeath')}
            name='ExcessDeath'>
           Excess Death
          </Menu.Item>
          <Menu.Item
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "otherTools"}
            onClick={() => history("/other-tools")}
            name="otherTools"
          >
            Other Tools
          </Menu.Item>

          {/* <Menu.Item
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "mediaHub"}
            onClick={() => history("/media-hub")}
            name="mediaHub"
          >
            Media Hub
          </Menu.Item> */}

          <Menu.Item
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "dataSources"}
            onClick={() => history("/data-sources")}
            name="dataSources"
          >
            Data Sources &<br />
            Interpretation
          </Menu.Item>

          <Menu.Item
            style={{ paddingLeft: 15, paddingRight: 15 }}
            active={props.menu === "aboutUs"}
            content="About"
            onClick={() => history("/about-team")}
            name="aboutUs"
          />

          <Menu.Menu position="right">
            <Menu.Item as="a" header>
              <Image size="small" src="/logo_white.png" />
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    </ErrorBoundary>
  );
}
