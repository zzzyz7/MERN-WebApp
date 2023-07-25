import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./SignInCss.css";

export default function SignIn() {
    const navigate = useNavigate();
    return (
        <>
            <div className="SignIn">
                <Button
                    variant="outlined" size="small"
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    SignIn
                </Button>
            </div>
        </>
    );
}
