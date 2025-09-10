#!/usr/bin/env node
require('nocamel');
const Logger = require('logplease');
const express = require('express');
const expressWs = require('express-ws');
const globals = require('./globals');
const config = require('./config');
const path = require('path');
const fs = require('fs/promises');
const fss = require('fs');
const body_parser = require('body-parser');
const runtime = require('./runtime');
const responseHandler = require('./helper');

const logger = Logger.create('index');
const app = express();
expressWs(app);

(async () => {
    Logger.setLogLevel(config.log_level);

    logger.info('Sync packages....');

    await syncPackages();

    logger.info('Starting API Server ');

    app.use(body_parser.urlencoded({ extended: true }));
    app.use(body_parser.json());
    app.use(responseHandler);

    app.use((err, req, res, next) => {
        return res.status(400).send({
            stack: err.stack
        });
    });

    const api_v2 = require('./api/v2');

    app.use('/api/v2', api_v2);

    app.get('/', (req, res, next) => {
        return res.success('OK', "Hello !");
    });


    const [address, port] = config.bind_address.split(':');

    const server = app.listen(port, address, () => {
        logger.info('API server started on', config.bind_address);
    });

    process.on('SIGTERM', () => {
        server.close();
        process.exit(0);
    });
})();

async function syncPackages() {
    Object.values(globals.data_directories).for_each(dir => {
        let data_path = path.join(config.data_directory, dir);

        logger.info(`Ensuring ${data_path} exists`);

        if (!fss.exists_sync(data_path)) {
            logger.info(`${data_path} does not exist.. Creating..`);

            try {
                fss.mkdir_sync(data_path);
            } catch (e) {
                logger.error(`Failed to create ${data_path}: `, e.message);
            }
        }
    });

    const pkgdir = path.join(
        config.data_directory,
        globals.data_directories.packages
    );

    const pkglist = await fs.readdir(pkgdir);

    const languages = await Promise.all(
        pkglist.map(lang => {
            return fs.readdir(path.join(pkgdir, lang)).then(x => {
                return x.map(y => path.join(pkgdir, lang, y));
            });
        })
    );

    const installed_languages = languages
        .flat()
        .filter(pkg =>
            fss.exists_sync(path.join(pkg, globals.pkg_installed_file))
        );

    installed_languages.for_each(pkg => runtime.load_package(pkg));
}