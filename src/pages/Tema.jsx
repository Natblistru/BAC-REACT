import React from "react";
import ContextData from "../components/context/ContextData";
import axios from "axios";

import { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
// import temeIstoriArray from "../data/temeIstoria";
// import temeMatemArray from "../data/temeMatem";
// import temeRomanaArray from "../data/temeRomana";
import Navbar from "../components/layouts/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import Wrapper from "../components/Wrapper";
import TitleBox from "../components/TitleBox";
import ListAccordeon from "../components/Accordeon/ListAccordeon";
import "../index.css";

const Tema = () => {
  const {stateData, dispatchData} = React.useContext(ContextData)
  const { address, disciplina } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacherVideo = searchParams.get('teacher');
  // console.log(address);
  // console.log(disciplina); 

  const [temaObject, setTemaObject] = useState(null);
  const [item, setItem] = useState(null);
  const [proc, setProc] = useState(0);
  // const [theme,setTheme] = useState(null);
//  console.log(disciplina);
  const history = useHistory();
  let theme;
  let teacher;
  useEffect(() => {
    if (!stateData.currentSubject) {
      return;
    }
  
    const searchParams = new URLSearchParams(location.search);
    // setTheme(searchParams.get("theme"));
    teacher = searchParams.get("teacher");

    // console.log("Parametrul theme:", theme);
    // console.log("Parametrul teacher:", teacher);
 
    theme = searchParams.get("theme");

    // console.log("Parametrul theme:", theme);
    // console.log("Parametrul teacher:", teacher);
    fetchTheme(theme);
    fetchThemeVideo(theme);
    fetchEvaluations(theme);
    fetchEvaluation1(theme);
    fetchEvaluation2(theme);
    fetchEvaluation3(theme);

    const pathToFind = `/${disciplina}/${address}`;
    // const foundElement = stateData.capitole.find(element => element.path_tema === pathToFind);
    // // const tema = foundElement ? foundElement : null;

    const tema = stateData.capitole.reduce(
      (result, item) => result || (item.subtitles || []).find(subtitle => subtitle.path_tema === pathToFind),
      null
    );
    setTemaObject(tema);

    
    // console.log(tema);
    setProc(tema? tema.tema_media : 0)

    if (tema!=null) {
      dispatchData({
        type: "UPDATE_CURRENT_THEME",
        payload: tema
      })

      const temaName = tema.tema_name;
      const temaid = tema.tema_id;
      // console.log(tema);
      // console.log(pathToFind);
      // console.log(stateData.capitole);
    
      const addressPath = `/${disciplina}/${address}?teacher=1&level=1&disciplina=${stateData.currentSubject.subject_id}&theme=${temaid}`;
      const newBreadcrumb = {name: temaName, path: addressPath};
      dispatchData({
        type: "UPDATE_TOPIC_BREADCRUMB",
        payload: newBreadcrumb
      });
    }
  },[stateData.currentSubject, location.search]);




  const fetchTheme = async (theme) => {
    try {
        const res = await axios.get(`http://localhost:8000/api/teachertheme?level=1&disciplina=${stateData.currentSubject.subject_id}&teacher=1&student=1&theme=${theme}`);

        // console.log("Parametrul disciplina(currentSubject):", stateData.currentSubject);
        // console.log("Parametrul theme:", theme);
        // console.log(res.data);
        dispatchData({
            type: "FETCH_TOPICS",
            payload: res.data
        })
      //   if (res.data.length > 0) {
      //       dispatchData({
      //           type: "UPDATE_SUBJECTNAME",
      //           payload: res.data[0].subject_name
      //       })
      //       const newBreadcrumb = {name: `${res.data[0].subject_name}`, path: `/capitole/${id}?level=1&year=2022`};
      //       dispatchData({
      //         type: "UPDATE_SUBJECT_BREADCRUMB",
      //         payload: newBreadcrumb
      //       });
      // }
    } catch (err) {
        console.error(err);
    }
}

const fetchThemeVideo = async (theme) => {
  try {
      const res = await axios.get(`http://localhost:8000/api/teacherthemevideo?level=1&disciplina=${stateData.currentSubject.subject_id}&teacher=${teacherVideo}&theme=${theme}`);

      console.log(res.data);
      dispatchData({
          type: "FETCH_THEME_VIDEO",
          payload: res.data
      })
    //   if (res.data.length > 0) {
    //       dispatchData({
    //           type: "UPDATE_SUBJECTNAME",
    //           payload: res.data[0].subject_name
    //       })
    //       const newBreadcrumb = {name: `${res.data[0].subject_name}`, path: `/capitole/${id}?level=1&year=2022`};
    //       dispatchData({
    //         type: "UPDATE_SUBJECT_BREADCRUMB",
    //         payload: newBreadcrumb
    //       });
    // }
  } catch (err) {
      console.error(err);
  }
}

const fetchEvaluations = async (theme) => {
  try {
     const res = await axios.get(`http://localhost:8000/api/themeevaluations?level=1&disciplina=${stateData.currentSubject.subject_id}&theme=${theme}`);

      // console.log("Parametrul stateData.currentSubject.subject_id:", stateData.currentSubject.subject_id);
      // console.log("Parametrul theme:", theme);
      // console.log(res.data);
      dispatchData({
          type: "FETCH_EVALUATIONS",
          payload: res.data
      })
  } catch (err) {
      console.error(err);
  }
}

const fetchEvaluation1 = async (theme) => {
  try {
    // console.log("Parametrul stateData.currentSubject.subject_id:", stateData.currentSubject.subject_id);
    // console.log("Parametrul theme:", theme);

      const res = await axios.get(`http://localhost:8000/api/themeevaluation1?level=1&disciplina=${stateData.currentSubject.subject_id}&theme=${theme}`);


      // console.log(res.data);
      dispatchData({
          type: "FETCH_EVALUATIONS_1",
          payload: res.data
      })
  } catch (err) {
      console.error(err);
  }
}

const fetchEvaluation2 = async (theme) => {
  try {
    // console.log("Parametrul stateData.currentSubject.subject_id:", stateData.currentSubject.subject_id);
    // console.log("Parametrul theme:", theme);

      const res = await axios.get(`http://localhost:8000/api/themeevaluation2?level=1&disciplina=${stateData.currentSubject.subject_id}&theme=${theme}`);


      // console.log(res.data);
      dispatchData({
          type: "FETCH_EVALUATIONS_2",
          payload: res.data
      })
  } catch (err) {
      console.error(err);
  }
}

const fetchEvaluation3 = async (theme) => {
  try {
    // console.log("Parametrul stateData.currentSubject.subject_id:", stateData.currentSubject.subject_id);
    // console.log("Parametrul theme:", theme);

      const res = await axios.get(`http://localhost:8000/api/themeevaluation3?level=1&disciplina=${stateData.currentSubject.subject_id}&theme=${theme}`);


      // console.log(res.data);
      dispatchData({
          type: "FETCH_EVALUATIONS_3",
          payload: res.data
      })
  } catch (err) {
      console.error(err);
  }
}


  useEffect(() => {
    // addBreadcrumb();
    // const foundItem = findObjectWithAddress(teme);
    // if (foundItem) {
    //   setItem(foundItem);
    // } else {
    //   history.push("/error");
    // }
  }, []);

  const handleProgressThemaRecorded = (updatedThemaProgress) => {
    if(temaObject)
      setProc(updatedThemaProgress);
  };

  return (
    <>
      <Navbar />
      <Wrapper>
        {temaObject && (
          <>
            <Breadcrumb step={1}/>
            <TitleBox className="teme-container" proc={proc}>{temaObject.tema_name}</TitleBox>
            <ListAccordeon onProgressThemaRecorded={handleProgressThemaRecorded}/>
          </>
        )}
      </Wrapper>
    </>
  );
};
export default Tema;
