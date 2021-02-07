import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer(props) {
    

    return (
        <footer>
            <Container>
                <Row>
                    <Col className='text-right py-3'>
                        Report Footer
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
