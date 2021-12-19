import { UseCaseParticipant } from "../../../cli/src/models";

const user: UseCaseParticipant = {
  id: "user",
};

const frontend: UseCaseParticipant = {
  id: "frontend",
};

const backend: UseCaseParticipant = {
  id: "backend",
};

export const participants = {
  ...{ user },
  ...{ frontend },
  ...{ backend },
};
