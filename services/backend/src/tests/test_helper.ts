// import { User } from '../models/index.js';

export const initialUsers = [
  {
    username: "Vasisualiy",
    name: "Mikhail Dyachenko",
    //password: "IputThisEverywhere",
    passwordHash: "$2a$10$ofK5pjq4S7.Df5H4LXkVfuNpRWXG51oF4mNXI8heuthC0vTFlRbSe",
    phonenumber: "88003561256"
  },
  {
    username: "flash_us",
    name: "Ilja Dyachenko",
    //password: "3654theRealData2412",
    passwordHash: "$2a$10$kO1TOacajXmBd463xhyd6uxTqBayJOeOdOwRtkfzms7l2mtf6yCT.",
    phonenumber: "88003561277"
  },
  {
    username: "StevieDoesntKnow",
    name: "Steve Miller",
    //password: "AbraAbra_cadabra",
    passwordHash: "$2a$10$exzJXbj/hbO6jS.2rzkz8.Gq6.VSq6X8w7vl7C1jkTgcFOnB/7beW",
    phonenumber: "88003561288"
  },
  {
    username: "Poperdopeler",
    name: "Vasisualiy Edipstein",
    //password: "IputThisEverywhere",
    passwordHash: "$2a$10$ofK5pjq4S7.Df5H4LXkVfuNpRWXG51oF4mNXI8heuthC0vTFlRbSe",
    phonenumber: "88003561294"
  },
  {
    username: "FanstasmagoR",
    name: "Hren Petrovich",
    //password: "3654theRealData2412",
    passwordHash: "$2a$10$kO1TOacajXmBd463xhyd6uxTqBayJOeOdOwRtkfzms7l2mtf6yCT.",
    phonenumber: "88003561227"
  },
  {
    username: "utopia_Forever",
    //password: "AbraAbra_cadabra",
    passwordHash: "$2a$10$exzJXbj/hbO6jS.2rzkz8.Gq6.VSq6X8w7vl7C1jkTgcFOnB/7beW",
    phonenumber: "88003561211"
  },
  {
    username: "gollum",
    //password: "IputThisEverywhere",
    passwordHash: "$2a$10$ofK5pjq4S7.Df5H4LXkVfuNpRWXG51oF4mNXI8heuthC0vTFlRbSe",
    phonenumber: "88003561226"
  },
  {
    username: "OW_YEAH",
    //password: "3654theRealData2412",
    passwordHash: "$2a$10$kO1TOacajXmBd463xhyd6uxTqBayJOeOdOwRtkfzms7l2mtf6yCT.",
    phonenumber: "88003561236"
  },
  {
    username: "fantasy",
    //password: "AbraAbra_cadabra",
    passwordHash: "$2a$10$exzJXbj/hbO6jS.2rzkz8.Gq6.VSq6X8w7vl7C1jkTgcFOnB/7beW",
    phonenumber: "88003561293"
  }
];

export const apiBaseUrl = '';


// export const usersInDb = async () => {
//   const users = await User.findAll({});
//   return users.map(user => user.toJSON());
// };


// const nonExistingId = async () => {
//   const blog = new Blog({ title: 'willremovethissoon', author: 'Vasisualiy', likes: 0 });
//   await blog.save();
//   await blog.remove();

//   return blog._id.toString();
// };

// const blogsInDb = async () => {
//   const blogs = await Blog.find({});
//   return blogs.map(blog => blog.toJSON());
// };