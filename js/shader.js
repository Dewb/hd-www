// hd-www 
// shader.js
// mpd 2016/06/27

var container;
var camera, scene, renderer;
var video, texture, material, mesh;
var composer;

function init3d() {

	container = $('<div>', { id: "renderCanvas" } );
	$("body").append(container);

	var w = window.innerWidth;
	var h = window.innerHeight;
	camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 1, 10000);
	camera.position.z = 1;

	scene = new THREE.Scene();

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0.5, 1, 1 ).normalize();
	scene.add( light );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.append(renderer.domElement);

	video = document.getElementsByTagName('video')[0];

	texture = new THREE.VideoTexture(video);
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format = THREE.RGBFormat;

	var geometry = new THREE.PlaneGeometry(1, 1);

	material = new THREE.MeshLambertMaterial({ 
		color: 0xffffff, 
		map: texture 
	});

	mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = 0;
	mesh.position.y = 0;
	mesh.position.z = 0;
	mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
	scene.add( mesh );

	renderer.autoClear = false;

	var renderModel = new THREE.RenderPass(scene, camera);
	var effectBloom = new THREE.BloomPass(1.7);
	var effectCopy = new THREE.ShaderPass(THREE.CopyShader);

	effectCopy.renderToScreen = true;

	composer = new THREE.EffectComposer(renderer);

	composer.addPass(renderModel);
	composer.addPass(effectBloom);
	composer.addPass(effectCopy);

	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

	var w = window.innerWidth;
	var h = window.innerHeight;
	
	camera.left = -w/2;
	camera.right = w/2;
	camera.top = h/2;
	camera.bottom = -h/2;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
	composer.reset();

}


function render3d() {

	renderer.clear();
	composer.render();

}

function updateVideoTexture(video) {

	texture.image = video;

	var vw = video.videoWidth;
	var vh = video.videoHeight;

	var sw = window.innerWidth;
	var sh = window.innerHeight;

	mesh.scale.x = Math.max(sw, sh * (vw/vh));
	mesh.scale.y = Math.max(sh, sw * (vh/vw));

}
