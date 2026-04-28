import React from 'react';
import MapView from '../components/MapView';

const MapPage = ({ places, activeCat, selectedPlace, setSelectedPlace }) => {
    return (
        <div className="pt-32">
            <MapView 
                places={places} 
                activeCat={activeCat} 
                selectedPlace={selectedPlace}
                setSelectedPlace={setSelectedPlace}
            />
        </div>
    );
};

export default MapPage;
