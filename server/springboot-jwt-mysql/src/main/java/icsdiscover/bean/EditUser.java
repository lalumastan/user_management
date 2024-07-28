
package icsdiscover.bean;

import icsdiscover.model.Users;

public class EditUser implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer _id;
	private String username;
	private String password;
	private String firstName;
	private String lastName;
	private int age;
	private Double salary;
	private String authorities;
	
	public EditUser(Users users) {
		super();
		this._id = users.get_id();
		this.username = users.getUsername();
		this.password = users.getPassword();
		this.firstName = users.getFirstName();
		this.lastName = users.getLastName();
		this.age = users.getAge();
		this.salary = users.getSalary();
		this.authorities = users.getAuthorities();
	}

	public Integer get_id() {
		return _id;
	}

	public void set_id(Integer _id) {
		this._id = _id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public Double getSalary() {
		return salary;
	}

	public void setSalary(Double salary) {
		this.salary = salary;
	}

	public String getAuthorities() {
		return authorities;
	}

	public void setAuthorities(String authorities) {
		this.authorities = authorities;
	}

	@Override
	public String toString() {
		return "EditUser [_id=" + _id + ", username=" + username + ", password=" + password + ", firstName=" + firstName
				+ ", lastName=" + lastName + ", age=" + age + ", salary=" + salary + ", authorities=" + authorities
				+ "]";
	}
	
}