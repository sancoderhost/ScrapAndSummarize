# Url summarizer api endpoint 

This is a express js api that takes list of url and summarize it using locall llm using ollama and save result in mongodb.

api endpoint 

```
/api/summarize
```
takes 

```js
{ "urls":[list of urls] 
}
```
### Run the endpoint 

Run the express node api with 

```bash 
npm install 
npm start 
```
### example curl request 

```bash 
curl -X POST \
  'http://localhost:3004/api/summarize' \
  --header 'Content-Type: application/json' \
  --data '{"urls": [
         "https://github.com/ollama/ollama/issues/1005",
	 "https://santhoughts.netlify.app/post/thoughts/",
	 "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose",
	 "https://www.geoffreylitt.com/2019/07/29/browser-extensions"

    ]}' \
  --silent \
  --show-error \
  --write-out '%{http_code}\n'
```

