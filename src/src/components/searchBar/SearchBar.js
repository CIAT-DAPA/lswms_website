import React from "react";
import "./SearchBar.css";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import {
  IconSearch,
  IconMapPin,
  IconCurrentLocation,
  IconCircle,
  IconDotsVertical,
} from "@tabler/icons-react";

function SearchBar({ latitude, longitude }) {
  return (
    <div className="searchBar bg-white px-2 py-3 ">
      <InputGroup className="mb-4 align-items-center ">
        <IconCircle
          size={20}
          className="me-1"
          style={{ marginLeft: "0.8px" }}
        />
        <IconDotsVertical style={{ position: "absolute", bottom: "-20px" }} />
        <FormControl
          placeholder="Search for a waterpoint"
          aria-label="Search for a waterpoint"
          aria-describedby="basic-addon2"
          size="sm"
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
      <InputGroup className="align-items-center ">
        <IconMapPin className="me-1" />
        <p className="mb-0">{`lat:${latitude}, lon:${longitude}`}</p>
      </InputGroup>
    </div>
  );
}

export default SearchBar;
