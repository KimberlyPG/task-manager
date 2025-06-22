module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["functions/tsconfig.json", "functions/tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: ["functions/lib/**/*", "/generated/**/*"],
  plugins: ["@typescript-eslint", "import", "prettier"],
  rules: {
    "prettier/prettier": "error",
    capIsNew: 0,
    "new-cap": [
      "error",
      {
        capIsNewExceptions: ["Router"],
      },
    ],
    quotes: ["error", "double"],
    "import/no-unresolved": 0,
    indent: ["error", 2],
    "require-jsdoc": "off",
    "object-curly-spacing": ["error", "always"],
    "linebreak-style": 0,
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};
