import { Log } from '../helpers/log.helper';
import { StringWriter } from '../helpers/string.helper';
import {
  UseCase,
  UseCaseMessageStep,
  UseCaseGenerator,
  UseCaseRequestStep,
  UseCaseResponseStep,
} from '../models';

export class UseCaseDiagramGenerator implements UseCaseGenerator<UseCase> {
  generate(useCase: UseCase): string {
    const writer = new StringWriter();

    writer.appendLine('sequenceDiagram');
    writer.increaseIndent();

    useCase.participants.forEach((participant) => {
      writer.appendLine(`participant ${participant.id}`);
    });

    writer.appendLine();

    useCase.steps.forEach((step) => {
      switch (step.type) {
        case 'message':
        case 'request':
        case 'response':
          const messageStep = step as
            | UseCaseMessageStep
            | UseCaseRequestStep
            | UseCaseResponseStep;
          writer.appendLine(
            `${messageStep.from.id}${messageStep.arrow}${
              step.type === 'request'
                ? '+'
                : step.type === 'response'
                ? '-'
                : ''
            }${messageStep.to.id}: ${messageStep.id}`
          );
          if (messageStep.note) {
            writer.appendLine(
              `Note over ${messageStep.from.id},${messageStep.to.id}: ${messageStep.note}`
            );
          }
          break;
        default:
          Log.warn(`Unsupported step type '${step.type}'.`);
          break;
      }
    });

    return writer.getText();
  }
}
