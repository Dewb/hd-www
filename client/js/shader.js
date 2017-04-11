// hd-www 
// shader.js
// mpd 2016/06/27

import ConvolutionShader from 'three/examples/js/shaders/ConvolutionShader'
import BrightnessContrastShader from 'three/examples/js/shaders/BrightnessContrastShader'
import CopyShader from 'three/examples/js/shaders/CopyShader'
import EffectComposer from 'three/examples/js/postprocessing/EffectComposer'
import RenderPass from 'three/examples/js/postprocessing/RenderPass'
import MaskPass from 'three/examples/js/postprocessing/MaskPass'
import BloomPass from 'three/examples/js/postprocessing/BloomPass'
import ShaderPass from 'three/examples/js/postprocessing/ShaderPass'

var container;
var camera, scene, renderer;
var video, texture, material, mesh;
var composer;

var effectTanline;


export function init3d() {

	THREE.TanlineShader = {
		uniforms: {
			"tDiffuse": { value: null },
			"opacity":  { value: 0.4 },
			"time": { value: 0.0 },
		},
		vertexShader: $('#vertex_shader').text(),
		fragmentShader: $('#tanline_fragment_shader').text()
	};

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
	var effectBloom = new THREE.BloomPass(1.45);
	effectTanline = new THREE.ShaderPass(THREE.TanlineShader);
	var effectBright = new THREE.ShaderPass(THREE.BrightnessContrastShader);
	var effectCopy = new THREE.ShaderPass(THREE.CopyShader);

	effectCopy.renderToScreen = true;

	effectBright.material.uniforms.brightness.value = -0.06;
	effectBright.material.uniforms.contrast.value = 0.15;

	composer = new THREE.EffectComposer(renderer);

	composer.addPass(renderModel);
	composer.addPass(effectTanline);
	composer.addPass(effectBright);
	composer.addPass(effectBloom);
	composer.addPass(effectCopy);

	window.addEventListener('resize', onWindowResize, false);

}

export function onWindowResize() {

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

export function render3d() {

    effectTanline.material.uniforms.time.value += 0.001;
	renderer.clear();
	composer.render();

}

export function updateVideoTexture(video) {

	texture.image = video;

	var vw = video.videoWidth;
	var vh = video.videoHeight;

	var sw = window.innerWidth;
	var sh = window.innerHeight;

	mesh.scale.x = Math.max(sw, sh * (vw/vh));
	mesh.scale.y = Math.max(sh, sw * (vh/vw));

}
