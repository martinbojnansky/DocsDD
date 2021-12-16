export interface UseCaseDiagram {
  id: string;
  participants: UseCaseDiagramParticipant[];
  steps: UseCaseDiagramStep[];
}

export interface UseCaseDiagramParticipant {
  id: string;
}

export type UseCaseDiagramMessageArrowType = '->>' | '-->>';

export type UseCaseDiagramStepType = 'arrow' | 'request' | 'response';

export interface UseCaseDiagramStep {
  id: string;
  type: UseCaseDiagramStepType;
  arrow: UseCaseDiagramMessageArrowType;
}

export interface UseCaseDiagramArrowStep extends UseCaseDiagramStep {
  type: 'arrow';
  from: UseCaseDiagramParticipant;
  to: UseCaseDiagramParticipant;
}

export interface UseCaseDiagramRequestStep<T extends Request = Request>
  extends UseCaseDiagramStep {
  type: 'request';
  from: UseCaseDiagramParticipant;
  to: UseCaseDiagramParticipant;
  arrow: '->>';
  request: T;
}

export interface UseCaseDiagramResponseStep<T extends Response = Response>
  extends UseCaseDiagramStep {
  type: 'response';
  from: UseCaseDiagramParticipant;
  to: UseCaseDiagramParticipant;
  arrow: '-->>';
  response: T;
}

export interface Request<T = any> {
  url: string;
  body?: T;
  headers?: { [key: string]: string };
}

export interface Response<T = any> {
  status: number;
  body: T;
}

export class StringTo {
  static functionName(text: string) {
    return text
      .replace(/-|_/g, ' ')
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '';
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
  }

  static className(text: string) {
    return text
      .replace(/-|_/g, ' ')
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '';
        return match.toUpperCase();
      });
  }
}

export class StringWriter {
  private text = '';
  private indent = 0;

  increaseIndent(times: number = 1) {
    this.indent += 2 * times;
  }

  decreaseIndent(times: number = 1) {
    this.indent -= 2 * times;
    if (this.indent < 0) this.indent = 0;
  }

  append(text: string) {
    for (let i = 0; i < this.indent; i++) {
      this.text += ' ';
    }
    this.text += text;
  }

  appendLine(text: string = '') {
    this.append(`${text}\n`);
  }

  appendBlock(start: string, end: string, body: () => void) {
    this.appendLine(start);
    this.increaseIndent();
    body();
    this.decreaseIndent();
    this.appendLine(end);
  }

  getText(): string {
    return this.text;
  }
}

export interface DiagramGenerator<T> {
  generate(diagram: T): string;
}

export class UseCaseDiagramGenerator
  implements DiagramGenerator<UseCaseDiagram>
{
  generate(diagram: UseCaseDiagram): string {
    const writer = new StringWriter();

    writer.appendLine('sequenceDiagram');
    writer.increaseIndent();

    diagram.participants.forEach((participant) => {
      writer.appendLine(`participant ${participant.id}`);
    });

    writer.appendLine();

    diagram.steps.forEach((step) => {
      switch (step.type) {
        case 'arrow':
        case 'request':
        case 'response':
          const reqresStep = step as
            | UseCaseDiagramArrowStep
            | UseCaseDiagramRequestStep<any>
            | UseCaseDiagramResponseStep<any>;
          writer.appendLine(
            `${reqresStep.from.id}${reqresStep.arrow}${
              step.type === 'request'
                ? '+'
                : step.type === 'response'
                ? '-'
                : ''
            }${reqresStep.to.id}: ${reqresStep.id}`
          );
          break;
        default:
          break;
      }
    });

    return writer.getText();
  }
}

export class UseCaseDiagramTestGenerator
  implements DiagramGenerator<UseCaseDiagram>
{
  generate(diagram: UseCaseDiagram): string {
    const writer = new StringWriter();

    this.generateStepConstants(diagram, writer);
    writer.appendLine();
    this.generateStepTypes(diagram, writer);
    writer.appendLine();
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
        `export const ${StringTo.functionName(step.id)}Step = ${JSON.stringify(
          step
        )};`
      );
    });
  }

  protected generateStepTypes(diagram: UseCaseDiagram, writer: StringWriter) {
    diagram.steps.forEach((step) => {
      writer.appendLine(
        `export type ${StringTo.className(
          step.id
        )}StepType = typeof ${StringTo.functionName(step.id)}Step;`
      );
    });
  }

  protected generateDtos(diagram: UseCaseDiagram, writer: StringWriter) {
    diagram.steps.forEach((step) => {
      writer.appendLine(
        `export type ${StringTo.className(
          step.id
        )}Dto = typeof ${StringTo.functionName(step.id)}Step.dto;`
      );
    });
  }

  protected generateTestClass(diagram: UseCaseDiagram, writer: StringWriter) {
    writer.appendBlock(
      `export abstract class ${StringTo.className(diagram.id)}Tests {`,
      `}`,
      () => {
        // Run-method
        writer.appendBlock('run() {', '}', () => {
          writer.appendBlock(`describe('${diagram.id}', () => {`, '});', () => {
            diagram.steps.forEach((step) => {
              writer.appendBlock(
                `it('should ${step.id}', () => {`,
                `});`,
                () => {
                  writer.appendLine(
                    `this.test${StringTo.className(
                      step.id
                    )}(${StringTo.functionName(step.id)}Step);`
                  );
                }
              );
            });
          });
        });

        // Abstracts of the tests
        diagram.steps.forEach((step) => {
          writer.appendLine(
            `abstract test${StringTo.className(
              step.id
            )}(data: ${StringTo.className(step.id)}StepType): void;`
          );
        });
      }
    );
  }
}
