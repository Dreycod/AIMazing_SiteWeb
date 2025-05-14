"use client"

import { useEffect, useRef, useState } from "react"
import { Card, Spinner, Button } from "react-bootstrap"

const VideoStream = ({ streamUrl = "http://webcam.scs.ryerson.ca/mjpg/video.mjpg" }) => {
  const videoRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current

    if (videoElement) {
      // Gestionnaires d'événements pour la vidéo
      const handleCanPlay = () => {
        setIsLoading(false)
        setIsPlaying(true)
      }

      const handleError = (e) => {
        console.error("Erreur de chargement vidéo:", e)
        setIsLoading(false)
        setError("Impossible de charger le flux vidéo. Veuillez vérifier la connexion.")
      }

      // Ajout des écouteurs d'événements
      videoElement.addEventListener("canplay", handleCanPlay)
      videoElement.addEventListener("error", handleError)

      // Nettoyage
      return () => {
        videoElement.removeEventListener("canplay", handleCanPlay)
        videoElement.removeEventListener("error", handleError)

        // Arrêter la vidéo si elle est en cours de lecture
        if (!videoElement.paused) {
          videoElement.pause()
        }
      }
    }
  }, [])

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Erreur lors de la lecture:", err)
          setError("Impossible de lire le flux vidéo. Veuillez réessayer.")
        })
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <Card className="video-stream-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Flux Vidéo en Direct</h5>
        <div>
          {isPlaying ? (
            <Button variant="outline-danger" size="sm" onClick={handlePause}>
              Pause
            </Button>
          ) : (
            <Button variant="outline-success" size="sm" onClick={handlePlay}>
              Lecture
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body className="p-0 position-relative">
        {isLoading && (
          <div className="video-loading-overlay">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Chargement du flux vidéo...</p>
          </div>
        )}

        {error && (
          <div className="video-error-overlay">
            <p className="text-danger">{error}</p>
            <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        )}

        <video ref={videoRef} className="w-100" height="360" controls={false} muted playsInline src={streamUrl} />
      </Card.Body>
      <Card.Footer className="text-muted">
        <small>Flux en direct de la caméra du robot</small>
      </Card.Footer>
    </Card>
  )
}

export default VideoStream
