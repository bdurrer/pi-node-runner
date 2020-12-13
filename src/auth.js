const { createAppAuth } = require('@octokit/auth-app');
const fs = require('fs');
const log = require('fancy-log');

let privateKey = null;

/**
 * Creates a JWT token that we can use to talk to GitHub.
 *
 * @param githubConfig {Object}
 * @param installationId {string}
 * @returns {Promise<string>}
 */
async function createJWT(githubConfig, installationId) {
    if (!privateKey) {
        log.info('Loading GitHub key from', githubConfig.clientKeyFile);
        privateKey = fs.readFileSync(githubConfig.clientKeyFile, 'utf8');
    }
    const auth = createAppAuth({
        appId: githubConfig.appId,
        clientId: githubConfig.clientId,
        clientSecret: githubConfig.clientSecret,
        installationId,
        privateKey: privateKey,
    });

    try {
        const {token} = await auth({type: 'installation'});
        return token;
    } catch (e) {
        log.error('Failed to authenticate against GitHub', e);
    }
}

module.exports = createJWT;
