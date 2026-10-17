### Goal

Build the `editor` home screen and add project dialogs/sidebar actions. No API calls or persistence yet. 

## Editor Home
Reuse the existing editor layout. Do not modify the navbar or sidebar behavior. 

In the center of the page, add:
- heading `Create a project or open an existing one`
- description: `start a new architecture workspace, or choose a project from the sidebar.`
- `New project`button with a `Plus`icon

Keep the layout minimal/ Do not wrap this content in cards. 


Click `New project` should open the Create Project  dialog.


## Dialogs

### Create project
- project name input
- live slug preview based on the name
- preview updates as the user types

### Rename project
- prefilled project name input
- current project name shown in the description
- input auto-focuses
- enter submits

### Delete project
- desctructive confirmation only
- no input
- confirm button uses descrictive styling


## Sidebar
### Implementation

Create a dedicated hook to manage:
- dialog state
- form state
- loading state

Wire:
- editor home `New Project`-> Create dialog
- sidebar create -> Create dialog
- sidebar rename -> Rename dialog
- sidebar delete -> delete dialog

Use mock project data only. Do not add API calls or persistance. 


## check when done
- sidebar actions are wired
- slug preview works
- no typescript errors
- no lint errors
