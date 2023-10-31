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
    <div className="w-3/5 flex justify-between items-end bg-slate-300 min-w-fit p-12 rounded-md">
      <div className="flex flex-col justify-center items-center">
        <div>{`hours`}</div>
        <div className="text-6xl">{`${hours}`}</div>
      </div>

      <div className="text-6xl">{`:`}</div>

      <div className="flex flex-col items-center">
        <div>{`mins`}</div>
        <div className="text-6xl">{`${minutes}`}</div>
      </div>

      <div className="text-6xl">{`:`}</div>

      <div className="flex flex-col items-start w-40 pe-6 ">
        <div className="text-center">{`seconds`}</div>
        <div className="text-6xl">
          {`${seconds}.${milliseconds.substring(0, 2)}`}
        </div>
      </div>
    </div>
  );
};

export default Timer;
