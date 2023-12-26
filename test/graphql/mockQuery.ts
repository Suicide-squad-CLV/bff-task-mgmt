import gql from 'graphql-tag';

export const mockRegisterInput = {
  email: 'testuser1@gmail.com',
  fullname: 'Test user',
  password: 'abcd1234',
};

export const Token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoicGhpLmRpbmhAZ21haWwuY29tIiwiaWF0IjoxNzAzNTk2MDE4LCJleHAiOjM0MDcxOTU2MzZ9.p9PL8BJQMLKJ8nORRJx1O0HzRuskcfed2OvO3QeUIO8';

export const registerMutation = gql`
  mutation {
    register(
      registerInput: {
        email: "testuser1@gmail.com"
        fullname: "Test user"
        password: "abcd1234"
      }
    ) {
      user {
        id
        fullname
        email
      }
    }
  }
`;

export const loginMutation = gql`
  mutation {
    login(loginInput: { email: "testuser1@gmail.com", password: "abcd1234" }) {
      user {
        id
        fullname
      }
      token {
        expiration
        token
        type
      }
      error {
        code
        message
      }
    }
  }
`;

export const getProfile = gql`
  {
    profile {
      id
      fullname
      email
    }
  }
`;
