import { className } from "../../helpers/naming.helper";
import { StringWriter } from "../../helpers/string.helper";
import { UseCase, UseCaseGenerator } from "../../models";

export class CypressUseCaseTestsGenerator implements UseCaseGenerator<UseCase> {
  generate(useCase: UseCase): string {
    const writer = new StringWriter();

    writer.appendBlock(
      `export abstract class ${className(useCase.id)}Tests {`,
      `}`,
      () => {
        useCase.steps.forEach((step) => {
          writer.appendLine(
            `static readonly ${className(step.id)}Step = ${JSON.stringify(
              step
            )};`
          );
        });
        writer.appendLine();
        writer.appendLine("protected before() {}");
        writer.appendLine("protected after() {}");
        writer.appendLine("protected beforeEach() {}");
        writer.appendLine("protected afterEach() {}");
        writer.appendLine();
        writer.appendBlock("run() {", "}", () => {
          writer.appendBlock(`describe('${useCase.id}', () => {`, "});", () => {
            writer.appendLine("before(() => this.before());");
            writer.appendLine("after(() => this.after());");
            writer.appendLine("beforeEach(() => this.beforeEach());");
            writer.appendLine("afterEach(() => this.afterEach());");
            useCase.steps.forEach((step) => {
              writer.appendLine();
              writer.appendBlock(
                `it('should ${step.id}', () => {`,
                `});`,
                () => {
                  writer.appendLine(
                    `this.test${className(step.id)}(${className(
                      useCase.id
                    )}Tests.${className(step.id)}Step);`
                  );
                }
              );
            });
          });
        });
        writer.appendLine();
        useCase.steps.forEach((step) => {
          writer.appendLine(
            `abstract test${className(step.id)}(data: typeof ${className(
              useCase.id
            )}Tests.${className(step.id)}Step): void;`
          );
        });
      }
    );

    return writer.getText();
  }
}
