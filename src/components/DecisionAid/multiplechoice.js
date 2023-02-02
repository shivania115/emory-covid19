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
    Checkbox
  } from "semantic-ui-react";
  import ProgressBar from "react-bootstrap/ProgressBar";
  import Slider from "@mui/material/Slider";
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
  import Modal from "@mui/material/Modal";
  import Box from "@mui/material/Box";
  import Typography from "@mui/material/Typography";
  import Button from "@mui/material/Button";
  import { useSetState } from "react-use";
  import { useCookie } from "react-use"
  import i18n from "i18next";
import { initReactI18next,useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { TRANSLATIONS_SPAN } from "./span/translation";
import { TRANSLATIONS_EN } from "./en/translation";
 
i18n
 .use(LanguageDetector)
 .use(initReactI18next)
 .init({
  fallbackLng: 'en',
   resources: {
     en: {
       translation: TRANSLATIONS_EN
     },
     span: {
       translation: TRANSLATIONS_SPAN
     }
   }
 });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    overflowY: "scroll",
    p: 4,
  };
  
  
  function MultipleChoice(props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(true);
    const [ethnicChecked, setEthnicChecked] = useState();
    const handleOpen = () => setOpen(true);
    const [symptoms, setSymptoms] = useState(50);
    const [symptomsCOVID, setSymptomsCOVID] = useState(50);
    const [symptomsVac, setSymptomsVac] = useState(50);
    const [hospilizationNoVac, sethospilizationNoVac] = useState(50);
    const [hospilizationVac, sethospilizationVac] = useState(50);
    const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);
    const EthnicOptions = [
        t("white"),
        t("hispanic"),
        t("black"),
        t("native"),
        t("asian"),
        t("other")
      ];
    function parseCookie(belief) {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      let cookie = JSON.parse(cookies);
      cookie["step3"] = belief;
      setCookie(cookie, { path: "/", expires: tomorrow });
    }
  
    //edit the handle submit functino to add the info in cookie
    function handleSubmit() {
      const belief = {
        symptomsVac: symptomsVac,
        symptomsCOVID: symptomsCOVID,
        hospilizationNoVac: hospilizationNoVac,
        hospilizationVac: hospilizationVac,
      };
    //   props.sethospilizationNoVac(hospilizationNoVac);
    //   props.sethospilizationVac(hospilizationVac);
    //   props.setSymptomsCOVID(symptomsCOVID);
    //   props.setSymptomsVac(symptomsVac);
      parseCookie(belief);
      setOpen(false);
    }
    console.log(symptoms);
    return (
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div className="checkbox">
            <label>{t('step1_ques5')}</label>
            {EthnicOptions.map((option, index) => {
              return (
                <Checkbox
                  onClick={(e) => {
                    setEthnicChecked(index);
                  }}
                  checked={ethnicChecked === index}
                  style={{
                    fontSize: "1 rem",
                    display: "block",
                    marginTop: "10px",
                  }}
                  label={option}
                />
              );
            })}
            <Button onClick={handleSubmit} variant="outlined">
            Submit
          </Button>
          </div>
        </Box>
      </Modal>
    );
  }
  export default MultipleChoice;