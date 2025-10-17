# Qwirl Application Documentation

## Application Overview

Qwirl is a social discovery application that allows users to create interactive polls (called "Qwirls") to help others understand who they are. Users answer these polls to discover their "wavelength" - a compatibility score indicating how aligned they are with the Qwirl creator.

**Core Concept:**

- A Qwirl = 15 polls that define a person
- Users answer someone's Qwirl to discover their wavelength/compatibility
- Higher wavelength = more similar thinking, beliefs, and preferences

---

## Pages Documentation

### 1. Qwirl Edit Page

**Route:** `/qwirls/primary/edit`

**Description:**  
The primary editor where users build and customize their main Qwirl. This is the central workspace for creating the 15 polls that define the user's identity, beliefs, and preferences.

**Intended User Goal:**  
Create a complete, personalized Qwirl with 15 unique polls that accurately represent who they are, what they believe, and what matters to them.

---

#### Available Features

##### 1.1 Qwirl Cover Editor

**Description:**  
Customizable header section displaying the Qwirl's visual identity and metadata.

**Actions:**

- Edit title (max 60 characters)
- Edit description (10-200 characters)
- Upload/change background image
- Remove background image
- Copy Qwirl URL to clipboard

**Intended User Goal:**  
Create an engaging first impression that entices others to take their Qwirl and clearly communicates what the Qwirl is about.

---

##### 1.2 Poll List (Vertical Edit View)

**Description:**  
Sortable, editable list of all polls in the Qwirl. Shows question text, all options, owner's answer, and poll position.

**Actions:**

- Reorder polls via drag-and-drop
- Delete individual polls
- View poll details (question, options, owner answer, position)

**Intended User Goal:**  
Organize polls in a logical flow and remove any polls that no longer fit their identity or goals.

---

##### 1.3 Add Poll Dialog

**Description:**  
Multi-step modal for creating new polls through two methods: browsing a question bank or creating custom questions.

**Actions:**

- Browse question bank by categories
- Search questions in bank
- Select questions from bank
- Create custom questions
- Edit question text
- Add/remove options (2-6 options)
- Select owner's answer
- Submit poll to Qwirl

**Intended User Goal:**  
Quickly add relevant, thought-provoking polls either from curated questions or custom-created ones that authentically represent their identity.

---

##### 1.4 Poll Progress Card (Sidebar)

**Description:**  
Visual tracker showing completion status toward the 15-poll minimum requirement.

**Actions:**

- View current poll count
- See progress percentage
- Check if Qwirl is ready for responses

**Intended User Goal:**  
Understand how close they are to completing their Qwirl and when others can start responding.

---

##### 1.5 Visibility Toggle Card (Sidebar)

**Description:**  
Control whether the Qwirl is publicly accessible or private.

**Actions:**

- Toggle visibility on/off (only available when 15+ polls exist)
- View visibility status
- See warning if minimum polls not met

**Intended User Goal:**  
Control when their Qwirl goes live and ensure it's only public when they're satisfied with the content.

---

##### 1.6 Quick Actions Card (Sidebar)

**Description:**  
Shortcuts to common actions and sharing functionality.

**Actions:**

- Copy Qwirl URL
- Navigate to preview
- Navigate to responses page
- Navigate to analytics
- Access question bank

**Intended User Goal:**  
Quickly access related pages and share their Qwirl without navigating through multiple menus.

---

##### 1.7 Tips & Guide Card (Sidebar)

**Description:**  
Contextual help and best practices for creating effective Qwirls.

**Actions:**

- View creation tips
- Learn best practices
- Understand Qwirl guidelines

**Intended User Goal:**  
Create higher-quality, more engaging Qwirls that lead to better responses and more accurate wavelength calculations.

---

### 2. Analytics Page

**Route:** `/qwirls/primary/analytics`

**Description:**  
Comprehensive analytics dashboard for viewing response distributions, comparing specific responders' answers, and analyzing how others have engaged with your Qwirl polls.

**Intended User Goal:**  
Understand how people respond to their Qwirl, identify patterns in answers, compare responses from specific individuals, and gain insights into compatibility with different responders.

---

#### Available Features

##### 2.1 Responder Selector

**Description:**  
Dropdown to select one or multiple completed responders to view their individual answers overlaid on the poll statistics.

**Actions:**

- Select responders from dropdown
- View selected responder badges
- Remove selected responders via close button
- Auto-select responder from URL parameter (deep linking)

**Intended User Goal:**  
Focus analysis on specific individuals to see exactly how they answered each poll and compare their responses to overall statistics.

---

