# GUIDE Architecture

## Problem Statement
Vague customer complaints about device issues (e.g., "my screen flickers and battery dies fast") are difficult to map to precise technical solutions. Existing generic chatbots provide unstructured advice without deterministic, one-tap actions for the user to solve their issue.

## Architecture
GUIDE leverages a 2-stage LLM processing pipeline combined with a deterministic action registry to turn natural language into reliable device actions.

## Stage 1: Query Enrichment
The first stage strictly normalizes the natural language complaint into discrete variables: `normalized_intents`, `symptoms`, `technical_domains`, and `severity`. This bounds the problem space and forces the LLM to structure its understanding before generating actions.

## Stage 2: Troubleshooting Planner
The second stage reads the enriched query and constructs a technical troubleshooting plan. It outputs steps with explicit `action_id` references. It is expressly forbidden from directly constructing deep links to avoid hallucinations.

## Action Registry
A local static deterministic map (`services/deeplink_registry.py`) defines every supported `action_id`. 

## Deeplink Resolution
As the LLM returns `action_id`s, the API traverses the Action Registry to dynamically attach the corresponding Android Intent / URI based on the user's `device_model` and `os_version`. 

## Cache
Redis intercepts queries via a deterministic hash of the device and normalized complaint to bypass the LLM chain entirely, reducing latency from ~1500ms to <15ms.

## Metrics
The API collects `latency_ms`, `cache_hit`, and `estimated_cost_usd` transparently for telemetry.

## Limitations
- Android Settings intents are mapped generically; specific proprietary Samsung deep links are placeholders until physical verification.
- Rate limiting is structurally supported but not strictly enforced in the hackathon prototype.

## Future Roadmap
- Semantic Pinecone Vector search for caching.
- Conversational follow-ups for diagnostic clarifications.
