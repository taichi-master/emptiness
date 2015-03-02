TESTS += test/*.test.js

testall:
	@mocha \
	--ui exports \
	--reporter list \
	--slow 2000ms \
	--bail \
	$(TESTS)

.PHONY: testall