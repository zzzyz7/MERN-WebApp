import React from "react";
import Dashboard from "./UserPage/Dashboard";
import { Button } from "@mui/material";

const User = () => {

    return (
        <div>
            <Dashboard />
            {/* <Button variant="contained" onClick={handleBack} style={{ position: "fixed", top: "170px", left: "70px" }}>
                Back to home
            </Button> */}
        </div>
    );
};

export default User;
