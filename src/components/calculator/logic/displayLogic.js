const displayLogic = (total, next, operation) => {
  let expression = ''
  let result = '0'

  if (total && operation && next) {
    expression = `${total} ${operation} ${next}`
    result = next
  } else if (total && operation) {
    expression = `${total} ${operation}`
    result = total
  } else if (next) {
    expression = ''
    result = next
  } else if (total) {
    result = total
  }

  return { expression, result }
}

export default displayLogic
