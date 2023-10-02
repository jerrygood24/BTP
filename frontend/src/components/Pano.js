import React, { useEffect } from 'react';
import Marzipano from 'marzipano';
import '../css/Pano.css'

const Pano = () => {
  useEffect(() => {
    console.log('Initializing Marzipano viewer...');

    const panoElement = document.getElementById('pano');
    
    // Check if the viewer has already been created for this element
    if (panoElement.marzipanoViewer) {
      console.log('Marzipano viewer already initialized.');
      return;
    }
    
    // Create the viewer
    const viewerOpts = {
      controls: {
        mouseViewMode: 'drag'
      }
    };

    const viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    const levels = [
      { tileSize: 512, size: 512 },
      { tileSize: 512, size: 1024 }
    ];

    const source = Marzipano.ImageUrlSource.fromString('img/hongkong_img.jpg');
    const geometry = new Marzipano.EquirectGeometry(levels);
    // const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
    const view = new Marzipano.RectilinearView();

    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      // pinFirstLevel: true,
    });

    scene.switchTo({
      transitionDuration: 1000
    });
    
    var destinationViewParameters = {
      yaw: 10 * Math.PI/180,
      pitch: 15 * Math.PI/180,
      fov: 60 * Math.PI/180
    };
    
    var options = {
      transitionDuration: 2000
    }
    
    scene.lookTo(destinationViewParameters, options);

    var autorotate = Marzipano.autorotate({
      yawSpeed: 0.1,         // Yaw rotation speed
      targetPitch: 0,        // Pitch value to converge to
      targetFov: Math.PI/2   // Fov value to converge to
    });
    
    // Autorotate will start after 3s of idle time
    viewer.setIdleMovement(1000, autorotate);  
    // Disable idle movement
    // viewer.setIdleMovement(Infinity);
    
    // Start autorotation immediately
    viewer.startMovement(autorotate); 
    // Stop any ongoing automatic movement
    viewer.stopMovement();

    // var imgHotspot = document.createElement('img');
    // imgHotspot.src = 'img/25530.jpg';
    // imgHotspot.classList.add('hotspot');
    // imgHotspot.addEventListener('click', function() {
    //   switchScene(findSceneById(hotspot.target));
    // });

    // var position = { yaw: Math.PI/4, pitch: Math.PI/8 };

    // scene.hotspotContainer().createHotspot(imgHotspot, position);
  }, []);

  // Handle resizing of the Marzipano canvas
  const handleResize = () => {
    const panoElement = document.getElementById('pano');
    const viewer = panoElement.marzipanoViewer;

    if (viewer) {
      viewer.resize();
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div id="pano" ></div>;
};

export default Pano;
