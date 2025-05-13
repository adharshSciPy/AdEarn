const Template3 = ({ data }) => (
  <div className="template-box">
    <h3>{data.title}</h3>
    <p>{data.description}</p>
    <img src={data.image} alt="Ad" />
  </div>
);
export default Template3