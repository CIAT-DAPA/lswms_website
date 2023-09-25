import React from "react";
import "./SearchBar.css";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { IconSearch } from "@tabler/icons-react";

function SearchBar() {
  return (
    <div className="searchBar bg-white px-2 py-3">
      <InputGroup className="mb-3">
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
      <InputGroup className="">
        <FormControl
          placeholder="Search for a waterpoint"
          aria-label="Search for a waterpoint"
          aria-describedby="basic-addon2"
          size="sm"
        />
        <Button
          variant="outline-primary"
          id="button-addon2"
          className="button-search"
          size="sm"
        >
          <IconSearch />
        </Button>
      </InputGroup>
    </div>
  );
}

export default SearchBar;
