import { chalk, question } from 'zx';

async function confirm(text = 'Confirm?', expectedPositive = true) {
  const choices = ['yes', 'no'];
  const suffix = chalk.gray(`Type [${choices.join('/')}]: `);
  const answer = await question(`${text} ${suffix}`, { choices });

  if (expectedPositive && answer === 'yes') {
    return true;
  }
  if (expectedPositive && answer === 'no') {
    return false;
  }
  if (!expectedPositive && answer === 'no') {
    return true;
  }
  if (!expectedPositive && answer === 'yes') {
    return false;
  }
  return false;
}

export { confirm };
