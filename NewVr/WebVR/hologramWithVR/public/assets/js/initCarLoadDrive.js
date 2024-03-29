var accelerate = 1;
var motion = 0;
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var STATS_ENABLED = false;

			var CARS = {

				"veyron": 	{

					name:	"Bugatti Veyron",
					url: 	"/obj/VeyronNoUv.js",
					author: '<a href="http://artist-3d.com/free_3d_models/dnm/model_disp.php?uid=1129" target="_blank">Troyano</a>',
					init_rotation: [ 0, 0, 0 ],
					scale: 5.5,
					init_material: 4,
					body_materials: [ 2 ],

					object: null,
					buttons: null,
					materials: null

				},

				"gallardo": {

					name: 	"Lamborghini Gallardo",
					url:	"/obj/GallardoNoUv.js",
					author: '<a href="http://artist-3d.com/free_3d_models/dnm/model_disp.php?uid=1711" target="_blank">machman_3d</a>',
					init_rotation: [ 0, 0, 0 ],
					scale: 3.7,
					init_material: 9,
					body_materials: [ 3 ],

					object:	null,
					buttons: null,
					materials: null

				},

				"f50": {

					name: 	"Ferrari F50",
					url:	"/obj/F50NoUv.js",
					author: '<a href="http://artist-3d.com/free_3d_models/dnm/model_disp.php?uid=1687" target="_blank">daniel sathya</a>',
					init_rotation: [ 0, 0, 0 ],
					scale: 0.175,
					init_material: 2,
					body_materials: [ 3, 6, 7, 8, 9, 10, 23, 24 ],

					object:	null,
					buttons: null,
					materials: null

				},

				"camaro": {

					name: 	"Chevrolet Camaro",
					url:	"/obj/CamaroNoUv.js",
					author: '<a href="http://www.turbosquid.com/3d-models/blender-camaro/411348" target="_blank">dskfnwn</a>',
					init_rotation: [ 0.0, 0.0, 0.0 /*0, 1, 0*/ ],
					scale: 75,
					init_material: 0,
					body_materials: [ 0 ],

					object:	null,
					buttons: null,
					materials: null

				}

			};


			var container = document.getElementById("carCanvas"), stats;

			var camera, scene, renderer;
			var cameraCube, sceneCube;

			var m, mi;
			var sphere;
			var directionalLight, pointLight;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			var group = new THREE.Object3D();//create an empty container
			var ground = new THREE.Object3D();//create an empty container
			

			var loader = new THREE.BinaryLoader( true );
			document.body.appendChild( loader.statusDomElement );

			init();
			animate();

			function init() {

				// CAMERAS

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
				cameraCube = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );

				// SCENE

				scene = new THREE.Scene();
				sceneCube = new THREE.Scene();

				// LIGHTS

				var ambient = new THREE.AmbientLight( 0x050505 );
				scene.add( ambient );

				directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
				directionalLight.position.set( 2, 1.2, 10 ).normalize();
				scene.add( directionalLight );

				directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
				directionalLight.position.set( -2, 1.2, -10 ).normalize();
				scene.add( directionalLight );

				pointLight = new THREE.PointLight( 0xffaa00, 2 );
				pointLight.position.set( 2000, 1200, 10000 );
				scene.add( pointLight );

				// Skybox

				var shader = THREE.ShaderLib[ "cube" ];
				//shader.uniforms[ "tCube" ].value = textureCube;

				var material = new THREE.ShaderMaterial( {

					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					depthWrite: false,
					side: THREE.BackSide

				} ),

				mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
				sceneCube.add( mesh );

				//

				renderer = new THREE.WebGLRenderer();
				//renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setFaceCulling( THREE.CullFaceNone );
				renderer.autoClear = false;

				container.appendChild( renderer.domElement );

				if ( STATS_ENABLED ) {

					stats = new Stats();
					stats.domElement.style.position = 'absolute';
					stats.domElement.style.top = '0px';
					stats.domElement.style.zIndex = 100;
					container.appendChild( stats.domElement );

				}

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				var r = "/assets/images/cars/";
				var urls = [ r + "posx.jpg", r + "negx.jpg",
							 r + "posy.jpg", r + "negy.jpg",
							 r + "posz.jpg", r + "negz.jpg" ];

				var textureCube = THREE.ImageUtils.loadTextureCube( urls );
				textureCube.format = THREE.RGBFormat;

				// common materials

				var mlib = {

				"Orange": 	new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 } ),
				"Blue": 	new THREE.MeshLambertMaterial( { color: 0x001133, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 } ),
				"Red": 		new THREE.MeshLambertMaterial( { color: 0x660000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),
				"Black": 	new THREE.MeshLambertMaterial( { color: 0x000000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.15 } ),
				"White":	new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),

				"Carmine": 	new THREE.MeshPhongMaterial( { color: 0x770000, specular:0xffaaaa, envMap: textureCube, combine: THREE.MultiplyOperation } ),
				"Gold": 	new THREE.MeshPhongMaterial( { color: 0xaa9944, specular:0xbbaa99, shininess:50, envMap: textureCube, combine: THREE.MultiplyOperation } ),
				"Bronze":	new THREE.MeshPhongMaterial( { color: 0x150505, specular:0xee6600, shininess:10, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),
				"Chrome": 	new THREE.MeshPhongMaterial( { color: 0xffffff, specular:0xffffff, envMap: textureCube, combine: THREE.MultiplyOperation } ),

				"Orange metal": new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: textureCube, combine: THREE.MultiplyOperation } ),
				"Blue metal": 	new THREE.MeshLambertMaterial( { color: 0x001133, envMap: textureCube, combine: THREE.MultiplyOperation } ),
				"Red metal": 	new THREE.MeshLambertMaterial( { color: 0x770000, envMap: textureCube, combine: THREE.MultiplyOperation } ),
				"Green metal": 	new THREE.MeshLambertMaterial( { color: 0x007711, envMap: textureCube, combine: THREE.MultiplyOperation } ),
				"Black metal":	new THREE.MeshLambertMaterial( { color: 0x222222, envMap: textureCube, combine: THREE.MultiplyOperation } ),

				"Pure chrome": 	new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: textureCube } ),
				"Dark chrome":	new THREE.MeshLambertMaterial( { color: 0x444444, envMap: textureCube } ),
				"Darker chrome":new THREE.MeshLambertMaterial( { color: 0x222222, envMap: textureCube } ),

				"Black glass": 	new THREE.MeshLambertMaterial( { color: 0x101016, envMap: textureCube, opacity: 0.975, transparent: true } ),
				"Dark glass":	new THREE.MeshLambertMaterial( { color: 0x101046, envMap: textureCube, opacity: 0.25, transparent: true } ),
				"Blue glass":	new THREE.MeshLambertMaterial( { color: 0x668899, envMap: textureCube, opacity: 0.75, transparent: true } ),
				"Light glass":	new THREE.MeshBasicMaterial( { color: 0x223344, envMap: textureCube, opacity: 0.25, transparent: true, combine: THREE.MixOperation, reflectivity: 0.25 } ),

				"Red glass":	new THREE.MeshLambertMaterial( { color: 0xff0000, opacity: 0.75, transparent: true } ),
				"Yellow glass":	new THREE.MeshLambertMaterial( { color: 0xffffaa, opacity: 0.75, transparent: true } ),
				"Orange glass":	new THREE.MeshLambertMaterial( { color: 0x995500, opacity: 0.75, transparent: true } ),

				"Orange glass 50":	new THREE.MeshLambertMaterial( { color: 0xffbb00, opacity: 0.5, transparent: true } ),
				"Red glass 50": 	new THREE.MeshLambertMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } ),

				"Fullblack rough":	new THREE.MeshLambertMaterial( { color: 0x000000 } ),
				"Black rough":		new THREE.MeshLambertMaterial( { color: 0x050505 } ),
				"Darkgray rough":	new THREE.MeshLambertMaterial( { color: 0x090909 } ),
				"Red rough":		new THREE.MeshLambertMaterial( { color: 0x330500 } ),

				"Darkgray shiny":	new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x050505 } ),
				"Gray shiny":		new THREE.MeshPhongMaterial( { color: 0x050505, shininess: 20 } )

				}

				// Gallardo materials

				CARS[ "gallardo" ].materials = {

					body: [

						[ "Orange", 	mlib[ "Orange" ] ],
						[ "Blue", 		mlib[ "Blue" ] ],
						[ "Red", 		mlib[ "Red" ] ],
						[ "Black", 		mlib[ "Black" ] ],
						[ "White", 		mlib[ "White" ] ],

						[ "Orange metal", 	mlib[ "Orange metal" ] ],
						[ "Blue metal", 	mlib[ "Blue metal" ] ],
						[ "Green metal", 	mlib[ "Green metal" ] ],
						[ "Black metal", 	mlib[ "Black metal" ] ],

						[ "Carmine", 	mlib[ "Carmine" ] ],
						[ "Gold", 		mlib[ "Gold" ] ],
						[ "Bronze", 	mlib[ "Bronze" ] ],
						[ "Chrome", 	mlib[ "Chrome" ] ]

					]

				}

				m = CARS[ "gallardo" ].materials;
				mi = CARS[ "gallardo" ].init_material;

				CARS[ "gallardo" ].mmap = {

					0: mlib[ "Pure chrome" ], 	// wheels chrome
					1: mlib[ "Black rough" ],   // tire
					2: mlib[ "Black glass" ], 	// windshield
					3: m.body[ mi ][ 1 ], 		// body
					4: mlib[ "Red glass" ],    	// back lights
					5: mlib[ "Yellow glass" ],  // front lights
					6: mlib[ "Dark chrome" ]	// windshield rim

				}

				// Veyron materials

				CARS[ "veyron" ].materials = {

					body: [

						[ "Orange metal", 	mlib[ "Orange metal" ] ],
						[ "Blue metal", 	mlib[ "Blue metal" ] ],
						[ "Red metal", 		mlib[ "Red metal" ] ],
						[ "Green metal",	mlib[ "Green metal" ] ],
						[ "Black metal", 	mlib[ "Black metal" ] ],

						[ "Gold", 		mlib[ "Gold" ] ],
						[ "Bronze", 	mlib[ "Bronze" ] ],
						[ "Chrome", 	mlib[ "Chrome" ] ]

					],

				}

				m = CARS[ "veyron" ].materials;
				mi = CARS[ "veyron" ].init_material;

				CARS[ "veyron" ].mmap = {

					0: mlib[ "Black rough" ],		// tires + inside
					1: mlib[ "Pure chrome" ],		// wheels + extras chrome
					2: m.body[ mi ][ 1 ], 			// back / top / front torso
					3: mlib[ "Dark glass" ],		// glass
					4: mlib[ "Pure chrome" ],		// sides torso
					5: mlib[ "Pure chrome" ],		// engine
					6: mlib[ "Red glass 50" ],		// backlights
					7: mlib[ "Orange glass 50" ]	// backsignals

				}

				// F50 materials

				CARS[ "f50" ].materials = {

					body: [

						[ "Orange", 	mlib[ "Orange" ] ],
						[ "Blue", 		mlib[ "Blue" ] ],
						[ "Red", 		mlib[ "Red" ] ],
						[ "Black", 		mlib[ "Black" ] ],
						[ "White", 		mlib[ "White" ] ],

						[ "Orange metal", 	mlib[ "Orange metal" ] ],
						[ "Blue metal", 	mlib[ "Blue metal" ] ],
						[ "Black metal", 	mlib[ "Black metal" ] ],

						[ "Carmine", 	mlib[ "Carmine" ] ],
						[ "Gold", 		mlib[ "Gold" ] ],
						[ "Bronze", 	mlib[ "Bronze" ] ],
						[ "Chrome", 	mlib[ "Chrome" ] ]

					],

				}

				m = CARS[ "f50" ].materials;
				mi = CARS[ "f50" ].init_material;

				CARS[ "f50" ].mmap = {

					0:  mlib[ "Dark chrome" ], 		// interior + rim
					1:  mlib[ "Pure chrome" ], 		// wheels + gears chrome
					2:  mlib[ "Blue glass" ], 		// glass
					3:  m.body[ mi ][ 1 ], 			// torso mid + front spoiler
					4:  mlib[ "Darkgray shiny" ], 	// interior + behind seats
					5:  mlib[ "Darkgray shiny" ], 	// tiny dots in interior
					6:  m.body[ mi ][ 1 ], 			// back torso
					7:  m.body[ mi ][ 1 ], 			// right mirror decal
					8:  m.body[ mi ][ 1 ], 			// front decal
					9:  m.body[ mi ][ 1 ], 			// front torso
					10: m.body[ mi ][ 1 ], 			// left mirror decal
					11: mlib[ "Pure chrome" ], 		// engine
					12: mlib[ "Darkgray rough" ],	// tires side
					13: mlib[ "Darkgray rough" ],	// tires bottom
					14: mlib[ "Darkgray shiny" ], 	// bottom
					15: mlib[ "Black rough" ],		// ???
					16: mlib[ "Orange glass" ],		// front signals
					17: mlib[ "Dark chrome" ], 		// wheels center
					18: mlib[ "Red glass" ], 		// back lights
					19: mlib[ "Black rough" ], 		// ???
					20: mlib[ "Red rough" ], 		// seats
					21: mlib[ "Black rough" ], 		// back plate
					22: mlib[ "Black rough" ], 		// front light dots
					23: m.body[ mi ][ 1 ], 			// back torso
					24: m.body[ mi ][ 1 ] 			// back torso center

				}


				// Camero materials

				CARS[ "camaro" ].materials = {

					body: [

						[ "Orange", 	mlib[ "Orange" ] ],
						[ "Blue", 		mlib[ "Blue" ] ],
						[ "Red", 		mlib[ "Red" ] ],
						[ "Black", 		mlib[ "Black" ] ],
						[ "White", 		mlib[ "White" ] ],

						[ "Orange metal", 	mlib[ "Orange metal" ] ],
						[ "Blue metal", 	mlib[ "Blue metal" ] ],
						[ "Red metal", 		mlib[ "Red metal" ] ],
						[ "Green metal", 	mlib[ "Green metal" ] ],
						[ "Black metal", 	mlib[ "Black metal" ] ],

						[ "Gold", 		mlib[ "Gold" ] ],
						[ "Bronze", 	mlib[ "Bronze" ] ],
						[ "Chrome", 	mlib[ "Chrome" ] ]

					],

				}

				m = CARS[ "camaro" ].materials;
				mi = CARS[ "camaro" ].init_material;

				CARS[ "camaro" ].mmap = {

					0: m.body[ mi ][ 1 ], 			// car body
					1: mlib[ "Pure chrome" ], 		// wheels chrome
					2: mlib[ "Pure chrome" ], 		// grille chrome
					3: mlib[ "Dark chrome" ], 		// door lines
					4: mlib[ "Light glass" ], 		// windshield
					5: mlib[ "Gray shiny" ],        // interior
					6: mlib[ "Black rough" ],       // tire
					7: mlib[ "Fullblack rough" ],   // tireling
					8: mlib[ "Fullblack rough" ]    // behind grille

				}

				//loader.load( CARS[ "veyron" ].url, function( geometry ) { createScene( geometry, "veyron" ) } );

				for( var c in CARS ) initCarButton( c );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				cameraCube.aspect = window.innerWidth / window.innerHeight;
				cameraCube.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function initCarButton( car ) {

					if ( ! CARS[ car ].object ) {

						loader.statusDomElement.style.display = "block";
						loader.load( CARS[ car ].url, function( geometry ) { createScene( geometry, car ) } );

					} else {

						switchCar( car );

					}


			}

			function button_name( car, index ) { return "m_" + car  + "_" + index }

			function switchCar( car ) {

				for ( var c in CARS ) {

					if ( c != car && CARS[ c ].object ) {

						CARS[ c ].object.visible = false;
						CARS[ c ].buttons.style.display = "none";

					}
				}

				CARS[ car ].object.visible = true;
				CARS[ car ].buttons.style.display = "block";

				$( "#car_name" ).innerHTML = CARS[ car ].name + " model";
				$( "#car_author" ).innerHTML = CARS[ car ].author;

			}

			function createButtons( materials, car ) {

				var buttons, i, src = "";

				for( i = 0; i < materials.length; i ++ ) {

					src += '<button id="' + button_name( car, i ) + '">' + materials[ i ][ 0 ] + '</button> ';

				}

				buttons = document.createElement( "div" );
				buttons.innerHTML = src;

				document.getElementById( "buttons_materials" ).appendChild( buttons );

				return buttons;

			}

			function attachButtonMaterials( materials, faceMaterial, material_indices, car ) {

				for( var i = 0; i < materials.length; i ++ ) {
					document.getElementById( button_name( car, i ) ).counter = i;
					document.getElementById( button_name( car, i ) ).addEventListener( 'click', function() {
						for ( var j = 0; j < material_indices.length; j ++ ) {

							faceMaterial.materials[ material_indices [ j ] ] = materials[ this.counter ][ 1 ];

						}

					}, false );

				}

			}

			function createScene( geometry, car ) {

				loader.statusDomElement.innerHTML = "Creating model ...";

				var m = new THREE.MeshFaceMaterial(),
					s = CARS[ car ].scale * 1,
					r = CARS[ car ].init_rotation,
					materials = CARS[ car ].materials,
					mi = CARS[ car ].init_material,
					bm = CARS[ car ].body_materials;

				for ( var i in CARS[ car ].mmap ) {

					m.materials[ i ] = CARS[ car ].mmap[ i ];

				}

				var mesh = new THREE.Mesh( geometry, m );
				var plane = new THREE.PlaneGeometry( 600, 600, 32 );
				var cylinder = new THREE.CylinderGeometry( 8000, 8000, 6000, 80 );
				
				//var geometry2 = new THREE.SphereGeometry( 5000, 80, 80 );
				var roadMap = THREE.ImageUtils.loadTexture('/assets/images/roadMap.png'); 
				var tree1Img = THREE.ImageUtils.loadTexture('/assets/images/tree1.png'); 
				var tree2Img = THREE.ImageUtils.loadTexture('/assets/images/tree2.png'); 
				var roadMat = new THREE.MeshBasicMaterial({map:roadMap,transparent: true, opacity: 1});
				var tree1Mat = new THREE.MeshBasicMaterial({map:tree1Img,transparent: true, opacity: 1});
				var tree2Mat = new THREE.MeshBasicMaterial({map:tree2Img,transparent: true, opacity: 1});

				var material3 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
				
				var tree1 = new THREE.Mesh( plane, tree1Mat );
				var tree2 = new THREE.Mesh( plane, tree2Mat );
					sphere = new THREE.Mesh( cylinder, roadMat );

					mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
					mesh.rotation.x = r[ 0 ];
					mesh.rotation.y = r[ 1 ];
					mesh.rotation.z = r[ 2 ];
					sphere.rotation.z = 90 * Math.PI / 180;
				
				
				//ground.applyMatrix(new THREE.Matrix4().makeTranslation( 0, -4000, -4000 ) );
				//ground.position.copy( objMesh.centroid );
				ground.add( sphere );
				ground.add( tree1 );
				ground.add( tree2 );
				tree1.position.y = 8400;
				tree2.position.y = 8400;
				ground.position.y = -7700;


				group.add( mesh );
				//group.add( ground );
				scene.add( group );
				scene.add(ground);
				//ground.rotation.y = 180 * Math.PI / 180;
				
				mesh.position.z = -2400;
				mesh.position.x = -50;
				mesh.rotation.x =  -20 * Math.PI / 180;
				tree1.position.x = -2000;
				tree2.position.x = 2000;



				CARS[ car ].object = mesh;

				CARS[ car ].buttons = createButtons( materials.body, car );
				attachButtonMaterials( materials.body, m, bm, car );
				switchCar( car );

				loader.statusDomElement.style.display = "none";
				loader.statusDomElement.innerHTML = "Loading model ...";

			}

			function onDocumentMouseMove(event) {

				mouseY = ( event.clientY - window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}
			
			function rotateCar(data){
				motion = data.clientZ;
				group.rotation.y = (((data.clientZ / 10)+165) * Math.PI / 180);
			}

			function render() {

				var timer = -0.0002 * Date.now();

				//camera.position.x = 1000 * Math.cos( timer );
				//camera.position.y += ( - mouseY - camera.position.y ) * .05;
				//camera.position.z = 1000 * Math.sin( timer );

				ground.rotation.x += accelerate * Math.PI / 180;

				if(motion > 180){
					group.position.x -= 2;	
				}else{
					group.position.x += 2;
				}
				if(group.position.x > 1400 || group.position.x < -1750){
					socket.emit('accident', true);
				}
				

				camera.position.x = 0;
				camera.position.y = 1000;
				camera.position.z = 4600;
				camera.lookAt( scene.position );
				//cameraCube.rotation.copy( camera.rotation );

				
				renderer.render( scene, camera );

				if ( STATS_ENABLED ) stats.update();

			}
