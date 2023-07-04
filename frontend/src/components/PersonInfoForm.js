import React, { Component } from 'react';
import styles from './AppStyles.module.scss';
import api from '../api/apiHelper';

class PersonInfoForm extends Component {
  constructor(props) {
    super(props);
    const initialPerson = props.person || { firstName: '', lastName: '', dateOfBirth: '', relationship: '', personId: null };
    this.state = {
      persons: props.persons || [],
      currentPerson: initialPerson,
      applicationId: props.applicationId,
      isEditing: props.isEditing || false,
      skipToFinalStep: props.skipToFinalStep || false,
      isAddingPerson: props.isAdding || false,
      isLoading: false,
      error: null, 
      successMessage: null
    };
  }

    handleInputChange = (e) => {
      const { name, value } = e.target;
      this.setState(prevState => ({
        currentPerson: { ...prevState.currentPerson, [name]: value },
        error: null, successMessage: null
      }));
    };
  
    handleAddAnotherPerson = () => {
      this.setState({ isAddingPerson: true, isLoading: false,  error: null, successMessage: null });
    };
  
    calculateAge = (dateOfBirth) => {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age;
    };
  
    buildPersonDto = (currentPerson) => ({
      firstName: currentPerson.firstName,
      lastName: currentPerson.lastName,
      dateOfBirth: currentPerson.dateOfBirth,
      relationship: currentPerson.relationship
    });
  
    handleTimeout = (callback, delay = 1500) => {
      setTimeout(callback, delay);
    };
  
    handleSubmit = async (e) => {
      e.preventDefault();
      this.setState({ isLoading: true, successMessage: null, error: null });
  
      const { currentPerson, skipToFinalStep, isEditing, applicationId } = this.state;
      if (currentPerson.firstName && currentPerson.lastName && currentPerson.dateOfBirth && currentPerson.relationship) {
        try {
          const personDto = this.buildPersonDto(currentPerson);
          let response = null;
  
          if (isEditing) {
            response = await api.updatePerson(applicationId, currentPerson.personId, personDto);
            this.setState({ successMessage: 'Successful!', error: null}); 
            this.handleTimeout(() => {
              this.props.onFormSubmit(currentPerson);
              this.setState({ isLoading: false });
            });
          } else if (skipToFinalStep) {
            response = await api.addPerson(applicationId, personDto);
             
            personDto.personId = response.personId;
            this.setState({ successMessage: 'Successful!', error: null});
            this.handleTimeout(() => {
              this.props.onFormSubmit([personDto]);
              this.setState({ isLoading: false });
            });
          } else {
            response = await api.addPerson(applicationId, personDto);
             
            personDto.personId = response.personId;
            this.setState({ successMessage: 'Successful!', error: null});
            this.handleTimeout(() => {
              this.setState(prevState => ({
                persons: [...prevState.persons, personDto],
                currentPerson: { firstName: '', lastName: '', dateOfBirth: '', personId: null },
                isAddingPerson: false,
                isLoading: false
              }));
            });
          }
        } catch (error) {
          this.handleTimeout(() => {
            this.setState({ error: 'Failed!', successMessage: null, isLoading: false });
          });
        }
      }
    };
  
    handleNext = async () => {
      this.props.onFormSubmit(this.state.persons);
    };
  
    handleCancel = () => {
      const { skipToFinalStep } = this.state;
      if (skipToFinalStep) {
        this.props.onNextStep();
      } else {
        this.setState(prevState => ({
          currentPerson: { firstName: '', lastName: '', dateOfBirth: '', relationship: '', personId: null },
          isAddingPerson: false,
          isLoading: false,
          error: null, successMessage: null
        }));
      }
    }; 
    
      renderFormHeader = (isEditing) => (
        <h3>{isEditing ? "Edit Person" : "New Person"}</h3>
      );
    
      renderTextInput = (label, id, name, value, handleChange) => (
        <>
          <label htmlFor={id}>{label}</label>
          <input type="text" id={id} name={name} value={value} onChange={handleChange} />
        </>
      );
    
      renderSelectInput = (label, id, name, value, handleChange, options) => (
        <>
          <label htmlFor={id}>{label}</label>
          <select id={id} name={name} value={value} onChange={handleChange}>
            <option value="">Select a relationship</option>
            {options.map(option => <option value={option} key={option}>{option}</option>)}
          </select>
        </>
      );
    
      render() {
        const { currentPerson, isEditing, isAddingPerson, isLoading, error, successMessage } = this.state;
        const age = this.calculateAge(currentPerson.dateOfBirth);
        const isAgeValid = age >= 16;
        const isComplete = currentPerson.firstName && currentPerson.lastName && currentPerson.dateOfBirth && currentPerson.relationship;
        const relationships = ['Spouse', 'Sibling', 'Parent', 'Friend', 'Other'];
    
        return (
          <div className={styles.formContainer}>
            {(isEditing || isAddingPerson) && (
              <form onSubmit={this.handleSubmit}>
                {this.renderFormHeader(isEditing)}
    
                {this.renderTextInput("First Name", "firstName", "firstName", currentPerson.firstName, this.handleInputChange)}
                {this.renderTextInput("Last Name", "lastName", "lastName", currentPerson.lastName, this.handleInputChange)}
    
                <label htmlFor="dateOfBirth">Date of Birth:</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={currentPerson.dateOfBirth}
                  onChange={this.handleInputChange}
                />
                {(currentPerson.dateOfBirth && !isAgeValid) && <p className={styles.errorMessage}>Age must be 16 or older</p>}
    
                {this.renderSelectInput("Relationship", "relationship", "relationship", currentPerson.relationship, this.handleInputChange, relationships)}
    
                {error && <div className={styles.errorMessage}>{error}</div>}
                {successMessage && <div className={styles.responseMessage}>{successMessage}</div>}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!isComplete || !isAgeValid || isLoading}
                >
                  {isLoading ? 'Processing...' : (isEditing ? "Update" : "Save")}
                </button>
                <button type="button" disabled={isLoading} className={`${styles.button} ${styles.cancel}`} onClick={this.handleCancel}>
                  Cancel
                </button>
              </form>
            )}
    
            {!isAddingPerson && !isEditing && (
              <div>
                <button type="button" className={styles.submitButton} onClick={this.handleNext}>
                  Skip
                </button>
                <button type="button" className={styles.submitButton} onClick={this.handleAddAnotherPerson}>
                  Add person
                </button>
              </div>
            )}
          </div>
        );
      }  
}

export default PersonInfoForm;
