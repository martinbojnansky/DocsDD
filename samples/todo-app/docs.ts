import { Docs } from "../../src/models";
import { todoHappyUseCase } from "./use-cases";

export const docs = JSON.stringify(<Docs>{
  title: "TodoApp",
  description: "Sample documentation of todo list application.",
  version: "0.0.1",
  useCases: [todoHappyUseCase],
});
