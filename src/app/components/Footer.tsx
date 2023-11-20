import React from 'react';
import dayjs from 'dayjs';

const Footer: React.FC = () => {
  const year = dayjs().year();
  return <div className="text-sm absolute bottom-4">{`${year} © evkwan`}</div>;
};

export default Footer;
