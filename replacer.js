'use strict';
const HOVER_CLASS = 'page-replacer-hover-element';
const HIDDEN_CLASS = 'page-replacer-hidden-element';
const BLUR_CLASS = 'page-replacer-blur-element';

/**
 * Additional styles and classes
 * @type {string}
 */
const styles = `
    .${HOVER_CLASS} {
        outline: 1px dashed currentcolor !important;
        cursor: pointer;
    }
    .${HIDDEN_CLASS} {
        opacity: 0 !important;
    }
    .${BLUR_CLASS} {
        filter: blur(0.3em) !important;
    }
    img.${BLUR_CLASS} {
        filter: blur(10px) !important;
    }
`;

/**
 * Single instance of state
 * @type {{getState: (function(): {hideMode: boolean, editMode: boolean, blurMode: boolean}), setState: setState, setStateWithDefault: setStateWithDefault}}
 */
const state = (function () {
    const initState = {
        editMode: false,
        blurMode: false,
        hideMode: false,
    };
    let _state = {...initState};

    const getState = () => ({..._state});

    const setState = (newState) => {
        _state = {
            ..._state,
            ...newState,
        }
    };

    const setStateWithDefault = (newState) => {
        _state = {
            ...initState,
            ...newState,
        }
    };

    return {
        getState,
        setState,
        setStateWithDefault,
    };
})();

// Call init
init();

/**
 * Main init method
 */
function init() {
    createStyles();
    subscribeOnMessages();
    subscribeOnEvents();
}

/**
 * Subscribe on messages from popup or background
 */
function subscribeOnMessages() {
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
        const prevState = state.getState();
        switch (msg.type) {
            case 'DISABLE_MODE': {
                state.setStateWithDefault();
                break;
            }
            case 'TOGGLE_EDIT_MODE': {
                state.setStateWithDefault({ editMode: msg.payload });
                break;
            }
            case 'TOGGLE_HIDE_MODE': {
                state.setStateWithDefault({ hideMode: msg.payload });
                break;
            }
            case 'TOGGLE_BLUR_MODE': {
                state.setStateWithDefault({ blurMode: msg.payload });
                break;
            }
            case 'GET_STATE': {
                sendResponse(state.getState());
                break;
            }
            case 'REMOVE_CHANGES': {
                removeAllClasses(HIDDEN_CLASS, BLUR_CLASS);
                break;
            }
        }

        const currentState = state.getState();
        if (prevState.editMode !== currentState.editMode) {
            toggleEditMode(currentState.editMode);
        }
    });
}

/**
 * Remove classes from elements
 * @param classes { string }
 */
function removeAllClasses(...classes) {
    if (Array.isArray(classes) && classes.length) {
        const querySelectorString = classes
            .map((item) => `.${item}`)
            .join(',');
        document.body.querySelectorAll(querySelectorString).forEach((element) => {
            element.classList.remove(...classes);
        });
    }
}

/**
 * Toggle contenteditable attribute for all elements
 * @param value { Boolean }
 */
function toggleEditMode(value) {
    document.body.querySelectorAll('*').forEach((item) => {
        item.setAttribute('contenteditable', value);
    });
}

/**
 * Subscribe on client events
 */
function subscribeOnEvents() {
    document.body.addEventListener('click', function(e){
        const { blurMode, hideMode } = state.getState();
        if (blurMode || hideMode) {
            e.preventDefault();
            blurMode && toggleClass(e.target, BLUR_CLASS);
            hideMode && toggleClass(e.target, HIDDEN_CLASS);
        }
    });

    document.body.addEventListener('mouseover', ({ target }) => {
        const { blurMode, hideMode } = state.getState();
        if (blurMode || hideMode) {
            target.classList.add(HOVER_CLASS);
        }
    });

    document.body.addEventListener('mouseout', ({ target }) => {
        const { blurMode, hideMode } = state.getState();
        if (blurMode || hideMode) {
            target.classList.remove(HOVER_CLASS);
        }
    });
}

/**
 * Adding style tag and write styles
 */
function createStyles() {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.append(styleTag);
}

/**
 * Toggle needed class
 * @param element
 * @param className
 */
function toggleClass(element, className) {
    element.classList.toggle(className);
}
