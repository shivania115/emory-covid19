import {
    Container,
    Grid,
    Rail,
    Ref,
    Sticky,
    Divider,
    Radio,
    Segment,
    Accordion,
    Icon,
    Header,
    Table,
    Menu,
    Tab,
    Progress,
    GridColumn,
  } from "semantic-ui-react";
  import ProgressBar from 'react-bootstrap/ProgressBar';
  import styled from "styled-components";
  import React, {
    useEffect,
    useState,
    Component,
    createRef,
    useRef,
    useContext,
    useMemo,
  } from "react";
  import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
  import { useNavigate } from "react-router-dom";
  import Modal from '@mui/material/Modal';
  import Box from '@mui/material/Box';
  import Typography from '@mui/material/Typography';
  import Button from '@mui/material/Button';
import { useSetState } from "react-use";
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height:"80%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  const StyledProgressBar = styled(Progress)`
    &&& .bar {
      ${
        "" /* background-color: ${props => props.color || 'green'} !important; */
      }
      min-width: 0;
    }
  `;
  
  function DraggableBar(){
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [symptoms,setSymptoms]=useState(50);
  function increment(){
    if (symptoms<100){
        setSymptoms(symptoms+5);
    }
  }
  function decrement(){
    if (symptoms>0){
        setSymptoms(symptoms-5);
    }
  }
    return(
        <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
       
          <Typography id="modal-modal-title" variant="h6" component="h2">
           Tell us about your belief!
          </Typography>
          <StyledProgressBar progress='percent' percent={symptoms}></StyledProgressBar>
          <ProgressBar style={{height:"2rem"}} label={`${symptoms}%`} animated now={symptoms} variant="info"></ProgressBar>
          <Button onClick={decrement}>Decrement</Button>
          <Button onClick={increment}>Increment</Button>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          <Button onClick={handleClose} variant="outlined">
        Submit
      </Button>
        </Box>
      </Modal>
    )
  }
  export default DraggableBar;