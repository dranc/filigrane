import axios, { AxiosError } from 'axios';

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

export namespace FiligraneServices {
  export async function addFiligraneToFile(
    file: File,
    watermark: string = 'this is a test from code',
    onEvent: (step: string) => void,
  ): Promise<File> {
    // const uploadUrl = 'https://api.filigrane.beta.gouv.fr/api/document/files';

    var formData = new FormData();
    formData.append('files', file);
    formData.append('watermark', watermark);
    onEvent('Sending file to beta.gouv.fr.');
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

    onEvent('File has been sent.');

    let cpt = 0;
    let res;
    let restart = false;
    do {
      restart = false;
      try {
        res = await axios.get<ResponseData2>(`https://api.filigrane.beta.gouv.fr/api/document/url/${data.token}`);
        onEvent(`Trying to retrieve new file for the ${cpt} time.`);
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

    onEvent('File is ready will delete it.');

    var param = {
      type: 'download',
      url: `https://api.filigrane.beta.gouv.fr/api/document/${data.token}`,
      filename: file.name,
    };

    const test = await axios.get(param.url, {
      responseType: 'blob',
    });

    onEvent('File downloaded.');

    return new File([test.data], `${file.name}-filigrane.pdf`);
    // let container = new DataTransfer();
    // container.items.add(newFile);
    // input.files = container.files;

    // return data.token
  }
}
