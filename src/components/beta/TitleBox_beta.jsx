import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// import temeIstoriArray from "../data/temeIstoria";
import ProgressBar from "./ProgressBar_beta";

const TitleBox_beta = ({
  className,
  subjectId,
  subtitleId,
  list,
  children,
  proc,
  sursa
}) => {
  const classes = "title-box " + className;
  const location = useLocation();
  const [prof, setProf] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let teacherName = searchParams.get("teachername");
    if (!teacherName) {
      teacherName = searchParams.get("teacher");
    }
    setProf(teacherName);
  }, [location.search]);
// console.log(proc)
  return (
    <div className={classes}>
      <div className="title-img">
        <img src={process.env.PUBLIC_URL + "/images/parchment.png"} alt="" />
        <div>
          <h1>{children}</h1>
          {sursa !== undefined ? (
            <p>({sursa})</p>
          ) : (
            prof !== null && (
              <p>(elaborat de profesorul {prof})</p>
            )
          )}
        </div>
      </div>
      {proc !== undefined && (
        <ProgressBar proc={proc} />
      )}
    </div>
  );
};
export default TitleBox_beta;
