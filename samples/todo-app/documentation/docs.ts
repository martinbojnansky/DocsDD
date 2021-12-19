import {
  Docs,
  UseCase,
  UseCaseMessageStep,
  UseCaseParticipant,
  UseCaseRequestStep,
  UseCaseResponseStep,
} from "../../../cli/src/models";

const participants: { [key: string]: UseCaseParticipant } = {
  user: {
    id: "user",
  },
  frontend: {
    id: "frontend",
  },
  backend: {
    id: "backend",
  },
};

const todoHappyUseCase: UseCase = {
  id: "todo--happy",
  description: "Basic usage of todos management.",
  participants: Object.keys(participants).map((key) => participants[key]),
  steps: [
    <UseCaseMessageStep>{
      id: "visit-todos-view",
      type: "message",
      from: participants.user,
      to: participants.frontend,
      arrow: "->>",
    },

    <UseCaseMessageStep>{
      id: "display-todos-view",
      type: "message",
      from: participants.frontend,
      to: participants.user,
      arrow: "-->>",
      note: "Display loading indicator.",
    },

    <UseCaseRequestStep>{
      id: "get-all-todos",
      type: "request",
      from: participants.frontend,
      to: participants.backend,
      arrow: "->>",
      request: {
        method: "get",
        url: "/todos",
        body: null,
      },
    },

    <UseCaseResponseStep>{
      id: "return-all-todos--empty",
      type: "response",
      from: participants.backend,
      to: participants.frontend,
      arrow: "-->>",
      response: {
        status: 200,
        body: [],
      },
    },

    <UseCaseMessageStep>{
      id: "display-todos-list",
      type: "message",
      from: participants.frontend,
      to: participants.user,
      arrow: "-->>",
    },

    <UseCaseMessageStep>{
      id: "add-todo--first",
      type: "message",
      from: participants.user,
      to: participants.frontend,
      arrow: "->>",
      message: {
        name: "Walk the dog!",
      },
    },

    <UseCaseRequestStep>{
      id: "post-todo--first",
      type: "request",
      from: participants.frontend,
      to: participants.backend,
      arrow: "->>",
      request: {
        method: "post",
        url: "/todo",
        body: { name: "Walk the dog" },
        headers: {
          Authorization: "Bearer xyz-123",
        },
      },
    },

    <UseCaseResponseStep>{
      id: "return-created-todo--first",
      type: "response",
      from: participants.backend,
      to: participants.frontend,
      arrow: "-->>",
      response: {
        status: 200,
        body: [
          {
            name: "Walk the dog",
            done: false,
          },
        ],
      },
    },

    <UseCaseMessageStep>{
      id: "display-created-todo--first",
      type: "message",
      from: participants.frontend,
      to: participants.user,
      arrow: "-->>",
    },
  ],
};

export const docs: Docs = {
  title: "TodoApp",
  description: "Sample documentation of todo list application.",
  version: "0.0.1",
  useCases: [todoHappyUseCase],
};
