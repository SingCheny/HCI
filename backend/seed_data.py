"""Seed data for the LearnSmart AI Learning Platform - HCI Course Content"""

COURSES = [
    {
        "title": "Introduction to HCI",
        "description": "Understand the foundations of Human-Computer Interaction, its history, and why it matters in modern technology.",
        "icon": "monitor",
        "color": "#6366f1",
        "order_index": 0,
    },
    {
        "title": "Visual Perception & Design",
        "description": "Explore how humans perceive visual information and apply these principles to interface design.",
        "icon": "eye",
        "color": "#8b5cf6",
        "order_index": 1,
    },
    {
        "title": "Interaction Techniques",
        "description": "Learn about different input methods, interaction paradigms, and how users communicate with systems.",
        "icon": "mouse-pointer",
        "color": "#ec4899",
        "order_index": 2,
    },
    {
        "title": "User Interface Design",
        "description": "Master UI design principles, layout strategies, and create interfaces that delight users.",
        "icon": "layout",
        "color": "#f59e0b",
        "order_index": 3,
    },
    {
        "title": "Usability Evaluation",
        "description": "Learn methods to evaluate and improve the usability of interactive systems.",
        "icon": "clipboard-check",
        "color": "#10b981",
        "order_index": 4,
    },
    {
        "title": "Accessibility & Inclusive Design",
        "description": "Design for all users regardless of abilities, following universal design principles.",
        "icon": "heart",
        "color": "#ef4444",
        "order_index": 5,
    },
]

