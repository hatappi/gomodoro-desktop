import { app, BrowserWindow, Menu, MenuItemConstructorOptions, Tray, nativeImage } from 'electron';
import PomodoroService from '../services/PomodoroService';
import NotificationService from '../services/NotificationService';
import type { Pomodoro } from '../../shared/types/gomodoro';
import type { PomodoroState } from '../../shared/types/gomodoro';
import type { PomodoroPhase } from '../../shared/types/gomodoro';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import log from 'electron-log/main'

interface PomodoroConfig {
  workDurationSec: number;
  breakDurationSec: number;
  longBreakDurationSec: number;
  taskId: string;
}

const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  workDurationSec: 1500, // 25 minutes
  breakDurationSec: 300,  // 5 minutes
  longBreakDurationSec: 900, // 15 minutes
  taskId: 'default-task',
};

const EMOJI_MAP = {
  DEFAULT: '🍅',
  PAUSED: '⏸️',
  FINISHED: '✅',
  WORK: '🎯',
  SHORT_BREAK: '☕',
  LONG_BREAK: '🌴',
} as const;

export default class TrayManager {
  private tray: Tray | null = null;
  private currentStateLabel = '';
  private currentState: PomodoroState | null = null;
  private currentPhase: PomodoroPhase | null = null;
  private eventSubscription: (() => void) | null = null;

  constructor(
    private readonly pomodoroService: PomodoroService,
    private readonly config: PomodoroConfig = DEFAULT_POMODORO_CONFIG,
    private readonly notificationService: NotificationService | null = null,
  ) {}

  public init(): void {
    this.tray = new Tray(nativeImage.createEmpty());
    this.tray.setContextMenu(this.buildMenu());

    this.setTrayTooltip();
    this.setTrayTitle('');

    this.eventSubscription = this.pomodoroService.subscribePomodoroEvents((p) => {
      this.applyPomodoro(p);
      this.refreshMenu();
    });

    this.pomodoroService.getCurrentPomodoro()
      .then((p) => {
        this.applyPomodoro(p);
        this.refreshMenu();
      })
      .catch((error) => {
        // Ignore "no current pomodoro" error since it usually happens on startup
        if (error.message == ERROR_MESSAGES.NO_CURRENT_POMODORO) {
          return;
        }
        log.error('[TrayManager] Failed to get current pomodoro:', error);
      });
  }

  public destroy(): void {
    this.eventSubscription?.();
    this.tray?.destroy();
  }

  private buildMenu(): Menu {
    const isActive = this.currentState === 'ACTIVE';
    const isPaused = this.currentState === 'PAUSED';

    const canStart = !isActive && !isPaused;
    const canPause = isActive;
    const canResume = isPaused;
    const canStop = isActive || isPaused;

    const template: MenuItemConstructorOptions[] = [
      {
        label: 'Show / Hide',
        click: () => this.toggleMainWindow(),
      },
    ];

    const actionItems: MenuItemConstructorOptions[] = [];
    if (canStart) {
      actionItems.push({
        label: 'Start',
        click: async () => {
          try {
            await this.pomodoroService.startPomodoro(this.config);
          } catch (error) {
            log.error('[TrayManager] Failed to start pomodoro:', error);
          }
        },
      });
    }
    if (canPause) {
      actionItems.push({
        label: 'Pause',
        click: () => this.pomodoroService.pausePomodoro().catch((error) => {
          log.error('[TrayManager] Failed to pause pomodoro:', error);
        }),
      });
    }
    if (canResume) {
      actionItems.push({
        label: 'Resume',
        click: () => this.pomodoroService.resumePomodoro().catch((error) => {
          log.error('[TrayManager] Failed to resume pomodoro:', error);
        }),
      });
    }
    if (canStop) {
      actionItems.push({
        label: 'Stop',
        click: () => this.pomodoroService.stopPomodoro().catch((error) => {
          log.error('[TrayManager] Failed to stop pomodoro:', error);
        }),
      });
    }

    if (actionItems.length > 0) {
      template.push({ type: 'separator' }, ...actionItems);
    }

    template.push(
      { type: 'separator' },
      {
        label: 'Quit',
        role: 'quit',
        accelerator: 'Cmd+Q',
        click: () => app.quit(),
      },
    );

    return Menu.buildFromTemplate(template);
  }

  private refreshMenu(): void {
    if (!this.tray) return;
    this.tray.setContextMenu(this.buildMenu());
  }

  private toggleMainWindow(): void {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length === 0) {
      log.warn('[TrayManager] No windows available to toggle');
      return;
    }
    
    const win = windows[0];
    if (win.isFocused()) {
      win.hide();
    } else {
      win.show();
      win.focus();
    }
  }

  private setTrayTitle(text: string): void {
    if (!this.tray) return;
    const emoji = this.emojiFor(this.currentState, this.currentPhase);
    const title = text ? `${emoji} ${text}` : `${emoji}`;
    this.tray.setTitle(title);
  }

  private setTrayTooltip(): void {
    if (!this.tray) return;
    const tooltip = this.currentStateLabel ? `Gomodoro • ${this.currentStateLabel}` : 'Gomodoro';
    this.tray.setToolTip(tooltip);
  }

  private applyPomodoro(pomodoro: Pomodoro | null): void {
    const prevState = this.currentState;

    if (pomodoro) {
      const mm = this.formatTime(pomodoro.remainingTimeSec);
      this.currentStateLabel = `${pomodoro.phase} #${pomodoro.phaseCount} ${mm}`;
      this.currentState = pomodoro.state;
      this.currentPhase = pomodoro.phase;
      this.setTrayTitle(mm);
    } else {
      this.currentState = null;
      this.currentStateLabel = '';
      this.currentPhase = null;
      this.setTrayTitle('');
    }
    this.setTrayTooltip();

    if (pomodoro && prevState && prevState !== 'FINISHED' && pomodoro.state === 'FINISHED') {
      this.notificationService?.notifyFinished(pomodoro.state, pomodoro.phase);
    }
  }

  private emojiFor(state: PomodoroState | null, phase: PomodoroPhase | null): string {
    if (state === null) return EMOJI_MAP.DEFAULT;
    if (state === 'PAUSED') return EMOJI_MAP.PAUSED;
    if (state === 'FINISHED') return EMOJI_MAP.FINISHED;
    
    switch (phase) {
      case 'WORK':
        return EMOJI_MAP.WORK;
      case 'SHORT_BREAK':
        return EMOJI_MAP.SHORT_BREAK;
      case 'LONG_BREAK':
        return EMOJI_MAP.LONG_BREAK;
      default:
        return EMOJI_MAP.DEFAULT;
    }
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}


