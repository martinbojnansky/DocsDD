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
}

export type UseCaseDiagramMessageArrowType = 'solid_arrow' | 'dashed_arrow';

export interface UseCaseDiagramMessage<T extends Model>
  extends UseCaseDiagramStep {
  from: UseCaseDiagramParticipant;
  to: UseCaseDiagramParticipant;
  arrow: UseCaseDiagramMessageArrowType;
  data?: T;
}

export interface Model {
  _model: {
    type: string;
    name: string;
    description?: string;
    sample: string | string[];
  };
}

export interface Dto extends Model {}

export interface Query extends Dto {
  query: string;
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

    writer.appendLine(`describe('${diagram.id}', () => {`);
    writer.appendLine();
    writer.increaseIndent();

    diagram.steps.forEach((step) => {
      writer.appendLine(`it('should ${step.name}', () => {});`);
      writer.appendLine();
    });

    writer.decreaseIndent();
    writer.appendLine('});');

    return writer.getText();
  }
}
