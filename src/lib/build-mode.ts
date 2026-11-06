/** True for a production build outside CI (e.g. Workers Builds); CI, dev and tests keep lenient defaults. */
export const isProdNonCiBuild: boolean =
  typeof process !== "undefined" && process.env.NODE_ENV === "production" && !process.env.CI;
