/** @type {import("prettier").Config} */
const config = {
  useTabs: false,
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 110,
  plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
  tailwindStylesheet: "./src/routes/layout.css",
};

export default config;
