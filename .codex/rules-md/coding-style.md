# Coding Principles

> Extracted from RIGVid codebase patterns - A guide to writing clean, maintainable Python code

## Function Design Principles

### 1. Single Responsibility
Each function should do one thing and do it well.

```python
# ✅ Good: Single, clear purpose
def find_center_of_mask(mask_path: str, window_size: int = 20) -> np.ndarray:
    """Returns pixel coordinates within a window centered on mask centroid."""
    mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
    ys, xs = np.where(mask > 0)
    center_r, center_c = int(np.median(ys)), int(np.median(xs))

    half = window_size // 2
    coords = []
    for dr in range(-half, half + 1):
        for dc in range(-half, half + 1):
            r, c = center_r + dr, center_c + dc
            if 0 <= r < mask.shape[0] and 0 <= c < mask.shape[1]:
                coords.append([r, c])
    return np.array(coords)

# ❌ Bad: Multiple responsibilities
def process_everything(mask_path, depth_path, output_path):
    # Loading, processing, analyzing, saving all in one function
    ...
```

### 2. Clear Type Annotations
Use modern Python type hints for all parameters and return values.

```python
# ✅ Good: Explicit types with modern syntax
def find_scale_and_shift(
    depth_pred: np.ndarray,
    depth_gt: np.ndarray,
    pixel_coords: np.ndarray,
    mask_invalid: bool = False,
) -> tuple[float, float]:
    """Estimate alpha, beta for depth alignment."""
    ...
    return alpha, beta

# ❌ Bad: No type hints
def find_scale_and_shift(depth_pred, depth_gt, pixel_coords, mask_invalid=False):
    ...
```

### 3. Short and Focused
Keep functions under 50 lines. If longer, consider breaking into smaller functions.

```python
# ✅ Good: Concise, readable
def rescale_video(
    input_path: str,
    output_path: str,
    width: int = 1280,
    height: int = 720,
) -> None:
    """Rescales a video to target dimensions."""
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise RuntimeError(f"Unable to open: {input_path}")

    writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        resized = cv2.resize(frame, (width, height))
        writer.write(resized)

    cap.release()
    writer.release()
```

### 4. Flat Structure
Avoid deep nesting. Use early returns and guard clauses.

```python
# ✅ Good: Flat structure, early return
def load_intrinsics(file_path: str) -> dict:
    """Load camera intrinsics from file."""
    data = np.loadtxt(file_path)

    if data.shape == (3, 3):
        return {
            "fx": data[0, 0],
            "fy": data[1, 1],
            "cx": data[0, 2],
            "cy": data[1, 2],
        }

    if data.size == 4:
        fx, fy, cx, cy = data
        return {"fx": fx, "fy": fy, "cx": cx, "cy": cy}

    raise ValueError("Unsupported intrinsics format")

# ❌ Bad: Nested structure
def load_intrinsics(file_path: str) -> dict:
    data = np.loadtxt(file_path)
    if data.shape == (3, 3):
        fx = data[0, 0]
        # ... more nesting
    else:
        if data.size == 4:
            # ... even more nesting
        else:
            raise ValueError("...")
```


---

## Class Design Principles

### 1. Constructor Initialization
Pass all dependencies and configuration through `__init__`. Store as instance variables.

```python
# ✅ Good: Clear initialization
class DepthPredictor:
    def __init__(
        self,
        checkpoint: str = "prs-eth/rollingdepth-v1-0",
        device: str | None = None,
        dtype: str = "fp16",
        color_maps: list[str] | None = None,
    ):
        """
        Args:
            checkpoint: model checkpoint path or HF hub ID
            device: 'cpu' or 'cuda'; if None, auto-select
            dtype: 'fp16' or 'fp32'
            color_maps: list of matplotlib colormap names
        """
        # Device setup
        self.device = torch.device(device) if device else torch.device("cuda")

        # Load model
        torch_dtype = torch.float16 if dtype == "fp16" else torch.float32
        self.pipe = RollingDepthPipeline.from_pretrained(
            checkpoint, torch_dtype=torch_dtype
        )

        # Visualization settings
        self.color_maps = color_maps or ["Spectral_r", "Greys_r"]
```