##### 2.2 Poll Navigation Controls

**Description:**  
Controls for browsing through polls sequentially and managing poll order.

**Actions:**

- Navigate to previous/next poll (buttons or arrow keys)
- Move poll up/down in order
- Delete current poll
- View current position (e.g., "Poll 3 of 15")

**Intended User Goal:**  
Quickly browse through all polls to analyze responses, reorganize polls if needed, and remove underperforming or irrelevant polls.

---

##### 2.3 Poll Options Distribution

**Description:**  
Visual breakdown showing each poll option with percentage bars, total response counts, and badges for selected responders who chose that option.

**Actions:**

- View percentage distribution for each option
- See which selected responders chose each option (via user badges)
- Identify owner's answer (marked with "You" badge)

**Intended User Goal:**  
Understand which options are most popular, see at a glance where selected responders agree/disagree with the owner, and identify consensus or divisive questions.

---

##### 2.4 Responder Status Indicators

**Description:**  
Shows which selected responders skipped the current poll or haven't answered it yet.

**Actions:**

- View list of responders who skipped (with user badges)
- View list of responders who haven't reached this poll yet

**Intended User Goal:**  
Understand completion patterns and identify which polls people tend to skip or haven't reached.

---

##### 2.5 Poll Statistics Summary

**Description:**  
Displays aggregate metrics for the current poll.

**Actions:**

- View total response count
- View total comment count

**Intended User Goal:**  
Quickly assess engagement level for each poll without scrolling or opening additional views.

---

##### 2.6 Comments Section

**Description:**  
Displays all comments left by responders on the current poll, with user avatars, names, and timestamps.

**Actions:**

- View responder comments
- See commenter avatar and name
- View relative timestamps ("2 hours ago")
- Scroll through multiple comments

**Intended User Goal:**  
Read detailed thoughts and context from responders about why they chose certain answers or their perspective on the question.

---

##### 2.7 Navigation Dots

**Description:**  
Visual indicator showing all polls with dot navigation for quick jumping.

**Actions:**

- Click dots to jump to specific polls
- See current poll highlighted

**Intended User Goal:**  
Quickly navigate to specific polls without sequential browsing, useful when analyzing favorite or problematic questions.

---

##### 2.8 Qwirl Stats Summary Card (Sidebar)

**Description:**  
High-level overview of overall Qwirl performance and engagement metrics.

**Actions:**

- View total responses/sessions
- View completion rate
- View average wavelength
- Refresh statistics

**Intended User Goal:**  
Get a quick snapshot of how well the Qwirl is performing overall without diving into individual poll details.

---

##### 2.9 Poll Progress Card (Sidebar)

**Description:**  
Same as Edit page - shows poll count and completion status.

**Actions:**

- View current poll count
- See progress toward 15-poll minimum

**Intended User Goal:**  
Monitor poll count while analyzing responses to ensure Qwirl remains complete.

---

##### 2.10 Quick Actions Card (Sidebar)

**Description:**  
Shortcuts to related pages and actions.

**Actions:**

- Copy Qwirl URL
- Navigate to Edit page
- Navigate to Responses page
- Access question bank

**Intended User Goal:**  
Quickly switch between analytics, editing, and sharing without navigating menus.

---

### 3. Responses Page

**Route:** `/qwirls/primary/responses`

**Description:**  
Overview page displaying all users who have started or completed the Qwirl, with status indicators, progress tracking, and quick navigation to detailed analytics for each responder.

**Intended User Goal:**  
Get a high-level view of who has engaged with their Qwirl, monitor completion rates, and quickly access detailed analysis for specific responders.

---

#### Available Features

##### 3.1 Stats Header

**Description:**  
Top-level metrics showing total response activity and completion status.

**Actions:**

- View total response count
- View completed response count
- Monitor engagement at a glance

**Intended User Goal:**  
Quickly assess overall Qwirl performance and engagement levels without scrolling.

---

##### 3.2 Responder Cards List

**Description:**  
Scrollable list of cards showing each person who has responded to the Qwirl, with rich status information and progress indicators.

**Actions:**

- View responder avatar, name, and username
- See response count (X of 15 answered)
- View start timestamp ("Started 2 hours ago")
- View completion timestamp (if completed)
- See completion percentage (0-100%)
- Click completed cards to view detailed analytics
- Identify status via color-coded icons (completed/in-progress/abandoned)

**Intended User Goal:**  
See who has taken their Qwirl at a glance, identify completion status, and navigate to detailed analytics for completed responders.

---

##### 3.3 Status Indicators

**Description:**  
Visual badges and icons showing responder progress status.

