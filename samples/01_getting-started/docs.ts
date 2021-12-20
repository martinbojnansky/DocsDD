import {
  Docs,
  UseCase,
  UseCaseMessageStep,
  UseCaseParticipant,
} from '../../cli/src/models';

const participants: { [key: string]: UseCaseParticipant } = {
  user: {
    id: 'user',
  },
  frontend: {
    id: 'frontend',
  },
};

const todoHappyUseCase: UseCase = {
  id: 'todo--happy',
  description: 'Basic usage of todos management.',
  participants: Object.keys(participants).map((key) => participants[key]),
  steps: [
    <UseCaseMessageStep>{
      id: 'visit-todos-view',
      type: 'message',
      from: participants.user,
      to: participants.frontend,
      arrow: '->>',
    },

    <UseCaseMessageStep>{
      id: 'display-todos',
      type: 'message',
      from: participants.frontend,
      to: participants.user,
      arrow: '-->>',
      note: 'Should be empty for the first time.',
    },

    <UseCaseMessageStep>{
      id: 'add-todo',
      type: 'message',
      from: participants.user,
      to: participants.frontend,
      arrow: '->>',
      message: {
        name: 'Walk the dog!',
      },
    },

    <UseCaseMessageStep>{
      id: 'complete-todo',
      type: 'message',
      from: participants.frontend,
      to: participants.user,
      arrow: '-->>',
    },
  ],
};

export const docs: Docs = {
  title: 'TodoApp',
  description: 'Sample documentation of todo list application.',
  version: '0.0.1',
  useCases: [todoHappyUseCase],
};
