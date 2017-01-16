var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();


renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xdddddd);
document.body.appendChild(renderer.domElement);

var earth=new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('2_no_clouds_4k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture('elev_bump_4k.jpg'),
        bumpScale: 0.005,
        specularMap: THREE.ImageUtils.loadTexture('water_4k.png'),
        specular: new THREE.Color('grey'),
        alphaMap: THREE.ImageUtils.loadTexture('earthlights1k.jpg')})
);

scene.add(earth);


scene.add(new THREE.AmbientLight(0x333333));
var light = new THREE.DirectionalLight(0xffffff, 0.3);
light.position.set(5,7,5);
scene.add(light);

camera.lookAt(scene.position);
camera.position.z = 1;


var clouds =new THREE.Mesh(
    new THREE.SphereGeometry(0.503, 32, 32),
    new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('fair_clouds_4k.png'),
        transparent: true
    })
);

scene.add(clouds);


var dome=new THREE.Mesh(
    new THREE.SphereGeometry(20, 64, 64),
    new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('scuqxfufnurjnphlgnir.jpg'),
        side: THREE.BackSide
    })
);

dome.rotation.y=180;

scene.add(dome);


var mouse	= {x : 0, y : 0};
document.addEventListener('mousemove', function(event){
    mouse.x	= (event.clientX / window.innerWidth ) - 0.5;
    mouse.y	= (event.clientY / window.innerHeight) - 0.5;
}, false);

var onRenderFcts= [];
onRenderFcts.push(function(delta, now){
    earth.rotation.y += 1/32 * delta;
});


onRenderFcts.push(function(delta, now){
    clouds.rotation.y += 1/8 * delta;
});


onRenderFcts.push(function(delta, now){
    camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3);
    camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3);
    camera.lookAt( scene.position )
});

onRenderFcts.push(function(){
    renderer.render( scene, camera );
});



var lastTimeMsec= null;
//function render() {

function animate(nowMsec){
    //controls.update();

    requestAnimationFrame(animate);
    lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
    var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec	= nowMsec;
    // call each update function
    onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/1000, nowMsec/1000);
    });
};

requestAnimationFrame( animate );
