'use strict';
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.getSelected(null, function (tab) {
        /**
         * Getting state
         */
        chrome.tabs.sendMessage(tab.id, {type: 'GET_STATE'}, (status) => {
            editMode.checked = status.editMode;
            hideMode.checked = status.hideMode;
            blurMode.checked = status.blurMode;
        });

        editMode.addEventListener('change', function(event) {
            chrome.tabs.sendMessage(tab.id, {type: 'TOGGLE_EDIT_MODE', payload: event.target.checked});
        });

        blurMode.addEventListener('change', function(event) {
            chrome.tabs.sendMessage(tab.id, {type: 'TOGGLE_BLUR_MODE', payload: event.target.checked});
        });

        hideMode.addEventListener('change', function(event) {
            chrome.tabs.sendMessage(tab.id, {type: 'TOGGLE_HIDE_MODE', payload: event.target.checked});
        });

    });
}, false);
