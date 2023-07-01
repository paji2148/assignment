import React, { Component } from 'react';
import styles from './AppStyles.module.scss';

class PersonInfoForm extends Component {
  constructor(props) {
    super(props);
    const initialPerson = props.person || { firstName: '', lastName: '', dateOfBirth: '' };
    this.state = {
      persons: props.persons || [],
      currentPerson: initialPerson,
      isEditing: props.isEditing || false,
      skipToFinalStep: props.skipToFinalStep || false,
      isAddingPerson: props.isAdding || false,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      currentPerson: { ...prevState.currentPerson, [name]: value },
    }));
  }

  handleAddAnotherPerson = () => {
    this.setState({ isAddingPerson: true });
  };

  handleSavePerson = () => {
    const { currentPerson, skipToFinalStep } = this.state;
    if (currentPerson.firstName && currentPerson.lastName && currentPerson.dateOfBirth) {
      if (skipToFinalStep) {
        this.props.onFormSubmit([currentPerson]);
      } else {
        this.setState((prevState) => ({
          persons: [...prevState.persons, currentPerson],
          currentPerson: { firstName: '', lastName: '', dateOfBirth: '' },
          isAddingPerson: false
        }));
      }
    }
  };

  handleNext = () => {
    this.props.onNextStep('next');
  };

  handleCancel = () => {
    const { skipToFinalStep } = this.state;
    if (skipToFinalStep) {
      this.props.onNextStep();
    } else {
      this.setState((prevState) => ({
        currentPerson: { firstName: '', lastName: '', dateOfBirth: '' },
        isAddingPerson: false
      }));
    }
  };

  render() {
    const { currentPerson, isEditing, isAddingPerson } = this.state;
    console.log(currentPerson, isEditing, isAddingPerson)

    return (
      <div className={styles.personInfoFormContainer}>
        {(isEditing || isAddingPerson) && (
          <div>
            <h3>{isEditing ? "Edit Person" : "New Person"}</h3>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={currentPerson.firstName}
                onChange={this.handleInputChange}
              />
            </label>
            <br />
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={currentPerson.lastName}
                onChange={this.handleInputChange}
              />
            </label>
            <br />

            <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" value={currentPerson.dateOfBirth} onChange={this.handleInputChange} />
            <br />
            <button type="button" onClick={this.handleSavePerson}>
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        )}

        {(isEditing || isAddingPerson) && (
          <button type="button" className={`${styles.button} ${styles.cancel}`} onClick={this.handleCancel}>
          Cancel
      </button>
        )}

        {(!isAddingPerson && !isEditing) && (
            <div>
          <button type="button" onClick={this.handleNext}>
          Skip
        </button>
          <button type="button" onClick={this.handleAddAnotherPerson}>
          Add person
        </button></div>
        )}
      </div>
    );
  }
}

export default PersonInfoForm;
