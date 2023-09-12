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
  Menu,
  Message,
  Transition,
  List,
} from "semantic-ui-react";
import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  PureComponent,
} from "react";
import { Link } from "react-router-dom";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTimesCircle,
  faQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
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
function About() {
  return (
    <div style={{ height: "100%" }}>
      <center>
        <Header
          as="h2"
          style={{ paddingTop: 30, fontWeight: 1000, fontSize: "3rem" }}
        >
          <Header.Content>What are my options?</Header.Content>

          <HeaderSubHeader
            style={{
              paddingTop: "6rem",
              paddingLeft: "2rem",
              paddingBottom: "0rem",
              lineHeight: "20pt",
              fontWeight: 600,
              fontSize: "2rem",
              color: "black",
            }}
          >
            <FontAwesomeIcon
              icon={faCircleCheck}
              style={{
                fontSize: "3rem",
                marginRight: "20pt",
                color: "#024174",
              }}
            />
            Get the COVID-19 vaccine now
          </HeaderSubHeader>
          <HeaderSubHeader
            style={{
              paddingTop: "2rem",
              paddingLeft: "0rem",
              paddingBottom: "0rem",
              lineHeight: "20pt",
              fontWeight: 600,
              fontSize: "2rem",
              color: "black",
            }}
          >
            <FontAwesomeIcon
              icon={faQuestionCircle}
              style={{
                fontSize: "3rem",
                marginRight: "20pt",
                color: "#024174",
              }}
            />
            Wait to get the COVID-19 vaccine
          </HeaderSubHeader>
          <HeaderSubHeader
            style={{
              paddingTop: "2rem",
              paddingLeft: "0rem",
              paddingBottom: "0rem",
              lineHeight: "20pt",
              fontWeight: 600,
              fontSize: "2rem",
              color: "black",
            }}
          >
            <FontAwesomeIcon
              icon={faTimesCircle}
              style={{
                fontSize: "3rem",
                marginRight: "20pt",
                color: "#024174",
              }}
            />
            Don't get the COVID-19 vaccine at all
          </HeaderSubHeader>
        </Header>
        <Link to="/decision-aid/step1">
          <button
            style={{ marginTop: "3rem", marginBottom: "10%" }}
            class="ui massive primary button"
          >
            Start
          </button>
        </Link>
      </center>
    </div>
  );
}
export default About;
