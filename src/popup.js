'use strict';
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.getSelected(null, function (tab) {
        /**
         * Getting state
         */
        chrome.tabs.sendMessage(tab.id, {type: 'GET_STATE'}, (status) => {
            if (!status.editMode && !status.hideMode && !status.blurMode) {
                disableMode.checked = true;
            } else {
                editMode.checked = status.editMode;
                hideMode.checked = status.hideMode;
                blurMode.checked = status.blurMode;
            }
        });

        disableMode.addEventListener('change', function() {
            chrome.tabs.sendMessage(tab.id, {type: 'DISABLE_MODE'});
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

        removeChanges.addEventListener('click', function() {
            chrome.tabs.sendMessage(tab.id, {type: 'REMOVE_CHANGES'});
        });
    });
}, false);
