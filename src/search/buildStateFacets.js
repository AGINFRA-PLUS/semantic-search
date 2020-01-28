function getValueFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations['sterms#'+fieldName] &&
    aggregations['sterms#'+fieldName].buckets &&
    aggregations['sterms#'+fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: "value",
        data: aggregations['sterms#'+fieldName].buckets.map(bucket => ({
          // Boolean values and date values require using `key_as_string`
          value: bucket.key_as_string || bucket.key,
          count: bucket.doc_count
        }))
      }
    ];
  }
}

function getRangeFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: "range",
        data: aggregations[fieldName].buckets.map(bucket => ({
          // Boolean values and date values require using `key_as_string`
          value: {
            to: bucket.to,
            from: bucket.from,
            name: bucket.key
          },
          count: bucket.doc_count
        }))
      }
    ];
  }
}

function getSearchAPIconfig( configValue, fieldName ) {
  // alert(configValue);
}

export default function buildStateFacets(aggregations, maxScore) {
  //alert((maxScore == null));
  const smart = getSearchAPIconfig(
    (maxScore == undefined),
    "smart"
  )
  const tags = getValueFacet(
    aggregations,
    "tags"
  );
  const entityType = getValueFacet(
    aggregations,
    "entityType"
  );
  const source = getValueFacet(
    aggregations,
    "source"
  );
  const organization = getValueFacet(
    aggregations,
    "organization"
  );
  const facets = {
    ...(tags && { tags }),
    ...(entityType && { entityType }),
    ...(source && { source }),
    ...(organization && { organization }),
    ...(smart && { smart })
  };
  if (Object.keys(facets).length > 0) {
    return facets;
  }
}
