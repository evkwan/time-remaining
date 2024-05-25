import React from 'react';
import { DateTime } from 'luxon';

const Title: React.FC = () => {
  const year = DateTime.now().year;
  return <h1 className="text-4xl mt-8">{`Time remaining in Year ${year}`}</h1>;
};

export default Title;
