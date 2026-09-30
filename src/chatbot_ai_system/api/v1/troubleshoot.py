import time
import json
import logging
from fastapi import APIRouter, Depends, Request

from ...config import get_settings, Settings
from ...schemas.troubleshooting import (
    TroubleshootingRequest,
    TroubleshootingResponse,
    DeviceInfo,
    TroubleshootingMetadata
)
from ...orchestration.troubleshooter import Troubleshooter
from ..chat import ProviderFactory, get_cache

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["troubleshooting"]
)

@router.post("/troubleshoot", response_model=TroubleshootingResponse)
async def troubleshoot(
    req: TroubleshootingRequest,
    request: Request,
    settings: Settings = Depends(get_settings)
):
    start_time = time.time()
    request_id = getattr(request.state, "request_id", "local-req-id")

    logger.info("==================================================")
    logger.info("REQUEST")
    logger.info("CACHE LOOKUP")

    # 3. Build a deterministic cache key
    # Using normalized complaint for prototype cache key
    cache_key_base = f"{req.device_model}_{req.os_version}_{req.complaint.strip().lower()}"
    cache_key = f"troubleshoot:{hash(cache_key_base)}"
    
    # 4. Check existing cache
    cache = await get_cache(settings)
    
    if cache:
        cached_data = await cache.get(cache_key)  # type: ignore
        if cached_data:
            # 5. Cache HIT
            logger.info("CACHE HIT / MISS: HIT")
            try:
                response_dict = json.loads(cached_data)
                response = TroubleshootingResponse(**response_dict)
                response.request_id = request_id
                
                latency_ms = (time.time() - start_time) * 1000
                response.metadata.latency_ms = latency_ms
                response.metadata.cache_hit = True
                logger.info("RESPONSE")
                logger.info("==================================================")
                return response
            except Exception as e:
                logger.error(f"Error deserializing cache: {e}")

    # 6. Cache MISS
    logger.info("CACHE HIT / MISS: MISS")
    
    model_name = settings.default_model or "gpt-4o-mini"
    provider = ProviderFactory.create_provider(model_name, settings)
    
    orchestrator = Troubleshooter(provider=provider, model=model_name)
    
    query, valid_actions, cost, validation_status = await orchestrator.run(req)
    
    latency_ms = (time.time() - start_time) * 1000
    
    response = TroubleshootingResponse(
        request_id=request_id,
        query=query,
        device=DeviceInfo(
            model=req.device_model,
            os=req.os_version
        ),
        actions=valid_actions,
        metadata=TroubleshootingMetadata(
            cache_hit=False,
            latency_ms=latency_ms,
            estimated_cost_usd=cost,
            validation=validation_status
        )
    )
    
    
    # Cache final validated response
    if cache:
        try:
            logger.info("CACHE WRITE")
            await cache.set(cache_key, response.model_dump_json())  # type: ignore
        except Exception as e:
            logger.error(f"Failed to write to cache: {e}")
            
    logger.info("RESPONSE")
    logger.info("==================================================")
    return response
