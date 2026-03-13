{
  "name": "DailyQuote",
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "The quote text"
    },
    "author": {
      "type": "string",
      "description": "Author of the quote"
    },
    "category": {
      "type": "string",
      "enum": [
        "mindfulness",
        "gratitude",
        "strength",
        "peace",
        "self_love",
        "wisdom"
      ],
      "description": "Category of the quote"
    },
    "scheduled_hour": {
      "type": "number",
      "description": "Hour of the day (0-23) when this quote should appear"
    }
  },
  "required": [
    "text",
    "author",
    "category"
  ]
}