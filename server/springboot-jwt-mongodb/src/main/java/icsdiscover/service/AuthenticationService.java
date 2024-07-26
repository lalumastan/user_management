package icsdiscover.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import icsdiscover.model.Users;
import icsdiscover.repository.UserRepository;

@Service
public class AuthenticationService {	
	@Autowired
    private UserRepository userRepository;	
	
	@Autowired
    private AuthenticationManager authenticationManager;
	
	@Autowired
    private PasswordEncoder passwordEncoder;	

    public Users login(Users users) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                users.getUsername(),
                users.getPassword()
            )
        );

        return userRepository.findUserByUsername(users.getUsername());
    }
    
    public Users signup(Users users) {
        String password = users.getPassword();
        try {
        	passwordEncoder.upgradeEncoding(password);
        }
        catch(Exception e) {
        	users.setPassword(passwordEncoder.encode(password));
        }

        return userRepository.save(users);
    }    
}
