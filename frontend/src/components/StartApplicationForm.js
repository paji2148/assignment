import React, { Component } from 'react';
import styles from './AppStyles.module.scss';
import api from '../api/apiHelper';

class StartApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationId: props.applicationId,
      firstName: props.firstName || '',
      lastName: props.lastName || ' ',
      email: props.email || '',
      dateOfBirth: props.dateOfBirth || ' ',
      street: props.street || ' ',
      city: props.city || ' ',
      state: props.state || ' ',
      zipCode: props.zipCode ||  null,
      isEditing: props.isEditing || false,
      skipToFinalStep: props.skipToFinalStep || false,
      isLoading: false,
      responseMessage: null
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleZipCodeChange = (event) => {
    const { value } = event.target;
    const zipCode = value.replace(/\D/g, "").slice(0, 5); // Remove non-digit characters and limit to 5 digits
    this.setState({ zipCode });
  };

  handleCancel= (e) => {
    this.props.onNextStep();    
  }

  calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, responseMessage: null });

    const { firstName, lastName, email, dateOfBirth, street, city, state, zipCode, isEditing } = this.state;
    let applicationId = this.state.applicationId;
  
    try {
      const applicationDto = {
        firstName,
        lastName,
        email,
        dateOfBirth,
        address: {
          street,
          city,
          state,
          zipCode,
        },
      };
      let response = null;
      if (isEditing) {
        response = await api.updateInsuranceApplication(this.state.applicationId, applicationDto);
        this.setState({ responseMessage: 'application updated Successful!' });
      } else {
        response = await api.createInsuranceApplication(applicationDto);
        applicationId = response.applicationId;
        applicationId = sessionStorage.setItem('applicationId', applicationId);
        this.setState({ responseMessage: 'Insurance application created!' });
      }

      setTimeout(() => {
        this.props.onFormSubmit({ firstName, lastName, email, dateOfBirth, street, city, state, zipCode, applicationId });
        this.setState({ isLoading: false });
      }, 2000);
    } catch (error) {
      console.error(error);
      this.setState({ responseMessage: 'Failed to submit!', isLoading: false });
    }
  }
  


  render() {
    const {firstName,
      lastName,
      email,
      dateOfBirth,
      street,
      city,
      state,
      zipCode,
      skipToFinalStep,
      isEditing,
      isLoading,
      responseMessage
    } = this.state;

    console.log(this.state)

    const age = this.calculateAge(dateOfBirth);
    const isAgeValid = age >= 16;
    const isValidZip = /^\d{5}$/.test(zipCode);
    const isComplete = firstName && lastName && email && dateOfBirth && street && city && state && zipCode ? true : false;

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
          {!isAgeValid && <p className={styles.errorMessage}>Age must be 16 or older</p>}
    
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

        {responseMessage && <div className={styles.responseMessage}>{responseMessage}</div>}

        <button
          type="submit"
          disabled={!isComplete || !isAgeValid || !isValidZip || isLoading}
          title={!isComplete ? "Please fill all the details" : ""}
          className={styles.submitButton}
        >
          {isLoading ? 'Processing...' : (isEditing ? "Update" : "Submit")}
        </button>
    
          {skipToFinalStep && (
            <button type="button" disabled={isLoading} className={`${styles.button} ${styles.cancel}`} onClick={this.handleCancel}>
              Cancel
            </button>
          )}
        </form>
      </div>
    ); 
  }
}

export default StartApplicationForm;
