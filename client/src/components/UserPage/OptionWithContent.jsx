import React, { useState } from "react";
import EditProfileContent from "./EditProfileContent.jsx";
import ChangePasswordContent from "./ChangePasswordContent.jsx";
import ManageListingsContent from "./ManageListingsContent.jsx";
import ViewCommentsContent from "./ViewCommentsContent.jsx";
import "./OptionWithContent.css";
import Button from "@mui/material/Button";

const Sidebar = ({ handleOptionSelect }) => {
    return (
        <div className="sidebar">
            <Button
                onClick={() => handleOptionSelect("editProfile")}
                className="option"
            >
                Edit Profile
            </Button>
            <Button
                onClick={() => handleOptionSelect("changePassword")}
                className="option"
            >
                Change Password
            </Button>
            <Button
                onClick={() => handleOptionSelect("manageListings")}
                className="option"
            >
                Manage Listings
            </Button>
            <Button
                onClick={() => handleOptionSelect("viewComments")}
                className="option"
            >
                View Comments
            </Button>
        </div>
    );
};

const Content = ({ selectedOption }) => {
    if (selectedOption === "editProfile") {
        return <EditProfileContent />;
    } else if (selectedOption === "changePassword") {
        return <ChangePasswordContent />;
    } else if (selectedOption === "manageListings") {
        return <ManageListingsContent />;
    } else if (selectedOption === "viewComments") {
        return <ViewCommentsContent />;
    }

    return null; // Handle the case when no option is selected
};

const App = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="app">
            <Sidebar handleOptionSelect={handleOptionSelect} />
            <Content selectedOption={selectedOption} />
        </div>
    );
};

export default App;
