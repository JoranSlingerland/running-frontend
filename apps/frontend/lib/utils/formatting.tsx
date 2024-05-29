import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { Icon } from '@elements/icon';

import {
  convertDistance,
  convertSecondsToMinutesAndRemainder,
  convertSecondsToTimeComponents,
  convertSpeedToPaceInSeconds,
  convertSpeedToUnitsPerHour,
} from './convert';

dayjs.extend(utc);
dayjs.extend(timezone);

// Helper functions
function unitMapper(units: Units, type: 'distance' | 'speed' | 'pace') {
  let result: string;

  switch (type) {
    case 'distance':
      result = units === 'metric' ? 'km' : 'mi';
      break;
    case 'speed':
      result = units === 'metric' ? 'km/h' : 'mph';
      break;
    case 'pace':
      result = units === 'metric' ? 'min/km' : 'min/mi';
      break;
  }

  return result;
}

// Distance functions
function formatDistance({
  meters,
  units,
  decimals = 2,
  addUnits = true,
}: {
  meters: number | undefined;
  units: Units;
  decimals?: number;
  addUnits?: boolean;
}) {
  meters = meters || 0;
  const value = convertDistance(meters, units);

  let formattedValue = value.toFixed(decimals);
  if (addUnits) {
    formattedValue += ` ${unitMapper(units, 'distance')}`;
  }

  return formattedValue;
}

// Time functions
function formatTime({
  seconds,
  addSeconds = true,
  addMinutes = true,
  addHours = true,
}: {
  seconds: number | undefined;
  addSeconds?: boolean;
  addMinutes?: boolean;
  addHours?: boolean;
}) {
  if (seconds === undefined) {
    seconds = 0;
  }
  const isNegative = seconds < 0;

  const [hours, minutes, remainingSeconds] = convertSecondsToTimeComponents(
    Math.abs(seconds),
  );

  let formattedTime = '';

  if (addHours) {
    const paddedHours = hours.toString().padStart(2, '0');
    formattedTime += `${paddedHours}:`;
  }

  if (addMinutes) {
    const paddedMinutes = minutes.toString().padStart(2, '0');
    formattedTime += `${paddedMinutes}:`;
  }

  if (addSeconds) {
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
    formattedTime += `${paddedSeconds}`;
  }

  // Remove trailing colon if seconds are not included
  if (!addSeconds) {
    formattedTime = formattedTime.slice(0, -1);
  }

  if (isNegative) {
    formattedTime = `-${formattedTime}`;
  }

  return formattedTime;
}

function formatDateTime(date: string) {
  const userTimezone = dayjs.tz.guess() || 'UTC';
  return dayjs.utc(date).tz(userTimezone).format('MM/DD/YYYY HH:mm:ss');
}

function formatMinute(seconds: number) {
  const [minutes, remainingSeconds] =
    convertSecondsToMinutesAndRemainder(seconds);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

// Pace and speed functions
function formatPace({
  metersPerSecond,
  units,
  addUnit = true,
}: {
  metersPerSecond: number | undefined;
  units: Units;
  addUnit?: boolean;
}) {
  const value = formatMinute(
    convertSpeedToPaceInSeconds(metersPerSecond, units),
  );
  return addUnit ? `${value} ${unitMapper(units, 'pace')}` : value;
}

function formatSpeed({
  metersPerSecond,
  units,
  decimals = 2,
  addUnit = true,
}: {
  metersPerSecond?: number;
  units: Units;
  decimals?: number;
  addUnit?: boolean;
}) {
  const value = convertSpeedToUnitsPerHour(metersPerSecond, units).toFixed(
    decimals,
  );

  return addUnit ? `${value} ${unitMapper(units, 'speed')}` : value;
}

// Misc functions
function formatHeartRate(heartRate: number | undefined, addUnit = true) {
  const value = heartRate?.toFixed(0);
  return addUnit ? `${value} bpm` : `${value}`;
}

function formatNumber({
  number,
  decimals = 2,
}: {
  number: number | undefined;
  decimals?: number;
}) {
  if (number === undefined) {
    return '';
  }
  return number.toFixed(decimals);
}

const SportIcon = ({ sport }: { sport: string | undefined }): JSX.Element => {
  switch (sport?.toLowerCase()) {
    case 'run':
      return <Icon icon="directions_run" />;
    case 'ride':
      return <Icon icon="directions_bike" />;
    case 'swim':
      return <Icon icon="pool" />;
    case 'walk':
      return <Icon icon="directions_walk" />;
    case 'hike':
      return <Icon icon="terrain" />;
    case 'workout':
      return <Icon icon="fitness_center" />;
    case 'weighttraining':
      return <Icon icon="fitness_center" />;
    case 'yoga':
      return <Icon icon="self_improvement" />;
    case 'virtualride':
      return <Icon icon="directions_bike" />;
    case 'virtualrun':
      return <Icon icon="directions_run" />;
    default:
      return <></>;
  }
};

function formatCadence(cadence: number | undefined, addUnit = true) {
  if (cadence) {
    cadence = cadence * 2;
  }
  const value = cadence?.toFixed(0);
  return addUnit ? `${value} spm` : `${value}`;
}

function formatPercent({
  value,
  decimals = 2,
}: {
  value: number;
  decimals?: number;
}) {
  return `${value.toFixed(decimals)}%`;
}

export {
  formatDistance,
  formatTime,
  formatPace,
  formatHeartRate,
  formatNumber,
  SportIcon,
  formatDateTime,
  unitMapper,
  formatSpeed,
  formatCadence,
  formatPercent,
};
