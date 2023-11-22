import { FiligraneServices } from "./filigrane.services";

(() => {
    const filesMap = new Map<string, File>();

    document.addEventListener('DOMContentLoaded', () => {
        const inputFile = document.getElementById('input-file') as HTMLInputElement;
        const inputText = document.getElementById('input-text') as HTMLInputElement;
        const submit = document.getElementById('submit');

        const files = document.getElementById('files')!;

        inputFile.addEventListener('change', (ev) => {
            for(const file of inputFile.files!) {
                const div = document.createElement('div');
                div.id = crypto.randomUUID();
                div.classList.add('file');

                const checkbox = document.createElement('input');
                checkbox.id = 'checkbox';
                checkbox.type = 'checkbox';

                const img = document.createElement('img');
                img.setAttribute('src', 'icons/icon_16.png');

                const name = document.createElement('label');
                name.innerText = file.name;

                const size = document.createElement('label');
                size.innerText = file.size.toString();              

                div.append(checkbox, img, name, size);

                files.replaceChildren(div);
                filesMap.set(div.id, file);
            }
        });

        submit!.onclick = (async (ev) => {
            if (inputText.value && files.children.length > 0) {                
                for(const fileElt of files.children) {
                    const file = filesMap.get(fileElt.id);
                    if (!file) {
                        throw Error('File lost ?')
                    }
                    const newFile = await FiligraneServices.addFiligraneToFile(file, inputText.value);
                    const seePreview = document.createElement('button');
                    seePreview.innerText='see preview';
                    seePreview.onclick = () => {
                        console.log(newFile.name)
                        const t = new Blob([newFile], { type: 'application/pdf' });
                        window.open(URL.createObjectURL(t))
                    }
                    fileElt.appendChild(seePreview);
                }
            }
        });
    });
})();