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
      id: 'display-todos--empty',
      type: 'message',
      from: participants.frontend,
      to: participants.user,
      arrow: '-->>',
    },

    <UseCaseMessageStep>{
      id: 'add-todo--first',
      type: 'message',
      from: participants.user,
      to: participants.frontend,
      arrow: '->>',
      message: {
        title: 'Walk the dog!',
      },
    },

    <UseCaseMessageStep>{
      id: 'display-todos--first',
      type: 'message',
      from: participants.frontend,
      to: participants.user,
      arrow: '-->>',
      message: {
        title: 'Walk the dog!',
      },
    },

    <UseCaseMessageStep>{
      id: 'complete-todo--first',
      type: 'message',
      from: participants.user,
      to: participants.frontend,
      arrow: '->>',
    },

    <UseCaseMessageStep>{
      id: 'completed-todo--first',
      type: 'message',
      from: participants.frontend,
      to: participants.user,
      arrow: '-->>',
      note: 'Done',
    },
  ],
};

export const docs: Docs = {
  title: 'TodoApp',
  description: 'Sample documentation of todo list application.',
  version: '0.0.1',
  useCases: [todoHappyUseCase],
};
