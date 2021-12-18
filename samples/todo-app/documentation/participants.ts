import { UseCaseParticipant } from "../../../cli/src/models";

const user: UseCaseParticipant = {
  id: "user",
};

const frontend: UseCaseParticipant = {
  id: "frontend",
};

const api: UseCaseParticipant = {
  id: "api",
};

const server: UseCaseParticipant = {
  id: "server",
};

export const participants = {
  ...{ user },
  ...{ frontend },
  ...{ api },
  ...{ server },
};
