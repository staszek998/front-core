import { AuthConfig, Authentication, AuthHeader, IUser, Token } from '../contracts/authentication';
import { IDateTime } from '../contracts/services';
export declare class AuthService<U extends IUser> implements Authentication<U> {
    private _config;
    private _date;
    private _auth$;
    private _token;
    private _user;
    constructor(_config: AuthConfig, _date: IDateTime);
    /**
     * Returns if user is logged-in.
     */
    check(): boolean;
    /**
     * Clears Token and sets logged-out state.
     */
    deleteToken(): void;
    /**
     * Returns Auth Headers based on token type.
     */
    getAuthorizationHeader(): AuthHeader;
    /**
     * Returns Token object from state.
     */
    get token(): Token | null;
    /**
     * Sets Token to state.
     * @param token
     */
    setToken(token: Token): void;
    /**
     * Sets user in state.
     * @param user
     */
    setUser(user: U): void;
    /**
     * Returns user from state.
     */
    get user(): U | null;
    /**
     * Calculates for how long token will be still valid.
     * @private
     */
    private calculateTokenLifetime;
    /**
     * Return id of currently set user.
     */
    getUserId(): string | number | null;
    /**
     * Checks if token is valid and emits event if not.
     * @param tokenLifeTime
     * @private
     */
    protected isTokenValid(tokenLifeTime: number): boolean;
    /**
     * Sets token retrieved from device localstorage.
     */
    protected retrieveToken(): void;
    /**
     * Sets refresh behaviour for token.
     * @param tokenLifeTime
     * @param token
     * @private
     */
    protected setupRefreshment(tokenLifeTime: number, token: Token): void;
}
