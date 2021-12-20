import { functionName } from "../helpers/naming.helper";
import { StringWriter } from "../helpers/string.helper";
import { Docs, DocsGenerator, UseCase } from "../models";

export class CypressTestsGenerator implements DocsGenerator<Docs> {
  generate(docs: Docs): string {
    const writer = new StringWriter();

    this.generateCommon(docs, writer);
    writer.appendLine();
    docs.useCases.forEach((useCase) => {
      writer.appendLine();
      this.generateUseCase(useCase, writer);
    });

    return writer.getText();
  }

  protected generateUseCase(useCase: UseCase, writer: StringWriter) {
    writer.appendBlock(
      `export const ${functionName(useCase.id)}TestSuite = new TestSuite('${
        useCase.id
      }', {`,
      `});`,
      () => {
        useCase.steps.forEach((step) => {
          writer.appendLine(
            `${functionName(step.id)}: new TestFunction('${
              step.id
            }', ${JSON.stringify(step)}),`
          );
        });
      }
    );
  }

  protected generateCommon(docs: Docs, writer: StringWriter) {
    writer.append(`class TestFunction<T = any> {
  protected _skip = false;
  protected _only = false;
  protected _config = {} as Cypress.TestConfigOverrides;

  constructor(
    protected readonly _title: string,
    protected readonly _step: T,
    protected _override?: (step: T) => void
  ) {}

  skip(): TestFunction<T> {
    this._skip = true;
    return this;
  }

  only(): TestFunction<T> {
    this._only = true;
    return this;
  }

  config(config: Cypress.TestConfigOverrides): TestFunction<T> {
    this._config = config;
    return this;
  }

  override(fn: (step: T) => void): TestFunction<T> {
    this._override = fn;
    return this;
  }

  _run(): void {
    if (!this._override || this._skip) {
      it.skip(this._title);
    } else if (this._only) {
      it.only(this._title);
    } else {
      it(this._title, this._config, () => this._override(this._step));
    }
  }
}

class TestSuite<
  T extends { [id in keyof T]: TestFunction } = { [id: string]: TestFunction }
> {
  protected _skip = false;
  protected _only = false;
  protected _before: () => void = () => {};
  protected _beforeEach: () => void = () => {};
  protected _after: () => void = () => {};
  protected _afterEach: () => void = () => {};

  constructor(
    protected readonly _title: string,
    protected readonly _tests: T
  ) {}

  skip(): TestSuite<T> {
    this._skip = true;
    return this;
  }

  only(): TestSuite<T> {
    this._only = true;
    return this;
  }

  before(fn: () => void): TestSuite<T> {
    this._before = fn;
    return this;
  }

  after(fn: () => void): TestSuite<T> {
    this._after = fn;
    return this;
  }

  beforeEach(fn: () => void): TestSuite<T> {
    this._beforeEach = fn;
    return this;
  }

  afterEach(fn: () => void): TestSuite<T> {
    this._afterEach = fn;
    return this;
  }

  override(fn: (tests: T) => void): TestSuite<T> {
    fn(this._tests);
    return this;
  }

  run(): void {
    this._before.apply(this);

    const args: [string, () => void] = [this._title, () => this.runTests()];
    if (this._skip) {
      describe.skip(...args);
    } else if (this._only) {
      describe.only(...args);
    } else {
      describe(...args);
    }

    this._after.apply(this);
  }

  protected runTests() {
    Object.keys(this._tests).forEach((testId) => {
      this._beforeEach.apply(this);
      (this._tests[testId] as TestFunction)._run();
      this._afterEach.apply(this);
    });
  }
}
`);
  }
}
