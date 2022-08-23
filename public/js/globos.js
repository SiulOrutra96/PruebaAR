window.addEventListener('load', initScene);

// Clase globo
class Globo {
  constructor(id, pos, gravedad, color) {
    this.id = id;

    // Vector de 3 valores {x: 0, y: 0, z: 0}
    this.pos = pos;

    // Que tan fuertees la gravedad para el globo
    // Si es positiva el globo flota si no se cae
    this.gravedad = gravedad;

    // Un color válido
    this.color = color;
  }
}

// Constantes
// const LIMITE_SUBIDA = 15;
const LIMITE_SUBIDA = 11;
const LIMITE_INFERIOR = -5;
const CANTIDAD_GLOBOS = 10;
const MAX_VELOCIDAD_SUBIDA = 1.7;
const MIN_VELOCIDAD_SUBIDA = 1.45;
const DIMENSIONES_CAMPO = { x: 5, z: 7 };
const MAX_GRAVEDAD = 2.5;
const MIN_GRAVEDAD = 2;
const RADIO_GLOBO_COLLIDER = 0.43;

const colores = [
  'aqua',
  'cornflowerblue',
  'crimson',
  'darkorange',
  'darkviolet',
  'greenyellow',
  'hotpink',
  'pink',
  'yellow',
];

// Contiene todos los globos de la escena
let globos = [];

AFRAME.registerComponent('reiniciar', {
  init: function () {
    const globo = this.el;
    globo.addEventListener('collide', (e) => {
      const target = e.detail.body.el;

      if (target.id === 'techo') {
        self.reiniciarGlobo(globo);
      }
    });
  },
});

function initScene() {
  this.crearGlobos();
  console.log('Globos: ', globos);
}

function crearGlobos() {
  for (let i = 0; i < CANTIDAD_GLOBOS; i++) {
    const globo = this.initGlobo(i);
    globos.push(globo);
    this.crearGlobo(globo);
  }
}

function initGlobo(id) {
  const newPos = this.obtenerPosicionAleatoria();
  const newGravedad = this.generarNumeroAleatorioEntre(
    MIN_GRAVEDAD,
    MAX_GRAVEDAD
  );
  const newColor = this.obtenerColorAleatorio();

  return new Globo(id, newPos, newGravedad, newColor);
}

// Legacy don't erase
// function crearGlobo(globo) {
//   const escena =
//     document.getElementById('hiroMarker') || document.getElementById('escena2');
//   const { pos, animations } = globo;

//   const globoEnt = document.createElement('a-entity');
//   globoEnt.object3D.position.set(pos.x, pos.y, pos.z);
//   globoEnt.setAttribute('animation', animations.subir);
//   escena.appendChild(globoEnt);

//   const globoEntJr = document.createElement('a-entity');
//   globoEntJr.object3D.position.set(0, 0, 0);
//   globoEntJr.setAttribute('animation', animations.oscilarX);
//   globoEnt.appendChild(globoEntJr);

//   const globoObj = document.createElement('a-obj-model');
//   globoObj.object3D.position.set(0, 0, 0);
//   globoObj.object3D.scale.set(0.85, 0.85, 0.85);
//   globoObj.setAttribute('src', '#globo-obj');
//   globoObj.setAttribute('material', { color: globo.color });
//   globoEntJr.setAttribute('animation', animations.oscilarZ);
//   globoEntJr.appendChild(globoObj);
// }

function crearGlobo(globo) {
  const escena =
    document.getElementById('hiroMarker') || document.getElementById('escena2');

  const { pos } = globo;

  const globoCollider = document.createElement('a-sphere');
  globoCollider.object3D.position.set(pos.x, pos.y, pos.z);
  globoCollider.id = 'globo' + globo.id;
  globoCollider.className = 'globo';
  globoCollider.setAttribute('color', globo.color);
  globoCollider.setAttribute('radius', RADIO_GLOBO_COLLIDER);
  globoCollider.setAttribute('dynamic-body', {
    linearDamping: 0.7,
    angularDamping: 1,
  });
  globoCollider.setAttribute('material', { visible: false });
  globoCollider.setAttribute('reiniciar', 'hi');
  globoCollider.setAttribute('explotador', 'hi');
  escena.appendChild(globoCollider);

  const globoObj = document.createElement('a-obj-model');
  // const mesh = new THREE.Mesh();
  // // Set mesh on entity.
  // globoObj.setObject3D('mesh', mesh);

  globoObj.object3D.position.set(0, -0.9, 0);
  globoObj.object3D.scale.set(0.85, 0.85, 0.85);
  globoObj.setAttribute('src', '#globo-obj');
  globoObj.setAttribute('material', { color: globo.color });
  globoCollider.appendChild(globoObj);
}

function obtenerPosicionAleatoria() {
  const x = this.generarNumeroAleatorioEntre(
    -(DIMENSIONES_CAMPO.x / 2),
    DIMENSIONES_CAMPO.x / 2
  );

  const y = this.generarNumeroAleatorioEntre(
    LIMITE_INFERIOR - 0.25,
    LIMITE_INFERIOR + 0.25
  );

  const z =
    this.generarNumeroAleatorioEntre(
      -(DIMENSIONES_CAMPO.z / 2),
      DIMENSIONES_CAMPO.z / 2
    ) - 5;
  return { x, y, z };
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
  return Math.floor((LIMITE_SUBIDA / velocidad) * 1000);
}

function generarNumeroAleatorioEntre(min, max) {
  return Math.random() * (max - min) + min;
}

function obtenerColorAleatorio() {
  return colores[Math.floor(generarNumeroAleatorioEntre(0, colores.length))];
}

function reiniciarGlobo(globo) {
  const globoIndex = globo.id.replace('globo', '');
  const globoItem = globos[globoIndex];

  globo.parentElement.removeChild(globo);
  this.crearGlobo(globoItem);
}
