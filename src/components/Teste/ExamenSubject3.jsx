import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux"
import temeIstoriArray from "../../data/temeIstoria";
import Wrapper from "../Wrapper";
import Breadcrumb from "../Breadcrumb";
import TitleBox from "../TitleBox";
import ItemAccordeon from "../Accordeon/ItemAccordeon";
import AccordionSurse from "../Accordeon/AccordionSurse";
import ItemText from "../Accordeon/ItemText";
import ModalForm from "../Modal/ModalForm";
import ModalCalculator from "../Modal/ModalCalculator";

const ExamenSubect3 = ({raspunsuri}) => {
  const { address } = useParams();
  const [idRaspuns, setIdRaspuns] = useState(null);
  const [item, setItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [text, setText] = useState("");
  const [indx, setIndx] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(null);
  const [textArray, setTextArray] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showAutoevaluare, setShowAutoevaluare] = useState(false)
  const speed = 50;

  const history = useHistory();

  function findObjectWithAddress(obj) {
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        const found = findObjectWithAddress(obj[key]);
        if (found) {
          return found;
        }
      } else if (
        key === "addressAplicatie" &&
        obj[key] === "/" + address + "/examen-subiect3"
      ) {
        return obj;
      }
    }
    return null;
  }

  useEffect(() => {
    const foundItem = findObjectWithAddress(temeIstoriArray);
    if (foundItem) {
      setItem(foundItem);
    } else {
      history.push("/error");
    }
  }, []);

  const initialization = () => {
    const newArray = Array(item?.quizArray[currentIndex].forma.length).fill("");
    setTextArray([...newArray]);
  };

  useEffect(() => {
    initialization();
  }, [item]);

  useEffect(() => {
    if (currentTextIndex !== null) {
      setText(textArray[currentTextIndex]);
      if (currentTextIndex < textArray.length) {
        if (textArray[currentTextIndex].length == 0) {
          indx == 1 ? setIndx(0) : setIndx(1);
        } else setIndx(1);
      }
    }
  }, [currentTextIndex]);

  useEffect(() => {
    if (currentTextIndex !== null && currentTextIndex < textArray.length) {
      if (indx == text?.length || text?.length == 0) {
        if (currentTextIndex < textArray.length) {
          setCurrentTextIndex(currentTextIndex + 1);
        } else return;
      }

      const interval = setInterval(() => {
        setIndx((prevIdx) => (prevIdx >= text?.length ? prevIdx : prevIdx + 1));
      }, speed);

      return () => clearInterval(interval);
    }
  }, [indx, text]);

  useEffect(() => {
    // console.log(raspunsuri.items);
    // console.log(idRaspuns);
  }, [raspunsuri.items]);

  const openModal = () => {
    if (!showResponse) setIsOpen(true);
  };

  const closeModal = (textRaspuns,idRasp) => {
    if (idRasp !== null) {
      setIdRaspuns(idRasp)
    }
    if (textRaspuns !== null) {
      if (textRaspuns.every((element) => element === "")) {
        setIsAnswered(false);
      } else {
        setTextArray([...textRaspuns]);
        setCurrentTextIndex(0);
        setIsAnswered(true);
      }
    }
    setIsOpen(false);
  };

  const handleTryAgain = () => {
    setCurrentIndex(
      item.quizArray.length - 1 === currentIndex ? 0 : currentIndex + 1
    );
    setIsAnswered(false);
    setShowResponse(false);
    initialization();
    setCurrentTextIndex(0);
    setIdRaspuns(null);
  };

  const handleVerifica = () => {
    setShowResponse(true);
  };

  const handleAutoevaluare = () => {
    setShowAutoevaluare(true);
  }

  const onCloseAutoevaluare = () => {
    setShowAutoevaluare(false);
  }

  return (
    <Wrapper>
      {item && (
        <>
          <Breadcrumb list={item.breadcrumb} />
          <TitleBox className="teme-container">{item.name}</TitleBox>
          <ItemAccordeon
            titlu={`Cerințele sarcinii (${currentIndex + 1}/${
              item.quizArray.length
            }) - ${item.quizArray[currentIndex].barem.maxPoints} puncte:`}
            open={true}
          >
            <ItemText>
              <p>{item.quizArray[currentIndex].cerinte[0]}</p>
              <AccordionSurse data={item.quizArray[currentIndex].sursa} />
              <p>
                {item.quizArray[currentIndex].cerinte[1]}{" "}
                <span style={{ fontStyle: "italic" }}>
                  {item.quizArray[currentIndex].afirmatia}
                </span>
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontStyle: "italic",
                  marginTop: "10px",
                }}
              >
                {item.quizArray[currentIndex].nota.map((paragraf, idx) => (
                  <span key={idx}>{paragraf}</span>
                ))}
              </div>
              <div className="subject1-container">
                <div className="paper" style={{ width: "100%" }}>
                  <div className="lines">
                    <div className="text">
                      {currentTextIndex !== null &&
                        isAnswered &&
                        textArray.map((textElem, ind) =>
                          currentTextIndex >= ind ? (
                            <React.Fragment key={ind}>
                              {textElem.slice(
                                0,
                                currentTextIndex == ind &&
                                  indx < textElem.length
                                  ? indx
                                  : textElem.length
                              )}
                              <br />
                            </React.Fragment>
                          ) : null
                        )}
                    </div>
                  </div>
                  <div className="holes hole-top"></div>
                  <div className="holes hole-middle"></div>
                  <div className="holes hole-bottom"></div>
                  <img
                    className="edit-img"
                    src={process.env.PUBLIC_URL + "/images/edit-button.png"}
                    onClick={openModal}
                    alt=""
                  />
                </div>
              </div>
            </ItemText>

            {isOpen && (
              <ModalForm
                onClick={closeModal}
                forma={item.quizArray[currentIndex].forma}
                idRaspuns={idRaspuns}
              />
            )}
            {isAnswered === true && (
              <button onClick={handleVerifica} className="btn-test">
                Verifică răspunsul
              </button>
            )}
          </ItemAccordeon>
          {showResponse && (
            <ItemAccordeon
              titlu={`Rezolvarea sarcinii (${currentIndex + 1}/${
                item.quizArray.length
              }):`}
              open={true}
            >
              <ItemText classNameChild="">
                {item.quizArray[currentIndex].raspuns[0]}
                <br />
                {item.quizArray[currentIndex].raspuns[1]}
              </ItemText>
              <button onClick={handleAutoevaluare} className="btn-test">
                Autoevaluiaza raspunsul!
              </button>
              {showAutoevaluare && (
                <ModalCalculator
                  onClick={onCloseAutoevaluare}
                  barem={item.quizArray[currentIndex].barem}
                  idRaspuns={idRaspuns}
                />
              )}
              <button onClick={handleTryAgain} className="btn-test">
                Încearcă din nou!
              </button>
            </ItemAccordeon>
          )}
        </>
      )}
    </Wrapper>
  );
};
const reduxState = state => ({
  raspunsuri: state.raspunsuri,
})
export default connect(reduxState,null)(ExamenSubect3);
