export interface User {
  name: string;
  emailAddress: string;
  creationTimestamp: Date;
}

const data: User[] = [
  {
    emailAddress: "neo4j.connectors+workshop@gmail.com",
    name: "Member",
    creationTimestamp: new Date(),
  },
  {
    emailAddress: "neo4j.connectors+ali@gmail.com",
    name: "Ali",
    creationTimestamp: new Date(),
  },
  {
    emailAddress: "neo4j.connectors+dhru@gmail.com",
    name: "Dhru",
    creationTimestamp: new Date(),
  },
  {
    emailAddress: "neo4j.connectors+emre@gmail.com",
    name: "Emre",
    creationTimestamp: new Date(),
  },
  {
    emailAddress: "neo4j.connectors+eugene@gmail.com",
    name: "Eugene",
    creationTimestamp: new Date(),
  },
  {
    emailAddress: "neo4j.connectors+florent@gmail.com",
    name: "Florent",
    creationTimestamp: new Date(),
  },
];

class UserService {
  async fetch(): Promise<User[]> {
    return new Promise((resolve) => {
      resolve(data);
    });
  }

  async create(name: string, emailAddress: string): Promise<User> {
    const user: User = {
      emailAddress: emailAddress,
      name: name,
      creationTimestamp: new Date(),
    };

    data.push(user);

    return new Promise((resolve) => {
      resolve(user);
    });
  }

  async lookup(emailAddress: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const user = data.find((e) => e.emailAddress === emailAddress);
      if (user) {
        resolve(user);
      } else {
        reject("unable to find user");
      }
    });
  }
}

export default UserService;
