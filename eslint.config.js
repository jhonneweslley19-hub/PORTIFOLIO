import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/", "test-results/", "playwright-report/", "_site/"] },
  js.configs.recommended,
  {
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { ...globals.browser } },
    rules: { "no-empty": ["error", { allowEmptyCatch: true }] },
  },
  { files: ["sw.js"], languageOptions: { globals: { ...globals.serviceworker } } },
  { files: ["scripts/**", "tests/**", "*.config.js"], languageOptions: { globals: { ...globals.node } } },
];
