import { capture } from "./posthog";
function getCurrentTime() {
  return Date.now();
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
