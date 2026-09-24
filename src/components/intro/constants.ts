/** sessionStorage key: the intro plays once per browser session */
export const INTRO_STORAGE_KEY = "tezpi-intro-seen";

/** Seconds after the curtain starts lifting when each piece of chrome enters */
export const INTRO_CUES = {
  toolbar: 0.25,
  hero: 0.35,
  tabBar: 0.55,
} as const;
