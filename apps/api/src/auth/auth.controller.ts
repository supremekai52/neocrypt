import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'farmer@demo.com' },
        password: { type: 'string', example: 'demo' },
      },
    },
  })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string', enum: ['FARMER', 'PROCESSOR', 'LAB', 'MANUFACTURER', 'REGULATOR', 'VIEWER'] },
        orgId: { type: 'string' },
      },
    },
  })
  async register(@Body(ValidationPipe) userData: {
    email: string;
    name: string;
    role: string;
    orgId: string;
  }) {
    return this.authService.register(userData);
  }
}