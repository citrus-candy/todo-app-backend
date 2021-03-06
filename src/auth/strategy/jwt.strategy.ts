// import先が'passport-local'では無い事に注意！
import { ExtractJwt, Strategy as BaseJwtStrategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// import { JwtPayload } from './auth.interface';
import { User } from 'src/entities/user.entity';

// JwtについているPayload情報の型
interface JWTPayload {
  id: User['id'];
  name: User['name'];
}

/**
 * @description JWTの認証処理を行うクラス
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(BaseJwtStrategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // Authorization bearerからトークンを読み込む関数を返す
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 有効期間を無視するかどうか
      ignoreExpiration: false,
      // envファイルから秘密鍵を渡す
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  /**
   * @description Payloadを使ったバリデーション処理
   * @param {JWTPayload} payload AuthService.login()で定義した値
   * @returns {Promise<JWTPayload>} JWTPayload
   */
  async validate(payload: JWTPayload): Promise<JWTPayload> {
    return { id: payload.id, name: payload.name };
  }
}
