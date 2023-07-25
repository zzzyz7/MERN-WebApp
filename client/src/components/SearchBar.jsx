import React from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

export default function SearchBar(props) {
    return (
        <>
            <TextField style={{ marginRight: "10px" }} />
            <Button variant="contained">Search</Button>
        </>
    );
}