### 2. Simple Public API
Expose minimal, focused public methods. Keep implementation details private.

```python
# ✅ Good: Clean public interface
class PoseTrajectoryVisualizer:
    def __init__(self, pose_dir: str, depth_raw_path: str, ...):
        self.pose_dir = Path(pose_dir)
        self.fig = go.Figure()

    def load_poses(self):
        """Load all pose matrices from directory."""
        ...

    def plot(self):
        """Create 3D visualization of scene and trajectory."""
        ...

    def show(self):
        """Display interactive plot in browser."""
        self.fig.show()

    def save_html(self, filepath: str):
        """Export plot as standalone HTML."""
        pio.write_html(self.fig, file=filepath)
```

### 3. Single Responsibility
Each class should encapsulate one cohesive concept.

```python
# ✅ Good: Focused classes
class DepthPredictor:
    """Handles depth prediction using RollingDepth."""

class PoseRolloutPredictor:
    """Handles 6-DoF pose estimation using FoundationPose."""

class PoseTrajectoryVisualizer:
    """Handles 3D visualization of poses and scene."""

# ❌ Bad: God class
class Pipeline:
    """Handles everything: depth, pose, visualization, I/O, ..."""
```

### 4. Configuration Over Magic
Make behavior configurable through constructor parameters, not hidden defaults.

```python
# ✅ Good: Explicit configuration
class PoseRolloutPredictor:
    def __init__(
        self,
        data_path: str,
        mesh_file: str,
        est_refine_iter: int = 10,  # Explicit defaults
        track_refine_iter: int = 4,
        debug: int = 2,
        debug_dir: str = "debug",
    ):
        self.est_refine_iter = est_refine_iter
        self.track_refine_iter = track_refine_iter
        self.debug = debug

# ❌ Bad: Hidden magic numbers
class PoseRolloutPredictor:
    def run(self):
        pose = estimator.register(iteration=10)  # Magic number
```

---

## Error Handling Philosophy

### 1. Fail Fast, Fail Loud
Let errors propagate naturally. Don't hide problems.

```python
# ✅ Good: Clear error, immediate failure
def rescale_video(input_path: str, output_path: str, ...):
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise RuntimeError(f"Unable to open video file: {input_path}")
    ...

# ❌ Bad: Silent failure
def rescale_video(input_path: str, output_path: str, ...):
    try:
        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
            return None  # Silent failure
    except Exception:
        pass  # Swallowed error
```

### 2. Descriptive Error Messages
Include specific context: file paths, parameter values, expected vs actual.

```python
# ✅ Good: Informative message
if not src.is_file():
    raise FileNotFoundError(f"Mask file not found: {src}")

if data.shape != (3, 3) and data.size != 4:
    raise ValueError(
        f"Unsupported intrinsics format: shape={data.shape}, size={data.size}"
    )

# ❌ Bad: Vague message
if not src.is_file():
    raise FileNotFoundError("File not found")
```

### 3. Minimal Exception Handling
Only catch exceptions when you can meaningfully handle them. Otherwise, let them propagate.

```python
# ✅ Good: Handle specific, recoverable errors
try:
    self.pipe.enable_xformers_memory_efficient_attention()
except ImportError:
    logging.warning("xformers not available, running without it")
    # Graceful degradation

# ❌ Bad: Catch-all exception handler
try:
    # 100 lines of code
except Exception:
    print("Something went wrong")  # What? Where? Why?
```

### 4. Explicit Resource Management
Manually release resources. Don't rely solely on garbage collection.

```python
# ✅ Good: Explicit cleanup
cap = cv2.VideoCapture(input_path)
try:
    # Process video
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        writer.write(frame)
finally:
    cap.release()
    writer.release()

# Or simpler when no exception handling needed:
cap = cv2.VideoCapture(input_path)
# ... process ...
cap.release()
writer.release()
```

