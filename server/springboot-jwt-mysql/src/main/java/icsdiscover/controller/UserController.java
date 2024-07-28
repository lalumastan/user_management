package icsdiscover.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import icsdiscover.bean.EditUser;
import icsdiscover.model.Users;
import icsdiscover.repository.UserRepository;
import icsdiscover.response.ResponseMessage;
import icsdiscover.service.AuthenticationService;
import icsdiscover.service.UserService;

@RequestMapping("/users")
@RestController
public class UserController {
	
	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private UserService userService;
	
	@Autowired
    private AuthenticationService authenticationService;	

	@GetMapping("/{_id}")
	public ResponseMessage<EditUser> get(@PathVariable("_id") Integer _id) {        
        return new ResponseMessage<EditUser>(HttpStatus.OK.value(), "User fetched successfully.", new EditUser(userRepository.findUserById(_id)));
    }
	
	private ResponseMessage<Users> save(Users users, String successMessage) {
		String message = "User saving failed: ";
		HttpStatus status = HttpStatus.NOT_MODIFIED;
		
		try {
			users = authenticationService.signup(users);
			message = successMessage;
			status = HttpStatus.OK;
		} catch (Exception e) {
			message += e.getMessage();
		}
		
        return new ResponseMessage<Users>(status.value(), message, users);
	}
	
	@PostMapping("/add")
	public ResponseMessage<Users> add(@RequestBody Users users) {
        return save(users, "User added successfully.");
    }
	
	@PutMapping("/update")
	public ResponseMessage<Users> update(@RequestBody Users users) {
        return save(users, "User updated successfully.");
    }
    
	@DeleteMapping("/delete/{_id}")
	public ResponseMessage<String> delete(@PathVariable("_id") Integer _id) {
		String message = "";
		try {
			Users users = userRepository.findUserById(_id);
			userService.deleteUser(users);
			message = users.getFirstName() + " " + users.getLastName() + " (" + users.getUsername() + ") deleted successfully";            
		}
		catch(Exception e) {
			message = "Failed to delete " + _id + ": " + e.getMessage();
		}
		
		return new ResponseMessage<String>(HttpStatus.OK.value(), message, null);
    }   

    @GetMapping("/")
    public ResponseMessage<List<Users>> getAllUsers() {
        List <Users> users = userService.getAllUsers();

        return new ResponseMessage<List<Users>>(HttpStatus.OK.value(), "User list fetched successfully.", users);
    }
}
