import React, { Component } from 'react';
import styles from './AppStyles.module.scss';
import api from '../api/apiHelper';


class VehicleInfoForm extends Component {
  constructor(props) {
    super(props);
    const initialVehicle = props.vehicle || { make: 'eee', model: 'eee', year: 2002, vin: '2222'};
    this.state = {
        vehicles: props.vehicles || [],
        currentVehicle: initialVehicle,
        applicationId: props.applicationId,
        isEditing: props.isEditing || false,
        skipToFinalStep: props.skipToFinalStep || false,
        isAddingVehicle: true,
        isLoading: false,
        responseMessage: null,
    };
  }

  validateYear = (year) => {
    const currentYear = new Date().getFullYear();
    return year >= 1985 && year <= currentYear + 1;
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    const { currentVehicle, isEditing, skipToFinalStep } = this.state;
    if (name === "year") {
      if (value.length > 4) {
        return; // Don't update the state if it's not a number or more than 4 digits
      }
    }
    this.setState((prevState) => ({
      currentVehicle: { ...prevState.currentVehicle, [name]: value },
    }));
  };

  handleSaveVehicle = async (e) => {

    e.preventDefault();
    this.setState({ isLoading: true, responseMessage: null });
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
            response = await api.updateVehicle(applicationId, currentVehicle.vehicleId, vehicleDto)
            this.setState({ responseMessage: 'Successful!'});
            setTimeout(() => {
              this.props.onFormSubmit(currentVehicle);
              this.setState({ isLoading: false });
            }, 2000);
          }else if (skipToFinalStep) {
            response = await api.addVehicle(applicationId, vehicleDto)
            vehicleDto.vehicleId  = response.vehicleId;
            this.setState({ responseMessage: 'Successful!'});
            setTimeout(() => {
              this.props.onFormSubmit([vehicleDto]);
              this.setState({ isLoading: false });
            }, 2000);
            console.log(vehicleDto, 'id of v')
              this.props.onFormSubmit([vehicleDto]);
          } else {
            response = await api.addVehicle(applicationId, vehicleDto);
            vehicleDto.personId = response.vehicleId
            this.setState({ responseMessage: 'Successful!'});
            setTimeout(() => {
              this.setState((prevState) => ({
                vehicles: [...prevState.vehicles, vehicleDto],
                currentVehicle: { make: '', model: '', year: '', vin: '' },
                isAddingVehicle: false,
                isLoading: false 
              }));
            }, 2000);
            console.log('vehicle dto', vehicleDto)
          }

        } catch(err) {
          console.error(error);
        this.setState({ responseMessage: 'Failed to submit!', isLoading: false });
        }
      }
  };

  handleAddAnotherVehicle = () => {
    this.setState({ isAddingVehicle: true, isLoading: false, responseMessage: null });
  };

  handleCancel = () => {
    const { skipToFinalStep } = this.state;
    if (skipToFinalStep) {
      this.props.onNextStep();
    } else {
      this.setState((prevState) => ({
        currentVehicle: { make: '', model: '', year: '', vin: '', vehicleId: '' },
        isAddingVehicle: false,
        isLoading: false, responseMessage: null
      }));
    }
  };

  handleNext = async () => {
    const { vehicles } = this.state;
    this.props.onFormSubmit(vehicles);
  };

  render() {
    console.log(this.state, 'hghhhh');
    const { vehicles, currentVehicle, isEditing, isAddingVehicle, skipToFinalStep, isLoading, responseMessage } = this.state;
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
            {!isValidYear && <p className={styles.errorMessage}>year must be between 1985 and {new Date().getFullYear() + 1}</p>}
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

            {responseMessage && <div className={styles.responseMessage}>{responseMessage}</div>}

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
