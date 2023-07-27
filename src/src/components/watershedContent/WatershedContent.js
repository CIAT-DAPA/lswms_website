import React from "react";
import WatershedItem from "../watershedItem/WatershedItem";

function WatershedContent() {
  return (
    <>
      <h5 className="mt-4 mb-3">Watershed</h5>
      <WatershedItem
        title="Topography"
        description="Borana zone is one of the 21 administrative zones of Oromia regional state, Southern Ethiopia. It is located in the Southern part of the region. The zone is bordered by Kenya in the South, West Guji zone in the North, Somali region and Guji zone in the East and South Nations and Nationalities Peoples’ Region (SNNPR) in the West. the zone has thirteen rural pastoralist woreda namely, Arero, Dhas, Dillo, Dirre, Dubluk, Eelwoye, Gomole, Guchi, Miyo, Moyale, Taltale, Yaballo and Wachile. Yabelo is the capital town of Borana zone and located at about 570 km South of Addis Ababa."
      />
      <WatershedItem
        title="Hidrology"
        description="The ephemeral drainage system of the Borana zone is located within the Genale-Dawa River basin. Groundwater levels are generally deep (<10m). To extract groundwater, the population of Borana are using traditional deep wells whose water retention potential varies with rainfall, the so-called ‘singing wells’. These deep wells of Borana have existed for over 20 years and today they still serve as a crucial resource of the Borana pastoralist production system. Providing water under pastoral circumstances is difficult, primarily because of low population densities, nomadic culture and harsh environmental characteristics. Also, in providing new water sources (boreholes, ponds, and cisterns or birka) in these semi-arid areas, there is a risk of the livestock population rising above the (variable) carrying capacity of rangeland, and a potential for aggravating the impact of catastrophic events such as droughts."
      />
    </>
  );
}

export default WatershedContent;
