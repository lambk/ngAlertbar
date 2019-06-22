export interface AlertOptions {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  widthMode?: 'full' | 'partial';
}

export interface AlertTrigger {
  message: string;
  options: AlertOptions;
}
