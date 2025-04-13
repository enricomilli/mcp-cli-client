import { experimental_createMCPClient } from "ai";
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";

export async function getPostgresTool() {
	const transport = new Experimental_StdioMCPTransport({
		command: "npx",
		args: [
			"-y",
			"mcp-postgres-full-access",
			"postgresql://postgres:postgres@127.0.0.1:54322/postgres",
		],
		env: {
			TRANSACTION_TIMEOUT_MS: "60000",
			MAX_CONCURRENT_TRANSACTIONS: "5",
			PG_STATEMENT_TIMEOUT_MS: "30000",
		},
	});

	const clientOne = await experimental_createMCPClient({
		transport,
	});

	return clientOne;
}
