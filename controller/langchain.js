const { Ollama } = require("@langchain/community/llms/ollama");
const  { RetrievalQAChain } = require( "langchain/chains");


const ollama = new Ollama({
 baseUrl: "http://localhost:11434", // Default value
 model: "mistral", // Default value
});

/*(async () => {
 const stream = await ollama.stream(`Translate "I love programming" into German.`);

 const chunks = [];
 for await (const chunk of stream) {
    chunks.push(chunk);
 }

 console.log(chunks.join(""));
})();
*/
// Web retrival 
 
const { CheerioWebBaseLoader } = require("langchain/document_loaders/web/cheerio")


const retriever = vectorStore.asRetriever();
const chain = RetrievalQAChain.fromLLM(ollama, retriever);
( async () => {
	const loader = new CheerioWebBaseLoader("https://en.wikipedia.org/wiki/2023_Hawaii_wildfires");
	const data = await loader.load();
	const result = await chain.call({query: "When was Hawaii's request for a major disaster declaration approved?"});

})();
console.log(result.text)
