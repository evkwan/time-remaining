import React from 'react';

const copy = [
  '🤫 Yesterday you said tomorrow.',
  '⏳ Time and tide awaits for no man.',
  '🕰 The time is always right to do what you want.',
  "⏱ Time is the world's most expensive currency—you can't earn it back.",
  "⏱ Use time wisely—you can't earn it back.",
  '⚒️ Go forth and build!',
  '☝️ The time is now.',
  "⏱ The clock is ticking, and it's ticking fast.",
  '💰 Time is money.',
  '💭 Your future starts with the choices you make today.',
  '🌳 The best time to plan a tree was 20 years ago. The second best time is now.',
  '🏃‍♀️ Nothing guarantees results except one thing; inaction—it guarantees you zero results.',
  '📝 Inspiration is perishable. Act on it immediately.',
  '💻 Sexy results require unsexy work. Get moving.',
  "🚫 It ain't over till it's over. Go for it!",
  '🏁 It is never too late to start!',
  '🎬 Take action. Take action. Take action!',
  '💡 Your choices today shape your tomorrow.',
  "🔑 Seize the present; it's the key to your future.",
  '🚶‍♂️ Delay no more—take the first step today.',
];

const Tagline: React.FC = () => {
  const getRandomCopy = () => {
    const min = 0;
    const max = copy.length;
    const index = Math.floor(Math.random() * (max - min) + min);
    console.log('index', index);
    return copy[index];
  };
  return <div className="text-neutral-500 italic">{getRandomCopy()}</div>;
};

export default Tagline;
