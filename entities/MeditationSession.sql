{
  "name": "MeditationSession",
  "type": "object",
  "properties": {
    "duration_minutes": {
      "type": "number",
      "description": "Duration of the meditation session in minutes"
    },
    "session_type": {
      "type": "string",
      "enum": [
        "guided",
        "breathing",
        "body_scan",
        "mindfulness",
        "loving_kindness",
        "unguided"
      ],
      "description": "Type of meditation"
    },
    "mood_before": {
      "type": "string",
      "enum": [
        "stressed",
        "anxious",
        "neutral",
        "calm",
        "happy"
      ],
      "description": "Mood before meditation"
    },
    "mood_after": {
      "type": "string",
      "enum": [
        "stressed",
        "anxious",
        "neutral",
        "calm",
        "happy"
      ],
      "description": "Mood after meditation"
    },
    "notes": {
      "type": "string",
      "description": "Optional notes about the session"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Date of the session"
    }
  },
  "required": [
    "duration_minutes",
    "session_type",
    "date"
  ]
}