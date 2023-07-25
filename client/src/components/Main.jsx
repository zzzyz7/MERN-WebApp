import React, { useState, useEffect, useContext} from "react";
import Header from "./Header";
import BestSellers from './BestSellers';
import SoldOutSoon from './SoldOutS';
import PhonesList from "./Phones/PhonesList";
import PhoneDetail from './Phones/PhoneDetail';
import { PageStateContext } from './PageStateContext';

const Main = () => {
    const { state, setPageState } = useContext(PageStateContext);
    const pageState = state['/'] || {};
    const [searchTerm, setSearchTerm] = useState(pageState.searchTerm || "");
    const [brandFilter, setBrandFilter] = useState(pageState.brandFilter || "");
    const [priceFilter, setPriceFilter] = useState(pageState.priceFilter || [0, 1000]);
    const [selectedPhone, setSelectedPhone] = useState(pageState.selectedPhone || null);
    const [phones, setPhones] = useState(pageState.phones || []); 

    useEffect(() => {
        setPageState('/', { searchTerm, brandFilter, priceFilter, selectedPhone, phones });
    }, [searchTerm, brandFilter, priceFilter, selectedPhone, phones]);

    const handleSearchTermChange = (term) => {
        setSearchTerm(term);
    };

    const handleBrandFilterChange = (brand) => {
        setBrandFilter(brand);
    };

    const handlePriceFilterChange = (price) => {
        setPriceFilter(price);
    };

    const handlePhoneClick = (phone) => {
        setSelectedPhone(phone);
      };

     return (
        <>
            <Header 
                title="Old Phone Deals"
                onSearchTermChange={handleSearchTermChange}
                onBrandFilterChange={handleBrandFilterChange}
                onPriceFilterChange={handlePriceFilterChange}
                selectedPhone={selectedPhone}
                setSelectedPhone={setSelectedPhone}
            />
            {selectedPhone ? (
                <PhoneDetail phone={selectedPhone} />
            ) : (
                <>
                    {searchTerm ? (
                        <PhonesList
                            searchTerm={searchTerm}
                            brandFilter={brandFilter}
                            priceFilter={priceFilter}
                            onPhoneClick={handlePhoneClick}
                            phones={phones}
                            setPhones={setPhones}
                        />
                    ) : (
                        <>
                            <SoldOutSoon onPhoneClick={handlePhoneClick}/>
                            <BestSellers onPhoneClick={handlePhoneClick}/>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Main;
