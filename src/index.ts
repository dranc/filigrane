import { saveAs } from 'file-saver';

import { FiligraneServices } from './services/filigrane.services';

(() => {
  const filigraneServices = new FiligraneServices();

  document.addEventListener('DOMContentLoaded', () => {
    const inputFile = document.getElementById('input-file') as HTMLInputElement;
    const inputText = document.getElementById('input-text') as HTMLInputElement;
    const submit = document.getElementById('submit');

    const files = document.getElementById('files')!;
    const fileExample = files.children[0];

    inputFile.addEventListener('change', (ev) => {
      for (const file of inputFile.files!) {
        const id = filigraneServices.prepareFile(file);

        const newFileElement = fileExample.cloneNode(true) as HTMLElement;
        newFileElement.id = id;
        console.log(URL.createObjectURL(filigraneServices.getBlobFor(id)));
        const preview = newFileElement.querySelector('#preview') as HTMLEmbedElement;
        const blob = filigraneServices.getBlobFor(id);
        preview.type = blob.type;
        preview.src = URL.createObjectURL(blob);

        (newFileElement.querySelector('#name') as HTMLElement).innerText = file.name;
        (newFileElement.querySelector('#size') as HTMLElement).innerText = file.size.toString();

        newFileElement.querySelector('#preview')!.addEventListener('click', () => {
          const url = URL.createObjectURL(filigraneServices.getBlobFor(id));
          console.log(id);
          console.log(url);
          window.open(url);
        });

        newFileElement.querySelector('#download')!.addEventListener('click', () => {
          saveAs(filigraneServices.getBlobFor(id), `${file.name}.pdf`);
        });

        files.appendChild(newFileElement);

        newFileElement.style.display = '';
      }
    });

    submit!.onclick = async (ev) => {
      for (const fileElt of files.children) {
        if (fileElt.id) {
          fileElt.classList.add('loading');

          const process = fileElt.getElementsByClassName('processing')[0] as HTMLElement;

          await filigraneServices.addFiligraneToFile(
            fileElt.id,
            inputText.value,
            (step) => (process.innerText = step),
            () => {
              const url = URL.createObjectURL(filigraneServices.getBlobFor(fileElt.id));

              const preview = fileElt.querySelector('#preview') as HTMLEmbedElement;
              const blob = filigraneServices.getBlobFor(fileElt.id);
              preview.type = blob.type;
              preview.src = URL.createObjectURL(blob);

              fileElt.classList.remove('loading');
            },
            (message: string) => {
              fileElt.classList.remove('loading');
            },
          );
        }
      }
    };
  });
})();
