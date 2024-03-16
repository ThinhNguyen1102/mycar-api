import * as dotenv from 'dotenv'
import * as process from 'process'
import {DataSource} from 'typeorm'

dotenv.config()

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity.js'],
  migrations: ['./src/migrations/*.ts'],
  migrationsTableName: 'migrations',
})
