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
      data: { query: '?name=startsWith:martin' },
    },

    {
      id: 'display-customers-view',
      name: 'Display customers view',
      from: frontend,
      to: viewer,
      arrow: 'dashed_arrow',
    },

    {
      id: 'visit-customers-view',
      name: 'Visit "/customers"',
      from: frontend,
      to: api,
      arrow: 'solid_arrow',
      data: { query: '?name=startsWith:martin' },
    },
  ],
};
