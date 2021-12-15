import { UseCaseDiagram, UseCaseDiagramParticipant } from '../common';

export const viewer: UseCaseDiagramParticipant = {
  id: 'viewer',
  name: 'Viewer',
  note: 'User with "Viewer" rights only.',
};

export const frontend: UseCaseDiagramParticipant = {
  id: 'frontend',
  name: 'Frontend',
  note: 'Frontend application.',
};

export const api: UseCaseDiagramParticipant = {
  id: 'api',
  name: 'API',
  note: 'REST API.',
};

export const server: UseCaseDiagramParticipant = {
  id: 'server',
  name: 'Server',
  note: 'Backend application.',
};

export const customersGetAllHappyDiagram: UseCaseDiagram = {
  id: 'customers__getAll--happy',
  name: 'Get all customers',
  participants: [viewer, frontend, api, server],
  steps: [
    {
      id: 'visit-customers-view',
      name: 'Visit "/customers"',
      from: viewer,
      to: frontend,
      arrow: 'solid_arrow',
      data: null,
    },

    {
      id: 'display-customers-view',
      name: 'Display customers view',
      note: 'Should display table with loading indicator.',
      from: frontend,
      to: viewer,
      arrow: 'dashed_arrow',
    },

    {
      id: 'get-all-customers--initial',
      name: 'Get all customers',
      from: frontend,
      to: server,
      arrow: 'solid_arrow',
      data: { query: '?name=startsWith:martin' },
    },

    {
      id: 'return-all-customers--initial',
      name: 'Return all customers',
      from: server,
      to: frontend,
      arrow: 'dashed_arrow',
      data: [{ name: 'Customer 1' }, { name: 'Customer 2' }],
    },

    {
      id: 'display-customers-list--initial',
      name: 'Display all customers',
      from: frontend,
      to: viewer,
      arrow: 'dashed_arrow',
      data: null,
    },
  ],
};
