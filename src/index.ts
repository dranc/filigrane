import './index.scss';

import { FiligraneServices } from './filigrane.services';

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
        (newFileElement.getElementsByClassName('size')[0] as HTMLElement).innerText = file.size.toString();

        files.appendChild(newFileElement);
        filesMap.set(id, file);
      }
    });

    submit!.onclick = async (ev) => {
      if (inputText.value && files.children.length > 0) {
        for (const fileElt of files.children) {
          if (fileElt.id && (fileElt.getElementsByClassName('selected')[0] as HTMLInputElement).checked) {
            console.log(`sending ${fileElt.id}`);
            const file = filesMap.get(fileElt.id);
            if (!file) {
              throw Error(`File ${fileElt.id} lost ?`);
            }
            const newFile = await FiligraneServices.addFiligraneToFile(file, inputText.value);
            const seePreview = document.createElement('button');
            seePreview.innerText = 'see preview';
            seePreview.onclick = () => {
              console.log(newFile.name);
              const t = new Blob([newFile], { type: 'application/pdf' });
              window.open(URL.createObjectURL(t));
            };
            fileElt.appendChild(seePreview);
          }
        }
      }
    };
  });
})();
