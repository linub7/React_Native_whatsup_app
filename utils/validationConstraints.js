import { validate } from 'validate.js';

export const validateString = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false },
  };

  if (value !== '') {
    constraints.format = {
      pattern: '[a-z]+',
      flags: 'i',
      message: `value can only contain letters`,
    };
  }
  // [id] => if we use without [] -> js assume this: "id", but with [id] ->
  // js assume this "${value}"
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  // because of if we pass all constraints, we get undefined and undefined[id] throw an error ->
  // then we have to use: validationResult && validationResult[id]
  return validationResult && validationResult[id];
};

export const validateEmail = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false },
  };

  if (value !== '') {
    constraints.email = true;
  }
  // [id] => if we use without [] -> js assume this: "id", but with [id] ->
  // js assume this "${value}"
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  // because of if we pass all constraints, we get undefined and undefined[id] throw an error ->
  // then we have to use: validationResult && validationResult[id]
  return validationResult && validationResult[id];
};

export const validatePassword = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false },
  };

  if (value !== '') {
    constraints.length = {
      minimum: 6,
      message: 'must be at least 6 character',
    };
  }
  // [id] => if we use without [] -> js assume this: "id", but with [id] ->
  // js assume this "${value}"
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  // because of if we pass all constraints, we get undefined and undefined[id] throw an error ->
  // then we have to use: validationResult && validationResult[id]
  return validationResult && validationResult[id];
};

export const validateLength = (id, value, minLength, maxLength, allowEmpty) => {
  const constraints = {
    presence: { allowEmpty },
  };

  if (!allowEmpty || value !== '') {
    constraints.length = {};

    if (minLength !== null) {
      constraints.length = {
        minimum: minLength,
        message: `must be at least ${minLength} character`,
      };
    }

    if (maxLength !== null) {
      constraints.length = {
        maximum: maxLength,
        message: `maximum length is ${maxLength}`,
      };
    }
  }
  // [id] => if we use without [] -> js assume this: "id", but with [id] ->
  // js assume this "${value}"
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  // because of if we pass all constraints, we get undefined and undefined[id] throw an error ->
  // then we have to use: validationResult && validationResult[id]
  return validationResult && validationResult[id];
};
