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
  private res = '';
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
      this.res += ' ';
    }
    this.res += text;
  }

  appendLine(text: string) {
    this.append(`${text}\n`);
  }

  getResult(): string {
    return this.res;
  }
}

export interface DiagramRenderer<T> {
  render(diagram: T): string;
}

export class UseCaseDiagramRenderer implements DiagramRenderer<UseCaseDiagram> {
  render(diagram: UseCaseDiagram): string {
    const writer = new StringWriter();

    writer.appendLine('sequenceDiagram');
    writer.increaseIndent();

    diagram.participants.forEach((participant) => {
      writer.appendLine(`participant ${participant.name}`);
    });

    writer.appendLine('');

    diagram.steps.forEach((step) => {
      const arrow = step.arrow === 'solid_arrow' ? '->>' : '-->>';
      writer.appendLine(
        `${step.from.name}${arrow}${step.to.name}: ${step.name}`
      );
    });

    return writer.getResult();
  }
}
