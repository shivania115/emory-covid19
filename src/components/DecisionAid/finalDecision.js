//Step 4: Make Your Decision
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
import Modal from "react-bootstrap/Modal";

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
import DragScaleBar from "./DragScaleBar";

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

  const usageOptions = ["Yes", "No"];
  const usefulOptions = [
    "Not at all useful",
    "Slightly useful",
    "Moderately useful",
    "Very useful",
    "Extremely useful",
  ];

  //q4
  const vaccineWillingnessOptions = [
    " Decreased significantly",
    "Decreased slightly",
    "Stayed the same",
    "Increased slightly",
    "Increased significantly",
  ];
  //q6
  const enoughInfoOptions = ["Yes", "No"];
  //q8
  const addressConcernOptions = [
    "Yes, completely ",
    "Yes, to some extent",
    "No, not at all",
  ];
  //q9
  const potentialRiskInfoOptions = ["Yes", "No"];
  //q10 note: the options given in google docs are weird
  const recommendationLikelinessOptions = [
    "Very likely",
    "Neutral",
    "Unlikely",
  ];

  //

  const choices = [
    t("step5_option1"),
    t("step5_option2"),
    t("step5_option3"),
    t("step5_option4"),
    t("step5_option5"),
  ];

  //separating last q
  const boosterChoices = [
    "I have decided to get the COVID-19 booster",
    "I need to discuss the decision further with my family and doctor",
    "I need to learn more about COVID-19 and the COVID-19 booster",
    "I have dicided not to get the COVID-19 booster",
    "Other",
  ];

  const recommendations = [
    {
      next: t("step5_1next"),
      share: t("step5_1share"),
    },
    {
      next: t("step5_2next"),
      share: t("step5_2share"),
    },
    {
      next: t("step5_3next"),
      share: t("step5_3share"),
    },
    {
      next: t("step5_4next"),
      share: t("step5_4share"),
    },
  ];
  const [confidence, setConfidence] = useState(0);
  const [other, setOther] = useState("");
  const [cookies, setCookie, removeCookie] = useCookie(["decision_aid"]);
  // console.log(cookies);
  const [choiceIndex, setChoiceIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [useChecked, setuseChecked] = useState();
  const [usefulnessChecked, setusefullnessChecked] = useState();
  //q3
  const [willingness, setWillingness] = useState(5);
  //q4
  const [vaccineWillingnessChecked, setVaccineWillingnessChecked] = useState();
  //q5
  const [userFriendliness, setUserFriendliness] = useState(5);
  //q6
  const [enoughInfoChecked, setEnoughInfoChecked] = useState();
  //q8
  const [addressConcernChecked, setAddressConcernChecked] = useState();
  //q9
  const [potentialRiskInfoChekced, setPotentialRiskInfoChecked] = useState();
  //q10
  const [recommendationLikelinessChecked, setRecommendationLikelinessChecked] =
    useState();

  //q7, q11, q12
  const [influentialAspect, setInfluentialAspect] = useState("");
  const [thinkingScale, setThinkingScale] = useState(10);
  const [paceScale, setPaceScale] = useState(10);
  const [workScale, setWorkScale] = useState(10);
  const [understandingScale, setUnderstandingScale] = useState(10);
  const [feelingsScale, setFeelingsScale] = useState(10);
  const [additionalComments, setAdditionalComments] = useState("");
  const [collectEmail, setCollectEmail] = useState("");
  //q booster choices
  const [boosterChoicesChecked, setBoosterChoicesChecked] = useState();

  const [show, setShow] = useState(false);

  function italicizeWords(text) {
    const words = [
      "get",
      "not",
      "get",
      "discuss",
      "learn",
      "more",
      "recibir",
      "discutir",
      "obtener",
      "más",
      "información",
      "no",
    ];
    var textArray = text.split(" ");
    var result = [];
    for (var i = 0; i < textArray.length; i++) {
      if (words.includes(textArray[i])) {
        result.push(<strong>{textArray[i]}</strong>);
        result.push(" ");
      } else {
        result.push(textArray[i] + " ");
      }
    }
    return result;
  }

  function handleSubmit() {
    //step 1: validate inputs
    if (
      //ALERT TODO:
      useChecked === undefined ||
      usefulnessChecked === undefined ||
      willingness === undefined ||
      vaccineWillingnessChecked === undefined ||
      userFriendliness === undefined ||
      vaccineWillingnessChecked === undefined ||
      enoughInfoChecked === undefined ||
      addressConcernChecked === undefined ||
      potentialRiskInfoChekced === undefined ||
      recommendationLikelinessChecked === undefined ||
      boosterChoicesChecked === undefined
    ) {
      setShow(true); // Show the modal if any validation fails
      return; // Exit the function immediately if validation fails
    }

    //end of step 1
    let cookie = JSON.parse(cookies);
    var decision_choice = choices[choiceIndex];

    if (choiceIndex === 4) {
      decision_choice = decision_choice + ": " + other;
    }
    try {
      const post_study_questionnaire = {
        step5_final_decision: decision_choice,
        step5_confidence: confidence,
        step5_q1: usageOptions[useChecked],
        step5_q2: usefulOptions[usefulnessChecked],
        step5_q3_willingness: willingness,
        step5_q4: vaccineWillingnessOptions[vaccineWillingnessChecked],
        step5_q5_rating: userFriendliness,
        step5_q6: enoughInfoOptions[enoughInfoChecked],
        step5_q7: influentialAspect,
        step5_q8: addressConcernOptions[addressConcernChecked],
        step5_q9: potentialRiskInfoOptions[potentialRiskInfoChekced],
        step5_q10:
          recommendationLikelinessOptions[recommendationLikelinessChecked],
        step5_q11_thinking: thinkingScale,
        step5_q11_pace: paceScale,
        step5_q11_work: workScale,
        step5_q11_understanding: understandingScale,
        step5_q11_feelings: feelingsScale,
        q12_comments: additionalComments,
        step5_email: collectEmail,
        step5_booster: boosterChoicesChecked,
      };
      console.log(cookie);
      cookie = { ...cookie, ...post_study_questionnaire };
      console.log(cookie);
      decision_aid.insertOne({ cookie });
    } catch (e) {
      console.log(e);
    }
    setSubmitted(true);
    toast.success("Thank you for your time!", {
      position: "bottom-center",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    navigate("/decision-aid/step1");
  }

  function handleChange(index, value) {
    setConfidence(value);
  }

  return (
    <div style={{ marginLeft: "20%", width: "60%" }}>
      {/* mimic what is written below, and do it for all the questions and options */}
      {/* q1 */}
      <div className="checkbox">
        <label>
          1. Did you use the decision-aid tool provided on the website before
          taking this post-study questionnaire?{" "}
        </label>
        {usageOptions.map((option, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setuseChecked(index);
              }}
              checked={useChecked === index}
              style={{
                fontSize: "1 rem",
                display: "block",
                marginTop: "10px",
              }}
              label={option}
            />
          );
        })}
      </div>

      {/* q2 */}
      <div className="checkbox">
        <label>
          2. How useful did you find the decision-aid tool in understanding the
          risks and potential benefits of COVID-19 vaccines?{" "}
        </label>
        {usefulOptions.map((option, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setusefullnessChecked(index);
              }}
              checked={usefulnessChecked === index}
              style={{
                fontSize: "1 rem",
                display: "block",
                marginTop: "10px",
              }}
              label={option}
            />
          );
        })}
      </div>

      {/* q3 */}
      {/* <div className="slider">
        <label>
          3. On a scale of 1 to 10, where 1 is "not at all willing" and 10 is
          "completely willing," how willing are you now to get vaccinated
          against COVID-19?
        </label>
        <Slider
          defaultValue={0}
          key={3}
          style={{ width: "100%" }} // Adjusted this to 100% to use the full width of the container
          min={0}
          max={10}
          // value={willingness}
          onChange={(e) => setWillingness(e.target.value)}
          aria-label="Default"
        />
      </div> */}

      <div className="slider">
        <label style={{ marginTop: "10px" }}>
          3. On a scale of 1 to 10, where 1 is "not at all willing" and 10 is
          "completely willing," how willing are you now to get vaccinated
          against COVID-19?
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Not Willing</span>
          <Slider
            defaultValue={0}
            key={3}
            style={{ width: "80%" }} // Adjust this slightly less than 100% to accommodate the labels without overflow
            min={0}
            max={10}
            // value={willingness}
            onChange={(e) => setWillingness(e.target.value)}
            aria-label="Default"
          />
          <span>Completely Willing</span>
        </div>
      </div>

      {/* q4 */}
      <div className="open-ended-response" style={{ marginTop: "10px" }}>
        <label>
          4. What aspects of the decision-aid tool were most influential in
          changing your willingness to get vaccinated?
        </label>
        <textarea
          onChange={(e) => setInfluentialAspect(e.target.value)}
          style={{ width: "100%", height: "100px" }}
        ></textarea>
      </div>

      {/* q5 */}
      <div className="checkbox">
        <label>
          5. Compared to before using the decision-aid tool, has your
          willingness to get vaccinated changed?{" "}
        </label>
        {vaccineWillingnessOptions.map((option, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setVaccineWillingnessChecked(index);
              }}
              checked={vaccineWillingnessChecked === index}
              style={{
                fontSize: "1 rem",
                display: "block",
                marginTop: "10px",
              }}
              label={option}
            />
          );
        })}
      </div>

      {/* q6
      <div className="slider">
        <label>
          5. How would you rate the user-friendliness and clarity of the
          decision-aid tool? (1 = Very poor, 10 = Excellent)
        </label>
        <Slider
          defaultValue={0}
          key={3}
          style={{ width: "85%" }}
          min={0}
          max={10}
          // value={userFriendliness}
          onChange={(e) => setUserFriendliness(e.target.value)}
          aria-label="Default"
        />{" "}
      </div> */}

      {/* q6 */}
      <div className="slider" style={{ marginTop: "10px" }}>
        <label>
          6. How would you rate the user-friendliness and clarity of the
          decision-aid tool? (1 = Very poor, 10 = Excellent)
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Very poor</span>
          <Slider
            defaultValue={0}
            key={3}
            style={{ width: "75%" }} // Adjust this based on your design, I kept it consistent with the previous example
            min={0}
            max={10}
            // value={userFriendliness}
            onChange={(e) => setUserFriendliness(e.target.value)}
            aria-label="Default"
          />
          <span>Excellent</span>
        </div>
      </div>

      {/* q7 */}
      <div className="checkbox">
        <label>
          7. Did the decision-aid tool provide enough information to make an
          informed decision about COVID-19 vaccination?{" "}
        </label>
        {enoughInfoOptions.map((option, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setEnoughInfoChecked(index);
              }}
              checked={enoughInfoChecked === index}
              style={{
                fontSize: "1 rem",
                display: "block",
                marginTop: "10px",
              }}
              label={option}
            />
          );
        })}
      </div>

      {/* q8 */}
      <div className="checkbox">
        <label>
          8. Did the decision-aid tool address your concerns or questions about
          COVID-19 vaccines?{" "}
        </label>
        {addressConcernOptions.map((option, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setAddressConcernChecked(index);
              }}
              checked={addressConcernChecked === index}
              style={{
                fontSize: "1 rem",
                display: "block",
                marginTop: "10px",
              }}
              label={option}
            />
          );
        })}
      </div>

      {/* q9 */}
      <div className="checkbox">
        <label>
          9. Did you find the potential risk information of not getting
          vaccinated presented in the decision-aid tool compelling?{" "}
        </label>
        {potentialRiskInfoOptions.map((option, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setPotentialRiskInfoChecked(index);
              }}
              checked={potentialRiskInfoChekced === index}
              style={{
                fontSize: "1 rem",
                display: "block",
                marginTop: "10px",
              }}
              label={option}
            />
          );
        })}
      </div>

      {/* q10 */}
      <div className="checkbox">
        <label>
          10. How likely are you to recommend this decision-aid tool to others
          who may be hesitant to get the COVID-19 vaccine?{" "}
        </label>
        {recommendationLikelinessOptions.map((option, index) => {
          return (
            <Checkbox
              onClick={(e) => {
                setRecommendationLikelinessChecked(index);
              }}
              checked={recommendationLikelinessChecked === index}
              style={{
                fontSize: "1 rem",
                display: "block",
                marginTop: "10px",
              }}
              label={option}
            />
          );
        })}
      </div>

      {/* q11 */}
      {/* < className="slider">
        <label>
          11. We will next ask about your experience with the ease of using the
          decision-aid tool. Please rate the following questions on a scale of 0
          to 20( 0 = Very low, 20 = very high)
        </label>
        {/* a. */}
      {/* <label>
          a. How much thinking, deciding, or calculating was required to finish
          using this tool?
        </label>
        <Slider
          defaultValue={0}
          key={3}
          style={{ width: "85%" }}
          min={0}
          max={20}
          // value={userFriendliness}
          onChange={(e) => setThinkingScale(e.target.value)}
          aria-label="Default"
        />{" "} */}
      {/* b. */}
      {/* <label>b. How hurried or rushed was the pace of using this tool?</label>
        <Slider
          defaultValue={0}
          key={3}
          style={{ width: "85%" }}
          min={0}
          max={20}
          // value={userFriendliness}
          onChange={(e) => setPaceScale(e.target.value)}
          aria-label="Default"
        />{" "} */}
      {/* c. */}
      {/* <label>
          c. How hard did you have to work to accomplish your level of
          understanding?
        </label>
        <Slider
          defaultValue={0}
          key={3}
          style={{ width: "85%" }}
          min={0}
          max={20}
          // value={userFriendliness}
          onChange={(e) => setWorkScale(e.target.value)}
          aria-label="Default"
        />{" "} */}
      {/* d. */}
      {/* <label>
          d. How successful were you in understanding the risks and benefits of
          the COVID-19 vaccine?
        </label>
        <Slider
          defaultValue={0}
          key={3}
          style={{ width: "85%" }}
          min={0}
          max={20}
          // value={userFriendliness}
          onChange={(e) => setUnderstandingScale(e.target.value)}
          aria-label="Default"
        />{" "} */}
      {/* e. */}
      {/* <label>
          e. How insecure, discouraged, irritated, stressed, and annoyed were
          you while using this tool?
        </label>
        <Slider
          defaultValue={0}
          key={3}
          style={{ width: "85%" }}
          min={0}
          max={20}
          // value={userFriendliness}
          onChange={(e) => setFeelingsScale(e.target.value)}
          aria-label="Default"
        />{" "}
      </div> */}

      {/* q11 */}
      <div className="slider" style={{ marginTop: "15px" }}>
        <label>
          11. We will next ask about your experience with the ease of using the
          decision-aid tool. Please rate the following questions on a scale of 0
          to 20( 0 = Very low, 20 = very high)
        </label>

        {/* a. */}
        <label>
          a. How much thinking, deciding, or calculating was required to finish
          using this tool?
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Very low</span>
          <Slider
            defaultValue={0}
            key={3}
            style={{ width: "75%" }}
            min={0}
            max={20}
            // value={userFriendliness}
            onChange={(e) => setThinkingScale(e.target.value)}
            aria-label="Default"
          />
          <span>Very high</span>
        </div>

        {/* b. */}
        <label>b. How hurried or rushed was the pace of using this tool?</label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Very low</span>
          <Slider
            defaultValue={0}
            key={3}
            style={{ width: "75%" }}
            min={0}
            max={20}
            // value={userFriendliness}
            onChange={(e) => setPaceScale(e.target.value)}
            aria-label="Default"
          />
          <span>Very high</span>
        </div>

        {/* c. */}
        <label>
          c. How hard did you have to work to accomplish your level of
          understanding?
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Very low</span>
          <Slider
            defaultValue={0}
            key={3}
            style={{ width: "75%" }}
            min={0}
            max={20}
            // value={userFriendliness}
            onChange={(e) => setWorkScale(e.target.value)}
            aria-label="Default"
          />
          <span>Very high</span>
        </div>

        {/* d. */}
        <label>
          d. How successful were you in understanding the risks and benefits of
          the COVID-19 vaccine?
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Very low</span>
          <Slider
            defaultValue={0}
            key={3}
            style={{ width: "75%" }}
            min={0}
            max={20}
            // value={userFriendliness}
            onChange={(e) => setUnderstandingScale(e.target.value)}
            aria-label="Default"
          />
          <span>Very high</span>
        </div>

        {/* e. */}
        <label>
          e. How insecure, discouraged, irritated, stressed, and annoyed were
          you while using this tool?
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Very low</span>
          <Slider
            defaultValue={0}
            key={3}
            style={{ width: "75%" }}
            min={0}
            max={20}
            // value={userFriendliness}
            onChange={(e) => setFeelingsScale(e.target.value)}
            aria-label="Default"
          />
          <span>Very high</span>
        </div>
      </div>

      {/* q12 */}
      <div className="open-ended-response" style={{ marginTop: "20px" }}>
        <label>
          12. Any additional comments or feedback about the decision-aid tool?
        </label>
        <textarea
          onChange={(e) => setAdditionalComments(e.target.value)}
          style={{ width: "100%", height: "100px" }}
        ></textarea>
      </div>

      <Grid>
        <Header
          as="h4"
          style={{ paddingTop: 80, fontWeight: 550, fontSize: "1.5rem" }}
        >
          <Header.Content>{t("step5_1header")}</Header.Content>
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

      {/* vaccine */}
      <div>
        <Header
          as="h4"
          style={{ paddingTop: 30, fontWeight: 550, fontSize: "1.5rem" }}
        >
          <Header.Content>{t("step5_2header")}</Header.Content>
        </Header>
        <div style={{ lineHeight: 1.6 }}>
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

                  lineHeight: 1.2,
                }}
                label={italicizeWords(choice)}
              ></Checkbox>
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
              <br></br>
              <br></br>
              <b>{t("step5_share")}</b>
              <p>{recommendations[0].share}</p>
            </>
          )}
        </div>
      </div>

      {/* booster */}
      {/* check checkbox other */}
      {/* TODO: ticking option 4/5 only sends 4, textarea won't pop up when ticking "other" */}
      <div>
        <Header
          as="h4"
          style={{ paddingTop: 30, fontWeight: 550, fontSize: "1.5rem" }}
        >
          <Header.Content>
            {
              "We hope the information presented here has helped you to make an informed decision regarding COVID-19 booster:"
            }
          </Header.Content>
        </Header>
        <div style={{ lineHeight: 1.6 }}>
          {boosterChoices.map((choice, index) => {
            return (
              <Checkbox
                onClick={(e) => {
                  setBoosterChoicesChecked(index); //setchoice
                }}
                checked={boosterChoicesChecked === index}
                style={{
                  fontSize: "1.25rem",
                  display: "block",

                  lineHeight: 1.2,
                }}
                label={italicizeWords(choice)}
              ></Checkbox>
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
              <br></br>
              <br></br>
              <b>{t("step5_share")}</b>
              <p>{recommendations[0].share}</p>
            </>
          )}
        </div>
      </div>

      {/* Email collection */}
      <div className="open-ended-response" style={{ marginTop: "20px" }}>
        <span></span>
        <label>Please provide email:</label>
        <textarea
          onChange={(e) => setCollectEmail(e.target.value)}
          style={{ width: "100%", height: "100px" }}
        ></textarea>
      </div>

      {(choiceIndex || choiceIndex === 0) && choiceIndex !== 4 && (
        <>
          <div style={{ paddingTop: 30 }}>
            <b>{t("step5_next")}</b>
            <p
              dangerouslySetInnerHTML={{
                __html: snarkdown(recommendations[choiceIndex].next),
              }}
            ></p>
            <b>{t("step5_share")}</b>
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
        {t("prev")}
      </button>
      {!submitted ? (
        <button
          onClick={handleSubmit}
          type="submit"
          style={{ marginTop: "3rem" }}
          class="ui large primary button"
        >
          {t("submit")}
        </button>
      ) : (
        <div></div>
      )}
      {/* {submitted ? (
  <div>
    <Header as="h4" style={{ paddingTop: 10, fontWeight: 550, fontSize: "1.5rem" }}>
      <Header.Content>
        {t('step5_resources')}
      </Header.Content>
    </Header>
    <ul style={{ fontSize: '1.25rem', paddingTop: 5, paddingLeft: 0 }}>
      <li dangerouslySetInnerHTML={{ __html: snarkdown(t('step5_bullet1')) }}></li>
      <li dangerouslySetInnerHTML={{ __html: snarkdown(t('step5_bullet2')) }}></li>
      <li dangerouslySetInnerHTML={{ __html: snarkdown(t('step5_bullet3')) }}></li>
      <li dangerouslySetInnerHTML={{ __html: snarkdown(t('step5_acknowledgement')) }}></li>
    </ul>
  </div>
) : (
  <div></div>
)} */}

      {/* For validating all questions are filled */}
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
      >
        <Modal.Header style={{ display: "flex", justifyContent: "end" }}>
          <div
            onClick={() => {
              setShow(false);
            }}
          >
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
            <path
              fill="#BEBEBE"
              fillRule="evenodd"
              d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z"
            />
          </div>
        </Modal.Header>
        <Modal.Body>Please complete all questions before submit.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            {t("close")}
          </Button>{" "}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default FinalDecision;
