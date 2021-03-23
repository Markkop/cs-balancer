/**
 * @typedef CustomerSuccess
 * @property {number} id
 * @property {number} score
 */

/**
 * @typedef CustomerSuccessWithCustomers
 * @property {number} id
 * @property {number} score
 * @property {Customer[]} customers
 */

/**
 * @typedef Customer
 * @property {number} id
 * @property {number} score
 */

/**
 * A High Order Function to check if the customer has a matching score
 * against a Customer Success and if it haven't been matched yet.
 *
 * @param {CustomerSuccess} cs
 * @param {Customer[]} alreadyMatchedCustomers
 * @returns {(customer:Customer) => boolean}
 */
function isMatchingCustomer (cs, alreadyMatchedCustomers) {
  return customer => {
    const hasMatchingScore = customer.score <= cs.score
    const isAlreadyMatched = alreadyMatchedCustomers.includes(customer.id)
    const isMatched = !isAlreadyMatched && hasMatchingScore
    if (isMatched) {
      alreadyMatchedCustomers.push(customer.id)
    }
    return isMatched
  }
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

  const cssAvailable = cssOrderedByScore.filter(cs => {
    return !cssAway.some(csAway => cs.id === csAway)
  })

  const alreadyMatchedCustomers = []
  const cssWithCustomers = cssAvailable.map(cs => {
    const csCustomers = customers.filter(isMatchingCustomer(cs, alreadyMatchedCustomers))
    cs.customers = csCustomers
    return cs
  })

  const csWithMostCustomers = cssWithCustomers.reduce((overloadedCs, cs) => {
    const currentCustomersLength = cs.customers.length
    const overloadedCustomersLength = overloadedCs.customers.length
    return currentCustomersLength > overloadedCustomersLength ? cs : overloadedCs
  }, cssWithCustomers[0])

  const hasTwoOrMoreCssSharingTheSameFate = cssWithCustomers.some(({ id, customers }) => {
    const isSameCs = id === csWithMostCustomers.id
    const hasSameNumberOfCustomers = csWithMostCustomers.customers.length === customers.length
    return !isSameCs && hasSameNumberOfCustomers
  })

  return hasTwoOrMoreCssSharingTheSameFate ? 0 : csWithMostCustomers.id
}
