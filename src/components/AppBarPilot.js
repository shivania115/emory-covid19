import React from "react";
import ErrorBoundary from "react-error-boundary";
import { Container, Menu, Image, Segment } from "semantic-ui-react";

import { useNavigate } from "react-router-dom";

export default function AppBarPilot(props) {
  const history = useNavigate();

  return (
    <ErrorBoundary>
      <Segment inverted>
        <Menu
          secondary
          inverted
          fixed="top"
          style={{
            backgroundImage: 'url("/Emory_COVID_header_LightBlue.jpg")',
            backgroundSize: "cover",

            fontSize: "14pt",
          }}
        >
          <Container style={{ width: "1305px" }}>
            <Menu.Item
              as="a"
              header
              onClick={() => history.push("/")}
              style={{ paddingLeft: 15, paddingRight: 15 }}
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
            onClick={() => history.push('/')}
            name='countyReport'/> */}

            <Menu.Item
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                border: "5px solid rgba(0, 0, 0, 0.05)",
              }}
              active={props.menu === "nationalReport"}
              onClick={() => history.push("/national-report")}
              name="nationalReport"
            >
              National Report
            </Menu.Item>

            <Menu.Item
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                border: "5px solid rgba(0, 0, 0, 0.05)",
              }}
              active={props.menu === "vaccineTracker"}
              onClick={() => history.push("/Vaccine-Tracker")}
              name="vaccineTracker"
            >
              Vaccination Tracker
            </Menu.Item>

            {/* <Menu.Item style = {{paddingLeft: 15, paddingRight: 15}}
            active={props.menu==='selectState'} 
            onClick={() => history.push('/_nation')}
            name='selectState'>
            Find State
          </Menu.Item>

          <Menu.Item style = {{paddingLeft: 15, paddingRight: 15}}
            active={props.menu==='mapState'} 
            onClick={() => history.push('/map-state')}
            name='mapState'>
            Map State
          </Menu.Item> */}
            <Menu.Item
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                border: "4px solid rgba(0, 0, 0, 0.05)",
              }}
              active={props.menu === "otherTools"}
              onClick={() => history.push("/other-tools")}
              name="otherTools"
            >
              Other Tools
            </Menu.Item>

            <Menu.Item
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                border: "4px solid rgba(0, 0, 0, 0.05)",
              }}
              active={props.menu === "mediaHub"}
              onClick={() => history.push("/media-hub")}
              name="mediaHub"
            >
              Media Hub
            </Menu.Item>

            <Menu.Item
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                border: "4px solid rgba(0, 0, 0, 0.05)",
              }}
              active={props.menu === "dataSources"}
              onClick={() => history.push("/data-sources")}
              name="dataSources"
            >
              Data Sources &<br />
              Interpretation
            </Menu.Item>

            <Menu.Item
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                border: "4px solid rgba(0, 0, 0, 0.05)",
              }}
              active={props.menu === "aboutUs"}
              content="About"
              onClick={() => history.push("/about-team")}
              name="aboutUs"
            />

            <Menu.Menu position="right">
              <Menu.Item as="a" header>
                <Image size="small" src="/logo_white.png" />
              </Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
      </Segment>
    </ErrorBoundary>
  );
}
