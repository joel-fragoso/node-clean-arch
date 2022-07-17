const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('Deve retornar verdadeiro se o Validator retornar verdadeiro', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('johndoe@email.com')
    expect(isEmailValid).toBe(true)
  })

  test('Deve retornar falso se o Validator retornar falso', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid@email.com')
    expect(isEmailValid).toBe(false)
  })

  test('Deve chamar o Validator com um e-mail correto', () => {
    const sut = makeSut()
    sut.isValid('johndoe@email.com')
    expect(validator.email).toBe('johndoe@email.com')
  })
})
