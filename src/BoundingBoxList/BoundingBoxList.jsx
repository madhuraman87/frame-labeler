import React from 'react';
import trashCan from "./trashCan.svg";
import "./BoundingBoxList.css";

const BoundingBoxList = ({ boundingBoxes, handleDeleteBox }) => (
    <div>
        <h4 className='bounding-list-title'>Bounding Boxes</h4>
        <ul className='bbox-list'>
            {boundingBoxes.map((box, index) => (
                <li key={index}>
                    <div>
                        Bounding Box {index + 1} - ({Math.round(box.x)}, {Math.round(box.y)}) to ({Math.round(box.x + box.width)}, {Math.round(box.y + box.height)})
                        <button className="trash-can-icon" onClick={() => handleDeleteBox(index)}>
                            <img src={trashCan} alt="trash-can" />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    </div>

);

export default BoundingBoxList;

