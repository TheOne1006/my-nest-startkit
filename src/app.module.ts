import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { SettingController } from './setting.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
      serveRoot: '/static',
    }),
  ],
  controllers: [AppController, SettingController],
  providers: [AppService],
})
export class AppModule { }
