import { app, BrowserWindow, Menu, MenuItemConstructorOptions, Tray, nativeImage } from 'electron';
import PomodoroService from '../services/PomodoroService';
import type { Pomodoro } from '../../shared/types/gomodoro';
import type { PomodoroState } from '../../shared/types/gomodoro';
import type { PomodoroPhase } from '../../shared/types/gomodoro';

export default class TrayManager {
  private tray: Tray | null = null;
  private currentStateLabel: string = '';
  private currentState: PomodoroState | null = null;
  private currentPhase: PomodoroPhase | null = null;

  constructor(private readonly pomodoroService: PomodoroService) {}

  public init(): void {
    this.tray = new Tray(nativeImage.createEmpty());
    this.tray.setContextMenu(this.buildMenu());

    this.setTrayTooltip();
    this.setTrayTitle('');

    this.pomodoroService.subscribePomodoroEvents((p) => {
      this.applyPomodoro(p);
      this.refreshMenu();
    });

    this.pomodoroService.getCurrentPomodoro().then((p) => {
      this.applyPomodoro(p);
      this.refreshMenu();
    });
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
          await this.pomodoroService.startPomodoro({
            workDurationSec: 1500,
            breakDurationSec: 300,
            longBreakDurationSec: 900,
            taskId: 'default-task',
          });
        },
      });
    }
    if (canPause) {
      actionItems.push({
        label: 'Pause',
        click: () => this.pomodoroService.pausePomodoro().catch(() => {}),
      });
    }
    if (canResume) {
      actionItems.push({
        label: 'Resume',
        click: () => this.pomodoroService.resumePomodoro().catch(() => {}),
      });
    }
    if (canStop) {
      actionItems.push({
        label: 'Stop',
        click: () => this.pomodoroService.stopPomodoro().catch(() => {}),
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
    const win = BrowserWindow.getAllWindows()[0];
    if (!win) {
      return;
    }
    if (win.isFocused()) {
      win.hide();
    } else {
      win.show();
      win.focus();
    }
  }

  private setTrayTitle(text: string): void {
    if (!this.tray) return;
    const emoji = this.emojiFor(this.currentState, this.currentPhase ?? undefined);
    const title = text ? `${emoji} ${text}` : `${emoji}`;
    this.tray.setTitle(title);
  }

  private setTrayTooltip(): void {
    if (!this.tray) return;
    const tooltip = this.currentStateLabel ? `Gomodoro • ${this.currentStateLabel}` : 'Gomodoro';
    this.tray.setToolTip(tooltip);
  }

  private applyPomodoro(pomodoro: Pomodoro | null): void {
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
  }

  private emojiFor(state: PomodoroState | null, phase?: PomodoroPhase): string {
    if (state === null) return '🍅';
    if (state === 'PAUSED') return '⏸️';
    if (state === 'FINISHED') return '✅';
    switch (phase) {
      case 'WORK':
        return '🎯';
      case 'SHORT_BREAK':
        return '☕';
      case 'LONG_BREAK':
        return '🌴';
      default:
        return '🍅';
    }
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}


