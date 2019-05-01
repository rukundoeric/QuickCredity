const apiUrlv1 = '/api/v1';
const apiUrlv2 = '/api/v2';

// All api for v1
const apiUrlv1auth = `${apiUrlv1}/auth`;
const apiUrlv1authLogin = `${apiUrlv1auth}/login`;
const v1userSignup = `${apiUrlv1}/signup`;
const apiUrlv1messages = `${apiUrlv1}/messages`;
const apiUrlv1messagesUnread = `${apiUrlv1messages}/unread`;
const apiUrlv1messagesSent = `${apiUrlv1messages}/sent`;
const apiUrlv1messagesAction = `${apiUrlv1messages}/:id`;

// All api for v2
const apiUrlv2auth = `${apiUrlv2}/auth`;
const apiUrlv2authLogin = `${apiUrlv2auth}/login`;
const v1userSignup = `${apiUrlv2auth}/signup`;
const apiUrlv2authVerification = `${apiUrlv2authSignup}/:email/:code`;
const apiUrlv2messages = `${apiUrlv2}/messages`;
const apiUrlv2messagesUnread = `${apiUrlv2messages}/unread`;
const apiUrlv2messagesSent = `${apiUrlv2messages}/sent`;
const apiUrlv2messagesAction = `${apiUrlv2messages}/:id`;
const apiUrlv2createGroup = `${apiUrlv2}/groups`;
const apiUrlv2deleteGroup = `${apiUrlv2}/groups/:id`;
const apiUrlv2AddUserToGroup = `${apiUrlv2}/groups/:groupid/users/:userid`;
const apiUrlv2DeleteUserFromGroup = `${apiUrlv2}/groups/:groupid/users/:userid`;
const apiUrlv2SendMessageToGroup = `${apiUrlv2}/groups/:groupid/messages`;
// Acccount Verification
const verification_link_development = 'http://localhost:7070/api/v2/auth/signup';
const verification_link_production = 'https://epicmaileric.herokuapp.com/api/v2/auth/signup';

export {
  apiUrlv1authLogin,
  v1userSignup,
  apiUrlv1messages,
  apiUrlv1messagesUnread,
  apiUrlv1messagesSent,
  apiUrlv1messagesAction,
  apiUrlv2authVerification,
  apiUrlv2authLogin,
  apiUrlv2authSignup,
  apiUrlv2messages,
  apiUrlv2messagesUnread,
  apiUrlv2messagesSent,
  apiUrlv2messagesAction,
  verification_link_development,
  verification_link_production,
  apiUrlv2createGroup,
  apiUrlv2deleteGroup,
  apiUrlv2AddUserToGroup,
  apiUrlv2DeleteUserFromGroup,
  apiUrlv2SendMessageToGroup,
};
