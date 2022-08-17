window.addEventListener('load', initScene);

// Clase globo
class Globo {
  constructor(pos, color, animations) {
    // Vector de 3 valores {x: 0, y: 0, z: 0}
    this.pos = pos;

    // Un color válido
    this.color = color;

    // Array de animaciones debe ser compatible con el atributo animation del objeto
    this.animations = animations;
  }
}

// Constantes
const LIMITE_SUBIDA = 15;
const CANTIDAD_GLOBOS = 1;
const MAX_VELOCIDAD_SUBIDA = 1.7;
const MIN_VELOCIDAD_SUBIDA = 1.45;

const colores = [
  'aqua',
  'cornflowerblue',
  'crimson',
  'darkorange',
  'darkviolet',
  'greenyellow',
  'hotpink',
  'pink',
  'yellow'
]

function initScene() {
  this.crearGlobos();
}

function crearGlobos() {
  const escena = document.getElementById('escena');

  for (let i = 0; i < CANTIDAD_GLOBOS; i++) {
    const globo = this.crearGlobo();
    const { pos, animations } = globo;

    const globoEnt = document.createElement('a-entity');
    globoEnt.object3D.position.set(pos.x, pos.y, pos.z);
    globoEnt.setAttribute('animation', animations.subir);
    escena.appendChild(globoEnt);

    const globoEntJr = document.createElement('a-entity');
    globoEntJr.object3D.position.set(0, 0, 0);
    globoEntJr.setAttribute('animation', animations.oscilarX);
    globoEnt.appendChild(globoEntJr);

    const globoObj = document.createElement('a-obj-model');
    globoObj.object3D.position.set(0, 0, 0);
    globoObj.setAttribute('src', '#globo-obj');
    globoObj.setAttribute('material', { color: globo.color });
    globoEntJr.setAttribute('animation', animations.oscilarZ);
    globoEntJr.appendChild(globoObj);

    console.log('animations: ', animations);
  }
}

function crearGlobo() {
  const newPos = { x: 0, y: -5, z: -5 };
  const newColor = this.obtenerColorAleatorio();
  const newAnimations = {
    subir: {
      property: 'position',
      to: { x: newPos.x, y: newPos.y + LIMITE_SUBIDA, z: newPos.z },
      dur: this.calcularDuracionAleatoria(),
      loop: true,
      easing: 'linear',
    },
    oscilarX: {
      property: 'position',
      from: { x: 0, y: 0, z: this.generarNumeroAleatorioEntre(-0.15, -0.08) },
      to: { x: 0, y: 0, z: this.generarNumeroAleatorioEntre(0.08, 0.15) },
      dur: this.generarNumeroAleatorioEntre(1500, 2001),
      dir: 'alternate',
      loop: true,
      easing: 'easeInOutQuad',
    },
    oscilarZ: {
      property: 'position',
      from: { x: this.generarNumeroAleatorioEntre(-0.15, -0.08), y: 0, z: 0 },
      to: { x: this.generarNumeroAleatorioEntre(0.08, 0.15), y: 0, z: 0 },
      dur: this.generarNumeroAleatorioEntre(1500, 2000),
      dir: 'alternate',
      loop: true,
      easing: 'easeInOutQuad',
    },
  };

  return new Globo(newPos, newColor, newAnimations);
}

function calcularDuracionAleatoria() {
  // Obtener una velocidad aleatoria entre la mínima y máxima
  const velocidad = this.generarNumeroAleatorioEntre(
    MIN_VELOCIDAD_SUBIDA,
    MAX_VELOCIDAD_SUBIDA
  );

  // Calcular el tiempo a partir de la velocidad
  // v = d/t -> t = d/v
  // Se multiplica x1000 para pasar a milisegundos
  return (LIMITE_SUBIDA / velocidad) * 1000;
}

function generarNumeroAleatorioEntre(min, max) {
  return Math.random() * (max - min) + min;
}

function obtenerColorAleatorio() {
  return colores[Math.floor(generarNumeroAleatorioEntre(0, colores.length))];
}
