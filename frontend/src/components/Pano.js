import React, { useEffect, useState, useCallback } from "react";
import Marzipano from "marzipano";
import "../css/Pano.css";
import { Box, Button } from "@mui/material";

const Pano = () => {
  // Use state to keep track of the Marzipano viewer
  const [viewer, setViewer] = useState(null);
  // Store scenes in state to make them accessible for scene switching
  const [scenes, setScenes] = useState([]);
  
  const fetchScenesAndHotspots = async () => {
    try {
      // Fetch scenes
      const scenesResponse = await fetch('http://127.0.0.1:8000/accounts/scenes/');
      const scenesData = await scenesResponse.json();
      
      // Fetch hotspots for each scene
      for (const scene of scenesData) {
        const hotspotsResponse = await fetch(`http://127.0.0.1:8000/accounts/hotspots/?scene=${scene.id}`);
        const hotspotsData = await hotspotsResponse.json();
        scene.hotspots = hotspotsData; // Attach hotspots to the scene object
      }

      setScenes(scenesData); // Set the scenes state with hotspots included
      console.log("Scenes Added: ", scenesData);
    } catch (error) {
      console.error('Error fetching scenes and hotspots:', error);
    }
  };
  useEffect(() => {
    console.log("Initializing Marzipano viewer...");

 const panoElement = document.getElementById("pano");
 if (!panoElement.marzipanoViewer) {
    // Create the viewer
    const viewerOpts = {
      controls: {
        mouseViewMode: "drag",
      },
      
    };

    const newViewer = new Marzipano.Viewer(panoElement, viewerOpts);
    console.log("viewer initialized:", newViewer)
    // panoElement.marzipanoViewer = newViewer; // Store the viewer for later reference
//sajkdhaskjd
    setViewer(newViewer);
    fetchScenesAndHotspots();
 }
  }, []);

  useEffect(() => {
    if (viewer && scenes.length > 0) {
      console.log('First scene:', scenes[0]);
      console.log('Second scene:', scenes[1]);
      // if (scenes[0].scene) {
      //   scenes[0].scene.switchTo();
      // } else {
      //   console.error('First scene is not initialized correctly');
      // }
      const newScenes = scenes.map(sceneData => {
        // Create Marzipano scene here
        const levels = [
          { tileSize: 512, size: 512 },
          { tileSize: 512, size: 1024 },
        ];
        const source = Marzipano.ImageUrlSource.fromString(sceneData.imagePath);
        const geometry = new Marzipano.EquirectGeometry(levels);
        const limiter = Marzipano.RectilinearView.limit.traditional(1024, 120*Math.PI/180);
        const view = new Marzipano.RectilinearView(null, limiter);
  
        const marzipanoScene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true
        });
        
        
        // Add hotspots to Marzipano scene
        sceneData.hotspots.forEach(hotspot => {
          var element = document.createElement('div');
          element.classList.add('hotspot');
          element.innerText = hotspot.text;
          marzipanoScene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
        });
  
        // Return new object with Marzipano scene included
        return { ...sceneData, scene: marzipanoScene };
      });
  
      // Update the scenes state with the new scenes that include the Marzipano objects
      setScenes(newScenes);
  
      // Automatically switch to the first scene
      newScenes[0].scene.switchTo();
  
    }
    else{
      console.log('No viewer or scenes available');
    }
  }, [viewer]);

  // Define switchScene as a useCallback to ensure it does not get recreated on each render
  // const switchScene = useCallback(
  //   (sceneId) => {
  //     const sceneToSwitch = scenes.find((s) => s.id === sceneId)?.scene;
  //     sceneToSwitch?.switchTo();
  //   },
  //   [scenes]
  // );
  const switchScene = (sceneId) => {
    // console.log('Available scenes:', scenes);
    console.log('Attempting to switch scene. Available scenes:', scenes);
    console.log('Trying to switch to scene ID:', sceneId);
  
  // Find the scene by ID
  const sceneToSwitch = scenes.find(scene => scene.id === sceneId);
  
  // Log the scene we're trying to switch to
  console.log('Switching to scene:', sceneToSwitch);

  if (sceneToSwitch && sceneToSwitch.scene) {
    console.log('Found scene, switching...', sceneToSwitch);
    sceneToSwitch.scene.switchTo();
  } else {
    console.error('Scene to switch to was not found or is not initialized correctly');
  }
  };
  // const switchScene = (sceneId) => {
  //   const sceneToSwitch = scenes.find((s) => s.id === sceneId)?.scene;
  //   sceneToSwitch?.switchTo();
  // };

  // Handle resizing of the Marzipano canvas
  // useEffect(() => {
  //   const handleResize = () => {
  //     viewer?.resize();
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [viewer]);

  return (
    <>
      <div id="pano" style={{ width: '100%', height: '500px' }}></div>
    {scenes.length === 0 ? (
      <p>Loading scenes...</p>
    ) : (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
        {scenes.map((scene) => {
          // Ensure scene.id is a string
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
    )}
    </>
  );
};

export default Pano;
