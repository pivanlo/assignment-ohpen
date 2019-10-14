import React from 'react';

function FormErrors(props) {
  const formErrors = props.formErrors;

  const errorMessages = Object.keys(formErrors).map((fieldName, index) => {
    if (formErrors[fieldName]) {
      return (
        <p key={index}>
          {fieldName} {formErrors[fieldName]}
        </p>
      )
    } else {
      return '';
    }
  });

  return (
    <div>{errorMessages}</div>
  );
}

export default FormErrors;
