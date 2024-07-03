/* eslint-disable @typescript-eslint/no-extraneous-class */
import bcrypt from 'bcryptjs'
import { type UserMapping } from './@types/flipper.type'

export class User {
  private static readonly users: UserMapping[] = []

  static async addUser (login: string, password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(password, salt)

    User.users.push({ login, password: secPass })
  }

  static async checkPassword (login: string, password: string): Promise<boolean> {
    const user = User.users.find((user) => user.login === login)

    if (user == null) {
      return false
    }
    const passwordCompare = await bcrypt.compare(password, user.password)

    return passwordCompare
  }

  static deleteUsers (): void {
    User.users.splice(0, User.users.length)
  }
}
