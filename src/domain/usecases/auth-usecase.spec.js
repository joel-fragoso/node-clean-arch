class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new Error()
    }
  }
}

const makeSut = () => {
  return new AuthUseCase()
}

describe('Auth UseCase', () => {
  test('Deve lançar um exceção se não for informado um e-mail', async () => {
    const sut = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow()
  })
})
