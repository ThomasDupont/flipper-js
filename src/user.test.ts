import { User } from './user'

describe('User class', () => {
  beforeEach(() => {
    User.deleteUsers()
  })

  it('should return true for correct password', async () => {
    const login = 'testUser'
    const password = 'testPassword'

    await User.addUser(login, password)
    const result = await User.checkPassword(login, password)
    expect(result).toBe(true)
  })

  it('should return false for incorrect password', async () => {
    const login = 'testUser'
    const password = 'testPassword'
    const wrongPassword = 'wrongPassword'

    await User.addUser(login, password)
    const result = await User.checkPassword(login, wrongPassword)
    expect(result).toBe(false)
  })

  it('should return false for non-existing user', async () => {
    const login = 'nonExistingUser'
    const password = 'testPassword'

    const result = await User.checkPassword(login, password)
    expect(result).toBe(false)
  })
})
