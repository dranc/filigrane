import './asset/style/index.scss';

import { saveAs } from 'file-saver';

import { FiligraneServices } from './services/filigrane.services';

(() => {
  const filesMap = new Map<string, File>();

  document.addEventListener('DOMContentLoaded', () => {
    const inputFile = document.getElementById('input-file') as HTMLInputElement;
    const inputText = document.getElementById('input-text') as HTMLInputElement;
    const submit = document.getElementById('submit');

    const files = document.getElementById('files')!;
    const fileExample = files.children[0];

    inputFile.addEventListener('change', (ev) => {
      for (const file of inputFile.files!) {
        const id = crypto.randomUUID();

        console.log(fileExample);

        const newFileElement = fileExample.cloneNode(true) as HTMLElement;
        newFileElement.id = id;

        (newFileElement.getElementsByClassName('name')[0] as HTMLElement).innerText = file.name;

        files.appendChild(newFileElement);
        filesMap.set(id, file);

        newFileElement.style.display = '';
      }
    });

    submit!.onclick = async (ev) => {
      const filigrane = inputText.value || `Added from Filigrane.app on ${new Date().toDateString()}.`;
      for (const fileElt of files.children) {
        if (fileElt.id) {
          console.log(`sending ${fileElt.id}`);
          const file = filesMap.get(fileElt.id);
          if (!file) {
            throw Error(`File ${fileElt.id} lost ?`);
          }

          const actions = fileElt.getElementsByClassName('actions')[0] as HTMLElement;

          actions.innerText = 'Adding Filigrane';

          const newFile = await FiligraneServices.addFiligraneToFile(file, filigrane);
          const newFileBlob = new Blob([newFile], { type: 'application/pdf' });

          const preview = document.createElement('button');
          preview.innerText = 'Preview';
          preview.onclick = () => {
            window.open(URL.createObjectURL(newFileBlob));
          };

          const download = document.createElement('button');
          download.innerText = 'Download';
          download.onclick = () => {
            saveAs(newFileBlob, `${file.name}.pdf`);
          };

          actions.innerHTML = '';
          actions.appendChild(preview);
          actions.appendChild(download);
        }
      }
    };
  });
})();
