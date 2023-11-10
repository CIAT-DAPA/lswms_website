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

  get_route(inicio_lat, inicio_lon, final_lat, final_lon, profile) {
    const url = `${Configuration.get_url_graphhopper()}/route?key=${
      process.env.REACT_APP_KEY_GRAPHHOPER
    }&point=${inicio_lat},${inicio_lon}&point=${final_lat},${final_lon}&points_encoded=false&profile=${profile}`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          throw new Error(error.response.data.message); // Lanza una excepción con el mensaje de error
        }
        console.log(error, error.response);
      });
  }

  get_geocoding(text) {
    const url = `${Configuration.get_url_graphhopper()}/geocode?key=${
      process.env.REACT_APP_KEY_GRAPHHOPER
    }&q=${text}&limit=2`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default new Services();
