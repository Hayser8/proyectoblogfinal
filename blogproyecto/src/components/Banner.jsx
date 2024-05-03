import PropTypes from "prop-types";
function Banner({ imageUrl }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        marginBottom: "20px",
      }}
    >
      <img
        src={imageUrl}
        alt="Banner"
        style={{
          height: "600px",
          width: "100%",
          display: "block",
          filter: "blur(0)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          width: "40%",
          height: "100%",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <h1>Sumérgete en el Fútbol</h1>
        <p>
          En <strong>FT | Fútbol Total</strong>,{" "}
          <strong>comenta y analiza</strong> los grandes momentos futbolísticos.
        </p>
        <p>
          <strong>¡Continúa tu pasión!</strong>
        </p>
      </div>
    </div>
  );
}

Banner.propTypes = {
  imageUrl: PropTypes.string.isRequired
};

export default Banner;
