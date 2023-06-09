import React from "react";
import { Link } from 'react-router-dom';
const ListDiscipline = (props) => {
  return (
    <div className="manuale-container">
      {props.list.map((item) => (
        <div className="manual-item" key={item.id}>
          <Link to={item.path}>
            <img src={process.env.PUBLIC_URL + item.img} alt="" />
            <p>{item.name}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};
export default ListDiscipline;
