import { ServerResponse } from 'http';

import { parseRequestBody, sendJsonResponse } from '../utils/utils';
import { User } from '../types/user';

export const handlePatchRequest = async (req: any, res: ServerResponse, USERS: User[]) => {
    const urlParts = req.url.split("/");
    const userId = urlParts[3];  // Extract userId from the URL (index 3 for /api/users/{userId})

    const regexV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;  // UUID regex

    // Early validation of userId and its format
    if (!userId || !regexV4.test(userId)) {
        return res.statusCode = 400, res.end(JSON.stringify({
            title: "Validation Failed",
            message: "UUID is not valid"
        }));
    }
    const body = await parseRequestBody(req);
    const { hobbies }: { hobbies: string[] } = body;
    // Validate if hobbies is an array
    if (!Array.isArray(hobbies)) {
        return res.statusCode = 400, res.end(JSON.stringify({
            title: "Validation Failed",
            message: "Hobbies must be an array."
        }));
    }


    const user = USERS.find((user) => user.id === userId);

    if (!user) {
        const response = { data: null, error: `User with id ${userId} doesn't exist` };
        return sendJsonResponse(res, 404, response);
    }

    // Update hobbies - ensure duplicates are removed
    user.hobbies = [...new Set([...user.hobbies, ...hobbies])];

    const response = {
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            links: {
                self: `/api/users/${user.id}`,
                hobbies: `/api/users/${user.id}/hobbies`,
            },
        },
        error: null,  // No error if hobbies are successfully updated
    };

    sendJsonResponse(res, 200, response);
};