"use client"
import { Modal, Button, Spinner, Table, Badge } from "react-bootstrap"
import { formatDistance, formatTime, formatDirection } from "../../utils/formatters"

const TestDetailsModal = ({ test, mouvements, loading, show, onHide }) => {
  if (!test) return null

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Détails du Test <Badge bg="primary">{test.id}</Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="test-summary mb-4">
          <h5>Résumé</h5>
          <Table striped bordered hover responsive>
            <tbody>
              <tr>
                <td>
                  <strong>Modèle</strong>
                </td>
                <td>{test.model_id}</td>
              </tr>
              <tr>
                <td>
                  <strong>Distance Totale</strong>
                </td>
                <td>{formatDistance(test.distance_total)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Temps de Déplacement</strong>
                </td>
                <td>{formatTime(test.t_deplacement)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Nombre de Mouvements</strong>
                </td>
                <td>{test.n_mouvements}</td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div className="movements-section">
          <h5>Mouvements</h5>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Chargement des mouvements...</p>
            </div>
          ) : mouvements && mouvements.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Direction</th>
                  <th>Distance</th>
                  <th>Temps</th>
                </tr>
              </thead>
              <tbody>
                {mouvements.map((mvt) => (
                  <tr key={mvt.id}>
                    <td>{mvt.id}</td>
                    <td>
                      <Badge bg={mvt.direction_id <= 4 ? "success" : "warning"}>
                        {formatDirection(mvt.direction_id)}
                      </Badge>
                    </td>
                    <td>{formatDistance(mvt.distance)}</td>
                    <td>{formatTime(mvt.temps)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center py-3">Aucun mouvement trouvé pour ce test.</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TestDetailsModal
