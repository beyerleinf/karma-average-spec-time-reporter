export interface Browsers {
  browsers: Browser[];
}

export interface Browser {
  id: string;
  fullName: string;
  name: string;
  lastResult: LastBrowserResult;
}

export interface LastBrowserResult {
  success: number;
  failed: number;
  skipped: number;
  total: number;
  totalTime: number;
  netTime: number;
  startTime: number;
  error: boolean;
  disconnected: boolean;
}

export interface SpecResult {
  fullName: string;
  description: string;
  id: string;
  skipped: boolean;
  disabled: boolean;
  pending: boolean;
  success: boolean;
  suite: string[];
  time: number;
  executedExpectationsCount: number;
}
