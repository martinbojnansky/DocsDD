import {
  UseCaseDiagram,
  UseCaseDiagramArrowStep,
  UseCaseDiagramRequestStep,
  UseCaseDiagramResponseStep,
} from "../../src/models";
import { api, frontend, server, user } from "./participants";

export const todoHappy: UseCaseDiagram = {
  id: "todo--happy",
  participants: [user, frontend, api, server],
  steps: [
    <UseCaseDiagramArrowStep>{
      id: "visit-todos-view",
      type: "arrow",
      from: user,
      to: frontend,
      arrow: "->>",
    },

    <UseCaseDiagramArrowStep>{
      id: "display-todos-view",
      type: "arrow",
      from: frontend,
      to: user,
      arrow: "-->>",
    },

    <UseCaseDiagramRequestStep>{
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

    <UseCaseDiagramResponseStep>{
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

    <UseCaseDiagramArrowStep>{
      id: "display-todos-list",
      type: "arrow",
      from: frontend,
      to: user,
      arrow: "-->>",
    },

    <UseCaseDiagramArrowStep>{
      id: "add-todo--first",
      type: "arrow",
      from: user,
      to: frontend,
      arrow: "->>",
    },

    <UseCaseDiagramRequestStep>{
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

    <UseCaseDiagramResponseStep>{
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

    <UseCaseDiagramArrowStep>{
      id: "display-created-todo--first",
      type: "arrow",
      from: frontend,
      to: user,
      arrow: "-->>",
    },
  ],
};
