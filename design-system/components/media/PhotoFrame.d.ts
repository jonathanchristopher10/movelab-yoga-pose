import * as React from 'react';

export interface PhotoFrameProps {
  /** Data URL or image path of the captured still; omit for the empty black frame */
  photo?: string;
  /** 0-100, shown inside the sage ring bottom-right */
  score: number;
  /** Path to the MoveLab wordmark, shown inverted bottom-left */
  logo?: string;
  /** Unused in the current layout; kept for callers that pass it */
  poseName?: string;
}
export declare function PhotoFrame(props: PhotoFrameProps): JSX.Element;
