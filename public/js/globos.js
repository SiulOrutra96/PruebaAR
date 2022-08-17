window.addEventListener('load', initScene);

class Globo {
  constructor(pos, color) {
    this.pos = pos;
    this.color = color;
  }
}

function initScene() {
  // const escena = document.getElementById('escena');
  // const globos = this.crearGlobos();

  // console.log('Globos: ', globos);
  // globos.forEach((globo, index) => {
  //   const pos = globo.pos;
  //   const globoObj = document.createElement('a-obj-model');

  //   globoObj.setAttribute('src', '#globo-obj');
  //   globoObj.setAttribute('material', { color: globo.color });
  //   globoObj.setAttribute('animation__subir', {
  //     property: 'position',
  //     to: { x: 0, y: 10, z: 0 },
  //     dur: 10000,
  //     loop: true,
  //     easing: 'linear',
  //   });
  //   globoObj.object3D.position.set(pos.x, pos.y, pos.z);

  //   globoObj.setAttribute('animation__subir', {
  //     property: 'position',
  //     from: {
  //       x: globoObj.object3D.position.x,
  //       y: globoObj.object3D.position.x,
  //       z: globoObj.object3D.position.x,
  //     },
  //     to: { x: 0, y: 10, z: 0 },
  //     dur: 2000,
  //     loop: true,
  //     easing: 'linear',
  //   });

  //   escena.appendChild(globoObj);
  // });
}

function crearGlobos() {
  const globos = [];

  const newPos = { x: 0, y: 0, z: -5 };
  const newColor = 'greenyellow';
  const globo = new Globo(newPos, newColor);
  globos.push(globo);

  return globos;
}
