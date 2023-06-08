import React, {
    useEffect,
    useState
  } from "react";
  import {
    Container,
    Breadcrumb,
    Dropdown,
    Header,
    Grid,
    Progress,
    Loader,
    Popup,
    Table,
    Image,
    Rail,
    Sticky,
    Ref,
    Message,
    Segment,
    Divider,
    Form,
    Accordion,
    Icon,
    Menu,
    Transition,
    List,
    Button,
    Checkbox,
  } from "semantic-ui-react";
  import AppBar from "./AppBar";
  import {  useNavigate } from "react-router-dom";
  function Construction(){
    const history = useNavigate();
    return(
      <div>
      <AppBar></AppBar>
      <div style={{ height: '80vh', width: '100vw', backgroundImage: "url(/DA_pic/vaccine2.png)", backgroundSize: 'cover' }}>
      <Container textAlign="center" >
        <Header as="h1" style={{ marginTop: "4em", font: "lato", color: "#004071" }}>
          The COVID-19 Health Equity Dashboard is Under (re) Construction.
        </Header>
        <Message color="grey">
          <p style={{ color: "#004071" }}>
            With the end of the COVID-19 Public Health Emergency and changes to the data pipeline, we are working to modify this site as an archival resource and fix bugs along the way. Therefore, we are not currently updating the data or tools contained here.
          </p>
          <Button color="blue" onClick={() => { history("/US-Map"); }}>
            View historical data.
          </Button>
        </Message>
      </Container>
    </div>
      {/* <Container textAlign="center" style={{ marginTop: "50px" }}>
      <Header as="h1" style={{  marginTop: "4em",font:"lato",color: "#004071" }}>
      The COVID-19 Health Equity Dashboard is Under (re) Construction.
      </Header>
      <Message color="grey">
        <p style={{ color: "#004071" }}>
        With the end of the COVID-19 Public Health Emergency and changes to the data pipeline, we are working to modify this site as an archival resource and fix bugs along the way. Therefore, we are not currently updating the data or tools contained here.
        </p>
        <Button color="blue" onClick={() => {history("/");}}>
          View historical data.
        </Button>
      </Message>
      <Image src='/DA_pic/vaccine2.png'>

      </Image>
    </Container> */}
    </div>
    )
  }
  export default Construction;