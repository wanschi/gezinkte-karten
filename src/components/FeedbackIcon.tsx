interface FeedbackIconProps {
  isCorrect: boolean;
  size?: number;
}

export function FeedbackIcon({ isCorrect, size = 77 }: FeedbackIconProps) {
  if (isCorrect) {
    // Green checkmark icon
    return (
      <div className="relative" style={{ width: size, height: size }}>
        {/* Circle background */}
        <div
          className="absolute rounded-full bg-white"
          style={{ width: size, height: size }}
        />
        {/* Green checkmark */}
        <svg
          className="absolute"
          style={{ width: size, height: size }}
          viewBox="0 0 77 77"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="38.5" cy="38.5" r="38.5" fill="white" />
          <path
            d="M25 38.5L33 46.5L52 27.5"
            stroke="#7fbf5c"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  } else {
    // Red X icon
    return (
      <div className="relative" style={{ width: size, height: size }}>
        {/* Circle background */}
        <div
          className="absolute rounded-full bg-white"
          style={{ width: size, height: size }}
        />
        {/* Red X */}
        <svg
          className="absolute"
          style={{ width: size, height: size }}
          viewBox="0 0 77 77"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="38.5" cy="38.5" r="38.5" fill="white" />
          <line
            x1="28"
            y1="28"
            x2="49"
            y2="49"
            stroke="#bf5c5c"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1="49"
            y1="28"
            x2="28"
            y2="49"
            stroke="#bf5c5c"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }
}

