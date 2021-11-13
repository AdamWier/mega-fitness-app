import AuthService from '../../src/Firebase/AuthService';

describe('Auth Service', () => {

    var authService;

    beforeEach(() => {
        authService = new AuthService({
            createUserWithEmailAndPassword: jest.fn(() => ({user: {uid: 1}})),
            signInWithEmailAndPassword: jest.fn(() => ({user: {uid: 1}}))
        },
        {
            getDocument: jest.fn(() => ({uid: 1, email: 'buffy@thevampireslayer.com', waterGoal: 0, goalCalories: 0})),
            create: jest.fn(() => undefined)
        });
    });

  it('creates a user', async () => {
    expect.assertions(1);

    const user = await authService.createUser('buffy@thevampireslayer.com', 'Angel666', 'Angel666');

    expect(user).toStrictEqual(
        expect.objectContaining({
          uid: 1,
          email: 'buffy@thevampireslayer.com',
        })
    );
  });

  it('prevents the creation of a user if passwords do not match', async () => {
    expect.assertions(1);

    try {
        await authService.createUser('buffy@thevampireslayer.com', 'Angel666', 'Angel667')
    } catch(e){
        expect(e).toStrictEqual(expect.arrayContaining(['The passwords do not match.']))
    }
  });

  it('prevents the creation of a user if password is not valid', async () => {
    expect.assertions(1);

    try {
        await authService.createUser('buffy@thevampireslayer.com', 'A', 'A')
    } catch(e){
        expect(e).toStrictEqual(expect.arrayContaining(['Your password must include between 6 to 20 characters, on uppercase letter, one lowercase letter, and a number.']))
    }
  });

  it('prevents the creation of a user if password is not entered', async () => {
    expect.assertions(1);

    try {
        await authService.createUser('buffy@thevampireslayer.com', '', '')
    } catch(e){
        expect(e).toStrictEqual(expect.arrayContaining(['You must enter a password.']))
    }
  });

  it('prevents the creation of a user if email is not valid', async () => {
    expect.assertions(1);

    try {
        await authService.createUser('buffythevampireslayercom', 'Angel666', 'Angel666')
    } catch(e){
        expect(e).toStrictEqual(expect.arrayContaining(["Your email address isn't the right format."]))
    }
  });

  it('prevents the creation of a user if email is not valid', async () => {
    expect.assertions(1);

    const user = await authService.login('buffythevampireslayercom', 'Angel666');
    expect(user).toStrictEqual(expect.objectContaining({uid: 1, email: 'buffy@thevampireslayer.com', waterGoal: 0, goalCalories: 0}))
  })
});
