/** CJS stub for the ESM-only `react-markdown` package. */
const React = require("react");
// Render children as plain text — sufficient for structural tests.
function ReactMarkdown({ children }) {
  return React.createElement("span", null, children);
}
module.exports = { __esModule: true, default: ReactMarkdown };
