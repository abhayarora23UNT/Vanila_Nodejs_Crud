import { sendJsonResponse } from '../utils/utils';
import { User } from '../types/user';

const regexV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;  // UUID regex

// Utility function to validate UUID
const isValidUuid = (id: string): boolean => regexV4.test(id);

// Utility function to find user by ID
const findUserById = (id: string, users: User[]) => users.find(user => user.id === id);

// Function to handle the GET request based on URL and request type
export const handleGetRequest = (req: any, res: any, USERS: User[]) => {
    const { url, method } = req;
    const urlParts = url?.split('/');
    const baseUrl = urlParts[1];
    const userId = urlParts[3];

    if (method !== 'GET' || baseUrl !== 'api') {
        sendJsonResponse(res, 404, { data: null, error: 'Route not found' });
        return;
    }

    // Handle GET /api/users
    if (url === '/api/users') {
        const response = {
            data: USERS.map(user => ({
                user: { id: user.id, name: user.name, email: user.email },
                links: {
                    self: `/api/users/${user.id}`,
                    hobbies: `/api/users/${user.id}/hobbies`,
                },
            })),
            error: null,
        };
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return sendJsonResponse(res, 200, response);
    }

    // Handle GET /api/users/{id} (user details)
    if (url?.startsWith('/api/users/') && url?.split('/').length === 4 && isValidUuid(userId)) {
        const user = findUserById(userId, USERS);
        if (!user) {
            return sendJsonResponse(res, 404, { data: null, error: `User with id ${userId} doesn't exist` });
        }

        const response = {
            data: {
                user: { id: user.id, name: user.name, email: user.email },
                links: {
                    self: `/api/users/${user.id}`,
                    hobbies: `/api/users/${user.id}/hobbies`,
                },
            },
            error: null,
        };
        res.setHeader('Cache-Control', 'private, max-age=3600');
        return sendJsonResponse(res, 200, response);
    }

    // Handle GET /api/users/{id}/hobbies (user hobbies)
    if (url?.startsWith('/api/users/') && url?.endsWith('/hobbies') && isValidUuid(userId)) {
        const user = findUserById(userId, USERS);

        if (!user) {
            const response = { data: null, error: `User with id ${userId} doesn't exist` };
            return sendJsonResponse(res, 404, response);
        }

        const response = {
            data: {
                hobbies: user.hobbies || [],  // Return empty array if no hobbies
                links: {
                    self: `/api/users/${user.id}/hobbies`,
                    user: `/api/users/${user.id}`,
                },
            },
            error: null,
        };
        res.setHeader('Cache-Control', 'private, max-age=3600');
        return sendJsonResponse(res, 200, response);
    }

    // If no route matches
    sendJsonResponse(res, 404, { data: null, error: 'Route not found' });
};
