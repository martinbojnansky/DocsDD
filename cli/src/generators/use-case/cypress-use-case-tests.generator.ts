import { className, functionName } from "../../helpers/naming.helper";
import { StringWriter } from "../../helpers/string.helper";
import { UseCase, UseCaseGenerator } from "../../models";

export class CypressUseCaseTestsGenerator implements UseCaseGenerator<UseCase> {
  generate(useCase: UseCase): string {
    const writer = new StringWriter();

    this.generateStepConstants(useCase, writer);
    writer.appendLine();
    this.generateStepTypes(useCase, writer);
    // writer.appendLine();
    // this.generateDtos(useCase, writer);
    writer.appendLine();
    this.generateTestClass(useCase, writer);

    return writer.getText();
  }

  protected generateStepConstants(useCase: UseCase, writer: StringWriter) {
    useCase.steps.forEach((step) => {
      writer.appendLine(
        `export const ${functionName(step.id)}Step = ${JSON.stringify(step)};`
      );
    });
  }

  protected generateStepTypes(useCase: UseCase, writer: StringWriter) {
    useCase.steps.forEach((step) => {
      writer.appendLine(
        `export type ${className(step.id)}StepType = typeof ${functionName(
          step.id
        )}Step;`
      );
    });
  }

  protected generateDtos(useCase: UseCase, writer: StringWriter) {
    useCase.steps.forEach((step) => {
      writer.appendLine(
        `export type ${className(step.id)}Dto = typeof ${functionName(
          step.id
        )}Step.dto;`
      );
    });
  }

  protected generateTestClass(useCase: UseCase, writer: StringWriter) {
    writer.appendBlock(
      `export abstract class ${className(useCase.id)}Tests {`,
      `}`,
      () => {
        // Run-method
        writer.appendBlock("run() {", "}", () => {
          writer.appendBlock(`describe('${useCase.id}', () => {`, "});", () => {
            useCase.steps.forEach((step) => {
              writer.appendBlock(
                `it('should ${step.id}', () => {`,
                `});`,
                () => {
                  writer.appendLine(
                    `this.test${className(step.id)}(${functionName(
                      step.id
                    )}Step);`
                  );
                }
              );
            });
          });
        });

        // Abstracts of the tests
        useCase.steps.forEach((step) => {
          writer.appendLine(
            `abstract test${className(step.id)}(data: ${className(
              step.id
            )}StepType): void;`
          );
        });
      }
    );
  }
}
