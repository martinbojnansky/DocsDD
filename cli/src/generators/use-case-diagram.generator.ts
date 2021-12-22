import { Log } from '../helpers/log.helper';
import { StringWriter } from '../helpers/string.helper';
import { MessageStep, Step, UseCase, UseCaseGenerator } from '../models';

export class UseCaseDiagramGenerator implements UseCaseGenerator<UseCase> {
  generate(useCase: UseCase): string {
    const writer = new StringWriter();

    writer.appendLine('sequenceDiagram');
    writer.increaseIndent();
    writer.appendLine('autonumber');

    this.writeParticipants(writer, useCase);
    writer.appendLine();

    this.writeSteps(writer, useCase);

    return writer.getText();
  }

  protected writeParticipants(writer: StringWriter, useCase: UseCase) {
    useCase.participants.forEach((participant) => {
      writer.appendLine(`${participant.type} ${participant.id}`);
    });
  }

  protected writeSteps(writer: StringWriter, useCase: UseCase) {
    useCase.steps.forEach((step, index) => {
      writer.appendLine(
        `rect rgb(${index % 2 === 0 ? '244, 244, 244' : '233, 237, 244'})`
      );

      switch (step.type) {
        case 'message':
          this.writeStep(writer, useCase, step as MessageStep);
          break;
        default:
          Log.warn(`Unsupported step type '${step.type}'.`);
          break;
      }

      this.writeStepCriteria(writer, useCase, step);
      writer.appendLine('end');
    });
  }

  protected writeStepCriteria(
    writer: StringWriter,
    useCase: UseCase,
    step: Step
  ) {
    step.criteria?.forEach((criterium) => {
      writer.appendLine(
        `${step.to.id}${'-->>'}${step.to.id}: ${criterium.should}`
      );
    });
  }

  protected writeStep(writer: StringWriter, useCase: UseCase, step: Step) {
    writer.appendLine(`${step.from.id}${step.arrow}${step.to.id}: ${step.id}`);
    if (step.note) {
      writer.appendLine(
        `Note over ${step.from.id},${step.to.id}: ${step.note}`
      );
    }
  }
}
