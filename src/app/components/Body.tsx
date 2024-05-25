import React from 'react';
import { DateTime } from 'luxon';

const Body = () => {
  const today = DateTime.now().toFormat('cccc, LLL d');
  const dayNumber = DateTime.now().ordinal;
  const daysLeft = DateTime.now().daysInYear - dayNumber;

  return (
    <div className="mt-4 flex flex-col justify-center items-center text-2xl">
      <div className="mb-4 text-neutral-400">
        {`${today} - `}
        <span className="text-cheese">{`Day ${dayNumber}`}</span>
      </div>
      {/* <div className="leading-relaxed">{`Day ${dayNumber}`}</div> */}
      <div className="mb-4 text-neutral-400">
        {daysLeft < 100 && 'Just '}
        <span className="text-rose-600">{`${daysLeft} days `}</span>
        {'left in the year.'}
      </div>
    </div>
  );
};

export default Body;
