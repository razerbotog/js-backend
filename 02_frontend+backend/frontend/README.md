Access to XMLHttpRequest at 'http://localhost:3000/jokes' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
ChatGPT
The error you're encountering is due to the Same-Origin Policy enforced by web browsers, which restricts web pages from making requests to a different domain than the one that served the web page. This is commonly known as the CORS (Cross-Origin Resource Sharing) policy.

To resolve this issue, you can take the following steps:
1. By using npm cors
2. By using proxy
    a. In a Vite project, you can use the proxy option in the `vite.config.js
    b. 

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
