import { UseCaseDiagram, UseCaseDiagramParticipant } from '../common';

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
    {
      id: 'visit-customers-view',
      from: viewer,
      to: frontend,
      arrow: 'solid_arrow',
      dto: {},
    },

    {
      id: 'display-customers-view',
      from: frontend,
      to: viewer,
      arrow: 'dashed_arrow',
      dto: {},
    },

    {
      id: 'get-all-customers--initial',
      from: frontend,
      to: server,
      arrow: 'solid_arrow',
      dto: { query: '?name=startsWith:martin' },
    },

    {
      id: 'return-all-customers--initial',
      from: server,
      to: frontend,
      arrow: 'dashed_arrow',
      dto: [{ name: 'Customer 1' }, { name: 'Customer 2' }],
    },

    {
      id: 'display-customers-list--initial',
      from: frontend,
      to: viewer,
      arrow: 'dashed_arrow',
      dto: {},
    },
  ],
};
