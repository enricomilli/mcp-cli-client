
// Define a common interface for tool providers
interface ToolProvider {
    tools: () => Promise<Record<string, any>>;
    close: () => Promise<void>;
}

export async function getTools(toolProviders: ToolProvider[]) {

    // Collect all tools by combining their individual tool objects
    let combinedTools = {};
    for (const provider of toolProviders) {
        const providerTools = await provider.tools();
        combinedTools = { ...combinedTools, ...providerTools };
    }

    // Return both the tools and a cleanup function
    return {
        tools: combinedTools,
        cleanup: async () => {
            // Call close() on all tool providers
            await Promise.all(toolProviders.map((provider) => provider.close()));
        },
    };
}