**Status Types:**

- **Completed** (green) - Finished all polls, clickable for analytics
- **In Progress** (amber) - Started but not finished, non-clickable
- **Abandoned** (red) - Inactive for extended period, non-clickable

**Actions:**

- Identify status via icon and color
- See visual differentiation (completed cards have full opacity, others dimmed)

**Intended User Goal:**  
Quickly distinguish between completed and incomplete responses to focus on actionable data.

---

##### 3.4 Empty State

**Description:**  
Placeholder message when no one has responded yet.

**Actions:**

- View encouraging message
- See call-to-action to share Qwirl

**Intended User Goal:**  
Understand that responses will appear here and be motivated to share their Qwirl.

---

##### 3.5 Error State

**Description:**  
Error handling display when response data fails to load.

**Actions:**

- View error message
- Retry loading via "Try Again" button

**Intended User Goal:**  
Recover from temporary errors and successfully load their response data.

---

##### 3.6 Loading State

**Description:**  
Skeleton loaders while fetching responder data.

**Actions:**

- View animated placeholders
- Wait for data to load

**Intended User Goal:**  
Understand the page is loading and data is being fetched.

---

##### 3.7 Click-to-Analytics Navigation

**Description:**  
Completed responder cards are clickable and navigate to Analytics page with pre-selected responder.

**Actions:**

- Click completed card
- Navigate to Analytics with responder auto-selected
- View that specific responder's answers

**Intended User Goal:**  
Seamlessly transition from overview to detailed analysis for specific individuals without manual selection.

---

### 4. Community Page (Discover)

**Route:** `/community`

**Description:**  
Public discovery page where users can browse, search, and filter through all publicly visible Qwirls from the community. Features infinite scroll, multiple sorting options, and type filtering.

**Intended User Goal:**  
Discover interesting Qwirls from other users, find people with similar interests, explore diverse perspectives, and decide which Qwirls to respond to based on creator profiles and descriptions.

---

#### Available Features

##### 4.1 Search Bar

**Description:**  
Real-time search input for filtering Qwirls by keywords.

**Actions:**

- Type search query (searches qwirls, creators, tags)
- Clear search to reset
- See results update automatically

**Intended User Goal:**  
Quickly find specific Qwirls or creators without scrolling through the entire community feed.

---

##### 4.2 Sort Filter

**Description:**  
Dropdown menu to change how Qwirls are ordered in the grid.

**Sort Options:**

- **Most Recent** - Newest Qwirls first
- **Most Popular** - Highest response counts
- **Trending** - Currently gaining traction
- **A-Z** - Alphabetical by title/username

**Actions:**

- Select sort method
- See grid reorganize immediately

**Intended User Goal:**  
Browse Qwirls in the order most relevant to their interests (new content vs proven popular content).

---

##### 4.3 Type Filter

**Description:**  
Dropdown to filter Qwirls by their classification.

**Type Options:**

- **All Types** - Show everything
- **Profile** - Primary/identity Qwirls
- **Public** - Custom public Qwirls

**Actions:**

- Select type filter
- See results filtered immediately

**Intended User Goal:**  
Focus on specific types of Qwirls (personal identity vs topical/custom content).

---

##### 4.4 Qwirl Grid

**Description:**  
Responsive grid layout displaying Qwirl cover cards with creator information, descriptions, and category tags.

**Actions:**

- View Qwirl cover image, title, description
- See creator avatar, name, username
- View category tags
- See poll count
- Click card to navigate to Qwirl respond page
- Identify own Qwirl with "See Results" button

**Intended User Goal:**  
Browse visually appealing Qwirls, get a quick sense of what each is about, and click to engage with ones that resonate.

---

##### 4.5 Infinite Scroll

**Description:**  
Automatic loading of additional Qwirls as user scrolls down the page.

**Actions:**

- Scroll to bottom of page
- See loading skeletons appear
- New Qwirls load automatically
- Continue browsing seamlessly

**Intended User Goal:**  
Explore unlimited Qwirls without manual pagination, creating an engaging browsing experience.

---

##### 4.6 Empty State

**Description:**  
Message displayed when no Qwirls match current filters/search.

**Actions:**

- View "No qwirls found" message
- See suggestion to adjust filters

**Intended User Goal:**  
Understand why results are empty and know how to modify search to find content.

---

##### 4.7 Loading States

**Description:**  
Skeleton loaders during initial load and infinite scroll.

**Actions:**

- View animated skeleton cards
- See loading indicator for next page

**Intended User Goal:**  
Understand content is loading and maintain visual consistency during data fetching.

---

