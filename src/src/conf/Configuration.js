const WP_API_BASE = "http://127.0.0.1:5001/api/v1";
const ACLIMATE_API = "https://webapi.aclimate.org/api";
const GEOSERVER_URL = "http://localhost:8080/geoserver/wp/wms";

class Configuration {
  get_url_geoserver() {
    return GEOSERVER_URL;
  }
  get_url_api_base() {
    return WP_API_BASE;
  }
  get_url_api_aclimate() {
    return ACLIMATE_API;
  }
  set_format_administrative_level(adm_level) {
    if (adm_level === "adm1") {
      return "Zone";
    } else if (adm_level === "adm2") {
      return "Woreda";
    } else if (adm_level === "adm3") {
      return "Kebele";
    } else if (adm_level === "watershed_name") {
      return "Watershed name";
    } else {
      return adm_level;
    }
  }
}

export default new Configuration();
