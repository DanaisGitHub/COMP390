import exp from "constants";
import { Server } from "http";

export class AuthRequiredError extends Error {
    constructor(message = "Authentication required, please login first and try again.") {
        super(message);
        this.name = "AuthRequiredError";
    }
}

export class ServerError extends Error {
    constructor(message = "Something when wrong with my server 😞, please try again later.") {
        super(message);
        this.name = "ServerError";
    }
}

export class NotFoundError extends Error {
    constructor(message = "Couldn't find what your looking for, try again later whilst I do some detective work 🕵🏾.") {
        super(message);
        this.name = "NotFoundError";
    }
}

export class NoResponseError extends Error {
    constructor(message = "That Request seems to not be getting a response") {
        super(message);
        this.name = "NoResponseError";
    }
}



