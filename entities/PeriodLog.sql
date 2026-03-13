{
  "name": "PeriodLog",
  "type": "object",
  "properties": {
    "date": {
      "type": "string",
      "format": "date",
      "description": "Date of the log entry"
    },
    "flow": {
      "type": "string",
      "enum": [
        "light",
        "medium",
        "heavy",
        "spotting"
      ],
      "description": "Flow intensity"
    },
    "symptoms": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Symptoms experienced"
    },
    "mood": {
      "type": "string",
      "enum": [
        "happy",
        "calm",
        "irritable",
        "sad",
        "anxious",
        "energetic",
        "tired"
      ],
      "description": "Overall mood"
    },
    "notes": {
      "type": "string",
      "description": "Additional notes"
    },
    "is_period_day": {
      "type": "boolean",
      "description": "Whether this is a period day"
    },
    "cycle_day": {
      "type": "number",
      "description": "Day of the current cycle"
    }
  },
  "required": [
    "date",
    "is_period_day"
  ]
}