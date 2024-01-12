/**
 The landing and login page
 @author @Danny Nansink, 500821004
 **/
import React from "react";

// component imports
import Layout from "../components/frontpageLayout";
import Hero from "../components/Hero";

import data from "../../public/data/registerPageTutor.json"

const Home = () => {
  return (
    <>
      <Hero {...data}/>
      <Layout/>
    </>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      data
    },
  };
};


export default Home;
