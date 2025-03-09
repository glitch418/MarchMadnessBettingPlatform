import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import Query from "../../utils/Query";

const Home = () => {
    return (
     <div className="home-container" style = {{backgroundColor: 'hsl(0, 0%, 27%)'}}>
         <Navbar/>
         <div style={{paddingTop: '60px'}}>
            {/* ENABLE/DISABLE query box by commenting out: <Query/> */}
        </div>
     </div>
    )
  }
  
  export default Home;