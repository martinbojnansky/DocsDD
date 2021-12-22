class CyCriterium<TCriterium = any> {
  protected _before: () => void = () => {};
  protected _after: () => void = () => {};

  constructor(
    protected readonly _title: string,
    protected readonly _criterium: TCriterium,
    protected _override?: (criterium: TCriterium) => void
  ) {}

  before(fn: () => void): CyCriterium<TCriterium> {
    this._before = fn;
    return this;
  }

  after(fn: () => void): CyCriterium<TCriterium> {
    this._after = fn;
    return this;
  }

  override(fn: (step: TCriterium) => void) {
    this._override = fn;
  }

  _run(): void {
    this._before?.apply(this);
    if (this._override) {
      this._override.apply(this, [this._criterium]);
    }
    this._after?.apply(this);
  }
}

class CyStep<
  TStep = any,
  TCriteria extends { [id in keyof TCriteria]: CyCriterium } = {
    [id: string]: CyCriterium;
  }
> {
  protected _skip = false;
  protected _only = false;
  // @ts-ignore
  protected _config = {} as Cypress.TestConfigOverrides;
  protected _before: () => void = () => {};
  protected _after: () => void = () => {};

  constructor(
    protected readonly _title: string,
    protected readonly _step: TStep,
    protected _criteria?: TCriteria,
    protected _override?: (step: TStep) => void
  ) {}

  skip(): CyStep<TStep> {
    this._skip = true;
    return this;
  }

  only(): CyStep<TStep> {
    this._only = true;
    return this;
  }

  // @ts-ignore
  config(config: Cypress.TestConfigOverrides): CyStep<TStep> {
    this._config = config;
    return this;
  }

  before(fn: () => void): CyStep<TStep> {
    this._before = fn;
    return this;
  }

  after(fn: () => void): CyStep<TStep> {
    this._after = fn;
    return this;
  }

  criteria(fn: (criteria: TCriteria) => void): CyStep<TStep> {
    fn(this._criteria);
    return this;
  }

  override(fn: (step: TStep) => void) {
    this._override = fn;
  }

  _run(): void {
    // @ts-ignore
    const args: [string, Cypress.TestConfigOverrides, () => void] = [
      this._title,
      this._config,
      () => this.runCriteria(),
    ];
    if (this._skip) {
      // @ts-ignore
      it.skip(...args);
    } else if (this._only) {
      // @ts-ignore
      it.only(...args);
    } else {
      // @ts-ignore
      it(...args);
    }
  }

  protected runCriteria() {
    this._before?.apply(this, [this._step]);
    if (this._override) {
      this._override.apply(this, [this._step]);
    } else {
      Object.keys(this._criteria).forEach((criteriumId) => {
        (this._criteria[criteriumId] as CyCriterium)._run();
      });
    }
    this._after?.apply(this, [this._step]);
  }
}

class CyUseCase<
  TSteps extends { [id in keyof TSteps]: CyStep } = { [id: string]: CyStep }
> {
  protected _skip = false;
  protected _only = false;
  protected _before: () => void;
  protected _after: () => void;
  protected _beforeEach: () => void;
  protected _afterEach: () => void;

  constructor(
    protected readonly _title: string,
    protected readonly _steps: TSteps
  ) {}

  skip(): CyUseCase<TSteps> {
    this._skip = true;
    return this;
  }

  only(): CyUseCase<TSteps> {
    this._only = true;
    return this;
  }

  before(fn: () => void): CyUseCase<TSteps> {
    this._before = fn;
    return this;
  }

  after(fn: () => void): CyUseCase<TSteps> {
    this._after = fn;
    return this;
  }

  beforeEach(fn: () => void): CyUseCase<TSteps> {
    this._beforeEach = fn;
    return this;
  }

  afterEach(fn: () => void): CyUseCase<TSteps> {
    this._afterEach = fn;
    return this;
  }

  steps(fn: (steps: TSteps) => void): CyUseCase<TSteps> {
    fn(this._steps);
    return this;
  }

  run(): void {
    // @ts-ignore
    before(() => this._before?.apply(this));
    // @ts-ignore
    after(() => this._after?.apply(this));
    // @ts-ignore
    beforeEach(() => this._beforeEach?.apply(this));
    // @ts-ignore
    afterEach(() => this._afterEach?.apply(this));

    const args: [string, () => void] = [this._title, () => this.runSteps()];
    if (this._skip) {
      // @ts-ignore
      describe.skip(...args);
    } else if (this._only) {
      // @ts-ignore
      describe.only(...args);
    } else {
      // @ts-ignore
      describe(...args);
    }
  }

  protected runSteps() {
    Object.keys(this._steps).forEach((testId) => {
      (this._steps[testId] as CyStep)._run();
    });
  }
}
