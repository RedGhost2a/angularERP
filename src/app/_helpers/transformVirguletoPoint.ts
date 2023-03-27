export function transformVirguletoPoint() {
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    const inputValue = (input as HTMLInputElement).value;
    const sanitizedValue = inputValue.replace(/,/g, '.');
    (input as HTMLInputElement).value = sanitizedValue;
  });
}
