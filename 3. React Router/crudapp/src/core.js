const isLocalhost = (window.location.href).includes("localhost");
export const baseUrl = isLocalhost ? "http://localhost:5003" : "";