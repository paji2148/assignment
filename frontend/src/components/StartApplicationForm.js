import React, { Component } from 'react';
import styles from './AppStyles.module.scss';
import api from '../api/apiHelper';

class StartApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationId: props.applicationId || '',
      firstName: props.firstName || '',
      lastName: props.lastName || '',
      dateOfBirth: props.dateOfBirth || '',
      street: props.street || '',
      city: props.city || '',
      state: props.state || '',
      zipCode: props.zipCode ||  '',
      isEditing: props.isEditing || false,
      skipToFinalStep: props.skipToFinalStep || false,
      isLoading: false,
      error: null, 
      successMessage: null
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({error: null, successMessage: null});
  }

  handleZipCodeChange = (event) => {
    const { value } = event.target;
    const zipCode = value.replace(/\D/g, "").slice(0, 5); // Remove non-digit characters and limit to 5 digits
    this.setState({ zipCode });
  };

  handleCancel= (e) => {
    this.setState({error: null, successMessage: null});
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
    this.setState({ isLoading: true, error: null, successMessage: null });

    const { firstName, lastName, dateOfBirth, street, city, state, zipCode, isEditing } = this.state;
    let applicationId = this.state.applicationId;
  
    try {
      const applicationDto = {
        firstName,
        lastName,
        dateOfBirth,
        address: {
          street,
          city,
          state,
          zipCode,
        },
      };
      let successMessage;
      if (isEditing) {
        await api.updateInsuranceApplication(this.state.applicationId, applicationDto);
        successMessage = "updated Successful!";
      } else {
        const response = await api.createInsuranceApplication(applicationDto);         
        applicationId = response.applicationId;
        localStorage.setItem('applicationId', applicationId);
        successMessage = "Insurance application created!";
        this.setState({ error: null, successMessage})
      }
      setTimeout(() => {
        this.props.onFormSubmit({ firstName, lastName, dateOfBirth, street, city, state, zipCode, applicationId });
        this.setState({ isLoading: false });
      }, 1500);
    } catch (error) {
      this.setState({error: "Failed", successMessage: null});
      setTimeout(() => {
        this.setState({error: "Failed", successMessage: null, isLoading: false});
      }, 1500);
    }
  }
  


  render() {
    const {firstName,
      lastName,
      dateOfBirth,
      street,
      city,
      state,
      zipCode,
      skipToFinalStep,
      isEditing,
      isLoading,
      error,
      successMessage
    } = this.state;

    const age = this.calculateAge(dateOfBirth);
    const isAgeValid = age >= 16;
    const isValidZip = /^\d{5}$/.test(zipCode);
    const isComplete = firstName && lastName && dateOfBirth && street && city && state && zipCode ? true : false;
    // let isValidEmail = true;
    // if (email) {
    //   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //   isValidEmail = emailRegex.test(email);
    // }

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
    
          {/* <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" value={email} onChange={this.handleChange} />
          {!isValidEmail && <p className={styles.errorMessage}>Email is not valid</p>} */}
    
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" value={dateOfBirth} onChange={this.handleChange} />
          {(dateOfBirth && !isAgeValid) && <p className={styles.errorMessage}>Age must be 16 or older</p>}
    
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

                {error && <div className={styles.errorMessage}>{error}</div>}
                {successMessage && <div className={styles.responseMessage}>{successMessage}</div>}

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
