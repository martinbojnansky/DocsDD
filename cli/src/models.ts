export interface Docs {
  title: string;
  description: string;
  version: string;
  useCases: UseCase[];
}

export interface DocsGenerator<T extends Docs> {
  generate(docs: T): string;
}

export interface UseCase {
  id: string;
  participants: UseCaseParticipant[];
  steps: UseCaseStep[];
}

export interface UseCaseParticipant {
  id: string;
}

export type UseCaseStepArrowType = "->>" | "-->>";

export type UseCaseStepType = "message" | "request" | "response";

export interface UseCaseStep {
  id: string;
  type: UseCaseStepType;
  arrow: UseCaseStepArrowType;
  note?: string;
}

export interface UseCaseMessageStep<T = any> extends UseCaseStep {
  type: "message";
  from: UseCaseParticipant;
  to: UseCaseParticipant;
  message: T;
}

export interface UseCaseRequestStep<
  T extends UseCaseRequestStepRequest = UseCaseRequestStepRequest
> extends UseCaseStep {
  type: "request";
  from: UseCaseParticipant;
  to: UseCaseParticipant;
  arrow: "->>";
  request: T;
}

export interface UseCaseResponseStep<
  T extends UseCaseResponseStepResponse = UseCaseResponseStepResponse
> extends UseCaseStep {
  type: "response";
  from: UseCaseParticipant;
  to: UseCaseParticipant;
  arrow: "-->>";
  response: T;
}

export interface UseCaseRequestStepRequest<T = any> {
  method: "get" | "post" | "update" | "patch" | "delete";
  url: string;
  body?: T;
  headers?: { [key: string]: string };
}

export interface UseCaseResponseStepResponse<T = any> {
  status: number;
  body: T;
  headers?: { [key: string]: string };
}

export interface UseCaseGenerator<T extends UseCase> {
  generate(useCase: T): string;
}
