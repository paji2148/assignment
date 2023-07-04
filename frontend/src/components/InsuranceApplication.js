import React, { Component, useState, useEffect } from 'react';
import StartApplicationForm from './StartApplicationForm';
import VehicleInfoForm from './VehicleInfoForm';
import PersonInfoForm from './PersonInfoForm';
import styles from './AppStyles.module.scss';
import api from '../api/apiHelper';


const initialState = {
  step: 1,
  applicationId: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  persons: [],
  vehicles: [],
  isEditing: false,
  isAdding: false,
  editIndex: null,
  skipToFinalStep: false,
  submitted: false,
  price: null
};

class InsuranceApplication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      banner: false, 
      error: null, 
      successMessage: null 
    };
  }

  componentDidMount() {
    let applicationId;
    applicationId = localStorage.getItem('applicationId');
    this.setState({ banner: true });
    if (!applicationId) {
      const queryParams = new URLSearchParams(window.location.search)
       applicationId = queryParams.get("applicationId");
    }
    if (applicationId) {
      api.getInsuranceApplication(applicationId)
        .then(response => {
          const { ...applicationData } = response;
          this.setState({ ...applicationData, step:2, applicationId: applicationId });
          if (response.submitted || response.vehicles) {
            this.setState({step: 4, skipToFinalStep: true })
          }
          setTimeout(() => {
            this.setState({ banner: false });
          }, 1000);
        })
        .catch(err => {
          setTimeout(() => {
            this.setState({ error: 'Failed to fetch application' });
            this.setState(initialState);
          }, 1000);
        });
    } else {
      this.setState({ banner: false });
    }
  }

  showActionBanner = (action) => {
    return async (...args) => {
      this.setState({ error: null, successMessage: null });
      await action(...args);
    }
  }

  handleNextStep = (step) => {
    const { skipToFinalStep } = this.state;
    if (skipToFinalStep) {
        this.setState({ isEditing: false, editIndex: null });
        this.setStep(4)
    }
    this.setState((prevState) => {
        return { step: Math.min(4, prevState.step + 1) };
    });
  };

  setStep = (step) => {
    this.setState({ step });
  };

  handleEditData = (index, step, data = null) => {
    this.setState({ isEditing: true, editIndex: index, step: step });
    if (data) {
      const { firstName, lastName, dateOfBirth, street, city, state, zipCode } = data;
      this.setState({ firstName, lastName, dateOfBirth, street, city, state, zipCode });
    }
  };

  handleAddNew = (step) => {
    this.setState({ isAdding: true, step: step });
  };

  handleDeletePerson = this.showActionBanner(async (index) => {
    const { applicationId } = this.state;
    const updatedPeople = [...this.state. persons];
    try{
      this.setState({ banner: true });
      const response = await api.deletePerson(applicationId, updatedPeople[index].personId);
       
      updatedPeople.splice(index, 1);
      this.setState({  persons: updatedPeople });
      setTimeout(() => {
        this.setState({  successMessage: 'Person deleted successfully' });
      }, 2000);
    } catch (err) {
      setTimeout(() => {
        this.setState({  error: 'Failed to delete person' });
      }, 2000);
      
    }
  });

  handleDeleteVehicle = this.showActionBanner(async (index) => {
    const { applicationId } = this.state;
    const updatedVehicles = [...this.state.vehicles];
    try{
      this.setState({ banner: true });
      const response = await api.deleteVehicle(applicationId, updatedVehicles[index].vehicleId);
       
      updatedVehicles.splice(index, 1);
      this.setState({ vehicles: updatedVehicles });
      setTimeout(() => {
        this.setState({ successMessage: 'Vehicle deleted successfully'});
      }, 2000);
    } catch (err){
      setTimeout(() => {
        this.setState({ error: 'Failed to delete vehicle' });
      }, 2000);
      
    }
  });

  handleDeleteApplication = this.showActionBanner(async () => {
    const { applicationId } = this.state;
    try{
      this.setState({ banner: true });
      const response = await api.deleteInsuranceApplication(applicationId);
       
      this.setState(initialState);
      setTimeout(() => {
        this.setState({ successMessage: 'Application deleted successfully'});
      }, 2000);
    } catch (err) {
      setTimeout(() => {
        this.setState({ error: 'Failed to delete application' });
      }, 2000);
    }
  });

  handleSubmitApplication = this.showActionBanner(async () => {
    const { applicationId } = this.state;
    try{
      this.setState({ banner: true });
      const res = await api.submitInsuranceApplication(applicationId);
      this.setState({price: res.price});
      setTimeout(() => {
        this.setState({ successMessage: 'Application submitted successfully', price: res.price });
      }, 2000);
    } catch (err) {
      setTimeout(() => {
        this.setState({ error: 'Failed to submit application' });
      }, 2000);
    }
  });

  handleFormSubmit = (formData) => {
    const { step, isEditing, editIndex} = this.state;
    if (step === 1) {
        const { firstName, lastName, dateOfBirth, street, city, state, zipCode, applicationId } = formData;
        this.setState({ firstName, lastName, dateOfBirth, street, city, state, zipCode, applicationId,  });
    } else if (step === 2) {
      if (isEditing) {
        const updatedPeople = [...this.state. persons];
        updatedPeople[editIndex] = formData;
        this.setState({  persons: updatedPeople, isEditing: false, editIndex: null });
    } else {
        const  persons = [...this.state. persons, ...formData];
        this.setState({  persons });
      }
    } else if (step === 3) {
      if (isEditing) {
        const updatedVehicles = [...this.state.vehicles];
        updatedVehicles[editIndex] = formData;
        this.setState({ vehicles: updatedVehicles, isEditing: false, editIndex: null });
    } else {
        const vehicles = [...this.state.vehicles, ...formData];
        this.setState({ vehicles });
        this.setState({skipToFinalStep: true})
      }
    }
    this.handleNextStep()
  };

  renderStep() {
    const {
      step,
      firstName,
      lastName,
      dateOfBirth,
      street,
      city,
      state,
      zipCode,
       persons,
      vehicles,
      isEditing,
      isAdding,
      editIndex,
      skipToFinalStep,
      applicationId,
      price
    } = this.state;

    switch (step) {
      case 1:
        return (
          <StartApplicationForm
            onNextStep={this.handleNextStep}
            onFormSubmit={this.handleFormSubmit}
            applicationId= {applicationId}
            firstName={firstName}
            lastName={lastName}
            dateOfBirth={dateOfBirth}
            street={street}
            city={city}
            state={state}
            zipCode={zipCode}
            skipToFinalStep={skipToFinalStep}
            isEditing={isEditing}
          />
        );
      case 2:
        return (
          <PersonInfoForm
            onNextStep={this.handleNextStep}
            onFormSubmit={this.handleFormSubmit}
            person={isEditing ?  persons[editIndex] : null}
            isEditing={isEditing}
            isAdding={isAdding}
            skipToFinalStep={skipToFinalStep}
            step={step}
            applicationId= {applicationId}
          />
        );
      case 3:
        return (
          <VehicleInfoForm
            onNextStep={this.handleNextStep}
            onFormSubmit={this.handleFormSubmit}
            vehicle={isEditing ? vehicles[editIndex] : null}
            isEditing={isEditing}
            isAdding={isAdding}
            skipToFinalStep={skipToFinalStep}
            step={step}
            applicationId= {applicationId}
          />
        );
        case 4:

        return (
          <div className={styles.container}>
              {price ? (
                  <div>
                      <span>Your price is {price}</span>
                      <div className={styles.buttonsContainer}>
                          <button className={styles.deleteButton} onClick={() => this.setState(initialState)}>New Application</button>
                      </div>
                  </div>
              ) : (
                  <div>
                      <div className={styles.primaryPerson}>
                          <h3>Primary Person:</h3>
                          <div>
                              <label>First Name:</label> <span>{firstName}</span>
                          </div>
                          <div>
                              <label>Last Name:</label> <span>{lastName}</span>
                          </div>
                          {/* <div>
                              <label>Email:</label> <span>{email}</span>
                          </div> */}
                          <div>
                              <label>Date of Birth:</label> <span>{dateOfBirth}</span>
                          </div>
                          <div>
                              <label>Street:</label> <span>{street}</span>
                          </div>
                          <div>
                              <label>City:</label> <span>{city}</span>
                          </div>
                          <div>
                              <label>State:</label> <span>{state}</span>
                          </div>
                          <div>
                              <label>Zip Code:</label> <span>{zipCode}</span>
                          </div>
                          <button className={styles.editButton} onClick={() => this.handleEditData(null, 1, {firstName, lastName, dateOfBirth, street, city, state, zipCode})}>
                              Edit Person
                          </button>
                      </div>
      
                      <div className={styles. persons}>
                          <h3>Additional People:</h3>
                          { persons.map((person, index) => (
                              <div key={index}>
                                  <div>
                                      <label>First Name:</label> <span>{person.firstName}</span>
                                  </div>
                                  <div>
                                      <label>Last Name:</label> <span>{person.lastName}</span>
                                  </div>
                                  <div>
                                      <label>Date of Birth:</label> <span>{person.dateOfBirth}</span>
                                  </div>
                                  <button className={styles.editButton} onClick={() => this.handleEditData(index, 2)}>Edit</button>
                                  <button className={styles.deleteButton} onClick={() => this.handleDeletePerson(index)}>Delete</button>
                                  <br />
                              </div>
                          ))}
                          <p></p>
                          <button className={styles.addButton} onClick={() => this.handleAddNew(2)}>Add person</button>
                      </div>
      
                      <div className={styles.vehicles}>
                          <h3>Vehicles:</h3>
                          {vehicles.map((vehicle, index) => (
                              <div key={index}>
                                  <div>
                                      <label>Make:</label> <span>{vehicle.make}</span>
                                  </div>
                                  <div>
                                      <label>Model:</label> <span>{vehicle.model}</span>
                                  </div>
                                  <div>
                                      <label>Year:</label> <span>{vehicle.year}</span>
                                  </div>
                                  <div>
                                      <label>VIN:</label> <span>{vehicle.vin}</span>
                                  </div>
                                  <button className={styles.editButton} onClick={() => this.handleEditData(index, 3)}>Edit</button>
                                  {vehicles.length > 1 && (
                                      <button className={styles.deleteButton} onClick={() => this.handleDeleteVehicle(index)}>Delete</button>
                                  )}
                                  <br />
                              </div>
                          ))}
                          <p></p>
                          {vehicles.length < 3 && (
                              <button className={styles.addButton} onClick={() => this.handleAddNew(3)}>Add vehicle</button>
                          )}
                      </div>
      
                      <div className={styles.buttonsContainer}>
                          <button className={styles.editButton} onClick={() => this.handleSubmitApplication()}>Submit Application</button>
                          <button className={styles.deleteButton} onClick={() => this.handleDeleteApplication()}>Delete Application</button>
                      </div>
                  </div>
              )}
          </div>
      );

        default:
            return null;
        }
      
  }

  render() {
    const { banner, error, successMessage } = this.state;
  
    return (
      <div>
        {/* Show banner spinner */}
        {banner && (
          <div className={styles.banner}>
            {!error && !successMessage && <div className={styles.spinner}></div>}
  
            {error && (
              <div className={styles.message}>
                <p>{error}</p>
                <button className="exitButton" onClick={() => this.setState({ banner: false, error: null, successMessage: null })}>
                  Exit
                </button>
              </div>
            )}
  
            {successMessage && (
              <div className={styles.message}>
                <p>{successMessage}</p>
                <button className="exitButton" onClick={() => this.setState({ banner: false, error: null, successMessage: null })}>
                  Exit
                </button>
              </div>
            )}
          </div>
        )}
  
        {!banner && this.renderStep()}
      </div>
    );
  }
}

export default InsuranceApplication;
