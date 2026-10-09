---
name: presenting-your-research
description: Design and improve research project pages through concrete narrative, layout, figure, and video decisions, grounded in Huy Ha's presentation lecture and worked robotics examples. Use for turning papers and demos into readable project pages, diagnosing unclear page sections, and planning supporting figures, clips, or talks.
---

# Presenting Your Research

Help a reader understand a research contribution, see why each design choice is needed, and find the evidence supporting it. Prioritize project pages; adapt the same reasoning to supporting figures, demo videos, and presentations when requested.

This skill distills Huy Ha's [lecture](https://huy-ha.github.io/assets/presenting_your_research.pdf) and collaborative research pages. The references distinguish lecture guidance, observed examples, and our practical adaptations. Treat the cases as design evidence, not a claim that one person authored every visual decision.

## Start with the requested scope

For a new page or substantial redesign, inspect the paper, actual results, available images/clips, current page, and editable sources. Establish:

- **Reader:** What do they already know, care about, and have time to understand?
- **Contribution:** What can the method do, for which task or setting?
- **Evidence:** Which real result, comparison, or mechanism explains each claim?
- **Materials:** Which visuals exist, and which need to be produced?

Use the supplied context rather than asking the user to repeat it. Ask only when a missing answer changes the scientific message or necessary production work. If a material is absent, keep its proposed slot visibly unfilled; do not invent a result, comparison, trajectory, or figure.

For a local repair, inspect the affected section and its neighbors. Fix that reading problem without rebuilding the whole page or restating every principle.

## 1. Make the research legible before styling

For a full page, draft a compact section map:

| Reader's question | Takeaway | Evidence | Visual treatment | Next question |
|---|---|---|---|---|
| Can an existing manipulation policy run on a mobile robot? | The system connects a gripper policy to a whole-body controller. | Verified deployment clip. | Show task and robot clearly; add a one-sentence caption. | What makes the legs follow the gripper? |
| Why does the gripper remain stable when the body moves? | The controller compensates in the world frame. | Disturbance clip and the relevant controller explanation. | Identify body motion and gripper target consistently. | How does it anticipate a fast motion? |

These rows are an adaptation of UMI on Legs, not a fixed page template. Write the next question from what the reader still needs to understand. A concise transition can be more useful than another decorative section.

Before naming a new mechanism, establish its need. For example, first explain that a moving robot must estimate its body motion quickly to keep the gripper stable, then introduce the odometry module. For an unfamiliar definition, use an observable example and a counterexample before the term.

Use a result-oriented heading only when the evidence supports it. Replace an empty heading such as "Experiments" with a specific finding, or use an honest question while introducing an unresolved need. Preserve the author's technical terminology and contribution boundaries.

For the rationale and more before/after examples, read [lecture principles](references/lecture-principles.md).

## 2. Support different reading speeds

Create a clear entry: project identity, one or two sentences describing the capability, the most revealing visual, and accessible paper/code links. Choose whether the first screen needs an immersive demonstration or an explanatory diagram from the research, the available footage, and the viewing size. A full-screen video is optional.

Give each layer a distinct job:

- **Heading:** state the question or conclusion.
- **Image/video:** make the behavior or relationship visible.
- **Caption:** explain what to notice and what it establishes.
- **Body:** explain the necessary mechanism, conditions, or qualification.
- **Q&A, limitations, paper, code:** serve readers who want depth.

For example, the Transformer Transformer token diagram shows structure; its caption explains the roles of the two token colors; the body explains the representation's design goals. The caption should enable a useful quick read rather than repeat the paragraph.

Keep page paragraphs focused. Move derivations, exhaustive settings, and long discussion to the paper or a deeper section when they obstruct the story. Do not hide the comparison condition or a qualification needed to interpret the displayed evidence.

Read [project cases](references/project-cases.md) for actual section transitions, figures, screenshots, and clips. Open the referenced image or watch the relevant clip when using it as a design model; filenames alone cannot teach composition or timing.

## 3. Give each visual a specific communication job

Choose the visual from the information it must convey:

| Information | Useful visual | Concrete instruction |
|---|---|---|
| Observable capability | A clean task clip | Keep the manipulated object and outcome visible; caption the behavior to inspect. |
| Why a mechanism helps | Matched comparison or ablation | Align task, camera, phase, and labels; name the changed condition. |
| Representation or architecture | A diagram | Establish the overall flow, then label objects and relationships; reuse semantic colors. |
| Performance or scaling | A plot | Name the metric and comparison; make the relevant trend readable at the actual page width. |
| Several instances of one capability | A restrained grid or selectable examples | Keep framing consistent and give readers control if simultaneous motion competes for attention. |

Apply a restrained hierarchy: dominant research visual, readable title, secondary caption, quieter details. Use whitespace to separate conceptual steps. Check alignment and line length in the real layout. Keep the same color attached to the same concept across related figures; do not copy a reference palette when its meanings differ.

For an explanatory sequence, reveal the current object or step as it is introduced. For a talk, synchronize the reveal with the spoken keyword. For a scrollable page, let the reader pause, replay, and inspect; do not require a cinematic animation to finish before the explanation becomes accessible.

Use fixed, complete, continuous views when a clip is offered as scientific evidence. A promotional clip may use camera motion and selected shots, but its role and playback speed must be clear. Provide the appropriate evidence separately when a claim requires it; a project page can contain both kinds.

Read [visual production](references/visual-production.md) for framing, lights, figure/caption recipes, importers, and worked examples. Reuse the project's existing renderer or editable workflow when it fits. Blender is an available production route, not a requirement to replace a working pipeline.

## 4. Produce the requested artifact

For a full project-page task, move from section map to copy and media plan, then build the authorized local page. For a figure, clip, or talk task, produce that deliverable and the necessary editable sources. Use existing project conventions and relevant production tools.

Keep the outputs proportionate: a section repair needs the repaired section and its explanation, not a mandatory full storyboard. Briefs and maps are working tools; completion means the requested artifact exists and has been inspected.

## 5. Inspect what the reader actually receives

Check the rendered output, not only the source or successful build:

- **Quick read:** Can a reader identify the contribution from the entry and section headings?
- **Continuous read:** Do three neighboring sections form an understandable progression, with each new mechanism motivated?
- **Evidence:** Does each important claim point to the correct comparison, result, or explanatory visual? Are simulation, real data, playback speed, and edited footage identified where they affect interpretation?
- **Visuals:** Are labels, objects, legends, and captions readable at desktop and narrow/mobile widths? Are semantic colors consistent?
- **Media:** Do images load and clips play? Can a reader pause or replay relevant motion? Inspect representative frames, comparison phases, and transitions rather than every frame.
- **Sources:** Do original links and editable outputs remain available? Keep reference captures attributed; they are study material, not the user's experiment or reusable artwork by default.

If the page feels attractive but confusing, locate the missing question, explanation, or evidence before adding effects. If it feels clear but visually weak, fix the specific framing, scale, alignment, contrast, or light problem. Report the changed files, what was actually inspected, and any remaining material limitation.

## Reference and reading editions

- [Lecture principles](references/lecture-principles.md): audience, information cascade, backward teaching, and attention, with source page numbers.
- [Project cases](references/project-cases.md): UMI on Legs and Transformer Transformer, with smaller contrasting examples.
- [Visual production](references/visual-production.md): concrete figure, camera, light, and animation recipes.
- [Media provenance](references/media-sources.md): original URLs, capture locations, transformations, and study-use attribution for `image/`.
- [Chinese reading edition](translations/zh-cn/index.html): a full translation for human review; the English files are the operational skill.
