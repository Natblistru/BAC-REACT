import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import temeIstoriArray from "../../data/temeIstoria";
import Wrapper from "../Wrapper";
import Breadcrumb from "../Breadcrumb";
import TitleBox from "../TitleBox";
import ItemAccordeon from "../Accordeon/ItemAccordeon";
import ItemText from "../Accordeon/ItemText";

const ExamenSubect1 = () => {
  const { address } = useParams();
  const [item, setItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [text, setText] = useState("You can edit this text! Cupcake ipsum dolor sit amet liquorice fruitcake. Candy canes jelly beans sweet roll cupcake lollipop. Powder carrot cake toffee brownie. Marshmallow sweet rolldonut. Chocolate cake apple pie candy canes tiramisudragée wafer. Croissant cookie lemon drops tiramisu jelly-o donut. Sweet gummi bears ice cream.");
  const [idx, setIdx] = useState(1);
  const speed = 100;

  useEffect(() => {
    if (idx > text.length) {
      return; // Stop the animation if idx exceeds the length of the text
    }
    const interval = setInterval(() => {
      setIdx((prevIdx) => (prevIdx >= text.length ? prevIdx : prevIdx + 1));
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

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
        obj[key] === "/" + address + "/examen-subiect1"
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
    setCurrentIndex(0);
  }, []);
  return (
    <Wrapper>
      {item && (
        <>
          <Breadcrumb list={item.breadcrumb} />
          <TitleBox className="teme-container">{item.name}</TitleBox>
          <ItemAccordeon titlu="Cerințele sarcinii" open={true}>
            <ItemText>
              <p>{item.quizArray[currentIndex].cerinte}</p>
              <div className="subject1-container">
                <div>
                  <div className="paper">
                    <div className="lines">
                      <div className="text" contenteditable spellcheck="false">
                      {text.slice(0, idx)}
                      </div>
                    </div>
                    <div className="holes hole-top"></div>
                    <div className="holes hole-middle"></div>
                    <div className="holes hole-bottom"></div>
                  </div>
                </div>
                <img
                  src={
                    process.env.PUBLIC_URL + item.quizArray[currentIndex].img
                  }
                  alt=""
                />
              </div>
            </ItemText>
          </ItemAccordeon>
        </>
      )}
    </Wrapper>
  );
};
export default ExamenSubect1;
