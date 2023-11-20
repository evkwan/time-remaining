import dayjs from 'dayjs';
import React from 'react';
import dayOfYear from 'dayjs/plugin/dayOfYear';

const Body = () => {
  dayjs.extend(dayOfYear);
  const today = dayjs().format('dddd, MMM D');
  const endOfYear = dayjs().endOf('year');
  const dayNumber = dayjs().dayOfYear();
  const daysLeft = endOfYear.diff(dayjs(), 'day');
  //   const year = dayjs().year();

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
