export const dateAndTimeGenerate = () => {
  const currDate = new Date();
  const dateStamp = currDate.toDateString();
  const timeStamp = currDate.toLocaleTimeString();

  const dateTime = `${dateStamp} ${timeStamp}`;

  return dateTime;
};