LESSONS = {
    "Introduction to HCI": [
        {
            "title": "What is HCI?",
            "order_index": 0,
            "xp_reward": 50,
            "estimated_minutes": 8,
            "summary": "HCI studies how people interact with computers and how to design better interfaces.",
            "content": """# What is Human-Computer Interaction?

**Human-Computer Interaction (HCI)** is a multidisciplinary field that focuses on the design, evaluation, and implementation of interactive computing systems for human use.

## Key Concepts

HCI sits at the intersection of several disciplines:
- **Computer Science** — system design and engineering
- **Psychology** — understanding human behavior and cognition
- **Design** — creating aesthetically pleasing and functional interfaces
- **Sociology** — understanding social contexts of technology use

## Why HCI Matters

Good HCI design can:
1. **Reduce errors** — Clear interfaces prevent user mistakes
2. **Increase productivity** — Intuitive systems save time
3. **Improve satisfaction** — Pleasant experiences build loyalty
4. **Enhance accessibility** — Good design serves all users

## The Human in HCI

Understanding human capabilities and limitations is central to HCI:
- **Perception** — How we see, hear, and sense information
- **Cognition** — How we think, learn, and remember
- **Motor skills** — How we physically interact with devices

## Historical Context

HCI has evolved from command-line interfaces to graphical UIs, touch screens, voice assistants, and now to AI-powered adaptive interfaces. Each transition brought new challenges and opportunities for improving the human-computer relationship.

> "The real problem is not whether machines think but whether men do." — B.F. Skinner
""",
        },
        {
            "title": "History of Interface Design",
            "order_index": 1,
            "xp_reward": 50,
            "estimated_minutes": 10,
            "summary": "From command lines to AI assistants — the evolution of how humans interact with computers.",
            "content": """# History of Interface Design

## The Evolution of Interfaces

### 1. Batch Processing (1950s-1960s)
Users submitted jobs on punch cards and waited hours or days for results. There was **no real-time interaction** with the computer.

### 2. Command-Line Interface (1960s-1980s)
The introduction of terminals allowed direct text-based interaction. Users typed commands and received text output.
- **Pros**: Powerful, scriptable, efficient for experts
- **Cons**: Steep learning curve, error-prone, no visual feedback

### 3. Graphical User Interface (1970s-present)
Pioneered at Xerox PARC and popularized by Apple Macintosh and Microsoft Windows.
- **WIMP paradigm**: Windows, Icons, Menus, Pointers
- Direct manipulation of on-screen objects
- Visual metaphors (desktop, folders, trash can)

### 4. Touch & Mobile (2007-present)
The iPhone revolution brought multi-touch interfaces to the mainstream.
- Natural gesture interactions (pinch, swipe, tap)
- Context-aware computing
- Mobile-first design thinking

### 5. Voice & AI Interfaces (2010s-present)
Natural language interaction and intelligent assistants.
- Siri, Alexa, Google Assistant
- Conversational UI
- Predictive interfaces

### 6. Mixed Reality & Beyond (2020s-present)
AR/VR interfaces, brain-computer interfaces, and spatial computing.
- Immersive interactions
- Gesture and gaze tracking
- Haptic feedback

## Key Takeaway
Each generation of interfaces has moved toward more **natural, intuitive** interaction, reducing the gap between human intent and computer response.
""",
        },
        {
            "title": "Human Factors & Ergonomics",
            "order_index": 2,
            "xp_reward": 60,
            "estimated_minutes": 12,
            "summary": "How physical and cognitive human factors influence the design of interactive systems.",
            "content": """# Human Factors & Ergonomics

## What are Human Factors?

Human factors (or ergonomics) is the scientific discipline concerned with understanding interactions among humans and other elements of a system. In HCI, this means designing technology that fits **human capabilities and limitations**.

## Physical Ergonomics

### Input Device Design
- **Fitts's Law**: The time to reach a target depends on the distance to and size of the target
  - T = a + b × log₂(D/W + 1)
  - Implications: Make buttons larger, place them closer to starting positions
- **Keyboard layouts**: QWERTY vs Dvorak vs ergonomic designs
- **Mouse alternatives**: Trackpads, trackballs, eye tracking

### Display Considerations
- **Viewing distance**: Optimal is 50-70cm for desktop monitors
- **Font size**: Minimum 16px for body text on screens
- **Color contrast**: WCAG recommends at least 4.5:1 contrast ratio

## Cognitive Ergonomics

### Mental Models
Users form **mental models** of how systems work. Good design aligns with existing mental models.

### Cognitive Load
- **Intrinsic load**: Complexity of the task itself
- **Extraneous load**: Bad design adding unnecessary complexity
- **Germane load**: Effort spent building understanding

### Miller's Law
Humans can hold approximately **7 ± 2** items in working memory. Design should minimize memory demands.

## Environmental Factors
- Lighting conditions affect screen readability
- Noise levels impact concentration
- Temperature affects comfort and performance

## Design Implications
1. Support human memory with visual cues
2. Minimize physical strain in frequently used interfaces
3. Account for various usage environments
4. Test with diverse user populations
""",
        },
    ],
    "Visual Perception & Design": [
        {
            "title": "Gestalt Principles",
            "order_index": 0,
            "xp_reward": 60,
            "estimated_minutes": 10,
            "summary": "Gestalt principles explain how humans naturally organize visual information into groups and patterns.",
            "content": """# Gestalt Principles of Visual Perception

## Overview
Gestalt psychology explains how humans perceive visual elements as **organized patterns** rather than individual components. These principles are fundamental to effective UI design.

## The Key Principles

### 1. Proximity
Elements that are **close together** are perceived as belonging to the same group.
- **Application**: Group related form fields, space out unrelated content
- Use consistent spacing to create visual hierarchy

### 2. Similarity
Elements that **look alike** (color, shape, size) are perceived as related.
- **Application**: Use consistent styling for similar functions
- Differentiate distinct categories with visual differences

### 3. Closure
Our minds **fill in missing information** to perceive complete shapes.
- **Application**: Logos and icons don't need complete outlines
- Progress indicators can use partial circles

### 4. Continuity
The eye follows **smooth paths** and tends to group aligned elements.
- **Application**: Align elements to create visual flow
- Use lines and arrows to guide user attention

### 5. Figure-Ground
We naturally separate a **focal element (figure)** from its **background (ground)**.
- **Application**: Use contrast to highlight important content
- Modal dialogs with dimmed backgrounds

### 6. Common Fate
Elements that **move together** are perceived as a group.
- **Application**: Animate related elements together
- Scrolling groups and collapsible sections

## Applying Gestalt to UI Design
- Use proximity to create logical groupings
- Maintain consistency in visual elements for similar actions
- Create clear visual hierarchy through contrast
- Guide the user's eye through thoughtful alignment
""",
        },
        {
            "title": "Color Theory in Interface Design",
            "order_index": 1,
            "xp_reward": 55,
            "estimated_minutes": 10,
            "summary": "How to use color effectively in interface design for communication, mood, and usability.",
            "content": """# Color Theory in Interface Design

## The Psychology of Color

Colors evoke emotional responses and carry cultural meanings:
- **Blue**: Trust, calm, professionalism (used by Facebook, LinkedIn)
- **Red**: Urgency, energy, danger (errors, notifications)
- **Green**: Success, nature, growth (confirmations, go signals)
- **Orange/Yellow**: Warning, attention, warmth
- **Purple**: Creativity, luxury, wisdom

## Color Models

### RGB (Screen)
- Additive color model used for digital displays
- Colors defined by Red, Green, Blue values (0-255)

### HSL (Design-friendly)
- **Hue**: The color itself (0-360°)
- **Saturation**: Intensity (0-100%)
- **Lightness**: Brightness (0-100%)
- Easier to create harmonious palettes

## Color Harmony

### Complementary Colors
Colors opposite on the color wheel create strong contrast.

### Analogous Colors
Adjacent colors create harmonious, cohesive designs.

### Triadic Colors
Three evenly-spaced colors provide vibrant variety.

## Accessibility Considerations

### Color Blindness
- Affects ~8% of males, ~0.5% of females
- **Never use color alone** to convey information
- Add icons, patterns, or text labels
- Test with color blindness simulators

### Contrast Requirements
- **WCAG AA**: 4.5:1 for normal text, 3:1 for large text
- **WCAG AAA**: 7:1 for normal text, 4.5:1 for large text
- Use tools like WebAIM Contrast Checker

## Best Practices
1. Limit your palette to 3-5 primary colors
2. Use a single accent color for CTAs
3. Maintain consistent meaning for colors
4. Test in both light and dark modes
5. Consider cultural context for global products
""",
        },
        {
            "title": "Typography & Readability",
            "order_index": 2,
            "xp_reward": 50,
            "estimated_minutes": 8,
            "summary": "Typography choices significantly impact readability, hierarchy, and user experience.",
            "content": """# Typography & Readability

## Why Typography Matters

Typography accounts for **95% of web design**. Good typography:
- Improves readability and comprehension
- Creates visual hierarchy
- Sets the tone and personality
- Guides users through content

## Type Anatomy
- **Serif fonts** (Times, Georgia): Traditional, trustworthy — good for body text in print
- **Sans-serif fonts** (Arial, Helvetica, Inter): Modern, clean — preferred for screens
- **Monospace fonts** (Courier, Fira Code): Technical content, code
- **Display fonts**: Headlines and decorative uses only

## Readability Factors

### Line Length
- Optimal: **50-75 characters per line** (including spaces)
- Too long → eyes get lost returning to next line
- Too short → reading rhythm is disrupted

### Line Height (Leading)
- Body text: **1.5-1.7× font size**
- Headlines: **1.2-1.3× font size**
- Tight leading reduces readability

### Font Size
- Body text: minimum **16px** on screens
- Mobile: consider **18px** or larger
- Maintain clear size hierarchy (h1 > h2 > h3 > body)

### Letter Spacing (Tracking)
- Uppercase text benefits from increased spacing (+1-3%)
- Body text usually works best at default

## Creating Hierarchy
Use **no more than 2-3 font families**:
1. One for headings (display or bold weight)
2. One for body text (regular weight, high readability)
3. Optional: one for code or special content

## Accessibility
- Never use font size below 12px
- Ensure sufficient contrast between text and background
- Allow users to resize text up to 200%
- Avoid justified text (creates uneven spacing)
""",
        },
    ],
    "Interaction Techniques": [
        {
            "title": "Direct Manipulation",
            "order_index": 0,
            "xp_reward": 55,
            "estimated_minutes": 10,
            "summary": "Direct manipulation allows users to interact with on-screen objects naturally, like physical objects.",
            "content": """# Direct Manipulation

## Definition
Direct manipulation is an interaction style where users act on **visible objects** using **physical actions** rather than complex syntax. Coined by Ben Shneiderman in 1983.

## Core Principles

### 1. Continuous Representation
Objects of interest are always visible. Users can see:
- The current state of the system
- Available objects and actions
- Results of their actions in real-time

### 2. Physical Actions
Instead of typing commands, users:
- **Click** to select
- **Drag** to move
- **Resize** by pulling handles
- **Rotate** with gestures

### 3. Rapid, Reversible Actions
- Results are visible immediately
- Actions can be easily undone (Ctrl+Z)
- Users feel in control

### 4. Incremental Effect
Each action causes a small, visible change, allowing users to make adjustments progressively.

## Examples in Modern UIs
- **File management**: Drag files between folders
- **Drawing tools**: Click and draw on canvas
- **Maps**: Pan and zoom with gestures
- **Spreadsheets**: Click cells to edit
- **Slider controls**: Drag to set values
- **Touch interfaces**: Pinch to zoom, swipe to scroll

## Benefits
1. Easy to learn — maps to real-world experience
2. Low error rates — visible actions are predictable
3. High user satisfaction — feels responsive and natural
4. Easy to remember — actions are intuitive

## Limitations
- Not suitable for all tasks (e.g., batch operations)
- Can be imprecise (e.g., exact positioning)
- May be slower than commands for expert users
- Requires screen space for all visible objects

## Design Guidelines
1. Make the current state visible
2. Provide immediate visual feedback
3. Support undo/redo for all actions
4. Use familiar visual metaphors
5. Keep actions consistent across the interface
""",
        },
        {
            "title": "Input Methods & Modalities",
            "order_index": 1,
            "xp_reward": 55,
            "estimated_minutes": 10,
            "summary": "Different input methods from keyboard and mouse to touch, voice, and gesture interaction.",
            "content": """# Input Methods & Modalities

## Traditional Input

### Keyboard
- Most common text input method
- Shortcuts increase expert efficiency
- Consider international keyboard layouts
- **Design tip**: Always support keyboard navigation

### Mouse / Trackpad
- Pointing device for 2D interaction
- Click, double-click, right-click, scroll
- Hover states provide additional information
- **Fitts's Law** governs target acquisition time

## Touch Input

### Single Touch
- Tap, long press, swipe
- Minimum touch target: **44×44 points** (Apple) or **48×48 dp** (Android)
- Fat finger problem: ensure adequate spacing

### Multi-Touch Gestures
- **Pinch**: Zoom in/out
- **Two-finger rotate**: Rotation
- **Three-finger swipe**: Navigation (OS level)
- Keep gestures discoverable!

## Voice Input

### Speech Recognition
- Natural language processing advances
- Hands-free interaction
- Accessibility benefits
- **Challenges**: Ambient noise, accents, privacy

### Voice Design Principles
1. Provide clear prompts
2. Handle errors gracefully
3. Confirm destructive actions
4. Allow interruptions

## Gestural Input

### Camera-Based
- Hand tracking (Leap Motion)
- Body tracking (Kinect)
- Face tracking (Apple Face ID)

### Sensor-Based
- Accelerometer (tilt controls)
- Gyroscope (rotation)
- Proximity sensor

## Emerging Modalities
- **Eye tracking**: Gaze-based selection
- **Brain-computer interfaces**: Direct neural input
- **Haptic output**: Touch feedback for confirmation
- **EMG**: Muscle signal detection

## Multimodal Interaction
Combining input methods creates richer experiences:
- Voice + touch (maps: "Show me restaurants near here" + tapping)
- Gesture + gaze (look at object + grab gesture to select)
- Text + pointing (type to filter + click to select)
""",
        },
        {
            "title": "Feedback & Response Time",
            "order_index": 2,
            "xp_reward": 50,
            "estimated_minutes": 8,
            "summary": "System feedback and response times critically affect user perception and satisfaction.",
            "content": """# Feedback & Response Time

## Why Feedback Matters
Without feedback, users don't know if their actions succeeded. Good feedback:
- Confirms actions were received
- Shows system status
- Guides next steps
- Reduces errors and anxiety

## Types of Feedback

### Visual Feedback
- Button press animations
- Loading indicators
- Success/error messages with color coding
- Progress bars for long operations

### Auditory Feedback
- Click sounds for button presses
- Notification sounds
- Error alerts
- Voice confirmation

### Haptic Feedback
- Vibration for touch confirmations
- Force feedback in game controllers
- Texture simulation in advanced devices

## Response Time Guidelines

### Jakob Nielsen's Thresholds
1. **0.1 second**: Feels instantaneous — no feedback needed
2. **1.0 second**: User notices delay — show activity indicator
3. **10 seconds**: Attention limit — show progress bar with estimate

### Perception of Speed
- Skeleton screens feel faster than spinners
- Progress bars feel faster when they accelerate
- Animation during loading reduces perceived wait time
- Show partial content rather than blocking for all content

## Designing Good Feedback

### Principles
1. **Immediate**: Acknowledge actions within 100ms
2. **Informative**: Tell users what happened and why
3. **Appropriate**: Match feedback intensity to action importance
4. **Consistent**: Same actions produce same feedback patterns

### Error Feedback Best Practices
- Use plain language, not error codes
- Explain what went wrong
- Suggest how to fix it
- Don't blame the user
- Prevent errors when possible

## The Feedback Loop
1. User performs action
2. System acknowledges action instantly
3. System processes the request
4. System shows result
5. User evaluates and decides next action

Well-designed feedback at each step creates a smooth, confident interaction experience.
""",
        },
    ],
    "User Interface Design": [
        {
            "title": "Design Principles & Heuristics",
            "order_index": 0,
            "xp_reward": 65,
            "estimated_minutes": 12,
            "summary": "Nielsen's heuristics and core design principles that guide effective interface creation.",
            "content": """# Design Principles & Heuristics

## Nielsen's 10 Usability Heuristics

### 1. Visibility of System Status
The system should keep users informed about what's going on, through appropriate feedback within reasonable time.
- Loading indicators, progress bars
- Save confirmation messages
- Online/offline status

### 2. Match Between System and Real World
Use language and concepts familiar to users, not system-oriented jargon.
- Shopping "cart" metaphor
- "Folder" and "file" analogies
- Real-world icons

### 3. User Control and Freedom
Users often make mistakes. Provide a clearly marked "emergency exit."
- Undo/Redo functionality
- Cancel buttons on dialogs
- Easy navigation back

### 4. Consistency and Standards
Users should not have to wonder whether different words, situations, or actions mean the same thing.
- Consistent button placement
- Standard icons and patterns
- Follow platform conventions

### 5. Error Prevention
Prevent problems from occurring in the first place.
- Confirmation dialogs for destructive actions
- Input validation and constraints
- Smart defaults

### 6. Recognition Rather Than Recall
Minimize the user's memory load by making elements, actions, and options visible.
- Visible navigation
- Recent items lists
- Autocomplete suggestions

### 7. Flexibility and Efficiency of Use
Accelerators for expert users without confusing novices.
- Keyboard shortcuts
- Customizable toolbars
- Power user features behind progressive disclosure

### 8. Aesthetic and Minimalist Design
Interfaces should not contain irrelevant or rarely needed information.
- Clean layouts
- Prioritize content
- Progressive disclosure

### 9. Help Users Recognize, Diagnose, and Recover from Errors
Error messages should be expressed in plain language, indicate the problem, and suggest a solution.
- Clear error messages
- Inline validation
- Suggested corrections

### 10. Help and Documentation
Provide help that is easy to search and focused on the user's task.
- Contextual help tooltips
- Searchable documentation
- Guided tutorials

## Applying Heuristics
Use these heuristics for:
1. **Design**: Guide decisions during creation
2. **Evaluation**: Assess existing interfaces
3. **Communication**: Explain design rationale to stakeholders
""",
        },
        {
            "title": "Layout & Visual Hierarchy",
            "order_index": 1,
            "xp_reward": 55,
            "estimated_minutes": 10,
            "summary": "Creating effective layouts that guide users through content with clear visual hierarchy.",
            "content": """# Layout & Visual Hierarchy

## What is Visual Hierarchy?

Visual hierarchy is the arrangement of elements to show their order of importance. It guides the user's eye through the interface in a logical sequence.

## Tools for Creating Hierarchy

### 1. Size
Larger elements draw attention first.
- Headlines > subheadlines > body text
- Primary CTAs larger than secondary actions
- Feature images larger than thumbnails

### 2. Color & Contrast
High contrast elements stand out.
- Accent colors for important actions
- Muted colors for secondary content
- White space around key elements

### 3. Position
Top-left is scanned first (in LTR languages).
- **F-pattern**: Users scan horizontally then vertically
- **Z-pattern**: For simpler layouts and landing pages
- Above the fold content gets most attention

### 4. Typography Weight
Bold text draws more attention than regular weight.
- Use font weight strategically
- Don't overuse bold — it loses impact
- Headers establish section hierarchy

### 5. White Space
Empty space gives elements room to breathe and creates groupings.
- Increases readability
- Reduces cognitive load
- Makes designs feel premium

## Common Layout Patterns

### Grid Systems
- **12-column grid**: Standard for responsive design
- **8-point grid**: Consistent spacing (8, 16, 24, 32px…)
- Grids create alignment and consistency

### Card Layouts
- Self-contained content blocks
- Easy to scan and reorganize
- Works well for varied content types

### List Layouts
- Sequential content viewing
- Good for feeds, search results, settings
- Easy to scan vertically

## Responsive Design Principles
1. Mobile-first approach
2. Flexible grids and images
3. Breakpoints at content, not device
4. Touch-friendly targets on mobile
5. Progressive enhancement
""",
        },
        {
            "title": "Navigation Design",
            "order_index": 2,
            "xp_reward": 50,
            "estimated_minutes": 8,
            "summary": "Navigation helps users find content and understand where they are in the application.",
            "content": """# Navigation Design

## Purpose of Navigation
Navigation helps users:
1. **Find** content they're looking for
2. **Understand** where they are in the system
3. **Discover** related or new content
4. **Return** to previously visited pages

## Navigation Patterns

### Global Navigation
Persistent across all pages — usually in header or sidebar.
- **Horizontal nav bar**: 3-7 top-level items
- **Sidebar**: For apps with many sections
- **Bottom tab bar**: Mobile standard (3-5 items)

### Local Navigation
Contextual to current section.
- **Breadcrumbs**: Show location in hierarchy
- **Sub-navigation**: Tabs or secondary menus
- **In-page links**: Jump to sections

### Utility Navigation
Tools and settings, not primary content.
- Search, account, settings, notifications
- Usually placed in header corners

## Mobile Navigation Patterns

### Hamburger Menu (☰)
- Hides navigation behind an icon
- **Pros**: Clean screen, lots of room for items
- **Cons**: Discovery problem — out of sight, out of mind

### Bottom Tab Bar
- Always visible, thumb-friendly
- Limited to 3-5 items
- Best for primary navigation

### Gesture Navigation
- Swipe between sections
- Pull to refresh
- Edge swipes for back/forward

## Navigation Best Practices
1. **Keep it consistent** across all pages
2. **Show current location** with active states
3. **Use clear, descriptive labels** (not clever labels)
4. **Limit depth** — prefer flat hierarchies
5. **Provide multiple pathways** to important content
6. **Support search** as an alternative to browsing
7. **Test with real users** — navigation problems are common
""",
        },
    ],
    "Usability Evaluation": [
        {
            "title": "Usability Testing Methods",
            "order_index": 0,
            "xp_reward": 60,
            "estimated_minutes": 12,
            "summary": "Methods for evaluating how well users can use an interface, from think-aloud to A/B testing.",
            "content": """# Usability Testing Methods

## Why Test Usability?
Even experienced designers can't predict every user problem. Testing reveals:
- Unexpected user behaviors
- Confusing interface elements
- Missing features or information
- Performance bottlenecks

## Formative vs Summative Testing

### Formative Testing
- Done **during** design process
- Goal: Find and fix problems
- Qualitative methods
- Small sample sizes (5-8 users)

### Summative Testing
- Done **after** design is complete
- Goal: Measure performance
- Quantitative methods
- Larger sample sizes (20+ users)

## Key Methods

### 1. Think-Aloud Protocol
Users verbalize their thoughts while performing tasks.
- Rich qualitative data
- Reveals mental models and expectations
- Can feel unnatural for participants
- **Best for**: Early design evaluation

### 2. Task Completion Testing
Users attempt predefined tasks while observers note success, errors, and time.
- **Metrics**: Task success rate, time on task, error rate
- Structured and repeatable
- **Best for**: Comparing design alternatives

### 3. Heuristic Evaluation
Experts evaluate interface against usability principles (e.g., Nielsen's heuristics).
- Fast and inexpensive
- 3-5 evaluators find most problems
- May miss user-specific issues
- **Best for**: Quick quality checks

### 4. A/B Testing
Compare two versions with real users to see which performs better.
- Statistical rigor
- Real usage data
- Requires significant traffic
- **Best for**: Optimizing specific elements

### 5. Eye Tracking
Track where users look on the screen.
- Reveals attention patterns
- Heat maps show focus areas
- Expensive equipment
- **Best for**: Layout and visual hierarchy evaluation

### 6. System Usability Scale (SUS)
Standardized 10-question post-test questionnaire.
- Score out of 100
- Quick to administer
- Well-validated benchmark
- Average score: 68

## Planning a Usability Test
1. Define objectives
2. Recruit representative users
3. Create realistic tasks
4. Choose appropriate methods
5. Conduct the test
6. Analyze findings
7. Prioritize improvements
""",
        },
        {
            "title": "Heuristic Evaluation Deep Dive",
            "order_index": 1,
            "xp_reward": 55,
            "estimated_minutes": 10,
            "summary": "How to conduct a heuristic evaluation systematically to find usability problems.",
            "content": """# Heuristic Evaluation Deep Dive

## What is Heuristic Evaluation?

A **heuristic evaluation** is an inspection method where usability experts examine an interface and judge its compliance with recognized usability principles (heuristics).

## Process

### Step 1: Preparation
- Select 3-5 evaluators (more finds diminishing returns)
- Provide evaluators with the heuristic set
- Define the scope and scenarios to evaluate
- Prepare evaluation forms

### Step 2: Individual Evaluation
Each evaluator independently:
1. Goes through the interface at least twice
2. First pass: Get familiar with the overall flow
3. Second pass: Focus on specific elements
4. Notes each problem found with:
   - Location in the interface
   - Which heuristic is violated
   - Severity rating

### Step 3: Severity Rating
Rate each problem on a 0-4 scale:
- **0**: Not a usability problem at all
- **1**: Cosmetic problem only — fix if time allows
- **2**: Minor usability problem — low priority fix
- **3**: Major usability problem — important to fix
- **4**: Usability catastrophe — must fix before release

### Step 4: Aggregation
- Combine findings from all evaluators
- Merge duplicate findings
- Calculate average severity ratings
- Prioritize based on severity and frequency

## Strengths
- Fast and inexpensive compared to user testing
- Can be done early in design (even on prototypes)
- Finds many problems with few evaluators
- No need to recruit users

## Weaknesses
- Depends on evaluator expertise
- May find false positives (predicted problems that don't bother users)
- Misses context-specific issues
- Doesn't reveal WHY users have problems

## Tips for Better Evaluations
1. Use a consistent heuristic set
2. Evaluate individually before group discussion
3. Be specific about the problem location
4. Explain why each issue is a problem
5. Suggest potential solutions where possible
""",
        },
        {
            "title": "User Research Methods",
            "order_index": 2,
            "xp_reward": 55,
            "estimated_minutes": 10,
            "summary": "Research methods to understand user needs, behaviors, and contexts before and during design.",
            "content": """# User Research Methods

## Why User Research?
Designing without understanding users is like shooting in the dark. User research helps us:
- Understand real needs vs. assumed needs
- Discover pain points and opportunities
- Validate design decisions with data
- Build empathy with our users

## Discovery Methods

### Interviews
One-on-one conversations to explore user experiences.
- **Semi-structured**: Flexible question guide
- Ask open-ended questions: "Tell me about…"
- Listen more than talk
- 5-8 participants usually sufficient

### Surveys & Questionnaires
Collect data from many users at scale.
- **Quantitative**: Likert scales, ratings
- **Qualitative**: Open-ended responses
- Good for validation, not discovery
- Watch for bias in question wording

### Contextual Inquiry
Observe and interview users **in their natural environment**.
- Reveals workarounds and pain points
- Shows real usage vs. reported usage
- Master/apprentice model
- Time-intensive but highly valuable

### Diary Studies
Users document their experiences over time.
- Captures longitudinal patterns
- Natural context
- Requires committed participants
- Good for understanding habits and routines

## Analysis Methods

### Personas
Fictional characters representing user groups.
- Based on real research data
- Include goals, frustrations, and behaviors
- Help teams maintain user focus
- Typically 3-5 primary personas

### Journey Mapping
Visualize the user's end-to-end experience.
- Shows touchpoints and emotions
- Identifies pain points and opportunities
- Aligns teams around user experience
- Maps thoughts, actions, and feelings

### Affinity Diagrams
Group research findings into themes.
- Write findings on sticky notes
- Group by affinity (similarity)
- Identify patterns and priorities
- Collaborative team activity

## Choosing Methods
Consider:
1. **Stage**: Early exploration vs. validation
2. **Resources**: Time, budget, access to users
3. **Goals**: What decisions will the research inform?
4. **Depth vs. Breadth**: Individual insights vs. patterns
""",
        },
    ],
    "Accessibility & Inclusive Design": [
        {
            "title": "Web Accessibility Fundamentals",
            "order_index": 0,
            "xp_reward": 60,
            "estimated_minutes": 10,
            "summary": "Understanding WCAG guidelines and building interfaces that work for everyone.",
            "content": """# Web Accessibility Fundamentals

## What is Accessibility?

Web accessibility (a11y) means that websites and applications are designed and developed so that **people with disabilities** can use them. This includes people with:
- Visual impairments (blindness, low vision, color blindness)
- Hearing impairments
- Motor impairments
- Cognitive disabilities

## Why Accessibility Matters

### Legal Requirements
- ADA (Americans with Disabilities Act)
- Section 508
- EN 301 549 (European standard)
- Many countries have similar laws

### Business Benefits
- Larger potential user base (1+ billion people with disabilities)
- Better SEO (accessible sites rank better)
- Improved usability for everyone
- Legal risk reduction

## WCAG 2.1 Principles (POUR)

### 1. Perceivable
Information must be presentable to users in ways they can perceive.
- **Text alternatives**: Alt text for images
- **Captions**: For audio and video content
- **Adaptable**: Content works in different presentations
- **Distinguishable**: Sufficient contrast and spacing

### 2. Operable
UI components and navigation must be operable.
- **Keyboard accessible**: All functions available via keyboard
- **Enough time**: Users can read and use content
- **No seizures**: Avoid flashing content
- **Navigable**: Clear navigation and headings

### 3. Understandable
Information and UI operation must be understandable.
- **Readable**: Clear language and formatting
- **Predictable**: Consistent behavior
- **Input assistance**: Help prevent and correct errors

### 4. Robust
Content must be robust enough for various technologies.
- **Compatible**: Works with assistive technologies
- **Valid markup**: Proper HTML semantics
- **ARIA**: When native elements aren't sufficient

## Quick Wins
1. Add alt text to all meaningful images
2. Use semantic HTML (h1, nav, main, button)
3. Ensure 4.5:1 color contrast ratio
4. Make all interactive elements keyboard accessible
5. Use focus indicators for keyboard navigation
6. Label all form inputs properly
""",
        },
        {
            "title": "Inclusive Design Principles",
            "order_index": 1,
            "xp_reward": 55,
            "estimated_minutes": 10,
            "summary": "Designing products that consider the full range of human diversity from the start.",
            "content": """# Inclusive Design Principles

## What is Inclusive Design?

Inclusive design is a **methodology** that considers the full range of human diversity with respect to ability, language, culture, gender, age, and other forms of human difference.

It's different from accessibility:
- **Accessibility**: Compliance-focused, addresses specific barriers
- **Inclusive Design**: Methodology-focused, considers diversity from the start

## Microsoft's Inclusive Design Principles

### 1. Recognize Exclusion
Exclusion happens when we solve problems using our own biases.
- **Permanent**: A person with one arm
- **Temporary**: A person with an arm injury
- **Situational**: A parent holding a baby

Understanding the spectrum of exclusion helps design for more people.

### 2. Solve for One, Extend to Many
Designs that work for people with disabilities often benefit everyone.
- **Closed captions**: Originally for deaf users → used in noisy gyms, quiet libraries
- **Curb cuts**: Originally for wheelchair users → used by everyone with wheels
- **Voice control**: Originally for motor impairments → used while driving

### 3. Learn from Diversity
People who are excluded are experts in adaptation. Their insights drive innovation.

## Universal Design Principles

### 1. Equitable Use
Useful and marketable to people with diverse abilities.

### 2. Flexibility in Use
Accommodates a wide range of preferences and abilities.

### 3. Simple and Intuitive
Easy to understand regardless of experience, knowledge, language skills.

### 4. Perceptible Information
Communicates necessary information effectively regardless of conditions.

### 5. Tolerance for Error
Minimizes hazards and adverse consequences of accidental actions.

### 6. Low Physical Effort
Can be used efficiently and comfortably with minimal fatigue.

### 7. Size and Space for Approach and Use
Appropriate size and space regardless of user's body size or mobility.

## Applying Inclusive Design
1. Include diverse users in research
2. Use persona spectrums (permanent → temporary → situational)
3. Test with assistive technologies
4. Challenge assumptions about your users
5. Consider multiple contexts of use
""",
        },
        {
            "title": "Designing for Cognitive Diversity",
            "order_index": 2,
            "xp_reward": 55,
            "estimated_minutes": 8,
            "summary": "Designing interfaces that support users with different cognitive abilities and preferences.",
            "content": """# Designing for Cognitive Diversity

## Understanding Cognitive Diversity

Cognitive diversity encompasses differences in:
- **Attention**: Ability to focus and sustain concentration
- **Memory**: Working memory capacity and recall ability
- **Processing speed**: How quickly information is understood
- **Executive function**: Planning, organizing, switching tasks
- **Language**: Reading level, vocabulary, native language

## Common Cognitive Considerations

### Attention Difficulties (ADHD)
- Minimize distractions
- Break content into small chunks
- Use clear visual hierarchy
- Allow saving and resuming progress
- Avoid auto-playing media

### Dyslexia
- Use sans-serif fonts (OpenDyslexic, Arial)
- Left-align text (not justified)
- Use short paragraphs and bullet points
- Provide adequate line spacing (1.5+)
- Support text-to-speech

### Memory Limitations
- Don't require remembering information across screens
- Show recent items and search history
- Use recognition over recall
- Provide clear breadcrumbs and undo

### Anxiety & Stress
- Clear, predictable navigation
- Transparent processes (what happens after clicking?)
- Easy error recovery
- No time pressure unless necessary
- Calm, reassuring design

## Design Strategies

### 1. Progressive Disclosure
Show only essential information first, reveal details on demand.
- Reduces cognitive load
- Users control the pace
- Complex tasks feel manageable

### 2. Clear Information Architecture
- Logical grouping of content
- Consistent navigation
- Descriptive labels and headings
- Search as a safety net

### 3. Multimodal Content
Present information in multiple formats:
- Text + images + video
- Audio alternatives
- Interactive demonstrations
- Printable summaries

### 4. Customization Options
- Font size and family adjustments
- Color theme preferences
- Content density settings
- Notification preferences
- Reading mode / focus mode

## Key Takeaway
Designing for cognitive diversity isn't about dumbing things down — it's about **removing unnecessary barriers** so everyone can focus on what matters: the content and their tasks.
""",
        },
    ],
}