##### 4.8 Card Variants

**Description:**  
Different button states based on ownership.

**Variants:**

- **Owner** - Shows "See Results" button (navigates to their analytics)
- **Visitor** - Shows "Answer" button (navigates to respond page)

**Actions:**

- Click to either respond or view results (depending on ownership)

**Intended User Goal:**  
Clearly understand whether they're viewing their own Qwirl or someone else's, with appropriate actions.

---

### 5. Question Bank Page

**Route:** `/question-bank`

**Description:**  
Public browsable library of curated questions organized by categories. Authenticated users can select questions to add to their Qwirl cart for later bulk addition to their Qwirl. Features search, category filtering, infinite scroll, and a surprise/random discovery button.

**Intended User Goal:**  
Discover thought-provoking, well-crafted questions to add to their Qwirl instead of creating everything from scratch. Save time while maintaining quality and finding questions they wouldn't have thought of themselves.

---

#### Available Features

##### 5.1 Search Bar

**Description:**  
Real-time search input for finding questions by keywords or themes.

**Actions:**

- Type search query (searches question text, tags, categories)
- Clear search to reset
- See debounced results (300ms delay)

**Intended User Goal:**  
Quickly find questions on specific topics or containing specific keywords without browsing entire categories.

---

##### 5.2 Category Filter

**Description:**  
Dropdown menu to filter questions by predefined categories.

**Categories:**

- All Categories (default)
- Food and Beverages
- Future and Imagination
- Nature and Environment
- Personal Preferences
- Philosophy and Soul
- Pop Culture and Entertainment
- Relationships and Social Life
- Sports and Games
- Technology and Trends
- Travel and Exploration

**Actions:**

- Select category from dropdown
- See results filtered immediately
- Combine with search for precise filtering

**Intended User Goal:**  
Browse questions within specific life domains to find relevant content for their Qwirl theme.

---

##### 5.3 Surprise Me Button

**Description:**  
Random discovery button that selects a random category to explore.

**Actions:**

- Click shuffle icon button
- See results change to random category
- Discover unexpected questions

**Intended User Goal:**  
Break out of mental ruts, discover categories they wouldn't normally explore, and add variety to their Qwirl.

---

##### 5.4 Question Cards Grid

**Description:**  
Responsive grid displaying question cards with full question text, all options, tags, and selection controls.

**Actions:**

- View question text
- See all answer options (with option numbers)
- View associated tags
- Read category information
- Select/deselect questions (authenticated users only)

**Intended User Goal:**  
Browse questions in detail, understand what answers are available, and select ones that resonate for their Qwirl.

---

##### 5.5 Question Selection System

**Description:**  
Add/remove questions to a cart for batch addition to Qwirl. Maximum 15 selections (Qwirl limit).

**Actions:**

- Click "Select Question" button
- See button change to "Selected" with checkmark
- Click "Selected" to deselect
- View "Limit Reached" when 15 selected
- See selection persist across navigation

**Intended User Goal:**  
Curate a collection of questions while browsing, then add them all at once rather than adding one-by-one.

---

##### 5.6 Qwirl Cart Button

**Description:**  
Floating shopping cart button showing selection count badge.

**Actions:**

- View current selection count (e.g., "5" in badge)
- Click to open cart modal
- See badge update as selections change

**Intended User Goal:**  
Always know how many questions they've selected and easily access the cart to review or finalize selections.

---

##### 5.7 Qwirl Selection Modal

**Description:**  
Modal displaying all selected questions with drag-to-reorder, editing capabilities, and bulk add functionality.

**Actions:**

- View all selected questions in list
- Reorder questions via drag-and-drop
- Edit question text and options inline
- Change selected answer
- Remove individual questions
- Clear all selections
- Add all to Qwirl with one button

**Intended User Goal:**  
Review, customize, and organize selected questions before committing them to their Qwirl, ensuring quality and flow.

---

##### 5.8 Infinite Scroll

**Description:**  
Automatic loading of additional questions as user scrolls down.

**Actions:**

- Scroll to bottom of page
- See loading skeletons appear
- New questions load automatically (12 per page)

**Intended User Goal:**  
Explore unlimited questions without manual pagination, maintaining browsing flow.

---

##### 5.9 Empty State

**Description:**  
Message when no questions match search/filter criteria.

**Actions:**

- View "No questions found" message
- See suggestion to adjust search
- Click "Clear Search" button

**Intended User Goal:**  
Understand why results are empty and how to modify search to find content.

---

##### 5.10 Loading States

**Description:**  
Skeleton loaders during initial load and infinite scroll.

**Actions:**

