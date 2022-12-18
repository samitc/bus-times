import MobileDetect from "mobile-detect";
import { event } from "../services/events";

const md = new MobileDetect(window.navigator.userAgent);

export function isMobile() {
  return md.mobile();
}

event("client", { mobile: isMobile() });
