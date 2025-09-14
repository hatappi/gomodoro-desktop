import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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
} from "@mui/material";
import {
  Add as AddIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Task } from "../../../shared/types/gomodoro";

type Props = {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onCreateTask: (title: string) => void;
  onUpdateTask: (taskId: string, title: string) => void;
  onDeleteTask: (taskId: string) => void;
  loading?: boolean;
};

export default function TaskManager({
  tasks,
  selectedTaskId,
  onSelectTask,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  loading = false,
}: Props): React.ReactElement {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [currentSelectedTaskId, setCurrentSelectedTaskId] = useState<
    string | null
  >(selectedTaskId);

  const selectedTaskRef = useRef<HTMLLIElement>(null);
  const keyboardCardRef = useRef<HTMLDivElement>(null);

  // Sync external selectedTaskId with internal state
  useEffect(() => {
    setCurrentSelectedTaskId(selectedTaskId);
  }, [selectedTaskId]);

  // Auto-scroll to current selected task
  useEffect(() => {
    if (selectedTaskRef.current) {
      selectedTaskRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentSelectedTaskId]);

  const handleCreateTask = () => {
    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    onCreateTask(title);
    setNewTaskTitle("");
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
    setEditTaskTitle("");
    setEditDialogOpen(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    const willDeleteTaskIndex = tasks.findIndex((task) => task.id === taskId);
    const newSelectedTaskIndex =
      willDeleteTaskIndex > 0
        ? willDeleteTaskIndex - 1
        : willDeleteTaskIndex + 1;

    await onDeleteTask(taskId);

    if (newSelectedTaskIndex >= 0 && newSelectedTaskIndex < tasks.length) {
      setCurrentSelectedTaskId(tasks[newSelectedTaskIndex].id);
    } else {
      setCurrentSelectedTaskId(null);
    }
  };

  const handleCreateDialogKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCreateTask();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setCreateDialogOpen(false);
    }
  };

  const handleEditDialogKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleUpdateTask();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setEditDialogOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Disable shortcuts when dialogs are open
      if (createDialogOpen || editDialogOpen) {
        return;
      }

      switch (event.key) {
        case "ArrowUp":
        case "k": {
          event.preventDefault();
          if (tasks.length === 0) break;

          if (currentSelectedTaskId === null) {
            setCurrentSelectedTaskId(tasks[0].id);
            break;
          }

          const currentIndex = tasks.findIndex(
            (task) => task.id === currentSelectedTaskId,
          );
          if (currentIndex > 0 && currentIndex < tasks.length) {
            setCurrentSelectedTaskId(tasks[currentIndex - 1].id);
          }

          break;
        }
        case "ArrowDown":
        case "j": {
          event.preventDefault();
          if (tasks.length === 0) break;

          if (currentSelectedTaskId === null) {
            setCurrentSelectedTaskId(tasks[0].id);
            break;
          }

          const currentIndex = tasks.findIndex(
            (task) => task.id === currentSelectedTaskId,
          );
          if (currentIndex >= 0 && currentIndex < tasks.length - 1) {
            setCurrentSelectedTaskId(tasks[currentIndex + 1].id);
          }

          break;
        }
        case "Enter": {
          event.preventDefault();
          if (currentSelectedTaskId) {
            onSelectTask(currentSelectedTaskId);
          }
          break;
        }
        case "e": {
          event.preventDefault();
          const currentTask = tasks.find(
            (task) => task.id === currentSelectedTaskId,
          );
          if (currentTask) {
            handleEditTask(currentTask);
          }
          break;
        }
        case "d": {
          event.preventDefault();
          if (currentSelectedTaskId) {
            handleDeleteTask(currentSelectedTaskId);
          }
          break;
        }
        case "n": {
          event.preventDefault();
          setCreateDialogOpen(true);
          break;
        }
      }
    };

    const ref = keyboardCardRef.current;
    if (ref) {
      ref.addEventListener("keydown", handleKeyDown);
      return () => {
        ref.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [
    tasks,
    currentSelectedTaskId,
    createDialogOpen,
    editDialogOpen,
    onSelectTask,
    handleDeleteTask,
  ]);

  useEffect(() => {
    // To enable shortcuts when tasks are visible, need to focus it.
    keyboardCardRef.current?.focus();
  }, []);

  return (
    <>
      <Card
        ref={keyboardCardRef}
        tabIndex={0}
        sx={{
          height: "clamp(400px, 60vh, 700px)",
          display: "flex",
          flexDirection: "column",
          "&:focus-visible": {
            outline: "none",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            py: 2,
            "&:last-child": {
              py: 2,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
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
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "divider",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "text.secondary",
                },
              },
            }}
          >
            {tasks.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                No tasks yet. Create your first task to get started!
              </Typography>
            ) : (
              <List dense>
                {tasks.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{ p: 0 }}
                    ref={
                      currentSelectedTaskId === task.id ? selectedTaskRef : null
                    }
                  >
                    <ListItemButton
                      selected={currentSelectedTaskId === task.id}
                      onClick={() => onSelectTask(task.id)}
                      sx={{ py: 0 }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <RadioButtonUncheckedIcon
                          color={
                            selectedTaskId === task.id ? "primary" : "action"
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: selectedTaskId === task.id ? 600 : 400,
                        }}
                        secondary={new Date(
                          task.createdAt,
                        ).toLocaleDateString()}
                        secondaryTypographyProps={{
                          variant: "caption",
                          color: "text.secondary",
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
            onKeyDown={handleCreateDialogKeyDown}
          />
        </DialogContent>

        <DialogActions>
          <Container
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button
              onClick={() => setCreateDialogOpen(false)}
              color="secondary"
              variant="outlined"
            >
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
            onKeyDown={handleEditDialogKeyDown}
          />
        </DialogContent>

        <DialogActions>
          <Container
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button
              onClick={() => setEditDialogOpen(false)}
              color="secondary"
              variant="outlined"
            >
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
