import React from 'react';
import MapView from '../components/MapView';

const MapPage = ({ places, activeCat, setActiveCat, selectedPlace, setSelectedPlace }) => {
    return (
        <div className="pt-32">
            <MapView 
                places={places} 
                activeCat={activeCat} 
                setActiveCat={setActiveCat}
                selectedPlace={selectedPlace}
                setSelectedPlace={setSelectedPlace}
            />
        </div>
    );
};

export default MapPage;
