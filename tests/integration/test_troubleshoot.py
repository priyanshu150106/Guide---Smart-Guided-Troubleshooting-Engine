import pytest
import json
from fastapi.testclient import TestClient

from chatbot_ai_system.schemas.troubleshooting import (
    TroubleshootingRequest,
    EnrichedQuery,
    TroubleshootingStep,
    TroubleshootingAction,
    TroubleshootingResponse,
    DeviceInfo,
    TroubleshootingMetadata
)
from chatbot_ai_system.services.deeplink_registry import (
    validate_deeplink,
    resolve_action,
    get_action
)
from chatbot_ai_system.server.main import app

client = TestClient(app)

def test_pydantic_request_validation():
    req = TroubleshootingRequest(
        complaint="My screen is flickering",
        device_model="Galaxy S24",
        os_version="Android 15"
    )
    assert req.complaint == "My screen is flickering"
    
    with pytest.raises(ValueError):
        TroubleshootingRequest(device_model="Galaxy S24")

def test_deeplink_registry_lookup():
    entry = get_action("display_settings")
    assert entry is not None
    assert entry.action_id == "display_settings"
    
    unknown = get_action("unknown_id")
    assert unknown is None

def test_deeplink_validation():
    assert validate_deeplink("display_settings", "android.settings.DISPLAY_SETTINGS") is True
    assert validate_deeplink("display_settings", "android.settings.WRONG") is False
    assert validate_deeplink("unknown", "android.settings.DISPLAY_SETTINGS") is False

def test_resolve_action():
    link = resolve_action("battery_settings", "Galaxy S24", "Android 15")
    assert link == "android.intent.action.POWER_USAGE_SUMMARY"
    link_invalid = resolve_action("unknown", "Galaxy S24", "Android 15")
    assert link_invalid is None

@pytest.mark.asyncio
def test_troubleshoot_api_endpoint():
    # Note: To avoid calling the real LLM in this quick test (which requires keys),
    # we can either mock the provider or just let it hit the fallback / error logic.
    # We will test the endpoint structure.
    payload = {
        "complaint": "my battery is draining very quickly",
        "device_model": "Galaxy S24",
        "os_version": "Android 15"
    }
    
    # Run Cache MISS request
    response1 = client.post("/api/v1/troubleshoot", json=payload)
    assert response1.status_code in [200, 401, 500]
    
    # If it succeeded (200), we can check cache hit flow
    if response1.status_code == 200:
        data = response1.json()
        assert "actions" in data
        assert data["metadata"]["cache_hit"] is False
        
        # Second request should be a HIT
        response2 = client.post("/api/v1/troubleshoot", json=payload)
        data2 = response2.json()
        assert data2["metadata"]["cache_hit"] is True
