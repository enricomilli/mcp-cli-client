import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import * as readline from "readline";
import { getBraveSearchTool } from "./brave-tool";
import { getFetchTool } from "./fetch-tool";
import { getTools } from "./get-tools";

// Create readline interface
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
let cleanup: (() => Promise<void>) | undefined;

const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
});

// Define message structure for chat history
type Message = {
	role: "user" | "assistant";
	content: string;
};

// Initialize tools and start chat
async function startChat() {
	try {
		console.log("Loading tools...");
		const toolsData = await getTools([
			await getBraveSearchTool(),
			await getFetchTool(),
		]);

		cleanup = toolsData.cleanup;
		if (cleanup === undefined) {
			console.error("Cleanup function not found");
			return;
		}

		console.log("\n👋 Welcome to the AI Chat! Type 'exit' to quit.");

		// Initialize chat history
		const chatHistory: Message[] = [];

		// Function to handle each chat turn
		async function chatTurn() {
			rl.question("\nYou: ", async (userInput) => {
				// Check if user wants to exit
				if (userInput.toLowerCase() === "exit") {
					console.log("Goodbye!");
					if (cleanup) {
						await cleanup();
					}
					rl.close();
					return;
				}

				try {
					// Add user message to history
					chatHistory.push({ role: "user", content: userInput });

					process.stdout.write("\nAI: "); // Start the AI line

					let aiResponse = "";

					const stream = streamText({
						// model: google("gemini-2.5-pro-exp-03-25"),
						model: openrouter.languageModel("openrouter/optimus-alpha"),
						system:
							"Your response will be printed in a command line environment. Please do not use markdown.",
						tools: toolsData.tools,
						maxSteps: 20,
						messages: chatHistory, // Include all previous messages but not the current one
					});

					// Process the stream as it comes in
					for await (const chunk of stream.textStream) {
						process.stdout.write(chunk);
						aiResponse += chunk;
					}

					// Add AI response to history
					chatHistory.push({ role: "assistant", content: aiResponse });

					// Add a new line after the response is complete
					process.stdout.write("\n");
				} catch (error) {
					console.error("Error generating response:", error);
				}

				// Continue the chat loop
				chatTurn();
			});
		}

		// Start the chat loop
		chatTurn();
	} catch (error) {
		console.error("Initialization error:", error);
		if (cleanup) {
			await cleanup();
		}
		rl.close();
	}
}

// Handle process termination
process.on("SIGINT", async () => {
	console.log("\nExiting...");
	if (cleanup) {
		await cleanup();
	}
	rl.close();
	process.exit(0);
});

// Start the chat
startChat();
