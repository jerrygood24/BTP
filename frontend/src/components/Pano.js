import React, { useEffect, useState, useCallback } from "react";
import Marzipano from "marzipano";
import "../css/Pano.css";
import { Box, Button } from "@mui/material";

const Pano = () => {
  // Use state to keep track of the Marzipano viewer
  const [viewer, setViewer] = useState(null);
  // Store scenes in state to make them accessible for scene switching
  const [scenes, setScenes] = useState([]);

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
 }
  }, []);

  useEffect(() => {
    if (viewer) {
      const scenesData = [
        {
          id: "hongkong",
          imagePath: "img/hongkong_img.jpg",
          hotspots: [
            {
              id: "hk-spot1",
              text: "Welcome to Hong Kong!",
              yaw: Math.PI / 4,
              pitch: Math.PI / 6,
            },
          ],
        },
        {
          id: "newyork",
          imagePath: "img/b3.jpeg",
          hotspots: [
            {
              id: "ny-spot1",
              text: "Welcome to New York!",
              yaw: -Math.PI / 4,
              pitch: Math.PI / 6,
            },
          ],
        },
      ];

      const initializedScenes = scenesData.map((data) => {
        const levels = [
          { tileSize: 512, size: 512 },
          { tileSize: 512, size: 1024 },
        ];
        const source = Marzipano.ImageUrlSource.fromString(data.imagePath);
        const geometry = new Marzipano.EquirectGeometry(levels);
        const view = new Marzipano.RectilinearView();

        const scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
        });

        // Initialize and store hotspots for each scene
        data.hotspots.forEach((hotspotData) => {
          const element = document.createElement("div");
          element.className = "hotspot";
          element.innerText = hotspotData.text;
          scene.hotspotContainer().createHotspot(element, {
            yaw: hotspotData.yaw,
            pitch: hotspotData.pitch,
          });
        });

        return {
          id: data.id,
          scene: scene,
          hotspots: data.hotspots,
        };
      });
      console.log('Scenes initialized:', initializedScenes);
      setScenes(initializedScenes);
      // console.log(scenes);
      console.log('Scenes state variable:', scenes); // Add this line
      // Automatically switch to the first scene
      // initializedScenes[0]?.scene.switchTo();
      if (initializedScenes.length > 0) {
        initializedScenes[0].scene.switchTo(); // Switch to the first scene
      }
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
    const sceneToSwitch = scenes.find(scene => scene.id === sceneId);
    sceneToSwitch?.scene.switchTo();
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
        {scenes.map((scene) => (
          <Button key={scene.id} onClick={() => switchScene(scene.id)} variant="contained" color="primary" style={{ margin: '0 10px' }}>
            {scene.id.charAt(0).toUpperCase() + scene.id.slice(1)}
          </Button>
        ))}
      </Box>
    )}
    </>
  );
};

export default Pano;
