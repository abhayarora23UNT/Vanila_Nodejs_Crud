import { sendJsonResponse } from '../utils/utils';
import { users } from '../data/users'; // Importing the original users array
import { User } from '../types/user';
import { handleGetRequest } from '../controller/get-request';
import { handleDeleteRequest } from '../controller/delete-request';
import { handlePostRequest } from '../controller/post-request';
import { handlePatchRequest } from '../controller/patch-request';

// Handle API request routing
export const requestHandler = (req: any, res: any) => {
  const { method, url } = req;

  // Create a local copy of the users array
  let USERS: User[] = [...users];
  switch (req.method) {
    case "GET":
      handleGetRequest(req, res,USERS);
      break;
    case "POST":
      handlePostRequest(req, res,USERS);
      break;
    case "PATCH":
      handlePatchRequest(req, res,USERS);
      break;
    case "DELETE":
      handleDeleteRequest(req, res,USERS);
      break;
    default:
      sendJsonResponse(res, 404, { data: null, error: `Route not found` });
  }
};
