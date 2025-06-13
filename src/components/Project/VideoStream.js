"use client"

import { useState, useEffect, useRef } from "react"
import { Card, Button, Spinner, Alert, Badge, Form } from "react-bootstrap"
import "../../styles/VideoStream.css"

const VideoStream = ({ cameraIP = "192.168.0.102", autoPlay = true, showControls = true }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [error, setError] = useState(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [resolution, setResolution] = useState("QVGA")
  const [quality, setQuality] = useState(10)
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [stats, setStats] = useState({
    status: "Disconnected",
    frameSize: "Unknown",
    lastUpdate: null,
  })
  const [showAdvancedControls, setShowAdvancedControls] = useState(false)

  const imgRef = useRef(null)
  const containerRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  const streamUrl = `http://${cameraIP}:81/stream`
  const controlUrl = `http://${cameraIP}/control`
  const captureUrl = `http://${cameraIP}/capture`

  const resetImageStream = () => {
    if (imgRef.current) {
      const newImg = imgRef.current.cloneNode(true)
      newImg.src = `${streamUrl}?t=${Date.now()}`
      imgRef.current.replaceWith(newImg)
      imgRef.current = newImg
    }
  }

  useEffect(() => {
    if (isPlaying && imgRef.current) {
      setIsLoading(true)
      setError(null)

      const img = imgRef.current

      const handleLoad = () => {
        setIsLoading(false)
        setStats((prev) => ({
          ...prev,
          status: "Connected",
          lastUpdate: new Date().toLocaleTimeString(),
        }))
      }

      const handleError = () => {
        setIsLoading(false)
        setError(`Impossible de se connecter à la caméra à l'adresse ${cameraIP}`)
        setStats((prev) => ({ ...prev, status: "Error" }))

        reconnectTimeoutRef.current = setTimeout(() => {
          if (isPlaying) resetImageStream()
        }, 5000)
      }

      img.addEventListener("load", handleLoad)
      img.addEventListener("error", handleError)

      return () => {
        img.removeEventListener("load", handleLoad)
        img.removeEventListener("error", handleError)
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [isPlaying, cameraIP, streamUrl])

  const sendCameraCommand = async (command, value) => {
    try {
      await fetch(`${controlUrl}?var=${command}&val=${value}`, {
        method: "GET",
        mode: "no-cors",
      })
    } catch (err) {
      console.error("Erreur de commande caméra:", err)
    }
  }

  const togglePlayPause = () => {
    const next = !isPlaying
    setIsPlaying(next)
    if (next) resetImageStream()
  }

  const toggleFullscreen = () => {
    if (!fullscreen) {
      containerRef.current?.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const toggleFlash = () => {
    const newState = !flashEnabled
    setFlashEnabled(newState)
    sendCameraCommand("flash", newState ? 1 : 0)
  }

  const changeResolution = (newResolution) => {
    const resolutionMap = {
      QVGA: 5,
      VGA: 8,
      SVGA: 9,
      XGA: 10,
      SXGA: 11,
      UXGA: 13,
    }
    setResolution(newResolution)
    sendCameraCommand("framesize", resolutionMap[newResolution])
    setStats((prev) => ({ ...prev, frameSize: newResolution }))
  }

  const takeScreenshot = () => {
    const link = document.createElement("a")
    link.href = `${captureUrl}?t=${Date.now()}`
    link.download = `esp32-capture-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.jpg`
    link.click()
  }

  const resetSettings = () => {
    changeResolution("QVGA")
    setQuality(10)
    sendCameraCommand("quality", 10)
    setBrightness(0)
    sendCameraCommand("brightness", 0)
    setContrast(0)
    sendCameraCommand("contrast", 0)
    setFlashEnabled(false)
    sendCameraCommand("flash", 0)
  }

  return (
    <div className={`video-stream-container ${fullscreen ? "fullscreen" : ""}`} ref={containerRef}>
      <Card className="video-stream-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h5 className="mb-0">ESP32 Camera</h5>
            {isPlaying && !isLoading && !error && (
              <Badge bg="danger" className="ms-2 pulse-badge">LIVE</Badge>
            )}
            <small className="ms-2 text-muted">{cameraIP}</small>
          </div>
          <Button variant="outline-light" size="sm" onClick={() => setShowAdvancedControls((v) => !v)}>
            <i className="bi bi-gear"></i>
          </Button>
        </Card.Header>

        {showAdvancedControls && (
          <Card.Body className="border-bottom">
            <div className="advanced-controls">
              <Form.Group className="mb-2">
                <Form.Label>Résolution</Form.Label>
                <Form.Select
                  size="sm"
                  value={resolution}
                  onChange={(e) => changeResolution(e.target.value)}
                  className="bg-dark text-light border-secondary"
                >
                  <option value="QVGA">QVGA</option>
                  <option value="VGA">VGA</option>
                  <option value="SVGA">SVGA</option>
                  <option value="XGA">XGA</option>
                  <option value="SXGA">SXGA</option>
                  <option value="UXGA">UXGA</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Qualité JPEG: {quality}</Form.Label>
                <Form.Range min={0} max={63} value={quality} onChange={(e) => {
                  const val = Number(e.target.value)
                  setQuality(val)
                  sendCameraCommand("quality", val)
                }} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Luminosité: {brightness}</Form.Label>
                <Form.Range min={-2} max={2} value={brightness} onChange={(e) => {
                  const val = Number(e.target.value)
                  setBrightness(val)
                  sendCameraCommand("brightness", val)
                }} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Contraste: {contrast}</Form.Label>
                <Form.Range min={-2} max={2} value={contrast} onChange={(e) => {
                  const val = Number(e.target.value)
                  setContrast(val)
                  sendCameraCommand("contrast", val)
                }} />
              </Form.Group>
              <div className="control-buttons d-flex gap-2 mt-3">
                <Button variant="outline-warning" size="sm" onClick={toggleFlash}>
                  <i className={`bi ${flashEnabled ? "bi-lightbulb-fill" : "bi-lightbulb"}`}></i> Flash
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={resetSettings}>
                  <i className="bi bi-arrow-counterclockwise"></i> Reset
                </Button>
              </div>
            </div>
          </Card.Body>
        )}

        <Card.Body className="p-0 position-relative">
          {error ? (
            <Alert variant="danger" className="m-3 d-flex justify-content-between align-items-center">
              <div>
                <strong>Erreur :</strong> {error}
              </div>
              <Button variant="outline-danger" size="sm" onClick={togglePlayPause}>
                <i className="bi bi-arrow-clockwise"></i> Réessayer
              </Button>
            </Alert>
          ) : (
            <div className="video-container">
              {isLoading && (
                <div className="loading-overlay">
                  <Spinner animation="border" variant="light" />
                  <p className="mt-2">Connexion à la caméra...</p>
                </div>
              )}
              {!isPlaying ? (
                <div className="paused-overlay">
                  <i className="bi bi-pause-circle-fill"></i>
                  <p>Flux en pause</p>
                </div>
              ) : (
                <img
                  ref={imgRef}
                  src={`${streamUrl}?t=${Date.now()}`}
                  alt="ESP32 Camera"
                  className="video-feed-img"
                  style={{ display: isLoading ? "none" : "block" }}
                />
              )}
              {isPlaying && !error && (
                <div className="video-stats">
                  <div><i className="bi bi-wifi"></i> {stats.status}</div>
                  <div><i className="bi bi-aspect-ratio"></i> {stats.frameSize}</div>
                  {stats.lastUpdate && <div><i className="bi bi-clock"></i> {stats.lastUpdate}</div>}
                </div>
              )}
              {showControls && (
                <div className="video-controls visible">
                  <Button variant="light" className="control-btn" onClick={togglePlayPause}>
                    <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                  </Button>
                  <Button variant="light" className="control-btn" onClick={takeScreenshot} disabled={!isPlaying || error}>
                    <i className="bi bi-camera-fill"></i>
                  </Button>
                  <Button variant="light" className="control-btn" onClick={toggleFullscreen}>
                    <i className={`bi ${fullscreen ? "bi-fullscreen-exit" : "bi-fullscreen"}`}></i>
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between align-items-center">
          <div className="connection-status">
            <span className={`status-indicator ${stats.status === "Connected" ? "connected" : "disconnected"}`}></span>
            {stats.status}
          </div>
          <Button variant={isPlaying ? "outline-danger" : "outline-success"} size="sm" onClick={togglePlayPause}>
            <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"} me-1`}></i>
            {isPlaying ? "Pause" : "Lecture"}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  )
}

export default VideoStream
