import {
  Docs,
  MessageStep,
  Participant,
  UseCase,
  VisitInstruction,
} from '../../cli/src/models';

const participants: { [key: string]: Participant } = {
  user: {
    id: 'user',
    type: 'actor',
  },
  frontend: {
    id: 'frontend',
    type: 'participant',
  },
};

const todoHappyUseCase: UseCase = {
  id: 'todo--happy',
  description: 'Basic usage of todos management.',
  participants: Object.keys(participants).map((key) => participants[key]),
  steps: [
    <MessageStep>{
      id: 'visit-todos-view',
      type: 'message',
      from: participants.user,
      to: participants.frontend,
      arrow: '->>',
      instructions: [
        <VisitInstruction>{
          id: 'visit-index',
          should: 'visit',
          url: '../01_getting-started/index.html',
        },
      ],
    },

    <MessageStep>{
      id: 'display-todos--empty',
      type: 'message',
      from: participants.frontend,
      to: participants.user,
      arrow: '-->>',
    },

    <MessageStep>{
      id: 'add-todo--first',
      type: 'message',
      from: participants.user,
      to: participants.frontend,
      arrow: '->>',
      message: {
        title: 'Walk the dog!',
      },
    },

    <MessageStep>{
      id: 'display-todos--first',
      type: 'message',
      from: participants.frontend,
      to: participants.user,
      arrow: '-->>',
      message: {
        title: 'Walk the dog!',
      },
    },

    <MessageStep>{
      id: 'complete-todo--first',
      type: 'message',
      from: participants.user,
      to: participants.frontend,
      arrow: '->>',
    },

    <MessageStep>{
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
  title: '01 - Getting started',
  description: 'A simple docs sample.',
  version: '0.0.1',
  useCases: [todoHappyUseCase],
};
