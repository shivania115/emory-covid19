import {
  Container,
  Breadcrumb,
  Dropdown,
  Header,
  Grid,
  Progress,
  Loader,
  Divider,
  Popup,
  Table,
  Button,
  Image,
  Rail,
  Sticky,
  Ref,
  Segment,
  Accordion,
  Icon,
  Checkbox,
  Menu,
  Message,
  Transition,
  List,
} from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  PureComponent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "@mui/material/Slider";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClock,
  faQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
import { useCookie } from "react-use";
import { decision_aid } from "../../stitch/mongodb";
import TextField from "@mui/material/TextField";
import snarkdown from "snarkdown";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { TRANSLATIONS_SPAN } from "./span/translation";
import { TRANSLATIONS_EN } from "./en/translation";
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        translation: TRANSLATIONS_EN,
      },
      span: {
        translation: TRANSLATIONS_SPAN,
      },
    },
  });

function FinalDecision() {
  const { t } = useTranslation();
  function valueLabelFormat() {
    return "asdlfkas";
  }
  const navigate = useNavigate();
  const choices = [
    t('step5_option1'),
    t('step5_option2'),
    t('step5_option3'),
    t('step5_option4'),
    t('step5_option5'),
  ];
  const recommendations = [
    {
      next: t('step5_1next'),
      share:
      t('step5_1share'),
    },
    {
      next: t('step5_2next'),
      share:
        t('step5_2share'),
    },
    {
      next: t('step5_3next'),
      share:
       t('step5_3share'),
    },
    {
      next: t('step5_4next'),
      share:
      t('step5_4share'),
    },
  ];
  const [confidence, setConfidence] = useState(0);
  const [other, setOther] = useState("");
  const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);
  // console.log(cookies);
  const [choiceIndex, setChoiceIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
 
  function handleSubmit() {
    const cookie = JSON.parse(cookies);
    var decision_choice = choices[choiceIndex];
    if (choiceIndex === 4) {
      decision_choice = decision_choice + ": " + other;
    }
    try {
      decision_aid.insertOne({
        step2: {
          demographic: cookie.step2.demographic,
          vaccine_survey: cookie.step2.vaccine_survey,
        },
        step3_belief: cookie.step3,
        step5: { final_decision: decision_choice, confidence: confidence },
      });
    } catch (e) {
      console.log(e);
    }
    setSubmitted(true);
    toast.success("Thank you for your time!", {
      position: "bottom-center",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
  function handleChange(index, value) {
    setConfidence(value);
  }

  return (
    <div style={{ marginLeft: "20%", width: "60%" }}>
      <Grid>
        <Header
          as="h4"
          style={{ paddingTop: 80, fontWeight: 550, fontSize: "1.5rem" }}
        >
          <Header.Content>
            {t('step5_1header')}
          </Header.Content>
        </Header>
        <Slider
          defaultValue={0}
          key={3}
          style={{ width: "85%" }}
          onChange={(event, value) => handleChange(3, value)}
          aria-label="Default"
        />

        <Grid.Row>
          <Grid.Column width={7}>0%</Grid.Column>
          <Grid.Column width={7}>50%</Grid.Column>
          <Grid.Column width={1}>100%</Grid.Column>
        </Grid.Row>
      </Grid>

      <Header
        as="h4"
        style={{ paddingTop: 30, fontWeight: 550, fontSize: "1.5rem" }}
      >
        <Header.Content>
         {t('step5_2header')}
        </Header.Content>
      </Header>
      <div>
        {choices.map((choice, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setChoiceIndex(index);
              }}
              checked={choiceIndex === index}
              style={{
                fontSize: "1.25rem",
                display: "block",
                marginTop: "10px",
              }}
              label={choice}
            />
          );
        })}
        {choiceIndex === 4 && (
          <>
            <TextField
              style={{ marginTop: "2%" }}
              size="small"
              onChange={(e) => {
                setOther(e.target.value);
              }}
            ></TextField>
          </>
        )}
      </div>
      {(choiceIndex || choiceIndex === 0) && choiceIndex !== 4 && (
        <>
          <div style={{ paddingTop: 30 }}>
            <b>{t('step5_next')}</b>
            <p
              dangerouslySetInnerHTML={{
                __html: snarkdown(recommendations[choiceIndex].next),
              }}
            ></p>
            <b>{t('step5_share')}</b>
            <p>{recommendations[choiceIndex].share}</p>
          </div>
        </>
      )}
      <button
        onClick={() => {
          navigate("/decision-aid/step4");
        }}
        style={{ marginTop: "3rem" }}
        class="ui large primary button"
      >
        {t('prev')}
      </button>
      {!submitted ? (
        <button
          onClick={handleSubmit}
          type="submit"
          style={{ marginTop: "3rem" }}
          class="ui large primary button"
        >
          {t('submit')}
        </button>
      ) : (
        <ToastContainer />
      )}

      <Header
          as="h4"
          style={{ paddingTop: 10, fontWeight: 550, fontSize: "1.5rem" }}
        >
          <Header.Content>
            Vaccination Resources
          </Header.Content>
        </Header>
      <ul style={{fontSize:'1.25rem',paddingTop:5,paddingLeft:0}}>
        <li>
          <a href='https://www.vaccines.gov/search/' target='_blank'>Government website </a>to find vaccination centers closest to you
        </li>
        <li>
        <a href='https://gta-vras.powerappsportals.us/en-US/ ' target='_blank'>COVID-19 or monkeypox vaccine locator </a>for the state of Georgia.
        </li>
        <li>
        <a href='https://www.cvs.com/vaccine/intake/store/schedule-options' target='_blank'>CVS link</a> to schedule an appointment
        </li>
        <li>
        We would like to acknowledge <a href='https://www.ncirs.org.au/covid-19-decision-aid-for-adults' target='_blank'>the National Centre of Immunisation Research and Surveillance (NCIRS), Australia, </a>for their valuable contributions in developing their COVID-19 Vaccine Decision Aid. We have adapted and customized their model and design to create our own decision aid for the US population. We recognize the importance of their work in informing vaccine decision-making globally and appreciate their willingness to share their expertise and knowledge.
        </li>
      </ul>
    </div>
  );
}
export default FinalDecision;
