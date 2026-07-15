// ELEMENTOS DE NAVEGACIÓN
const coverScreen = document.getElementById('cover-screen');
const resourcesScreen = document.getElementById('resources-screen');
const enterBtn = document.getElementById('enter-btn');
const backBtn = document.getElementById('back-btn');
const resourceBtns = document.querySelectorAll('.resource-btn:not(:disabled)');

// FUNCIONES DE NAVEGACIÓN
function showResourcesScreen() {
  coverScreen.classList.add('hidden');
  resourcesScreen.classList.add('active');
}

// EVENT LISTENERS DE NAVEGACIÓN
enterBtn.addEventListener('click', showResourcesScreen);
backBtn.addEventListener('click', showResourcesScreen);

resourceBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.resource === 'quadratic-graph') {
      window.location.href = 'plano-cartesiano.html';
    } else if (btn.dataset.resource === 'space-rockets') {
      window.location.href = 'cohetes-espaciales.html';
    } else if (btn.dataset.resource === 'triangle-congruence') {
      window.location.href = 'triangulos-congruentes.html';
    }
  });
});
