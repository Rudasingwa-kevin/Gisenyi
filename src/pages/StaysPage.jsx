import React from 'react';
import Places from '../components/Places';

const StaysPage = ({ places, loading, activeCat, setActiveCat, search, setSearch, setSelectedPlace }) => {
    return (
        <div className="pt-32">
            <Places 
                places={places}
                loading={loading}
                activeCat={activeCat}
                setActiveCat={setActiveCat}
                search={search}
                setSearch={setSearch}
                setSelectedPlace={setSelectedPlace}
            />
        </div>
    );
};

export default StaysPage;
