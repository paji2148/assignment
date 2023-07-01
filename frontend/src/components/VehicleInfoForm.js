import React, { Component } from 'react';
import styles from './AppStyles.module.scss';


class VehicleInfoForm extends Component {
  constructor(props) {
    super(props);
    console.log('fffff')
    const initialVehicle = props.vehicle || { make: '', model: '', year: '', vin: ''};
    this.state = {
        vehicles: props.vehicles || [],
        currentVehicle: initialVehicle,
        isEditing: props.isEditing || false,
        skipToFinalStep: props.skipToFinalStep || false,
        isAddingVehicle: true
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      currentVehicle: { ...prevState.currentVehicle, [name]: value },
    }));
  };

  handleSaveVehicle = () => {
    const { currentVehicle, isEditing, skipToFinalStep } = this.state;
    if (currentVehicle.make && currentVehicle.model && currentVehicle.year) {
      if (isEditing) {
        this.props.onFormSubmit(currentVehicle);
      }else if (skipToFinalStep) {
        this.props.onFormSubmit([currentVehicle]);
      } else {
        this.setState((prevState) => ({
          vehicles: [...prevState.vehicles, currentVehicle],
          currentVehicle: { make: '', model: '', year: '', vin: '' },
          isAddingVehicle: false
        }));
      }
    }
  };

  handleAddAnotherVehicle = () => {
    this.setState({ isAddingVehicle: true });
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

  handleNext = () => {
    const { vehicles } = this.state;
    this.props.onFormSubmit(vehicles);
    this.props.onNextStep('next');
  };

  render() {
    const { vehicles, currentVehicle, isEditing, isAddingVehicle, skipToFinalStep } = this.state;

    return (<div className={styles.personInfoFormContainer}>
        <div className={styles.personContainer}>
        </div>
        {isAddingVehicle && (
          <div>
            <h3 className={styles.personHeader}>New Vehicle</h3>
            <label>
              Make:
              <input
                type="text"
                name="make"
                value={currentVehicle.make}
                onChange={this.handleInputChange}
              />
            </label>
            <br />
            <label>
              Model:
              <input
                type="text"
                name="model"
                value={currentVehicle.model}
                onChange={this.handleInputChange}
              />
            </label>
            <br />
            <label>
              Year:
              <input
                type="text"
                name="year"
                value={currentVehicle.year}
                onChange={this.handleInputChange}
              />
            </label>
            <br />
            <label>
              VIN:
              <input
                type="text"
                name="vin"
                value={currentVehicle.vin}
                onChange={this.handleInputChange}
              />
            </label>
            <br />
            <button type="button" className={styles.button} onClick={this.handleSaveVehicle}>
              Save
            </button>
          </div>
        )}
        {!isAddingVehicle && (
          <button type="button" className={styles.button} onClick={this.handleAddAnotherVehicle}>
            Add Another Vehicle
          </button>
        )}
        {(isAddingVehicle && vehicles.length > 0) || isEditing && (
          <button type="button" className={`${styles.button} ${styles.cancel}`} onClick={this.handleCancel}>
            Cancel
          </button>
        )}
        <br />
        {!isEditing && !isAddingVehicle && vehicles.length > 0 && (
          <button type="button" className={styles.button} onClick={this.handleNext}>
            Skip
          </button>
        )}
      </div>
    );
  }
}

export default VehicleInfoForm;
