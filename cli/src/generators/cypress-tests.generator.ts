import * as path from 'path';
import { functionName } from '../helpers/naming.helper';
import { StringWriter } from '../helpers/string.helper';
import { Docs, DocsGenerator, Step, UseCase } from '../models';

export class CypressTestsGenerator implements DocsGenerator<Docs> {
  generate(docs: Docs): string {
    const writer = new StringWriter();

    this.generateCommon(docs, writer);
    docs.useCases.forEach((useCase) => {
      writer.appendLine();
      this.writeUseCase(writer, useCase);
    });

    return writer.getText();
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
        const stepWithoutInstructions = {
          ...step,
        };
        delete stepWithoutInstructions.instructions;
        writer.appendLine(`${JSON.stringify(stepWithoutInstructions)},`);
        this.writeStepInstructions(writer, useCase, step);
      }
    );
  }

  protected writeStepInstructions(
    writer: StringWriter,
    useCase: UseCase,
    step: Step
  ) {
    if (!step.instructions?.length) {
      writer.appendLine('{},');
      return;
    }

    writer.appendBlock('{', '}', () => {
      step.instructions?.forEach((instruction) => {
        writer.appendLine(
          `${functionName(instruction.id)}: new CyInstruction('${
            instruction.id
          }', ${JSON.stringify(instruction)}),`
        );
      });
    });
  }

  protected generateCommon(docs: Docs, writer: StringWriter) {
    writer.appendFile(
      path.resolve(__dirname, 'templates/cypress-tests.template')
    );
  }
}
