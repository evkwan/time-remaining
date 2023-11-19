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

  if (now === null)
    return <div className="text-neutral-500">Calculating...</div>;

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
        className="w-full rounded-lg border-solid border-4 border-tomato py-7 px-9 flex justify-between items-start min-w-fit text-tomato font-semibold hover:before:w-full hover:before:h-full hover:before:absolute hover:before:top-0 hover:before:left-0 hover:before:bg-[radial-gradient(closest-side,_var(--tw-gradient-stops))] hover:before:from-transparent hover:before:from-30% hover:before:to-red-500/40 hover:before:animate-[pulse_0.9s_cubic-bezier(0.4,_0,_0.6,_1)_infinite] hover:text-tomato  shadow-rose-300/20 hover:shadow-black/10"
      >
        <div className="flex flex-col justify-center items-center z-1 relative">
          <div className="text-6xl text-shadow">{`${hours}`}</div>
          <div className="mt-2">{`hours`}</div>
        </div>

        <div className="py-4 text-3xl text-shadow z-1 relative">{`|`}</div>

        <div className="flex flex-col items-center z-1 relative">
          <div className="text-6xl text-shadow">{`${minutes}`}</div>
          <div className="mt-2">{`mins`}</div>
        </div>

        <div className="py-4  text-3xl text-shadow z-1 relative">{`|`}</div>

        <div className="flex flex-col items-start w-40 pe-6 z-1 relative">
          <div className="text-6xl text-shadow">
            {`${seconds}.${milliseconds.substring(0, 2)}`}
          </div>
          <div className="text-center w-full mt-2">{`seconds`}</div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
