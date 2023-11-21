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
  export async function addFiligraneToFile(file: File): Promise<File> {
    // const uploadUrl = 'https://api.filigrane.beta.gouv.fr/api/document/files';

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
    return new File([test.data], `${file.name}-filigrane.pdf`);
    // let container = new DataTransfer();
    // container.items.add(newFile);
    // input.files = container.files;

    // return data.token
  }
}