- View animated skeleton cards
- See loading indicator for next page

**Intended User Goal:**  
Understand content is loading and maintain visual consistency during data fetching.

---

##### 5.11 Authentication-Based Features

**Description:**  
Selection functionality only available to authenticated users.

**Variants:**

- **Authenticated** - Shows selection buttons, cart button, can select questions
- **Guest** - No selection buttons, browse-only mode

**Actions:**

- Sign in to enable selection features
- Browse questions without authentication

**Intended User Goal:**  
Understand that selection requires an account while still allowing guest exploration.

---

### 6. Qwirl Respond Page (Interactive Experience)

**Route:** `/qwirl/[username]`

**Description:**  
The interactive poll-answering experience where users respond to someone's Qwirl one poll at a time. Features smooth animations, progress tracking, skip functionality, optional comments, and a completion screen showing wavelength compatibility. This is the core experience that generates wavelength scores between users.

**Intended User Goal:**  
Answer someone's Qwirl to discover their wavelength/compatibility score, understand the other person's perspectives, and share thoughts through optional comments while having an engaging, game-like experience.

---

#### Available Features

##### 6.1 Landing Cover Screen

**Description:**  
Initial screen displaying Qwirl cover with creator information before starting the experience.

**Actions:**

- View Qwirl cover image, title, description
- See creator avatar, name, username, categories
- View total poll count
- Click "Answer Qwirl" to begin (authenticated visitors)
- Click "Sign In" to authenticate (guests)
- Click "See Results" to view analytics (owner)
- Click "Notify Me" for incomplete Qwirls (<15 polls)

**Intended User Goal:**  
Get context about what the Qwirl is about, who created it, and decide whether to invest time answering it.

---

##### 6.2 Interactive Poll Card

**Description:**  
Main answering interface showing one poll at a time with question and clickable options.

**Actions:**

- Read poll question
- View all answer options (2-6 options)
- Click option to select answer
- See immediate visual feedback on selection
- Navigate between polls after answering

**Intended User Goal:**  
Answer polls thoughtfully one at a time without distraction, maintaining focus on each question.

---

##### 6.3 Progress Indicators

**Description:**  
Visual feedback showing position within the Qwirl and overall progress.

**Components:**

- **Progress Bar** - Horizontal bar filling as polls are answered
- **Position Counter** - "5/15" badge showing current position
- **Skip Counter** - Shows remaining skips (5 max)

**Actions:**

- Monitor progress at a glance
- See current poll number
- Track remaining skips

**Intended User Goal:**  
Understand how far through the Qwirl they are and how many skips remain without losing flow.

---

##### 6.4 Skip Functionality

**Description:**  
Ability to skip up to 5 polls when unsure or uninterested in answering.

**Actions:**

- Click "Skip" button to skip current poll
- See skip counter decrease
- See "Skipped" badge on current poll
- View skipped questions in review mode

**Intended User Goal:**  
Maintain momentum without getting stuck on difficult or irrelevant questions, while still completing most of the Qwirl.

---

##### 6.5 Answer Status Badges

**Description:**  
Visual indicators showing whether current poll has been answered or skipped.

**Badge Types:**

- **"Answered"** - Green badge, appears after selecting an option
- **"Skipped"** - Amber badge, appears after clicking skip
- **"Saving..."** - Loading state with spinner during submission

**Actions:**

- See immediate feedback after answering/skipping
- View saving state during API submission

**Intended User Goal:**  
Get instant confirmation that their action was registered and being saved.

---

##### 6.6 Comments Section

**Description:**  
Optional text input allowing users to leave thoughts/context on each poll.

**Actions:**

- Click "Add Comment" to open comment box
- Type comment (max 500 characters)
- Save or cancel comment
- Edit existing comment
- View saved comment on poll
- Character counter shows remaining length

**Intended User Goal:**  
Share deeper thoughts, provide context for their answer, or explain why they chose a particular option.

---

##### 6.7 Navigation Controls

**Description:**  
Buttons for moving between polls during answering and review.

**Actions:**

- Click "Next" to proceed to next poll (after answering)
- Click "Back" to return to previous answered poll
- Click "Skip" to bypass current poll (if under skip limit)
- Use keyboard arrow keys for navigation (if supported)

**Intended User Goal:**  
Control pacing of experience, review previous answers, and navigate flexibly through the Qwirl.

---

##### 6.8 Review Mode

**Description:**  
Post-answering mode showing distribution of all answers with owner's choice highlighted.

**Access Methods:**

- Automatic after finishing all polls
- Manual via "Review Answers" button on completion screen

