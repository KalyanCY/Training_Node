// Env containers 

var environments = {};

environments.staging = {
    'port' : 3000,
    'securePort' : 3502,
    'envName' : 'staging'
};

environments.prod = {
    'port' : 4000,
    'securePort' : 4002,
    'envName' : 'prod'
};

var currentEnv = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

var envToExport = typeof (environments[currentEnv]) === 'object' ? environments[currentEnv] : environments.staging;

module.exports = envToExport;

