import { experimental_createMCPClient } from "ai";
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";

export async function getFetchTool() {
	const transport = new Experimental_StdioMCPTransport({
		command: "uvx",
		args: ["mcp-server-fetch"],
	});

	const clientOne = await experimental_createMCPClient({
		transport,
	});

	return clientOne;
}
