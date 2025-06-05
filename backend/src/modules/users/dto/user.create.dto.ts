import { IsNotEmpty } from 'class-validator';
export class UserCreateDto {
  username: string;

  @IsNotEmpty()
  email: string;

  password: string;
}
