import * as bcrypt from 'bcrypt'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = 10
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isPasswordMatch = await bcrypt.compare(password, hashedPassword)
  return isPasswordMatch
}
