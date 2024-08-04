import React from 'react';

const Board = ({ board, onCardClick }) => {
  return (
    <div className="grid grid-cols-10">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-rows-10" >
          {row.map((card, colIndex) => (
            <div
              key={colIndex}
              className={`border-blue inline border cursor-pointer ${
                card.isOccupied ? 'bg-green-400' : 'bg-gray-200'
              }`}
              onClick={() => onCardClick(rowIndex, colIndex)}
            >
              {card.value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
