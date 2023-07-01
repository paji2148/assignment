import React, { Component } from 'react';
import styles from './AppStyles.module.scss';
import api from '../api/apiHelper';

class PersonInfoForm extends Component {
  constructor(props) {
    super(props);
    const initialPerson = props.person || { firstName: ' ', lastName: ' ', dateOfBirth: ' ', relationship: '', personId: null };
    this.state = {
      persons: props.persons || [],
      currentPerson: initialPerson,
      applicationId: props.applicationId,
      isEditing: props.isEditing || false,
      skipToFinalStep: props.skipToFinalStep || false,
      isAddingPerson: props.isAdding || false,
      isLoading: false,
      responseMessage: null,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      currentPerson: { ...prevState.currentPerson, [name]: value },
    }));
  }

  handleAddAnotherPerson = () => {
    this.setState({ isAddingPerson: true, isLoading: false, responseMessage: null });
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
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, responseMessage: null });

    const { currentPerson, skipToFinalStep, isEditing, applicationId } = this.state;
    if (currentPerson.firstName && currentPerson.lastName && currentPerson.dateOfBirth && currentPerson.relationship) {
      try {
        const personDto = {
          firstName: currentPerson.firstName,
          lastName: currentPerson.lastName,
          dateOfBirth: currentPerson.dateOfBirth,
          relationship: currentPerson.relationship
        };
        let response = null;
        if (isEditing) {
          response = await api.updatePerson(applicationId, currentPerson.personId, personDto);
          setTimeout(() => {
            this.props.onFormSubmit(currentPerson);
            this.setState({ isLoading: false });
          }, 2000);
        } else if (skipToFinalStep) {
          response = await api.addPerson(applicationId, personDto);
          personDto.personId = response.personId;
          setTimeout(() => {
            this.props.onFormSubmit([personDto]);
            this.setState({ isLoading: false });
          }, 2000);
          
        } else {
          response = await api.addPerson(applicationId, personDto);
          personDto.personId = response.personId;
          this.setState({ responseMessage: 'Successful!'});
          setTimeout(() => {
            this.setState((prevState) => ({
              persons: [...prevState.persons, personDto],
              currentPerson: { firstName: '', lastName: '', dateOfBirth: '', personId: null },
              isAddingPerson: false,
              isLoading: false
            }));
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.setState({ responseMessage: 'Failed to submit!', isLoading: false });
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
      this.setState((prevState) => ({
        currentPerson: { firstName: '', lastName: '', dateOfBirth: '', relationship: '', personId: null },
        isAddingPerson: false,
        isLoading: false, 
        responseMessage: null
      }));
    }
  };

  render() {
    const { currentPerson, isEditing, isAddingPerson, relationship, isLoading, responseMessage } = this.state;
    const age = this.calculateAge(currentPerson.dateOfBirth);
    const isAgeValid = age >= 16;
    console.log(currentPerson);
    const isComplete = currentPerson.firstName && currentPerson.lastName && currentPerson.dateOfBirth && currentPerson.relationship;

    return (
      <div className={styles.formContainer}>
        {(isEditing || isAddingPerson) && (
          <form onSubmit={this.handleSubmit}>
            <h3>{isEditing ? "Edit Person" : "New Person"}</h3>

            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={currentPerson.firstName}
              onChange={this.handleInputChange}
            />

            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={currentPerson.lastName}
              onChange={this.handleInputChange}
            />

            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={currentPerson.dateOfBirth}
              onChange={this.handleInputChange}
            />
            {!isAgeValid && <p className={styles.errorMessage}>Age must be 16 or older</p>}

            <label htmlFor="relationship">Relationship</label>
            <select
              id="relationship"
              name="relationship"
              value={currentPerson.relationship}
              onChange={this.handleInputChange}
            >
              <option value="">Select a relationship</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Parent">Parent</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>

            {responseMessage && <div className={styles.responseMessage}>{responseMessage}</div>}

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
