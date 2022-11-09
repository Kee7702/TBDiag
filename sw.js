// listen for requests
self.addEventListener('fetch', function (event) {
  // Get the request
  var request = event.request;
  console.log(event.request);
  // Pass the request to the network
  const responseFromNetwork = fetch(request);
  // Clone the response
  const responseFromNetworkClone = responseFromNetwork.clone()
  // Pass the response back to the browser
  event.respondWith(responseFromNetworkClone);
});
const putInCache = async (request, response) => {
  const cache = await caches.open('testcache');
  await cache.put(request, response);
};

const cacheAndRespond = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};
