import React, { useEffect, useState } from 'react';
import { Container, Row, ListGroup, Image, Col } from 'react-bootstrap';


export default function SectionComponent({
    sectionNumber,
    section,
    sizeUpdate = null
}) {
    const sectionRef = sizeUpdate && React.createRef();
    useEffect(() => {
        if(sectionRef?.current && sizeUpdate) {
            const element = sectionRef?.current;
            console.log(element.getBoundingClientRect());
            sizeUpdate(sectionNumber, element.getBoundingClientRect()?.height);
        }
    }, [sectionRef, sectionNumber, sizeUpdate]);

    const { title, image, description, subTitle, points, alt } = section;
    const duplicateContent = image && description && alt;

    return (
        <div ref={sectionRef} className="container justify-content-md-center md-12">
            {title && (<Row className='py-3' xl md='auto'><h2>{title}</h2></Row>)}
            {subTitle && (<Row><h4>{subTitle}</h4></Row>)}
            {duplicateContent && (
                <Row>
                    <article className="row single-post mt-5 no-gutters">
                        <div className="col-md-12">
                            <div className="image-wrapper float-left pr-3">
                                <img src={image} width='200px' alt={alt} />
                            </div>
                            <div className="single-post-content-wrapper p-3">
                                {description}
                            </div>
                        </div>
                    </article>
                </Row>
            )}
            {!duplicateContent && (
                image && alt ? (
                    <Image src={image} alt={alt} fluid rounded />
                ) : (
                        <p>
                            {description}
                        </p>
                    )
            )}
            {points && points.length && (
                <ListGroup>
                    {points.map((point, index) => <ListGroup.Item key={index}>{point}</ListGroup.Item>)}
                </ListGroup>
            )}
        </div>
    );
}
