import { Strategy as BaseLocalStrategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { User } from '../../entities/user.entity';

import { PasswordOmitUser } from '../@types/auth.types';

/**
 * @description nameとpasswordを使った認証処理を行うクラス
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(BaseLocalStrategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'name',
      passwordField: 'password',
    });
  }

  // passport-localは、デフォルトで name と password をパラメーターで受け取る

  /**
   * @description name と passwordを使ったバリデーション処理
   * @param {string} name ユーザー名
   * @param {string} password パスワード
   * @returns {Promise<PasswordOmitUser>} 認証結果のユーザー情報
   */
  async validate(
    name: User['name'],
    password: User['password'],
  ): Promise<PasswordOmitUser> {
    // 認証して結果を受け取る
    const user = await this.authService.validateUser(name, password);

    if (!user) {
      // 認証失敗
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Wrong username or password.',
      });
    }

    return user;
  }
}
