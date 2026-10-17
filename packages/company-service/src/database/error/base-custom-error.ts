// import { error } from "console";
import { SerializedErrorOutput } from "./@types/serialized-error-output";

export default abstract class BaseCustomError extends Error {
  protected statusCode: number;
  protected constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, BaseCustomError.prototype);
  }
  
  abstract getStatusCode(): number;
  abstract serializeErrorOutput(): SerializedErrorOutput;
}



// export class ApiError extends BaseCustomError{
//   constructor(message: string, statusCode: number = StatusCode.INTERNAL_SERVER_ERROR){
//     super(message, statusCode)
// }
// }