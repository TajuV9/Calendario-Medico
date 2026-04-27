package com.misalud.misalud_api.util;

public class Tools {
	
	public static String setNull(String dataPoint) {
		return dataPoint.isBlank() ? null : dataPoint;
	}
	
	public static String fixDataPoint(String dataPoint) {
		if(dataPoint != null) {
			dataPoint = dataPoint.trim();
		    String fixed = dataPoint;
		    if (dataPoint.length() > 1) {
		        char firstNameLetter = Character.toUpperCase(dataPoint.charAt(0));
		        String restNameLetters = dataPoint.substring(1).toLowerCase();
		        fixed = firstNameLetter + restNameLetters;
		    }
		    return fixed;
		}
		return null;
	}
	
	public static Integer fixDataPoint(Integer dataPoint) {
		String number = String.valueOf(dataPoint);
		if(number.isBlank()) {
			return null;
		}
		char caracter;
		for(int i = 0; i < number.length(); i++) {
			caracter = number.charAt(i);
			if(!Character.isDigit(caracter)) {
				return null;
			}
		}
		return dataPoint;
	}
}
