import React, { useEffect, useState, useRef } from 'react';
import { useBoundingBoxes } from '../utils/BoundingBoxesContext';

const FRAMES_API = 'http://invisai-frontend-interview-data.s3-website-us-west-2.amazonaws.com/frames'

const FrameViewer = ({ currentFrameIndex }) => {
    const [loadedFrames, setLoadedFrames] = useState({});
    const [imageUrl, setImageUrl] = useState(null);
    const [drawing, setDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
    const [boundingBoxes, setBoundingBoxes] = useState([]); // for current frame

    const imageRef = useRef(null);
    const { boundingBoxesCache, updateBoundingBoxesCache } = useBoundingBoxes();

    useEffect(() => {
        // Load saved bounding boxes from context for the current frame when the component mounts 
        const savedBoxes = boundingBoxesCache[currentFrameIndex] || [];
        setBoundingBoxes(savedBoxes);
    }, [currentFrameIndex, boundingBoxesCache]);

    useEffect(() => {
        if (loadedFrames[currentFrameIndex]) {
            // If the frame is already loaded, use the cached URL
            setImageUrl(loadedFrames[currentFrameIndex]);
        } else {
            // Fetch frame data when the current frame index changes
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

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const imageRect = imageRef.current.getBoundingClientRect();

        setDrawing(true);
        setStartPoint({
            x: e.clientX - imageRect.left,
            y: e.clientY - imageRect.top
        });
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // if we're not dragging, just return
        if (!drawing) {
            return;
        }

        const imageRect = imageRef.current.getBoundingClientRect();
        setEndPoint({
            x: e.clientX - imageRect.left,
            y: e.clientY - imageRect.top
        });
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (drawing) {
            // Save the bounding box coordinates in memory
            setDrawing(false);

            // Create a new bounding box object
            const newBox = {
                x: Math.min(startPoint.x, endPoint.x),
                y: Math.min(startPoint.y, endPoint.y),
                width: Math.abs(endPoint.x - startPoint.x),
                height: Math.abs(endPoint.y - startPoint.y),
            };

            // Save the bounding box coordinates in memory
            let updatedBoxes = [...boundingBoxes, newBox];

            // Update the bounding boxes state
            setBoundingBoxes(updatedBoxes);

            // Update the overall bounding boxes state
            updateBoundingBoxesCache(currentFrameIndex, updatedBoxes);
        }
    };

    const handleMouseOut = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // the drag is over, clear the drawing flag
        setDrawing(false);
    }

    return (
        <div className='image-div'
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                cursor: drawing ? 'crosshair' : 'auto'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseOut}>
            <img
                ref={imageRef}
                src={imageUrl}
                alt={`Frame ${currentFrameIndex}`}
                style={{ userSelect: 'none' }}
            />

            {drawing && (
                <div
                    style={{
                        position: 'absolute',
                        border: '2px dashed red',
                        backgroundColor: 'rgba(255, 0, 0, 0.3)', // Transparent red
                        pointerEvents: 'none',
                        left: `${startPoint.x}px`,
                        top: `${startPoint.y}px`,
                        width: `${endPoint.x - startPoint.x}px`,
                        height: `${endPoint.y - startPoint.y}px`,
                    }}
                />
            )}

            {/* Display dynamically drawn bounding boxes */}
            {
                boundingBoxes.map((box, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            border: '2px solid red',
                            boxSizing: 'border-box',
                            pointerEvents: 'none',
                            left: `${box.x}px`,
                            top: `${box.y}px`,
                            width: `${box.width}px`,
                            height: `${box.height}px`,
                        }}
                    >
                        {/* Display label on the box */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                fontSize: '14px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent white
                            }}
                        >
                            {`Box ${index + 1}`}
                        </div>
                    </div>
                )
                )
            }
        </div >
    );
};

export default FrameViewer;
