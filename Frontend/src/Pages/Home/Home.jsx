import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import Query from "../../utils/Query";
import Bracket from "../../components/Bracket/Bracket";

const Home = () => {
    return (
     <div>
         <Navbar/>
         <div style={{paddingTop: '80px'}}>
            {/* ENABLE/DISABLE query box by commenting out: */}
            {/* <Query/> */}
            <Bracket />
        </div>
     </div>
    )
  }
  
  export default Home;