module.exports = class UnauthorizedError extends Error {
  constructor(paramName) {
    super('Você não tem autorização')
    this.name = 'UnauthorizedError'
  }
}
