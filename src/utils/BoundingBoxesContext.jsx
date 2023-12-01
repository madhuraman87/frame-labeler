import { createContext, useContext, useState, useEffect } from 'react';

const BoundingBoxesContext = createContext();

export const useBoundingBoxes = () => {
    return useContext(BoundingBoxesContext);
};

export const BoundingBoxesProvider = ({ children }) => {
    const [boundingBoxesCache, setBoundingBoxesCache] = useState({});
    const localStorageKey = 'bounding-boxes-cache';

    useEffect(() => {
        // Load bounding boxes from local storage when the component mounts
        const cachedData = localStorage.getItem(localStorageKey) || {};

        if (Object.keys(cachedData).length > 0) {
            const parsedData = JSON.parse(cachedData);
            setBoundingBoxesCache(parsedData);
        }
    }, []);

    useEffect(() => {
        // Save bounding boxes to local storage when the context is updated
        if (Object.keys(boundingBoxesCache).length > 0) {
            localStorage.setItem(localStorageKey, JSON.stringify(boundingBoxesCache));
        }
    }, [boundingBoxesCache]);

    const updateBoundingBoxesCache = (frameIndex, boxes) => {
        setBoundingBoxesCache((prevBoundingBoxes) => ({
            ...prevBoundingBoxes,
            [frameIndex]: boxes,
        }));
    };

    return (
        <BoundingBoxesContext.Provider value={{ boundingBoxesCache, updateBoundingBoxesCache }}>
            {children}
        </BoundingBoxesContext.Provider>
    );
};

export default BoundingBoxesContext;
