const TIMER_DEFINITIONS = [
  {
    id: 'year-end-2025',
    phase: 'YE25',
    label: 'JAARAFSLUITING 2025',
    description: 'Eindejaarsafsluiting van de productie',
    voltage: 'OFFLINE',
    frequency: 'COUNTDOWN',
    icon: '⏱️',
    color: '#F5A623',
    start: new Date(2025, 0, 1, 0, 0, 0),
    deadline: new Date(2025, 11, 31, 23, 59, 59),
  },
  {
    id: 'phase-l2',
    phase: 'L2',
    label: 'FASE L2',
    description: 'Stopzetting van de tweede productiefase',
    voltage: 'OFFLINE',
    frequency: 'SHUTDOWN',
    icon: '🔌',
    color: '#000000', // Zwart - fase 2
    start: new Date(2025, 10, 5, 0, 0, 0), // 5 november 2025
    deadline: new Date(2026, 0, 31, 23, 59, 59), // 31 januari 2026
  },
  {
    id: 'phase-l3',
    phase: 'L3',
    label: 'FASE L3',
    description: 'Definitieve fabriekssluiting',
    voltage: 'OFFLINE',
    frequency: 'SHUTDOWN',
    icon: '🔌',
    color: '#FF0000', // Rood - fase 3 (kritiek)
    start: new Date(2026, 1, 1, 0, 0, 0), // 1 februari 2026
    deadline: new Date(2026, 3, 30, 23, 59, 59), // 30 april 2026
  },
];

const DEFAULT_INTERVAL_MS = 1000;

const defaultScheduler = (callback) => {
  if (typeof window !== 'undefined' && typeof window.setInterval === 'function') {
    return window.setInterval(callback, DEFAULT_INTERVAL_MS);
  }
  return undefined;
};

const formatUnit = (value, minLength = 2) => String(value).padStart(minLength, '0');

export const formatTimeParts = ({ days, hours, minutes, seconds }) => {
  const paddedDays = formatUnit(days, 2);
  const paddedHours = formatUnit(hours, 2);
  const paddedMinutes = formatUnit(minutes, 2);
  const paddedSeconds = formatUnit(seconds, 2);
  return `${paddedDays}:${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

export const calculateProgress = (now, start, deadline) => {
  const total = deadline.getTime() - start.getTime();
  if (total <= 0) {
    return now.getTime() >= deadline.getTime() ? 100 : 0;
  }

  const elapsed = now.getTime() - start.getTime();
  const percentage = (elapsed / total) * 100;
  return Math.max(0, Math.min(100, percentage));
};

export const computeTimeParts = (deadline, now) => {
  const diff = deadline.getTime() - now.getTime();
  const clampedDiff = Math.max(diff, 0);
  const totalSeconds = Math.floor(clampedDiff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isComplete: diff <= 0,
  };
};

export const buildAriaLabel = (label, parts) => {
  if (parts.isComplete) {
    return `Deadline ${label} is bereikt.`;
  }
  return `Tot de deadline ${label} blijven er ${parts.days} dagen, ${parts.hours} uren, ${parts.minutes} minuten en ${parts.seconds} seconden over.`;
};

export const updateTimerElement = (element, config, now) => {
  if (!element) {
    return;
  }

  const timerDisplay = element.querySelector('[data-time-remaining]');
  const timerContainer = element.querySelector('[role="timer"]');
  const progressFill = element.querySelector('.timer-fill');
  const phaseLabel = element.querySelector('.phase-label');
  const voltageDisplay = element.querySelector('.voltage-display');
  const daysRemaining = element.querySelector('.days-remaining');

  if (!timerDisplay || !timerContainer || !progressFill) {
    return;
  }

  const parts = computeTimeParts(config.deadline, now);
  const formatted = formatTimeParts(parts);
  timerDisplay.textContent = formatted;

  // Aktualizuj dni pozostałe jeśli element istnieje
  if (daysRemaining) {
    daysRemaining.textContent = parts.days;
  }

  // Aktualizuj labelę fazy jeśli istnieje
  if (phaseLabel) {
    phaseLabel.textContent = `${config.icon} ${config.phase}`;
  }

  // Aktualizuj napięcie jeśli istnieje
  if (voltageDisplay) {
    voltageDisplay.textContent = `${config.voltage} ${config.frequency}`;
  }

  const ariaLabel = buildAriaLabel(config.label, parts);
  timerContainer.setAttribute('aria-label', ariaLabel);

  const progress = calculateProgress(now, config.start, config.deadline);
  const formattedProgress = progress.toFixed(2);
  progressFill.style.width = `${formattedProgress}%`;
  progressFill.style.setProperty('--progress', `${formattedProgress}%`);
  progressFill.dataset.progress = formattedProgress;

  // Ustaw kolor fazy
  if (config.color) {
    progressFill.style.setProperty('--phase-color', config.color);
    element.style.setProperty('--phase-color', config.color);
  }
};

export const initCountdownTimers = (
  doc = typeof document !== 'undefined' ? document : undefined,
  {
    nowProvider = () => new Date(),
    scheduler = defaultScheduler,
  } = {},
) => {
  if (!doc) {
    return undefined;
  }

  const activeTimers = TIMER_DEFINITIONS
    .map((config) => {
      const element = doc.querySelector(`[data-deadline-id="${config.id}"]`);
      return element ? { element, config } : null;
    })
    .filter(Boolean);

  if (activeTimers.length === 0) {
    return undefined;
  }

  const updateAll = () => {
    const now = nowProvider();
    activeTimers.forEach(({ element, config }) => {
      updateTimerElement(element, config, now);
    });
  };

  updateAll();

  if (typeof scheduler === 'function') {
    return scheduler(updateAll);
  }

  return undefined;
};

const autoStart = () => {
  if (typeof document === 'undefined') {
    return;
  }

  const startTimers = () => {
    initCountdownTimers(document);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTimers, { once: true });
  } else {
    startTimers();
  }
};

autoStart();

export const __TIMER_DEFINITIONS__ = TIMER_DEFINITIONS;
