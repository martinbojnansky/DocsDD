import { todoHappyTestSuite } from "./_tests";

todoHappyTestSuite
  .before(() => console.log("before"))
  .after(() => console.log("after"))
  .beforeEach(() => console.log("before each"))
  .afterEach(() => console.log("after each"))
  .override((tests) => {
    tests.visitTodosView.override(() => {
      cy.visit("../01_getting-started/index.html");
    });

    tests.displayTodos.override((step) => {
      cy.get('[data-tid="todos-view__title"]').should("contain.text", "todos");
    });

    tests.addTodo.override((step) => {
      cy.get('[data-tid="todos-view__input"]')
        .should("be.empty")
        .type(`${step.message.name}{enter}`);
      const item = cy.get('[data-tid="todos-view__item"]').eq(0);
      item
        .get('[data-tid="todos-view__item__toggle"]')
        .should("not.be.checked");
      item
        .get('[data-tid="todos-view__item__label"]')
        .should("contain.text", step.message.name);
    });

    tests.completeTodo.override((step) => {
      cy.get('[data-tid="todos-view__item"]')
        .eq(0)
        .get('[data-tid="todos-view__item__toggle"]')
        .click()
        .should("be.checked");
    });
  })
  .run();
