import React, { Component } from 'react';
import styles from './AppStyles.module.scss';
import api from '../api/apiHelper';


class VehicleInfoForm extends Component {
  constructor(props) {
    super(props);
    const initialVehicle = props.vehicle || { make: '', model: '', year: undefined, vin: ''};
    this.state = {
        vehicles: props.vehicles || [],
        currentVehicle: initialVehicle,
        applicationId: props.applicationId || '',
        isEditing: props.isEditing || false,
        skipToFinalStep: props.skipToFinalStep || false,
        isAddingVehicle: true,
        isLoading: false,
        error: null, 
        successMessage: null 
    };
  }

  validateYear = (year) => {
    const currentYear = new Date().getFullYear();
    return year >= 1985 && year <= currentYear + 1;
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
  
    let parsedValue = value;
    if (name === "year") {
      parsedValue = value.replace(/\D/g, "").slice(0, 4);
      if (parsedValue) {
        parsedValue = parseInt(parsedValue, 10);
      }
    }
  
    this.setState((prevState) => ({
      currentVehicle: { ...prevState.currentVehicle, [name]: parsedValue },
      error: null, successMessage: null
    }));
  };
  

  handleSaveVehicle = async (e) => {

    e.preventDefault();
    this.setState({ isLoading: true, successMessage: null, error: null });
    // if (currentVehicle.firstName && currentVehicle.lastName && currentVehicle.dateOfBirth && currentVehicle.vin) {
      const { currentVehicle, isEditing, skipToFinalStep, applicationId } = this.state;
      if (currentVehicle.make && currentVehicle.model && currentVehicle.year && currentVehicle.vin) {
        try {
          const vehicleDto = {
            make: currentVehicle.make,
            model: currentVehicle.model,
            year: currentVehicle.year,
            vin: currentVehicle.vin
          };
          let response;
          if (isEditing) {
            response = await api.updateVehicle(applicationId, currentVehicle.vehicleId, vehicleDto);

            this.setState({ successMessage: 'Successful!'});
            setTimeout(() => {
              this.props.onFormSubmit(currentVehicle);
              this.setState({ isLoading: false });
            }, 1500);
          } else if (skipToFinalStep) {
            response = await api.addVehicle(applicationId, vehicleDto)
            
            vehicleDto.vehicleId  = response.vehicleId;
            this.setState({ successMessage: 'Successful!'});
            setTimeout(() => {
                this.props.onFormSubmit([vehicleDto]);
                this.setState({ isLoading: false });
            }, 1500);
          } else {
            response = await api.addVehicle(applicationId, vehicleDto);
            
            vehicleDto.personId = response.vehicleId;
            setTimeout(() => {
              this.setState({ successMessage: 'Successful!'});
              this.setState((prevState) => ({
                vehicles: [...prevState.vehicles, vehicleDto],
                currentVehicle: { make: '', model: '', year: '', vin: '' },
                isAddingVehicle: false,
                isLoading: false 
              }));
            }, 1500);
          }

        } catch(err) {
          setTimeout(() => {
            this.setState({ error: 'Failed!', isLoading: false });
          }, 1500);
        }
      }
  };

  handleAddAnotherVehicle = () => {
    this.setState({ isAddingVehicle: true, isLoading: false,  error: null, successMessage: null });
  };

  handleCancel = () => {
    const { skipToFinalStep } = this.state;
    if (skipToFinalStep) {
      this.props.onNextStep();
    } else {
      this.setState(() => ({
        currentVehicle: { make: '', model: '', year: '', vin: '', vehicleId: '' },
        isAddingVehicle: false,
        isLoading: false, error: null, successMessage: null
      }));
    }
  };

  handleNext = async () => {
    const { vehicles } = this.state;
    this.props.onFormSubmit(vehicles);
  };

  render() {
    const { vehicles, currentVehicle, isEditing, isAddingVehicle, skipToFinalStep, isLoading, error, successMessage } = this.state;
    const isValidYear = this.validateYear(currentVehicle.year);
    const isComplete = currentVehicle.make && currentVehicle.model && currentVehicle.year && currentVehicle.vin ? true : false;

    return (<div className={styles.formContainer}>
        {isAddingVehicle && (
          <form onSubmit={this.handleSaveVehicle}>
            <h3>New Vehicle</h3>
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
                id="year"
                name="year"
                value={currentVehicle.year}
                onChange={this.handleInputChange}
            />
            </label>
            {(currentVehicle.year && !isValidYear) && <p className={styles.errorMessage}>year must be between 1985 and {new Date().getFullYear() + 1}</p>}
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

            {error && <div className={styles.errorMessage}>{error}</div>}
            {successMessage && <div className={styles.responseMessage}>{successMessage}</div>}

            <button
              type="submit"
              className={styles.button}
              disabled={!isComplete || !isValidYear || isLoading}
            >
              {isLoading ? 'Processing...' : (isEditing ? "Update" : "Save")}
            </button>
          </form>
        )}
        {(!isAddingVehicle && vehicles.length < 3) &&(
          <button type="button" className={styles.button} onClick={this.handleAddAnotherVehicle}>
            Add Another Vehicle
          </button>
        )}
        {((isAddingVehicle && vehicles.length > 0) || skipToFinalStep) && (
          <button type="button" disabled={isLoading} className={`${styles.button} ${styles.cancel}`} onClick={this.handleCancel}>
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
