import React, { useState } from "react";
import Template1 from "./Templates/Template1";
import Template2 from "./Templates/Template2";
import Template3 from "./Templates/Template3";
import "./adtemplate.css"; // Add borders, selected highlight, etc.

const templates = [
  { id: 1, name: "Template 1", component: Template1 },
  { id: 2, name: "Template 2", component: Template2 },
  { id: 3, name: "Template 3", component: Template3 },
];

const AdTemplateSelector = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [formData, setFormData] = useState({
    title: "Big Sale Coming Soon!",
    description: "Don't miss out on our special discounts.",
    image: "https://via.placeholder.com/300x150",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const SelectedTemplateComponent = templates.find(t => t.id === selectedId).component;

  return (
    <div>
      <h2>Select an Ad Template</h2>
      <div style={{ display: "flex", gap: "15px" }}>
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            style={{
              padding: "10px 20px",
              border: tpl.id === selectedId ? "2px solid green" : "1px solid gray",
            }}
            onClick={() => setSelectedId(tpl.id)}
          >
            {tpl.name}
          </button>
        ))}
      </div>

      <h3 style={{ marginTop: "20px" }}>Edit Ad Content</h3>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          placeholder="Ad Title"
          value={formData.title}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <textarea
          name="description"
          placeholder="Ad Description"
          value={formData.description}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
      </div>

      <h3>Live Preview</h3>
      <div style={{ border: "1px solid #ddd", padding: "20px", maxWidth: "500px" }}>
        <SelectedTemplateComponent data={formData} />
      </div>
    </div>
  );
};

export default AdTemplateSelector;