import React, {useState} from 'react';
import { Modal, Button } from 'react-bootstrap';

// this function renderers simple modal with the option to close it
export default function ModalComponent(props) {
    const [showModal, setShowModal] = useState(true);

    const handleClose = () => setShowModal(false);
  
    return (  
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Done preparations</Modal.Title>
            </Modal.Header>
            <Modal.Body>Print is ready</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
