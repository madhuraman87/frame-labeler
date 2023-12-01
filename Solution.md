# Frame Labeler

The Video Frame Labeler component is a tool designed for labeling objects in video frames by drawing bounding boxes. The component incorporates various features, including frame navigation, box drawing, and box deletion. It employs the HTML5 Canvas API for rendering and allows users to interactively label objects in each frame of a video.
Here's a brief description of the component hierarchy and how they manage their state:

## Component Hierarchy:

1. BoundingBoxesContext Provider:
- Manages the state of bounding boxes across frames using the React context API.
- Centralized storage for all bounding boxes.
- Handles updates and persists data in local storage.

2. VideoLabelingTool Component:
- Manages the overall state of the video labeling tool.
- Handles the state for the current frame index, frame image URL, all bounding boxes.
- Uses the useFetch hook to fetch video metadata and frame data.
- Passes down state and callback functions to child components.

3. FrameViewer Component:
- Implemented two versions of `FrameViewer` component - as such underlying state management and component responsibility is the same - only difference is in the way the bounding boxes are rendered.
    - `FrameViewer` : This component leverages HTML and CSS to create a container for the image and handle the box drawing logic using DOM elements
    - `FrameViewerCanvas` : This component leverages HTML and CSS to create a container for the image and HTML Canvas API is used to handle the bounding box drawing logic by rendering the `BoundingBoxCanvas` component alongside the video frame..
- Responsible for displaying the video frame and handling frame-related logic.
- Uses the `useEffect` hook to determine whether to fetch a new frame or use a cached image URL.
- Caches loaded frame URLs to avoid unnecessary refetching.
- Displays the frame image based on the provided URL.
- Uses the `useBoundingBoxes` hook to access the bounding boxes context.

4. BoundingBoxCanvas Component:
- Utilizes the HTML5 Canvas API for drawing bounding boxes.
- Receives frame-related information (index, dimensions) and bounding box data from props.
- Interacts with the BoundingBoxesContext to update and retrieve bounding box data across frames.
- Handles mouse events for drawing and updating bounding boxes.

5. BoundingBoxList Component:
- Displays a list of bounding boxes for the current frame.
- Receives an array of bounding boxes and a callback function to delete a specific box.
- Renders each bounding box with its coordinates and provides a delete button.

6. API Fetching Component - `useFetchAPI` Hook:
- A custom hook for handling API requests to fetch video metadata and frame images.
- Manages the state for fetched data, loading status, and error.
- Retrieves video information, such as frame count, from the provided API endpoints.

## Data Flow:

1. Initialization:
- The `BoundingBoxesContext.Provider` is initialized in the root of the application, wrapping the main `App` component. - This provides a centralized context for managing bounding boxes across frames.

2. API Fetching Component - `useFetchAPI` Hook:
- The ApiFetchingComponent is responsible for making API requests to fetch video metadata and frame images.
- It retrieves information such as video name and frame count from the `video.json` API endpoint.

3. FrameViewer Component:
- The `FrameViewer` component receives video metadata from the ApiFetchingComponent through props.
- It also uses the `useBoundingBoxes` hook to access the `BoundingBoxesContext` for managing bounding box data across frames.

4. BoundingBoxesContext Provider:
- The `BoundingBoxesContext.Provider` manages the state of bounding boxes across frames using the React context API.
- It initializes with an empty object representing bounding boxes for each frame.

5. BoundingBoxCanvas Component:
- The `BoundingBoxCanvas` component receives information about the current frame, frame dimensions, and bounding box data from the `FrameViewer` component.
- It uses the `useBoundingBoxes` hook to access the `BoundingBoxesContext` for centralized state management.
- The component handles mouse events for drawing, updating, and deleting bounding boxes.

6. State Management:
- The state of bounding boxes is managed centrally in the `BoundingBoxesContext` state.
- The `updateBoundingBoxes` function in the context allows components to update the bounding box data across frames.
- The `BoundingBoxCanvas` component manages the local state of drawing process, capturing the start and end points of bounding boxes.
- The `FrameViewer` component manages the state related to loading and displaying frame images, such as the loaded frame URLs and the frame image URL to be displayed.
- The `BoundingBoxList` component does not manage state directly but receives bounding box data and a callback function to delete boxes from its parent (VideoLabelingTool).

7. Local Storage Interaction:
- The `BoundingBoxesContext` provider includes useEffect hooks to load and persist bounding box data in local storage.
- When the component mounts, it loads previously saved bounding boxes from local storage. When the context is updated, it saves the updated data to local storage.

8. Rendering and Display:
- The `FrameViewer` component renders the current frame and the bounding boxes by leveraging HTML and CSS and manipulating DOM elements.
- The `FrameViewerCanvas` component renders the current frame and the `BoundingBoxCanvas` component.
- The `BoundingBoxCanvas` component renders the HTML5 canvas and handles the drawing of bounding boxes.

9. Interaction and User Actions:
- Users interact with the `BoundingBoxCanvas` component by clicking, dragging, and releasing the mouse to draw bounding boxes.
- The component updates its local state based on user actions and sends updates to the `BoundingBoxesContext` to maintain centralized state.
- The `BoundingBoxList` displays the list of bounding boxes and provides a callback to delete specific boxes, updating the state in the VideoLabelingTool.

This data flow creates a cohesive and modular system for labeling video frames with bounding boxes, ensuring efficient state management and user interaction.

