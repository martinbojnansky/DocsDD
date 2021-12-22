import { todoHappyUseCase } from './_tests';

todoHappyUseCase
  // .skip()
  .steps((steps) => {
    steps.visitTodosView;
    // .only()
  })
  .before(() => console.log('before'))
  .after(() => console.log('after'))
  .beforeEach(() => console.log('before each'))
  .afterEach(() => console.log('after each'))
  .steps((steps) => {
    steps.visitTodosView.override((step) => {
      cy.visit('../01_getting-started/index.html');
    });

    steps.displayTodosEmpty.override((step) => {
      cy.get('[data-tid="todos-view__title"]').should('contain.text', 'todos');
      cy.get('[data-tid="todos-view__input"]');
      cy.get('[data-tid="todos-view__item"]').should('have.length', 0);
    });

    steps.addTodoFirst.override((step) => {
      cy.get('[data-tid="todos-view__input"]').type(
        `${step.message.title}{enter}`
      );
    });

    steps.displayTodosFirst.override((step) => {
      const item = cy.get('[data-tid="todos-view__item"]').eq(0);
      item
        .get('[data-tid="todos-view__item__toggle"]')
        .should('not.be.checked');
      item
        .get('[data-tid="todos-view__item__label"]')
        .should('contain.text', step.message.title);
    });

    steps.completeTodoFirst.override((step) => {
      cy.get('[data-tid="todos-view__item"]')
        .eq(0)
        .get('[data-tid="todos-view__item__toggle"]')
        .click();
    });

    steps.completedTodoFirst.override((step) => {
      cy.get('[data-tid="todos-view__item"]')
        .eq(0)
        .get('[data-tid="todos-view__item__toggle"]')
        .should('be.checked');
    });
  })
  .run();

todoHappyUseCase
  // .skip()
  .before(() => console.log('before use case 1'))
  .after(() => console.log('after use case 1'))
  .beforeEach(() => console.log('before each step of use case 1'))
  .afterEach(() => console.log('after each step of use case 1'))
  .steps((steps) => {
    steps.visitTodosView
      //.only()
      .before(() => {
        console.log('before step 1');
      })
      .after(() => {
        console.log('after step 1');
      })
      .instructions((instructions) => {
        instructions.visitIndex
          .before(() => console.log('before instruction 1'))
          .after(() => console.log('after instruction 1'))
          .override((i) => console.log('override instruction 1'));
      });
  })
  .run();
