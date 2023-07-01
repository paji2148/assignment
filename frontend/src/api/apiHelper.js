// api.js

const API_BASE_URL = 'http://localhost:3000';

export const createInsuranceApplication = async (createDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/insurance-application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createDto),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create insurance application');
  }
};

export const getInsuranceApplication = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/insurance-application?id=${applicationId}`, {
      method: 'GET'
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create insurance application');
  }
};

export const updateInsuranceApplication = async (applicationId, updateDto) => {
    try {
      const response = await fetch(`${API_BASE_URL}/insurance-application/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDto),
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create insurance application');
    }
  };

export const addPerson = async (applicationId, personDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/insurance-application/${applicationId}/person`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personDto),
    });
    const data = await response.json();
    // throw new Error('Failed to add person');
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add person');
  }
};

export const addVehicle = async (applicationId, vehicleDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/insurance-application/${applicationId}/vehicle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleDto),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add vehicle');
  }
};

export const updatePerson = async (applicationId, personId, personDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/insurance-application/${applicationId}/person/${personId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personDto),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update person');
  }
};

export const updateVehicle = async (applicationId, vehicleId, dto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/insurance-application/${applicationId}/vehicle/${vehicleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update vehicle');
  }
};

export const deletePerson = async (applicationId, personId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/insurance-application/${applicationId}/person/${personId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update person');
  }
};

export const deleteVehicle = async (applicationId, vehicleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/insurance-application/${applicationId}/vehicle/${vehicleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update vehicle');
  }
};

export const deleteInsuranceApplication = async (applicationId, vehicleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/insurance-application/${applicationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete application');
  }
};

export const submitInsuranceApplication = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/insurance-application/${applicationId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed');
  }
};

export default {
  createInsuranceApplication,
  getInsuranceApplication,
  updateInsuranceApplication,
  addPerson,
  addVehicle,
  updatePerson,
  updateVehicle,
  deletePerson,
  deleteVehicle,
  deleteInsuranceApplication,
  submitInsuranceApplication
};
