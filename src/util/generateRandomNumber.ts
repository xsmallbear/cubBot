const generateRandomNumber = (min: number, max: number) => {
  var range = max - min + 1;
  var randomNum = Math.floor(Math.random() * range) + min;
  return randomNum;
};

export default generateRandomNumber;
