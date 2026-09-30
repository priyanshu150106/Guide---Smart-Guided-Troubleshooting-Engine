# AI USAGE DISCLOSURE FORM

**GUIDE — Smart Guided Troubleshooting Engine**

## 1. Team Details
- **Team Name:** GUIDE 
- **Project / Product Name:** GUIDE — Smart Guided Troubleshooting Engine 
- **Organization / Institution (if any):** SRM Institute of Science and Technology (SRMIST) 
- **Submission Date:** 30 September 2026 

## 2. AI Usage Declaration
**Did your team use any Artificial Intelligence (AI) in developing this project?** 
Yes 

AI tools were used as development assistants for project ideation, architecture refinement, code generation/refinement, debugging, documentation, testing support, and UI assistance. Generated outputs were reviewed, adapted, integrated, and constrained by the project implementation. 

## 3. Purpose of AI Usage (Brief Details)
- **Idea generation / brainstorming:** Yes — Used to refine the GUIDE concept, architecture, workflow, and feature scope. 
- **Code generation or assistance:** Yes — Used for assistance with FastAPI/Pydantic schemas, the two-stage orchestration, caching logic, deeplink registry, frontend components, and supporting code. 
- **UI / UX design:** Yes — Used to improve the troubleshooting interface, result presentation, action cards, and demo flow. 
- **Content creation:** Yes — Used for README documentation, architecture explanations, API examples, demo narrative, and presentation/pitch material. 
- **Data analysis:** No — No dataset-driven analysis was required for the implemented prototype. 
- **Testing / debugging:** Yes — Used for debugging assistance, test-case design, syntax checks, and resolving implementation issues. Full runtime pytest/Docker execution was not completed in the development environment. 
- **Other:** AI-assisted code review and repository submission-readiness checks. 

## 4. Feature Origin Classification
**1. Feature Name:** Two-Stage LLM Troubleshooting Pipeline 
**Self-Generated/AI-Generated/Both:** Both 
**Description:** AI tools used: ChatGPT and Antigravity. Prompts were used to refine the two-stage architecture and implementation approach. Output was a Query Enrichment stage followed by a Troubleshooting Planner stage. The implementation was adapted into the project's FastAPI/Pydantic architecture and constrained with strict schemas and validation. 

**2. Feature Name:** Strict Pydantic Troubleshooting Schemas 
**Self-Generated/AI-Generated/Both:** Both 
**Description:** AI assistance was used to structure and review request/response models. The resulting schemas define the normalized query, device information, ordered actions, steps, deeplinks, and metadata. The implementation was reviewed and integrated into the existing Python backend. 

**3. Feature Name:** Deterministic Deeplink Registry 
**Self-Generated/AI-Generated/Both:** Both 
**Description:** AI assistance was used to design the action_id-based registry pattern and validation flow. The implementation keeps deeplink resolution outside the LLM: the model produces an action_id and the deterministic registry maps it to a predefined Android Settings intent. Current mappings are documented as requiring physical Samsung hardware verification. 

**4. Feature Name:** Fast-Path Cache 
**Self-Generated/AI-Generated/Both:** Both 
**Description:** AI assistance was used to design the cache-first request flow and deterministic cache key strategy. The implementation checks the cache before invoking the LLM pipeline and stores validated responses for repeated scenarios. 

**5. Feature Name:** GUIDE Troubleshooting Interface 
**Self-Generated/AI-Generated/Both:** Both 
**Description:** AI tools were used for UI structure and implementation assistance. The frontend was adapted into a dedicated GUIDE interface with device/OS/complaint inputs, diagnosis flow, ordered actions, Settings actions, validation status, cache information, and demo-mode support. 

**6. Feature Name:** Documentation, Tests, and Submission Packaging 
**Self-Generated/AI-Generated/Both:** Both 
**Description:** AI assistance was used to draft and refine README content, architecture documentation, API examples, test scenarios, debugging guidance, and submission checks. Human review was used to ensure the documentation does not claim tests or runtime measurements that were not actually executed. 

## 5. Ethical & Compliance Confirmation
- **AI usage complies with guidelines and policies:** Yes 
- **No proprietary or copyrighted data misused:** I Agree 

The project uses AI as a development and reasoning aid. The final implementation was reviewed and adapted by the project developer. No live credentials or private API keys were included in the repository. The repository documentation also distinguishes implemented functionality from unverified or future functionality. 

## 6. Declaration & Sign-Off
- **Name of Team Representative:** PRIYANSHU RAMAN 
- **Role:** Team Representative / Developer 
- **Signature:** PRIYANSHU RAMAN 
- **Date:** 30 September 2026 
