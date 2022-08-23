window.addEventListener('load', initScene);

function initScene() {
  this.aframeExplotadorComponent();
}

var _slicedToArray = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i['return']) _i['return']();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError(
        'Invalid attempt to destructure non-iterable instance'
      );
    }
  };
})();

function forceWorldUpdate(threeElement) {
  var element = threeElement;
  while (element.parent) {
    element = element.parent;
  }

  element.updateMatrixWorld(true);
}

function forEachParent(element, lambda) {
  while (element.attachedToParent) {
    element = element.parentElement;
    lambda(element);
  }
}

function someParent(element, lambda) {
  while (element.attachedToParent) {
    element = element.parentElement;
    if (lambda(element)) {
      return true;
    }
  }
  return false;
}

function cameraPositionToVec3(camera, vec3) {
  vec3.set(
    camera.components.position.data.x,
    camera.components.position.data.y,
    camera.components.position.data.z
  );

  forEachParent(camera, function (element) {
    if (element.components && element.components.position) {
      vec3.set(
        vec3.x + element.components.position.data.x,
        vec3.y + element.components.position.data.y,
        vec3.z + element.components.position.data.z
      );
    }
  });
}

function localToWorld(THREE, threeCamera, vector) {
  forceWorldUpdate(threeCamera);
  return threeCamera.localToWorld(vector);
}

var _ref = (function unprojectFunction() {
    var initialized = false;

    var matrix = void 0;

    function initialize(THREE) {
      matrix = new THREE.Matrix4();

      return true;
    }

    return {
      unproject: function unproject(THREE, vector, camera) {
        var threeCamera = camera.components.camera.camera;

        initialized = initialized || initialize(THREE);

        vector.applyProjection(matrix.getInverse(threeCamera.projectionMatrix));

        return localToWorld(THREE, threeCamera, vector);
      },
    };
  })(),
  unproject = _ref.unproject;

function clientCoordsTo3DCanvasCoords(
  clientX,
  clientY,
  offsetX,
  offsetY,
  clientWidth,
  clientHeight
) {
  return {
    x: ((clientX - offsetX) / clientWidth) * 2 - 1,
    y: -((clientY - offsetY) / clientHeight) * 2 + 1,
  };
}

var _ref2 = (function screenCoordsToDirectionFunction() {
    var initialized = false;

    var mousePosAsVec3 = void 0;
    var cameraPosAsVec3 = void 0;

    function initialize(THREE) {
      mousePosAsVec3 = new THREE.Vector3();
      cameraPosAsVec3 = new THREE.Vector3();

      return true;
    }

    return {
      screenCoordsToDirection: function screenCoordsToDirection(
        THREE,
        aframeCamera,
        _ref3
      ) {
        var clientX = _ref3.x,
          clientY = _ref3.y;

        initialized = initialized || initialize(THREE);

        // scale mouse coordinates down to -1 <-> +1

        var _clientCoordsTo3DCanv = clientCoordsTo3DCanvasCoords(
            clientX,
            clientY,
            0,
            0, // TODO: Replace with canvas position
            window.innerWidth,
            window.innerHeight
          ),
          mouseX = _clientCoordsTo3DCanv.x,
          mouseY = _clientCoordsTo3DCanv.y;

        mousePosAsVec3.set(mouseX, mouseY, -1);

        // apply camera transformation from near-plane of mouse x/y into 3d space
        // NOTE: This should be replaced with THREE code directly once the aframe bug
        // is fixed:
        /*
          cameraPositionToVec3(aframeCamera, cameraPosAsVec3);
          const {x, y, z} = new THREE
           .Vector3(mouseX, mouseY, -1)
           .unproject(aframeCamera.components.camera.camera)
           .sub(cameraPosAsVec3)
           .normalize();
    */
        var projectedVector = unproject(THREE, mousePosAsVec3, aframeCamera);

        cameraPositionToVec3(aframeCamera, cameraPosAsVec3);

        // Get the unit length direction vector from the camera's position

        var _projectedVector$sub$ = projectedVector
            .sub(cameraPosAsVec3)
            .normalize(),
          x = _projectedVector$sub$.x,
          y = _projectedVector$sub$.y,
          z = _projectedVector$sub$.z;

        return { x: x, y: y, z: z };
      },
    };
  })(),
  screenCoordsToDirection = _ref2.screenCoordsToDirection;

