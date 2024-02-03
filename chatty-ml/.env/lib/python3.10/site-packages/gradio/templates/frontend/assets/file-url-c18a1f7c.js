import { g as getWorkerProxyContext } from './Index-f4e7a341.js';

function is_self_host(url) {
  return url.host === window.location.host || url.host === "localhost:7860" || url.host === "127.0.0.1:7860" || // Ref: https://github.com/gradio-app/gradio/blob/v3.32.0/js/app/src/Index.svelte#L194
  url.host === "lite.local";
}

function getHeaderValue(headers, key) {
  const unifiedKey = key.toLowerCase();
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === unifiedKey) {
      return v;
    }
  }
}

function should_proxy_wasm_src(src) {
  if (src == null) {
    return false;
  }
  const url = new URL(src);
  if (!is_self_host(url)) {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return false;
  }
  return true;
}
async function resolve_wasm_src(src) {
  if (src == null || !should_proxy_wasm_src(src)) {
    return src;
  }
  const maybeWorkerProxy = getWorkerProxyContext();
  if (maybeWorkerProxy == null) {
    return src;
  }
  const url = new URL(src);
  const path = url.pathname;
  return maybeWorkerProxy.httpRequest({
    method: "GET",
    path,
    headers: {},
    query_string: ""
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(`Failed to get file ${path} from the Wasm worker.`);
    }
    const blob = new Blob([response.body], {
      type: getHeaderValue(response.headers, "content-type")
    });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  });
}

export { getHeaderValue as g, resolve_wasm_src as r, should_proxy_wasm_src as s };
//# sourceMappingURL=file-url-c18a1f7c.js.map
