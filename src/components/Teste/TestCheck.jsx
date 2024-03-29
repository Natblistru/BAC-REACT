import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import CheckBox from "../CheckBox";

import ItemAccordeon from "../Accordeon/ItemAccordeon";
import ItemText from "../Accordeon/ItemText";
import Puzzle from "../Puzzle";

const TestCheck = ({
  list,
  currentIndex,
  correctAnswer,
  setCorrectAnswer,
  additionalContent,
  handleTryAgain,
  currentItemIndex,
  setResponseReceived
}) => {
  const currentTests = useSelector(state => state.currentTests);
  const currentIndexTest = useSelector(state => state.currentIndexTest);
  const currentStudentObject = useSelector(state => state.currentStudent);
  const currentStudent = currentStudentObject ? currentStudentObject.currentStudent : 1;

  const [selectedValues, setSelectedValues] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([])
  // console.log(currentItemIndex)

  useEffect(()=>{
    const initialSelectedOptions = [];

    listItems[currentItemIndex].test_item_options.forEach(element => {
      initialSelectedOptions.push({ "option": element.option, 
                                     "score": 0,
                                     "correct": element.correct,
                                     "selected": false,
                                     "explanation": element.explanation,
                                     "test_item_complexity": listItems[currentItemIndex].test_item_complexity,
                                     "formative_test_id": listItems[currentItemIndex].formative_test_id,
                                     "test_item_id": listItems[currentItemIndex].test_item_id});
    });
    setSelectedOptions(initialSelectedOptions)
  },[currentItemIndex])
  
  // console.log(currentTests)
  // console.log(currentTests[currentIndexTest].order_number_options);

  // console.log(currentIndexTest);

  const listItems = currentTests[currentIndexTest].order_number_options;
// console.log(listItems[currentItemIndex].test_item_options)

  const handleCheckBoxChange = (value) => {
    const updatedValues = [...selectedValues];
    if (updatedValues.includes(value)) {
      const index = updatedValues.indexOf(value);
      updatedValues.splice(index, 1);
    } else {
      updatedValues.push(value);
    }
    setSelectedValues(updatedValues);

    setSelectedOptions((prevOptions) =>
    prevOptions.map((option) => {
      if (option.option === value) {
        return {
          ...option,
          selected: !option.selected,
          test_item_complexity: listItems[currentItemIndex].test_item_complexity,
          formative_test_id: listItems[currentItemIndex].formative_test_id,
          test_item_id: listItems[currentItemIndex].test_item_id,
        };
      }
      return {
          ...option,
          test_item_complexity: listItems[currentItemIndex].test_item_complexity,
          formative_test_id: listItems[currentItemIndex].formative_test_id,
          test_item_id: listItems[currentItemIndex].test_item_id,
        };
    })
   );
  };

  const checkAnswer = () => {
    // console.log(selectedOptions)
    const correctValues = listItems[currentItemIndex].test_item_options
      .filter((answer) => answer.correct==1)
      .map((answer) => answer.option);
    const selectedValuesString = selectedValues.sort().join(",");
    const correctValuesString = correctValues.sort().join(","); 
    setCorrectAnswer(selectedValuesString === correctValuesString);

    const selectedOptionsCalculate = selectedOptions.map(item => {
      let score;
      if (item.correct == item.selected) {
        score = item.test_item_complexity;
      } else {
        score = 0;
      }
      return {
        ...item,
        score: score
      };
    });
    const selectedOptionsToDB = selectedOptionsCalculate.map(item => {
      const { test_item_complexity, selected, correct, ...rest } = item;
      return { ...rest, student_id: currentStudent, type: 'check' };
    });

    for (const element of selectedOptionsToDB) {
      trimiteDateLaBackend(element);
    }
    // console.log(selectedOptionsToDB)
    const groupedArray = selectedOptionsToDB.reduce((accumulator, currentObject) => {
      const key = `${currentObject.student_id}_${currentObject.test_item_id}_${currentObject.type}_${currentObject.formative_test_id}`;
      
      if (!accumulator[key]) {
        accumulator[key] = {
          student_id: currentObject.student_id,
          test_item_id: currentObject.test_item_id,
          type: currentObject.type,
          formative_test_id: currentObject.formative_test_id
        };
      }
    
      return accumulator;
    }, {});
    
    const selectedResultsToDB = Object.values(groupedArray);
  
    for (const element of selectedResultsToDB) {
      trimiteResultsLaBackend(element);
    }
  };

  const trimiteDateLaBackend = async (element) => {
    try {
        // console.log(element)
        const response = await axios.post('http://localhost:8000/api/student-formative-test-options', element);

        if (response.status === 200) {
          console.log('Success:', response.data.message);
        } else {
          console.error('Error');
        }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log('Validation Errors:', error.response.data.errors);
      } else {
        console.error('Error:', error);
      }
    }
  };

  const trimiteResultsLaBackend = async (element) => {
    try {
        // console.log(element)
        const response = await axios.post('http://localhost:8000/api/student-formative-test-results', element);

        if (response.status === 200) {
          console.log('Success:', response.data.message);
          setResponseReceived(true);
        } else {
          console.error('Error');
        }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log('Validation Errors:', error.response.data.errors);
      } else {
        console.error('Error:', error);
      }
    }
  };

  const handleTryAgainClearCheck = () => {
    setSelectedValues([]); 
    handleTryAgain();
  };

  return (
    <>
      <ItemAccordeon
        titlu={
          correctAnswer === null
            ? `Cerințele sarcinii (${currentIndex + 1}/${list.length}):`
            : `Rezultat (${currentIndex + 1}/${list.length}):`
        }
        correctAnswer={correctAnswer}
        additionalContent={additionalContent}
        open={true}
      >
        <ItemText
          classNameChild={
            correctAnswer === null
              ? ""
              : correctAnswer
              ? " correct"
              : " incorrect"
          }
        >
        <p style={{paddingBottom: '20px'}}>
          {listItems[currentItemIndex].test_item_task.includes('(')
            ? listItems[currentItemIndex].test_item_task.substring(0, listItems[currentItemIndex].test_item_task.indexOf('('))
            : listItems[currentItemIndex].test_item_task
          }
        </p>
          <Puzzle />
          {listItems[currentItemIndex].test_item_options.map((answer, idx) => {
            return (
              <CheckBox
                key={idx}
                value={answer.option}
                checked={selectedValues.includes(answer.option)}
                onChange={
                  correctAnswer === null ? handleCheckBoxChange : () => {}
                }
              />
            );
          })}
        </ItemText>
        {correctAnswer === null && (
          <button onClick={checkAnswer} className="btn-test">
            Verifică răspunsul
          </button>
        )}
      </ItemAccordeon>
      {correctAnswer !== null && (
        <ItemAccordeon
          titlu={`Rezolvarea sarcinii (${currentIndex + 1}/${list.length}):`}
          open={true}
        >
          <ItemText classNameChild="">
            {listItems[currentItemIndex].test_item_options.map((answer, idx) => (
              <CheckBox
                key={idx}
                value={answer.explanation}
                checked={answer.correct==1}
                onChange={() => {}}
              />
            ))}
          </ItemText>
          {/* <button onClick={handleTryAgainClearCheck} className="btn-test">
            Încearcă din nou!
          </button> */}
        </ItemAccordeon>
      )}
    </>
  );
};

export default TestCheck;
