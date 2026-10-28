require('dotenv').config();

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_DIALECT', 'JWT_SECRET'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required env variable: ${key}`);

    process.exit(1);
  }
});

module.exports = {
    port: Number(process.env.PORT),

    host: process.env.DB_HOST,
    
    db_port: Number(process.env.DB_PORT),

    name: process.env.DB_NAME,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    dialect: process.env.DB_DIALECT,

    jwt_secret: process.env.JWT_SECRET,

    jwt_expires_in: process.env.JWT_EXPIRES_IN
};