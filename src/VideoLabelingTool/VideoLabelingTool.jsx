import React, { useState, useEffect } from 'react';
import FrameViewer from '../FrameViewer/FrameViewer.jsx';
import FrameViewerCanvas from '../FrameViewer/FrameViewerCanvas.jsx'
import useFetchAPI from "../utils/useFetchAPI.js";
import BoundingBoxList from "../BoundingBoxList/BoundingBoxList.jsx";
import { useBoundingBoxes } from '../utils/BoundingBoxesContext.jsx';
import "./VideoLabelingTool.css";

const VIDEO_API = 'http://invisai-frontend-interview-data.s3-website-us-west-2.amazonaws.com/video.json';

const VideoLabelingTool = () => {
    // Use the custom useFetch hook for fetching video metadata
    const { data: videoMetaData, loading: metaDataLoading } = useFetchAPI(VIDEO_API);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

    const [boundingBoxes, setBoundingBoxes] = useState([]); // for current frame 
    const { boundingBoxesCache, updateBoundingBoxesCache } = useBoundingBoxes(); // context for all the frames

    useEffect(() => {
        // Load saved bounding boxes from context for the current frame when the component mounts 
        const savedBoxes = boundingBoxesCache[currentFrameIndex] || [];
        setBoundingBoxes(savedBoxes);
    }, [currentFrameIndex, boundingBoxesCache]);

    const handleNextFrame = () => {
        setCurrentFrameIndex(prevIndex => Math.min(prevIndex + 1, videoMetaData.frame_count - 1));
    };

    const handlePreviousFrame = () => {
        setCurrentFrameIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const handleDeleteBox = (index) => {
        // Delete a bounding box for the current frame
        const updatedBoxes = [...boundingBoxes];
        updatedBoxes.splice(index, 1);
        setBoundingBoxes(updatedBoxes);

        updateBoundingBoxesCache(currentFrameIndex, updatedBoxes);
    };

    return (
        <div className="video-labeling-div">
            {!metaDataLoading && videoMetaData && (
                <div>
                    <h1>{videoMetaData.video_name}</h1>
                    <div className='buttons-div'>
                        <button className="button" onClick={handlePreviousFrame} disabled={currentFrameIndex === 0}>Previous Frame</button>
                        <button className="button" onClick={handleNextFrame} disabled={currentFrameIndex === videoMetaData.frame_count - 1}>Next Frame</button>
                    </div>
                    <div className='frame-viewer-div'>
                        <FrameViewer
                            currentFrameIndex={currentFrameIndex}
                        />
                        {/* <FrameViewerCanvas
                            currentFrameIndex={currentFrameIndex}
                        /> */}
                    </div>
                    {
                        boundingBoxes?.length > 0 && <div className='bounding-box-list-div'>
                            <BoundingBoxList
                                boundingBoxes={boundingBoxes}
                                handleDeleteBox={handleDeleteBox}
                            />
                        </div>
                    }
                </div>
            )}
        </div>
    );
};

export default VideoLabelingTool;
