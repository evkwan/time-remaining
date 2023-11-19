import React from 'react';
import dayjs from 'dayjs';

const Title: React.FC = () => {
  const year = dayjs().year();
  return <h1 className="text-4xl mt-8">{`Time remaining in Year ${year}`}</h1>;
};

export default Title;
