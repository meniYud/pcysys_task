import React, { useState } from 'react';
import AsyncHandler from './AsyncHandler';
import mockedSections from './mockData/data';

export const SectionContext = React.createContext();

export default function ContextProvider({ children }) {
    const [sections, setSections] = useState([]);

    const loadSections = (endpoints = []) => {
        if (endpoints.length) {
            setSections(AsyncHandler({ endpoints }));
        } else {// no real endpoints provided - use mock data
            setSections(mockedSections);
        };
    }

    const value = {
        sections,
        loadSections
    };

    return (
        <SectionContext.Provider value={value}>
            {children}
        </SectionContext.Provider>
    )
}
