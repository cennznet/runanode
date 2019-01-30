// @flow
import qs from 'qs';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { ajax } from 'rxjs/observable/dom/ajax';
import { mergeMap, tap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
// import types from 'common/types/types';
import { DEFAULT_HEADER } from './apiHelper';
// import { authorizedMiddleware } from './authorizedAjax';
// import { isTokenExpired } from './tokenHelper';

const defaultAjax = (options, store) => ajax(options);

const defaultMiddleware = (mapRequest, mapResponse, makeHeaders) => ({
  body,
  url,
  headers,
  response,
}) => {
  return {
    body: mapRequest ? mapRequest(body) : body,
    url,
    headers: typeof makeHeaders === 'function' ? makeHeaders(body) : makeHeaders || headers,
    response: response.then(
      ({ ajaxResponse }) => (mapResponse ? mapResponse(ajaxResponse, body) : ajaxResponse.response),
      ({ ajaxResponse }) => Promise.reject(ajaxResponse.response)
    ),
  };
};

/**
 * @typedef {{
    body: any,
    url: string,
    headers: Object,
    response: Promise<{
      payload: any,
      ajaxResponse: import('rxjs/observable/dom/AjaxObservable').AjaxResponse
    }>,
    store: import('redux').Store
  }} MiddlewareInput
 */

/**
 * @typedef {{
    body?: Object,
    url?: string,
    headers?: Object,
    response?: Promise<Object>
  }} MiddlewareResult
 */

/**
 * @typedef {(MiddlewareInput) => MiddlewareResult} MiddlewareHandler
 */

/**
 * @param {{
  type: { requested: string, completed: string, failed: string },
  url: string | ((url: string) => string),
  withCredentials?: boolean,
  mapRequest?: (payload: Object) => Object,
  mapResponse?: (resp: Object, requestPayload: Object) => Object,
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE',
  headers?: Object,
  query?: boolean,
  responseType? : 'json' | 'text' | 'blob'
  doAjax?: (options: Object, store: Object) => Object,
  middlewares?: MiddlewareHandler[]
  }} options
 */
const createAPICallEpic = ({
  type,
  url,

  withCredentials = undefined,

  mapRequest,
  mapResponse,

  method = 'POST',
  headers = undefined, // NULL will not trigger default args
  query = false,
  responseType = 'json',

  doAjax = defaultAjax,

  middlewares = [],
}) => {
  // eslint-disable-next-line
  middlewares = [defaultMiddleware(mapRequest, mapResponse, headers), ...middlewares];

  const createRequest = (payload, store) => {
    const resolvedUrl = typeof url === 'string' ? url : url(payload);

    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });

    const request = {
      body: payload,
      url: resolvedUrl,
      headers: DEFAULT_HEADER,
      response: deferred.promise,
      store,
    };

    for (const middleware of middlewares) {
      const nextReq = middleware(request);
      if (nextReq.body !== undefined) {
        request.body = nextReq.body;
      }
      if (nextReq.url) {
        request.url = nextReq.url;
      }
      if (nextReq.headers) {
        request.headers = nextReq.headers;
      }
      if (nextReq.response) {
        const handler = ({ ajaxResponse }) => {
          return Promise.resolve(nextReq.response).then(
            resp => ({
              payload: resp,
              ajaxResponse,
            }),
            errResp =>
              // eslint-disable-next-line
              Promise.reject({
                payload: errResp,
                ajaxResponse,
              })
          );
        };
        request.response = request.response.then(handler, handler);
      }
    }

    const ajaxRequest = {
      url: request.url,
      headers: request.headers,
      responseType,
      method,
    };

    if (withCredentials != null) {
      ajaxRequest.withCredentials = withCredentials;
    }

    if (request.body) {
      if (method === 'GET') {
        if (query) {
          ajaxRequest.url = `${request.url}?${qs.stringify(request.body)}`;
        }
      } else {
        ajaxRequest.body = request.body;
      }
    }

    return {
      request: ajaxRequest,
      deferred,
      responsePromise: request.response,
    };
  };

  return (action$, store) =>
    action$.pipe(
      ofType(type.requested),
      mergeMap(({ payload }) => {
        // if (isTokenExpired() === true) {
        //   return of({ type: types.token.failed });
        // }

        const { request, deferred, responsePromise } = createRequest(payload, store);
        return doAjax(request, store).pipe(
          tap(xhr => deferred.resolve({ ajaxResponse: xhr })),
          mergeMap(xhr => {
            const promise = responsePromise
              .then(data => {
                // if (data.ajaxResponse
                //   && data.ajaxResponse.response
                //   && data.ajaxResponse.response.jsonrpc
                //   && data.ajaxResponse.response.error) {
                //   // check jsonrpc response
                //   return ({
                //     type: type.failed,
                //     payload: data.payload,
                //     meta: xhr,
                //     error: true,
                //   });
                // }
                return {
                  type: type.completed,
                  payload: data.payload,
                  meta: xhr,
                };
              })
              .catch(data => ({
                type: type.failed,
                payload: data.payload,
                meta: xhr,
                error: true,
              }));
            return from(promise);
          }),
          catchError((err, caught) => {
            const { xhr } = err;
            deferred.reject({ ajaxResponse: xhr });
            // return of(xhr);
            return of({
              type: type.failed,
              payload: null,
              meta: xhr,
              error: true,
            });
          })
        );
      })
    );
};

// /**
//  * @param {typeof createAPICallEpic} base
//  * @param  {...MiddlewareHandler} middlewares
//  * @returns {typeof createAPICallEpic}
//  */
// export const withMiddleware = (base, ...middlewares) => options =>
//   base({
//     ...options,
//     middlewares: options.middlewares ? [...middlewares, ...options.middlewares] : middlewares,
//   });

// export const createAuthorizedAPICallEpic = withMiddleware(createAPICallEpic, authorizedMiddleware);

export const withJsonRpcMiddleware = base => options =>
  base({
    ...options,
    method: 'POST',
    mapRequest: () => ({
      jsonrpc: '2.0',
      method: options.jsonRpcMethod,
      params: options.jsonRpcParams,
      id: 1,
    }),
  });

export const createJsonRpcAPICallEpic = withJsonRpcMiddleware(createAPICallEpic);

export default createAPICallEpic;

// const addId = (key, value) => ({ payload }) => ({ ...payload, [key]: value });
//
// export const addIdMiddleware = (key = 'id') => ({ body, response }) => ({
//   response: response.then(addId(key, body[key]), x => Promise.reject(addId(key, body[key])(x)))
// });
//
// export const addMFAMiddleware = () => ({ body: { mfa, ...body }, headers }) => ({
//   body,
//   headers: mfa
//     ? {
//       ...headers,
//       'x-ev-mfa': JSON.stringify(mfa)
//     }
//     : null
// });
