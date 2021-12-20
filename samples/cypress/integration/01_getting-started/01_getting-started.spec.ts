import { todoHappyTestSuite } from './_tests';

todoHappyTestSuite
  .before(() => console.log('before'))
  .after(() => console.log('after'))
  .beforeEach(() => console.log('before each'))
  .afterEach(() => console.log('after each'))
  .override((tests) => {
    tests.visitTodosView.override(() => {
      cy.visit('../01_getting-started/index.html');
    });

    tests.displayTodosEmpty.override((step) => {
      cy.get('[data-tid="todos-view__title"]').should('contain.text', 'todos');
      cy.get('[data-tid="todos-view__input"]');
      cy.get('[data-tid="todos-view__item"]').should('have.length', 0);
    });

    tests.addTodoFirst.override((step) => {
      cy.get('[data-tid="todos-view__input"]').type(
        `${step.message.title}{enter}`
      );
    });

    tests.displayTodosFirst.override((step) => {
      const item = cy.get('[data-tid="todos-view__item"]').eq(0);
      item
        .get('[data-tid="todos-view__item__toggle"]')
        .should('not.be.checked');
      item
        .get('[data-tid="todos-view__item__label"]')
        .should('contain.text', step.message.title);
    });

    tests.completeTodoFirst.override((step) => {
      cy.get('[data-tid="todos-view__item"]')
        .eq(0)
        .get('[data-tid="todos-view__item__toggle"]')
        .click();
    });

    tests.completedTodoFirst.override((step) => {
      cy.get('[data-tid="todos-view__item"]')
        .eq(0)
        .get('[data-tid="todos-view__item__toggle"]')
        .should('be.checked');
    });
  })
  .run();
