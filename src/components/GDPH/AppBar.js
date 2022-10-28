import React from "react";
import ErrorBoundary from "react-error-boundary";
import { Container, Menu, Image, Divider } from "semantic-ui-react";

import { useNavigate } from "react-router-dom";

export default function AppBar(props) {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <Menu
        borderless
        inverted
        fixed="top"
        style={{
          backgroundImage: 'url("/Emory_COVID_header_LightBlue.jpg")',
          backgroundSize: "cover",
          fontSize: "15pt",
        }}
      >
        <Container style={{ width: "1305px" }}>
          <Menu.Item as="a" header onClick={() => navigate("/")}>
            <span style={{ fontWeight: 400, color: "#fff", lineHeight: 1.3 }}>
              <strong>COVID-19 Health Equity</strong>
              <br />
              <strong>Interactive Dashboard</strong>
            </span>
          </Menu.Item>
          <Menu.Item as="a" header onClick={() => navigate("/Georgia")}>
            <span style={{ fontWeight: 400, color: "#fff", lineHeight: 1.3 }}>
              <strong>Georgia COVID-19</strong>
              <br></br>
              <strong>Health Equity Dashboard</strong>
            </span>
          </Menu.Item>
          <Menu.Item
            content="Home"
            onClick={() => navigate("/Georgia")}
            name="countyReport"
          />
          <Menu.Item
            active={props.menu === "dataSources"}
            content="Data Sources"
            onClick={() => navigate("/Georgia/data-sources")}
            name="dataSources"
          />
          <Menu.Item
            active={props.menu === "aboutUs"}
            content="Contact Us"
            onClick={() => navigate("/Georgia/about-team")}
            name="aboutUs"
          />

          <Menu.Menu position="right">
            <Menu.Item as="a" header>
              <Image size="small" src="/logo_white.png" />
            </Menu.Item>
            <Menu.Item as="a" header>
              <Image size="tiny" src="/data/GDPH/rols.png" />
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    </ErrorBoundary>
  );
}
