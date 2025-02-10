import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController, SeedController } from './controllers';
import { allDatabaseEntities, DalModule } from './modules/dal';

@Module({
  imports: [
    // Connect to database.
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'mariadb',
          host: 'localhost',
          port: 3306,
          database: 'api',
          username: 'api',
          password: 'guest1234',
          charset: 'utf8mb4',
          entities: allDatabaseEntities,
          // Auto-synchronizes database scheme with entities
          synchronize: true,
          logNotifications: true,
          cache: true,
        };
      },
    }),

    DalModule,
  ],
  controllers: [PatientsController, SeedController],
  providers: [],
})
export class AppModule {}
