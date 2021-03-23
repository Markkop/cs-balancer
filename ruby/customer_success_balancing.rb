require 'minitest/autorun'
require 'timeout'

class CustomerSuccessBalancing
  def initialize(customer_success, customers, customer_success_away)
    @customer_success = customer_success
    @customers = customers
    @customer_success_away = customer_success_away
  end

  # Returns the id of the CustomerSuccess with the most customers
  def execute
    css_ordered_by_score = @customer_success.sort { |a,b| a[:score] <=> b[:score] }
    css_available = css_ordered_by_score.reject { |cs|
      @customer_success_away.any? { |cs_away| cs[:id] == cs_away } 
    }  

    already_matched_customers = []
    css_with_customers = css_available.map do |cs| 
      cs_customers = @customers.select do |customer|
        has_matching_score = customer[:score] <= cs[:score]
        is_already_matched = already_matched_customers.include?(customer[:id])
        is_matched = !is_already_matched && has_matching_score
        if is_matched
          already_matched_customers.push(customer[:id])
        end
        is_matched
      end
      cs[:customers] = cs_customers
      cs
    end

    css_with_most_customers = css_with_customers.reduce(css_with_customers[0]) do |overloaded_cs, cs|
      current_customers_length = cs[:customers].length
      overloaded_customers_length = overloaded_cs[:customers].length
      current_customers_length > overloaded_customers_length ? cs : overloaded_cs
    end
    
    is_there_two_css_sharing_same_fate = css_with_customers.any? do |cs|
      is_same_cs = cs[:id] == css_with_most_customers[:id]
      has_same_customers_number = cs[:customers].length == css_with_most_customers[:customers].length
      !is_same_cs && has_same_customers_number
    end
    
    is_there_two_css_sharing_same_fate ? 0 : css_with_most_customers[:id]
  end
end

class CustomerSuccessBalancingTests < Minitest::Test
  def test_scenario_one
    css = [{ id: 1, score: 60 }, { id: 2, score: 20 }, { id: 3, score: 95 }, { id: 4, score: 75 }]
    customers = [{ id: 1, score: 90 }, { id: 2, score: 20 }, { id: 3, score: 70 }, { id: 4, score: 40 }, { id: 5, score: 60 }, { id: 6, score: 10}]

    balancer = CustomerSuccessBalancing.new(css, customers, [2, 4])
    assert_equal 1, balancer.execute
  end

  def test_scenario_two
    css = array_to_map([11, 21, 31, 3, 4, 5])
    customers = array_to_map( [10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
    balancer = CustomerSuccessBalancing.new(css, customers, [])
    assert_equal 0, balancer.execute
  end

  def test_scenario_three
    customer_success = Array.new(1000, 0)
    customer_success[998] = 100

    customers = Array.new(10000, 10)
    
    balancer = CustomerSuccessBalancing.new(array_to_map(customer_success), array_to_map(customers), [1000])

    result = Timeout.timeout(1.0) { balancer.execute }
    assert_equal 999, result
  end

  def test_scenario_four
    balancer = CustomerSuccessBalancing.new(array_to_map([1, 2, 3, 4, 5, 6]), array_to_map([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]), [])
    assert_equal 0, balancer.execute
  end

  def test_scenario_five
    balancer = CustomerSuccessBalancing.new(array_to_map([100, 2, 3, 3, 4, 5]), array_to_map([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]), [])
    assert_equal balancer.execute, 1
  end

  def test_scenario_six
    balancer = CustomerSuccessBalancing.new(array_to_map([100, 99, 88, 3, 4, 5]), array_to_map([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]), [1, 3, 2])
    assert_equal balancer.execute, 0
  end

  def test_scenario_seven
    balancer = CustomerSuccessBalancing.new(array_to_map([100, 99, 88, 3, 4, 5]), array_to_map([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]), [4, 5, 6])
    assert_equal balancer.execute, 3
  end

  def array_to_map(arr)
    out = []
    arr.each_with_index { |score, index| out.push({ id: index + 1, score: score }) }
    out
  end
end

Minitest.run