const log = require('fancy-log');

async function run() {
    log.warn('TODO checkout project');
    log.warn('TODO run tests');
    log.warn('TODO compare test results with main branch results');

    return {
        ok: true,
        failedTests: 0,
    };
}

module.exports = run;