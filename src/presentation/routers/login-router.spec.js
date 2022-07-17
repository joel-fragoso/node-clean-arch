const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')

const makeSut= () => {
  return new LoginRouter()
}

describe('Rota Login', () => {
  test('Deve retornar 400 se não for informado um e-mail', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        password: 'secret'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Deve retornar 400 se não for informado uma senha', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: 'johndoe@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Deve retornar 500 se não for informado um httpRequest', () => {
    const sut = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Deve retornar 500 se não for informado um corpo para a requisição', () => {
    const sut = makeSut()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })
})
