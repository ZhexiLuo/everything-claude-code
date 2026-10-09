# Worked project-page cases

These are observations of collaborative project pages, followed by our adaptations. They do not establish who personally designed the visuals. Source links identify exact sections; local captures support visual study and remain attributed reference material. Read the relevant screenshot or clip together with its paragraph.

## UMI on Legs: let each answer create the next question

**Observed source structure.** [Demonstration capture](https://umi-on-legs.github.io/#umi) motivates portable data collection. A bridge then asks how legs should realize the predicted gripper motion. [Simulation tracking](https://umi-on-legs.github.io/#task-tracking) narrows the simulation problem; [controller explanation](https://umi-on-legs.github.io/#wbc) separates stability and precision and pairs them with demos. [Hardware](https://umi-on-legs.github.io/#hardware) grounds deployment, while [Q&A](https://umi-on-legs.github.io/#qa) supplies qualifications. The [stability demo](https://umi-on-legs.github.io/#stable-tracking) shows arm compensation during body perturbation. The [precision demo](https://umi-on-legs.github.io/#precise-tracking) connects future gripper targets with anticipatory body behavior. These videos explain controller behavior; they do not replace quantitative evaluation.

![The demonstration-to-controller transition on the source page](../image/umi-question-chain.png)

**Operational adaptation.** Annotate the boundary between each pair of sections before borrowing the layout:

| Boundary | Question the next paragraph must earn | What to inspect in the case |
|---|---|---|
| `#umi → #task-tracking` | We have the desired gripper motion; what makes the rest of the robot realize it? | The bridge between collected data and control. |
| `#task-tracking → #wbc` | What must a tracker preserve for manipulation? | The switch from training setting to behavioral requirements. |
| `#wbc → #hardware` | What information makes the controller usable on the physical robot? | The connection between behavior and deployment instruments. |
| `#hardware → #qa` | Where do the interface and system assumptions stop working? | The separation of a demonstrated capability from its boundary. |

**Before, invented:** “Next, we introduce our whole-body controller.”

**After, our adaptation:** “We now know what the gripper should do. How should the rest of the robot move to make that happen?”

The second transition lets the controller answer a need the reader already understands. For your own project, replace “gripper” with the actual interface variable. If the interface is a contact schedule, show that schedule; if it is an object pose trajectory, show the object. Do not borrow an interface assumption just because the reference paragraph reads well.

![Stability demo and its explanation inside the controller section](../image/umi-wbc.png)

[Watch the stability reference clip](../image/umi-stability.mp4). Pause once before the disturbance and once during compensation. Ask what the viewer can distinguish: body displacement, arm response, and the gripper's relationship to its reference. For a new page, place annotations on those observable quantities rather than adding generic “robustness” badges. The neighboring precision example should answer a different question; identical captions would erase the distinction.

![The neighboring precision demo answers a different control question](../image/umi-precision.png)

[Watch the precision reference clip](../image/umi-precision.mp4). Compare the anticipatory body movement with the gripper's subsequent motion. This is a separate observation task from resisting a body disturbance; give it its own caption and interpretation.

**A concrete editing task.** Take three adjacent sections and highlight their opening and closing sentences. Rewrite the boundaries until each section gives the next a reason to exist. Hide the images and read the sentences aloud. Restore the images and check that each one resolves the question raised.

## Transformer Transformer: reveal the vocabulary before the mechanism

**Observed source structure.** The first viewport combines title and animation; the following summary carries the headline hardware-result metrics. [Framework](https://transformer-transformer.github.io/#framework) presents three steps: demonstrate motion, generate a design, validate it through control. [Representation](https://transformer-transformer.github.io/#robotokens) assigns blue to embodiment and orange to dynamics. [Architecture](https://transformer-transformer.github.io/#architecture) explains conditioning before [self-guidance](https://transformer-transformer.github.io/#self-guidance) explains reward-directed generation. [Results](https://transformer-transformer.github.io/#results) lead to [hardware evidence](https://transformer-transformer.github.io/#real-world) and [limitations](https://transformer-transformer.github.io/#limitations). The representation figure, caption, and body offer successively deeper explanations rather than one undifferentiated specification.

![Title and animation occupy the entry viewport](../image/tt-hero.png)

[Watch the entry animation](../image/tt-hero.mp4). This is a useful study of attention and visual identity. It is not a reason to place every project's metrics in a full-screen hero. In your own page, decide whether an animation clarifies the research question or simply delays its explanation. Keep the following summary accessible and make its claim traceable to evidence farther down the page.

![Three-step framework communicates the overall task before its internal machinery](../image/tt-framework.png)

**Framework adaptation.** Before polishing a dense architecture figure, draw three empty boxes for input, transformation, and verification. Fill them with the actual entities, not module acronyms. Beneath each box, write the corresponding reader question:

1. What do I supply?
2. What does the method produce?
3. How do we determine that the product works?

If the third box merely repeats a generated image, the verification relationship is still missing. A framework should establish how the output will be assessed, even when detailed evaluation belongs in another section.

![The two token groups give the reader a vocabulary for later explanations](../image/tt-robotokens.png)

**Color adaptation.** Preserve color meaning inside your own project. For example, assign one color to a robot description and another to changing state/action information only if your diagram actually uses that distinction. Add text labels as well. Reuse those meanings in the architecture figure, animated reveal, and caption. Changing the same concept's color between sections makes the reader relearn the vocabulary.

**Before, invented:** “Our network employs masked diffusion and gradient-based reward guidance.”

**After, our adaptation:** “First show which information is given and which must be generated. Then explain how the generated candidate is steered toward the requested objective.”

This is an explanation plan, not replacement technical prose. In the final paragraph, name the project's real conditioning rule and objective. The representation section must make the nouns recognizable; the architecture section must explain the operation; only then can the optimization section explain how that operation is directed.

![Results appear after the method explanation and establish a separate evidence layer](../image/tt-results.png)

**Results adaptation.** Prepare a sentence for each connection: method → comparison, comparison → physical test, physical test → boundary. A useful form is “The comparison tests whether the proposed operation helps under these conditions; the hardware test asks whether the benefit survives deployment; the limitation states which assumptions remain.” Replace those general nouns with actual conditions and findings. Do not substitute a selected success clip for a distribution of results.

## Smaller cross-checks: distinguish recurring logic from one page's style

**Observed:** [Scaling Up](https://huy-ha.github.io/scalingup/) combines a brief capability statement with visual material; the colored-lines question in its closing Q&A names what the policy traces mean. **Adaptation:** when a visual looks intriguing but unfamiliar, add an interpretation sentence and a deeper explanation link. Decorative traces that no reader can decode have not explained the method.

**Observed:** the [original UMI page](https://umi-gripper.github.io/) places human demonstration and autonomous rollout together and later organizes task examples with paired conditions. **Adaptation:** match the visual question across both panels. For a human-to-robot comparison, keep the object and task phase identifiable; for an ablation, name the changed condition. Sharing a color palette or rounded video frame is a weaker transferable lesson than giving the comparison a specific job.

Transfer the causal explanation and evidence relationships; choose animation, palette, tone, and section count for the actual project.
