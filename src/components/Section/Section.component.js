import React, { useEffect } from 'react';
import { Row, ListGroup, Image } from 'react-bootstrap';

// this components renderers a given section
// if sizeUpdate callback is passed, it will fire it upon ref refresh

export default function SectionComponent({
    sectionNumber,
    section,
    sizeUpdate = null
}) {
    // we define a ref
    const sectionRef = sizeUpdate && React.createRef();
    //and use it to update the mainView with the section height
    useEffect(() => {
        if(sectionRef?.current && sizeUpdate) {
            const element = sectionRef?.current;
            sizeUpdate(sectionNumber, element.getBoundingClientRect()?.height);
        }
    }, [sectionRef, sectionNumber, sizeUpdate]);

    //render of a section is based on the data schema.
    const { title, image, description, subTitle, points, alt } = section;
    const duplicateContent = image && description && alt;

    return (
        <div className="container justify-content-md-center md-12" ref={sectionRef} >
            {title && (<Row className='py-3' xl md='auto'><h2>{title}</h2></Row>)}
            {subTitle && (<Row><h4>{subTitle}</h4></Row>)}
            {duplicateContent && (
                <Row>
                    <article className="row single-post mt-5 no-gutters">
                        <div className="col-md-12">
                            <div className="image-wrapper float-left pr-3">
                                <img src={image} width='300px' alt={alt} />
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
