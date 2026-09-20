/**
 * Run webpack/webpack-cli with an OpenSSL legacy provider on Node 17+,
 * where webpack 5's default hash hits ERR_OSSL_EVP_UNSUPPORTED.
 * Node 16 rejects that flag in NODE_OPTIONS, so we never set it there.
 */
const { spawnSync } = require('child_process');

const major = Number(process.versions.node.split('.')[0]);
const nodeArgs = major >= 17 ? ['--openssl-legacy-provider'] : [];
const webpackCli = require.resolve('webpack-cli/bin/cli.js');

const result = spawnSync(
    process.execPath,
    [...nodeArgs, webpackCli, ...process.argv.slice(2)],
    { stdio: 'inherit', env: process.env }
);

process.exit(result.status === null ? 1 : result.status);
