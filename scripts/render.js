
window.onload = function() {
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  let renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xdddddd);
  document.body.appendChild(renderer.domElement);

  let earth=new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhongMaterial({
          map: THREE.ImageUtils.loadTexture('images/no_clouds_4k.jpg'),
          bumpMap: THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
          bumpScale: 0.005,
          specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
          specular: new THREE.Color('grey'),
          alphaMap: THREE.ImageUtils.loadTexture('images/earthlights1k.jpg')})
  );


  let light = new THREE.DirectionalLight(0xffffff, 0.3);
  light.position.set(5,7,5);

  camera.lookAt(scene.position);
  camera.position.z = 1;

  let clouds =new THREE.Mesh(
      new THREE.SphereGeometry(0.503, 32, 32),
      new THREE.MeshPhongMaterial({
          map: THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
          transparent: true
      })
  );

  let dome=new THREE.Mesh(
      new THREE.SphereGeometry(20, 64, 64),
      new THREE.MeshBasicMaterial({
          map: THREE.ImageUtils.loadTexture('images/space_texture.jpg'),
          side: THREE.BackSide
      })
  );

  dome.rotation.y=180;

  scene.add(earth);
  scene.add(new THREE.AmbientLight(0x333333));
  scene.add(light);
  scene.add(clouds);
  scene.add(dome);


  let mouse	= {x : 0, y : 0};
  document.addEventListener('mousemove', function(event){
      mouse.x	= (event.clientX / window.innerWidth ) - 0.5;
      mouse.y	= (event.clientY / window.innerHeight) - 0.5;
  }, false);

  let onRenderFcts= [];
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



  let lastTimeMsec= null;
  //function render() {

  function animate(nowMsec){
      //controls.update();

      requestAnimationFrame(animate);
      lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
      let deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
      lastTimeMsec	= nowMsec;
      // call each update function
      onRenderFcts.forEach(function(onRenderFct){
          onRenderFct(deltaMsec/1000, nowMsec/1000);
      });
  };
  
  requestAnimationFrame( animate );
}
