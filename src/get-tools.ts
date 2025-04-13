import { getPostgresTool } from "./postgres-tool";

// Define a common interface for tool providers
interface ToolProvider {
	tools: () => Promise<Record<string, any>>;
	close: () => Promise<void>;
}

export async function getTools(toolProviders: ToolProvider[]) {
	// Create an array of tool providers - easy to add more tools in the future
	// const toolProviders: ToolProvider[] = [
	// 	await getPostgresTool(),
	// 	// Add more tool providers here as needed
	// 	// await getAnotherTool(),
	// 	// await getYetAnotherTool(),
	// ];

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
