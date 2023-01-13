import { capture, init as initPosthog } from "./posthog";
const COMMIT_ID = "REPLACE";
function getCurrentTime() {
  return Date.now();
}
export function init() {
  initPosthog({ commit_id: COMMIT_ID, appStartTime: getCurrentTime() });
}
export function event(name, data) {
  capture(name, data);
}
export function dataLoad(name, time, data = {}) {
  event(name, { kind: "load time", time, ...data });
}
export function startDataLoadingForPromise(name, data) {
  const startTime = getCurrentTime();
  return (promiseResult) => {
    dataLoad(name, getCurrentTime() - startTime, data);
    return promiseResult;
  };
}
