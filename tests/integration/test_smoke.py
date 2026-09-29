import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from chatbot_ai_system.server.main import app

client = TestClient(app)

@pytest.mark.asyncio
async def test_guide_smoke_pipeline():
    # Mock the entire provider to simulate the 2-stage LLM output deterministically.
    with patch("chatbot_ai_system.api.v1.troubleshoot.ProviderFactory.create_provider") as mock_factory:
        mock_provider = AsyncMock()
        mock_factory.return_value = mock_provider
        
        # We need two responses: Stage 1 and Stage 2
        # Stage 1 response
        stage1_json = '''
        {
          "normalized_intents": ["rapid_battery_drain"],
          "symptoms": ["battery_drain"],
          "technical_domains": ["battery"],
          "severity": "medium",
          "original_complaint": "my battery is draining very quickly"
        }
        '''
        
        # Stage 2 response
        stage2_json = '''
        {
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
                  "action_id": "battery_settings"
                }
              ]
            }
          ]
        }
        '''
        
        # Configure the side_effect for the two sequential calls to chat()
        class FakeResponse:
            def __init__(self, content):
                self.content = content
        
        mock_provider.chat.side_effect = [
            FakeResponse(stage1_json),
            FakeResponse(stage2_json)
        ]
        
        payload = {
            "complaint": "my battery is draining very quickly",
            "device_model": "Galaxy S24",
            "os_version": "Android 15"
        }
        
        # Call the endpoint
        response = client.post("/api/v1/troubleshoot", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure (Task 8)
        assert "request_id" in data
        assert "query" in data
        assert data["query"]["normalized_intents"] == ["rapid_battery_drain"]
        
        assert "device" in data
        assert data["device"]["model"] == "Galaxy S24"
        
        assert "actions" in data
        assert len(data["actions"]) == 1
        action = data["actions"][0]
        assert action["action_id"] == "battery_settings"
        
        # Verify Deeplink Registry Resolution and Safety (Task 7)
        assert len(action["steps"]) == 1
        step = action["steps"][0]
        assert step["deeplink"] == "android.intent.action.POWER_USAGE_SUMMARY"
        assert step["deeplink_valid"] is True
        
        # Verify Metadata
        assert "metadata" in data
        assert data["metadata"]["cache_hit"] is False
        assert data["metadata"]["validation"] == "passed"
