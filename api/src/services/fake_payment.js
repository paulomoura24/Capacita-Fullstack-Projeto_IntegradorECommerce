function luhnCheck(cardNumber) {
  const arr = (cardNumber + '').split('').reverse().map(x => parseInt(x));
  const lastDigit = arr.shift();
  let sum = arr.reduce((acc, val, idx) => {
    if (idx % 2 === 0) {
      let doubled = val * 2;
      if (doubled > 9) doubled -= 9;
      return acc + doubled;
    }
    return acc + val;
  }, 0);
  sum += lastDigit;
  return sum % 10 === 0;
}

export function approveFakeCard(amount, cardNumber) {
  if (!luhnCheck(cardNumber)) return false;
  if (cardNumber === '4111111111111111') return true;
  return Number(amount) <= 5000;
}
