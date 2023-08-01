const WP_API_BASE = "http://127.0.0.1:5000/api/v1";

class Configuration {
  get_url_api_base() {
    return WP_API_BASE;
  }
}

export default new Configuration();
