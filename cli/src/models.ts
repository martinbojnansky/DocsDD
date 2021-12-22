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
  from: Participant;
  to: Participant;
  arrow: StepArrowType;
  note?: string;
  skipTest?: boolean;
  criteria?: Criterium[];
}

export type StepType = 'message';
export type StepArrowType = '->>' | '-->>' | '->' | '-->';

export interface MessageStep<T = any> extends Step {
  type: 'message';
  message?: T;
}

export interface Criterium {
  type: CriteriumType;
  should: string;
}

export type CriteriumType = 'cypress';

export interface CypressCriterium extends Criterium {
  type: 'cypress';
  code?: () => {};
}
