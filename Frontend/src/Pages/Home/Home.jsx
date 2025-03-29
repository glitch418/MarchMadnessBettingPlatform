import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import Query from "../../utils/Query";
import TournamentBracket from "../../components/TournamentBracket/TournamentBracket";


const Home = () => {
    return (
     <div>
         <Navbar/>
         <div style={{paddingTop: '80px'}}>
            {/* ENABLE/DISABLE query box by commenting out: */}
            {/* <Query/> */}
            <TournamentBracket />
        </div>
     </div>
    )
  }
  
  export default Home;