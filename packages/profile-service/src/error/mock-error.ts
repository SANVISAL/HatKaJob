import { SerializedErrorOutput } from "./@types/serialized-error-output";
import BaseCustomError from "./base-custom-error";

export default class MockCustomError extends BaseCustomError {
  constructor(message: string, statuscode: number) {
    super (message, statuscode)
    Object.setPrototypeOf(this, MockCustomError.prototype);
  }
  getStatusCode(): number {
      return this.statusCode;
  }
  serializeErrorOutput(): SerializedErrorOutput {
      return {
        errors: [{message:this.message}],
      }
  }
}
