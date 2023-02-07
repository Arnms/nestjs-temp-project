import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { Request } from 'express';
import { User } from 'src/modules/user/entities/user.entity';
import { RefreshAuthGuard } from 'src/common/guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    const userId = req.user['sub'];
    const accessToken = req.user['accessToken'];
    const refreshToken = req.user['refreshToken'];

    return await this.authService.refreshToken(
      userId,
      accessToken,
      refreshToken,
    );
  }
}
