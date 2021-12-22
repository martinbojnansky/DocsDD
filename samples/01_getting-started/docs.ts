import {
  CypressCriterium,
  Docs,
  MessageStep,
  Participant,
  UseCase,
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
      criteria: [
        <CypressCriterium>{
          type: 'cypress',
          should: 'visit-index',
          code: () => cy.visit('../01_getting-started/index.html'),
        },
      ],
    },

    <MessageStep>{
      id: 'display-todos--empty',
      type: 'message',
      from: participants.frontend,
      to: participants.user,
      arrow: '-->>',
      criteria: [
        <CypressCriterium>{
          type: 'cypress',
          should: 'display-title',
          code: () =>
            cy
              .get('[data-tid="todos-view__title"]')
              .should('contain.text', 'todos'),
        },
        <CypressCriterium>{
          type: 'cypress',
          should: 'have-empty-input',
          code: () =>
            cy.get('[data-tid="todos-view__input"]').should('be.empty'),
        },
        <CypressCriterium>{
          type: 'cypress',
          should: 'have-no-todos',
          code: () =>
            cy.get('[data-tid="todos-view__item"]').should('have.length', 0),
        },
      ],
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
      criteria: [
        <CypressCriterium>{
          type: 'cypress',
          should: 'submit-todo',
          code: () =>
            cy
              .get('[data-tid="todos-view__input"]')
              .type(`Walk the dog!}{enter}`),
        },
      ],
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
