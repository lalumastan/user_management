package icsdiscover;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(classes = AuthApiApplication.class)
@TestPropertySource(locations="classpath:application.properties")
class AuthApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
