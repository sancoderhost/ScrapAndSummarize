const { Ollama } = require("@langchain/community/llms/ollama");
const  { loadSummarizationChain } = require("langchain/chains");

//const { WebBaseLoader } = require('langchain/document_loaders/web/base');

const  { PuppeteerWebBaseLoader } =  require("langchain/document_loaders/web/puppeteer");

( async () => {
	const loader = new WebBaseLoader("https://santhoughts.netlify.app/post/art_of_mind_body/") 

	let docs = await loader.load();
	const llm = new Ollama({ model: "mistral", temperature: 0, callbackManager: new CallbackManager([new StreamingStdOutCallbackHandler()]) });

	const chain = loadSummarizationChain(llm, { chainType: "stuff" });

	let summary = await chain.run(docs);
	console.log(summary);
})();


