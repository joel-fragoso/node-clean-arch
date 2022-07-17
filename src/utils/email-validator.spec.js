class EmailValidator {
  isValid (email) {
    return true
  }
}

describe('Email Validator', () => {
  test('Deve retornar verdadeiro se o Validator retornar verdadeiro', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('johndoe@email.com')
    expect(isEmailValid).toBe(true)
  })
})
