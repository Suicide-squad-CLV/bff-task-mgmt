### Authentication features

- In case you want to unauthenticate temporarily, you can add the decorator `@Public` above the resolver endpoint

      @Public
      @Query(() => [User], { name: 'getAllUsers' })
      async getUsers(): Promise<User[]> {
        // ...
      }

---
