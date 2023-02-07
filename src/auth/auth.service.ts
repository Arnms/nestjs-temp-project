import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { TokenType } from './interfaces/tokenType';
import _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({
      where: {
        email,
        password,
      },
    });

    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      id: user.id,
      provider: user.provider,
      email: user.email,
      name: user.name,
      permission: user.permission,
    };
    return {
      access_token: await this.generateToken('access', user.id, payload),
      refresh_token:
        user.refreshToken &&
        (await this.verifyToken('refresh', user.refreshToken, user.id))
          ? user.refreshToken
          : await this.generateToken('refresh', user.id, {}),
    };
  }

  private async generateToken(
    tokenType: TokenType,
    userId: number,
    payload: any,
  ) {
    const token = this.jwtService.sign(payload, {
      subject: String(userId),
      audience: `${this.configService.get('ISSUER')}_${userId}`,
      issuer: this.configService.get('ISSUER'),
      expiresIn:
        tokenType === 'access'
          ? this.configService.get('ACCESS_TOKEN_EXPIRES')
          : this.configService.get('REFRESH_TOKEN_EXPIRES'),
      secret:
        tokenType === 'access'
          ? this.configService.get('ACCESS_TOKEN_SECRET')
          : this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    if (tokenType === 'refresh') {
      await this.userService.update(
        {
          id: userId,
        },
        {
          refreshToken: token,
        },
      );
    }

    return token;
  }

  async refreshToken(
    userId: string,
    accessToken: string,
    refreshToken: string,
  ) {
    const user = await this.userService.findOne({
      where: {
        id: userId,
        refreshToken,
      },
    });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const accessTokenDecode = await this.verifyToken(
      'access',
      accessToken,
      +userId,
    );
    const refreshTokenDecode = await this.verifyToken(
      'refresh',
      refreshToken,
      +userId,
    );

    const tokens = {
      accessToken: accessTokenDecode ? accessToken : null,
      refreshToken: refreshTokenDecode ? refreshToken : null,
    };

    if (!accessTokenDecode) {
      const t = this.generateToken('access', +userId, {
        id: user.id,
        provider: user.provider,
        email: user.email,
        name: user.name,
        permission: user.permission,
      });
      _.set(tokens, 'accessToken', t);
    }

    if (!refreshTokenDecode) {
      const t = this.generateToken('refresh', +userId, {});
      _.set(tokens, 'refreshToken', t);
    }
  }

  private async verifyToken(
    tokenType: TokenType,
    token: string,
    userId: number,
  ) {
    try {
      const verify = this.jwtService.verify(token, {
        subject: userId.toString(),
        audience: `${this.configService.get('ISSUER')}_${userId}`,
        issuer: this.configService.get('ISSUER'),
        secret:
          tokenType === 'access'
            ? this.configService.get('ACCESS_TOKEN_SECRET')
            : this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      return verify;
    } catch (e) {
      if (e.message === 'EXPIRED_TOKEN') {
        return null;
      } else {
        throw new HttpException('유효하지 않은 토큰입니다.', 401);
      }
    }
  }
}
