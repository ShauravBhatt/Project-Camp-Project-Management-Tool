import { Project } from "../models/project.models.js";
import { User } from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getProjects = asyncHandler(async (req, res) => {});
const createProject = asyncHandler(async (req, res) => {});
const getProjectById = asyncHandler(async (req, res) => {});
const updateProjectById = asyncHandler(async (req, res) => {});
const deleteProjectById = asyncHandler(async (req, res) => {});
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
