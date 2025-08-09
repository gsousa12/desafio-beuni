/* eslint-env node */
module.exports = {
    root: true,
    env: { node: true, es2022: true },
    parser: "@typescript-eslint/parser",
    parserOptions: { ecmaVersion: "latest", sourceType: "module", project: false },
    plugins: ["@typescript-eslint", "import", "promise", "n"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
      "plugin:n/recommended",
      "plugin:promise/recommended",
      "prettier"
    ],
    settings: {
      "import/resolver": {
        typescript: true,
        node: true
      }
    },
    ignorePatterns: [
      "node_modules",
      "dist",
      ".build",
      "build",
      "*.config.cjs",
      "*.config.js"
    ],
    rules: {
      "import/no-unresolved": "off"
    },
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        parser: "@typescript-eslint/parser",
        plugins: ["@typescript-eslint"]
      }
    ]
  }