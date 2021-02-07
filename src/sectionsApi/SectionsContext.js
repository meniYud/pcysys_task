import React, { useState } from 'react';
import AsyncHandler from './AsyncHandler';
import mockedSections from './mockData/data';

export const SectionContext = React.createContext();

export default function ContextProvider({ children }) {
    const [sections, setSections] = useState([]);
    const ordered = (sectionsArray) => sectionsArray.sort((a,b) => a.section_number - b.section_number);

    const loadSections = (endpoints = []) => {
        if (endpoints.length) {// data needs to be fetched from remote url
            setSections(ordered(AsyncHandler({ endpoints })));
        } else {// no real endpoints provided - use mock data
            setSections(ordered(mockedSections));
        };
    }

    const value = {
        sections,
        setSections,
        loadSections
    };

    return (
        <SectionContext.Provider value={value}>
            {children}
        </SectionContext.Provider>
    )
}
