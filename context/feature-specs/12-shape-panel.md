Add a bottom shape panel so users can drag shapes onto the canvas and create new nodes. 

## Implementation

1. Add a floating pill-shaped toolbar at the bottom-center on the canvas.
2. Add draggable icon buttons for theses shapes:
  - rectangle
  - diamond
  - circle
  - pill
  - cylinder
  - hexagon

3. when dragging a shape, include the shape name and default size in the drag payload.

Use sensible default sizes:
- rectangles should be wiser than tall
- circles should be square
- diamonds should be slightly larger so labels have room


4. Add `dragover` and `drop` handling to the canvas wrapper
5. On drop:
 - read the dragged shape payload
 - convert a new node at that position
 - use an empty label
 - use the default node color
 - use the dragged shape value

6. Generate each node ID using the shape name, timestamp and a counter
7. Add a basic renderer for the custom canvas node types so new nodes are visible. 

For the unit, render every shape as a simple bordered rectangle with the label centered. Shape-specific visuals will be added later/


## check when done
- shape drag payload includes the correct shape and size data
- drop logic creates a new canvas node with the expected shape data. 
- new nodes uses the custom canvas node type
- `yarn build` passes.
