import React, { useEffect, useState, useCallback, useRef } from "react";
import Marzipano from "marzipano";
import "../css/Pano.css";
import { Box, Button } from "@mui/material";
import Modal from 'react-modal';

Modal.setAppElement('#root');
const Pano = () => {
  const [viewer, setViewer] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [scenesReady, setScenesReady] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [modalContent, setModalContent] = useState({ type: '', url: '' });
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [selectedAudioUrl, setSelectedAudioUrl] = useState("");
  const audioPlayer = useRef(new Audio());
  

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
      setViewer(prevViewer => {
        if (!prevViewer) {
          const panoElement = document.getElementById("pano");
          const viewerOpts = { controls: { mouseViewMode: "drag" } };
          return new Marzipano.Viewer(panoElement, viewerOpts);
        }
        return prevViewer;
      });
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
  const openModal = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    setModalIsOpen(true);
  };
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
          var textElement = document.createElement('span');
          textElement.innerText = hotspot.text;
          element.appendChild(textElement);
          if (hotspot.video_url) {
            var linkElement = document.createElement('a');
            linkElement.href = '#';
            linkElement.innerText = ' View Video'; // Text for the link
            linkElement.onclick = (e) => {
              e.preventDefault(); // Prevent the link from navigating
              setSelectedVideoUrl(hotspot.video_url);
              setModalIsOpen(true);
            };
            element.appendChild(linkElement);
          }
          if (hotspot.audio) {
            console.log("Audio file is there in gian ho app ");
            var audioLink = document.createElement('a');
            audioLink.href = '#';
            audioLink.innerText = ' Play/Pause Audio';
            audioLink.onclick = (e) => {
              e.preventDefault();
              // Assuming `hotspot.audio_file` is the URL to the audio file
          //     var audio = new Audio(hotspot.audio);
          //     audio.play();
          //   };
          //   element.appendChild(audioLink);
          // }
          if (audioPlayer.current.src !== hotspot.audio) {
            audioPlayer.current.src = hotspot.audio;
            audioPlayer.current.play();
          } else if (audioPlayer.current.paused) {
            audioPlayer.current.play();
          } else {
            audioPlayer.current.pause();
          }
        };
        element.appendChild(audioLink);
      }
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
      if (!viewer) {
        console.log('No viewer available');
      }
      else {
        console.log("Viewer is there: ", viewer);
        console.log('No Scenes available');
      }
    }
  }, [viewer, scenesReady]);
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Function to determine if the URL is a YouTube link
  const isYouTubeLink = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube.com|youtu.be)\/.+$/;
    return pattern.test(url);
  };
  const getYouTubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Video Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(255, 255, 255, 0.75)' // You can adjust the opacity here
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '1000' // Ensure this is higher than other content but the background image is still visible
          }
        }}
      >
        {isYouTubeLink(selectedVideoUrl) ? (
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideoUrl)}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <p>This video link is not a YouTube link. <a href={selectedVideoUrl} target="_blank" rel="noopener noreferrer">Click here</a> to view.</p>
        )}
      </Modal>
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
