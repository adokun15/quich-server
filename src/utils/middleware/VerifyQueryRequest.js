import ValidationError from "../error/ValidationError.js";

//All query
export const ValidateQueryMiddleWare = (req, res, next) => {
  const error = [];

  if (!req.query) {
    next();
  }

  //Limit field
  if (req.query["limit"] && Number(req.query["limit"]) < 1) {
    error.push({
      field: "limit",
      message: "Invalid parameter value",
    });
  }

  if (req.query["limit"] && Number(req.query["limit"]) > 100) {
    error.push({
      field: "limit",
      message: "This parameter can not exceed more than 100",
    });
  }

  //Page: Offset
  if (req.query["page"] && Number(req.query["page"]) < 1) {
    error.push({
      field: "page",
      message: "This parameter can not be less than 1.",
    });
  }

  //ORDER BY; created_at, name
  if (
    req.query["sort"] &&
    req.query["sort"] != "created_at" &&
    req.query["sort"] != "name" &&
    req.query["sort"] != ""
  ) {
    error.push({
      field: "sort",
      message: "This parameter invoked doesn't exist.",
    });
  }

  //DIRECTION: Desc || Asc
  if (
    req.query["sort_by"] &&
    req.query["sort_by"]?.toLowerCase() != "asc" &&
    req.query["sort_by"]?.toLowerCase() != "desc"
  ) {
    error.push({
      field: "sort_by",
      message: "Invalid sort parameter value.",
    });
  }
  if (error.length > 0) {
    throw new ValidationError("Something went wrong!", 400, error);
  } else {
    next();
  }
};
