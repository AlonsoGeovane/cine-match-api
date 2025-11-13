import { createApp } from './app.js';
import { database } from './config/database.js';
import { env } from './config/env.js';

import "./models/index.js"

const connectDatabase = async () => {
    try {
        await database.authenticate();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Error connecting to the database:', error);
        process.exit(1);
    }
};

const bootstrap = async () => {
    await connectDatabase();

    const app = createApp();

    app.listen(env.port, () => {
        console.log(`🚀 HTTP Server running on port: ${env.port}`);
    });
};

bootstrap();