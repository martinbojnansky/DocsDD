export interface UseCaseDiagram {
  id: string;
  name: string;
  participants: UseCaseDiagramParticipant[];
  steps: UseCaseDiagramMessage<any>[]; // UseCaseDiagramStep[];
}

export interface UseCaseDiagramParticipant {
  id: string;
  name: string;
  note?: string;
}

export interface UseCaseDiagramStep {
  id: string;
  name?: string;
  note?: string;
}

export type UseCaseDiagramMessageArrowType = 'solid_arrow' | 'dashed_arrow';

export interface UseCaseDiagramMessage<T> extends UseCaseDiagramStep {
  from: UseCaseDiagramParticipant;
  to: UseCaseDiagramParticipant;
  arrow: UseCaseDiagramMessageArrowType;
  data?: T;
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
      writer.appendLine(`participant ${participant.name}`);
    });

    writer.appendLine();

    diagram.steps.forEach((step) => {
      const arrow = step.arrow === 'solid_arrow' ? '->>' : '-->>';
      writer.appendLine(
        `${step.from.name}${arrow}${step.to.name}: ${step.name}`
      );
    });

    return writer.getText();
  }
}

export class UseCaseDiagramTestGenerator
  implements DiagramGenerator<UseCaseDiagram>
{
  generate(diagram: UseCaseDiagram): string {
    const writer = new StringWriter();

    writer.appendBlock('const steps = {', '};', () => {
      diagram.steps.forEach((step) => {
        writer.appendLine(
          `${StringTo.functionName(step.id)}: ${JSON.stringify(step)},`
        );
      });
    });

    writer.appendLine();
    writer.appendBlock(
      `abstract class ${StringTo.className(diagram.id)}Tests {`,
      `}`,
      () => {
        writer.appendLine();
        writer.appendBlock('run() {', '}', () => {
          writer.appendBlock(`describe('${diagram.id}', () => {`, '});', () => {
            diagram.steps.forEach((step) => {
              writer.appendLine();
              writer.appendBlock(
                `it('should ${step.id}', () => {`,
                `});`,
                () => {
                  writer.appendLine(
                    `this.${StringTo.functionName(
                      step.id
                    )}(steps.${StringTo.functionName(step.id)});`
                  );
                }
              );
            });
          });
        });

        diagram.steps.forEach((step) => {
          writer.appendLine();
          if (step.note) {
            writer.appendLine('/*');
            writer.appendLine(`* ${step.note}`);
            writer.appendLine('*/');
          }
          writer.appendLine(
            `abstract ${StringTo.functionName(
              step.id
            )}(data: typeof steps.${StringTo.functionName(step.id)}): void;`
          );
        });
      }
    );

    return writer.getText();
  }
}
