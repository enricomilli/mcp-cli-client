import { experimental_createMCPClient } from "ai";
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";

export async function getBraveSearchTool() {
	const transport = new Experimental_StdioMCPTransport({
		command: "npx",
		args: ["-y", "@modelcontextprotocol/server-brave-search"],
		env: {
			BRAVE_API_KEY: process.env.BRAVE_API_KEY!,
		},
	});

	const clientOne = await experimental_createMCPClient({
		transport,
	});

	return clientOne;
}
