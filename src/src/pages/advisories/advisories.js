import React, { useState, useEffect, useMemo} from "react";
import { useTranslation } from "react-i18next";
import "./Advisories.css";
import BtnDownload from "../../components/btnDownload/BtnDownload";
import ShareButton from "../../components/shareButton/ShereButton";

function Advisories() {
  const { t } = useTranslation("global");

  // Estado
  const [type, setType] = useState("seasonal"); 
  const [season, setSeason] = useState("");
  const [seasonOptions, setSeasonOptions] = useState([]);

  const FILE_MAP = useMemo(
    () => ({
      "q2-2024": {
        label: "Jun-Aug 2024",
        name: "Pastoral-Advisory-Jun-August-2024.pdf",
        route: "/data/Pastoral-Advisory-Jun-August-2024.pdf",
        start: new Date(2024, 5, 1),
      },
      "q4-2024": {
        label: "Oct-Dec 2024",
        name: "Pastoral-Advisory-October-December-2024.pdf",
        route: "/data/Pastoral-Advisory-October-December-2024.pdf",
        start: new Date(2024, 9, 1),
      },
      "q1-2025": {
        label: "Mar-May 2025",
        name: "Pastoral-Advisory-March-May-2025.pdf",
        route: "/data/Pastoral-Advisory-March-May-2025.pdf",
        start: new Date(2025, 2, 1), 
      },
      "q3-2025": {
        label: "Jul-Sep 2025",
        name: "Pastoral-Advisory-July-September-2025.pdf",
        route: "/data/Pastoral-Advisory-July-September-2025.pdf",
        start: new Date(2025, 6, 1),
      },
    }),
    []
  );

  const SPECIAL_DESCRIPTIONS = {
    "q2-2024": (
      <ul>
        <li>
          Moderate to severe heat stress is likely in the Afar and Somali
          regions during the upcoming JJA season, while Borana zone is expected
          to experience minimal heat stress.
        </li>
        <li>
          With the projected wetter-than-average kiremt rainfall in the northern
          highlands, there is an increased risk of the Awash River overflowing
          and causing flash flooding in the Afar region.
        </li>
        <li>
          The recent March to May (MAM) season rainfall has benefited rangelands
          in the country&apos;s pastoral areas substantially. This has resulted
          in visible improvements in pasture availability in many of the Southern
          Oromia zones (Borana &amp; Guji zone) and south and western parts of
          the Somali Regional State.
        </li>
        <li>
          Pastoral areas in the Borana zone are anticipated to have good
          rangeland conditions during the JJA season, while the Eastern part of
          the Somali Regional State is expected to experience very poor
          conditions. It&apos;s strongly recommended that regions with good
          rangeland stockpiles feed for potential future shortages. Pastoralists
          in areas with very poor rangeland conditions are advised to closely
          monitor rangeland and consider moving their livestock to areas with
          better grazing availability.
        </li>
        <li>
          The water points in the Borana Zone and most parts of the Somali
          Regional State are expected to decline due to dry and reduced
          rainfall, high evaporation, and limited water resources. Therefore,
          close monitoring of the water points is key.
        </li>
      </ul>
    ),

    "q4-2024": (
      <div>
        <p>
          The October to December 2024 seasonal forecast for pastoral regions
          anticipated rainfall trends across the Ethiopian lowlands. It
          indicates that below-normal rainfall is likely in the southern,
          eastern, and southeastern areas. Specifically, the Borana and South
          Omo zones, as well as various regions in Oromia, are predicted to
          experience normal to below normal rainfall. In contrast, the Somali
          and Afar regional states are predicted to face significantly
          below-normal rainfall, having potential impacts on the target pastoral
          activities in these regions. To address these challenges, it is
          essential for local authorities and pastoral communities to adopt
          proactive measures, such as implementing all possible water
          management, including indigenous practices and promoting sustainable
          soil and water conservation practices to mitigate its adverse effects.
        </p>
        <p>
          Additionally, the predicted pasture coverage during the OND season
          will be poor in the Afar region, South Omo zone, Borana zone, and
          most areas of the Somali region, except for the eastern Somali zones
          where moderate pasture availability is expected. This disparity in
          pasture conditions is crucial for the health of livestock and the
          livelihoods of communities in the affected regions. Therefore, it is
          essential for the pastoral communities and local authorities to
          promote and implement practices that can enhance pasture management
          and optimize the utilization of available resources.
        </p>
        <p>
          Regarding heat stress, the Borana Zone will likely experience less
          heat stress than the Afar and Somali regions during the OND season.
          Heat stress level in the Afar region is expected to be moderate to
          severe in October, while the Somali region may also face moderate heat
          stress. To address this, communities in these regions should implement
          heat management practices like providing shade and ensuring sufficient
          watering for their livestock.
        </p>
        <p>
          Moreover, heat stress is expected to persist in irrigated lowland
          wheat farms, particularly affecting critical growth stages; like
          flowering, seed setting, and grain filling, which may lead to crop
          failure. To effectively manage heat stress in wheat farming, it is
          recommended to plant strategically: in Gode, Kelafo, and Dega Habur,
          planting from early to mid-October is advised; while for Amibara,
          planting in the fourth week of September is advised, For Selamago,
          planting from early October is advised. Additionally, utilizing
          heat-tolerant varieties and implementing effective irrigation
          practices will further help mitigate heat stress.
        </p>
        <p>
          Finally, given the anticipated drier rainy season across most pastoral
          regions, pastoral communities may face an increased risk of
          resource-related conflicts and unintended migrations. To address these
          potential tensions, it is crucial to engage in proactive community
          dialogue through different community platforms, including the Pastoral
          Community of Practice Alliance (PCoPs-Alliance), targeting scarce
          resource management, raise community awareness, and establish early
          warning systems.
        </p>
      </div>
    ),

    "q1-2025": (
      <div>
        <p>
          The March to May (MAM) 2025 seasonal climate forecast for pastoral
          regions considers the OND 2024 rainfall deficit impacts and the
          agropastoral activities of these areas. Most Southern, Southeastern,
          and Eastern regions of Ethiopia are expected to receive below-normal
          rainfall, except for the Southwest zones and Western woredas of Borana
          and Guji.
        </p>
        <p>
          March is predicted to be particularly dry, exacerbating the dryness
          from the previous season. However, as the season progresses into April
          and May, rainfall distribution is likely to improve in southern
          agropastoral zones. Conversely, the Somali and Afar regional states
          are expected to continue experiencing below-normal rainfall, which
          could adversely impact pastoral activities.
        </p>
        <p>
          To mitigate these challenges, local authorities and pastoral
          communities must promote and adopt proactive measures, including
          various water management practices, indigenous agroecological
          techniques, and sustainable soil and water conservation methods. Such
          strategies are essential to alleviate the adverse effects of the
          anticipated weather patterns.
        </p>
        <p>
          In the meantime, pasture coverage during the MAM season is expected to
          be poor in Afar, Eastern Borana, South Omo, and Northeastern Somali
          regions. Moderate pasture availability is anticipated in southeastern
          Borana and larger areas of the Somali region. This disparity in
          pasture conditions is critical, as it directly influences livestock
          health and community livelihoods, leading to potential outbreaks of
          diseases like black leg following extended dry periods. Given the
          transportation difficulties for forage during drought, agropastoral
          communities should consider investing in forage crops rather than food
          crops, which are easier to transport.
        </p>
        <p>
          Additionally, the risk of heat stress varies across regions; Borana
          Zone is likely to experience less heat stress than Afar and Somali
          regions, where heat stress levels may be mild to moderate throughout
          MAM. Communities in these areas should implement heat management
          practices, such as providing shade and reducing the risk of
          heat-related illnesses.
        </p>
        <p>
          Finally, the anticipated drier conditions across most pastoral regions
          may increase the likelihood of resource-related conflicts and
          unintended migrations. Addressing these potential tensions requires
          proactive community dialogue through platforms like the Pastoral
          Community of Practice Alliance (PCoPs-Alliance). These discussions
          should focus on resource management, community awareness, and the
          establishment of early warning systems to navigate the challenges
          ahead effectively.
        </p>
      </div>
    ),

    "q3-2025": (
      <div>
        <p>
          The Southern and Southeastern lowlands of Ethiopia typically
          experienced dry climatic condition from July to September. Borana,
          part of these lowlands, usually experiences cold-dry conditions during
          July and August while SON rain usually starts in September. Climate
          drivers influencing the region are El Niño–Southern Oscillation (ENSO)
          and Indian Ocean Dipole (IOD) (WMO). Current forecasts indicate that
          ENSO is likely to remain in a neutral phase with a 70% probability
          during July, August and September. Similarly, the IOD is expected to
          remain neutral at least until August, following a warming of sea
          surface temperatures south of Java and cooling near the Horn of Africa
          (BoM).
        </p>
        <p>
          During July-September, climate model guidance favors a drier period in
          most of lowlands except for the “kiremt” rainfall receiving areas in
          Northern Somali region. During these months (July to September),
          significant heat stress is anticipated across much of the pastoral
          regions of the country. However, Borana Zone will be an exception, as
          it enters its cold and dry season during this period. Therefore, this
          climate outlook information and forecast driven pastoral and
          agro-pastoral climate seasonal and sub-seasonal advisory could support
          pastoral and agro-pastoral communities and relevant stakeholders in
          making informed decisions to protect livestock, reduce crop loss and
          manage rangeland resources more effectively under expected climatic
          stress.
        </p>
        <p>
          This advisory is part of the CGIAR Scaling for Impact Science Program,
          which works to deliver actionable, climate-informed solutions that
          help communities build resilience and scale sustainable practices
          across regions facing climatic challenges.
        </p>
      </div>
    ),
  };

  const sortedSeasonEntries = useMemo(() => {
    return Object.entries(FILE_MAP).sort(
      (a, b) => a[1].start.getTime() - b[1].start.getTime()
    );
  }, [FILE_MAP]);

  const selectedSeasonLabel = FILE_MAP[season]?.label || "";
  const descriptionWithSeason = t("advisories.description-3", {
    season: selectedSeasonLabel,
  });

  useEffect(() => {
    if (type === "seasonal") {
      const options = sortedSeasonEntries.map(([value, { label }]) => ({
        value,
        label,
      }));
      setSeasonOptions(options);
      if (options.length) setSeason(options[options.length - 1].value);
    } else if (type === "subseasonal") {
      const now = new Date();
      const months = [];
      for (let offset = -5; offset <= 6; offset++) {
        const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        months.push({
          label: d.toLocaleString("en-US", { month: "long", year: "numeric" }),
          value: `m${d.getMonth() + 1}-${d.getFullYear()}`,
        });
      }
      setSeasonOptions(months);
      setSeason(`m${now.getMonth() + 1}-${now.getFullYear()}`); 
    }
  }, [type, sortedSeasonEntries]);

  const getDownloadInfo = () => {
    if (type !== "seasonal" || !FILE_MAP[season]) {
      return { name: "", route: "", disabled: true };
    }
    const { name, route } = FILE_MAP[season];
    return { name, route, disabled: false };
  };

  const { name, route, disabled } = getDownloadInfo();

  return (
    <div className="container pt-4">
      <h1 className="mb-4 mt-5">{t("advisories.title")}</h1>

      <div className="row">
        {/* Selectores */}
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">{t("rain.type")}</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label={t("rain.type")}
            >
              <option value="seasonal">{t("rain.seasonal")}</option>
              <option value="subseasonal">{t("rain.subseasonal")}</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">{t("rain.escenario")}</label>
            <select
              className="form-select"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              aria-label={t("rain.escenario")}
            >
              {seasonOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-8 mb-5">
          <h5 className="fw-bold mb-2">
            Pastoral {type} Advisory {selectedSeasonLabel}
          </h5>

          {SPECIAL_DESCRIPTIONS[season] ? (
            SPECIAL_DESCRIPTIONS[season]
          ) : (
            <p>
              {descriptionWithSeason.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          )}

          <div className="mt-4 d-flex gap-3">
            <BtnDownload
              variant="success"
              route={route}
              nameFile={name}
              disabled={disabled}
            />
            <ShareButton
              labelKey="profile.share"
              tooltip="profile.share"
              position="top"
              noTooltip={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Advisories;
