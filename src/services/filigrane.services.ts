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

export class FiligraneServices {
  private readonly data: Map<string, { origin: File; filigrane?: File }> = new Map();

  public prepareFile(file: File): string {
    let id: string;

    do {
      id = crypto.randomUUID();
    } while (this.data.has(id));

    this.data.set(id, { origin: file });

    return id;
  }

  public async addFiligraneToFile(
    id: string,
    watermark: string = `Added with Filigrane.app on ${new Date().toDateString()}.`,
    onEvent: (step: string) => void,
    onCompleted: () => void,
    onError: (message: string) => void,
  ): Promise<void> {
    if (!this.data.has(id)) {
      onError('File is not find in the data.');
      return;
    }

    const file = this.data.get(id)!.origin;

    var formData = new FormData();
    formData.append('files', file);
    formData.append('watermark', watermark);

    onEvent('Sending file to beta.gouv.fr.');

    const baseUrl = 'https://api.filigrane.beta.gouv.fr/api/document';

    const { data, status } = await axios.post<ResponseData>(`${baseUrl}/files`, formData, {
      headers: {
        Accept: 'application/json',
      },
    });

    onEvent('File has been sent.');

    let cpt = 0;
    let res;
    let restart = false;
    do {
      restart = false;
      try {
        onEvent(`Trying to retrieve new file for the ${cpt} time(s).`);
        res = await axios.get<ResponseData2>(`${baseUrl}/url/${data.token}`);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          if (error.response.status === 404 || error.response.status === 409) {
            await sleep(1500);
            restart = true;
          }
        }
      }
    } while (restart);

    onEvent('File is ready will delete it.');

    var param = {
      type: 'download',
      url: `${baseUrl}/${data.token}`,
      filename: file.name,
    };

    const test = await axios.get(param.url, {
      responseType: 'blob',
    });

    onEvent('File ready.');

    this.data.get(id)!.filigrane = new File([test.data], `${file.name}-filigrane.pdf`);

    onCompleted();
  }

  public getBlobFor(id: string): Blob {
    const file = this.data.get(id)!;
    if (file.filigrane) {
      return new Blob([file.filigrane], { type: 'application/pdf' });
    }
    return new Blob([file.origin], { type: file.origin.type });
  }
}
