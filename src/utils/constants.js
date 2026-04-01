const UserRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

const AvailableUserRoles = Object.values(UserRolesEnum);

const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

const AvailableTaskStatus = Object.values(TaskStatusEnum);

export { AvailableTaskStatus, AvailableUserRoles, TaskStatusEnum, UserRolesEnum };