**Actions:**

- Navigate through all polls
- See owner's answer marked with badge
- View own answer marked with "You" badge
- See answer distribution percentages
- View response statistics
- Navigate skipped polls
- Add/edit comments on any poll

**Intended User Goal:**  
Compare their answers with the creator's, understand where they aligned/differed, and reflect on the compatibility score.

---

##### 6.9 Completion Screen

**Description:**  
Summary screen shown after finishing all polls, displaying wavelength score and statistics.

**Components:**

- **Wavelength Display** - Large compatibility percentage with colored indicator
- **Interpretation Text** - Contextual message based on score (80%+, 60-80%, 40-60%, <40%)
- **Statistics Grid** - Answered count, skipped count, unanswered count
- **New Questions Badge** - Shows count if creator added polls since last session

**Actions:**

- View wavelength score
- Read compatibility interpretation
- See answer statistics
- Click "Review Answers" to enter review mode
- Click "Answer New Questions" (if available)
- View summary of answered questions with owner's answers

**Intended User Goal:**  
Understand the overall compatibility result, get closure on the experience, and decide whether to review answers or answer new questions.

---

##### 6.10 Wavelength Indicator

**Description:**  
Visual compatibility score display with color-coded feedback.

**Color Coding:**

- **Green (80-100%)** - Highly aligned, think very similarly
- **Yellow-Green (60-79%)** - Pretty good sync, shared perspectives
- **Orange (40-59%)** - Some common ground, different views
- **Red (0-39%)** - Quite different perspectives

**Actions:**

- View percentage score
- See color-coded visual indicator
- Read interpretation text

**Intended User Goal:**  
Quickly understand compatibility level through intuitive color coding without reading detailed text.

---

##### 6.11 Question Summary Toggle (Completion)

**Description:**  
Expandable section on completion screen showing all answered polls with owner's answers side-by-side.

**Actions:**

- Click "Show All Questions" to expand
- Click "Hide Questions" to collapse
- View each question with both user's and owner's answers
- See visual comparison for all polls

**Intended User Goal:**  
Get a bird's-eye view of all alignments/disagreements without navigating through review mode poll-by-poll.

---

##### 6.12 New Questions Handler

**Description:**  
Detects and allows answering polls added by creator since user's last session.

**Actions:**

- See badge showing count of new questions
- Click "Answer New Questions" button
- Enter answering mode for new polls only
- See updated wavelength after answering new questions

**Intended User Goal:**  
Stay up-to-date with creator's evolving Qwirl and maintain accurate wavelength without re-answering everything.

---

##### 6.13 Smooth Transitions

**Description:**  
Animated transitions between polls creating fluid, game-like experience.

**Animation Types:**

- **Poll Entry** - Fade in + slide from right (0.28s)
- **Poll Exit** - Fade out + slide to left (0.28s)
- **Option Selection** - Scale + color change on click
- **Progress Bar** - Smooth fill animation

**Actions:**

- Experience smooth transitions automatically
- See visual feedback on every interaction

**Intended User Goal:**  
Enjoy polished, engaging experience that feels premium and encourages completion.

---

##### 6.14 Incomplete Qwirl State

**Description:**  
Special handling when Qwirl has fewer than 15 polls (not yet complete).

**Display:**

- Shows cover with explanation message
- Displays current poll count (e.g., "Only 10 of 15 questions ready")
- "Notify Me" button instead of "Answer"

**Actions:**

- View incomplete status
- Click "Notify Me" to get alert when complete
- Return later to answer

**Intended User Goal:**  
Understand why they can't answer yet and sign up for notification when Qwirl is ready.

---

##### 6.15 Guest vs Authenticated States

**Description:**  
Different experiences based on authentication status.

**Guest Variant:**

- Shows cover with "Sign In" button
- Cannot answer polls
- Can view Qwirl metadata

**Authenticated Visitor:**

- Shows "Answer Qwirl" button
- Full interactive experience
- Can comment and save progress

**Owner Variant:**

- Shows "See Results" button
- Navigates to analytics instead of answering
- Cannot answer own Qwirl

**Actions:**

- See appropriate button based on auth status
- Navigate to correct destination

**Intended User Goal:**  
Understand access level and take appropriate action (sign in, answer, or view results).

---

##### 6.16 Results Variant in Review Mode

**Description:**  
Special poll option display showing answer distribution and owner's choice during review.

**Display:**

- Each option shows percentage bar
- Owner's answer marked with special badge
- User's answer marked with "You" badge
- Response count displayed
- Visual hierarchy (owner > user > others)

**Actions:**

