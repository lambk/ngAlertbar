export interface AlertOptions {
  lifeTimeMs?: number;
  showDelayMs?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  widthMode?: 'full' | 'partial';
  closeButton?: boolean;
}

export interface AlertTrigger {
  message: string;
  options: AlertOptions;
}
