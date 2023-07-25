import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import PasswordIcon from "@mui/icons-material/Password";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import CommentIcon from "@mui/icons-material/Comment";

const mainListItems = (
    <React.Fragment>
        <ListItemButton>
            <ListItemIcon>
                <SettingsApplicationsIcon />
            </ListItemIcon>
            <ListItemText primary="Edit profile" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <PasswordIcon />
            </ListItemIcon>
            <ListItemText primary="Change password" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <ChecklistRtlIcon />
            </ListItemIcon>
            <ListItemText primary="Manage listings" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <CommentIcon />
            </ListItemIcon>
            <ListItemText primary="View comments" />
        </ListItemButton>
    </React.Fragment>
);
export default mainListItems;
