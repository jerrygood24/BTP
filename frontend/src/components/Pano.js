import React, { useEffect, useRef, useState } from "react";
import Marzipano from "marzipano";
import "../css/Pano.css";
import hotspotImage from "../data/hotspot.png"; // Ensure this path is correct
import { Button } from "@mui/material";

const Pano = () => {
  const viewerRef = useRef(null);
  const [isAutoRotatePaused, setIsAutoRotatePaused] = useState(false);

  useEffect(() => {
    console.log("Initializing Marzipano viewer...");

    const panoElement = document.getElementById("pano");

    // Check if the viewer has already been created for this element
    if (panoElement.marzipanoViewer) {
      console.log("Marzipano viewer already initialized.");
      return;
    }

    // Create the viewer
    const viewerOpts = {
      controls: {
        mouseViewMode: "drag",
      },
    };

    const viewer = new Marzipano.Viewer(panoElement, viewerOpts);
    viewerRef.current = viewer;

    const levels = [
      { tileSize: 512, size: 512 },
      { tileSize: 512, size: 1024 },
    ];

    const source = Marzipano.ImageUrlSource.fromString("img/hongkong_img.jpg");
    const geometry = new Marzipano.EquirectGeometry(levels);
    const view = new Marzipano.RectilinearView();

    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
    });

    const hotspotDiv = document.createElement("div");
    hotspotDiv.classList.add("hotspot");
    hotspotDiv.style.backgroundImage = `url('${hotspotImage}')`;

    const hotspotPosition = { yaw: Math.PI / 4, pitch: Math.PI / 8 };

    scene.hotspotContainer().createHotspot(hotspotDiv, hotspotPosition);

    const dropdownContainer = document.createElement("div");
    dropdownContainer.classList.add("dropdown-container");

    const heading = document.createElement("h3");
    heading.innerText = "Hotspot Title";

    const description = document.createElement("p");
    description.innerText = "Description of the hotspot.";

    dropdownContainer.appendChild(heading);
    dropdownContainer.appendChild(description);

    hotspotDiv.appendChild(dropdownContainer);

    hotspotDiv.addEventListener("click", () => {
      dropdownContainer.style.display =
        dropdownContainer.style.display === "block" ? "none" : "block";
    });

    scene.hotspotContainer().createHotspot(hotspotDiv, hotspotPosition);
    scene.switchTo({
      transitionDuration: 1000,
    });

    var destinationViewParameters = {
      yaw: (10 * Math.PI) / 180,
      pitch: (15 * Math.PI) / 180,
      fov: (60 * Math.PI) / 180,
    };

    var options = {
      transitionDuration: 2000,
    };

    scene.lookTo(destinationViewParameters, options);

    var autorotate = Marzipano.autorotate({
      yawSpeed: 0.1,
      targetPitch: 0,
      targetFov: Math.PI / 2,
    });

  }, []);

  const handleResize = () => {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.resize();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleAutoRotate = () => {
    const viewer = viewerRef.current;
    if (viewer) {
      if (isAutoRotatePaused) {
        const autorotate = Marzipano.autorotate({
          yawSpeed: 0.1,
          targetPitch: 0,
          targetFov: Math.PI / 2,
        });
        viewer.startMovement(autorotate);
      } else {
        viewer.stopMovement(); // Stop auto-rotation
      }
      setIsAutoRotatePaused(!isAutoRotatePaused);
    }
  };


  return (
    <div id="pano" className="pano-container">
      <div className="navigation-buttons">
        <Button onClick={toggleAutoRotate}>
          {isAutoRotatePaused ? "Play" : "Pause"}
        </Button>
      </div>
    </div>
  );
};

export default Pano;
