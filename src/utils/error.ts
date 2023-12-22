export class CustomError extends Error {
  constructor(errType, errMsg) {
    super(errMsg)
    this.name = errType
  }
}