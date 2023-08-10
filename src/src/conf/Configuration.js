const WP_API_BASE = "http://127.0.0.1:5000/api/v1";
const ACLIMATE_API = "https://webapi.aclimate.org/api";

class Configuration {
  get_url_api_base() {
    return WP_API_BASE;
  }
  get_url_api_aclimate() {
    return ACLIMATE_API;
  }
}

export default new Configuration();
