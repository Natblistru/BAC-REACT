import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useLocation } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Breadcrumb from "../Breadcrumb";
import Wrapper from "../Wrapper";
import ItemAccordeon from "../Accordeon/ItemAccordeon";
import TitleBox from "./TitleBox_beta";
import FlipCardNou from "../FlipCards/FlipCardNou";
import '../FlipCards/flipCardNou.scss';
import ProgressPagination from "./ProgressPagination";

const FlipCards_beta = (props) => {
  const { address1, disciplina } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacherVideo = searchParams.get('teacher');
const currentTopicObject = useSelector(state => state.currentTopic);
const currentTopic = currentTopicObject.currentTopic;
const currentThemeObject = useSelector(state => state.currentTheme);
const currentTheme = currentThemeObject.currentTheme || JSON.parse(localStorage.getItem('currentTheme'));

const currentSubject = useSelector(state => state.currentSubject);
const subject_id = currentSubject.subject_id || currentSubject.currentSubject.subject_id;

const [linkToTeorie, setLinkToTeorie] = useState("");
console.log(currentTopic)

const restImpartire = currentTopic.flip_cards.length % 3;
const lungimeCards = currentTopic.flip_cards.length;

// console.log(arraySubtitles)

const classes = " " + props.className;
// let arraySubject = props.subtema.vomAfla;

useEffect(() => {
  const parts = currentTheme?.path_tema.split("/");
  const tema_id = currentTheme?.tema_id;

  if (currentTopic && subject_id && tema_id) {
      const addressSubtitle = "/" + parts.slice(2).join("/");
      setLinkToTeorie(`/${disciplina}${addressSubtitle}${currentTopic.path}?teacher=${teacherVideo}&level=1&disciplina=${subject_id}&theme=${tema_id}`);
  }

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = '';
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);

}, [address1, disciplina]);

// let arrayTests = props.subtema.teste;
// console.log(currentTopic)
// let arraySubtitles = currentTopic.subtitles; 
// console.log(arraySubtitles);
// console.log(arraySubtitles[currentSubject].images);

  // if (!currentTopic || !arrayTests) {
  //   return null; // Возвращаем null или другой компонент-заглушку
  // }
// console.log(transformedArrayImages)
return (
  <>
  <Navbar />
  <Wrapper>
    <Breadcrumb step={2} />
    <TitleBox className="teme-container">{currentTopic.name}</TitleBox>
    <div className={classes}>
      <ItemAccordeon titlu="Repetă cu cartele-flip" {...props} open={true}>
        <ProgressPagination cards={currentTopic.flip_cards}/>
        {/* <div className="Cards">
          {currentTopic.flip_cards.map((subject, subjectIndex) => (
            <FlipCardNou 
              title={subject.sarcina} 
              key={subjectIndex} 
              dangerousHTML={subject.rezolvare}
              ultimul={
                (restImpartire === 0 && subjectIndex >= lungimeCards - 3) ||
                (restImpartire === 1 && subjectIndex === lungimeCards - 1) ||
                (restImpartire === 2 && subjectIndex >= lungimeCards - 2)
              } 
            />
          ))}
        </div> */}
      </ItemAccordeon>
    </div>
    <div className="nav-container d-flex align-items-center justify-content-center">
      <div className="d-flex align-items-center justify-content-center">
        <button className="btn">
          <Link className="small" to={linkToTeorie}>LECȚIA TEORETICĂ</Link>
        </button>
      </div>
    </div>
  </Wrapper>
  </>
);

};

export default FlipCards_beta;

