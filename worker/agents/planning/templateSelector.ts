import { MessageRole } from '../inferutils/common';
import { TemplateListResponse} from '../../services/sandbox/sandboxTypes';
import { createLogger } from '../../logger';
import { executeInference } from '../inferutils/infer';
import { InferenceContext } from '../inferutils/config.types';
import { RateLimitExceededError, SecurityError } from 'shared/types/errors';
import { TemplateSelection, TemplateSelectionSchema } from '../../agents/schemas';

const logger = createLogger('TemplateSelector');
interface SelectTemplateArgs {
    env: Env;
    query: string;
    availableTemplates: TemplateListResponse['templates'];
    inferenceContext: InferenceContext;
}

/**
 * Uses AI to select the most suitable template for a given query.
 */
export async function selectTemplate({ env, query, availableTemplates, inferenceContext }: SelectTemplateArgs): Promise<TemplateSelection> {
    if (availableTemplates.length === 0) {
        logger.info("No templates available for selection.");
        return { selectedTemplateName: null, reasoning: "No templates were available to choose from.", useCase: null, complexity: null, styleSelection: null, projectName: '' };
    }

    try {
        logger.info("Asking AI to select a template", { 
            query, 
            queryLength: query.length,
            availableTemplates: availableTemplates.map(t => t.name),
            templateCount: availableTemplates.length 
        });

        const templateDescriptions = availableTemplates.map((t, index) =>
            `- Template #${index + 1} \n Name - ${t.name} \n Language: ${t.language}, Frameworks: ${t.frameworks?.join(', ') || 'None'}\n ${t.description.selection}`
        ).join('\n\n');

        const systemPrompt = `You are an Expert Software Architect at Cloudflare specializing in template selection for rapid development. Your task is to select the most suitable starting template based on user requirements.

## SELECTION EXAMPLES:

**Example 1 - Game Request:**
User: "Build a 2D puzzle game with scoring"
Templates: ["c-code-react-runner", "vite-game-starter", "vite-cf-DO-runner"]
Selection: "vite-game-starter"
complexity: "simple"
Reasoning: "Game starter template provides HTML5 Canvas, game loop, input handling, collision detection, and scoring systems perfect for 2D puzzle games"

**Example 2 - Web3/Blockchain Request:**
User: "Create an NFT marketplace where users can mint and trade NFTs"
Templates: ["c-code-react-runner", "vite-solidity-dapp", "vite-cfagents-runner"]
Selection: "vite-solidity-dapp"
complexity: "moderate"
Reasoning: "Solidity dApp template includes wallet integration (RainbowKit), OpenZeppelin ERC721 contracts, ethers.js for blockchain interaction, perfect for NFT marketplace"

**Example 3 - AI Chat Application:**
User: "Build an AI chatbot with tool calling capabilities"
Templates: ["c-code-react-runner", "vite-cfagents-runner", "vite-cf-DO-runner"]
Selection: "vite-cfagents-runner"
complexity: "simple"
Reasoning: "CF Agents SDK template provides AI Gateway integration, MCP support for tools, and function calling - exactly what's needed for intelligent chatbots"

**Example 4 - Business Dashboard:**
User: "Create an analytics dashboard with charts"
Templates: ["c-code-react-runner", "c-code-next-runner", "vite-cf-DO-runner"]
Selection: "c-code-react-runner"
complexity: "simple"
Reasoning: "React + Vite template is perfect for SPAs and dashboards with client-side data visualization"

**Example 5 - Real-time Multiplayer:**
User: "Build a real-time collaborative whiteboard"
Templates: ["c-code-react-runner", "vite-cf-DO-v2-runner", "vite-cf-DO-runner"]
Selection: "vite-cf-DO-runner"
complexity: "moderate"
Reasoning: "Single Durable Object template provides WebSocket support and stateful real-time features needed for collaboration"

**Example 6 - DeFi Application:**
User: "Create a staking platform for ERC20 tokens"
Templates: ["vite-solidity-dapp", "vite-cf-DO-v2-runner", "c-code-react-runner"]
Selection: "vite-solidity-dapp"
complexity: "complex"
Reasoning: "Solidity dApp template with OpenZeppelin contracts, wallet integration, and smart contract deployment tools - essential for DeFi staking"

**Example 7 - Classic Arcade Game:**
User: "Create a simple SNAKE game"
Templates: ["vite-game-starter", "c-code-react-runner", "vite-cf-DO-runner"]
Selection: "vite-game-starter"
complexity: "simple"
Reasoning: "Game starter template provides HTML5 Canvas, grid-based game logic, collision detection, keyboard input handling, and score tracking - perfect for classic arcade games like Snake, Pac-Man, or Tetris"

## SELECTION CRITERIA:
1. **Feature Alignment** - Templates with similar core functionality
2. **Tech Stack Match** - Compatible frameworks and dependencies  
3. **Architecture Fit** - Similar application structure and patterns
4. **Minimal Modification** - Template requiring least changes

## STYLE GUIDE:
- **Minimalist Design**: Clean, simple interfaces
- **Brutalism**: Bold, raw, industrial aesthetics
- **Retro**: Vintage, nostalgic design elements
- **Illustrative**: Rich graphics and visual storytelling
- **Kid_Playful**: Colorful, fun, child-friendly interfaces

## RULES:
- ALWAYS select a template (never return null)
- Ignore misleading template names - analyze actual features
- Focus on functionality over naming conventions
- Provide clear, specific reasoning for selection`

        const userPrompt = `**User Request:** "${query}"

**Available Templates:**
${templateDescriptions}

**Task:** Select the most suitable template and provide:
1. Template name (exact match from list)
2. Clear reasoning for why it fits the user's needs
3. Appropriate style for the project type. Try to come up with unique styles that might look nice and unique. Be creative about your choices.
4. Descriptive project name

Analyze each template's features, frameworks, and architecture to make the best match.`;

        const messages = [
            { role: "system" as MessageRole, content: systemPrompt },
            { role: "user" as MessageRole, content: userPrompt }
        ];

        const { object: selection } = await executeInference({
            env,
            messages,
            agentActionName: "templateSelection",
            schema: TemplateSelectionSchema,
            context: inferenceContext,
            maxTokens: 2000,
        });


        logger.info(`AI template selection result: ${selection.selectedTemplateName || 'None'}, Reasoning: ${selection.reasoning}`);
        return selection;

    } catch (error) {
        logger.error("Error during AI template selection:", error);
        if (error instanceof RateLimitExceededError || error instanceof SecurityError) {
            throw error;
        }
        // Fallback to no template selection in case of error
        return { selectedTemplateName: null, reasoning: "An error occurred during the template selection process.", useCase: null, complexity: null, styleSelection: null, projectName: '' };
    }
}