---

## Code Quality Philosophy

### 1. Simple Over Complex
Choose the straightforward solution. Avoid premature optimization and over-engineering.

```python
# ✅ Good: Direct solution
def extract_frames(input_path: str, output_dir: str, ext: str = "png"):
    """Extract video frames as image sequence."""
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    cap = cv2.VideoCapture(input_path)
    idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        fname = output_dir / f"{idx:06d}.{ext}"
        cv2.imwrite(str(fname), frame)
        idx += 1
    cap.release()

# ❌ Bad: Over-engineered
class FrameExtractor:
    def __init__(self, strategy: ExtractionStrategy):
        self.strategy = strategy

    def extract(self, factory: FrameFactory, writer: FrameWriter):
        # Unnecessary abstraction layers
        ...
```

### 2. Explicit Over Implicit
Make behavior clear through explicit code, not magic.

```python
# ✅ Good: Explicit conversions
input_path = Path(input_video_path)  # Clear conversion
output_dir = Path(output_dir)
torch_dtype = torch.float16 if dtype == "fp16" else torch.float32

# ❌ Bad: Implicit/magic behavior
def process(path):  # What type? String? Path? Both?
    # Implicit type coercion hidden inside
    ...
```

### 3. Readability First
Write code that is easy to read and understand. Good names reduce comment needs.

```python
# ✅ Good: Self-documenting
def depth_to_point_cloud(depth_raw_path: str, intrinsics: dict, width: int, height: int):
    depth = np.fromfile(depth_raw_path, dtype=np.uint16).reshape((height, width)) / 1000.0

    fx, fy, cx, cy = intrinsics["fx"], intrinsics["fy"], intrinsics["cx"], intrinsics["cy"]

    i, j = np.meshgrid(np.arange(width), np.arange(height))
    z = depth
    x = (i - cx) * z / fx
    y = (j - cy) * z / fy

    pts = np.stack((x, y, z), axis=-1).reshape(-1, 3)
    return pts

# ❌ Bad: Needs comments to understand
def d2p(drp, intr, w, h):
    d = np.fromfile(drp, dtype=np.uint16).reshape((h, w)) / 1000.0  # convert to meters
    f1, f2, c1, c2 = intr["fx"], intr["fy"], intr["cx"], intr["cy"]  # extract params
    # ... cryptic variable names require comments
```

### 4. Consistent Style
Maintain uniform formatting, naming, and structure throughout the codebase.

```python
# ✅ Good: Consistent patterns
class DepthPredictor:
    def predict(self, input_video_path: str | Path, output_dir: str | Path):
        input_path = Path(input_video_path)
        output_dir = Path(output_dir)
        ...

class PoseRolloutPredictor:
    def run(self):
        ...

class PoseTrajectoryVisualizer:
    def plot(self):
        ...

    def show(self):
        ...

    def save_html(self, filepath: str):
        ...
```

### 5. No Premature Abstraction
Don't create abstractions until you have multiple concrete use cases.

```python
# ✅ Good: Direct implementation first
def rescale_video(input_path: str, output_path: str, width: int, height: int):
    """Rescale video to target dimensions."""
    # Straightforward implementation
    ...

def extract_frames(input_path: str, output_dir: str):
    """Extract frames from video."""
    # Direct implementation
    ...

# ❌ Bad: Premature abstraction
class VideoProcessor(ABC):
    @abstractmethod
    def process(self, strategy: ProcessingStrategy) -> Result:
        """Abstract processing using strategy pattern"""
        # Only one implementation exists!
```

---

## Summary

**Functions**: Single responsibility, clear types, short, flat, meaningful names

**Classes**: Constructor initialization, simple public API, single responsibility, explicit configuration

**Errors**: Fail fast and loud, descriptive messages, minimal catching, explicit cleanup

**Quality**: Simple over complex, explicit over implicit, readability first, consistency, no premature abstraction

---

*Follow these principles to write clean, maintainable Python code that scales.*
