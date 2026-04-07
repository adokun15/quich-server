export function ClauseExtractor({ updates, id = null }) {
  //Just the ["key = $1", "key =  $2"]
  const setClause = Object.keys(updates)
    .map((key, i) => `"${key}" = $${i + 1}`)
    .join(", ");

  //Just the [value1, value2]
  const values = Object.values(updates);

  //Just the [value1, value2, id]
  //Add Id As the Last value
  if (id) values.push(id);

  return {
    values,
    fields: Object.keys(updates),
    setClause,
    id: values.length,
  };
}
