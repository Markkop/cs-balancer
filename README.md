# :sparkles: Customer Success Balancing

[![Node.js CI](https://github.com/Markkop/cs-balancer/actions/workflows/node.js.yml/badge.svg)](https://github.com/Markkop/cs-balancer/actions/workflows/node.js.yml)
[![Ruby](https://github.com/Markkop/cs-balancer/actions/workflows/ruby.yml/badge.svg)](https://github.com/Markkop/cs-balancer/actions/workflows/ruby.yml)

This project is part of a challenge which I had to make a Ruby implementation that assigns and gets the ID of the Customer Success person with the highest number of customers.

### Requisites

The requisites are available in Portuguese at the other README file in this project.

### Progress History

When I first started this challenge, I had no idea on how to code in Ruby. I've participated in a few Ruby community meetups in the past, but all I knew was that it's not a super popular language and most of what's done in Ruby is using Rails.  

So I wanted to approach this problem within my JavaScript domain. I've created the node folder, replicated the tests from the Ruby file using Jest and in a few pomodoros I had the code implemented with the tests passing.  

Then I translated the JS code to Ruby by googling a lot. Its syntax reminds me Python, but it seems to have a lot of cool Sugar Syntax like JavaScript such as `select`, `reject`, `reduce`, `map` and so on. I really like these.  

Eventually I managed to make all Ruby tests pass, except one: the performance test. My algorithm had a complexity of O(nxm) which I didn't bother until the test fails, and I even had it fixed by considering the minimum values for one of the parameters informed in the challenge proposal.

Specifically, it'll work if you [make one of the loops skip if a Customer Success has a score value of 0](https://github.com/Markkop/cs-balancer/commit/1128b770b79c833870450c56a26eb5a7838bf580), since they can only have scores bigger than 0 and lower than 10.000. However, that's not actually solving the performance problem which was clearly the goal of that test.  

By thinking and searching for a while, I've tried another approach in which we order both CS and Customer list by score and match them with only* one iteration.  
*not really one since we have a `while` in there to consider some edge cases - which made me to create an extra test case.

So, after implementing it and applying a bit of refactor, I've replicated the same strategy to the Node version.  

Finally, since I had tests for both languages, it looked cool to have a little green checkmark by the side of my commits indicating that all tests were passing, so I've added some GitHub Actions to the project.

### Learnings

This challenge was pretty mind-blowing not only because I had a first real contact with Ruby, but also because I've managed to optimize a code using an approach I've never used before.
