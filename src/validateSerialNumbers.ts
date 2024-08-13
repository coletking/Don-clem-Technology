interface InternetHub{
    id: string;
    serial_number: string;
  };
  
  interface InternetHubData {
    comment: string;
    Internet_hubs: InternetHub[];
  };
  
  const internetHubs: InternetHubData = {
    comment: "Do NOT commit local changes to this file to source control",
    Internet_hubs: [
      { id: "men1", serial_number: "C25CTW00000000001470" },
      { id: "mn1", serial_number: "<serial number here>" },
      { id: "mn2", serial_number: "<serial number here>" },
      { id: "mn3", serial_number: "<serial number here>" },
      { id: "mn4", serial_number: "<serial number here>" },
      { id: "mn5", serial_number: "<serial number here>" },
      { id: "mn6", serial_number: "<serial number here>" },
      { id: "mn7", serial_number: "<serial number here>" },
      { id: "mn8", serial_number: "<serial number here>" },
      { id: "mn9", serial_number: "<serial number here>" }
    ]
  };
  
  function validateAndAssignSerialNumbers(data: InternetHubData): InternetHubData {
    const baseSerial = "C25CTW0000000000147";
    const ids = data.Internet_hubs.map(hub => hub.id).filter(id => id !== "men1");
    const serialNumbers = [...Array(9)].map((_, i) => baseSerial + (8 - i + 70));
  
    ids.forEach((id, index) => {
      const hub = data.Internet_hubs.find(hub => hub.id === id);
      if (hub) {
        hub.serial_number = serialNumbers[index];
      }
    });
  
    return data;
  }
  
  const updatedData = validateAndAssignSerialNumbers(internetHubs);
  console.log("Updated Data: ", updatedData);
  