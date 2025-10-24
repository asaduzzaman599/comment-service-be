import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(process.cwd(), '.env')})

export default {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  JWT_SECRET_ACCESS: process.env.JWT_SECRET_ACCESS,
  JWT_SECRET_EXPIRY: process.env.JWT_SECRET_EXPIRY,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
};