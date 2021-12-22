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
  description?: string;
  participants: Participant[];
  steps: Step[];
}

export interface UseCaseGenerator<T extends UseCase> {
  generate(useCase: T): string;
}

export interface Participant {
  id: string;
  type: ParticipantType;
}

export type ParticipantType = 'participant' | 'actor';

export interface Step {
  id: string;
  type: StepType;
  arrow: StepArrowType;
  note?: string;
  skipTest?: boolean;
  instructions?: Instruction[];
}

export type StepType = 'message';
export type StepArrowType = '->>' | '-->>';

export interface MessageStep<T = any> extends Step {
  type: 'message';
  from: Participant;
  to: Participant;
  message?: T;
}

export interface Instruction {
  id: string;
  should: InstructionType;
}

export type InstructionType =
  | 'visit'
  | 'click'
  | 'contain.text'
  | 'have.length';

export interface VisitInstruction extends Instruction {
  should: 'visit';
  url: string;
}

export interface ClickInstruction extends Instruction {
  selector: string;
  should: 'click';
}

export interface ContainTextInstruction extends Instruction {
  selector: string;
  should: 'contain.text';
  text: string | RegExp;
}

export interface StepHaveLengthInstruction extends Instruction {
  selector: string;
  should: 'have.length';
  length: number;
}

/*****************************************************************/

// export interface UseCaseRequestStep<
//   T extends UseCaseRequestStepRequest = UseCaseRequestStepRequest
// > extends Step {
//   type: 'request';
//   from: Participant;
//   to: Participant;
//   arrow: '->>';
//   request: T;
// }

// export interface UseCaseResponseStep<
//   T extends UseCaseResponseStepResponse = UseCaseResponseStepResponse
// > extends Step {
//   type: 'response';
//   from: Participant;
//   to: Participant;
//   arrow: '-->>';
//   response: T;
// }

// export interface UseCaseRequestStepRequest<T = any> {
//   method: 'get' | 'post' | 'update' | 'patch' | 'delete';
//   url: string;
//   body?: T;
//   headers?: { [key: string]: string };
// }

// export interface UseCaseResponseStepResponse<T = any> {
//   status: number;
//   body: T;
//   headers?: { [key: string]: string };
// }
