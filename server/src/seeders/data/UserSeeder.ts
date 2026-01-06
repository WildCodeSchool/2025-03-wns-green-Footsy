const Users = [
  {
    id: 1,
    email: "admin@footsy.com",
    first_name: "Admin",
    last_name: "Footsy",
    hashed_password:
      "$argon2id$v=19$m=65536,t=3,p=4$d+NTvzS+IytRpJtPSCVkuw$QFEog7NyvWhEMSnYxuFhIkVwV+bQqaRTtaiqsALB0rQ",
    birthdate: new Date("1990-01-01"),
    isAdmin: true,
    avatar: { id: 1 },
  },
  {
    id: 2,
    email: "user@footsy.com",
    first_name: "test",
    last_name: "user",
    hashed_password:
      "$argon2id$v=19$m=65536,t=3,p=4$CbnAc/TwBMRl0DBIHs9Hnw$fHI6Kc2T2Bx7XFCs2rKNi0vJKq1gOemhKk2NEpCKN4E",
    birthdate: new Date("1995-08-04"),
    isAdmin: false,
    avatar: { id: 1 },
  },
];

export { Users };
