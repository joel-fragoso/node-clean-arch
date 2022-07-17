const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  test('Deve retornar verdadeiro se o Validator retornar verdadeiro', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('johndoe@email.com')
    expect(isEmailValid).toBe(true)
  })

  test('Deve retornar falso se o Validator retornar falso', () => {
    validator.isEmailValid = false
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('invalid@email.com')
    expect(isEmailValid).toBe(false)
  })
})
