import React, { useState } from "react";

const NameForm: React.FC = () => {
  const [name, setName] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { setName(event.target.value); console.log(event.target.value); };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); console.log(name); setName(""); };

  return (
    <div style={{ margin: "20px" }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" style={{ display: "block", marginBottom: "8px" }}>Name:</label>
        <input type="text" id="name" value={name} onChange={handleChange}
          style={{ padding: "8px", width: "300px", borderRadius: "4px", border: "1px solid #ccc" }} />
      </form>
    </div>
  );
};

export default NameForm;
