import React from 'react';
import { DateTime } from 'luxon';

const Footer: React.FC = () => {
  const year = DateTime.now().year;
  return <div className="text-sm absolute bottom-4">{`${year} © evkwan`}</div>;
};

export default Footer;
