
export function getWorkerPickChart({workerPickChart}) {
  return workerPickChart;
}

// TODO delete after rebase again master and use it from Mobile/asMutable
export function asMutable(f) {
  return (...a) => f(...a).toObject();
}

export const getWorkerPickChartMutable = asMutable(getWorkerPickChart);