QUIZZES = {
    "What is HCI?": [
        {
            "question": "HCI stands for:",
            "options": ["Human-Computer Interaction", "High-Capacity Interface", "Hybrid Computing Intelligence", "Hardware-Connected Infrastructure"],
            "correct_answer": 0,
            "explanation": "HCI stands for Human-Computer Interaction, the study of how people interact with computers and how to design better interfaces.",
            "ai_hint": "Think about the three words: the study involves humans, computers, and how they work together.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "Which discipline is NOT typically associated with HCI?",
            "options": ["Psychology", "Computer Science", "Astrophysics", "Design"],
            "correct_answer": 2,
            "explanation": "HCI primarily draws from Computer Science, Psychology, Design, and Sociology. Astrophysics is not typically a contributing discipline.",
            "ai_hint": "Which field studies things that are far from human daily interaction with technology?",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "Understanding human perception, cognition, and motor skills relates to which aspect of HCI?",
            "options": ["System architecture", "The Human in HCI", "Network protocols", "Database design"],
            "correct_answer": 1,
            "explanation": "Understanding human capabilities and limitations — perception, cognition, and motor skills — is central to the 'Human' aspect of HCI.",
            "ai_hint": "The question asks about human characteristics. Which option directly refers to the human element?",
            "difficulty": 2,
            "xp_reward": 20,
        },
    ],
    "History of Interface Design": [
        {
            "question": "Which interface paradigm uses Windows, Icons, Menus, and Pointers?",
            "options": ["CLI", "WIMP", "NUI", "VUI"],
            "correct_answer": 1,
            "explanation": "WIMP stands for Windows, Icons, Menus, Pointers — the foundational paradigm of graphical user interfaces.",
            "ai_hint": "Look at the first letter of each word: Windows, Icons, Menus, Pointers.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "Which company's research center pioneered the Graphical User Interface?",
            "options": ["IBM Research", "Xerox PARC", "Bell Labs", "MIT Media Lab"],
            "correct_answer": 1,
            "explanation": "Xerox PARC (Palo Alto Research Center) pioneered the GUI, which was later popularized by Apple Macintosh and Microsoft Windows.",
            "ai_hint": "This research center is located in Palo Alto, California, and was part of a famous photocopier company.",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "What major change did the iPhone introduce to mainstream interfaces in 2007?",
            "options": ["Voice control", "Multi-touch interaction", "Command line", "Brain-computer interface"],
            "correct_answer": 1,
            "explanation": "The iPhone popularized multi-touch interfaces, enabling natural gesture interactions like pinch-to-zoom and swipe.",
            "ai_hint": "Think about what made the iPhone revolutionary — it was about how you physically touched the screen.",
            "difficulty": 1,
            "xp_reward": 15,
        },
    ],
    "Human Factors & Ergonomics": [
        {
            "question": "According to Fitts's Law, what two factors determine the time to reach a target?",
            "options": ["Color and shape", "Distance and size", "Speed and accuracy", "Weight and texture"],
            "correct_answer": 1,
            "explanation": "Fitts's Law states that the time to reach a target is a function of the distance to the target and the size of the target.",
            "ai_hint": "Fitts's Law involves a mathematical formula with D (distance) and W (width/size).",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "Miller's Law states that humans can hold approximately how many items in working memory?",
            "options": ["3 ± 1", "5 ± 2", "7 ± 2", "10 ± 3"],
            "correct_answer": 2,
            "explanation": "Miller's Law (1956) proposes that the average human can hold 7 ± 2 items in working memory.",
            "ai_hint": "This is one of the most famous numbers in psychology. Think of a 'magical' number that George Miller proposed.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "Which type of cognitive load is caused by poor design?",
            "options": ["Intrinsic load", "Extraneous load", "Germane load", "Structural load"],
            "correct_answer": 1,
            "explanation": "Extraneous load is caused by bad design adding unnecessary complexity, as opposed to intrinsic load (task complexity) or germane load (building understanding).",
            "ai_hint": "'Extraneous' means unnecessary or irrelevant — think about which type of load shouldn't be there.",
            "difficulty": 2,
            "xp_reward": 20,
        },
    ],
    "Gestalt Principles": [
        {
            "question": "Which Gestalt principle states that elements close together are perceived as a group?",
            "options": ["Similarity", "Proximity", "Closure", "Continuity"],
            "correct_answer": 1,
            "explanation": "The principle of Proximity states that elements that are close together are perceived as belonging to the same group.",
            "ai_hint": "'Proximity' is related to physical closeness or nearness.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "A modal dialog with a dimmed background is an example of which Gestalt principle?",
            "options": ["Proximity", "Common Fate", "Figure-Ground", "Similarity"],
            "correct_answer": 2,
            "explanation": "Figure-Ground principle: we separate the focal element (modal dialog) from its background (dimmed area behind it).",
            "ai_hint": "Think about the relationship between the dialog box (the focus) and the darkened area behind it.",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "Which principle explains why we perceive a dotted circle as a complete circle?",
            "options": ["Proximity", "Closure", "Continuity", "Figure-Ground"],
            "correct_answer": 1,
            "explanation": "Closure is the principle where our minds fill in missing information to perceive complete shapes, like seeing a circle from dots.",
            "ai_hint": "Our brain 'closes' the gaps to see a complete shape even when it's not fully drawn.",
            "difficulty": 1,
            "xp_reward": 15,
        },
    ],
    "Color Theory in Interface Design": [
        {
            "question": "Approximately what percentage of males are affected by color blindness?",
            "options": ["1%", "4%", "8%", "15%"],
            "correct_answer": 2,
            "explanation": "Color blindness affects approximately 8% of males and 0.5% of females, which is why we should never use color alone to convey information.",
            "ai_hint": "It's a single-digit percentage but surprisingly high — more common than most people think.",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "What is the minimum WCAG AA contrast ratio for normal text?",
            "options": ["2:1", "3:1", "4.5:1", "7:1"],
            "correct_answer": 2,
            "explanation": "WCAG AA requires at least 4.5:1 contrast ratio for normal text. For large text, 3:1 is sufficient, and WCAG AAA requires 7:1.",
            "ai_hint": "The standards have two levels: AA and AAA. The answer is the moderate (AA) level requirement for regular-sized text.",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "Which color is commonly associated with trust and professionalism in interface design?",
            "options": ["Red", "Green", "Blue", "Yellow"],
            "correct_answer": 2,
            "explanation": "Blue is associated with trust, calm, and professionalism, which is why it's used by companies like Facebook, LinkedIn, and many banks.",
            "ai_hint": "Think about social media and professional networking platforms — what color dominates their branding?",
            "difficulty": 1,
            "xp_reward": 15,
        },
    ],
    "Typography & Readability": [
        {
            "question": "What is the optimal line length for readability?",
            "options": ["20-30 characters", "50-75 characters", "100-120 characters", "150+ characters"],
            "correct_answer": 1,
            "explanation": "The optimal line length is 50-75 characters per line. Lines that are too long cause eye fatigue, while too-short lines disrupt reading rhythm.",
            "ai_hint": "It's a moderate range — not too short, not too long. Think about a comfortable newspaper column width.",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "What is the recommended minimum font size for body text on screens?",
            "options": ["10px", "12px", "14px", "16px"],
            "correct_answer": 3,
            "explanation": "The minimum recommended font size for body text on screens is 16px. For mobile, some experts recommend 18px or larger.",
            "ai_hint": "Modern web design standards have moved away from the old default of 12px. The current recommendation is notably larger.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "What line height is recommended for body text?",
            "options": ["1.0× font size", "1.2× font size", "1.5-1.7× font size", "2.5× font size"],
            "correct_answer": 2,
            "explanation": "Body text should have a line height of 1.5-1.7× the font size for optimal readability. Headlines can use tighter spacing at 1.2-1.3×.",
            "ai_hint": "Not too tight, not too loose. The optimal reading experience needs breathing room between lines.",
            "difficulty": 2,
            "xp_reward": 20,
        },
    ],
    "Direct Manipulation": [
        {
            "question": "Who coined the term 'direct manipulation' in HCI?",
            "options": ["Jakob Nielsen", "Don Norman", "Ben Shneiderman", "Alan Cooper"],
            "correct_answer": 2,
            "explanation": "Ben Shneiderman coined the term 'direct manipulation' in 1983 to describe interfaces where users act on visible objects using physical actions.",
            "ai_hint": "He's a professor at the University of Maryland, and he also invented treemaps for data visualization.",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "Which is NOT a core principle of direct manipulation?",
            "options": ["Continuous representation of objects", "Physical actions instead of syntax", "Batch processing of commands", "Rapid, reversible actions"],
            "correct_answer": 2,
            "explanation": "Batch processing is the opposite of direct manipulation. Direct manipulation emphasizes continuous, real-time interaction with visible objects.",
            "ai_hint": "Direct manipulation is about immediate, hands-on interaction. Which option describes a delayed, non-interactive process?",
            "difficulty": 1,
            "xp_reward": 15,
        },
    ],
    "Input Methods & Modalities": [
        {
            "question": "What is the minimum recommended touch target size according to Apple's guidelines?",
            "options": ["24×24 points", "32×32 points", "44×44 points", "64×64 points"],
            "correct_answer": 2,
            "explanation": "Apple recommends a minimum touch target of 44×44 points. Android recommends 48×48 dp. This prevents the 'fat finger' problem.",
            "ai_hint": "Apple tends to have a specific number. It's larger than a typical small icon but reasonable for a tappable area.",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "What does multimodal interaction mean?",
            "options": ["Using one input at a time", "Combining multiple input methods", "Using only touch input", "Keyboard-only interaction"],
            "correct_answer": 1,
            "explanation": "Multimodal interaction means combining multiple input methods (e.g., voice + touch, gesture + gaze) to create richer interaction experiences.",
            "ai_hint": "'Multi' means many, and 'modal' relates to modes/methods. What does combining them suggest?",
            "difficulty": 1,
            "xp_reward": 15,
        },
    ],
    "Feedback & Response Time": [
        {
            "question": "According to Nielsen, what response time feels 'instantaneous' to users?",
            "options": ["0.01 second", "0.1 second", "1 second", "3 seconds"],
            "correct_answer": 1,
            "explanation": "Jakob Nielsen's research shows that 0.1 second feels instantaneous. At 1 second, users notice the delay. At 10 seconds, attention is lost.",
            "ai_hint": "It's a fraction of a second — fast enough that users don't perceive any delay at all.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "Which loading strategy generally feels fastest to users?",
            "options": ["Blank screen", "Spinning loader", "Skeleton screen", "Text message 'Loading...'"],
            "correct_answer": 2,
            "explanation": "Skeleton screens (placeholder shapes showing the page layout) feel faster than spinners because they show progressive content.",
            "ai_hint": "Think about which approach gives the user the most visual information about what's coming, even before content loads.",
            "difficulty": 2,
            "xp_reward": 20,
        },
    ],
    "Design Principles & Heuristics": [
        {
            "question": "How many usability heuristics are in Nielsen's original set?",
            "options": ["5", "8", "10", "12"],
            "correct_answer": 2,
            "explanation": "Nielsen's heuristics consist of 10 general principles for interaction design, published in 1994.",
            "ai_hint": "It's a round number that's commonly used as a 'top list' in many contexts.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "Which heuristic suggests providing 'undo' functionality?",
            "options": ["Visibility of system status", "User control and freedom", "Error prevention", "Aesthetic and minimalist design"],
            "correct_answer": 1,
            "explanation": "Heuristic #3 'User Control and Freedom' says users need a clearly marked emergency exit — undo/redo and cancel buttons.",
            "ai_hint": "Which option most directly relates to giving users the ability to reverse their actions?",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "The principle of 'Recognition rather than recall' means:",
            "options": [
                "Users should memorize keyboard shortcuts",
                "Make elements visible so users don't need to remember",
                "Use only text, never icons",
                "Require passwords for every action",
            ],
            "correct_answer": 1,
            "explanation": "This heuristic (#6) says to minimize memory load by making elements, actions, and options visible rather than requiring users to remember them.",
            "ai_hint": "Recognition = seeing and identifying. Recall = remembering from memory. Which option reduces memory load?",
            "difficulty": 2,
            "xp_reward": 20,
        },
    ],
    "Layout & Visual Hierarchy": [
        {
            "question": "In left-to-right languages, which scanning pattern do users commonly follow on content-heavy pages?",
            "options": ["Z-pattern", "F-pattern", "O-pattern", "X-pattern"],
            "correct_answer": 1,
            "explanation": "The F-pattern is common for content-heavy pages: users scan horizontally across the top, then move down and scan a shorter horizontal area, creating an F shape.",
            "ai_hint": "Think about how people scan text-heavy pages — they read the top, lose interest, and start skimming down the left side.",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "What spacing system is commonly used in modern UI design for consistency?",
            "options": ["5-point grid", "8-point grid", "12-point grid", "Random spacing"],
            "correct_answer": 1,
            "explanation": "The 8-point grid system (spacing in multiples of 8: 8, 16, 24, 32px) is widely used for consistent spacing in modern UI design.",
            "ai_hint": "It's a grid system where all spacing is a multiple of a single base unit. The base unit is between 5 and 10.",
            "difficulty": 2,
            "xp_reward": 20,
        },
    ],
    "Navigation Design": [
        {
            "question": "What is the main drawback of the hamburger menu (☰)?",
            "options": ["It's ugly", "It takes too much screen space", "Items are hidden, reducing discoverability", "It only works on desktop"],
            "correct_answer": 2,
            "explanation": "The hamburger menu hides navigation items, creating a discovery problem — 'out of sight, out of mind.' Users may not know what options are available.",
            "ai_hint": "Think about what happens when navigation options are not visible to the user by default.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "How many items are recommended for a mobile bottom tab bar?",
            "options": ["1-2", "3-5", "6-8", "10+"],
            "correct_answer": 1,
            "explanation": "A bottom tab bar should have 3-5 items for primary navigation. Too many items make targets too small and overwhelm users.",
            "ai_hint": "It's a small range that ensures items are large enough to tap comfortably while covering main sections.",
            "difficulty": 1,
            "xp_reward": 15,
        },
    ],
    "Usability Testing Methods": [
        {
            "question": "How many users are typically needed for think-aloud usability testing to find most problems?",
            "options": ["1-2", "5-8", "20-30", "100+"],
            "correct_answer": 1,
            "explanation": "Research by Jakob Nielsen shows that 5 users find approximately 85% of usability problems. 5-8 users are typically sufficient for formative testing.",
            "ai_hint": "It's a surprisingly small number. Jakob Nielsen is famous for showing that you don't need many users to find most issues.",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "What is the average score on the System Usability Scale (SUS)?",
            "options": ["50", "68", "80", "95"],
            "correct_answer": 1,
            "explanation": "The average SUS score is 68 out of 100. A score above 68 is above average usability. The score is calculated from 10 Likert-scale questions.",
            "ai_hint": "Think of it as roughly equivalent to a 'C+' grade  — the average isn't particularly high.",
            "difficulty": 2,
            "xp_reward": 20,
        },
    ],
    "Heuristic Evaluation Deep Dive": [
        {
            "question": "How many evaluators are recommended for a heuristic evaluation?",
            "options": ["1", "3-5", "10-15", "20+"],
            "correct_answer": 1,
            "explanation": "3-5 evaluators is the recommended range. More evaluators have diminishing returns, as the first few find most of the problems.",
            "ai_hint": "There's a sweet spot — too few miss problems, too many adds cost without finding much more. It's a small team.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "In heuristic evaluation, a severity rating of '4' means:",
            "options": ["Cosmetic issue", "Minor problem", "Major problem", "Usability catastrophe"],
            "correct_answer": 3,
            "explanation": "On the 0-4 severity scale: 0=Not a problem, 1=Cosmetic, 2=Minor, 3=Major, 4=Usability catastrophe that must be fixed before release.",
            "ai_hint": "4 is the highest (worst) rating on the scale. What term would describe the most critical level?",
            "difficulty": 1,
            "xp_reward": 15,
        },
    ],
    "User Research Methods": [
        {
            "question": "Which research method involves observing users in their natural environment?",
            "options": ["Survey", "A/B Testing", "Contextual Inquiry", "Card Sorting"],
            "correct_answer": 2,
            "explanation": "Contextual Inquiry involves observing and interviewing users in their natural work environment to understand real behavior and workarounds.",
            "ai_hint": "'Contextual' means in the context/environment where the activity naturally occurs.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "Personas in UX research are:",
            "options": [
                "Real user profiles with personal data",
                "Fictional characters based on research data",
                "Random demographic profiles",
                "Customer service scripts",
            ],
            "correct_answer": 1,
            "explanation": "Personas are fictional but research-based character profiles representing key user groups, including goals, frustrations, and behaviors.",
            "ai_hint": "They're not real people, but they're not made up randomly either. They're based on actual user research.",
            "difficulty": 1,
            "xp_reward": 15,
        },
    ],
    "Web Accessibility Fundamentals": [
        {
            "question": "What does WCAG stand for?",
            "options": [
                "Web Content Accessibility Guidelines",
                "Website Coding and Graphics",
                "World Computer Access Group",
                "Web Compatibility Assessment Guide",
            ],
            "correct_answer": 0,
            "explanation": "WCAG stands for Web Content Accessibility Guidelines, the international standard for web accessibility published by W3C.",
            "ai_hint": "It's the main international standard published by W3C. Each word starts with W, C, A, G respectively.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "The POUR principles in WCAG stand for:",
            "options": [
                "Practical, Observable, Usable, Reliable",
                "Perceivable, Operable, Understandable, Robust",
                "Performant, Open, Universal, Responsive",
                "Portable, Optimized, Unified, Readable",
            ],
            "correct_answer": 1,
            "explanation": "POUR stands for Perceivable, Operable, Understandable, and Robust — the four foundational principles of WCAG.",
            "ai_hint": "These four principles cover: can users sense it? can they use it? can they understand it? does it work with different technologies?",
            "difficulty": 2,
            "xp_reward": 20,
        },
    ],
    "Inclusive Design Principles": [
        {
            "question": "The concept 'solve for one, extend to many' means:",
            "options": [
                "Make one product for all users",
                "Solutions for disabled users benefit everyone",
                "Focus on one user at a time",
                "Only serve the majority",
            ],
            "correct_answer": 1,
            "explanation": "Designs for people with disabilities often benefit everyone. Closed captions help deaf users but also people in noisy/quiet environments.",
            "ai_hint": "Think about curb cuts on sidewalks — designed for wheelchairs but used by everyone with strollers, bikes, and luggage.",
            "difficulty": 2,
            "xp_reward": 20,
        },
        {
            "question": "A parent holding a baby who can only use one hand is an example of:",
            "options": ["Permanent disability", "Temporary disability", "Situational disability", "No disability"],
            "correct_answer": 2,
            "explanation": "A parent holding a baby has a situational disability (one-handed use). The spectrum: permanent (one arm), temporary (arm injury), situational (holding baby).",
            "ai_hint": "The disability spectrum has three levels. The parent's limitation is caused by their current situation, not a lasting condition.",
            "difficulty": 1,
            "xp_reward": 15,
        },
    ],
    "Designing for Cognitive Diversity": [
        {
            "question": "Progressive disclosure means:",
            "options": [
                "Showing all information at once",
                "Revealing information gradually as needed",
                "Hiding all features",
                "Only showing text, no images",
            ],
            "correct_answer": 1,
            "explanation": "Progressive disclosure shows only essential information first and reveals more details on demand, reducing cognitive load.",
            "ai_hint": "'Progressive' suggests a gradual process. Think about showing things step by step.",
            "difficulty": 1,
            "xp_reward": 15,
        },
        {
            "question": "For users with dyslexia, which font style is generally recommended?",
            "options": ["Serif fonts", "Sans-serif fonts", "Script fonts", "Decorative fonts"],
            "correct_answer": 1,
            "explanation": "Sans-serif fonts (like Arial, Verdana, or OpenDyslexic) are generally easier to read for people with dyslexia.",
            "ai_hint": "Simpler, cleaner letter forms without extra decorations are easier to distinguish for people with reading difficulties.",
            "difficulty": 1,
            "xp_reward": 15,
        },
    ],
}

