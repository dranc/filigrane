import { FiligraneServices } from './services/filigrane.services';

(() => {
  let filesWithFiligrane: File[];

  function prepareInPlugin() {
    const buttonAddFiligrane = document.getElementById('add-filigrane')!;
    const buttonDownload = document.getElementById('download')!;
    const loading = document.getElementById('loading')!;

    buttonAddFiligrane.addEventListener('click', async () => {
      filesWithFiligrane = [];

      loading.removeAttribute('style');
      buttonAddFiligrane.setAttribute('disabled', 'true');
      buttonDownload.setAttribute('disabled', 'true');

      const files = (document.getElementById('input-file')! as HTMLInputElement).files!;
      if (files.length) {
        for (const filefromInput of files) {
          // const file = await FiligraneServices.addFiligraneToFile(filefromInput, undefined, () => {});
          // filesWithFiligrane.push(file);
        }
      }

      loading.setAttribute('style', 'display: none');
      buttonAddFiligrane.removeAttribute('disabled');
      buttonDownload.removeAttribute('disabled');
    });

    buttonDownload.addEventListener('click', async () => {
      console.log('download');
      for (const file of filesWithFiligrane) {
        // let container = new DataTransfer();
        // container.items.add(file);
        console.log(file);
        chrome.downloads.download({ url: URL.createObjectURL(file), filename: file.name });
      }
    });
  }

  function main() {
    console.log('main');
    // document.getElementById('input-file')!.onchange((ev) => {

    const results = document.getElementById('results')!;
    // });
    document.getElementById('scan')!.addEventListener('click', () => {
      console.log('getting tab');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        console.log('sending message to ', tab);

        chrome.tabs.sendMessage(
          tab.id!,
          {
            type: 'SCAN',
          },
          (response) => {
            console.log('Return of SCAN', response);
            results.innerText = JSON.stringify(response);
          },
        );
      });
    });

    // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //   if (request.type === 'INPUTS_FILE_UPDATE') {
    //     results.innerHTML = '';
    //     console.log(request);

    //     const payload = request.payload.inputs as { name: string; index: number; files: { name: string; size: number; type: string }[] }[];

    //     payload.forEach((input) => {
    //       const newDiv = document.createElement('div');
    //       newDiv.appendChild(document.createTextNode(`input #${input.index}:`));

    //       input.files.forEach((file) => {
    //         const innerDiv = document.createElement('div');
    //         innerDiv.appendChild(document.createTextNode(`file ${file.name} type ${file.type}`));
    //         newDiv.appendChild(innerDiv);
    //       });
    //       results.appendChild(newDiv);
    //     });
    //   }
    // });
  }

  console.log('before');
  document.addEventListener('DOMContentLoaded', main);
  document.addEventListener('DOMContentLoaded', prepareInPlugin);
})();
