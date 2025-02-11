"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerErrorMiddleware = void 0;
const container_1 = require("../../container");
const errors_1 = require("../../exceptions/errors");
let InternalServerErrorMiddleware = class InternalServerErrorMiddleware {
    constructor() { }
    /**
     * Method to be called after call execution.
     * It handles side effects.
     */
    afterCall(response) {
        if (response.status === 500) {
            // @ts-ignore
            throw new errors_1.InternalServerError(response.errors['message']);
        }
    }
    /**
     * Method to be called before call execution.
     * It can transform headers and body for a given resource.
     */
    beforeCall(resource, headers, body) {
        return { headers, body };
    }
};
InternalServerErrorMiddleware = __decorate([
    container_1.Injectable()
], InternalServerErrorMiddleware);
exports.InternalServerErrorMiddleware = InternalServerErrorMiddleware;
