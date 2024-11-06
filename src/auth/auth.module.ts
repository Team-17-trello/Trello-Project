import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport';
import {JwtStrategy} from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports:[
    PassportModule.register({defaultStrategy:'jwt', session:false}),
    JwtModule.registerAsync({
      useFactory: (config:ConfigService) =>({
        secret: config.get<string>("JWT_SECRET_KEY"),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User])

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
