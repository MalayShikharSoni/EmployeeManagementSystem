import React, { useState } from "react";

const NameForm = () => {
  const [name, setName] = useState("");

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setName(inputValue);
    console.log(inputValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log(name); // Log the name to the console
    setName(""); // Clear the input field
  };

  return (
    <div style={{ margin: "20px" }}>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label htmlFor="name" style={{ display: "block", marginBottom: "8px" }}>
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleChange}
          style={{
            padding: "8px",
            width: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </form>
    </div>
  );
};

export default NameForm;
