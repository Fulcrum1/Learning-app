// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import jwtConfig from '../config/jwt.config';
// import { Inject } from '@nestjs/common';
// import * as config from '@nestjs/config';
// import { AuthJwtPayload } from '../types/auth-jwtPayload.d';
// import { AuthService } from '../auth.service';

// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @Inject(jwtConfig.KEY)
//     private jwtConfiguration: config.ConfigType<typeof jwtConfig>,
//     private authService: AuthService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: jwtConfiguration.secret as string,
//       ignoreExpiration: false,
//     });
//   }

//   validate(payload: AuthJwtPayload) {
//     const userId = payload.sub;
//     return this.authService.validateJwtUser(userId);
//   }
// }

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { Inject } from '@nestjs/common';
import * as config from '@nestjs/config';
import { AuthJwtPayload } from '../types/auth-jwtPayload.d';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: config.ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret as string,
      ignoreExpiration: false,
    });

    this.logger.log('JwtStrategy initialized');
    this.logger.log(
      `Secret: ${jwtConfiguration.secret ? '✅ Configured' : '❌ Missing'}`,
    );
  }

  async validate(payload: AuthJwtPayload) {
    this.logger.log(
      '✅ Validate called with payload: ' + JSON.stringify(payload),
    );

    // Utilisez l'email pour trouver l'utilisateur
    const user = await this.authService.validateJwtUser(payload.sub);

    this.logger.log(`User found: ${user ? '✅ Yes' : '❌ No'}`);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
