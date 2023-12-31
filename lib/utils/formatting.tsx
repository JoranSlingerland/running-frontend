import { Typography } from 'antd';

import {
  convertSecondsToMinutes,
  convertSpeedToPaceInSeconds,
  convertTime,
} from './convert';

const { Text } = Typography;

function formatDistance(distance: number, unit: string, decimals = 2) {
  switch (unit) {
    case 'm':
      return <Text>{distance.toFixed(decimals)} M</Text>;
    case 'km':
      return <Text>{(distance / 1000).toFixed(decimals)} KM</Text>;
    case 'mi':
      return <Text>{(distance / 1609).toFixed(decimals)} MI</Text>;
    case 'ft':
      return <Text>{(distance / 0.3048).toFixed(decimals)} FT</Text>;
    default:
      return <Text>{distance.toFixed(decimals)} M</Text>;
  }
}

function formatTime({
  seconds,
  wrapInText = true,
  addSeconds = true,
  addMinutes = true,
  addHours = true,
}: {
  seconds: number;
  wrapInText?: boolean;
  addSeconds?: boolean;
  addMinutes?: boolean;
  addHours?: boolean;
}) {
  const [hours, minutes, remainingSeconds] = convertTime(seconds);

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

  return wrapInText ? <Text>{formattedTime}</Text> : formattedTime;
}

function formatSpeed(metersPerSecond: number, unit: string, decimals = 2) {
  switch (unit) {
    case 'm':
      return <Text>{(metersPerSecond * 3.6).toFixed(decimals)}KM/H</Text>;
    case 'km':
      return <Text>{(metersPerSecond * 3.6).toFixed(decimals)}KM/H</Text>;
    case 'mi':
      return <Text>{(metersPerSecond * 2.237).toFixed(decimals)}MPH</Text>;
    case 'ft':
      return <Text>{(metersPerSecond * 3.281).toFixed(decimals)}FT/S</Text>;
  }
}

function formatPace(
  metersPerSecond: number | undefined,
  unit: 'km' | 'mi' = 'km',
  addUnit = true,
  wrapInText = true,
) {
  const minutes = formatMinute(
    convertSpeedToPaceInSeconds(metersPerSecond, unit),
    addUnit,
    false,
  );
  return wrapInText ? <Text>{minutes}</Text> : minutes;
}

function formatMinute(seconds: number, addUnit = true, wrapInText = true) {
  const [minutes, remainingSeconds] = convertSecondsToMinutes(seconds);
  const formattedTime = `${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}${
    addUnit ? ' MIN/KM' : ''
  }`;

  return wrapInText ? <Text>{formattedTime}</Text> : formattedTime;
}

function formatHeartRate(heartRate: number) {
  return <Text>{Math.floor(heartRate)} BPM</Text>;
}

function formatNumber({
  number,
  decimals = 2,
  wrapInText = true,
}: {
  number: number | undefined;
  decimals?: number;
  wrapInText?: boolean;
}) {
  if (number === undefined) {
    return '';
  }
  const formattedNumber = number.toFixed(decimals);
  return wrapInText ? <Text>{formattedNumber}</Text> : formattedNumber;
}

function renderIcon(icon: string) {
  return (
    <i className={`material-icons text-[#000000E0] dark:text-[#FFFFFFD9]`}>
      {icon}
    </i>
  );
}

function sportIcon(sport: string) {
  switch (sport) {
    case 'Run':
      return renderIcon('directions_run');
    case 'Ride':
      return renderIcon('directions_bike');
    case 'Swim':
      return renderIcon('pool');
    case 'Walk':
      return renderIcon('directions_walk');
    case 'Hike':
      return renderIcon('terrain');
    case 'Workout':
      return renderIcon('fitness_center');
    case 'WeightTraining':
      return renderIcon('fitness_center');
    case 'Yoga':
      return renderIcon('self_improvement');
    case 'VirtualRide':
      return renderIcon('directions_bike');
    case 'VirtualRun':
      return renderIcon('directions_run');
    default:
      return <></>;
  }
}

export {
  formatDistance,
  formatTime,
  formatSpeed,
  formatPace,
  formatHeartRate,
  formatNumber,
  renderIcon,
  sportIcon,
};
