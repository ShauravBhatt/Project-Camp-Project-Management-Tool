import { Project } from "../models/project.models.js";
import { User } from "../models/user.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { Note } from "../models/note.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {
  AvailableTaskStatus,
  AvailableUserRoles,
  UserRolesEnum,
  TaskStatusEnum,
} from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {});

const createProject = asyncHandler(async (req, res) => {
  if (!req.user._id) {
    throw new ApiError(401, "Unauthorized Access");
  }

  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
  });

  if (!project) {
    throw new ApiError(500, "Internal server error");
  }

  await ProjectMember.create({
    project: project._id,
    user: req.user._id,
    role: UserRolesEnum.ADMIN,
  });

  return res.status(200).json(new ApiResponse(200, project, "Project created successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {});

const updateProjectById = asyncHandler(async (req, res) => {
  if (!req.user._id) {
    throw new ApiError(401, "Unauthorized Access");
  }

  const { projectId } = req.params;
  const { name, description } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name: name,
      description: description,
    },
    {
      new: true,
    },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res.status(200).json(new ApiResponse(200, project, "Project updated successfully"));
});

const deleteProjectById = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized Access");
  }

  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({ project: projectId }).select("_id");

  const taskIds = tasks.map((task) => task._id);

  await Subtask.deleteMany({
    task: { $in: taskIds },
  });

  await Task.deleteMany({ project: projectId });

  await Note.deleteMany({ project: projectId });

  await ProjectMember.deleteMany({ project: projectId });

  await project.deleteOne();

  return res.status(200).json(new ApiResponse(200, project, "Project deleted successfully"));
});

const getProjectMembers = asyncHandler(async (req, res) => {});
const addMembersToProject = asyncHandler(async (req, res) => {});
const updateMemberRoleInProject = asyncHandler(async (req, res) => {});
const removeMemberFromProject = asyncHandler(async (req, res) => {});

export {
  getProjectById,
  getProjectMembers,
  getProjects,
  createProject,
  updateMemberRoleInProject,
  updateProjectById,
  deleteProjectById,
  addMembersToProject,
  removeMemberFromProject,
};
