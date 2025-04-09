import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import Query from "../../utils/Query";
import TournamentBracket from "../../components/TournamentBracket/TournamentBracket";


const Home = () => {
    return (
     <div>
         <Navbar/>
         <div style={{paddingTop: '8vh', display: 'flex', justifyContent: 'center'}}>
            {/* ENABLE/DISABLE query box by commenting out: */}
            {/* <Query/> */}
            <div>
            <TournamentBracket />
            </div>
        </div>
     </div>
    )
  }
  
  export default Home;