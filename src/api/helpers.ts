type API_MESSAGE = {
  status: number,
  message: string,
};

export const successMessage = (responseObj: object): API_MESSAGE => {
  return {
    status: 200,
    ...responseObj
  } as API_MESSAGE;
}