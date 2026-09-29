# GUIDE API Examples

## Example 1: Battery Drain

**Request:**
```json
{
  "complaint": "my battery is draining very quickly",
  "device_model": "Galaxy S24",
  "os_version": "Android 15"
}
```

**Response (Example Values):**
```json
{
  "request_id": "req_123",
  "query": {
    "normalized_intents": ["rapid_battery_drain"],
    "symptoms": ["battery_drain"],
    "technical_domains": ["battery"],
    "severity": "medium",
    "original_complaint": "my battery is draining very quickly"
  },
  "device": {
    "model": "Galaxy S24",
    "os": "Android 15"
  },
  "actions": [
    {
      "action_id": "battery_settings",
      "priority": 1,
      "title": "Check battery settings",
      "rationale": "High battery drain investigation",
      "steps": [
        {
          "step": 1,
          "instruction": "Open Battery settings",
          "action_id": "battery_settings",
          "deeplink": "android.intent.action.POWER_USAGE_SUMMARY",
          "deeplink_valid": true
        }
      ]
    }
  ],
  "metadata": {
    "cache_hit": false,
    "latency_ms": 1450.0,
    "estimated_cost_usd": 0.015,
    "validation": "passed"
  }
}
```

## Example 2: Invalid Action Rejected

**Request:**
```json
{
  "complaint": "my screen keeps flickering",
  "device_model": "Galaxy S24",
  "os_version": "Android 15"
}
```

**Response (Example Values):**
```json
{
  "request_id": "req_456",
  "query": {
    "normalized_intents": ["display_flickering"],
    "symptoms": ["screen_flicker"],
    "technical_domains": ["display"],
    "severity": "high",
    "original_complaint": "my screen keeps flickering"
  },
  "device": {
    "model": "Galaxy S24",
    "os": "Android 15"
  },
  "actions": [
    {
      "action_id": "unknown_action_xyz",
      "priority": 1,
      "title": "Simulated Invalid Action",
      "rationale": "Testing safety mechanism",
      "steps": [
        {
          "step": 1,
          "instruction": "Open Unknown settings",
          "action_id": "unknown_action_xyz",
          "deeplink": null,
          "deeplink_valid": false
        }
      ]
    }
  ],
  "metadata": {
    "cache_hit": true,
    "latency_ms": 12.0,
    "estimated_cost_usd": 0.00,
    "validation": "passed"
  }
}
```