var _ref6 = (function selectItemFunction() {
    var initialized = false;

    var cameraPosAsVec3 = void 0;
    var directionAsVec3 = void 0;
    var raycaster = void 0;
    var plane = void 0;

    function initialize(THREE) {
      plane = new THREE.Plane();
      cameraPosAsVec3 = new THREE.Vector3();
      directionAsVec3 = new THREE.Vector3();
      raycaster = new THREE.Raycaster();

      // TODO: From camera values?
      raycaster.far = Infinity;
      raycaster.near = 0;

      return true;
    }

    return {
      selectItem: function selectItem(
        THREE,
        selector,
        camera,
        clientX,
        clientY
      ) {
        initialized = initialized || initialize(THREE);

        var _screenCoordsToDirect = screenCoordsToDirection(THREE, camera, {
            x: clientX,
            y: clientY,
          }),
          directionX = _screenCoordsToDirect.x,
          directionY = _screenCoordsToDirect.y,
          directionZ = _screenCoordsToDirect.z;

        cameraPositionToVec3(camera, cameraPosAsVec3);
        directionAsVec3.set(directionX, directionY, directionZ);

        raycaster.set(cameraPosAsVec3, directionAsVec3);

        // Push meshes onto list of objects to intersect.
        // TODO: Can we do this at some other point instead of every time a ray is
        // cast? Is that a micro optimization?
        var objects = Array.from(
          camera.sceneEl.querySelectorAll('[' + selector + ']')
        ).map(function (object) {
          return object.object3D;
        });

        var recursive = true;

        var intersected = raycaster
          .intersectObjects(objects, recursive)
          // Only keep intersections against objects that have a reference to an entity.
          .filter(function (intersection) {
            return !!intersection.object.el;
          })
          // Only keep ones that are visible
          .filter(function (intersection) {
            return intersection.object.parent.visible;
          })[0]; // The first element is the closest // eslint-disable-line no-unexpected-multiline

        if (!intersected) {
          return {};
        }

        var point = intersected.point,
          object = intersected.object;

        // Aligned to the world direction of the camera
        // At the specified intersection point

        plane.setFromNormalAndCoplanarPoint(
          camera.components.camera.camera.getWorldDirection().clone().negate(),
          point.clone().sub(cameraPosAsVec3)
        );

        var depth = plane.constant;

        var offset = point.sub(object.getWorldPosition());

        return { depth: depth, offset: offset, element: object.el };
      },
    };
  })(),
  selectItem = _ref6.selectItem;

var _ref10 = (function getDidMountAndUnmount() {
    var removeClickListeners = void 0;
    var removeDragListeners = void 0;
    var cache = [];

    function initialize(THREE, componentName) {
      // TODO: Based on a scene from the element passed in?
      var scene = document.querySelector('a-scene');
      // delay loading of this as we're not 100% if the scene has loaded yet or not
      var camera = void 0;
      var draggedElement = void 0;

      function onMouseDown(_ref12) {
        var clientX = _ref12.clientX,
          clientY = _ref12.clientY;

        var _selectItem = selectItem(
            THREE,
            componentName,
            camera,
            clientX,
            clientY
          ),
          element = _selectItem.element;

        if (element && element.className === 'globo') {
          //   (function () {

          //   })();

          console.log('item: ', element);
          console.log('**EXPLOTAR**');
          reiniciarGlobo(element);
        }
      }

      function onTouchStart(_ref14) {
        var _ref14$changedTouches = _slicedToArray(_ref14.changedTouches, 1),
          touchInfo = _ref14$changedTouches[0];

        onMouseDown(touchInfo);
      }

      function run() {
        camera = scene.camera.el;

        // TODO: Attach to canvas?
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('touchstart', onTouchStart);

        removeClickListeners = function removeClickListeners(_) {
          document.removeEventListener('mousedown', onMouseDown);
          document.removeEventListener('touchstart', onTouchStart);
        };
      }

      if (scene.hasLoaded) {
        run();
      } else {
        scene.addEventListener('loaded', run);
      }
    }

    function tearDown() {
      removeClickListeners && removeClickListeners(); // eslint-disable-line no-unused-expressions
      removeClickListeners = undefined;
    }

    return {
      didMount: function didMount(element, THREE, componentName) {
        if (cache.length === 0) {
          initialize(THREE, componentName);
        }

        if (cache.indexOf(element) === -1) {
          cache.push(element);
        }
      },
      didUnmount: function didUnmount(element) {
        var cacheIndex = cache.indexOf(element);

        removeDragListeners && removeDragListeners(); // eslint-disable-line no-unused-expressions
        removeDragListeners = undefined;

        if (cacheIndex === -1) {
          return;
        }

        // remove that element
        cache.splice(cacheIndex, 1);

        if (cache.length === 0) {
          tearDown();
        }
      },
    };
  })(),
  didMount = _ref10.didMount,
  didUnmount = _ref10.didUnmount;

function aframeExplotadorComponent() {
  var componentName = 'explotador';

  var THREE = AFRAME.THREE;

  /**
   * Draggable component for A-Frame.
   */
  AFRAME.registerComponent(componentName, {
    schema: {},

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function init() {
      didMount(this, THREE, componentName);
    },

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     *
     * @param oldData
     */
    update: function update() {},

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove: function remove() {
      didUnmount(this);
    },

    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause: function pause() {
      didUnmount(this);
    },

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play: function play() {
      didMount(this, THREE, componentName);
    },
  });
}
