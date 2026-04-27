package com.misalud.misalud_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*
@EnableScheduling
@EnableTransactionManagement
*/
@SpringBootApplication
public class MisaludApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MisaludApiApplication.class, args);
	}

}
