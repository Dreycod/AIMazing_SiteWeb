"use client"

import { useState, useEffect, useRef } from "react"
import { Card, Button, Spinner, Alert, OverlayTrigger, Tooltip, Badge } from "react-bootstrap"
import "../../styles/VideoStream.css"

const VideoStream = ({
  streamUrl = "http://webcam.scs.ryerson.ca/mjpg/video.mjpg",
  autoPlay = true,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [error, setError] = useState(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [quality, setQuality] = useState("high")
  const [stats, setStats] = useState({ fps: 0, resolution: "640x480", latency: "0ms" })
  const [showControls, setShowControls] = useState(true)
  const imgRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isPlaying) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
        setStats({
          fps: Math.floor(Math.random() * 10) + 25,
          resolution:
            quality === "high" ? "640x480" : quality === "medium" ? "480x360" : "320x240",
          latency: `${Math.floor(Math.random() * 100) + 50}ms`,
        })
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isPlaying, quality])

  const toggleFullscreen = () => {
    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen()
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen()
      }
      setFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        setFullscreen(false)
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("msfullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("msfullscreenchange", handleFullscreenChange)
    }
  }, [])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const changeQuality = (newQuality) => {
    setQuality(newQuality)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const takeScreenshot = () => {
    if (!imgRef.current) return
    const img = imgRef.current
    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")

    const image = new Image()
    image.crossOrigin = "anonymous"
    image.src = img.src
    image.onload = () => {
      ctx.drawImage(image, 0, 0)
      const link = document.createElement("a")
      link.download = `screenshot-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }

  return (
    <div className={`video-stream-container ${fullscreen ? "fullscreen" : ""}`} ref={containerRef}>
      <Card className="video-stream-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h5 className="mb-0">Flux Vidéo</h5>
            {isPlaying && !isLoading && (
              <Badge bg="danger" className="ms-2 pulse-badge">
                LIVE
              </Badge>
            )}
          </div>
          <div className="stream-controls-top">
            <OverlayTrigger placement="top" overlay={<Tooltip>Qualité: {quality}</Tooltip>}>
              <div className="quality-selector">
                <Button
                  variant={quality === "low" ? "danger" : "outline-danger"}
                  size="sm"
                  onClick={() => changeQuality("low")}
                  className="quality-btn"
                >
                  L
                </Button>
                <Button
                  variant={quality === "medium" ? "warning" : "outline-warning"}
                  size="sm"
                  onClick={() => changeQuality("medium")}
                  className="quality-btn"
                >
                  M
                </Button>
                <Button
                  variant={quality === "high" ? "success" : "outline-success"}
                  size="sm"
                  onClick={() => changeQuality("high")}
                  className="quality-btn"
                >
                  H
                </Button>
              </div>
            </OverlayTrigger>
          </div>
        </Card.Header>

        <Card.Body className="p-0 position-relative">
          {error ? (
            <Alert variant="danger" className="m-3">
              Erreur de connexion au flux vidéo: {error}
            </Alert>
          ) : (
            <div
              className="video-container"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {isLoading ? (
                <div className="loading-overlay">
                  <Spinner animation="border" variant="light" />
                  <p className="mt-2">Connexion au flux vidéo...</p>
                </div>
              ) : isPlaying ? (
                <img
                  ref={imgRef}
                  src={streamUrl}
                  alt="Flux vidéo MJPEG"
                  className="video-feed-img"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="paused-overlay">
                  <i className="bi bi-pause-circle-fill fs-1"></i>
                  <p>Flux en pause</p>
                </div>
              )}

              {isPlaying && (
                <div className="video-stats">
                  <div className="stat-item">
                    <i className="bi bi-speedometer2"></i> {stats.fps} FPS
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-aspect-ratio"></i> {stats.resolution}
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-clock-history"></i> {stats.latency}
                  </div>
                </div>
              )}

              <div className={`video-controls ${showControls || !isPlaying ? "visible" : ""}`}>
                <Button variant="light" className="control-btn" onClick={togglePlayPause}>
                  <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                </Button>
                <Button
                  variant="light"
                  className="control-btn"
                  onClick={takeScreenshot}
                  disabled={!isPlaying}
                >
                  <i className="bi bi-camera-fill"></i>
                </Button>
                <Button variant="light" className="control-btn" onClick={toggleFullscreen}>
                  <i className={`bi ${fullscreen ? "bi-fullscreen-exit" : "bi-fullscreen"}`}></i>
                </Button>
              </div>
            </div>
          )}
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between align-items-center">
          <div className="connection-status">
            <span className={`status-indicator ${isPlaying && !isLoading ? "connected" : "disconnected"}`}></span>
            {isPlaying && !isLoading ? "Connecté" : "Déconnecté"}
          </div>
          <Button
            variant={isPlaying ? "outline-danger" : "outline-success"}
            size="sm"
            onClick={togglePlayPause}
            className="footer-control-btn"
          >
            {isPlaying ? (
              <>
                <i className="bi bi-pause-fill me-1"></i> Pause
              </>
            ) : (
              <>
                <i className="bi bi-play-fill me-1"></i> Lecture
              </>
            )}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  )
}

export default VideoStream
