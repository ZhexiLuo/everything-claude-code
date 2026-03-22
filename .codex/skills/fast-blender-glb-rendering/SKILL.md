---
name: fast-blender-glb-rendering
description: Use when rendering GLB/glTF models with Blender in batch pipelines, synthetic data generation, or feature extraction preprocessing. Triggers on slow Blender Cycles rendering, headless batch rendering, multi-view GLB rendering, or when render time dominates pipeline throughput.
---

# Fast Blender GLB Rendering

## Overview

Batch GLB rendering pipelines are often 10-100x slower than necessary because they use Cycles (ray tracing) instead of EEVEE (rasterization), spawn a new Blender process per model, and rebuild the entire scene each time. This skill documents proven techniques to maximize throughput.

## When to Use

- Rendering GLB/glTF models for training data, feature extraction, or synthetic datasets
- Blender Cycles rendering is the pipeline bottleneck
- Rendering simple single-object GLB (not complex multi-material scenes)
- Need to batch-render hundreds/thousands of models

## When NOT to Use

- Photorealistic rendering requiring accurate global illumination
- Complex scenes with volumetrics, caustics, subsurface scattering
- Final production renders where quality > speed

## Core Techniques

### 1. EEVEE Instead of Cycles (10-100x speedup)

The single biggest win. EEVEE is a real-time rasterization engine — for simple GLB objects, visual quality is sufficient for DINOv2/CLIP feature extraction and training data.

```python
# ❌ Slow: Cycles ray tracing (128 spp @ 512x512 ≈ 0.6s/view on 256-core CPU)
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.samples = 128

# ✅ Fast: EEVEE rasterization (16 spp @ 768x512 ≈ 0.02s/view)
bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'  # Blender 4.x
eevee = bpy.context.scene.eevee
eevee.taa_render_samples = 16
eevee.use_gtao = True        # ambient occlusion
eevee.gtao_distance = 0.2
eevee.use_bloom = False       # unnecessary for data generation
```

**Note:** Blender 3.x uses `'BLENDER_EEVEE'`, Blender 4.x uses `'BLENDER_EEVEE_NEXT'`.

### 2. Single-Process Batch (eliminate per-model startup)

Instead of spawning a new Blender subprocess per GLB, load all models sequentially in one process. This avoids ~2s startup + BVH/kernel compilation per model.

```python
class ModelRenderer:
    def __init__(self):
        self._setup_environment()  # once: engine, lights, camera, compositor

    def _clear_scene_objects(self):
        """Only delete model objects, keep Camera and Lights"""
        bpy.ops.object.select_all(action='SELECT')
        for obj in bpy.data.objects:
            if obj.type in ('CAMERA', 'LIGHT'):
                obj.select_set(False)
        bpy.ops.object.delete()
        bpy.ops.outliner.orphans_purge(
            do_local_ids=True, do_linked_ids=True, do_recursive=True
        )

    def process_single_model(self, glb_path, output_dir):
        self._clear_scene_objects()   # fast cleanup
        self._import_glb(glb_path)    # import new model
        self._render_views(output_dir) # render all views
```

### 3. Suppress Blender Output

Blender's verbose stdout kills I/O performance in batch mode:

```python
from contextlib import contextmanager

@contextmanager
def suppress_blender_output():
    stdout_fd, stderr_fd = sys.stdout.fileno(), sys.stderr.fileno()
    saved_out, saved_err = os.dup(stdout_fd), os.dup(stderr_fd)
    devnull = os.open(os.devnull, os.O_WRONLY)
    os.dup2(devnull, stdout_fd)
    os.dup2(devnull, stderr_fd)
    os.close(devnull)
    try:
        yield
    finally:
        os.dup2(saved_out, stdout_fd)
        os.dup2(saved_err, stderr_fd)
        os.close(saved_out)
        os.close(saved_err)

with suppress_blender_output():
    renderer.process_single_model(glb, out)
```

### 4. Rotate Object, Not Camera

Cheaper than repositioning camera + recomputing view matrix:

```python
for i, angle in enumerate(view_angles):
    merged_object.rotation_euler = angle
    bpy.context.view_layer.update()  # force matrix recalc
    bpy.ops.render.render(write_still=True)
```

## Quick Reference

| Technique | Speedup | Effort |
|-----------|---------|--------|
| EEVEE instead of Cycles | 10-100x | Change 2 lines |
| Single-process batch | 2-5x (amortized) | Refactor to class |
| Suppress output | 1.1-1.3x | Add context manager |
| Rotate object not camera | 1.05x | Minor refactor |
| Reduce samples (128→16) | ~1.1x for Cycles | Change 1 line |
| Reduce views (24→8) | 3x | Change 1 param |

## A100 GPU Rendering Notes

A100 is a compute GPU (no RT cores). For simple GLB objects:
- **CPU (256-core EPYC) beats A100** in single-worker Cycles rendering
- **A100 wins at ≥4 parallel workers** (each GPU independent, CPU cores shared)
- **EEVEE makes this moot** — rasterization is fast on both CPU and GPU
- Official Blender benchmark: A100 CUDA ≈ 25 Msamples/s (monster scene)

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using Cycles for training data | Switch to EEVEE — quality is sufficient |
| New Blender process per model | Single-process batch with scene cleanup |
| Not purging orphan data | Call `outliner.orphans_purge()` after delete |
| Forgetting `view_layer.update()` | Required after changing object transforms |
| Using `BLENDER_EEVEE` on Blender 4.x | Use `BLENDER_EEVEE_NEXT` |
