import { experimental_createMCPClient } from "ai";
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";

export async function getOxylabsScraperTool() {
	const transport = new Experimental_StdioMCPTransport({
		command: "uvx",
		args: ["oxylabs-mcp"],
		env: {
			OXYLABS_USERNAME: process.env.OXYLABS_USERNAME!,
			OXYLABS_PASSWORD: process.env.OXYLABS_PASSWORD!,
		},
	});

	const clientOne = await experimental_createMCPClient({
		transport,
	});

	return clientOne;
}
