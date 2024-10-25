module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended"
    ],
    plugins: ["react", "prettier"],
    rules: {
        "prettier/prettier": "error"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};
