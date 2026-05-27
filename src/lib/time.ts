import { DateTime, Duration } from 'luxon';

export interface YearCountdown {
  hours: number;
  minutes: number;
  seconds: number;
  centiseconds: number;
}

export interface YearContext {
  year: number;
  formattedDate: string;
  dayOfYear: number;
  daysInYear: number;
  daysRemaining: number;
  weekOfYear: number;
  weeksInYear: number;
  isLeapYear: boolean;
  percentYearElapsed: number;
}

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

export function formatCountdownUnit(value: number): string {
  return pad2(Math.max(0, Math.floor(value)));
}

export function getEndOfYear(now: DateTime): DateTime {
  return DateTime.local(now.year, 12, 31, 23, 59, 59, 999);
}

export function getYearCountdown(now: DateTime): YearCountdown {
  const endOfYear = getEndOfYear(now);
  const diff: Duration = endOfYear.diff(now, [
    'hours',
    'minutes',
    'seconds',
    'milliseconds',
  ]);

  const {
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  } = diff.toObject();

  return {
    hours,
    minutes,
    seconds,
    centiseconds: Math.floor(milliseconds / 10),
  };
}

export function getYearContext(now: DateTime = DateTime.now()): YearContext {
  const year = now.year;
  const dayOfYear = now.ordinal;
  const daysInYear = now.daysInYear ?? 365;
  const daysRemaining = Math.max(0, daysInYear - dayOfYear);
  const weekOfYear = now.weekNumber;
  const weeksInYear = now.weeksInWeekYear ?? 52;
  const percentYearElapsed = Math.min(
    100,
    Math.round((dayOfYear / daysInYear) * 100),
  );

  return {
    year,
    formattedDate: now.toFormat('cccc, LLLL d'),
    dayOfYear,
    daysInYear,
    daysRemaining,
    weekOfYear,
    weeksInYear,
    isLeapYear: now.isInLeapYear,
    percentYearElapsed,
  };
}
