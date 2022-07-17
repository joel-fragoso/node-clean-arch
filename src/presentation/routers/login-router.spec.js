class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
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
})
