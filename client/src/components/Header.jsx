import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from "react-router-dom";
import Input from "@mui/material/Input";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import PersonIcon from "@mui/icons-material/Person";
import { useState, useEffect, useContext } from "react";
import Logout from './Logout';
import LogoutIcon from '@mui/icons-material/Logout';
import SignIn from '../components/SignIn/SignIn'
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import HomeIcon from '@mui/icons-material/Home';
import { PageStateContext } from './PageStateContext';

function Header(props) {
    const {title, onSearchTermChange, onBrandFilterChange, onPriceFilterChange, selectedPhone, setSelectedPhone } = props;
    const { state, setPageState } = useContext(PageStateContext);
    const pageState = state['header'] || {};

    const [localSearchTerm, setLocalSearchTerm] = useState(pageState.localSearchTerm || "");
    const [brand, setBrand] = useState(pageState.brand || "");
    const [price, setPrice] = useState(pageState.price || [0, 1000]);
    const [searchState, setSearchState] = useState(pageState.searchState || false);
    const [loggedIn, setLoggedIn] = useState(pageState.loggedIn || false);

    // Update global state when local state changes
    useEffect(() => {
        setPageState('header', { localSearchTerm, brand, price, searchState, loggedIn });
    }, [localSearchTerm, brand, price, searchState, loggedIn]);

    useEffect(() => {
        localStorage.setItem('localSearchTerm', localSearchTerm);
    }, [localSearchTerm]);

    useEffect(() => {
        localStorage.setItem('brand', brand);
    }, [brand]);

    useEffect(() => {
        localStorage.setItem('price', JSON.stringify(price));
    }, [price]);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        document.title = title;
      }, [title]);

    const marks = [
        { value: 0, label: '$0' },
        { value: 250, label: '$250' },
        { value: 500, label: '$500' },
        { value: 750, label: '$750' },
        { value: 1000, label: '$1000' },
    ];

    const handleSearchTermInput = (event) => {
        setLocalSearchTerm(event.target.value);
        if (event.target.value === "") {
            setSearchState(false);
        }
    };

    const handleBrandChange = (event) => {
        setBrand(event.target.value);
        onBrandFilterChange(event.target.value);
    };

    const handlePriceChange = (event, newValue) => {
        setPrice(newValue);
        onPriceFilterChange(newValue);
    };

    const handleSearchButtonClick = () => {
        onSearchTermChange(localSearchTerm);
        if (localSearchTerm !== "") {
            setSearchState(true);
        }
    };

    const handleHomeClick = () => {
        setLocalSearchTerm("");
        setBrand("");
        setPrice([0, 1000]);
        setSearchState(false);
        onSearchTermChange(""); // Reset the search term
        setSelectedPhone("");
    };
    
    return (
        <React.Fragment>
            <Toolbar sx={{ borderBottom: 1, borderColor: "divider",  justifyContent: "center"}}>
            <IconButton onClick={handleHomeClick}>
                <HomeIcon />
            </IconButton>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    sx={{ flex: 1 }}
                >
                {title}
                </Typography>
                    <Input placeholder="Search a phone" onChange={handleSearchTermInput} />
                    <IconButton onClick={handleSearchButtonClick}>
                        <SearchIcon />
                    </IconButton>
                    {searchState && (
                        <>
                            <Select value={brand} onChange={handleBrandChange}>
                                <MenuItem value="">All Brands</MenuItem>
                                <MenuItem value="Apple">Apple</MenuItem>
                                <MenuItem value="BlackBerry">BlackBerry</MenuItem>
                                <MenuItem value="HTC">HTC</MenuItem>
                                <MenuItem value="Huawei">Huawei</MenuItem>
                                <MenuItem value="LG">LG</MenuItem>
                                <MenuItem value="Motorola">Motorola</MenuItem>
                                <MenuItem value="Nokia">Nokia</MenuItem>
                                <MenuItem value="Samsung">Samsung</MenuItem>
                                <MenuItem value="Sony">Sony</MenuItem>
                            </Select>
                            <Slider
                                style={{ width: 200, margin: '20px', color:'gray' }} 
                                value={price}
                                onChange={handlePriceChange}
                                min={0}
                                max={1000}
                                marks={marks} // Adds labels to the slider
                                valueLabelDisplay="auto" 
                            />
                        </>
                    )}
                    <Box display="flex">
                        {loggedIn ? (
                            <>
                            <IconButton onClick={Logout} size="large">
                                <LogoutIcon />
                            </IconButton>
                            <IconButton component={RouterLink} to="/user">
                                <PersonIcon />
                            </IconButton>
                            <IconButton component={RouterLink} to="/checkout">
                                <ShoppingCartCheckoutIcon />
                            </IconButton>
                            </>
                        ) : (
                            <>
                            <IconButton component={RouterLink} to="/login">
                                <SignIn />
                            </IconButton>
                            <IconButton component={RouterLink} to="/login">
                                <ShoppingCartCheckoutIcon />
                            </IconButton>
                            </>
                        )}
                    </Box>
                </Toolbar>
        </React.Fragment>
    );
}

export default Header;