ACHIEVEMENTS = [
    {
        "name": "First Steps",
        "description": "Complete your first lesson",
        "icon": "footprints",
        "badge_color": "#10b981",
        "xp_reward": 50,
        "condition_type": "lessons_completed",
        "condition_value": 1,
    },
    {
        "name": "Knowledge Seeker",
        "description": "Complete 5 lessons",
        "icon": "book-open",
        "badge_color": "#6366f1",
        "xp_reward": 100,
        "condition_type": "lessons_completed",
        "condition_value": 5,
    },
    {
        "name": "Scholar",
        "description": "Complete 10 lessons",
        "icon": "graduation-cap",
        "badge_color": "#8b5cf6",
        "xp_reward": 200,
        "condition_type": "lessons_completed",
        "condition_value": 10,
    },
    {
        "name": "HCI Master",
        "description": "Complete all 18 lessons",
        "icon": "crown",
        "badge_color": "#f59e0b",
        "xp_reward": 500,
        "condition_type": "lessons_completed",
        "condition_value": 18,
    },
    {
        "name": "Quiz Rookie",
        "description": "Answer your first quiz correctly",
        "icon": "check-circle",
        "badge_color": "#10b981",
        "xp_reward": 30,
        "condition_type": "quizzes_correct",
        "condition_value": 1,
    },
    {
        "name": "Quiz Pro",
        "description": "Answer 10 quizzes correctly",
        "icon": "target",
        "badge_color": "#ec4899",
        "xp_reward": 150,
        "condition_type": "quizzes_correct",
        "condition_value": 10,
    },
    {
        "name": "Perfect Score",
        "description": "Get 100% on a lesson quiz",
        "icon": "star",
        "badge_color": "#f59e0b",
        "xp_reward": 100,
        "condition_type": "perfect_quiz",
        "condition_value": 1,
    },
    {
        "name": "Streak Starter",
        "description": "Study for 3 days in a row",
        "icon": "flame",
        "badge_color": "#ef4444",
        "xp_reward": 75,
        "condition_type": "streak_days",
        "condition_value": 3,
    },
    {
        "name": "Dedicated Learner",
        "description": "Study for 7 days in a row",
        "icon": "flame",
        "badge_color": "#f97316",
        "xp_reward": 200,
        "condition_type": "streak_days",
        "condition_value": 7,
    },
    {
        "name": "XP Hunter",
        "description": "Earn 500 XP total",
        "icon": "zap",
        "badge_color": "#eab308",
        "xp_reward": 50,
        "condition_type": "total_xp",
        "condition_value": 500,
    },
    {
        "name": "XP Champion",
        "description": "Earn 2000 XP total",
        "icon": "trophy",
        "badge_color": "#f59e0b",
        "xp_reward": 200,
        "condition_type": "total_xp",
        "condition_value": 2000,
    },
    {
        "name": "AI Explorer",
        "description": "Complete 5 quizzes with AI assistance",
        "icon": "cpu",
        "badge_color": "#6366f1",
        "xp_reward": 75,
        "condition_type": "ai_quizzes",
        "condition_value": 5,
    },
    {
        "name": "Self Reliant",
        "description": "Complete 5 quizzes without AI assistance",
        "icon": "shield",
        "badge_color": "#10b981",
        "xp_reward": 75,
        "condition_type": "non_ai_quizzes",
        "condition_value": 5,
    },
    {
        "name": "Speed Learner",
        "description": "Complete a quiz in under 30 seconds",
        "icon": "clock",
        "badge_color": "#06b6d4",
        "xp_reward": 50,
        "condition_type": "fast_quiz",
        "condition_value": 30,
    },
]
