import { Log } from '../helpers/log.helper';
import { StringWriter } from '../helpers/string.helper';
import { MessageStep, Step, UseCase, UseCaseGenerator } from '../models';

export class UseCaseDiagramGenerator implements UseCaseGenerator<UseCase> {
  generate(useCase: UseCase): string {
    const writer = new StringWriter();

    writer.appendLine('sequenceDiagram');
    writer.increaseIndent();

    this.writeParticipants(writer, useCase);
    writer.appendLine();

    this.writeSteps(writer, useCase);

    return writer.getText();
  }

  protected writeParticipants(writer: StringWriter, useCase: UseCase) {
    useCase.participants.forEach((participant) => {
      writer.appendLine(`participant ${participant.id}`);
    });
  }

  protected writeSteps(writer: StringWriter, useCase: UseCase) {
    useCase.steps.forEach((step) => {
      switch (step.type) {
        case 'message':
          this.writeMessageStep(writer, useCase, step as MessageStep);
          break;
        default:
          Log.warn(`Unsupported step type '${step.type}'.`);
          break;
      }
      this.writeStepInstructions(writer, useCase, step);
    });
  }

  protected writeStepInstructions(
    writer: StringWriter,
    useCase: UseCase,
    step: Step
  ) {
    // TODO
  }

  protected writeMessageStep(
    writer: StringWriter,
    useCase: UseCase,
    step: MessageStep
  ) {
    writer.appendLine(`${step.from.id}${step.arrow}${step.to.id}: ${step.id}`);
    if (step.note) {
      writer.appendLine(
        `Note over ${step.from.id},${step.to.id}: ${step.note}`
      );
    }
  }
}
