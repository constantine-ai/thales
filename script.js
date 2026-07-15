// ELEMENTOS DE NAVEGACIÓN
const coverScreen = document.getElementById('cover-screen');
const resourcesScreen = document.getElementById('resources-screen');
const appScreen = document.getElementById('app-screen');
const enterBtn = document.getElementById('enter-btn');
const backBtn = document.getElementById('back-btn');
const closeAppBtn = document.getElementById('close-app-btn');
const resourceBtns = document.querySelectorAll('.resource-btn:not(:disabled)');

// ELEMENTOS DEL GRAFICADOR
const form = document.getElementById('equation-form');
const aInput = document.getElementById('coef-a');
const sliderA = document.getElementById('slider-a');
const sliderAValue = document.getElementById('slider-a-value');
const bInput = document.getElementById('coef-b');
const cInput = document.getElementById('coef-c');
const equationText = document.getElementById('equation-text');
const vertexText = document.getElementById('vertex-text');
const rootsText = document.getElementById('roots-text');
const graph = document.getElementById('graph');

// FUNCIONES DE NAVEGACIÓN
function showResourcesScreen() {
  coverScreen.classList.add('hidden');
  resourcesScreen.classList.add('active');
  appScreen.classList.remove('active');
}

function showAppScreen() {
  coverScreen.classList.add('hidden');
  resourcesScreen.classList.remove('active');
  appScreen.classList.add('active');
}

function showResourcesFromApp() {
  resourcesScreen.classList.add('active');
  appScreen.classList.remove('active');
}

// EVENT LISTENERS DE NAVEGACIÓN
enterBtn.addEventListener('click', showResourcesScreen);
backBtn.addEventListener('click', showResourcesScreen);
closeAppBtn.addEventListener('click', showResourcesFromApp);

resourceBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.resource === 'quadratic-graph') {
      showAppScreen();
    }
  });
});

const svgNS = 'http://www.w3.org/2000/svg';
const width = 600;
const height = 600;
const padding = 32;

function formatNumber(value) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

function parseEquation() {
  const a = Number(aInput.value);
  const b = Number(bInput.value);
  const c = Number(cInput.value);
  return { a, b, c };
}

function syncSliderFromA() {
  const value = Number(aInput.value);
  if (!Number.isNaN(value)) {
    sliderA.value = value;
    sliderAValue.textContent = value.toFixed(1);
  }
}

