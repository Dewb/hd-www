

var container;
var camera, scene, renderer;
var video, texture, material, mesh;
var composer;

function init3d() {

	console.log("foo");

	container = $('div', { id: "renderCanvas" } );
	$("body").append(container);

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 500;

	scene = new THREE.Scene();

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0.5, 1, 1 ).normalize();
	scene.add( light );

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.append( renderer.domElement );

	video = document.getElementsByTagName( 'video' )[0];

	texture = new THREE.VideoTexture( video );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format = THREE.RGBFormat;

	//

	var geometry;

	var parameters = { color: 0xffffff, map: texture };



		var geometry = new THREE.BoxGeometry( 30, 30, 30 );
		
		material = new THREE.MeshLambertMaterial( parameters );

		material.color.setHSL( 0.8, 0.4, 0.5 );

		mesh = new THREE.Mesh( geometry, material );

		mesh.position.x = 0;
		mesh.position.y = 0;
		mesh.position.z = 0;

		mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;

		scene.add( mesh );


	renderer.autoClear = false;


	// postprocessing

	var renderModel = new THREE.RenderPass( scene, camera );
	var effectBloom = new THREE.BloomPass( 1.3 );
	var effectCopy = new THREE.ShaderPass( THREE.CopyShader );

	effectCopy.renderToScreen = true;

	composer = new THREE.EffectComposer( renderer );

	composer.addPass( renderModel );
	composer.addPass( effectBloom );
	composer.addPass( effectCopy );


	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	composer.reset();

}

function change_uvs( geometry, unitx, unity, offsetx, offsety ) {

	var faceVertexUvs = geometry.faceVertexUvs[ 0 ];

	for ( var i = 0; i < faceVertexUvs.length; i ++ ) {

		var uvs = faceVertexUvs[ i ];

		for ( var j = 0; j < uvs.length; j ++ ) {

			var uv = uvs[ j ];

			uv.x = ( uv.x + offsetx ) * unitx;
			uv.y = ( uv.y + offsety ) * unity;

		}

	}

}


function animate() {

	requestAnimationFrame( animate );

	render();

}

var h, counter = 1;

function render() {

	var time = Date.now() * 0.00005;

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	camera.lookAt( scene.position );

	for ( i = 0; i < cube_count; i ++ ) {

		material = materials[ i ];

		h = ( 360 * ( material.hue + time ) % 360 ) / 360;
		material.color.setHSL( h, material.saturation, 0.5 );

	}

	if ( counter % 1000 > 200 ) {

		for ( i = 0; i < cube_count; i ++ ) {

			mesh = meshes[ i ];

			mesh.rotation.x += 10 * mesh.dx;
			mesh.rotation.y += 10 * mesh.dy;

			mesh.position.x += 200 * mesh.dx;
			mesh.position.y += 200 * mesh.dy;
			mesh.position.z += 400 * mesh.dx;

		}

	}

	if ( counter % 1000 === 0 ) {

		for ( i = 0; i < cube_count; i ++ ) {

			mesh = meshes[ i ];

			mesh.dx *= -1;
			mesh.dy *= -1;

		}

	}

	counter ++;

	renderer.clear();
	composer.render();

}
