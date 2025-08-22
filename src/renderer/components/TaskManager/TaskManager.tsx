import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  TextField,
  Dialog,
  Container,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { Task } from '../../../shared/types/gomodoro';

type Props = {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string | null) => void;
  onCreateTask: (title: string) => void;
  onUpdateTask: (taskId: string, title: string) => void;
  onDeleteTask: (taskId: string) => void;
  loading?: boolean;
  canStart: boolean;
  onStart: () => void;
};

export default function TaskManager({
  tasks,
  selectedTaskId,
  onSelectTask,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  loading = false,
  canStart,
  onStart,
}: Props): React.ReactElement {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editTaskTitle, setEditTaskTitle] = useState('');

  const handleCreateTask = () => {
    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    onCreateTask(title);
    setNewTaskTitle('');
    setCreateDialogOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditDialogOpen(true);
  };

  const handleUpdateTask = () => {
    const title = editTaskTitle.trim();
    if (!editingTask || !title) {
      return;
    }

    onUpdateTask(editingTask.id, title);
    setEditingTask(null);
    setEditTaskTitle('');
    setEditDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId);
  };

  return (
    <>
    <Card sx={{ 
      height: 'clamp(400px, 60vh, 700px)',
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        py: 2,
        '&:last-child': {
          py: 2
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Tasks
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            disabled={loading}
          >
            Add Task
          </Button>
        </Box>

        {/* Scrollable Task List */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'divider',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'text.secondary',
            },
          },
        }}>
          {tasks.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              No tasks yet. Create your first task to get started!
            </Typography>
          ) : (
            <List dense>
              {tasks.map((task) => (
                <ListItem key={task.id} sx={{ p: 0 }}>
                  <ListItemButton
                    selected={selectedTaskId === task.id}
                    onClick={() => onSelectTask(selectedTaskId === task.id ? null : task.id)}
                    sx={{ py: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <RadioButtonUncheckedIcon 
                        color={selectedTaskId === task.id ? 'primary' : 'action'}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: selectedTaskId === task.id ? 600 : 400,
                      }}
                      secondary={new Date(task.createdAt).toLocaleDateString()}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        color: 'text.secondary',
                      }}
                      sx={{ m: 0 }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTask(task);
                      }}
                      disabled={loading}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      disabled={loading}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Fixed Start Pomodoro Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" color="primary">
              Selected Task:
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {tasks.find(t => t.id === selectedTaskId)?.title || 'No task selected'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={onStart}
            disabled={!canStart || loading}
            sx={{ 
              minWidth: 120,
              boxShadow: (theme) => `0 4px 14px 0 ${theme.palette.primary.main}40`,
              '&:hover': {
                boxShadow: (theme) => `0 6px 20px 0 ${theme.palette.primary.main}60`,
              }
            }}
          >
            Start
          </Button>
        </Box>
      </CardContent>
    </Card>

      {/* Create Task Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Create New Task</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Container sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setCreateDialogOpen(false)} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask}
              variant="contained"
              disabled={!newTaskTitle.trim()}
            >
              Create
            </Button>
          </Container>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Edit Task</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={editTaskTitle}
            onChange={(e) => setEditTaskTitle(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Container sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setEditDialogOpen(false)} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateTask}
              variant="contained"
              disabled={!editTaskTitle.trim()}
            >
              Update
            </Button>
          </Container>
        </DialogActions>
      </Dialog>
    </>
  );
}