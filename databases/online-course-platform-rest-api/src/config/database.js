const { Sequelize } = require('sequelize');

const { Client } = require('pg');

const env = require('./env');


const sequelize = new Sequelize (
    env.name, env.user, env.password, {
        host: env.host,

        port: env.db_port,

        dialect: env.dialect,

        logging: false,

        define: { timestamps: true },
        
        pool: {
            max: 5,

            min: 0,

            acquire: 30000,

            idle: 10000
        }
    }
);



const ensureDatabaseExists = async () => {
    const client = new Client ({
        host: env.host,

        port: env.db_port,

        user: env.user,

        password: env.password,

        database: 'postgres',
 
    });

    try {
        await client.connect();

        const result = await client.query( 'SELECT 1 FROM pg_database WHERE datname = $1', [env.name] );

        if (result.rowCount === 0) {
            await client.query(`CREATE DATABASE "${env.name}"`);
            
            console.log(`Database "${env.name}" created`);
        } 
        
        else {
            console.log(`Database "${env.name}" already exists`);
        }
    }

    finally {
        await client.end();
    }
};


module.exports = { sequelize, ensureDatabaseExists, };