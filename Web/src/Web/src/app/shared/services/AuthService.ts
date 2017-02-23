
export class AuthService {
   private loginKey: string;

    constructor() {
        this.loginKey = 'username';
    }

    login(user: string, password: string): boolean {
        if (user === 'arul@gmail.com' && password === 'das') {
            localStorage.setItem(this.loginKey, user);
            return true;
        }

        return false;
    }

    logOut(): any {
        localStorage.removeItem(this.loginKey);
    }

    getUser():any{
        return localStorage.getItem(this.loginKey);
    }

    isLoggedIn(): boolean{
        return this.getUser()!==null;
    }
}