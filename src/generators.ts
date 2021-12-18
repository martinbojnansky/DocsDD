import { className, functionName } from "./helpers";
import {
  UseCaseDiagram,
  UseCaseDiagramArrowStep,
  UseCaseDiagramGenerator,
  UseCaseDiagramRequestStep,
  UseCaseDiagramResponseStep,
} from "./models";
import { StringWriter } from "./writers";

export class UseCaseDiagramGeneratorImpl
  implements UseCaseDiagramGenerator<UseCaseDiagram>
{
  generate(diagram: UseCaseDiagram): string {
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
            | UseCaseDiagramArrowStep
            | UseCaseDiagramRequestStep<any>
            | UseCaseDiagramResponseStep<any>;
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

export class UseCaseDiagramCypressTestGenerator
  implements UseCaseDiagramGenerator<UseCaseDiagram>
{
  generate(diagram: UseCaseDiagram): string {
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

  protected generateStepConstants(
    diagram: UseCaseDiagram,
    writer: StringWriter
  ) {
    diagram.steps.forEach((step) => {
      writer.appendLine(
        `export const ${functionName(step.id)}Step = ${JSON.stringify(step)};`
      );
    });
  }

  protected generateStepTypes(diagram: UseCaseDiagram, writer: StringWriter) {
    diagram.steps.forEach((step) => {
      writer.appendLine(
        `export type ${className(step.id)}StepType = typeof ${functionName(
          step.id
        )}Step;`
      );
    });
  }

  protected generateDtos(diagram: UseCaseDiagram, writer: StringWriter) {
    diagram.steps.forEach((step) => {
      writer.appendLine(
        `export type ${className(step.id)}Dto = typeof ${functionName(
          step.id
        )}Step.dto;`
      );
    });
  }

  protected generateTestClass(diagram: UseCaseDiagram, writer: StringWriter) {
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
