import { HttpStatus } from "@nestjs/common";
import { GraphQLError } from "graphql";

class GraphQLBaseException extends GraphQLError {
  status!: number;

  message!: string;

  constructor(message: string, status: number) {
    super(message);
    Error.captureStackTrace(this);
    Error.call(this);
    this.message = message;
    this.status = status;
  }
}

export class ApiGraphqlNotFoundException extends GraphQLBaseException {
  static STATUS = HttpStatus.NOT_FOUND;
  constructor(message: string) {
    super(message ?? ApiGraphqlNotFoundException.name, ApiGraphqlNotFoundException.STATUS);
  }
}