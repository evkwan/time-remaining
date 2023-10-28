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
  const milliseconds = dayjs
    .duration(endOfYear.diff(now))
    .milliseconds()
    .toString()
    .padStart(2, '0');

  const seconds = dayjs
    .duration(endOfYear.diff(now))
    .seconds()
    .toString()
    .padStart(2, '0');

  const minutes = dayjs
    .duration(endOfYear.diff(now))
    .asMinutes()
    .toString()
    .split('.')[0];

  return (
    <div className="w-full flex justify-center">
      <h2 className="text-center">
        {`${minutes}  :  ${seconds}  .  ${milliseconds.substring(0, 2)}`}
      </h2>
    </div>
  );
};

export default Timer;
