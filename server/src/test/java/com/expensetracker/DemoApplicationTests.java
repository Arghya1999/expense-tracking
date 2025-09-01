package com.expensetracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {"expensetracker.app.jwtSecret=testsecret", "expensetracker.app.jwtExpirationMs=3600000"})
class DemoApplicationTests {

	@Test
	void contextLoads() {
	}

}
