export const DEFAULT_HEADER = {
  'Content-Type': 'application/json',
};

export const GET = (url, headers = DEFAULT_HEADER) => {
  const request = {
    url,
    headers,
    responseType: 'json',
    method: 'GET',
  };

  return request;
};

export const PUT = (url, body, headers = DEFAULT_HEADER) => {
  const request = {
    url,
    body,
    headers,
    responseType: 'json',
    method: 'PUT',
  };

  return request;
};

export const POST = (url, body, headers = DEFAULT_HEADER) => {
  const request = {
    url,
    body,
    headers,
    responseType: 'json',
    method: 'POST',
  };

  return request;
};

export const DELETE = (url, headers = DEFAULT_HEADER) => {
  const request = {
    url,
    headers,
    responseType: 'json',
    method: 'DELETE',
  };

  return request;
};

export default {
  GET,
  PUT,
  POST,
  DELETE,
};
