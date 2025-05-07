import js from "@eslint/js";
import importPlugin from "eslint-plugin-import"; // Added import plugin
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin, // Added import plugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "no-unused-vars": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Added import order rules
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // Node.js built-in modules (fs, path, etc.)
            "external", // npm packages
            "internal", // internal aliases
            "parent", // parent directory imports
            "sibling", // same directory imports
            "index", // index file imports
            "object", // object imports
            "type", // type imports
          ],
          "newlines-between": "always", // Adds a newline between groups
          alphabetize: {
            order: "asc", // Sort imports alphabetically within groups
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": "error", // Requires newline after import section
      "import/no-duplicates": "error", // Prevents duplicate imports
    },
  },
];
