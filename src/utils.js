const log = require('fancy-log');

function prettyPrintConstants(settings, parent = null, indent = '') {
    Object.entries(settings).forEach(([key, value]) => {
        if (value != null && typeof value === 'object') {
            log.info(`${indent}${key}:`);
            prettyPrintConstants(value, key, `${indent}  `);
        } else {
            log.info(`${indent}${key}: ${value}`);
        }
    });
}

module.exports = {
    prettyPrintConstants,
};