export type TroubleshootingRequest = {
  complaint: string;
  device_model?: string;
  os_version?: string;
  locale?: string;
};

export type EnrichedQuery = {
  normalized_intents: string[];
  symptoms: string[];
  technical_domains: string[];
  severity: string;
  original_complaint: string;
};

export type TroubleshootingStep = {
  step: number;
  instruction: string;
  action_id: string;
  deeplink: string | null;
  deeplink_valid: boolean;
};

export type TroubleshootingAction = {
  action_id: string;
  priority: number;
  title: string;
  rationale?: string;
  steps: TroubleshootingStep[];
};

export type TroubleshootingResponse = {
  request_id: string;
  query: EnrichedQuery;
  device: { model?: string; os?: string };
  actions: TroubleshootingAction[];
  metadata: {
    cache_hit: boolean;
    latency_ms: number;
    estimated_cost_usd?: number;
    validation: string;
  };
};

const DEMO_RESPONSE: TroubleshootingResponse = {
  request_id: "demo_req_123",
  query: {
    normalized_intents: ["display_flickering", "rapid_battery_drain"],
    symptoms: ["screen_flickering", "rapid_battery_consumption"],
    technical_domains: ["display", "battery"],
    severity: "medium",
    original_complaint: "My screen flickers and my battery dies fast",
  },
  device: {
    model: "Galaxy S24",
    os: "Android 15",
  },
  actions: [
    {
      action_id: "display_settings",
      priority: 1,
      title: "Check display settings",
      rationale: "Investigate display configuration related to flickering.",
      steps: [
        {
          step: 1,
          instruction: "Open Display settings",
          action_id: "display_settings",
          deeplink: "android.settings.DISPLAY_SETTINGS",
          deeplink_valid: true,
        },
      ],
    },
    {
      action_id: "battery_settings",
      priority: 2,
      title: "Check battery settings",
      rationale: "High battery drain can be investigated in Battery settings.",
      steps: [
        {
          step: 1,
          instruction: "Open Battery settings",
          action_id: "battery_settings",
          deeplink: "android.intent.action.POWER_USAGE_SUMMARY",
          deeplink_valid: true,
        },
      ],
    },
    {
      action_id: "invalid_action",
      priority: 3,
      title: "Simulated Invalid Action",
      rationale: "This shows how invalid deeplinks are handled.",
      steps: [
        {
          step: 1,
          instruction: "Open Unresolvable settings",
          action_id: "invalid_action",
          deeplink: null,
          deeplink_valid: false,
        },
      ],
    }
  ],
  metadata: {
    cache_hit: false,
    latency_ms: 1450.2,
    estimated_cost_usd: 0.015,
    validation: "passed",
  },
};

export const guideApi = {
  troubleshoot: async (req: TroubleshootingRequest): Promise<TroubleshootingResponse> => {
    if (process.env.NEXT_PUBLIC_GUIDE_DEMO_MODE === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DEMO_RESPONSE), 1500);
      });
    }

    const response = await fetch('/api/v1/troubleshoot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    return await response.json();
  }
};
