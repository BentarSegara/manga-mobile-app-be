export const mapError = (error) => {
  const errors = {};
  error.details.map((detail) => {
    const label = detail.context.label;
    return (errors[label] = detail.message);
  });
  return errors;
};
