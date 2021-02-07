import React, { useState, useEffect, useContext } from 'react';
import {SectionContext} from '../../sectionsApi/SectionsContext'
import { Container, Image, Row, Col } from 'react-bootstrap';
import ModalComponent from '../Modal/Modal.component';
import Navigator from '../Navigator/Navigator.component';
import SectionComponent from '../Section/Section.component';
import PageComponent from '../Page/Page.component';

/*
MainViewComponent is the main component of the reporter.
this component uses:
    SectionComponent to render each section
    PageComponent to render the final pages
    Navigator to render the navigation-buttons (pages)
    ModalComponent for the final modal
*/

export default function MainViewComponent(props) {
    // we start by reading the context
    const { sections, loadSections, setSections } = useContext(SectionContext);
    
    // we use sections.length to indicate that the sections needs to be loaded.
    useEffect(() => {
        if(!sections.length) {
            //in order to fetch data from real endpoints, you can call the following method passing an array of endpoints
            loadSections();
        }
    }, [loadSections, sections.length]);

    // this flag will indicate that the page allocation is done - and we can render the sections under their 'correct' page
    const [finalRender, setFinalRender] = useState(false);
    // this array will hold & update each section's height
    const [sectionsSize, setSectionsSize] = useState([]);
    // this array will hold & update each section's correct page
    const [pageAllocation, setPageAllocation] = useState([]);
    // this "integer" will indicate which page is currently "active" (visible)
    const [radioVal, setRadioVal] = useState(0);

    const sectionsCount = sections.length;
    // pager object is used to track the accumulated height of each page.
    let pager = {current: 0, occupied: 0};
    
    // this method implement Fisher-Yates randomization algorithm
    const random = (array) => {
        let randomizedArray = array;
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [randomizedArray[i], randomizedArray[j]] = [randomizedArray[j], randomizedArray[i]];
          }
        
        return randomizedArray;
    }

    // this is a callback, that receives an index of a section and its rendered-height, and updates the sectionsSize array accordingly
    const updateSectionsSize = (index, size) => {
        if(sectionsSize[index] !== size) {
            const prevSizes = sectionsSize;
            prevSizes[index] = size;
            setSectionsSize([...prevSizes]);
            console.log(`updated section #${index} to size: ${sectionsSize[index]}`);
        }
    }

    //this method updates the pager object (which tracks the accumulated height of each page )
    const updatePager = ({current, occupied}) => {
        pager = {current, occupied};
    }
    

    //this is the main calculation method of the component.
    // once all the section "updated" their height in the sectionsSize array, we're iterating over the
    // sizes array, and allocating each section to page. when the accumulated height of the page does
    // not allows to add the next section (will cause violation of max-height), the pager object will move
    // on to the next page.
    // once done will all sections - it will set the "finalRender" flag to true - to enable the final render.
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

        if ((sectionsSize.length === sectionsCount) && (pager.current > 0)) {
            setFinalRender(true);
        }
    }, [sectionsSize, sections]);

    // this method "looks" for alt-shift-s keystroke, to randomize the sections array
    // (which will trigger page re-allocation)
    const handleKeyDown = React.useCallback((e, sections) => {
        e.preventDefault();
        if (e.shiftKey && e.altKey && (e.code === 'KeyS')) {
            if(!sections || !sections.length) {
                return;
            }
            const newSections = random(sections);
            setRadioVal(1);
            setFinalRender(false);
            setPageAllocation([]);
            setSections(newSections);
        }
    }, [setSections])

    // here we adding the event listener to "catch" the alt-shift-s keystroke
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
