interface INotification extends Document {
  title: string;
  message: string;
  status: string;
  userId: string;
  createdAt: Date;
}

export { INotification };
