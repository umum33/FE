import React from "react";
import "./Homeback.css";

export default function Homeback (){

    return (
        <div>
        <a href="/" className="fab-home" aria-label="메인 페이지로 이동">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 10.5L12 3l9 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 10v10h5v-6h4v6h5V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
      </div>


    );

}
