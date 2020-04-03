export default class AuthService {
  auth: firebase.auth.Auth;

  constructor(auth: firebase.auth.Auth) {
    this.auth = auth;
  }

  async createUser(userInformation: {
    email: string;
    password: string;
    passwordConfirmation: string;
  }): Promise<string[]> {
    const { email, password, passwordConfirmation } = userInformation;
    const errors = [
      ...this.verifyPassword(password, passwordConfirmation),
      ...this.verifyEmail(email),
    ];
    if (!errors.length) {
      try {
        const isSuccessful = await this.auth.createUserWithEmailAndPassword(
          email,
          password
        );
        if (!isSuccessful) {
          errors.push('There was an issue creating your account.');
        }
      } catch (e) {
        errors.push('There was an issue creating your account.');
      }
    }
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
