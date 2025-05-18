"use client"

import { useState, useRef } from "react"
import { Card, Button, Alert, Spinner, Badge } from "react-bootstrap"
import "../../styles/VideoStream.css"

const VideoStream = ({
  streamUrl = "http://webcam.scs.ryerson.ca/mjpg/video.mjpg",
  autoPlay = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)
  const imgRef = useRef(null)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError("Impossible de charger le flux vidéo.")
    setIsPlaying(false)
    setIsLoading(false)
  }

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying)
    setError(null)
    setIsLoading(true)
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
    <div className="video-stream-container" ref={containerRef}>
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
        </Card.Header>

        <Card.Body className="p-0 position-relative">
          {error ? (
            <Alert variant="danger" className="m-3">
              {error}
            </Alert>
          ) : (
            <div className="video-container">
              {isLoading && (
                <div className="loading-overlay">
                  <Spinner animation="border" variant="light" />
                  <p className="mt-2 text-white">Connexion au flux vidéo...</p>
                </div>
              )}

              {isPlaying ? (
                <img
                  ref={imgRef}
                  src={streamUrl}
                  alt="Live Stream"
                  onLoad={handleImageLoad}
                  onError={handleError}
                  className="video-feed-img"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="paused-overlay text-white text-center py-5">
                  <i className="bi bi-pause-circle fs-1 mb-2"></i>
                  <p>Flux en pause</p>
                </div>
              )}
            </div>
          )}
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between align-items-center">
          <div>
            <span
              className={`status-indicator ${
                isPlaying && !isLoading ? "connected" : "disconnected"
              }`}
            ></span>{" "}
            {isPlaying && !isLoading ? "Connecté" : "Déconnecté"}
          </div>
          <div>
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleTogglePlay}
              className="me-2"
            >
              <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}></i>{" "}
              {isPlaying ? "Pause" : "Lecture"}
            </Button>
            <Button
              variant="outline-light"
              size="sm"
              onClick={takeScreenshot}
              disabled={!isPlaying}
            >
              <i className="bi bi-camera"></i> Capture
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  )
}

export default VideoStream
