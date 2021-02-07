import React, { useState, useEffect, useContext } from 'react';
import {SectionContext} from '../../sectionsApi/SectionsContext'
import { Container, Image, Row, Col } from 'react-bootstrap';
import ModalComponent from '../Modal/Modal.component';
import Navigator from '../Navigator/Navigator.component';
import SectionComponent from '../Section/Section.component';
import PageComponent from '../Page/Page.component';

export default function MainViewComponent(props) {
    const { sections, loadSections, setSections } = useContext(SectionContext);
    
    useEffect(() => {
        if(!sections.length) {
            loadSections();
        }
    }, [loadSections, sections.length]);

    const [finalRender, setFinalRender] = useState(false);
    const [sectionsSize, setSectionsSize] = useState([]);
    const [pageAllocation, setPageAllocation] = useState([]);
    const [radioVal, setRadioVal] = useState(0);

    const sectionsCount = sections.length;
    let pager = {current: 0, occupied: 0};
    
    const random = (array) => {
        let randomizedArray = array;
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [randomizedArray[i], randomizedArray[j]] = [randomizedArray[j], randomizedArray[i]];
          }
        
        return randomizedArray;
    }

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
                    finalPages.push([sections[index]]);
                    updatePager({current: pager.current + 1, occupied: singleSize});
                } else { //current page is not fully occupied
                    finalPages[finalPages.length - 1].push(sections[index]);
                    updatePager({current: pager.current, occupied: pager.occupied + singleSize});
                }
                setPageAllocation(finalPages);
            });
        }

        if ((sectionsSize.length === sectionsCount) && (pageAllocation.length > 0)) {
            setFinalRender(true);
        }
    }, [sectionsSize, sections]);

    const handleKeyDown = React.useCallback((e, sections) => {
        e.preventDefault();
        if (e.shiftKey && e.altKey && (e.code === 'KeyS')) {
            if(!sections || !sections.length) {
                return;
            }
            const newSections = random(sections);
            setFinalRender(false);
            setPageAllocation([]);
            setSections(newSections);
        }
    }, [setSections])

    useEffect(() => {
        document.addEventListener('keydown', (e) => handleKeyDown(e, sections));
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        }
    }, [sections, handleKeyDown]);

    return (
        <main>
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
                        sections.map((section, sectionNumber) => {
                            if (!section) {
                                return null;
                            }
                            return <SectionComponent key={sectionNumber} section={section} sectionNumber={sectionNumber} sizeUpdate={updateSectionsSize} />;
                        })
                    }
                </Container>
            }
            {sections.length && finalRender && pageAllocation.length &&
                <>
                    <ModalComponent />
                    <Row className="justify-content-md-center">
                        <Navigator active={radioVal} setActive={setRadioVal} pagesCount={pageAllocation.length + 2} />
                    </Row>
                    <PageComponent pages={pageAllocation} pageNumber={radioVal} />
                </>
            }
            {
                sections.length && finalRender && console.log(sectionsSize)
            }
        </main>
    )
}
