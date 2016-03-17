import {asMutable} from "pages/asMutable";

export function getDailyMetrics({dailyMetrics}) {
  return dailyMetrics;
}

export const getDailyMetricsMutable = asMutable(getDailyMetrics);
