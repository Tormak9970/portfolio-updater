module.exports = {
    "packagerConfig": {
        "productName": "Portfolio Site Editor",
        "icon": "public/logo.ico",
        "extraResource": [
            "public/logo.ico"
        ]
    },
    "makers": [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "iconUrl": "https://cdn.jsdelivr.net/gh/tormak9970/portfolio-site-entry-editor/public/logo.ico",
                "setupIcon": "public/logo.ico"
            }
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {}
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ]
}