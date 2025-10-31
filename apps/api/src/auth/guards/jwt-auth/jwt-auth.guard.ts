import { Injectable, Logger, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('🔒 JwtAuthGuard called');
    const request = context.switchToHttp().getRequest();
    this.logger.log(`Authorization header: ${request.headers.authorization || '❌ Missing'}`);
    
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    this.logger.log(`HandleRequest - Error: ${err}, User: ${user ? '✅' : '❌'}, Info: ${info}`);
    
    if (err || !user) {
      this.logger.error(`Authentication failed: ${info || err}`);
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}