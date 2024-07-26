import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const DeliveryForm = () => {
  // Define the initial values for your form fields
  const initialValues = {
    field1: '',
    field2: '',
  };

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    field1: Yup.string().required('Field 1 is required'),
    field2: Yup.string().required('Field 2 is required'),
  });

  // Define the submit handler function
  const handleSubmit = (values, { resetForm }) => {
    // You can perform your actions here with the form values
    console.log('Form values submitted:', values);
    // Reset the form
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <label htmlFor="field1">Field 1:</label>
          <Field type="text" id="field1" name="field1" />
          <ErrorMessage name="field1" component="div" className="error" />
        </div>

        <div>
          <label htmlFor="field2">Field 2:</label>
          <Field type="text" id="field2" name="field2" />
          <ErrorMessage name="field2" component="div" className="error" />
        </div>

        <div>
          <button type="submit">Submit 1</button>
          <button type="submit">Submit 2</button>
        </div>
      </Form>
    </Formik>
  );
};

export default DeliveryForm;
