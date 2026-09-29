import json
import logging
from typing import List, Tuple

from ..providers.base import BaseProvider, ChatMessage
from ..schemas.troubleshooting import (
    TroubleshootingRequest, 
    TroubleshootingAction, 
    TroubleshootingStep, 
    EnrichedQuery
)
from ..services.deeplink_registry import get_action, resolve_action, validate_deeplink

logger = logging.getLogger(__name__)

class Troubleshooter:
    def __init__(self, provider: BaseProvider, model: str = "gpt-4o-mini"):
        self.provider = provider
        self.model = model

    def _extract_json(self, content: str) -> dict:
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
        return json.loads(content)

    async def _stage1_query_enrichment(self, request: TroubleshootingRequest) -> Tuple[EnrichedQuery, float]:
        logger.info("STAGE 1: QUERY ENRICHMENT")
        prompt = (
            "You are a Samsung Technical Analyst. Analyze the user complaint and enrich it.\n"
            "You MUST output exactly valid JSON matching the following schema:\n"
            "{\n"
            '  "normalized_intents": ["string"],\n'
            '  "symptoms": ["string"],\n'
            '  "technical_domains": ["string"],\n'
            '  "severity": "low|medium|high|critical",\n'
            '  "original_complaint": "string"\n'
            "}"
        )
        
        messages = [
            ChatMessage(role="system", content=prompt),
            ChatMessage(role="user", content=f"Device: {request.device_model}\nOS: {request.os_version}\nComplaint: {request.complaint}")
        ]
        
        # In a real scenario we'd use the cost estimator from providers.catalog.
        # We'll use a mocked estimate here, or try to get it if usage is populated.
        response = await self.provider.chat(messages=messages, model=self.model, temperature=0.0)
        
        try:
            data = self._extract_json(response.content)
            enriched_query = EnrichedQuery(**data)
            cost = 0.005 # Rough estimate
            return enriched_query, cost
        except Exception as e:
            logger.error(f"Stage 1 JSON parsing/validation failed: {e}")
            # Fallback
            return EnrichedQuery(
                normalized_intents=["general_issue"],
                symptoms=["unknown"],
                technical_domains=["system"],
                severity="medium",
                original_complaint=request.complaint
            ), 0.005

    async def _stage2_troubleshooting_planner(self, query: EnrichedQuery, request: TroubleshootingRequest) -> Tuple[List[TroubleshootingAction], float]:
        logger.info("STAGE 2: TROUBLESHOOTING PLANNER")
        # Note: We do not pass deep links to the LLM. It generates action_ids.
        
        prompt = (
            "You are a Troubleshooting Planner. Given enriched intents, plan steps.\n"
            "You MUST output exactly valid JSON containing an 'actions' list:\n"
            "{\n"
            '  "actions": [\n'
            '    {\n'
            '      "action_id": "display_settings",\n'
            '      "priority": 1,\n'
            '      "title": "Action title",\n'
            '      "rationale": "Why this action",\n'
            '      "steps": [\n'
            '        {"step": 1, "instruction": "instruction", "action_id": "display_settings"}\n'
            '      ]\n'
            '    }\n'
            '  ]\n'
            "}\n"
            "IMPORTANT: Do NOT generate deeplinks. Only use standard action_ids like battery_settings, display_settings, wifi_settings, etc."
        )
        
        messages = [
            ChatMessage(role="system", content=prompt),
            ChatMessage(role="user", content=f"Intents: {query.normalized_intents}\nDevice: {request.device_model}\nSymptoms: {query.symptoms}")
        ]
        
        response = await self.provider.chat(messages=messages, model=self.model, temperature=0.0)
        
        actions = []
        try:
            data = self._extract_json(response.content)
            raw_actions = data.get("actions", [])
            
            # PHASE 4: Resolution + Validation
            logger.info("ACTION REGISTRY")
            for raw_act in raw_actions:
                aid = raw_act.get("action_id")
                
                # 1. Verify action_id exists
                registry_entry = get_action(aid)
                if not registry_entry:
                    logger.warning(f"Unknown action_id rejected: {aid}")
                    continue
                    
                steps = []
                logger.info("DEEPLINK RESOLUTION")
                for s in raw_act.get("steps", []):
                    step_aid = s.get("action_id")
                    
                    # 2. Resolve action_id
                    resolved_deeplink = resolve_action(step_aid, request.device_model, request.os_version)
                    
                    # 4. Validate the deeplink
                    logger.info("VALIDATION")
                    is_valid = validate_deeplink(step_aid, resolved_deeplink)
                    
                    # 3. & 5. Attach and set valid status
                    steps.append(TroubleshootingStep(
                        step=s.get("step"),
                        instruction=s.get("instruction"),
                        action_id=step_aid,
                        deeplink=resolved_deeplink if is_valid else None,
                        deeplink_valid=is_valid
                    ))
                
                actions.append(TroubleshootingAction(
                    action_id=aid,
                    priority=raw_act.get("priority", 1),
                    title=registry_entry.title,
                    rationale=raw_act.get("rationale"),
                    steps=steps
                ))
        except Exception as e:
            logger.error(f"Stage 2 JSON parsing/validation failed: {e}")
            
        cost = 0.01
        return actions, cost

    async def run(self, request: TroubleshootingRequest) -> Tuple[EnrichedQuery, List[TroubleshootingAction], float, str]:
        total_cost = 0.0
        
        query, c1 = await self._stage1_query_enrichment(request)
        total_cost += c1
        
        actions, c2 = await self._stage2_troubleshooting_planner(query, request)
        total_cost += c2
        
        validation_status = "passed" if actions else "failed_or_empty"
        
        return query, actions, total_cost, validation_status
