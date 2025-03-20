import React from "react";
import "./BracketHeader.css";

const BracketHeader = () => {
  return (
    <div className="bracket-container">
      <div className="header-row rounds">
        <div>First Round</div>
        <div>Second Round</div>
        <div>Sweet 16</div>
        <div>Elite 8</div>
        <div>Final Four</div>
        <div>Elite 8</div>
        <div>Sweet 16</div>
        <div>Second Round</div>
        <div>First Round</div>
      </div>

      <div className="header-row dates">
        <div>3/20-3/21</div>
        <div>3/22-3/23</div>
        <div>3/27-3/28</div>
        <div>3/29-3/30</div>
        <div>4/5 & 4/7</div>
        <div>3/29-3/30</div>
        <div>3/27-3/28</div>
        <div>3/22-3/23</div>
        <div>3/20-3/21</div>
      </div>
    </div>
  );
};

export default BracketHeader;