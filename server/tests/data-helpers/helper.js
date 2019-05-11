/* eslint-disable linebreak-style */
const hostUrl = 'http://localhost:5060';
const clientToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJrbHNma3M4Mzg5cWhraWFhOW85OTI3Mmp1YTkwOTAyIiwiaWF0IjoxNTU3MzMwNzk1LCJleHAiOjE1NTkwNTg3OTV9.G9KilGKICdiy-v3TT7WgY6ZGQPP61_arHGiYa1jEI0c';
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJrbHNma3M4Mzg5MzM0aWFhOW85OTI3Mmp1YTkwOTAyIiwiaWF0IjoxNTU3MzMwNzEyLCJleHAiOjE1NTkwNTg3MTJ9.PSrn1uV4Qc67kd_QGv-uUEl51Hz7_z5TuUiFir1b6eg';
// For users
const clentData = {
  firstName: 'Danny',
  lastName: 'Kamoso',
  email: 'dannykamo2023@gmail.com',
  address: 'Kimironko',
  userRole: 'client',
  password: 'kamoso123',
};
const adminData = {
  id: 'klsfks8389334iaa9o99272jua90902',
  firstName: 'Dukuze',
  lastName: 'Emmy',
  email: 'dukuze11@gmail.com',
  address: 'Kimironko',
  createdOn: '4/28/2019',
  userRole: 'admin',
  password: 'emmy123',
  status: 'verified',
};
const adminDataBad = {
  firstName: 'Dukuze',
  lastName: 'Emmy',
};

const signUpAdminData = {
  firstName: 'Kamanzi',
  lastName: 'Shadia',
  email: 'kashadi@gmail.com',
  address: 'Kimironko',
  userRole: 'admin',
  password: 'shadia1234',
};
const signUpClientData = {
  firstName: 'Gedeon',
  lastName: 'Semana',
  email: 'gedesema@gmail.com',
  address: 'Kimironko',
  userRole: 'client',
  password: 'gedeon1234',
};
const clientLogin = {
  email: 'benshidanny11@gmail.com',
  password: 'danny123',
};
const clientLoginBadEmail = {
  email: 'dannykamo2023@gmail.com1111',
  password: 'kamoso123',
};
const adminLogin = {
  email: 'kashadi@gmail.com',
  password: 'shadia1234',
};
const adminLoginBadEmail = {
  email: 'dukuze11@gmail.com121221',
  password: 'emmy123',
};
const adminLoginIncorrectPass = {
  email: 'dukuze11@gmail.com',
  password: 'emmy1231212',
};
const clientLoginIncorrectPass = {
  email: 'dannykamo2023@gmail.com1111',
  password: 'kamoso1231231',
};
const incompleteDataLogin = {
  pass: 'dannykamo2023',
};
const loginWithouttoken = {
  email: 'benshidanny11@gmail.com',
  password: 'danny123',
};
const userEmail = 'benshidanny11@gmail.com';
const clientUserId = 'klsfks8389qhkiaa9o99272jua90902';
const adminUserId = 'klsfks8389334iaa9o99272jua90902';
const invalidId = 'klsfks8389334iaa9o99272jua9090283847838';

// For Loans
const loanApplicationData = {
  userEmail: 'dannykamo2023@gmail.com',
  tenor: 6,
  amount: 2000000,
};

export {
  hostUrl,
  clientToken,
  adminToken,
  clentData,
  adminData,
  signUpAdminData,
  signUpClientData,
  clientLogin,
  adminLogin,
  clientLoginBadEmail,
  adminLoginBadEmail,
  adminLoginIncorrectPass,
  clientLoginIncorrectPass,
  loginWithouttoken,
  userEmail,
  clientUserId,
  adminUserId,
  invalidId,
  loanApplicationData,
  adminDataBad,
  incompleteDataLogin,

};
