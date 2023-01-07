import posthog from "posthog-js";
const POSTHOG_ID = "REPLACE";
const nodeEnv = process.env.NODE_ENV;
export function init() {
  if (process.env.NODE_ENV !== "test") {
    posthog.init(POSTHOG_ID, {
      api_host: "https://app.posthog.com",
      persistence: "localStorage",
      capture_performance: true,
      cross_subdomain_cookie: false,
    });
  }
}
export function capture(name, data) {
  if (nodeEnv !== "test") {
    posthog.capture(name, data);
  }
}
