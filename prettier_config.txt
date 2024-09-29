# PRETTIER GUIDE

To use **Prettier** correctly (if you don't know what Prettier is, it's a module that formats your code, so everyone has the same formatting style as you), you need to follow these steps:

1. **Install the Prettier module**  
   On VSCode, press `CTRL` / `CMD` + `SHIFT` + `X` and search for **"Prettier - Code formatter"**.

2. **Install the ESLint module**  
   On VSCode, press `CTRL` / `CMD` + `SHIFT` + `X` and search for **"ESLint"**.

3. **Configure Prettier**  
   To do this, press `CTRL` / `CMD` + `SHIFT` + `P` and type **"Open User Settings JSON"**. Be careful to choose **JSON**!

4. **Paste the following configuration into the JSON file**:

    ```json
    {
        "editor.defaultFormatter":
"esbenp.prettier-vscode",
        "prettier.requireConfig": true,
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": "always",
            "source.organizeImports": "always"
        }
    }
    ```

