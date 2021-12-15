import { UseCaseDiagramRenderer } from './src/common';
import { customersGetAllHappyDiagram } from './src/diagrams';
import './style.css';

const graphDiv: HTMLElement = document.getElementById('graph');
graphDiv.innerHTML = new UseCaseDiagramRenderer().render(
  customersGetAllHappyDiagram
);
