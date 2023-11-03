'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('addListener', request);
  if (request.type === 'download') {
    chrome.downloads.download({ url: request.url, filename: request.filename });
  }

  if (request.type === 'SCAN') {
    console.log('SCAN', request);
  }

  if (request.type === 'GREETINGS') {
    const message = `Hi ${sender.tab ? 'Con' : 'Pop'}, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    sendResponse({
      message,
    });
  }
});

// chrome.action.setBadgeText(
//   {
//     text: inputs.length.toString(),
//   },
//   () => {
//     console.log('why ?');
//   },
// );

// setTimeout(() => {
//   chrome.action.openPopup();
// }, 2000);
