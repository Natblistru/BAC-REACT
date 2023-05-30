import React, { useState } from 'react';
import DiagramItem from './DiagramItem';

const DiagramTable = (props) => {

  const classes = 'tree ' + props.className;
  let diagramData = props.list;
  const clickDiagramItemHandler = (text) => {
    console.log(text);
    props.openModal(text);
 
  }
  const renderDiagramItems = (items) => {
    return items.map((item) => (
      <DiagramItem key={item.text} text={item.text} onClick={clickDiagramItemHandler}>
        {item.children.length > 0 && renderDiagramItems(item.children)}
      </DiagramItem>
    ));
  };

  return (
    <div>
      <ul className={classes}>
        {renderDiagramItems(diagramData)}
      </ul>
    </div>
  );
};

export default DiagramTable;
