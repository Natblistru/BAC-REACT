import React, { useState, useContext, useEffect, useRef } from "react";
import { connect } from "react-redux"
import Popupmenu from "../Popupmenu";

import "./ModalForm.css";
const ModalForm = ({forma,onClick,idRaspuns,raspunsuri,add,update}) => {
  // const raspInitialArr = Array(
  //   forma.length
  // ).fill("");
  // const [rasp, SetRasp] = useState(raspInitialArr);
  const raspInitialArr = Array(
    forma.length
  ).fill("");
  const [rasp, SetRasp] = useState([]);

  const [activeTab, setActiveTab] = useState(1);
  const [modalPosition, setModalPosition] = useState({ x: 370, y: 270 });
  let hasPrev = activeTab > 1;
  let hasNext = activeTab < forma.length;



  useEffect(() => {
    console.log(idRaspuns);
    console.log(raspunsuri);    
    if(idRaspuns!==null) {
      const foundRaspuns = raspunsuri.items.find(item => item.id === idRaspuns);
      const valuesArray = Object.values(foundRaspuns).filter(value => value !== foundRaspuns.id);
      SetRasp(valuesArray)    
    } else SetRasp(Array(forma.length).fill(""))

  }, []);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const nextStep = () => {
    if (hasNext) setActiveTab(activeTab + 1);
  };

  const previousStep = () => {
    if (hasPrev) setActiveTab(activeTab - 1);
  };

  const moveUp = () => {
    setModalPosition((prevPosition) => ({
      ...prevPosition,
      y: prevPosition.y - 10,
    }));
  };

  const moveDown = () => {
    setModalPosition((prevPosition) => ({
      ...prevPosition,
      y: prevPosition.y + 10,
    }));
  };

  const moveLeft = () => {
    setModalPosition((prevPosition) => ({
      ...prevPosition,
      x: prevPosition.x - 10,
    }));
  };

  const moveRight = () => {
    setModalPosition((prevPosition) => ({
      ...prevPosition,
      x: prevPosition.x + 10,
    }));
  };
  const handleResponse = () => {
    const IdRasp = Date.now();
    // console.log({ ...rasp, id: IdRasp });
    console.log(idRaspuns);
    console.log(IdRasp);
    if(idRaspuns===null){
     add({ ...rasp, id: IdRasp });
     onClick(rasp, IdRasp);
    } else {
      update({ ...rasp, id: idRaspuns });
      onClick(rasp, idRaspuns);
    }

    SetRasp(raspInitialArr);
  };

  const handleChange = (e, idx) => {
    const updatedRasp = [...rasp]; // Создаем копию массива rasp
    updatedRasp[idx] = e.target.value; // Обновляем первый элемент массива

    SetRasp(updatedRasp); // Устанавливаем обновленный массив в состояние
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-subject"
        style={{
          top: `${modalPosition.y}px`,
          left: `${modalPosition.x}px`,
        }}
      >
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(activeTab / forma.length) * 100}%` }}
          >
            Step {activeTab} of {forma.length}
          </div>
        </div>
        <div className="navbar-subject">
          <ul>
          {forma.map((elem, idx) => (
               <li key={idx}
               className={activeTab === (idx+1) ? "active" : ""}
               onClick={() => handleTabClick(idx+1)}
             >
               Step {idx+1}
             </li>         
          ))}
          </ul>
        </div>
        <div className="modal-content">
          {forma.map((elem, idx) => (
            <div className={activeTab === idx + 1 ? "active" : ""} key={idx}>
              <div>
                <div style={{ display: "flex" }}>
                  <label>
                    {elem.cerinte}
                  </label>
                  <Popupmenu
                    hint={elem.hint}
                  />
                </div>
                <textarea
                  value={rasp[idx]}
                  onChange={(e) => handleChange(e, idx)}
                  rows="5"
                ></textarea>
              </div>
            </div>
          ))}
          <div className="button-nav">
            <button className="btn" onClick={handleResponse}>
              Răspunde
            </button>
            <div className="button-group">
              <button
                className="btn prev"
                type="button"
                onClick={previousStep}
                style={{
                  display: !hasPrev ? "none" : "inline-block",
                }}
              >
                Back
              </button>
              <button
                className="btn next"
                type="button"
                onClick={nextStep}
                style={{
                  display: !hasNext ? "none" : "inline-block",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <button
          className="btn-close-modal"
          onClick={() => onClick(null,null)}
        ></button>
      </div>
      <div className="modal-arrows">
        <div className="arrow-container">
          <div className="arrow arrow--up" onClick={moveUp}>
            <div className="arrow-line arrow-line__upper"></div>
            <div className="arrow-line arrow-line__lower"></div>
          </div>
        </div>
        <div className="arrow-container">
          <div className="arrow arrow--back" onClick={moveLeft}>
            <div className="arrow-line arrow-line__upper"></div>
            <div className="arrow-line arrow-line__lower"></div>
          </div>
          <div className="arrow"></div>
          <div className="arrow arrow--next" onClick={moveRight}>
            <div className="arrow-line arrow-line__upper"></div>
            <div className="arrow-line arrow-line__lower"></div>
          </div>
        </div>
        <div className="arrow-container">
          <div className="arrow arrow--down" onClick={moveDown}>
            <div className="arrow-line arrow-line__upper"></div>
            <div className="arrow-line arrow-line__lower"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const reduxState = state => ({
  raspunsuri: state.raspunsuri,
})

const  reduxFunctions = dispatch => ({
  add: (item) => dispatch({type: 'ADD_ITEM', payload: item}),
  update: (item) => dispatch({ type:'UPDATE_ITEM', payload: item})
})

export default connect(reduxState,reduxFunctions)(ModalForm);
