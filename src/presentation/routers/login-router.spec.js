const LoginRouter = require('./login-router')
const InvalidParamError = require('../helpers/invalid-param-error')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')
const ServerError = require('../helpers/server-error')

const makeSut= () => {
  const authUseCaseSpy = makeAuthUseCaseSpy()
  const emailValidatorSpy = makeEmailValidatorSpy()
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}

const makeAuthUseCaseSpy = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'accessToken'
  return authUseCaseSpy
}

const makeAuthUseCaseSpyWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

const makeEmailValidatorSpy = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeEmailValidatorSpyWithError = () => {
  class EmailValidatorSpy {
    isValid () {
      throw new Error()
    }
  }
  return new EmailValidatorSpy()
}

describe('Login Router', () => {
  test('Deve retornar 400 se não for informado um e-mail', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'secret'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Deve retornar 400 se não for informado uma senha', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'johndoe@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Deve retornar 500 se não for informado um httpRequest', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se não for informado um corpo para a requisição', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve chamar o AuthUseCase com os paramêtros corretos', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Deve retornar 401 se as credênciais que foram informadas forem inválidas', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid@email.com',
        password: 'invalid'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Deve retornar 200 se as credênciais forem válidas', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('Deve retornar 500 se o AuthUseCase não for informado', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se o AuthUseCase não tiver o método auth', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se o AuthUseCase lançar uma exceção', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpyWithError()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 400 se não for informado um e-mail válido', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid@email.com',
        password: 'secret'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Deve retornar 500 se o EmailValidator não for informado', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se o EmailValidator não tiver o método isValid', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy()
    const sut = new LoginRouter(authUseCaseSpy, {})
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se o EmailValidator lançar uma exceção', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy()
    const emailValidator = makeEmailValidatorSpyWithError()
    const sut = new LoginRouter(authUseCaseSpy, emailValidator)
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve chamar o EmailValidator com o e-mail correto', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'secret'
      }
    }
    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
