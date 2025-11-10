# AI Agent Workflow Log

## Agents Used
- Cursor Agent (GPT-5)
- GitHub Copilot (inline completions)

## Prompts & Outputs
- Example 1 (Use-case skeletons):
  - Prompt: "Create hexagonal architecture use-case for computing Compliance Balance using Target − Actual intensity and fuel energy scope."
  - Output (excerpt):
    ```ts
    export class ComputeCB {
      constructor(private repo: ComplianceRepo) {}
      async execute(input: { actual: number; target: number; energyMJ: number; shipId: string; year: number }) {
        const cb = (input.target - input.actual) * input.energyMJ;
        await this.repo.saveSnapshot({ shipId: input.shipId, year: input.year, cb });
        return cb;
      }
    }
    ```
- Example 2 (Refinement):
  - Prompt: "Refactor pool allocation: greedy from surplus to deficit, enforcing constraints."
  - Output: Produced iterative loop; I corrected descending sort and constraint guards for not making surplus negative and not worsening deficit ships.

## Validation / Corrections
- Verified formulas with unit tests (`ComputeCB`, `ComputeComparison`).
- Corrected baseline selection to ensure single baseline at a time.
- Ensured banking apply respects `amount ≤ available`.
- Pooling validated `Σ adjustedCB ≥ 0`, non-worsening for deficit ships, and non-negative exit for surplus ships.

## Observations
- Where agent saved time:
  - Generating repeatable TypeScript boilerplate for ports and adapters.
  - Stubbing HTTP controllers and request DTOs.
  - Tailwind UI shell and tab layout.
- Where it failed or hallucinated:
  - Occasionally proposed importing non-existent helper utilities.
  - Needed manual correction for type names and strict TS options.
- How tools combined effectively:
  - Used Cursor Agent for broader multi-file scaffolding.
  - Used Copilot for small in-file completions and props typing.

## Best Practices Followed
- Kept domain core free of framework imports.
- Implemented in-memory adapter for fast dev/tests; scaffolded Prisma/Postgres for production.
- Wrote unit tests on use-cases.
- Frontend uses infrastructure adapter for API, UI adapter for React components.



