import React, { useEffect, useRef, useState } from 'react';
import BoundingBoxCanvas from './BoundingBoxCanvas.jsx';

const FRAMES_API = 'http://invisai-frontend-interview-data.s3-website-us-west-2.amazonaws.com/frames'

const FrameViewerCanvas = ({ currentFrameIndex }) => {
    const [loadedFrames, setLoadedFrames] = useState({});
    const [imageUrl, setImageUrl] = useState(null);
    const [imageWidth, setImageWidth] = useState(null);
    const [imageHeight, setImageHeight] = useState(null);

    const imageRef = useRef(null);

    useEffect(() => {
        if (loadedFrames[currentFrameIndex]) {
            // If the frame is already loaded, use the cached URL
            setImageUrl(loadedFrames[currentFrameIndex]);
        } else {
            // Fetch frame data when the current frame index changes
            const fetchData = async () => {
                try {
                    const response = await fetch(`${FRAMES_API}/${String(currentFrameIndex).padStart(5, '0')}.jpg`);

                    if (!response.ok) {
                        throw new Error('Failed to load frame image');
                    }
                    const responseBlob = await response.blob();
                } catch (error) {

                }

            };
            fetchData();
            fetch(`${FRAMES_API}/${String(currentFrameIndex).padStart(5, '0')}.jpg`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load frame image');
                    }
                    return response.blob();
                })
                .then(imageBlob => {
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setImageUrl(imageUrl);
                    // Cache the loaded frame URL to avoid refetching
                    setLoadedFrames(prevFrames => ({
                        ...prevFrames,
                        [currentFrameIndex]: imageUrl,
                    }));
                })
                .catch(error => console.error('Error fetching frame data:', error));


        }
    }, [currentFrameIndex, loadedFrames, imageUrl]);

    useEffect(() => {
        if (imageRef.current) {
            // Get the dynamically loaded image's width and height
            const imageWidth = imageRef.current.width;
            const imageHeight = imageRef.current.height;

            // Pass the image width and height to the BoundingBoxCanvas
            setImageWidth(imageWidth);
            setImageHeight(imageHeight);
        }
    }, [imageUrl]);

    return (
        <div className='image-div' style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
                ref={imageRef}
                src={imageUrl}
                alt={`Frame ${currentFrameIndex}`}
                style={{ width: '100%', height: '100%' }}
            />

            {/* Render the BoundingBoxCanvas on top */}
            <BoundingBoxCanvas
                currentFrameIndex={currentFrameIndex}
                frameHeight={imageHeight}
                frameWidth={imageWidth}
                imageUrl={imageUrl}
            />
        </div>
    );
};

export default FrameViewerCanvas;
