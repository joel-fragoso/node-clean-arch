module.exports = class InvalidParamError extends Error {
  constructor(paramName) {
    super(`o paramêtro ${paramName} é inválido`)
    this.name = 'InvalidParamError'
  }
}
