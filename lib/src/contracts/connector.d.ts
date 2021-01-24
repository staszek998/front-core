import { Headers, IResponse, Methods, Payload } from './http';
export declare const ApiConnectorType: unique symbol;
export interface AuthHeader {
    Authorization: string;
}
export interface Authorization {
    check(): boolean;
    getAuthorizationHeader(): AuthHeader;
}
export interface ConnectorMiddleware {
    afterCall: (response: IResponse) => void;
    beforeCall: (resource: FoundResource, headers: Headers, body: Payload) => ({
        headers: Headers;
        body: Payload;
    });
}
export declare type FoundResource = {
    connection: string;
    url: string;
    method: Methods;
    shorthand: string;
    auth: boolean;
};
export interface IConnector {
    call(resource: string, action: string, params?: Params, body?: Payload, headers?: Headers, responseType?: ResponseType): Promise<IResponse>;
    findResource(resource: string, action: string, params: Params): FoundResource;
    useMiddlewares(list: ConnectorMiddleware[]): void;
    useResources(list: ResourcesRegistry): void;
}
export declare type Params = {
    [key: string]: string | number;
};
export declare type Resource = {
    url: string;
    method: Methods;
    params?: string[];
    shorthand?: string;
    auth?: boolean;
};
export declare type ResourceDefinition = {
    prefix: string | null;
    methods: ResourceMethod;
    connection?: string;
};
export declare type ResourceMethod = {
    [key: string]: Resource;
};
export declare type ResourcesRegistry = {
    [key: string]: ResourceDefinition;
};
export interface ResourceResponseMeta {
    total: number;
    query_params?: Params;
    current_page?: number;
    last_page?: number;
    from?: number;
    to?: number;
    per_page?: number;
    path?: string;
}
export declare enum ResponseType {
    Blob = "blob",
    Json = "json"
}
