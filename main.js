const { Worker, isMainThread, parentPort } = require('worker_threads');
const fs = require('fs');

if (isMainThread) {
  // Main thread
  /*
   const urls = [
	    'https://blog.research.google/2024/01/mobilediffusion-rapid-text-to-image.html',
	    'https://en.wikipedia.org/wiki/Raven',
	    'https://santhoughts.netlify.app/post/dreams/',
  ];
*/
  const fileContent = fs.readFileSync('links.txt', 'utf-8');
  const urls = fileContent.trim().split('\n');
  // Split the URLs for each worker
  const chunkSize = Math.ceil(urls.length / 4);
  const urlChunks = Array.from({ length: 4 }, (_, index) =>
    urls.slice(index * chunkSize, (index + 1) * chunkSize)
  );

  // Create worker threads
  const workers = [];
  for (const chunk of urlChunks) {
    const worker = new Worker('./worker.js', { workerData: chunk });

    // Add error event listener
    worker.on('error', (error) => {
      console.error('Worker error:', error);
    });

    workers.push(worker);
  }

  // Collect results from workers
  const results = [];
  for (const worker of workers) {
    worker.on('message', (result) => {
      results.push(...result);
      if (results.length === urls.length) {
        // All workers have finished
        console.log('Scraping done:', results);
	const finalResult = JSON.stringify(results, null, 2);
	fs.writeFileSync('scraped_results.json', finalResult, 'utf-8');
      }
    });
  }
}

