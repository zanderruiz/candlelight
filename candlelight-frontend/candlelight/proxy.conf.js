const API_URL = require("./env");

const PROXY_CONFIG = {
    "/api/**": {
        "target": "http://" + API_URL,
        "secure": false,
        "changeOrigin": false,
        "pathRewrite": {
            "^/api": ""
        }
    }
}

module.exports = PROXY_CONFIG;
