import React from 'react'
import AppBar from './AppBar';
import Notes from './Notes';
import { Container, Grid, List, Divider, Image, Header, Segment } from 'semantic-ui-react'
import { useHistory } from "react-router-dom";


export default function SelectState(props){
  const history = useHistory();


  return (
    <div>
 
      <AppBar menu='selectState'/>
      <Container style={{marginTop: '8em'}}>
        <Header as='h1' style={{fontWeight: 400}}>
          <Header.Content>
            Select State
          </Header.Content>


        </Header>

        <Grid columns={11}>

          <Grid.Column>

            <button
            style={{background: '#fff', 
                        fontWeight: 400, 
                        width: '50px',
                        height: '50px'}}
            onClick={()=>{history.push("/13");
          }} >
              GA
            </button>

          </Grid.Column>


        </Grid>


        <Notes />

      </Container>
    </div>);
}
