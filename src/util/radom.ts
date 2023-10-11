const numberRadom = (min: number, max: number) => {
  const range = max - min + 1;
  const randomNum = Math.floor(Math.random() * range) + min;
  return randomNum;
};

export default numberRadom;
