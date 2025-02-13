const errorHandler = (err, req, res) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    res
      .status(error.statusCode || 500)
      .json({ success: "False", error: error.message || "Server Error" });
  } catch (error) {
    console.error("ErrorHandler", error);
  }
};

export default errorHandler;
