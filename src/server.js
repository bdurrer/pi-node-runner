const express = require('express');
const log = require('fancy-log');
const https = require('https');
const fs = require('fs');

const { prettyPrintConstants } = require('./utils');
const githubRequest = require('./github-request');
const runTest = require('./test-runner');

async function performCheck(githubConfig, repo, installationId, sha) {
    log.info('Running check on', repo, sha);

    const { ok, failedTests } = await runTest(repo, sha);

    await githubRequest(githubConfig, `/repos/${repo}/check-runs`, installationId, 'POST', {
        name: 'performance',
        head_sha: sha,
        status: 'completed',
        conclusion: ok ? 'success' : 'failure',
        output: {
            title: ok ? 'Performance ok' : 'Performance dropped',
            summary: ok ? 'Performance did not significantly change' : `${failedTests} tests had a drop in performance. Check the details`,
        }
    });

    log.info('Finished check on ', repo, 'with', ok ? 'success' : 'failure');
}

function server(config) {
    const { server } = config;
    const app = express();
    app.use(express.json());

    app.get('/', function (req, res) {
        log.info('Root request received');
        res.json({
            hello: "World",
            date: new Date().toISOString()
        });
    })

    app.post('/webhook', function (req, res) {
        log.info('GitHub post received', req.body);

        if (!req.body) {
            res.json({ok: 0});
            return;
        }

        const data = req.body;
        const checkSuite = data.check_suite;
        if (checkSuite /*&& checkSuite.pull_requests && checkSuite.pull_requests.length*/) {
            const installationId = data.installation.id;
            const repo = data.repository.full_name;
            const sha = checkSuite.after;
            performCheck(config.github, repo, installationId, sha);
        }

        res.json({ok: 1}); // Doesn't matter, can be any response
    });

    log.info('Running server on the following configuration:');
    prettyPrintConstants(server, null, '  ');

    // we will pass our 'app' to 'https' server
    https.createServer({
        key: fs.readFileSync(server.sslKeyFile),
        cert: fs.readFileSync(server.sslCertFile),
    }, app)
        .listen(server.port);
}

module.exports = server;