function createText(x, y, content, className = '') {
  const text = document.createElementNS(svgNS, 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('fill', '#f8fafc');
  text.setAttribute('font-size', '13');
  text.setAttribute('text-anchor', 'middle');
  text.textContent = content;
  if (className) text.setAttribute('class', className);
  return text;
}

function getNiceStep(range) {
  if (range <= 0) return 1;
  const roughStep = range / 6;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalized = roughStep / magnitude;
  const niceStep = normalized < 1.5 ? 1 : normalized < 3 ? 2 : normalized < 7 ? 5 : 10;
  return niceStep * magnitude;
}

function drawGraph({ a, b, c }) {
  graph.innerHTML = '';

  const xMin = -10;
  const xMax = 10;
  const step = 0.08;
  const points = [];
  let yValues = [];

  for (let x = xMin; x <= xMax; x += step) {
    const y = a * x * x + b * x + c;
    yValues.push(y);
    points.push([x, y]);
  }

  let yMin = Math.min(...yValues);
  let yMax = Math.max(...yValues);
  const margin = Math.max(2, Math.abs(yMax - yMin) * 0.2);

  yMin -= margin;
  yMax += margin;

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const xStep = getNiceStep(xRange);
  const yStep = getNiceStep(yRange);

  const mapX = (x) => padding + ((x - xMin) / xRange) * (width - padding * 2);
  const mapY = (y) => height - padding - ((y - yMin) / yRange) * (height - padding * 2);

  const grid = document.createElementNS(svgNS, 'g');
  grid.setAttribute('stroke', '#334155');
  grid.setAttribute('stroke-width', '1');

  for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
    const xPos = mapX(x);
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', xPos);
    line.setAttribute('x2', xPos);
    line.setAttribute('y1', padding);
    line.setAttribute('y2', height - padding);
    grid.appendChild(line);
    if (x !== 0) {
      grid.appendChild(createText(xPos, height - 12, x.toString()));
    }
  }

  for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
    const yPos = mapY(y);
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', padding);
    line.setAttribute('x2', width - padding);
    line.setAttribute('y1', yPos);
    line.setAttribute('y2', yPos);
    grid.appendChild(line);
    if (y !== 0) {
      grid.appendChild(createText(16, yPos + 4, y.toString()));
    }
  }
  graph.appendChild(grid);

  const axes = document.createElementNS(svgNS, 'g');
  axes.setAttribute('stroke', '#f8fafc');
  axes.setAttribute('stroke-width', '2');

  const xAxis = document.createElementNS(svgNS, 'line');
  xAxis.setAttribute('x1', padding);
  xAxis.setAttribute('x2', width - padding);
  xAxis.setAttribute('y1', mapY(0));
  xAxis.setAttribute('y2', mapY(0));
  axes.appendChild(xAxis);

  const yAxis = document.createElementNS(svgNS, 'line');
  yAxis.setAttribute('x1', mapX(0));
  yAxis.setAttribute('x2', mapX(0));
  yAxis.setAttribute('y1', padding);
  yAxis.setAttribute('y2', height - padding);
  axes.appendChild(yAxis);

  axes.appendChild(createText(width - 18, mapY(0) - 8, 'x'));
  axes.appendChild(createText(mapX(0) + 12, 20, 'y'));
  graph.appendChild(axes);

  const path = document.createElementNS(svgNS, 'path');
  const d = points
    .map(([x, y], index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command}${mapX(x).toFixed(2)},${mapY(y).toFixed(2)}`;
    })
    .join(' ');

  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#38bdf8');
  path.setAttribute('stroke-width', '3');
  path.setAttribute('stroke-linejoin', 'round');
  graph.appendChild(path);

  const vertexX = a === 0 ? null : -b / (2 * a);
  const vertexY = a === 0 ? null : a * vertexX * vertexX + b * vertexX + c;
  const vertexPoint = document.createElementNS(svgNS, 'circle');
  vertexPoint.setAttribute('cx', mapX(vertexX));
  vertexPoint.setAttribute('cy', mapY(vertexY));
  vertexPoint.setAttribute('r', '6');
  vertexPoint.setAttribute('fill', '#f59e0b');
  graph.appendChild(vertexPoint);

  const discriminant = b * b - 4 * a * c;
  let roots = [];
  if (a !== 0) {
    if (discriminant > 0) {
      roots = [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
    } else if (discriminant === 0) {
      roots = [(-b) / (2 * a)];
    }
  }

  const equationTextValue = `y = ${formatNumber(a)}x² ${b >= 0 ? '+' : '-'} ${Math.abs(formatNumber(b))}x ${c >= 0 ? '+' : '-'} ${Math.abs(formatNumber(c))}`;
  equationText.textContent = equationTextValue;
  vertexText.textContent = vertexX === null ? 'Vértice: no aplica' : `Vértice: (${formatNumber(vertexX)}, ${formatNumber(vertexY)})`;
  rootsText.textContent = roots.length === 0 ? 'Raíces: no reales' : `Raíces: ${roots.map((root) => formatNumber(root)).join(' y ')}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  drawGraph(parseEquation());
});

aInput.addEventListener('input', () => {
  syncSliderFromA();
  drawGraph(parseEquation());
});

sliderA.addEventListener('input', () => {
  aInput.value = sliderA.value;
  sliderAValue.textContent = Number(sliderA.value).toFixed(1);
  drawGraph(parseEquation());
});

document.querySelectorAll('.sample-btn').forEach((button) => {
  button.addEventListener('click', () => {
    aInput.value = button.dataset.a;
    sliderA.value = button.dataset.a;
    sliderAValue.textContent = Number(button.dataset.a).toFixed(1);
    bInput.value = button.dataset.b;
    cInput.value = button.dataset.c;
    drawGraph(parseEquation());
  });
});

// INICIALIZAR APLICACIÓN
syncSliderFromA();
drawGraph(parseEquation());
