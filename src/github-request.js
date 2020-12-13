const createJWT = require('./auth');
const { request } = require("@octokit/request");

/**
 * Performs a request against the GitHub API.
 * https://docs.github.com/en/free-pro-team@latest/rest
 *
 * @param githubConfig {object}
 * @param path {string}
 * @param installationId {string}
 * @param method {"GET"|"POST"|"PUT"|"HEAD"}
 * @param data {any}
 * @returns {Promise<any>}
 */
async function githubRequest(githubConfig, path, installationId, method, data) {
    const token = await createJWT(githubConfig, installationId);

    if (!method) {
        method = 'GET';
    } else {
        method = method.toUpperCase();
    }

    const result = await request({
        method,
        url: path,
        data,
        headers: {
            authorization: `bearer ${token}`,
        },
    });
    return result.data;
}

module.exports = githubRequest;