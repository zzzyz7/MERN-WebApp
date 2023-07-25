import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const PhonesList = ({ searchTerm, brandFilter, priceFilter, onPhoneClick, phones, setPhones}) => {
    const navigate = useNavigate();

    const fetchPhones = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/phones');
            const data = await response.json();

            const filteredData = data.filter(phone => {
                const matchesSearchTerm = phone.title.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesBrandFilter = !brandFilter || phone.brand === brandFilter;
                const matchesPriceFilter = phone.price >= priceFilter[0] && phone.price <= priceFilter[1];

                return matchesSearchTerm && matchesBrandFilter && matchesPriceFilter;
            });
            setPhones(filteredData);
        } catch (error) {
            console.error("Error fetching phones:", error);
        }
    };

    useEffect(() => {
        fetchPhones();
    }, [searchTerm, brandFilter, priceFilter]);

    return (
        <div>
            {phones.map((phone) => (
                <Card key={phone._id} sx={{ minWidth: 275, margin: '10px' }} onClick={() => onPhoneClick(phone)}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {phone.title}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default PhonesList;