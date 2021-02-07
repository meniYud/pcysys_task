import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import SectionComponent from '../Section/Section.component';

export default function PageComponent({pages, pageNumber}) {
    
    const pagedReport = (pageNumber) => {
        const pageSections = pages[pageNumber];
        return pageSections.map((section, index) => {
            return <SectionComponent key={index} section={section} />
        });
    }

    const firstPageStyle = {
        backgroundImage: 'url(/images/firstPage.jpg)',
        backgroundSize: 'cover',
        height: '1000px'
    }

    const firstPage = () => {
        return (
            <div className="jumbotron" style={firstPageStyle}>
                <div className="container for-about">
                    <h1>Static First Page</h1>
                    <h3>Static First Page - sub title</h3>
                </div>
            </div>
        );
    }

    const contentIndex = () => {
        const flatContent = pages.map((page, index) => {
            return page.map(section => {
                return {
                    title: section.title,
                    page: index + 2
                }
            });
        }).flat();

        return (
            <>
                <Row className="justify-content-md-center px-md-5">
                    <h2>TABLE OF CONTENT</h2>
                </Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Section Title</th>
                            <th>Page</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            flatContent.map((sectionRow) => {
                                return (
                                    <tr key={sectionRow.title}>
                                        <td>
                                            {sectionRow.title}
                                        </td>
                                        <td>
                                            {sectionRow.page}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </>
        );
    }

    return (
        <Container>
            {pageNumber === 0 && firstPage()}
            {pageNumber === 1 && contentIndex()}
            {pageNumber > 1 && pagedReport(pageNumber - 2)}
            <footer>
                <Row>
                    <Col className='text-right py-3'>
                        {`page number: ${pageNumber}`}
                    </Col>
                </Row>
            </footer>
        </Container>
    )
}
