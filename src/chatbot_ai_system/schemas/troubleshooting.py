from typing import List, Optional
from pydantic import BaseModel, Field

class TroubleshootingRequest(BaseModel):
    complaint: str = Field(..., description="Raw user complaint")
    device_model: Optional[str] = Field(None, description="Device model, e.g. Galaxy S24")
    os_version: Optional[str] = Field(None, description="OS version, e.g. Android 15")
    locale: Optional[str] = Field(None, description="Locale language code, e.g. en-US")

class EnrichedQuery(BaseModel):
    normalized_intents: List[str]
    symptoms: List[str]
    technical_domains: List[str]
    severity: str
    original_complaint: str

class DeviceInfo(BaseModel):
    model: Optional[str] = None
    os: Optional[str] = None

class TroubleshootingStep(BaseModel):
    step: int
    instruction: str
    action_id: str
    deeplink: Optional[str] = None
    deeplink_valid: bool = False

class TroubleshootingAction(BaseModel):
    action_id: str
    priority: int
    title: str
    rationale: Optional[str] = None
    steps: List[TroubleshootingStep]

class TroubleshootingMetadata(BaseModel):
    cache_hit: bool
    latency_ms: float
    estimated_cost_usd: Optional[float] = None
    validation: str

class TroubleshootingResponse(BaseModel):
    request_id: str
    query: EnrichedQuery
    device: DeviceInfo
    actions: List[TroubleshootingAction]
    metadata: TroubleshootingMetadata
