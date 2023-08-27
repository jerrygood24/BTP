import React, { useEffect } from 'react';
import Marzipano from 'marzipano';
// import 'marzipano/dist/css/marzipano.css';

const MarzipanoViewer = () => {
  useEffect(() => {
    console.log('Initializing Marzipano viewer...');
    const viewerElement = document.getElementById('marzipano-viewer');
    console.log('Viewer element:', viewerElement);

    const viewer = new Marzipano.Viewer(viewerElement);

    const source = Marzipano.ImageUrlSource.fromString('/b.jpeg');
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
    const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100*Math.PI/180);
    const view = new Marzipano.RectilinearView({}, limiter);

    const scene = viewer.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true,
    });

    viewer.switchScene(scene);

    console.log('Marzipano viewer initialized.');
  }, []);

  return <div id="marzipano-viewer" style={{ width: '100%', height: '500px' }}></div>;
};

export default MarzipanoViewer;
