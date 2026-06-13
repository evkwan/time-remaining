import type { YearContext } from '@/lib/time';

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Plain-text Q&A used for both the visible FAQ section and the FAQPage
 * structured data, so the two never drift apart. Server-rendered from
 * request-time values so the answers are crawlable.
 */
export function buildYearFaq(context: YearContext): FaqItem[] {
  const {
    year,
    formattedDate,
    dayOfYear,
    daysInYear,
    daysRemaining,
    weekOfYear,
    isLeapYear,
    percentYearElapsed,
  } = context;

  const weeksRemaining = Math.round(daysRemaining / 7);

  return [
    {
      question: `How many days are left in ${year}?`,
      answer: `As of ${formattedDate}, there are ${daysRemaining} days left in ${year}. The number counts down by one each day until December 31, when it reaches zero.`,
    },
    {
      question: `How many weeks are left in ${year}?`,
      answer: `There are about ${weeksRemaining} weeks left in ${year} (${daysRemaining} days divided by 7).`,
    },
    {
      question: 'What day of the year is it today?',
      answer: `Today is day ${dayOfYear} of ${daysInYear} in ${year} — that means ${percentYearElapsed}% of the year has already passed.`,
    },
    {
      question: 'What week of the year is it?',
      answer: `It is currently week ${weekOfYear} of ${year}.`,
    },
    {
      question: `Is ${year} a leap year?`,
      answer: `${year} is ${isLeapYear ? 'a leap year, so it has 366 days' : 'not a leap year, so it has 365 days'}.`,
    },
    {
      question: `When does ${year} end?`,
      answer: `${year} ends at 11:59:59 PM on December 31, ${year}. After that a new year begins and the countdown resets.`,
    },
  ];
}

export function buildYearSummary(context: YearContext): string {
  const {
    year,
    formattedDate,
    dayOfYear,
    daysInYear,
    daysRemaining,
    percentYearElapsed,
    isLeapYear,
  } = context;

  const weeksRemaining = Math.round(daysRemaining / 7);

  return (
    `As of ${formattedDate}, there are ${daysRemaining} days left in ${year} — ` +
    `about ${weeksRemaining} weeks. Today is day ${dayOfYear} of ${daysInYear}, ` +
    `so ${percentYearElapsed}% of ${year} has already passed. ` +
    `${year} ${isLeapYear ? 'is' : 'is not'} a leap year, with ${daysInYear} days in total, ending on December 31.`
  );
}
