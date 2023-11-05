'use client';
import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const Timer = () => {
  dayjs.extend(duration);
  const [now, setNow] = useState<null | dayjs.Dayjs>(null);

  useEffect(() => {
    setNow(dayjs());
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (now === null) return <div>Loading...</div>;

  const endOfYear = dayjs().endOf('year');
  const timeDiff = endOfYear.diff(now);

  const milliseconds = dayjs
    .duration(timeDiff)
    .milliseconds()
    .toString()
    .padStart(2, '0');

  const seconds = dayjs
    .duration(timeDiff)
    .seconds()
    .toString()
    .padStart(2, '0');

  const minutes = dayjs
    .duration(timeDiff)
    .minutes()
    .toString()
    .padStart(2, '0');

  const hours = dayjs.duration(timeDiff).asHours().toString().split('.')[0];

  return (
    <div id="container" className="w-3/5 drop-shadow-md relative">
      <div
        id="gloss"
        className="w-full rounded-md border-solid border-2 border-red-800 py-8 px-11 flex justify-between items-start min-w-fit bg-gradient-to-b from-red-600 from-[31%] to-red-400  shadow-lg shadow-red-200/20 text-red-900 before:bg-gradient-to-b before:from-white before:via-white/70 before:via-[8%] before:to-transparent before:absolute before:w-[calc(100%_-_0.8rem)] before:h-1/3 before:top-0.5 before:left-0 before:right-0 before:rounded-lg before:mx-auto"
      >
        <div className="flex flex-col justify-center items-center z-1 relative">
          <div className="text-6xl text-shadow shadow-white/50">{`${hours}`}</div>
          <div className="mt-2">{`hours`}</div>
        </div>

        <div className="text-6xl text-shadow shadow-white/50 z-1 relative">{`:`}</div>

        <div className="flex flex-col items-center z-1 relative">
          <div className="text-6xl text-shadow shadow-white/50">{`${minutes}`}</div>
          <div className="mt-2">{`mins`}</div>
        </div>

        <div className="text-6xl text-shadow shadow-white/50 z-1 relative">{`:`}</div>

        <div className="flex flex-col items-start w-40 pe-6 z-1 relative">
          <div className="text-6xl text-shadow shadow-white/50">
            {`${seconds}.${milliseconds.substring(0, 2)}`}
          </div>
          <div className="text-center w-full mt-2">{`seconds`}</div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
