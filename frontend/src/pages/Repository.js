import React, { useEffect } from 'react';
import Marzipano from 'marzipano';

const MarzipanoViewer = () => {
  useEffect(() => {
    console.log('Initializing Marzipano viewer...');
    // const viewerElement = document.getElementById('marzipano-viewer');
    // console.log('Viewer element:', viewerElement);

    const panoElement = document.getElementById('pano');
    const viewerOpts = {
      controls: {
        mouseViewMode: 'drag'    // drag|qtvr
      }
    };

    const viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    const levels = [
      { tileSize: 512, size: 512 },
      { tileSize: 512, size: 1024 }
    ];

    const source = Marzipano.ImageUrlSource.fromString('http://localhost:3000/img/b3.jpeg');
    // const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
    const geometry = new Marzipano.EquirectGeometry(levels);
    const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
    const view = new Marzipano.RectilinearView({}, limiter);

    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true,
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
  }, []);

  return <div id="pano" style={{ width: '100%', height: '500px', background: '#ffcccc4d' }}></div>;
};

export default MarzipanoViewer;
