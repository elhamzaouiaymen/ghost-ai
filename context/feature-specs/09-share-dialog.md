Add a `Share` button to the editor navbar that open the share dialog. 

Owners can:
- invite collaborators by email
- vuew current collaborators
- remove collaborators
- copy the project link with temporary `Copied!` feedback

Collborators can

- view the collaborator list only
- not invite, remove, or manage access

## Clerk User Data

Collborators are stored by email in the database. 

Use Clerk Backend API to enrich collborators emails with:
- display name
- avatar image

If a clerk user is not found for an email fall back to showing the email only

## Implementation 

Add the required API logic for:

- listing collboratros
- inviting collborators
- removing collaborators
Enforce ownership server side for invite and remove actions. 

Do no add a local user table. 

## Check When Done

- share dialog opens from the workspace
- owners can invite and remove collaborators
- collaborators see read-only access
- collborator names/avatars load from Clerk when available
- `yarn build` passes
