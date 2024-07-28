package icsdiscover.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import icsdiscover.model.Users;
import icsdiscover.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {
	
	@Autowired
    private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Users users = getUser(username);
		return new org.springframework.security.core.userdetails.User(users.getUsername(), users.getPassword(), Arrays.stream(users.getAuthorities().split(",")).map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
	}

    public List<Users> getAllUsers() {
        List<Users> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }
    
    public Users getUser(String username) {
    	return userRepository.findById(username).orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
    
    public void deleteUser(Users users) {
    	userRepository.delete(users);
    }    
}
