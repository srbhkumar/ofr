export class AuthService {
    private tokenkey: string;
    private userkey: string;

    constructor() {
        this.tokenkey = 'token';
        this.userkey = "userId";
    }

    login(token: string, userId: number): boolean {
        localStorage.setItem(this.tokenkey, token);
        localStorage.setItem(this.userkey, userId.toString());
        return true;
    }

    logOut(): any {
        localStorage.removeItem(this.tokenkey);
        localStorage.removeItem(this.userkey);
    }

    getUserId(): any {
        return localStorage.getItem(this.userkey);
    }


    getToken(): any {
        return localStorage.getItem(this.tokenkey);
    }

    isLoggedIn(): boolean {
        return this.getUserId() !== null;
    }
}