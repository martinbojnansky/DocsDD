import { TodoHappyTests } from "./_abstracts";

class TodoHappyTestsImpl extends TodoHappyTests {
  testVisitTodosView(data: typeof TodoHappyTests.VisitTodosViewStep): void {
    cy.visit("../index.html");
  }

  testDisplayTodosView(data: typeof TodoHappyTests.DisplayTodosViewStep): void {
    // TODO: Implement
  }

  testGetAllTodos(data: typeof TodoHappyTests.GetAllTodosStep): void {
    // TODO: Implement
  }

  testReturnAllTodosEmpty(
    data: typeof TodoHappyTests.ReturnAllTodosEmptyStep
  ): void {
    // TODO: Implement
  }

  testDisplayTodosList(data: typeof TodoHappyTests.DisplayTodosListStep): void {
    // TODO: Implement
  }

  testAddTodoFirst(data: typeof TodoHappyTests.AddTodoFirstStep): void {
    // TODO: Implement
  }

  testPostTodoFirst(data: typeof TodoHappyTests.PostTodoFirstStep): void {
    // TODO: Implement
  }

  testReturnCreatedTodoFirst(
    data: typeof TodoHappyTests.ReturnCreatedTodoFirstStep
  ): void {
    // TODO: Implement
  }

  testDisplayCreatedTodoFirst(
    data: typeof TodoHappyTests.DisplayCreatedTodoFirstStep
  ): void {
    // TODO: Implement
  }
}

new TodoHappyTestsImpl().run();
