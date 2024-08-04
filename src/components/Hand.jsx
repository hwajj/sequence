import React from 'react';

const Hand = ({ hand, onCardSelect }) => {
  console.log(hand)
  return (
    <div className="flex justify-center gap-2">
      {hand.map((card, index) => (
        <div
          key={index}
          className="w-24 h-36 flex items-center justify-center border cursor-pointer bg-white"
          onClick={() => onCardSelect(index)}
        >
          {card.value}
        </div>
      ))}
    </div>
  );
};

export default Hand;
