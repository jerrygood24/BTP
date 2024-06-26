import React, { useEffect, useState, useCallback, useRef } from "react";
import Marzipano from "marzipano";
import "../css/Pano.css";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import {
  PlayArrow, Pause, Add, Clear, ArrowUpward, ArrowDownward,
  ArrowBack, ArrowForward, ZoomIn, ZoomOut,
} from "@mui/icons-material";
import Modal from 'react-modal';
import imgaudio from '../data/sound-png-35757.png';
import imgvideo from '../data/video-icon-8027.png';

Modal.setAppElement('#root');
const Pano = ({ subchapterId, isTeacher }) => {
  const [viewer, setViewer] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [autorotate, setAutorotate] = useState(true);
  const [autorotateSpeed, setAutorotateSpeed] = useState(0.003);
  const [scenesReady, setScenesReady] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [modalContent, setModalContent] = useState({ type: '', url: '' });
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [selectedAudioUrl, setSelectedAudioUrl] = useState("");
  const audioPlayer = useRef(new Audio());
  const [hotspotAddModalIsOpen, setHotspotAddModalIsOpen] = useState(false);
  const [hotspotDetails, setHotspotDetails] = useState({
    id: '',
    text: '',
    video_url: '',
    audio: null,
    yaw: 0,
    pitch: 0,
  });
  const audioInputRef = useRef(null);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const [isAddHotspotMode, setIsAddHotspotMode] = useState(false);
  const setCurrentScene = (sceneId) => {
    setCurrentSceneId(sceneId);
  };

  const fetchScenesAndHotspots = async () => {
    try {
      const scenesResponse = await fetch(`http://127.0.0.1:8000/accounts/scenes/?subchapter=${subchapterId}`);
      console.log("Fetched the scenes for subchapter id ", subchapterId);
      const scenesData = await scenesResponse.json();
      for (const scene of scenesData) {
        console.log(`Fetching hotspots for scene: ${scene.id}`);
        const hotspotsResponse = await fetch(`http://127.0.0.1:8000/accounts/hotspots/?scene=${scene.id}`);
        const hotspotsData = await hotspotsResponse.json();
        scene.hotspots = hotspotsData;
        // console.log("got the hotspots for scene id",scene.id);
        // console.log(scene.hotspots);
      }
      setScenes(scenesData);
      if (scenesData.length > 0) {
        setCurrentSceneId(scenesData[0].id);
        console.log("The scene id is ", scenesData[0].id);
      }
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
  const handleSceneMovement = (direction) => {
    if (!viewer) return; // Ensure viewer is available

    const view = viewer.view();
    if (!view) return; // Ensure view is available

    let angle = Math.PI / 36; // 5 degrees in radians
    if (direction === "zoom-in" || direction === "zoom-out") {
      angle = 0.1; // Adjust zooming speed
    }

    switch (direction) {
      case "left":
        view.setYaw(view.yaw() - angle);
        break;
      case "right":
        view.setYaw(view.yaw() + angle);
        break;
      case "up":
        view.setPitch(view.pitch() - angle);
        break;
      case "down":
        view.setPitch(view.pitch() + angle);
        break;
      case "zoom-out":
        view.setFov(view.fov() * 1.1);
        break;
      case "zoom-in":
        view.setFov(view.fov() * 0.9);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (viewer && scenesReady && scenes.length > 0) {
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
            var videoImg = document.createElement('img');
            videoImg.src = imgvideo; // Replace 'audio_icon.png' with the path to your audio icon image
            videoImg.alt = 'Audio Icon'; // Optional: provide alt text for accessibility
            videoImg.style.width = '32px'; // Adjust width as needed
            videoImg.style.height = '32px'; // Adjust height as needed
            videoImg.onclick = (e) => {
              e.preventDefault(); // Prevent the link from navigating
              setSelectedVideoUrl(hotspot.video_url);
              setModalIsOpen(true);
            };
            element.appendChild(videoImg);
          }
          if (hotspot.audio) {
            console.log("Audio file is there in gian ho app ");
            var audioImg = document.createElement('img');
            audioImg.src = imgaudio; // Replace 'audio_icon.png' with the path to your audio icon image
            audioImg.alt = 'Audio Icon'; // Optional: provide alt text for accessibility
            audioImg.style.width = '32px'; // Adjust width as needed
            audioImg.style.height = '32px'; // Adjust height as needed
            audioImg.onclick = (e) => {
              e.preventDefault();
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
            element.appendChild(audioImg);
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
  }, [viewer, scenesReady, scenes]);
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
      console.log('Found scene, switching...', sceneToSwitch);
      setCurrentSceneId(sceneToSwitch.id);
      sceneToSwitch.scene.switchTo();
      console.log("The current scene id is ", currentSceneId);
    } else {
      console.error('Scene to switch to was not found or is not initialized correctly');
    }
  };
  useEffect(() => {
    fetchScenesAndHotspots();
  }, [subchapterId]);

  const toggleAutorotate = () => {
    setAutorotate(!autorotate);
  };

  useEffect(() => {
    if (viewer && autorotate) {
      const autorotateInterval = setInterval(() => {
        const view = viewer.view();
        if (view) {
          const newYaw = view.yaw() + autorotateSpeed;
          view.setYaw(newYaw);
        }
      }, 32); // Update every ~60 frames (1000ms / 60 frames = ~16ms)
      return () => clearInterval(autorotateInterval);
    }
  }, [viewer, autorotate, autorotateSpeed]);


  const toggleAddHotspotMode = () => {
    setIsAddHotspotMode(!isAddHotspotMode);
    console.log("Toggling Add Hotspot Mode:", !isAddHotspotMode);
  };

  const closeHotspotAddModal = () => {
    setHotspotAddModalIsOpen(false);
    if (isAddHotspotMode) {
      setIsAddHotspotMode(false); // Ensure we exit Add Hotspot Mode when closing the modal
    }
  };
  const handlePanoramaClick = (e) => {
    if (!isAddHotspotMode || !viewer) return;
    console.log("In Add Hotspot Mode, capturing click");
    e.preventDefault();
    e.stopPropagation();
    const panoElement = document.getElementById("pano");
    const rect = panoElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log(`Click coordinates: x=${x}, y=${y}`);
    const view = viewer.view();
    const coordinates = view.screenToCoordinates({ x, y });
    console.log(`Marzipano coordinates: yaw=${coordinates.yaw}, pitch=${coordinates.pitch}`);
    setHotspotDetails((prevDetails) => ({
      ...prevDetails,
      yaw: coordinates.yaw,
      pitch: coordinates.pitch,
    }));
    console.log("Opening Add Hotspot Modal");
    setHotspotAddModalIsOpen(true);
    const openHotspotAddModal = () => {
      if (!isAddHotspotMode) return; // Only open if in add hotspot mode
      setHotspotAddModalIsOpen(true);
    };
  };
  useEffect(() => {
    const panoElement = document.getElementById("pano");
    console.log("Updating click event listener for Add Hotspot Mode:", isAddHotspotMode);
    if (!panoElement) return;
    //   const eventHandler = isAddHotspotMode ? handlePanoramaClick : null;
    //   if (eventHandler) {
    //     panoElement.addEventListener('click', eventHandler);
    //   } else {
    //     panoElement.removeEventListener('click', handlePanoramaClick);
    //   }

    //   return () => panoElement.removeEventListener('click', handlePanoramaClick);
    // }, [isAddHotspotMode, viewer]);
    if (isAddHotspotMode) {
      panoElement.addEventListener('click', handlePanoramaClick);
    } else {
      panoElement.removeEventListener('click', handlePanoramaClick);
    }

    return () => panoElement.removeEventListener('click', handlePanoramaClick);
  }, [isAddHotspotMode, viewer, hotspotDetails]);

  const handleHotspotDetailChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'audio') {
      setHotspotDetails((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setHotspotDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitHotspot = async (e) => {
    e.preventDefault();
    console.log("Submitting hotspot details", hotspotDetails);
    const formData = new FormData();
    formData.append("text", hotspotDetails.text);
    formData.append("video_url", hotspotDetails.video_url);
    formData.append("yaw", hotspotDetails.yaw);
    formData.append("pitch", hotspotDetails.pitch);
    formData.append("scene", currentSceneId);
    formData.append("id", hotspotDetails.id);

    if (hotspotDetails.audio) {
      formData.append("audio", hotspotDetails.audio);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/hotspots/", {
        method: "POST",
        body: formData,
        // If your endpoint requires headers like Authorization, include them here
      });

      if (response.ok) {
        console.log("Hotspot added successfully");
        closeHotspotAddModal();
        // Optionally: fetch scenes again to update the UI with the new hotspot
      } else {
        console.error("Failed to add hotspot. Server responded with an error.");
      }
    } catch (error) {
      console.error("Failed to add hotspot due to a network error or cross-origin issue.", error);
    }
    console.log("Submitting hotspot:", hotspotDetails);
    setHotspotAddModalIsOpen(false);
    setIsAddHotspotMode(false);
    closeHotspotAddModal();
  };

  useEffect(() => {
    fetchScenesAndHotspots();
  }, []);


  return (
    <>
      <div className="nav-bar">
        <div className="nav-left">
          {/* <Typography variant="h6">Scene Selector:</Typography>
          <select onChange={(e) => switchScene(e.target.value)}>
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.id}>
                {`Scene ${scene.id}`}
              </option>
            ))}
          </select> */}
          <IconButton onClick={() => handleSceneMovement("up")}>
            <ArrowUpward />
          </IconButton>
          <IconButton onClick={() => handleSceneMovement("down")}>
            <ArrowDownward />
          </IconButton>
          <IconButton onClick={() => handleSceneMovement("left")}>
            <ArrowBack />
          </IconButton>
          <IconButton onClick={() => handleSceneMovement("right")}>
            <ArrowForward />
          </IconButton>
          <IconButton onClick={() => handleSceneMovement("zoom-in")}>
            <ZoomIn />
          </IconButton>
          <IconButton onClick={() => handleSceneMovement("zoom-out")}>
            <ZoomOut />
          </IconButton>
        </div>
        <div className="nav-right">
          <Button onClick={toggleAutorotate}>
            {autorotate ? <Pause /> : <PlayArrow />}
          </Button>
          {isTeacher && ( // Render button only if the user is a teacher
            <Button onClick={toggleAddHotspotMode}>
              {isAddHotspotMode ? <Clear /> : <Add />}
            </Button>
          )}
          <div className="dropdown-container">
            {scenes.length === 0 ? (
              <p>Loading scenes...</p>
            ) : (
              <select onChange={(e) => { switchScene(e.target.value); setCurrentScene(e.target.value); }}>
                {scenes.map((scene) => {
                  const sceneId = String(scene.id);
                  return (
                    <option key={sceneId} value={sceneId}>
                      {sceneId.charAt(0).toUpperCase() + sceneId.slice(1)}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>
      </div>
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
            width: '50%',
            height: '70%',
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
      <Modal
        isOpen={hotspotAddModalIsOpen}
        onRequestClose={() => setHotspotAddModalIsOpen(false)}
        style={modalStyle}
      >
        <Box component="form" onSubmit={handleSubmitHotspot}>
          <Typography variant="h6">Add New Hotspot</Typography>
          <TextField
            margin="normal"
            fullWidth
            label="ID"
            name="id"
            value={hotspotDetails.id}
            onChange={handleHotspotDetailChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Text"
            name="text"
            value={hotspotDetails.text}
            onChange={handleHotspotDetailChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Video URL"
            name="video_url"
            value={hotspotDetails.video_url}
            onChange={handleHotspotDetailChange}
          />
          <input
            accept="audio/*"
            type="file"
            id="audio"
            name="audio"
            style={{ display: 'block', marginTop: '20px' }}
            onChange={handleHotspotDetailChange}
            ref={audioInputRef}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Submit Hotspot
          </Button>
        </Box>
      </Modal>
      <div id="pano" style={{ width: '100%', height: '500px' }}></div>
      {/* <div className="button-container">
        {scenes.length === 0 ? (
          <p>Loading scenes...</p>
        ) : (
          scenes.map((scene) => {
            const sceneId = String(scene.id);
            return (
              <button
                key={sceneId}
                onClick={() => [switchScene(sceneId), setCurrentScene(sceneId)]}
                className="button"
              >
                {sceneId.charAt(0).toUpperCase() + sceneId.slice(1)}
              </button>
            );
          })
        )}
      </div> */}
    </>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default Pano;
