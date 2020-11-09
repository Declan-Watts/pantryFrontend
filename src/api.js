import axios from "axios";

let baseUrl = "http://localhost:54176/api/";
// let host = window.location.host;
// if (
//   host == "localhost:8080" ||
//   host == "localhost:8081" ||
//   host == "localhost:8082" ||
//   host == "192.168.178.21:8080" ||
//   host == "192.168.178.21:8081" ||
//   host == "192.168.178.21:8082" ||
//   host == "10.0.0.9:8080"
// ) {
//   baseUrl = "Domain";
// } else if (host == "HOST") {
//   baseUrl = "Domain";
// } else if (host.substring(0, 4) == "dev.") {
//   baseUrl = "Domain";
// }

let api = axios.create({
  baseURL: baseUrl
});

export default api;
