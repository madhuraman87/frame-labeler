import React, { useEffect, useRef, useState } from 'react';
import { useBoundingBoxes } from '../utils/BoundingBoxesContext';


const BoundingBoxCanvas = ({ currentFrameIndex, frameHeight, frameWidth, imageUrl }) => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
    const [boundingBoxes, setBoundingBoxes] = useState([]); // for current frame

    const { boundingBoxesCache, updateBoundingBoxesCache } = useBoundingBoxes();

    useEffect(() => {
        // Load saved bounding boxes from context for the current frame when the component mounts 
        const savedBoxes = boundingBoxesCache[currentFrameIndex] || [];
        setBoundingBoxes(savedBoxes);
    }, [currentFrameIndex, boundingBoxesCache]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw existing bounding boxes
        boundingBoxes?.forEach((box, index) => {
            drawBoundingBox(ctx, box, index);
        });

        // Draw the dynamic selection box
        if (drawing) {
            drawBoundingBox(ctx, {
                x: Math.min(startPoint.x, endPoint.x),
                y: Math.min(startPoint.y, endPoint.y),
                width: Math.abs(endPoint.x - startPoint.x),
                height: Math.abs(endPoint.y - startPoint.y),
                isDrawing: true, // Indicator to include transparent overlay
            }, boundingBoxes.length); // Use the next index for the dynamic box
        }
    }, [imageUrl, drawing, startPoint, endPoint, boundingBoxes]);

    const drawBoundingBox = (ctx, box, index) => {
        ctx.beginPath();
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the transparent overlay if isDrawing is true
        if (box.isDrawing) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Transparent red
            ctx.fillRect(box.x, box.y, box.width, box.height);
        }

        // Display the label
        drawTextBG(ctx, index, box.x, box.y);
    };

    const drawTextBG = (ctx, index, x, y) => {
        const txt = `Box ${index + 1}`;
        ctx.save();
        ctx.font = '20px Roboto';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // color for background
        var width = ctx.measureText(txt).width;
        ctx.fillRect(x, y, width, parseInt(20, 10));
        ctx.fillStyle = `rgb(0, 0, 0)`; // text color
        ctx.fillText(txt, x, y);
        ctx.restore();
    }

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        setDrawing(true);
        setStartPoint({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // if we're not dragging, just return
        if (!drawing) {
            return;
        }

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Update the end point dynamically while drawing
        setEndPoint({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (drawing) {
            setDrawing(false);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

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

            // Draw the dynamic selection box
            drawBoundingBox(ctx, newBox, updatedBoxes.length);
        }
    };

    const handleMouseOut = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // the drag is over, clear the drawing flag
        setDrawing(false);
    }

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseOut}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: drawing ? 'crosshair' : 'auto',
            }}
            width={frameWidth}
            height={frameHeight}
        />
    );
};

export default BoundingBoxCanvas;
