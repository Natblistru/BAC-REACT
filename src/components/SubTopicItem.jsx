import React from "react";
import { Link } from 'react-router-dom';
const SubTopicItem = (props) => {
    const subtitle = props.subTit;
    return (
        <li key={props.idx}>
        <div className="subtopic-header">
            <span className="num"></span>
            <h4>
                {/* <Link to='/tema1'>{subtitle.name}</Link> */}
                <Link to={`${subtitle.addressDisciplina}${subtitle.address}`}>{subtitle.name}</Link>                
            </h4>
        </div>
        <div className="progress-box">
            <span>0%</span>
            <div className="progress">
                <div className="bar"></div>
            </div>
        </div>
    </li>)
    };
    export default SubTopicItem;