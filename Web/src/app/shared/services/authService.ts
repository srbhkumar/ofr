
export class AuthService {
   private loginKey: string;

    constructor() {
        this.loginKey = 'username';
    }

    login(user: string, password: string): boolean {
        if (user == 'test@leaporbit.com' && password == '1234') {
            localStorage.setItem(this.loginKey, user);
            return true;
        }
        return true;
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