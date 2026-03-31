import js from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
  js.configs.recommended,
  prettier,
  {
    // ==========================================
    // 1. CẤU HÌNH CHUNG (Áp dụng cả BE & FE)
    // ==========================================
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest"
    },
    rules: {
      camelcase: ["error", { properties: "always" }],
      // Mang từ cty: Cấm gán lại tham số (tránh side-effect), ngoại trừ biến dạng memo, keep
      "no-param-reassign": [
        "error",
        {
          props: true,
          ignorePropertyModificationsForRegex: ["^memo", "^keep", "^remember"]
        }
      ],
      // Mang từ cty (GraphQL): Tắt ép buộc kiểu viết arrow function để code thoải mái hơn
      "arrow-body-style": "off",
      // Cấu hình Prettier gắt gao như bạn yêu cầu ở trước
      "prettier/prettier": "error",
      "no-multi-spaces": "error",
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }]
    }
  },
  {
    // ==========================================
    // 2. CẤU HÌNH RIÊNG CHO BACKEND (Trí Nhân)
    // ==========================================
    files: ["modules/backend/**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: { ...globals.node }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_ignored", varsIgnorePattern: "^_ignored" }
      ],
      // Backend cần in log ra Terminal nên tắt hoặc cảnh báo nhẹ
      "no-console": "off"
    }
  },
  {
    // ==========================================
    // 3. CẤU HÌNH RIÊNG CHO FRONTEND UI (Minh Nhật)
    // ==========================================
    files: ["modules/ui/**/*.{js,jsx}"],
    languageOptions: {
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Mang từ cty: Frontend cấm để lọt console.log lên Production
      "no-console": "error",
      // Mang từ cty: Ép Frontend import lodash từng hàm nhỏ để tối ưu dung lượng (Bundle size)
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message:
                "Vui lòng import trực tiếp hàm cần dùng, VD: import keyBy from 'lodash/keyBy', không import từ 'lodash'."
            }
          ]
        }
      ]
    }
  }
];
