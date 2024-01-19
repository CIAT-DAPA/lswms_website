const WP_API_BASE = "http://127.0.0.1:5000/api/v1";
const ACLIMATE_API = "https://webapi.aclimate.org/api";
const GEOSERVER_URL = "http://localhost:8080/geoserver/wp/wms";
const GRAPHHOPPER_URL = "https://graphhopper.com/api/1";
const PRODUCTION_API_URL = process.env.REACT_APP_PRODUCTION_API_URL;
const GEOSERVER_PRODUCTION_URL =
  "https://geo.aclimate.org/geoserver/waterpoints_et/wms";
const KEYCLOAK_URL = "http://localhost:5004";
const KEYCLOAK_URL_PRODUCTION = process.env.REACT_APP_KEYCLOAK_URL_PRODUCTION;
const KEYCLOAK_REALM = "waterpoints-monitoring";
const KEYCLOAK_CLIENT = "myclient";

class Configuration {
  get_url_geoserver() {
    if (process.env.REACT_APP_DEBUG === "true") {
      return GEOSERVER_URL;
    } else {
      return GEOSERVER_PRODUCTION_URL || GEOSERVER_URL;
    }
  }
  get_url_api_base() {
    if (process.env.REACT_APP_DEBUG === "true") {
      return WP_API_BASE;
    } else {
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
  get_url_auth() {
    if (process.env.REACT_APP_DEBUG === "true") {
      return KEYCLOAK_URL;
    } else {
      return KEYCLOAK_URL_PRODUCTION || KEYCLOAK_URL;
    }
  }
  get_keycloak_realm() {
    return KEYCLOAK_REALM;
  }
  get_keycloak_client() {
    return KEYCLOAK_CLIENT;
  }
}

export default new Configuration();
