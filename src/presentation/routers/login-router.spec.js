const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')
const ServerError = require('../helpers/server-error')

const makeSut= () => {
  const authUseCaseSpy = makeAuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'accessToken'
  const sut = new LoginRouter(authUseCaseSpy)
  return {
    sut,
    authUseCaseSpy
  }
}

const makeAuthUseCaseSpy = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  return new AuthUseCaseSpy()
}

const makeAuthUseCaseSpyWithError = () => {
  class AuthUseCaseSpy {
    auth () {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('Deve retornar 400 se não for informado um e-mail', () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se não for informado um corpo para a requisição', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve chamar o AuthUseCase com os paramêtros corretos', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Deve retornar 401 se as credênciais que foram informadas forem inválidas', () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid@email.com',
        password: 'invalid'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Deve retornar 200 se as credênciais forem válidas', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('Deve retornar 500 se o AuthUseCase não for informado', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se o AuthUseCase não tiver o método auth', () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se o AuthUseCase lançar uma exceção', () => {
    const authUseCaseSpy = makeAuthUseCaseSpyWithError()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
