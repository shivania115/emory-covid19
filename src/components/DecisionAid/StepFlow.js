import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  PureComponent,
} from "react";
import Information from "../icons/Information";
import Covid from "../icons/Covid";
import Medicine from "../icons/Medicine";
import Children from "../icons/Children";
import Family from "../icons/Family";
import Decision from "../icons/Decision";
import "./StepFlow.css";
import { useNavigate } from "react-router-dom";

export default function StepFlow() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        marginTop: "100px",
        paddingTop: "20px",
        paddingBottom: "20px",
        backgroundColor: "#6495ED",
      }}
    >
      <ul
        style={{
          listStyleType: "none",
          display: "flex",
          justifyContent: "center",
          maxWidth: "1000px",
          alignItems: "flex-start",
          justifyItems: "center",
          margin: "0 auto",
        }}
      >
        <li style={{ maginLeft: "20px", marginRight: "20px" }}>
        <a href="/decision-aid/about">
          <div
            className="icon"
            style={{
              borderRadius: "50%",
              border: "1px solid black",
              padding: "15px",
              marginLeft: "40px",
              marginRight: "40px",
              flex: "0, 0",
            }}
          >
            <Information />
          </div>
          </a>
          <div style={{ textAlign: "center", marginTop: "10px" }}
          >
            <b>Start:</b>
            <p>About this decision aid</p>
          </div>
        
        </li>

        <li style={{ maginLeft: "20px", marginRight: "20px" }}>
        <a href="/decision-aid/step1">
          <div
            className="icon"
            style={{
              borderRadius: "50%",
              border: "1px solid black",
              padding: "15px",
              marginLeft: "40px",
              marginRight: "40px",
              flex: "0, 0",
            }}
          >
            <Covid />
          </div>
          </a>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <b>STEP 1:</b>
            <p>Learn about the virus and the vaccines</p>
          </div>
        </li>
        <li style={{ maginLeft: "20px", marginRight: "20px" }}>
        <a  href="/decision-aid/step2">
          <div
            className="icon"
            style={{
              borderRadius: "50%",
              border: "1px solid black",
              padding: "15px",
              marginLeft: "40px",
              marginRight: "40px",
              flex: "0, 0",
            }}
          >
            <Medicine />
          </div>
          </a>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <b>STEP 2:</b>
            <p>Compare the risks and benefits</p>
          </div>
        </li>
        <li style={{ maginLeft: "20px", marginRight: "20px" }}>
        <a  href="/decision-aid/step3">

          <div
            className="icon"
            style={{
              borderRadius: "50%",
              border: "1px solid black",
              padding: "15px",
              marginLeft: "40px",
              marginRight: "40px",
              flex: "0, 0",
            }}
          >
            <Children />
          </div>
          </a>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <b>STEP 3:</b>
            <p>Check your child's personal risk profile</p>
          </div>
        </li>
        <li style={{ maginLeft: "20px", marginRight: "20px" }}>
        <a  href="/decision-aid/step4">
          <div
            className="icon"
            style={{
              borderRadius: "50%",
              border: "1px solid black",
              padding: "15px",
              marginLeft: "40px",
              marginRight: "40px",
              flex: "0, 0",
            }}
          >
            <Family />
          </div>
          </a>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <b>STEP 4:</b>
            <p>Consider what matter most for your family</p>
          </div>
        </li>
        <li style={{ maginLeft: "20px", marginRight: "20px" }}>
        <a  href="/decision-aid/step5">
          <div
            className="icon"
            style={{
              borderRadius: "50%",
              border: "1px solid black",
              padding: "15px",
              marginLeft: "40px",
              marginRight: "40px",
              flex: "0, 0",
            }}
          >
            <Decision />
          </div>
          </a>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <b>STEP 5:</b>
            <p>Make your decision</p>
          </div>
        </li>
      </ul>
    
    </div>
  );
}
