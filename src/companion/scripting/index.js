//var log = cli.log, api = cli.csapi.getAPIContext(), jspath = cli.jspath
//cli.generateEvents("CHE1", "CSLGO001", "2016-01-13T15:01:01T-0800", "2016-01-13T17:01:01-0800", 40);

import * as api from "data/csapi";
import * as jsp from "jspath";
import momentjs from "moment";

export const csapi = api;
export const jspath = jsp.apply;
export const moment = momentjs;

export function log(promise) {
    promise.then(x => console.log(x));
}


function randomTime(interval) {
  var newTime = moment(interval.start);
  newTime.add(randInt(interval.end.valueOf() - interval.start.valueOf()), "ms");
  return newTime;
}

function randInt(max) {
  return Math.floor((Math.random() * max) + 1);
}

export function generateTimes(start, end, n) {
  var interval = {
    start: moment(start),
    end: moment(end)
  };
  var times = [];
  for(var i = 0; i < n; i++) {
    times.push(randomTime(interval));
  }
  return times;
}

export function generateEvents(cheName, workerId, start, end, n) {
  generateTimes(start, end, n)
    .map( x => x.toISOString())
    .map( time => csapi.getAPIContext().createEvent(cheName, workerId, "COMPLETE", time));
}
