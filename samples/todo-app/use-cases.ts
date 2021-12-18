import {
  UseCase,
  UseCaseArrowStep,
  UseCaseRequestStep,
  UseCaseResponseStep,
} from "../../src/models";
import { api, frontend, server, user } from "./participants";

export const todoHappyUseCase: UseCase = {
  id: "todo--happy",
  participants: [user, frontend, api, server],
  steps: [
    <UseCaseArrowStep>{
      id: "visit-todos-view",
      type: "arrow",
      from: user,
      to: frontend,
      arrow: "->>",
    },

    <UseCaseArrowStep>{
      id: "display-todos-view",
      type: "arrow",
      from: frontend,
      to: user,
      arrow: "-->>",
    },

    <UseCaseRequestStep>{
      id: "get-all-todos",
      type: "request",
      from: frontend,
      to: api,
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
      from: api,
      to: frontend,
      arrow: "-->>",
      response: {
        status: 200,
        body: [],
      },
    },

    <UseCaseArrowStep>{
      id: "display-todos-list",
      type: "arrow",
      from: frontend,
      to: user,
      arrow: "-->>",
    },

    <UseCaseArrowStep>{
      id: "add-todo--first",
      type: "arrow",
      from: user,
      to: frontend,
      arrow: "->>",
    },

    <UseCaseRequestStep>{
      id: "post-todo--first",
      type: "request",
      from: frontend,
      to: api,
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
      from: api,
      to: frontend,
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

    <UseCaseArrowStep>{
      id: "display-created-todo--first",
      type: "arrow",
      from: frontend,
      to: user,
      arrow: "-->>",
    },
  ],
};
