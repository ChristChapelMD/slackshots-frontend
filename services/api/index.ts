import * as slack from "./integrations/slack";
import * as fileModelOperations from "./db/operations/file.operation";
import * as workspaceModelOperations from "./db/operations/workspace.operation";
import * as userWorkspaceOperations from "./db/operations/userworkspace.operation";

export const api = {
  slack,
  db: {
    file: fileModelOperations,
    workspace: workspaceModelOperations,
    userworkspace: userWorkspaceOperations,
  },
};
