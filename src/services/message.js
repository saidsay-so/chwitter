export const createMessage = (msg) => {};

export const deleteMessage = (id) => {}

export const getMessages = (user = null) => {
  const placeholder = [
    {
      id: 2,
      message: "This is a message",
      authorPicture:
        "http://images.guff.com/gallery/image/screen-shot-2015-09-07-at-151108",
      author: "John",
      authorProfileLink: "#",
      date: "12 Jun 2021",
      isFriend: false,
      action: (...args) => console.log(args),
    },
    {
      id: 1,
      message: "This is a message",
      authorPicture:
        "http://images.guff.com/gallery/image/screen-shot-2015-09-07-at-151108",
      author: "Not John",
      authorProfileLink: "#",
      date: "12 Jun 2021",
      isFriend: true,
      action: (...args) => console.log(args),
    },
  ];

  return placeholder;
};
