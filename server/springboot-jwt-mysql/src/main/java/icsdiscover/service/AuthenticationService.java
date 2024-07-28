package icsdiscover.service;

import java.util.Date;

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
    private PasswordEncoder passwordEncoder;
	
	@Autowired
    private AuthenticationManager authenticationManager;

    public Users signup(Users users) {
        String name = users.getFirstName() + " " + users.getLastName();
        Date now = new Date();
        String password = users.getPassword();
        try {
        	passwordEncoder.upgradeEncoding(password);
        }
        catch(Exception e) {
        	users.setPassword(passwordEncoder.encode(password));
        }
        users.setCreatedBy(name);
        users.setCreatedDate(now);        
        users.setLastUpdatedBy(name);
        users.setLastUpdatedDate(now);

        return userRepository.save(users);
    }

    public Users authenticate(Users users) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                users.getUsername(),
                users.getPassword()
            )
        );

        return userRepository.findById(users.getUsername()).orElseThrow();
    }
}
