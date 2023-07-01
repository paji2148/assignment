import React, { Component } from 'react';
import StartApplicationForm from './StartApplicationForm';
import VehicleInfoForm from './VehicleInfoForm';
import PersonInfoForm from './PersonInfoForm';
import styles from './AppStyles.module.scss';

class InsuranceApplication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      firstName: '',
      lastName: '',
      email:'',
      dateOfBirth: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      additionalPeople: [],
      vehicles: [],
      isEditing: false,
      isAdding: false,
      editIndex: null,
      skipToFinalStep: false
    };
  }

  handleNextStep = (step) => {
    const { skipToFinalStep } = this.state;
    if (skipToFinalStep) {
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
    console.log("dddd", index)
    if (data) {
      const { firstName, lastName, email, dateOfBirth, street, city, state, zipCode } = data;
      this.setState({ firstName, lastName, email, dateOfBirth, street, city, state, zipCode });
    }
  };

  handleAddNew = (step) => {
    this.setState({ isAdding: true, step: step });
  };

  handleDeletePerson = (index) => {
    const updatedPeople = [...this.state.additionalPeople];
    updatedPeople.splice(index, 1);
    this.setState({ additionalPeople: updatedPeople });
  };

  handleDeleteVehicle = (index) => {
    const updatedVehicles = [...this.state.vehicles];
    updatedVehicles.splice(index, 1);
    this.setState({ vehicles: updatedVehicles });
  };


  handleFormSubmit = (formData) => {
    const { step, isEditing, editIndex, skipToFinalStep} = this.state;
    if (step === 1) {
        console.log(formData)
        const { firstName, lastName, email, dateOfBirth, street, city, state, zipCode } = formData;
        this.setState({ firstName, lastName, email, dateOfBirth, street, city, state, zipCode });
    } else if (step === 2) {
      if (isEditing) {
        const updatedPeople = [...this.state.additionalPeople];
        updatedPeople[editIndex] = formData;
        this.setState({ additionalPeople: updatedPeople, isEditing: false, editIndex: null });
    } else {
        const additionalPeople = [...this.state.additionalPeople, ...formData];
        this.setState({ additionalPeople });
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
      email,
      dateOfBirth,
      street,
      city,
      state,
      zipCode,
      additionalPeople,
      vehicles,
      isEditing,
      isAdding,
      editIndex,
      skipToFinalStep,
    } = this.state;

    switch (step) {
      case 1:
        return (
          <StartApplicationForm
            onNextStep={this.handleNextStep}
            onFormSubmit={this.handleFormSubmit}
            firstName={firstName}
            lastName={lastName}
            dateOfBirth={dateOfBirth}
            street={street}
            city={city}
            state={state}
            zipCode={zipCode}
            skipToFinalStep={skipToFinalStep}
          />
        );
      case 2:
        return (
          <PersonInfoForm
            onNextStep={this.handleNextStep}
            onFormSubmit={this.handleFormSubmit}
            person={isEditing ? additionalPeople[editIndex] : null}
            isEditing={isEditing}
            isAdding={isAdding}
            skipToFinalStep={skipToFinalStep}
            step={step}
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
          />
        );
        case 4:
    console.log("Additional People in Render: ", this.state.additionalPeople);
    console.log("Vehicles in Render: ", this.state.vehicles);

    return (
        <div className={styles.container}>
    <div className={styles.primaryPerson}>
        <h3>Primary Person:</h3>
        <div>
            <label>First Name:</label> <span>{firstName}</span>
        </div>
        <div>
            <label>Last Name:</label> <span>{lastName}</span>
        </div>
        <div>
            <label>Email:</label> <span>{email}</span>
        </div>
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
        <button className={styles.editButton} onClick={() => this.handleEditData(null, 1, {firstName, lastName, email, dateOfBirth, street, city, state, zipCode})}>
            Edit Person
        </button>
    </div>
    <div className={styles.additionalPeople}>
        <h3>Additional People:</h3>
        {additionalPeople.map((person, index) => (
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
                <button className={styles.deleteButton} onClick={() => this.handleDeleteVehicle(index)}>Delete</button>
            </div>
        ))}
        <p></p>
        <button className={styles.addButton} onClick={() => this.handleAddNew(3)}>Add vehicle</button>
    </div>
</div>

    );

        default:
            return null;
        }
      
  }

  render() {
    return (
      <div>
        {this.renderStep()}
      </div>
    );
  }
}

export default InsuranceApplication;
