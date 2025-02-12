import axios from "axios";
export const xmlToJson = (xml) => {
    let obj = {};
    if (xml.nodeType === 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) {
        return xml.nodeValue.trim();
    }

    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            const nodeValue = xmlToJson(item);
            if (nodeValue) {
                if (typeof obj[nodeName] === "undefined") {
                    obj[nodeName] = nodeValue;
                } else {
                    if (!Array.isArray(obj[nodeName])) {
                        obj[nodeName] = [obj[nodeName]];
                    }
                    obj[nodeName].push(nodeValue);
                }
            }
        }
    }
    return obj;
};
export const fetchLayersData = async () => {
    try {
        const url = "https://geo.aclimate.org/geoserver/aclimate_et/wms?service=WMS&version=1.1.0&request=GetCapabilities&layers=aclimate_et";
        const response = await axios.get(url, { responseType: "text" });

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        const jsonData = xmlToJson(xmlDoc);
        const capas = jsonData?.WMT_MS_Capabilities[1]?.Capability?.Layer?.Layer;

        if (capas) {
            return capas.map(item => {
                const fechas = item.Extent["#text"]
                    .split(",")
                    .map(fecha => fecha.split("T")[0]);

                return {
                    Name: item.Name["#text"],
                    Fechas: fechas,
                };
            });
        } else {
            console.error("No se encontraron datos en Layer.Layer");
            return [];
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return [];
    }
};
