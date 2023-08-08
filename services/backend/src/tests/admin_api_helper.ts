import { UserData } from "@m-cafe-app/db-models";

export const validAdminInDB: {
  password: string;
  dbEntry: Omit<UserData, 'id'>;
} = {
  password: 'iwannabeahero',
  dbEntry: {
    username: 'Vasil',
    name: 'Petrenko Vasil Karlovich',
    passwordHash: '$2a$10$jmSlEtYWy9Ff35qxusd2LOjSpHtisKH.cDfZeg4jdYOIZ7nfnYXFm',
    phonenumber: '89351111111',
    email: 'his-email@kontra.com',
    birthdate: new Date('2001-07-23T07:31:03.242Z'),
    rights: 'admin'
  }
};

export const validManagerInDB: {
  password: string;
  dbEntry: Omit<UserData, 'id'>;
} = {
  password: 'iwannabeahero',
  dbEntry: {
    username: 'Gennadiy',
    name: 'Kozyulievskii Gennadiy Vasilich',
    passwordHash: '$2a$10$jmSlEtYWy9Ff35qxusd2LOjSpHtisKH.cDfZeg4jdYOIZ7nfnYXFm',
    phonenumber: '89351010010',
    email: 'hers-email@kontra.com',
    birthdate: new Date('2001-07-23T07:31:03.242Z'),
    rights: 'manager'
  }
};