import {
  UseCase,
  UseCaseArrowStep,
  UseCaseRequestStep,
  UseCaseResponseStep,
} from "../../../cli/src/models";
import { participants } from "./participants";

export const todoHappyUseCase: UseCase = {
  id: "todo--happy",
  participants: Object.keys(participants).map((key) => participants[key]),
  steps: [
    <UseCaseArrowStep>{
      id: "visit-todos-view",
      type: "arrow",
      from: participants.user,
      to: participants.frontend,
      arrow: "->>",
    },

    <UseCaseArrowStep>{
      id: "display-todos-view",
      type: "arrow",
      from: participants.frontend,
      to: participants.user,
      arrow: "-->>",
    },

    <UseCaseRequestStep>{
      id: "get-all-todos",
      type: "request",
      from: participants.frontend,
      to: participants.api,
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
      from: participants.api,
      to: participants.frontend,
      arrow: "-->>",
      response: {
        status: 200,
        body: [],
      },
    },

    <UseCaseArrowStep>{
      id: "display-todos-list",
      type: "arrow",
      from: participants.frontend,
      to: participants.user,
      arrow: "-->>",
    },

    <UseCaseArrowStep>{
      id: "add-todo--first",
      type: "arrow",
      from: participants.user,
      to: participants.frontend,
      arrow: "->>",
    },

    <UseCaseRequestStep>{
      id: "post-todo--first",
      type: "request",
      from: participants.frontend,
      to: participants.api,
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
      from: participants.api,
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

    <UseCaseArrowStep>{
      id: "display-created-todo--first",
      type: "arrow",
      from: participants.frontend,
      to: participants.user,
      arrow: "-->>",
    },
  ],
};
