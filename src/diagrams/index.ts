import {
  UseCaseDiagram,
  UseCaseDiagramArrowStep,
  UseCaseDiagramParticipant,
  UseCaseDiagramRequestStep,
  UseCaseDiagramResponseStep,
} from '../common';

export const viewer: UseCaseDiagramParticipant = {
  id: 'viewer',
};

export const frontend: UseCaseDiagramParticipant = {
  id: 'frontend',
};

export const api: UseCaseDiagramParticipant = {
  id: 'api',
};

export const server: UseCaseDiagramParticipant = {
  id: 'server',
};

export const customersGetAllHappyDiagram: UseCaseDiagram = {
  id: 'customers__getAll--happy',
  participants: [viewer, frontend, api, server],
  steps: [
    <UseCaseDiagramArrowStep>{
      id: 'visit-customers-view',
      type: 'arrow',
      from: viewer,
      to: frontend,
      arrow: '->>',
    },

    <UseCaseDiagramArrowStep>{
      id: 'display-customers-view',
      type: 'arrow',
      from: frontend,
      to: viewer,
      arrow: '-->>',
    },

    <UseCaseDiagramRequestStep>{
      id: 'get-all-customers',
      type: 'request',
      from: frontend,
      to: api,
      arrow: '->>',
      request: {
        url: '/customers',
        body: { query: '?name=startsWith:martin' },
      },
    },

    <UseCaseDiagramResponseStep>{
      id: 'return-all-customers',
      type: 'response',
      from: api,
      to: frontend,
      arrow: '-->>',
      response: {
        status: 200,
        body: [{ name: 'Customer 1' }, { name: 'Customer 2' }],
      },
    },

    <UseCaseDiagramArrowStep>{
      id: 'display-customers-list',
      type: 'arrow',
      from: frontend,
      to: viewer,
      arrow: '-->>',
    },
  ],
};
