import http, { IncomingMessage, ServerResponse } from 'http';
import { requestHandler } from './handlers/handler-service';

const PORT = process.env.PORT || 8000;

// Start the server
const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    requestHandler(req, res);
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid JSON ' + error }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
