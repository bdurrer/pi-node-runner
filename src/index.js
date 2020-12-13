// load the .env file
require('dotenv').config();
const path = require('path');
const server = require('./server');

const projectDir = path.normalize(path.join(__dirname, '..'));

function projectPath(part) {
    return path.normalize(path.join(projectDir, part));
}

const config = {
    github: {
        eventSecret: process.env.GH_SECRET,
        clientSecret: process.env.GH_CLIENT_SECRET,
        clientId: process.env.CLIENT_ID,
        appId: process.env.APP_ID,
        clientKeyFile: projectPath(process.env.GH_KEY_FILE),
    },
    server: {
        port: process.env.SERVER_PORT,
        url: process.env.SERVER_URL,
        sslCertFile: projectPath(process.env.SERVER_SSL_CERT_FILE || 'config/server_cert.pem'),
        sslKeyFile: projectPath(process.env.SERVER_SSL_KEY_FILE || 'config/server_key.pem'),
    },
    projectDir,
};

server(config);