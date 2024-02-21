import React, { useEffect, useState, useCallback } from "react";
import Marzipano from "marzipano";
import "../css/Pano.css";
import { Box, Button } from "@mui/material";

const Pano = () => {
  const [viewer, setViewer] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [scenesReady, setScenesReady] = useState(false);
  const fetchScenesAndHotspots = async () => {
    try {
      const scenesResponse = await fetch('http://127.0.0.1:8000/accounts/scenes/');
      const scenesData = await scenesResponse.json();
      for (const scene of scenesData) {
        console.log(`Fetching hotspots for scene: ${scene.id}`); 
        const hotspotsResponse = await fetch(`http://127.0.0.1:8000/accounts/hotspots/?scene=${scene.id}`);
        const hotspotsData = await hotspotsResponse.json();
        scene.hotspots = hotspotsData;
        console.log(scene.hotspots);
      }
      setScenes(scenesData);
      setScenesReady(true);
      // console.log("Scenes Added: ", scenesData);
    } catch (error) {
      // console.error('Error fetching scenes and hotspots:', error);
    }
  };
  useEffect(() => {
    console.log("Initializing Marzipano viewer...");

    const panoElement = document.getElementById("pano");
    if (!panoElement.marzipanoViewer) {
      const viewerOpts = {
        controls: {
          mouseViewMode: "drag",
        },

      };

      const newViewer = new Marzipano.Viewer(panoElement, viewerOpts);
      // console.log("viewer initialized:", newViewer)
      setViewer(newViewer);
      // fetchScenesAndHotspots();
    }
  }, []);

  useEffect(() => {
    if (viewer && scenesReady) {
      // console.log('First scene:', scenes[0]);
      // console.log('Second scene:', scenes[1]);
      const newScenes = scenes.map(sceneData => {
        const levels = [
          { tileSize: 512, size: 512 },
          { tileSize: 512, size: 1024 },
        ];
        const source = Marzipano.ImageUrlSource.fromString(sceneData.imagePath);
        const geometry = new Marzipano.EquirectGeometry(levels);
        const limiter = Marzipano.RectilinearView.limit.traditional(1024, 120 * Math.PI / 180);
        const view = new Marzipano.RectilinearView(null, limiter);

        const marzipanoScene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true
        });
        // console.log(`Marzipano scene for ${sceneData.id}:`, marzipanoScene);
        sceneData.hotspots.forEach(hotspot => {
          var element = document.createElement('div');
          element.classList.add('hotspot');
          element.innerText = hotspot.text;
          marzipanoScene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
        });
        return { ...sceneData, scene: marzipanoScene };
      });
      // console.log('New scenes with Marzipano scenes:', newScenes);
      setScenes(newScenes);
      
      setScenesReady(false);
      newScenes[0].scene.switchTo();

    }
    else {
      if(!viewer){
        console.log('No viewer available');
      }
      else{
        console.log("Viewer is there: ",viewer);
        console.log('No Scenes available');
    }
  }
  }, [viewer,scenesReady]);
  const switchScene = (sceneId) => {
    // console.log('Attempting to switch scene. Available scenes:', scenes);
    // console.log('Trying to switch to scene ID:', sceneId);
    scenes.forEach((scene) => {
      console.log(scene.id, scene.scene);
    });
    const sceneToSwitch = scenes.find(scene => scene.id === sceneId);

    // console.log('Switching to scene:', sceneToSwitch);
    // console.log('Switching to scene:', sceneToSwitch.scene);
    if (sceneToSwitch && sceneToSwitch.scene) {
      // console.log('Found scene, switching...', sceneToSwitch);
      sceneToSwitch.scene.switchTo();
    } else {
      console.error('Scene to switch to was not found or is not initialized correctly');
    }
  };
  useEffect(() => {
    fetchScenesAndHotspots();
  }, []);
  return (
    <>
      <div id="pano" style={{ width: '100%', height: '500px' }}></div>
      {/* {scenes.length === 0 ? (
        <p>Loading scenes...</p>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          {console.log('Rendering buttons for scenes:', scenes)}
          {scenes.map((scene) => {
            const sceneId = String(scene.id);
            return (
              <Button
                key={sceneId}
                onClick={() => switchScene(sceneId)}
                variant="contained"
                color="primary"
                style={{ margin: '0 10px' }}
              >
                {sceneId.charAt(0).toUpperCase() + sceneId.slice(1)}
              </Button>
            );
          })}
        </Box>
      )} */}
      <div id="pano" style={{ width: '100%', height: '500px' }}></div>
    <div className="button-container">
      {scenes.length === 0 ? (
        <p>Loading scenes...</p>
      ) : (
        scenes.map((scene) => {
          const sceneId = String(scene.id);
          return (
            <button
              key={sceneId}
              onClick={() => switchScene(sceneId)}
              className="button"
            >
              {sceneId.charAt(0).toUpperCase() + sceneId.slice(1)}
            </button>
          );
        })
      )}
    </div>
    </>
  );
};

export default Pano;
