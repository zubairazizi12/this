import express from 'express';
import { storage } from '../storage';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { email, firstName, lastName, role, password } = req.body;
    
    if (!email || !firstName || !role) {
      return res.status(400).json({ message: 'Email, firstName, and role are required' });
    }
    
    if (!['admin', 'viewer'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either admin or viewer' });
    }
    
    const newUser = await storage.createUser({ email, firstName, lastName, role, password: password || 'defaultpass' });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { email, firstName, lastName, role } = req.body;
    
    if (role && !['admin', 'viewer'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either admin or viewer' });
    }
    
    const updatedUser = await storage.updateUser(req.params.id, { email, firstName, lastName, role });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    if ((error as Error).message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    await storage.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export { router as userRoutes };