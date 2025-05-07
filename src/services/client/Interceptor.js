// services/client/Interceptor.js
import camelcaseKeys from "camelcase-keys";

export const responseInterceptor = (response) => {
  console.log(
    "Response from API: ",
    response?.request?.responseURL,
    response?.status
  );

  if (response.status >= 400) {
    console.log("Response from API error: ", response?.data);
    if (response.status === 404) {
      // not found => show customize message instead
      const customError = {
        status: 404,
        ...response?.data,
      };
      return Promise.reject(customError);
    }

    // need to show message from server
    const errorObject = camelcaseKeys(response?.data);

    return Promise.reject({
      ...errorObject,
      status: response.status.toString(),
    });
  }

  // Extract data from response
  const dataObject = response?.data || {};

  // https://github.com/yury-dymov/json-api-normalizer/issues/71
  let normalizeData = camelcaseKeys(dataObject);

  return Promise.resolve(normalizeData);
};

export const errorInterceptor = (error) => {
  return Promise.reject(error);
};

export const requestInterceptor = (config) => {
  console.log(
    "REQUEST: ",
    config?.method,
    (config?.baseURL ?? "") + config?.url,
    config?.data
  );
  return config;
};
