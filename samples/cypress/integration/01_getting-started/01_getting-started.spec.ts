import { todoHappyUseCase } from './_tests';

todoHappyUseCase
  //.skip()
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
      .criteria((criteria) => {
        criteria.visitIndex
          .before(() => console.log('before criterium 1 of step 1'))
          .after(() => console.log('after criterium 1 of step 1'));
      });
  })
  .run();
