/**
 * @typedef CustomerSuccess
 * @property {number} id
 * @property {number} score
 * @property {Customer[]} [customers]
 */

/**
 * @typedef Customer
 * @property {number} id
 * @property {number} score
 */

/**
 * Match Customer and CS by score.
 *
 * @param {Customer} customer
 * @param {CustomerSuccess} cs
 * @returns {boolean}
 */
function matchScore (customer, cs) {
  return customer.score <= cs.score
}

/**
 * Push a customer to a CS object.
 *
 * @param {Customer} customer
 * @param {CustomerSuccess} cs
 * @returns {number}
 */
function addCustomerToCs (customer, cs) {
  return cs.customers.push(customer)
}

/**
 * Get the number of customers of a given CS.
 *
 * @param {CustomerSuccess} cs
 * @returns {number}
 */
function getCustomersNumber (cs) {
  return cs.customers.length
}

/**
 * Get the Customer Success ID with the highest number of customers.
 * If there are two or more CS withe the same number, returns 0.
 *
 * @param {CustomerSuccess[]} css
 * @param {Customer[]} customers
 * @param {number[]} cssAway
 * @returns {number}
 */
export default function CustomerSuccessBalancing (css, customers, cssAway) {
  const cssOrderedByScore = [...css].sort((a, b) => a.score - b.score)
  const customersOrderedByScore = [...customers].sort((a, b) => a.score - b.score)

  const cssAvailable = cssOrderedByScore.filter(cs => {
    return !cssAway.some(csAway => cs.id === csAway)
  })

  const cssWithCustomers = cssAvailable.map(cs => {
    cs.customers = []
    return cs
  })

  let csIndex = 0
  customersOrderedByScore.forEach(customer => {
    let cs = cssWithCustomers[csIndex]
    let isMatched = matchScore(customer, cs)

    if (isMatched) {
      addCustomerToCs(customer, cs)
      return
    }

    while (!isMatched) {
      const isLastCs = cssWithCustomers[cssWithCustomers.length - 1] === cs
      if (isLastCs) {
        break
      }

      csIndex += 1
      cs = cssWithCustomers[csIndex]
      isMatched = matchScore(customer, cs)
      if (isMatched) addCustomerToCs(customer, cs)
    }
  })

  const csWithMostCustomers = cssWithCustomers.reduce((overloadedCs, cs) => {
    const currentCustomersLength = getCustomersNumber(cs)
    const overloadedCustomersLength = getCustomersNumber(overloadedCs)
    return currentCustomersLength > overloadedCustomersLength ? cs : overloadedCs
  }, cssWithCustomers[0])

  const hasTwoOrMoreCssSharingTheSameFate = cssWithCustomers.some(({ id, customers }) => {
    const isSameCs = id === csWithMostCustomers.id
    const hasSameNumberOfCustomers = getCustomersNumber(csWithMostCustomers) === customers.length
    return !isSameCs && hasSameNumberOfCustomers
  })

  return hasTwoOrMoreCssSharingTheSameFate ? 0 : csWithMostCustomers.id
}
