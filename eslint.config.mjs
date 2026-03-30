import js from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
  js.configs.recommended,
  prettier,
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // Vì backend của bạn dùng require
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser
      }
    },
    rules: {
      // Bê nguyên cấu hình Prettier từ dự án công ty bạn vào đây
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          trailingComma: "none",
          arrowParens: "avoid",
          singleQuote: false,
          semi: true,
          tabWidth: 2,
          printWidth: 100
        }
      ],
      // Các rule quan trọng khác từ dự án của bạn
      "no-console": "off", // Ở dự án thật họ để "off" cho backend/graphql
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-param-reassign": ["error", { props: true }],
      "no-undef": "error"
    }
  }
];
