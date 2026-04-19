/**
 * Jest (jsdom) omits Web Fetch API globals; next/server expects Request/Response.
 */
const { TextEncoder, TextDecoder } = require("node:util");
if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder;
}

const { ReadableStream, WritableStream, TransformStream } =
  require("node:stream/web");
if (typeof globalThis.ReadableStream === "undefined") {
  globalThis.ReadableStream = ReadableStream;
}
if (typeof globalThis.WritableStream === "undefined") {
  globalThis.WritableStream = WritableStream;
}
if (typeof globalThis.TransformStream === "undefined") {
  globalThis.TransformStream = TransformStream;
}

const { Request, Response, Headers, fetch } = require("undici");

if (typeof globalThis.Request === "undefined") {
  globalThis.Request = Request;
}
if (typeof globalThis.Response === "undefined") {
  globalThis.Response = Response;
}
if (typeof globalThis.Headers === "undefined") {
  globalThis.Headers = Headers;
}
if (typeof globalThis.fetch === "undefined") {
  globalThis.fetch = fetch;
}
