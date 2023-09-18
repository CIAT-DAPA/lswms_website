import axios from "axios";
import Configuration from "../conf/Configuration";

class Services {
  get_all_waterpoints() {
    const url = `${Configuration.get_url_api_base()}/waterpoints`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get_one_waterpoints(id) {
    const url = `${Configuration.get_url_api_base()}/waterpoints/${id}`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get_waterpoints_profile(ids, language) {
    const url = `${Configuration.get_url_api_base()}/waterpointsprofiles/${ids}/${language}`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get_last_data(id) {
    const url = `${Configuration.get_url_api_base()}/lastmonitored/${id}`;
    return axios.get(url);
  }

  get_data_monitored(id) {
    const url = `${Configuration.get_url_api_base()}/monitored/${id}`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get_subseasonal(id) {
    const url = `${Configuration.get_url_api_aclimate()}/Forecast/SubseasonalWS/${id}/json`;
    return axios
      .get(url)
      .then((response) => {
        return response.data.subseasonal[0].data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get_seasonal(id) {
    const url = `${Configuration.get_url_api_aclimate()}/Forecast/Climate/${id}/true/json`;
    return axios
      .get(url)
      .then((response) => {
        return response.data.climate[0].data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default new Services();
