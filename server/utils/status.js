export default {
  OK: 200, // The request has succeeded
  CREATED: 201, // The request has been fulfilled and resulted in a new resource being created
  ACCEPTED: 202, // The request has been accepted for processing
  BAD_REQUEST: 400, // The request could not be understood by the server
  UNAUTHORIZED: 401, // The request requires user authentication
  NOT_FOUND: 404, // The server has not found anything matching the Request
  INTERNAL_S_E: 500, // The server encountered an unexpected condition which prevented it from fulfilling the request.
};
