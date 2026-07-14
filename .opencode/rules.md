# Workflow rules

Before creating or editing any file, run:

    git branch --show-current

If the output is `main`, stop. Pull the latest changes, then create a branch:

    git pull; git checkout -b issue/<number>-<slug>

If there is no issue number, ask the user for one before continuing.

Never edit files on `main` directly.
