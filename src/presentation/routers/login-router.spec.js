class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || ! httpRequest.body) {
      return {
        statusCode: 500
      }
    }
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
  }
}

describe('Rota Login', () => {
  test('Deve retornar 400 se não for informado um e-mail', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'secret'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Deve retornar 400 se não for informado uma senha', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'johndoe@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Deve retornar 500 se não for informado um httpRequest', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Deve retornar 500 se não for informado um corpo para a requisição', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })
})