- Compare own answer with owner
- See what percentage chose each option
- Identify alignments at a glance

**Intended User Goal:**  
Quickly see where they agreed/disagreed with the creator and understand popular vs unpopular choices.

---

##### 6.17 Auto-Save Mechanism

**Description:**  
Automatic saving of answers and session state after each poll.

**Behavior:**

- Saves answer immediately after selection
- Shows "Saving..." indicator during submission
- Optimistic UI updates (instant feedback)
- Session persists across page refreshes
- Resume from last position if interrupted

**Actions:**

- Answer poll
- See optimistic update
- Continue without waiting for save
- Close browser and return later

**Intended User Goal:**  
Never lose progress, even if they accidentally close the browser or navigate away mid-session.

---

##### 6.18 Primary CTA Button Logic

**Description:**  
Context-aware primary button that changes text/behavior based on state.

**Button Text Variations:**

- **"Next"** - After answering non-final poll
- **"Skip"** - On unanswered poll (if skips remain)
- **"Finish"** - After answering final poll
- **"Continue"** - During review mode navigation
- **"Answer"** - Starting new questions mode

**Actions:**

- Click to perform context-appropriate action
- See button text change based on state

**Intended User Goal:**  
Always have clear next action without needing to think about what button to press.

---

## Technical Implementation Notes

### State Management

- **React Hook Form:** Form validation and state for poll creation/editing
- **TanStack Query:** Data fetching, caching, and mutations for API operations
- **Zustand:** Global auth state and user data
- **Local State:** UI toggles (edit mode, dialogs, selected responders, current poll navigation)

### Key Queries (Analytics Page)

- `qwirlRespondersQuery`: Fetch all completed responders for the Qwirl
- `qwirlResponsesByUsersQuery`: Fetch detailed responses for selected responders
- `qwirlStatsQuery`: Fetch aggregate Qwirl statistics
- `qwirlCommentsQuery`: Fetch comments for specific poll (paginated)

### Key Queries (Responses Page)

- `qwirlRespondersQuery`: Fetch all responders (all statuses) with metadata

### Key Queries (Community Page)

- `qwirlCommunityQuery` (infinite): Fetch paginated, filtered, sorted Qwirls with infinite scroll

### Key Queries (Question Bank Page)

- `questionBankQuery` (infinite): Fetch paginated questions with search/filter (12 per page)

### Key Queries (Qwirl Respond Page)

- `userQwirlQuery`: Fetch Qwirl data with user's session state and responses
- `qwirlCoverQuery`: Fetch Qwirl cover metadata (title, description, image, visibility)

### Key Mutations (Qwirl Respond Page)

- `submitAnswerMutation`: Submit answer for single poll (with optimistic updates)
- `saveCommentMutation`: Save/update comment for specific poll
- `finishSessionMutation`: Complete session and calculate final wavelength

### Key Mutations

- `addPollToQwirlMutation`: Add new poll to Qwirl
- `deletePollFromQwirlMutation`: Remove poll from Qwirl
- `reorderPollsMutation`: Update poll order
- `qwirlCoverMutation`: Update Qwirl cover data (title, description, image, visibility)

### Validation

- Poll questions: Required, non-empty
- Poll options: 2-6 options, all non-empty
- Owner answer: Required selection from available options
- Qwirl title: 1-60 characters
- Qwirl description: 10-200 characters
- Minimum polls: 15 required for visibility
- Comments: Max 500 characters
- Skip limit: Max 5 skips per session

### Key Contexts

- `QwirlSelectionProvider`: Manages question bank cart (max 15 selections), add/remove operations, persist state across navigation

### Component Architecture

- **Page Component:** Layout orchestration, sidebar configuration
- **Feature Components:** Self-contained features (editor, dialogs, cards)
- **UI Components:** Reusable primitives (buttons, cards, forms)
- **Compound Components:** Multi-part components (sortable lists, poll options)

---

## User Flow: Creating a Qwirl

1. **Land on Edit Page** → See empty state or existing polls
2. **Edit Cover** → Customize title, description, background
3. **Add Polls** → Click "Add Poll" button
4. **Choose Source** → Question Bank or Custom
5. **Create/Select** → Build or browse questions
6. **Submit Poll** → Poll appears in list
7. **Reorder/Delete** → Organize polls via drag-drop or delete
8. **Monitor Progress** → Check sidebar for 15-poll completion
9. **Enable Visibility** → Toggle on when ready
10. **Share** → Copy URL from Quick Actions

---

## User Flow: Analyzing Responses

