import { DetailedActivity, SummaryActivity } from '@repo/strava';
import { Activity } from '@repo/types';
import { formatISO } from 'date-fns';

function cleanupDetailedActivity(
  activity: DetailedActivity,
  userId: string,
  customFieldsCalculated: boolean,
): Activity {
  activity.start_date = formatISO(new Date(activity.start_date));
  activity.start_date_local = formatISO(new Date(activity.start_date_local));

  for (const lap of activity.laps) {
    lap.start_date = formatISO(new Date(lap.start_date));
    lap.start_date_local = formatISO(new Date(lap.start_date_local));
  }

  for (const effort of activity.best_efforts) {
    effort.start_date = formatISO(new Date(effort.start_date));
    effort.start_date_local = formatISO(new Date(effort.start_date_local));
  }

  for (const effort of activity.best_efforts) {
    delete effort['athlete' as keyof typeof effort];
    delete effort['activity' as keyof typeof effort];
  }

  const numberActivityId = activity.id.toString();

  const result: Activity = {
    id: numberActivityId,
    achievement_count: activity.achievement_count,
    athlete_count: activity.athlete_count,
    average_speed: activity.average_speed,
    average_watts: activity.average_watts,
    device_watts: activity.device_watts,
    distance: activity.distance,
    elapsed_time: activity.elapsed_time,
    elev_high: activity.elev_high,
    elev_low: activity.elev_low,
    end_latlng: activity.end_latlng,
    external_id: activity.external_id,
    gear_id: activity.gear_id,
    kilojoules: activity.kilojoules,
    manual: activity.manual,
    map: {
      id: activity.map.id,
      polyline: activity.map.polyline,
      summary_polyline: activity.map.summary_polyline,
    },
    max_speed: activity.max_speed,
    max_watts: activity.max_watts,
    moving_time: activity.moving_time,
    name: activity.name,
    sport_type: activity.sport_type,
    start_date: activity.start_date,
    start_date_local: activity.start_date_local,
    start_latlng: activity.start_latlng,
    timezone: activity.timezone,
    total_elevation_gain: activity.total_elevation_gain,
    trainer: activity.trainer,
    type: activity.type,
    upload_id: activity.upload_id,
    upload_id_str: activity.upload_id_str,
    weighted_average_watts: activity.weighted_average_watts,
    workout_type: activity.workout_type,
    best_efforts: activity.best_efforts,
    calories: activity.calories,
    description: activity.description,
    device_name: activity.device_name,
    embed_token: activity.embed_token,
    laps: activity.laps,
    splits_metric: activity.splits_metric,
    utc_offset: activity.utc_offset,
    location_city: activity.location_city,
    location_state: activity.location_state,
    location_country: activity.location_country,
    pr_count: activity.pr_count,
    has_heartrate: activity.has_heartrate,
    average_heartrate: activity.average_heartrate,
    max_heartrate: activity.max_heartrate,
    average_cadence: activity.average_cadence,
    perceived_exertion: activity.perceived_exertion,
    userId: userId,
    full_data: true,
    custom_fields_calculated: customFieldsCalculated,
    hr_reserve: null,
    pace_reserve: null,
    hr_trimp: null,
    pace_trimp: null,
    hr_max_percentage: null,
    vo2max_estimate: {
      workout_vo2_max: null,
      vo2_max_percentage: null,
      estimated_vo2_max: null,
    },
    user_input: {
      include_in_vo2max_estimate: true,
      tags: [],
      notes: '',
    },
    streams: null,
  };
  return result;
}

function cleanUpSummaryActivity(
  activity: SummaryActivity,
  userId: string,
): Activity {
  activity.start_date = formatISO(new Date(activity.start_date));
  activity.start_date_local = formatISO(new Date(activity.start_date_local));

  const numberActivityId = activity.id.toString();

  const result: Activity = {
    id: numberActivityId,
    achievement_count: activity.achievement_count,
    athlete_count: activity.athlete_count,
    average_speed: activity.average_speed,
    average_watts: activity.average_watts,
    device_watts: activity.device_watts,
    distance: activity.distance,
    elapsed_time: activity.elapsed_time,
    elev_high: activity.elev_high,
    elev_low: activity.elev_low,
    end_latlng: activity.end_latlng,
    external_id: activity.external_id,
    gear_id: activity.gear_id,
    kilojoules: null,
    manual: activity.manual,
    map: {
      id: activity.map.id,
      polyline: null,
      summary_polyline: activity.map.summary_polyline,
    },
    max_speed: activity.max_speed,
    max_watts: activity.max_watts,
    moving_time: activity.moving_time,
    name: activity.name,
    sport_type: activity.sport_type,
    start_date: activity.start_date,
    start_date_local: activity.start_date_local,
    start_latlng: activity.start_latlng,
    timezone: activity.timezone,
    total_elevation_gain: activity.total_elevation_gain,
    trainer: activity.trainer,
    type: activity.type,
    upload_id: activity.upload_id,
    upload_id_str: activity.upload_id_str,
    weighted_average_watts: activity.weighted_average_watts,
    workout_type: activity.workout_type,
    best_efforts: null,
    calories: null,
    description: null,
    device_name: null,
    embed_token: null,
    laps: null,
    splits_metric: null,
    utc_offset: activity.utc_offset,
    location_city: activity.location_city,
    location_state: activity.location_state,
    location_country: activity.location_country,
    pr_count: activity.pr_count,
    has_heartrate: activity.has_heartrate,
    average_heartrate: activity.average_heartrate,
    max_heartrate: activity.max_heartrate,
    average_cadence: activity.average_cadence,
    perceived_exertion: null,
    userId: userId,
    full_data: false,
    custom_fields_calculated: false,
    hr_reserve: null,
    pace_reserve: null,
    hr_trimp: null,
    pace_trimp: null,
    hr_max_percentage: null,
    vo2max_estimate: {
      workout_vo2_max: null,
      vo2_max_percentage: null,
      estimated_vo2_max: null,
    },
    user_input: {
      include_in_vo2max_estimate: true,
      tags: [],
      notes: '',
    },
    streams: null,
  };
  return result;
}

export { cleanupDetailedActivity, cleanUpSummaryActivity };
