import React, { useState } from "react";
import "./SearchBar.css";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import {
  IconSearch,
  IconMapPin,
  IconCurrentLocation,
  IconCircle,
  IconDotsVertical,
} from "@tabler/icons-react";
import Services from "../../services/apiService";

function SearchBar({ wp }) {
  const [hits, setHits] = useState();

  return (
    <div className="searchBar bg-white px-2 py-3 rounded-4">
      <div>
        <InputGroup className="mb-4 align-items-center ">
          <IconCircle
            size={20}
            className="me-1"
            style={{ marginLeft: "0.8px" }}
          />
          <IconDotsVertical style={{ position: "absolute", bottom: "-20px" }} />
          <FormControl
            placeholder="Search for a location"
            aria-label="Search for a location"
            aria-describedby="basic-addon2"
            size="sm"
            onChange={(event) => {
              Services.get_geocoding(event.target.value)
                .then((response) => {
                  setHits(response.hits);
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          />
          <Button
            variant="outline-primary"
            id="button-addon1"
            className="button-search"
            size="sm"
          >
            <IconSearch />
          </Button>
        </InputGroup>
        <InputGroup className="align-items-center border-bottom mb-2 pb-2">
          <IconMapPin className="me-1" />
          <p className="mb-0 small">{`Waterpoint ${wp.name}`}</p>
        </InputGroup>
      </div>
      <div>
        {hits &&
          hits.map((e, i) => {
            return (
              <div className="mb-2 small" key={i}>
                <IconMapPin color="#4d4d4d" />
                {e.name}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default SearchBar;
