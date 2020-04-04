export default class AuthService {
  auth: firebase.auth.Auth;

  firestore: firebase.firestore.Firestore;

  constructor(
    auth: firebase.auth.Auth,
    firestore: firebase.firestore.Firestore
  ) {
    this.auth = auth;
    this.firestore = firestore;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ uid: string; email: string }> {
    const { user } = await this.auth.signInWithEmailAndPassword(
      email,
      password
    );
    return { uid: user.uid, email: user.email };
  }

  async createUser(
    email: string,
    password: string
  ): Promise<{ uid: string; email: string }> {
    const credentials = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const { uid } = credentials.user;
    const user = { uid, email };
    if (credentials) {
      await this.firestore.collection('users').doc(uid).set(user);
      return user;
    }
    throw 'There was an issue creating your account.';
  }

  checkUserDetails(userInformation: {
    email: string;
    password: string;
    passwordConfirmation: string;
  }): string[] {
    const { email, password, passwordConfirmation } = userInformation;
    const errors = [
      ...this.verifyEmail(email),
      ...this.verifyPassword(password, passwordConfirmation),
    ];
    return errors;
  }

  verifyPassword(password: string, passwordConfirmation: string): string[] {
    const errors = [];
    if (!password) {
      errors.push('You must enter a password');
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

  verifyEmail(email: string): string[] {
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const errors = [];
    if (!email.match(regex)) {
      errors.push("Your email address isn't the right format.");
    }
    return errors;
  }
}
