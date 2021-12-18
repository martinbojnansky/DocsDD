import { className, functionName } from "./helpers";
import {
  UseCase,
  UseCaseArrowStep,
  UseCaseGenerator,
  UseCaseRequestStep,
  UseCaseResponseStep,
} from "./models";
import { StringWriter } from "./writers";

export class UseCaseDiagramGenerator implements UseCaseGenerator<UseCase> {
  generate(diagram: UseCase): string {
    const writer = new StringWriter();

    writer.appendLine("sequenceDiagram");
    writer.increaseIndent();

    diagram.participants.forEach((participant) => {
      writer.appendLine(`participant ${participant.id}`);
    });

    writer.appendLine();

    diagram.steps.forEach((step) => {
      switch (step.type) {
        case "arrow":
        case "request":
        case "response":
          const reqresStep = step as
            | UseCaseArrowStep
            | UseCaseRequestStep<any>
            | UseCaseResponseStep<any>;
          writer.appendLine(
            `${reqresStep.from.id}${reqresStep.arrow}${
              step.type === "request"
                ? "+"
                : step.type === "response"
                ? "-"
                : ""
            }${reqresStep.to.id}: ${reqresStep.id}`
          );
          break;
        default:
          break;
      }
      // TODO: Generate note
    });

    return writer.getText();
  }
}

export class UseCaseCypressTestsGenerator implements UseCaseGenerator<UseCase> {
  generate(diagram: UseCase): string {
    const writer = new StringWriter();

    this.generateStepConstants(diagram, writer);
    writer.appendLine();
    this.generateStepTypes(diagram, writer);
    // writer.appendLine();
    // this.generateDtos(diagram, writer);
    writer.appendLine();
    this.generateTestClass(diagram, writer);

    return writer.getText();
  }

  protected generateStepConstants(diagram: UseCase, writer: StringWriter) {
    diagram.steps.forEach((step) => {
      writer.appendLine(
        `export const ${functionName(step.id)}Step = ${JSON.stringify(step)};`
      );
    });
  }

  protected generateStepTypes(diagram: UseCase, writer: StringWriter) {
    diagram.steps.forEach((step) => {
      writer.appendLine(
        `export type ${className(step.id)}StepType = typeof ${functionName(
          step.id
        )}Step;`
      );
    });
  }

  protected generateDtos(diagram: UseCase, writer: StringWriter) {
    diagram.steps.forEach((step) => {
      writer.appendLine(
        `export type ${className(step.id)}Dto = typeof ${functionName(
          step.id
        )}Step.dto;`
      );
    });
  }

  protected generateTestClass(diagram: UseCase, writer: StringWriter) {
    writer.appendBlock(
      `export abstract class ${className(diagram.id)}Tests {`,
      `}`,
      () => {
        // Run-method
        writer.appendBlock("run() {", "}", () => {
          writer.appendBlock(`describe('${diagram.id}', () => {`, "});", () => {
            diagram.steps.forEach((step) => {
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
        diagram.steps.forEach((step) => {
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
