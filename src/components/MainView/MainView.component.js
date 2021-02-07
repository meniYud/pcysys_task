import React, { useState, useEffect, useContext } from 'react';
import {SectionContext} from '../../sectionsApi/SectionsContext'
import { Container, Image, Row, Col } from 'react-bootstrap';
import SectionComponent from '../Section/Section.component';
import Header from '../Header';
import Footer from '../Footer';

export default function MainViewComponent(props) {
    const { sections, loadSections } = useContext(SectionContext);

    const [finalRender, setFinalRender] = useState(false);
    const [sectionsSize, setSectionsSize] = useState([]);
    const [pageAllocation, setPageAllocation] = useState([]);
    const [randomized, setRandomized] = useState(false);
    const [pressed, setPressed] = useState(null);

    const random = (array) => {
        setRandomized(false);
        let randomizedArray = array;
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [randomizedArray[i], randomizedArray[j]] = [randomizedArray[j], randomizedArray[i]];
          }
        
        return randomizedArray;
    }
    

    useEffect(() => {
        if(!sections.length) {
            loadSections();
        }
    }, [loadSections, sections.length]);

    const sectionsCount = sections.length;
    const initialPages = randomized ? random(sections) : sections.sort((a,b) => a.section_number - b.section_number);
    let pager = {current: 0, occupied: 0};
    
    const updateSectionsSize = (index, size) => {
        if(sectionsSize[index] !== size) {
            const prevSizes = sectionsSize;
            prevSizes[index] = size;
            setSectionsSize([...prevSizes]);
            console.log(`updated section #${index} to size: ${sectionsSize[index]}`);
        }
    }

    const updatePager = ({current, occupied}) => {
        pager = {current, occupied};
    }

    useEffect(() => {
        if((sectionsSize.length === sectionsCount) && (pager.current === 0)) {
            const finalPages= [[]];
            sectionsSize.forEach((singleSize, index) => {
                if(pager.occupied + singleSize > 1200){ //no place in this page - move to the next page
                    finalPages.push([initialPages[index]]);
                    updatePager({current: pager.current + 1, occupied: singleSize});
                } else { //current page is not fully occupied
                    finalPages[finalPages.length - 1].push(initialPages[index]);
                    updatePager({current: pager.current, occupied: pager.occupied + singleSize});
                }
                setPageAllocation(finalPages);
            });
        }

        if ((sectionsSize.length === sectionsCount) && (pager.current > 0)) {
            setFinalRender(true);
        }
        
        console.log(pageAllocation);
        console.log(sectionsSize);
    }, [sectionsSize]);

    const pagedReport = (pageNumber) => {
        const pageSections = pageAllocation[pageNumber];
        return pageSections.map((section, index) => {
            return <SectionComponent key={index} section={section} />
        });
    }

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const handleKeyDown = (e) => {
        e.preventDefault();
        if (e.shiftKey && e.altKey && (e.code === 'KeyS')) {
            console.log('fire!');
            setRandomized(true);
            forceUpdate();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        
    
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        }
    }, [randomized]);

    return (
        <>
            <Header />
            <main key={!randomized}>
                {!sections.length && (
                    <Row className="justify-content-md-center">
                        <Col xs={12} sm={4} md={4}>
                            <Image src='/images/no-data.jpg' fluid />
                        </Col>
                    </Row>
                )}
                {sections.length && !finalRender &&
                    <Container>
                        {
                            initialPages.map((page, pageNumber) => {
                                if (!page) {
                                    return null;
                                }
                                return <SectionComponent key={pageNumber} section={page} sizeUpdate={updateSectionsSize} />;
                            })
                        }
                    </Container>
                }
                {sections.length && finalRender &&
                    <Container>
                        {pagedReport(1)}
                        <footer>
                            <Row>
                                <Col className='text-right py-3'>
                                    {/* {`page number: ${}`} */}
                                </Col>
                            </Row>
                        </footer>
                    </Container>
                }            
            </main>
            <Footer />
        </>
    )
}
