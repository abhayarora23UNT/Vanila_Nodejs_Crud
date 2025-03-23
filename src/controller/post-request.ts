

import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';

import { parseRequestBody, sendJsonResponse } from '../utils/utils';
import { User } from '../types/user';

export const handlePostRequest = async (req: any, res: ServerResponse, USERS: User[]) => {
    const body = await parseRequestBody(req);
    const { name, email }: { name: string, email: string } = body;
    const newUser = {
        id: uuidv4(),
        name,
        email,
        hobbies: [],
    };
    USERS.push(newUser);

    const response = {
        data: {
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            links: {
                self: `/api/users/${newUser.id}`,
                hobbies: `/api/users/${newUser.id}/hobbies`,
            },
        },
        error: null,
    };
    sendJsonResponse(res, 201, response);
};