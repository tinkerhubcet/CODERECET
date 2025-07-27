import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores([
        "**/*.next",
        "dist/**",
        "apps/**/eslint.config.mjs",
        "apps/**/postcss.config.mjs",
        "**/*.config.mjs",
    ]),
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
    },
]);
