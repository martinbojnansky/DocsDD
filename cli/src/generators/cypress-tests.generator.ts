import * as path from 'path';
import { functionName } from '../helpers/naming.helper';
import { StringWriter } from '../helpers/string.helper';
import {
  CypressCriterium,
  Docs,
  DocsGenerator,
  Step,
  UseCase,
} from '../models';

export class CypressTestsGenerator implements DocsGenerator<Docs> {
  generate(docs: Docs): string {
    const writer = new StringWriter();

    this.writeTemplate(docs, writer);
    docs.useCases.forEach((useCase) => {
      writer.appendLine();
      this.writeUseCase(writer, useCase);
    });

    return writer.getText();
  }

  protected writeTemplate(docs: Docs, writer: StringWriter) {
    writer.appendFile(
      path.resolve(__dirname, 'templates/cypress-tests.template')
    );
  }

  protected writeUseCase(writer: StringWriter, useCase: UseCase) {
    writer.appendBlock(
      `export const ${functionName(useCase.id)}UseCase = new CyUseCase('${
        useCase.id
      }', {`,
      `});`,
      () => this.writeSteps(writer, useCase)
    );
  }

  protected writeSteps(writer: StringWriter, useCase: UseCase) {
    useCase.steps
      .filter((step) => !step.skipTest)
      .forEach((step) => this.writeStep(writer, useCase, step));
  }

  protected writeStep(writer: StringWriter, useCase: UseCase, step: Step) {
    writer.appendBlock(
      `${functionName(step.id)}: new CyStep('${step.id}',`,
      '),',
      () => {
        const stepWithoutCriteria = {
          ...step,
        };
        delete stepWithoutCriteria.criteria;
        writer.appendLine(`${JSON.stringify(stepWithoutCriteria)},`);
        this.writeStepCriteria(writer, useCase, step);
      }
    );
  }

  protected writeStepCriteria(
    writer: StringWriter,
    useCase: UseCase,
    step: Step
  ) {
    if (!step.criteria?.length) {
      writer.appendLine('{},');
      return;
    }

    writer.appendBlock('{', '}', () => {
      step.criteria?.forEach((criterium) => {
        writer.appendLine(
          `${functionName(criterium.should)}: new CyCriterium('${
            criterium.should
          }',`
        );
        writer.appendLine(`${JSON.stringify(criterium)},`);

        if (criterium.type === 'cypress') {
          const cypressCriterium = criterium as CypressCriterium;
          writer.appendLine(
            `${cypressCriterium.code
              ?.toString()
              .replace('function () ', '(criterium) => ')}),`
          );
        }
      });
    });
  }
}
