import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ContextData from "../context/ContextData";
import { useParams, useHistory } from "react-router-dom";
// import { RaspunsuriCtx } from "../context/Raspunsuri";
import { connect } from "react-redux"
import { fetchEvaluation2 } from "../../routes/api"
// import temeIstoriArray from "../../data/temeIstoria";
import Navbar from "../layouts/Navbar";
import Wrapper from "../Wrapper";
import Breadcrumb from "../Breadcrumb";
import TitleBox from "../TitleBox";
import ItemAccordeon from "../Accordeon/ItemAccordeon";
import AccordionSurse from "../Accordeon/AccordionSurse";
import ItemText from "../Accordeon/ItemText";
import ModalForm from "../Modal/ModalForm";
import ModalCalculator from "../Modal/ModalCalculator";
import Draw from "../CanvasDrawing/Draw";

const ExamenSubect2 = ({raspunsuri}) => {
  const {stateData, dispatchData} = React.useContext(ContextData)
  const { address } = useParams();
  const [idRaspuns, setIdRaspuns] = useState(null);
  const [item, setItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);

  const [text, setText] = useState("");
  const [indx, setIndx] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(null);
  const [textArray, setTextArray] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showAutoevaluare, setShowAutoevaluare] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([])
  const speed = 50;

  const history = useHistory();

  let quizArray = stateData.evaluations2;

  useEffect(() => {
  const fetchData = async () => {
    try {
      // console.log("stateData.evaluations2[1]", stateData.evaluations2);
      const theme = stateData.currentTheme.tema_id;
      const subject_id = stateData.currentSubject.subject_id;
      const level_id = 1;

      await fetchEvaluation2(theme, subject_id, level_id, dispatchData);
      quizArray = stateData.evaluations2;
      // console.log("stateData.evaluations2[2]", stateData.evaluations2);
    } catch (error) {
      console.error('Eroare în timpul recuperării datelor:', error);
    }
  };

  fetchData();
  }, []);

  useEffect(()=>{
    quizArray = stateData.evaluations2;
    // console.log("stateData.evaluations2", stateData.evaluations2)
  },[stateData.evaluations2])

  const [proc, setProc] = useState(quizArray[currentIndex]?.student_procent);

  const initialization = () => {
    const newArray = Array(
      quizArray[currentIndex]?.form.length
    ).fill("");
    setTextArray([...newArray]);
  };

  useEffect(() => {
    initialization();
  }, [currentIndex]);

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

  const handleTryAgain = async () => {

    let itemQuantity = quizArray.length;
    if(itemQuantity - 1 == currentIndex) {
      setCurrentIndex(0)

      let studentResults = []
      try {
        const response = await axios.post('http://localhost:8000/api/student-evaluation-results', {
          theme_id: stateData.currentSubject.tema_id,
          subject_id: stateData.currentSubject.subject_id,
          study_level_id: stateData.currentSubject.study_level_id,
        });
    
        // console.log(response.data);
        studentResults = response.data.studentEvaluationResults;
      } catch (error) {
        console.error('Error fetching data:', error.message);
    
      }
      console.log(studentResults );
      // try {
        const formDataArray = studentResults.map(column => {
          const formData = new FormData();
          formData.append('student_id', column.student_id );
          formData.append('points', 0 );
          formData.append('evaluation_answer_option_id', column.evaluation_answer_option_id );
          formData.append('evaluation_answer_id', column.answer_id );
          formData.append('status', 0 );
          return formData;
        });
        console.log(formDataArray)

        axios.all(formDataArray.map(formData => axios.post('http://localhost:8000/api/update-student-evaluation-answers', formData)))
        .then(axios.spread((...responses) => {
          const successResponses = responses.filter(response => response.data.status === 200);
          const errorResponses = responses.filter(response => response.data.status === 404);
          console.log(responses)
          if (successResponses.length > 0) {
            console.log("Successfully processed ", successResponses.lengt, " out of ", responses.length, " requests")
            setProc(0)
          }
          errorResponses.forEach(response => {
            console.log(response.data.errors)
          })
        }));
      // } catch (error) {
      //   console.error(error);
      // } 

    } else {
      setCurrentIndex(currentIndex + 1)
    }

    setIsAnswered(false);
    setShowResponse(false);
    initialization();
    setCurrentTextIndex(0);
    setIdRaspuns(null);
  };

  const handleNext = () => {
    console.log(stateData.currentSubject.subject_id)
    console.log(stateData.currentSubject.study_level_id)
    console.log(stateData.currentSubject.tema_id)
    let itemQuantity = quizArray.length;
    if(itemQuantity - 1 == currentIndex) {
      setCurrentIndex(0)
     } else {
      setCurrentIndex(currentIndex + 1)
    }
  };

  const handlePrevious = () => {
    // console.log("quizArray", quizArray)
    let itemQuantity = quizArray.length;
    if (currentIndex === 0) {
      setCurrentIndex(itemQuantity - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleVerifica = () => {
    setShowResponse(true);
  };
  
  const handleAutoevaluare = () => {
    setShowAutoevaluare(true);
  }

  const onCloseAutoevaluare = async (notaResult, newOptions) => {

    const theme = stateData.currentTheme.tema_id
    const subject_id = stateData.currentSubject.subject_id;
    const level_id = 1;

    await fetchEvaluation2(theme, subject_id, level_id, dispatchData);

    // console.log("stateData.evaluations2",stateData.evaluations2)

    const quizItem = stateData.evaluations2;
    // console.log(quizItem)   

    const totalStudentProcent = quizItem.reduce((sum, quizItem, idx) => {
      const studentProcent = idx === currentIndex
        ? notaResult * 100 / parseFloat(quizItem.maxPoints)
        : parseFloat(quizItem.student_procent);

      return sum + studentProcent;
    }, 0);

    const procent = Math.round(totalStudentProcent / quizArray.length);
    setProc(procent)
    // console.log("procent",procent)

    setSelectedOptions((prevOptions) => {
      let updatedOptions = [...prevOptions];

      newOptions.forEach((newOption) => {
        const existingIndex = updatedOptions.findIndex(
          (option) => option.answer_id == newOption.answer_id && option.student_id == newOption.student_id
        );

        if (existingIndex !== -1) {
          updatedOptions = updatedOptions.map((option, index) =>
            index == existingIndex
              ? { ...option, points: newOption.points, evaluation_answer_option_id: newOption.evaluation_answer_option_id }
              : option
          );
        } else {
          updatedOptions.push({ ...newOption });
        }
      });

      return updatedOptions;
    });
    setShowAutoevaluare(false);
  }

  useEffect(() => {
    // console.log("stateData.evaluations2",stateData.evaluations2)
    const theme = stateData.currentTheme.tema_id
    const subject_id = stateData.currentSubject.subject_id;
    const level_id = 1;

    fetchEvaluation2(theme, subject_id, level_id, dispatchData);
    console.log('Valoarea lui proc a fost actualizată:', proc);
    // console.log("stateData.evaluations2",stateData.evaluations2)

  }, [proc]);

  return (
    <>
      <Navbar />
      <Wrapper>
        {quizArray && (
          <>
            <Breadcrumb step={2} />
            <TitleBox className="teme-container" proc={proc}>{quizArray[currentIndex]?.name}</TitleBox>
            <ItemAccordeon
              titlu={`Cerințele sarcinii (${currentIndex + 1}/${
                quizArray.length
              }) - ${quizArray[currentIndex]?.maxPoints} puncte:`}
              open={true}
            >
              <ItemText>
                <p>Studiază materialul suport și realizează sarcinile propuse.</p>
                <AccordionSurse data={quizArray[currentIndex].source} />
                {/* <h3 style={{ textAlign: 'center'}}>
                  {`Item (${currentItem + 1}/${
                    item.quizArray[currentIndex].item.length
                  }):`}
                </h3> */}
                <h4>{quizArray[currentIndex].cerinta}</h4>
                <p>{quizArray[currentIndex].afirmatie} </p>
                {quizArray[currentIndex].harta && quizArray[currentIndex].harta.length>0 && <Draw item={quizArray[currentIndex]} disable={showResponse}/>}
                <div className="subject1-container">
      
                  <div className="paper" style={{ width: quizArray[currentIndex]?.procent_paper, height: '267px'}}>
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
                  forma={quizArray[currentIndex].form}
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
                titlu={`Rezolvarea item (${currentIndex + 1}/${
                  quizArray.length
                }):`}
                open={true}
              >
                <ItemText classNameChild="">
                {quizArray[currentIndex].img && (<img src={`http://localhost:8000/${process.env.PUBLIC_URL + quizArray[currentIndex]?.img}`} />)}
                {quizArray[currentIndex]?.answers.map(answer => (
                  <React.Fragment key={answer.answer_id}>
                    {answer.answer_text.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
                </ItemText>
                <button onClick={handleAutoevaluare} className="btn-test">
                  Autoevaluiaza raspunsul!
                </button>
                {showAutoevaluare && (
                  <ModalCalculator
                    onClick={onCloseAutoevaluare}
                    idRaspuns={idRaspuns}
                    currentIndex={currentIndex}
                    subject={2}
                  />
                )}
                <button onClick={handleTryAgain} className="btn-test">
                  Urmatorul item!
                </button>
              </ItemAccordeon>
            )}
            <div className="nav-container">
                <div className="nav-link" >
                  <div onClick={handlePrevious}>
                    <img src={process.env.PUBLIC_URL + "/images/navigation-left.png"} alt="" />
                    <p>Sarcina precedentă</p>
                  </div>
                </div>
                <div className="nav-link" >
                  <div onClick={handleNext} >        
                    <img src={process.env.PUBLIC_URL + "/images/navigation-right.png"} alt="" />
                    <p>Sarcina următoare</p>
                  </div>
                </div>
            </div>
          </>
        )}
      </Wrapper>
    </>
  );
};
const reduxState = (state) => ({
  raspunsuri: state.raspunsuri,
});

export default connect(reduxState)(ExamenSubect2);
