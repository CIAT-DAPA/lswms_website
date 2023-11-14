const WP_API_BASE = "http://127.0.0.1:5001/api/v1";
const ACLIMATE_API = "https://webapi.aclimate.org/api";
const GEOSERVER_URL = "http://localhost:8080/geoserver/wp/wms";
const GRAPHHOPPER_URL = "https://graphhopper.com/api/1";
const PRODUCTION_API_URL = process.env.REACT_APP_PRODUCTION_API_URL;
const DEBUG = process.env.REACT_APP_DEBUG;
console.log(process.env.DEBUG)
class Configuration {
  get_url_geoserver() {
    return GEOSERVER_URL;
  }
  get_url_api_base() {
    if (process.env.REACT_APP_DEBUG === "true") {
      console.log(DEBUG);
      return WP_API_BASE;
    } else {
      console.log(DEBUG);
      return PRODUCTION_API_URL || WP_API_BASE;
    }
  }
  get_url_api_aclimate() {
    return ACLIMATE_API;
  }
  get_url_graphhopper() {
    return GRAPHHOPPER_URL;
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
