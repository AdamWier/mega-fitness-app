import { Unsubscribe } from 'firebase/auth';
import User from './DocumentServices/User';
import FirebaseAuthService from './FirebaseAuthService';

export default class AuthService {
  private user: User;
  private auth: FirebaseAuthService;

  constructor(auth: FirebaseAuthService, user: User) {
    this.user = user;
    this.auth = auth;
  }

  public async getCurrentUser(callback: Function): Promise<Unsubscribe> {
    return this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        const document = await this.user.getDocument(user.uid);
        return callback(document);
      }
      return callback(null);
    });
  }

  public async login(email: string, password: string) {
    const { user } = await this.auth.signInWithEmailAndPassword(
      email.trim(),
      password
    );
    const userDocument = user ? await this.user.getDocument(user.uid) : null;
    return userDocument || {};
  }

  public async logout(): Promise<void> {
    return this.auth.signOut();
  }

  public async createUser(
    email: string,
    password: string,
    passwordConfirmation: string
  ) {
    try {
      this.checkUserDetails(email, password, passwordConfirmation);
      const credentials = await this.auth.createUserWithEmailAndPassword(
        email.trim(),
        password
      );
      if (!credentials.user) {
        throw ['There was an issue creating your account.'];
      }
      const uid = credentials.user.uid;
      const user = { uid, email };
      await this.user.create(user);
      return user;
    } catch (e) {
      throw e?.length ? e : ['There was an issue creating your account.'];
    }
  }

  private checkUserDetails(
    email: string,
    password: string,
    passwordConfirmation: string
  ) {
    const errors = [
      ...this.verifyEmail(email.trim()),
      ...this.verifyPassword(password, passwordConfirmation),
    ];
    if (errors.length) {
      throw errors;
    }
  }

  private verifyPassword(
    password: string,
    passwordConfirmation: string
  ): string[] {
    const errors = [];
    if (!password) {
      errors.push('You must enter a password.');
      return errors;
    }
    if (password !== passwordConfirmation) {
      errors.push('The passwords do not match.');
    }
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!password.match(regex)) {
      errors.push(
        'Your password must include between 6 to 20 characters, on uppercase letter, one lowercase letter, and a number.'
      );
    }
    return errors;
  }

  private verifyEmail(email: string): string[] {
    const regex =
      // eslint-disable-next-line no-control-regex
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const errors = [];
    if (!email.match(regex)) {
      errors.push("Your email address isn't the right format.");
    }
    return errors;
  }
}
