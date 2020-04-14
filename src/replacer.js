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
        filter: blur(3em) !important;
    }
    img.${BLUR_CLASS} {
        filter: blur(10px) !important;
    }
`;

/**
 * Single instance of state
 * @type {{getState: (function(): {hideMode: boolean, editMode: boolean, blurMode: boolean}), setState: setState}}
 */
const state = (function () {
    let _state = {
        editMode: false,
        blurMode: false,
        hideMode: false,
    };

    const getState = () => ({..._state});

    const setState = (newState) => {
        _state = {
            ..._state,
            ...newState,
        }
    };

    return {
        getState,
        setState,
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
        switch (msg.type) {
            case 'TOGGLE_EDIT_MODE': {
                state.setState({ editMode: msg.payload });
                document.body.querySelectorAll('*').forEach((item) => {
                    item.setAttribute('contenteditable', msg.payload);
                });
                break;
            }
            case 'TOGGLE_HIDE_MODE': {
                state.setState({ hideMode: msg.payload });
                break;
            }
            case 'TOGGLE_BLUR_MODE': {
                state.setState({ blurMode: msg.payload });
                break;
            }
            case 'GET_STATE': {
                sendResponse(state.getState());
                break;
            }
        }
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

    document.body.addEventListener('mouseover', ({ target, relatedTarget }) => {
        const { blurMode, hideMode } = state.getState();
        if (blurMode || hideMode) {
            relatedTarget && relatedTarget.classList.remove(HOVER_CLASS);
            target && target.classList.add(HOVER_CLASS);
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
