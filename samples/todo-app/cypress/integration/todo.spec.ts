import { todoHappyTestSuite } from "./_tests";

todoHappyTestSuite
  .before(() => console.log("before"))
  .after(() => console.log("after"))
  .beforeEach(() => console.log("before each"))
  .afterEach(() => console.log("after each"))
  .override((tests) => {
    tests.visitTodosView.override(() => {
      cy.visit("../index.html");
    });
  })
  .run();