1. **Navigate to Analytics** → From sidebar or Quick Actions
2. **View Overview** → See aggregate stats in sidebar card
3. **Browse Polls** → Use arrow keys or navigation buttons/dots
4. **Select Responders** → Choose individuals from dropdown
5. **Compare Answers** → View selected responders' badges on each option
6. **Read Comments** → Scroll through responder thoughts
7. **Identify Patterns** → Notice which polls have high/low engagement
8. **Adjust Polls** → Reorder, delete, or navigate to Edit to modify
9. **Deep Link** → Share specific responder view via URL parameter
10. **Monitor Stats** → Check completion rate and wavelengths

---

## User Flow: Managing Responses

1. **Navigate to Responses** → From sidebar or Quick Actions
2. **View Stats Header** → See total and completed count
3. **Scan Responder Cards** → Identify completed vs in-progress
4. **Check Progress** → See completion percentages and timestamps
5. **Click Completed Card** → Navigate to Analytics with responder selected

---

## User Flow: Browsing Question Bank

1. **Navigate to Question Bank** → From navigation or direct URL
2. **Browse Initial Results** → See all categories, no filters
3. **Apply Filters** → Use category dropdown or search bar
4. **Discover Randomly** → Click "Surprise Me" for random category
5. **Read Questions** → Review question text, options, tags
6. **Select Questions** → Click "Select Question" on desired items
7. **Monitor Cart** → See badge update on cart button
8. **Open Cart** → Click cart button to review selections
9. **Review & Edit** → Reorder via drag-drop, edit text/options
10. **Confirm** → Click "Add All to Qwirl" button
11. **Navigate to Edit** → See selected questions added to Qwirl
12. **Continue Browsing** → Scroll for infinite results, adjust filters

---

## User Flow: Answering a Qwirl

1. **Land on Cover** → View creator info, Qwirl details
2. **Read Description** → Understand what Qwirl is about
3. **Click "Answer Qwirl"** → Enter interactive mode
4. **Read First Question** → See options and progress
5. **Select Answer** → Click option or skip if unsure
6. **See Feedback** → "Answered" or "Skipped" badge appears
7. **Add Comment** (optional) → Share thoughts on current poll
8. **Click Next** → Proceed to next poll with animation
9. **Navigate Back** (optional) → Return to previous polls
10. **Monitor Progress** → Check position counter and skip counter
11. **Answer Final Poll** → Click "Finish" on last question
12. **View Completion** → See wavelength score and statistics
13. **Review Answers** → Enter review mode to compare with owner
14. **Share Result** → Copy/share wavelength with others

---

## User Flow: Reviewing Qwirl Answers

1. **Enter Review Mode** → From completion screen or returning user
2. **Navigate Polls** → Use next/back buttons
3. **Compare Answers** → See owner's answer vs your answer
4. **View Distribution** → See percentage bars for all options
5. **Read Comments** → View or edit your comments
6. **Identify Patterns** → Notice agreement/disagreement trends
7. **Answer New Questions** → If creator added polls since last visit
8. **Update Wavelength** → See recalculated score after new answers

---

## User Flow: Discovering Qwirls

1. **Land on Community** → See featured/recent Qwirls
2. **Browse Grid** → Scroll through visually rich cards
3. **Use Filters** → Sort by popularity, recency, or type
4. **Search** → Type keywords to find specific content
5. **Review Cards** → Read descriptions, see categories, check creators
6. **Click Interest** → Select Qwirl that resonates
7. **Navigate to Respond** → Start answering (or view results if own Qwirl)
8. **Infinite Scroll** → Continue discovering without pagination
9. **Return** → Come back to find more Qwirls

---

## Future Enhancements (Not Yet Built)

- Multiple Qwirls per user (currently only primary Qwirl)
- Poll images/media attachments
- Category/tag filtering for polls
- Poll templates
- Collaborative Qwirls
- Scheduled visibility changes
- Response filtering by status/date on Responses page
- Bulk actions for responders (message, export, etc.)
- Response notifications
- Favoriting/bookmarking Qwirls in Community
- Batch deletion in Question Bank cart
- Save/load selection carts for later use
- Question recommendations based on selected categories
- Personalized recommendations based on wavelength
- Keyboard navigation for poll answering (arrow keys)
- Share wavelength result directly to social media
- Leaderboard showing highest wavelength matches
- Private/direct message responders
- Export wavelength history as PDF/image

---

_Document Version: 1.5_  
_Last Updated: October 18, 2025_  
_Pages Documented: Edit (1), Analytics (2), Responses (3), Community (4), Question Bank (5), Qwirl Respond (6)_  
_Next Pages: Settings_
