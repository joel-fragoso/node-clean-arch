module.exports = class MissingParamError extends Error {
  constructor(paramName) {
    super(`o paramêtro ${paramName} está faltando`)
    this.name = 'MissingParamError'
  }
}
