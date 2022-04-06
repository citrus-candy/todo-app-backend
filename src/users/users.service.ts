import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import { User } from '../entities/user.entity'; // typeormで定義したUserエンティティ

type IdOmitUser = Omit<User, 'id'>;

/**
 * @description User情報を扱うクラス
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * @description パスワードをハッシュ化する
   * @param {string} _password パスワード
   * @returns {string} ハッシュ化したパスワード
   */
  private getPasswordHash(_password: string): string {
    const saltRounds = 10;
    const salt: string = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(_password, salt);
  }

  /**
   * @description 新規登録
   * @param {IdOmitUser} idOmitUser ユーザー情報
   * @returns {Promise<string>} メッセージ
   */
  async signup(idOmitUser: IdOmitUser): Promise<string> {
    const { name, password } = idOmitUser;
    const dbUser = await this.findOne(name); // DBからUserを取得
    if (!dbUser) {
      return new Promise((resolve, reject) => {
        // UUIDでユーザーIDを生成
        const uuid: string = uuidV4();

        // パスワードをハッシュ化
        const hashPassword: string = this.getPasswordHash(password);

        const user: User = { id: uuid, name, password: hashPassword };

        // ユーザ情報を設定する
        this.userRepository
          .save<User>(user)
          .then(() => {
            resolve('Successfully signup!');
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    } else {
      return 'The name is already in use.';
    }
  }

  /**
   * @description ユーザーを一人を返す
   * @param {string} name ユーザー名
   * @returns {Promise<User | undefined>} ユーザー情報 or undefined
   */
  findOne(name: User['name']): Promise<User | undefined> {
    // typeormからDBにアクセスして、ユーザーを取得する
    return this.userRepository.findOne({ where: { name } });
  }
}
