import { todoHappyUseCase } from "./use-cases";
import { Docs } from "../../../cli/src/models";

export const docs = JSON.stringify(<Docs>{
  title: "TodoApp",
  description: "Sample documentation of todo list application.",
  version: "0.0.1",
  useCases: [todoHappyUseCase],
});
