window.addEventListener('load', initScene);

const meteors = [
    {x: 20, y: 0, z: 20},
    {x: 20, y: 0, z: -20},
    {x: -20, y: 0, z: 20},
    {x: -20, y: 0, z: -20},
    {x: 0, y: 0, z: 30},
    {x: 0, y: 0, z: -30},
    {x: 30, y: 0, z: 0},
    {x: -30, y: 0, z: 0},
]

function initScene() {
    const orbits = document.querySelectorAll('.orbit');

    orbits.forEach(orbit => {
        meteors.forEach(pos => {
            const meteor = document.createElement('a-entity');
            meteor.setAttribute('geometry', { primitive: 'sphere', radius: Math.random() * 3 + 0.5 });
            meteor.setAttribute('material', { shader: 'flat', src: '#meteor' });
            meteor.setAttribute('animation', { property: 'rotation', to: {x: 0, y: 360, z: 0}, dur: Math.random() * 6000 + 4000, loop: true, easing: 'linear' });
            meteor.object3D.position.set(pos.x, pos.y, pos.z);

            orbit.appendChild(meteor);
        });
    });
};