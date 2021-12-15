import {
  UseCaseDiagramGenerator,
  UseCaseDiagramTestGenerator,
} from './src/common';
import { customersGetAllHappyDiagram } from './src/diagrams';
import './style.css';

const graphDiv: HTMLElement = document.getElementById('graph');
graphDiv.innerHTML = new UseCaseDiagramGenerator().generate(
  customersGetAllHappyDiagram
);

const testsDiv: HTMLElement = document.getElementById('tests');
testsDiv.innerHTML = new UseCaseDiagramTestGenerator().generate(
  customersGetAllHappyDiagram
);
