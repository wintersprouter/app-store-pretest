class ResponseError extends Error {
  constructor(
    message: string,
    public response: Response,
  ) {
    super(message);
  }
}

function mapError(error?: unknown): string | undefined {
  if (!error) {
    return undefined;
  }
  if (error instanceof ResponseError) {
    return error.response.statusText;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}
export default mapError;
