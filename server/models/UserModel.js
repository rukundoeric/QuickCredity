
class User {
  constructor() {
    this.type = { type: 'UserList' };
    this.userData = [
      {
        id: 'klsfks833399aa9o99272jua929njk2',
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
        id: 'klsfks8389334iaa9o99272jua90902',
        firstName: 'Dukuze',
        lastName: 'Emmy',
        email: 'dukuze11@gmail.com',
        address: 'Kimironko',
        createdOn: '4/28/2019',
        userRole: 'admin',
        password: 'emmy12345',
        status: 'verified',
      },
      {
        id: 'klsfks8389qhkiaa9o99272jua90902',
        firstName: 'Danny',
        lastName: 'Kamoso',
        email: 'dannykamo2023@gmail.com',
        address: 'Kimironko',
        createdOn: '4/28/2019',
        userRole: 'client',
        password: 'kamoso123',
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

  async getUserById(id) {
    return this.userData.find(user => user.id === id);
  }

  async getAllUsers() {
    return this.userData;
  }
}

export default new User();
