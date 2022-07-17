module.exports = class ServerError extends Error {
  constructor(paramName) {
    super('Erro no servidor')
    this.name = 'ServerError'
  }
}
