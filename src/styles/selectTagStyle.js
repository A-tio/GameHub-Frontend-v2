
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      color: 'green',
    }),
    input: (provided) => ({
      ...provided,
      color: 'greenyellow', // Change search input text color to red
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'black' : 'black',
      color: state.isSelected ? 'green' : 'white',
    }),
    singleValue: (provided) => ({
    ...provided,
    color: "green", // Change the text color
    fontWeight: "bold", // Make the text bold
  }),
  };

  export default customStyles