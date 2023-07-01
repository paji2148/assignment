import React, { Component } from 'react';
import styles from './AppStyles.module.scss';

class StartApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: props.firstName || '',
      lastName: props.lastName || '',
      email: props.email || '',
      dateOfBirth: props.dateOfBirth || '',
      street: props.street || '',
      city: props.city || '',
      state: props.state || '',
      zipCode: props.zipCode || '',
      isComplete: false,
      skipToFinalStep: props.skipToFinalStep || false
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, this.checkFormCompletion);
  }

  handleZipCodeChange = (event) => {
    const { value } = event.target;
    const zipCode = value.replace(/\D/g, "").slice(0, 5); // Remove non-digit characters and limit to 5 digits
    this.setState({ zipCode });
    this.checkFormCompletion();
  };
  
  checkFormCompletion = () => {
    const { firstName, lastName, email, dateOfBirth, street, city, state, zipCode } = this.state;
  
    const isComplete = firstName && lastName && email && dateOfBirth && street && city && state && zipCode;
    
    this.setState({ isComplete });
  }

  handleCancel= (e) => {
    this.props.onNextStep();    
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // You can use an API call to send the form data to the server
    // and proceed to the next view
    const { firstName, lastName, email, dateOfBirth, street, city, state, zipCode } = this.state;
    this.props.onFormSubmit({ firstName, lastName, email, dateOfBirth, street, city, state, zipCode });
    // Set the parent state from 1 to 2
  }


  render() {
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      street,
      city,
      state,
      zipCode,
      isComplete,
      skipToFinalStep
    } = this.state;

    return (
      <div className={styles.formContainer}>
        <form onSubmit={this.handleSubmit}>
          <h3>Personal Information</h3>
    
          <div className={styles.nameContainer}>
            <div className={styles.nameInput}>
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" value={firstName} onChange={this.handleChange} />
            </div>
            <div className={styles.nameInput}>
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" value={lastName} onChange={this.handleChange} />
            </div>
          </div>
    
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" value={email} onChange={this.handleChange} />
    
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" value={dateOfBirth} onChange={this.handleChange} />
    
          <label htmlFor="street">Street</label>
          <input type="text" id="street" name="street" value={street} onChange={this.handleChange} />

          <div className={styles.nameContainer}>
            <div className={styles.nameInput}>
            <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" value={city} onChange={this.handleChange} />
            </div>
            <div className={styles.nameInput}>
            <label htmlFor="state">State</label>
          <input type="text" id="state" name="state" value={state} onChange={this.handleChange} />
            </div>
          </div>    
          <label htmlFor="zipCode">Zip Code</label>
      <input
        type="text"
        id="zipCode"
        name="zipCode"
        value={zipCode}
        onChange={this.handleZipCodeChange}
        maxLength={5}
      />

    
          <button
            type="submit"
            disabled={!isComplete}
            title={!isComplete ? "Please fill all the details" : ""}
            className={styles.submitButton}
          >
            Submit
          </button>
    
          {skipToFinalStep && (
            <button type="button" className={`${styles.button} ${styles.cancel}`} onClick={this.handleCancel}>
              Cancel
            </button>
          )}
        </form>
      </div>
    );
    
    
    
      
}

}

export default StartApplicationForm;
