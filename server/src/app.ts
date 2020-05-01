import { Server } from './server';

new Server(require('./config.json'))
    .init()
    .start()
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
