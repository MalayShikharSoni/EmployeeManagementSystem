import { Request, Response } from 'express';
import GroupModel from '../models/groupModel';
import { getGitHubStats, clearGitHubCache } from '../services/githubService';

class GroupController {
  // POST /api/groups — admin creates group
  static async createGroup(req: Request, res: Response): Promise<void> {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }

      const { name, description, memberIds, githubRepoUrl } = req.body;

      if (!name || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
        res.status(400).json({ success: false, error: 'Name and at least one member are required' });
        return;
      }

      const group = await GroupModel.create(
        name,
        description || null,
        req.user.id,
        githubRepoUrl || null,
        memberIds
      );

      res.status(201).json({ success: true, data: group, message: 'Project group created successfully' });
    } catch (error) {
      console.error('Create group error:', error);
      res.status(500).json({ success: false, error: 'Failed to create group' });
    }
  }

  // GET /api/groups — list groups
  static async getGroups(req: Request, res: Response): Promise<void> {
    try {
      let groups;
      if (req.user.role === 'admin') {
        groups = await GroupModel.getGroupsByAdmin(req.user.id);
      } else {
        groups = await GroupModel.getGroupsByEmployee(req.user.id);
      }

      res.json({ success: true, data: groups });
    } catch (error) {
      console.error('Get groups error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch groups' });
    }
  }

  // GET /api/groups/:groupId — group detail
  static async getGroupDetail(req: Request, res: Response): Promise<void> {
    try {
      const groupId = parseInt(req.params.groupId as string, 10);
      const group = await GroupModel.getGroupDetail(groupId);

      if (!group) {
        res.status(404).json({ success: false, error: 'Group not found' });
        return;
      }

      // Check access: admin must own it, employee must be a member
      if (req.user.role === 'admin') {
        if (group.admin_id !== req.user.id) {
          res.status(403).json({ success: false, error: 'Access denied' });
          return;
        }
      } else {
        const isMember = await GroupModel.isGroupMember(groupId, req.user.id);
        if (!isMember) {
          res.status(403).json({ success: false, error: 'Access denied' });
          return;
        }
      }

      const members = await GroupModel.getGroupMembers(groupId);
      res.json({ success: true, data: { ...group, members } });
    } catch (error) {
      console.error('Get group detail error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch group detail' });
    }
  }

  // POST /api/groups/:groupId/tasks — admin assigns task
  static async createGroupTask(req: Request, res: Response): Promise<void> {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }

      const groupId = parseInt(req.params.groupId as string, 10);
      const isAdmin = await GroupModel.isGroupAdmin(groupId, req.user.id);
      if (!isAdmin) {
        res.status(403).json({ success: false, error: 'You do not own this group' });
        return;
      }

      const { assignedTo, title, description, priority, dueDate } = req.body;

      if (!assignedTo || !title) {
        res.status(400).json({ success: false, error: 'assignedTo and title are required' });
        return;
      }

      // Verify the employee is a member of the group
      const isMember = await GroupModel.isGroupMember(groupId, assignedTo);
      if (!isMember) {
        res.status(400).json({ success: false, error: 'Employee is not a member of this group' });
        return;
      }

      const task = await GroupModel.createTask(
        groupId,
        assignedTo,
        title,
        description || null,
        priority || 'medium',
        dueDate || null
      );

      res.status(201).json({ success: true, data: task, message: 'Task assigned successfully' });
    } catch (error) {
      console.error('Create group task error:', error);
      res.status(500).json({ success: false, error: 'Failed to create task' });
    }
  }

  // GET /api/groups/:groupId/tasks — all tasks in group
  static async getGroupTasks(req: Request, res: Response): Promise<void> {
    try {
      const groupId = parseInt(req.params.groupId as string, 10);
      const tasks = await GroupModel.getGroupTasks(groupId);
      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('Get group tasks error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
    }
  }

  // GET /api/groups/:groupId/progress — per-member contribution stats
  static async getGroupProgress(req: Request, res: Response): Promise<void> {
    try {
      const groupId = parseInt(req.params.groupId as string, 10);
      const progress = await GroupModel.getGroupProgress(groupId);
      res.json({ success: true, data: progress });
    } catch (error) {
      console.error('Get group progress error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch progress' });
    }
  }

  // PUT /api/groups/:groupId/github — update GitHub URL
  static async updateGithubUrl(req: Request, res: Response): Promise<void> {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }

      const groupId = parseInt(req.params.groupId as string, 10);
      const isAdmin = await GroupModel.isGroupAdmin(groupId, req.user.id);
      if (!isAdmin) {
        res.status(403).json({ success: false, error: 'You do not own this group' });
        return;
      }

      const { githubRepoUrl } = req.body;
      const group = await GroupModel.updateGithubUrl(groupId, githubRepoUrl || null);

      // Clear cache for old URL
      clearGitHubCache();

      res.json({ success: true, data: group, message: 'GitHub URL updated' });
    } catch (error) {
      console.error('Update GitHub URL error:', error);
      res.status(500).json({ success: false, error: 'Failed to update GitHub URL' });
    }
  }

  // GET /api/groups/:groupId/github-stats — fetch GitHub stats
  static async getGithubStats(req: Request, res: Response): Promise<void> {
    try {
      const groupId = parseInt(req.params.groupId as string, 10);
      const group = await GroupModel.getGroupDetail(groupId);

      if (!group) {
        res.status(404).json({ success: false, error: 'Group not found' });
        return;
      }

      if (!group.github_repo_url) {
        res.status(400).json({ success: false, error: 'No GitHub repo linked to this group' });
        return;
      }

      const stats = await getGitHubStats(group.github_repo_url);
      res.json({ success: true, data: stats });
    } catch (error: any) {
      console.error('Get GitHub stats error:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch GitHub stats' });
    }
  }

  // PUT /api/groups/:groupId/tasks/:taskId/status — update task status (for employees)
  static async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const taskId = parseInt(req.params.taskId as string, 10);
      const { status } = req.body;

      if (!status || !['new', 'active', 'completed', 'failed'].includes(status)) {
        res.status(400).json({ success: false, error: 'Invalid status' });
        return;
      }

      const task = await GroupModel.updateTaskStatus(taskId, status);
      if (!task) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }

      res.json({ success: true, data: task, message: 'Task status updated' });
    } catch (error) {
      console.error('Update task status error:', error);
      res.status(500).json({ success: false, error: 'Failed to update task status' });
    }
  }

  // GET /api/groups/my-tasks — employee gets their group tasks
  static async getMyGroupTasks(req: Request, res: Response): Promise<void> {
    try {
      const groupTasks = await GroupModel.getEmployeeGroupTasks(req.user.id);
      res.json({ success: true, data: groupTasks });
    } catch (error) {
      console.error('Get my group tasks error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch group tasks' });
    }
  }
}

export default GroupController;
