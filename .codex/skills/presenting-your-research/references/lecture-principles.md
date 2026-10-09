# Lecture principles made executable

Use this reference to repair a difficult explanation. Citations use **1-based PDF pages** in Huy Ha's 103-page [lecture](https://huy-ha.github.io/assets/presenting_your_research.pdf). The numbered principles summarize explicit guidance; exercises and wording are our adaptations.

## Source facts: what the lecture actually teaches

1. **Audience:** account for prior knowledge, interests, and effort available for understanding ([pp. 25–28](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=25)).
2. **Information cascade:** social post, video, website, talk, paper, and code serve increasing commitments; a website needs a brief takeaway and deeper answers ([pp. 32–40](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=32)).
3. **Backward teaching:** concrete examples and counterexamples precede definitions; establish the problem or result before its solution ([pp. 44–50](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=44)).
4. **Titles and attention:** informative headings aid re-entry; simple reveals should coincide with spoken keywords ([pp. 51–54](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=51), [63–72](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=63)).
5. **Visual purpose:** scientific footage preserves objective, complete, continuous observation; promotional footage can use cinematic selection ([pp. 75–77](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=75)).
6. **Production:** vary shot scale and camera movement; use soft illumination, rim and fill lights; import simulations into Blender with existing tooling ([pp. 80–92](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=80), [99–101](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=99)).

## Worked audience contract: a dexterous-hand page

**Hypothetical exercise, not an experiment report.** Suppose a researcher wants a page about transferring human manipulation demonstrations to a robot hand. The project has its own actual results; this exercise invents no success rate, comparison outcome, or validated mechanism.

Write three decisions before polishing its introduction:

| Dimension | Concrete assumption to test | Consequence for this page |
|---|---|---|
| Knowledge | A robotics visitor understands demonstrations and policies, but may not know the project's contact representation. | Show the manipulated object and hand motion before introducing representation symbols. |
| Interest | The visitor wants to know what transfers despite different hands. | Put the human/robot relation beside the first capability visual. |
| Effort | A visitor may skim; a potential collaborator may inspect the mechanism. | Make the short explanation useful independently, then link the representation and evaluation details. |

This is a proposed audience contract, not a universal demographic claim. Change it for a specialist talk or a general-audience demonstration.

**Module-first draft, invented:** “Our pipeline contains reconstruction, retargeting, and a tracking policy.”

**Problem-first adaptation:** “Human and robot hands differ in their geometry. The demonstration must therefore become a feasible robot motion while retaining the manipulation intent.”

The second version gives the modules a job. Next show a real example supplied by the author. A useful counterexample would be an actual recording where matching visible hand motion fails to preserve the intended object interaction. Name the relevant representation only after the reader can see what it must retain. If that recording is absent, keep it as a proposed experiment; do not manufacture a failure image.

## Turn the cascade into different outputs

For the same hypothetical project, distribute information by the decision each artifact should support:

| Artifact | Proposed content | Reader can decide |
|---|---|---|
| Entry visual and summary | The source demonstration, target robot, and intended transfer in one clear composition. | Whether this addresses their manipulation problem. |
| Three neighboring page sections | The embodiment mismatch; the translation mechanism; the corresponding evidence. | Why the mechanism belongs in the system. |
| Technical video or talk | Explain one mechanism while showing its motion or diagram. | Whether they understand the cause of the behavior. |
| Paper and supplementary evidence | Definitions, conditions, comparisons, protocol, and complete recordings. | Whether the claim is adequately supported. |
| Code and editable sources | Entry points, data contracts, configuration, and source visuals. | Whether they can reproduce or extend it. |

Do not merely shorten the same paragraph five times. Select a different informational job at each level. The page's mechanism explanation can omit derivations while retaining the comparison condition needed to interpret its evidence.

## Write a causal paragraph, not a component inventory

Use **question → claim → evidence → explanation → next question** as an authoring aid. This sequence is our operational synthesis, not a quoted formula from the lecture.

For a proposed transfer section:

- **Question:** Which properties of the human manipulation should survive transfer?
- **Claim:** State the author's actual answer, narrowly enough to test.
- **Evidence:** Place the recording, diagram, or comparison that establishes that answer.
- **Explanation:** Identify the visual feature that makes the relationship visible.
- **Next question:** Having specified the intended interaction, how does the robot execute it?

Apply this to prose, rather than exposing five mandatory labels on the finished page. For example: “This representation specifies the interaction to preserve. The next step is to produce a motion the robot can execute.” That transition says why another section is needed.

**Heading adaptation:** replace “Retargeting Module” with “How should the robot realize the demonstrated interaction?” while introducing the mechanism. Use “The robot preserves the interaction across hand geometries” only if the project's evidence supports that stronger conclusion. A heading is a claim-bearing element, not decoration.

## Make a reveal follow the explanation

Original rehearsal script for a diagram, using planned elements rather than asserted results:

| Spoken keyword | Reveal | What stays visible |
|---|---|---|
| “demonstration” | Source hand and object. | The object and motion reference. |
| “different geometry” | Target hand beside the source. | Both hands at comparable visual scale. |
| “interaction” | The relevant contact or object-motion annotation. | The source–target comparison. |
| “execute” | The robot motion and its connection to the representation. | The diagram's overall direction. |

Appear or fade an element when its name is spoken; do not reveal the complete diagram while narrating only its first corner. Rehearse with the real rendered animation. On a webpage, provide a static completed state and replay/pause controls when motion carries the explanation. The reader should be able to inspect a relationship without waiting for the next loop.

## Inspect the lecture's visual examples

![Two explanation orders compared on PDF page 50](../image/lecture-050.png)

Study the order in which the need and the technical module appear. [Original page 50](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=50).

![The current spoken concept is emphasized in the diagram on PDF page 67](../image/lecture-067.png)

Study the contrast between the active concept and the already explained context. [Original page 67](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=67).

![Different purposes require different visual treatments on PDF page 76](../image/lecture-076.png)

Study which observations the scientific recording must preserve, then choose the treatment for the requested artifact. [Original page 76](https://huy-ha.github.io/assets/presenting_your_research.pdf#page=76).
