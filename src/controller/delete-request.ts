import { User } from '../types/user';
import { sendJsonResponse } from '../utils/utils';

export const handleDeleteRequest = (req: any, res: any, USERS: User[]) => {
    // Split the URL into parts and extract userId
    const urlParts = req.url.split("/");
    const userId = urlParts[3];  // Extract userId from URL (index 3 for /api/users/{userId})

    const regexV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;  // UUID regex

    // Early validation of userId and its format
    if (!userId || !regexV4.test(userId)) {
        return res.statusCode = 400, sendJsonResponse(res, 400, {
            data: null,
            error: {
                title: "Validation Failed",
                message: "UUID is not valid"
            }
        });
    }

    // Find user by ID
    const userIndex = USERS.findIndex(user => user.id === userId);

    // If user is not found
    if (userIndex === -1) {
        const response = { data: null, error: `User with id ${userId} doesn't exist` };
        return sendJsonResponse(res, 404, response);
    }

    // Remove user and respond with success
    USERS.splice(userIndex, 1);

    return res.statusCode = 200, sendJsonResponse(res, 200, {
        data: { success: true },
        error: null
    });
};
