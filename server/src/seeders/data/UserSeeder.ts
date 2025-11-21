const Users = [
 {
    id: 1,
    email: "admin@admin.com",
    first_name: "admin",
    last_name: "user",
    hashed_password: "$argon2id$v=19$m=65536,t=3,p=4$CbnAc/TwBMRl0DBIHs9Hnw$fHI6Kc2T2Bx7XFCs2rKNi0vJKq1gOemhKk2NEpCKN4E",
    birthdate: new Date("1990-01-01"),
    avatar: { id: 1 } 
  },
  {
    id: 2,
    email: "test@test.com",
    first_name: "test",
    last_name: "user",
    hashed_password: "$argon2id$v=19$m=65536,t=3,p=4$CbnAc/TwBMRl0DBIHs9Hnw$fHI6Kc2T2Bx7XFCs2rKNi0vJKq1gOemhKk2NEpCKN4E",
    birthdate: new Date("1995-08-04"),
    avatar: { id: 1 } 
  }
];

export { Users };