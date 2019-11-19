import { formatExecError } from "jest-message-util";

function getTermFilterValue(field, fieldValue) {
  // We do this because if the value is a boolean value, we need to apply
  // our filter differently. We're also only storing the string representation
  // of the boolean value, so we need to convert it to a Boolean.

  // TODO We need better approach for boolean values
  if (fieldValue === "false" || fieldValue === "true") {
    return { [field]: fieldValue === "true" };
  }

  return { [`${field}.keyword`]: fieldValue };
}

function getTermFilter(filter) {
  var strictQuery = "";
  if (filter.type === "any") {
    for (var f in filter.values) {
      strictQuery += filter.values[f]+"||" 
    }
    return strictQuery;
    
  }
  else {
    for (var f in filter.values) {
      strictQuery += filter.values[f]+"&&" 
    }
    return strictQuery;
  }
}

function getRangeFilter(filter) {
  if (filter.type === "any") {
    return {
      bool: {
        should: [
          filter.values.map(filterValue => ({
            range: {
              [filter.field]: {
                ...(filterValue.to && { lt: filterValue.to }),
                ...(filterValue.to && { gt: filterValue.from })
              }
            }
          }))
        ],
        minimum_should_match: 1
      }
    };
  } else if (filter.type === "all") {
    return {
      bool: {
        filter: [
          filter.values.map(filterValue => ({
            range: {
              [filter.field]: {
                ...(filterValue.to && { lt: filterValue.to }),
                ...(filterValue.to && { gt: filterValue.from })
              }
            }
          }))
        ]
      }
    };
  }
}

function getConfigFilter(filter) {

  return filter;
}

export default function buildRequestFilter(filters) {
  if (!filters) return;
  var filtersObj = {};
  filtersObj.config = {};
  filtersObj.strictQuery = {};
  for (var i in filters) {
    if (["entityType", "dataSource"].includes(filters[i].field)) {
      //return [...acc, getTermFilter(filter)];
      filtersObj["strictQuery"][filters[i].field] =  getTermFilter(filters[i]);
    }
    if (["tags"].includes(filters[i].field)) {
      //return [...acc, getTermFilter(filter)];
      filtersObj["strictQuery"][filters[i].field+".keyword"] =  getTermFilter(filters[i]);
    }
    // if (["acres", "visitors"].includes(filters[i].field)) {
    //   return getRangeFilter(filters[i]);
    // }
    if (["smart"].includes(filters[i].field)) {
      filtersObj.config[filters[i].field] = filters[i].values[0];
    }
  }
  if (!filtersObj.config.smart) {
    filtersObj.config.smart = false;
  }
  //if (filters.length < 1) return;
  console.log(filtersObj);
  return filtersObj;
}
