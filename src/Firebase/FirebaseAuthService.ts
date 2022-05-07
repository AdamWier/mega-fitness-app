import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  Auth,
  NextOrObserver,
  User,
  signOut,
} from 'firebase/auth';

export default class FirebaseAuthService {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  }

  public signInWithEmailAndPassword(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  public createUserWithEmailAndPassword(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
  public onAuthStateChanged(func: NextOrObserver<User>) {
    return onAuthStateChanged(this.auth, func);
  }
  public signOut() {
    return signOut(this.auth);
  }
}
