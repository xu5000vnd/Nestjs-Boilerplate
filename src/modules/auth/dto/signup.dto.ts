import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}
