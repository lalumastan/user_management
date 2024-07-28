package icsdiscover.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import icsdiscover.bean.UserToken;
import icsdiscover.model.Users;
import icsdiscover.response.ResponseMessage;
import icsdiscover.service.AuthenticationService;
import icsdiscover.service.JwtService;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
	
	@Autowired
    private JwtService jwtService;
	
	@Autowired
    private AuthenticationService authenticationService;
	
    @Autowired
    private UserDetailsService userDetailsService;	

    @PostMapping("/login")
    public ResponseMessage<UserToken> authenticate(@RequestBody Users users) {
        Users authenticatedUser = authenticationService.authenticate(users);

        String jwtToken = jwtService.generateToken(authenticatedUser);        

        return new ResponseMessage<UserToken>(HttpStatus.OK.value(), "success", new UserToken(jwtToken, authenticatedUser));
    }
        
    @GetMapping("/logout")
    public ResponseMessage<String> logout(@RequestHeader (name="Authorization") String authHeader) {
		final String jwt = authHeader.substring(7);
		final String username = jwtService.extractUsername(jwt);
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    	String message = "Error Logging Out: " + username;
		if (username != null && authentication != null) {
			UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

			if (jwtService.isTokenValid(jwt, userDetails)) {
			   message = "User logged out successfully.";
			}
		}        

        return new ResponseMessage<String>(HttpStatus.OK.value(), message, username);
    }    
}