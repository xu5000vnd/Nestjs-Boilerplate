import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @Length(10)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string
}
