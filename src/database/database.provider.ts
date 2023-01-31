import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const databaseProviders = [
  {
    inject: [ConfigService],
    provide: 'CONNECTION',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: configService.get('DB_TYPE'),
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: false, // 절대 건드리면 안됨
        logging: ['query', 'error'],
        poolSize: +configService.get('DB_CONNECTION_LIMIT'),
        timezone: configService.get('DB_TIMEZONE'),
      } as MysqlConnectionOptions);

      return dataSource.initialize();
    },
  },
];
