import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

// this function renders a row of single-selection-buttons to navigate between pages
export default function NavigatorComponent({
    active,
    setActive,
    pagesCount
}) {
    const buttons = [];
        for (let btn = 0; btn < pagesCount; btn++) {
            buttons.push(
                <ToggleButton
                    key={btn}
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={btn}
                    checked={active === btn}
                    onChange={() => setActive(btn)}
                >
                    {btn}
                </ToggleButton>
            );
        }

    return (
        <ButtonGroup toggle>
            {buttons}
        </ButtonGroup>
    )
}
