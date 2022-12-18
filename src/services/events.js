import posthog from "posthog-js";
const nodeEnv = process.env.NODE_ENV;
function getCurrentTime() {
  return Date.now();
}
export function event(name, data) {
  if (nodeEnv !== "test") {
    posthog.capture(name, data);
  }
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
