import CustomerSuccessBalancing from '../src'

/**
 * @typedef Entity Customer/CS
 * @property {number} id
 * @property {number} score
 */

/**
 * Map a score array to a Customer or CS array
 * with IDs as increasing indexes.
 *
 * @param {number[]} scores
 * @returns {Entity[]}
 */
function mapScoresToEntities (scores) {
  return scores.map((score, index) => ({
    id: index + 1,
    score
  }))
}

describe('CustomerSuccessBalancing', () => {
  it('Test Scenario One', () => {
    const css = [
      { id: 1, score: 60 },
      { id: 2, score: 20 },
      { id: 3, score: 95 },
      { id: 4, score: 75 }
    ]
    const customers = [
      { id: 1, score: 90 },
      { id: 2, score: 20 },
      { id: 3, score: 70 },
      { id: 4, score: 40 },
      { id: 5, score: 60 },
      { id: 6, score: 10 }
    ]
    const cssAway = [2, 4]

    const balancer = CustomerSuccessBalancing(css, customers, cssAway)
    expect(balancer).toEqual(1)
  })

  it('Test Scenario Two', () => {
    const css = mapScoresToEntities([11, 21, 31, 3, 4, 5])
    const customers = mapScoresToEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
    const cssAway = []

    const balancer = CustomerSuccessBalancing(css, customers, cssAway)
    expect(balancer).toEqual(0)
  })

  it('Test Scenario Three', async () => {
    const csScores = Array(1000).fill(0)
    csScores[998] = 100
    const customersScores = Array(10000).fill(10)

    const startTime = new Date()
    const css = mapScoresToEntities(csScores)
    const customers = mapScoresToEntities(customersScores)
    const balancer = CustomerSuccessBalancing(css, customers, [1000])
    expect(balancer).toEqual(999)

    const milisecondsSinceStart = new Date() - startTime
    expect(milisecondsSinceStart).toBeLessThan(1000)
  })

  it('Test Scenario Four', () => {
    const css = mapScoresToEntities([1, 2, 3, 4, 5, 6])
    const customers = mapScoresToEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
    const balancer = CustomerSuccessBalancing(css, customers, [])
    expect(balancer).toEqual(0)
  })

  it('Test Scenario Five', () => {
    const css = mapScoresToEntities([100, 2, 3, 3, 4, 5])
    const customers = mapScoresToEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
    const balancer = CustomerSuccessBalancing(css, customers, [])
    expect(balancer).toEqual(1)
  })

  it('Test Scenario Six', () => {
    const css = mapScoresToEntities([100, 99, 88, 3, 4, 5])
    const customers = mapScoresToEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
    const cssAway = [1, 3, 2]
    const balancer = CustomerSuccessBalancing(css, customers, cssAway)
    expect(balancer).toEqual(0)
  })

  it('Test Scenario Seven', () => {
    const css = mapScoresToEntities([100, 99, 88, 3, 4, 5])
    const customers = mapScoresToEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
    const cssAway = [4, 5, 6]
    const balancer = CustomerSuccessBalancing(css, customers, cssAway)
    expect(balancer).toEqual(3)
  })
})
