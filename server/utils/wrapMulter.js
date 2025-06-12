// to prevent server crashing from multer errors

const wrapMulter = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

export  {wrapMulter};
