"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const container_1 = require("../../container");
let AuthMiddleware = class AuthMiddleware {
    constructor(authProvider) {
        this.authProvider = authProvider;
    }
    /**
     * Method to be called after call execution.
     * It handles side effects.
     */
    afterCall(response) {
    }
    /**
     * Method to be called before call execution.
     * It can transform headers and body for a given resource.
     */
    beforeCall(resource, headers, body) {
        if (resource.auth || this.authProvider.check()) {
            headers = Object.assign(Object.assign({}, headers), this.authProvider.getAuthorizationHeader());
        }
        return { headers, body };
    }
};
AuthMiddleware = __decorate([
    container_1.Injectable()
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
