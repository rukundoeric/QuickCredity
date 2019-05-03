import ST from './status';

export default {
  MSG_SIGNUP_SUCCESSFFUL: 'You have successfully signed up, now you have an acount on Quick credit ',
  MSG_WRONG_INPUTS: { message: 'Some values are missing' },
  MSG_NO_USER_EXIST: { status: ST.NOT_FOUND, message: 'Email not registered, please signup!' },
  MSG_WRONG_PASSWORD: { status: ST.OK, message: 'Incorrect Password' },
  MSG_INVALID_TOKEN: { message: 'Provided Token is invalid' },
  MSG_DATA_NOT_FOUND: { message: 'Not Found!!!' },
  MSG_DATA_MESSAGE_NOT_FOUND: { message: 'Not Found!!!' },
  MSG_DATA_INVALID_EMAIL: { message: 'Invalid Email' },
  MSG_USER_ALREAD_EXIST: { message: 'User already exists' },
  MSG_DATA_WEAK_PASSWORD: { message: 'Password is weak' },
  MSG_ACCESS_DENIED: 'Access denied',
  MSG_UNAUTHORIZED_ADMIN_ERROR: 'May be you are not an admin to this system or you are unverified!',
  MSG_USER_SUGGESTION: 'Please contact the the admin of this system to help you',
  MSG_USER_VERIFIED: 'User is successfully verified',
  MSG_LOAN_MUST_BE_ONE_AT_TIME: 'You cant apply for more than one loan at same time, please first make repayment',
  MSG_LOAN_APPLIED_SUCCESSFULLY: 'You have applied for loan successfully, checkout your email we will inform you if it is approved or rejected',
  MSG_LOAN_NOT_APPLIED: 'Invalid loan application',
  MSG_NOT_CLIENT: 'You are not a client to this system or unverified, please first create account or contact the admin to help you ',
};
