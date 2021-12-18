export interface UseCaseDiagram {
  id: string;
  participants: UseCaseDiagramParticipant[];
  steps: UseCaseDiagramStep[];
}

export interface UseCaseDiagramParticipant {
  id: string;
}

export type UseCaseDiagramMessageArrowType = "->>" | "-->>";

export type UseCaseDiagramStepType = "arrow" | "request" | "response";

export interface UseCaseDiagramStep {
  id: string;
  type: UseCaseDiagramStepType;
  arrow: UseCaseDiagramMessageArrowType;
  note?: string;
}

export interface UseCaseDiagramArrowStep extends UseCaseDiagramStep {
  type: "arrow";
  from: UseCaseDiagramParticipant;
  to: UseCaseDiagramParticipant;
}

export interface UseCaseDiagramRequestStep<
  T extends UseCaseDiagramStepRequest = UseCaseDiagramStepRequest
> extends UseCaseDiagramStep {
  type: "request";
  from: UseCaseDiagramParticipant;
  to: UseCaseDiagramParticipant;
  arrow: "->>";
  request: T;
}

export interface UseCaseDiagramResponseStep<
  T extends UseCaseDiagramStepResponse = UseCaseDiagramStepResponse
> extends UseCaseDiagramStep {
  type: "response";
  from: UseCaseDiagramParticipant;
  to: UseCaseDiagramParticipant;
  arrow: "-->>";
  response: T;
}

export interface UseCaseDiagramStepRequest<T = any> {
  method: "get" | "post" | "update" | "patch" | "delete";
  url: string;
  body?: T;
  headers?: { [key: string]: string };
}

export interface UseCaseDiagramStepResponse<T = any> {
  status: number;
  body: T;
  headers?: { [key: string]: string };
}

export interface UseCaseDiagramGenerator<T> {
  generate(diagram: T): string;
}
