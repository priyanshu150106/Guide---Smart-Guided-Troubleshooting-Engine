from typing import Dict, Optional
from pydantic import BaseModel

class RegistryEntry(BaseModel):
    action_id: str
    title: str
    android_settings_intent: str

_REGISTRY: Dict[str, RegistryEntry] = {
    "display_settings": RegistryEntry(
        action_id="display_settings",
        title="Check display settings",
        android_settings_intent="android.settings.DISPLAY_SETTINGS"
    ),
    "battery_settings": RegistryEntry(
        action_id="battery_settings",
        title="Check battery settings",
        android_settings_intent="android.intent.action.POWER_USAGE_SUMMARY"
    ),
    "wifi_settings": RegistryEntry(
        action_id="wifi_settings",
        title="Check Wi-Fi settings",
        android_settings_intent="android.settings.WIFI_SETTINGS"
    ),
    "bluetooth_settings": RegistryEntry(
        action_id="bluetooth_settings",
        title="Check Bluetooth settings",
        android_settings_intent="android.settings.BLUETOOTH_SETTINGS"
    ),
    "storage_settings": RegistryEntry(
        action_id="storage_settings",
        title="Check storage settings",
        android_settings_intent="android.settings.INTERNAL_STORAGE_SETTINGS"
    ),
    "sound_settings": RegistryEntry(
        action_id="sound_settings",
        title="Check sound settings",
        android_settings_intent="android.settings.SOUND_SETTINGS"
    )
}

def get_action(action_id: str) -> Optional[RegistryEntry]:
    return _REGISTRY.get(action_id)

def resolve_action(action_id: str, device_model: Optional[str], os_version: Optional[str]) -> Optional[str]:
    """
    Returns the resolved deeplink string if possible.
    In the prototype, we fall back to generic Android settings intents.
    """
    entry = _REGISTRY.get(action_id)
    if not entry:
        return None
    return entry.android_settings_intent

def validate_deeplink(action_id: str, deeplink: Optional[str]) -> bool:
    """
    Validates if a deeplink is correct for the action_id.
    """
    if not deeplink:
        return False
    entry = _REGISTRY.get(action_id)
    if not entry:
        return False
    # If the resolved link matches our known valid link exactly
    return deeplink == entry.android_settings_intent
