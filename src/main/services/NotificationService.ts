import { app, BrowserWindow, Notification } from 'electron';
import type { PomodoroPhase, PomodoroState } from '../../shared/types/gomodoro';
import log from 'electron-log/main'

export default class NotificationService {
  public notifyFinished(state: PomodoroState, phase: PomodoroPhase): void {
    if (state !== 'FINISHED') return;

    const title = 'Gomodoro';
    const body = this.buildFinishedBody(phase);
    this.show(title, body);
  }

  private buildFinishedBody(phase: PomodoroPhase): string {
    const phaseLabel = (() => {
      switch (phase) {
        case 'WORK':
          return 'Work';
        case 'SHORT_BREAK':
          return 'Short break';
        case 'LONG_BREAK':
          return 'Long break';
        default:
          return String(phase);
      }
    })();

    return `${phaseLabel} finished!`;
  }

  private show(title: string, body: string): void {
    if (!Notification.isSupported()) return;

    const notification = new Notification({ title, body, silent: false });
    notification.on('click', () => {
      const win = BrowserWindow.getAllWindows()[0];
      if (!win) return;

      try {
        if (win.isMinimized()) win.restore();
        win.show();
        app.focus();
        win.focus();
      } catch (error) {
        log.error('Failed to show notification', error);
      }
    });
    notification.show();
  }
}


