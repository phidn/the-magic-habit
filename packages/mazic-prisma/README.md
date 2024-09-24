# Mazic Prisma

### Useful commands
```bash
# just re-generate the Go client
$ go run github.com/steebchen/prisma-client-go generate
 
# sync the database with your schema for development
$ go run github.com/steebchen/prisma-client-go db push
 
# create a prisma schema from your existing database
$ go run github.com/steebchen/prisma-client-go db pull
 
# for production use, create a migration locally
$ go run github.com/steebchen/prisma-client-go migrate dev
 
# sync your production database with your migrations
$ go run github.com/steebchen/prisma-client-go migrate deploy
```

### References
- https://goprisma.org/docs/getting-started/cli
