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

  get_data_by_date(date) {
    const url = `${Configuration.get_url_api_base()}/lastmonitoredbydate/${date}`;
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

  get_forecasts(waterpointId) {
  const url = `${Configuration.get_url_api_base()}/seasonal_sub_forecast/${waterpointId}`;
  return axios
    .get(url)
    .then((response) => {
      return response.data; // { seasonal: {...}, subseasonal: {...} }
    })
    .catch((error) => console.log(error));
}

  get_route(inicio_lat, inicio_lon, final_lat, final_lon, profile) {
    const url = `${Configuration.get_url_graphhopper()}/route?key=${
      process.env.REACT_APP_KEY_GRAPHHOPER
    }&point=${inicio_lat},${inicio_lon}&point=${final_lat},${final_lon}&points_encoded=false&profile=${profile}&instructions=false`;
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

  get_reverse_geocoding(lat, lon) {
    const url = `${Configuration.get_url_graphhopper()}/geocode?key=${
      process.env.REACT_APP_KEY_GRAPHHOPER
    }&reverse=true&point=${lat},${lon}&limit=1`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  post_subscription(userId, wpId, boletin) {
    console.log(userId, wpId, boletin);
    const url = `${Configuration.get_url_api_base()}/subscribe`;
    return axios
      .post(url, {
        userId: userId,
        waterpoint: wpId,
        boletin: boletin,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get_all_subscription_by_user(userId) {
    const url = `${Configuration.get_url_api_base()}/subscribe/get_subscription_by_user/${userId}`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get_one_subscription_by_user(userId, wpId) {
    const url = `${Configuration.get_url_api_base()}/subscribe/get_subscription_by_waterpoint/${wpId}/${userId}`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  patch_unsubscribe(wpId, subscriptionId) {
    const url = `${Configuration.get_url_api_base()}/subscribe/unsubscribe/${wpId}/${subscriptionId}`;
    return axios
      .patch(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

   get_all_pdfs() {
    const url = `${Configuration.get_url_api_base()}/pdfs`;
    return axios
      .get(url, {
        headers: {
          accept: "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

 

export default new Services();
