
class User {
  constructor() {
    this.userData = [
      {
        id: 1,
        firstName: 'Urimubenshi',
        lastName: 'Daniel',
        email: 'benshidanny11@gmail.com',
        address: 'Kimironko',
        createdOn: '4/28/2019',
        userRole: 'client',
        password: 'danny123',
        status: 'Unverified',
      },
      {
        id: 2,
        firstName: 'Dukuze',
        lastName: 'Emmy',
        email: 'dukuze11@gmail.com',
        address: 'Kimironko',
        createdOn: '4/28/2019',
        userRole: 'admin',
        password: 'emmy123',
        status: 'verified',
      },
    ];
  }

  async signup(user) {
    if (!user) {
      return false;
    }
    this.userData.push(user);
    return true;
  }

  async getUserByEmail(email) {
    return this.userData.find(user => user.email === email);
  }

  async getUserByName(userName) {
    // eslint-disable-next-line no-shadow
    const user = this.userData.find(user => user.userName === userName);
    return !user ? null : user.userName;
  }

  async getUserById(id) {
    return this.userData.find(user => user.id === id);
  }

  async getAllUsers() {
    return this.userData;
  }
}

export default new User();
