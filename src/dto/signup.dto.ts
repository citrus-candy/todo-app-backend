import { User } from '../model/user.model';
import { ApiProperty } from '@nestjs/swagger';

export class PostSignupRequest {
  @ApiProperty({ type: String })
  name: User['name'];

  @ApiProperty({ type: String })
  password: User['password'];
}