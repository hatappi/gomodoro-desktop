import React, { useState, useEffect, useRef } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Stack,
  Box,
  Fade,
  Alert,
} from "@mui/material";
import { theme } from "./styles/theme";
import Layout from "./components/Layout/Layout";
import Timer from "./components/Timer/Timer";
import Controls from "./components/Controls/Controls";
import TaskManager from "./components/TaskManager/TaskManager";
import { usePomodoro } from "./hooks/usePomodoro";
import { useTasks } from "./hooks/useTasks";

export default function App(): React.ReactElement {
  const {
    pomodoro,
    isLoading,
    error: pomodoroError,
    start,
    pause,
    resume,
    stop,
  } = usePomodoro();
  const {
    tasks,
    selectedTaskId,
    loading: tasksLoading,
    error: tasksError,
    selectTask,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [showTaskManager, setShowTaskManager] = useState(true);
  const isInitializedRef = useRef(false);

  // Initialize selectedTaskId and showTaskManager
  useEffect(() => {
    if (isLoading || tasksLoading || isInitializedRef.current) {
      return;
    }
    isInitializedRef.current = true;

    const initialTaskId = pomodoro?.taskId;
    if (initialTaskId && pomodoro?.state !== "FINISHED") {
      selectTask(initialTaskId);
      setShowTaskManager(false);
    } else {
      setShowTaskManager(true);
    }
  }, [isLoading, tasksLoading, pomodoro, selectedTaskId, selectTask]);

  const canStart =
    (!pomodoro ||
      (pomodoro.state !== "ACTIVE" && pomodoro.state !== "PAUSED")) &&
    !!selectedTaskId;
  const canPause = !!pomodoro && pomodoro.state === "ACTIVE";
  const canResume = !!pomodoro && pomodoro.state === "PAUSED";
  const canStop = !!pomodoro && pomodoro.state !== "FINISHED";
  const isFinished = !!pomodoro && pomodoro.state === "FINISHED";

  const handleSelectTask = (taskId: string) => {
    selectTask(taskId);

    start(taskId);
    setShowTaskManager(false);
  };

  const handleChangeTask = () => {
    setShowTaskManager(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Container
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack sx={{ width: "100%", maxWidth: "600px" }}>
            {pomodoroError && pomodoroError !== "no current pomodoro" && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Pomodoro Error: {pomodoroError}
              </Alert>
            )}
            {tasksError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Tasks Error: {tasksError}
              </Alert>
            )}

            <Fade in={showTaskManager} timeout={300} unmountOnExit>
              <Box sx={{ width: "100%" }}>
                <TaskManager
                  tasks={tasks}
                  selectedTaskId={selectedTaskId}
                  onSelectTask={handleSelectTask}
                  onCreateTask={createTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  loading={tasksLoading}
                />
              </Box>
            </Fade>

            <Fade in={!showTaskManager} timeout={300} unmountOnExit>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Timer pomodoro={pomodoro} tasks={tasks} />

                <Controls
                  isLoading={isLoading}
                  canStart={canStart}
                  canPause={canPause}
                  canResume={canResume}
                  canStop={canStop}
                  isFinished={isFinished}
                  onStart={() => {
                    if (selectedTaskId) {
                      start(selectedTaskId);
                      setShowTaskManager(false);
                    }
                  }}
                  onPause={() => void pause()}
                  onResume={() => void resume()}
                  onStop={() => void stop()}
                  onChangeTask={handleChangeTask}
                />
              </Box>
            </Fade>
          </Stack>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}
