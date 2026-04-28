import React from 'react';
import Gallery from '../components/Gallery';

const GalleryPage = ({ photos }) => {
    return (
        <div className="pt-32">
            <Gallery photos={photos} />
        </div>
    );
};

export default GalleryPage;
