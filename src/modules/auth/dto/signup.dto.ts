import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}
