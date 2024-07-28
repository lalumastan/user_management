
package icsdiscover.bean;

import icsdiscover.model.Users;

public class UserToken implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String token;
	private String username;
	private String firstName;
	private String lastName;
	private String authorities;
	
	public UserToken(String token, Users users) {
		super();
		this.token = token;
		this.username = users.getUsername();
		this.firstName = users.getFirstName();
		this.lastName = users.getLastName();
		this.authorities = users.getAuthorities();
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstName() {
		return this.firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return this.lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getAuthorities() {
		return authorities;
	}

	public void setAuthorities(String authorities) {
		this.authorities = authorities;
	}

	@Override
	public String toString() {
		return "UserToken [token=" + token + ", username=" + username + ", firstName=" + firstName + ", lastName="
				+ lastName + ", authorities=" + authorities + "]";
	}
}