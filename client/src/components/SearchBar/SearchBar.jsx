import React from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import "./SearchBarCss.css";

export default function SearchBar(props) {
    {
        /* get user input in search bar text field */
    }

    const handleSearch = (e) => {
        const keyword = e.target.value;
    };

    return (
        <>
            <div className="Search">
                <input
                    onChange={handleSearch}
                    type="text"
                    placeholder="Search a phone brand..."
                    margin="top"
                />
                <Button variant="contained">Search</Button>
                <Button
                    onClick={() => {
                        window.location.replace("/login");
                    }}
                    variant="outlined"
                >
                    Checkout
                </Button>
            </div>
        </>
    );
}
