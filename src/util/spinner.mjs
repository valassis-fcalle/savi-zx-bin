import ora from 'ora';

let spinner = ora({});

function spinnerCreate(options = { color: 'gray', spinner: 'bouncingBar' }) {
  spinner = ora({
    ...options,
  });
}

function spinnerStart() {
  if (spinner) {
    spinner.start();
  }
}

function spinnerStop() {
  if (spinner) {
    spinner.stop();
    spinner = null;
  }
}

function spinnerSetText(text) {
  if (spinner) {
    spinner.text = text;
  }
}
function spinnerSetPrefix(prefix) {
  if (spinner) {
    spinner.prefixText = prefix;
  }
}

export {
  spinnerCreate,
  spinnerSetPrefix,
  spinnerSetText,
  spinnerStart,
  spinnerStop,
};
