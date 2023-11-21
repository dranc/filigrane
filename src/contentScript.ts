import axios, { AxiosError } from 'axios';

type SendData = {
  files: File[];
  watermark: string;
};

type ResponseData = {
  token: string;
};

type ResponseData2 = {
  url: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

console.log('content string');
const inputs = document.body.querySelectorAll<HTMLInputElement>('input[type=file]');

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

inputs.forEach((input) => {
  return;
  console.log('input', input);
  input.onchange = async (ev: Event) => {
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const uploadUrl = 'https://api.filigrane.beta.gouv.fr/api/document/files';
        const file: File = input.files[i];

        // var reader = new FileReader();
        // reader.onload = async function(e){
        //   if (!e.target)
        //   return;
        //     console.log(e.target.result);
        var formData = new FormData();
        formData.append('files', file);
        formData.append('watermark', 'this is a test from code');

        const { data, status } = await axios.post<ResponseData>(
          'https://api.filigrane.beta.gouv.fr/api/document/files',
          formData,
          // {
          //   files: [new File(e.target.result, 'name.pdf')],
          //   watermark: 'this is a test from code'
          // } as SendData,
          {
            headers: {
              Accept: 'application/json',
            },
          },
        );
        console.log(data, status);

        let res;
        let restart = false;
        do {
          restart = false;
          try {
            res = await axios.get<ResponseData2>(`https://api.filigrane.beta.gouv.fr/api/document/url/${data.token}`);
          } catch (error) {
            console.log(error);

            if (error instanceof AxiosError && error.response) {
              console.log(error.status);
              if (error.response.status === 404 || error.response.status === 409) {
                console.log('sleep anbd restart');
                await sleep(1500);
                restart = true;
              }
            }
          }
        } while (restart);

        console.log(res);

        var param = {
          type: 'download',
          url: `https://api.filigrane.beta.gouv.fr/api/document/${data.token}`,
          filename: file.name,
        };

        const test = await axios.get(param.url, {
          responseType: 'blob',
        });
        const newFile = new File([test.data], 'this is a test.pdf');
        let container = new DataTransfer();
        container.items.add(newFile);
        input.files = container.files;

        // await chrome.runtime.sendMessage(param);

        //           console.log(chrome.downloads)
        //           chrome.downloads.download({url: `https://api.filigrane.beta.gouv.fr/api/document/${data.token}`},
        //             function(id) {
        // });
        // chrome.downloads.download({
        //   url:
        // })
        // }
        // await reader.readAsArrayBuffer(file);
      }
    }
  };
});

// // // Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('onMessage', request.type);
  if (request.type === 'SCAN') {
    const tmp = scanForInput();
    console.log(tmp);
    sendResponse(tmp);
  }
});

function makeid(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function scanForInput() {
  const inputElements = document.body.querySelectorAll<HTMLInputElement>('input[type=file]');
  const inputs: { name: string; index: number; id: string; files: { name: string; size: number; type: string }[] }[] = [];

  inputElements.forEach((input, index) => {
    console.log(input);
    inputs[index] = {
      id: makeid(7),
      name: input.name,
      index,
      files: [],
    };

    input.setAttribute('filigrane-id', inputs[index].id);

    input.onchange = async (ev: Event) => {
      const files = [];
      for (let i = 0; i < input.files!.length; i++) {
        files.push({
          name: input.files![i].name,
          size: input.files![i].size,
          type: input.files![i].type,
        });
      }

      inputs[index].files = files;
      console.log('sending ', inputs);
      chrome.runtime.sendMessage({
        type: 'INPUTS_FILE_UPDATE',
        payload: {
          inputs,
        },
      });
    };
  });

  chrome.runtime.sendMessage({
    type: 'INPUTS_FILE_UPDATE',
    payload: {
      inputs,
    },
  });

  return inputs;
}

scanForInput();

// 'use strict';

// // Content script file will run in the context of web page.
// // With content script you can manipulate the web pages using
// // Document Object Model (DOM).
// // You can also pass information to the parent extension.

// // We execute this script by making an entry in manifest.json file
// // under `content_scripts` property

// // For more information on Content Scripts,
// // See https://developer.chrome.com/extensions/content_scripts

// // Log `title` of current active web page
// const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
// console.log(
//   `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
// );

// // Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: 'GREETINGS',
//     payload: {
//       message: 'Hello, my name is Con. I am from ContentScript.',
//     },
//   },
//   response => {
//     console.log(response.message);
//   }
// );

// // Listen for message
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'COUNT') {
//     console.log(`Current count is ${request.payload.count}`);
//   }

//   // Send an empty response
//   // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
//   sendResponse({});
//   return true;
// });
